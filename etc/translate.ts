import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import { createHash } from 'node:crypto'
import { copyFile, mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createInterface, type Interface as ReadlineInterface } from 'node:readline'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { slugify } from '@mdit-vue/shared'
import MarkdownIt from 'markdown-it'
import { unexpectedWritingScripts } from './i18n-writing-scripts'
import { TRANSLATED_LOCALES, type DocsLocale } from './locales'

const TRANSLATE_ENDPOINT = 'https://translate.googleapis.com/translate_a/single'
const GOOGLE_TRANSLATION_ENGINE = 'google-translate'
const BING_TRANSLATOR_PAGE = 'https://www.bing.com/translator'
const BING_TRANSLATE_ENDPOINT = 'https://www.bing.com/ttranslatev3'
const BING_TRANSLATION_ENGINE = 'bing-translator-llm'
const BING_REQUEST_TIMEOUT_MS = 30_000
const BING_BATCH_CONCURRENCY = 4
const NLLB_TRANSLATION_ENGINE = 'nllb-200-ct2'
const TRANSLATION_STATUS = 'machine-validated'
const MAX_REQUEST_CHARACTERS = 3_500
const MAX_ATTEMPTS = 6

const TECHNICAL_TERM_PATTERN =
  /\b(?:CTranslate2|Docker Compose|Hyperledger Iroha|Iroha 3|LF Decentralized Trust|NLLB-200|Node\.js|SORA Nexus|Android|Docker|Hyperledger|Iroha|Kagami|Kaigi|KeePassXC|Kotodama|Kotlin|Kura|Minamoto|Musubi|Nexus|Norito|pnpm|Python|Rust|rustup|SoraDNS|SoraFS|SoraNet|Soracloud|Sumeragi|Swift|Taira|Torii|VitePress|cargo|curl|git|jq|npm|rustc|systemd|yarn)\b/gu
const CAMEL_CASE_IDENTIFIER_PATTERN = /\b[A-Z][a-z]+(?:[A-Z][A-Za-z0-9]*)+\b/gu
const UPPERCASE_IDENTIFIER_PATTERN = /\b[A-Z][A-Z0-9]+(?:[-/][A-Z0-9]+(?=$|[^\p{L}\p{N}_]))*(?:s)?\b/gu
const DOMAIN_NAME_PATTERN = /\b(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}\b/giu
const TRANSLATABLE_PROSE_ACRONYMS = new Set(['ID', 'IDs'])
const PROSE_EXAMPLE_IDENTIFIERS = ['Mouse', 'Alice', 'Mad Hatter'] as const
const PROSE_EXAMPLE_IDENTIFIER_PATTERN = /\b(?:Mouse|Alice|Mad Hatter)\b/gu
export const PRESERVED_TECHNICAL_LINK_LABELS: ReadonlySet<string> = new Set([
  'CLI README',
  'Grant/Revoke',
  'Iroha CLI',
  'JavaScript / TypeScript',
  'JavaScript / TypeScript SDK',
  'JavaScript/TypeScript',
  'Kagami README',
  'Kotlin / JVM',
  'Kotlin SDK README',
  'Kotlin/Java',
  'LF Decentralized Trust Discord',
  'Log/Custom/Upgrade',
  'Mint/Burn',
  'Norito crate README',
  'Python SDK',
  'SetKeyValue/RemoveKeyValue',
  'Stack Overflow',
  'Swift / iOS',
  'Wallet Connect',
])

export function isPreservedTechnicalLinkLabel(label: string): boolean {
  return PRESERVED_TECHNICAL_LINK_LABELS.has(label)
}

function shouldProtectUppercaseIdentifier(value: string): boolean {
  return !TRANSLATABLE_PROSE_ACRONYMS.has(value)
}

/**
 * Give machine translators an unambiguous software sense for jargon that is
 * otherwise routinely rendered as a physical object. Markdown literals and
 * URL/path segments are excluded so checked-in technical syntax is unchanged.
 */
export function clarifyTechnicalTranslationSource(source: string): string {
  const protectedSource = protectMachineTranslationLiterals(source)
  const humanCallContext =
    /\b(?:Kaigi|WebRTC|audio|video|phone|telephone|meeting|conference|margin call)\b/iu.test(source) ||
    /\bcall (?:metadata|record|roster|ID|lifecycle|creation|name|room|participant|relay|signal(?:ing)?)\b/iu.test(
      source,
    )
  let clarified = protectedSource.masked
    .replace(/\bpinned commits?\b/giu, (value) =>
      /s$/iu.test(value) ? 'pinned source-code revisions' : 'pinned source-code revision',
    )
    .replace(/\bfull release commit\b/giu, 'full release source-code revision')
    .replace(/\brelease commit\b/giu, 'release source-code revision')
    .replace(/\braw commit object\b/giu, 'raw source-code revision object')
    .replace(/\bcommit IDs?\b/giu, 'source-code revision IDs')
    .replace(/\bcommit hashes?\b/giu, 'source-code revision hashes')
    .replace(/\bGit commits?\b/giu, 'Git revisions')
    .replace(/\bcommit\/tag\b/giu, 'source-code revision or tag')
    .replace(/\bIroha commit\b/giu, 'Iroha source-code revision')
    .replace(/\blogs, or commits\b/giu, 'logs, or source-code revisions')
    .replace(/\bdo not commit keys to source control\b/giu, (value) =>
      /^[A-Z]/u.test(value) ? 'Do not store keys in source control' : 'do not store keys in source control',
    )
    .replace(/\bcommit agent\b/giu, 'store in source control the agent')
    .replace(/\bcommitted config(?:uration)?\b/giu, 'configuration stored in source control')
    .replace(/\bis committed by signed genesis\b/giu, 'is fixed by signed genesis')
    .replace(/\bregistry-committed\b/giu, 'published in the registry')
    .replace(/\bprepare and commit quorum certificates\b/giu, 'consensus preparation and finalization certificates')
    .replace(/\bcommit certificates?\b/giu, (value) =>
      /s$/iu.test(value) ? 'consensus finalization certificates' : 'consensus finalization certificate',
    )
    .replace(/\bcommit quorums?\b/giu, (value) =>
      /s$/iu.test(value) ? 'consensus finalization quorums' : 'consensus finalization quorum',
    )
    .replace(/\bcommit evidence\b/giu, 'consensus finalization evidence')
    .replace(/\bcommit progress\b/giu, 'consensus finalization progress')
    .replace(/\bcommit paths?\b/giu, (value) =>
      /s$/iu.test(value) ? 'consensus finalization paths' : 'consensus finalization path',
    )
    .replace(/\bcommit markers?\b/giu, (value) =>
      /s$/iu.test(value) ? 'block-finalization markers' : 'block-finalization marker',
    )
    .replace(/\bcommit[- ]roster metadata\b/giu, 'block-finalization roster metadata')
    .replace(/\bcommit votes?\b/giu, (value) =>
      /s$/iu.test(value) ? 'finalization-phase votes' : 'finalization-phase vote',
    )
    .replace(/\ba block commits\b/giu, 'a block is finalized')
    .replace(/\bblocks commit\b/giu, 'blocks are finalized')
    .replace(/\bblock commit\b/giu, 'block finalization')
    .replace(/\bcommitted to a block\b/giu, 'finalized in a block')
    .replace(/\bcommitted under\b/giu, 'cryptographically bound under')
    .replace(/\bcommitted on-chain\b/giu, 'cryptographically bound on-chain')
    .replace(/\bis committed separately\b/giu, 'is cryptographically bound separately')
    .replace(/\bcommits to\b/giu, 'cryptographically binds to')
    .replace(/\buncommitted\b/giu, 'not-yet-finalized')
    .replace(/\bcommitted\b/giu, 'finalized')
    .replace(/\btransactions commit\b/giu, 'transactions are finalized')
    .replace(/\btransaction commits\b/giu, 'transaction is finalized')
    .replace(/\bpeers commit\b/giu, 'network peers finalize')
    .replace(/\bcommit (?=(?:blocks?|transactions?|changes?|state|genesis)\b)/giu, 'finalize ')
    .replace(/\bcommits a block\b/giu, 'finalizes a block')
    .replace(/\bcommit the block\b/giu, 'finalize the block')
    .replace(/\bcommit the transaction\b/giu, 'finalize the transaction')
    .replace(/\bcommitting\b/giu, 'finalizing')
    .replace(
      /\bdigest commits the encoded transfer preimage\b/giu,
      'digest cryptographically binds to the encoded transfer preimage',
    )
    .replace(/\bcommits\b/giu, 'finalizes')
    .replace(/\bdisk commit time\b/giu, 'disk persistence time')
    .replace(/\bcommit\b/giu, 'protocol finalization')
    .replace(/\bcanonically\b/giu, 'in the single protocol-standard form')
    .replace(/\bcanonicality\b/giu, 'compliance with the single protocol-standard form')
    .replace(/\bcanonical\b/giu, 'single protocol-standard')
    .replace(/\bmerge-ledger\b/giu, 'blockchain merge log')
    .replace(/\bledger-objects\b/giu, 'blockchain ledger objects')
    .replace(/\bledger-object\b/giu, 'blockchain ledger object')
    .replace(/\bledger-managed\b/giu, 'managed by the blockchain ledger')
    .replace(/\bledger-backed\b/giu, 'backed by the blockchain ledger')
    .replace(/\bledger-visible\b/giu, 'visible in the blockchain ledger')
    .replace(/\bledger-facing\b/giu, 'interacting with the blockchain ledger')
    .replace(/\bledger-wide scans\b/giu, 'scans across the entire blockchain ledger')
    .replace(/\bledger[- ]technology\b/giu, 'distributed-ledger technology')
    .replace(/\boff-ledger\b/giu, 'outside the blockchain ledger')
    .replace(/\bon-ledger\b/giu, 'on the blockchain ledger')
    .replace(/\bsigner-provisioning\b/giu, 'cryptographic signing-key provisioning')
    .replace(/\bexternal-signer adapters?\b/giu, (value) =>
      /s$/iu.test(value)
        ? 'external cryptographic signing-service adapters'
        : 'external cryptographic signing-service adapter',
    )
    .replace(/\bTry It on\b/gu, 'Run this workflow on')
    .replace(/\bTry It with\b/gu, 'Run this workflow with')
    .replace(/\bon-wire\b/giu, 'in protocol transmission')
    .replace(/\bwall[- ]clock\b/giu, 'local system clock')
    .replace(
      /\bchain-, authority-, state-, and deadline-bound\b/giu,
      'bound to the chain, transaction authorization identity, blockchain ledger state, and deadline',
    )
    .replace(
      /\bdigest commits the encoded transfer preimage\b/giu,
      'digest cryptographically binds to the encoded transfer preimage',
    )
    .replace(/\bquoted authority-paid fee\b/giu, 'fee price estimate paid by the transaction signing account')
    .replace(/\bauthority-paid\b/giu, 'paid by the transaction signing account')
    .replace(/\bquote guards\b/giu, 'fee-price validation guards')
    .replace(/\bquote guard\b/giu, 'fee-price validation guard')
    .replace(/\bCLI quotes the exact transaction\b/giu, 'CLI calculates the exact transaction fee price')
    .replace(/\bQuote and sign\b/gu, 'Obtain a fee price estimate and sign')
    .replace(/\bquote and sign\b/gu, 'obtain a fee price estimate and sign')
    .replace(
      /\bquoted, versioned transaction scaffold\b/giu,
      'versioned transaction starter structure with a fee price estimate',
    )
    .replace(/\bquoted and signed transactions\b/giu, 'signed transactions with fee price estimates')
    .replace(/\bquoted and signed transaction\b/giu, 'signed transaction with a fee price estimate')
    .replace(/\bquoted and signed payload\b/giu, 'signed payload with a fee price estimate')
    .replace(/\bquoted, signed transactions\b/giu, 'signed transactions with fee price estimates')
    .replace(/\bquoted, signed transaction\b/giu, 'signed transaction with a fee price estimate')
    .replace(/\bquoted transactions\b/giu, 'transactions with fee price estimates')
    .replace(/\bquoted transaction\b/giu, 'transaction with a fee price estimate')
    .replace(/\bquoted fees\b/giu, 'fee price estimates')
    .replace(/\bquoted fee\b/giu, 'fee price estimate')
    .replace(/\bpublic-network\b/giu, 'public blockchain network')
    .replace(/\blocally built\b/giu, 'built in the local development environment')
    .replace(/\bRejection burst\b/gu, 'Spike of repeated rejections')
    .replace(
      /\binstructing and instructed agent BICs\b/giu,
      'BICs of the instructing and instructed financial institutions',
    )
    .replace(/\btime events\b/giu, 'time-based event notifications')
    .replace(/\bEvents are emitted\b/gu, 'Typed event notifications are emitted')
    .replace(/(?<!API )(?<![\p{L}\p{N}_/.`<>-])endpoints(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'API endpoints')
    .replace(/(?<!API )(?<![\p{L}\p{N}_/.`<>-])endpoint(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'API endpoint')
    .replace(
      /(?<!software )(?<![\p{L}\p{N}_/.`<>-])runtimes(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'software execution environments',
    )
    .replace(
      /(?<!software )(?<![\p{L}\p{N}_/.`<>-])runtime(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'software execution environment',
    )
    .replace(
      /(?<!blockchain )(?<![\p{L}\p{N}_/.`<>-])genesis(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'blockchain genesis',
    )
    .replace(/(?<!network )(?<![\p{L}\p{N}_/.`<>-])peers(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'network peers')
    .replace(/(?<!network )(?<![\p{L}\p{N}_/.`<>-])peer(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'network peer')
    .replace(
      /(?<!blockchain )(?<![\p{L}\p{N}_/.`<>-])ledgers(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'blockchain ledgers',
    )
    .replace(
      /(?<!blockchain )(?<![\p{L}\p{N}_/.`<>-])ledger(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'blockchain ledger',
    )
    .replace(/(?<!execution )(?<![\p{L}\p{N}_/.`<>-])lanes(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'execution lanes')
    .replace(/(?<!execution )(?<![\p{L}\p{N}_/.`<>-])lane(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'execution lane')
    .replace(
      /(?<![\p{L}\p{N}_/.`<>-])transaction gas(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'transaction execution cost',
    )
    .replace(/(?<![\p{L}\p{N}_/.`<>-])gas(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'transaction execution cost')
    .replace(
      /transaction signatures and limits are valid/giu,
      'transaction signatures and limits satisfy the protocol rules',
    )
    .replace(
      /(?<!consensus )(?<![\p{L}\p{N}_/.`<>-])quorum certificates(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'consensus quorum certificates',
    )
    .replace(
      /(?<!consensus )(?<![\p{L}\p{N}_/.`<>-])quorum certificate(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'consensus quorum certificate',
    )
    .replace(
      /(?<!consensus )(?<![\p{L}\p{N}_/.`<>-])commit certificate(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'consensus commit certificate',
    )
    .replace(
      /(?<!consensus )(?<![\p{L}\p{N}_/.`<>-])pacemaker(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'consensus pacemaker',
    )
    .replace(/(?<![\p{L}\p{N}_/.`])test fixtures?(?![\p{L}\p{N}_/.`])/giu, 'test artifacts')
    .replace(/(?<![\p{L}\p{N}_/.`])fixtures(?![\p{L}\p{N}_/.`])/giu, 'test artifacts')
    .replace(/(?<![\p{L}\p{N}_/.`])fixture(?![\p{L}\p{N}_/.`])/giu, 'test artifact')
    .replace(/(?<![\p{L}\p{N}_/.`])harness(?:es)?(?![\p{L}\p{N}_/.`])/giu, 'test runner')
    .replace(/(?<![\p{L}\p{N}_/.`])crates(?![\p{L}\p{N}_/.`])/giu, 'software packages')
    .replace(/(?<![\p{L}\p{N}_/.`])crate(?![\p{L}\p{N}_/.`])/giu, 'software package')
    .replace(/(?<![\p{L}\p{N}_/.`])snapshots(?![\p{L}\p{N}_/.`])/giu, 'point-in-time data views')
    .replace(/(?<![\p{L}\p{N}_/.`])snapshot(?![\p{L}\p{N}_/.`])/giu, 'point-in-time data view')
    .replace(/(?<![\p{L}\p{N}_/.`])boilerplate(?![\p{L}\p{N}_/.`])/giu, 'repetitive template code')
    .replace(/(?<![\p{L}\p{N}_/.`])sidecars(?![\p{L}\p{N}_/.`])/giu, 'auxiliary records')
    .replace(/(?<![\p{L}\p{N}_/.`])sidecar(?![\p{L}\p{N}_/.`])/giu, 'auxiliary record')
    .replace(
      /(?<![\p{L}\p{N}_/.`<>-])sustainable envelope(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'sustainable operating limit',
    )
    .replace(
      /(?<!technical )(?<![\p{L}\p{N}_/.`<>-])manifests(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'technical manifests',
    )
    .replace(
      /(?<!technical )(?<![\p{L}\p{N}_/.`<>-])manifest(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'technical manifest',
    )
    .replace(
      /(?<!software )(?<![\p{L}\p{N}_/.`<>-])wrappers(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'software adapters',
    )
    .replace(
      /(?<!software )(?<![\p{L}\p{N}_/.`<>-])wrapper(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'software adapter',
    )
    .replace(/(?<![\p{L}\p{N}_/.`<>-])wrapping(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'encapsulating')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])envelopes(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'data containers')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])envelope(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'data container')
    .replace(
      /(?<!cryptographic )(?<![\p{L}\p{N}_/.`<>-])nonce(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'cryptographic nonce value',
    )
    .replace(
      /(?<!cryptographic )(?<![\p{L}\p{N}_/.`<>-])nonces(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'cryptographic nonce values',
    )
    .replace(/(?<![\p{L}\p{N}_/.`<>-])authorities(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'authorization principals')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])authority(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'authorization principal')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])receipts(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'protocol result records')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])receipt(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'protocol result record')
    .replace(
      /(?<![\p{L}\p{N}_/.`<>-])boxed finalization instruction(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'type-erased finalization instruction',
    )
    .replace(
      /(?<![\p{L}\p{N}_/.`])carrier(?!\s+transactions?\b)(?![\p{L}\p{N}_/`]|\.[\p{L}\p{N}])/giu,
      'container transaction',
    )
    .replace(
      /(?<![\p{L}\p{N}_/.`])carriers(?!\s+transactions?\b)(?![\p{L}\p{N}_/`]|\.[\p{L}\p{N}])/giu,
      'container transactions',
    )
    .replace(
      /(?<![Aa]sset )(?<![\p{L}\p{N}_/.`<>-])Balance Scopes(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/gu,
      'Asset balance scopes',
    )
    .replace(
      /(?<![Aa]sset )(?<![\p{L}\p{N}_/.`<>-])Balance Scope(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/gu,
      'Asset balance scope',
    )
    .replace(
      /(?<![Aa]sset )(?<![\p{L}\p{N}_/.`<>-])balance scopes(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/gu,
      'asset balance scopes',
    )
    .replace(
      /(?<![Aa]sset )(?<![\p{L}\p{N}_/.`<>-])balance scope(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/gu,
      'asset balance scope',
    )
    .replace(/(?<![\p{L}\p{N}_/.`<>-])balance buckets(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'balance partitions')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])balance bucket(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'balance partition')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])bucketed(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'partitioned')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])faucet-funded(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'testnet-funded')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])faucets(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'testnet funding services')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])faucet(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'testnet funding service')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])Mintability(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/gu, 'Asset issuance policy')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])mintability(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/gu, 'asset issuance policy')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])minting(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'issuing')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])minted(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'issued')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])mints(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'issues')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])mint(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'issue')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])burning(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'destroying')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])burned(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'destroyed')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])burns(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'destroys')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])burn(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'destroy')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])wire-formats(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'serialization formats')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])wire-format(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'serialization format')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])wire formats(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'serialization formats')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])wire format(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'serialization format')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])wire bytes(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'serialized bytes')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])wire payloads(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'serialized payloads')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])wire payload(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'serialized payload')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])on the wire(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'in protocol transmission')
    .replace(
      /(?<!processing )(?<![\p{L}\p{N}_/.`<>-])pipelines(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'software processing workflows',
    )
    .replace(
      /(?<!processing )(?<![\p{L}\p{N}_/.`<>-])pipeline(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'software processing workflow',
    )
    .replace(
      /(?<!cryptographic )(?<![\p{L}\p{N}_/.`<>-])digests(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'cryptographic digests',
    )
    .replace(
      /(?<!cryptographic )(?<![\p{L}\p{N}_/.`<>-])digest(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'cryptographic digest value',
    )
    .replace(
      /(?<!cryptographic )(?<![\p{L}\p{N}_/.`<>-])hashes(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'cryptographic hashes',
    )
    .replace(
      /(?<!cryptographic )(?<![\p{L}\p{N}_/.`<>-])hash(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'cryptographic hash',
    )
    .replace(
      /(?<!cryptographic )(?<![\p{L}\p{N}_/.`<>-])signers(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'cryptographic signers',
    )
    .replace(
      /(?<!cryptographic )(?<![\p{L}\p{N}_/.`<>-])signer(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'cryptographic signer',
    )
    .replace(
      /(?<!cryptographic )(?<![\p{L}\p{N}_/.`<>-])commitments(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'cryptographic commitment values',
    )
    .replace(
      /(?<!cryptographic )(?<![\p{L}\p{N}_/.`<>-])commitment(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'cryptographic commitment value',
    )
    .replace(/(?<![\p{L}\p{N}_/.`<>-])fee quotes(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'fee price estimates')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])fee quote(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'fee price estimate')
    .replace(
      /(?<![\p{L}\p{N}_/.`<>-])source checkouts(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'source-code working copies',
    )
    .replace(
      /(?<![\p{L}\p{N}_/.`<>-])source checkout(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'source-code working copy',
    )
    .replace(
      /(?<![\p{L}\p{N}_/.`<>-])scaffolds(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'generated starter structures',
    )
    .replace(/(?<![\p{L}\p{N}_/.`<>-])scaffold(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'generated starter structure')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])tombstones(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'durable deletion markers')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])tombstone(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'durable deletion marker')
    .replace(
      /(?<![\p{L}\p{N}_/.`<>-])settlement legs(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'financial transfer parts',
    )
    .replace(
      /(?<![\p{L}\p{N}_/.`<>-])settlement leg(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'financial transfer part',
    )
    .replace(/(?<![\p{L}\p{N}_/.`<>-])legs(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'financial transfer parts')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])leg(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'financial transfer part')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])pools(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'protocol data groups')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])pool(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'protocol data group')
    .replace(
      /(?<!financial transaction )(?<![\p{L}\p{N}_/.`<>-])settlements(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'financial transaction settlements',
    )
    .replace(
      /(?<!financial transaction )(?<![\p{L}\p{N}_/.`<>-])settlement(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu,
      'financial transaction settlement',
    )
    .replace(/(?<![\p{L}\p{N}_/.`<>-])retiring(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'decommissioning')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])retired(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'decommissioned')
    .replace(/(?<![\p{L}\p{N}_/.`<>-])retire(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/giu, 'decommission')
    .replace(
      /(?<![\p{L}\p{N}_/.`<>-])Special Instructions(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/gu,
      'Instruction operations',
    )
    .replace(
      /(?<![\p{L}\p{N}_/.`<>-])special instructions(?![\p{L}\p{N}_/`<>-]|\.[\p{L}\p{N}])/gu,
      'instruction operations',
    )
  if (!humanCallContext) {
    clarified = clarified
      .replace(/\bcallers\b/giu, 'requesting clients')
      .replace(/\bcaller\b/giu, 'requesting client')
      .replace(/\bcalls the\b/giu, 'invokes the')
      .replace(/\bcall the\b/giu, 'invoke the')
      .replace(/\bcall it\b/giu, 'invoke it')
      .replace(/\bto call\b/giu, 'to invoke')
      .replace(/\band call\b/giu, 'and invoke')
      .replace(/\bthen call\b/giu, 'then invoke')
      .replace(/\bdo not call\b/giu, 'do not send a request to')
      .replace(/\bCall (?=(?:the|an?|this|that)\b)/gu, 'Invoke ')
      .replace(/\bhost calls\b/giu, 'host-function invocations')
      .replace(/\bcontract calls\b/giu, 'contract invocations')
      .replace(/\bread-only calls\b/giu, 'read-only API requests')
      .replace(/\bservice calls\b/giu, 'service API requests')
      .replace(/\bnetwork calls\b/giu, 'network requests')
      .replace(/\bcalls\b/giu, 'technical invocations')
      .replace(/\bcall\b/giu, 'technical invocation')
  }

  // `API` is deliberately protected as a technical acronym, so its marker
  // hides the prefix from the endpoint lookbehind above. Collapse only the
  // exact clarification duplicate after restoring literals; this also keeps
  // repeated clarification idempotent for already explicit source wording.
  return protectedSource
    .restore(clarified)
    .replace(/\bAPI API endpoints\b/gu, 'API endpoints')
    .replace(/\bAPI API endpoint\b/gu, 'API endpoint')
    .replace(/\bsoftware execution environment environment\b/giu, 'software execution environment')
    .replace(/\bconsensus finalization consensus quorum\b/giu, 'consensus finalization quorum')
    .replace(/\bcryptographic commitment value cryptographic hash\b/giu, 'cryptographic hash of the binding value')
}

const GOOGLE_LANGUAGE_CODES: Readonly<Record<string, string>> = {
  'zh-hans': 'zh-CN',
  'zh-hant': 'zh-TW',
}

const CURATED_EXACT_TRANSLATIONS: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  am: {
    'Deterministic blockchain platform for SORA Nexus, SDKs, and operator workflows':
      'ዲተርሚኒስቲክ ብሎክቼይን መድረክ ለ SORA Nexus፣ SDKs እና ኦፕሬተር የስራ ፍሰቶች',
    'Activation fails closed unless the governed capability is active, its state and activation heights satisfy the notice period, the compiled proof profile matches V1, and the on-chain pool and audit records are current. Enabling the configuration flag alone is insufficient.':
      'የሚተዳደረው ብቃት ንቁ ካልሆነ፣ የሁኔታ እና የማግበሪያ ቁመቶቹ የማስታወቂያ ጊዜውን ካላሟሉ፣ የተጠናቀረው የማረጋገጫ መገለጫ ከ V1 ጋር ካልተዛመደ ወይም በሰንሰለት ላይ ያሉት የፑል እና የኦዲት መዝገቦች ወቅታዊ ካልሆኑ፣ ማግበሪያው በአስተማማኝ ሁኔታ ውድቅ ይሆናል። የውቅር ባንዲራውን ብቻ ማንቃት በቂ አይደለም።',
    '`[nexus.atomic_private_settlement]` governs the separate `AtomicPrivateSettlementV1` path. It is disabled by default. Setting `enabled = true` also requires an `activation_height`; admission still fails closed unless the on-chain capability, notice period, fixed proof profile, and pool/audit governance are active.':
      '`[nexus.atomic_private_settlement]` የተለየውን `AtomicPrivateSettlementV1` መንገድ ይቆጣጠራል። በነባሪ ጠፍቷል። `enabled = true` ማድረግ `activation_height`ንም ይጠይቃል፤ በሰንሰለት ላይ ያለው ብቃት፣ የማስታወቂያ ጊዜ፣ የተወሰነው የማረጋገጫ መገለጫ እና የፑል/ኦዲት አስተዳደር ንቁ ካልሆኑ፣ መግቢያው በአስተማማኝ ሁኔታ ውድቅ ይሆናል።',
    '| `POST /v1/offline/receiver-lineage` | Resolve proof-bearing active registration lineage for a signed receiver request |':
      '| `POST /v1/offline/receiver-lineage` | ለተፈረመ ተቀባይ ጥያቄ ማረጋገጫ ያለውን ንቁ የምዝገባ ተከታታይነት ይፍቱ |',
    "The trigger authority is the account used to invoke the executable. Use a dedicated technical account for long-lived triggers so the required permissions are explicit and isolated from an operator's personal account.":
      'የቀስቅሴው የፈቃድ ባለቤት ፈጻሚውን ለመጥራት የሚጠቀመው መለያ ነው። የሚፈለጉት ፈቃዶች ግልጽ እንዲሆኑ እና ከኦፕሬተሩ የግል መለያ እንዲለዩ፣ ለረጅም ጊዜ ለሚኖሩ ቀስቅሴዎች የተለየ ቴክኒካዊ መለያ ይጠቀሙ።',
    'If you need a new organizational dataspace, prepare a catalog and routing proposal instead of trying to register it from an ordinary client account. See [Provision a New Dataspace](#_8-provision-a-new-dataspace) below.':
      'አዲስ ድርጅታዊ የመረጃ ቦታ ካስፈለገዎት፣ ከመደበኛ የደንበኛ መለያ ለመመዝገብ ከመሞከር ይልቅ የካታሎግ እና የማስተላለፊያ ፕሮፖዛል ያዘጋጁ። ከታች [አዲስ የመረጃ ቦታ ያቅርቡ](#_8-provision-a-new-dataspace) ይመልከቱ።',
    'Publish performance numbers only with enough context to reproduce them:':
      'የአፈጻጸም ቁጥሮችን እንደገና ለማግኘት የሚያስችል በቂ አውድ ሲኖር ብቻ ያትሙ፦',
    '- Generate fresh private keys for production and store them outside the repository.':
      '- ለምርት አካባቢ አዲስ የግል ቁልፎችን ያመንጩ እና ከኮድ ማከማቻው ውጭ ያከማቹ።',
    '- Keep local development, shared testnet, and production configuration separate.':
      '- የአካባቢ ልማት፣ የጋራ ሙከራ መረብ እና የምርት አካባቢ ውቅሮችን ተለያይተው ይያዙ።',
    '- Configuration is environment-specific and does not contain test-only secrets.':
      '- ውቅሩ ለየአካባቢው የተለየ ነው፣ ለሙከራ ብቻ የሚያገለግሉ ሚስጥሮችንም አይዝም።',
    '3. **Detect** suspicious behavior with deterministic rules, reviewer queues, or risk scoring.':
      '3. **ይለዩ።** አጠራጣሪ ባህሪን በውጤታቸው ቋሚ በሆኑ ደንቦች፣ በገምጋሚ ወረፋዎች ወይም በአደጋ ደረጃ አሰጣጥ ይለዩ።',
    '- Preserve the deterministic behavior of the network. Hardware acceleration must not change peer-visible results.':
      '- የአውታረ መረቡን የማይለዋወጥ ባህሪ ይጠብቁ። የሃርድዌር ማፋጠኛ በእኩዮች የሚታዩ ውጤቶችን መቀየር የለበትም።',
    '- Give people and processes access only to the keys required by their role.':
      '- ሰዎች እና ሂደቶች በሚናቸው የሚፈለጉትን ቁልፎች ብቻ እንዲደርሱባቸው ያድርጉ።',
    'When developing against a checked-out workspace, point SwiftPM at the local `IrohaSwift/` package directory. The package identity used by `Package.swift` is `IrohaSwift`:':
      'ከተወረደ የሥራ ቦታ ቅጂ ጋር ሲያበለጽጉ፣ SwiftPMን ወደ አካባቢያዊው `IrohaSwift/` የጥቅል ማውጫ ይጠቁሙ። `Package.swift` የሚጠቀመው የጥቅል መለያ `IrohaSwift` ነው፦',
    'For a private network, use its configured discriminant explicitly with `--network-prefix`.':
      'ለግል አውታረ መረብ፣ የተዋቀረውን ልዩ መለያ በ `--network-prefix` በግልጽ ይጠቀሙ።',
    'When converting an existing address between explicit contexts, also supply the source with `--expect-prefix`:':
      'አንድን ነባር አድራሻ በግልጽ አውዶች መካከል ሲቀይሩ፣ ምንጩንም በ `--expect-prefix` ያቅርቡ፦',
    'The key payload must also be structurally valid for the algorithm selected by the declared `CurveId`.':
      'የቁልፉ ጭነት በታወጀው `CurveId` ለተመረጠው አልጎሪዝም በመዋቅርም ትክክለኛ መሆን አለበት።',
    '| `#[norito(skip_serializing_if = "...")]` | Omits fields from JSON when the predicate matches, while preserving deterministic decoding defaults. |':
      '| `#[norito(skip_serializing_if = "...")]` | መስፈርቱ ሲሟላ የ JSON መስኮችን ይተዋል፣ የማይለዋወጡ የዲኮዲንግ ነባሪዎችንም ይጠብቃል። |',
    'Lifecycle authorization is derived from that immutable record rather than from caller-selected values:':
      'የሕይወት ዑደት ፈቃድ በጠሪው ከተመረጡ እሴቶች ሳይሆን ከዚያ የማይለወጥ መዝገብ ይመነጫል፦',
    'For a shielded-to-shielded transfer, the proof also enforces value conservation:':
      'ከተከለለ ወደ ተከለለ ዝውውር፣ ማረጋገጫው የእሴት መጠን እንዲጠበቅም ያስገድዳል፦',
    '- `id`: an `AssetId`, which combines the asset definition, holder account, and optional balance scope':
      '- `id`፦ የንብረት ፍቺውን፣ የያዡን መለያ እና አማራጭ የቀሪ ሒሳብ ወሰን የሚያጣምር `AssetId`',
    'Creating or removing a domain requires the appropriate domain-management permission under the active runtime validator. Domain metadata can be updated with [`SetKeyValue` and `RemoveKeyValue`](/blockchain/instructions.md#setkeyvalue-removekeyvalue) when the authority has permission to modify that domain.':
      'ጎራን ለመፍጠር ወይም ለማስወገድ በንቁ የአፈጻጸም አካባቢ አረጋጋጭ ሥር ተገቢው የጎራ አስተዳደር ፈቃድ ያስፈልጋል። ባለሥልጣኑ ያንን ጎራ የማሻሻል ፈቃድ ሲኖረው፣ የጎራውን ሜታዳታ በ [`SetKeyValue` እና `RemoveKeyValue`](/am/blockchain/instructions.md#setkeyvalue-removekeyvalue) ማዘመን ይቻላል።',
    'For the underlying shielded transaction model, see [Anonymous Transactions](/blockchain/anonymous-transactions.md).':
      'ለመሠረታዊው የተከለለ ግብይት ሞዴል [ስም-አልባ ግብይቶች](/am/blockchain/anonymous-transactions.md)ን ይመልከቱ።',
    'Transparent numeric transfers create a structured transfer transcript when the instruction mutates balances. The transcript records:':
      'መመሪያው ቀሪ ሒሳቦችን ሲቀይር፣ ግልጽ የቁጥር ዝውውሮች የተዋቀረ የዝውውር መዝገብ ይፈጥራሉ። መዝገቡ የሚከተሉትን ይመዘግባል፦',
    'Let `omega_T` be the trace-domain generator, `omega_E` the evaluation-domain generator, and `g` the configured coset offset. For a trace column with values `v_i`, interpolation produces coefficients `a_j` such that:':
      '`omega_T` የመከታተያ ጎራ አመንጪ፣ `omega_E` የግምገማ ጎራ አመንጪ እና `g` የተዋቀረው የኮሴት ማካካሻ ይሁን። `v_i` እሴቶች ላሉት የመከታተያ አምድ፣ ኢንተርፖሌሽኑ የሚከተለውን የሚያሟሉ `a_j` ቅንጅቶችን ያመነጫል፦',
    'RWA lots are created through the dedicated `RegisterRwa` instruction. The current code does not expose an `UnregisterRwa` instruction; use `RedeemRwa` to retire represented quantity.':
      'የ RWA ሎቶች በተለየው `RegisterRwa` መመሪያ ይፈጠራሉ። የአሁኑ ኮድ የ `UnregisterRwa` መመሪያ አያቀርብም፤ የተወከለውን መጠን ከዝውውር ለማስወገድ `RedeemRwa`ን ይጠቀሙ።',
    "Remove the example NFT after the walkthrough. If you transferred it, either transfer it back or submit the unregister command with the current owner's account configuration.":
      'መመሪያውን ከጨረሱ በኋላ የምሳሌውን NFT ያስወግዱ። ካስተላለፉት ወደ ነበረበት ይመልሱት ወይም የአሁኑን ባለቤት መለያ ውቅር ተጠቅመው የምዝገባ-ማስወገጃ ትዕዛዙን ያስገቡ።',
    'Permissions exist so that only accounts with the required permission token can perform a protected action. The default executor checks permissions during instruction, query, and expression execution.':
      'ፈቃዶች ያሉት አስፈላጊው የፈቃድ ቶከን ያላቸው መለያዎች ብቻ የተጠበቀ ተግባር እንዲፈጽሙ ነው። ነባሪው አስፈጻሚ መመሪያዎች፣ መጠይቆች እና ኤክስፕሬሽኖች ሲፈጸሙ ፈቃዶችን ይፈትሻል።',
    'To encrypt a plaintext polynomial \\(m\\), the implementation seeds another ChaCha20 RNG from:':
      'የግልጽ ጽሑፍ ፖሊኖሚያል \\(m\\)ን ለማመስጠር፣ አተገባበሩ ለሌላ ChaCha20 RNG ከሚከተሉት የመነሻ ዘር ይሰጣል፦',
    'Identifier resolution does not use the generic backend `opaque_hash` as the user-facing opaque account identifier. It projects the RAM-LFE output hash through identifier-specific domains:':
      'የመለያ መፍታት አጠቃላዩን የጀርባ ሥርዓት `opaque_hash` ለተጠቃሚው የሚታይ ግልጽ ያልሆነ የመለያ መታወቂያ አድርጎ አይጠቀምም። የ RAM-LFE የውጤት ሃሽን በመለያ-ተኮር ጎራዎች ይቀይረዋል፦',
    'There is no `UnregisterRwa` instruction in the current code. Retire an off-chain lot with `RedeemRwa` when the represented quantity is delivered, consumed, settled, or otherwise removed from circulation.':
      'በአሁኑ ኮድ ውስጥ የ `UnregisterRwa` መመሪያ የለም። የተወከለው መጠን ሲደርስ፣ ጥቅም ላይ ሲውል፣ ሲጠናቀቅ ወይም በሌላ መንገድ ከዝውውር ሲወጣ፣ ከሰንሰለት ውጭ ያለውን ሎት በ `RedeemRwa` ከዝውውር ያስወግዱ።',
    'SoraFS publication produces durable artifacts before a name points at them:':
      'SoraFS ሕትመት አንድ ስም ወደ እነሱ ከመጠቆሙ በፊት ዘላቂ አርቲፋክቶችን ይፈጥራል፦',
    'The Taira validators have embedded SoraFS storage, repair, and garbage collection disabled. Their configured capacity remains part of the validator disk-budget check; it does not mean that the validator is a storage provider. Use `GET /v1/sorafs/storage/peers?limit=4` to read the current configured gateway and pin destinations before a test.':
      'የ Taira አረጋጋጮች አብሮገነብ SoraFS ማከማቻ፣ ጥገና እና የቆሻሻ ማሰባሰብ አገልግሎት ተሰናክሏል። የተዋቀረው አቅማቸው የአረጋጋጩ የዲስክ በጀት ፍተሻ አካል ሆኖ ይቀራል፤ ይህ ግን አረጋጋጩ የማከማቻ አቅራቢ ነው ማለት አይደለም። ከሙከራ በፊት የአሁኑን የተዋቀረ ጌትዌይ እና የማጣበቂያ መዳረሻዎችን ለማንበብ `GET /v1/sorafs/storage/peers?limit=4`ን ይጠቀሙ።',
    'Trigger registration itself is a normal transaction, so the registering account needs permission to register triggers. The technical account needs the permissions required by the trigger executable.':
      'ቀስቅሴን መመዝገብ ራሱ መደበኛ ግብይት ስለሆነ፣ መዝጋቢው መለያ ቀስቅሴዎችን የመመዝገብ ፈቃድ ያስፈልገዋል። ቴክኒካዊው መለያ ደግሞ የቀስቅሴው ፈጻሚ የሚፈልጋቸውን ፈቃዶች ያስፈልገዋል።',
    'Use `/livez` only to decide whether the process answers. Use `/readyz` for traffic admission and inspect its JSON blocker details before treating a `503` as an outage.':
      'ሂደቱ ምላሽ መስጠቱን ለማወቅ `/livez`ን ብቻ ይጠቀሙ። ትራፊክን ለመቀበል `/readyz`ን ይጠቀሙ፤ `503`ን እንደ መቋረጥ ከመቁጠርዎ በፊት የ JSON የማገጃ ዝርዝሮቹን ይመርምሩ።',
    'The `$` separator belongs to the NFT text form. Keep the complete `wonderland.universal` domain and dataspace suffix.':
      'የ `$` መለያያ የ NFT ጽሑፍ ቅርጽ አካል ነው። ሙሉውን `wonderland.universal` የጎራ እና የመረጃ ቦታ ቅጥያ ይጠብቁ።',
    'Use a second client configuration for the delegate when proving the write:':
      'የመጻፍ ክዋኔውን ሲያረጋግጡ ለውክልና ተቀባዩ ሁለተኛ የደንበኛ ውቅር ይጠቀሙ፦',
    'Roles and their grants do not expire. Revoke them explicitly when the access is no longer needed.':
      'ሚናዎች እና በእነሱ የተሰጡ ፈቃዶች ጊዜያቸው አያልፍም። መዳረሻው ሳያስፈልግ ሲቀር በግልጽ ይሰርዟቸው።',
    'Generated snippets keep examples tied to code, configuration, and schemas from the Iroha revision that produced them.':
      'የመነጩ ቅንጥቦች ምሳሌዎችን ካመነጫቸው የ Iroha ክለሳ ኮድ፣ ውቅር እና ስኪማዎች ጋር እንደተያያዙ ያቆያሉ።',
    'All production behavior comes from the node configuration. Environment variables cannot activate this path. The shipped default is `enabled = false`; leaving the feature disabled requires no settlement-specific configuration.':
      'ሁሉም የምርት አካባቢ ባህሪ ከኖድ ውቅሩ ይመጣል። የአካባቢ ተለዋዋጮች ይህን መንገድ ማንቃት አይችሉም። የተላከው ነባሪ `enabled = false` ነው፤ ባህሪውን እንደተሰናከለ ለመተው ለማጠናቀቂያ የተለየ ውቅር አያስፈልግም።',
    'After governance has registered the required capability and chosen an activation height with adequate notice, configure every relevant node consistently:':
      'አስተዳደሩ አስፈላጊውን ችሎታ ከመዘገበ እና በቂ ማስታወቂያ ያለው የማግበሪያ ብሎክ ቁመት ከመረጠ በኋላ፣ ተዛማጅ ኖዶችን ሁሉ በተመሳሳይ መንገድ ያዋቅሩ፦',
    '- Scope permission tokens to the smallest object that satisfies the workflow.':
      '- የፈቃድ ቶከኖችን የሥራ ፍሰቱን በሚያሟላው ትንሹ ነገር ላይ ብቻ ይገድቡ።',
    '- Enable phishing-resistant multi-factor authentication where it is available.':
      '- በሚገኝበት ቦታ የማስገር ጥቃትን የሚቋቋም ባለብዙ-ደረጃ ማረጋገጫን ያንቁ።',
    'Signatures provide integrity and authorization evidence. They do not encrypt the signed content.':
      'ፊርማዎች የትክክለኛነት እና የፈቃድ ማስረጃ ይሰጣሉ። የተፈረመውን ይዘት አያመሰጥሩም።',
    'The package is not currently available from the public npm registry. Build it from the same pinned Iroha source revision as the node you target:':
      'ጥቅሉ በአሁኑ ጊዜ በሕዝባዊው npm መዝገብ አይገኝም። ያነጣጠሩት ኖድ ከተገነባበት ተመሳሳይ ቋሚ የ Iroha ምንጭ ክለሳ ይገንቡት፦',
    'The demo consumes `@iroha/iroha-js` through the sibling dependency `file:../iroha/javascript/iroha_js`. Build the SDK from the Iroha source checkout before installing the demo:':
      'ማሳያው `@iroha/iroha-js`ን በአጎራባች ጥገኝነት `file:../iroha/javascript/iroha_js` በኩል ይጠቀማል። ማሳያውን ከመጫንዎ በፊት SDKን ከ Iroha ምንጭ የሥራ ቅጂ ይገንቡ፦',
    '`cache repair` quarantines corrupt trusted descendants and refetches exact archives when finalized provider evidence permits it. Pruning is deliberately fail-closed for live non-empty mutation; use `--dry-run` to inspect the classified candidates.':
      '`cache repair` የተበላሹ ታማኝ ወራሾችን ለይቶ ያቆያል፣ እና የተጠናቀቀ የአቅራቢ ማስረጃ ሲፈቅድ ትክክለኛዎቹን ማህደሮች እንደገና ያመጣል። ባዶ ያልሆነ ቀጥታ ለውጥ ሲኖር መከርከሙ ሆን ተብሎ በመዘጋት ይከሽፋል፤ የተመደቡትን እጩዎች ለመመርመር `--dry-run`ን ይጠቀሙ።',
    'If you omit the fee intent, accept a quote for an unexpected asset, alter the payload after quoting, or sign with an unfunded account, the transaction must not be submitted.':
      'የክፍያ ዓላማውን ከተዉ፣ ላልተጠበቀ ንብረት የክፍያ ግምት ከተቀበሉ፣ ከግምቱ በኋላ ጭነቱን ከቀየሩ ወይም ገንዘብ ባልተሞላ መለያ ከፈረሙ፣ ግብይቱን ማስገባት የለብዎትም።',
    '1. There is a number of reserved separators that are used for specific types of constructs:':
      '1. ለተወሰኑ የአወቃቀር ዓይነቶች የሚያገለግሉ በርካታ የተያዙ መለያያዎች አሉ፦',
    '- `compact`: A variant of the default formatter, optimized for short line lengths. Fields from the current span context are appended to the fields of the formatted event, and span names are not shown; the verbosity level is abbreviated to a single character.':
      '- `compact`፦ ለአጭር መስመሮች የተመቻቸ የነባሪው ቅርጸት አቀናባሪ ልዩነት። የአሁኑ ስፓን አውድ መስኮች በተቀረጸው ክስተት መስኮች ላይ ይታከላሉ፣ የስፓን ስሞች አይታዩም፤ የዝርዝር ደረጃውም ወደ አንድ ቁምፊ ይጠራል።',
    'The same Sumeragi pipeline is used in both permissioned and Nominated Proof-of-Stake (NPoS) deployments:':
      'ተመሳሳዩ የ Sumeragi የማስኬጃ ፍሰት በተፈቀዱ እና በተመረጡ የድርሻ ማረጋገጫ (NPoS) ማሰማራቶች ውስጥ ይጠቀማል፦',
    '5. The runtime decrypts only the hidden program output and signs or proves a receipt.':
      '5. የአፈጻጸም አካባቢው የተደበቀውን የፕሮግራሙን ውጤት ብቻ ዲክሪፕት አድርጎ ደረሰኝ ይፈርማል ወይም ያረጋግጣል።',
    '| Inrou                  | Soracloud hosted HTTP runtime for service revisions that need a live HTTP plane.                                                            | Soracloud runtime config, host capability adverts, replica runtime state                 |':
      '| Inrou | የቀጥታ HTTP ንብርብ ለሚፈልጉ የአገልግሎት ክለሳዎች Soracloud የሚያስተናግደው HTTP አፈጻጸም አካባቢ። | የ Soracloud አፈጻጸም ውቅር፣ የአስተናጋጅ ችሎታ ማስታወቂያዎች፣ የቅጂ አፈጻጸም ሁኔታ |',
    '| Commitment | Digest material that binds the manifest, lane payload, proof bundle, or content root to the ledger-visible record.                                    |':
      '| ኮሚትመንት | ማኒፌስቱን፣ የመስመር ጭነቱን፣ የማረጋገጫ ጥቅሉን ወይም የይዘት ሥሩን በመዝገቡ ላይ ከሚታየው መዝገብ ጋር የሚያስተሳስር የዳይጀስት ውሂብ። |',
    '- Merkle lanes reject KZG commitments; KZG lanes require a non-zero KZG commitment.':
      '- የ Merkle መስመሮች የ KZG ኮሚትመንቶችን ይከለክላሉ፤ የ KZG መስመሮች ዜሮ ያልሆነ የ KZG ኮሚትመንት ይፈልጋሉ።',
    'Fund the Taira account through the faucet before you run fee-paying writes. The direct faucet flow is in [Get Testnet XOR on Taira](#_4-get-testnet-xor-on-taira).':
      'ክፍያ የሚጠይቁ የመጻፍ ክዋኔዎችን ከማካሄድዎ በፊት የ Taira መለያውን በሙከራ ገንዘብ አገልግሎቱ ይሙሉ። ቀጥተኛው ሂደት [በ Taira የሙከራ XOR ያግኙ](#_4-get-testnet-xor-on-taira) ውስጥ ነው።',
    'Taira XOR cannot pay Minamoto fees. Testnet balances and faucet claims do not transfer to Minamoto.':
      'Taira XOR የ Minamoto ክፍያዎችን አይከፍልም። የሙከራ መረብ ቀሪ ሂሳቦችና የገንዘብ ጥያቄዎች ወደ Minamoto አይተላለፉም።',
    'The faucet is only for Taira testnet funds. Do not use testnet XOR, faucet accounts, or Taira canary signers in Minamoto flows.':
      'የገንዘብ አገልግሎቱ ለ Taira ሙከራ መረብ ገንዘብ ብቻ ነው። በ Minamoto ፍሰቶች ውስጥ የሙከራ XOR፣ የገንዘብ አገልግሎት መለያዎች ወይም የ Taira የቅድመ-ማስጠንቀቂያ ፈራሚዎችን አይጠቀሙ።',
    'All peers in the network must agree on the signed genesis transaction and the genesis public key.':
      'የአውታረ መረቡ እኩዮች ሁሉ በተፈረመው የጀነሲስ ግብይትና በጀነሲስ ይፋዊ ቁልፍ ላይ መስማማት አለባቸው።',
    '`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, and `UnshieldRequest` validate canonical account IDs and canonical unprefixed Base58 asset-definition IDs before signing.':
      '`TransferRequest`፣ `MintRequest`፣ `BurnRequest`፣ `ShieldRequest` እና `UnshieldRequest` ከመፈረም በፊት ካኖኒካል የመለያ IDs እና ቅድመ-ቅጥያ የሌላቸው ካኖኒካል Base58 የንብረት-ፍቺ IDs ያረጋግጣሉ።',
    'Public key of the peer. Consensus validator peers must use BLS-Normal keys.':
      'የእኩዩ ይፋዊ ቁልፍ። የጋራ ስምምነት አረጋጋጭ እኩዮች BLS-Normal ቁልፎችን መጠቀም አለባቸው።',
    '- Contract calls require a positive typed gas limit. The first-release call contract rejects top-level gas or fee-asset metadata.':
      '- የኮንትራት ጥሪዎች አዎንታዊና ዓይነቱ የተገለጸ የ gas ገደብ ይፈልጋሉ። የመጀመሪያ ልቀት ጥሪ ኮንትራት ከፍተኛ-ደረጃ gas ወይም የክፍያ-ንብረት ሜታዳታን ይከለክላል።',
    '| Vanity origin          | `https://<fqdn>/<path>`                        | Canonical app URL recorded in manifests and release notes |':
      '| ብጁ መነሻ | `https://<fqdn>/<path>` | በማኒፌስቶች እና በልቀት ማስታወሻዎች ውስጥ የተመዘገበ ካኖኒካል የመተግበሪያ URL |',
    'The intent identifies `payments.universal`, its numeric dataspace, canonical I105 owner, lease acquisition term, and current policy/payment quote guard. The planner endpoint is `POST /v1/aliases/setup/plan`; its returned plan is chain-, authority-, state-, and deadline-bound. Domain removal still uses [`Unregister`](/blockchain/instructions.md#un-register).':
      'ዓላማው `payments.universal`ን፣ የቁጥር የመረጃ ቦታውን፣ ካኖኒካል I105 ባለቤቱን፣ የሊዝ ማግኛ ጊዜውን እና የአሁኑን የፖሊሲ/ክፍያ ግምት መከላከያ ይለያል። የእቅድ አውጪው መጨረሻ ነጥብ `POST /v1/aliases/setup/plan` ነው፤ የሚመልሰው እቅድ ከሰንሰለቱ፣ ከባለሥልጣኑ፣ ከሁኔታው እና ከጊዜ ገደቡ ጋር የታሰረ ነው። ጎራን ለማስወገድ አሁንም [`Unregister`](/am/blockchain/instructions.md#un-register) ይጠቀሙ።',
    '- [Positive and negative cross-SDK address vectors](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/fixtures/account/address_vectors.json)':
      '- [በ SDK-ዎች መካከል የሚፈተኑ አዎንታዊ እና አሉታዊ የአድራሻ ቬክተሮች](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/fixtures/account/address_vectors.json)',
    'Address for p2p communication for consensus (sumeragi) and block synchronization (block_sync) purposes.':
      'ለጋራ ስምምነት (sumeragi) እና ለብሎክ ማመሳሰል (block_sync) የ p2p ግንኙነት አድራሻ።',
    'Having a permission to do something means that the account has the corresponding `Permission`. Permissions can be granted directly or through a [`Role`](#permission-groups-roles), which groups a set of permissions. Permissions are granted with the `Grant` instruction. Permissions and roles do not expire; remove them with the `Revoke` instruction.':
      'አንድን ተግባር ለመፈጸም ፈቃድ መኖሩ መለያው ተዛማጅ `Permission` አለው ማለት ነው። ፈቃዶች በቀጥታ ወይም የፈቃዶችን ስብስብ በሚያቀፍ [`Role`](#permission-groups-roles) በኩል ሊሰጡ ይችላሉ። ፈቃዶች በ `Grant` መመሪያ ይሰጣሉ። ፈቃዶችና ሚናዎች የማብቂያ ጊዜ የላቸውም፤ በ `Revoke` መመሪያ ያስወግዷቸው።',
    'A set of permissions is called a **role**. Similarly to permission tokens, roles can be granted using the `Grant` instruction and revoked using the `Revoke` instruction.':
      'የፈቃዶች ስብስብ **ሚና** ይባላል። እንደ ፈቃድ ቶከኖች ሁሉ ሚናዎች በ `Grant` መመሪያ ሊሰጡ እና በ `Revoke` መመሪያ ሊነሱ ይችላሉ።',
    'Soracloud config and secret entries are part of authoritative deployment state. Deploy, upgrade, and rollback fail closed when required config or secret bindings are missing or inconsistent with the active manifests.':
      'የ Soracloud ውቅር እና ሚስጥራዊ ግቤቶች የባለሥልጣን የማሰማራት ሁኔታ አካል ናቸው። አስፈላጊ የውቅር ወይም የሚስጥር ትስስሮች ሲጎድሉ ወይም ከንቁ ማኒፌስቶች ጋር ሳይጣጣሙ፣ ማሰማራት፣ ማሻሻል እና ወደ ቀድሞ ሁኔታ መመለስ በመዘጋት ይከሽፋሉ።',
    '| Test writes                 | Use faucet-funded test XOR                                   | Do not use test tooling; writes spend real XOR     |':
      '| የሙከራ ክዋኔዎች | በገንዘብ አገልግሎቱ የተሞላ የሙከራ XOR ይጠቀሙ | የሙከራ መሣሪያ አይጠቀሙ፤ ክዋኔዎቹ እውነተኛ XOR ያወጣሉ |',
    'The first write-side toy should be a Taira faucet claim. It uses testnet XOR and should never be pointed at Minamoto.':
      'የመጀመሪያው ቀላል የመጻፍ ክዋኔ የ Taira የቴስትኔት ገንዘብ ድጋፍ ጥያቄ መሆን አለበት። የቴስትኔት XOR ይጠቀማል እና ፈጽሞ ወደ Minamoto መጠቆም የለበትም።',
    '- Require a written transaction or migration plan for high-impact writes.':
      '- ከፍተኛ ተጽዕኖ ላላቸው የመጻፍ ክዋኔዎች የተጻፈ የግብይት ወይም የፍልሰት እቅድ ያስፈልግ።',
    'Domain setup is a fee-paying write. Before trying it on Taira, save the faucet helper from [Get Testnet XOR on Taira](/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) as `taira_faucet_claim.py`, fund the signer through the public faucet, and attach fee metadata:':
      'የጎራ ማዋቀር ክፍያ የሚጠይቅ የመጻፍ ክዋኔ ነው። በ Taira ላይ ከመሞከርዎ በፊት የቴስትኔት ገንዘብ ድጋፍ አጋዡን ከ [በ Taira የሙከራ መረብ XOR ያግኙ](/am/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ወስደው `taira_faucet_claim.py` በሚል ስም ያስቀምጡ፣ ፈራሚውን በሕዝብ የገንዘብ ድጋፍ አገልግሎት በኩል ይሙሉ እና የክፍያ ሜታዳታን ያያይዙ፦',
    '- An account `404` after a faucet `202` can be propagation delay. Poll the account or funded asset before sending a write.':
      '- ከገንዘብ አገልግሎቱ `202` በኋላ የመለያ `404` ምላሽ በስርጭት መዘግየት ሊከሰት ይችላል። የመጻፍ ክዋኔ ከመላክዎ በፊት መለያውን ወይም የተሞላውን ንብረት በየጊዜው ይጠይቁ።',
    '3. a governed confidential settlement pool and initial root in every dataspace':
      '3. በእያንዳንዱ የመረጃ ቦታ ውስጥ በአስተዳደር የሚቆጣጠር ሚስጥራዊ የማጠናቀቂያ ፑል እና የመነሻ ሩት',
    '- Use `kagami` when you need keys, genesis manifests, profile bundles, or localnet assets.':
      '- ቁልፎች፣ የጀነሲስ ማኒፌስቶች፣ የመገለጫ ጥቅሎች ወይም የ localnet ንብረቶች ሲያስፈልጉ `kagami`ን ይጠቀሙ።',
    'Torii is the HTTP, SSE, and WebSocket gateway for Iroha 3. It serves both ledger-facing APIs and operator endpoints.':
      'Torii የ Iroha 3 HTTP፣ SSE እና WebSocket ጌትዌይ ነው። ከመዝገቡ ጋር የሚገናኙ APIs እና የኦፕሬተር መጨረሻ ነጥቦችን ያቀርባል።',
    'For a fee-paying Taira asset example, save the faucet helper from [Get Testnet XOR on Taira](/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) as `taira_faucet_claim.py`, then claim the faucet asset first and use it as the transaction gas asset:':
      'ክፍያ ለሚጠይቅ የ Taira ንብረት ምሳሌ፣ የገንዘብ ድጋፍ አጋዡን ከ [በ Taira የሙከራ መረብ XOR ያግኙ](/am/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ወስደው `taira_faucet_claim.py` በሚል ስም ያስቀምጡ፤ ከዚያ በመጀመሪያ የገንዘብ ድጋፍ ንብረቱን ይጠይቁ እና ለግብይቱ የ gas ንብረት ይጠቀሙበት፦',
    'For fee-paying examples on Taira, save the faucet helper from [Get Testnet XOR on Taira](/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) as `taira_faucet_claim.py`, then fund the signer through the public faucet first:':
      'በ Taira ላይ ክፍያ ለሚጠይቁ ምሳሌዎች፣ የገንዘብ ድጋፍ አጋዡን ከ [በ Taira የሙከራ መረብ XOR ያግኙ](/am/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ወስደው `taira_faucet_claim.py` በሚል ስም ያስቀምጡ፤ ከዚያ በመጀመሪያ ፈራሚውን በሕዝብ የገንዘብ ድጋፍ አገልግሎት በኩል ይሙሉ፦',
    'The example uses the shipped V1 limits, not a performance recommendation. Measure storage, proof, capsule, carrier, and latency envelopes on the intended hardware before choosing operational bounds. The three phase timeouts must fit inside `max_expiry_blocks`, and sidecar retention must be at least that expiry window.':
      'ምሳሌው የተላኩትን V1 ገደቦች ይጠቀማል፤ ይህ የአፈጻጸም ምክር አይደለም። የአሠራር ገደቦችን ከመምረጥዎ በፊት በታሰበው ሃርድዌር ላይ የማከማቻ፣ የማረጋገጫ፣ የካፕሱል፣ የካሪየር እና የመዘግየት ወሰኖችን ይለኩ። የሦስቱ ደረጃዎች የጊዜ ማብቂያዎች በ `max_expiry_blocks` ውስጥ መግባት አለባቸው፣ እና የጎን ፋይል ማቆያው ቢያንስ ከዚያ የማብቂያ መስኮት ጋር እኩል መሆን አለበት።',
    'Start on the Taira testnet, learn the current transaction flow, and use focused recipes to build production-ready applications.':
      'በ Taira የሙከራ መረብ ይጀምሩ፣ የአሁኑን የግብይት ፍሰት ይማሩ እና ለምርት ዝግጁ መተግበሪያዎችን ለመገንባት ያተኮሩ የተግባር መመሪያዎችን ይጠቀሙ።',
    'Browse cookbook': 'የተግባር መመሪያ ስብስቡን ያስሱ',
    'Popular recipes': 'ታዋቂ የተግባር መመሪያዎች',
    'Query ledger state': 'የብሎክቼይን መዝገብ ሁኔታን ይጠይቁ',
    '| Capability negotiation | Intersects supported feature bits, datagram limits, feedback cadence, and privacy requirements. |':
      '| የችሎታ ድርድር | ሁለቱም ወገኖች የሚደግፏቸውን የባህሪ ቢቶች፣ የዳታግራም ገደቦች፣ የግብረመልስ ድግግሞሽ እና የግላዊነት መስፈርቶች ይመርጣል። |',
    'For the full lifecycle, generic asset locks, anonymous escrow, queries, events, and Rust examples, see [Native Asset Escrow](/blockchain/escrow.md).':
      'ሙሉውን የሕይወት ዑደት፣ አጠቃላይ የንብረት መቆለፊያዎች፣ ስም-አልባ escrow፣ መጠይቆች፣ ክስተቶች እና የ Rust ምሳሌዎች ለማየት [ቤተኛ የንብረት Escrow](/am/blockchain/escrow.md)ን ይመልከቱ።',
    '### Fetch a Resolver Directory Snapshot': '### የ Resolver Directory የነጥብ-በ-ጊዜ ውሂብ እይታን ያምጡ',
    'The asset definition still has a canonical opaque address. Store or query that address after registration and use it in the trigger action.':
      'የንብረት ፍቺው አሁንም ካኖኒካል እና ግልጽ ያልሆነ አድራሻ አለው። ከምዝገባ በኋላ ያንን አድራሻ ያከማቹ ወይም ይጠይቁ እና በቀስቅሴው እርምጃ ውስጥ ይጠቀሙበት።',
    "Set the trigger's technical account to a dedicated account when possible. A dedicated account makes it clear which permissions are required for trigger execution and avoids coupling the trigger to an operator's personal signing key.":
      'በሚቻልበት ጊዜ የቀስቅሴውን ቴክኒካዊ መለያ ወደ ተለየ መለያ ያዘጋጁ። ተለየ መለያ ለቀስቅሴ አፈጻጸም የሚያስፈልጉትን ፈቃዶች ግልጽ ያደርጋል እና ቀስቅሴውን ከኦፕሬተር የግል ፊርማ ቁልፍ ጋር ከማጣመር ይከላከላል።',
    'Register the sponsor account through your private onboarding flow:':
      'የስፖንሰር መለያውን በግል የመመዝገቢያ ፍሰትዎ በኩል ይመዝግቡ፦',
    'Production equivalent': 'የምርት አካባቢ አቻ',
    'The MCP bridge can submit a signed Iroha transaction, but it does not remove the normal transaction requirements. A transaction still needs a correct authority, permissions, fee funding, chain ID, metadata, and signature.':
      'የ MCP ድልድይ የተፈረመ የ Iroha ግብይት ማስገባት ይችላል፣ ነገር ግን መደበኛውን የግብይት መስፈርቶች አያስወግድም። ግብይት አሁንም ትክክለኛ የፈቃድ ባለቤት፣ ፈቃዶች፣ የክፍያ ገንዘብ፣ የሰንሰለት ID፣ ሜታዳታ እና ፊርማ ያስፈልገዋል።',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- የፊደሎችን አቢይና ንዑስ ሆሄ ሁኔታ ይጠብቁ እና የ `Unicode` መደበኛነትን አይተግብሩ።',
    'They do not prove that the header class matches the controller.': 'የራስጌው ክፍል ከመቆጣጠሪያው ጋር መዛመዱን አያረጋግጡም።',
    'Use strict `AccountId` validation before authorization or persistence.':
      'ከፈቃድ መስጠት ወይም ከማከማቸት በፊት ጥብቅ `AccountId` ማረጋገጫ ይጠቀሙ።',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'NFC፣ NFKC፣ የስፋት ልወጣ፣ የአቢይ/ንዑስ ፊደል ማጠፍ ወይም ተመሳሳይ መልክ ባለው ቁምፊ መተካት አይተግብሩ።',
    'A valid policy has at least one member, positive weights, no duplicate public keys, and a threshold from `1` through the sum of member weights.':
      'ትክክለኛ ፖሊሲ ቢያንስ አንድ አባል፣ አዎንታዊ ክብደቶች፣ ያልተደጋገሙ የሕዝብ ቁልፎች እና ከ `1` እስከ የአባላት ክብደት ድምር ያለ ገደብ አለው።',
    '10. Require `byte-for-byte` equality with the trimmed input.': '10. ከተከረከመው ግብዓት ጋር `byte-for-byte` እኩልነትን ይጠይቁ።',
    '- a string with changed uppercase or lowercase letters, character widths, `kana`, payload, or checksum':
      '- አቢይ ወይም ንዑስ ፊደሎች፣ የቁምፊ ስፋቶች፣ `kana`፣ የፍጆታ ጭነት ወይም የቼክ ድምር የተቀየረበት ሕብረቁምፊ',
    '- Use a collation that preserves letter case and character width.':
      '- የፊደላትን አቢይ/ንዑስ ሁኔታ እና የቁምፊዎችን ስፋት የሚጠብቅ የማነጻጸሪያ ደንብ ይጠቀሙ።',
    '- Keep the full address available when a compact display shortens its middle.':
      '- የታመቀ ማሳያ መካከለኛውን ክፍል ሲያሳጥር ሙሉውን አድራሻ እንዲገኝ ያድርጉ።',
    '- Use the stored canonical ID instead of reconstructing it from an alias.':
      '- ከቅጽል ስም እንደገና ከመገንባት ይልቅ የተከማቸውን ካኖኒካል ID ይጠቀሙ።',
    '`AccountId` display and JSON use canonical I105.': 'የ `AccountId` ማሳያ እና JSON ካኖኒካል I105 ይጠቀማሉ።',
  },
  ar: {
    'The final trace commitment is a byte hash over the domain, parameter set, trace shape, column digests, and trace root:':
      'التزام التتبع النهائي هو تجزئة بايتية تُحسب على المجال، ومجموعة المعلمات، وشكل التتبع، وملخصات الأعمدة، وجذر التتبع:',
    '- stable opaque pool identifiers, roots, nullifiers, commitments, and fixed ciphertext slots':
      '- معرّفات التجمع المستقرة وغير الشفافة، والجذور، والمبطلات، والالتزامات، ومواضع النص المشفر ثابتة الحجم',
    '| [Atomic private settlement](#atomic-private-settlement)   | Govern confidential pools and atomic bundles.    |':
      '| [التسوية الخاصة الذرية](#atomic-private-settlement) | إدارة التجمعات السرية والحزم الذرية. |',
    '| `/api/v1/user*`   | Soracloud IVM         | Governance-sensitive state mutations              |':
      '| `/api/v1/user*` | Soracloud IVM | تغييرات الحالة الحساسة للحوكمة |',
    'Its sentinel identifies the intended network with a chain discriminant.':
      'تحدّد علامة الشبكة الشبكة المقصودة باستخدام مميّز السلسلة.',
    'An I105 account ID is domainless.': 'معرّف الحساب I105 ID بلا نطاق.',
    'Deriving an I105 ID does not register or fund the account.': 'لا يؤدي اشتقاق I105 ID إلى تسجيل الحساب أو تمويله.',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- حافظ على حالة الأحرف (الكبيرة والصغيرة) كما هي، ولا تطبّق تسوية `Unicode`.',
    '- An I105 ID must not have an `@domain` or `@domain.dataspace` suffix.':
      '- يجب ألا يكون لـ I105 ID لاحقة `@domain` أو `@domain.dataspace`.',
    '- A regular expression is not an I105 validator.': '- التعبير النمطي ليس أداة تحقق من I105.',
    'Network sentinel': 'علامة الشبكة',
    '### Network sentinels {#network-sentinels}': '### علامات الشبكة {#network-sentinels}',
    'Canonical sentinel': 'علامة الشبكة المعيارية',
    'A decoder must enforce the expected discriminant.': 'يجب أن تفرض وحدة فك الترميز مميّز السلسلة المتوقع.',
    'The checksum cannot detect a sentinel substitution.': 'لا يستطيع المجموع الاختباري اكتشاف استبدال علامة الشبكة.',
    'Forms such as `n00042`, `n369`, `n753`, and `n0` are not canonical.':
      'الأشكال مثل `n00042` و`n369` و`n753` و`n0` ليست تمثيلات معيارية.',
    'The transaction-chain ID and the I105 chain discriminant are separate values.':
      'قيمة ID لسلسلة المعاملات ومميّز سلسلة I105 قيمتان منفصلتان.',
    'They do not materialize an `AccountId`.': 'لا تنشئ هذه الأوامر كائن `AccountId`.',
    'They verify the sentinel, alphabet, checksum, byte lengths, `CurveId`/key shape, and exact address-layer re-encoding.':
      'تتحقق هذه الأوامر من علامة الشبكة، والأبجدية، والمجموع الاختباري، وأطوال البايتات، وبنية `CurveId`/المفتاح، ومن إعادة الترميز الدقيقة على مستوى العنوان.',
    'They do not by themselves validate all multisig policy semantics.':
      'لا تتحقق هذه الأوامر بمفردها من جميع دلالات سياسة التوقيع المتعدد.',
    'Use strict `AccountId` validation before authorization or persistence.':
      'استخدم التحقق الصارم من `AccountId` قبل التفويض أو التخزين الدائم.',
    'The checksum uses the `Bech32` `polymod` generators and constant `0x2bc830a3`.':
      'يستخدم المجموع الاختباري مولدات `Bech32` `polymod` والثابت `0x2bc830a3`.',
    'The checksum-only HRP is the ASCII string `snx`.':
      'إن HRP المستخدم حصريًا للمجموع الاختباري هو سلسلة ASCII `snx`.',
    'The checksum-only HRP is not printed in the address.':
      'لا يُدرج HRP المستخدم حصريًا للمجموع الاختباري في العنوان.',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'لا تطبّق NFC أو NFKC، ولا تحوّل عرض الأحرف، ولا توحّد حالة الأحرف، ولا تستبدل الأحرف بأخرى متشابهة بصريًا.',
    'Domain, dataspace, alias, UAID, and account metadata bytes are not present.':
      'النطاق ومساحة البيانات والاسم المستعار وUAID وبايتات البيانات الوصفية للحساب غير موجودة.',
    'Use the compact form when the raw public-key payload is at most 255 bytes:':
      'استخدم الصيغة المدمجة عندما لا يتجاوز طول الحمولة الخام للمفتاح العام 255 بايتًا:',
    'An extended encoding is not canonical for a key that fits the compact form.':
      'لا يكون الترميز الممتد معياريًا لمفتاح يمكن تمثيله بالصيغة المدمجة.',
    '### Multisig controller {#multisig-controller}': '### وحدة تحكم متعددة التوقيعات {#multisig-controller}',
    '1. Trim only permitted transport whitespace around the complete value.':
      '1. أزِل فقط محارف المسافات البيضاء المسموح بها أثناء النقل من حول القيمة كاملةً.',
    '2. Read the sentinel and require the expected chain discriminant.':
      '2. اقرأ علامة الشبكة واشترط مميّز السلسلة المتوقع.',
    '4. Split off the six checksum digits.': '4. افصل أرقام المجموع الاختباري الستة.',
    '6. Verify the checksum over those canonical bytes.':
      '6. تحقّق من المجموع الاختباري المحسوب على تلك البايتات المعيارية.',
    '- no trailing bytes': '- عدم وجود بايتات زائدة في النهاية',
    '- a valid multisig policy when applicable': '- سياسة توقيع متعدد صالحة عند الاقتضاء',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. أنشئ التمثيل المعياري لـ `AccountId` باستخدام المميّز المتوقع.',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. اشترط التطابق `byte-for-byte` مع الإدخال بعد إزالة المسافات المحيطة به.',
    "The application's explicit final `render-and-compare` step rejects non-minimal numeric sentinels, non-canonical controller layouts, reordered policy material, and any other spelling that decodes but is not the encoder's current V1 output.":
      'ترفض خطوة `render-and-compare` النهائية والصريحة في التطبيق علامات الشبكة الرقمية غير ذات التمثيل الأدنى، وتخطيطات المتحكّم غير المعيارية، ومواد السياسة المعاد ترتيبها، وأي صياغة أخرى يمكن فك ترميزها لكنها لا تطابق ناتج V1 الحالي للمُرمِّز.',
    'The decoded discriminant does not match the required network': 'المميّز المفكوك لا يطابق الشبكة المطلوبة',
    'No canonical named or numeric sentinel was found': 'لم يُعثر على علامة شبكة معيارية مسمّاة أو رقمية',
    'A controller field is truncated or uses a non-canonical length form':
      'أحد حقول المتحكّم مبتور أو يستخدم صيغة طول غير معيارية',
    'The input is not an accepted canonical I105 form': 'الإدخال ليس صيغة I105 معيارية مقبولة',
    '- an I105 literal with an appended `@domain` suffix': '- قيمة I105 أُلحقت بها لاحقة `@domain`',
    '- Never substitute an account alias for an I105 ID.': '- لا تستخدم اسمًا مستعارًا للحساب بدلًا من I105 ID مطلقًا.',
    '- Use a collation that preserves letter case and character width.':
      '- استخدم قواعد ترتيب ومقارنة للنصوص تحافظ على حالة الأحرف وعرض المحارف.',
    '- Keep the chain discriminant or named network profile with exported account data and backups.':
      '- احتفظ بمميّز السلسلة أو ملف تعريف الشبكة المسمّى مع بيانات الحساب المصدّرة والنسخ الاحتياطية.',
    '`AccountId` display and JSON use canonical I105.':
      'يستخدم عرض `AccountId` وتمثيله بصيغة JSON الشكل المعياري I105.',
    'Call the explicit `AccountAddress` I105 encoder when an external account ID is required.':
      'استدعِ مُرمِّز I105 الصريح الخاص بـ `AccountAddress` عند الحاجة إلى ID حساب خارجي.',
    'For contract-owned workflows, Kotodama exposes typed NFT host calls. The following is the exact lifecycle fixture compiled and executed by the pinned IVM documentation test:':
      'بالنسبة إلى سير العمل المملوك للعقد، يتيح Kotodama استدعاءات مضيف NFT محددة الأنواع. وفيما يلي حالة اختبار دورة الحياة الدقيقة التي يجمعها وينفذها اختبار توثيق IVM المثبّت:',
    '`compute` is a public `kotoage` entrypoint. Run it with `debug-call`, which executes against local fixtures without submitting or paying for a transaction.':
      '`compute` نقطة دخول عامة في `kotoage`. شغّله باستخدام `debug-call`، الذي ينفّذ على بيانات اختبار محلية من دون إرسال معاملة أو دفع رسومها.',
    'First set up the domain and SNS lease that own the asset namespace. Create a secret-free `AliasSetupPlanRequestV1` intent for `$BILLING_DOMAIN`, including the numeric `team` dataspace ID, canonical owner, lease term, and current quote guard:':
      'أولًا، أعدّ النطاق وإيجار SNS اللذين يملكان مساحة أسماء الأصل. أنشئ طلب نية `AliasSetupPlanRequestV1` خاليًا من الأسرار لـ `$BILLING_DOMAIN`، متضمنًا معرّف مساحة البيانات الرقمي `team`، والمالك بالصيغة المعيارية، ومدة الإيجار، وقيد عرض السعر الحالي:',
    "Do not paste private keys into an agent prompt. If an agent needs to build a transaction, point it at local code that loads secrets from the user's runtime environment, keychain, hardware signer, or ignored testnet config file. The agent should never write the key material into Markdown, fixtures, logs, or commits.":
      'لا تلصق المفاتيح الخاصة في مطالبة الوكيل. إذا احتاج الوكيل إلى إنشاء معاملة، فوجّهه إلى شفرة محلية تحمّل الأسرار من بيئة تشغيل برنامج المستخدم، أو سلسلة المفاتيح، أو موقّع تشفيري عتادي، أو ملف إعداد testnet متجاهَل. يجب ألا يكتب الوكيل مادة المفتاح مطلقًا في Markdown أو ملفات الاختبار أو السجلات أو عمليات الإيداع في نظام التحكم بالمصدر.',
    'Use `--seed-hex` only with an exact 32-byte hexadecimal secret for reproducible development fixtures. For production deployment, omit it so Kagami uses operating-system randomness, then move the unencrypted private-key export into the approved custody boundary. The command never prints private keys.':
      'استخدم `--seed-hex` فقط مع قيمة سرية سداسية عشرية بطول 32 بايت بالضبط لإنشاء بيانات اختبار تطويرية قابلة لإعادة الإنتاج. عند النشر في الإنتاج، احذف هذا الخيار كي يستخدم Kagami عشوائية نظام التشغيل، ثم انقل تصدير المفتاح الخاص غير المشفّر إلى نطاق الحفظ المعتمد. لا يطبع الأمر المفاتيح الخاصة مطلقًا.',
    'Kaigi writes are instructions inside ordinary quoted and signed transactions. Submit them through `POST /v1/pipeline/transactions` and wait for finalized block evidence.':
      'عمليات الكتابة في Kaigi هي تعليمات داخل معاملات عادية حُدّدت رسومها ووُقّعت. أرسلها عبر `POST /v1/pipeline/transactions` وانتظر دليل الكتلة التي بلغت حالة النهائية.',
    '| Anonymous read calls                          | Yes                                  | Python package plus network access                                                                             |':
      '| استدعاءات القراءة المجهولة | نعم | حزمة Python بالإضافة إلى الوصول إلى الشبكة |',
    'The faucet returns the concrete `asset_id` to use for the balance check. Verify that the live quote charges `FEE_ASSET_DEFINITION`; the transaction does not select that asset through metadata.':
      'تعيد خدمة تمويل شبكة الاختبار معرّف `asset_id` الفعلي المستخدم للتحقق من الرصيد. تحقّق من أن عرض الرسوم المباشر يفرض `FEE_ASSET_DEFINITION`؛ فالمعاملة لا تحدد ذلك الأصل من خلال البيانات الوصفية.',
    'If you omit the fee intent, accept a quote for an unexpected asset, alter the payload after quoting, or sign with an unfunded account, the transaction must not be submitted.':
      'إذا حذفت نية الرسوم، أو قبلت عرض رسوم لأصل غير متوقع، أو غيّرت الحمولة بعد تسعيرها، أو وقّعت بحساب غير ممول، فيجب ألا تُرسل المعاملة.',
    'These calls use Taira routes whose catalog boundary admits anonymous reads:':
      'تستخدم هذه الاستدعاءات مسارات Taira التي تسمح حدود فهرسها بعمليات قراءة مجهولة:',
    'These calls use an existing asset ID. Register the asset definition first, then build the concrete asset ID for the account that owns the asset.':
      'تستخدم هذه الاستدعاءات معرّف أصل موجودًا. سجّل تعريف الأصل أولًا، ثم أنشئ معرّف الأصل الفعلي للحساب الذي يملك الأصل.',
    'Trigger inventory calls only read or inspect trigger records. Registration, execution, repetition changes, and unregistering are mutating operations.':
      'لا تفعل استدعاءات جرد المشغّلات سوى قراءة سجلات المشغّلات أو فحصها. أما التسجيل والتنفيذ وتغييرات التكرار وإلغاء التسجيل فهي عمليات تعدّل الحالة.',
    'The payload and Minamoto form below come from the cross-SDK compliance fixture.':
      'تأتي الحمولة وصيغة Minamoto أدناه من بيانات اختبار الامتثال المشتركة بين حزم SDK.',
    '| Streaming | Norito Streaming uses Norito manifests, segment headers, control frames, and conformance fixtures. |':
      '| البث | يستخدم Norito Streaming بيانات Norito التعريفية، ورؤوس المقاطع، وأطر التحكم، وبيانات اختبار المطابقة. |',
    'Feature availability can differ between SDKs and release profiles. The wire format remains governed by the header and schema, not by local build flags.':
      'قد يختلف توفر الميزات بين SDKs وملفات تعريف الإصدار. يظل تنسيق الترميز الثنائي للبروتوكول محكومًا بالترويسة والمخطط، لا بعلامات البناء المحلية.',
    'Configure a durable local `torii.iso_bridge.store_dir` before admitting any submission. The configuration field is optional only so a node can start for read-only or diagnostic use: every authenticated ISO submission requires the directory, and returns retryable `503 Service Unavailable` when persistence is absent or a replay-tombstone or rich-record write fails.':
      'اضبط دليلًا محليًا دائمًا في `torii.iso_bridge.store_dir` قبل قبول أي إرسال. حقل التكوين اختياري فقط للسماح للعقدة ببدء التشغيل في وضع القراءة فقط أو لأغراض التشخيص: تتطلب كل عملية إرسال ISO موثّقة هذا الدليل، وتعيد الخطأ القابل لإعادة المحاولة `503 Service Unavailable` عند غياب التخزين الدائم أو فشل كتابة سجل منع إعادة التشغيل أو السجل الغني.',
    "The current [Iroha JavaScript demo](https://github.com/soramitsu/iroha-demo-javascript) implements a transparent, authenticated one-to-one meeting profile. It does not expose the protocol's `zk-roster-v1` proof flow. Its renderer creates WebRTC offers and answers, while a privileged bridge uses the local [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js) checkout to quote, sign, submit, and wait for finalized Kaigi transactions.":
      'ينفذ [عرض Iroha التوضيحي بلغة JavaScript](https://github.com/soramitsu/iroha-demo-javascript) الحالي ملف تعريف اجتماع شفافًا وموثّقًا بين طرفين. وهو لا يتيح تدفق إثبات `zk-roster-v1` الخاص بالبروتوكول. ينشئ العارض عروض WebRTC وإجاباتها، بينما يستخدم جسر ذو صلاحيات نسخة العمل المحلية من [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js) لتحديد الرسوم والتوقيع والإرسال وانتظار بلوغ معاملات Kaigi حالة النهائية.',
    '6. `OpenAnonymousEscrowDispute` and `ResolveAnonymousEscrowDispute` handle disputed escrows with evidence hashes and a resolver-controlled split.':
      '6. تتولى `OpenAnonymousEscrowDispute` و`ResolveAnonymousEscrowDispute` معالجة حسابات الضمان المتنازع عليها باستخدام هاشات الأدلة وتقسيم يتحكم فيه حاسم النزاع.',
    'The metadata hash, dataspace hash, and slot are stable across adjacent trace rows:':
      'تظل تجزئة البيانات الوصفية، وتجزئة مساحة البيانات، والفتحة ثابتة عبر صفوف التتبع المتجاورة:',
    'The SCCP canonical encoders write integers little-endian and encode variable-length byte arrays as:':
      'تكتب مرمّزات SCCP المعيارية الأعداد الصحيحة بترتيب little-endian، وترمّز مصفوفات البايت متغيرة الطول كما يلي:',
    'For singular queries and small iterable queries, you can use `client.request` to submit a query and get the result in one go.':
      'بالنسبة إلى الاستعلامات المفردة والاستعلامات التكرارية الصغيرة، يمكنك استخدام `client.request` لإرسال استعلام والحصول على النتيجة دفعة واحدة.',
    '8. **Emit signed artifacts.** Torii computes a PDP commitment, signs a `DaIngestReceipt`, builds a `DaCommitmentRecord`, and writes spool artifacts for the manifest, PDP commitment, commitment record, commitment schedule, pin intent, receipt file, and receipt log. The receipt cursor advances monotonically per `(lane_id, epoch)`.':
      '8. **إصدار العناصر الموقعة.** يحسب Torii التزام PDP، ويوقّع `DaIngestReceipt`، ويبني `DaCommitmentRecord`، ويكتب عناصر قائمة الانتظار الخاصة بالبيان، والتزام PDP، وسجل الالتزام، وجدول الالتزام، ونية التثبيت، وملف الإيصال، وسجل الإيصالات. يتقدم مؤشر الإيصال تصاعديًا لكل `(lane_id, epoch)`.',
    'GAR payloads should cover the canonical hash host, the canonical wildcard, and the selected pretty host.':
      'يجب أن تغطي حمولات GAR مضيف الهاش المعياري، وحرف البدل المعياري، والمضيف المخصص المحدد.',
    '| Test writes                 | Use faucet-funded test XOR                                   | Do not use test tooling; writes spend real XOR     |':
      '| عمليات كتابة اختبارية | استخدم XOR اختباريًا ممولًا من خدمة التمويل | لا تستخدم أدوات الاختبار؛ فعمليات الكتابة تنفق XOR حقيقيًا |',
    'The first write-side toy should be a Taira faucet claim. It uses testnet XOR and should never be pointed at Minamoto.':
      'ينبغي أن يكون أول مثال مبسط لعملية كتابة مطالبة بتمويل من خدمة Taira. فهو يستخدم XOR الخاص بالشبكة التجريبية، ويجب ألا يوجّه مطلقًا إلى Minamoto.',
    '- Rotate or replace a signer if the private key, passphrase, backup media, or signing host may have been exposed.':
      '- دوّر الموقّع أو استبدله إذا كان من المحتمل أن يكون المفتاح الخاص أو عبارة المرور أو وسيط النسخ الاحتياطي أو مضيف التوقيع قد انكشف.',
    'The account must already exist on-chain. For the default local network this is handled by the bundled genesis manifest.':
      'يجب أن يكون الحساب موجودًا مسبقًا على السلسلة. وفي الشبكة المحلية الافتراضية، يتولى بيان genesis المضمّن ذلك.',
    'The path, query, body, timestamp, and nonce rules are the same canonical rules used by the app protocol. The key must also be admitted by `[torii.operator_signatures]`: list it in `allowed_public_keys`, or explicitly enable `allow_node_key` when using the node key. Replay-cache saturation fails closed with `503 Service Unavailable`.':
      'قواعد المسار والاستعلام والجسم والطابع الزمني وقيمة nonce هي القواعد المعيارية نفسها التي يستخدمها بروتوكول التطبيق. ويجب أيضًا قبول المفتاح في `[torii.operator_signatures]`: أدرجه في `allowed_public_keys`، أو فعّل `allow_node_key` صراحة عند استخدام مفتاح العقدة. عند امتلاء ذاكرة منع إعادة التشغيل، يفشل النظام في وضع مغلق ويعيد `503 Service Unavailable`.',
    '| Permissioned | Private, consortium, and operator-managed networks                                     | Validators come from the trusted peer topology agreed by the deployment                                            | Keep all validators on the same signed genesis, trusted peers, peer keys, and Sumeragi parameters          |':
      '| شبكة مصرّح بها | شبكات خاصة أو اتحادية أو يديرها مشغّل | يأتي المدققون من طوبولوجيا النظراء الموثوقين المتفق عليها عند النشر | أبقِ جميع المدققين على تكوين genesis الموقّع نفسه، والنظراء الموثوقين أنفسهم، ومفاتيح النظراء ومعلمات Sumeragi نفسها |',
    '| `fastpq_metal_queue_depth`        | Metal queue limit, max in-flight count, dispatch count, and sampling window |':
      '| `fastpq_metal_queue_depth` | حد طابور Metal، والحد الأقصى للعمليات قيد التنفيذ، وعدد عمليات الإرسال، ونافذة أخذ العينات |',
    '| `universal`  | `core`       | Reserved default dataspace (`DataSpaceId::UNIVERSAL == 0`) for ordinary public ledger traffic and fallback routing.                                 |':
      '| `universal` | `core` | مساحة البيانات الافتراضية المحجوزة (`DataSpaceId::UNIVERSAL == 0`) لحركة دفتر الأستاذ العام العادية وللتوجيه عبر المسار البديل. |',
    'For Torii RAM-LFE execution receipts, associated data is the canonical program identifier bytes:':
      'في إيصالات تنفيذ Torii RAM-LFE، تكون البيانات المرتبطة هي بايتات معرّف البرنامج المعياري:',
    "6. The client or backend verifies the receipt against the published policy, optionally checking that the returned `output_hex` hashes to the receipt's `output_hash`.":
      '6. يتحقق العميل أو الخادم الخلفي من الإيصال وفق السياسة المنشورة، ويمكنه أيضًا التحقق من أن هاش `output_hex` المُعاد يساوي `output_hash` في الإيصال.',
    '| `POST /v1/ram-lfe/programs/{program_id}/execute` | Execute one program from `input_hex` or `encrypted_input` and return output hashes plus a stateless receipt. |':
      '| `POST /v1/ram-lfe/programs/{program_id}/execute` | نفّذ برنامجًا واحدًا من `input_hex` أو `encrypted_input` وأعد هاشات المخرجات مع إيصال عديم الحالة. |',
    '| `GET /v1/identifiers/receipts/{receipt_hash}` | Look up a persisted identifier claim by receipt hash for audit and support tooling. |':
      '| `GET /v1/identifiers/receipts/{receipt_hash}` | ابحث عن مطالبة معرّف محفوظة باستخدام هاش الإيصال، لأغراض التدقيق وأدوات الدعم. |',
    '- keep the canonical hash host under the SoraDNS gateway domain for GAR checks':
      '- أبقِ مضيف الهاش المعياري ضمن نطاق بوابة SoraDNS لإجراء فحوصات GAR',
    '- Contract calls require a positive typed gas limit. The first-release call contract rejects top-level gas or fee-asset metadata.':
      '- تتطلب استدعاءات العقود حد gas موجبًا ومحدد النوع. يرفض عقد الاستدعاء في الإصدار الأول بيانات gas أو أصل الرسوم الوصفية على المستوى الأعلى.',
    'To regenerate a full Markdown help snapshot from the source checkout, run:':
      'لإعادة إنشاء لقطة كاملة لمساعدة Markdown من نسخة المصدر، نفّذ:',
    '7. the chain stores an opaque identifier and receipt hash, not the raw phone or email value':
      '7. تخزّن السلسلة معرّفًا معتمًا وهاش الإيصال، لا قيمة الهاتف أو البريد الإلكتروني الخام',
    'Strict account fields still use canonical I105 account IDs. Treat aliases as human-readable bindings that resolve to canonical account IDs.':
      'تظل حقول الحساب الصارمة تستخدم معرّفات حساب I105 المعيارية. تعامل مع الأسماء المستعارة بوصفها روابط مقروءة للبشر تُحل إلى معرّفات الحساب المعيارية.',
    '- Use `kagami` when you need keys, genesis manifests, profile bundles, or localnet assets.':
      '- استخدم `kagami` عندما تحتاج إلى مفاتيح أو بيانات genesis أو حزم ملفات التعريف أو أصول الشبكة المحلية.',
    '- Store the canonical string returned by the codec with `byte-preserving` comparison semantics.':
      '- خزّن السلسلة المعيارية التي يعيدها المُرمِّز باستخدام دلالات مقارنة `byte-preserving`.',
    '| `COMPACT_LEN` | `0x02` | Default | Uses canonical unsigned varints for per-value length prefixes. |':
      '| `COMPACT_LEN` | `0x02` | الافتراضي | يستخدم أعدادًا صحيحة متغيرة الطول، غير موقّعة ومعيارية، لبادئات طول كل قيمة. |',
    'For a fee-paying Taira asset example, save the faucet helper from [Get Testnet XOR on Taira](/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) as `taira_faucet_claim.py`, then claim the faucet asset first and use it as the transaction gas asset:':
      'لمثال على أصل في Taira يتطلب دفع رسوم، احفظ أداة خدمة تمويل الاختبار من [الحصول على XOR لشبكة Taira التجريبية](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) باسم `taira_faucet_claim.py`، ثم اطلب أصل الاختبار أولًا واستخدمه أصلًا لرسوم تنفيذ المعاملة:',
    'Domain setup is a fee-paying write. Before trying it on Taira, save the faucet helper from [Get Testnet XOR on Taira](/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) as `taira_faucet_claim.py`, fund the signer through the public faucet, and attach fee metadata:':
      'إعداد النطاق عملية كتابة تتطلب دفع رسوم. قبل تجربتها على Taira، احفظ أداة خدمة تمويل الاختبار من [الحصول على XOR لشبكة Taira التجريبية](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) باسم `taira_faucet_claim.py`، وموّل الموقّع عبر خدمة التمويل العامة، ثم أرفق بيانات تعريف الرسوم:',
    'After the faucet-funded asset is visible, attach the required gas asset metadata to write transactions:':
      'بعد ظهور الأصل المموّل من خدمة الاختبار، أرفق بعمليات الكتابة بيانات تعريف أصل رسوم التنفيذ المطلوبة:',
    'For fee-paying examples on Taira, save the faucet helper from [Get Testnet XOR on Taira](/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) as `taira_faucet_claim.py`, then fund the signer through the public faucet first:':
      'للأمثلة التي تدفع رسومًا على Taira، احفظ أداة خدمة تمويل الاختبار من [الحصول على XOR لشبكة Taira التجريبية](/ar/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) باسم `taira_faucet_claim.py`، ثم موّل الموقّع أولًا عبر خدمة التمويل العامة:',
    '| `HttpService`          | `Inrou` | Live HTTP APIs, collector-heavy work, cache-backed services, SSE, browser-assisted flows     |':
      '| `HttpService` | `Inrou` | واجهات HTTP APIs مباشرة، وأعمال كثيفة التجميع، وخدمات مدعومة بذاكرة تخزين مؤقت، وSSE، وتدفقات بمساعدة المتصفح |',
    '| Commitment | Digest material that binds the manifest, lane payload, proof bundle, or content root to the ledger-visible record.                                    |':
      '| الالتزام | مادة ملخّص تربط البيان أو حمولة مسار التنفيذ أو حزمة الإثبات أو جذر المحتوى بالسجل الظاهر في دفتر الأستاذ. |',
    'Resolve the alias, fetch the on-chain manifest by the returned code hash, and simulate the same public entrypoint by canonical address:':
      'حلّ الاسم المستعار، واجلب البيان الموجود على السلسلة باستخدام هاش الشيفرة المُعاد، ثم حاكِ نقطة الدخول العامة نفسها باستخدام العنوان المعياري:',
    'The faucet is only for Taira testnet funds. Do not use testnet XOR, faucet accounts, or Taira canary signers in Minamoto flows.':
      'خدمة التمويل مخصّصة لأموال شبكة Taira التجريبية فقط. لا تستخدم XOR التجريبي أو حسابات خدمة التمويل أو موقّعي اختبار Taira في تدفقات Minamoto.',
    '- Keep `client.toml` files separate for localnet, Taira, Minamoto, and private networks. A copied testnet signer should never become a mainnet signer.':
      '- احتفظ بملفات `client.toml` منفصلة للشبكة المحلية وTaira وMinamoto والشبكات الخاصة. يجب ألا يصبح الموقّع المنسوخ من شبكة الاختبار موقّعًا للشبكة الرئيسية.',
    '6. Quote and sign a transaction containing `JoinKaigi` plus the canonical answer metadata.':
      '6. احصل على عرض الرسوم ووقّع معاملة تحتوي على `JoinKaigi` وبيانات تعريف الإجابة المعيارية.',
  },
  az: {
    '- DA records commitments, proof policies, proof openings, and pin intents that let those bytes be scheduled, audited, and linked back to ledger state.':
      '- DA həmin baytların planlaşdırılmasına, auditinə və reyestr vəziyyəti ilə yenidən əlaqələndirilməsinə imkan verən kriptoqrafik öhdəlikləri, sübut siyasətlərini, sübut açılışlarını və pin niyyətlərini qeyd edir.',
    '- Keep peer config, client config, signed genesis, scripts, and deployment notes together as a versioned release artifact.':
      '- Şəbəkə həmkarının konfiqurasiyasını, müştəri konfiqurasiyasını, imzalanmış genezisi, skriptləri və yerləşdirmə qeydlərini versiyalanmış buraxılış artefaktı kimi birlikdə saxlayın.',
    '| `COMPACT_LEN` | `0x02` | Default | Uses canonical unsigned varints for per-value length prefixes. |':
      '| `COMPACT_LEN` | `0x02` | Standart | Hər dəyərin uzunluq prefiksi üçün kanonik işarəsiz varintlərdən istifadə edir. |',
    '| Execution plane        | Runtime | Use it for                                                                                   |':
      '| İcra müstəvisi | Proqram icra mühiti | İstifadə sahəsi |',
    '`uaid` complements the canonical `AccountId`; it does not replace it. Use it when Nexus services need a stable user or organization handle across dataspaces, privacy-preserving enrollment, or service capability lookup. The runtime keeps a one-to-one UAID-to-account index, requires opaque identifiers to be attached through a UAID, and rejects duplicate or colliding opaque identifiers. See [FHE and UAID](/blockchain/sora-nexus-services.md#fhe-and-uaid) for the Nexus service-layer flow.':
      '`uaid` kanonik `AccountId`-ni tamamlayır, onu əvəz etmir. Nexus xidmətlərində məlumat məkanları arasında sabit istifadəçi və ya təşkilat identifikatoru, məxfiliyi qoruyan qeydiyyat və ya xidmət imkanlarının axtarışı tələb olunduqda ondan istifadə edin. İcra mühiti UAID ilə hesab arasında bir-bir uyğunluqlu indeks saxlayır, qeyri-şəffaf identifikatorların UAID vasitəsilə qoşulmasını tələb edir və təkrarlanan və ya toqquşan qeyri-şəffaf identifikatorları rədd edir. Nexus xidmət səviyyəsi axını üçün [FHE və UAID](/az/blockchain/sora-nexus-services.md#fhe-and-uaid) bölməsinə baxın.',
    'A value such as `treasury@payments.universal` is an account alias, not another spelling of the I105 ID.':
      '`treasury@payments.universal` kimi bir dəyər hesab aliasıdır, I105 ID-nin başqa yazılışı deyil.',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- Hərflərin böyük-kiçikliyini qoruyun və `Unicode` normallaşdırmasını tətbiq etməyin.',
    '- An I105 ID must not have an `@domain` or `@domain.dataspace` suffix.':
      '- I105 ID-də `@domain` və ya `@domain.dataspace` şəkilçisi olmamalıdır.',
    '| Payload          | `base-105` encoding of the canonical account-controller bytes      | Covered           |':
      '|Faydalı yük|`base-105` kanonik hesab nəzarətçisi baytlarının kodlanması |Əhatə olunur |',
    'Use strict `AccountId` validation before authorization or persistence.':
      'Avtorizasiyadan və ya davamlı yaddaşa yazmadan əvvəl ciddi `AccountId` təsdiqləməsindən istifadə edin.',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'NFC, NFKC, simvol eninin çevrilməsi, hərf registrinin qatlanması və ya oxşar görünüşlü simvollarla əvəzləmə tətbiq etməyin.',
    '| `0`    |     1 |                          `0` | Reserved `extension flag`    |':
      '| `0`    |     1 |                          `0` |Rezerv edilmiş `extension flag` |',
    '| `key_len`    |          1 byte | Raw key length           |': '|`key_len` |1 bayt |Xam açarın uzunluğu |',
    '| `key_len`    |         2 bytes | Raw key length, `big-endian` |':
      '|`key_len` |2 bayt |Xam açarın uzunluğu, `big-endian` |',
    '| `key_len`    |         2 bytes | Raw key length           |': '|`key_len` |2 bayt |Xam açarın uzunluğu |',
    '| `public_key` | `key_len` bytes | Raw public-key payload   |':
      '|`public_key` |`key_len` baytlar |Xam ictimai açar yükü |',
    '| `public_key` | `key_len` bytes | Raw public-key payload       |':
      '|`public_key` |`key_len` baytlar |Xam ictimai açar yükü |',
    'A valid policy has at least one member, positive weights, no duplicate public keys, and a threshold from `1` through the sum of member weights.':
      'Etibarlı siyasətin ən azı bir üzvü və müsbət çəkiləri olmalı, təkrarlanan ictimai açarları olmamalı, həddi isə `1`-dən üzvlərin çəkilərinin cəminədək olmalıdır.',
    '4. Split off the six checksum digits.': '4. Yoxlama cəminin altı rəqəmini ayırın.',
    '- a valid multisig policy when applicable': '- tətbiq olunduğu halda etibarlı multisig siyasəti',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. Kənar boşluqları kəsilmiş girişlə `byte-for-byte` bərabərlik tələb edin.',
    '- Never substitute an account alias for an I105 ID.': '- Heç vaxt I105 ID-ni hesab aliası ilə əvəz etməyin.',
    '- Use a collation that preserves letter case and character width.':
      '- Hərflərin böyük-kiçikliyini və simvol enini qoruyan kollasiyadan istifadə edin.',
    '`AccountId` display and JSON use canonical I105.':
      '`AccountId` ekranı və JSON təqdimatı kanonik I105-dən istifadə edir.',
  },
  ba: {
    'Wallet or prover tooling must build the proof attachment and public inputs. Opening creates one escrow commitment. Release, cancellation, and anonymous dispute resolution must spend exactly one escrow commitment and create the buyer, seller, or split output commitments required by the action.':
      'Кошелёк йәки иҫбатлау ҡоралы иҫбатлау ҡушымтаһын һәм асыҡ инеүҙәрҙе төҙөргә тейеш. Асыу бер эскроу коммитментын булдыра. Азат итеү, ғәмәлдән сығарыу һәм аноним бәхәсте хәл итеү һәр береһе тап бер эскроу коммитментын тотонорға һәм ғәмәл талап иткән һатып алыусы, һатыусы йәки бүленгән сығыш коммитменттарын булдырырға тейеш.',
    '### 3. Read the account and its assets': '### 3. Иҫәп яҙмаһын һәм уның активтарын ҡарау',
    'The selected executor defines which permission checks apply. You can grant the default [permission tokens](/blockchain/permissions.md) in genesis to shape a private, administrator-managed network or a more open network. Once those permissions are active, the process of registering accounts is different.':
      'Һайланған башҡарыусы ниндәй рөхсәт тикшереүҙәре ҡулланылыуын билдәләй. Ябыҡ, администратор идара иткән селтәрҙе йәки асығыраҡ селтәрҙе формалаштырыу өсөн genesis-та ғәҙәти [рөхсәт токендарын](/ba/blockchain/permissions.md) бирә алаһығыҙ. Был рөхсәттәр әүҙемләшкәс, иҫәп яҙмаларын теркәү тәртибе үҙгәрә.',
    '6. **Build the manifest.** `DaManifestV1` records the lane, epoch, blob class, codec, payload digest, chunk root, chunk size, erasure profile, retention policy, rent quote, chunk commitments, optional IPA commitment, metadata, and issue time. The storage ticket is deterministic: the node first hashes a manifest template with an empty ticket, then writes that fingerprint back as the final `storage_ticket`.':
      '6. **Манифест төҙөгөҙ.** `DaManifestV1` башҡарыу һыҙатын, дәүерҙе, блоб класын, кодекты, файҙалы йөкләмә дайджестын, фрагменттар тамырын, фрагмент күләмен, юғалтыуҙы тергеҙеү профилен, һаҡлау сәйәсәтен, ҡуртым хаҡы тәҡдимен, фрагменттарҙың криптографик коммитменттарын, өҫтәмә IPA коммитментын, метамәғлүмәттәрҙе һәм сығарылған ваҡытты теркәй. Һаҡлау билеты детерминистик: төйөн тәүҙә билет урыны буш булған манифест ҡалыбының хэшын иҫәпләй, шунан был бармаҡ эҙен һуңғы `storage_ticket` итеп яҙа.',
    'A SORA Nexus account ID is a canonical I105 address derived from the account public key and the target network prefix. It is not the `[account].domain` value in client TOML. The same public key encodes to different IDs on Taira and Minamoto, and production users should generate a separate keypair for Minamoto.':
      'SORA Nexus иҫәбе идентификаторы — иҫәптең асыҡ асҡысынан һәм маҡсатлы селтәр префиксынан сығарылған каноник I105 адресы. Ул клиенттың TOML файлындағы `[account].domain` ҡиммәте түгел. Бер үк асыҡ асҡыс Taira һәм Minamoto өсөн төрлө идентификаторҙарға кодлана, ә етештереү мөхитендәге ҡулланыусылар Minamoto өсөн айырым асҡыстар парын булдырырға тейеш.',
    '- the sponsor account exists': '- спонсор иҫәбе бар',
    '### 1. Inspect canonical accounts on Taira':
      '### 1. Taira-ла каноник иҫәп яҙмаларын тикшерегеҙ',
    'Grant and revoke instructions are used for account [permissions and roles](permissions.md).':
      'Рөхсәт биреү һәм кире алыу күрһәтмәләре иҫәп яҙмаһының [рөхсәттәре һәм ролдәре](permissions.md) өсөн ҡулланыла.',
    'Multilane execution additionally derives a deterministic payload-ownership hash and lane-local RBC instance hash for each lane subject. Those identities bind lane proposals and certificates to the global carrier; they are not a separate global consensus session. A block still finalizes only when the peer has a valid commit certificate and the matching payload locally.':
      'Күп һыҙатлы башҡарыу һәр һыҙат субъекты өсөн өҫтәмә рәүештә детерминистик файҙалы йөккә хужалыҡ итеү хешын һәм һыҙатҡа хас RBC экземпляры хешын сығара. Был идентификаторҙар һыҙат тәҡдимдәре менән сертификаттарын глобаль йөрөтөүсе менән бәйләй; улар айырым глобаль консенсус сессияһы түгел. Блок төйөндә ғәмәлдәге commit сертификаты һәм уға тап килгән файҙалы йөк урындағы һаҡлағыста булғанда ғына финаллаша.',
    '- membership or access records': '- ағзалыҡ йәки инеү хоҡуғы яҙмалары',
    'An empty `items` array is a valid response on a public testnet. It means there are no NFTs in the current page, not that NFT instructions are unavailable.':
      'Буш `items` массивы асыҡ тест селтәрендә дөрөҫ яуап булып тора. Был NFT күрһәтмәләре мөмкин түгеллеген түгел, ә хәҙерге биттә NFTs юҡлығын аңлата.',
    '| `Account` | Account lifecycle, metadata, alias, and identity events |':
      '| `Account` | Иҫәп яҙмаһының тормош циклы, метадатаһы, ҡушаматы һәм идентификация ваҡиғалары |',
    'Accounts are registered and unregistered with the generic [`Register` and `Unregister`](/blockchain/instructions.md#un-register) instructions. The active runtime validator decides who can create accounts and which permission tokens or roles are required.':
      'Иҫәп яҙмалары дөйөм [`Register` һәм `Unregister`](/ba/blockchain/instructions.md#un-register) инструкциялары ярҙамында теркәлә һәм теркәүҙән сығарыла. Әүҙем башҡарыу мөхите валидаторы кемдең иҫәп яҙмаларын булдыра алыуын һәм ниндәй рөхсәт токендары йәки ролдәр кәрәклеген билдәләй.',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- Хәрефтәрҙең ҙур-бәләкәй булыуын һаҡлағыҙ һәм `Unicode` нормалләштереүен ҡулланмағыҙ.',
    '- A regular expression is not an I105 validator.': '- Регуляр аңлатма I105 валидаторы түгел.',
    '| Network sentinel | Maps the text to one `u16` chain discriminant                      | Not covered       |':
      '|Селтәр sentinel-ы |Тексты бер `u16` сылбыр дискриминантына тап килтерә |Ҡапланмаған |',
    '| Payload          | `base-105` encoding of the canonical account-controller bytes      | Covered           |':
      '|Файҙалы йөкләмә|`base-105` каноник иҫәп контроллеры байттарын кодлау |Ҡапланған |',
    'The payload and checksum identify the account controller.':
      'Файҙалы йөкләмә һәм контроль сумма иҫәп контроллерын билдәләй.',
    'They verify the sentinel, alphabet, checksum, byte lengths, `CurveId`/key shape, and exact address-layer re-encoding.':
      'Улар sentinel-ды, алфавитты, контроль сумманы, байт оҙонлоҡтарын, `CurveId`/асҡыс формаһын һәм адрес ҡатламының теүәл ҡабат кодланыуын тикшерә.',
    'They do not materialize an `AccountId`.': 'Улар `AccountId` объектын булдырмай.',
    'They do not by themselves validate all multisig policy semantics.':
      'Улар үҙҙәре генә multisig сәйәсәтенең бөтә семантикаһын тикшермәй.',
    'Use strict `AccountId` validation before authorization or persistence.':
      'Авторизациялау йәки даими һаҡлау алдынан `AccountId`-ҙы ҡәтғи тикшереүҙе ҡулланығыҙ.',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'NFC, NFKC, киңлекте үҙгәртеү, хәреф регистрын берләштереү йәки оҡшаш күренгән символға алмаштырыуҙы ҡулланмағыҙ.',
    '| `0`    |     1 |                          `0` | Reserved `extension flag`    |':
      '| `0`    |     1 |                          `0` | Резервтағы `extension flag` |',
    'Current V1 encoders emit header `0x02` for a single-key controller and `0x0a` for a multisig controller.':
      'Хәҙерге V1 кодлаусылары бер асҡыслы контроллер өсөн `0x02` башлығын һәм multisig контроллер өсөн `0x0a` башлығын сығара.',
    'Use the compact form when the raw public-key payload is at most 255 bytes:':
      'Асыҡ асҡыстың сей йөкмәткеһе 255 байттан артмаһа, компакт форманы ҡулланығыҙ:',
    'Keys longer than 255 bytes use the extended form:': '255 байттан оҙонораҡ асҡыстар киңәйтелгән форманы ҡуллана:',
    '| `curve`      |          1 byte | `CurveId` registry value |': '|`curve` |1 байт |`CurveId` реестры ҡиммәте |',
    '| `curve`      |          1 byte | `CurveId` registry value     |':
      '|`curve` |1 байт |`CurveId` реестры ҡиммәте |',
    '| `key_len`    |          1 byte | Raw key length           |': '|`key_len` |1 байт |Сей асҡыс оҙонлоғо |',
    '| `key_len`    |         2 bytes | Raw key length, `big-endian` |':
      '|`key_len` |2 байт |Сей асҡыс оҙонлоғо, `big-endian` |',
    '| `key_len`    |         2 bytes | Raw key length           |': '|`key_len` |2 байт |Сей асҡыс оҙонлоғо |',
    '| `public_key` | `key_len` bytes | Raw public-key payload   |':
      '|`public_key` |`key_len` байт |Сей асыҡ асҡыс йөкмәткеһе |',
    '| `public_key` | `key_len` bytes | Raw public-key payload       |':
      '|`public_key` |`key_len` байт |Сей асыҡ асҡыс йөкмәткеһе |',
    '| `members`        | Variable | Repeated member records        |':
      '|`members` |Үҙгәрешле |Ҡабатланған ағза яҙмалары |',
    '| `weight`     |         2 bytes | Member approval weight   |': '|`weight` |2 байт |Ағзаның раҫлау ауырлығы |',
    'A valid policy has at least one member, positive weights, no duplicate public keys, and a threshold from `1` through the sum of member weights.':
      'Яраҡлы сәйәсәттә кәм тигәндә бер ағза һәм ыңғай ауырлыҡтар булырға, ҡабатланған асыҡ асҡыстар булмаҫҡа, ә сик `1`-ҙән ағзалар ауырлыҡтарының суммаһына тиклем булырға тейеш.',
    "Canonical construction sorts members by the signing algorithm's stable name, a zero separator byte, and then the raw public-key bytes.":
      'Каноник төҙөлөш ағзаларҙы ҡултамға алгоритмының тотороҡло исеме, нуль айырыусы байт, шунан сей асыҡ асҡыс байттары буйынса сортлай.',
    '4. Split off the six checksum digits.': '4. Контроль суммаһының алты цифрын айырып алығыҙ.',
    '6. Verify the checksum over those canonical bytes.': '6. Ошо каноник байттар өсөн контроль сумманы тикшерегеҙ.',
    '- a supported `CurveId`': '- ярҙам ителгән `CurveId`',
    "The application's explicit final `render-and-compare` step rejects non-minimal numeric sentinels, non-canonical controller layouts, reordered policy material, and any other spelling that decodes but is not the encoder's current V1 output.":
      'Ҡушымтаның асыҡ һуңғы `render-and-compare` аҙымы минималь булмаған һанлы sentinel-дарҙы, контроллерҙың каноник булмаған урынлашыуҙарын, яңынан тәртипкә һалынған сәйәсәт материалын һәм декодланған, әммә кодлаусының ағымдағы V1 сығышы булмаған башҡа һәр яҙылышты кире ҡаға.',
    '- Never substitute an account alias for an I105 ID.': '- I105 ID урынына бер ҡасан да иҫәп ҡушаматын ҡулланмағыҙ.',
    '- Use a collation that preserves letter case and character width.':
      '- Хәрефтәрҙең ҙур-бәләкәй булыуын һәм символ киңлеген һаҡлаған сағыштырыу тәртибен ҡулланығыҙ.',
    '`AccountId` display and JSON use canonical I105.':
      '`AccountId` дисплейы һәм JSON күрһәтелеше каноник I105 ҡуллана.',
    'The lower-level `AccountAddress` display/JSON representation uses canonical hex for internal and debugging contexts.':
      'Түбән кимәлдәге `AccountAddress` дисплейы/JSON күрһәтелеше эске һәм көйләү контексттары өсөн каноник ун алтылыҡ форманы ҡуллана.',
  },
  // Dzongkha is maintained as a fully human-reviewed corpus. Keep only the
  // universal safety canary here so a machine refresh cannot reintroduce the
  // older code-switched exact units that the reviewed corpus replaced.
  dz: {
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- ཡི་གུའི་ཆེ་ཆུང་ཉམས་མེད་བཞག་སྟེ་ `Unicode` སྤྱིར་བཏང་བཟོ་ནི་མི་འབད།',
  },
  es: {
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- Conserve exactamente las mayúsculas y minúsculas, y no aplique la normalización de `Unicode`.',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'No aplique NFC ni NFKC, ni convierta el ancho de los caracteres, ni cambie las mayúsculas y minúsculas, ni sustituya caracteres por otros visualmente similares.',
    'Domain, dataspace, alias, UAID, and account metadata bytes are not present.':
      'El dominio, el espacio de datos, el alias, el UAID y los bytes de metadatos de la cuenta no están presentes.',
    '| `key_len`    |          1 byte | Raw key length           |':
      '|`key_len` |1 byte |Longitud de la clave en bruto |',
    '| `key_len`    |         2 bytes | Raw key length, `big-endian` |':
      '|`key_len` |2 bytes |Longitud de la clave en bruto, `big-endian` |',
    '| `key_len`    |         2 bytes | Raw key length           |':
      '|`key_len` |2 bytes |Longitud de la clave en bruto |',
    'The checksum-only HRP is the ASCII string `snx`.':
      'El HRP usado exclusivamente para la suma de comprobación es la cadena ASCII `snx`.',
    'The checksum-only HRP is not printed in the address.':
      'El HRP usado exclusivamente para la suma de comprobación no se incluye en la dirección.',
    '4. Split off the six checksum digits.': '4. Separe los seis dígitos correspondientes a la suma de comprobación.',
    '6. Verify the checksum over those canonical bytes.':
      '6. Verifique la suma de comprobación calculada sobre esos bytes canónicos.',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. Genere la representación canónica del `AccountId` para el discriminante esperado.',
    '- a string with changed uppercase or lowercase letters, character widths, `kana`, payload, or checksum':
      '- una cadena en la que se hayan cambiado las letras mayúsculas o minúsculas, el ancho de los caracteres, los caracteres `kana`, la carga útil o la suma de comprobación',
    '- Never substitute an account alias for an I105 ID.': '- Nunca use un alias de cuenta en lugar de un I105 ID.',
    '- Use a collation that preserves letter case and character width.':
      '- Use una intercalación que preserve las mayúsculas y minúsculas y el ancho de los caracteres.',
    '`AccountId` display and JSON use canonical I105.':
      'La visualización de `AccountId` y su representación JSON usan el formato I105 canónico.',
  },
  fr: {
    'Hyperledger Iroha 3 logo': 'Logo Hyperledger Iroha 3',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- Respectez la casse des lettres et n’appliquez aucune normalisation `Unicode`.',
    'They verify the sentinel, alphabet, checksum, byte lengths, `CurveId`/key shape, and exact address-layer re-encoding.':
      'Ils vérifient la sentinelle, l’alphabet, la somme de contrôle, les longueurs en octets, la conformité du `CurveId` et de la clé, ainsi que le réencodage exact au niveau de l’adresse.',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'N’appliquez ni NFC, ni NFKC, ni conversion de largeur, ni repliement de casse, ni substitution par des caractères visuellement similaires.',
    '4. Split off the six checksum digits.': '4. Détachez les six chiffres de la somme de contrôle.',
    '6. Verify the checksum over those canonical bytes.': '6. Vérifiez la somme de contrôle sur ces octets canoniques.',
    '- a supported `CurveId`': '- un `CurveId` pris en charge',
    '- Never substitute an account alias for an I105 ID.':
      '- N’utilisez jamais un alias de compte à la place de l’I105 ID.',
    '- Use a collation that preserves letter case and character width.':
      '- Utilisez une collation qui préserve la casse des lettres et la largeur des caractères.',
    '`AccountId` display and JSON use canonical I105.':
      'L’affichage de `AccountId` et sa représentation JSON utilisent la forme I105 canonique.',
  },
  hy: {
    'The block header stores hashes for DA proof policies, commitments, and pin intents. For membership proofs, the commitment bundle also exposes a Merkle root whose leaves are hashes of canonical Norito-encoded `DaCommitmentRecord` values. Parent nodes hash the concatenation of left and right children; an odd leaf is promoted unchanged to the next layer.':
      'Բլոկի վերնագիրը պահպանում է DA-ի ապացույցների քաղաքականությունների, պարտավորությունների և ամրացման մտադրությունների հեշերը։ Անդամակցության ապացույցների համար պարտավորությունների փաթեթը նաև տրամադրում է Merkle-ի արմատ, որի տերևները կանոնիկ Norito-ով կոդավորված `DaCommitmentRecord` արժեքների հեշերն են։ Ծնող հանգույցները հեշավորում են ձախ և աջ զավակների միակցումը, իսկ կենտ տերևը անփոփոխ տեղափոխվում է հաջորդ շերտ։',
    'The final trace commitment is a byte hash over the domain, parameter set, trace shape, column digests, and trace root:':
      'Հետագծի վերջնական պարտավորությունը բայթային հեշ է՝ հաշվարկված տիրույթի, պարամետրերի հավաքածուի, հետագծի ձևի, սյունակների դայջեսթների և հետագծի արմատի հիման վրա․',
    'Soracloud config and secret entries are part of authoritative deployment state. Deploy, upgrade, and rollback fail closed when required config or secret bindings are missing or inconsistent with the active manifests.':
      'Soracloud-ի կազմաձևման և գաղտնիքների գրառումները տեղակայման հեղինակավոր վիճակի մաս են։ Տեղակայումը, թարմացումը և հետարկումը անվտանգորեն արգելափակվում են, եթե պահանջվող կազմաձևման կամ գաղտնիքի կապակցումները բացակայում են կամ չեն համապատասխանում ակտիվ մանիֆեստներին։',
    'The UAID is the identity and capability anchor around that flow. In the data model, `UniversalAccountId` is hash-backed and displays as `uaid:<hash>`. Parsers accept either `uaid:<hash>` or the raw 64-hex digest. `Account` and `NewAccount` include optional `uaid` and `opaque_ids` fields. Runtime registration enforces a one-to-one UAID-to-account index, rejects duplicate or colliding opaque identifiers, and rejects opaque identifiers without a UAID. Whenever a UAID account binding changes, the runtime rebuilds Space Directory dataspace bindings for that UAID.':
      'UAID-ն այդ հոսքի ինքնության և հնարավորությունների հենակետն է։ Տվյալների մոդելում `UniversalAccountId`-ը հիմնված է հեշի վրա և ցուցադրվում է `uaid:<hash>` ձևով։ Վերլուծիչներն ընդունում են կամ `uaid:<hash>`, կամ չմշակված 64-նիշանոց տասնվեցական դայջեսթը։ `Account`-ը և `NewAccount`-ը ներառում են ընտրովի `uaid` և `opaque_ids` դաշտեր։ Կատարման միջավայրում գրանցումը պարտադրում է UAID-ի և հաշվի մեկ-առ-մեկ ինդեքս, մերժում է կրկնվող կամ բախվող անթափանց նույնացուցիչները և մերժում է UAID չունեցող անթափանց նույնացուցիչները։ UAID-ի ու հաշվի կապակցման յուրաքանչյուր փոփոխությունից հետո կատարման միջավայրը վերակառուցում է Տարածքների գրացուցակի տվյալների տարածքի կապակցումները տվյալ UAID-ի համար։',
    'Space Directory manifests attach capabilities to a UAID. An `AssetPermissionManifest` names the UAID, dataspace, activation and optional expiry epoch, and ordered allow/deny entries scoped by dataspace, program, method, asset, and AMX role. Evaluation is deny-wins: the first matching deny rejects the request, otherwise the latest matching allow candidate is checked against any amount limit. Publishing, expiring, and revoking these manifests is guarded by `CanPublishSpaceDirectoryManifest`.':
      'Տարածքների գրացուցակի մանիֆեստները հնարավորություններ են կապում UAID-ին։ `AssetPermissionManifest`-ը նշում է UAID-ը, տվյալների տարածքը, ակտիվացման և ընտրովի ավարտի դարաշրջանը, ինչպես նաև տվյալների տարածքով, ծրագրով, մեթոդով, ակտիվով և AMX դերով սահմանափակված թույլատրող ու արգելող կարգավորված գրառումները։ Գնահատման ժամանակ արգելումն ունի առաջնահերթություն․ առաջին համապատասխան արգելումը մերժում է հարցումը, իսկ հակառակ դեպքում վերջին համապատասխան թույլտվության թեկնածուն ստուգվում է գումարի հնարավոր սահմանաչափի նկատմամբ։ Այս մանիֆեստների հրապարակումը, ժամկետի ավարտը և հետկանչը պաշտպանվում են `CanPublishSpaceDirectoryManifest`-ով։',
    'UAID is not the ciphertext and not the FHE policy itself. It is the stable account capability anchor used to find the account, opaque identifier claims, and Space Directory bindings that authorize a service or dataspace flow. FHE schemas govern encrypted payload admission and execution separately through parameter sets, execution policies, ciphertext commitments, and decryption authority policies.':
      'UAID-ը ո՛չ գաղտնագիր տեքստն է, ո՛չ էլ հենց FHE քաղաքականությունը։ Այն հաշվի հնարավորությունների կայուն հենակետն է, որով գտնում են հաշիվը, անթափանց նույնացուցիչների հավակնությունները և ծառայության կամ տվյալների տարածքի հոսքը թույլատրող Տարածքների գրացուցակի կապակցումները։ FHE սխեմաները գաղտնագրված օգտակար բեռի ընդունումն ու կատարումը առանձին կառավարում են պարամետրերի հավաքածուների, կատարման քաղաքականությունների, գաղտնագիր տեքստի պարտավորությունների և վերծանման լիազորության քաղաքականությունների միջոցով։',
    '- A manifest or ABI mismatch means the bytecode, manifest, and node runtime do not describe the same artifact. Rebuild at the pinned commit with `--verify`.':
      '- Մանիֆեստի կամ ABI-ի անհամապատասխանությունը նշանակում է, որ բայթկոդը, մանիֆեստը և հանգույցի կատարման միջավայրը չեն նկարագրում նույն արտեֆակտը։ Վերակառուցեք ամրագրված commit-ից՝ օգտագործելով `--verify`։',
    'Plain-text client configuration is suitable only for local development and controlled tests. A production integration should obtain signatures through its approved custody boundary. The stock Iroha CLI reads a private key from client configuration and does not provide a generic external-signer adapter. Custom clients can construct the transaction payload hash and attach a signature produced by an external signer.':
      'Բաց տեքստով հաճախորդի կազմաձևումը հարմար է միայն տեղային մշակման և վերահսկվող փորձարկումների համար։ Արտադրական ինտեգրումը պետք է ստորագրություններ ստանա իր հաստատված պահառության սահմանի միջոցով։ Ստանդարտ Iroha CLI-ն մասնավոր բանալին կարդում է հաճախորդի կազմաձևումից և ընդհանուր նշանակության արտաքին ստորագրող ադապտեր չի տրամադրում։ Հատուկ հաճախորդները կարող են կազմել գործարքի օգտակար բեռի հեշը և կցել արտաքին ստորագրողի ստեղծած ստորագրությունը։',
    'Operational security protects the people, hosts, credentials, and procedures around an Iroha deployment. The ledger records accepted state changes. Operators must separately secure their workstations, signing keys, and incident-response process.':
      'Գործառնական անվտանգությունը պաշտպանում է Iroha-ի տեղակայումը սպասարկող մարդկանց, հոսթերը, մուտքային տվյալները և ընթացակարգերը։ Ռեեստրը գրանցում է ընդունված վիճակի փոփոխությունները։ Օպերատորները պետք է առանձին պաշտպանեն իրենց աշխատակայանները, ստորագրման բանալիները և միջադեպերին արձագանքելու գործընթացը։',
    'During candidate preparation, Sumeragi aggregates the proposed payload by lane and dataspace and derives the lane-local data-availability identities. The recorded totals include transaction count, chunks, payload bytes, and TEU. After commit, those totals become the lane and dataspace commitment snapshots exposed through authenticated Sumeragi diagnostics. If a block contains lane settlement receipts, block processing also creates lane settlement commitments and relay envelopes that bind the block header, commit certificate, data-availability commitment hash, settlement proof, and lane payload size.':
      'Թեկնածու բլոկի պատրաստման ընթացքում Sumeragi-ն առաջարկված օգտակար բեռը խմբավորում է ըստ կատարման ուղու և տվյալների տարածքի ու ստանում տվյալների հասանելիության՝ տվյալ ուղուն տեղային նույնացուցիչները։ Գրանցված հանրագումարները ներառում են գործարքների քանակը, հատվածները, օգտակար բեռի բայթերը և TEU-ն։ Հաստատումից հետո դրանք դառնում են կատարման ուղու և տվյալների տարածքի պարտավորությունների վիճակապատկերներ, որոնք հասանելի են Sumeragi-ի նույնականացված ախտորոշման միջոցով։ Եթե բլոկը պարունակում է կատարման ուղու վերջնահաշվարկի անդորրագրեր, բլոկի մշակումը նաև ստեղծում է կատարման ուղու վերջնահաշվարկի պարտավորություններ և վերահաղորդման ծրարներ, որոնք կապում են բլոկի վերնագիրը, հաստատման վկայականը, տվյալների հասանելիության պարտավորության հեշը, վերջնահաշվարկի ապացույցը և կատարման ուղու օգտակար բեռի չափը։',
    'Plaintext coefficient vectors are encoded by scaling each coefficient:':
      'Բաց տեքստի գործակիցների վեկտորները կոդավորվում են՝ յուրաքանչյուր գործակիցը մասշտաբավորելով։',
    'Lane relay envelopes also carry compact FastPQ proof material. The material is a digest over the lane id, dataspace id, block height, verification height, block header hash, settlement hash, and manifest root. A relay is merge admissible only when it has both a QC and valid FastPQ proof material.':
      'Կատարման ուղու վերահաղորդման տվյալների ծրարները նաև պարունակում են FastPQ-ի սեղմ ապացուցողական նյութ։ Այդ նյութը կատարման ուղու ID-ի, տվյալների տարածքի ID-ի, բլոկի բարձրության, ստուգման բարձրության, բլոկի վերնագրի կրիպտոգրաֆիական հեշի, վերջնահաշվարկի կրիպտոգրաֆիական հեշի և տեխնիկական մանիֆեստի արմատի հիման վրա հաշվարկված դայջեսթ է։ Վերահաղորդումը միավորման համար ընդունելի է միայն այն դեպքում, երբ ունի և՛ QC, և՛ FastPQ-ի վավեր ապացուցողական նյութ։',
    '- the transaction entrypoint hash used as the batch hash':
      '- գործարքի մուտքային կետի հեշը, որն օգտագործվում է որպես խմբաքանակի հեշ',
    'Observer peers can synchronize committed blocks, but they do not propose, vote, or count toward the commit quorum. Use observers when a deployment needs local query capacity, indexing, monitoring, or regional block replication without increasing the number of voting validators.':
      'Դիտորդ հանգույցները կարող են համաժամեցնել հաստատված բլոկները, սակայն նրանք բլոկ չեն առաջարկում, չեն քվեարկում և չեն հաշվվում հաստատման քվորումի կազմում։ Դիտորդներ օգտագործեք, երբ տեղակայմանը հարկավոր են տեղական հարցումների սպասարկման կարողություն, ինդեքսավորում, մշտադիտարկում կամ բլոկների տարածաշրջանային կրկնօրինակում՝ առանց քվեարկող վավերացնողների քանակն ավելացնելու։',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- Պահպանեք տառերի մեծատառ/փոքրատառ ձևը և մի կիրառեք `Unicode` նորմալացում։',
    'They verify the sentinel, alphabet, checksum, byte lengths, `CurveId`/key shape, and exact address-layer re-encoding.':
      'Դրանք ստուգում են sentinel-ը, այբուբենը, ստուգիչ գումարը, բայթերի երկարությունները, `CurveId`-ի/բանալու ձևը և հասցեի շերտի ճշգրիտ վերակոդավորումը։',
    'Use strict `AccountId` validation before authorization or persistence.':
      'Օգտագործեք `AccountId`-ի խիստ վավերացում նախքան թույլտվումը կամ պահպանումը։',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'Մի կիրառեք NFC, NFKC, լայնության փոխակերպում, տառերի ռեգիստրի միավորում կամ նման տեսք ունեցող նիշերով փոխարինում։',
    '| Payload          | `base-105` encoding of the canonical account-controller bytes      | Covered           |':
      '|Օգտակար բեռը|`base-105` կանոնիկ հաշվի վերահսկիչի բայթերի կոդավորումը |Ընդգրկված |',
    '| `0`    |     1 |                          `0` | Reserved `extension flag`    |':
      '| `0`    |     1 |                          `0` | Պահուստավորված `extension flag` |',
    '| `key_len`    |          1 byte | Raw key length           |': '|`key_len` |1 բայթ |Հում բանալու երկարությունը |',
    '| `key_len`    |         2 bytes | Raw key length, `big-endian` |':
      '|`key_len` |2 բայթ |Հում բանալու երկարությունը, `big-endian` |',
    '| `key_len`    |         2 bytes | Raw key length           |': '|`key_len` |2 բայթ |Հում բանալու երկարությունը |',
    '| `public_key` | `key_len` bytes | Raw public-key payload   |':
      '|`public_key` |`key_len` բայթեր |Հում հանրային բանալու օգտակար բեռը |',
    '| `public_key` | `key_len` bytes | Raw public-key payload       |':
      '|`public_key` |`key_len` բայթեր |Հում հանրային բանալու օգտակար բեռը |',
    '| `members`        | Variable | Repeated member records        |':
      '|`members` |Փոփոխական |Կրկնվող անդամների գրառումներ |',
    "Canonical construction sorts members by the signing algorithm's stable name, a zero separator byte, and then the raw public-key bytes.":
      'Կանոնիկ կառուցումը անդամներին դասակարգում է ըստ ստորագրման ալգորիթմի կայուն անվան, զրոյական բաժանարար բայթի, ապա՝ հանրային բանալու հում բայթերի։',
    '4. Split off the six checksum digits.': '4. Առանձնացրեք ստուգիչ գումարի վեց թվանշանները։',
    '6. Verify the checksum over those canonical bytes.': '6. Ստուգեք այդ կանոնիկ բայթերի ստուգիչ գումարը։',
    '- a supported `CurveId`': '- աջակցվող `CurveId`',
    "The application's explicit final `render-and-compare` step rejects non-minimal numeric sentinels, non-canonical controller layouts, reordered policy material, and any other spelling that decodes but is not the encoder's current V1 output.":
      'Հավելվածի հստակ վերջնական `render-and-compare` քայլը մերժում է ոչ նվազագույն թվային sentinel-ները, վերահսկիչի ոչ կանոնիկ դասավորությունները, վերադասավորված քաղաքականության նյութը և ցանկացած այլ գրառում, որը ապակոդավորվում է, բայց չի համապատասխանում կոդավորիչի ընթացիկ V1 ելքին։',
    '- Never substitute an account alias for an I105 ID.': '- Երբեք I105 ID-ն մի փոխարինեք հաշվի alias-ով։',
    '- Use a collation that preserves letter case and character width.':
      '- Օգտագործեք համադրում, որը պահպանում է տառերի մեծատառ/փոքրատառ ձևը և նիշերի լայնությունը։',
    '`AccountId` display and JSON use canonical I105.':
      '`AccountId`-ի ցուցադրումը և JSON ներկայացումը օգտագործում են կանոնիկ I105։',
    'The lower-level `AccountAddress` display/JSON representation uses canonical hex for internal and debugging contexts.':
      'Ցածր մակարդակի `AccountAddress`-ի ցուցադրումը/JSON ներկայացումը ներքին և վրիպազերծման համատեքստերում օգտագործում է կանոնիկ տասնվեցական ձևը։',
  },
  he: {
    '5. Query the resulting pin intent or commitment before promoting an alias, settlement proof, or gateway route that depends on the payload.':
      '5. לפני קידום כינוי, הוכחת סליקה או נתיב שער שתלויים במטען, בצעו שאילתה על כוונת ההצמדה או ההתחייבות שנוצרה.',
    '- pause application-side actions that are outside the ledger, such as checkout, withdrawal, signing, bridge, or settlement workflows':
      '- השהו פעולות בצד היישום שמחוץ לפנקס, כגון תהליכי קופה, משיכה, חתימה, העברה בגשר או סליקה',
    '# Run Atomic Private Cross-Dataspace Settlement': '# הרצת סליקה פרטית אטומית בין מרחבי נתונים',
    '## Settlement workflow': '## תהליך הסליקה',
    '# Run Atomic Private Cross-Dataspace Settlement {#run-atomic-private-cross-dataspace-settlement}':
      '# הרצת סליקה פרטית אטומית בין מרחבי נתונים {#run-atomic-private-cross-dataspace-settlement}',
    'Use DA when an application or Nexus lane needs a ledger-visible promise that off-chain data remains retrievable. Common examples include lane payload commitments for settlement flows, SoraFS pin intents for published content, proof bundles that must be retained for later verification, and application artifacts whose public state should be a digest rather than the full payload.':
      'השתמשו ב-DA כאשר יישום או מסלול Nexus זקוקים להבטחה גלויה בפנקס שהנתונים שמחוץ לשרשרת יישארו ניתנים לאחזור. דוגמאות נפוצות כוללות התחייבויות למטעני מסלול עבור תהליכי סליקה, כוונות הצמדה של SoraFS לתוכן שפורסם, חבילות הוכחה שיש לשמור לצורך אימות מאוחר יותר, ופריטי יישום שמצבם הציבורי צריך להיות תקציר ולא המטען המלא.',
    '4. The resolved route is checked against both catalogs. Unknown lanes, unknown dataspaces, and lane/dataspace mismatches are deterministic routing errors. If a transaction writes to two different dataspace targets, it is rejected as a conflicting route; cross-dataspace DVP/PVP settlement is routed through the universal coordinator lane.':
      '4. הנתיב שנפתר נבדק מול שני הקטלוגים. מסלולים לא מוכרים, מרחבי נתונים לא מוכרים ואי־התאמות בין מסלול למרחב נתונים הם שגיאות ניתוב דטרמיניסטיות. אם עסקה כותבת לשני יעדים שונים של מרחבי נתונים, היא נדחית עקב נתיב סותר; סליקת DVP/PVP חוצת־מרחבי־נתונים מנותבת דרך מסלול המתאם האוניברסלי.',
    'On Taira, attach the faucet-derived `taira.tx-metadata.json` and use `--fee-payer authority` for every write. Registration and minting require the active validator\'s permissions; transfer and burn require authority over the source balance. A faucet-funded account is not automatically an issuer.':
      'ב-Taira, צרפו את `taira.tx-metadata.json` שהתקבל משירות המימון והשתמשו ב-`--fee-payer authority` בכל כתיבה. רישום והנפקה דורשים את ההרשאות של המאמת הפעיל; העברה ושרפה דורשות סמכות על יתרת המקור. חשבון שמומן בשירות המימון אינו הופך אוטומטית למנפיק.',
    '- runtime configuration snapshots needed for deterministic block execution, such as cryptography, governance, pipeline, content, settlement, and Nexus settings':
      '- תמונות מצב של תצורת סביבת הריצה הנדרשות לביצוע דטרמיניסטי של בלוקים, כגון הגדרות קריפטוגרפיה, ממשל, שרשרת עיבוד, תוכן, סליקה ו־Nexus',
    'During candidate preparation, Sumeragi aggregates the proposed payload by lane and dataspace and derives the lane-local data-availability identities. The recorded totals include transaction count, chunks, payload bytes, and TEU. After commit, those totals become the lane and dataspace commitment snapshots exposed through authenticated Sumeragi diagnostics. If a block contains lane settlement receipts, block processing also creates lane settlement commitments and relay envelopes that bind the block header, commit certificate, data-availability commitment hash, settlement proof, and lane payload size.':
      'במהלך הכנת הבלוק המועמד, Sumeragi מצרף את המטען המוצע לפי נתיב ומרחב נתונים וגוזר את מזהי זמינות הנתונים המקומיים לכל נתיב. הסכומים הרשומים כוללים את מספר העסקאות, המקטעים, הבתים של המטען ו-TEU. לאחר commit הקונצנזוס, סכומים אלה הופכים לתמונות מצב של התחייבויות הנתיב ומרחב הנתונים, הנחשפות באמצעות אבחון Sumeragi מאומת. אם בלוק מכיל קבלות הסדרה של נתיב, עיבוד הבלוק יוצר גם התחייבויות הסדרה של הנתיב ומעטפות ממסר שקושרות את כותרת הבלוק, תעודת ה-commit, גיבוב התחייבות זמינות הנתונים, הוכחת ההסדרה וגודל המטען של הנתיב.',
    '4. Trigger-produced effects are handled in the block execution pipeline without allowing unbounded recursive trigger execution.':
      '4. האפקטים שהטריגר יוצר מטופלים בתהליך ביצוע הבלוק, בלי לאפשר הפעלה רקורסיבית בלתי מוגבלת של טריגרים.',
    'Use a language-specific guide to register blockchain objects:':
      'השתמשו במדריך הייעודי לכל שפה כדי לרשום אובייקטים בבלוקצ׳יין:',
    'Run Atomic Private Cross-Dataspace Settlement': 'הפעלת סליקה פרטית אטומית בין מרחבי נתונים',
    '| `Offline` | Offline settlement events |': '| `Offline` | אירועי סליקה לא מקוונת |',
    'Byte strings are packed into 7-byte little-endian limbs so every limb is strictly below `p`:':
      'מחרוזות בתים נארזות ליחידות של 7 בתים בסדר little-endian, כך שכל יחידה קטנה ממש מ־`p`:',
    'Its sentinel identifies the intended network with a chain discriminant.':
      'הסנטינל שלו מזהה את הרשת המיועדת באמצעות מבחין השרשרת.',
    'A value such as `treasury@payments.universal` is an account alias, not another spelling of the I105 ID.':
      'ערך כגון `treasury@payments.universal` הוא כינוי חשבון, ולא איות אחר של ה־I105 ID.',
    'Deriving an I105 ID does not register or fund the account.':
      'גזירת I105 ID אינה רושמת את החשבון ואינה מממנת אותו.',
    '- Store and compare the canonical UTF-8 string exactly.': '- שמרו והשוו במדויק את מחרוזת ה־UTF-8 הקנונית.',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- שמרו על רישיות האותיות ואל תחילו נרמול `Unicode`.',
    '- An I105 ID must not have an `@domain` or `@domain.dataspace` suffix.':
      '- ל־I105 ID אסור שתהיה סיומת `@domain` או `@domain.dataspace`.',
    '- A regular expression is not an I105 validator.': '- ביטוי רגולרי אינו כלי אימות ל־I105.',
    '| Part             | Purpose                                                            | Checksum coverage |':
      '| חלק | מטרה | כיסוי סכום הביקורת |',
    '| Network sentinel | Maps the text to one `u16` chain discriminant                      | Not covered       |':
      '| סנטינל רשת | ממפה את הטקסט למבחין שרשרת `u16` אחד | לא מכוסה |',
    '| Payload          | `base-105` encoding of the canonical account-controller bytes      | Covered           |':
      '| מטען | קידוד `base-105` של הבתים הקנוניים של בקר החשבון | מכוסה |',
    '| Checksum         | Six `Bech32m`-style `5-bit` values rendered with the I105 alphabet | N/A               |':
      '| סכום ביקורת | שישה ערכי `5-bit` בסגנון `Bech32m`, המיוצגים באלפבית I105 | N/A |',
    'The payload and checksum identify the account controller.': 'המטען וסכום הביקורת מזהים את בקר החשבון.',
    'A decoder must enforce the expected discriminant.': 'מפענח חייב לאכוף את מבחין השרשרת הצפוי.',
    'The checksum cannot detect a sentinel substitution.': 'סכום הביקורת אינו יכול לזהות החלפה של הסנטינל.',
    '| Network or context      |               Chain discriminant |      Hex | Canonical sentinel                          |':
      '| רשת או הקשר | מבחין שרשרת | Hex | סנטינל קנוני |',
    'The named values always use their named sentinel.': 'ערכים בעלי שם משתמשים תמיד בסנטינל בעל השם המתאים להם.',
    'The transaction-chain ID and the I105 chain discriminant are separate values.':
      'ה־ID של שרשרת העסקאות ומבחין השרשרת של I105 הם ערכים נפרדים.',
    'Choosing an endpoint or chain ID does not implicitly choose the address profile.':
      'בחירת נקודת קצה או ID של שרשרת אינה בוחרת במשתמע את פרופיל הכתובת.',
    'They verify the sentinel, alphabet, checksum, byte lengths, `CurveId`/key shape, and exact address-layer re-encoding.':
      'הפקודות מאמתות את הסנטינל, האלפבית, סכום הביקורת, אורכי הבתים, המבנה של `CurveId`/המפתח, ואת הקידוד מחדש המדויק בשכבת הכתובת.',
    'They do not materialize an `AccountId`.': 'הן אינן יוצרות `AccountId`.',
    'Use strict `AccountId` validation before authorization or persistence.':
      'השתמשו באימות קפדני של `AccountId` לפני הרשאה או שמירה מתמשכת.',
    'For a private network, use its configured discriminant explicitly with `--network-prefix`.':
      'ברשת פרטית, השתמשו במפורש במבחין שהוגדר לה באמצעות `--network-prefix`.',
    'Re-encoding changes only the network context.': 'קידוד מחדש משנה רק את הקשר הרשת.',
    'The checksum-only HRP is the ASCII string `snx`.': 'ה־HRP המשמש רק לסכום הביקורת הוא מחרוזת ה־ASCII `snx`.',
    'The checksum-only HRP is not printed in the address.': 'ה־HRP המשמש רק לסכום הביקורת אינו מופיע בכתובת.',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'אל תחילו NFC, NFKC, המרת רוחב, קיפול רישיות או החלפה בתו דומה למראה.',
    'All multi-byte integers below are unsigned and `big-endian`.':
      'כל המספרים השלמים מרובי־הבתים שלהלן הם ללא סימן ובסדר `big-endian`.',
    '| `0`    |     1 |                          `0` | Reserved `extension flag`    |':
      '| `0` | 1 | `0` | `extension flag` שמור |',
    'Address classes `2` and `3` are unassigned.': 'מחלקות הכתובת `2` ו־`3` אינן מוקצות.',
    'The low-level decoder can preserve other version and normalization bit values and does not independently cross-check the class against the controller tag.':
      'המפענח ברמה הנמוכה יכול לשמר ערכי ביט אחרים של גרסה ונרמול, ואינו מבצע באופן עצמאי בדיקה צולבת של המחלקה מול תג הבקר.',
    'Converting to an `AccountId` and comparing its canonical rendering proves current V1 canonicality.':
      'המרה ל־`AccountId` והשוואה לייצוג הקנוני שלו מוכיחות קנוניות לפי V1 הנוכחי.',
    '| `key_len`    |          1 byte | Raw key length           |': '| `key_len` | בית אחד | אורך המפתח הגולמי |',
    '| `public_key` | `key_len` bytes | Raw public-key payload   |':
      '| `public_key` | `key_len` בתים | מטען המפתח הציבורי הגולמי |',
    '| `key_len`    |         2 bytes | Raw key length, `big-endian` |':
      '| `key_len` | 2 בתים | אורך המפתח הגולמי, `big-endian` |',
    '| `key_len`    |         2 bytes | Raw key length           |': '| `key_len` | 2 בתים | אורך המפתח הגולמי |',
    "Canonical construction sorts members by the signing algorithm's stable name, a zero separator byte, and then the raw public-key bytes.":
      'הבנייה הקנונית ממיינת את החברים לפי השם היציב של אלגוריתם החתימה, אחריו בית מפריד אפס, ולאחר מכן בתי המפתח הציבורי הגולמי.',
    'After configuring the SDK with the expected chain discriminant, parse into an `AccountId` and compare the returned canonical rendering with the trimmed input.':
      'לאחר הגדרת ה־SDK עם מבחין השרשרת הצפוי, נתחו ל־`AccountId` והשוו את הייצוג הקנוני שהוחזר לקלט לאחר הסרת הרווחים מקצותיו.',
    'The comparison is significant because the parser can normalize decodable controller material while constructing the `AccountId`.':
      'ההשוואה חשובה משום שהמנתח יכול לנרמל חומר בקר שניתן לפענוח בעת בניית ה־`AccountId`.',
    '1. Trim only permitted transport whitespace around the complete value.':
      '1. הסירו רק רווחי תעבורה מותרים מסביב לערך המלא.',
    '2. Read the sentinel and require the expected chain discriminant.':
      '2. קראו את הסנטינל ודרשו את מבחין השרשרת הצפוי.',
    '3. Map every remaining `Unicode` symbol through the exact 105-symbol alphabet.':
      '3. מפו כל סמל `Unicode` שנותר דרך האלפבית המדויק בן 105 הסמלים.',
    '7. Parse the header and controller, requiring:': '7. נתחו את הכותרת ואת הבקר, ודרשו:',
    '- no trailing bytes': '- שלא יהיו בתים עודפים בסוף',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. הציגו את `AccountId` בצורה קנונית עבור המבחין הצפוי.',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. דרשו שוויון `byte-for-byte` לקלט לאחר הסרת הרווחים מקצותיו.',
    "The application's explicit final `render-and-compare` step rejects non-minimal numeric sentinels, non-canonical controller layouts, reordered policy material, and any other spelling that decodes but is not the encoder's current V1 output.":
      'שלב ה־`render-and-compare` הסופי והמפורש של היישום דוחה סנטינלים מספריים שאינם מינימליים, פריסות בקר שאינן קנוניות, חומר מדיניות שסודר מחדש, וכל איות אחר שניתן לפענוח אך אינו הפלט הנוכחי של מקודד V1.',
    'A successful checksum or low-level `AccountAddress` parse is not a substitute for this check.':
      'אימות מוצלח של סכום הביקורת או ניתוח מוצלח ברמה הנמוכה של `AccountAddress` אינם תחליף לבדיקה זו.',
    '| `ERR_I105_TOO_SHORT`             | The body cannot contain both payload and checksum                   |':
      '| `ERR_I105_TOO_SHORT` | הגוף אינו יכול להכיל גם את המטען וגם את סכום הביקורת |',
    '- an account alias such as `alice@wonderland.universal`': '- כינוי חשבון כגון `alice@wonderland.universal`',
    '- an I105 literal with an appended `@domain` suffix': '- ליטרל I105 שבסופו נוספה סיומת `@domain`',
    '- an address for the wrong chain discriminant': '- כתובת עבור מבחין שרשרת שגוי',
    '- Send the exact I105 UTF-8 string in JSON account fields.':
      '- שלחו את מחרוזת I105 UTF-8 המדויקת בשדות החשבון ב־JSON.',
    '- `Percent-encode` the complete account ID before placing it in a URL path segment.':
      '- לפני הצבת ID החשבון המלא במקטע נתיב של URL, בצעו לו `Percent-encode`.',
    '- Never substitute an account alias for an I105 ID.': '- לעולם אל תשתמשו בכינוי חשבון במקום I105 ID.',
    '- Store the canonical string returned by the codec with `byte-preserving` comparison semantics.':
      '- שמרו את המחרוזת הקנונית שה־codec מחזיר, עם סמנטיקת השוואה `byte-preserving`.',
    '- Use a collation that preserves letter case and character width.':
      '- השתמשו בקולציה המשמרת רישיות אותיות ורוחב תווים.',
    '- Keep the chain discriminant or named network profile with exported account data and backups.':
      '- שמרו את מבחין השרשרת או את פרופיל הרשת בעל השם יחד עם נתוני החשבון שיוצאו ועם הגיבויים.',
    '- Display the complete address and provide a copy action.': '- הציגו את הכתובת המלאה וספקו פעולת העתקה.',
    'Call the explicit `AccountAddress` I105 encoder when an external account ID is required.':
      'כאשר נדרש ID של חשבון חיצוני, הפעילו את מקודד I105 המפורש של `AccountAddress`.',
  },
  ja: {
    'World State View': 'ワールド・ステート・ビュー',
    '- Select the network profile before encoding or validating an address.':
      '- アドレスをエンコードまたは検証する前に、ネットワークプロファイルを選択してください。',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- 英字の大文字と小文字を保持し、`Unicode` 正規化を適用しないでください。',
    '- A regular expression is not an I105 validator.': '- 正規表現は I105 バリデーターではありません。',
    '| Part             | Purpose                                                            | Checksum coverage |':
      '| 部分 | 目的 | チェックサムの対象 |',
    '| Network sentinel | Maps the text to one `u16` chain discriminant                      | Not covered       |':
      '| ネットワークセンチネル | テキストを 1 つの `u16` チェーン識別値に対応付ける | 対象外 |',
    '| Checksum         | Six `Bech32m`-style `5-bit` values rendered with the I105 alphabet | N/A               |':
      '| チェックサム | I105 アルファベットで表現した `Bech32m` 形式の 6 個の `5-bit` 値 | N/A |',
    'The payload and checksum identify the account controller.':
      'ペイロードとチェックサムはアカウントコントローラーを識別します。',
    'A decoder must enforce the expected discriminant.':
      'デコーダーは期待されるチェーン識別値を必ず検証しなければなりません。',
    'The checksum cannot detect a sentinel substitution.': 'チェックサムではセンチネルの置き換えを検出できません。',
    '| Network or context      |               Chain discriminant |      Hex | Canonical sentinel                          |':
      '| ネットワークまたはコンテキスト | チェーン識別値 | Hex | 正規センチネル |',
    'The named values always use their named sentinel.':
      '名前付きの値には、常に対応する名前付きセンチネルを使用します。',
    'Forms such as `n00042`, `n369`, `n753`, and `n0` are not canonical.':
      '`n00042`、`n369`、`n753`、`n0` のような形式は正規ではありません。',
    'Use strict `AccountId` validation before authorization or persistence.':
      '認可または永続化の前に、厳格な `AccountId` 検証を行ってください。',
    'For a private network, use its configured discriminant explicitly with `--network-prefix`.':
      'プライベートネットワークでは、設定済みのチェーン識別値を `--network-prefix` で明示的に指定してください。',
    'The checksum uses the `Bech32` `polymod` generators and constant `0x2bc830a3`.':
      'チェックサムでは、`Bech32` の `polymod` 生成子と定数 `0x2bc830a3` を使用します。',
    'The checksum-only HRP is not printed in the address.': 'チェックサム専用の HRP はアドレスに出力されません。',
    'All multi-byte integers below are unsigned and `big-endian`.':
      '以下の複数バイト整数はすべて符号なしで、`big-endian` です。',
    'The `base-105` body encodes a binary account payload, not a public-key string and not a Norito JSON object:':
      '`base-105` 本文はバイナリアカウントペイロードをエンコードするものであり、公開鍵文字列でも Norito JSON オブジェクトでもありません:',
    'Converting to an `AccountId` and comparing its canonical rendering proves current V1 canonicality.':
      '`AccountId` に変換し、その正規の表現と比較することで、現在の V1 正規性を確認できます。',
    'Use the compact form when the raw public-key payload is at most 255 bytes:':
      '生の公開鍵ペイロードが 255 バイト以下の場合は、コンパクト形式を使用します:',
    '| `key_len`    |          1 byte | Raw key length           |': '| `key_len` | 1 バイト | 生の鍵の長さ |',
    '| `public_key` | `key_len` bytes | Raw public-key payload   |':
      '| `public_key` | `key_len` バイト | 生の公開鍵ペイロード |',
    'Keys longer than 255 bytes use the extended form:': '255 バイトを超える鍵では拡張形式を使用します:',
    '| `key_len`    |         2 bytes | Raw key length, `big-endian` |':
      '| `key_len` | 2 バイト | 生の鍵の長さ、`big-endian` |',
    '| `public_key` | `key_len` bytes | Raw public-key payload       |':
      '| `public_key` | `key_len` バイト | 生の公開鍵ペイロード |',
    'An extended encoding is not canonical for a key that fits the compact form.':
      'コンパクト形式に収まる鍵に対して、拡張エンコードは正規ではありません。',
    '| `threshold`      |  2 bytes | Required total approval weight |':
      '| `threshold` | 2 バイト | 必要な承認の重みの合計 |',
    '| `weight`     |         2 bytes | Member approval weight   |': '| `weight` | 2 バイト | メンバーの承認の重み |',
    '| `key_len`    |         2 bytes | Raw key length           |': '| `key_len` | 2 バイト | 生の鍵の長さ |',
    "Canonical construction sorts members by the signing algorithm's stable name, a zero separator byte, and then the raw public-key bytes.":
      '正規構築では、署名アルゴリズムの安定した名前、ゼロ区切りバイト、生の公開鍵バイトの順でメンバーを並べ替えます。',
    'After configuring the SDK with the expected chain discriminant, parse into an `AccountId` and compare the returned canonical rendering with the trimmed input.':
      'SDK に期待されるチェーン識別値を設定した後、`AccountId` として解析し、返された正規の表現を前後の許可された空白を除去した入力と比較します。',
    '1. Trim only permitted transport whitespace around the complete value.':
      '1. 値全体の前後にある、許可された転送上の空白だけを除去します。',
    '5. Convert the payload digits back to canonical bytes.': '5. ペイロードの各桁を正規バイト列へ戻します。',
    '6. Verify the checksum over those canonical bytes.': '6. その正規バイト列に対してチェックサムを検証します。',
    '- no trailing bytes': '- 末尾に余分なバイトがないこと',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. 期待されるチェーン識別値に対して `AccountId` を正規形式で表現します。',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. 前後の許可された空白を除去した入力との `byte-for-byte` 一致を要求します。',
    "The application's explicit final `render-and-compare` step rejects non-minimal numeric sentinels, non-canonical controller layouts, reordered policy material, and any other spelling that decodes but is not the encoder's current V1 output.":
      'アプリケーションの明示的な最終 `render-and-compare` ステップでは、最小形式でない数値センチネル、非正規のコントローラーレイアウト、並べ替えられたポリシー素材、およびデコードできてもエンコーダーの現在の V1 出力ではないその他の表記を拒否します。',
    '- an I105 literal with an appended `@domain` suffix': '- 末尾に `@domain` サフィックスを付加した I105 リテラル',
    '- an address for the wrong chain discriminant': '- 誤ったチェーン識別値のアドレス',
    '- `Percent-encode` the complete account ID before placing it in a URL path segment.':
      '- 完全なアカウント ID を URL パスセグメントに配置する前に `Percent-encode` してください。',
    '- Never substitute an account alias for an I105 ID.':
      '- I105 ID の代わりにアカウントエイリアスを使用しないでください。',
    '- Use a collation that preserves letter case and character width.':
      '- 英字の大文字と小文字、および文字幅を保持する照合順序を使用してください。',
    '- Display the complete address and provide a copy action.':
      '- 完全なアドレスを表示し、コピー操作を提供してください。',
    'Call the explicit `AccountAddress` I105 encoder when an external account ID is required.':
      '外部アカウント ID が必要な場合は、明示的な `AccountAddress` I105 エンコーダーを呼び出してください。',
    '- executor/runtime, proofs, bridges, and SORA/Nexus modules':
      '- エグゼキューター／ランタイム、証明、ブリッジ、SORA／Nexus モジュール',
    'When a Python helper is not available, feed canonical data-model `InstructionBox` JSON into `Instruction.from_json`. This is the recommended path for `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, peer/role/NFT registration, and non-trigger unregister variants until those helpers are typed.':
      'Python ヘルパーがない場合は、正規のデータモデル `InstructionBox` JSON を `Instruction.from_json` に渡します。`Grant`、`Revoke`、`SetParameter`、`Log`、`Custom`、`Upgrade`、ピア／ロール／NFT の登録、およびトリガー以外の登録解除については、それぞれの型付きヘルパーが用意されるまで、この方法を推奨します。',
    'To regenerate a full Markdown help snapshot from the source checkout, run:':
      'ソースの作業ツリーから完全な Markdown ヘルプのスナップショットを再生成するには、次を実行します:',
    'Set `VITE_COMPAT_MATRIX_URL` only to override the bundled snapshot with a compatible live backend. Without that variable, the page loads `src/public/compat-matrix.json`.':
      '`VITE_COMPAT_MATRIX_URL` は、同梱のスナップショットを互換性のある稼働中のバックエンドで上書きする場合にのみ設定します。この変数がなければ、ページは `src/public/compat-matrix.json` を読み込みます。',
    'Inspect the detected format, canonical hex, and selected network context as JSON:':
      '検出された形式、正規の 16 進表現、選択したネットワークコンテキストを JSON で確認します:',
    'Block and event stream examples rely on Torii streaming endpoints. Verify the peer is still running, then test with a timeout:':
      'ブロックとイベントストリームの例は、Torii のストリーミング API エンドポイントを使用します。ピアが引き続き稼働していることを確認してから、タイムアウトを指定してテストします:',
    '<p style="font-weight: 200; font-size: 0.875rem;">Hyperledger Iroha is part of <a href="https://www.lfdecentralizedtrust.org/projects/tag/ledger-technology" target="_blank">LF Decentralized Trust</a>. Learn more at <a href="https://iroha.tech/" target="_blank">iroha.tech</a>.</p>':
      '<p style="font-weight: 200; font-size: 0.875rem;">Hyperledger Iroha は <a href="https://www.lfdecentralizedtrust.org/projects/tag/ledger-technology" target="_blank">LF Decentralized Trust</a> のプロジェクトです。詳しくは <a href="https://iroha.tech/" target="_blank">iroha.tech</a> をご覧ください。</p>',
    'A peer only commits genesis when its storage is empty. To test a new genesis in a disposable localnet, stop the peers, remove their generated state directory, and start from the new signed genesis. Do not replace genesis on a running network unless every validator is coordinating the same migration.':
      'ピアはストレージが空の場合にのみジェネシストランザクションを確定します。使い捨てのローカルネットで新しいジェネシスをテストするには、ピアを停止し、生成済みの状態ディレクトリを削除して、新しい署名済みジェネシスから起動します。すべてのバリデーターが同じ移行を協調して実施している場合を除き、稼働中のネットワークでジェネシスを置き換えないでください。',
    '- keep the canonical hash host under the SoraDNS gateway domain for GAR checks':
      '- GAR チェックのため、正規ハッシュホストを SoraDNS ゲートウェイドメイン配下に維持します',
    'All write commands select the authority as fee payer explicitly. The CLI quotes the exact transaction before signing and waits by default.':
      'すべての書き込みコマンドでは、手数料支払者として認可主体を明示的に指定します。CLI は署名前に対象トランザクションの正確な手数料見積もりを提示し、既定では完了を待機します。',
    'The first build publishes the artifact and authenticated sidecars. The second runs in read-only `--verify` mode and fails if any existing output does not exactly match the current source. Treat the `.to` file and its manifest as one reviewed build output.':
      '最初のビルドでは、成果物と認証済みの付随ファイルを生成します。2 回目のビルドは読み取り専用の `--verify` モードで実行され、既存の出力が現在のソースと完全に一致しない場合は失敗します。`.to` ファイルとそのマニフェストは、レビュー済みの 1 つのビルド出力として扱ってください。',
    '- If submission times out after returning a hash, query that hash before building another transaction. Blind resubmission creates a new quoted and signed payload.':
      '- 送信処理がハッシュを返した後にタイムアウトした場合は、別のトランザクションを作成する前にそのハッシュを照会してください。確認せずに再送信すると、手数料見積もり済みで署名済みの新しいペイロードが作成されます。',
    '4. After every leg has a Prepare certificate, build the immutable complete Prepare barrier. Request and persist canonical 3-of-4 Commit certificates. If the coordinator restarts, query participant nodes for their locally durable Prepare and Commit certificates, select a canonical quorum-equivalent certificate, and re-fan it out before continuing; never reconstruct a certificate from an unauthenticated local cache.':
      '4. すべての決済区間について Prepare 証明書がそろったら、変更不能な完全 Prepare バリアを構築します。標準形式の 3-of-4 Commit 証明書を要求して永続化します。コーディネーターが再起動した場合は、参加ノードにローカルで永続化された Prepare 証明書と Commit 証明書を照会し、標準形式でクォーラムと同等の証明書を選択して、処理を続行する前に再配布します。認証されていないローカルキャッシュから証明書を再構築してはいけません。',
    '- both formal layers: the 3/255-leg count-symmetry checks and the exact four-validator committee-indexed N=2 validator-focused plus full bounded- fault, paper-primary N=3 fault, N=4 clean, and N=3 expiry/replay configurations, with fault budgets independent per committee':
      '- 2 つの形式レイヤーの両方：3/255 区間の個数対称性チェックと、正確に 4 台のバリデータを使う委員会インデックス付き構成（N=2 のバリデータ重点構成と完全な有界障害構成、論文で主要対象とする N=3 障害構成、N=4 正常構成、N=3 有効期限切れ／リプレイ構成）。障害予算は委員会ごとに独立させます',
    '[^1]: `Register<Account>` creates ledger state for a canonical, domainless `AccountId`; domain routing and aliases are managed separately.':
      '[^1]: `Register<Account>` は、標準形式のドメインなし `AccountId` について台帳状態を作成します。ドメインルーティングとエイリアスは別個に管理されます。',
    'Kaigi writes are instructions inside ordinary quoted and signed transactions. Submit them through `POST /v1/pipeline/transactions` and wait for finalized block evidence.':
      'Kaigi の書き込みは、通常の手数料見積もり済み・署名済みトランザクションに含まれる命令です。`POST /v1/pipeline/transactions` を通じて送信し、最終化されたブロックの証拠を待ってください。',
    'The real demo result also carries finalized block evidence and any quoted fee. Do not treat a transaction hash alone as success.':
      '実際のデモ結果には、最終化されたブロックの証拠と、提示された手数料見積もりも含まれます。トランザクションハッシュだけを成功の証拠として扱わないでください。',
    'The payload and Minamoto form below come from the cross-SDK compliance fixture.':
      '以下のペイロードと Minamoto 形式は、SDK 間の適合性テスト用フィクスチャに由来します。',
  },
  ka: {
    'The governed atomic-private-settlement instruction family is separate from transparent Native AMX. `ActivatePrivateSettlementPoolV1` establishes one route-scoped confidential pool from a redacted governance projection and canonical origin commitments. `FinalizeAtomicPrivateSettlementV1` applies one complete committee-certified bundle atomically, while `AbortAtomicPrivateSettlementV1` publishes only the sponsor-authorized public terminal marker.':
      'მართული ატომური კერძო ანგარიშსწორების ინსტრუქციების ოჯახი გამჭვირვალე ადგილობრივი AMX-ისგან განცალკევებულია. `ActivatePrivateSettlementPoolV1` რედაქტირებული მმართველობის პროექციისა და კანონიკური საწყისი ვალდებულებების საფუძველზე მარშრუტის ფარგლებში ერთ კონფიდენციალურ პულს ქმნის. `FinalizeAtomicPrivateSettlementV1` კომიტეტის მიერ დამოწმებულ ერთ სრულ პაკეტს ატომურად იყენებს, ხოლო `AbortAtomicPrivateSettlementV1` მხოლოდ სპონსორის მიერ ავტორიზებულ საჯარო საბოლოო მარკერს აქვეყნებს.',
    'RAM-LFE stands for Random-Access Machine Laconic Function Evaluation. In Iroha, it is the generic hidden-function layer for programs whose public policy is on-chain but whose evaluator logic, secret, or raw input should not be written to world state. It is used by SORA Nexus identifier flows, such as private phone or email lookup, and can also be exposed as a generic Torii program-execution helper when a node profile enables the app-facing routes.':
      'RAM-LFE ნიშნავს შემთხვევითი წვდომის მანქანით ლაკონური ფუნქციის შეფასებას. Iroha-ში ეს არის დამალული ფუნქციების ზოგადი ფენა პროგრამებისთვის, რომელთა საჯარო პოლიტიკა ჯაჭვზეა, მაგრამ შემფასებლის ლოგიკა, საიდუმლო ან ნედლი შესატანი მსოფლიო მდგომარეობაში არ უნდა ჩაიწეროს. მას SORA Nexus-ის იდენტიფიკატორების ნაკადები იყენებს, მაგალითად, ტელეფონის ნომრის ან ელფოსტის პირადი ძიება; ის ასევე შეიძლება გამოქვეყნდეს Torii-ის პროგრამის შესრულების ზოგად დამხმარედ, როდესაც კვანძის პროფილი აპლიკაციისკენ მიმართულ მარშრუტებს რთავს.',
    '### Carbon Credit Retirement {#carbon-credit-retirement}':
      '### ნახშირბადის კრედიტის გამოყენებიდან ამოღება {#carbon-credit-retirement}',
    '- pin Torii URLs: `https://taira-validator-1.sora.org` through `https://taira-validator-4.sora.org`':
      '- Torii URLs დაამაგრეთ: `https://taira-validator-1.sora.org`-დან `https://taira-validator-4.sora.org`-მდე',
    'The first build publishes the artifact and authenticated sidecars. The second runs in read-only `--verify` mode and fails if any existing output does not exactly match the current source. Treat the `.to` file and its manifest as one reviewed build output.':
      'პირველი აგება აქვეყნებს არტეფაქტსა და ავთენტიფიცირებულ თანმხლებ ფაილებს. მეორე მხოლოდ წაკითხვის `--verify` რეჟიმში მუშაობს და შეცდომით სრულდება, თუ არსებული რომელიმე შედეგი მიმდინარე წყაროს ზუსტად არ ემთხვევა. `.to` ფაილი და მისი მანიფესტი ერთ, შემოწმებულ აგების შედეგად განიხილეთ.',
    'Consume live Taira pipeline events over server-sent events (SSE), reconnect with bounded backoff, and refresh durable state after the replacement stream is open. Because the endpoint has no replay cursor, treat events as notifications rather than a complete history.':
      'მიიღეთ Taira-ს დამუშავების ნაკადის ცოცხალი მოვლენები სერვერის მიერ გამოგზავნილი მოვლენების (SSE) საშუალებით, კავშირი შეზღუდული მზარდი დაყოვნებით აღადგინეთ და შემცვლელი ნაკადის გახსნის შემდეგ მდგრადი მდგომარეობა განაახლეთ. რადგან API-ის საბოლოო წერტილს განმეორებითი დაკვრის კურსორი არ აქვს, მოვლენები სრულ ისტორიად კი არა, შეტყობინებებად განიხილეთ.',
    'This is content confidentiality, not traffic-flow anonymity. Timing, participant count, dataspace identity, and stable-pool activity remain public. A dataspace that hosts only one CBDC may also make the asset inferable from the route even though no literal asset identifier is published.':
      'ეს არის შინაარსის კონფიდენციალურობა და არა ტრაფიკის ნაკადის ანონიმურობა. დრო, მონაწილეთა რაოდენობა, მონაცემთა სივრცის იდენტობა და სტაბილური პულის აქტივობა საჯარო რჩება. მონაცემთა სივრცემ, რომელშიც მხოლოდ ერთი CBDC არის განთავსებული, შეიძლება აქტივი მარშრუტიდან გამოსაცნობიც გახადოს, მიუხედავად იმისა, რომ აქტივის პირდაპირი იდენტიფიკატორი არ ქვეყნდება.',
    'All production behavior comes from the node configuration. Environment variables cannot activate this path. The shipped default is `enabled = false`; leaving the feature disabled requires no settlement-specific configuration.':
      'საწარმოო გარემოში მთელი ქცევა კვანძის კონფიგურაციიდან მოდის. გარემოს ცვლადები ამ გზას ვერ ააქტიურებს. მიწოდებული ნაგულისხმევი მნიშვნელობაა `enabled = false`; ფუნქციის გამორთულად დატოვება ანგარიშსწორებისთვის სპეციფიკურ კონფიგურაციას არ მოითხოვს.',
    'Use the privacy-governance-authorized `RotatePrivateSettlementPoolPolicyV1` instruction. It must name the exact current governance digest, keep the same route, pool, and asset-binding commitment, advance the governance revision by one, use a strictly newer key epoch and different policy/governance digests, and activate at the block that contains the rotation. The pool frontier, roots, nullifiers, outputs, replay sets, and finalized receipts are preserved. Do not include a receipt touching that same route/pool at the rotation\'s activation height; the instruction rejects that boundary.':
      'გამოიყენეთ კონფიდენციალურობის მმართველობის მიერ ავტორიზებული `RotatePrivateSettlementPoolPolicyV1` ინსტრუქცია. მან ზუსტად უნდა მიუთითოს მმართველობის მიმდინარე დაიჯესტი, შეინარჩუნოს იგივე მარშრუტი, პული და აქტივთან დამაკავშირებელი ვალდებულება, მმართველობის რევიზია ერთით გაზარდოს, გამოიყენოს მკაცრად უფრო ახალი გასაღების ეპოქა და განსხვავებული პოლიტიკისა და მმართველობის დაიჯესტები და გააქტიურდეს როტაციის შემცველ ბლოკში. პულის საზღვარი, ფესვები, ნულიფიკატორები, შედეგები, განმეორებითი დაკვრის ნაკრებები და საბოლოო ქვითრები უცვლელად რჩება. როტაციის აქტივაციის სიმაღლეზე იმავე მარშრუტს ან პულს არ უნდა ეხებოდეს არცერთი ქვითარი; ინსტრუქცია ასეთ საზღვარს უარყოფს.',
    '- both formal layers: the 3/255-leg count-symmetry checks and the exact four-validator committee-indexed N=2 validator-focused plus full bounded- fault, paper-primary N=3 fault, N=4 clean, and N=3 expiry/replay configurations, with fault budgets independent per committee':
      '- ორივე ფორმალური ფენა: 3/255 ნაწილის რაოდენობის სიმეტრიის შემოწმებები და ზუსტად ოთხი ვალიდატორისგან შემდგარი, კომიტეტის ინდექსით განსაზღვრული N=2 ვალიდატორზე ორიენტირებული და სრულად შეზღუდული ხარვეზის, ნაშრომის ძირითადი N=3 ხარვეზის, N=4 სუფთა და N=3 ვადის გასვლის/განმეორებითი დაკვრის კონფიგურაციები; ხარვეზის ბიუჯეტი თითოეული კომიტეტისთვის დამოუკიდებელია',
    'Do not use `gas_asset_id` for the "local-token fee" pattern unless you want the sponsor to be charged in that gas asset too. In the current runtime, `fee_sponsor` also makes the sponsor the payer for configured pipeline-gas asset debits. For local-token user fees, collect the token explicitly with a transfer or contract rule.':
      'არ გამოიყენოთ `gas_asset_id` „ლოკალური ტოკენის საფასურის“ ნიმუშისთვის, თუ არ გსურთ, რომ სპონსორს ამ გაზის აქტივშიც დაეკისროს საფასური. მიმდინარე შესრულების გარემოში `fee_sponsor` სპონსორს კონფიგურირებული დამუშავების ნაკადის გაზის აქტივიდან ჩამოჭრის გადამხდელადაც აქცევს. ლოკალური ტოკენით მომხმარებლის საფასურის მისაღებად ტოკენი პირდაპირ, გადარიცხვით ან კონტრაქტის წესით შეაგროვეთ.',
    'The top-level `chain` is the current Nexus mainnet chain ID. `[account].profile = "minamoto"` selects the Minamoto I105 chain discriminant; the endpoint hostname and chain ID do not select it implicitly.':
      'ზედა დონის `chain` არის Nexus-ის მიმდინარე ძირითადი ქსელის ჯაჭვის ID. `[account].profile = "minamoto"` ირჩევს Minamoto I105-ის ჯაჭვის დისკრიმინანტს; API-ის საბოლოო წერტილის ჰოსტის სახელი და ჯაჭვის ID მას ავტომატურად არ ირჩევს.',
    'Use `--seed-hex` only with an exact 32-byte hexadecimal secret for reproducible development fixtures. For production deployment, omit it so Kagami uses operating-system randomness, then move the unencrypted private-key export into the approved custody boundary. The command never prints private keys.':
      'გამოიყენეთ `--seed-hex` მხოლოდ ზუსტად 32-ბაიტიან თექვსმეტობით საიდუმლოსთან ერთად, განმეორებადი განვითარების სატესტო მონაცემებისთვის. საწარმოო განთავსებისას გამოტოვეთ იგი, რათა Kagami-მ ოპერაციული სისტემის შემთხვევითობის წყარო გამოიყენოს, შემდეგ კი დაშიფვრის გარეშე ექსპორტირებული პირადი გასაღები დამტკიცებულ დაცულ საზღვარში გადაიტანეთ. ბრძანება პირად გასაღებებს არასოდეს ბეჭდავს.',
    'The current JavaScript SDK is the `@iroha/iroha-js` package in the Iroha source tree. It is the Node.js-first SDK for Torii, Norito builders, signing, pagination, Connect previews, and Kagemusha command transport.':
      'მიმდინარე JavaScript SDK არის Iroha-ს წყაროს ხეში არსებული `@iroha/iroha-js` პაკეტი. ეს არის Node.js-ზე ორიენტირებული SDK Torii-სთვის, Norito-ს შემქმნელებისთვის, ხელმოწერისთვის, გვერდებად დაყოფისთვის, Connect-ის წინასწარი დათვალიერებისთვის და Kagemusha-ს ბრძანებების ტრანსპორტისთვის.',
    '### JSON Escape Hatch {#json-escape-hatch}': '### JSON-ის სარეზერვო გზა {#json-escape-hatch}',
    '| Repo/settlement extensions                                                                     | `repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp`                                                                                                      |':
      '| რეპოს/ანგარიშსწორების გაფართოებები | `repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp` |',
    'Repo and bilateral-settlement helpers append domain-specific instruction variants without hand-crafting Norito payloads:':
      'რეპოსა და ორმხრივი ანგარიშსწორების დამხმარეები დომენისთვის სპეციფიკურ ინსტრუქციის ვარიანტებს Norito-ს სასარგებლო დატვირთვების ხელით აგების გარეშე ამატებენ:',
    '| Streaming | Norito Streaming uses Norito manifests, segment headers, control frames, and conformance fixtures. |':
      '| ნაკადური გადაცემა | Norito ნაკადური გადაცემა იყენებს Norito-ს მანიფესტებს, სეგმენტის სათაურებს, მართვის ჩარჩოებსა და შესაბამისობის სატესტო მონაცემებს. |',
    '| `to_compressed_bytes` | Encode with Zstd and record the compression tag in the header. |':
      '| `to_compressed_bytes` | Zstd-ით კოდირება და შეკუმშვის ტეგის სათაურში ჩაწერა. |',
    'Debug-only switch for exercising Sumeragi soft-fork handling paths. Leave this disabled outside controlled tests; changing it on a running production network can make peers disagree about consensus behavior.':
      'მხოლოდ გამართვისთვის განკუთვნილი გადამრთველი, რომლითაც Sumeragi-ის რბილი ფორკის დამუშავების გზები მოწმდება. კონტროლირებული ტესტების გარეთ იგი გამორთული დატოვეთ; მოქმედ საწარმოო ქსელში მისმა შეცვლამ შეიძლება კვანძებს შორის კონსენსუსის ქცევაზე უთანხმოება გამოიწვიოს.',
    'Frequency of snapshots.': 'მდგომარეობის ანაბეჭდების შექმნის სიხშირე.',
    'Directory where to store snapshots.': 'კატალოგი, სადაც მდგომარეობის ანაბეჭდები ინახება.',
    '## JSON vs. Norito {#json-vs-norito}': '## JSON და Norito: შედარება {#json-vs-norito}',
    'Plain-text client configuration is suitable only for local development and controlled tests. A production integration should obtain signatures through its approved custody boundary. The stock Iroha CLI reads a private key from client configuration and does not provide a generic external-signer adapter. Custom clients can construct the transaction payload hash and attach a signature produced by an external signer.':
      'ღია ტექსტის კლიენტის კონფიგურაცია გამოდგება მხოლოდ ლოკალური შემუშავებისა და კონტროლირებადი ტესტებისთვის. საწარმოო ინტეგრაციამ ხელმოწერები უნდა მიიღოს დამტკიცებული დაცული შენახვის საზღვრის მეშვეობით. სტანდარტული Iroha CLI კითხულობს პირად გასაღებს კლიენტის კონფიგურაციიდან და ზოგად გარე ხელმომწერის ადაპტერს არ უზრუნველყოფს. სპეციალიზებულ კლიენტებს შეუძლიათ შექმნან ტრანზაქციის სასარგებლო დატვირთვის ჰეში და დაურთონ გარე ხელმომწერის მიერ შექმნილი ხელმოწერა.',
    '- When repetitions reach zero, minting more repetitions is another privileged write. Do not silently change this recipe to an indefinite trigger.':
      '- როდესაც გამეორებების რაოდენობა ნულს მიაღწევს, დამატებითი გამეორებების მინიჭება კიდევ ერთი პრივილეგირებული ჩაწერის ოპერაციაა. ეს რეცეპტი შეუმჩნევლად არ გადააკეთოთ განუსაზღვრელი რაოდენობის გამეორების მქონე ტრიგერად.',
    'In an Iroha network, a peer is selected randomly and granted the special privilege of forming the next block. This privilege can be revoked in networks that achieve [Byzantine fault tolerance](#byzantine-fault-tolerance-bft) via [view change](#view-change).':
      'Iroha-ს ქსელში ქსელის კვანძი შემთხვევით შეირჩევა და მას მომდევნო ბლოკის ფორმირების განსაკუთრებული უფლება ენიჭება. ეს უფლება შეიძლება გაუქმდეს იმ ქსელებში, რომლებიც [ბიზანტიური ხარვეზებისადმი მედეგობას](#byzantine-fault-tolerance-bft) [ხედის შეცვლის](#view-change) მეშვეობით აღწევენ.',
    'For browser access, SoraDNS derives gateway hosts from a registered FQDN. The registered vanity host remains the canonical application origin, while deployed gateway profiles expose browser and Torii fallback routes for that origin.':
      'ბრაუზერიდან წვდომისთვის SoraDNS რეგისტრირებული FQDN-ის საფუძველზე კარიბჭის ჰოსტებს წარმოქმნის. რეგისტრირებული ინდივიდუალური ჰოსტი აპლიკაციის კანონიკურ საწყის მისამართად რჩება, ხოლო განთავსებული კარიბჭის პროფილები ამ მისამართისთვის ბრაუზერისა და Torii-ის სარეზერვო მარშრუტებს აქვეყნებს.',
    'A value such as `treasury@payments.universal` is an account alias, not another spelling of the I105 ID.':
      'ისეთი მნიშვნელობა, როგორიცაა `treasury@payments.universal`, ანგარიშის ალიასია და არა I105 ID-ის ჩაწერის სხვა ფორმა.',
    'Deriving an I105 ID does not register or fund the account.':
      'I105 ID-ის გამოყვანა ანგარიშს არც არეგისტრირებს და არც აფინანსებს.',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- შეინარჩუნეთ ასოების რეგისტრი და არ გამოიყენოთ `Unicode` ნორმალიზაცია.',
    '- An I105 ID must not have an `@domain` or `@domain.dataspace` suffix.':
      '- I105 ID-ს არ უნდა ჰქონდეს `@domain` ან `@domain.dataspace` სუფიქსი.',
    '| Part             | Purpose                                                            | Checksum coverage |':
      '| ნაწილი | დანიშნულება | საკონტროლო ჯამის დაფარვა |',
    '| Network sentinel | Maps the text to one `u16` chain discriminant                      | Not covered       |':
      '| ქსელის სენტინელი | ტექსტს აკავშირებს ერთ `u16` ჯაჭვის დისკრიმინანტთან | არ არის დაფარული |',
    '| Checksum         | Six `Bech32m`-style `5-bit` values rendered with the I105 alphabet | N/A               |':
      '| საკონტროლო ჯამი | I105 ანბანით წარმოდგენილი `Bech32m`-ის სტილის ექვსი `5-bit` მნიშვნელობა | N/A |',
    'The payload and checksum identify the account controller.':
      'სასარგებლო დატვირთვა და საკონტროლო ჯამი ანგარიშის კონტროლერს განსაზღვრავს.',
    'A decoder must enforce the expected discriminant.':
      'დეკოდერმა უნდა უზრუნველყოს მოსალოდნელ დისკრიმინანტთან შესაბამისობა.',
    'The checksum cannot detect a sentinel substitution.':
      'საკონტროლო ჯამს სენტინელის ჩანაცვლების აღმოჩენა არ შეუძლია.',
    '| Network or context      |               Chain discriminant |      Hex | Canonical sentinel                          |':
      '| ქსელი ან კონტექსტი | ჯაჭვის დისკრიმინანტი | Hex | კანონიკური სენტინელი |',
    'The named values always use their named sentinel.':
      'დასახელებული მნიშვნელობები ყოველთვის შესაბამის დასახელებულ სენტინელს იყენებს.',
    'Inspect the detected format, canonical hex, and selected network context as JSON:':
      'შეამოწმეთ აღმოჩენილი ფორმატი, კანონიკური hex და არჩეული ქსელის კონტექსტი JSON-ის სახით:',
    'Audit the address-codec structure of a newline-separated file without silently accepting parse failures:':
      'ახალი ხაზებით გამოყოფილი ფაილის address-codec-ის სტრუქტურა ისე შეამოწმეთ, რომ პარსინგის შეცდომები ჩუმად არ მიიღოთ:',
    'They verify the sentinel, alphabet, checksum, byte lengths, `CurveId`/key shape, and exact address-layer re-encoding.':
      'ისინი ამოწმებენ სენტინელს, ანბანს, საკონტროლო ჯამს, ბაიტების სიგრძეებს, `CurveId`/გასაღების სტრუქტურას და მისამართის ფენაზე ზუსტ ხელახალ კოდირებას.',
    'Use strict `AccountId` validation before authorization or persistence.':
      'ავტორიზაციამდე ან მუდმივ შენახვამდე გამოიყენეთ `AccountId`-ის მკაცრი ვალიდაცია.',
    'The checksum uses the `Bech32` `polymod` generators and constant `0x2bc830a3`.':
      'საკონტროლო ჯამი იყენებს `Bech32` `polymod` გენერატორებს და კონსტანტას `0x2bc830a3`.',
    'The checksum-only HRP is the ASCII string `snx`.':
      'მხოლოდ საკონტროლო ჯამისთვის განკუთვნილი HRP არის ASCII სტრიქონი `snx`.',
    'The checksum-only HRP is not printed in the address.':
      'მხოლოდ საკონტროლო ჯამისთვის განკუთვნილი HRP მისამართში არ იბეჭდება.',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'არ გამოიყენოთ NFC, NFKC, სიგანის გარდაქმნა, ასოების რეგისტრის გათანაბრება ან ვიზუალურად მსგავსი სიმბოლოთი ჩანაცვლება.',
    'All multi-byte integers below are unsigned and `big-endian`.':
      'ქვემოთ მოცემული ყველა მრავალბაიტიანი მთელი რიცხვი უნიშნოა და `big-endian` ფორმატშია.',
    'Address classes `2` and `3` are unassigned.': 'მისამართის კლასები `2` და `3` არ არის მინიჭებული.',
    'An `extension flag` of `1` is rejected.': '`extension flag`-ის მნიშვნელობა `1` უარყოფილია.',
    'The low-level decoder can preserve other version and normalization bit values and does not independently cross-check the class against the controller tag.':
      'დაბალი დონის დეკოდერს შეუძლია შეინარჩუნოს ვერსიისა და ნორმალიზაციის ბიტების სხვა მნიშვნელობები და დამოუკიდებლად არ ამოწმებს კლასის შესაბამისობას კონტროლერის ტეგთან.',
    'Use the compact form when the raw public-key payload is at most 255 bytes:':
      'გამოიყენეთ კომპაქტური ფორმა, თუ ნედლი საჯარო გასაღების სასარგებლო დატვირთვა არ აღემატება 255 ბაიტს:',
    '| `key_len`    |          1 byte | Raw key length           |': '| `key_len` | 1 ბაიტი | ნედლი გასაღების სიგრძე |',
    'Keys longer than 255 bytes use the extended form:': '255 ბაიტზე გრძელი გასაღებები გაფართოებულ ფორმას იყენებს:',
    '| `key_len`    |         2 bytes | Raw key length           |': '| `key_len` | 2 ბაიტი | ნედლი გასაღების სიგრძე |',
    'A valid policy has at least one member, positive weights, no duplicate public keys, and a threshold from `1` through the sum of member weights.':
      'მოქმედ პოლიტიკას უნდა ჰყავდეს სულ მცირე ერთი წევრი, ჰქონდეს დადებითი წონები, არ ჰქონდეს დუბლირებული საჯარო გასაღებები, ხოლო ზღვარი უნდა იყოს `1`-დან წევრების წონათა ჯამამდე.',
    'After configuring the SDK with the expected chain discriminant, parse into an `AccountId` and compare the returned canonical rendering with the trimmed input.':
      'SDK-ის მოსალოდნელი ჯაჭვის დისკრიმინანტით კონფიგურაციის შემდეგ, მნიშვნელობა გააანალიზეთ როგორც `AccountId` და დაბრუნებული კანონიკური წარმოდგენა შეადარეთ კიდეებზე ნებადართული ცარიელი სივრცისგან გასუფთავებულ შესატანს.',
    'For an untrusted string, a conforming application should:': 'არასანდო სტრიქონისთვის შესაბამისმა აპლიკაციამ უნდა:',
    '1. Trim only permitted transport whitespace around the complete value.':
      '1. სრული მნიშვნელობის გარშემო მხოლოდ ნებადართული სატრანსპორტო ცარიელი სივრცე მოაშორეთ.',
    '2. Read the sentinel and require the expected chain discriminant.':
      '2. წაიკითხეთ სენტინელი და მოითხოვეთ მოსალოდნელი ჯაჭვის დისკრიმინანტი.',
    '3. Map every remaining `Unicode` symbol through the exact 105-symbol alphabet.':
      '3. დარჩენილი ყოველი `Unicode` სიმბოლო ზუსტი 105-სიმბოლოიანი ანბანით ასახეთ.',
    '4. Split off the six checksum digits.': '4. გამოყავით საკონტროლო ჯამის ექვსი ციფრი.',
    '6. Verify the checksum over those canonical bytes.': '6. ამ კანონიკურ ბაიტებზე საკონტროლო ჯამი გადაამოწმეთ.',
    '- a valid public key': '- მოქმედი საჯარო გასაღები',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. `AccountId` კანონიკურად წარმოადგინეთ მოსალოდნელი დისკრიმინანტისთვის.',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. მოითხოვეთ `byte-for-byte` ტოლობა კიდეებზე ნებადართული ცარიელი სივრცისგან გასუფთავებულ შესატანთან.',
    'A successful checksum or low-level `AccountAddress` parse is not a substitute for this check.':
      'საკონტროლო ჯამის წარმატებული შემოწმება ან დაბალი დონის `AccountAddress`-ის პარსინგი ამ შემოწმებას ვერ ჩაანაცვლებს.',
    '- an account alias such as `alice@wonderland.universal`':
      '- ანგარიშის ალიასი, მაგალითად `alice@wonderland.universal`',
    '- an I105 literal with an appended `@domain` suffix':
      '- I105 ლიტერალი, რომელსაც ბოლოში დამატებული აქვს `@domain` სუფიქსი',
    'Resolve aliases at the application boundary and retain the returned canonical I105 ID for authorization, signing, permissions, and audit records.':
      'აპლიკაციის საზღვარზე ალიასები ამოხსენით და დაბრუნებული კანონიკური I105 ID შეინარჩუნეთ ავტორიზაციის, ხელმოწერის, ნებართვებისა და აუდიტის ჩანაწერებისთვის.',
    '| `ERR_INVALID_PUBLIC_KEY`         | The key is invalid for the algorithm selected by its `CurveId`      |':
      '| `ERR_INVALID_PUBLIC_KEY` | გასაღები არასწორია მისი `CurveId`-ის მიერ არჩეული ალგორითმისთვის |',
    '| `ERR_I105_TOO_SHORT`             | The body cannot contain both payload and checksum                   |':
      '| `ERR_I105_TOO_SHORT` | სხეული ვერ შეიცავს ერთდროულად სასარგებლო დატვირთვასა და საკონტროლო ჯამს |',
    '- Never substitute an account alias for an I105 ID.': '- არასოდეს გამოიყენოთ ანგარიშის ალიასი I105 ID-ის ნაცვლად.',
    '- Use a collation that preserves letter case and character width.':
      '- გამოიყენეთ კოლაცია, რომელიც ინარჩუნებს ასოების რეგისტრსა და სიმბოლოს სიგანეს.',
    '- Use the stored canonical ID instead of reconstructing it from an alias.':
      '- ალიასიდან ხელახლა აგების ნაცვლად გამოიყენეთ შენახული კანონიკური ID.',
    'Call the explicit `AccountAddress` I105 encoder when an external account ID is required.':
      'როდესაც გარე ანგარიშის ID არის საჭირო, გამოიძახეთ `AccountAddress`-ის ცხადი I105 ენკოდერი.',
  },
  kk: {
    '- [Torii endpoints](/reference/torii-endpoints.md)':
      '- [Torii API соңғы нүктелері](/kk/reference/torii-endpoints.md)',
    '- **SORA Nexus service planes** add Soracloud, Inrou, SoraNet, SoraFS, and SoraDNS for app hosting, privacy transport, storage, and naming':
      '- **SORA Nexus сервис деңгейлері** қолданбаларды орналастыру, құпия трафикті тасымалдау, сақтау және атау қызметтері үшін Soracloud, Inrou, SoraNet, SoraFS және SoraDNS мүмкіндіктерін қосады',
    'Challenge calls append the full digest to the transcript state. The replay order is:':
      'Сынақ мәнін алу шақырулары толық дайджесті транскрипт күйіне қосады. Қайта ойнату реті:',
    '| Inrou                  | Soracloud hosted HTTP runtime for service revisions that need a live HTTP plane.                                                            | Soracloud runtime config, host capability adverts, replica runtime state                 |':
      '| Inrou | Тікелей HTTP деңгейін қажет ететін сервис нұсқаларына арналған Soracloud басқаратын HTTP орындау ортасы. | Soracloud орындау ортасының конфигурациясы, хост мүмкіндіктері туралы хабарландырулар, реплика орындау ортасының күйі |',
    '| Test writes                 | Use faucet-funded test XOR                                   | Do not use test tooling; writes spend real XOR     |':
      '| Сынақ жазбалары | Faucet қаржыландырған сынақ XOR-ын пайдаланыңыз | Сынақ құралдарын пайдаланбаңыз; жазу операциялары нақты XOR жұмсайды |',
    '- Treat changes to genesis or consensus topology as coordinated migrations, not single-peer file edits.':
      '- Генезис немесе консенсус топологиясы өзгерістерін бір желі түйініндегі файлды түзету емес, үйлестірілген көшіру ретінде қарастырыңыз.',
    '- Document whether a recovery procedure rebuilds from genesis, restores from a snapshot, or replaces a failed peer with a new identity.':
      '- Қалпына келтіру рәсімі генезистен қайта құра ма, күй суретінен қалпына келтіре ме, әлде істен шыққан желі түйінін жаңа сәйкестікпен ауыстыра ма — соны құжаттаңыз.',
    '- Keep contracts deterministic. Contract behavior must not depend on local wall-clock time, host filesystem state, network calls, or other peer-local inputs.':
      '- Келісімшарттарды детерминирленген күйде ұстаңыз. Келісімшарт мінез-құлқы жергілікті жүйелік уақытқа, хосттың файлдық жүйе күйіне, желілік шақыруларға немесе нақты желі түйініне ғана тән басқа кірістерге тәуелді болмауы тиіс.',
    'When the receivable is financed or paid, use the generated invoice lot ID:':
      'Дебиторлық берешек қаржыландырылғанда немесе төленгенде, жасалған шот-фактура лотының ID-сін пайдаланыңыз:',
    '- which authorities can revoke permissions, replace keys, or change peer membership':
      '- қай уәкілетті субъектілер рұқсаттарды кері қайтарып, кілттерді ауыстыра немесе желі түйіндерінің құрамын өзгерте алады',
    '- Record who owns each authority, where its signer is held, and how it can be replaced or revoked.':
      '- Әр уәкілетті субъектінің иесін, оның қол қоюшысы қайда сақталатынын және оны қалай ауыстыруға немесе кері қайтарып алуға болатынын тіркеңіз.',
    "Account inventory helpers require an account identifier accepted by the SDK's normalizer. Use canonical I105 account IDs or on-chain aliases; if a block explorer or raw endpoint returns an ID that the SDK rejects, resolve it to a canonical account ID before calling these helpers:":
      'Есептік жазба қорын түгендеу көмекшілері SDK қалыптандырғышы қабылдайтын есептік жазба идентификаторын талап етеді. Канондық I105 есептік жазба ID-лерін немесе тізбектегі алиастарды пайдаланыңыз; блок шолушысы не өңделмеген API соңғы нүктесі SDK қабылдамайтын ID қайтарса, бұл көмекшілерді шақырмас бұрын оны канондық есептік жазба ID-іне түрлендіріңіз:',
    'Configure the URL as a user-local MCP server in the agent runtime. Do not commit agent MCP config, API tokens, forwarded auth headers, `authority`, or `private_key` values into this docs repo or an application repo.':
      'URL-ді агенттің орындау ортасында пайдаланушыға жергілікті MCP сервері ретінде баптаңыз. Агенттің MCP конфигурациясын, API токендерін, қайта бағытталған аутентификация тақырыптарын, `authority` немесе `private_key` мәндерін осы құжаттама репозиторийіне не қолданба репозиторийіне нұсқаларды басқару үшін қоспаңыз.',
    '- Keep live testnet writes opt-in so ordinary test runs do not depend on network availability or spend testnet funds.':
      '- Кәдімгі сынақтар желі қолжетімділігіне тәуелді болып қалмауы және testnet қаражатын жұмсамауы үшін, нақты testnet-ке жазуды тек анық қосылғанда ғана орындаңыз.',
    '| Rejection burst | One signer or client produces repeated rejected transactions | Check for credential abuse, integration errors, or probing |':
      '| Бас тартулардың күрт көбеюі | Бір қол қоюшы немесе клиент қайта-қайта қабылданбайтын транзакциялар жібереді | Тіркелгі деректерін теріс пайдалануды, интеграция қателерін немесе барлау әрекеттерін тексеріңіз |',
    '- Genesis signing uses the `[genesis].public_key` in peer config and the matching private key when signing the manifest.':
      '- Генезиске қол қою кезінде желі түйінінің конфигурациясындағы `[genesis].public_key` және манифестке қол қоятын сәйкес жеке кілт пайдаланылады.',
    '## JSON vs. Norito {#json-vs-norito}': '## JSON мен Norito салыстыруы {#json-vs-norito}',
    'Read both concrete balances and then the definition. These post-state queries are the success criterion; a submission receipt by itself is not.':
      'Екі нақты балансты, содан кейін анықтаманы оқыңыз. Күй өзгергеннен кейінгі осы сұраулар — сәттілік өлшемі; тек жіберу түбіртегінің өзі жеткіліксіз.',
    '- [Escrow and proof queries](/reference/queries.md#escrow-and-proof-records)':
      '- [Эскроу және дәлел жазбаларына арналған сұраулар](/kk/reference/queries.md#escrow-and-proof-records)',
    'Do not use `gas_asset_id` for the "local-token fee" pattern unless you want the sponsor to be charged in that gas asset too. In the current runtime, `fee_sponsor` also makes the sponsor the payer for configured pipeline-gas asset debits. For local-token user fees, collect the token explicitly with a transfer or contract rule.':
      'Демеушіден осы газ активімен де ақы алынсын демесеңіз, «жергілікті токен төлемі» үлгісінде `gas_asset_id` қолданбаңыз. Ағымдағы орындау ортасында `fee_sponsor` демеушіні бапталған өңдеу ағынының газ активінен шегерімдер үшін де төлеуші етеді. Пайдаланушыдан жергілікті токенмен ақы алу үшін токенді аударым немесе келісімшарт ережесі арқылы тікелей жинаңыз.',
    'Feature availability can differ between SDKs and release profiles. The wire format remains governed by the header and schema, not by local build flags.':
      'Мүмкіндіктердің қолжетімділігі SDKs пен шығарылым профильдеріне қарай өзгеруі мүмкін. Сериализация пішімін жергілікті құрастыру жалаушалары емес, тақырып пен схема анықтайды.',
    'Use `--seed-hex` only with an exact 32-byte hexadecimal secret for reproducible development fixtures. For production deployment, omit it so Kagami uses operating-system randomness, then move the unencrypted private-key export into the approved custody boundary. The command never prints private keys.':
      'Қайта өндіруге болатын әзірлеу сынақ деректерін жасау үшін `--seed-hex` параметрін дәл 32 байттық он алтылық құпиямен ғана пайдаланыңыз. Өндірістік орналастыруда оны алып тастаңыз: сонда Kagami операциялық жүйенің кездейсоқтық көзін пайдаланады. Одан кейін шифрланбаған жеке кілт экспортын бекітілген сақтау шекарасына көшіріңіз. Команда жеке кілттерді ешқашан басып шығармайды.',
    'Typical SoraFS uses include static application assets, documentation builds, zone bundles, model or artifact references, and governance evidence bundles. The Iroha data model exposes SoraFS gateway events and a [`FindSorafsProviderOwner`](/reference/queries.md#nexus-data-availability-and-packages) query for provider ownership resolution.':
      'SoraFS әдетте қолданбаның статикалық ресурстары, құжаттама жинақтары, аймақ бумалары, модельдерге не артефактілерге сілтемелер және басқару дәлелдерінің бумалары үшін пайдаланылады. Iroha деректер моделі SoraFS шлюз оқиғаларын және провайдер иесін анықтауға арналған [`FindSorafsProviderOwner`](/kk/reference/queries.md#nexus-data-availability-and-packages) сұрауын ұсынады.',
    'The UAID is the identity and capability anchor around that flow. In the data model, `UniversalAccountId` is hash-backed and displays as `uaid:<hash>`. Parsers accept either `uaid:<hash>` or the raw 64-hex digest. `Account` and `NewAccount` include optional `uaid` and `opaque_ids` fields. Runtime registration enforces a one-to-one UAID-to-account index, rejects duplicate or colliding opaque identifiers, and rejects opaque identifiers without a UAID. Whenever a UAID account binding changes, the runtime rebuilds Space Directory dataspace bindings for that UAID.':
      'UAID — осы ағынның сәйкестендіру және мүмкіндік тірегі. Деректер моделінде `UniversalAccountId` хэшке негізделген және `uaid:<hash>` түрінде көрсетіледі. Парсерлер `uaid:<hash>` пішімін де, өңделмеген 64 он алтылық таңбалы криптографиялық дайджестті де қабылдайды. `Account` пен `NewAccount` міндетті емес `uaid` және `opaque_ids` өрістерін қамтиды. Орындау ортасы тіркеу кезінде UAID пен тіркелгі арасында бір-біріне сәйкесті индексті қамтамасыз етеді, қайталанатын не өзара соқтығысатын мөлдір емес идентификаторларды және UAID-ы жоқ мөлдір емес идентификаторларды қабылдамайды. UAID пен тіркелгі байланысы өзгерген сайын, орындау ортасы осы UAID үшін Кеңістік каталогындағы деректер кеңістігі байланыстарын қайта құрады.',
    'UAID is not the ciphertext and not the FHE policy itself. It is the stable account capability anchor used to find the account, opaque identifier claims, and Space Directory bindings that authorize a service or dataspace flow. FHE schemas govern encrypted payload admission and execution separately through parameter sets, execution policies, ciphertext commitments, and decryption authority policies.':
      'UAID — шифрмәтін де, FHE саясатының өзі де емес. Ол қызметке не деректер кеңістігі ағынына рұқсат беретін тіркелгіні, мөлдір емес идентификатор талаптарын және Кеңістік каталогы байланыстарын табуға пайдаланылатын тұрақты тіркелгі мүмкіндігінің тірегі. FHE схемалары шифрланған пайдалы жүктемені қабылдау мен орындауды параметрлер жиынтықтары, орындау саясаттары, шифрмәтін міндеттемелері және шифрды ашу өкілеттігінің саясаттары арқылы бөлек басқарады.',
    '| `PACKED_STRUCT` | `0x04` | Supported | Encodes derive-generated structs as packed field payloads. |':
      '| `PACKED_STRUCT` | `0x04` | Қолдау көрсетіледі | derive арқылы жасалған құрылымдарды ықшам өріс жүктемелері ретінде кодтайды. |',
    'The current source-backed localnet flow is generated by Kagami. It writes peer configs, genesis artifacts, client config, helper scripts, and an optional Compose file that matches the checked-out code:':
      'Ағымдағы бастапқы кодқа негізделген жергілікті желі ағынын Kagami жасайды. Ол желі түйіндерінің конфигурацияларын, genesis артефактілерін, клиент конфигурациясын, көмекші сценарийлерді және жұмыс көшірмесіндегі кодқа сәйкес келетін міндетті емес Compose файлын жазады:',
    'Too-small bounds create queue or payload-recovery pressure; oversized bounds increase retained memory and the amount of work available to an abusive peer. Compare the diagnostics snapshot with process memory, message handling, and missing-body metrics before changing one bound at a time:':
      'Тым төмен шектер кезекке немесе пайдалы жүктемені қалпына келтіруге қысым түсіреді; тым жоғары шектер сақталатын жадты және жүйені теріс пайдаланатын түйін орындай алатын жұмыс көлемін арттырады. Әр жолы бір шекті өзгертпес бұрын диагностикадағы күй кескінін процесс жадымен, хабарларды өңдеумен және денесі жетіспейтін хабар метрикаларымен салыстырыңыз:',
    '`--pop` is valid only with `bls_normal`; it adds `pop.hex` to the custody directory. Signed genesis requires a matching PoP for every voting validator. In peer configuration, a non-empty `trusted_peers_pop` map selects the validator subset; trusted peers omitted from that non-empty map are observers. If the map is empty, all BLS-normal trusted peers enter the bootstrap candidate set, with voter PoPs still supplied by signed genesis.':
      '`--pop` тек `bls_normal` алгоритмімен жарамды; ол кілттерді сақтау каталогына `pop.hex` файлын қосады. Қол қойылған genesis әрбір дауыс беретін валидатор үшін сәйкес PoP талап етеді. Түйін конфигурациясындағы бос емес `trusted_peers_pop` картасы валидаторлар ішкі жиынын таңдайды; бұл картада жоқ сенімді түйіндер бақылаушы болады. Карта бос болса, барлық BLS-normal сенімді түйіндер бастапқы жүктеу үміткерлерінің жиынына кіреді, ал дауыс берушілердің PoPs мәндерін қол қойылған genesis береді.',
    'When a Python helper is not available, feed canonical data-model `InstructionBox` JSON into `Instruction.from_json`. This is the recommended path for `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, peer/role/NFT registration, and non-trigger unregister variants until those helpers are typed.':
      'Python көмекшісі қолжетімсіз болса, канондық деректер моделінің `InstructionBox` JSON мәнін `Instruction.from_json` функциясына беріңіз. Бұл көмекшілер типтелгенше, `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, түйін/рөл/NFT тіркеуі және триггерге қатысы жоқ тіркеуден шығару нұсқалары үшін осы жолды пайдалану ұсынылады.',
    'Each request is labelled with the API version to which it belongs. It allows a combination of different binary versions of Iroha client/peer software to interoperate, which in turn allows software upgrades in the Iroha network.':
      'Әр сұрау өзі тиесілі API нұсқасымен белгіленеді. Бұл Iroha клиенті мен түйіні бағдарламалық жасақтамасының әртүрлі бинарлық нұсқаларына өзара жұмыс істеуге мүмкіндік береді, ал соның арқасында Iroha желісіндегі бағдарламалық жасақтаманы жаңартуға болады.',
    'For the public Taira testnet, the release image uses `iroha3d_taira`. It accepts the same CLI but additionally enforces the canonical Taira chain, validator, storage, and runtime-signer profile. Validate a Taira configuration without opening runtime credentials like this:':
      'Жалпыға ашық Taira сынақ желісінде шығарылым кескіні `iroha3d_taira` пайдаланады. Ол сол CLI пәрмендерін қабылдайды, сонымен бірге канондық Taira тізбегі, валидатор, сақтау және орындау ортасының қол қою профилін міндетті етеді. Орындау ортасының тіркелгі деректерін ашпай, Taira конфигурациясын былай тексеріңіз:',
    'The option summary above is verified against the current `iroha3d` argument definitions. The checked-in generated help snapshot is intentionally not rendered while its provenance status is pending. To inspect the exact help for your checkout, run:':
      'Жоғарыдағы опциялар жиынтығы ағымдағы `iroha3d` аргумент анықтамаларымен салыстырылып тексерілген. Репозиторийге тіркелген генерацияланған анықтама кескіні оның шығу тегі мәртебесі анықталғанша әдейі көрсетілмейді. Жұмыс көшірмеңіздегі дәл анықтаманы көру үшін мынаны орындаңыз:',
    'Use a draft when one business action should become one signed transaction. The business receipt number goes in `primary_reference`; the ledger ID is generated after the transaction commits.':
      'Бір іскерлік әрекет бір қол қойылған транзакцияға айналуы тиіс болса, жоба-нұсқаны пайдаланыңыз. Іскерлік түбіртек нөмірі `primary_reference` өрісіне жазылады; тізілім идентификаторы транзакция бекітілгеннен кейін жасалады.',
    'A value such as `treasury@payments.universal` is an account alias, not another spelling of the I105 ID.':
      '`treasury@payments.universal` сияқты мән — I105 ID-дің басқа жазылуы емес, тіркелгі бүркеншік аты.',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- Әріптердің үлкен-кішілігін сақтаңыз және `Unicode` қалыпқа келтіруін қолданбаңыз.',
    '- A regular expression is not an I105 validator.': '- Тұрақты өрнек I105 валидаторы емес.',
    'A decoder must enforce the expected discriminant.':
      'Декодер күтілетін дискриминанттың сәйкестігін міндетті түрде қамтамасыз етуі тиіс.',
    'They do not materialize an `AccountId`.': 'Олар `AccountId` нысанын жасамайды.',
    'Use strict `AccountId` validation before authorization or persistence.':
      'Авторизациялау немесе тұрақты сақтауға жазу алдында `AccountId` қатаң тексеруін қолданыңыз.',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'NFC, NFKC, енді түрлендіруді, әріп регистрін бүктеуді немесе ұқсас таңбамен алмастыруды қолданбаңыз.',
    'A valid policy has at least one member, positive weights, no duplicate public keys, and a threshold from `1` through the sum of member weights.':
      'Жарамды саясатта кемінде бір мүше, оң салмақтар болуы, қайталанатын ашық кілттер болмауы және шек `1`-ден мүшелер салмақтарының қосындысына дейін болуы тиіс.',
    '| `0`    |     1 |                          `0` | Reserved `extension flag`    |':
      '| `0`    |     1 |                          `0` | Резервтелген `extension flag` |',
    '2. Read the sentinel and require the expected chain discriminant.':
      '2. Сентинелді оқып, күтілетін тізбек дискриминантын талап етіңіз.',
    '4. Split off the six checksum digits.': '4. Бақылау сомасының алты цифрын бөліп алыңыз.',
    '- exact field lengths': '- өрістердің дәл ұзындықтары',
    '- a supported `CurveId`': '- қолдау көрсетілетін `CurveId`',
    '- a valid public key': '- жарамды ашық кілт',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. `AccountId` мәнін күтілетін дискриминант үшін канондық түрде көрсетіңіз.',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. Қырқылған кіріспен `byte-for-byte` теңдікті талап етіңіз.',
    "The application's explicit final `render-and-compare` step rejects non-minimal numeric sentinels, non-canonical controller layouts, reordered policy material, and any other spelling that decodes but is not the encoder's current V1 output.":
      'Қолданбаның нақты соңғы `render-and-compare` қадамы минималды емес сандық сентинелдерді, канондық емес контроллер орналасуларын, қайта реттелген саясат материалын және декодталатын, бірақ кодтаушының ағымдағы V1 шығысына жатпайтын кез келген басқа жазылымды қабылдамайды.',
    'Resolve aliases at the application boundary and retain the returned canonical I105 ID for authorization, signing, permissions, and audit records.':
      'Қолданба шекарасында бүркеншік аттарды шешіп, авторизациялау, қол қою, рұқсаттар және аудит жазбалары үшін қайтарылған канондық I105 ID мәнін сақтаңыз.',
    '- Never substitute an account alias for an I105 ID.':
      '- Ешқашан I105 ID орнына тіркелгі бүркеншік атын қолданбаңыз.',
    '- Use a collation that preserves letter case and character width.':
      '- Әріптердің үлкен-кішілігі мен таңба енін сақтайтын салыстыру ережесін қолданыңыз.',
    '`AccountId` display and JSON use canonical I105.':
      '`AccountId` дисплейі мен JSON көрсетілімі канондық I105 пішімін пайдаланады.',
    'The lower-level `AccountAddress` display/JSON representation uses canonical hex for internal and debugging contexts.':
      'Төменгі деңгейдегі `AccountAddress` дисплейі/JSON көрсетілімі ішкі және жөндеу контекстерінде канондық он алтылық пішімді пайдаланады.',
  },
  mn: {
    '# Iroha Special Instructions': '# Iroha-гийн тусгай зааврууд',
    'When we spoke about [how Iroha operates](/blockchain/iroha-explained), we said that Iroha Special Instructions are the only way to modify the world state. So, what kind of special instructions do we have? If you\'ve read the language-specific guides in this tutorial, you\'ve already seen a couple of instructions: `Register<Account>` and `Mint<Numeric>`.':
      'Бид [Iroha хэрхэн ажилладаг](/mn/blockchain/iroha-explained) талаар тайлбарлахдаа дэлхийн төлөвийг зөвхөн Iroha-гийн тусгай заавруудаар өөрчилдөг гэж хэлсэн. Тэгвэл ямар тусгай зааврууд байдаг вэ? Хэрэв та энэ зааврын хэл тус бүрийн гарын авлагыг уншсан бол `Register<Account>` болон `Mint<Numeric>` зэрэг хэд хэдэн заавартай аль хэдийн танилцсан.',
    'Here is the full list of Iroha Special Instructions:':
      'Iroha-гийн тусгай заавруудын бүрэн жагсаалт:',
    '| Instruction                                               | Descriptions                                     |':
      '| Заавар | Тайлбар |',
    '| [Register/Unregister](#un-register)                       | Give an ID to a new entity on the blockchain.    |':
      '| [Бүртгэх/Бүртгэлээс хасах](#un-register) | Блокчэйн дээрх шинэ объектод ID олгох. |',
    '| [Mint/Burn](#mint-burn)                                   | Mint/burn numeric assets or trigger repetitions. |':
      '| [Mint/Burn](#mint-burn) | Тоон хөрөнгө эсвэл триггерийн давталтыг гаргах/шатаах. |',
    '| [Native escrow and asset locks](#native-escrow-and-asset-locks) | Lock numeric assets in protocol custody.     |':
      '| [Протоколын эскроу ба хөрөнгийн түгжээ](#native-escrow-and-asset-locks) | Тоон хөрөнгийг протоколын хадгалалтад түгжих. |',
    '| [Atomic private settlement](#atomic-private-settlement)   | Govern confidential pools and atomic bundles.    |':
      '| [Атомар нууц тооцоо](#atomic-private-settlement) | Нууц тооцооны пулууд болон атомар багцуудыг удирдах. |',
    '| [ExecuteTrigger](#executetrigger)                         | Execute triggers.                                |':
      '| [ExecuteTrigger](#executetrigger) | Триггерүүдийг ажиллуулах. |',
    '| [Log/Custom/Upgrade](#other-instructions)                 | Log, extend, or upgrade runtime behavior.        |':
      '| [Log/Custom/Upgrade](#other-instructions) | Лог хөтлөх, гүйцэтгэх орчны үйлдлийг өргөтгөх эсвэл шинэчлэх. |',
    "Let's start with a summary of Iroha Special Instructions; what objects each instruction can be called for and what instructions are available for each object.":
      'Эхлээд Iroha-гийн тусгай заавруудыг ямар объект дээр хэрэгжүүлж болох, мөн объект бүрд ямар заавар боломжтойг нэгтгэн харъя.',
    '## Summary': '## Товч мэдээлэл',
    'For each instruction, there is a list of objects on which this instruction can be run on. For example, transfer variants cover ownable ledger objects and numeric assets, while minting covers numeric assets and trigger repetitions.':
      'Заавар бүрд түүнийг хэрэгжүүлж болох объектуудын жагсаалт бий. Жишээлбэл, шилжүүлгийн хувилбарууд нь өмчлөх боломжтой леджерийн объектууд болон тоон хөрөнгийг хамардаг бол гаргах үйлдэл нь тоон хөрөнгө болон триггерийн давталтыг хамарна.',
    '| Instruction                                               | Objects                                                                                                 | Destination          |':
      '| Заавар | Объектууд | Хүлээн авагч |',
    '| [EnsureAlias](#ensurealias)                               | ordinary domain, dataspace-alias, and account-alias setup                                                 |                      |':
      '| [EnsureAlias](#ensurealias) | энгийн домэйн, өгөгдлийн орон зайн alias болон дансны alias тохиргоо | |',
    '| [Register/Unregister](#un-register)                       | accounts, asset definitions, NFTs, roles, triggers, peers; domain removal                                |                      |':
      '| [Бүртгэх/Бүртгэлээс хасах](#un-register) | данс, хөрөнгийн тодорхойлолт, NFTs, үүрэг, триггер, peer-үүд; домэйн устгах | |',
    '| [Mint/Burn](#mint-burn)                                   | numeric assets, trigger repetitions                                                                     | accounts or triggers |':
      '| [Mint/Burn](#mint-burn) | тоон хөрөнгө, триггерийн давталт | данс эсвэл триггер |',
    '| [Native escrow and asset locks](#native-escrow-and-asset-locks) | numeric asset escrows, asset locks, anonymous escrow commitments                                    | buyers, destinations, or dispute splits |':
      '| [Протоколын эскроу ба хөрөнгийн түгжээ](#native-escrow-and-asset-locks) | тоон хөрөнгийн эскроу, хөрөнгийн түгжээ, нэргүй эскроугийн криптографийн коммитментууд | худалдан авагч, хүлээн авагч эсвэл маргааны хуваарилалт |',
    '| [Atomic private settlement](#atomic-private-settlement)   | route-scoped confidential pools, policy rotations, finalized bundles, and abort markers                 |                      |':
      '| [Атомар нууц тооцоо](#atomic-private-settlement) | маршрут тус бүрийн нууц пулууд, бодлогын сэлгэлт, эцэслэсэн багцууд болон цуцлалтын тэмдэглэгээ | |',
    '| [ExecuteTrigger](#executetrigger)                         | triggers                                                                                                |                      |':
      '| [ExecuteTrigger](#executetrigger) | триггерүүд | |',
    '| [Log/Custom/Upgrade](#other-instructions)                 | logs, executor-specific payloads, executor upgrades                                                     |                      |':
      '| [Log/Custom/Upgrade](#other-instructions) | логууд, гүйцэтгэгчид зориулсан payload-ууд, гүйцэтгэгчийн шинэчлэлтүүд | |',
    'There is also another way of looking at ISI, in terms of the ledger object they touch:':
      'ISI-г өөрчилдөг леджерийн объектоор нь мөн ангилж болно:',
    '| Target           | Instructions                                                                                                 |':
      '| Объект | Зааврууд |',
    '| Account          | register/unregister accounts, receive assets, update account metadata, grant/revoke permissions and roles    |':
      '| Данс | данс бүртгэх/бүртгэлээс хасах, хөрөнгө хүлээн авах, дансны метадатаг шинэчлэх, зөвшөөрөл болон үүрэг олгох/цуцлах |',
    '| Domain           | ensure domain setup, unregister domains, transfer domain ownership, update domain metadata                    |':
      '| Домэйн | домэйн тохиргоог баталгаажуулах, домэйнийг бүртгэлээс хасах, домэйны өмчлөл шилжүүлэх, домэйны метадатаг шинэчлэх |',
    '| Asset definition | register/unregister definitions, transfer ownership, update metadata                                         |':
      '| Хөрөнгийн тодорхойлолт | тодорхойлолт бүртгэх/бүртгэлээс хасах, өмчлөл шилжүүлэх, метадата шинэчлэх |',
    '| Asset            | mint/burn numeric quantity, transfer numeric quantity                                                        |':
      '| Хөрөнгө | тоон хэмжээг гаргах/шатаах, тоон хэмжээг шилжүүлэх |',
    '| Escrow           | open, accept, mark payment sent, release, cancel, dispute, resolve, draw down, or expire native custody records |':
      '| Эскроу | протоколын хадгалалтын бүртгэлийг нээх, хүлээн авах, төлбөр илгээснийг тэмдэглэх, чөлөөлөх, цуцлах, маргах, шийдвэрлэх, хэсэгчлэн татах эсвэл хугацаа дуусгах |',
    '| NFT              | register/unregister NFTs, transfer ownership, update metadata                                                |':
      '| NFT | NFTs бүртгэх/бүртгэлээс хасах, өмчлөл шилжүүлэх, метадата шинэчлэх |',
    '| RWA              | register lots, transfer quantity, hold/release, freeze/unfreeze, redeem, merge, update metadata and controls |':
      '| RWA | лотууд бүртгэх, тоо хэмжээ шилжүүлэх, барих/чөлөөлөх, царцаах/царцаалтыг цуцлах, эргүүлэн авах, нэгтгэх, метадата болон хяналтыг шинэчлэх |',
    '| Trigger          | register/unregister, mint/burn trigger repetitions, execute trigger, update trigger metadata                 |':
      '| Триггер | бүртгэх/бүртгэлээс хасах, триггерийн давталтыг гаргах/шатаах, триггер ажиллуулах, триггерийн метадатаг шинэчлэх |',
    '| World            | register/unregister peers and roles, set parameters, upgrade the executor                                    |':
      '| Дэлхий | peer болон үүрэг бүртгэх/бүртгэлээс хасах, параметр тохируулах, гүйцэтгэгчийг шинэчлэх |',
    'The examples in this page assume you are running commands from the upstream Iroha workspace against the default local client configuration:':
      'Энэ хуудсын жишээнүүдийг upstream Iroha ажлын орчноос анхдагч локал клиент тохиргоотой ажиллуулна гэж үзнэ:',
    'When targeting the public Taira testnet, use a Taira client configuration. Before running fee-paying examples, save the faucet helper from [Get Testnet XOR on Taira](/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) as `taira_faucet_claim.py`, then claim testnet XOR from the faucet:':
      'Нийтийн Taira testnet-д холбогдохдоо Taira клиент тохиргоог ашиглана. Төлбөртэй жишээг ажиллуулахын өмнө [Taira дээр testnet XOR авах](/mn/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) хэсгийн faucet туслахыг `taira_faucet_claim.py` нэрээр хадгалаад faucet-аас testnet XOR авна:',
    '| [Grant/Revoke](#grant-revoke)                             | Give or remove permissions and roles.            |':
      '| [Grant/Revoke](#grant-revoke) | Зөвшөөрөл болон үүрэг олгох эсвэл цуцлах. |',
    '| [Transfer](#transfer)                                     | Transfer ownership or asset value.               |':
      '| [Шилжүүлэх](#transfer) | Өмчлөх эрх эсвэл хөрөнгийн утгыг шилжүүлэх. |',
    '| [Grant/Revoke](#grant-revoke)                             | [roles, permission tokens](/blockchain/permissions.md)                                                  | accounts or roles    |':
      '| [Grant/Revoke](#grant-revoke) | [үүрэг болон зөвшөөрлийн токенууд](/mn/blockchain/permissions.md) | данс эсвэл үүрэг |',
    '| [Transfer](#transfer)                                     | domains, asset definitions, numeric assets, NFTs                                                        | accounts             |':
      '| [Шилжүүлэх](#transfer) | домэйн, хөрөнгийн тодорхойлолт, тоон хөрөнгө, NFTs | данс |',
    'RAM-LFE stands for Random-Access Machine Laconic Function Evaluation. In Iroha, it is the generic hidden-function layer for programs whose public policy is on-chain but whose evaluator logic, secret, or raw input should not be written to world state. It is used by SORA Nexus identifier flows, such as private phone or email lookup, and can also be exposed as a generic Torii program-execution helper when a node profile enables the app-facing routes.':
      'RAM-LFE гэдэг нь Random-Access Machine Laconic Function Evaluation гэсэн үгийн товчлол юм. Iroha-д энэ нь нийтэд ил бодлого нь блокчейн дээр хадгалагддаг боловч үнэлэгчийн логик, нууц эсвэл боловсруулаагүй оролтыг дэлхийн төлөвт бичих ёсгүй программуудад зориулсан ерөнхий далд функцийн давхарга юм. Үүнийг хувийн утасны дугаар эсвэл имэйлээр хайх зэрэг SORA Nexus-ийн танигчийн урсгалд ашигладаг бөгөөд зангилааны профайл аппликейшнд зориулсан маршрутуудыг идэвхжүүлсэн үед Torii-ийн программ гүйцэтгэх ерөнхий туслах байдлаар мөн ашиглаж болно.',
    'A value such as `treasury@payments.universal` is an account alias, not another spelling of the I105 ID.':
      '`treasury@payments.universal` зэрэг утга нь I105 ID-ийн өөр бичлэг биш, дансны alias юм.',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- Үсгийн том, жижиг хэлбэрийг хэвээр хадгалж, `Unicode` нормчлол бүү хэрэглэ.',
    '- An I105 ID must not have an `@domain` or `@domain.dataspace` suffix.':
      '- I105 ID нь `@domain` эсвэл `@domain.dataspace` дагавартай байж болохгүй.',
    '- A regular expression is not an I105 validator.': '- Тогтмол илэрхийлэл нь I105 баталгаажуулагч биш.',
    '| Payload          | `base-105` encoding of the canonical account-controller bytes      | Covered           |':
      '|Payload |`base-105` каноник дансны controller байтын кодлол |Хамрагдана |',
    '| Checksum         | Six `Bech32m`-style `5-bit` values rendered with the I105 alphabet | N/A               |':
      '|Хяналтын нийлбэр |I105 цагаан толгойгоор дүрслэгдсэн зургаан `Bech32m` маягийн `5-bit` утга |N/A |',
    'The payload and checksum identify the account controller.':
      'Payload болон хяналтын нийлбэр нь дансны controller-ийг тодорхойлно.',
    'The sentinel selects the network context.': 'Sentinel нь сүлжээний контекстийг сонгоно.',
    'A decoder must enforce the expected discriminant.':
      'Декодер нь хүлээгдэж буй дискриминантыг заавал шалган мөрдүүлэх ёстой.',
    'The checksum cannot detect a sentinel substitution.':
      'Хяналтын нийлбэр нь sentinel-ийг сольсныг илрүүлэх боломжгүй.',
    'They verify the sentinel, alphabet, checksum, byte lengths, `CurveId`/key shape, and exact address-layer re-encoding.':
      'Эдгээр нь sentinel, цагаан толгой, хяналтын нийлбэр, байтын урт, `CurveId`/түлхүүрийн хэлбэр болон хаягийн түвшний яг ижил дахин кодлолтыг шалгана.',
    'They do not materialize an `AccountId`.': 'Эдгээр нь `AccountId` үүсгэдэггүй.',
    'They do not prove that the header class matches the controller.':
      'Эдгээр нь header-ийн ангилал controller-той тохирч байгааг нотлохгүй.',
    'Use strict `AccountId` validation before authorization or persistence.':
      'Зөвшөөрөл олгох эсвэл байнгын хадгалалт хийхээс өмнө `AccountId`-ийн хатуу баталгаажуулалт хэрэглэнэ.',
    'For a private network, use its configured discriminant explicitly with `--network-prefix`.':
      'Хувийн сүлжээнд түүний тохируулсан дискриминантыг `--network-prefix`-ээр ил тод зааж хэрэглэнэ.',
    'It does not register the account on the target network or prove that the same controller should be reused there.':
      'Энэ нь зорилтот сүлжээнд дансыг бүртгэхгүй бөгөөд ижил controller-ийг тэнд дахин ашиглах ёстойг нотлохгүй.',
    'Leading zero bytes are preserved as zero-valued `base-105` digits.':
      'Эхний тэг байтуудыг тэг утгатай `base-105` цифрүүд болгон хадгална.',
    'The six checksum values are in the range `0..31` and are rendered through the same I105 alphabet as the payload.':
      'Хяналтын нийлбэрийн зургаан утга `0..31` мужид байх бөгөөд payload-тай адил I105 цагаан толгойгоор дүрслэгдэнэ.',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'NFC, NFKC, өргөн хувиргалт, үсгийн том/жижиг хэлбэрийг нэгтгэх эсвэл төстэй дүрстэй тэмдэгтээр орлуулахыг бүү хэрэглэ.',
    '### Header byte {#header-byte}': '### Толгойн байт {#header-byte}',
    '| Bits   | Width |       Current encoder output | Meaning                      |':
      '|Битүүд |Өргөн |Одоогийн кодлогчийн гаралт |Утга |',
    '| `7..5` |     3 |                          `0` | Address format version field |':
      '| `7..5` |     3 |                          `0` |Хаягийн форматын хувилбарын талбар |',
    '| `4..3` |     2 | `0` single key, `1` multisig | Address class                |':
      '| `4..3` |     2 |`0` нэг түлхүүр, `1` multisig |Хаягийн ангилал |',
    '| `0`    |     1 |                          `0` | Reserved `extension flag`    |':
      '| `0`    |     1 |                          `0` |Нөөцөлсөн `extension flag` |',
    'Converting to an `AccountId` and comparing its canonical rendering proves current V1 canonicality.':
      '`AccountId` руу хөрвүүлээд түүний каноник дүрслэлийг харьцуулах нь одоогийн V1 каноник хэлбэр мөн болохыг нотолно.',
    'Use the compact form when the raw public-key payload is at most 255 bytes:':
      'Түүхий нийтийн түлхүүрийн өгөгдөл хамгийн ихдээ 255 байт бол компакт хэлбэрийг ашиглана:',
    '| Field        |           Width | Value or meaning         |': '|Талбар |Өргөн |Утга |',
    '| Field        |           Width | Value or meaning             |': '|Талбар |Өргөн |Утга |',
    '| `key_len`    |          1 byte | Raw key length           |': '|`key_len` |1 байт |Түүхий түлхүүрийн урт |',
    '| `key_len`    |         2 bytes | Raw key length, `big-endian` |':
      '|`key_len` |2 байт |Түүхий түлхүүрийн урт, `big-endian` |',
    '| `key_len`    |         2 bytes | Raw key length           |': '|`key_len` |2 байт |Түүхий түлхүүрийн урт |',
    '| `public_key` | `key_len` bytes | Raw public-key payload   |':
      '|`public_key` |`key_len` байт |Түүхий нийтийн түлхүүрийн өгөгдөл |',
    '| `public_key` | `key_len` bytes | Raw public-key payload       |':
      '|`public_key` |`key_len` байт |Түүхий нийтийн түлхүүрийн өгөгдөл |',
    'An extended encoding is not canonical for a key that fits the compact form.':
      'Компакт хэлбэрт багтах түлхүүрт өргөтгөсөн кодлол каноник биш.',
    '### Multisig controller {#multisig-controller}': '### Олон гарын үсгийн хянагч {#multisig-controller}',
    '| Field            |    Width | Value or meaning               |': '|Талбар |Өргөн |Утга |',
    '| `members`        | Variable | Repeated member records        |':
      '|`members` |Хувьсах |Давтагдах гишүүний бичлэгүүд |',
    'Each member record is:': 'Гишүүн бүрийн бичлэг:',
    '| Field        |           Width | Meaning                  |': '|Талбар |Өргөн |Утга |',
    'A valid policy has at least one member, positive weights, no duplicate public keys, and a threshold from `1` through the sum of member weights.':
      'Хүчинтэй policy нь дор хаяж нэг гишүүнтэй, эерэг жинтэй, давхардсан нийтийн түлхүүргүй, threshold нь `1`-ээс гишүүдийн жингийн нийлбэр хүртэл байна.',
    "Canonical construction sorts members by the signing algorithm's stable name, a zero separator byte, and then the raw public-key bytes.":
      'Каноник үүсгэлт гишүүдийг гарын үсгийн алгоритмын тогтвортой нэр, тэг тусгаарлагч байт, дараа нь түүхий нийтийн түлхүүрийн байтаар эрэмбэлнэ.',
    '## Strict AccountId validation and canonicality {#strict-accountid-validation-and-canonicality}':
      '## AccountId-ийн хатуу баталгаажуулалт ба каноник байдал {#strict-accountid-validation-and-canonicality}',
    'After configuring the SDK with the expected chain discriminant, parse into an `AccountId` and compare the returned canonical rendering with the trimmed input.':
      'SDK-г хүлээгдэж буй сүлжээний дискриминантаар тохируулсны дараа `AccountId` болгон задлан шинжилж, буцаасан каноник дүрслэлийг захын зайг авсан оролттой харьцуулна.',
    '1. Trim only permitted transport whitespace around the complete value.':
      '1. Бүхэл утгын эргэн тойронд тээвэрлэлтийн зөвшөөрөгдсөн хоосон зайг л тайрна.',
    '2. Read the sentinel and require the expected chain discriminant.':
      '2. Sentinel-ийг уншиж, хүлээгдэж буй сүлжээний дискриминантыг шаард.',
    '3. Map every remaining `Unicode` symbol through the exact 105-symbol alphabet.':
      '3. Үлдсэн `Unicode` тэмдэг бүрийг яг 105 тэмдэгтэй цагаан толгойгоор хөрвүүл.',
    '4. Split off the six checksum digits.': '4. Хяналтын нийлбэрийн зургаан цифрийг салга.',
    '5. Convert the payload digits back to canonical bytes.':
      '5. Payload-ийн цифрүүдийг каноник байт руу буцаан хөрвүүл.',
    '6. Verify the checksum over those canonical bytes.': '6. Тэдгээр каноник байтын хяналтын нийлбэрийг шалга.',
    '7. Parse the header and controller, requiring:': '7. Header болон controller-ийг задлан, дараахыг шаард:',
    '- exact field lengths': '- талбаруудын яг урт',
    '- a supported `CurveId`': '- дэмжигдсэн `CurveId`',
    '- a valid public key': '- хүчинтэй нийтийн түлхүүр',
    '- no trailing bytes': '- төгсгөлийн илүү байтгүй байх',
    '- a valid multisig policy when applicable': '- хэрэглэх тохиолдолд хүчинтэй multisig policy',
    '8. Construct an `AccountId`.': '8. `AccountId` үүсгэ.',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. `AccountId`-ийг хүлээгдэж буй дискриминантад каноник байдлаар дүрсэл.',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. Захын зайг авсан оролттой `byte-for-byte` ижил байхыг шаард.',
    "The application's explicit final `render-and-compare` step rejects non-minimal numeric sentinels, non-canonical controller layouts, reordered policy material, and any other spelling that decodes but is not the encoder's current V1 output.":
      'Хэрэглээний эцсийн тодорхой `render-and-compare` алхам нь хамгийн бага бус тоон sentinel-үүд, каноник бус controller байрлалууд, дахин эрэмбэлэгдсэн policy материал болон декодлогддог боловч encoder-ийн одоогийн V1 гаралт биш бусад бүх бичлэгийг няцаана.',
    'A successful checksum or low-level `AccountAddress` parse is not a substitute for this check.':
      'Хяналтын нийлбэр амжилттай байх эсвэл доод түвшний `AccountAddress` задлалт энэ шалгалтыг орлохгүй.',
    '- a string with changed uppercase or lowercase letters, character widths, `kana`, payload, or checksum':
      '- Том эсвэл жижиг үсэг, тэмдэгтийн өргөн, `kana`, payload эсвэл хяналтын нийлбэр нь өөрчлөгдсөн тэмдэгт мөр',
    '- Use a collation that preserves letter case and character width.':
      '- Үсгийн том, жижиг хэлбэр болон тэмдэгтийн өргөнийг хадгалдаг эрэмбэлэлтийг ашигла.',
    '- Keep the chain discriminant or named network profile with exported account data and backups.':
      '- Экспортолсон дансны өгөгдөл болон нөөц хуулбарт сүлжээний ялгагч эсвэл нэрлэсэн сүлжээний профайлыг хамт хадгал.',
    '- Reuse an address only with its network context.':
      '- Хаягийг зөвхөн өөрийнх нь сүлжээний контексттэй хамт дахин ашигла.',
    '- Display the complete address and provide a copy action.': '- Бүрэн хаягийг харуулж, хуулах үйлдэл өг.',
    '- Use the stored canonical ID instead of reconstructing it from an alias.':
      '- Alias-аас дахин бүтээхийн оронд хадгалсан каноник ID-г ашигла.',
    '`AccountId` display and JSON use canonical I105.':
      '`AccountId`-ийн дэлгэц болон JSON дүрслэл каноник I105-г ашиглана.',
  },
  my: {
    '## Anonymous Asset Escrow': '## အမည်မဖော် ပိုင်ဆိုင်မှု အာမခံအပ်နှံမှု',
    'The public ledger still records that a confidential operation happened. It records commitments, nullifiers, proof hashes, and events, but it does not record the note owner, recipient, or amount for shielded-to-shielded movement. The normal transaction envelope may still reveal the submitting account, so "anonymous" here means anonymous asset movement, not automatic network-level or account-level anonymity.':
      'အများမြင် လယ်ဂျာတွင် လျှို့ဝှက်လုပ်ဆောင်ချက် ဖြစ်ပွားခဲ့ကြောင်းကို မှတ်တမ်းတင်ထားဆဲဖြစ်သည်။ ကတိပြုတန်ဖိုးများ၊ နလီဖိုင်ယာများ၊ သက်သေ ဟက်ရှ်များနှင့် ဖြစ်ရပ်များကို မှတ်တမ်းတင်သော်လည်း အကာအကွယ်ပေးထားသည့်တန်ဖိုးကို အကာအကွယ်ပေးထားသည့်တန်ဖိုးသို့ လွှဲပြောင်းရာတွင် မှတ်စု၏ ပိုင်ရှင်၊ လက်ခံသူ သို့မဟုတ် ပမာဏကို မှတ်တမ်းမတင်ပါ။ ပုံမှန် ငွေလွှဲအိတ်ပုံစံသည် တင်သွင်းသည့် အကောင့်ကို ဖော်ပြနိုင်သေးသောကြောင့် ဤနေရာတွင် “အမည်မဖော်” ဆိုသည်မှာ ပိုင်ဆိုင်မှုတန်ဖိုး ရွှေ့ပြောင်းမှုကို အမည်မဖော်ခြင်းသာ ဖြစ်ပြီး ကွန်ရက်အဆင့် သို့မဟုတ် အကောင့်အဆင့် အမည်ဝှက်ခြင်းကို အလိုအလျောက် ဆိုလိုခြင်းမဟုတ်ပါ။',
    '- `Shield`: debits a public balance and appends a shielded note commitment.':
      '- `Shield`: အများမြင် လက်ကျန်ငွေမှ နုတ်ယူပြီး အကာအကွယ်ပေးထားသော မှတ်စု၏ ခရစ်ပ်တိုဂရပ်ဖစ် ကတိပြုတန်ဖိုးကို ထည့်သွင်းသည်။',
    '`N` is public. It does not reveal the note, but it is stable for that note and chain, so Iroha can reject a second spend with the same nullifier.':
      '`N` သည် အများသိတန်ဖိုးဖြစ်သည်။ ၎င်းက သီးသန့် note ကို မဖော်ပြသော်လည်း ထို note နှင့် chain အတွက် တည်ငြိမ်သောကြောင့် တူညီသည့် nullifier ဖြင့် ဒုတိယအကြိမ် သုံးစွဲမှုကို Iroha က ငြင်းပယ်နိုင်သည်။',
    'where `public_inputs` are the commitments, nullifiers, root, asset tag, chain tag, and any public unshield amount. The witness contains the note amounts, randomness, spend material, and Merkle paths. Validators verify the proof and then mutate ledger state by appending output commitments and marking input nullifiers as spent.':
      'ဤနေရာတွင် `public_inputs` သည် ခရစ်ပ်တိုဂရပ်ဖစ် ကတိပြုတန်ဖိုးများ၊ နလီဖိုင်ယာများ၊ root၊ ပိုင်ဆိုင်မှု tag၊ chain tag နှင့် အများမြင် အကာအကွယ်ဖြုတ် ပမာဏရှိပါက ထိုပမာဏတို့ဖြစ်သည်။ လျှို့ဝှက်သက်သေဒေတာတွင် note ပမာဏများ၊ randomness၊ spend material နှင့် Merkle path များ ပါဝင်သည်။ အတည်ပြုသူများက proof ကို စစ်ဆေးပြီးနောက် အထွက် ခရစ်ပ်တိုဂရပ်ဖစ် ကတိပြုတန်ဖိုးများကို ထည့်ကာ အဝင် နလီဖိုင်ယာများကို သုံးစွဲပြီးကြောင်း မှတ်သားခြင်းဖြင့် လယ်ဂျာအခြေအနေကို ပြောင်းလဲသည်။',
    'There is no general automatic rewrite path for replacing genesis on a live network. Treat this as a coordinated migration: preserve the old state, bring up compatible peers, and only move validators to the new configuration after the operators agree on the migration plan.':
      'Live network တွင် genesis ကို အစားထိုးရန် ယေဘုယျ အလိုအလျောက်ပြန်ရေးလမ်းကြောင်း မရှိပါ။ ၎င်းကို ညှိနှိုင်းထားသော migration အဖြစ် မှတ်ယူပါ။ အဟောင်း state ကို ထိန်းသိမ်းပါ၊ ကိုက်ညီသော peer များကို စတင်ပါ၊ operator များက migration plan ကို သဘောတူပြီးနောက်မှသာ validator များကို configuration အသစ်သို့ ရွှေ့ပါ။',
    'Treat the authenticated capability payload as authoritative for the deployed node. Do not submit an SM2-signed transaction unless `crypto.sm.enabled` is true and the advertised signing policy admits it.':
      'အသုံးချထားသော နိုဒ်အတွက် အထောက်အထားဖြင့် အတည်ပြုထားသည့် စွမ်းဆောင်ရည်ပေးလွှာကို အတည်ပြုရမည့် အခြေခံအချက်အလက်အဖြစ် မှတ်ယူပါ။ `crypto.sm.enabled` သည် true ဖြစ်ပြီး ကြေညာထားသော လက်မှတ်ရေးထိုးမူဝါဒက ခွင့်ပြုမှသာ SM2 ဖြင့် လက်မှတ်ရေးထိုးထားသော ငွေလွှဲမှုကို တင်သွင်းပါ။',
    '- Paginate broad result sets and avoid user interfaces that require unrestricted ledger-wide scans for normal actions.':
      '- ကျယ်ပြန့်သော ရလဒ်အစုများကို စာမျက်နှာခွဲ၍ ပြသပြီး ပုံမှန်လုပ်ဆောင်ချက်များအတွက် ledger တစ်ခုလုံးကို အကန့်အသတ်မရှိ စစ်ဆေးဖတ်ရှုရန် လိုအပ်သည့် အသုံးပြုသူကြားခံများကို ရှောင်ကြဉ်ပါ။',
    'Treat fraud monitoring as a separate service rather than logic embedded in a validator. The service should subscribe to ledger activity, enrich it with off-chain risk context, persist evidence, and submit response transactions only through accounts that have explicit permissions.':
      'လိမ်လည်မှု စောင့်ကြည့်ရေးကို အတည်ပြုသူထဲတွင် ထည့်သွင်းထားသော လော့ဂျစ်အဖြစ် မထားဘဲ သီးခြားဝန်ဆောင်မှုတစ်ခုအဖြစ် သတ်မှတ်ပါ။ ထိုဝန်ဆောင်မှုသည် ဘလော့ခ်ချိန်း စာရင်းလယ်ဂျာ လှုပ်ရှားမှုကို စာရင်းသွင်းနားထောင်ရမည်၊ ကွန်ရက်ပြင်ပ အန္တရာယ်ဆိုင်ရာ အကြောင်းအရာများဖြင့် ဖြည့်စွက်ရမည်၊ အထောက်အထားများကို ရေရှည်သိမ်းဆည်းရမည်၊ ထင်ရှားသော ခွင့်ပြုချက်များရှိသည့် အကောင့်များမှတစ်ဆင့်သာ တုံ့ပြန်ရေး ငွေလွှဲမှုများကို တင်သွင်းရမည်။',
    'For public Taira or Minamoto usage, treat the off-chain payment rail and any support or court workflow as application policy. Iroha records the custody state, lifecycle events, evidence hashes, and final asset movement; it does not verify fiat settlement by itself.':
      'အများသုံး Taira သို့မဟုတ် Minamoto အသုံးပြုမှုအတွက် off-chain ငွေပေးချေမှုလမ်းကြောင်းနှင့် ပံ့ပိုးကူညီမှု သို့မဟုတ် တရားရုံးဆိုင်ရာ လုပ်ငန်းစဉ်များကို အပလီကေးရှင်းမူဝါဒအဖြစ် သတ်မှတ်ပါ။ Iroha သည် ထိန်းသိမ်းပိုင်ခွင့်အခြေအနေ၊ သက်တမ်းစက်ဝန်းဖြစ်ရပ်များ၊ သက်သေအထောက်အထားဆိုင်ရာ cryptographic hash များနှင့် ပိုင်ဆိုင်မှု၏ နောက်ဆုံးရွှေ့ပြောင်းမှုကို မှတ်တမ်းတင်သည်။ fiat ငွေရှင်းခြင်းကို မိမိဘာသာ အတည်မပြုပါ။',
    'Challenge calls append the full digest to the transcript state. The replay order is:':
      'စိန်ခေါ်တန်ဖိုးကို တွက်ချက်သည့် ခေါ်ဆိုမှုများက ဟက်ရှ်အနှစ်ချုပ်တန်ဖိုး အပြည့်အစုံကို မှတ်တမ်းအခြေအနေထဲသို့ နောက်ဆက်တွဲ ပေါင်းထည့်သည်။ ပြန်လည်လုပ်ဆောင်သည့် အစီအစဉ်မှာ အောက်ပါအတိုင်းဖြစ်သည်-',
    '| Domain           | ensure domain setup, unregister domains, transfer domain ownership, update domain metadata                    |':
      '| ဒိုမိန်း | ဒိုမိန်းဖွဲ့စည်းမှုကို သေချာစေခြင်း၊ ဒိုမိန်းများကို မှတ်ပုံတင်မှ ပယ်ဖျက်ခြင်း၊ ဒိုမိန်းပိုင်ဆိုင်မှုကို လွှဲပြောင်းခြင်း၊ ဒိုမိန်း မက်တာဒေတာကို ပြင်ဆင်ခြင်း |',
    '- Select the network profile before encoding or validating an address.':
      '- လိပ်စာကို ကုဒ်သွင်းခြင်း သို့မဟုတ် အတည်ပြုခြင်း မပြုမီ ကွန်ရက်ပရိုဖိုင်ကို ရွေးပါ။',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- စာလုံးအကြီးအသေးကို မပြောင်းဘဲ ထိန်းသိမ်းပြီး `Unicode` normalization ကို မပြုလုပ်ပါနှင့်။',
    '- An I105 ID must not have an `@domain` or `@domain.dataspace` suffix.':
      '- I105 ID တွင် `@domain` သို့မဟုတ် `@domain.dataspace` နောက်ဆက် မပါရပါ။',
    '- A regular expression is not an I105 validator.': '- regular expression သည် I105 validator မဟုတ်ပါ။',
    '| Part             | Purpose                                                            | Checksum coverage |':
      '| အပိုင်း | ရည်ရွယ်ချက် | checksum လွှမ်းခြုံမှု |',
    '| Network sentinel | Maps the text to one `u16` chain discriminant                      | Not covered       |':
      '| ကွန်ရက် sentinel | စာသားကို `u16` chain discriminant တစ်ခုနှင့် ချိတ်ဆက်ပေးသည် | checksum မလွှမ်းခြုံ |',
    '| Payload          | `base-105` encoding of the canonical account-controller bytes      | Covered           |':
      '| payload | canonical account-controller bytes များ၏ `base-105` encoding | checksum လွှမ်းခြုံ |',
    '| Checksum         | Six `Bech32m`-style `5-bit` values rendered with the I105 alphabet | N/A               |':
      '| checksum | I105 alphabet ဖြင့် ဖော်ပြသော `Bech32m` ပုံစံ `5-bit` တန်ဖိုး ခြောက်ခု | N/A |',
    'The payload and checksum identify the account controller.':
      'payload နှင့် checksum တို့က account controller ကို သတ်မှတ်ပေးသည်။',
    'The same controller has the same payload and checksum on Taira and Minamoto, but each network uses a different leading sentinel.':
      'တူညီသော controller ၏ payload နှင့် checksum သည် Taira နှင့် Minamoto နှစ်ခုလုံးတွင် တူညီသော်လည်း ကွန်ရက်တစ်ခုစီတွင် ရှေ့ဆုံး sentinel မတူညီပါ။',
    'A decoder must enforce the expected discriminant.':
      'decoder သည် မျှော်မှန်းထားသော discriminant ကို မဖြစ်မနေ စစ်ဆေးရမည်။',
    'Choosing an endpoint or chain ID does not implicitly choose the address profile.':
      'endpoint သို့မဟုတ် chain ID ကို ရွေးခြင်းက address profile ကို အလိုအလျောက် ရွေးပေးခြင်းမဟုတ်ပါ။',
    "The Taira form applies Taira's sentinel to the same payload:":
      'Taira ပုံစံသည် တူညီသော payload ပေါ်တွင် Taira sentinel ကို အသုံးပြုသည်:',
    'The `convert`, `normalize`, and `audit` commands operate on the lower-level `AccountAddress` codec.':
      '`convert`၊ `normalize` နှင့် `audit` command များသည် low-level `AccountAddress` codec ပေါ်တွင် လုပ်ဆောင်သည်။',
    'They do not by themselves validate all multisig policy semantics.':
      '၎င်းတို့တစ်ခုတည်းဖြင့် multisig policy semantics အားလုံးကို အတည်မပြုနိုင်ပါ။',
    'Use strict `AccountId` validation before authorization or persistence.':
      'authorization သို့မဟုတ် persistent storage မပြုမီ တင်းကျပ်သော `AccountId` validation ကို အသုံးပြုပါ။',
    'It does not register the account on the target network or prove that the same controller should be reused there.':
      '၎င်းသည် target network ပေါ်တွင် account ကို register မလုပ်သလို တူညီသော controller ကို ထိုနေရာတွင် ပြန်သုံးသင့်ကြောင်းလည်း သက်သေမပြပါ။',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'NFC၊ NFKC၊ width conversion၊ case folding သို့မဟုတ် ရုပ်ဆင်တူသင်္ကေတဖြင့် အစားထိုးခြင်းကို မပြုလုပ်ပါနှင့်။',
    'All multi-byte integers below are unsigned and `big-endian`.':
      'အောက်ပါ multi-byte integer အားလုံးသည် unsigned ဖြစ်ပြီး `big-endian` ဖြစ်သည်။',
    'Use the compact form when the raw public-key payload is at most 255 bytes:':
      'raw public-key payload သည် 255 ဘိုက်အထိသာ ရှိပါက compact form ကို အသုံးပြုပါ:',
    '| `public_key` | `key_len` bytes | Raw public-key payload   |':
      '| `public_key` | `key_len` ဘိုက် | raw public-key payload |',
    'Keys longer than 255 bytes use the extended form:':
      '255 ဘိုက်ထက်ရှည်သော key များသည် extended form ကို အသုံးပြုသည်:',
    'An extended encoding is not canonical for a key that fits the compact form.':
      'compact form နှင့် ကိုက်ညီသော key အတွက် extended encoding သည် canonical မဟုတ်ပါ။',
    '| `threshold`      |  2 bytes | Required total approval weight |':
      '| `threshold` | 2 ဘိုက် | လိုအပ်သော approval weight စုစုပေါင်း |',
    'A valid policy has at least one member, positive weights, no duplicate public keys, and a threshold from `1` through the sum of member weights.':
      'မှန်ကန်သော policy တစ်ခုတွင် အနည်းဆုံး member တစ်ဦး၊ သုညထက်ကြီးသော weight များ၊ duplicate public key မရှိခြင်းနှင့် `1` မှ member weight စုစုပေါင်းအထိရှိသည့် threshold တစ်ခု ပါရမည်။',
    "Canonical construction sorts members by the signing algorithm's stable name, a zero separator byte, and then the raw public-key bytes.":
      'Canonical construction သည် member များကို signing algorithm ၏ stable name၊ zero separator byte၊ ထို့နောက် raw public-key bytes အလိုက် စီစဉ်သည်။',
    'For an untrusted string, a conforming application should:':
      'မယုံကြည်ရသော string တစ်ခုအတွက် စံနှုန်းနှင့်ကိုက်ညီသော application သည် အောက်ပါတို့ကို လုပ်ဆောင်သင့်သည်:',
    '1. Trim only permitted transport whitespace around the complete value.':
      '1. တန်ဖိုးအပြည့်၏ အစနှင့်အဆုံးရှိ ခွင့်ပြုထားသော transport whitespace ကိုသာ trim လုပ်ပါ။',
    '4. Split off the six checksum digits.': '4. checksum digit ခြောက်လုံးကို ခွဲထုတ်ပါ။',
    '7. Parse the header and controller, requiring:':
      '7. header နှင့် controller ကို parse လုပ်ပြီး အောက်ပါတို့ကို လိုအပ်ပါသည်:',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. မျှော်မှန်းထားသော discriminant အတွက် `AccountId` ကို canonical ပုံစံဖြင့် render လုပ်ပါ။',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. trimmed input နှင့် `byte-for-byte` တူညီမှုကို လိုအပ်သည်။',
    'Do not accept these values in a strict account-ID field:':
      'တင်းကျပ်သော account-ID field တွင် ဤတန်ဖိုးများကို လက်မခံပါနှင့်:',
    '- an I105 literal with an appended `@domain` suffix': '- အဆုံးတွင် `@domain` suffix ထည့်ထားသော I105 literal',
    '- a string with changed uppercase or lowercase letters, character widths, `kana`, payload, or checksum':
      '- စာလုံးအကြီးအသေး၊ character width၊ `kana`၊ payload သို့မဟုတ် checksum ပြောင်းလဲထားသော string',
    '| `ERR_INVALID_PUBLIC_KEY`         | The key is invalid for the algorithm selected by its `CurveId`      |':
      '| `ERR_INVALID_PUBLIC_KEY` | key သည် ၎င်း၏ `CurveId` ရွေးထားသော algorithm အတွက် မမှန်ကန်ပါ |',
    '- Send the exact I105 UTF-8 string in JSON account fields.':
      '- တိကျသော I105 UTF-8 string ကို JSON account field များတွင် ပို့ပါ။',
    '- `Percent-encode` the complete account ID before placing it in a URL path segment.':
      '- account ID အပြည့်ကို URL path segment ထဲ မထည့်မီ `Percent-encode` လုပ်ပါ။',
    '- Never substitute an account alias for an I105 ID.':
      '- I105 ID အစား account alias ကို မည်သည့်အခါမျှ မသုံးပါနှင့်။',
    '- Use a collation that preserves letter case and character width.':
      '- စာလုံးအကြီးအသေးနှင့် character width ကို ထိန်းသိမ်းသော collation ကို အသုံးပြုပါ။',
    '- Reuse an address only with its network context.': '- လိပ်စာကို ၎င်း၏ network context နှင့်သာ ပြန်လည်အသုံးပြုပါ။',
    '- Display the complete address and provide a copy action.': '- လိပ်စာအပြည့်အစုံကို ပြသပြီး copy action ကို ပေးပါ။',
    'Call the explicit `AccountAddress` I105 encoder when an external account ID is required.':
      'ပြင်ပ account ID လိုအပ်ပါက explicit `AccountAddress` I105 encoder ကို ခေါ်သုံးပါ။',
  },
  pt: {
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- Preserve exatamente o uso de maiúsculas e minúsculas e não aplique normalização `Unicode`.',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'Não aplique NFC, NFKC, conversão de largura, dobramento de maiúsculas/minúsculas ou substituição por caracteres visualmente semelhantes.',
    '| `key_len`    |          1 byte | Raw key length           |': '|`key_len` |1 byte |Comprimento da chave bruta |',
    '| `key_len`    |         2 bytes | Raw key length           |':
      '|`key_len` |2 bytes |Comprimento da chave bruta |',
    '4. Split off the six checksum digits.': '4. Separe os seis dígitos da soma de verificação.',
    '6. Verify the checksum over those canonical bytes.':
      '6. Verifique a soma de verificação sobre esses bytes canônicos.',
    '- Never substitute an account alias for an I105 ID.': '- Nunca use um alias de conta no lugar de um I105 ID.',
    '- Use a collation that preserves letter case and character width.':
      '- Use uma colação que preserve maiúsculas e minúsculas e a largura dos caracteres.',
    '- Preserve every `kana` character exactly.': '- Preserve exatamente cada caractere `kana`.',
    '- Keep the full address available when a compact display shortens its middle.':
      '- Mantenha o endereço completo disponível quando uma exibição compacta encurtar a parte central.',
    '`AccountId` display and JSON use canonical I105.':
      'A exibição de `AccountId` e sua representação JSON usam I105 canônico.',
  },
  ru: {
    'Applications should store their business identifier in `primary_reference` or `metadata`, then discover the generated `RwaId` from `RwaEvent::Created`, `FindRwas`, `/v1/rwas`, or the explorer route set after the transaction commits.':
      'Приложения должны сохранять бизнес-идентификатор в `primary_reference` или `metadata`, а затем получать созданный `RwaId` из `RwaEvent::Created`, `FindRwas`, `/v1/rwas` или набора маршрутов обозревателя после финализации транзакции.',
    'Torii exposes chain-state routes such as `/v1/rwas` and `/v1/rwas/query`, plus explorer routes such as `/v1/explorer/rwas` and `/v1/explorer/rwas/{rwa_id}` when that route family is enabled. Generated clients should prefer the live [`/openapi.json`](/reference/torii-endpoints.md#common-endpoints) document for the exact response shape exposed by a node.':
      'Torii предоставляет маршруты состояния цепочки, например `/v1/rwas` и `/v1/rwas/query`, а при включении соответствующего семейства — маршруты обозревателя, например `/v1/explorer/rwas` и `/v1/explorer/rwas/{rwa_id}`. Чтобы получить точную форму ответа конкретного узла, сгенерированные клиенты должны использовать актуальный документ [`/openapi.json`](/ru/reference/torii-endpoints.md#common-endpoints).',
    'Challenge calls append the full digest to the transcript state. The replay order is:':
      'Вызовы функции получения испытаний добавляют полный дайджест в состояние транскрипта. Порядок воспроизведения:',
    'The explorer is a second, read-only observation surface. It can lag briefly behind pipeline finality.':
      'Обозреватель — это вторичный интерфейс наблюдения только для чтения. Он может ненадолго отставать от финальности конвейера обработки.',
    '- An explorer `404` immediately after Applied can be indexing lag. Retry the read; do not resubmit the transaction.':
      '- Если сразу после состояния Applied обозреватель возвращает `404`, причиной может быть задержка индексации. Повторите чтение; не отправляйте транзакцию заново.',
    '2. Hash and describe the payload in a Norito manifest or route-specific commitment record.':
      '2. Вычислите хеш полезной нагрузки и опишите её в манифесте Norito или в записи коммитмента, относящейся к маршруту.',
    '- stable opaque pool identifiers, roots, nullifiers, commitments, and fixed ciphertext slots':
      '- стабильные непрозрачные идентификаторы пулов, корни, нуллификаторы, коммитменты и слоты шифротекста фиксированного размера',
    '3. a governed confidential settlement pool and initial root in every dataspace':
      '3. управляемый конфиденциальный расчётный пул и начальный корень в каждом пространстве данных',
    '| [Atomic private settlement](#atomic-private-settlement)   | Govern confidential pools and atomic bundles.    |':
      '| [Атомарные конфиденциальные расчёты](#atomic-private-settlement) | Управление конфиденциальными пулами и атомарными пакетами. |',
    "Use the privacy-governance-authorized `RotatePrivateSettlementPoolPolicyV1` instruction. It must name the exact current governance digest, keep the same route, pool, and asset-binding commitment, advance the governance revision by one, use a strictly newer key epoch and different policy/governance digests, and activate at the block that contains the rotation. The pool frontier, roots, nullifiers, outputs, replay sets, and finalized receipts are preserved. Do not include a receipt touching that same route/pool at the rotation's activation height; the instruction rejects that boundary.":
      'Используйте разрешённую политикой управления конфиденциальностью инструкцию `RotatePrivateSettlementPoolPolicyV1`. Она должна точно указывать текущий дайджест управления, сохранять тот же маршрут, пул и коммитмент привязки актива, увеличивать ревизию управления на единицу, использовать строго более новую эпоху ключа и отличающиеся дайджесты политики и управления, а также активироваться в блоке, содержащем ротацию. Сохраняются фронтир пула, корни, нуллификаторы, выходы, наборы защиты от повторного воспроизведения и финализированные квитанции. Не включайте на высоте активации ротации квитанцию, затрагивающую тот же маршрут или пул; инструкция отклоняет такую границу.',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- Сохраняйте регистр букв и не применяйте нормализацию `Unicode`.',
    'The transaction-chain ID and the I105 chain discriminant are separate values.':
      'ID цепочки транзакций и дискриминатор цепочки I105 — это разные значения.',
    'They do not materialize an `AccountId`.': 'Эти команды не создают объект `AccountId`.',
    'They do not by themselves validate all multisig policy semantics.':
      'Эти команды сами по себе не проверяют всю семантику политики мультиподписи.',
    'Use strict `AccountId` validation before authorization or persistence.':
      'Используйте строгую проверку `AccountId` перед авторизацией или постоянным сохранением.',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'Не применяйте NFC, NFKC, преобразование ширины символов, приведение регистра или замену визуально похожих символов.',
    'Domain, dataspace, alias, UAID, and account metadata bytes are not present.':
      'Домен, пространство данных, псевдоним, UAID и байты метаданных учётной записи отсутствуют.',
    '`CurveId` registry value': 'Значение из реестра `CurveId`',
    '1. Trim only permitted transport whitespace around the complete value.':
      '1. Удалите только разрешённые при передаче пробельные символы вокруг всего значения.',
    '4. Split off the six checksum digits.': '4. Отделите шесть цифр контрольной суммы.',
    '6. Verify the checksum over those canonical bytes.':
      '6. Проверьте контрольную сумму для этих канонических байтов.',
    '- no trailing bytes': '- отсутствие лишних байтов в конце',
    '- a valid multisig policy when applicable': '- допустимая политика мультиподписи, если применимо',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. Сформируйте каноническое представление `AccountId` для ожидаемого дискриминатора.',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. Требуйте равенства `byte-for-byte` со входной строкой после удаления пробелов по краям.',
    'The body cannot contain both payload and checksum':
      'Тело слишком короткое, чтобы вместить и полезную нагрузку, и контрольную сумму',
    '- Never substitute an account alias for an I105 ID.':
      '- Никогда не используйте псевдоним учётной записи вместо I105 ID.',
    '- Use a collation that preserves letter case and character width.':
      '- Используйте правило сортировки и сравнения, сохраняющее регистр букв и ширину символов.',
    '- Keep the chain discriminant or named network profile with exported account data and backups.':
      '- Храните дискриминатор цепочки или именованный профиль сети вместе с экспортированными данными учётной записи и резервными копиями.',
    '`AccountId` display and JSON use canonical I105.':
      'Для отображения `AccountId` и его представления в JSON используется канонический формат I105.',
    'The lower-level `AccountAddress` display/JSON representation uses canonical hex for internal and debugging contexts.':
      'Низкоуровневое представление `AccountAddress` для отображения и JSON использует канонический шестнадцатеричный формат во внутренних контекстах и при отладке.',
    'Feature availability can differ between SDKs and release profiles. The wire format remains governed by the header and schema, not by local build flags.':
      'Доступность функций может различаться между SDKs и профилями выпуска. Формат протокольной сериализации по-прежнему определяется заголовком и схемой, а не локальными флагами сборки.',
    'Typical SoraFS uses include static application assets, documentation builds, zone bundles, model or artifact references, and governance evidence bundles. The Iroha data model exposes SoraFS gateway events and a [`FindSorafsProviderOwner`](/reference/queries.md#nexus-data-availability-and-packages) query for provider ownership resolution.':
      'К типичным применениям SoraFS относятся статические ресурсы приложений, сборки документации, пакеты зон, ссылки на модели или артефакты и пакеты доказательств для управления. Модель данных Iroha предоставляет события шлюза SoraFS и запрос [`FindSorafsProviderOwner`](/ru/reference/queries.md#nexus-data-availability-and-packages) для определения владельца провайдера.',
    '| Inrou                  | Soracloud hosted HTTP runtime for service revisions that need a live HTTP plane.                                                            | Soracloud runtime config, host capability adverts, replica runtime state                 |':
      '| Inrou | Среда выполнения HTTP в Soracloud для версий служб, которым нужен активный HTTP-контур. | Конфигурация среды выполнения Soracloud, объявления возможностей хоста, состояние реплики |',
    '| Aitai                  | App-level fiat and asset settlement corridor backed by native escrow records, not by a separate ledger.                                     | `OpenAssetEscrow`, `FindAssetEscrow*`, `EscrowEventFilter`, Kotodama `escrow_*` builtins |':
      '| Aitai | Коридор фиатных расчётов и расчётов по активам на уровне приложения, основанный на встроенных записях эскроу, а не на отдельном реестре. | `OpenAssetEscrow`, `FindAssetEscrow*`, `EscrowEventFilter`, встроенные функции Kotodama `escrow_*` |',
    '| Commitment | Digest material that binds the manifest, lane payload, proof bundle, or content root to the ledger-visible record.                                    |':
      '| Криптографический коммитмент | Дайджест, связывающий манифест, полезную нагрузку канала, пакет доказательств или корень содержимого с записью, видимой в реестре. |',
    '| Vanity origin          | `https://<fqdn>/<path>`                        | Canonical app URL recorded in manifests and release notes |':
      '| Пользовательский origin-адрес | `https://<fqdn>/<path>` | Канонический URL приложения, записанный в манифестах и примечаниях к выпуску |',
    '- the `iroha` CLI as the most complete reference client': '- CLI `iroha` — наиболее полный эталонный клиент',
    '- the `World`: parameters, peers, domains, accounts, assets, NFTs, roles, permissions, triggers, executor data, and other registered data-model objects':
      '- `World`: параметры, сетевые узлы, домены, учётные записи, активы, NFTs, роли, разрешения, триггеры, данные исполнителя и другие зарегистрированные объекты модели данных',
    '- Test account-recovery procedures before production launch.':
      '- Проверьте процедуры восстановления учётных записей до запуска в промышленной среде.',
    'When a Python helper is not available, feed canonical data-model `InstructionBox` JSON into `Instruction.from_json`. This is the recommended path for `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, peer/role/NFT registration, and non-trigger unregister variants until those helpers are typed.':
      'Если вспомогательной функции Python нет, передайте канонический JSON модели данных `InstructionBox` в `Instruction.from_json`. Это рекомендуемый способ для `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, регистрации пиров, ролей и NFT, а также вариантов отмены регистрации, не связанных с триггерами, пока эти вспомогательные функции не получат типизированный интерфейс.',
    'The optional single-delta transfer digest commits the encoded transfer preimage:':
      'Необязательный дайджест передачи с одной дельтой криптографически связывает закодированный прообраз передачи:',
    '- a single-delta Poseidon digest, when present, must match the transcript preimage':
      '- дайджест Poseidon с одной дельтой, если он присутствует, должен совпадать с прообразом транскрипта',
    '| `GET /v1/identifiers/receipts/{receipt_hash}` | Look up a persisted identifier claim by receipt hash for audit and support tooling. |':
      '| `GET /v1/identifiers/receipts/{receipt_hash}` | Найти сохранённое утверждение об идентификаторе по хэшу подтверждения для аудита и средств поддержки. |',
    '| [Connect to Taira](./connect-to-taira.md)                             | Write-ready  | A funded I105 signer, live fee asset, and applied canary transaction |':
      '| [Подключение к Taira](./connect-to-taira.md) | Готово к записи | Пополненный подписант I105, актуальный актив для оплаты комиссии и успешно применённая канареечная транзакция |',
    "Do not send `Last-Event-ID`. Torii's SSE endpoint is a live fan-out stream, not a replay log, and rejects replay requests.":
      'Не отправляйте `Last-Event-ID`. Конечная точка SSE Torii — это активный поток с рассылкой, а не журнал воспроизведения, поэтому она отклоняет запросы на воспроизведение.',
    '- Use separate production signers, funding, domains, and config paths. Do not promote testnet keys or faucet assumptions.':
      '- Используйте отдельных промышленных подписантов, источники финансирования, домены и пути конфигурации. Не переносите в промышленную среду ключи тестовой сети или допущения о работе службы тестового финансирования.',
    '| Schema hash | 16 bytes | Type identity used by typed decoders to reject unexpected payloads. |':
      '| Хэш схемы | 16 байт | Идентификатор типа, с помощью которого типизированные декодеры отклоняют неожиданные полезные нагрузки. |',
  },
  ur: {
    '| Method and endpoint                   | Authentication and visibility                                   |':
      '| طریقہ اور اینڈ پوائنٹ | توثیق اور مرئیت |',
    'Subscription reads and draft builders are inherited from the shared Torii client used by `iroha_python.ToriiClient`. Every mutation is admitted with a body-bound canonical account signature and returns an unsigned transaction draft. Torii never accepts a private key and does not submit the draft for you.':
      'سبسکرپشن ریڈز اور ڈرافٹ بلڈرز، `iroha_python.ToriiClient` کے زیرِ استعمال مشترکہ Torii کلائنٹ سے وراثت میں ملتے ہیں۔ ہر تغیر کو درخواست کے متن سے منسلک کینونیکل اکاؤنٹ دستخط کے ساتھ قبول کیا جاتا ہے اور جواب میں ایک غیر دستخط شدہ ٹرانزیکشن ڈرافٹ ملتا ہے۔ Torii کبھی نجی کلید قبول نہیں کرتا اور نہ آپ کی جانب سے ڈرافٹ جمع کراتا ہے۔',
    'Use the privacy-governance-authorized `RotatePrivateSettlementPoolPolicyV1` instruction. It must name the exact current governance digest, keep the same route, pool, and asset-binding commitment, advance the governance revision by one, use a strictly newer key epoch and different policy/governance digests, and activate at the block that contains the rotation. The pool frontier, roots, nullifiers, outputs, replay sets, and finalized receipts are preserved. Do not include a receipt touching that same route/pool at the rotation\'s activation height; the instruction rejects that boundary.':
      'رازداری کی حکمرانی سے مجاز `RotatePrivateSettlementPoolPolicyV1` ہدایت استعمال کریں۔ اس میں موجودہ حکمرانی کے عین ڈائجسٹ کا نام ہونا چاہیے، وہی راستہ، پول اور اثاثہ-بائنڈنگ کمٹمنٹ برقرار رہنا چاہیے، حکمرانی کی نظرثانی میں ایک کا اضافہ ہونا چاہیے، کلید کا دور لازماً نیا اور پالیسی و حکمرانی کے ڈائجسٹ مختلف ہونے چاہییں، اور گردش اسی بلاک میں فعال ہونی چاہیے جس میں وہ شامل ہو۔ پول کا فرنٹیئر، روٹس، نلفائرز، آؤٹ پٹس، ری پلے مجموعے اور حتمی رسیدیں محفوظ رہتی ہیں۔ گردش کے فعال ہونے کی اونچائی پر اسی راستے یا پول کو چھونے والی رسید شامل نہ کریں؛ ہدایت اس حد کو مسترد کرتی ہے۔',
    'The `base-105` body encodes a binary account payload, not a public-key string and not a Norito JSON object:':
      '`base-105` باڈی ایک بائنری اکاؤنٹ پے لوڈ کو انکوڈ کرتی ہے، نہ کہ عوامی کلید کی اسٹرنگ کو اور نہ ہی Norito JSON آبجیکٹ کو:',
    'The canonical payload starts with `02 00 01 20`: header `0x02`, compact single-key tag `0x00`, `Ed25519` curve ID `0x01`, and a 32-byte key length `0x20`.':
      'کینونیکل پے لوڈ `02 00 01 20` سے شروع ہوتا ہے: ہیڈر `0x02`، کمپیکٹ سنگل-کی ٹیگ `0x00`، `Ed25519` کرو آئی ڈی `0x01`، اور 32 بائٹ کلید کی لمبائی `0x20`۔',
    'These sorts of subtle mistakes can be avoided, for example, by deserialising directly from string literals, or by generating a fresh key-pair in places where it makes sense.':
      'اس قسم کی باریک غلطیوں سے، مثلاً سٹرنگ لٹرلز سے براہِ راست ڈی سیریلائز کر کے، یا جہاں مناسب ہو وہاں کلیدوں کا نیا جوڑا بنا کر، بچا جا سکتا ہے۔',
    '- When metadata points to off-chain data, store a verifiable reference such as a content hash, URI, SoraFS path, manifest reference, or compact commitment.':
      '- جب میٹا ڈیٹا آف چین ڈیٹا کی طرف اشارہ کرے تو قابل تصدیق حوالہ محفوظ کریں، مثلاً مواد کا کرپٹوگرافک ہیش، URI، SoraFS پاتھ، تکنیکی مینی فیسٹ کا حوالہ، یا مختصر کمٹمنٹ۔',
    'Pipeline events are emitted when transactions are submitted, executed, or committed to a block. A pipeline event contains the following information: the kind of entity that caused an event (transaction or block), its hash and status. The status can be either `Validating` (validation in progress), `Rejected`, or `Committed`. If an entity was rejected, the reason for the rejection is provided.':
      'پروسیسنگ پائپ لائن کے واقعات اس وقت خارج ہوتے ہیں جب لین دین جمع کرائے جائیں، چلائے جائیں یا کسی بلاک میں حتمی طور پر شامل کیے جائیں۔ پروسیسنگ پائپ لائن کا واقعہ درج ذیل معلومات رکھتا ہے: واقعہ پیدا کرنے والی ہستی کی قسم (لین دین یا بلاک)، اس کا کرپٹوگرافک ہیش، اور اس کی حالت۔ حالت `Validating` (توثیق جاری ہے)، `Rejected` یا `Committed` میں سے کوئی ایک ہو سکتی ہے۔ اگر کسی ہستی کو مسترد کیا گیا ہو تو اس کی وجہ بھی فراہم کی جاتی ہے۔',
    '- Store and compare the canonical UTF-8 string exactly.':
      '- کینونیکل UTF-8 سٹرنگ کو بعینہٖ ذخیرہ کریں اور اسی طرح اس کا موازنہ کریں۔',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- حروف کی بڑی/چھوٹی حالت برقرار رکھیں اور `Unicode` نارملائزیشن لاگو نہ کریں۔',
    '| Checksum         | Six `Bech32m`-style `5-bit` values rendered with the I105 alphabet | N/A               |':
      '| چیک سم | I105 حروفِ تہجی میں دکھائی گئی `Bech32m` طرز کی چھ `5-bit` قدریں | N/A |',
    'The payload and checksum identify the account controller.': 'پے لوڈ اور چیک سم اکاؤنٹ کنٹرولر کی شناخت کرتے ہیں۔',
    'The named values always use their named sentinel.': 'نام زدہ اقدار ہمیشہ اپنا نام زدہ سینٹینل استعمال کرتی ہیں۔',
    'Use strict `AccountId` validation before authorization or persistence.':
      'اختیار دہی یا مستقل ذخیرہ کرنے سے پہلے سخت `AccountId` توثیق استعمال کریں۔',
    'When converting an existing address between explicit contexts, also supply the source with `--expect-prefix`:':
      'کسی موجودہ پتے کو واضح سیاقوں کے درمیان تبدیل کرتے وقت، ماخذ کا سابقہ بھی `--expect-prefix` کے ذریعے فراہم کریں:',
    'The checksum uses the `Bech32` `polymod` generators and constant `0x2bc830a3`.':
      'چیک سم `Bech32` کے `polymod` جنریٹرز اور مستقل `0x2bc830a3` استعمال کرتا ہے۔',
    'The checksum-only HRP is the ASCII string `snx`.': 'صرف چیک سم کے لیے HRP، ASCII سٹرنگ `snx` ہے۔',
    'The checksum-only HRP is not printed in the address.': 'صرف چیک سم کے لیے HRP ایڈریس میں شامل نہیں کیا جاتا۔',
    '| `0`    |     1 |                          `0` | Reserved `extension flag`    |':
      '| `0` | 1 | `0` | محفوظ `extension flag` |',
    'Use the compact form when the raw public-key payload is at most 255 bytes:':
      'جب خام عوامی کلید کا پے لوڈ زیادہ سے زیادہ 255 بائٹس ہو تو کمپیکٹ شکل استعمال کریں:',
    'An extended encoding is not canonical for a key that fits the compact form.':
      'جو کلید کمپیکٹ شکل میں سما سکتی ہو، اس کے لیے توسیعی انکوڈنگ کینونیکل نہیں ہے۔',
    "Canonical construction sorts members by the signing algorithm's stable name, a zero separator byte, and then the raw public-key bytes.":
      'کینونیکل تشکیل ارکان کو پہلے دستخطی الگورتھم کے مستحکم نام، پھر صفر جداکار بائٹ، اور اس کے بعد خام عوامی کلید کے بائٹس کے لحاظ سے ترتیب دیتی ہے۔',
    'After configuring the SDK with the expected chain discriminant, parse into an `AccountId` and compare the returned canonical rendering with the trimmed input.':
      'متوقع چین ڈسکرمننٹ کے ساتھ SDK کو کنفیگر کرنے کے بعد، قدر کو `AccountId` کے طور پر پارس کریں اور واپس آنے والی کینونیکل نمائندگی کا موازنہ کناروں کی اجازت یافتہ خالی جگہ ہٹائی ہوئی ان پٹ سے کریں۔',
    '1. Trim only permitted transport whitespace around the complete value.':
      '1. مکمل قدر کے اردگرد صرف اجازت یافتہ ترسیلی خالی جگہ کو ہٹائیں۔',
    '4. Split off the six checksum digits.': '4. چیک سم کے چھ ہندسوں کو الگ کریں۔',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. متوقع ڈسکرمننٹ کے لیے `AccountId` کو کینونیکل صورت میں پیش کریں۔',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. کناروں کی خالی جگہ ہٹائی ہوئی ان پٹ کے ساتھ `byte-for-byte` برابری لازم کریں۔',
    "The application's explicit final `render-and-compare` step rejects non-minimal numeric sentinels, non-canonical controller layouts, reordered policy material, and any other spelling that decodes but is not the encoder's current V1 output.":
      'ایپلی کیشن کا واضح آخری `render-and-compare` مرحلہ غیر کم سے کم عددی سینٹینلز، غیر کینونیکل کنٹرولر لے آؤٹس، دوبارہ ترتیب دیے گئے پالیسی مواد، اور ہر ایسی دوسری املا کو مسترد کرتا ہے جو ڈی کوڈ تو ہو سکتی ہو لیکن انکوڈر کا موجودہ V1 آؤٹ پٹ نہ ہو۔',
    '- an account alias such as `alice@wonderland.universal`': '- اکاؤنٹ کا عرف، مثلاً `alice@wonderland.universal`',
    '- an I105 literal with an appended `@domain` suffix': '- ایک I105 لٹرل جس کے آخر میں `@domain` لاحقہ شامل ہو',
    '- an address for the wrong chain discriminant': '- غلط چین ڈسکرمننٹ کے لیے ایڈریس',
    '| `ERR_UNKNOWN_CURVE`              | The controller declares an unassigned or unavailable `CurveId`      |':
      '| `ERR_UNKNOWN_CURVE` | کنٹرولر ایک غیر مختص یا غیر دستیاب `CurveId` کا اعلان کرتا ہے |',
    '- Never substitute an account alias for an I105 ID.': '- کبھی بھی I105 ID کی جگہ اکاؤنٹ کا عرف استعمال نہ کریں۔',
    '- Use a collation that preserves letter case and character width.':
      '- ایسا تقابلی ترتیب نامہ استعمال کریں جو حروف کی بڑی/چھوٹی حالت اور حروف کی چوڑائی برقرار رکھے۔',
    '- Display the complete address and provide a copy action.':
      '- مکمل ایڈریس دکھائیں اور اسے نقل کرنے کی سہولت فراہم کریں۔',
    '- Preserve every `kana` character exactly.': '- ہر `kana` حرف کو بعینہٖ محفوظ رکھیں۔',
  },
  uz: {
    'Domains do not have a separate `DomainAlias` object. A domain identifier is already a dataspace-qualified name such as `payments.universal`. SNS tracks lease ownership for domain names in the `domain` namespace and for dataspace aliases in the `dataspace` namespace. The reserved `universal` dataspace alias must remain defined.':
      'Domenlarda alohida `DomainAlias` obyekti yo‘q. Domen identifikatorining o‘zi `payments.universal` kabi ma’lumotlar makoni bilan aniqlashtirilgan nomdir. SNS `domain` nomlar makonidagi domen nomlari va `dataspace` nomlar makonidagi ma’lumotlar makoni taxalluslari uchun ijara egaligini kuzatadi. Zaxiralangan `universal` ma’lumotlar makoni taxallusi ta’riflangan holda qolishi shart.',
    'Transactions enter a queue before Sumeragi proposes them in a block. Validators independently validate and execute the proposal, then sign only the state transition they can reproduce. A block commits after the required validator quorum agrees on that result and the matching payload is available.':
      'Tranzaksiyalar Sumeragi ularni blok sifatida taklif qilishidan oldin navbatga tushadi. Validatorlar taklifni mustaqil tekshiradi va bajaradi, so‘ng faqat o‘zlari qayta hosil qila oladigan holat o‘tishini imzolaydi. Talab etilgan validatorlar kvorumi natijaga rozi bo‘lgach va mos foydali yuk mavjud bo‘lgach, blok yakuniy ravishda yoziladi.',
    'Sumeragi runs the ledger forward one block height at a time. At each height, one validator acts as proposer for the current view. The proposer drains eligible transactions from the queue, builds a candidate block, and announces the proposal to the active validator set.':
      'Sumeragi reyestrni har safar bitta blok balandligiga oldinga siljitadi. Har bir balandlikda bitta validator joriy ko‘rinish uchun taklifchi vazifasini bajaradi. Taklifchi mos tranzaksiyalarni navbatdan oladi, nomzod blokni tuzadi va taklifni faol validatorlar to‘plamiga e’lon qiladi.',
    '| NPoS         | Public or Nexus-oriented networks where validation follows nomination and stake policy | Validators are selected by the NPoS profile, usually across epochs, and require BLS keys plus Proofs-of-Possession | Keep stake snapshots, signed epoch and election inputs, validator PoPs, and immutable block cadence aligned across the network |':
      '| NPoS | Tekshirish nominatsiya va ulush siyosatiga amal qiladigan ommaviy yoki Nexus yo‘nalishidagi tarmoqlar | Validatorlar NPoS profili bo‘yicha, odatda davrlar kesimida tanlanadi; ular uchun BLS kalitlari va egalik isbotlari talab etiladi | Ulush oniy tasvirlari, imzolangan davr va saylov kirishlari, validatorlarga tegishli PoPs hamda o‘zgarmas blok sur’atini butun tarmoq bo‘ylab muvofiq saqlang |',
    'Use NPoS mode when the deployment profile expects validator participation to be driven by nomination and stake state. Public SORA Nexus deployments use NPoS, and their generated profiles include the BLS validator identities, Proofs-of-Possession, epoch settings, and Sumeragi NPoS parameters needed at startup. Epoch changes can replace the active validator set at defined heights, so operators need to monitor both consensus health and the stake or nomination state that feeds the next roster.':
      'Joylashtirish profili validatorlar ishtiroki nominatsiya va ulush holati bilan boshqarilishini nazarda tutsa, NPoS rejimidan foydalaning. Ommaviy SORA Nexus joylashtirishlari NPoS dan foydalanadi; ularning yaratilgan profillari ishga tushirish uchun zarur bo‘lgan BLS asosidagi validator identifikatorlari, egalik isbotlari, davr sozlamalari va Sumeragi NPoS parametrlarini o‘z ichiga oladi. Davr almashishi belgilangan blok balandliklarida faol validatorlar to‘plamini almashtirishi mumkin, shu sababli operatorlar konsensus holatini ham, keyingi tarkibni shakllantiradigan ulush yoki nominatsiya holatini ham kuzatishi kerak.',
    'For guidance on choosing metadata, assets, NFTs, RWAs, or off-chain storage, see [Metadata and Ledger Storage Choices](/guide/configure/metadata-and-store-assets.md).':
      'Metama’lumotlar, aktivlar, NFTs, RWAs yoki zanjirdan tashqari saqlash usulini tanlash bo‘yicha [Metama’lumotlar va reyestrda saqlash variantlari](/uz/guide/configure/metadata-and-store-assets.md) bo‘limiga qarang.',
    'In this RAM-LFE design, BFV hides client input from public ledger data and from observers who only see the transaction or route payload. It does not mean the chain executes arbitrary encrypted programs by itself. The Torii resolver runtime still owns the BFV secret material, evaluates the configured hidden program, decrypts the permitted output, and attests the result. The ledger then verifies the attestation against the on-chain policy commitment and resolver public key or proof metadata.':
      'Ushbu RAM-LFE tuzilmasida BFV mijoz kirishini ochiq reyestr ma’lumotlaridan hamda faqat tranzaksiya yoki yo‘nalish foydali yukini ko‘radigan kuzatuvchilardan yashiradi. Bu zanjir istalgan shifrlangan dasturni o‘zi bajaradi degani emas. Torii yechuvchisining bajarish muhiti BFV maxfiy materialiga egalik qiladi, sozlangan yashirin dasturni baholaydi, ruxsat etilgan natijani shifrdan chiqaradi va natijani tasdiqlaydi. Keyin reyestr bu tasdiqni zanjirdagi siyosat majburiyati hamda yechuvchining ochiq kaliti yoki isbot metama’lumotlariga nisbatan tekshiradi.',
    '| Instruction | Algebra |': '| Ko‘rsatma | Algebra |',
    'For relinearization, let \\(s_k^2\\) be the ring product in \\(R_q\\). For each base-\\(B\\) digit \\(j\\), sample \\(a_j\\) uniformly and \\(e_j\\) from the small distribution, then publish:':
      'Qayta chiziqlilashtirish uchun \\(s_k^2\\) qiymati \\(R_q\\) dagi halqa ko‘paytmasi bo‘lsin. \\(B\\) asosidagi har bir \\(j\\) raqami uchun \\(a_j\\) ni bir tekis taqsimotdan, \\(e_j\\) ni esa kichik taqsimotdan tanlab, quyidagini e’lon qiling:',
    'Inrou is the hosted HTTP runtime used by Soracloud. An Iroha node with the embedded Soracloud runtime projects admitted Soracloud state into a local materialization plan, starts assigned hosted-service replicas as loopback services, and reports replica runtime state back into the authoritative model.':
      'Inrou — Soracloud foydalanadigan, joylashtirib beriladigan HTTP bajarish muhiti. Ichiga Soracloud bajarish muhiti o‘rnatilgan Iroha tuguni qabul qilingan Soracloud holatini mahalliy moddiylashtirish rejasiga aks ettiradi, tayinlangan xizmat nusxalarini faqat mahalliy interfeysda ishlaydigan xizmatlar sifatida ishga tushiradi va nusxalarning bajarilish holatini vakolatli modelga qaytarib yozadi.',
    "The protected fetch tuple is provider-specific. Obtain its provider ID and advertised base URL from Taira's provider catalog, and obtain the gateway key and stream token through that provider's admission flow. These values are not validator-storage settings. The checked-in Taira validators have embedded storage disabled, so do not substitute a validator pin URL for a provider URL.":
      'Himoyalangan olish korteji xizmat ko‘rsatuvchiga xosdir. Uning xizmat ko‘rsatuvchi identifikatori va e’lon qilingan asosiy URL manzilini Taira xizmat ko‘rsatuvchilar katalogidan, shlyuz kaliti va oqim tokenini esa shu xizmat ko‘rsatuvchining qabul jarayonidan oling. Bu qiymatlar validator saqlash sozlamalari emas. Repozitoriydagi Taira validatorlarida ichki saqlash o‘chirilgan, shuning uchun xizmat ko‘rsatuvchi URL manzili o‘rniga validatorning mahkamlash URL manzilini qo‘ymang.',
    'The UAID is the identity and capability anchor around that flow. In the data model, `UniversalAccountId` is hash-backed and displays as `uaid:<hash>`. Parsers accept either `uaid:<hash>` or the raw 64-hex digest. `Account` and `NewAccount` include optional `uaid` and `opaque_ids` fields. Runtime registration enforces a one-to-one UAID-to-account index, rejects duplicate or colliding opaque identifiers, and rejects opaque identifiers without a UAID. Whenever a UAID account binding changes, the runtime rebuilds Space Directory dataspace bindings for that UAID.':
      'UAID bu jarayonning identifikatsiya va imkoniyat tayanchidir. Ma’lumotlar modelida `UniversalAccountId` xeshga asoslanadi va `uaid:<hash>` ko‘rinishida chiqadi. Tahlilchilar `uaid:<hash>` shaklini ham, 64 ta o‘n oltilik belgidan iborat xom dayjestni ham qabul qiladi. `Account` va `NewAccount` tarkibida ixtiyoriy `uaid` va `opaque_ids` maydonlari bor. Bajarish muhiti ro‘yxatdan o‘tkazishda UAID bilan hisob o‘rtasidagi birga-bir indeksni ta’minlaydi, takrorlangan yoki to‘qnashuvchi yashirin identifikatorlarni hamda UAID bo‘lmagan yashirin identifikatorlarni rad etadi. UAID bilan hisob bog‘lanishi o‘zgarganida, bajarish muhiti shu UAID uchun Makon katalogining ma’lumotlar makoni bog‘lanishlarini qayta yaratadi.',
    'Space Directory manifests attach capabilities to a UAID. An `AssetPermissionManifest` names the UAID, dataspace, activation and optional expiry epoch, and ordered allow/deny entries scoped by dataspace, program, method, asset, and AMX role. Evaluation is deny-wins: the first matching deny rejects the request, otherwise the latest matching allow candidate is checked against any amount limit. Publishing, expiring, and revoking these manifests is guarded by `CanPublishSpaceDirectoryManifest`.':
      'Makon katalogi manifestlari imkoniyatlarni UAID identifikatoriga biriktiradi. `AssetPermissionManifest` UAID identifikatorini, ma’lumotlar makonini, faollashish davrini, ixtiyoriy tugash davrini hamda ma’lumotlar makoni, dastur, usul, aktiv va AMX roli doirasidagi tartiblangan ruxsat berish yoki rad etish yozuvlarini belgilaydi. Baholashda rad etish ustun keladi: birinchi mos rad yozuvi so‘rovni rad etadi; aks holda eng so‘nggi mos ruxsat nomzodi mavjud miqdor chegarasiga nisbatan tekshiriladi. Ushbu manifestlarni nashr qilish, muddatini tugatish va bekor qilish `CanPublishSpaceDirectoryManifest` bilan himoyalangan.',
    'UAID is not the ciphertext and not the FHE policy itself. It is the stable account capability anchor used to find the account, opaque identifier claims, and Space Directory bindings that authorize a service or dataspace flow. FHE schemas govern encrypted payload admission and execution separately through parameter sets, execution policies, ciphertext commitments, and decryption authority policies.':
      'UAID shifrlangan matn ham, FHE siyosatining o‘zi ham emas. U hisobni, yashirin identifikator da’volarini va xizmat yoki ma’lumotlar makoni jarayoniga ruxsat beradigan Makon katalogi bog‘lanishlarini topish uchun ishlatiladigan barqaror hisob imkoniyati tayanchidir. FHE sxemalari shifrlangan foydali yukni qabul qilish va bajarishni parametrlar to‘plami, bajarish siyosati, shifrlangan matn majburiyatlari va shifrni ochish vakolati siyosatlari orqali alohida boshqaradi.',
    '- [Canonical Taira validator configuration at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/configs/soranexus/taira/config.toml)':
      '- [Mahkamlangan manba kodi tahriridagi kanonik Taira validatori konfiguratsiyasi](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/configs/soranexus/taira/config.toml)',
    'The ledger cannot observe a conflicting offline handoff until note state returns through the online lifecycle. Wallet and operator policy should therefore enforce value limits, expiry, accepted issuers, durable local storage, and reconciliation windows.':
      'Banknota holati onlayn hayot sikliga qaytmaguncha reyestr ziddiyatli oflayn topshirishni kuzata olmaydi. Shu sababli hamyon va operator siyosati qiymat chegaralari, amal qilish muddati, qabul qilinadigan emitentlar, ishonchli mahalliy saqlash va solishtirish muddatlarini majburiy qo‘llashi kerak.',
    '- An I105 prefix error means the public key was encoded with the wrong profile. Re-run `iroha tools address convert --profile taira`.':
      '- I105 prefiksi xatosi ochiq kalit noto‘g‘ri profil bilan kodlanganini anglatadi. `iroha tools address convert --profile taira` buyrug‘ini qayta ishga tushiring.',
    'Capsule and per-auditor DEK-wrap authenticated data include the digest of the exact state-anchored committee and `authority_context_height`, as well as the network, route/incarnation, bundle, leg, policy, key epoch, and plaintext commitment. A wrapped key cannot be moved to a different roster or historical authority context.':
      'Kapsula va har bir auditor uchun DEK o‘ramining autentifikatsiyalangan ma’lumotlari aniq holatga biriktirilgan qo‘mita dayjesti va `authority_context_height` qiymatini, shuningdek tarmoq, yo‘nalish/inkarnatsiya, to‘plam, bosqich, siyosat, kalit davri va ochiq matn majburiyatini o‘z ichiga oladi. O‘ralgan kalitni boshqa tarkibga yoki vakolatning boshqa tarixiy kontekstiga ko‘chirib bo‘lmaydi.',
    "Use the privacy-governance-authorized `RotatePrivateSettlementPoolPolicyV1` instruction. It must name the exact current governance digest, keep the same route, pool, and asset-binding commitment, advance the governance revision by one, use a strictly newer key epoch and different policy/governance digests, and activate at the block that contains the rotation. The pool frontier, roots, nullifiers, outputs, replay sets, and finalized receipts are preserved. Do not include a receipt touching that same route/pool at the rotation's activation height; the instruction rejects that boundary.":
      'Maxfiylik boshqaruvi ruxsat bergan `RotatePrivateSettlementPoolPolicyV1` ko‘rsatmasidan foydalaning. U joriy boshqaruv dayjestini aynan ko‘rsatishi, ayni yo‘nalish, protokol guruhi va aktivni bog‘lash majburiyatini saqlashi, boshqaruv tahririni bittaga oshirishi, albatta yangiroq kalit davri hamda boshqa siyosat va boshqaruv dayjestlaridan foydalanishi va aylantirishni o‘z ichiga olgan blokda faollashishi kerak. Protokol guruhi chegarasi, ildizlar, nullifikatorlar, natijalar, takroriy ijro to‘plamlari va yakunlangan kvitansiyalar saqlanadi. Aylantirish faollashadigan blok balandligida ayni yo‘nalish yoki protokol guruhiga tegishli kvitansiyani kiritmang; ko‘rsatma bu chegarani rad etadi.',
    '- a Space Directory manifest or equivalent rollout evidence, when the dataspace exposes UAID capabilities':
      '- ma’lumotlar makoni UAID imkoniyatlarini taqdim etsa, Makon katalogi manifesti yoki ishga tushirilganini tasdiqlovchi teng kuchli dalil',
    '| Pick a dataspace            | Use public `universal` unless your app needs a governed lane | Use the same dataspace only after mainnet approval |':
      '| Ma’lumotlar makonini tanlash | Ilovangiz boshqariladigan yo‘lakka muhtoj bo‘lmasa, ochiq `universal` makonidan foydalaning | Shu ma’lumotlar makonidan faqat asosiy tarmoq tasdiqlaganidan keyin foydalaning |',
    '| Test writes                 | Use faucet-funded test XOR                                   | Do not use test tooling; writes spend real XOR     |':
      '| Sinov yozuvlari | Sinov uchun ajratilgan XOR mablag‘idan foydalaning | Sinov vositalarini ishlatmang; yozuvlar haqiqiy XOR sarflaydi |',
    '3. Exercise your app logic against Taira until failures are boring and observable.':
      '3. Nosozliklar odatiy va kuzatiladigan holga kelguncha ilova mantiqingizni Taira da sinab ko‘ring.',
    '- Use a currently vendor-supported, fully updated browser on a managed workstation.':
      '- Boshqariladigan ish stansiyasida ishlab chiqaruvchisi hali qo‘llab-quvvatlaydigan, to‘liq yangilangan brauzerdan foydalaning.',
    '- Confirm required cross-SDK scenarios with the [Compatibility Matrix](/reference/compatibility-matrix.md). Separately pin and test the exact CLI, peer binary, configuration, and network release used by the deployment.':
      '- Zarur SDK o‘rtasidagi ssenariylarni [Moslik matritsasi](/uz/reference/compatibility-matrix.md) yordamida tasdiqlang. Joylashtirishda ishlatiladigan aniq CLI, tugun ikkilik fayli, konfiguratsiya va tarmoq relizini alohida mahkamlang va sinang.',
    'See [Generating Cryptographic Keys](/guide/security/generating-cryptographic-keys.md) and [Storing Cryptographic Keys](/guide/security/storing-cryptographic-keys.md).':
      '[Kriptografik kalitlarni yaratish](/uz/guide/security/generating-cryptographic-keys.md) va [Kriptografik kalitlarni saqlash](/uz/guide/security/storing-cryptographic-keys.md) bo‘limlariga qarang.',
    'For BLS validator material, include a Proof-of-Possession:':
      'BLS asosidagi validator materiali uchun egalik isbotini ham kiriting:',
    'All validators must agree on the same genesis transaction, topology, trusted peer public keys, and validator PoPs. A single missing or mismatched peer key can prevent the network from starting or reaching consensus.':
      'Barcha validatorlar bir xil genezis tranzaksiyasi, topologiya, ishonchli tugunlarning ochiq kalitlari va validatorlarga tegishli PoPs bo‘yicha kelishishi kerak. Bitta tugun kalitining yo‘qligi yoki mos kelmasligi ham tarmoqning ishga tushishi yoxud konsensusga erishishiga to‘sqinlik qilishi mumkin.',
    'Fraud monitoring for an Iroha deployment is an operational control built around ledger events, queries, permissions, and application context. Iroha records what was submitted, accepted, rejected, and committed. Your monitoring system decides which patterns are suspicious for your business process and routes those cases to reviewers or automated response controls.':
      'Iroha joylashtirilishida firibgarlikni kuzatish — reyestr hodisalari, so‘rovlar, ruxsatlar va ilova kontekstiga tayangan operatsion nazoratdir. Iroha nimalar yuborilgani, qabul qilingani, rad etilgani va yakuniy ravishda yozilganini qayd etadi. Kuzatuv tizimingiz biznes jarayoningiz uchun qaysi andozalar shubhali ekanini belgilaydi va bunday holatlarni tekshiruvchilarga yoki avtomatik javob nazoratlariga yo‘naltiradi.',
    'See [Generating Cryptographic Keys](./generating-cryptographic-keys.md), [Storing Cryptographic Keys](./storing-cryptographic-keys.md), and [Operational Security](./operational-security.md).':
      '[Kriptografik kalitlarni yaratish](./generating-cryptographic-keys.md), [Kriptografik kalitlarni saqlash](./storing-cryptographic-keys.md) va [Operatsion xavfsizlik](./operational-security.md) bo‘limlariga qarang.',
    'See [Public-Key Cryptography](./public-key-cryptography.md) and [Storing Cryptographic Keys](./storing-cryptographic-keys.md).':
      '[Ochiq kalitli kriptografiya](./public-key-cryptography.md) va [Kriptografik kalitlarni saqlash](./storing-cryptographic-keys.md) bo‘limlariga qarang.',
    'For a private validator mesh, give every validator a stable VPN address or private DNS name. Configure peers so their advertised peer-to-peer addresses are reachable from the other validators over that network:':
      'Xususiy validatorlar tarmog‘ida har bir validatorga barqaror VPN manzili yoki xususiy DNS nomi bering. Tugunlarni shunday sozlangki, ular e’lon qilgan tugunlararo manzillarga shu tarmoqdagi boshqa validatorlar kira olsin:',
    'Treat this as a different mode. It does not create, join, or end a Kaigi record, does not provide transaction finality, and must not be presented as equivalent to the on-chain flow.':
      'Buni alohida rejim deb hisoblang. U Kaigi yozuvini yaratmaydi, unga qo‘shilmaydi yoki uni yakunlamaydi, tranzaksiyaning yakuniyligini ta’minlamaydi va zanjirdagi jarayonga teng deb taqdim etilmasligi kerak.',
    'Consensus validators must use BLS-Normal peer keys. For each validator, also provide a matching [`trusted_peers_pop`](#param-trusted-peers-pop) entry.':
      'Konsensus validatorlari BLS-Normal tugun kalitlaridan foydalanishi kerak. Har bir validator uchun mos [`trusted_peers_pop`](#param-trusted-peers-pop) yozuvini ham kiriting.',
    '- strict account fields use the canonical I105 account ID, while readable names are resolved through an active account-alias binding':
      '- qatʼiy hisob maydonlari kanonik I105 hisob identifikatoridan foydalanadi, o‘qiladigan nomlar esa faol hisob taxallusi bog‘lanishi orqali aniqlanadi',
    Part: 'Qism',
    Purpose: 'Maqsad',
    'Checksum coverage': 'Tekshiruv summasi qamrovi',
    'Network sentinel': 'Tarmoq sentineli',
    'Maps the text to one `u16` chain discriminant': 'Matnni bitta `u16` zanjir diskriminantiga moslaydi',
    'Not covered': 'Qamrab olinmagan',
    Payload: 'Foydali yuk',
    '`base-105` encoding of the canonical account-controller bytes':
      'Kanonik hisob boshqaruvchisi baytlarining `base-105` kodlanishi',
    Covered: 'Qamrab olingan',
    Checksum: 'Tekshiruv summasi',
    'Six `Bech32m`-style `5-bit` values rendered with the I105 alphabet':
      'I105 alifbosi orqali ifodalangan `Bech32m` uslubidagi oltita `5-bit` qiymat',
    'A decoder must enforce the expected discriminant.': 'Dekoder kutilgan diskriminantni majburiy tekshirishi kerak.',
    'The checksum cannot detect a sentinel substitution.':
      'Tekshiruv summasi sentinel almashtirilganini aniqlay olmaydi.',
    '### Network sentinels {#network-sentinels}': '### Tarmoq sentinellari {#network-sentinels}',
    'Network or context': 'Tarmoq yoki kontekst',
    'Chain discriminant': 'Zanjir diskriminanti',
    Hex: 'Hex',
    'Canonical sentinel': 'Kanonik sentinel',
    'The named values always use their named sentinel.':
      'Nomli qiymatlar uchun har doim ularning nomli sentineli ishlatiladi.',
    'Choosing an endpoint or chain ID does not implicitly choose the address profile.':
      'Endpoint yoki zanjir ID sini tanlash manzil profilini avtomatik ravishda tanlamaydi.',
    "The Taira form applies Taira's sentinel to the same payload:":
      'Taira shakli ayni shu foydali yukga Taira sentinelini qo‘llaydi:',
    'They verify the sentinel, alphabet, checksum, byte lengths, `CurveId`/key shape, and exact address-layer re-encoding.':
      'Ular sentinel, alifbo, tekshiruv summasi, bayt uzunliklari, `CurveId`/kalit tuzilishi va manzil qatlamining aynan qayta kodlanishini tekshiradi.',
    'They do not materialize an `AccountId`.': 'Ular `AccountId` obyektini hosil qilmaydi.',
    'They do not prove that the header class matches the controller.':
      'Ular sarlavha sinfi boshqaruvchiga mos kelishini isbotlamaydi.',
    'Use strict `AccountId` validation before authorization or persistence.':
      'Avtorizatsiya yoki doimiy saqlashdan oldin qat’iy `AccountId` tekshiruvidan foydalaning.',
    'The `base-105` body encodes a binary account payload, not a public-key string and not a Norito JSON object:':
      '`base-105` tanasi ochiq kalit satrini yoki Norito JSON obyektini emas, ikkilik hisob foydali yukini kodlaydi:',
    'Reserved `extension flag`': 'Zaxiralangan `extension flag`',
    'An `extension flag` of `1` is rejected.': '`extension flag` qiymati `1` bo‘lsa, u rad etiladi.',
    'The low-level decoder can preserve other version and normalization bit values and does not independently cross-check the class against the controller tag.':
      'Quyi darajadagi dekoder boshqa versiya va normallashtirish bit qiymatlarini saqlab qolishi mumkin, ammo sinfni boshqaruvchi tegi bilan mustaqil ravishda o‘zaro tekshirmaydi.',
    'Converting to an `AccountId` and comparing its canonical rendering proves current V1 canonicality.':
      '`AccountId` ga aylantirish va uning kanonik ko‘rinishini taqqoslash joriy V1 kanonikligini tasdiqlaydi.',
    '1 byte': '1 bayt',
    '2 bytes': '2 bayt',
    '`key_len` bytes': '`key_len` bayt',
    'Raw key length': 'Xom kalit uzunligi',
    'Raw key length, `big-endian`': 'Xom kalit uzunligi, `big-endian`',
    'Raw public-key payload': 'Ochiq kalitning xom foydali yuki',
    'Member approval weight': 'A’zoning tasdiqlash vazni',
    'A valid policy has at least one member, positive weights, no duplicate public keys, and a threshold from `1` through the sum of member weights.':
      'Yaroqli siyosatda kamida bitta a’zo, musbat vaznlar va takrorlanmagan ochiq kalitlar bo‘lishi, chegara qiymati esa `1` dan a’zolar vaznlari yig‘indisigacha bo‘lishi kerak.',
    "Canonical construction sorts members by the signing algorithm's stable name, a zero separator byte, and then the raw public-key bytes.":
      'Kanonik tuzilish a’zolarni avval imzolash algoritmining barqaror nomi, keyin nol ajratuvchi bayt va undan so‘ng xom ochiq kalit baytlari bo‘yicha saralaydi.',
    '## Strict AccountId validation and canonicality {#strict-accountid-validation-and-canonicality}':
      '## Qat’iy AccountId tekshiruvi va kanoniklik {#strict-accountid-validation-and-canonicality}',
    'After configuring the SDK with the expected chain discriminant, parse into an `AccountId` and compare the returned canonical rendering with the trimmed input.':
      "SDK'ni kutilgan zanjir diskriminanti bilan sozlagach, qiymatni `AccountId` sifatida tahlil qiling va qaytarilgan kanonik ko‘rinishni chetki bo‘shliqlari olib tashlangan kirish bilan taqqoslang.",
    'For an untrusted string, a conforming application should:':
      'Ishonchsiz satr uchun talablarga mos ilova quyidagilarni bajarishi kerak:',
    '1. Trim only permitted transport whitespace around the complete value.':
      '1. Faqat to‘liq qiymatning boshi va oxiridagi ruxsat etilgan transport bo‘shliqlarini olib tashlang.',
    '2. Read the sentinel and require the expected chain discriminant.':
      '2. Sentinelni o‘qing va kutilgan zanjir diskriminantini talab qiling.',
    '3. Map every remaining `Unicode` symbol through the exact 105-symbol alphabet.':
      '3. Qolgan har bir `Unicode` belgisini aniq 105 belgili alifbo bo‘yicha xaritalang.',
    '4. Split off the six checksum digits.': '4. Tekshiruv summasining olti raqamini ajrating.',
    '5. Convert the payload digits back to canonical bytes.':
      '5. Foydali yuk raqamlarini qayta kanonik baytlarga aylantiring.',
    '6. Verify the checksum over those canonical bytes.':
      '6. Shu kanonik baytlar bo‘yicha tekshiruv summasini tekshiring.',
    '7. Parse the header and controller, requiring:':
      '7. Sarlavha va boshqaruvchini tahlil qilib, quyidagilarni talab qiling:',
    '- exact field lengths': '- maydonlarning aniq uzunliklari',
    '- a supported `CurveId`': '- qo‘llab-quvvatlanadigan `CurveId`',
    '- a valid public key': '- yaroqli ochiq kalit',
    '- no trailing bytes': '- oxirida ortiqcha baytlar yo‘qligi',
    '- a valid multisig policy when applicable': '- tegishli holatda yaroqli multisig siyosati',
    '8. Construct an `AccountId`.': '8. `AccountId` yarating.',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. `AccountId` obyektini kutilgan diskriminant uchun kanonik tarzda ifodalang.',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. Chetki bo‘shliqlari olib tashlangan kirish bilan `byte-for-byte` tenglikni talab qiling.',
    '- an I105 literal with an appended `@domain` suffix': '- oxiriga `@domain` suffiksi qo‘shilgan I105 literali',
    '- Never substitute an account alias for an I105 ID.': '- Hech qachon I105 ID o‘rniga hisob aliasini ishlatmang.',
    '- Send the exact I105 UTF-8 string in JSON account fields.':
      '- JSON hisob maydonlarida aynan I105 UTF-8 satrini yuboring.',
    '- Use a collation that preserves letter case and character width.':
      '- Harf registri va belgi kengligini saqlaydigan kollatsiyadan foydalaning.',
    '- Keep the chain discriminant or named network profile with exported account data and backups.':
      '- Zanjir diskriminantini yoki nomlangan tarmoq profilini eksport qilingan hisob ma’lumotlari va zaxira nusxalari bilan birga saqlang.',
    '- Preserve every `kana` character exactly.': '- Har bir `kana` belgisini aynan saqlang.',
    'The body cannot contain both payload and checksum':
      'Tana foydali yuk va tekshiruv summasining ikkalasini ham sig‘dira olmaydi',
    'Deriving an I105 ID does not register or fund the account.':
      "I105 ID'ni hosil qilish hisobni ro‘yxatdan o‘tkazmaydi va uni moliyalashtirmaydi.",
    '- A regular expression is not an I105 validator.': '- Regex I105 validatori emas.',
    'The alphabet is `Unicode`-sensitive.': 'Alifbo `Unicode` kod nuqtalarini aynan farqlaydi.',
    'The exact sequence uses `compatibility-width` Japanese `kana` symbols plus the code points shown for `ヰ` and `ヱ`.':
      'Aniq ketma-ketlik `compatibility-width` formatidagi yapon `kana` belgilaridan hamda `ヰ` va `ヱ` uchun ko\u2018rsatilgan aynan shu kod nuqtalaridan foydalanadi.',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      'NFC yoki NFKC tarzida normallashtirishni, belgi kengligini o\u2018zgartirishni, harf registrini birxillashtirishni yoki belgilarni ko\u2018rinishi o\u2018xshash boshqa belgilar bilan almashtirishni qo\u2018llamang.',
    'ASCII `0`, `O`, `I`, and `l` are not alphabet symbols.': 'ASCII `0`, `O`, `I` va `l` alifbo belgilari emas.',
  },
  'zh-hans': {
    'Domain setup is a fee-paying write. Before trying it on Taira, save the faucet helper from [Get Testnet XOR on Taira](/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) as `taira_faucet_claim.py`, fund the signer through the public faucet, and attach fee metadata:':
      '配置域是一项需要付费的写入操作。在 Taira 上尝试之前，请将在[在 Taira 上获取测试网 XOR](/zh-hans/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)中提供的水龙头辅助脚本保存为 `taira_faucet_claim.py`，通过公共水龙头为签名者充值，并附加费用元数据：',
    'The authority submitting the transaction must have the permission required by the active runtime validator. For the default permission surface, see [Permission Tokens](/reference/permissions.md).':
      '提交交易的授权主体必须具备当前运行时验证器要求的权限。有关默认权限接口，请参阅[权限令牌](/zh-hans/reference/permissions.md)。',
    'Multiplication is the expensive operation. A product of two two-component ciphertexts naturally creates a three-component ciphertext that decrypts with \\(1\\), \\(s_k\\), and \\(s_k^2\\). Relinearization uses a published evaluation key to fold the \\(s_k^2\\) term back into a normal two-component ciphertext. That keeps later additions and multiplications using the same ciphertext shape.':
      '乘法是开销较大的操作。两个双分量密文相乘后会自然产生一个三分量密文，该密文使用 \\(1\\)、\\(s_k\\) 和 \\(s_k^2\\) 解密。重线性化使用已发布的求值密钥，将 \\(s_k^2\\) 项折回普通的双分量密文，使后续加法和乘法可以继续使用相同的密文结构。',
    'For `bfv-affine-sha3-256-v1`, the runtime first derives BFV key material from \\(s\\) and \\(A\\). The derived public parameters must exactly match the public parameters committed on-chain.':
      '对于 `bfv-affine-sha3-256-v1`，运行时首先根据 \\(s\\) 和 \\(A\\) 派生 BFV 密钥材料。派生出的公共参数必须与链上承诺的公共参数完全一致。',
    'Registering a policy on-chain is not enough by itself. A target node must also expose the route family and have matching runtime material for the programs it is expected to execute.':
      '仅在链上注册策略并不足够。目标节点还必须开放相应的路由族，并为预期执行的程序配备匹配的运行时材料。',
    '- Registration, minting, or namespace management can still be rejected after this canary succeeds. Those operations require separate runtime permissions; rehearse them on the generated local network when Taira access has not been granted.':
      '- 即使此金丝雀测试成功，注册、铸造或命名空间管理操作仍可能被拒绝。这些操作需要各自的运行时权限；如果尚未获得 Taira 访问权限，请在生成的本地网络上演练。',
    'Use a second client configuration for the delegate when proving the write:':
      '验证写入操作时，请为被授权者使用另一份客户端配置：',
    "Fee sponsorship lets users submit private-dataspace transactions without holding XOR. The user still signs the transaction. The transaction metadata points at a sponsor account, and the runtime debits the sponsor's XOR balance for the network fee.":
      '费用赞助允许用户在不持有 XOR 的情况下提交私有数据空间交易。用户仍需签署交易。交易元数据指向赞助者账户，运行时从该账户的 XOR 余额中扣除网络费用。',
    'The canary submits a signed ping, waits for confirmation, and writes the runtime signer config when `--write-config` is provided. Taira is a public testnet, so queue saturation can make the signed ping fail even when the faucet itself works. If `taira doctor` reports a saturated queue or the canary returns `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, wait and retry before treating it as a client configuration error.':
      '金丝雀测试会提交已签名的 ping、等待确认，并在提供 `--write-config` 时写入运行时签名者配置。Taira 是公共测试网，因此即使水龙头本身正常，队列饱和也可能导致已签名的 ping 失败。如果 `taira doctor` 报告队列饱和，或金丝雀测试返回 `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`，请先等待并重试，再将其视为客户端配置错误。',
    'The faucet is a public testnet service. If the puzzle or claim endpoint returns `502`, a timeout, or another gateway-level error, wait and retry before changing your keys or client config.':
      '水龙头是公共测试网服务。如果谜题或领取端点返回 `502`、超时或其他网关级错误，请先等待并重试，再更改密钥或客户端配置。',
    '- governance, runtime upgrade, Sumeragi, node-admin, SoraFS, UAID, and Kaigi endpoint wrappers where the node exposes those features':
      '- 当节点提供相应功能时，用于治理、运行时升级、Sumeragi、节点管理、SoraFS、UAID 和 Kaigi 端点的封装器',
    'Module with the incoming request handling logic for the [peer](#peer). It is used to receive, accept and route incoming instructions, and HTTP queries, as well as run-time configuration updates.':
      '包含[对等节点](#peer)传入请求处理逻辑的模块。它用于接收、接受和路由传入的指令及 HTTP 查询，也用于处理运行时配置更新。',
    'Consensus validators must use BLS-Normal peer keys. For each validator, also provide a matching [`trusted_peers_pop`](#param-trusted-peers-pop) entry.':
      '共识验证器必须使用 BLS-Normal 对等节点密钥。还要为每个验证器提供匹配的 [`trusted_peers_pop`](#param-trusted-peers-pop) 条目。',
    '- the submitting transaction authority unless the application uses a private entrypoint or relayer pattern':
      '- 提交交易的授权主体，除非应用程序使用私有入口点或中继器模式',
    'Client configuration stores the signing authority separately from peer configuration:':
      '客户端配置将签名授权主体与网络对等节点配置分开存储：',
    'The runtime configuration builds three pieces of lane state:': '软件执行环境配置构建三部分执行通道状态：',
    'Either original party can read its message record and generated outbox documents. The audit endpoint returns only records in which the authenticated participant is the originator or counterparty. A separately configured audit administrator receives a global read-only audit view and cannot submit or change messages. Unknown participants and unrelated message identifiers are not disclosed.':
      '原始交易的任一方都可以读取其消息记录和生成的发件箱文档。审计端点只返回已认证参与者为发起方或交易对手方的记录。单独配置的审计管理员可以获得全局只读审计视图，但不能提交或更改消息。系统不会泄露未知参与者或无关消息标识符是否存在。',
    '- Store and compare the canonical UTF-8 string exactly.': '- 精确存储并比较规范 UTF-8 字符串。',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- 保留字母大小写，且不要应用 `Unicode` 规范化。',
    '- A regular expression is not an I105 validator.': '- 正则表达式不是 I105 验证器。',
    Part: '部分',
    Purpose: '用途',
    'Checksum coverage': '校验和覆盖范围',
    'Network sentinel': '网络 sentinel',
    'Maps the text to one `u16` chain discriminant': '将文本映射到一个 `u16` 链区分符',
    'Not covered': '未覆盖',
    Payload: '有效载荷',
    '`base-105` encoding of the canonical account-controller bytes': '规范账户控制器字节的 `base-105` 编码',
    Covered: '已覆盖',
    Checksum: '校验和',
    'Six `Bech32m`-style `5-bit` values rendered with the I105 alphabet':
      '通过 I105 字母表呈现的六个 `Bech32m` 风格 `5-bit` 值',
    'The payload and checksum identify the account controller.': '有效载荷和校验和标识账户控制器。',
    'The sentinel selects the network context.': 'Sentinel 选择网络上下文。',
    'A decoder must enforce the expected discriminant.': '解码器必须确保链区分符符合预期。',
    'The checksum cannot detect a sentinel substitution.': '校验和无法检测 sentinel 替换。',
    'Network or context': '网络或上下文',
    'Chain discriminant': '链区分符',
    Hex: '十六进制',
    'Canonical sentinel': '规范 sentinel',
    'They verify the sentinel, alphabet, checksum, byte lengths, `CurveId`/key shape, and exact address-layer re-encoding.':
      '它们验证 sentinel、字母表、校验和、字节长度、`CurveId`/密钥结构以及地址层的精确重新编码。',
    'They do not prove that the header class matches the controller.': '它们无法证明标头类别与控制器匹配。',
    'Use strict `AccountId` validation before authorization or persistence.':
      '在授权或持久化之前使用严格的 `AccountId` 验证。',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      '不要应用 NFC、NFKC、宽度转换、大小写折叠或相似字符替换。',
    Bits: '位',
    Width: '宽度',
    'Current encoder output': '当前编码器输出',
    Meaning: '含义',
    'Converting to an `AccountId` and comparing its canonical rendering proves current V1 canonicality.':
      '转换为 `AccountId` 并比较其规范呈现可证明当前 V1 的规范性。',
    Field: '字段',
    'Value or meaning': '值或含义',
    Variable: '可变',
    'Repeated member records': '重复的成员记录',
    'A valid policy has at least one member, positive weights, no duplicate public keys, and a threshold from `1` through the sum of member weights.':
      '有效策略至少包含一个成员，各权重为正，没有重复公钥，且阈值介于 `1` 与成员权重总和之间。',
    '## Strict AccountId validation and canonicality {#strict-accountid-validation-and-canonicality}':
      '## 严格的 AccountId 验证和规范性 {#strict-accountid-validation-and-canonicality}',
    'After configuring the SDK with the expected chain discriminant, parse into an `AccountId` and compare the returned canonical rendering with the trimmed input.':
      '在使用预期链区分符配置 SDK 后，将输入解析为 `AccountId`，并将返回的规范呈现与去除首尾空白后的输入进行比较。',
    '1. Trim only permitted transport whitespace around the complete value.': '1. 仅删除整个值周围允许存在的传输空白。',
    '2. Read the sentinel and require the expected chain discriminant.': '2. 读取 sentinel，并要求链区分符符合预期。',
    '3. Map every remaining `Unicode` symbol through the exact 105-symbol alphabet.':
      '3. 按准确的 105 符号字母表映射其余每个 `Unicode` 符号。',
    '4. Split off the six checksum digits.': '4. 分离出六个校验和数字。',
    '5. Convert the payload digits back to canonical bytes.': '5. 将有效载荷数字转换回规范字节。',
    '6. Verify the checksum over those canonical bytes.': '6. 验证这些规范字节的校验和。',
    '7. Parse the header and controller, requiring:': '7. 解析标头和控制器，并要求：',
    '- exact field lengths': '- 精确的字段长度',
    '- a supported `CurveId`': '- 受支持的 `CurveId`',
    '- a valid public key': '- 有效的公钥',
    '- no trailing bytes': '- 没有尾随字节',
    '- a valid multisig policy when applicable': '- 适用时有效的多重签名策略',
    '8. Construct an `AccountId`.': '8. 构建 `AccountId`。',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. 针对预期的链区分符以规范形式呈现 `AccountId`。',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. 要求与去除首尾空白后的输入 `byte-for-byte` 相等。',
    'A successful checksum or low-level `AccountAddress` parse is not a substitute for this check.':
      '校验和成功或低层级 `AccountAddress` 解析不能替代此检查。',
    'Domain, dataspace, alias, UAID, and account metadata bytes are not present.':
      '其中不包含域、数据空间、别名、UAID 或账户元数据字节。',
    '- a string with changed uppercase or lowercase letters, character widths, `kana`, payload, or checksum':
      '- 大写或小写字母、字符宽度、`kana`、有效载荷或校验和被更改的字符串',
    'Resolve aliases at the application boundary and retain the returned canonical I105 ID for authorization, signing, permissions, and audit records.':
      '在应用程序边界解析别名，并保留返回的规范 I105 ID，用于授权、签名、权限和审计记录。',
    '- Never substitute an account alias for an I105 ID.': '- 切勿用账户别名替代 I105 ID。',
    '- Store the canonical string returned by the codec with `byte-preserving` comparison semantics.':
      '- 使用 `byte-preserving` 比较语义存储编解码器返回的规范字符串。',
    '- Use a collation that preserves letter case and character width.': '- 使用保留字母大小写和字符宽度的排序规则。',
    '- Use the stored canonical ID instead of reconstructing it from an alias.':
      '- 使用存储的规范 ID，而不是根据别名重新构建它。',
    '`AccountId` display and JSON use canonical I105.': '`AccountId` 的显示和 JSON 表示使用规范 I105。',
    'The lower-level `AccountAddress` display/JSON representation uses canonical hex for internal and debugging contexts.':
      '较低层级的 `AccountAddress` 显示/JSON 表示在内部和调试上下文中使用规范十六进制格式。',
    'Account report, statement, and notification validation': '账户报告、对账单和通知的验证',
    'Apply deterministic heuristics to decide whether compression is worthwhile.':
      '采用确定性启发式方法判断是否值得压缩。',
    'Carry manifest announcements, feedback, key updates, and capability negotiation.':
      '承载清单通告、反馈消息、密钥更新和能力协商。',
    'List committed transactions.': '列出已提交的链上交易。',
    'Return the domain endorsement policy.': '返回链上域的背书政策。',
    'Return on-chain executor configuration parameters.': '返回链上执行器的配置参数。',
    'Supported with requirements': '有条件支持',
  },
  'zh-hant': {
    'Domain setup is a fee-paying write. Before trying it on Taira, save the faucet helper from [Get Testnet XOR on Taira](/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) as `taira_faucet_claim.py`, fund the signer through the public faucet, and attach fee metadata:':
      '設定網域是一項需要付費的寫入操作。在 Taira 上嘗試之前，請將[在 Taira 上取得測試網 XOR](/zh-hant/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)中提供的水龍頭輔助指令碼儲存為 `taira_faucet_claim.py`，透過公共水龍頭為簽署者儲值，並附加費用中繼資料：',
    'The authority submitting the transaction must have the permission required by the active runtime validator. For the default permission surface, see [Permission Tokens](/reference/permissions.md).':
      '提交交易的授權主體必須具備目前執行階段驗證器要求的權限。如需預設權限介面，請參閱[權限權杖](/zh-hant/reference/permissions.md)。',
    'Multiplication is the expensive operation. A product of two two-component ciphertexts naturally creates a three-component ciphertext that decrypts with \\(1\\), \\(s_k\\), and \\(s_k^2\\). Relinearization uses a published evaluation key to fold the \\(s_k^2\\) term back into a normal two-component ciphertext. That keeps later additions and multiplications using the same ciphertext shape.':
      '乘法是開銷較大的操作。兩個雙分量密文相乘後會自然產生一個三分量密文，該密文使用 \\(1\\)、\\(s_k\\) 和 \\(s_k^2\\) 解密。重線性化使用已發布的求值金鑰，將 \\(s_k^2\\) 項折回一般的雙分量密文，使後續加法和乘法可以繼續使用相同的密文結構。',
    'For `bfv-affine-sha3-256-v1`, the runtime first derives BFV key material from \\(s\\) and \\(A\\). The derived public parameters must exactly match the public parameters committed on-chain.':
      '對於 `bfv-affine-sha3-256-v1`，執行階段會先根據 \\(s\\) 和 \\(A\\) 衍生 BFV 金鑰材料。衍生出的公開參數必須與鏈上承諾的公開參數完全一致。',
    'Registering a policy on-chain is not enough by itself. A target node must also expose the route family and have matching runtime material for the programs it is expected to execute.':
      '僅在鏈上註冊政策並不足夠。目標節點還必須開放相應的路由族，並為預期執行的程式配備相符的執行階段材料。',
    '- Registration, minting, or namespace management can still be rejected after this canary succeeds. Those operations require separate runtime permissions; rehearse them on the generated local network when Taira access has not been granted.':
      '- 即使此金絲雀測試成功，註冊、鑄造或命名空間管理操作仍可能被拒絕。這些操作需要各自的執行階段權限；如果尚未取得 Taira 存取權，請在產生的本機網路上演練。',
    'Use a second client configuration for the delegate when proving the write:':
      '驗證寫入操作時，請為被授權者使用另一份用戶端設定：',
    "Fee sponsorship lets users submit private-dataspace transactions without holding XOR. The user still signs the transaction. The transaction metadata points at a sponsor account, and the runtime debits the sponsor's XOR balance for the network fee.":
      '費用贊助允許使用者在不持有 XOR 的情況下提交私有資料空間交易。使用者仍需簽署交易。交易中繼資料指向贊助者帳戶，執行階段會從該帳戶的 XOR 餘額扣除網路費用。',
    'The canary submits a signed ping, waits for confirmation, and writes the runtime signer config when `--write-config` is provided. Taira is a public testnet, so queue saturation can make the signed ping fail even when the faucet itself works. If `taira doctor` reports a saturated queue or the canary returns `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, wait and retry before treating it as a client configuration error.':
      '金絲雀測試會提交已簽署的 ping、等待確認，並在提供 `--write-config` 時寫入執行階段簽署者設定。Taira 是公共測試網，因此即使水龍頭本身正常，佇列飽和也可能導致已簽署的 ping 失敗。如果 `taira doctor` 回報佇列飽和，或金絲雀測試傳回 `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`，請先等待並重試，再將其視為用戶端設定錯誤。',
    'The faucet is a public testnet service. If the puzzle or claim endpoint returns `502`, a timeout, or another gateway-level error, wait and retry before changing your keys or client config.':
      '水龍頭是公共測試網服務。如果謎題或領取端點傳回 `502`、逾時或其他閘道層級錯誤，請先等待並重試，再變更金鑰或用戶端設定。',
    '- governance, runtime upgrade, Sumeragi, node-admin, SoraFS, UAID, and Kaigi endpoint wrappers where the node exposes those features':
      '- 當節點提供相應功能時，用於治理、執行階段升級、Sumeragi、節點管理、SoraFS、UAID 和 Kaigi 端點的封裝器',
    'Module with the incoming request handling logic for the [peer](#peer). It is used to receive, accept and route incoming instructions, and HTTP queries, as well as run-time configuration updates.':
      '包含[對等節點](#peer)傳入要求處理邏輯的模組。它用於接收、接受和路由傳入的指令及 HTTP 查詢，也用於處理執行階段設定更新。',
    'Consensus validators must use BLS-Normal peer keys. For each validator, also provide a matching [`trusted_peers_pop`](#param-trusted-peers-pop) entry.':
      '共識驗證器必須使用 BLS-Normal 對等節點金鑰。還要為每個驗證器提供相符的 [`trusted_peers_pop`](#param-trusted-peers-pop) 項目。',
    '- the submitting transaction authority unless the application uses a private entrypoint or relayer pattern':
      '- 提交交易的授權主體，除非應用程式使用私有進入點或中繼器模式',
    'Client configuration stores the signing authority separately from peer configuration:':
      '用戶端設定將簽署授權主體與網路對等節點設定分開儲存：',
    'The runtime configuration builds three pieces of lane state:': '軟體執行環境設定會建構三部分的執行通道狀態：',
    'Either original party can read its message record and generated outbox documents. The audit endpoint returns only records in which the authenticated participant is the originator or counterparty. A separately configured audit administrator receives a global read-only audit view and cannot submit or change messages. Unknown participants and unrelated message identifiers are not disclosed.':
      '原始交易的任一方都可以讀取其訊息記錄及產生的寄件匣文件。稽核端點只會傳回已驗證參與者為發起方或交易對手方的記錄。另行設定的稽核管理員可取得全域唯讀稽核檢視，但不能提交或變更訊息。系統不會揭露未知參與者或不相關訊息識別碼是否存在。',
    '- Store and compare the canonical UTF-8 string exactly.': '- 精確儲存並比較規範 UTF-8 字串。',
    '- Preserve letter case and do not apply `Unicode` normalization.':
      '- 保留字母大小寫，且不要套用 `Unicode` 正規化。',
    '- A regular expression is not an I105 validator.': '- 正規表示式不是 I105 驗證器。',
    Part: '部分',
    Purpose: '用途',
    'Checksum coverage': '校驗和涵蓋範圍',
    'Network sentinel': '網路 sentinel',
    'Maps the text to one `u16` chain discriminant': '將文字對映到一個 `u16` 鏈區分符',
    'Not covered': '未涵蓋',
    Payload: '有效載荷',
    '`base-105` encoding of the canonical account-controller bytes': '規範帳戶控制器位元組的 `base-105` 編碼',
    Covered: '已涵蓋',
    Checksum: '校驗和',
    'Six `Bech32m`-style `5-bit` values rendered with the I105 alphabet':
      '透過 I105 字母表呈現的六個 `Bech32m` 風格 `5-bit` 值',
    'The payload and checksum identify the account controller.': '有效載荷和校驗和識別帳戶控制器。',
    'The sentinel selects the network context.': 'Sentinel 選擇網路上下文。',
    'A decoder must enforce the expected discriminant.': '解碼器必須確保鏈區分符符合預期。',
    'The checksum cannot detect a sentinel substitution.': '校驗和無法偵測 sentinel 替換。',
    'Network or context': '網路或上下文',
    'Chain discriminant': '鏈區分符',
    Hex: '十六進位',
    'Canonical sentinel': '規範 sentinel',
    'They verify the sentinel, alphabet, checksum, byte lengths, `CurveId`/key shape, and exact address-layer re-encoding.':
      '它們驗證 sentinel、字母表、校驗和、位元組長度、`CurveId`/金鑰結構以及地址層的精確重新編碼。',
    'They do not prove that the header class matches the controller.': '它們無法證明標頭類別與控制器相符。',
    'Use strict `AccountId` validation before authorization or persistence.':
      '在授權或持久化之前使用嚴格的 `AccountId` 驗證。',
    'Do not apply NFC, NFKC, width conversion, case folding, or look-alike substitution.':
      '不要套用 NFC、NFKC、寬度轉換、大小寫摺疊或相似字元替換。',
    Bits: '位元',
    Width: '寬度',
    'Current encoder output': '目前編碼器輸出',
    Meaning: '含義',
    'Converting to an `AccountId` and comparing its canonical rendering proves current V1 canonicality.':
      '轉換為 `AccountId` 並比較其規範呈現可證明目前 V1 的規範性。',
    Field: '欄位',
    'Value or meaning': '值或含義',
    Variable: '可變',
    'Repeated member records': '重複的成員記錄',
    'A valid policy has at least one member, positive weights, no duplicate public keys, and a threshold from `1` through the sum of member weights.':
      '有效策略至少包含一個成員，各權重為正，沒有重複公鑰，且閾值介於 `1` 與成員權重總和之間。',
    '## Strict AccountId validation and canonicality {#strict-accountid-validation-and-canonicality}':
      '## 嚴格的 AccountId 驗證和規範性 {#strict-accountid-validation-and-canonicality}',
    'After configuring the SDK with the expected chain discriminant, parse into an `AccountId` and compare the returned canonical rendering with the trimmed input.':
      '在使用預期鏈區分符設定 SDK 後，將輸入解析為 `AccountId`，並將傳回的規範呈現與去除首尾空白後的輸入進行比較。',
    '1. Trim only permitted transport whitespace around the complete value.': '1. 僅刪除整個值周圍允許存在的傳輸空白。',
    '2. Read the sentinel and require the expected chain discriminant.': '2. 讀取 sentinel，並要求鏈區分符符合預期。',
    '3. Map every remaining `Unicode` symbol through the exact 105-symbol alphabet.':
      '3. 按準確的 105 符號字母表對映其餘每個 `Unicode` 符號。',
    '4. Split off the six checksum digits.': '4. 分離出六個校驗和數字。',
    '5. Convert the payload digits back to canonical bytes.': '5. 將有效載荷數字轉換回規範位元組。',
    '6. Verify the checksum over those canonical bytes.': '6. 驗證這些規範位元組的校驗和。',
    '7. Parse the header and controller, requiring:': '7. 解析標頭和控制器，並要求：',
    '- exact field lengths': '- 精確的欄位長度',
    '- a supported `CurveId`': '- 受支援的 `CurveId`',
    '- a valid public key': '- 有效的公鑰',
    '- no trailing bytes': '- 沒有尾隨位元組',
    '- a valid multisig policy when applicable': '- 適用時有效的多重簽名策略',
    '8. Construct an `AccountId`.': '8. 建構 `AccountId`。',
    '9. Render the `AccountId` canonically for the expected discriminant.':
      '9. 針對預期的鏈區分符以規範形式呈現 `AccountId`。',
    '10. Require `byte-for-byte` equality with the trimmed input.':
      '10. 要求與去除首尾空白後的輸入 `byte-for-byte` 相等。',
    'A successful checksum or low-level `AccountAddress` parse is not a substitute for this check.':
      '校驗和成功或低層級 `AccountAddress` 解析不能替代此檢查。',
    'Domain, dataspace, alias, UAID, and account metadata bytes are not present.':
      '其中不包含網域、資料空間、別名、UAID 或帳戶中繼資料位元組。',
    '- a string with changed uppercase or lowercase letters, character widths, `kana`, payload, or checksum':
      '- 大寫或小寫字母、字元寬度、`kana`、有效載荷或校驗和被更改的字串',
    'Resolve aliases at the application boundary and retain the returned canonical I105 ID for authorization, signing, permissions, and audit records.':
      '在應用程式邊界解析別名，並保留傳回的規範 I105 ID，用於授權、簽署、權限和稽核記錄。',
    '- Never substitute an account alias for an I105 ID.': '- 切勿以帳戶別名替代 I105 ID。',
    '- Store the canonical string returned by the codec with `byte-preserving` comparison semantics.':
      '- 使用 `byte-preserving` 比較語義儲存編解碼器傳回的規範字串。',
    '- Use a collation that preserves letter case and character width.': '- 使用保留字母大小寫和字元寬度的定序規則。',
    '- Use the stored canonical ID instead of reconstructing it from an alias.':
      '- 使用儲存的規範 ID，而不是根據別名重新建構它。',
    '`AccountId` display and JSON use canonical I105.': '`AccountId` 的顯示和 JSON 表示使用規範 I105。',
    'The lower-level `AccountAddress` display/JSON representation uses canonical hex for internal and debugging contexts.':
      '較低層級的 `AccountAddress` 顯示/JSON 表示在內部和偵錯情境中使用規範十六進位格式。',
    'Account report, statement, and notification validation': '帳戶報告、對帳單與通知的驗證',
    'Apply deterministic heuristics to decide whether compression is worthwhile.':
      '採用確定性啟發式方法判斷是否值得壓縮。',
    'Carry manifest announcements, feedback, key updates, and capability negotiation.':
      '承載清單通告、回饋訊息、金鑰更新與能力協商。',
    'List committed transactions.': '列出已提交的鏈上交易。',
    'Return the domain endorsement policy.': '返回鏈上網域的背書政策。',
    'Return on-chain executor configuration parameters.': '返回鏈上執行器的設定參數。',
    'Supported with requirements': '有條件支援',
  },
}

/**
 * Deterministic repairs for rare NLLB subword leakage. The model can splice a
 * word from a neighboring training language into otherwise localized prose.
 * Keep these replacements narrowly scoped to exact malformed output strings.
 */
const MACHINE_TRANSLATION_ARTIFACT_REPLACEMENTS: Readonly<Record<string, ReadonlyArray<readonly [string, string]>>> = {
  ar: [['رؤية الدولة العالمية', 'عرض حالة العالم']],
  ja: [
    ['プロトコル аргумент', 'プロトコル上の根拠'],
    ['スナップшот', 'スナップショット'],
    ['ペイルলোড', 'ペイロード'],
    ['プロジェクต์', 'プロジェクト'],
    ['バランس', 'バランス'],
    ['लेन', 'レーン'],
  ],
  he: [
    ['पारदर्शी ילידי AMX DvP/PvP', 'AMX DvP/PvP שקוף מובנה'],
    ['פגם נייר-प्राימירי', 'תקלה בתרחיש הראשי של המאמר'],
    ['הסכומים المسجلים', 'הסכומים הרשומים'],
    ['הוראות המخصصות', 'ההוראות הייעודיות'],
    ['הוספת ומضاعفة', 'חיבור וכפל'],
    ['ומضاعفات', 'ומכפלות'],
    ['החזקة', 'ההחזקה'],
    ['סטרימיνγκ', 'סטרימינג'],
    ['בדיאгностиקה', 'באבחון'],
    ['מفاتيح לשימוש ברשת', 'מפתחות לפריסת רשת'],
    ['שהתطبيق', 'שהיישום'],
    ['מצב备份', 'מצב גיבוי'],
    ['המجموعת הפילטר', 'קבוצת המסננים'],
    ['מעודд', 'מאמת'],
  ],
  my: [
    ['ပုဂ္ဂလိক', 'ပုဂ္ဂလိက'],
    ['বিশ্লেষণ', 'ခွဲခြမ်းစိတ်ဖြာခြင်း'],
    ['लेन', 'လမ်းကြောင်း'],
  ],
  ka: [
    ['аноним', 'ანონიმ'],
    ['лента', 'ლენტი'],
  ],
  hy: [
    ['կոնֆիგուրացիայից', 'կոնֆիգուրացիայից'],
    ['չрегистрирующих', 'չգրանցելու'],
    ['эмитենտները', 'թողարկողները'],
    ['Մատेरियलն', 'Նյութը'],
    ['կատալոգი', 'կատալոգը'],
    ['մডել', 'մոդել'],
    ['բլոկչেইնի', 'բլոկչեյնի'],
    ['օբյект', 'օբյեկտ'],
    ['хэ', 'հե'],
    ['خام', 'հում'],
    ['ডেল', 'ոդել'],
    ['ოგი', 'ոգը'],
    ['ექტ', 'եկտ'],
    ['эмитен', 'էմիտեն'],
    ['ორის', 'որի'],
    ['ატ', 'ատ'],
  ],
  az: [
    ['şəbәкəsi', 'şəbəkəsi'],
    ['datasaлlarda', 'məlumat məkanlarında'],
  ],
  ba: [
    ['реसेट', 'reset'],
    ['каस्टम', 'кастом'],
    ['резульവർ', 'резульвер'],
  ],
  am: [
    ['ስፖንസർ', 'ስፖንሰር'],
    ['ключ', 'ቁልፍ'],
    ['የቀድሞample', 'የቀደመው ምሳሌ'],
    ['ለምሳሌample', 'ለምሳሌ'],
    ['ምሳሌample', 'ምሳሌ'],
    ['ይመልከቱample', 'ይመልከቱ'],
    ['አስወግድample', 'ምሳሌውን ያስወግዱ'],
    ['ይችላልample', 'ይችላል'],
    ['ይችላልfile', 'ይችላል'],
    ['ፕሮfile', 'መገለጫ'],
    ['ነውfile', 'ነው'],
    ['አይመርጥምfile', 'አይመርጥም'],
    ['አይጽፍምfile', 'አይጽፍም'],
    ['ያጋልጣልfile', 'ያጋልጣል'],
    ['ኦፕሬተር ይጠቀሙfile', 'የኦፕሬተር መገለጫ ይጠቀሙ'],
    ['መካከልfile', 'መገለጫዎች መካከል'],
    ['ኤስtagሠ', 'ያረጀ'],
    ['ያረጋግጡtagሠ', 'ያረጋግጡ'],
  ],
  dz: [
    ['ネットワーク', 'དྲ་རྒྱ་'],
    ['ལოგიཀ', 'གཏན་ཚིག'],
    ['ཌོ་मेन', 'ཌོ་མེན'],
    ['ཌོ་เมน', 'ཌོ་མེན'],
    ['ཌོ་เม', 'ཌོ་མེ'],
    ['མոդել', 'དཔེ་'],
    ['မပါဘူး။', 'མེད།'],
    ['ပါဘူး။', 'མེད།'],
    ['သို့မဟုတ်', 'ཡང་ན་'],
    ['သီးခြား', 'སོ་སོ་'],
    ['အင်တာနက်', 'ཨིན་ཊར་ནེཊ་'],
    ['ပုံမှန်', 'སྤྱིར་བཏང་'],
    ['တစ်ခုကို', 'གཅིག་'],
    ['တစ်ခု', 'གཅིག་'],
    ['နောက်', 'ཤུལ་ལས་'],
    ['ပိုမို', 'ཧེང་བཀལ་'],
    ['အစား', 'ཚབ་ལུ་'],
    ['အောက်', 'འོག་ལུ་'],
    ['ပါ။', 'དགོ།'],
    ['कर्ता', 'མི་'],
    ['सत्र', 'ཚོགས་ཐེངས་'],
    ['сәйкес', 'མཐུན་པ་'],
    ['блок', 'སྡེབ་ཚན་'],
    ['ነት', 'གནས་སྟངས་'],
    ['ობიექტი', 'དངོས་པོ་'],
    ['კატალოგი', 'ཐོ་གཞུང་'],
    ['保持', 'ཉར་ཚགས་'],
    ['匹配', 'མཐུན་པ་'],
    ['引用', 'གཞི་བསྟུན་'],
    ['要素', 'ཆ་ཤས་'],
    ['فعال', 'ཤུགས་ལྡན་'],
  ],
  uz: [["ko'rsatмалар", "ko'rsatmalar"]],
  mn: [
    ['снэп-шоу', 'снэпшот'],
    ['پ', 'п'],
  ],
  'zh-hans': [
    ['加нони化', '规范化'],
    ['可нони化', '规范化'],
  ],
  'zh-hant': [
    ['加нони化', '正規化'],
    ['可нони化', '正規化'],
  ],
}

function protectMachineTranslationLiterals(content: string): { masked: string; restore(value: string): string } {
  const values = new Map<string, string>()
  let sequence = 0
  const protect = (value: string): string => {
    const marker = `\uE000${sequence}\uE001`
    sequence += 1
    values.set(marker, value)
    return marker
  }

  let masked = content.replace(/^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?^ {0,3}\1[^\n]*(?:\n|$)/gmu, protect)
  masked = masked.replace(/(`+)([\s\S]*?)\1/gu, protect)
  masked = masked.replace(/\$\$[\s\S]*?\$\$/gu, protect)
  masked = masked.replace(/\\\[[\s\S]*?\\\]/gu, protect)
  masked = masked.replace(/\\\((?:(?!\\\))[^\n])*\\\)/gu, protect)
  masked = masked.replace(/(?<!\\)\$(?!\s)(?:\\.|[^$\n])+(?<!\s)\$/gu, protect)
  masked = masked.replace(/(\]\(\s*)(?:<([^>\n]+)>|([^\s)\n]+))/gu, (match) => protect(match))
  masked = masked.replace(/<[^>\n]+>/gu, protect)
  masked = masked.replace(/\bhttps?:\/\/[^\s<>)\]]+/giu, protect)
  masked = masked.replace(/\b(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}(?:\/[^\s<>)\]]*)?/gu, protect)
  masked = masked.replace(/\{#[A-Za-z_][\w:.-]*\}/gu, protect)
  masked = masked.replace(
    /(^|[\s("'=])((?:\/|\.{1,2}\/)[^\s<>"'`)\]}]+)/gmu,
    (_match, prefix: string, pathValue: string) => `${prefix}${protect(pathValue)}`,
  )
  masked = masked.replace(/[\p{L}\p{N}]+(?:(?:__|::|[_$])[\p{L}\p{N}]+)+/gu, protect)
  masked = masked.replace(PROSE_EXAMPLE_IDENTIFIER_PATTERN, protect)
  masked = masked.replace(TECHNICAL_TERM_PATTERN, protect)
  masked = masked.replace(CAMEL_CASE_IDENTIFIER_PATTERN, protect)
  masked = masked.replace(UPPERCASE_IDENTIFIER_PATTERN, (value) =>
    shouldProtectUppercaseIdentifier(value) ? protect(value) : value,
  )

  return {
    masked,
    restore(value: string): string {
      let restored = value
      // Replacement strings interpret `$&`, `$'`, `$`` and `$$` specially.
      // Protected Markdown frequently contains literal dollar signs (shell
      // variables, the `$` naming separator, and display-math delimiters), so
      // always restore through a callback and treat the saved value verbatim.
      for (const [marker, literal] of [...values].reverse()) restored = restored.replace(marker, () => literal)
      return restored
    },
  }
}

const ARMENIAN_ASSET_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['գործիքներով', 'ակտիվներով'],
  ['գործիքներին', 'ակտիվներին'],
  ['գործիքների', 'ակտիվների'],
  ['գործիքները', 'ակտիվները'],
  ['արտոնությունները', 'ակտիվները'],
  ['գործիքային', 'ակտիվների'],
  ['գործիքներ', 'ակտիվներ'],
  ['գործիքում', 'ակտիվում'],
  ['գործիքով', 'ակտիվով'],
  ['արտոնության', 'ակտիվի'],
  ['գործիքն', 'ակտիվն'],
  ['գործիք', 'ակտիվ'],
]

const KAZAKH_LEDGER_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['Журналдарды', 'Тізілімдерді'],
  ['Журналдардың', 'Тізілімдердің'],
  ['Журнал', 'Тізілім'],
  ['кітапханаларында', 'тізілімдерінде'],
  ['кітапханаларын', 'тізілімдерін'],
  ['кітапханаларға', 'тізілімдерге'],
  ['кітапханалары', 'тізілімдері'],
  ['кітапханасында', 'тізілімінде'],
  ['кітапханалар', 'тізілімдер'],
  ['кітапшалары', 'тізілімдері'],
  ['кітапшасындағы', 'тізіліміндегі'],
  ['журналдарының', 'тізілімдерінің'],
  ['журналдарынан', 'тізілімдерінен'],
  ['журналдарына', 'тізілімдеріне'],
  ['журналдармен', 'тізілімдермен'],
  ['журналдардан', 'тізілімдерден'],
  ['журналдарға', 'тізілімдерге'],
  ['журналдарда', 'тізілімдерде'],
  ['журналдарын', 'тізілімдерін'],
  ['журналдары', 'тізілімдері'],
  ['кітапшасының', 'тізілімінің'],
  ['журналындағы', 'тізіліміндегі'],
  ['кітаптардан', 'тізілімдерден'],
  ['журналының', 'тізілімінің'],
  ['журналдарды', 'тізілімдерді'],
  ['кітапшасын', 'тізілімін'],
  ['журналымен', 'тізілімімен'],
  ['журналынан', 'тізілімінен'],
  ['кітаптары', 'тізілімдері'],
  ['кітапшасы', 'тізілімі'],
  ['журналына', 'тізіліміне'],
  ['журналында', 'тізілімінде'],
  ['журналдан', 'тізілімнен'],
  ['журналдар', 'тізілімдер'],
  ['журналда', 'тізілімде'],
  ['журналын', 'тізілімін'],
  ['журналы', 'тізілімі'],
  ['журналға', 'тізілімге'],
  ['кітапханасы', 'тізілімі'],
  ['кітапхана', 'тізілім'],
  ['журнал', 'тізілім'],
  ['кітап', 'тізілім'],
]

const KAZAKH_AUTHORITY_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['Авторизация принципалында', 'Уәкілетті субъектіде'],
  ['Авторизация принципалының', 'Уәкілетті субъектінің'],
  ['Авторизация принципалын', 'Уәкілетті субъектіні'],
  ['Авторизация принципалы', 'Уәкілетті субъект'],
  ['Авторизация принципін', 'Уәкілетті субъектіні'],
  ['Авторизация принципіне', 'Уәкілетті субъектіге'],
  ['Авторизация принципі', 'Уәкілетті субъект'],
  ['рұқсат беру негізгі принципі', 'уәкілетті субъект'],
  ['авторизациялудың принципіне', 'уәкілетті субъектіге'],
  ['авторизациялудың принципі', 'уәкілетті субъект'],
  ['авторизациялау принципін', 'уәкілетті субъектіні'],
  ['авторизациялау принциптері', 'уәкілетті субъектілер'],
  ['авторизациялау принципі', 'уәкілетті субъект'],
  ['авторизациялық принцип', 'уәкілетті субъект'],
  ['авторизациясы принципін', 'уәкілетті субъектіні'],
  ['авторизация принципалында', 'уәкілетті субъектіде'],
  ['авторизация принципалының', 'уәкілетті субъектінің'],
  ['авторизация принципалын', 'уәкілетті субъектіні'],
  ['авторизация принципалы', 'уәкілетті субъект'],
  ['авторизация принципалі', 'уәкілетті субъект'],
  ['авторизация принциптерінің', 'уәкілетті субъектілерінің'],
  ['авторизация принциптері', 'уәкілетті субъектілер'],
  ['авторизация принципін', 'уәкілетті субъектіні'],
  ['авторизация принципіне', 'уәкілетті субъектіге'],
  ['авторизация принципі', 'уәкілетті субъект'],
  ['рұқсаттандыру принципі', 'уәкілетті субъект'],
  ['рұқсат ету принципіне', 'уәкілетті субъектіге'],
  ['рұқсат ету принципі', 'уәкілетті субъект'],
  ['рұқсат беру принципінде', 'уәкілетті субъектіде'],
  ['рұқсат беру принципіне', 'уәкілетті субъектіге'],
  ['рұқсат беру принципін', 'уәкілетті субъектіні'],
  ['рұқсат беру принциптері', 'уәкілетті субъектілер'],
  ['рұқсат беру принципі', 'уәкілетті субъект'],
  ['рұқсат принципіне', 'уәкілетті субъектіге'],
  ['рұқсат принципін', 'уәкілетті субъектіні'],
  ['рұқсат принципі', 'уәкілетті субъект'],
  ['растау принципалі', 'уәкілетті субъект'],
  ['растау принципі', 'уәкілетті субъект'],
  ['принципалдарының', 'уәкілетті субъектілерінің'],
  ['принципалдары', 'уәкілетті субъектілер'],
  ['принципалының', 'уәкілетті субъектінің'],
  ['принципалынан', 'уәкілетті субъектіден'],
  ['принципалына', 'уәкілетті субъектіге'],
  ['принципалында', 'уәкілетті субъектіде'],
  ['принципалын', 'уәкілетті субъектіні'],
  ['принципалы', 'уәкілетті субъект'],
  ['принципалі', 'уәкілетті субъект'],
  ['принциптерінің', 'уәкілетті субъектілерінің'],
  ['принциптерін', 'уәкілетті субъектілерін'],
  ['принциптеріне', 'уәкілетті субъектілеріне'],
  ['принциптері', 'уәкілетті субъектілер'],
  ['принципіне', 'уәкілетті субъектіге'],
  ['принципінде', 'уәкілетті субъектіде'],
  ['принципінің', 'уәкілетті субъектінің'],
  ['принципін', 'уәкілетті субъектіні'],
  ['принципі', 'уәкілетті субъект'],
  ['принцип', 'уәкілетті субъект'],
]

const KAZAKH_EXPLORER_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['Зерттеушілерінің', 'Шолушыларының'],
  ['Зерттеушілерінен', 'Шолушыларынан'],
  ['Зерттеушілеріне', 'Шолушыларына'],
  ['Зерттеушілері', 'Шолушылары'],
  ['Зерттеушілер', 'Шолушылар'],
  ['Зерттеуші', 'Шолушы'],
  ['зерттеушілерінің', 'шолушыларының'],
  ['зерттеушілерінен', 'шолушыларынан'],
  ['зерттеушілеріне', 'шолушыларына'],
  ['зерттеушілері', 'шолушылары'],
  ['зерттеушілер', 'шолушылар'],
  ['зерттеушісінен', 'шолушысынан'],
  ['зерттеушісінің', 'шолушысының'],
  ['зерттеушісіне', 'шолушысына'],
  ['зерттеушінің', 'шолушының'],
  ['зерттеушіні', 'шолушыны'],
  ['зерттеушісі', 'шолушысы'],
  ['зерттеуші', 'шолушы'],
]

const KAZAKH_LOT_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['Шот-фактура тобын', 'Шот-фактура лотын'],
  ['шот-фактура тобын', 'шот-фактура лотын'],
  ['RWA топ ретінде', 'RWA лоты ретінде'],
  ['Тобының', 'Лоттың'],
  ['Тобынан', 'Лоттан'],
  ['Тобында', 'Лотта'],
  ['Тобына', 'Лотқа'],
  ['Тобын', 'Лотты'],
  ['Тобы', 'Лот'],
  ['Топтан', 'Лоттан'],
  ['Топта', 'Лотта'],
  ['Топты', 'Лотты'],
  ['Топ', 'Лот'],
  ['тобының', 'лоттың'],
  ['тобынан', 'лоттан'],
  ['тобында', 'лотта'],
  ['тобына', 'лотқа'],
  ['тобын', 'лотты'],
  ['тобы', 'лот'],
  ['топтың', 'лоттың'],
  ['топтан', 'лоттан'],
  ['топқа', 'лотқа'],
  ['топта', 'лотта'],
  ['топты', 'лотты'],
  ['топ', 'лот'],
]

const RUSSIAN_EXPLORER_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['Исследователями', 'Обозревателями'],
  ['Исследователей', 'Обозревателей'],
  ['Исследователю', 'Обозревателю'],
  ['Исследователя', 'Обозревателя'],
  ['Исследователь', 'Обозреватель'],
  ['исследователями', 'обозревателями'],
  ['исследователей', 'обозревателей'],
  ['исследователю', 'обозревателю'],
  ['исследователя', 'обозревателя'],
  ['исследователь', 'обозреватель'],
  ['Проводниками', 'Обозревателями'],
  ['Проводников', 'Обозревателей'],
  ['Проводнику', 'Обозревателю'],
  ['Проводника', 'Обозревателя'],
  ['Проводник', 'Обозреватель'],
  ['проводниками', 'обозревателями'],
  ['проводников', 'обозревателей'],
  ['проводнику', 'обозревателю'],
  ['проводника', 'обозревателя'],
  ['проводник', 'обозреватель'],
]

const AZERBAIJANI_PEER_PROSE_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['Yerli Çoxlu Peer Şəbəkəsi Yarat', 'Yerli Çoxqovşaqlı Şəbəkə Yaradın'],
  ['şəbəkə peer-lərinin', 'şəbəkə həmkarlarının'],
  ['şəbəkə peer-ləri', 'şəbəkə həmkarları'],
  ['şəbəkə peerini', 'şəbəkə həmkarını'],
  ['şəbəkə peerin', 'şəbəkə həmkarının'],
  ['şəbəkə peer', 'şəbəkə həmkarı'],
  ['müştəri/peer', 'müştəri/şəbəkə həmkarı'],
  ['peer/rol', 'şəbəkə həmkarı/rol'],
  ['peer', 'şəbəkə həmkarı'],
  ['Peer', 'Şəbəkə həmkarı'],
  ['şəbəkə həmkarı-to-şəbəkə həmkarı şəbəkəsi', 'bərabərhüquqlu şəbəkə'],
  ['şəbəkə həmkarı-to-şəbəkə həmkarı', 'bərabərhüquqlu şəbəkə'],
]

const AZERBAIJANI_VALIDATOR_PROSE_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['validator şəbəkəsi tərəfdaşlarının', 'təsdiqləyici şəbəkə iştirakçılarının'],
  ['Validatorlar', 'Təsdiqləyicilər'],
  ['validatorlararası', 'təsdiqləyicilərarası'],
  ['validatorlu', 'təsdiqləyicili'],
  ['validatorlar', 'təsdiqləyicilər'],
  ['Validator', 'Təsdiqləyici'],
  ['validator', 'təsdiqləyici'],
]

const AZERBAIJANI_RUNTIME_PROSE_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['node/runtime', 'şəbəkə qovşağı/proqram icra mühiti'],
  ['runtime', 'proqram icra mühiti'],
]

const AZERBAIJANI_BUILD_PROSE_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['build command', 'qurma əmri'],
  ['build', 'qurma'],
]

const GEORGIAN_QUERY_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['გამოკითხვებისათვის', 'მოთხოვნებისთვის'],
  ['გამოკითხვებისთვის', 'მოთხოვნებისთვის'],
  ['გამოკითხვებიდან', 'მოთხოვნებიდან'],
  ['გამოკითხვებში', 'მოთხოვნებში'],
  ['გამოკითხვებისა', 'მოთხოვნებისა'],
  ['გამოკითხვებსა', 'მოთხოვნებსა'],
  ['გამოკითხვების', 'მოთხოვნების'],
  ['გამოკითხვის', 'მოთხოვნის'],
  ['გამოკითხვები', 'მოთხოვნები'],
  ['გამოკითხვას', 'მოთხოვნას'],
  ['გამოკითხვით', 'მოთხოვნით'],
  ['გამოკითხვებს', 'მოთხოვნებს'],
  ['გამოკითხვაზე', 'მოთხოვნაზე'],
  ['გამოკითხვა', 'მოთხოვნა'],
]

const GEORGIAN_ALIAS_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ალექსანდრეებისთვის', 'ალიასებისთვის'],
  ['საიდუმლოებებს', 'ალიასებს'],
  ['საიდუმლოებებია', 'ალიასებია'],
  ['საიდუმლოებების', 'ალიასების'],
  ['საიდუმლოებით', 'ალიასით'],
  ['საიდუმლოებრი', 'ალიასური'],
  ['ანალიზებისთვის', 'ალიასებისთვის'],
  ['ალექსანდრეები', 'ალიასები'],
  ['ალექსანდრებს', 'ალიასებს'],
  ['საიდუმლოები', 'ალიასები'],
  ['საიდუმლოების', 'ალიასების'],
  ['ანალიზებისა', 'ალიასებისა'],
  ['ანალიზებზე', 'ალიასებზე'],
  ['ანალიზების', 'ალიასების'],
  ['საიდუმლოება', 'ალიასი'],
  ['ალექსანდრის', 'ალიასის'],
  ['საიდუმლოს', 'ალიასის'],
  ['ანალიზის', 'ალიასის'],
  ['ანალიზებს', 'ალიასებს'],
  ['ალექსანდრე', 'ალიასი'],
  ['ალექსანდრი', 'ალიასი'],
  ['საიდუმლო', 'ალიასი'],
  ['ანალიზი', 'ალიასი'],
]

const GEORGIAN_LEDGER_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ბიბლიოთეკების', 'რეესტრების'],
  ['ბიბლიოთეკაში', 'რეესტრში'],
  ['ბიბლიოთეკები', 'რეესტრები'],
  ['ბიბლიოთეკის', 'რეესტრის'],
  ['ბიბლიოთეკა', 'რეესტრი'],
  ['წიგნების', 'რეესტრების'],
  ['წიგნები', 'რეესტრები'],
  ['წიგნის', 'რეესტრის'],
  ['წიგნში', 'რეესტრში'],
  ['წიგნი', 'რეესტრი'],
]

const GEORGIAN_DATASPACE_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['მონაცემთა ბაზებთან', 'მონაცემთა სივრცეებთან'],
  ['მონაცემთა ბაზებში', 'მონაცემთა სივრცეებში'],
  ['მონაცემთა ბაზებს', 'მონაცემთა სივრცეებს'],
  ['მონაცემთა ბაზები', 'მონაცემთა სივრცეები'],
  ['მონაცემთა ბაზაში', 'მონაცემთა სივრცეში'],
  ['მონაცემთა ბაზის', 'მონაცემთა სივრცის'],
  ['მონაცემთა ბაზა', 'მონაცემთა სივრცე'],
]

const GEORGIAN_COMPUTING_HOST_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['მასპინძელზე', 'ჰოსტზე'],
  ['მასპინძელს', 'ჰოსტს'],
  ['მასპინძელი', 'ჰოსტი'],
]

const GEORGIAN_COMPUTING_HOST_SOURCE =
  /(?:\b(?:affected|canonical|deployment|gateway|hash|http|ledger|local|native|node|operator|peer|pretty|production|public|registered|request|runtime|service|source|target|validator|vanity|verified)\s+hosts?\b|\bhosts?\s+(?:(?:and|or)\s+service|access|address(?:es)?|calls?|capabilit(?:y|ies)|checks?|config(?:uration)?|derivation|domain|endpoints?|environment|filesystem|forms?|integrations?|machine|names?|nodes?|process|routing|runtime|service|state|suffix|system)\b|\bhost(?:ed|ing)\b|\bhostname\b|\bhost-call\b)/iu

const GEORGIAN_FEE_QUOTE_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ციტატურის', 'საფასურის შეფასების'],
  ['ციტატებს', 'საფასურის შეფასებებს'],
  ['ციტატის', 'საფასურის შეფასების'],
  ['ციტატას', 'საფასურის შეფასებას'],
  ['ციტატს', 'საფასურის შეფასებას'],
  ['ციტატა', 'საფასურის შეფასება'],
]

const AMHARIC_RECIPE_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['የምግብ አዘገጃጀት መመሪያዎችን', 'የተግባር መመሪያዎችን'],
  ['የምግብ አዘገጃጀት መመሪያዎች', 'የተግባር መመሪያዎች'],
  ['የምግብ አዘገጃጀት መመሪያን', 'የተግባር መመሪያን'],
  ['የምግብ አዘገጃጀት መመሪያ', 'የተግባር መመሪያ'],
  ['የምግብ አዘገጃጀት መጽሐፍ', 'የተግባር መመሪያ ስብስብ'],
  ['የምግብ አዘገጃጀቶችን', 'የተግባር መመሪያዎችን'],
  ['የምግብ አዘገጃጀቶች', 'የተግባር መመሪያዎች'],
  ['የምግብ አዘገጃጀቱን', 'የተግባር መመሪያውን'],
  ['የምግብ አዘገጃጀቱ', 'የተግባር መመሪያው'],
  ['የምግብ አዘገጃጀት', 'የተግባር መመሪያ'],
  ['የምግብ ማብሰያ መጽሃፉ', 'የተግባር መመሪያ ስብስቡ'],
  ['የምግብ ማብሰያ መጽሐፉ', 'የተግባር መመሪያ ስብስቡ'],
  ['የምግብ ማብሰያው', 'የተግባር መመሪያ ስብስቡ'],
  ['የምግብ አሰራር', 'የተግባር መመሪያ'],
]

const AMHARIC_DIGEST_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ምስጠራ መፍጨቶችን', 'ክሪፕቶግራፊያዊ ዳይጀስቶችን'],
  ['ምስጠራ መፍጨቶች', 'ክሪፕቶግራፊያዊ ዳይጀስቶች'],
  ['ምስጠራ መፍጨት እሴትን', 'ክሪፕቶግራፊያዊ ዳይጀስትን'],
  ['ምስጠራ መፍጨት እሴት', 'ክሪፕቶግራፊያዊ ዳይጀስት'],
  ['ምስጠራ መፈጨት እሴትን', 'ክሪፕቶግራፊያዊ ዳይጀስትን'],
  ['ምስጠራ መፈጨት እሴት', 'ክሪፕቶግራፊያዊ ዳይጀስት'],
  ['ክሪፕቶግራፊክ መፍጨት እሴትን', 'ክሪፕቶግራፊያዊ ዳይጀስትን'],
  ['ክሪፕቶግራፊክ መፍጨት እሴት', 'ክሪፕቶግራፊያዊ ዳይጀስት'],
  ['ክሪፕቶግራፊክ መፈጨት እሴትን', 'ክሪፕቶግራፊያዊ ዳይጀስትን'],
  ['ክሪፕቶግራፊክ መፈጨት እሴት', 'ክሪፕቶግራፊያዊ ዳይጀስት'],
  ['መፍጨት እሴትን', 'ዳይጀስትን'],
  ['መፍጨት እሴት', 'ዳይጀስት'],
  ['መፈጨት እሴትን', 'ዳይጀስትን'],
  ['መፈጨት እሴት', 'ዳይጀስት'],
  ['ምስጠራ መፍጨት', 'ክሪፕቶግራፊያዊ ዳይጀስት'],
  ['ምስጠራ መፈጨት', 'ክሪፕቶግራፊያዊ ዳይጀስት'],
  ['የምግብ መፍጨት እሴት', 'ዳይጀስት'],
  ['የምግብ መፍጫ እሴት', 'ዳይጀስት'],
]

const AMHARIC_TOKEN_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ማስመሰያዎችን', 'ቶከኖችን'],
  ['ማስመሰያዎች', 'ቶከኖች'],
  ['ማስመሰያውን', 'ቶከኑን'],
  ['ማስመሰያው', 'ቶከኑ'],
  ['ማስመሰያን', 'ቶከንን'],
  ['ማስመሰያ', 'ቶከን'],
]

const AMHARIC_ARTIFACT_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ቅርሶቹን', 'አርቲፋክቶቹን'],
  ['ቅርሶቹ', 'አርቲፋክቶቹ'],
  ['ቅርሶችን', 'አርቲፋክቶችን'],
  ['ቅርሶች', 'አርቲፋክቶች'],
  ['ቅርሱን', 'አርቲፋክቱን'],
  ['ቅርሱ', 'አርቲፋክቱ'],
  ['ቅርስ', 'አርቲፋክት'],
]

const AMHARIC_FIXTURE_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['የሙከራ ቅርሶችን', 'የሙከራ አብነቶችን'],
  ['የሙከራ ቅርሶች', 'የሙከራ አብነቶች'],
  ['ሙከራ ቅርሶችን', 'የሙከራ አብነቶችን'],
  ['ሙከራ ቅርሶች', 'የሙከራ አብነቶች'],
  ['የሙከራ ቅርስን', 'የሙከራ አብነትን'],
  ['የሙከራ ቅርስ', 'የሙከራ አብነት'],
  ['ሙከራ ቅርስን', 'የሙከራ አብነትን'],
  ['ሙከራ ቅርስ', 'የሙከራ አብነት'],
]

const AMHARIC_BARE_FIXTURE_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ቅርሶቹን', 'የሙከራ አብነቶቹን'],
  ['ቅርሶቹ', 'የሙከራ አብነቶቹ'],
  ['ቅርሶችን', 'የሙከራ አብነቶችን'],
  ['ቅርሶች', 'የሙከራ አብነቶች'],
  ['ቅርሱን', 'የሙከራ አብነቱን'],
  ['ቅርሱ', 'የሙከራ አብነቱ'],
  ['ቅርስ', 'የሙከራ አብነት'],
]

const AMHARIC_CONSUME_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ይበላሉ', 'ይጠቀማሉ'],
  ['ይበላል', 'ይጠቀማል'],
  ['የሚበላ', 'የሚጠቀም'],
]

const AMHARIC_SIBLING_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ወንድም እህት', 'አጎራባች'],
]

const AMHARIC_LINEAGE_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ዘር ሀረጉን', 'ተከታታይነቱን'],
  ['ዘር ሐረጉን', 'ተከታታይነቱን'],
  ['ዘር ሀረጉ', 'ተከታታይነቱ'],
  ['ዘር ሐረጉ', 'ተከታታይነቱ'],
  ['ዘር ሀረግ', 'ተከታታይነት'],
  ['ዘር ሐረግ', 'ተከታታይነት'],
]

const AMHARIC_ROUTING_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ማዞሪያ', 'ማስተላለፊያ'],
]

const AMHARIC_PAYLOAD_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['የሁኔታ ክፍያ ጭነት', 'የሁኔታ ጭነት'],
  ['የክፍያ ጭነቶችን', 'ጭነቶችን'],
  ['የክፍያ ጭነቶች', 'ጭነቶች'],
  ['ለክፍያ ጭነቶች', 'ለጭነቶች'],
  ['የክፍያ ጭነቱን', 'ጭነቱን'],
  ['የክፍያ ጭነቱ', 'ጭነቱ'],
  ['የክፍያ ጭነት', 'ጭነት'],
  ['ከክፍያ ጭነት', 'ከጭነት'],
  ['ክፍያ ጭነት', 'ጭነት'],
  ['የክፍያ ቁርጥራጮች', 'የጭነት ቁርጥራጮች'],
  ['የክፍያ መገኘት', 'የጭነት መገኘት'],
  ['የክፍያ ባይት', 'የጭነት ባይት'],
  ['የታመቀ የክፍያ መጠን', 'ያልተጨመቀ የጭነት መጠን'],
  ['የክፍያ መጠኖች', 'የጭነት መጠኖች'],
  ['የክፍያ መጠን', 'የጭነት መጠን'],
  ['የክፍያ ርዝመት', 'የጭነት ርዝመት'],
  ['የክፍያ አሃዞች', 'የጭነት አሃዞች'],
  ['ደረሰኝ-ክፍያ', 'ደረሰኝ-ጭነት'],
  ['በክፍያው', 'በጭነቱ'],
  ['ከክፍያው', 'ከጭነቱ'],
  ['`Register::Domain` ክፍያ', '`Register::Domain` ጭነት'],
]

const AMHARIC_BODY_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ከየውሂብ አካል', 'ከውሂብ አካል'],
  ['በየውሂብ አካል', 'በውሂብ አካል'],
  ['ለየውሂብ አካል', 'ለውሂብ አካል'],
  ['ከሰውነት', 'ከውሂብ አካል'],
  ['በሰውነት', 'በውሂብ አካል'],
  ['ለሰውነት', 'ለውሂብ አካል'],
  ['የሰውነት', 'የውሂብ አካል'],
  ['ሰውነቱን', 'የውሂብ አካሉን'],
  ['ሰውነቱ', 'የውሂብ አካሉ'],
  ['ሰውነት', 'የውሂብ አካል'],
]

const AMHARIC_ABORT_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['የፅንስ ማስወረድ', 'የማቋረጥ'],
  ['የጽንስ ማስወረድ', 'የማቋረጥ'],
  ['ፅንስ ማስወረድ', 'ማቋረጥ'],
  ['ጽንስ ማስወረድ', 'ማቋረጥ'],
  ['ፅንስ ያስወግዳል', 'ያቋርጣል'],
  ['ጽንስ ያስወግዳል', 'ያቋርጣል'],
]

const AMHARIC_CADENCE_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ቃናትን ማገድ', 'የብሎክ ምትን መሻር'],
  ['የብሎክ ቃናዎች', 'የብሎክ ምቶች'],
  ['የብሎክ ቃና', 'የብሎክ ምት'],
]

const AMHARIC_MAGIC_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['አስማቱን', 'magic እሴቱን'],
  ['አስማት', 'magic እሴት'],
]

const AMHARIC_ERASURE_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['የመደምሰስ መገለጫ', 'የኢሬዥር መገለጫ'],
  ['መደምሰስ ክሪፕቶግራፊያዊ', 'የኢሬዥር ክሪፕቶግራፊያዊ'],
]

const AMHARIC_MINT_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['አዝሙድናዊ', 'ሚንት'],
  ['አዝሙድ', 'ሚንት'],
]

const AMHARIC_ISSUE_TIME_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['የጉዳይ ጊዜ', 'የተሰጠበት ጊዜ'],
]

const AMHARIC_FAIL_CLOSED_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['በመዘጋት ይከሽፋሉ', 'በአስተማማኝ ሁኔታ ውድቅ ይሆናሉ'],
  ['ተዘግቶ አልተሳካም', 'በአስተማማኝ ሁኔታ ውድቅ ይሆናል'],
  ['መዘጋት አልተሳካም', 'በአስተማማኝ ሁኔታ ውድቅ ይሆናል'],
  ['አሁንም አልተዘጋም', 'አሁንም ውድቅ ይሆናል'],
  ['አልተዘጋም', 'ውድቅ ይሆናል'],
  ['እና ያልተሳካ ነው', 'እና በአስተማማኝ ሁኔታ ውድቅ ያደርጋል'],
]

const AMHARIC_IDEMPOTENT_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ለአስተሳሰብ አቅም', 'ለአይደምፖተንሲ'],
  ['ለአስተሳሰብ', 'ለአይደምፖተንት'],
  ['የማይረባ', 'አይደምፖተንት'],
  ['አስደሳች', 'አይደምፖተንት'],
  ['አይደምፖል', 'አይደምፖተንት'],
]

const AMHARIC_POOL_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['የመዋኛ ገንዳዎች', 'ፑሎች'],
  ['የመዋኛ ገንዳ', 'ፑል'],
  ['ገንዳዎች', 'ፑሎች'],
  ['ገንዳው', 'ፑሉ'],
  ['ገንዳ', 'ፑል'],
]

const AMHARIC_DETERMINISTIC_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['በቆራጥነት', 'በዲተርሚኒስቲክ ሁኔታ'],
  ['ቆራጥነት', 'ዲተርሚኒዝም'],
  ['ቆራጥ', 'ዲተርሚኒስቲክ'],
]

const AMHARIC_FALLBACK_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['የውድቀት እሴቶች', 'ተተኪ እሴቶች'],
  ['የውድቀት', 'የተተኪ አማራጭ'],
  ['ውድቀትን', 'ተተኪ አማራጩን'],
  ['ውድቀት', 'ተተኪ አማራጭ'],
]

const AMHARIC_NULLIFIER_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ከንቱዎችን', 'ናሊፋየሮችን'],
  ['ከንቱዎች', 'ናሊፋየሮች'],
  ['ከንቱውን', 'ናሊፋየሩን'],
  ['ከንቱው', 'ናሊፋየሩ'],
  ['ከንቱ', 'ናሊፋየር'],
]

const AMHARIC_VANITY_HOST_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['የተመዘገበው ከንቱነት አስተናጋጅ', 'የተመዘገበው ብጁ የአስተናጋጅ ስም'],
  ['የከንቱነት አስተናጋጁን', 'ብጁ የአስተናጋጅ ስሙን'],
  ['የከንቱነት አስተናጋጅ', 'ብጁ የአስተናጋጅ ስም'],
  ['ከንቱነት አስተናጋጅ', 'ብጁ የአስተናጋጅ ስም'],
]

const AMHARIC_BUFFERING_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['curl ማቋረጥን', 'የ curl ቋት አጠቃቀምን'],
  ['ማቋረጥን', 'ቋት አጠቃቀምን'],
]

const AMHARIC_MANUAL_FALLBACK_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['መመሪያ WebRTC', 'በእጅ የሚደረግ WebRTC'],
  ['መመሪያ ተተኪ', 'በእጅ የሚደረግ ተተኪ'],
  ['መመሪያ', 'በእጅ የሚደረግ'],
]

const AMHARIC_AUTHORITY_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['የፍቃድ ርዕሰ መምህርን', 'የፈቃድ ባለቤትን'],
  ['የፍቃድ ርእሰ መምህርን', 'የፈቃድ ባለቤትን'],
  ['የፍቃድ ርዕሰ መምህር', 'የፈቃድ ባለቤት'],
  ['የፍቃድ ርእሰ መምህር', 'የፈቃድ ባለቤት'],
  ['ፍቃድ ርዕሰ መምህርን', 'የፈቃድ ባለቤትን'],
  ['ፍቃድ ርእሰ መምህርን', 'የፈቃድ ባለቤትን'],
  ['ፍቃድ ርዕሰ መምህር', 'የፈቃድ ባለቤት'],
  ['ፍቃድ ርእሰ መምህር', 'የፈቃድ ባለቤት'],
  ['ርዕሰ መምህርን', 'ባለቤትን'],
  ['ርእሰ መምህርን', 'ባለቤትን'],
  ['ርዕሰ መምህር', 'ባለቤት'],
  ['ርእሰ መምህር', 'ባለቤት'],
]

const AMHARIC_HOMOMORPHIC_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ግብረ-ሰዶማዊነት', 'ሆሞሞርፊክነት'],
  ['ግብረ-ሰዶማዊ', 'ሆሞሞርፊክ'],
]

const AMHARIC_BLOCKER_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ማገጃዎችን', 'እንቅፋቶችን'],
  ['ማገጃዎች', 'እንቅፋቶች'],
  ['ማገጃውን', 'እንቅፋቱን'],
  ['ማገጃው', 'እንቅፋቱ'],
  ['ማገጃን', 'እንቅፋትን'],
  ['ማገጃ', 'እንቅፋት'],
]

const AMHARIC_ROUNDING_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['የማዞሪያ ሁነታ', 'የማጠጋጋት ሁነታ'],
]

const AMHARIC_STOCK_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['አክሲዮኑ', 'መደበኛው'],
]

const AMHARIC_STATE_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ግዛት', 'ሁኔታ'],
]

const AMHARIC_FORK_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ሹካ', 'ፎርክ'],
]

const AMHARIC_EXECUTION_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ግድያዎችን', 'አፈጻጸሞችን'],
  ['ግድያዎች', 'አፈጻጸሞች'],
  ['ግድያውን', 'አፈጻጸሙን'],
  ['ግድያው', 'አፈጻጸሙ'],
  ['ግድያ', 'አፈጻጸም'],
]

const AMHARIC_OUTBOX_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['የወጪ ሳጥን', 'የወጪ መልዕክት ሳጥን'],
]

const AMHARIC_COMMITMENT_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ምስጠራ ቁርጠኝነት እሴቶችን', 'ክሪፕቶግራፊያዊ ኮሚትመንቶችን'],
  ['ምስጠራ ቁርጠኝነት እሴቶች', 'ክሪፕቶግራፊያዊ ኮሚትመንቶች'],
  ['ምስጠራ ቁርጠኝነት እሴትን', 'ክሪፕቶግራፊያዊ ኮሚትመንትን'],
  ['ምስጠራ ቁርጠኝነት እሴት', 'ክሪፕቶግራፊያዊ ኮሚትመንት'],
  ['ምስጠራ ቁርጠኝነት', 'ክሪፕቶግራፊያዊ ኮሚትመንት'],
  ['ቁርጠኝነት እሴቶችን', 'ኮሚትመንቶችን'],
  ['ቁርጠኝነት እሴቶች', 'ኮሚትመንቶች'],
  ['ቁርጠኝነት እሴትን', 'ኮሚትመንትን'],
  ['ቁርጠኝነት እሴት', 'ኮሚትመንት'],
  ['ቁርጠኝነት', 'ኮሚትመንት'],
]

const AMHARIC_RECEIPT_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ፕሮቶኮል ውጤት መዝገቦችን', 'ደረሰኞችን'],
  ['ፕሮቶኮል ውጤት መዝገቦች', 'ደረሰኞች'],
  ['ፕሮቶኮል ውጤት መዝገብን', 'ደረሰኝን'],
  ['ፕሮቶኮል ውጤት መዝገብ', 'ደረሰኝ'],
]

const AMHARIC_NODE_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['መስቀለኛ መንገዶችን', 'ኖዶችን'],
  ['መስቀለኛ መንገዶች', 'ኖዶች'],
  ['መስቀለኛ መንገዱን', 'ኖዱን'],
  ['መስቀለኛ መንገዱ', 'ኖዱ'],
  ['መስቀለኛ መንገድ', 'ኖድ'],
]

const AMHARIC_PLANE_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['አውሮፕላኖችን', 'ንብርብሮችን'],
  ['አውሮፕላኖች', 'ንብርብሮች'],
  ['አውሮፕላን', 'ንብርብር'],
]

const AMHARIC_LEDGER_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ደብተሮችን', 'መዝገቦችን'],
  ['ደብተሮች', 'መዝገቦች'],
  ['ደብተሩን', 'መዝገቡን'],
  ['ደብተሩ', 'መዝገቡ'],
  ['ደብተርን', 'መዝገብን'],
  ['ደብተር', 'መዝገብ'],
]

const AMHARIC_STAKE_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['አክሲዮን', 'ድርሻ'],
]

const AMHARIC_BLOCK_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ማገጃዎችን', 'ብሎኮችን'],
  ['ማገጃዎች', 'ብሎኮች'],
  ['ማገጃውን', 'ብሎኩን'],
  ['ማገጃው', 'ብሎኩ'],
  ['ማገጃን', 'ብሎክን'],
  ['ማገጃ', 'ብሎክ'],
]

const AMHARIC_TECHNICAL_BLOCK_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ቁመትን አግድ', 'የብሎክ ቁመትን'],
  ['ምስጠራ ሃሽ ያግዱ', 'የብሎክ ምስጠራ ሃሽ'],
  ['ምስጠራ ሃሽ አግድ', 'የብሎክ ምስጠራ ሃሽ'],
  ['የአግድ ራስጌ', 'የብሎክ ራስጌ'],
  ['እገዳዎችን', 'ብሎኮችን'],
  ['እገዳዎች', 'ብሎኮች'],
  ['እገዳውን', 'ብሎኩን'],
  ['እገዳው', 'ብሎኩ'],
  ['እገዳን', 'ብሎክን'],
  ['እገዳ', 'ብሎክ'],
  ['አግድ', 'ብሎክ'],
]

const AMHARIC_TECHNICAL_BLOCK_SOURCE =
  /(?:\b(?:a|an|the|each|every|one|same|ordered|recent|latest|committed|finalized|genesis|new|full|local|current|another|finality|data|contiguous)\s+blocks?\b|\bblocks?\s+(?:(?:and|or)\s+(?:event|queue|explorer)|hash(?:es)?|height(?:s)?|header(?:s)?|storage|streams?|payload(?:s)?|proof(?:s)?|processing|history|evidence|context|events?|lookup|detail|target|interval|cadence|progress|synchronization|execution|bounds?|views?)\b|\bblocks?\b(?=[,.;:/-]))/iu

const AMHARIC_BALANCE_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ሚዛኖችን', 'ቀሪ ሒሳቦችን'],
  ['ሚዛኖች', 'ቀሪ ሒሳቦች'],
  ['ሚዛናዊ', 'የቀሪ ሒሳብ'],
  ['ሚዛኑን', 'ቀሪ ሒሳቡን'],
  ['ሚዛኑ', 'ቀሪ ሒሳቡ'],
  ['ሚዛንን', 'ቀሪ ሒሳብን'],
  ['ሚዛን', 'ቀሪ ሒሳብ'],
]

const AMHARIC_GENESIS_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['ዘፍጥረት', 'ጀነሲስ'],
]

const AMHARIC_WRITE_FALSE_FRIEND_REPLACEMENTS: readonly (readonly [string, string])[] = [
  ['የጽሑፎቹን', 'የመጻፍ ክዋኔዎቹን'],
  ['የጽሁፎቹን', 'የመጻፍ ክዋኔዎቹን'],
  ['ጽሑፎቹን', 'የመጻፍ ክዋኔዎቹን'],
  ['ጽሁፎቹን', 'የመጻፍ ክዋኔዎቹን'],
  ['የጽሑፎቹ', 'የመጻፍ ክዋኔዎቹ'],
  ['የጽሁፎቹ', 'የመጻፍ ክዋኔዎቹ'],
  ['ጽሑፎቹ', 'የመጻፍ ክዋኔዎቹ'],
  ['ጽሁፎቹ', 'የመጻፍ ክዋኔዎቹ'],
  ['የጽሑፉን', 'የመጻፍ ክዋኔውን'],
  ['የጽሁፉን', 'የመጻፍ ክዋኔውን'],
  ['ጽሑፉን', 'የመጻፍ ክዋኔውን'],
  ['ጽሁፉን', 'የመጻፍ ክዋኔውን'],
  ['የጽሑፉ', 'የመጻፍ ክዋኔው'],
  ['የጽሁፉ', 'የመጻፍ ክዋኔው'],
  ['ጽሑፉ', 'የመጻፍ ክዋኔው'],
  ['ጽሁፉ', 'የመጻፍ ክዋኔው'],
  ['የጽሑፎች', 'የመጻፍ ክዋኔዎች'],
  ['የጽሁፎች', 'የመጻፍ ክዋኔዎች'],
  ['ጽሑፎች', 'የመጻፍ ክዋኔዎች'],
  ['ጽሁፎች', 'የመጻፍ ክዋኔዎች'],
  ['ጽፎች', 'የመጻፍ ክዋኔዎች'],
  ['የጽሑፍ', 'የመጻፍ ክዋኔ'],
  ['የጽሁፍ', 'የመጻፍ ክዋኔ'],
  ['ጽሑፍ', 'የመጻፍ ክዋኔ'],
  ['ጽሁፍ', 'የመጻፍ ክዋኔ'],
]

export function normalizeMachineTranslationArtifacts(content: string, locale: DocsLocale, source = ''): string {
  const protectedLiterals = protectMachineTranslationLiterals(content)
  let normalized = protectedLiterals.masked
  for (const [malformed, replacement] of MACHINE_TRANSLATION_ARTIFACT_REPLACEMENTS[locale.key] ?? []) {
    normalized = normalized.replaceAll(malformed, replacement)
  }
  if (locale.key === 'hy' && /\bassets?\b/iu.test(source)) {
    for (const [falseFriend, replacement] of ARMENIAN_ASSET_FALSE_FRIEND_REPLACEMENTS) {
      normalized = normalized.replaceAll(falseFriend, replacement)
    }
  }
  if (locale.key === 'kk') {
    const sourceAwareRepairs: ReadonlyArray<
      readonly [RegExp, ReadonlyArray<readonly [string, string]>]
    > = [
      [/\bledgers?\b/iu, KAZAKH_LEDGER_FALSE_FRIEND_REPLACEMENTS],
      [/(?:\bauthorit(?:y|ies)\b|\bprincipals?\b)/iu, KAZAKH_AUTHORITY_FALSE_FRIEND_REPLACEMENTS],
      [/\bexplorers?\b/iu, KAZAKH_EXPLORER_FALSE_FRIEND_REPLACEMENTS],
      [/\blots?\b/iu, KAZAKH_LOT_FALSE_FRIEND_REPLACEMENTS],
    ]
    for (const [sourcePattern, replacements] of sourceAwareRepairs) {
      if (!sourcePattern.test(source)) continue
      for (const [falseFriend, replacement] of replacements) normalized = normalized.replaceAll(falseFriend, replacement)
    }
  }
  if (locale.key === 'ru' && /\bexplorers?\b/iu.test(source)) {
    for (const [falseFriend, replacement] of RUSSIAN_EXPLORER_FALSE_FRIEND_REPLACEMENTS) {
      normalized = normalized.replaceAll(falseFriend, replacement)
    }
  }
  if (locale.key === 'mn') {
    if (/\basset definitions?\b/iu.test(source)) {
      normalized = normalized
        .replaceAll('Өмчийн тодорхойлолт', 'Хөрөнгийн тодорхойлолт')
        .replaceAll('өмчийн тодорхойлолт', 'хөрөнгийн тодорхойлолт')
    }
    if (/\bdomains?\b/iu.test(source)) {
      normalized = normalized
        .replaceAll('Өмчийн нэрс', 'Домэйнууд')
        .replaceAll('Өмчийн нэр', 'Домэйн')
        .replaceAll('Салбарууд', 'Домэйнууд')
        .replaceAll('салбарууд', 'домэйнууд')
    }
    if (/\binstructions?\b/iu.test(source) && !/\btutorials?\b/iu.test(source)) {
      normalized = normalized
        .replaceAll('Сургалтууд', 'Зааврууд')
        .replaceAll('сургалтууд', 'зааврууд')
        .replaceAll('Сургалтын', 'Зааврын')
        .replaceAll('сургалтын', 'зааврын')
    }
  }
  if (locale.key === 'az') {
    const sourceAwareRepairs: ReadonlyArray<
      readonly [RegExp, ReadonlyArray<readonly [string, string]>]
    > = [
      [/\bpeers?\b/iu, AZERBAIJANI_PEER_PROSE_REPLACEMENTS],
      [/\bvalidators?\b/iu, AZERBAIJANI_VALIDATOR_PROSE_REPLACEMENTS],
      [/\bruntime\b/iu, AZERBAIJANI_RUNTIME_PROSE_REPLACEMENTS],
      [/\bbuild(?:s|ing|t)?\b/iu, AZERBAIJANI_BUILD_PROSE_REPLACEMENTS],
    ]
    for (const [sourcePattern, replacements] of sourceAwareRepairs) {
      if (!sourcePattern.test(source)) continue
      for (const [falseFriend, replacement] of replacements) normalized = normalized.replaceAll(falseFriend, replacement)
    }
  }
  if (locale.key === 'ka') {
    const sourceAwareRepairs: ReadonlyArray<
      readonly [RegExp, ReadonlyArray<readonly [string, string]>]
    > = [
      [/\bquer(?:y|ies)\b/iu, GEORGIAN_QUERY_FALSE_FRIEND_REPLACEMENTS],
      [/\balias(?:es)?\b/iu, GEORGIAN_ALIAS_FALSE_FRIEND_REPLACEMENTS],
      [/\bledgers?\b/iu, GEORGIAN_LEDGER_FALSE_FRIEND_REPLACEMENTS],
      [/\bdataspaces?\b/iu, GEORGIAN_DATASPACE_FALSE_FRIEND_REPLACEMENTS],
      [GEORGIAN_COMPUTING_HOST_SOURCE, GEORGIAN_COMPUTING_HOST_FALSE_FRIEND_REPLACEMENTS],
      [/\bquotes?\b/iu, GEORGIAN_FEE_QUOTE_FALSE_FRIEND_REPLACEMENTS],
    ]
    for (const [sourcePattern, replacements] of sourceAwareRepairs) {
      if (!sourcePattern.test(source)) continue
      for (const [falseFriend, replacement] of replacements) normalized = normalized.replaceAll(falseFriend, replacement)
    }
  }
  if (locale.key === 'am') {
    const sourceAwareRepairs: ReadonlyArray<
      readonly [RegExp, ReadonlyArray<readonly [string, string]>]
    > = [
      [/\b(?:recipes?|cookbooks?)\b/iu, AMHARIC_RECIPE_FALSE_FRIEND_REPLACEMENTS],
      [/\bdigests?\b/iu, AMHARIC_DIGEST_FALSE_FRIEND_REPLACEMENTS],
      [/\btokens?\b/iu, AMHARIC_TOKEN_FALSE_FRIEND_REPLACEMENTS],
      [/\bfixtures?\b/iu, AMHARIC_FIXTURE_FALSE_FRIEND_REPLACEMENTS],
      [
        /^(?![\s\S]*\bart[ei]facts?\b)[\s\S]*\bfixtures?\b/iu,
        AMHARIC_BARE_FIXTURE_FALSE_FRIEND_REPLACEMENTS,
      ],
      [/\bart[ei]facts?\b/iu, AMHARIC_ARTIFACT_FALSE_FRIEND_REPLACEMENTS],
      [/\bconsum(?:e|es|ed|ing)\b/iu, AMHARIC_CONSUME_FALSE_FRIEND_REPLACEMENTS],
      [/\bsibling\b/iu, AMHARIC_SIBLING_FALSE_FRIEND_REPLACEMENTS],
      [/\blineage\b/iu, AMHARIC_LINEAGE_FALSE_FRIEND_REPLACEMENTS],
      [/\brouting\b/iu, AMHARIC_ROUTING_FALSE_FRIEND_REPLACEMENTS],
      [/\bpayloads?\b/iu, AMHARIC_PAYLOAD_FALSE_FRIEND_REPLACEMENTS],
      [/\bbod(?:y|ies)\b/iu, AMHARIC_BODY_FALSE_FRIEND_REPLACEMENTS],
      [/\babort(?:s|ed|ing)?\b/iu, AMHARIC_ABORT_FALSE_FRIEND_REPLACEMENTS],
      [/\bcadence\b/iu, AMHARIC_CADENCE_FALSE_FRIEND_REPLACEMENTS],
      [/\bmagic\b/iu, AMHARIC_MAGIC_FALSE_FRIEND_REPLACEMENTS],
      [/\berasure\b/iu, AMHARIC_ERASURE_FALSE_FRIEND_REPLACEMENTS],
      [/\bmint(?:s|ed|ing)?\b/iu, AMHARIC_MINT_FALSE_FRIEND_REPLACEMENTS],
      [/\bissue time\b/iu, AMHARIC_ISSUE_TIME_FALSE_FRIEND_REPLACEMENTS],
      [/\bfail(?:s|ed|ing)? closed\b/iu, AMHARIC_FAIL_CLOSED_FALSE_FRIEND_REPLACEMENTS],
      [/\bidempoten(?:t|ce|cy)\b/iu, AMHARIC_IDEMPOTENT_FALSE_FRIEND_REPLACEMENTS],
      [/\bpools?\b/iu, AMHARIC_POOL_FALSE_FRIEND_REPLACEMENTS],
      [/\bdetermin(?:istic(?:ally)?|ism)\b/iu, AMHARIC_DETERMINISTIC_FALSE_FRIEND_REPLACEMENTS],
      [/(?:\bfallbacks?\b|\bfalls? back\b)/iu, AMHARIC_FALLBACK_FALSE_FRIEND_REPLACEMENTS],
      [/\bvanity (?:hosts?|hostnames?|domains?|URLs?|names?)\b/iu, AMHARIC_VANITY_HOST_FALSE_FRIEND_REPLACEMENTS],
      [/\bnullifiers?\b/iu, AMHARIC_NULLIFIER_FALSE_FRIEND_REPLACEMENTS],
      [/\bbuffering\b/iu, AMHARIC_BUFFERING_FALSE_FRIEND_REPLACEMENTS],
      [/\bmanual(?:ly)?(?:\s+\w+){0,2}\s+fallback\b/iu, AMHARIC_MANUAL_FALLBACK_FALSE_FRIEND_REPLACEMENTS],
      [/\b(?:authorit(?:y|ies)|principals?)\b/iu, AMHARIC_AUTHORITY_FALSE_FRIEND_REPLACEMENTS],
      [/\bcommitments?\b/iu, AMHARIC_COMMITMENT_FALSE_FRIEND_REPLACEMENTS],
      [/\breceipts?\b/iu, AMHARIC_RECEIPT_FALSE_FRIEND_REPLACEMENTS],
      [/\bhomomorphic(?:ally)?\b/iu, AMHARIC_HOMOMORPHIC_FALSE_FRIEND_REPLACEMENTS],
      [/\bblockers?\b/iu, AMHARIC_BLOCKER_FALSE_FRIEND_REPLACEMENTS],
      [/\brounding\b/iu, AMHARIC_ROUNDING_FALSE_FRIEND_REPLACEMENTS],
      [/\bstock Iroha CLI\b/iu, AMHARIC_STOCK_FALSE_FRIEND_REPLACEMENTS],
      [/\bstates?(?:ful)?\b/iu, AMHARIC_STATE_FALSE_FRIEND_REPLACEMENTS],
      [/\bfork(?:s|ed|ing)?\b/iu, AMHARIC_FORK_FALSE_FRIEND_REPLACEMENTS],
      [/\bexecut(?:e|es|ed|ing|ion|ions)\b/iu, AMHARIC_EXECUTION_FALSE_FRIEND_REPLACEMENTS],
      [/\boutbox(?:es)?\b/iu, AMHARIC_OUTBOX_FALSE_FRIEND_REPLACEMENTS],
      [/\bnodes?\b/iu, AMHARIC_NODE_FALSE_FRIEND_REPLACEMENTS],
      [/\bplanes?\b/iu, AMHARIC_PLANE_FALSE_FRIEND_REPLACEMENTS],
      [/\bledgers?\b/iu, AMHARIC_LEDGER_FALSE_FRIEND_REPLACEMENTS],
      [/\b(?:proof[- ]of[- ]stake|stake)\b/iu, AMHARIC_STAKE_FALSE_FRIEND_REPLACEMENTS],
      [/\bblocks?\b/iu, AMHARIC_BLOCK_FALSE_FRIEND_REPLACEMENTS],
      [AMHARIC_TECHNICAL_BLOCK_SOURCE, AMHARIC_TECHNICAL_BLOCK_FALSE_FRIEND_REPLACEMENTS],
      [/\bbalances?\b/iu, AMHARIC_BALANCE_FALSE_FRIEND_REPLACEMENTS],
      [/\bgenesis\b/iu, AMHARIC_GENESIS_FALSE_FRIEND_REPLACEMENTS],
      [/(?:\bwrite-side\b|(?<!\bit )\bwrites?\b)/iu, AMHARIC_WRITE_FALSE_FRIEND_REPLACEMENTS],
      [/\bblocking worker\b/iu, [['የብሎክ ሰራተኛው', 'የሚያግድ ሰራተኛው']]],
    ]
    for (const [sourcePattern, replacements] of sourceAwareRepairs) {
      if (!sourcePattern.test(source)) continue
      for (const [falseFriend, replacement] of replacements) normalized = normalized.replaceAll(falseFriend, replacement)
    }
  }
  normalized = normalized.replace(/^(\s*\[\^[^\]\n]+\])：/gmu, '$1:')
  return protectedLiterals.restore(normalized)
}

/** Return a reviewed exact translation while preserving surrounding whitespace. */
export function curatedExactTranslation(source: string, locale: DocsLocale): string | undefined {
  const boundary = /^(\s*)([\s\S]*?)(\s*)$/u.exec(source)
  if (!boundary) return undefined
  const curated = CURATED_EXACT_TRANSLATIONS[locale.key]
  const translated = curated?.[boundary[2]]
  if (translated !== undefined) return `${boundary[1]}${translated}${boundary[3]}`

  // Stable English-derived heading anchors are added before prose translation.
  // Reviewed heading entries intentionally omit those generated suffixes, so
  // look up the human-readable heading and then restore the exact anchor.
  const anchoredHeading = /^(.*?)(\s+\{#[A-Za-z_][\w:.-]*\})$/u.exec(boundary[2])
  if (!anchoredHeading) return undefined
  const translatedHeading = curated?.[anchoredHeading[1]]
  return translatedHeading === undefined
    ? undefined
    : `${boundary[1]}${translatedHeading}${anchoredHeading[2]}${boundary[3]}`
}

/** Return reviewed exact units for generated-document regression checks. */
export function curatedExactTranslationEntries(locale: DocsLocale): ReadonlyArray<readonly [string, string]> {
  return Object.entries(CURATED_EXACT_TRANSLATIONS[locale.key] ?? {})
}

function clarifyUncuratedTechnicalTranslationSource(source: string, locale: DocsLocale): string {
  const protectedValues = new Map<string, string>()
  let masked = source
  let sequence = 0
  const exactSources = Object.keys(CURATED_EXACT_TRANSLATIONS[locale.key] ?? {}).sort(
    (left, right) => right.length - left.length,
  )
  for (const exactSource of exactSources) {
    const marker = `\uE100${sequence}\uE101`
    if (masked.includes(exactSource)) {
      sequence += 1
      protectedValues.set(marker, exactSource)
      masked = masked.replaceAll(exactSource, marker)
      continue
    }

    // Prose units can contain source-authored soft line wraps even when the
    // reviewed exact entry is stored on one line. Protect that same phrase
    // across horizontal whitespace or a single soft newline so term
    // clarification cannot make an existing curated translation unreachable.
    if (exactSource.trim() !== exactSource || !/[ \t]/u.test(exactSource)) continue
    const flexibleWhitespacePattern = exactSource
      .split(/[ \t]+/u)
      .map((part) => part.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&'))
      .join('(?:[ \\t]+|\\r?\\n[ \\t]*)')
    const match = new RegExp(flexibleWhitespacePattern, 'u').exec(masked)
    if (!match) continue
    sequence += 1
    protectedValues.set(marker, exactSource)
    masked = masked.replace(new RegExp(flexibleWhitespacePattern, 'gu'), marker)
  }

  let clarified = clarifyTechnicalTranslationSource(masked)
  if (locale.key === 'ru' || locale.key === 'ja') {
    clarified = clarified
      .replace(/\bcompliance with the single protocol-standard form\b/giu, 'canonicality')
      .replace(/\bin the single protocol-standard form\b/giu, 'canonically')
      .replace(/\bsingle protocol-standard\b/giu, 'canonical')
      .replace(/\bsoftware execution environments\b/giu, 'software runtimes')
      .replace(/\bsoftware execution environment\b/giu, 'software runtime')
      .replace(/\bpoint-in-time data views\b/giu, 'data snapshots')
      .replace(/\bpoint-in-time data view\b/giu, 'data snapshot')
  }
  if (locale.key === 'ru') {
    clarified = clarified
      .replace(/\bblockchain ledgers\b/giu, 'distributed blockchain registries')
      .replace(/\bblockchain ledger\b/giu, 'distributed blockchain registry')
      .replace(/\bcryptographic signers\b/giu, 'cryptographic signatories')
      .replace(/\bcryptographic signer\b/giu, 'cryptographic signatory')
  }
  for (const [marker, exactSource] of protectedValues) {
    clarified = clarified.replaceAll(marker, () => exactSource)
  }
  return clarified
}

export const NLLB_LANGUAGE_CODES: Readonly<Record<string, string>> = {
  es: 'spa_Latn',
  pt: 'por_Latn',
  fr: 'fra_Latn',
  ru: 'rus_Cyrl',
  ar: 'arb_Arab',
  ur: 'urd_Arab',
  ja: 'jpn_Jpan',
  he: 'heb_Hebr',
  my: 'mya_Mymr',
  ka: 'kat_Geor',
  hy: 'hye_Armn',
  az: 'azj_Latn',
  kk: 'kaz_Cyrl',
  ba: 'bak_Cyrl',
  am: 'amh_Ethi',
  dz: 'dzo_Tibt',
  uz: 'uzn_Latn',
  mn: 'khk_Cyrl',
  'zh-hans': 'zho_Hans',
  'zh-hant': 'zho_Hant',
}

// Dzongkha is deliberately absent: Bing supports Tibetan (`bo`), which is a
// related but distinct language and must not be mislabeled as a Dzongkha
// translation.
export const BING_LANGUAGE_CODES: Readonly<Record<string, string>> = {
  es: 'es',
  pt: 'pt',
  fr: 'fr',
  ru: 'ru',
  ar: 'ar',
  ur: 'ur',
  ja: 'ja',
  he: 'he',
  my: 'my',
  ka: 'ka',
  hy: 'hy',
  az: 'az',
  kk: 'kk',
  ba: 'ba',
  am: 'am',
  uz: 'uz',
  mn: 'mn-Cyrl',
  'zh-hans': 'zh-Hans',
  'zh-hant': 'zh-Hant',
}

/**
 * Locales whose full-corpus probes remained within the maintained writing
 * system. Bing exposes language codes for Myanmar, Georgian, and Armenian,
 * but corpus probes for those targets reproducibly emitted unrelated scripts;
 * keep them on the guarded local NLLB path instead of selecting them by
 * default or through the CLI.
 */
export const BING_RECOMMENDED_LOCALE_KEYS = [
  'es',
  'pt',
  'fr',
  'ru',
  'ar',
  'ur',
  'ja',
  'he',
  'az',
  'kk',
  'ba',
  'am',
  'uz',
  'mn',
  'zh-hant',
  'zh-hans',
] as const

const BING_RECOMMENDED_LOCALE_KEY_SET = new Set<string>(BING_RECOMMENDED_LOCALE_KEYS)

export const TRANSLATION_MINIMUM_RATIO: Readonly<Record<string, number>> = {
  am: 0.35,
  ar: 0.4,
  az: 0.5,
  ba: 0.5,
  dz: 0.5,
  es: 0.5,
  fr: 0.5,
  he: 0.35,
  hy: 0.5,
  ja: 0.25,
  ka: 0.5,
  kk: 0.5,
  mn: 0.5,
  my: 0.5,
  pt: 0.5,
  ru: 0.5,
  ur: 0.5,
  uz: 0.5,
  'zh-hans': 0.25,
  'zh-hant': 0.25,
}

export const SENTENCE_COVERAGE_MINIMUM_RATIO: Readonly<Record<string, number>> = {
  am: 0.49,
  ar: 0.62,
  az: 0.76,
  ba: 0.75,
  dz: 0.78,
  es: 0.82,
  fr: 0.83,
  he: 0.57,
  hy: 0.83,
  ja: 0.42,
  ka: 0.75,
  kk: 0.78,
  mn: 0.79,
  my: 0.87,
  pt: 0.77,
  ru: 0.79,
  ur: 0.67,
  uz: 0.83,
  'zh-hans': 0.25,
  'zh-hant': 0.25,
}

const sentenceSegmenters = new Map<string, Intl.Segmenter>()

export function translationMinimumRatio(localeKey: string): number {
  return TRANSLATION_MINIMUM_RATIO[localeKey] ?? 0.5
}

export function sentenceCoverageMinimumRatio(localeKey: string): number {
  return SENTENCE_COVERAGE_MINIMUM_RATIO[localeKey] ?? 0.7
}

export function sentenceCount(content: string, language: string): number {
  let segmenter = sentenceSegmenters.get(language)
  if (!segmenter) {
    segmenter = new Intl.Segmenter(language, { granularity: 'sentence' })
    sentenceSegmenters.set(language, segmenter)
  }
  return [...segmenter.segment(content)].filter(({ segment }) => /\p{L}/u.test(segment)).length
}

interface FrontmatterDocument {
  frontmatter: string | null
  body: string
}

interface ProtectedMarkdown {
  masked: string
  valueForMarker(marker: string): string | undefined
  restore(translated: string): string
}

type ProtectedMarkerStyle = 'html' | 'identifier'

export interface TranslationProvider {
  readonly engine?: string
  readonly protectedMarkdownMode?: 'inline' | 'inline-identifiers' | 'fragments'
  readonly clarifyTechnicalTerms?: boolean
  languageCode?(locale: DocsLocale): string
  translate(text: string, targetLanguage: string): Promise<string>
  translateBatch?(texts: readonly string[], targetLanguage: string): Promise<string[]>
  close?(): Promise<void>
}

interface GenerateOptions {
  sourceRoot?: string
  locales?: readonly DocsLocale[]
  routes?: readonly string[]
  concurrency?: number
  provider?: TranslationProvider
}

interface SynchronizeHeadingAnchorOptions {
  sourceRoot?: string
  locales?: readonly DocsLocale[]
  routes?: readonly string[]
}

type SynchronizeMarkdownStructureOptions = SynchronizeHeadingAnchorOptions
type SynchronizeReviewedTranslationOptions = SynchronizeHeadingAnchorOptions
type NormalizeExistingTranslationOptions = SynchronizeHeadingAnchorOptions

interface NllbProviderOptions {
  python?: string
  model: string
}

interface PendingNllbRequest {
  resolve(translations: string[]): void
  reject(error: Error): void
}

interface NllbResponse {
  id?: unknown
  translations?: unknown
  error?: unknown
}

function sha256(content: string): string {
  return createHash('sha256').update(content).digest('hex')
}

/** Return exact technical tokens whose spelling translations must preserve. */
export function technicalIdentifiers(source: string): Map<string, number> {
  const counts = new Map<string, number>()
  for (const pattern of [
    TECHNICAL_TERM_PATTERN,
    CAMEL_CASE_IDENTIFIER_PATTERN,
    UPPERCASE_IDENTIFIER_PATTERN,
    DOMAIN_NAME_PATTERN,
  ]) {
    for (const match of source.matchAll(pattern)) {
      if (pattern === UPPERCASE_IDENTIFIER_PATTERN && !shouldProtectUppercaseIdentifier(match[0])) continue
      counts.set(match[0], (counts.get(match[0]) ?? 0) + 1)
    }
  }
  const irohaVersionMatches = source.match(/\bIroha 3\b/gu) ?? []
  if (irohaVersionMatches.length > 0) {
    counts.set('Iroha', (counts.get('Iroha') ?? 0) + irohaVersionMatches.length)
  }
  const nexusMatches = source.match(/\bNexus\b/gu) ?? []
  if (nexusMatches.length > 0) counts.set('Nexus', nexusMatches.length)
  return counts
}

function splitFrontmatter(content: string): FrontmatterDocument {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(content)
  if (!match) return { frontmatter: null, body: content }
  return {
    frontmatter: match[1],
    body: content.slice(match[0].length),
  }
}

interface MarkdownHeading {
  explicitAnchor?: string
  lineIndex: number
  stableAnchor: string
}

export interface MarkdownContainerDirective {
  indentation: string
  keyword?: string
  lineIndex: number
  title?: string
}

const HEADING_MARKDOWN = new MarkdownIt({ html: true })
const EXPLICIT_HEADING_ANCHOR = /\s+\{#([A-Za-z_][\w:.-]*)\}\s*$/u

function headingText(markdown: string): string {
  const inline = HEADING_MARKDOWN.parseInline(markdown, {})[0]
  return (inline?.children ?? [])
    .filter((token) => token.type === 'text' || token.type === 'code_inline')
    .map((token) => token.content)
    .join('')
}

/** Return stable VitePress heading IDs derived from the English source. */
export function markdownHeadings(source: string): MarkdownHeading[] {
  const headings: MarkdownHeading[] = []
  const usedAnchors = new Set<string>()
  const lines = source.split(/\r?\n/u)
  let fence: { character: string; length: number } | undefined

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex]
    const fenceMarker = /^ {0,3}(`{3,}|~{3,})(.*)$/u.exec(line)
    if (fence) {
      if (
        fenceMarker &&
        fenceMarker[1][0] === fence.character &&
        fenceMarker[1].length >= fence.length &&
        fenceMarker[2].trim() === ''
      ) {
        fence = undefined
      }
      continue
    }
    if (fenceMarker) {
      fence = { character: fenceMarker[1][0], length: fenceMarker[1].length }
      continue
    }

    const heading = /^( {0,3}#{1,6})[ \t]+(.+?)(?:[ \t]+#+)?[ \t]*$/u.exec(line)
    if (!heading) continue
    const explicitAnchor = EXPLICIT_HEADING_ANCHOR.exec(heading[2])?.[1]
    const baseAnchor = explicitAnchor ?? slugify(headingText(heading[2].replace(EXPLICIT_HEADING_ANCHOR, '')))
    let stableAnchor = baseAnchor
    let duplicateIndex = 1
    while (usedAnchors.has(stableAnchor)) {
      stableAnchor = `${baseAnchor}-${duplicateIndex}`
      duplicateIndex += 1
    }
    usedAnchors.add(stableAnchor)
    headings.push({ explicitAnchor, lineIndex, stableAnchor })
  }

  return headings
}

/** Return VitePress container directives outside fenced code blocks. */
export function markdownContainerDirectives(source: string): MarkdownContainerDirective[] {
  const directives: MarkdownContainerDirective[] = []
  const lines = source.split(/\r?\n/u)
  let fence: { character: string; length: number } | undefined

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex]
    const fenceMarker = /^ {0,3}(`{3,}|~{3,})(.*)$/u.exec(line)
    if (fence) {
      if (
        fenceMarker &&
        fenceMarker[1][0] === fence.character &&
        fenceMarker[1].length >= fence.length &&
        fenceMarker[2].trim() === ''
      ) {
        fence = undefined
      }
      continue
    }
    if (fenceMarker) {
      fence = { character: fenceMarker[1][0], length: fenceMarker[1].length }
      continue
    }

    const directive = /^( {0,3}):::[ \t]*(?:(\S+)(?:[ \t]+(.*?))?)?[ \t]*$/u.exec(line)
    if (!directive) continue
    directives.push({
      indentation: directive[1],
      keyword: directive[2],
      lineIndex,
      title: directive[3],
    })
  }

  return directives
}

/** Add stable English-derived IDs to every Markdown heading in a document body. */
export function addStableHeadingAnchors(source: string): string {
  const lines = source.split(/\r?\n/u)
  for (const heading of markdownHeadings(source)) {
    if (heading.explicitAnchor) continue
    lines[heading.lineIndex] = `${lines[heading.lineIndex]} {#${heading.stableAnchor}}`
  }
  return lines.join('\n')
}

function stripTrailingWhitespaceOutsideFences(source: string): string {
  const lines = source.split('\n')
  let fence: { character: string; length: number } | undefined

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const fenceMarker = /^ {0,3}(`{3,}|~{3,})(.*)$/u.exec(line)
    if (fence) {
      if (
        fenceMarker &&
        fenceMarker[1][0] === fence.character &&
        fenceMarker[1].length >= fence.length &&
        fenceMarker[2].trim() === ''
      ) {
        fence = undefined
        lines[index] = line.replace(/[ \t]+$/u, '')
      }
      continue
    }

    const normalized = line.replace(/[ \t]+$/u, '')
    lines[index] = normalized
    const openingFence = /^ {0,3}(`{3,}|~{3,})/u.exec(normalized)
    if (openingFence) {
      fence = { character: openingFence[1][0], length: openingFence[1].length }
    }
  }

  return lines.join('\n')
}

function literalMarkdownBlocks(source: string): string[] {
  return markdownTranslationUnits(source)
    .filter((unit) => {
      if (unit.translate || unit.content === '\n') return false
      return (
        /^ {0,3}(?:`{3,}|~{3,})/u.test(unit.content) ||
        /^ {0,3}<(?:script|style)\b/iu.test(unit.content) ||
        /^ {0,3}(?:\$\$|\\\[)\s*$/u.test(unit.content.split('\n', 1)[0])
      )
    })
    .map((unit) => unit.content)
}

function translatableMarkdownProse(source: string): string {
  return markdownTranslationUnits(source)
    .filter((unit) => unit.translate)
    .map((unit) => unit.content)
    .join('\n')
}

function inlineCodeSpanCountsForStructure(source: string): Map<string, number> {
  const counts = new Map<string, number>()
  for (const match of translatableMarkdownProse(source).matchAll(/(?<!`)(`+)(?!`)([^\n]*?)\1(?!`)/gu)) {
    let value = match[2]
    if (value.startsWith(' ') && value.endsWith(' ') && value.trim().length > 0) value = value.slice(1, -1)
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  return counts
}

function inlineBacktickRunCounts(source: string): Map<number, number> {
  const counts = new Map<number, number>()
  for (const match of translatableMarkdownProse(source).matchAll(/(?<!`)`+(?!`)/gu)) {
    const length = match[0].length
    counts.set(length, (counts.get(length) ?? 0) + 1)
  }
  return counts
}

function mapsEqual<Key>(left: ReadonlyMap<Key, number>, right: ReadonlyMap<Key, number>): boolean {
  return left.size === right.size && [...left].every(([key, value]) => right.get(key) === value)
}

function valueCounts<Value>(values: readonly Value[]): Map<Value, number> {
  const counts = new Map<Value, number>()
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1)
  return counts
}

function markdownLinkDestinationsForStructure(source: string): string[] {
  const prose = translatableMarkdownProse(source)
  const destinations = [...prose.matchAll(/!?\[[^\]\n]*\]\(\s*(?:<([^>\n]+)>|([^\s)\n]+))/gu)].map(
    (match) => match[1] ?? match[2],
  )
  for (const match of prose.matchAll(/\bhref\s*=\s*["']([^"']+)["']/giu)) destinations.push(match[1])
  return destinations
}

function exactAsciiIdentifierCount(content: string, identifier: string): number {
  const escaped = identifier.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')
  return content.match(new RegExp(`(?<![A-Za-z])${escaped}(?![A-Za-z])`, 'gu'))?.length ?? 0
}

/** Reject structurally damaged output before it can replace a locale page. */
export function assertGeneratedMarkdownStructure(source: string, translated: string, locale: DocsLocale): void {
  if (/[\uE000-\uF8FF]/u.test(translated)) {
    throw new Error('translation output contains an internal private-use placeholder')
  }

  const sourceHeadings = markdownHeadings(source)
  const translatedHeadings = markdownHeadings(translated)
  if (translatedHeadings.length !== sourceHeadings.length) {
    throw new Error(`heading inventory drift (expected ${sourceHeadings.length}, found ${translatedHeadings.length})`)
  }
  if (sourceHeadings.some((heading, index) => heading.explicitAnchor !== translatedHeadings[index]?.explicitAnchor)) {
    throw new Error('heading anchor inventory drift')
  }

  const sourceLinks = markdownLinkDestinationsForStructure(source).map((destination) =>
    localizeRoute(destination, locale),
  )
  const translatedLinks = markdownLinkDestinationsForStructure(translated)
  const sourceLinkCounts = valueCounts(sourceLinks)
  const translatedLinkCounts = valueCounts(translatedLinks)
  if (sourceLinks.length !== translatedLinks.length || !mapsEqual(sourceLinkCounts, translatedLinkCounts)) {
    const mismatchedDestination = [...new Set([...sourceLinks, ...translatedLinks])].find(
      (destination) => sourceLinkCounts.get(destination) !== translatedLinkCounts.get(destination),
    )
    const mismatch = mismatchedDestination
      ? `; destination ${JSON.stringify(mismatchedDestination)} expected ${sourceLinkCounts.get(mismatchedDestination) ?? 0}, found ${translatedLinkCounts.get(mismatchedDestination) ?? 0}`
      : ''
    throw new Error(
      `Markdown link destination inventory drift (expected ${sourceLinks.length}, found ${translatedLinks.length}${mismatch})`,
    )
  }
  if (synchronizeTechnicalLinkLabels(source, translated, locale) !== translated) {
    throw new Error('protected technical link label drift')
  }
  const sourceEmptyLinkLabels = valueCounts(
    directMarkdownLinks(source)
      .filter((link) => !link.label.trim())
      .map((link) => localizeRoute(link.destination, locale)),
  )
  const translatedEmptyLinkLabels = new Map<string, number>()
  for (const link of directMarkdownLinks(translated)) {
    if (link.label.trim()) continue
    const observed = (translatedEmptyLinkLabels.get(link.destination) ?? 0) + 1
    translatedEmptyLinkLabels.set(link.destination, observed)
    if (observed > (sourceEmptyLinkLabels.get(link.destination) ?? 0)) {
      throw new Error(`Markdown link label became empty for destination ${link.destination}`)
    }
  }

  const sourceInlineCode = inlineCodeSpanCountsForStructure(source)
  const translatedInlineCode = inlineCodeSpanCountsForStructure(translated)
  const sourceBackticks = inlineBacktickRunCounts(source)
  const translatedBackticks = inlineBacktickRunCounts(translated)
  if (!mapsEqual(sourceInlineCode, translatedInlineCode) || !mapsEqual(sourceBackticks, translatedBackticks)) {
    throw new Error(
      `inline code inventory drift (expected ${JSON.stringify([...sourceInlineCode])}/${JSON.stringify([...sourceBackticks])}, found ${JSON.stringify([...translatedInlineCode])}/${JSON.stringify([...translatedBackticks])})`,
    )
  }

  for (const identifier of PROSE_EXAMPLE_IDENTIFIERS) {
    const expected = exactAsciiIdentifierCount(source, identifier)
    const found = exactAsciiIdentifierCount(translated, identifier)
    if (found !== expected) {
      throw new Error(`example identifier ${identifier} drift (expected ${expected}, found ${found})`)
    }
  }

  const translatedIdentifiers = technicalIdentifiers(translated)
  for (const [identifier, expected] of technicalIdentifiers(source)) {
    const found = translatedIdentifiers.get(identifier) ?? 0
    if (found !== expected) {
      throw new Error(`technical identifier ${identifier} drift (expected ${expected}, found ${found})`)
    }
  }

  const sourceDirectives = markdownContainerDirectives(source)
  const translatedDirectives = markdownContainerDirectives(translated)
  if (
    translatedDirectives.length !== sourceDirectives.length ||
    sourceDirectives.some((directive, index) => directive.keyword !== translatedDirectives[index]?.keyword)
  ) {
    throw new Error(
      `container directive inventory drift (expected ${sourceDirectives.length}, found ${translatedDirectives.length})`,
    )
  }

  const sourceProseUnits = markdownTranslationUnits(source).filter((unit) => unit.translate).length
  const translatedProseUnits = markdownTranslationUnits(translated).filter((unit) => unit.translate).length
  if (translatedProseUnits !== sourceProseUnits) {
    throw new Error(`prose unit inventory drift (expected ${sourceProseUnits}, found ${translatedProseUnits})`)
  }

  const sourceLiterals = literalMarkdownBlocks(source)
  const translatedLiterals = literalMarkdownBlocks(translated)
  if (
    translatedLiterals.length !== sourceLiterals.length ||
    sourceLiterals.some((literal, index) => literal !== translatedLiterals[index])
  ) {
    throw new Error(
      `literal Markdown block drift (expected ${sourceLiterals.length}, found ${translatedLiterals.length})`,
    )
  }

  const translatedUnits = markdownTranslationUnits(translated).filter((unit) => unit.translate)
  for (let index = 0; index < translatedUnits.length; index += 1) {
    const scripts = unexpectedWritingScripts(translatedUnits[index].content, locale)
    if (scripts.length > 0) {
      throw new Error(`prose unit ${index + 1} contains unexpected writing script: ${scripts.join(', ')}`)
    }
  }
}

function applyStableHeadingAnchors(source: string, stableAnchors: readonly string[]): string {
  const lines = source.split(/\r?\n/u)
  const localizedHeadings = markdownHeadings(source)
  if (localizedHeadings.length !== stableAnchors.length) {
    throw new Error(`heading inventory drift (expected ${stableAnchors.length}, found ${localizedHeadings.length})`)
  }
  for (let index = 0; index < localizedHeadings.length; index += 1) {
    const heading = localizedHeadings[index]
    const withoutAnchor = lines[heading.lineIndex].replace(EXPLICIT_HEADING_ANCHOR, '')
    lines[heading.lineIndex] = `${withoutAnchor} {#${stableAnchors[index]}}`
  }
  return lines.join('\n')
}

function applyStableContainerDirectives(
  source: string,
  expectedDirectives: readonly MarkdownContainerDirective[],
): string {
  const lines = source.split(/\r?\n/u)
  const localizedDirectives = markdownContainerDirectives(source)
  if (localizedDirectives.length !== expectedDirectives.length) {
    throw new Error(
      `container directive inventory drift (expected ${expectedDirectives.length}, found ${localizedDirectives.length})`,
    )
  }

  for (let index = 0; index < expectedDirectives.length; index += 1) {
    const expected = expectedDirectives[index]
    const localized = localizedDirectives[index]
    if (!expected.keyword) {
      lines[localized.lineIndex] = `${localized.indentation}:::`
      continue
    }

    let localizedTitle: string | undefined
    if (expected.title) {
      localizedTitle = localized.keyword === expected.keyword ? localized.title : (localized.title ?? localized.keyword)
    }
    lines[localized.lineIndex] =
      `${localized.indentation}::: ${expected.keyword}${localizedTitle ? ` ${localizedTitle}` : ''}`
  }
  return lines.join('\n')
}

async function markdownFiles(directory: string, relative = ''): Promise<string[]> {
  const absolute = path.join(directory, relative)
  const entries = await readdir(absolute, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const child = path.posix.join(relative.split(path.sep).join('/'), entry.name)
      if (entry.isDirectory()) return markdownFiles(directory, child)
      return entry.isFile() && entry.name.endsWith('.md') ? [child] : []
    }),
  )
  return files.flat().sort()
}

async function englishRoutes(sourceRoot: string): Promise<string[]> {
  const localePaths = new Set(TRANSLATED_LOCALES.map((locale) => locale.path))
  return (await markdownFiles(sourceRoot)).filter((route) => {
    const first = route.split('/')[0]
    return first !== 'snippets' && !localePaths.has(first)
  })
}

async function routeDependencies(
  sourceRoot: string,
  sources: ReadonlyMap<string, string>,
): Promise<Map<string, Buffer>> {
  const dependencies = new Map<string, Buffer>()
  const pending = [...sources.entries()]
  const modulePattern = /\b(?:from\s+|import\s*)['"](\.{1,2}\/[^'"]+)['"]/gu

  while (pending.length > 0) {
    const [relativeSource, content] = pending.pop()!
    const sourceDirectory = path.posix.dirname(relativeSource)
    for (const match of content.matchAll(modulePattern)) {
      const dependency = path.posix.normalize(path.posix.join(sourceDirectory, match[1]))
      if (dependency === '..' || dependency.startsWith('../') || path.posix.isAbsolute(dependency)) {
        throw new Error(`${relativeSource}: relative import escapes the documentation source root: ${match[1]}`)
      }
      if (dependencies.has(dependency)) continue
      const bytes = await readFile(path.join(sourceRoot, dependency))
      dependencies.set(dependency, bytes)
      if (/\.(?:[cm]?[jt]s|vue)$/iu.test(dependency)) {
        pending.push([dependency, bytes.toString('utf8')])
      }
    }
  }

  return dependencies
}

async function assertEnglishSnapshot(
  sourceRoot: string,
  availableRoutes: readonly string[],
  sources: ReadonlyMap<string, string>,
  dependencies: ReadonlyMap<string, Buffer>,
): Promise<void> {
  const currentRoutes = await englishRoutes(sourceRoot)
  if (
    currentRoutes.length !== availableRoutes.length ||
    currentRoutes.some((route, index) => route !== availableRoutes[index])
  ) {
    throw new Error('English route inventory changed during translation; discard this run and restart')
  }
  for (const [route, content] of sources) {
    if ((await readFile(path.join(sourceRoot, route), 'utf8')) !== content) {
      throw new Error(`English source changed during translation: ${route}; discard this run and restart`)
    }
  }
  for (const [dependency, content] of dependencies) {
    if (!(await readFile(path.join(sourceRoot, dependency))).equals(content)) {
      throw new Error(
        `English source dependency changed during translation: ${dependency}; discard this run and restart`,
      )
    }
  }
}

async function replaceDirectoryAtomically(current: string, replacement: string, backup: string): Promise<void> {
  let movedCurrent = false
  try {
    await rename(current, backup)
    movedCurrent = true
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  }

  try {
    await rename(replacement, current)
  } catch (error) {
    if (movedCurrent) await rename(backup, current)
    throw error
  }
  if (movedCurrent) await rm(backup, { recursive: true, force: true })
}

function localizeRoute(route: string, locale: DocsLocale): string {
  const routePath = route.split(/[?#]/u, 1)[0]
  const extension = path.posix.extname(routePath).toLowerCase()
  if (/^\.{1,2}\//u.test(route) && extension && extension !== '.md') {
    return `../${route}`
  }
  if (
    !route.startsWith('/') ||
    route.startsWith('//') ||
    route.startsWith(`/${locale.path}/`) ||
    (extension && extension !== '.md')
  ) {
    return route
  }
  return `/${locale.path}${route}`
}

function localizeLinkSuffix(suffix: string, locale: DocsLocale): string {
  return suffix.replace(
    /^(\]\(\s*)([^)\s]+)([\s\S]*)$/u,
    (_match, prefix: string, target: string, rest: string) => `${prefix}${localizeRoute(target, locale)}${rest}`,
  )
}

function localizeHtmlTag(tag: string, locale: DocsLocale): string {
  return tag.replace(
    /(\bhref\s*=\s*["'])(\/(?!\/)[^"']*)(["'])/giu,
    (_match, prefix: string, target: string, suffix: string) => `${prefix}${localizeRoute(target, locale)}${suffix}`,
  )
}

/**
 * Replace code, identifiers, URLs, and Markdown delimiters with translation-safe
 * symbolic markers. HTML markers use `translate=no`; identifier markers give
 * local models a tokenizer-safe placeholder while retaining paragraph context.
 */
export function protectMarkdown(
  source: string,
  locale: DocsLocale,
  markerStyle: ProtectedMarkerStyle = 'html',
  protectWholeLinks = false,
): ProtectedMarkdown {
  const internalValues = new Map<string, string>()
  let sequence = 0
  const protect = (value: string): string => {
    const token = `⟦${sequence}⟧`
    sequence += 1
    internalValues.set(token, value)
    return token
  }

  let masked = source.replace(/^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?^ {0,3}\1[^\n]*(?:\n|$)/gmu, (block) =>
    protect(block),
  )
  masked = masked.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/giu, (block) => protect(block))
  masked = masked.replace(/^( {0,3}:::[ \t]*(?:[A-Za-z][A-Za-z0-9-]*(?=[ \t]|$))?(?:[ \t]+|$))/gmu, (directive) =>
    protect(directive),
  )
  masked = masked.replace(/(`+)([\s\S]*?)\1/gu, (code) => protect(code))
  masked = masked.replace(/\$\$[\s\S]*?\$\$/gu, (formula) => protect(formula))
  masked = masked.replace(/\\\[[\s\S]*?\\\]/gu, (formula) => protect(formula))
  masked = masked.replace(/\\\((?:(?!\\\))[^\n])*\\\)/gu, (formula) => protect(formula))
  masked = masked.replace(/(?<!\\)\$(?!\s)(?:\\.|[^$\n])+(?<!\s)\$/gu, (formula) => protect(formula))
  masked = masked.replace(/^ {0,3}(?:<{3}|={3})\s+.*$/gmu, (line) => protect(line))
  masked = masked.replace(/^ {0,3}(?:[-*_]\s*){3,}$/gmu, (line) => protect(line))
  masked = masked.replace(/^(\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?\s*)$/gmu, (line) => protect(line))
  masked = masked.replace(/^(\s*\[(?!\^)[^\]\n]+\]:\s+\S+.*)$/gmu, (line) => protect(line))
  masked = masked.replace(/\[\^[^\]\n]+\]/gu, (footnote) => protect(footnote))
  masked = masked.replace(
    /(!?\[)([^\]\n]+)(\]\((?:\\.|[^)\n])+\))/gu,
    (_match, opening: string, label: string, suffix: string) => {
      const localizedSuffix = localizeLinkSuffix(suffix, locale)
      return protectWholeLinks
        ? protect(`${opening}${label}${localizedSuffix}`)
        : `${protect(opening)}${label}${protect(localizedSuffix)}`
    },
  )
  masked = masked.replace(
    /(\[)([^\]\n]+)(\]\[[^\]\n]*\])/gu,
    (_match, opening: string, label: string, suffix: string) =>
      protectWholeLinks ? protect(`${opening}${label}${suffix}`) : `${protect(opening)}${label}${protect(suffix)}`,
  )
  masked = masked.replace(/<[^>\n]+>/gu, (tag) => protect(localizeHtmlTag(tag, locale)))
  masked = masked.replace(/\bhttps?:\/\/[^\s<>)\]]+/giu, (url) => protect(url))
  masked = masked.replace(DOMAIN_NAME_PATTERN, (domain) => protect(domain))
  masked = masked.replace(/\{#[A-Za-z_][\w:.-]*\}/gu, (anchor) => protect(anchor))
  masked = masked.replace(/&(?:#\d+|#x[0-9a-f]+|[a-z][a-z0-9]+);/giu, (entity) => protect(entity))
  masked = masked.replace(PROSE_EXAMPLE_IDENTIFIER_PATTERN, (identifier) => protect(identifier))
  masked = masked.replace(TECHNICAL_TERM_PATTERN, (term) => protect(term))
  masked = masked.replace(CAMEL_CASE_IDENTIFIER_PATTERN, (term) => protect(term))
  masked = masked.replace(UPPERCASE_IDENTIFIER_PATTERN, (term) =>
    shouldProtectUppercaseIdentifier(term) ? protect(term) : term,
  )
  masked = masked.replace(/[*_~]{1,3}/gu, (delimiter) => protect(delimiter))
  masked = masked.replace(/\|/gu, (delimiter) => protect(delimiter))
  masked = masked.replace(/^(\s*(?:#{1,6}|>|[-+*]|\d+[.)]|:::\s*[A-Za-z-]*|\[\^[^\]\n]+\]:)\s+)/gmu, (prefix) =>
    protect(prefix),
  )
  masked = masked.replace(/\n/gu, (newline) => protect(newline))

  const values = new Map<string, string>()
  let markerSequence = 0
  for (const [internalToken, value] of internalValues) {
    const token = `[PH${markerSequence.toString().padStart(6, '0')}]`
    markerSequence += 1
    values.set(token, value)
    const rendered = markerStyle === 'html' ? `<span class="notranslate">${token}</span>` : token
    masked = masked.replaceAll(internalToken, rendered)
  }

  return {
    masked,
    valueForMarker(marker: string): string | undefined {
      const token = /\[PH\d{6}\]/u.exec(marker)?.[0]
      return token ? values.get(token) : undefined
    },
    restore(translated: string): string {
      let restored = translated.replace(/\[\s*PH\s*([0-9][0-9\s,._-]*)\s*\]/giu, (candidate, encodedIndex: string) => {
        const digits = encodedIndex.replace(/\D/gu, '')
        if (!digits) return candidate
        const index = Number.parseInt(digits, 10)
        if (!Number.isSafeInteger(index)) return candidate
        const canonical = `[PH${index.toString().padStart(6, '0')}]`
        return values.has(canonical) ? canonical : candidate
      })
      for (const [token, value] of values) {
        const escapedToken = token.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')
        const wrapped = new RegExp(`<span\\b[^>]*>\\s*${escapedToken}\\s*</span>`, 'gu')
        restored = restored.replace(wrapped, token)
        const occurrences = restored.split(token).length - 1
        if (occurrences !== 1) {
          const carriers = [...values.entries()]
            .filter(([otherToken, value]) => otherToken !== token && value.includes(token))
            .map(([otherToken]) => otherToken)
          const carrierDetail = carriers.length ? `; nested in ${carriers.join(', ')}` : ''
          throw new Error(`Translation changed protected marker ${token} (${occurrences} occurrences${carrierDetail})`)
        }
        const markerIndex = restored.indexOf(token)
        const previous = markerIndex > 0 ? restored[markerIndex - 1] : ''
        const next = restored[markerIndex + token.length] ?? ''
        let replacement = value
        if (/[\p{L}\p{N}]$/u.test(previous) && /^[\p{L}\p{N}]/u.test(replacement)) {
          replacement = ` ${replacement}`
        }
        if (/[\p{L}\p{N}]$/u.test(replacement) && /^[\p{L}\p{N}]/u.test(next)) {
          replacement = `${replacement} `
        }
        restored = restored.replace(token, () => replacement)
      }
      return restored
    },
  }
}

export function chunkForTranslation(content: string, maximumCharacters = MAX_REQUEST_CHARACTERS): string[] {
  if (!Number.isInteger(maximumCharacters) || maximumCharacters < 128) {
    throw new Error('Translation chunk size must be an integer of at least 128 characters')
  }
  const chunks: string[] = []
  let remaining = content
  while (remaining.length > maximumCharacters) {
    const minimumBalancedCharacters = Math.ceil(maximumCharacters / 2)
    const boundaryAtOrBefore = (limit: number): number | undefined => {
      const candidates = [
        remaining.lastIndexOf('\n\n', limit),
        remaining.lastIndexOf('\n', limit),
        remaining.lastIndexOf('. ', limit),
        remaining.lastIndexOf('; ', limit),
        remaining.lastIndexOf(': ', limit),
        remaining.lastIndexOf(', ', limit),
        remaining.lastIndexOf(' ', limit),
      ]
      const boundary = candidates.find((candidate) => candidate >= minimumBalancedCharacters)
      return boundary === undefined ? undefined : boundary + (remaining.startsWith('\n\n', boundary) ? 2 : 1)
    }

    let cut = maximumCharacters
    const preferredBoundary = boundaryAtOrBefore(cut)
    if (preferredBoundary !== undefined) cut = preferredBoundary
    if (remaining.length - cut < minimumBalancedCharacters) {
      const balancedBoundary = boundaryAtOrBefore(Math.ceil(remaining.length / 2))
      if (balancedBoundary !== undefined && remaining.length - balancedBoundary >= minimumBalancedCharacters) {
        cut = balancedBoundary
      }
    }

    const openSpan = remaining.lastIndexOf('<span', cut)
    const closeSpan = remaining.lastIndexOf('</span>', cut)
    if (openSpan > closeSpan) cut = openSpan
    for (const match of remaining.matchAll(/\[PH\d{6}\]/gu)) {
      const start = match.index
      if (start >= cut) break
      if (start + match[0].length > cut) {
        cut = start
        break
      }
    }
    if (cut <= 0) throw new Error('Unable to split translation input safely')

    chunks.push(remaining.slice(0, cut))
    remaining = remaining.slice(cut)
  }
  if (remaining) chunks.push(remaining)
  return chunks
}

function providerLanguageCode(provider: TranslationProvider, locale: DocsLocale): string {
  return provider.languageCode?.(locale) ?? GOOGLE_LANGUAGE_CODES[locale.key] ?? locale.key
}

async function translateBatch(
  provider: TranslationProvider,
  texts: readonly string[],
  targetLanguage: string,
): Promise<string[]> {
  if (texts.length === 0) return []
  try {
    return await requestTranslationBatch(provider, texts, targetLanguage)
  } catch (error) {
    if (!isMateriallyShortProviderError(error)) throw error

    // The Python bridge rejects the whole request when any NLLB hypothesis
    // trips its token-length guard. Bisect the batch to isolate that input,
    // then retry only the failed prose in sentence-sized chunks. The original
    // guard stays active for every retry and the restored unit is checked again
    // by translationCompletenessError.
    if (texts.length > 1) {
      const midpoint = Math.ceil(texts.length / 2)
      const left = await translateBatch(provider, texts.slice(0, midpoint), targetLanguage)
      const right = await translateBatch(provider, texts.slice(midpoint), targetLanguage)
      return [...left, ...right]
    }

    const [source] = texts
    const retryChunks = chunksForIncompleteRetry(
      source,
      ['jpn_Jpan', 'zho_Hans', 'zho_Hant'].includes(targetLanguage) ? 8 : 15,
    )
    if (retryChunks.length === 1 && retryChunks[0] === source) {
      const sourceContext = JSON.stringify(source.length > 180 ? `${source.slice(0, 177)}...` : source)
      throw new Error(
        `translation provider rejected an indivisible source chunk (${sourceContext}): ${
          error instanceof Error ? error.message : String(error)
        }`,
        { cause: error },
      )
    }
    const translations = await translateBatch(provider, retryChunks, targetLanguage)
    return [
      joinTranslatedChunks(retryChunks, translations, ['jpn_Jpan', 'zho_Hans', 'zho_Hant'].includes(targetLanguage)),
    ]
  }
}

async function requestTranslationBatch(
  provider: TranslationProvider,
  texts: readonly string[],
  targetLanguage: string,
): Promise<string[]> {
  if (provider.translateBatch) return provider.translateBatch(texts, targetLanguage)
  return Promise.all(texts.map((text) => provider.translate(text, targetLanguage)))
}

function isMateriallyShortProviderError(error: unknown): boolean {
  const visited = new Set<unknown>()
  let current: unknown = error
  while (current instanceof Error && !visited.has(current)) {
    if (current.message.includes('translation output is materially shorter than its source')) return true
    visited.add(current)
    current = current.cause
  }
  return false
}

interface FragmentPlan {
  pieceIndex: number
  prefix: string
  suffix: string
  firstUnit: number
  unitCount: number
}

/**
 * Translate only the natural-language text between protected markers.
 *
 * NLLB tokenization can omit or duplicate unknown placeholder tokens. Keeping
 * the generated marker spans out of the model input makes reconstruction
 * deterministic even when the model has no representation for those markers.
 */
export async function translateProtectedFragments(
  protectedMarkdown: ProtectedMarkdown,
  targetLanguage: string,
  provider: TranslationProvider,
): Promise<string> {
  const markerPattern = /(<span class="notranslate">\[PH\d{6}\]<\/span>)/gu
  const exactMarkerPattern = /^<span class="notranslate">\[PH\d{6}\]<\/span>$/u
  const pieces = protectedMarkdown.masked.split(markerPattern)
  const plans: FragmentPlan[] = []
  const units: string[] = []

  for (let pieceIndex = 0; pieceIndex < pieces.length; pieceIndex += 1) {
    const piece = pieces[pieceIndex]
    if (!piece || exactMarkerPattern.test(piece)) continue

    const whitespace = /^(\s*(?:[,.:;!?]\s*)?)([\s\S]*?)(\s*)$/u.exec(piece)
    if (!whitespace || !whitespace[2]) continue
    if (!/\p{L}/u.test(whitespace[2])) continue
    const chunks = chunkForTranslation(whitespace[2], 128)
    plans.push({
      pieceIndex,
      prefix: whitespace[1],
      suffix: whitespace[3],
      firstUnit: units.length,
      unitCount: chunks.length,
    })
    units.push(...chunks)
  }

  const translations = await translateBatch(provider, units, targetLanguage)
  if (translations.length !== units.length || translations.some((translation) => typeof translation !== 'string')) {
    throw new Error(`Translation provider returned ${translations.length} results for ${units.length} fragments`)
  }

  for (const plan of plans) {
    const sourceChunks = units.slice(plan.firstUnit, plan.firstUnit + plan.unitCount)
    const translatedChunks = translations.slice(plan.firstUnit, plan.firstUnit + plan.unitCount)
    let translated = joinTranslatedChunks(
      sourceChunks,
      translatedChunks,
      ['jpn_Jpan', 'zho_Hans', 'zho_Hant'].includes(targetLanguage),
    )
    const previousMarker = pieces[plan.pieceIndex - 1]
    const nextMarker = pieces[plan.pieceIndex + 1]
    const previousValue =
      previousMarker && exactMarkerPattern.test(previousMarker)
        ? protectedMarkdown.valueForMarker(previousMarker)
        : undefined
    const nextValue =
      nextMarker && exactMarkerPattern.test(nextMarker) ? protectedMarkdown.valueForMarker(nextMarker) : undefined

    // Fragment-only translation deliberately hides protected markers from the
    // model. Some languages then drop an English possessive, parenthesis, or
    // hyphen at that boundary. Keep restored identifiers as separate words
    // even when the translated fragment no longer supplies the punctuation.
    if (previousValue && /[\p{L}\p{N}]$/u.test(previousValue) && /^[\p{L}\p{N}]/u.test(translated) && !plan.prefix) {
      translated = ` ${translated}`
    }
    if (nextValue && /[\p{L}\p{N}]$/u.test(translated) && /^[\p{L}\p{N}]/u.test(nextValue) && !plan.suffix) {
      translated = `${translated} `
    }

    pieces[plan.pieceIndex] = plan.prefix + translated + plan.suffix
  }
  return protectedMarkdown.restore(pieces.join(''))
}

interface MarkdownTranslationUnit {
  completenessMinimumLetters?: number
  content: string
  markdownTableCell?: boolean
  translate: boolean
}

type MarkdownLineKind = 'blockquote' | 'directive' | 'footnote' | 'heading' | 'html' | 'list' | 'plain' | 'table'

function markdownLineKind(line: string): MarkdownLineKind {
  if (/^ {0,3}#{1,6}[ \t]+/u.test(line)) return 'heading'
  if (/^ {0,3}(?:[-+*]|\d+[.)])[ \t]+/u.test(line)) return 'list'
  if (/^ {0,3}\[\^[^\]\n]+\]:[ \t]+/u.test(line)) return 'footnote'
  if (/^ {0,3}>[ \t]?/u.test(line)) return 'blockquote'
  if (/^ {0,3}\|/u.test(line)) return 'table'
  if (/^ {0,3}:::/u.test(line)) return 'directive'
  if (/^ {0,3}<[A-Za-z!/]/u.test(line)) return 'html'
  return 'plain'
}

function logicalProseUnits(lines: readonly string[]): string[] {
  const units: string[] = []
  let current = ''
  let currentKind: MarkdownLineKind | undefined

  const flush = () => {
    if (current) units.push(current)
    current = ''
    currentKind = undefined
  }

  for (const line of lines) {
    const kind = markdownLineKind(line)
    if (!current) {
      current = line
      currentKind = kind
      continue
    }

    if (kind === 'plain' && currentKind === 'plain') {
      current += ` ${line.trim()}`
      continue
    }
    if (
      kind === 'plain' &&
      (currentKind === 'list' || currentKind === 'blockquote' || currentKind === 'footnote') &&
      /^\s+/u.test(line)
    ) {
      current += ` ${line.trim()}`
      continue
    }
    if (kind === 'blockquote' && currentKind === 'blockquote') {
      current += ` ${line.replace(/^ {0,3}>[ \t]?/u, '').trim()}`
      continue
    }

    flush()
    current = line
    currentKind = kind
  }
  flush()
  return units
}

/**
 * Split Markdown into complete prose units while preserving literal blocks.
 *
 * Soft-wrapped paragraph and list continuation lines are joined before
 * translation so a local model sees complete sentences instead of isolated
 * line fragments.
 */
export function markdownTranslationUnits(source: string): MarkdownTranslationUnit[] {
  const units: MarkdownTranslationUnit[] = []
  const lines = source.split('\n')
  let prose: string[] = []

  const pushProse = (hasFollowingNewline: boolean) => {
    const logical = logicalProseUnits(prose)
    for (const [index, content] of logical.entries()) {
      units.push({ content, translate: true })
      if (index + 1 < logical.length || hasFollowingNewline) units.push({ content: '\n', translate: false })
    }
    prose = []
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const hasFollowingNewline = index + 1 < lines.length

    const fence = /^ {0,3}(`{3,}|~{3,})/u.exec(line)
    const script = /^ {0,3}<(script|style)\b/iu.exec(line)
    const displayMath = /^ {0,3}(?:\$\$|\\\[)\s*$/u.test(line)
    if (fence || script || displayMath) {
      pushProse(false)
      const literal: string[] = [line]
      if (fence) {
        for (index += 1; index < lines.length; index += 1) {
          literal.push(lines[index])
          if (new RegExp(`^ {0,3}${fence[1][0]}{${fence[1].length},}\\s*$`, 'u').test(lines[index])) break
        }
      } else if (script) {
        const close = new RegExp(`</${script[1]}>`, 'iu')
        if (!close.test(line)) {
          for (index += 1; index < lines.length; index += 1) {
            literal.push(lines[index])
            if (close.test(lines[index])) break
          }
        }
      } else if (!(line.trim() === '$$' && line.indexOf('$$') !== line.lastIndexOf('$$'))) {
        const close = displayMath && line.trim() === '$$' ? /^\s*\$\$\s*$/u : /^\s*\\\]\s*$/u
        for (index += 1; index < lines.length; index += 1) {
          literal.push(lines[index])
          if (close.test(lines[index])) break
        }
      }
      units.push({ content: literal.join('\n'), translate: false })
      if (index + 1 < lines.length) units.push({ content: '\n', translate: false })
      continue
    }

    if (line === '') {
      pushProse(true)
      if (hasFollowingNewline) units.push({ content: '\n', translate: false })
      continue
    }
    prose.push(line)
    if (!hasFollowingNewline) pushProse(false)
  }

  return units
}

interface InlineTranslationPlan {
  completenessContext: TranslationCompletenessContext
  completenessMinimumLetters: number
  protectedMarkdown: ProtectedMarkdown
  firstChunk: number
  chunkCount: number
  prefix: string
  source: string
  suffix: string
}

export interface TranslationCompletenessContext {
  markdownTableCell: boolean
}

function removeTranslatableEmphasis(source: string): string {
  const protectedSource = protectMachineTranslationLiterals(source)
  const normalized = protectedSource.masked
    .replace(/(\*\*|__|~~)(?=\S)([\s\S]*?\S)\1/gu, '$2')
    .replace(/(?<![\p{L}\p{N}])([*_])(?=\S)([\s\S]*?\S)\1(?![\p{L}\p{N}])/gu, '$2')
  return protectedSource.restore(normalized)
}

interface MarkdownSourceRange {
  end: number
  start: number
}

function markdownLinkOpaqueRanges(source: string): MarkdownSourceRange[] {
  const ranges: MarkdownSourceRange[] = []
  const patterns = [
    /^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?^ {0,3}\1[^\n]*(?:\n|$)/gmu,
    /<(script|style|code)\b[^>]*>[\s\S]*?<\/\1>/giu,
    /(`+)([\s\S]*?)\1/gu,
    /\$\$[\s\S]*?\$\$/gu,
    /\\\[[\s\S]*?\\\]/gu,
    /\\\((?:(?!\\\))[^\n])*\\\)/gu,
    /(?<!\\)\$(?!\s)(?:\\.|[^$\n])+(?<!\s)\$/gu,
  ]
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const start = match.index ?? 0
      ranges.push({ start, end: start + match[0].length })
    }
  }
  return ranges
}

function linkStartsInsideOpaqueRange(match: RegExpMatchArray, ranges: readonly MarkdownSourceRange[]): boolean {
  const start = match.index ?? 0
  return ranges.some((range) => start >= range.start && start < range.end)
}

function containsMarkdownLink(source: string): boolean {
  const ranges = markdownLinkOpaqueRanges(source)
  return [/!?\[[^\]\n]+\]\((?:\\.|[^)\n])+\)/gu, /\[[^\]\n]+\]\[[^\]\n]*\]/gu].some((pattern) =>
    [...source.matchAll(pattern)].some((match) => !linkStartsInsideOpaqueRange(match, ranges)),
  )
}

interface DirectMarkdownLink {
  destination: string
  end: number
  label: string
  labelEnd: number
  labelStart: number
}

function directMarkdownLinks(source: string): DirectMarkdownLink[] {
  const ranges = markdownLinkOpaqueRanges(source)
  return [...source.matchAll(/(!?\[)([^\]\n]*)(\]\((?:\\.|[^)\n])+\))/gu)]
    .filter((match) => !linkStartsInsideOpaqueRange(match, ranges))
    .flatMap((match) => {
      const destination = /\]\(\s*(?:<([^>\n]+)>|([^\s)\n]+))/u.exec(match[0])
      if (!destination) return []
      const start = match.index ?? 0
      const labelStart = start + match[1].length
      return [
        {
          destination: destination[1] ?? destination[2],
          end: start + match[0].length,
          label: match[2],
          labelEnd: labelStart + match[2].length,
          labelStart,
        },
      ]
    })
}

function synchronizeTechnicalLinkLabelsInUnit(source: string, translated: string, locale: DocsLocale): string {
  const sourceLinks = directMarkdownLinks(source).filter((link) => isPreservedTechnicalLinkLabel(link.label.trim()))
  if (sourceLinks.length === 0) return translated
  const translatedLinks = directMarkdownLinks(translated)
  const used = new Set<number>()
  const replacements: Array<{ end: number; start: number; value: string }> = []

  for (const sourceLink of sourceLinks) {
    const expectedDestination = localizeRoute(sourceLink.destination, locale)
    const candidate = translatedLinks.findIndex(
      (link, index) => !used.has(index) && link.destination === expectedDestination,
    )
    if (candidate < 0) continue
    used.add(candidate)
    const translatedLink = translatedLinks[candidate]
    const label = sourceLink.label.trim()
    if (translatedLink.label.trim() === label) continue
    replacements.push({ start: translatedLink.labelStart, end: translatedLink.labelEnd, value: label })
  }

  let output = translated
  for (const replacement of replacements.sort((left, right) => right.start - left.start)) {
    output = output.slice(0, replacement.start) + replacement.value + output.slice(replacement.end)
  }
  return output
}

/** Restore source-defined protocol labels while retaining localized destinations. */
export function synchronizeTechnicalLinkLabels(source: string, translated: string, locale: DocsLocale): string {
  const sourceUnits = markdownTranslationUnits(source).filter((unit) => unit.translate)
  const translatedUnits = markdownTranslationUnits(translated)
  const translatedProseUnits = translatedUnits.filter((unit) => unit.translate)
  if (sourceUnits.length !== translatedProseUnits.length) {
    return synchronizeTechnicalLinkLabelsInUnit(source, translated, locale)
  }

  let proseIndex = 0
  for (const unit of translatedUnits) {
    if (!unit.translate) continue
    unit.content = synchronizeTechnicalLinkLabelsInUnit(sourceUnits[proseIndex].content, unit.content, locale)
    proseIndex += 1
  }
  return translatedUnits.map((unit) => unit.content).join('')
}

async function replaceMarkdownLinkLabels(
  source: string,
  pattern: RegExp,
  locale: DocsLocale,
  provider: TranslationProvider,
): Promise<string> {
  const ranges = markdownLinkOpaqueRanges(source)
  const matches = [...source.matchAll(pattern)].filter((match) => !linkStartsInsideOpaqueRange(match, ranges))
  if (matches.length === 0) return source
  const labels = await Promise.all(
    matches.map((match) =>
      isPreservedTechnicalLinkLabel(match[2].trim()) ? match[2] : translateMarkdown(match[2], locale, provider),
    ),
  )
  let output = ''
  let cursor = 0
  for (const [index, match] of matches.entries()) {
    const start = match.index ?? 0
    output += source.slice(cursor, start)
    output += `${match[1]}${labels[index].trim()}${match[3]}`
    cursor = start + match[0].length
  }
  return output + source.slice(cursor)
}

async function localizeMarkdownLinkLabels(
  source: string,
  locale: DocsLocale,
  provider: TranslationProvider,
): Promise<string> {
  const direct = await replaceMarkdownLinkLabels(source, /(!?\[)([^\]\n]+)(\]\((?:\\.|[^)\n])+\))/gu, locale, provider)
  const referenced = await replaceMarkdownLinkLabels(direct, /(\[)([^\]\n]+)(\]\[[^\]\n]*\])/gu, locale, provider)
  return referenced
}

function detachBoundaryMarkers(
  masked: string,
  protectedMarkdown: ProtectedMarkdown,
): { core: string; prefix: string; suffix: string } {
  const marker = /\[PH\d{6}\]/u
  const structuralPrefix = /^\s*(?:#{1,6}|>|[-+*]|\d+[.)]|:::\s*[A-Za-z-]*|\[\^[^\]\n]+\]:)\s+$/u
  const structuralSuffix = /^\{#[A-Za-z_][\w:.-]*\}$/u
  let core = masked
  let prefix = ''
  let suffix = ''

  for (;;) {
    const leading = /^\s*(\[PH\d{6}\])\s*/u.exec(core)
    if (!leading) break
    const value = protectedMarkdown.valueForMarker(leading[1])
    if (value === undefined || (/[\p{L}\p{N}]/u.test(value) && !structuralPrefix.test(value))) break
    prefix += leading[0]
    core = core.slice(leading[0].length)
  }
  for (;;) {
    const trailing = /\s*(\[PH\d{6}\])\s*$/u.exec(core)
    if (!trailing) break
    const value = protectedMarkdown.valueForMarker(trailing[1])
    if (value === undefined || (/[\p{L}\p{N}]/u.test(value) && !structuralSuffix.test(value))) break
    suffix = trailing[0] + suffix
    core = core.slice(0, trailing.index)
  }

  if (!marker.test(core)) return { core, prefix, suffix }
  return { core, prefix, suffix }
}

function translationLetterCount(content: string): number {
  return [...content.matchAll(/[\p{L}\p{M}]/gu)].length
}

function endsWithContinuationPunctuation(content: string): boolean {
  return /[,;،؛，；](?:["')\]}»”]*)$/u.test(content.trim())
}

function translationCompletenessError(
  source: string,
  translated: string,
  locale: DocsLocale,
  minimumSourceLetters = 80,
): string | undefined {
  const sourceLetters = translationLetterCount(source)
  const translatedLetters = translationLetterCount(translated)
  const ratio = translatedLetters / sourceLetters
  const sourceSentences = sentenceCount(source, 'en')
  const translatedSentences = sentenceCount(translated, locale.lang)
  if (
    sourceLetters >= minimumSourceLetters &&
    sourceSentences >= 2 &&
    translatedSentences < sourceSentences &&
    ratio < sentenceCoverageMinimumRatio(locale.key)
  ) {
    return `output has incomplete sentence coverage (expected at least ${sourceSentences}, found ${translatedSentences}; ${ratio.toFixed(2)} of source letters)`
  }
  if (sourceLetters >= minimumSourceLetters && ratio <= translationMinimumRatio(locale.key)) {
    return `output is materially short (${ratio.toFixed(2)} of source letters)`
  }
  if (
    sourceLetters >= minimumSourceLetters &&
    /[.!?](?:["')\]}]*)$/u.test(source.trim()) &&
    endsWithContinuationPunctuation(translated)
  ) {
    return 'output ends with continuation punctuation'
  }
  return undefined
}

function joinTranslatedChunks(
  sourceChunks: readonly string[],
  translatedChunks: readonly string[],
  compactBoundaries: boolean,
): string {
  let joined = translatedChunks[0] ?? ''
  for (let index = 1; index < translatedChunks.length; index += 1) {
    const next = translatedChunks[index]
    const sourceHadWhitespace = /\s$/u.test(sourceChunks[index - 1]) || /^\s/u.test(sourceChunks[index])
    const connectiveBoundary = /\bso\s*$/iu.test(sourceChunks[index - 1])
    if (
      compactBoundaries &&
      connectiveBoundary &&
      !/[.!?。！？,，、;；:：]\s*$/u.test(joined) &&
      !/^\s*[.!?。！？,，、;；:：]/u.test(next)
    ) {
      joined += '。'
    } else if (sourceHadWhitespace && !compactBoundaries && !/\s$/u.test(joined) && !/^\s/u.test(next)) {
      joined += ' '
    }
    joined += next
  }
  return joined
}

function chunksAtClauseBoundaries(content: string, minimumClauseLetters = 15): string[] {
  const clauses: string[] = []
  let start = 0
  for (const match of content.matchAll(/[,;:،؛，；：、](?:\s+|(?=\S)|$)/gu)) {
    const end = match.index + match[0].length
    clauses.push(content.slice(start, end))
    start = end
  }
  if (start < content.length) clauses.push(content.slice(start))
  if (clauses.length < 2) return [content]

  const chunks: string[] = []
  let consumed = 0
  let pending = ''
  for (const clause of clauses) {
    pending += clause
    consumed += clause.length
    const remaining = content.slice(consumed)
    const pendingLetters = translationLetterCount(pending.replace(/\[PH\d{6}\]/gu, ''))
    const remainingLetters = translationLetterCount(remaining.replace(/\[PH\d{6}\]/gu, ''))
    if (remaining && pendingLetters >= minimumClauseLetters && remainingLetters >= minimumClauseLetters) {
      chunks.push(pending)
      pending = ''
    }
  }
  if (pending) chunks.push(pending)
  return chunks.length > 1 ? chunks : [content]
}

function chunksAtEnglishConnectiveBoundaries(content: string): string[] {
  const chunks: string[] = []
  let start = 0
  for (const match of content.matchAll(/\bso\b\s+|(?<=\s)(?:if|for|from)\s+/giu)) {
    const cut = /^(?:if|for|from)\b/iu.test(match[0]) ? match.index : match.index + match[0].length
    const pending = content.slice(start, cut)
    const remaining = content.slice(cut)
    const pendingLetters = translationLetterCount(pending.replace(/\[PH\d{6}\]/gu, ''))
    const remainingLetters = translationLetterCount(remaining.replace(/\[PH\d{6}\]/gu, ''))
    if (pendingLetters < 20 || remainingLetters < 20) continue
    chunks.push(pending)
    start = cut
  }
  if (start > 0) chunks.push(content.slice(start))
  return chunks.length > 1 ? chunks : [content]
}

export function isCompleteShortStructuralLeadIn(source: string, translated: string): boolean {
  if (!hasExactProtectedMarkerMultiset(source, translated)) return false

  const withoutMarkers = (content: string): string => content.replace(/\[PH\d{6}\]/gu, '')
  const sourceWithoutMarkers = withoutMarkers(source)
  const translatedWithoutMarkers = withoutMarkers(translated)
  const sourceLetters = translationLetterCount(sourceWithoutMarkers)
  const translatedLetters = translationLetterCount(translatedWithoutMarkers)
  const hasEnoughTargetLetters =
    (sourceLetters <= 32 && translatedLetters >= 3) ||
    (sourceLetters > 32 && sourceLetters <= 48 && translatedLetters >= 7)
  return (
    sourceLetters > 0 &&
    sourceLetters <= 48 &&
    hasEnoughTargetLetters &&
    /:\s*$/u.test(sourceWithoutMarkers) &&
    /[:：]\s*$/u.test(translatedWithoutMarkers)
  )
}

function hasExactTechnicalIdentifierSet(source: string, translated: string): boolean {
  const sourceIdentifiers = technicalIdentifiers(source)
  const translatedIdentifiers = technicalIdentifiers(translated)
  return (
    sourceIdentifiers.size === translatedIdentifiers.size &&
    [...sourceIdentifiers].every(
      ([identifier, expectedCount]) => translatedIdentifiers.get(identifier) === expectedCount,
    )
  )
}

export function isCompleteCompactCjkTableLabel(
  source: string,
  translated: string,
  locale: DocsLocale,
  context: TranslationCompletenessContext,
): boolean {
  if (!['ja', 'zh-hans', 'zh-hant'].includes(locale.key) || !context.markdownTableCell) return false
  if (!hasExactProtectedMarkerMultiset(source, translated)) return false

  const withoutMarkers = (content: string): string => content.replace(/\[PH\d{6}\]/gu, '')
  const sourceWithoutMarkers = withoutMarkers(source)
  const translatedWithoutMarkers = withoutMarkers(translated)
  const sourceLetters = translationLetterCount(sourceWithoutMarkers)
  const translatedLetters = translationLetterCount(translatedWithoutMarkers)
  const sourceWords = sourceWithoutMarkers.match(/\p{L}+/gu) ?? []
  const sourceClauses = sourceWithoutMarkers
    .split(/[,;:،؛，；：、]/u)
    .map((clause) => translationLetterCount(clause))
    .filter((letters) => letters > 0)
  const translatedClauses = translatedWithoutMarkers
    .split(/[,;:،؛，；：、]/u)
    .map((clause) => translationLetterCount(clause))
    .filter((letters) => letters > 0)
  const hasCompleteCompactClausePair =
    sourceLetters <= 55 &&
    translatedLetters >= 10 &&
    sourceClauses.length === 2 &&
    translatedClauses.length === 2 &&
    sourceClauses.every((letters) => letters >= 20) &&
    translatedClauses.every((letters) => letters >= 4)
  const hasEnoughTargetLetters =
    (sourceLetters <= 40 &&
      (translatedLetters >= 6 ||
        (sourceLetters >= 20 && sourceLetters <= 24 && sourceWords.length === 2 && translatedLetters >= 4))) ||
    (sourceLetters >= 20 && sourceLetters <= 30 && translatedLetters >= 5) ||
    (sourceLetters > 40 && sourceLetters <= 80 && translatedLetters >= 12) ||
    hasCompleteCompactClausePair
  return (
    sourceLetters >= 20 &&
    sourceLetters <= 80 &&
    hasEnoughTargetLetters &&
    !/[.!?]/u.test(sourceWithoutMarkers) &&
    !endsWithContinuationPunctuation(translatedWithoutMarkers) &&
    !/、(?:["')\]}»”]*)\s*$/u.test(translatedWithoutMarkers) &&
    hasExactTechnicalIdentifierSet(sourceWithoutMarkers, translatedWithoutMarkers)
  )
}

export function isCompleteCompactCjkTableSentence(
  source: string,
  translated: string,
  locale: DocsLocale,
  context: TranslationCompletenessContext,
): boolean {
  if (!['ja', 'zh-hans', 'zh-hant'].includes(locale.key) || !context.markdownTableCell) return false
  if (!hasExactProtectedMarkerMultiset(source, translated)) return false

  const withoutMarkers = (content: string): string => content.replace(/\[PH\d{6}\]/gu, '')
  const sourceWithoutMarkers = withoutMarkers(source)
  const translatedWithoutMarkers = withoutMarkers(translated)
  const sourceLetters = translationLetterCount(sourceWithoutMarkers)
  const translatedLetters = translationLetterCount(translatedWithoutMarkers)
  return (
    sourceLetters >= 81 &&
    sourceLetters <= 120 &&
    translatedLetters >= 20 &&
    /[.!?](?:["')\]}]*)\s*$/u.test(sourceWithoutMarkers) &&
    /[.!?。！？](?:["')\]}»”]*)\s*$/u.test(translatedWithoutMarkers) &&
    hasExactTechnicalIdentifierSet(sourceWithoutMarkers, translatedWithoutMarkers)
  )
}

function isCompleteCompactCjkTableUnit(
  source: string,
  translated: string,
  locale: DocsLocale,
  context: TranslationCompletenessContext,
): boolean {
  return (
    isCompleteCompactCjkTableLabel(source, translated, locale, context) ||
    isCompleteCompactCjkTableSentence(source, translated, locale, context)
  )
}

export function isCompleteCompactCjkSentence(source: string, translated: string, locale: DocsLocale): boolean {
  if (!['ja', 'zh-hans', 'zh-hant'].includes(locale.key)) return false
  if (!hasExactProtectedMarkerMultiset(source, translated)) return false

  const withoutMarkers = (content: string): string => content.replace(/\[PH\d{6}\]/gu, '')
  const sourceWithoutMarkers = withoutMarkers(source)
  const translatedWithoutMarkers = withoutMarkers(translated)
  const sourceLetters = translationLetterCount(sourceWithoutMarkers)
  const translatedLetters = translationLetterCount(translatedWithoutMarkers)
  const hasCompactCoordinatedPair =
    sourceLetters <= 40 &&
    translatedLetters >= 7 &&
    /(?:,\s*)?\band\b/iu.test(sourceWithoutMarkers) &&
    /(?:および|並びに|[和与與及、,，])/u.test(translatedWithoutMarkers)
  const hasEnoughTargetLetters =
    (sourceLetters <= 40 && translatedLetters >= 11) ||
    (sourceLetters > 40 && sourceLetters <= 50 && translatedLetters >= Math.max(10, Math.ceil(sourceLetters * 0.22))) ||
    (sourceLetters > 50 && sourceLetters <= 60 && translatedLetters >= 12) ||
    (sourceLetters > 60 && sourceLetters <= 90 && translatedLetters >= Math.max(15, Math.ceil(sourceLetters * 0.22))) ||
    hasCompactCoordinatedPair
  return (
    sourceLetters >= 20 &&
    sourceLetters <= 90 &&
    hasEnoughTargetLetters &&
    /[.!?](?:["')\]}]*)\s*$/u.test(sourceWithoutMarkers) &&
    /[.!?。！？](?:["')\]}»”]*)\s*$/u.test(translatedWithoutMarkers) &&
    hasExactTechnicalIdentifierSet(sourceWithoutMarkers, translatedWithoutMarkers)
  )
}

export function isCompleteCompactCjkRetryPhrase(source: string, translated: string, locale: DocsLocale): boolean {
  if (!['ja', 'zh-hans', 'zh-hant'].includes(locale.key)) return false
  if (!hasExactProtectedMarkerMultiset(source, translated)) return false

  const withoutMarkers = (content: string): string => content.replace(/\[PH\d{6}\]/gu, '')
  const sourceWithoutMarkers = withoutMarkers(source)
  const translatedWithoutMarkers = withoutMarkers(translated)
  const sourceLetters = translationLetterCount(sourceWithoutMarkers)
  const translatedLetters = translationLetterCount(translatedWithoutMarkers)
  return (
    sourceLetters >= 20 &&
    sourceLetters <= 30 &&
    translatedLetters >= 5 &&
    !/[.!?,;:]/u.test(sourceWithoutMarkers) &&
    !endsWithContinuationPunctuation(translatedWithoutMarkers) &&
    !/、(?:["')\]}»”]*)\s*$/u.test(translatedWithoutMarkers) &&
    hasExactTechnicalIdentifierSet(sourceWithoutMarkers, translatedWithoutMarkers)
  )
}

export function isCompleteCompactCjkRetryClause(source: string, translated: string, locale: DocsLocale): boolean {
  if (!['ja', 'zh-hans', 'zh-hant'].includes(locale.key)) return false
  if (!hasExactProtectedMarkerMultiset(source, translated)) return false

  const withoutMarkers = (content: string): string => content.replace(/\[PH\d{6}\]/gu, '')
  const sourceWithoutMarkers = withoutMarkers(source)
  const translatedWithoutMarkers = withoutMarkers(translated)
  const sourceLetters = translationLetterCount(sourceWithoutMarkers)
  const translatedLetters = translationLetterCount(translatedWithoutMarkers)
  return (
    sourceLetters >= 8 &&
    sourceLetters <= 80 &&
    translatedLetters >= Math.max(2, Math.ceil(sourceLetters * 0.15)) &&
    /[,;:](?:["')\]}]*)\s*$/u.test(sourceWithoutMarkers) &&
    /[,，、;；:：](?:["')\]}»”]*)\s*$/u.test(translatedWithoutMarkers) &&
    hasExactTechnicalIdentifierSet(sourceWithoutMarkers, translatedWithoutMarkers)
  )
}

export function isCompleteCompactCjkRetryListTail(source: string, translated: string, locale: DocsLocale): boolean {
  if (!['ja', 'zh-hans', 'zh-hant'].includes(locale.key)) return false
  if (!hasExactProtectedMarkerMultiset(source, translated)) return false

  const withoutMarkers = (content: string): string => content.replace(/\[PH\d{6}\]/gu, '')
  const sourceWithoutMarkers = withoutMarkers(source)
  const translatedWithoutMarkers = withoutMarkers(translated)
  const sourceLetters = translationLetterCount(sourceWithoutMarkers)
  const translatedLetters = translationLetterCount(translatedWithoutMarkers)
  return (
    sourceLetters >= 25 &&
    sourceLetters <= 60 &&
    translatedLetters >= Math.max(8, Math.ceil(sourceLetters * 0.2)) &&
    /^\s*and\b/iu.test(sourceWithoutMarkers) &&
    /[.!?](?:["')\]}]*)\s*$/u.test(sourceWithoutMarkers) &&
    /[.!?。！？](?:["')\]}»”]*)\s*$/u.test(translatedWithoutMarkers) &&
    hasExactTechnicalIdentifierSet(sourceWithoutMarkers, translatedWithoutMarkers)
  )
}

function retryChunkCompletenessError(
  source: string,
  translated: string,
  locale: DocsLocale,
  context: TranslationCompletenessContext,
): string | undefined {
  const markerError = retryChunkMarkerError(source, translated)
  if (markerError) return markerError
  if (isCompleteCompactCjkTableUnit(source, translated, locale, context)) return undefined
  if (isCompleteCompactCjkSentence(source, translated, locale)) return undefined
  if (isCompleteCompactCjkRetryPhrase(source, translated, locale)) return undefined
  if (isCompleteCompactCjkRetryClause(source, translated, locale)) return undefined
  if (isCompleteCompactCjkRetryListTail(source, translated, locale)) return undefined
  const sourceWithoutMarkers = source.replace(/\[PH\d{6}\]/gu, '')
  if (
    ['ja', 'zh-hans', 'zh-hant'].includes(locale.key) &&
    translationLetterCount(sourceWithoutMarkers) >= 8 &&
    translationLetterCount(sourceWithoutMarkers) < 20 &&
    /[,;:](?:["')\]}]*)\s*$/u.test(sourceWithoutMarkers)
  ) {
    return 'output has incomplete compact clause coverage'
  }
  if (isCompleteShortStructuralLeadIn(source, translated)) return undefined
  const translatedWithoutMarkers = translated.replace(/\[PH\d{6}\]/gu, '')
  return translationCompletenessError(sourceWithoutMarkers, translatedWithoutMarkers, locale, 20)
}

export function hasExactProtectedMarkerMultiset(source: string, translated: string): boolean {
  const sourceMarkers = source.match(/\[PH\d{6}\]/gu) ?? []
  const translatedMarkers = translated.match(/\[PH\d{6}\]/gu) ?? []
  const sortedSourceMarkers = [...sourceMarkers].sort()
  const sortedTranslatedMarkers = [...translatedMarkers].sort()
  return (
    sortedSourceMarkers.length === sortedTranslatedMarkers.length &&
    sortedSourceMarkers.every((marker, index) => marker === sortedTranslatedMarkers[index])
  )
}

function retryChunkMarkerError(source: string, translated: string): string | undefined {
  if (hasExactProtectedMarkerMultiset(source, translated)) return undefined
  const sourceMarkers = source.match(/\[PH\d{6}\]/gu) ?? []
  const translatedMarkers = translated.match(/\[PH\d{6}\]/gu) ?? []
  return `output changed protected markers (expected ${sourceMarkers.join(', ') || 'none'}, found ${translatedMarkers.join(', ') || 'none'})`
}

function hasOnlyMissingProtectedMarkers(source: string, translated: string): boolean {
  const sourceMarkers = source.match(/\[PH\d{6}\]/gu) ?? []
  const translatedMarkers = translated.match(/\[PH\d{6}\]/gu) ?? []
  if (translatedMarkers.length >= sourceMarkers.length) return false
  const remaining = new Map<string, number>()
  for (const marker of sourceMarkers) remaining.set(marker, (remaining.get(marker) ?? 0) + 1)
  for (const marker of translatedMarkers) {
    const count = remaining.get(marker) ?? 0
    if (count === 0) return false
    remaining.set(marker, count - 1)
  }
  return true
}

async function recoverRetryChunkMarkers(
  source: string,
  targetLanguage: string,
  provider: TranslationProvider,
): Promise<string> {
  const markerPattern = /(\[PH\d{6}\])/gu
  const exactMarkerPattern = /^\[PH\d{6}\]$/u
  const pieces = source.split(markerPattern)
  const plans: FragmentPlan[] = []
  const units: string[] = []

  for (let pieceIndex = 0; pieceIndex < pieces.length; pieceIndex += 1) {
    const piece = pieces[pieceIndex]
    if (!piece || exactMarkerPattern.test(piece)) continue

    const whitespace = /^(\s*(?:[,.:;!?]\s*)?)([\s\S]*?)(\s*)$/u.exec(piece)
    if (!whitespace || !whitespace[2] || !/\p{L}/u.test(whitespace[2])) continue
    const chunks = chunkForTranslation(whitespace[2], 128)
    plans.push({
      pieceIndex,
      prefix: whitespace[1],
      suffix: whitespace[3],
      firstUnit: units.length,
      unitCount: chunks.length,
    })
    units.push(...chunks)
  }

  const translations = await translateBatch(provider, units, targetLanguage)
  if (translations.length !== units.length || translations.some((translation) => typeof translation !== 'string')) {
    throw new Error(`Translation provider returned ${translations.length} results for ${units.length} retry fragments`)
  }

  for (const plan of plans) {
    const sourceChunks = units.slice(plan.firstUnit, plan.firstUnit + plan.unitCount)
    const translatedChunks = translations.slice(plan.firstUnit, plan.firstUnit + plan.unitCount)
    pieces[plan.pieceIndex] =
      plan.prefix +
      joinTranslatedChunks(
        sourceChunks,
        translatedChunks,
        ['jpn_Jpan', 'zho_Hans', 'zho_Hant'].includes(targetLanguage),
      ) +
      plan.suffix
  }
  return pieces.join('')
}

const NON_TERMINAL_ENGLISH_ABBREVIATION =
  /(?:^|[\s("'‘“])(?:mr|mrs|ms|dr|prof|sr|jr|st|mt|vs|etc|e\.g|i\.e|no|fig|eq|sec|ch|vol|inc|ltd|co|corp)\.\s*$/iu

function isCompleteNaturalLanguageSentence(segment: string): boolean {
  const withoutMarkers = segment.replace(/\[PH\d{6}\]/gu, '')
  return (
    /\p{L}/u.test(withoutMarkers) &&
    /[.!?](?:["')\]}]*)\s*$/u.test(segment) &&
    !NON_TERMINAL_ENGLISH_ABBREVIATION.test(withoutMarkers)
  )
}

function chunksForIncompleteRetry(content: string, minimumClauseLetters = 15): string[] {
  const sentences: string[] = []
  let pending = ''
  for (const { segment } of new Intl.Segmenter('en', { granularity: 'sentence' }).segment(content)) {
    pending += segment
    if (!isCompleteNaturalLanguageSentence(segment)) continue
    sentences.push(pending)
    pending = ''
  }
  if (pending) sentences.push(pending)
  if (sentences.length === 0) sentences.push(content)

  const chunks = sentences.flatMap((sentence) => chunkForTranslation(sentence, 128))
  const commaCount = content.match(/,/gu)?.length ?? 0
  if (chunks.length > 1 && sentences.length === 1 && commaCount >= 2 && /,\s+(?:and|or)\b/iu.test(content)) {
    const listChunks = chunksAtClauseBoundaries(content, minimumClauseLetters)
    if (listChunks.length > 1) return listChunks
  }
  // Technical-term clarification can lengthen a unit past the normal chunk
  // limit. Preserve an available causal `so` boundary instead of accepting an
  // arbitrary mid-clause split; the compact-CJK joiner also knows how to join
  // this boundary safely. Other connective fallbacks retain their established
  // recursive-recovery behavior below.
  if (chunks.length > 1 && sentences.length === 1 && /\bso\b\s+/iu.test(content)) {
    const causalChunks = chunksAtEnglishConnectiveBoundaries(content)
    if (causalChunks.length > 1) return causalChunks
  }
  if (chunks.length === 1 && chunks[0] === content) {
    const punctuationChunks = chunksAtClauseBoundaries(content, minimumClauseLetters)
    if (punctuationChunks.length > 1) return punctuationChunks
    return chunksAtEnglishConnectiveBoundaries(content)
  }
  return chunks
}

async function translateRetryChunksWithCoverage(
  sourceChunks: readonly string[],
  locale: DocsLocale,
  provider: TranslationProvider,
  targetLanguage: string,
  context: TranslationCompletenessContext,
): Promise<string[]> {
  const minimumClauseLetters = ['ja', 'zh-hans', 'zh-hant'].includes(locale.key) ? 8 : 15
  let translations: string[]
  try {
    translations = await requestTranslationBatch(provider, sourceChunks, targetLanguage)
  } catch (error) {
    if (!isMateriallyShortProviderError(error)) throw error
    if (sourceChunks.length > 1) {
      const midpoint = Math.ceil(sourceChunks.length / 2)
      const left = await translateRetryChunksWithCoverage(
        sourceChunks.slice(0, midpoint),
        locale,
        provider,
        targetLanguage,
        context,
      )
      const right = await translateRetryChunksWithCoverage(
        sourceChunks.slice(midpoint),
        locale,
        provider,
        targetLanguage,
        context,
      )
      return [...left, ...right]
    }

    const [source] = sourceChunks
    const retryChunks = chunksForIncompleteRetry(source, minimumClauseLetters)
    if (retryChunks.length === 1 && retryChunks[0] === source) {
      const sourceContext = JSON.stringify(source.length > 180 ? `${source.slice(0, 177)}...` : source)
      throw new Error(
        `translation provider rejected an indivisible retry chunk (${sourceContext}): ${
          error instanceof Error ? error.message : String(error)
        }`,
        { cause: error },
      )
    }
    const retryTranslations = await translateRetryChunksWithCoverage(
      retryChunks,
      locale,
      provider,
      targetLanguage,
      context,
    )
    return [joinTranslatedChunks(retryChunks, retryTranslations, ['ja', 'zh-hans', 'zh-hant'].includes(locale.key))]
  }

  if (translations.length !== sourceChunks.length) {
    throw new Error(
      `Translation provider returned ${translations.length} results for ${sourceChunks.length} retry chunks`,
    )
  }

  const covered: string[] = []
  for (let index = 0; index < sourceChunks.length; index += 1) {
    const source = sourceChunks[index]
    const translated = translations[index]
    const incomplete = retryChunkCompletenessError(source, translated, locale, context)
    if (!incomplete) {
      covered.push(translated)
      continue
    }

    const markerError = retryChunkMarkerError(source, translated)
    if (markerError) {
      if (!hasOnlyMissingProtectedMarkers(source, translated)) {
        throw new Error(`semantic retry chunk ${index + 1}: ${markerError}`)
      }
      const recovered = await recoverRetryChunkMarkers(source, targetLanguage, provider)
      const recoveryError = retryChunkCompletenessError(source, recovered, locale, context)
      if (recoveryError) {
        throw new Error(`semantic retry chunk ${index + 1}: ${incomplete}; marker-fragment recovery ${recoveryError}`)
      }
      covered.push(recovered)
      continue
    }

    const retryChunks = chunksForIncompleteRetry(source, minimumClauseLetters)
    if (retryChunks.length === 1 && retryChunks[0] === source) {
      throw new Error(`semantic retry chunk ${index + 1}: ${incomplete}; no smaller safe boundary`)
    }
    const retryTranslations = await translateRetryChunksWithCoverage(
      retryChunks,
      locale,
      provider,
      targetLanguage,
      context,
    )
    covered.push(
      joinTranslatedChunks(retryChunks, retryTranslations, ['ja', 'zh-hans', 'zh-hant'].includes(locale.key)),
    )
  }
  return covered
}

interface RetriedInlineUnit {
  content: string
  validatedByCjkRetryChunks: boolean
}

async function retryIncompleteInlineUnit(
  source: string,
  locale: DocsLocale,
  provider: TranslationProvider,
  context: TranslationCompletenessContext,
): Promise<RetriedInlineUnit> {
  const protectedMarkdown = protectMarkdown(source, locale, 'identifier')
  const { core, prefix, suffix } = detachBoundaryMarkers(protectedMarkdown.masked, protectedMarkdown)
  if (!/\p{L}/u.test(core)) {
    return {
      content: protectedMarkdown.restore(prefix + core + suffix),
      validatedByCjkRetryChunks: false,
    }
  }
  const sourceChunks = chunksForIncompleteRetry(core)
  const targetLanguage = providerLanguageCode(provider, locale)
  const translations = await translateRetryChunksWithCoverage(sourceChunks, locale, provider, targetLanguage, context)
  const compactBoundaries = ['ja', 'zh-hans', 'zh-hant'].includes(locale.key)
  const restoreJoined = (translatedChunks: readonly string[]): string =>
    protectedMarkdown.restore(prefix + joinTranslatedChunks(sourceChunks, translatedChunks, compactBoundaries) + suffix)
  const candidate = restoreJoined(translations)
  const validatedByCjkRetryChunks =
    compactBoundaries &&
    sourceChunks.length >= 2 &&
    sourceChunks.every((chunk, index) => {
      if (/[.!?](?:["')\]}]*)\s*$/u.test(chunk)) {
        return /[.!?。！？](?:["')\]}»”]*)\s*$/u.test(translations[index])
      }
      if (/[,;:](?:["')\]}]*)\s*$/u.test(chunk)) {
        return /[,，、;；:：](?:["')\]}»”]*)\s*$/u.test(translations[index])
      }
      return false
    })

  if (
    isCompleteCompactCjkTableUnit(source, candidate, locale, context) ||
    !translationCompletenessError(source, candidate, locale) ||
    sourceChunks.length < 2
  ) {
    return { content: candidate, validatedByCjkRetryChunks }
  }

  const recoveredTranslations = [...translations]
  let retriedClause = false
  for (let index = 0; index < sourceChunks.length; index += 1) {
    const clauseChunks = chunksAtClauseBoundaries(sourceChunks[index])
    if (clauseChunks.length < 2) continue
    const clauseTranslations = await translateRetryChunksWithCoverage(
      clauseChunks,
      locale,
      provider,
      targetLanguage,
      context,
    )
    recoveredTranslations[index] = joinTranslatedChunks(clauseChunks, clauseTranslations, compactBoundaries)
    retriedClause = true
  }
  if (!retriedClause) return { content: candidate, validatedByCjkRetryChunks }

  return { content: restoreJoined(recoveredTranslations), validatedByCjkRetryChunks }
}

async function translateInlineIdentifierMarkdown(
  source: string,
  locale: DocsLocale,
  provider: TranslationProvider,
): Promise<string> {
  const output: string[] = []
  const plans: InlineTranslationPlan[] = []
  const chunks: string[] = []

  const baseUnits = markdownTranslationUnits(source)
  const units = baseUnits.flatMap((unit): MarkdownTranslationUnit[] => {
    if (!unit.translate) return [unit]
    const curatedUnit = curatedExactTranslation(unit.content, locale)
    if (curatedUnit !== undefined) return [{ content: curatedUnit, translate: false }]
    if (markdownLineKind(unit.content) !== 'table') return [unit]
    return unit.content
      .split(/((?<!\\)\|)/u)
      .filter(Boolean)
      .map((content) => ({
        completenessMinimumLetters: content === '|' ? undefined : 20,
        content,
        markdownTableCell: content !== '|',
        translate: content !== '|',
      }))
  })

  for (const unit of units) {
    if (!unit.translate || !/\p{L}/u.test(unit.content)) {
      output.push(unit.content)
      continue
    }

    // NLLB is substantially more reliable when it translates complete prose
    // without paired placeholder tokens around emphasis spans. Localized prose
    // therefore normalizes emphasis to plain text while preserving code,
    // identifiers, links, and every structural Markdown token.
    const translatableSource = removeTranslatableEmphasis(unit.content)
    const hasMarkdownLink = containsMarkdownLink(translatableSource)
    const preparedSource = hasMarkdownLink
      ? await localizeMarkdownLinkLabels(translatableSource, locale, provider)
      : translatableSource
    // Link labels are translated independently, then the complete localized
    // link becomes one atomic marker. The sentence translator may move that
    // marker for target-language grammar, but it cannot invert or widen the
    // label delimiters.
    const protectedMarkdown = protectMarkdown(preparedSource, locale, 'identifier', hasMarkdownLink)
    const { core, prefix, suffix } = detachBoundaryMarkers(protectedMarkdown.masked, protectedMarkdown)
    if (!/\p{L}/u.test(core)) {
      output.push(protectedMarkdown.restore(prefix + core + suffix))
      continue
    }
    const unitChunks = chunkForTranslation(core, 300)
    plans.push({
      completenessContext: { markdownTableCell: unit.markdownTableCell === true },
      completenessMinimumLetters: unit.completenessMinimumLetters ?? 80,
      protectedMarkdown,
      firstChunk: chunks.length,
      chunkCount: unitChunks.length,
      prefix,
      source: translatableSource,
      suffix,
    })
    chunks.push(...unitChunks)
    output.push('')
  }

  const translations = await translateBatch(provider, chunks, providerLanguageCode(provider, locale))
  if (translations.length !== chunks.length) {
    throw new Error(`Translation provider returned ${translations.length} results for ${chunks.length} prose chunks`)
  }

  let planIndex = 0
  for (let outputIndex = 0; outputIndex < output.length; outputIndex += 1) {
    if (output[outputIndex] !== '') continue
    const plan = plans[planIndex]
    planIndex += 1
    const sourceChunks = chunks.slice(plan.firstChunk, plan.firstChunk + plan.chunkCount)
    const translatedChunks = translations.slice(plan.firstChunk, plan.firstChunk + plan.chunkCount)
    const translated = joinTranslatedChunks(
      sourceChunks,
      translatedChunks,
      ['ja', 'zh-hans', 'zh-hant'].includes(locale.key),
    )
    let candidate: string
    try {
      candidate = plan.protectedMarkdown.restore(plan.prefix + translated + plan.suffix)
    } catch (error) {
      try {
        candidate = await translateProtectedFragments(
          protectMarkdown(plan.source, locale),
          providerLanguageCode(provider, locale),
          provider,
        )
      } catch (fallbackError) {
        throw new Error(
          `prose unit ${planIndex}: ${error instanceof Error ? error.message : String(error)}; fragment fallback failed: ${
            fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
          }`,
          { cause: fallbackError },
        )
      }
    }
    candidate = curatedExactTranslation(plan.source, locale) ?? candidate
    const incomplete = isCompleteCompactCjkTableUnit(plan.source, candidate, locale, plan.completenessContext)
      ? undefined
      : translationCompletenessError(plan.source, candidate, locale, plan.completenessMinimumLetters)
    if (incomplete) {
      let validatedByCjkRetryChunks = false
      try {
        const retried = await retryIncompleteInlineUnit(plan.source, locale, provider, plan.completenessContext)
        candidate = retried.content
        validatedByCjkRetryChunks = retried.validatedByCjkRetryChunks
      } catch (error) {
        const sourceContext = JSON.stringify(plan.source.length > 180 ? `${plan.source.slice(0, 177)}...` : plan.source)
        throw new Error(
          `prose unit ${planIndex} (${sourceContext}): ${error instanceof Error ? error.message : String(error)}`,
          { cause: error },
        )
      }
      const retryIncomplete = validatedByCjkRetryChunks
        ? undefined
        : isCompleteCompactCjkTableUnit(plan.source, candidate, locale, plan.completenessContext)
          ? undefined
          : translationCompletenessError(plan.source, candidate, locale, plan.completenessMinimumLetters)
      if (retryIncomplete) {
        const sourceContext = JSON.stringify(plan.source.length > 180 ? `${plan.source.slice(0, 177)}...` : plan.source)
        throw new Error(
          `prose unit ${planIndex} (${sourceContext}): ${incomplete}; sentence-level retry ${retryIncomplete}`,
        )
      }
    }
    output[outputIndex] = candidate
  }
  return output.join('')
}

function decodeTranslatedHtml(content: string): string {
  return content
    .replace(/&#(\d+);/gu, (_match, decimal: string) => String.fromCodePoint(Number(decimal)))
    .replace(/&#x([0-9a-f]+);/giu, (_match, hexadecimal: string) =>
      String.fromCodePoint(Number.parseInt(hexadecimal, 16)),
    )
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&')
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

export class GoogleTranslationProvider implements TranslationProvider {
  readonly engine = GOOGLE_TRANSLATION_ENGINE
  readonly protectedMarkdownMode = 'fragments' as const

  languageCode(locale: DocsLocale): string {
    return GOOGLE_LANGUAGE_CODES[locale.key] ?? locale.key
  }

  async translate(text: string, targetLanguage: string): Promise<string> {
    let lastError: unknown
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      try {
        const body = new URLSearchParams({
          client: 'gtx',
          sl: 'en',
          tl: targetLanguage,
          dt: 't',
          format: 'html',
          q: text,
        })
        const response = await fetch(TRANSLATE_ENDPOINT, {
          method: 'POST',
          headers: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          body,
        })
        if (!response.ok) throw new Error(`translation service returned HTTP ${response.status}`)
        const payload = (await response.json()) as [[Array<[string]>]]
        const translated = payload[0]?.map((part) => part[0] ?? '').join('')
        if (typeof translated !== 'string') throw new Error('translation service returned an invalid payload')
        return decodeTranslatedHtml(translated)
      } catch (error) {
        lastError = error
        if (attempt + 1 < MAX_ATTEMPTS) await delay(Math.min(30_000, 750 * 2 ** attempt))
      }
    }
    throw new Error(`Translation failed after ${MAX_ATTEMPTS} attempts`, { cause: lastError })
  }

  async translateBatch(texts: readonly string[], targetLanguage: string): Promise<string[]> {
    const translations = new Array<string>(texts.length)
    await parallelMap(texts, 1, async (text, index) => {
      translations[index] = await this.translate(text, targetLanguage)
    })
    return translations
  }
}

interface BingTranslationSession {
  cookie: string
  expiresAt: number
  iid: string
  ig: string
  key: string
  sfx: number
  token: string
}

/**
 * Translate through the public Bing Translator surface.
 *
 * Bing publishes a short-lived anti-abuse token in the translator page. Keep
 * that token and its cookies together, refresh them on expiry, and send only
 * the small prose fragments produced by the Markdown literal protector.
 */
export class BingTranslationProvider implements TranslationProvider {
  readonly engine = BING_TRANSLATION_ENGINE
  readonly protectedMarkdownMode = 'inline-identifiers' as const
  readonly clarifyTechnicalTerms = true

  private session: BingTranslationSession | undefined
  private sessionPromise: Promise<BingTranslationSession> | undefined

  constructor(private readonly fetcher: typeof fetch = fetch) {}

  languageCode(locale: DocsLocale): string {
    const language = BING_LANGUAGE_CODES[locale.key]
    if (!language) throw new Error(`No Bing Translator language code is configured for locale ${locale.key}`)
    return language
  }

  async translate(text: string, targetLanguage: string): Promise<string> {
    if (text.length > 1_000) {
      throw new Error(`Bing Translator input exceeds the public 1,000-character limit (${text.length})`)
    }

    let lastError: unknown
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      try {
        const session = await this.getSession(targetLanguage)
        const sfx = session.sfx
        session.sfx += 1
        const body = new URLSearchParams({
          fromLang: 'en',
          to: targetLanguage,
          text,
          token: session.token,
          key: session.key,
        })
        const endpoint = new URL(BING_TRANSLATE_ENDPOINT)
        endpoint.searchParams.set('isVertical', '1')
        endpoint.searchParams.set('IG', session.ig)
        endpoint.searchParams.set('IID', session.iid)
        endpoint.searchParams.set('SFX', String(sfx))
        const response = await this.fetcher(endpoint, {
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
            cookie: session.cookie,
            referer: `${BING_TRANSLATOR_PAGE}?from=en&to=${encodeURIComponent(targetLanguage)}`,
            'user-agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/140.0 Safari/537.36',
          },
          body,
          signal: AbortSignal.timeout(BING_REQUEST_TIMEOUT_MS),
        })
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) this.session = undefined
          throw new Error(`Bing Translator returned HTTP ${response.status}`)
        }
        const payload = (await response.json()) as unknown
        if (!Array.isArray(payload)) {
          const detail = JSON.stringify(payload)
          throw new Error(`Bing Translator returned an invalid payload${detail ? `: ${detail}` : ''}`)
        }
        const translated = (payload[0] as { translations?: Array<{ text?: unknown }> } | undefined)?.translations?.[0]
          ?.text
        if (typeof translated !== 'string') throw new Error('Bing Translator returned no translated text')
        return decodeTranslatedHtml(translated)
      } catch (error) {
        lastError = error
        if (attempt + 1 < MAX_ATTEMPTS) await delay(Math.min(30_000, 750 * 2 ** attempt))
      }
    }
    throw new Error(`Bing translation failed after ${MAX_ATTEMPTS} attempts`, { cause: lastError })
  }

  async translateBatch(texts: readonly string[], targetLanguage: string): Promise<string[]> {
    const translations = new Array<string>(texts.length)
    await parallelMap(texts, BING_BATCH_CONCURRENCY, async (text, index) => {
      translations[index] = await this.translate(text, targetLanguage)
    })
    return translations
  }

  private async getSession(targetLanguage: string): Promise<BingTranslationSession> {
    if (this.session && this.session.expiresAt > Date.now() + 30_000) return this.session
    if (!this.sessionPromise) {
      this.sessionPromise = this.createSession(targetLanguage).finally(() => {
        this.sessionPromise = undefined
      })
    }
    this.session = await this.sessionPromise
    return this.session
  }

  private async createSession(targetLanguage: string): Promise<BingTranslationSession> {
    const pageUrl = `${BING_TRANSLATOR_PAGE}?from=en&to=${encodeURIComponent(targetLanguage)}`
    const response = await this.fetcher(pageUrl, {
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/140.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(BING_REQUEST_TIMEOUT_MS),
    })
    if (!response.ok) throw new Error(`Unable to initialize Bing Translator: HTTP ${response.status}`)
    const html = await response.text()
    const igMatches = [...html.matchAll(/\bIG:"([A-F0-9]+)"/gu)]
    const ig = igMatches.at(-1)?.[1]
    const iid = /id="rich_tta"\s+data-iid="([^")]+)[")]/u.exec(html)?.[1]
    const auth = /params_AbusePreventionHelper\s*=\s*\[(\d+),"([^"]+)",(\d+)\]/u.exec(html)
    if (!ig || !iid || !auth) throw new Error('Unable to parse the Bing Translator session token')

    const cookieHeaders = response.headers as Headers & { getSetCookie?: () => string[] }
    const setCookies = cookieHeaders.getSetCookie?.() ?? [response.headers.get('set-cookie') ?? '']
    const cookie = setCookies
      .map((value) => value.split(';', 1)[0])
      .filter(Boolean)
      .join('; ')
    if (!cookie) throw new Error('Bing Translator did not return session cookies')

    return {
      cookie,
      expiresAt: Date.now() + Number(auth[3]),
      iid,
      ig,
      key: auth[1],
      sfx: 1,
      token: auth[2],
    }
  }
}

export class NllbTranslationProvider implements TranslationProvider {
  readonly engine = NLLB_TRANSLATION_ENGINE
  readonly protectedMarkdownMode = 'inline-identifiers' as const

  private readonly python: string
  private readonly model: string
  private child: ChildProcessWithoutNullStreams | null = null
  private reader: ReadlineInterface | null = null
  private requestSequence = 0
  private readonly pending = new Map<number, PendingNllbRequest>()
  private stderrTail = ''
  private closed = false

  constructor(options: NllbProviderOptions) {
    if (!options.model.trim()) throw new Error('The NLLB provider requires a CTranslate2 model path')
    this.python = options.python?.trim() || 'python3'
    this.model = options.model
  }

  languageCode(locale: DocsLocale): string {
    const language = NLLB_LANGUAGE_CODES[locale.key]
    if (!language) throw new Error(`No NLLB language code is configured for locale ${locale.key}`)
    return language
  }

  async translate(text: string, targetLanguage: string): Promise<string> {
    const [translation] = await this.translateBatch([text], targetLanguage)
    return translation
  }

  async translateBatch(texts: readonly string[], targetLanguage: string): Promise<string[]> {
    if (texts.length === 0) return []
    if (!Object.values(NLLB_LANGUAGE_CODES).includes(targetLanguage)) {
      throw new Error(`Unsupported NLLB target language: ${targetLanguage}`)
    }
    const child = this.start()
    const id = this.requestSequence
    this.requestSequence += 1

    return new Promise<string[]>((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      const request = `${JSON.stringify({ id, target_language: targetLanguage, texts })}\n`
      try {
        child.stdin.write(request, (error) => {
          if (!error) return
          this.pending.delete(id)
          reject(new Error(`Unable to send request to the NLLB translator: ${error.message}`, { cause: error }))
        })
      } catch (error) {
        this.pending.delete(id)
        reject(
          new Error(
            `Unable to send request to the NLLB translator: ${error instanceof Error ? error.message : error}`,
            {
              cause: error,
            },
          ),
        )
      }
    })
  }

  async close(): Promise<void> {
    this.closed = true
    const child = this.child
    if (!child) return
    const exited = new Promise<{ code: number | null; signal: NodeJS.Signals | null }>((resolve) => {
      child.once('exit', (code, signal) => resolve({ code, signal }))
    })
    child.stdin.end()
    const { code, signal } = await exited
    this.child = null
    this.reader?.close()
    this.reader = null
    if (code !== 0) {
      throw new Error(
        `NLLB translator exited with ${signal ? `signal ${signal}` : `code ${code ?? 'unknown'}`}${this.stderrContext()}`,
      )
    }
  }

  private start(): ChildProcessWithoutNullStreams {
    if (this.closed) throw new Error('NLLB translation provider is closed')
    if (this.child) return this.child

    const helper = path.join(path.dirname(fileURLToPath(import.meta.url)), 'nllb_translate.py')
    const child = spawn(this.python, [helper, '--model', this.model], {
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    this.child = child
    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    this.reader = createInterface({ input: child.stdout })
    this.reader.on('line', (line) => this.handleResponse(line))
    child.stderr.on('data', (chunk: string) => {
      this.stderrTail = `${this.stderrTail}${chunk}`.slice(-8_192)
    })
    child.once('error', (error) => {
      this.failPending(new Error(`Unable to start the NLLB translator: ${error.message}`, { cause: error }))
      if (this.child === child) this.child = null
    })
    child.once('exit', (code, signal) => {
      if (this.child === child) this.child = null
      this.reader?.close()
      this.reader = null
      if (this.pending.size > 0) {
        this.failPending(
          new Error(
            `NLLB translator exited with ${signal ? `signal ${signal}` : `code ${code ?? 'unknown'}`}${this.stderrContext()}`,
          ),
        )
      }
    })
    return child
  }

  private handleResponse(line: string): void {
    let response: NllbResponse
    try {
      response = JSON.parse(line) as NllbResponse
    } catch (error) {
      this.failPending(new Error('NLLB translator returned malformed JSON', { cause: error }))
      return
    }
    if (typeof response.id !== 'number' || !Number.isInteger(response.id)) {
      this.failPending(new Error('NLLB translator returned a response without a valid request id'))
      return
    }
    const request = this.pending.get(response.id)
    if (!request) return
    this.pending.delete(response.id)
    if (typeof response.error === 'string') {
      request.reject(new Error(`NLLB translation failed: ${response.error}`))
      return
    }
    if (!Array.isArray(response.translations) || !response.translations.every((item) => typeof item === 'string')) {
      request.reject(new Error('NLLB translator returned an invalid translations payload'))
      return
    }
    request.resolve(response.translations)
  }

  private failPending(error: Error): void {
    for (const request of this.pending.values()) request.reject(error)
    this.pending.clear()
  }

  private stderrContext(): string {
    const detail = this.stderrTail.trim()
    return detail ? `: ${detail}` : ''
  }
}

async function translateMarkdown(source: string, locale: DocsLocale, provider: TranslationProvider): Promise<string> {
  if (!source.trim()) return source
  const translationSource =
    provider.clarifyTechnicalTerms === false ? source : clarifyUncuratedTechnicalTranslationSource(source, locale)
  let translated: string
  if (provider.protectedMarkdownMode === 'inline-identifiers') {
    translated = await translateInlineIdentifierMarkdown(translationSource, locale, provider)
  } else {
    const protectedMarkdown = protectMarkdown(translationSource, locale, 'html')
    const targetLanguage = providerLanguageCode(provider, locale)
    if (provider.protectedMarkdownMode === 'fragments') {
      translated = await translateProtectedFragments(protectedMarkdown, targetLanguage, provider)
    } else {
      const translatedChunks: string[] = []
      for (const chunk of chunkForTranslation(protectedMarkdown.masked)) {
        translatedChunks.push(await provider.translate(chunk, targetLanguage))
      }
      translated = protectedMarkdown.restore(translatedChunks.join(''))
    }
  }
  return normalizeMachineTranslationArtifacts(translated, locale, source)
}

async function translateHomeFrontmatter(
  frontmatter: string,
  locale: DocsLocale,
  provider: TranslationProvider,
): Promise<string> {
  const lines = frontmatter.split(/\r?\n/u)
  const output: string[] = []
  const translatableKeys = new Set(['alt', 'details', 'tagline', 'text', 'title'])

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const field = /^(\s*(?:-\s*)?)([a-z][a-z0-9_-]*):(?:\s*(.*))?$/iu.exec(line)
    if (!field) {
      output.push(line)
      continue
    }

    const [, indentation, key, inlineValue = ''] = field
    if (key === 'link') {
      output.push(`${indentation}${key}: ${localizeRoute(inlineValue.trim(), locale)}`)
      continue
    }
    if (!translatableKeys.has(key)) {
      output.push(line)
      continue
    }

    const continuation: string[] = []
    const fieldIndent = indentation.length
    while (index + 1 < lines.length) {
      const next = lines[index + 1]
      const nextIndent = /^\s*/u.exec(next)?.[0].length ?? 0
      if (!next.trim() || nextIndent <= fieldIndent) break
      continuation.push(next.trim())
      index += 1
    }
    const value = [inlineValue.trim(), ...continuation].filter(Boolean).join(' ')
    if (!value) {
      output.push(line)
      continue
    }
    const translated = await translateMarkdown(value, locale, provider)
    output.push(`${indentation}${key}: ${JSON.stringify(translated.trim())}`)
  }
  return output.join('\n')
}

export async function translateDocument(
  english: string,
  route: string,
  locale: DocsLocale,
  provider: TranslationProvider,
): Promise<string> {
  const { frontmatter, body } = splitFrontmatter(english)
  const localizedFrontmatter =
    frontmatter === null
      ? null
      : route === 'index.md'
        ? await translateHomeFrontmatter(frontmatter, locale, provider)
        : frontmatter
  const anchoredBody = addStableHeadingAnchors(body)
  const translatedBody = await translateMarkdown(anchoredBody, locale, provider)
  assertGeneratedMarkdownStructure(anchoredBody, translatedBody, locale)
  const metadata = [
    `translation_locale: ${locale.key}`,
    `translation_source: /${route}`,
    `translation_source_hash: ${sha256(english)}`,
    `translation_status: ${TRANSLATION_STATUS}`,
    `translation_engine: ${provider.engine ?? GOOGLE_TRANSLATION_ENGINE}`,
  ]
  if (localizedFrontmatter !== null) metadata.push('', localizedFrontmatter)
  const bodySeparator = translatedBody.startsWith('\n') || !translatedBody ? '' : '\n'
  return stripTrailingWhitespaceOutsideFences(`---\n${metadata.join('\n')}\n---\n${bodySeparator}${translatedBody}`)
}

/** Synchronize stable English heading IDs into existing translated pages without retranslating prose. */
export async function synchronizeTranslationHeadingAnchors(
  options: SynchronizeHeadingAnchorOptions = {},
): Promise<void> {
  const sourceRoot = options.sourceRoot ?? path.resolve(process.cwd(), 'src')
  const locales = options.locales ?? TRANSLATED_LOCALES
  const availableRoutes = await englishRoutes(sourceRoot)
  const availableRouteSet = new Set(availableRoutes)
  const routes = options.routes
    ? [...new Set(options.routes.map((route) => route.replace(/^\/+/u, '')))]
    : availableRoutes
  const unknownRoutes = routes.filter((route) => !availableRouteSet.has(route))
  if (unknownRoutes.length > 0) {
    throw new Error(`Unknown English route(s): ${unknownRoutes.join(', ')}`)
  }

  const anchorsByRoute = new Map<string, string[]>()
  await Promise.all(
    routes.map(async (route) => {
      const english = await readFile(path.join(sourceRoot, route), 'utf8')
      anchorsByRoute.set(
        route,
        markdownHeadings(splitFrontmatter(english).body).map((heading) => heading.stableAnchor),
      )
    }),
  )

  const updates: Array<{ content: string; target: string }> = []
  for (const locale of locales) {
    for (const route of routes) {
      const target = path.join(sourceRoot, locale.path, route)
      const content = await readFile(target, 'utf8')
      const document = splitFrontmatter(content)
      const anchoredBody = applyStableHeadingAnchors(document.body, anchorsByRoute.get(route)!)
      const prefixLength = content.length - document.body.length
      updates.push({ target, content: content.slice(0, prefixLength) + anchoredBody })
    }
  }
  await Promise.all(updates.map(({ target, content }) => writeFile(target, content)))
}

/** Synchronize English heading IDs and container keywords without retranslating prose. */
export async function synchronizeTranslationMarkdownStructure(
  options: SynchronizeMarkdownStructureOptions = {},
): Promise<void> {
  await synchronizeTranslationHeadingAnchors(options)

  const sourceRoot = options.sourceRoot ?? path.resolve(process.cwd(), 'src')
  const locales = options.locales ?? TRANSLATED_LOCALES
  const availableRoutes = await englishRoutes(sourceRoot)
  const availableRouteSet = new Set(availableRoutes)
  const routes = options.routes
    ? [...new Set(options.routes.map((route) => route.replace(/^\/+/u, '')))]
    : availableRoutes
  const unknownRoutes = routes.filter((route) => !availableRouteSet.has(route))
  if (unknownRoutes.length > 0) {
    throw new Error(`Unknown English route(s): ${unknownRoutes.join(', ')}`)
  }

  const sourceBodiesByRoute = new Map<string, string>()
  const directivesByRoute = new Map<string, MarkdownContainerDirective[]>()
  await Promise.all(
    routes.map(async (route) => {
      const english = await readFile(path.join(sourceRoot, route), 'utf8')
      const sourceBody = splitFrontmatter(english).body
      sourceBodiesByRoute.set(route, sourceBody)
      directivesByRoute.set(route, markdownContainerDirectives(sourceBody))
    }),
  )

  const updates: Array<{ content: string; target: string }> = []
  for (const locale of locales) {
    for (const route of routes) {
      const target = path.join(sourceRoot, locale.path, route)
      const content = await readFile(target, 'utf8')
      const document = splitFrontmatter(content)
      const synchronizedDirectives = applyStableContainerDirectives(document.body, directivesByRoute.get(route)!)
      const synchronizedBody = synchronizeTechnicalLinkLabels(
        sourceBodiesByRoute.get(route)!,
        synchronizedDirectives,
        locale,
      )
      const prefixLength = content.length - document.body.length
      updates.push({ target, content: content.slice(0, prefixLength) + synchronizedBody })
    }
  }
  await Promise.all(updates.map(({ target, content }) => writeFile(target, content)))
}

/** Apply only curated, reviewed prose replacements without retranslating the surrounding page. */
export async function synchronizeReviewedTranslations(
  options: SynchronizeReviewedTranslationOptions = {},
): Promise<void> {
  const sourceRoot = options.sourceRoot ?? path.resolve(process.cwd(), 'src')
  const locales = options.locales ?? TRANSLATED_LOCALES
  const availableRoutes = await englishRoutes(sourceRoot)
  const availableRouteSet = new Set(availableRoutes)
  const routes = options.routes
    ? [...new Set(options.routes.map((route) => route.replace(/^\/+/u, '')))]
    : availableRoutes
  const unknownRoutes = routes.filter((route) => !availableRouteSet.has(route))
  if (unknownRoutes.length > 0) {
    throw new Error(`Unknown English route(s): ${unknownRoutes.join(', ')}`)
  }

  const sources = new Map<string, string>()
  await Promise.all(
    routes.map(async (route) => {
      sources.set(route, await readFile(path.join(sourceRoot, route), 'utf8'))
    }),
  )

  const updates: Array<{ content: string; target: string }> = []
  for (const locale of locales) {
    let replacementCount = 0
    for (const route of routes) {
      const target = path.join(sourceRoot, locale.path, route)
      const content = await readFile(target, 'utf8')
      const sourceBody = addStableHeadingAnchors(splitFrontmatter(sources.get(route)!).body)
      const targetDocument = splitFrontmatter(content)
      const sourceUnits = markdownTranslationUnits(sourceBody).filter((unit) => unit.translate)
      const targetUnits = markdownTranslationUnits(targetDocument.body)
      const targetProseUnits = targetUnits.filter((unit) => unit.translate)
      if (sourceUnits.length !== targetProseUnits.length) {
        throw new Error(
          `${locale.key}/${route}: cannot synchronize reviewed translations because prose unit counts differ (${sourceUnits.length} source, ${targetProseUnits.length} target)`,
        )
      }

      let proseIndex = 0
      let changed = false
      for (const unit of targetUnits) {
        if (!unit.translate) continue
        const sourceUnit = sourceUnits[proseIndex].content
        const reviewed = curatedExactTranslation(sourceUnit, locale)
        proseIndex += 1
        if (reviewed === undefined || reviewed === unit.content) continue
        try {
          assertGeneratedMarkdownStructure(sourceUnit, reviewed, locale)
        } catch (error) {
          throw new Error(
            `${locale.key}/${route}: reviewed prose unit ${proseIndex} is structurally invalid: ${error instanceof Error ? error.message : String(error)}`,
            { cause: error },
          )
        }
        unit.content = reviewed
        replacementCount += 1
        changed = true
      }
      if (!changed) continue

      const synchronizedBody = targetUnits.map((unit) => unit.content).join('')
      const prefixLength = content.length - targetDocument.body.length
      updates.push({ target, content: content.slice(0, prefixLength) + synchronizedBody })
    }
    console.log(`[${locale.key}] synchronized ${replacementCount} reviewed prose unit(s)`)
  }
  await Promise.all(updates.map(({ target, content }) => writeFile(target, content)))
}

/** Apply source-aware normalization repairs to existing translations without calling a provider. */
export async function normalizeExistingTranslations(
  options: NormalizeExistingTranslationOptions = {},
): Promise<void> {
  const sourceRoot = options.sourceRoot ?? path.resolve(process.cwd(), 'src')
  const locales = options.locales ?? TRANSLATED_LOCALES
  const availableRoutes = await englishRoutes(sourceRoot)
  const availableRouteSet = new Set(availableRoutes)
  const routes = options.routes
    ? [...new Set(options.routes.map((route) => route.replace(/^\/+/u, '')))]
    : availableRoutes
  const unknownRoutes = routes.filter((route) => !availableRouteSet.has(route))
  if (unknownRoutes.length > 0) {
    throw new Error(`Unknown English route(s): ${unknownRoutes.join(', ')}`)
  }

  const sources = new Map<string, string>()
  await Promise.all(
    routes.map(async (route) => {
      sources.set(route, await readFile(path.join(sourceRoot, route), 'utf8'))
    }),
  )

  const updates: Array<{ content: string; target: string }> = []
  for (const locale of locales) {
    let replacementCount = 0
    for (const route of routes) {
      const target = path.join(sourceRoot, locale.path, route)
      const content = await readFile(target, 'utf8')
      const sourceBody = addStableHeadingAnchors(splitFrontmatter(sources.get(route)!).body)
      const targetDocument = splitFrontmatter(content)
      const sourceUnits = markdownTranslationUnits(sourceBody).filter((unit) => unit.translate)
      const targetUnits = markdownTranslationUnits(targetDocument.body)
      const targetProseUnits = targetUnits.filter((unit) => unit.translate)
      if (sourceUnits.length !== targetProseUnits.length) {
        throw new Error(
          `${locale.key}/${route}: cannot normalize existing translations because prose unit counts differ (${sourceUnits.length} source, ${targetProseUnits.length} target)`,
        )
      }

      let proseIndex = 0
      let changed = false
      for (const unit of targetUnits) {
        if (!unit.translate) continue
        const sourceUnit = sourceUnits[proseIndex].content
        const normalized = normalizeMachineTranslationArtifacts(unit.content, locale, sourceUnit)
        proseIndex += 1
        if (normalized === unit.content) continue
        try {
          assertGeneratedMarkdownStructure(sourceUnit, normalized, locale)
        } catch (error) {
          throw new Error(
            `${locale.key}/${route}: normalized prose unit ${proseIndex} is structurally invalid: ${error instanceof Error ? error.message : String(error)}`,
            { cause: error },
          )
        }
        unit.content = normalized
        replacementCount += 1
        changed = true
      }
      if (!changed) continue

      const normalizedBody = targetUnits.map((unit) => unit.content).join('')
      const prefixLength = content.length - targetDocument.body.length
      updates.push({ target, content: content.slice(0, prefixLength) + normalizedBody })
    }
    console.log(`[${locale.key}] normalized ${replacementCount} existing prose unit(s)`)
  }
  await Promise.all(updates.map(({ target, content }) => writeFile(target, content)))
}

async function parallelMap<T>(
  values: readonly T[],
  concurrency: number,
  operation: (value: T, index: number) => Promise<void>,
): Promise<void> {
  let cursor = 0
  let failed = false
  let firstError: unknown
  const workers = Array.from({ length: Math.min(concurrency, values.length) }, async () => {
    while (!failed && cursor < values.length) {
      const index = cursor
      cursor += 1
      try {
        await operation(values[index], index)
      } catch (error) {
        if (!failed) firstError = error
        failed = true
      }
    }
  })
  await Promise.all(workers)
  if (failed) throw firstError
}

const BING_DOCUMENT_TRANSLATION_ATTEMPTS = 3

async function translateDocumentWithRetries(
  english: string,
  route: string,
  locale: DocsLocale,
  provider: TranslationProvider,
): Promise<string> {
  const attempts = provider.engine === BING_TRANSLATION_ENGINE ? BING_DOCUMENT_TRANSLATION_ATTEMPTS : 1
  let lastError: unknown
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await translateDocument(english, route, locale, provider)
    } catch (error) {
      lastError = error
    }
  }
  if (attempts === 1) throw lastError
  throw new Error(
    `translation failed validation after ${attempts} complete document attempts: ${lastError instanceof Error ? lastError.message : String(lastError)}`,
    { cause: lastError },
  )
}

export async function generateTranslations(options: GenerateOptions = {}): Promise<void> {
  const sourceRoot = options.sourceRoot ?? path.resolve(process.cwd(), 'src')
  const locales = options.locales ?? TRANSLATED_LOCALES
  const concurrency = options.concurrency ?? 4
  const provider = options.provider ?? new GoogleTranslationProvider()
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 16) {
    throw new Error('Translation concurrency must be an integer from 1 through 16')
  }

  const availableRoutes = await englishRoutes(sourceRoot)
  const availableRouteSet = new Set(availableRoutes)
  const routes = options.routes
    ? [...new Set(options.routes.map((route) => route.replace(/^\/+/u, '')))]
    : availableRoutes
  const unknownRoutes = routes.filter((route) => !availableRouteSet.has(route))
  if (unknownRoutes.length > 0) {
    throw new Error(`Unknown English route(s): ${unknownRoutes.join(', ')}`)
  }
  const sources = new Map<string, string>()
  await Promise.all(
    routes.map(async (route) => {
      sources.set(route, await readFile(path.join(sourceRoot, route), 'utf8'))
    }),
  )
  const dependencies = await routeDependencies(sourceRoot, sources)

  const stagingRoot = await mkdtemp(path.join(path.dirname(sourceRoot), `.iroha-docs-translation-${process.pid}-`))
  try {
    for (const locale of locales) {
      const localeRoot = path.join(sourceRoot, locale.path)
      const stagedLocaleRoot = path.join(stagingRoot, locale.path)
      const backupLocaleRoot = path.join(stagingRoot, `${locale.path}-previous`)
      const scope = options.routes ? 'selected pages' : 'pages'
      console.log(`Translating ${routes.length} ${scope} to ${locale.label} (${locale.key})…`)
      await parallelMap(routes, concurrency, async (route, index) => {
        const target = path.join(stagedLocaleRoot, route)
        let translated
        try {
          translated = await translateDocumentWithRetries(sources.get(route)!, route, locale, provider)
        } catch (error) {
          throw new Error(`${locale.key}/${route}: ${error instanceof Error ? error.message : String(error)}`, {
            cause: error,
          })
        }
        await mkdir(path.dirname(target), { recursive: true })
        await writeFile(target, translated)
        if ((index + 1) % 10 === 0 || index + 1 === routes.length) {
          console.log(`[${locale.key}] ${index + 1}/${routes.length}`)
        }
      })
      for (const dependency of dependencies.keys()) {
        const target = path.join(stagedLocaleRoot, dependency)
        await mkdir(path.dirname(target), { recursive: true })
        await copyFile(path.join(sourceRoot, dependency), target)
      }
      await assertEnglishSnapshot(sourceRoot, availableRoutes, sources, dependencies)

      if (options.routes) {
        for (const route of routes) {
          const target = path.join(localeRoot, route)
          await mkdir(path.dirname(target), { recursive: true })
          await rename(path.join(stagedLocaleRoot, route), target)
        }
        for (const dependency of dependencies.keys()) {
          const target = path.join(localeRoot, dependency)
          await mkdir(path.dirname(target), { recursive: true })
          await rename(path.join(stagedLocaleRoot, dependency), target)
        }
      } else {
        await replaceDirectoryAtomically(localeRoot, stagedLocaleRoot, backupLocaleRoot)
      }
    }
    await assertEnglishSnapshot(sourceRoot, availableRoutes, sources, dependencies)
  } finally {
    await rm(stagingRoot, { recursive: true, force: true })
  }
}

export interface TranslationCliOptions {
  locales: readonly DocsLocale[]
  routes?: readonly string[]
  concurrency: number
  providerName: 'bing' | 'google' | 'nllb'
  python?: string
  model?: string
  normalizeExisting: boolean
  synchronizeAnchors: boolean
  synchronizeReviewed: boolean
  synchronizeStructure: boolean
}

export function parseTranslationCli(argv: string[]): TranslationCliOptions {
  let selectedKeys: string[] = []
  let routes: string[] | undefined
  let concurrency = 4
  let providerName: 'bing' | 'google' | 'nllb' = 'google'
  let python: string | undefined
  let model: string | undefined
  let normalizeExisting = false
  let synchronizeAnchors = false
  let synchronizeReviewed = false
  let synchronizeStructure = false
  for (const argument of argv) {
    if (argument.startsWith('--locale=')) {
      selectedKeys = argument
        .slice('--locale='.length)
        .split(',')
        .map((key) => key.trim())
        .filter(Boolean)
    } else if (argument.startsWith('--route=')) {
      routes = [
        ...(routes ?? []),
        ...argument
          .slice('--route='.length)
          .split(',')
          .map((route) => route.trim())
          .filter(Boolean),
      ]
    } else if (argument.startsWith('--concurrency=')) {
      concurrency = Number(argument.slice('--concurrency='.length))
    } else if (argument.startsWith('--provider=')) {
      const requestedProvider = argument.slice('--provider='.length)
      if (requestedProvider !== 'bing' && requestedProvider !== 'google' && requestedProvider !== 'nllb') {
        throw new Error(`Unknown translation provider: ${requestedProvider}`)
      }
      providerName = requestedProvider
    } else if (argument.startsWith('--python=')) {
      python = argument.slice('--python='.length)
      if (!python) throw new Error('--python requires an executable path')
    } else if (argument.startsWith('--model=')) {
      model = argument.slice('--model='.length)
      if (!model) throw new Error('--model requires a CTranslate2 model path')
    } else if (argument === '--sync-anchors') {
      synchronizeAnchors = true
    } else if (argument === '--normalize-existing') {
      normalizeExisting = true
    } else if (argument === '--sync-reviewed') {
      synchronizeReviewed = true
    } else if (argument === '--sync-structure') {
      synchronizeStructure = true
    } else {
      throw new Error(`Unknown translation option: ${argument}`)
    }
  }
  let locales = selectedKeys.length
    ? selectedKeys.map((key) => {
        const locale = TRANSLATED_LOCALES.find((candidate) => candidate.key === key)
        if (!locale) throw new Error(`Unknown locale: ${key}`)
        return locale
      })
    : TRANSLATED_LOCALES
  if (providerName === 'bing') {
    const unsupported = locales.filter((locale) => !BING_LANGUAGE_CODES[locale.key])
    if (selectedKeys.length > 0 && unsupported.length > 0) {
      throw new Error(
        `Bing Translator does not support maintained locale(s): ${unsupported.map(({ key }) => key).join(', ')}`,
      )
    }
    const unsuitable = locales.filter(
      (locale) => BING_LANGUAGE_CODES[locale.key] && !BING_RECOMMENDED_LOCALE_KEY_SET.has(locale.key),
    )
    if (selectedKeys.length > 0 && unsuitable.length > 0) {
      throw new Error(
        `Bing Translator is not approved for full-quality maintained output in locale(s): ${unsuitable
          .map(({ key }) => key)
          .join(', ')}; use the guarded NLLB provider instead`,
      )
    }
    locales = locales.filter((locale) => BING_RECOMMENDED_LOCALE_KEY_SET.has(locale.key))
  }
  if ([normalizeExisting, synchronizeAnchors, synchronizeReviewed, synchronizeStructure].filter(Boolean).length > 1) {
    throw new Error('--normalize-existing, --sync-anchors, --sync-reviewed, and --sync-structure are mutually exclusive')
  }
  const synchronizeOnly = normalizeExisting || synchronizeAnchors || synchronizeReviewed || synchronizeStructure
  if (!synchronizeOnly && providerName === 'nllb' && !model) {
    throw new Error('--provider=nllb requires --model=<CTranslate2 model path>')
  }
  if (!synchronizeOnly && providerName !== 'nllb' && (python || model)) {
    throw new Error('--python and --model are only valid with --provider=nllb')
  }
  return {
    locales,
    routes,
    concurrency,
    providerName,
    python,
    model,
    normalizeExisting,
    synchronizeAnchors,
    synchronizeReviewed,
    synchronizeStructure,
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const {
    locales,
    routes,
    concurrency,
    providerName,
    python,
    model,
    normalizeExisting,
    synchronizeAnchors,
    synchronizeReviewed,
    synchronizeStructure,
  } = parseTranslationCli(process.argv.slice(2))
  ;(async () => {
    if (normalizeExisting) {
      await normalizeExistingTranslations({ locales, routes })
      return
    }
    if (synchronizeAnchors) {
      await synchronizeTranslationHeadingAnchors({ locales, routes })
      return
    }
    if (synchronizeStructure) {
      await synchronizeTranslationMarkdownStructure({ locales, routes })
      return
    }
    if (synchronizeReviewed) {
      await synchronizeReviewedTranslations({ locales, routes })
      return
    }
    const provider: TranslationProvider =
      providerName === 'nllb'
        ? new NllbTranslationProvider({ python, model: model! })
        : providerName === 'bing'
          ? new BingTranslationProvider()
          : new GoogleTranslationProvider()
    try {
      await generateTranslations({ locales, routes, concurrency, provider })
    } finally {
      await provider.close?.()
    }
  })().catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
}
