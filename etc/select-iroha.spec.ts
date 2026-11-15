import { describe, expect, test } from 'vitest'
import { IROHA_REPOSITORY, type IrohaProvenance } from './provenance'
import {
  compareVersions,
  selectIrohaSource,
  verifyPinnedSource,
  type Comparison,
  type SourceApi,
  type SourceCommit,
  type TagRef,
} from './select-iroha'

const sha = (character: string) => character.repeat(40)
const PINNED = sha('0')

interface FakeRepository {
  branch?: SourceCommit[]
  tags?: TagRef[]
  annotated?: Record<string, { verified: boolean; target: { type: string; sha: string } }>
  commits?: SourceCommit[]
  /** Relation of `head` to `base`, keyed by `${base}...${head}`; defaults to `ahead`. */
  comparisons?: Record<string, Comparison>
}

function fakeApi(repository: FakeRepository): SourceApi {
  const commits = new Map([...(repository.branch ?? []), ...(repository.commits ?? [])].map((c) => [c.sha, c]))
  return {
    async branchCommits(_branch, page, perPage) {
      return (repository.branch ?? []).slice((page - 1) * perPage, page * perPage)
    },
    async commit(commitSha) {
      const commit = commits.get(commitSha)
      if (!commit) throw new Error(`unknown commit ${commitSha}`)
      return commit
    },
    async tags(prefix) {
      return (repository.tags ?? []).filter((tag) => tag.name.startsWith(prefix))
    },
    async annotatedTag(tagSha) {
      const tag = repository.annotated?.[tagSha]
      if (!tag) throw new Error(`unknown tag object ${tagSha}`)
      return tag
    },
    async compare(base, head) {
      return repository.comparisons?.[`${base}...${head}`] ?? 'ahead'
    },
  }
}

function manifest(commit = PINNED): IrohaProvenance {
  return {
    schema_version: 1,
    source: {
      repository: IROHA_REPOSITORY,
      track: { branch: 'optimizations', release_tags: 'v3*' },
      ref: 'refs/heads/optimizations',
      commit,
    },
    artifacts: [],
  }
}

const commit = (character: string, verified: boolean, committedAt: string): SourceCommit => ({
  sha: sha(character),
  verified,
  committedAt,
})

describe('Iroha source selection', () => {
  test('pins the newest GitHub-verified commit on the tracked branch', async () => {
    const api = fakeApi({
      branch: [
        commit('c', false, '2026-11-03T00:00:00Z'),
        commit('b', true, '2026-11-02T00:00:00Z'),
        commit('a', true, '2026-11-01T00:00:00Z'),
      ],
    })
    expect(await selectIrohaSource(api, manifest())).toEqual({
      changed: true,
      previous: PINNED,
      reason: 'newest GitHub-verified commit on optimizations',
      selection: {
        commit: sha('b'),
        ref: 'refs/heads/optimizations',
        committedAt: '2026-11-02T00:00:00Z',
        reason: 'newest GitHub-verified commit on optimizations',
      },
    })
  })

  test('searches past a full page of unsigned commits', async () => {
    const unsigned = Array.from({ length: 100 }, () => commit('e', false, '2026-11-03T00:00:00Z'))
    const api = fakeApi({ branch: [...unsigned, commit('b', true, '2026-11-01T00:00:00Z')] })
    expect((await selectIrohaSource(api, manifest())).selection?.commit).toBe(sha('b'))
  })

  test('prefers a newer verified release tag and ignores unsigned or unrelated tags', async () => {
    const api = fakeApi({
      branch: [commit('b', true, '2026-11-01T00:00:00Z')],
      tags: [
        { name: 'v3.0.0-rc.1', object: { type: 'commit', sha: sha('c') } },
        { name: 'v3.0.0', object: { type: 'tag', sha: sha('9') } },
        { name: 'v3.1.0', object: { type: 'commit', sha: sha('d') } },
        { name: 'v2.0.0', object: { type: 'commit', sha: sha('f') } },
      ],
      annotated: { [sha('9')]: { verified: true, target: { type: 'commit', sha: sha('e') } } },
      commits: [
        commit('c', true, '2026-11-02T00:00:00Z'),
        commit('d', false, '2026-11-05T00:00:00Z'),
        commit('e', false, '2026-11-04T00:00:00Z'),
        commit('f', true, '2026-11-06T00:00:00Z'),
      ],
    })
    expect((await selectIrohaSource(api, manifest())).selection).toEqual({
      commit: sha('e'),
      ref: 'refs/tags/v3.0.0',
      committedAt: '2026-11-04T00:00:00Z',
      reason: 'release tag v3.0.0',
    })
  })

  test('keeps the pin when the candidate is already pinned or contained in it', async () => {
    const branch = [commit('b', true, '2026-11-02T00:00:00Z')]
    expect(await selectIrohaSource(fakeApi({ branch }), manifest(sha('b')))).toMatchObject({
      changed: false,
      reason: 'already pinned to the newest GitHub-verified commit on optimizations',
    })

    const behind = fakeApi({ branch, comparisons: { [`${PINNED}...${sha('b')}`]: 'behind' } })
    expect(await selectIrohaSource(behind, manifest())).toMatchObject({ changed: false })
  })

  test('moves a diverged pin only to a newer commit', async () => {
    const repository: FakeRepository = {
      branch: [commit('b', true, '2026-11-02T00:00:00Z')],
      comparisons: { [`${PINNED}...${sha('b')}`]: 'diverged' },
      commits: [commit('0', true, '2026-11-01T00:00:00Z')],
    }
    expect((await selectIrohaSource(fakeApi(repository), manifest())).changed).toBe(true)

    repository.commits = [commit('0', true, '2026-11-03T00:00:00Z')]
    expect(await selectIrohaSource(fakeApi(repository), manifest())).toMatchObject({
      changed: false,
      reason: 'the newest GitHub-verified commit on optimizations is older than the diverged pin',
    })
  })

  test('reports when no verified candidate exists', async () => {
    const api = fakeApi({ branch: [commit('c', false, '2026-11-03T00:00:00Z')] })
    expect(await selectIrohaSource(api, manifest())).toEqual({
      changed: false,
      previous: PINNED,
      reason: 'no GitHub-verified candidate commit was found',
    })
  })

  test('accepts only tracked refs when a ref is requested', async () => {
    const api = fakeApi({
      branch: [commit('b', true, '2026-11-02T00:00:00Z')],
      tags: [
        { name: 'v3.0.0', object: { type: 'commit', sha: sha('c') } },
        { name: 'v3.0.1', object: { type: 'commit', sha: sha('d') } },
      ],
      commits: [commit('c', true, '2026-11-01T00:00:00Z'), commit('d', false, '2026-11-03T00:00:00Z')],
    })
    expect((await selectIrohaSource(api, manifest(), 'refs/tags/v3.0.0')).selection?.ref).toBe('refs/tags/v3.0.0')
    expect((await selectIrohaSource(api, manifest(), 'optimizations')).selection?.commit).toBe(sha('b'))
    await expect(selectIrohaSource(api, manifest(), 'v3.0.1')).rejects.toThrow(
      'Iroha tag v3.0.1 has no GitHub-verified tag or commit signature',
    )
    await expect(selectIrohaSource(api, manifest(), 'refs/heads/main')).rejects.toThrow(
      'Requested ref refs/heads/main is neither the tracked branch optimizations nor a v3* release tag',
    )
  })

  test('orders release versions with prereleases before releases', () => {
    const versions = ['v3.0.0', 'v3.10.0', 'v3.0.0-rc.2', 'v3.2.0', 'v3.0.0-rc.10', 'v3.0.1']
    expect([...versions].sort(compareVersions)).toEqual([
      'v3.0.0-rc.2',
      'v3.0.0-rc.10',
      'v3.0.0',
      'v3.0.1',
      'v3.2.0',
      'v3.10.0',
    ])
  })
})

