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
})
