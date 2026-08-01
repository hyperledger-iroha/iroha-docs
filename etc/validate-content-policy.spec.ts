import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { validateContentPolicy } from './validate-content-policy'

describe('content policy validation', () => {
  test('accepts current first-release terminology', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    await writeFile(path.join(root, 'README.md'), '# Iroha 3\n\nCanonical documentation.\n')
    expect(await validateContentPolicy(root)).toEqual([])
  })

  test('reports retired repository and release guidance', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    await mkdir(path.join(root, 'src'))
    await writeFile(
      path.join(root, 'src', 'old.md'),
      'See hyperledger-iroha/iroha-2-docs on the i23-features branch. Use pnpm get-snippets with Node.js 18+.\n',
    )

    const errors = await validateContentPolicy(root)
    expect(errors).toHaveLength(5)
    expect(errors.every((error) => error.startsWith('src/old.md:1:'))).toBe(true)
  })

  test('reports retired SORA 2 burn-claim guidance', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    await mkdir(path.join(root, 'src'))
    await writeFile(
      path.join(root, 'src', 'old-minamoto.md'),
      'Burn SORA 2 XOR after block 25,867,650, then use minamoto.sora.org/claim.\\n',
    )

    expect(await validateContentPolicy(root)).toEqual([
      'src/old-minamoto.md:1: retired SORA 2 migration guidance',
      'src/old-minamoto.md:1: retired Minamoto burn-claim block',
      'src/old-minamoto.md:1: retired Minamoto claim application',
    ])
  })

  test('reports retired Offline Note V2 guidance', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    await mkdir(path.join(root, 'src'))
    await writeFile(
      path.join(root, 'src', 'old-offline.md'),
      'Call get_offline_v2_readiness at /v1/offline/v2/readiness before issuing Offline Note V2.\\n',
    )

    expect(await validateContentPolicy(root)).toEqual(['src/old-offline.md:1: retired Offline Note V2 API'])
  })

  test('reports pre-release FastPQ, Norito, and SoraDNS narratives', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    await mkdir(path.join(root, 'src'))
    await writeFile(
      path.join(root, 'src', 'old-rollout.md'),
      [
        'The digest is absent until per-delta digest plumbing is available.',
        'Clients fall back to JSON during rollout; Norito RPC rollout comes later.',
        'Use the Transitional compatibility gateway when clients cannot resolve SoraDNS names directly yet.',
      ].join('\n'),
    )

    expect(await validateContentPolicy(root)).toEqual([
      'src/old-rollout.md:1: pre-release FastPQ digest promise',
      'src/old-rollout.md:2: Norito rollout narrative',
      'src/old-rollout.md:3: transitional SoraDNS gateway narrative',
    ])
  })

  test('reports retired or unpublished JavaScript and Sumeragi guidance', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    await mkdir(path.join(root, 'src'))
    await writeFile(
      path.join(root, 'src', 'old-sdk.md'),
      [
        'npm install @iroha/iroha-js',
        'Import OfflineQrStream from node_modules/@iroha/iroha-js.',
        'Run ops sumeragi collectors and ops sumeragi rbc status.',
      ].join('\n'),
    )

    expect(await validateContentPolicy(root)).toEqual([
      'src/old-sdk.md:1: unpublished JavaScript registry install',
      'src/old-sdk.md:2: nonexistent OfflineQrStream API',
      'src/old-sdk.md:2: unsupported node_modules native SDK build',
      'src/old-sdk.md:3: retired Sumeragi CLI command',
    ])
  })

  test('leaves verbatim generated artifacts to provenance validation', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    await mkdir(path.join(root, 'src', 'snippets'), { recursive: true })
    await mkdir(path.join(root, 'src', 'public', 'openapi'), { recursive: true })
    await writeFile(path.join(root, 'src', 'snippets', 'kagami-cli.md'), 'Current option: iroha2\\n')
    await writeFile(path.join(root, 'src', 'public', 'openapi', 'torii.json'), '{"profile":"iroha2"}\\n')
    await writeFile(path.join(root, 'src', 'prose.md'), 'Current option: iroha2\\n')

    expect(await validateContentPolicy(root)).toEqual([
      'src/prose.md:1: retired major-version documentation',
      'src/prose.md:1: retired major-version binary or identifier',
    ])
  })

  test('ignores abandoned atomic translation staging trees', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    const staging = path.join(root, '.iroha-docs-translation-1234-abcd', 'fr')
    await mkdir(staging, { recursive: true })
    await writeFile(path.join(staging, 'old.md'), 'Iroha 2\\n')

    expect(await validateContentPolicy(root)).toEqual([])
  })

  test('ignores documented local translation environments and model caches', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-policy-'))
    for (const directory of ['.cache', '.venv-translate']) {
      await mkdir(path.join(root, directory), { recursive: true })
      await writeFile(path.join(root, directory, 'model-metadata.json'), '{"profile":"iroha2"}\n')
    }

    expect(await validateContentPolicy(root)).toEqual([])
  })
})
