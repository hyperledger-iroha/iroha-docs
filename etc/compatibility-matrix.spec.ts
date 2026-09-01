import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, test } from 'vitest'

interface Provenance {
  source: {
    commit: string
    refresh_state?: string
  }
}

interface CompatibilityMatrix {
  source: {
    revision: string
    revision_url?: string
    verification: string
  }
  included_sdks: Array<{ name: string }>
  stories: Array<{
    name: string
    results: Array<{ status: string }>
  }>
}

async function readJson<T>(relativePath: string): Promise<T> {
  const content = await readFile(path.join(process.cwd(), relativePath), 'utf8')
  return JSON.parse(content) as T
}

describe('bundled SDK compatibility matrix', () => {
  test('names and links the exact public Iroha candidate without claiming signed provenance', async () => {
    const provenance = await readJson<Provenance>('provenance/iroha.json')
    const matrix = await readJson<CompatibilityMatrix>('src/public/compat-matrix.json')

    expect(matrix.source.revision).toBe(provenance.source.commit)
    if (provenance.source.refresh_state === 'awaiting-signed-source-commit') {
      expect(matrix.source.verification).toBe('pending-signed-source-commit')
      expect(matrix.source.revision_url).toBe(
        `https://github.com/hyperledger-iroha/iroha/commit/${provenance.source.commit}`,
      )
    } else {
      expect(matrix.source.verification).toBe('not-run')
      expect(matrix.source.revision_url).toBe(
        `https://github.com/hyperledger-iroha/iroha/commit/${provenance.source.commit}`,
      )
    }
  })

  test('has exactly one result for every declared SDK', async () => {
    const matrix = await readJson<CompatibilityMatrix>('src/public/compat-matrix.json')
    const sdkNames = matrix.included_sdks.map(({ name }) => name)
    const storyNames = matrix.stories.map(({ name }) => name)

    expect(new Set(sdkNames).size).toBe(sdkNames.length)
    expect(new Set(storyNames).size).toBe(storyNames.length)
    expect(matrix.stories.length).toBeGreaterThan(0)

    for (const story of matrix.stories) {
      expect(story.results, story.name).toHaveLength(sdkNames.length)
      expect(
        story.results.every(({ status }) => status === 'ok' || status === 'failed' || status === 'no-data'),
        story.name,
      ).toBe(true)
    }
  })
})
