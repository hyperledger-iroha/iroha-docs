import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { markdownContainerDirectives } from './translate'

interface ForbiddenTerm {
  label: string
  pattern: RegExp
}

const FORBIDDEN_TERMS: readonly ForbiddenTerm[] = [
  { label: 'mutable i23 feature branch', pattern: /\bi23-features\b/iu },
  {
    label: 'mutable implementation source link',
    pattern: /https:\/\/github\.com\/hyperledger-iroha\/iroha\/(?:blob|tree)\/main\//iu,
  },
  {
    label: 'retired extensionless OpenAPI route',
    pattern: /\/openapi(?![A-Za-z0-9._/-])/u,
  },
  { label: 'retired documentation repository URL', pattern: /hyperledger-iroha\/iroha-2-docs/iu },
  { label: 'retired major-version documentation', pattern: /\bIroha[\s_-]*2\b/iu },
  { label: 'retired major-version binary or identifier', pattern: /\biroha2(?:d)?\b/iu },
  { label: 'retired SORA 2 migration guidance', pattern: /\bSORA[\s_-]*2\b/iu },
  { label: 'retired Minamoto burn-claim block', pattern: /\b25,867,650\b/u },
  { label: 'retired Minamoto claim application', pattern: /\bminamoto\.sora\.org\/claim\b/iu },
  {
    label: 'retired Offline Note V2 API',
    pattern: /(?:\/v1\/offline\/v2\b|\bOffline\s+Note\s+V2\b|\bOfflineNoteV2\b|\bget_offline_v2_readiness\b)/iu,
  },
  {
    label: 'pre-release FastPQ digest promise',
    pattern: /\buntil per-delta digest(?:s| plumbing)\b/iu,
  },
  {
    label: 'Norito rollout narrative',
    pattern: /(?:\bfall back to JSON during rollout\b|\bNorito RPC rollout\b)/iu,
  },
  {
    label: 'transitional SoraDNS gateway narrative',
    pattern: /(?:\bcannot resolve SoraDNS names directly yet\b|\bTransitional compatibility gateway\b)/iu,
  },
  {
    label: 'unpublished JavaScript registry install',
    pattern: /\bnpm\s+(?:install|i)\s+@iroha\/iroha-js\b/iu,
  },
  { label: 'nonexistent OfflineQrStream API', pattern: /\bOfflineQrStream\b/u },
  {
    label: 'retired Sumeragi CLI command',
    pattern:
      /\bops\s+sumeragi\s+(?:collectors|key-lifecycle|pacemaker|phases|rbc|telemetry|vrf-epoch|vrf-penalties)\b/iu,
  },
  {
    label: 'retired Sumeragi route',
    pattern:
      /\/v1\/sumeragi\/(?:bls_keys|checkpoints|collectors|commit-certificates|commit-qcs\/\{block_hash\}|commit_qc\/\{hash\}|evidence\/submit|key-lifecycle|new_view\/(?:json|sse)|pacemaker|phases|rbc(?:\/sessions)?|telemetry|validator-sets(?:\/\{height\})?|vrf\/(?:epoch|penalties)\/\{epoch\})(?![A-Za-z0-9_-])/iu,
  },
  {
    label: 'retired Soracloud private-model route',
    pattern: /\/v1\/soracloud\/model\/(?:run-private(?:\/finalize)?|decrypt-output)(?![A-Za-z0-9_-])/iu,
  },
  {
    label: 'nonexistent singular versioned transaction route',
    pattern: /\/v1\/transaction(?!s|[A-Za-z0-9_/-])/iu,
  },
  {
    label: 'retired Kaigi CLI prefix',
    pattern: /\biroha\s+kaigi\b/iu,
  },
  {
    label: 'retired Kaigi quickstart option',
    pattern: /--auto-join-host\b/iu,
  },
  {
    label: 'retired Soracloud CLI prefix',
    pattern: /\biroha\s+app\s+soracloud\b/iu,
  },
  {
    label: 'retired Soracloud app command',
    pattern: /\biroha\s+soracloud\s+app\s+(?:local-plan|deploy)\b/iu,
  },
  {
    label: 'retired unscoped Soracloud service command',
    pattern: /\biroha\s+soracloud\s+(?:status|rollback|config-set|secret-set)\b/iu,
  },
  {
    label: 'nonexistent shield or unshield CLI command',
    pattern: /\biroha\s+app\s+zk\s+(?:shield|unshield)\b/iu,
  },
  {
    label: 'retired local Sumeragi consensus mode',
    pattern: /\bsumeragi\.consensus_mode\b/iu,
  },
  {
    label: 'retired Sumeragi collector setting',
    pattern: /\bsumeragi\.collectors(?:\.[A-Za-z0-9_]+)?\b/iu,
  },
  {
    label: 'retired Sumeragi DA tuning table',
    pattern: /\bsumeragi(?:\.advanced)?\.da\b/iu,
  },
  {
    label: 'retired Sumeragi DA timeout setting',
    pattern: /\b(?:quorum_timeout_multiplier|availability_timeout_floor_ms|availability_timeout_multiplier)\b/iu,
  },
  {
    label: 'retired consensus collector fanout guidance',
    pattern: /\bcollector fanout\b/iu,
  },
  {
    label: 'retired telemetry boolean',
    pattern: /\btelemetry_enabled\s*=/iu,
  },
  {
    label: 'retired Musubi query or instruction name',
    pattern:
      /\b(?:FindMusubi(?:ReleaseByRef|PackageVersions|PackageReleases|ShortAliasByName)|YankMusubiRelease|SetMusubiShortAlias|AssertMusubiReleaseExists)\b/u,
  },
  {
    label: 'retired Musubi CLI workflow',
    pattern:
      /(?:\bcargo\s+run\b[^\n]*\s-p\s+musubi\s+--\s+(?:install|pack)\b|\bmusubi\s+(?:install|pack)\b|\bmusubi\b[^\n]*--gateway-provider\b|\bmusubi\b[^\n]*\bpublish\b[^\n]*--dry-run\b)/iu,
  },
  {
    label: 'retired irohad executable or route',
    pattern:
      /(?:^\s*(?:\$\s*)?irohad(?:\s|$)|--bin\s+irohad\b|(?:target\/(?:debug|release)|\/usr\/local\/bin)\/irohad\b|\birohad-cli\b)/iu,
  },
  {
    label: 'unsupported FastPQ auto mode',
    pattern:
      /(?:--fastpq-(?:execution|poseidon)-mode\s+auto\b|\b(?:execution_mode|poseidon_mode)\s*=\s*[^\n]*\bauto\b)/iu,
  },
  {
    label: 'unsupported node_modules native SDK build',
    pattern: /\bnode_modules\/@iroha\/iroha-js\b/iu,
  },
  { label: 'retired network snippet command', pattern: /\bpnpm\s+get-snippets\b/iu },
  { label: 'outdated documentation Node.js runtime', pattern: /\bNode\.js\s+18\+/u },
]

