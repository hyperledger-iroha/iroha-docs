import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

export const IROHA_SOURCE_COMMIT = 'bc7114ed1c7f265a156d2100ff09e851cc95702c'

export const COOKBOOK_ROUTES = [
  'accounts-and-aliases.md',
  'connect-to-taira.md',
  'fungible-assets.md',
  'index.md',
  'metadata.md',
  'multisig.md',
  'native-escrow.md',
  'nfts.md',
  'permissions-and-roles.md',
  'query-ledger-state.md',
  'smart-contracts.md',
  'stream-events.md',
  'submit-and-verify-transactions.md',
  'triggers.md',
  'wallet-connect.md',
] as const

const REQUIRED_SECTIONS = [
  '## Outcome',
  '## Prerequisites',
  '## Steps',
  '## Verify',
  '## Troubleshooting',
  '## Source and related docs',
] as const

const RETIRED_MAJOR_VERSION = new RegExp(String.raw`\bIroha\s*${2}\b`, 'iu')

const FORBIDDEN_CONTENT: ReadonlyArray<{ label: string; pattern: RegExp }> = [
  { label: 'TODO placeholder', pattern: /\bTODO\b/u },
  { label: 'placeholder URL', pattern: /https?:\/\/(?:www\.)?example\.com\b/u },
  { label: 'historical major-version reference', pattern: RETIRED_MAJOR_VERSION },
  { label: 'retired account literal', pattern: /\balice@wonderland\b/iu },
  { label: 'retired asset-definition literal', pattern: /\brose#wonderland\b/iu },
  { label: 'retired multisig API', pattern: /\bSignatureCheckCondition\b/u },
]

function orderedSectionIssues(route: string, source: string): string[] {
  const issues: string[] = []
  let previous = -1
  for (const section of REQUIRED_SECTIONS) {
    const current = source.indexOf(section)
    if (current === -1) {
      issues.push(`${route}: missing required section ${section}`)
      continue
    }
    if (current < previous) issues.push(`${route}: ${section} is out of order`)
    previous = current
  }
  return issues
}

export async function validateCookbook(repositoryRoot: string): Promise<string[]> {
  const cookbookRoot = path.join(repositoryRoot, 'src', 'cookbook')
  let actualRoutes: string[]
  try {
    actualRoutes = (await readdir(cookbookRoot)).filter((entry) => entry.endsWith('.md')).sort()
  } catch (error) {
    return [`src/cookbook: ${error instanceof Error ? error.message : String(error)}`]
  }

  const issues: string[] = []
  const expectedRoutes = [...COOKBOOK_ROUTES].sort()
  for (const missing of expectedRoutes.filter((route) => !actualRoutes.includes(route))) {
    issues.push(`src/cookbook: missing route ${missing}`)
  }
  for (const unexpected of actualRoutes.filter(
    (route) => !expectedRoutes.includes(route as (typeof COOKBOOK_ROUTES)[number]),
  )) {
    issues.push(`src/cookbook: unexpected route ${unexpected}`)
  }

  for (const route of actualRoutes.filter((entry) => entry !== 'index.md')) {
    const source = await readFile(path.join(cookbookRoot, route), 'utf8')
    issues.push(...orderedSectionIssues(route, source))

    if (!/^```[^\n]*\n[\s\S]+?^```/mu.test(source)) {
      issues.push(`${route}: recipe must include at least one fenced example`)
    }
    if (!source.includes(IROHA_SOURCE_COMMIT)) {
      issues.push(`${route}: recipe must cite pinned Iroha source commit ${IROHA_SOURCE_COMMIT}`)
    }
    for (const forbidden of FORBIDDEN_CONTENT) {
      if (forbidden.pattern.test(source)) issues.push(`${route}: contains ${forbidden.label}`)
    }
    if (source.includes('/status') && source.includes('jq') && !source.includes('Accept: application/json')) {
      issues.push(`${route}: JSON status examples must request Accept: application/json`)
    }
    if (source.includes('/v1/events/sse') && !source.includes('Accept: text/event-stream, application/json')) {
      issues.push(`${route}: Taira SSE examples must advertise event-stream with a JSON fallback`)
    }
    if (route === 'stream-events.md' && source.includes('/v1/events/sse')) {
      if (!source.includes("args: ['tx_status', 'Approved']")) {
        issues.push(`${route}: Taira SSE examples must use the current FilterExpr transaction-status form`)
      }
      if (source.includes('Pipeline:')) {
        issues.push(`${route}: contains the retired typed event-filter shape`)
      }
      const streamOnceIndex = source.indexOf('async function* streamOnce()')
      const streamFetchIndex = source.indexOf('const response = await fetch(url', streamOnceIndex)
      const reconcileIndex = source.indexOf('await reconcile()', streamOnceIndex)
      if (
        streamOnceIndex === -1 ||
        streamFetchIndex === -1 ||
        reconcileIndex === -1 ||
        streamFetchIndex > reconcileIndex
      ) {
        issues.push(`${route}: replacement SSE connections must open before reconciliation`)
      }
      if (
        !source.includes('The latest-25 explorer request is only a public diagnostic.') ||
        !source.includes('The bounded snapshot alone cannot prove that no events were missed.')
      ) {
        issues.push(`${route}: bounded reconciliation must not claim complete event recovery`)
      }
    }
    if (route === 'smart-contracts.md' && source.includes('tuple_return_demo')) {
      if (!source.includes('contract debug-call')) {
        issues.push(`${route}: kotoage examples must execute locally with contract debug-call`)
      }
      if (!source.includes('contract call') || !source.includes('--simulate')) {
        issues.push(`${route}: deployed kotoage examples must verify with contract call --simulate`)
      }
      if (source.includes('contract debug-view') || source.includes('contract view')) {
        issues.push(`${route}: kotoage examples must not use view-only commands`)
      }
      const stringTupleAssertions = source.match(/\.result == \["3", "5"\]/gu) ?? []
      if (stringTupleAssertions.length !== 3) {
        issues.push(`${route}: kotoage tuple assertions must use the JSON string result ["3", "5"]`)
      }
    }
    if (route === 'query-ledger-state.md') {
      if (!source.includes(`{"equals":[{"field":"id","value":"wonderland.universal"}]}`)) {
        issues.push(`${route}: domain filtering must use the current lightweight predicate JSON`)
      }
      if (source.includes(`{"Atom"`)) {
        issues.push(`${route}: contains the retired nested typed-predicate JSON`)
      }
    }
    if (route === 'multisig.md' && source.includes('MultisigRegister')) {
      if (!source.includes('AccountId::new_multisig')) {
        issues.push(`${route}: must derive the canonical multisig account from its policy`)
      }
      if (!source.includes('MultisigRegister::with_account')) {
        issues.push(`${route}: must register using the policy-derived canonical account`)
      }
      if (!/MultisigRegister::with_account\(\s*multisig_account\.clone\(\),/u.test(source)) {
        issues.push(`${route}: must pass the policy-derived account to MultisigRegister::with_account`)
      }
      if (source.includes('MultisigRegister::from_spec')) {
        issues.push(`${route}: must not reuse the random registration seed as the canonical account`)
      }
    }
    if (route === 'fungible-assets.md' && source.includes('--ensure-destination')) {
      issues.push(`${route}: must not claim that --ensure-destination registers destination state`)
    }
  }

  return issues.sort()
}

async function main() {
  const issues = await validateCookbook(process.cwd())
  if (issues.length === 0) {
    console.log(`Cookbook validation passed for ${COOKBOOK_ROUTES.length} routes.`)
    return
  }

  console.error(`Cookbook validation failed with ${issues.length} issue(s):`)
  for (const issue of issues) console.error(`- ${issue}`)
  process.exitCode = 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
