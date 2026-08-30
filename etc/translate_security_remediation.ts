import { createHash } from 'node:crypto'
import { readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { TRANSLATED_LOCALES, type DocsLocale } from './locales'
import { NllbTranslationProvider, translateDocument } from './translate'

interface PageUpdate {
  readonly route: string
  readonly localized: string
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')
}

function extract(source: string, start: string, end: string): string {
  const startIndex = source.indexOf(start)
  const endIndex = source.indexOf(end, startIndex + start.length)
  if (startIndex < 0 || endIndex < 0) throw new Error(`Unable to extract ${start} through ${end}`)
  return source.slice(startIndex, endIndex).trim()
}

function translatedBody(document: string): string {
  const match = /^---\n[\s\S]*?\n---\n/u.exec(document)
  if (!match) throw new Error('Translated snippet is missing generated frontmatter')
  return document.slice(match[0].length).trim()
}

function headingIndex(source: string, anchor: string): number {
  const match = new RegExp(`^#{1,6} [^\\n]*\\{#${escapeRegExp(anchor)}\\}\\s*$`, 'mu').exec(source)
  return match?.index ?? -1
}

function upsertSection(source: string, section: string, sectionAnchor: string, beforeAnchor: string): string {
  const beforeIndex = headingIndex(source, beforeAnchor)
  if (beforeIndex < 0) throw new Error(`Missing insertion anchor ${beforeAnchor}`)
  const existingIndex = headingIndex(source, sectionAnchor)
  if (existingIndex >= 0) {
    if (existingIndex > beforeIndex) throw new Error(`Section ${sectionAnchor} follows ${beforeAnchor}`)
    return `${source.slice(0, existingIndex)}${section}\n\n${source.slice(beforeIndex)}`
  }
  return `${source.slice(0, beforeIndex)}${section}\n\n${source.slice(beforeIndex)}`
}

function replaceEndpointRows(source: string, translatedRows: string, endpoints: readonly string[]): string {
  const replacements = new Map<string, string>()
  for (const line of translatedRows.split('\n')) {
    for (const endpoint of endpoints) {
      if (line.includes(`\`${endpoint}\``)) replacements.set(endpoint, line)
    }
  }
  for (const endpoint of endpoints) {
    if (!replacements.has(endpoint)) throw new Error(`Translated table omitted ${endpoint}`)
  }
  const seen = new Set<string>()
  const output = source
    .split('\n')
    .map((line) => {
      for (const endpoint of endpoints) {
        if (!line.includes(`\`${endpoint}\``)) continue
        seen.add(endpoint)
        return replacements.get(endpoint)!
      }
      return line
    })
    .join('\n')
  for (const endpoint of endpoints) {
    if (!seen.has(endpoint)) throw new Error(`Localized table omitted ${endpoint}`)
  }
  return output
}

function refreshFrontmatter(source: string, english: string): string {
  let output = source.replace(/^translation_source_hash: .*$/mu, `translation_source_hash: ${sha256(english)}`)
  output = output.replace(/^translation_status: .*$/mu, 'translation_status: machine-validated')
  output = output.replace(/^translation_engine: .*$/mu, 'translation_engine: nllb-200-ct2')
  return output
}

async function localizeSnippet(
  source: string,
  route: string,
  locale: DocsLocale,
  provider: NllbTranslationProvider,
): Promise<string> {
  return translatedBody(await translateDocument(`${source.trim()}\n`, route, locale, provider))
}

async function updateLocale(sourceRoot: string, locale: DocsLocale, provider: NllbTranslationProvider): Promise<void> {
  const smartRoute = 'blockchain/smart-contracts.md'
  const toriiRoute = 'reference/torii-endpoints.md'
  const soraRoute = 'blockchain/sora-nexus-services.md'
  const smartEnglish = await readFile(path.join(sourceRoot, smartRoute), 'utf8')
  const toriiEnglish = await readFile(path.join(sourceRoot, toriiRoute), 'utf8')
  const soraEnglish = await readFile(path.join(sourceRoot, soraRoute), 'utf8')

  const contract = await localizeSnippet(
    extract(smartEnglish, '## Contract Lifecycle and Ownership', '## Operational Guidance'),
    smartRoute,
    locale,
    provider,
  )
  const accountVisibility = await localizeSnippet(
    extract(toriiEnglish, '## Account Authentication, Visibility, and Explorer Cursors', '## ISO 20022 Bridge'),
    toriiRoute,
    locale,
    provider,
  )
  const isoLifecycle = await localizeSnippet(
    extract(
      toriiEnglish,
      '### Participant Authorization and Lifecycle Ownership',
      '### Additional Parser and Mapping Support',
    ),
    toriiRoute,
    locale,
    provider,
  )
  const relayRoster = await localizeSnippet(
    extract(soraEnglish, '### Relay Incentive Verifier Roster', '## Data Availability (DA)'),
    soraRoute,
    locale,
    provider,
  )
  const publicGateways = await localizeSnippet(
    extract(soraEnglish, '### Public Local CID and Site Gateways', '### Pack, Manifest, Sign, and Submit'),
    soraRoute,
    locale,
    provider,
  )

  const endpoints = [
    'POST /v1/iso20022/pacs002',
    'POST /v1/iso20022/pacs004',
    'POST /v1/iso20022/camt056',
    'POST /v1/iso20022/sese024',
    'POST /v1/iso20022/sese025',
  ] as const
  const isoRowsEnglish = toriiEnglish
    .split('\n')
    .filter((line) => endpoints.some((endpoint) => line.includes(`\`${endpoint}\``)))
    .join('\n')
  if (isoRowsEnglish.split('\n').length !== endpoints.length)
    throw new Error('English ISO endpoint row set is incomplete')
  const isoRows = await localizeSnippet(isoRowsEnglish, toriiRoute, locale, provider)

  let smartLocalized = await readFile(path.join(sourceRoot, locale.path, smartRoute), 'utf8')
  smartLocalized = upsertSection(smartLocalized, contract, 'contract-lifecycle-and-ownership', 'operational-guidance')
  smartLocalized = refreshFrontmatter(smartLocalized, smartEnglish)

  let toriiLocalized = await readFile(path.join(sourceRoot, locale.path, toriiRoute), 'utf8')
  toriiLocalized = replaceEndpointRows(toriiLocalized, isoRows, endpoints)
  toriiLocalized = upsertSection(
    toriiLocalized,
    accountVisibility,
    'account-authentication-visibility-and-explorer-cursors',
    'iso-20022-bridge',
  )
  toriiLocalized = upsertSection(
    toriiLocalized,
    isoLifecycle,
    'participant-authorization-and-lifecycle-ownership',
    'additional-parser-and-mapping-support',
  )
  toriiLocalized = refreshFrontmatter(toriiLocalized, toriiEnglish)

  let soraLocalized = await readFile(path.join(sourceRoot, locale.path, soraRoute), 'utf8')
  soraLocalized = upsertSection(soraLocalized, relayRoster, 'relay-incentive-verifier-roster', 'data-availability-da')
  soraLocalized = upsertSection(
    soraLocalized,
    publicGateways,
    'public-local-cid-and-site-gateways',
    'pack-manifest-sign-and-submit',
  )
  soraLocalized = refreshFrontmatter(soraLocalized, soraEnglish)

  const updates: readonly PageUpdate[] = [
    { route: smartRoute, localized: smartLocalized },
    { route: toriiRoute, localized: toriiLocalized },
    { route: soraRoute, localized: soraLocalized },
  ]
  const temporary: string[] = []
  for (const update of updates) {
    if (!update.localized.endsWith('\n')) throw new Error(`${locale.key}/${update.route} lost its final newline`)
    const target = path.join(sourceRoot, locale.path, update.route)
    const staged = `${target}.security-remediation-${process.pid}`
    await writeFile(staged, update.localized)
    temporary.push(staged)
  }
  for (let index = 0; index < updates.length; index += 1) {
    await rename(temporary[index], path.join(sourceRoot, locale.path, updates[index].route))
  }
  console.log(`[${locale.key}] updated 3 focused pages`)
}

async function main(): Promise<void> {
  const localeArgument = process.argv.find((argument) => argument.startsWith('--locale='))
  const modelArgument = process.argv.find((argument) => argument.startsWith('--model='))
  const pythonArgument = process.argv.find((argument) => argument.startsWith('--python='))
  if (!localeArgument || !modelArgument) throw new Error('Usage: --locale=a,b --model=PATH [--python=PATH]')
  const requested = localeArgument.slice('--locale='.length).split(',')
  const locales = requested.map((key) => {
    const locale = TRANSLATED_LOCALES.find((candidate) => candidate.key === key)
    if (!locale) throw new Error(`Unknown locale: ${key}`)
    return locale
  })
  const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src')
  const provider = new NllbTranslationProvider({
    model: modelArgument.slice('--model='.length),
    python: pythonArgument?.slice('--python='.length),
  })
  try {
    for (const locale of locales) await updateLocale(sourceRoot, locale, provider)
  } finally {
    await provider.close()
  }
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
