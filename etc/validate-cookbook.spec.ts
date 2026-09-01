import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { COOKBOOK_ROUTES, validateCookbook } from './validate-cookbook'

const FIXTURE_SOURCE_COMMIT = '0123456789abcdef0123456789abcdef01234567'

const VALID_RECIPE = `# Recipe

## Outcome

Do the task.

## Prerequisites

Prepare a client.

## Steps

\`\`\`bash
iroha --help
\`\`\`

## Verify

Check the result.

## Troubleshooting

Inspect the error.

## Source and related docs

Source: https://github.com/hyperledger-iroha/iroha/tree/${FIXTURE_SOURCE_COMMIT}
`

const RETIRED_MAJOR_VERSION_EXAMPLE = ['Iroha', String(2)].join(' ')

async function fixture(): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), 'iroha-docs-cookbook-'))
  const cookbook = path.join(root, 'src', 'cookbook')
  await mkdir(cookbook, { recursive: true })
  await mkdir(path.join(root, 'provenance'), { recursive: true })
  await writeFile(
    path.join(root, 'provenance', 'iroha.json'),
    `${JSON.stringify({ source: { commit: FIXTURE_SOURCE_COMMIT } }, null, 2)}\n`,
  )
  await Promise.all(
    COOKBOOK_ROUTES.map((route) => {
      let source = route === 'index.md' ? '# Cookbook\n' : VALID_RECIPE
      if (route === 'query-ledger-state.md') {
        source = source.replace(
          'iroha --help',
          `DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'`,
        )
      }
      return writeFile(path.join(cookbook, route), source)
    }),
  )
  return root
}

