import { spawnSync } from 'node:child_process'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { readProvenance, sha256, writeAtomic } from './provenance'

// Pages cite Iroha source at the pinned commit. `pnpm refresh:iroha` moves the pin and the generated
// references; the citations move here, once the pages that make them have been checked against the
// new pin, because a citation restates the page's claims at that commit.

/** A link into the Iroha repository at a fixed commit: `…/blob/<commit>/<path>` or `…/tree/<commit>[/<path>]`. */
const CITATION =
  /https:\/\/github\.com\/hyperledger-iroha\/iroha\/(?:blob|tree)\/([0-9a-f]{40})(?:\/([^\s)\]<>"'`#?]*))?/gu

const PAGES_ROOT = 'src'
/** Generated snippets and public assets under `src/` follow `pnpm refresh:iroha`, not this command. */
const GENERATED_DIRECTORIES = new Set(['snippets', 'public'])
/** The translation memory pairs English lines, citations included, with their fixed translations. */
export const TRANSLATION_MEMORY = 'etc/translate.ts'

const FRONTMATTER = /^---\n([\s\S]*?)\n---\n/u
const SOURCE_HASH = /^translation_source_hash: *"?([0-9a-f]{64})"? *$/mu

export interface CitationDependencies {
  /** Whether the Iroha checkout contains `commit`. */
  commitExists(commit: string): boolean
  /** Whether `relativePath` names a file or directory in the Iroha tree at `commit`. */
  pathExists(commit: string, relativePath: string): boolean
}

export interface CitationReport {
  commit: string
  /** The commits whose citations moved to `commit`. */
  movedFrom: string[]
  /** Each changed file and how many citations in it moved. */
  files: Array<{ file: string; citations: number }>
  /** Translations whose source hash followed their English page because they were current before. */
  hashesUpdated: number
  /** Translations that were already behind their English page; they stay marked stale. */
  staleTranslations: string[]
}

function frontmatterField(text: string, field: string): string | undefined {
  const block = FRONTMATTER.exec(text)?.[1]
  const value = block?.match(new RegExp(`^${field}: *(.+?) *$`, 'mu'))?.[1]
  return value?.replace(/^(["'])(.*)\1$/u, '$2')
}

function withSourceHash(text: string, hash: string): string {
  const match = FRONTMATTER.exec(text)
  if (!match) return text
  const block = match[1].replace(SOURCE_HASH, `translation_source_hash: ${hash}`)
  return `---\n${block}\n---\n${text.slice(match[0].length)}`
}

function decodePath(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

async function markdownPages(repositoryRoot: string): Promise<string[]> {
  const pages: string[] = []
  async function walk(relative: string) {
    for (const entry of await readdir(path.join(repositoryRoot, relative), { withFileTypes: true })) {
      const child = `${relative}/${entry.name}`
      if (entry.isDirectory()) {
        if (!(relative === PAGES_ROOT && GENERATED_DIRECTORIES.has(entry.name))) await walk(child)
      } else if (entry.isFile() && entry.name.endsWith('.md')) pages.push(child)
    }
  }
  await walk(PAGES_ROOT)
  return pages.sort()
}

/**
 * Moves every Iroha source citation in the pages and the translation memory to the pinned commit.
 * Nothing is written unless every cited path exists at the pin. A translation's source hash follows
 * its English page only when the translation matched that page before the move.
 */
export async function moveIrohaCitations(
  repositoryRoot: string,
  dependencies: CitationDependencies,
): Promise<CitationReport> {
  const { commit } = (await readProvenance(repositoryRoot)).source
  if (!dependencies.commitExists(commit))
    throw new Error(`The Iroha checkout does not contain the pinned commit ${commit}`)

  const sources = new Map<string, string>()
  for (const file of [...(await markdownPages(repositoryRoot)), TRANSLATION_MEMORY]) {
    sources.set(file, await readFile(path.join(repositoryRoot, file), 'utf8'))
  }
  const isTranslation = (file: string) => frontmatterField(sources.get(file) ?? '', 'translation_source') !== undefined

  const stale = new Set<string>()
  const citedPaths = new Map<string, string[]>()
  for (const [file, text] of sources) {
    for (const match of text.matchAll(CITATION)) {
      const [, cited, citedPath] = match
      if (cited !== commit) stale.add(cited)
      const target = decodePath(citedPath ?? '').replace(/\/+$/u, '')
      if (!target) continue
      const line = text.slice(0, match.index).split('\n').length
      citedPaths.set(target, [...(citedPaths.get(target) ?? []), `${file}:${line}`])
    }
  }
  const missing = [...citedPaths].filter(([target]) => !dependencies.pathExists(commit, target))
  if (missing.length > 0) {
    const lines = missing.map(([target, locations]) => {
      const ordered = [...locations].sort(
        (a, b) => Number(isTranslation(a.split(':')[0])) - Number(isTranslation(b.split(':')[0])),
      )
      const more = ordered.length > 1 ? ` and ${ordered.length - 1} more` : ''
      return `- ${target} (${ordered[0]}${more})`
    })
    throw new Error(
      [`These cited Iroha paths do not exist at ${commit}; correct the links first:`, ...lines].join('\n'),
    )
  }

  const move = (text: string) => [...stale].reduce((moved, old) => moved.replaceAll(old, commit), text)
  const occurrences = (text: string) => [...stale].reduce((count, old) => count + text.split(old).length - 1, 0)

  const englishHashes = new Map<string, { before: string; after: string }>()
  for (const [file, text] of sources) {
    if (file === TRANSLATION_MEMORY || isTranslation(file)) continue
    englishHashes.set(`/${file.slice(PAGES_ROOT.length + 1)}`, { before: sha256(text), after: sha256(move(text)) })
  }

  const report: CitationReport = {
    commit,
    movedFrom: [...stale].sort(),
    files: [],
    hashesUpdated: 0,
    staleTranslations: [],
  }
  const writes: Array<[string, string]> = []
  for (const [file, text] of sources) {
    let moved = move(text)
    const source = frontmatterField(text, 'translation_source')
    const english = source === undefined ? undefined : englishHashes.get(source)
    if (english && english.before !== english.after) {
      if (SOURCE_HASH.exec(FRONTMATTER.exec(text)?.[1] ?? '')?.[1] === english.before) {
        moved = withSourceHash(moved, english.after)
        report.hashesUpdated += 1
      } else {
        report.staleTranslations.push(file)
      }
    }
    if (moved !== text) {
      writes.push([file, moved])
      report.files.push({ file, citations: occurrences(text) })
    }
  }
  for (const [file, content] of writes) await writeAtomic(path.join(repositoryRoot, file), content)
  return report
}

function parseArguments(args: string[]): string {
  let sourceDirectory: string | undefined
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--source') sourceDirectory = args[++index]
    else throw new Error(`Unknown argument: ${args[index]}`)
  }
  if (!sourceDirectory) throw new Error('Usage: pnpm move:iroha-citations --source /path/to/iroha')
  return path.resolve(sourceDirectory)
}

function gitObjects(sourceDirectory: string): CitationDependencies {
  const exists = (object: string) => spawnSync('git', ['-C', sourceDirectory, 'cat-file', '-e', object]).status === 0
  return {
    commitExists: (commit) => exists(`${commit}^{commit}`),
    pathExists: (commit, relativePath) => exists(`${commit}:${relativePath}`),
  }
}

async function main() {
  const report = await moveIrohaCitations(process.cwd(), gitObjects(parseArguments(process.argv.slice(2))))
  if (report.movedFrom.length === 0) {
    console.log(`Every Iroha source citation already names ${report.commit}.`)
    return
  }
  console.log(`Moved Iroha source citations from ${report.movedFrom.join(', ')} to ${report.commit}:`)
  for (const { file, citations } of report.files) console.log(`- ${file}: ${citations}`)
  console.log(`Updated ${report.hashesUpdated} translation source hash(es).`)
  if (report.staleTranslations.length > 0) {
    console.log(`${report.staleTranslations.length} translation(s) were already stale and stay marked stale:`)
    for (const file of report.staleTranslations) console.log(`- ${file}`)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
