import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

interface ForbiddenTerm {
  label: string
  pattern: RegExp
}

const FORBIDDEN_TERMS: readonly ForbiddenTerm[] = [
  { label: 'mutable i23 feature branch', pattern: /\bi23-features\b/iu },
  { label: 'retired documentation repository URL', pattern: /hyperledger-iroha\/iroha-2-docs/iu },
  { label: 'retired major-version documentation', pattern: /\bIroha[\s_-]*2\b/iu },
  { label: 'retired major-version binary or identifier', pattern: /\biroha2(?:d)?\b/iu },
  { label: 'retired network snippet command', pattern: /\bpnpm\s+get-snippets\b/iu },
  { label: 'outdated documentation Node.js runtime', pattern: /\bNode\.js\s+18\+/u },
]

const SCANNED_EXTENSIONS = new Set(['.json', '.md', '.mts', '.scss', '.toml', '.ts', '.vue', '.yaml', '.yml'])
const EXCLUDED_DIRECTORIES = new Set(['.git', 'dist', 'node_modules'])
const EXCLUDED_FILES = new Set(['etc/validate-content-policy.ts', 'etc/validate-content-policy.spec.ts'])

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      if (entry.isDirectory()) {
        if (EXCLUDED_DIRECTORIES.has(entry.name) || (entry.name === 'cache' && directory.endsWith('.vitepress')))
          return []
        return walk(path.join(directory, entry.name))
      }
      return entry.isFile() ? [path.join(directory, entry.name)] : []
    }),
  )
  return nested.flat()
}

export async function validateContentPolicy(repositoryRoot: string): Promise<string[]> {
  const files = (await walk(repositoryRoot)).filter((file) => SCANNED_EXTENSIONS.has(path.extname(file)))
  const errors: string[] = []

  for (const file of files) {
    const relative = path.relative(repositoryRoot, file).split(path.sep).join('/')
    if (EXCLUDED_FILES.has(relative)) continue

    const lines = (await readFile(file, 'utf8')).split(/\r?\n/u)
    for (const [index, line] of lines.entries()) {
      for (const term of FORBIDDEN_TERMS) {
        term.pattern.lastIndex = 0
        if (term.pattern.test(line)) errors.push(`${relative}:${index + 1}: ${term.label}`)
      }
    }
  }

  return errors
}

async function main() {
  const errors = await validateContentPolicy(process.cwd())
  if (errors.length === 0) {
    console.log('Content policy validation passed.')
    return
  }

  console.error(`Content policy validation failed with ${errors.length} error(s):`)
  for (const error of errors.slice(0, 100)) console.error(`- ${error}`)
  if (errors.length > 100) console.error(`- …and ${errors.length - 100} more`)
  process.exitCode = 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
