import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const PROVENANCE_PATH = 'provenance/iroha.json'
export const IROHA_REPOSITORY = 'https://github.com/hyperledger-iroha/iroha.git'

interface ArtifactBase {
  id: string
  status: 'current' | 'pending-source-commit'
  target: string
  sha256: string
}

export interface CopyArtifact extends ArtifactBase {
  kind: 'copy'
  source: string
  source_sha256: string
}

export interface CommandArtifact extends ArtifactBase {
  kind: 'command'
  command: string[]
  inputs: string[]
}

export type ProvenanceArtifact = CopyArtifact | CommandArtifact

export interface IrohaProvenance {
  schema_version: 1
  source: {
    repository: string
    commit: string
    refresh_state?: 'awaiting-source-relocation-commit'
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
