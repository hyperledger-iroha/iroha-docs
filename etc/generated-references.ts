import { readFileSync } from 'node:fs'
import path from 'node:path'
import { render as renderSchema } from './schema'

// Renderers for `render` provenance artifacts: each turns a file copied from the pinned Iroha tree
// into the Markdown that documentation pages embed with a `generated-reference` fence.

/** Fence info string that embeds a generated reference; the fence body names the reference. */
export const GENERATED_REFERENCE_FENCE = 'generated-reference'

/**
 * Generated Markdown that pages may embed, keyed by the name in the fence body. A fenced block
 * survives translation byte-for-byte, so every locale embeds the same pinned reference.
 */
export const EMBEDDED_REFERENCES: Readonly<Record<string, string>> = {
  'genesis-types': 'src/snippets/genesis-types.md',
  'ivm-syscalls': 'src/snippets/ivm-syscalls.md',
  'kotodama-diagnostics': 'src/snippets/kotodama-diagnostics.md',
}

/** Reads an embedded reference's Markdown, rejecting names outside {@link EMBEDDED_REFERENCES}. */
export function readEmbeddedReference(repositoryRoot: string, name: string): string {
  const target = Object.hasOwn(EMBEDDED_REFERENCES, name) ? EMBEDDED_REFERENCES[name] : undefined
  if (!target) throw new Error(`Unknown generated reference "${name}"`)
  return readFileSync(path.join(repositoryRoot, target), 'utf8')
}

/** Escapes text outside inline code so Markdown and the HTML it becomes treat it as plain text. */
function escapeProse(text: string): string {
  return text
    .split(/(`+[^`]*`+)/u)
    .map((part, index) =>
      index % 2 === 1
        ? part
        : part
            .replace(/\\/gu, '\\\\')
            .replace(/&/gu, '&amp;')
            .replace(/</gu, '&lt;')
            .replace(/>/gu, '&gt;')
            .replace(/([*_[\]|])/gu, '\\$1'),
    )
    .join('')
}

/** Decodes the TSV field escapes used by the diagnostics registry: `\n` and `\\`. */
function decodeField(field: string, code: string): string {
  return field.replace(/\\(.)/gu, (_, character: string) => {
    if (character === 'n') return '\n'
    if (character === '\\') return '\\'
    throw new Error(`Kotodama diagnostic ${code} uses an unsupported escape \\${character}`)
  })
}

const DIAGNOSTICS_FORMAT = 'kotodama-diagnostic-explanations-v1'
const DIAGNOSTIC_COLUMNS = ['code', 'phase', 'summary', 'help', 'bad_example', 'fixed_example']
const PHASE_ORDER = ['Lex', 'Parse', 'Resolve', 'Semantic', 'Lowering', 'Artifact']

function kotodamaBlock(label: string, source: string): string {
  const fence = '`'.repeat(Math.max(3, ...[...source.matchAll(/`+/gu)].map((run) => run[0].length + 1)))
  return `${label}\n\n${fence}kotodama\n${source}\n${fence}`
}

/** Renders `diagnostic_explanations_v1.tsv` as one section per compiler phase and one entry per code. */
export function renderKotodamaDiagnostics(tsv: string): string {
  const lines = tsv.split('\n').filter((line) => line !== '')
  const [format, declared] = (lines[0] ?? '').split('\t')
  if (format !== DIAGNOSTICS_FORMAT) throw new Error(`Unsupported Kotodama diagnostics format: ${format}`)
  if ((lines[1] ?? '') !== DIAGNOSTIC_COLUMNS.join('\t')) {
    throw new Error(`Unexpected Kotodama diagnostics columns: ${lines[1]}`)
  }

  const rows = lines.slice(2).map((line) => {
    const fields = line.split('\t')
    if (fields.length !== DIAGNOSTIC_COLUMNS.length) throw new Error(`Malformed Kotodama diagnostic row: ${line}`)
    const [code, phase, summary, help, bad, fixed] = fields
    if (!/^[A-Z][A-Z0-9_]*$/u.test(code)) throw new Error(`Invalid Kotodama diagnostic code: ${code}`)
    return {
      code,
      phase,
      summary: decodeField(summary, code),
      help: decodeField(help, code),
      bad: bad === '-' ? undefined : decodeField(bad, code),
      fixed: fixed === '-' ? undefined : decodeField(fixed, code),
    }
  })
  if (rows.length !== Number(declared)) {
    throw new Error(`Kotodama diagnostics declare ${declared} entries but contain ${rows.length}`)
  }
  const unknownPhases = [...new Set(rows.map((row) => row.phase))].filter((phase) => !PHASE_ORDER.includes(phase))
  if (unknownPhases.length > 0) throw new Error(`Unknown Kotodama diagnostic phase(s): ${unknownPhases.join(', ')}`)

  const sections = PHASE_ORDER.flatMap((phase) => {
    const entries = rows
      .filter((row) => row.phase === phase)
      .sort((a, b) => (a.code < b.code ? -1 : a.code > b.code ? 1 : 0))
      .map((row) => {
        const parts = [
          `### \`${row.code}\` {#${row.code.toLowerCase().replace(/_/gu, '-')}}`,
          escapeProse(row.summary),
          `**Fix:** ${escapeProse(row.help)}`,
        ]
        if (row.bad !== undefined) parts.push(kotodamaBlock('Rejected:', row.bad))
        if (row.fixed !== undefined) parts.push(kotodamaBlock('Accepted:', row.fixed))
        return parts.join('\n\n')
      })
    return entries.length > 0 ? [`## ${phase} {#${phase.toLowerCase()}}`, ...entries] : []
  })
  return `${sections.join('\n\n')}\n`
}

/** Keeps the syscall table and its trailing notes, dropping the title, maintainer preamble and empty columns. */
export function renderIvmSyscalls(markdown: string): string {
  const lines = markdown.replace(/\r\n/gu, '\n').trimEnd().split('\n')
  const start = lines.findIndex((line) => line.startsWith('| Name |'))
  if (start < 0) throw new Error('The IVM syscall table header was not found')
  let end = start
  while (end < lines.length && lines[end].startsWith('|')) end += 1

  const cells = lines.slice(start, end).map((line) =>
    line
      .slice(1, -1)
      .split('|')
      .map((cell) => cell.trim()),
  )
  if (cells.length < 3) throw new Error('The IVM syscall table has no rows')
  const kept = cells[0].map((_, column) => column).filter((column) => cells.slice(2).some((row) => row[column] !== ''))
  const table = cells.map((row, index) =>
    index === 1 ? `| ${kept.map(() => '---').join(' | ')} |` : `| ${kept.map((column) => row[column]).join(' | ')} |`,
  )
  const notes = lines.slice(end).join('\n').trim()
  return `${[table.join('\n'), notes].filter(Boolean).join('\n\n')}\n`
}

/** Renders the genesis Norito type map (`kagami advanced schema --genesis-out`) like the data-model schema. */
export function renderGenesisTypes(json: string): string {
  return `${renderSchema(JSON.parse(json) as Parameters<typeof renderSchema>[0]).trimEnd()}\n`
}

/** Renderers for `render` artifacts, keyed by artifact id. */
export const RENDERERS: Readonly<Record<string, (source: string) => string>> = {
  'kotodama-diagnostics': renderKotodamaDiagnostics,
  'ivm-syscalls': renderIvmSyscalls,
}
