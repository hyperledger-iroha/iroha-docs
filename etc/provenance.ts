import { createHash } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import prettier from 'prettier'

export const PROVENANCE_PATH = 'provenance/iroha.json'
export const IROHA_REPOSITORY = 'https://github.com/hyperledger-iroha/iroha.git'
/** GitHub `owner/name` of {@link IROHA_REPOSITORY}, used for signature and ancestry checks. */
export const IROHA_GITHUB_REPOSITORY = 'hyperledger-iroha/iroha'

interface ArtifactBase {
  id: string
  target: string
  sha256: string
}

export interface CopyArtifact extends ArtifactBase {
  kind: 'copy'
  source: string
  source_sha256: string
}

/** A file copied from the pinned tree and rendered by the docs renderer registered for its id. */
export interface RenderArtifact extends ArtifactBase {
  kind: 'render'
  source: string
  source_sha256: string
}

export interface CommandArtifact extends ArtifactBase {
  kind: 'command'
  command: string[]
  inputs: string[]
}

export type ProvenanceArtifact = CopyArtifact | RenderArtifact | CommandArtifact

/**
 * What scheduled refreshes follow: the newest GitHub-verified commit on `branch`, or a release tag
 * matching the `release_tags` glob, whichever is newer.
 */
export interface SourceTrack {
  branch: string
  release_tags: string
}

export interface IrohaProvenance {
  schema_version: 1
  source: {
    repository: string
    track: SourceTrack
    /** Public ref that contained `commit` when it was pinned: `refs/heads/<branch>` or `refs/tags/<tag>`. */
    ref: string
    commit: string
  }
  artifacts: ProvenanceArtifact[]
}

export function sha256(content: string | Buffer): string {
  return createHash('sha256').update(content).digest('hex')
}

export async function readProvenance(repositoryRoot: string): Promise<IrohaProvenance> {
  const manifestPath = path.join(repositoryRoot, PROVENANCE_PATH)
  return JSON.parse(await readFile(manifestPath, 'utf8')) as IrohaProvenance
}

export function resolveInsideRepository(repositoryRoot: string, relativePath: string): string {
  if (path.isAbsolute(relativePath)) throw new Error(`Path must be repository-relative: ${relativePath}`)
  const resolvedRoot = path.resolve(repositoryRoot)
  const resolved = path.resolve(resolvedRoot, relativePath)
  if (resolved !== resolvedRoot && !resolved.startsWith(`${resolvedRoot}${path.sep}`)) {
    throw new Error(`Path escapes the repository: ${relativePath}`)
  }
  return resolved
}

export async function writeAtomic(target: string, content: string | Buffer) {
  await mkdir(path.dirname(target), { recursive: true })
  const temporary = `${target}.tmp-${process.pid}`
  await writeFile(temporary, content)
  await rename(temporary, target)
}

/** Writes JSON in the repository's Prettier style, so refreshed output passes `pnpm format:check`. */
export async function writeJson(repositoryRoot: string, relativePath: string, value: unknown) {
  const target = resolveInsideRepository(repositoryRoot, relativePath)
  const options = (await prettier.resolveConfig(target)) ?? {}
  await writeAtomic(target, await prettier.format(JSON.stringify(value), { ...options, filepath: target }))
}

export async function writeProvenance(repositoryRoot: string, manifest: IrohaProvenance) {
  await writeJson(repositoryRoot, PROVENANCE_PATH, manifest)
}

/** Matches a tag or branch name against a glob in which `*` stands for any run of characters other than `/`. */
export function matchesRefGlob(name: string, glob: string): boolean {
  const pattern = glob
    .split('*')
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/gu, '\\$&'))
    .join('[^/]*')
  return new RegExp(`^${pattern}$`, 'u').test(name)
}