describe('pinned source verification', () => {
  const verifiedCommit = commit('b', true, '2026-11-02T00:00:00Z')

  test('accepts a verified commit contained in the tracked branch', async () => {
    await expect(
      verifyPinnedSource(fakeApi({ commits: [verifiedCommit] }), sha('b'), 'refs/heads/optimizations'),
    ).resolves.toBeUndefined()
  })

  test('rejects an unsigned commit', async () => {
    const api = fakeApi({ commits: [commit('c', false, '2026-11-03T00:00:00Z')] })
    await expect(verifyPinnedSource(api, sha('c'), 'refs/heads/optimizations')).rejects.toThrow(
      `Iroha commit ${sha('c')} has no signature that GitHub verifies`,
    )
  })

  test('rejects a verified commit that the branch does not contain', async () => {
    const api = fakeApi({
      commits: [verifiedCommit],
      comparisons: { [`${sha('b')}...optimizations`]: 'diverged' },
    })
    await expect(verifyPinnedSource(api, sha('b'), 'refs/heads/optimizations')).rejects.toThrow(
      `Iroha commit ${sha('b')} is not reachable from refs/heads/optimizations`,
    )
  })

  test('accepts an unsigned commit under a verified annotated tag that points at it', async () => {
    const api = fakeApi({
      commits: [commit('c', false, '2026-11-03T00:00:00Z')],
      tags: [{ name: 'v3.0.0', object: { type: 'tag', sha: sha('9') } }],
      annotated: { [sha('9')]: { verified: true, target: { type: 'commit', sha: sha('c') } } },
      comparisons: { [`${sha('c')}...v3.0.0`]: 'identical' },
    })
    await expect(verifyPinnedSource(api, sha('c'), 'refs/tags/v3.0.0')).resolves.toBeUndefined()
  })

  test('rejects a tag that does not point at the pinned commit', async () => {
    const api = fakeApi({
      commits: [verifiedCommit],
      tags: [{ name: 'v3.0.0', object: { type: 'commit', sha: sha('c') } }],
      comparisons: { [`${sha('b')}...v3.0.0`]: 'ahead' },
    })
    await expect(verifyPinnedSource(api, sha('b'), 'refs/tags/v3.0.0')).rejects.toThrow(
      `Iroha tag v3.0.0 does not point at ${sha('b')}`,
    )
  })

  test('rejects abbreviated commits and unsupported refs', async () => {
    const api = fakeApi({ commits: [verifiedCommit] })
    await expect(verifyPinnedSource(api, 'bbbbbbb', 'refs/heads/optimizations')).rejects.toThrow('full 40-character')
    await expect(verifyPinnedSource(api, sha('b'), 'optimizations')).rejects.toThrow('refs/heads/<branch>')
  })
})