const SCANNED_EXTENSIONS = new Set(['.json', '.md', '.mts', '.scss', '.toml', '.ts', '.vue', '.yaml', '.yml'])
const EXCLUDED_DIRECTORIES = new Set(['.cache', '.git', '.venv-translate', 'dist', 'node_modules'])
const EXCLUDED_FILES = new Set([
  'etc/validate-content-policy.ts',
  'etc/validate-content-policy.spec.ts',
  'src/public/openapi/torii.json',
])
// These files are verbatim generated source artifacts. Their exact bytes and
// source state are enforced by validate:provenance instead of prose policy.
const EXCLUDED_PATH_PREFIXES = ['src/snippets/']
const TAIRA_SORAFS_ROUTE = /^src\/(?:[a-z]+(?:-[a-z]+)?\/)?blockchain\/sora-nexus-services\.md$/u
const TAIRA_SORAFS_REQUIRED_TOKENS = [
  'fc56984b-2be7-431d-840e-21514d1883f0',
  '369',
  'hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94',
  'https://taira.sora.org',
  'https://taira-validator-1.sora.org',
  'https://taira-validator-2.sora.org',
  'https://taira-validator-3.sora.org',
  'https://taira-validator-4.sora.org',
  'torii_gateway',
  'chunk_range_fetch',
  'potr_mldsa',
  '[sorafs.storage]\nenabled = false',
  'max_capacity_bytes = 13743895347',
  '[sorafs.discovery]\ndiscovery_enabled = true',
  '[sorafs.discovery.admission]\nenvelopes_dir = "configs/soranexus/taira/sorafs_admission"',
  'trusted_council_keys = ["REPLACE_WITH_TAIRA_SORAFS_COUNCIL_PUBLIC_KEY"]',
  'signature_threshold = "REPLACE_WITH_TAIRA_SORAFS_COUNCIL_SIGNATURE_THRESHOLD"',
  '[sorafs.gateway]\nrequire_manifest_envelope = true',
  'enforce_admission = true',
  'enforce_capabilities = true',
  '[sorafs.gateway.untrusted_hosting]\nenabled = true',
  'path_gateway_redirect = true',
  'redirect_html_only = true',
  '[sorafs.gateway.untrusted_hosting.cid_host_suffixes]',
  'live = "sorafs.sora.org"',
  'taira = "sorafs.taira.sora.org"',
  '[sorafs.repair]\nenabled = false',
  'claim_ttl_secs = 900',
  'heartbeat_interval_secs = 60',
  'max_attempts = 3',
  'worker_concurrency = 4',
  '[sorafs.gc]\nenabled = false',
  'interval_secs = 900',
  'max_deletions_per_run = 500',
  'retention_grace_secs = 86400',
  'sorafs.taira.sora.org',
  'require_council_signatures = false',
] as const

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      if (entry.isDirectory()) {
        if (
          EXCLUDED_DIRECTORIES.has(entry.name) ||
          entry.name.startsWith('.iroha-docs-translation-') ||
          (entry.name === 'cache' && directory.endsWith('.vitepress'))
        )
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
    if (EXCLUDED_FILES.has(relative) || EXCLUDED_PATH_PREFIXES.some((prefix) => relative.startsWith(prefix))) continue

    const content = await readFile(file, 'utf8')
    const lines = content.split(/\r?\n/u)
    for (const [index, line] of lines.entries()) {
      for (const term of FORBIDDEN_TERMS) {
        term.pattern.lastIndex = 0
        if (term.pattern.test(line)) errors.push(`${relative}:${index + 1}: ${term.label}`)
      }
    }

    if (path.extname(file) === '.md') {
      const openContainers: Array<{ keyword: string; lineIndex: number }> = []
      for (const directive of markdownContainerDirectives(content)) {
        if (directive.keyword) {
          openContainers.push({ keyword: directive.keyword, lineIndex: directive.lineIndex })
          continue
        }
        if (openContainers.length > 0) {
          openContainers.pop()
        } else {
          errors.push(`${relative}:${directive.lineIndex + 1}: unmatched Markdown container closing directive`)
        }
      }
      for (const directive of openContainers) {
        errors.push(
          `${relative}:${directive.lineIndex + 1}: unclosed Markdown container directive ${directive.keyword}`,
        )
      }
    }

    if (TAIRA_SORAFS_ROUTE.test(relative)) {
      const missing = TAIRA_SORAFS_REQUIRED_TOKENS.filter((token) => !content.includes(token))
      if (missing.length > 0)
        errors.push(`${relative}: incomplete canonical Taira SoraFS profile (${missing.join(', ')})`)
      if (content.includes('https://{cid}.sorafs.sora.org')) {
        errors.push(`${relative}: production SoraFS content origin used for Taira`)
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
