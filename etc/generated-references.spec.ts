import { describe, expect, test } from 'vitest'
import { renderGenesisTypes, renderIvmSyscalls, renderKotodamaDiagnostics } from './generated-references'

const HEADER = 'code\tphase\tsummary\thelp\tbad_example\tfixed_example'

function diagnostics(rows: string[], declared = rows.length) {
  return [`kotodama-diagnostic-explanations-v1\t${declared}`, HEADER, ...rows, ''].join('\n')
}

describe('Kotodama diagnostics renderer', () => {
  test('groups codes by compiler phase and renders fixes and examples', () => {
    const markdown = renderKotodamaDiagnostics(
      diagnostics([
        'E_ZETA\tSemantic\tvalue <T> is invalid\tUse `Option<T>` or a_b | c.\t-\t-',
        'K0001\tLex\tsource exceeds the limit\tSplit the source.\t-\t-',
        'E_AUTHORIZE_POSITION\tSemantic\tauthorize is misplaced\tWrite `\\\\u{...}` instead.\tfn f() -> int authorize(anyone) {\\n    return 1;\\n}\tfn f() authorize(anyone) -> int {\\n    return 1;\\n}',
      ]),
    )

    expect(markdown).toBe(
      [
        '## Lex {#lex}',
        '### `K0001` {#k0001}',
        'source exceeds the limit',
        '**Fix:** Split the source.',
        '## Semantic {#semantic}',
        '### `E_AUTHORIZE_POSITION` {#e-authorize-position}',
        'authorize is misplaced',
        '**Fix:** Write `\\u{...}` instead.',
        'Rejected:\n\n```kotodama\nfn f() -> int authorize(anyone) {\n    return 1;\n}\n```',
        'Accepted:\n\n```kotodama\nfn f() authorize(anyone) -> int {\n    return 1;\n}\n```',
        '### `E_ZETA` {#e-zeta}',
        'value &lt;T&gt; is invalid',
        '**Fix:** Use `Option<T>` or a\\_b \\| c.',
      ].join('\n\n') + '\n',
    )
  })

  test('rejects registry drift instead of guessing', () => {
    expect(() => renderKotodamaDiagnostics(diagnostics(['K0001\tLex\ta\tb\t-\t-'], 2))).toThrow(
      'declare 2 entries but contain 1',
    )
    expect(() => renderKotodamaDiagnostics(diagnostics(['K0001\tCodegen\ta\tb\t-\t-']))).toThrow(
      'Unknown Kotodama diagnostic phase(s): Codegen',
    )
    expect(() => renderKotodamaDiagnostics(diagnostics(['K0001\tLex\ta\\tb\tb\t-\t-']))).toThrow(
      'unsupported escape \\t',
    )
    expect(() => renderKotodamaDiagnostics('kotodama-diagnostic-explanations-v2\t0\n')).toThrow(
      'Unsupported Kotodama diagnostics format',
    )
  })
})

describe('IVM syscall table renderer', () => {
  test('keeps the table and notes but drops the preamble and empty columns', () => {
    const source = [
      '# Generated IVM Syscall Table',
      '',
      'This file is generated from the ABI-v1 syscall specification. Edit those sources; then re-run this script.',
      '',
      '| Name | Value (hex) | Note |',
      '|------|-------------|------|',
      '| SYSCALL_DEBUG_PRINT | 0x0 |  |',
      '| SYSCALL_EXIT | 0x1 |  |',
      '',
      'Note: Retired constants are omitted.',
      '',
    ].join('\n')

    expect(renderIvmSyscalls(source)).toBe(
      [
        '| Name | Value (hex) |',
        '| --- | --- |',
        '| SYSCALL_DEBUG_PRINT | 0x0 |',
        '| SYSCALL_EXIT | 0x1 |',
        '',
        'Note: Retired constants are omitted.',
        '',
      ].join('\n'),
    )
  })

  test('fails when the table is missing', () => {
    expect(() => renderIvmSyscalls('# Generated IVM Syscall Table\n')).toThrow('table header was not found')
  })
})

describe('genesis types renderer', () => {
  test('renders the genesis Norito type map like the data-model schema', () => {
    const markdown = renderGenesisTypes(
      JSON.stringify({ AccountId: { Struct: [{ name: 'controller', type: 'AccountController' }] } }),
    )
    expect(markdown).toContain('## `AccountId` {#accountid}')
    expect(markdown).toContain('[`AccountController`](#accountcontroller)')
    expect(markdown.endsWith('\n')).toBe(true)
  })
})