describe('cookbook validation', () => {
  test('accepts the complete workflow inventory', async () => {
    expect(await validateCookbook(await fixture())).toEqual([])
  })

  test('reports missing and unexpected routes', async () => {
    const root = await fixture()
    const cookbook = path.join(root, 'src', 'cookbook')
    await writeFile(path.join(cookbook, 'placeholder.md'), VALID_RECIPE)
    const missing = path.join(cookbook, 'multisig.md')
    await writeFile(missing, '')
    const { rm } = await import('node:fs/promises')
    await rm(missing)

    const issues = await validateCookbook(root)
    expect(issues).toContain('src/cookbook: missing route multisig.md')
    expect(issues).toContain('src/cookbook: unexpected route placeholder.md')
  })

  test('rejects incomplete and stale recipes', async () => {
    const root = await fixture()
    const target = path.join(root, 'src', 'cookbook', 'metadata.md')
    await writeFile(
      target,
      `# Metadata\n\n## Steps\n\nTODO: use alice@wonderland with SignatureCheckCondition from ${RETIRED_MAJOR_VERSION_EXAMPLE}.\n`,
    )

    const issues = await validateCookbook(root)
    expect(issues).toContain('metadata.md: missing required section ## Outcome')
    expect(issues).toContain('metadata.md: recipe must include at least one fenced example')
    expect(issues).toContain(`metadata.md: recipe must cite pinned Iroha source commit ${FIXTURE_SOURCE_COMMIT}`)
    expect(issues).toContain('metadata.md: contains TODO placeholder')
    expect(issues).toContain('metadata.md: contains historical major-version reference')
    expect(issues).toContain('metadata.md: contains retired account literal')
    expect(issues).toContain('metadata.md: contains retired multisig API')
  })

  test('derives the required source pin from provenance', async () => {
    const root = await fixture()
    const nextCommit = '89abcdef0123456789abcdef0123456789abcdef'
    await writeFile(
      path.join(root, 'provenance', 'iroha.json'),
      `${JSON.stringify({ source: { commit: nextCommit } }, null, 2)}\n`,
    )

    expect(await validateCookbook(root)).toContain(
      `accounts-and-aliases.md: recipe must cite pinned Iroha source commit ${nextCommit}`,
    )
  })

  test('requires explicit JSON negotiation for status examples', async () => {
    const root = await fixture()
    const target = path.join(root, 'src', 'cookbook', 'connect-to-taira.md')
    const source = (await readFile(target, 'utf8')).replace(
      'iroha --help',
      'curl -fsS https://taira.sora.org/status | jq .',
    )
    await writeFile(target, source)

    expect(await validateCookbook(root)).toContain(
      'connect-to-taira.md: JSON status examples must request Accept: application/json',
    )
  })

  test('requires the live-tested Taira SSE negotiation fallback', async () => {
    const root = await fixture()
    const target = path.join(root, 'src', 'cookbook', 'stream-events.md')
    const source = (await readFile(target, 'utf8')).replace(
      'iroha --help',
      "curl -H 'Accept: text/event-stream' https://taira.sora.org/v1/events/sse",
    )
    await writeFile(target, source)

    expect(await validateCookbook(root)).toContain(
      'stream-events.md: Taira SSE examples must advertise event-stream with a JSON fallback',
    )
  })

  test('rejects the retired typed SSE filter shape', async () => {
    const root = await fixture()
    const target = path.join(root, 'src', 'cookbook', 'stream-events.md')
    const source = (await readFile(target, 'utf8')).replace(
      'iroha --help',
      `curl -H 'Accept: text/event-stream, application/json' https://taira.sora.org/v1/events/sse
const filter = { Pipeline: { Transaction: { status: 'Committed' } } }`,
    )
    await writeFile(target, source)

    const issues = await validateCookbook(root)
    expect(issues).toContain(
      'stream-events.md: Taira SSE examples must use the current FilterExpr transaction-status form',
    )
    expect(issues).toContain('stream-events.md: contains the retired typed event-filter shape')
  })

  test('keeps SSE reconciliation behind an open replacement stream and bounded', async () => {
    const root = await fixture()
    const target = path.join(root, 'src', 'cookbook', 'stream-events.md')
    const source = (await readFile(target, 'utf8')).replace(
      'iroha --help',
      `const filter = { op: 'eq', args: ['tx_status', 'Approved'] }
const url = new URL('/v1/events/sse', baseUrl)
async function* streamOnce() {
  await reconcile()
  const response = await fetch(url, {
    headers: { Accept: 'text/event-stream, application/json' },
  })
}
The latest explorer snapshot guarantees complete recovery.`,
    )
    await writeFile(target, source)

    const issues = await validateCookbook(root)
    expect(issues).toContain('stream-events.md: replacement SSE connections must open before reconciliation')
    expect(issues).toContain('stream-events.md: bounded reconciliation must not claim complete event recovery')
  })

  test('keeps kotoage examples on call entrypoints', async () => {
    const root = await fixture()
    const target = path.join(root, 'src', 'cookbook', 'smart-contracts.md')
    const source = (await readFile(target, 'utf8')).replace(
      'iroha --help',
      `cp tuple_return_demo.ko ./contract.ko
iroha contract debug-view --entrypoint compute
iroha contract view --entrypoint compute`,
    )
    await writeFile(target, source)

    const issues = await validateCookbook(root)
    expect(issues).toContain('smart-contracts.md: kotoage examples must execute locally with contract debug-call')
    expect(issues).toContain('smart-contracts.md: deployed kotoage examples must verify with contract call --simulate')
    expect(issues).toContain('smart-contracts.md: kotoage examples must not use view-only commands')
  })

  test('locks Kotodama tuple results to their JSON string representation', async () => {
    const root = await fixture()
    const target = path.join(root, 'src', 'cookbook', 'smart-contracts.md')
    const source = (await readFile(target, 'utf8')).replace(
      'iroha --help',
      `cp tuple_return_demo.ko ./contract.ko
iroha contract debug-call --entrypoint compute
iroha contract call --simulate --entrypoint compute
jq -e '.result == [3, 5]' local.json
jq -e '.result == [3, 5]' simulation.json
jq -e '.result == [3, 5]' address.json`,
    )
    await writeFile(target, source)

    expect(await validateCookbook(root)).toContain(
      'smart-contracts.md: kotoage tuple assertions must use the JSON string result ["3", "5"]',
    )
  })

  test('rejects retired nested query predicate JSON', async () => {
    const root = await fixture()
    const target = path.join(root, 'src', 'cookbook', 'query-ledger-state.md')
    const source = (await readFile(target, 'utf8')).replace(
      `DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'`,
      `DOMAIN_PREDICATE='{"Atom":{"Id":{"Atom":{"Equals":"wonderland.universal"}}}}'`,
    )
    await writeFile(target, source)

    const issues = await validateCookbook(root)
    expect(issues).toContain('query-ledger-state.md: domain filtering must use the current lightweight predicate JSON')
    expect(issues).toContain('query-ledger-state.md: contains the retired nested typed-predicate JSON')
  })

  test('rejects an inlined retired query predicate without the expected variable', async () => {
    const root = await fixture()
    const target = path.join(root, 'src', 'cookbook', 'query-ledger-state.md')
    const source = (await readFile(target, 'utf8')).replace(
      `DOMAIN_PREDICATE='{"equals":[{"field":"id","value":"wonderland.universal"}]}'`,
      `curl --data '{"Atom":{"Id":{"Atom":{"Equals":"wonderland.universal"}}}}'`,
    )
    await writeFile(target, source)

    const issues = await validateCookbook(root)
    expect(issues).toContain('query-ledger-state.md: domain filtering must use the current lightweight predicate JSON')
    expect(issues).toContain('query-ledger-state.md: contains the retired nested typed-predicate JSON')
  })

  test('requires the canonical policy-derived multisig account', async () => {
    const root = await fixture()
    const target = path.join(root, 'src', 'cookbook', 'multisig.md')
    const source = (await readFile(target, 'utf8')).replace(
      'iroha --help',
      'let register = MultisigRegister::from_spec(None::<DomainId>, spec)?;',
    )
    await writeFile(target, source)

    const issues = await validateCookbook(root)
    expect(issues).toContain('multisig.md: must derive the canonical multisig account from its policy')
    expect(issues).toContain('multisig.md: must register using the policy-derived canonical account')
    expect(issues).toContain('multisig.md: must pass the policy-derived account to MultisigRegister::with_account')
    expect(issues).toContain('multisig.md: must not reuse the random registration seed as the canonical account')
  })

  test('rejects a seed account passed to multisig registration', async () => {
    const root = await fixture()
    const target = path.join(root, 'src', 'cookbook', 'multisig.md')
    const source = (await readFile(target, 'utf8')).replace(
      'iroha --help',
      `let multisig_account = AccountId::new_multisig(policy);
let register = MultisigRegister::with_account(seed_account, None::<DomainId>, spec);`,
    )
    await writeFile(target, source)

    expect(await validateCookbook(root)).toContain(
      'multisig.md: must pass the policy-derived account to MultisigRegister::with_account',
    )
  })

  test('rejects misleading destination-registration flags', async () => {
    const root = await fixture()
    const target = path.join(root, 'src', 'cookbook', 'fungible-assets.md')
    const source = (await readFile(target, 'utf8')).replace(
      'iroha --help',
      'iroha ledger asset transfer --ensure-destination',
    )
    await writeFile(target, source)

    expect(await validateCookbook(root)).toContain(
      'fungible-assets.md: must not claim that --ensure-destination registers destination state',
    )
  })
})
