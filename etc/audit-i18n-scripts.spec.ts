import { describe, expect, test } from 'vitest'
import {
  auditableEnglishLeakageWords,
  auditableUntranslatedEnglishRuns,
  englishLeakageWords,
  isPreservedTechnicalLinkLabel,
  untranslatedEnglishRuns,
} from './audit-i18n-scripts'

describe('translation audit English detection', () => {
  test('does not split accented localized words into English fragments', () => {
    const source = 'The canonical build can use the exact value.'
    const target = 'A compilação canônica pode usar o valor exato.'

    expect(englishLeakageWords(source, target)).toEqual([])
    expect(untranslatedEnglishRuns(source, target)).toEqual([])
  })

  test('still reports standalone English leakage and multiword runs', () => {
    const source = 'Use the exact production build before release.'
    const target = 'Utilisez exact production build avant la publication.'

    expect(englishLeakageWords(source, target)).toEqual(['build', 'exact', 'production'])
    expect(untranslatedEnglishRuns(source, target)).toEqual(['exact production build'])
  })

  test('does not report ASCII words that are native to the selected locale', () => {
    expect(auditableEnglishLeakageWords('es', 'Use the real local profile.', 'Use el perfil local real.')).toEqual([])
    expect(auditableEnglishLeakageWords('pt', 'Use local logs for real volume.', 'Use logs locais do volume real.')).toEqual([])
    expect(
      auditableEnglishLeakageWords(
        'fr',
        'Use the exact production configuration and performance code.',
        'Utilisez la configuration exacte de production et le code de performance.',
      ),
    ).toEqual([])
    expect(auditableEnglishLeakageWords('az', 'Read real rows.', 'Real sətirləri oxuyun.')).toEqual([])
  })

  test('reports untranslated generic infrastructure phrases around technical names', () => {
    const source = 'Validator peer identities use trusted keys and generated config files.'
    const target = 'Проверьте Validator peer identities и trusted keys, а также generated config files.'

    expect(untranslatedEnglishRuns(source, target)).toEqual([
      'Validator peer identities',
      'generated config files',
      'trusted keys',
    ])
  })

  test('ignores protected code and URLs', () => {
    const source = 'Use the exact build from `production build` at https://example.com/build.'
    const target = 'Utilisez la version exacte de `production build` à https://example.com/build.'

    expect(englishLeakageWords(source, target)).toEqual([])
    expect(untranslatedEnglishRuns(source, target)).toEqual([])
  })

  test('ignores an unchanged VitePress snippet include path', () => {
    const include = '<<< @/snippets/peer.template.toml'

    expect(englishLeakageWords(include, include)).toEqual([])
    expect(untranslatedEnglishRuns(include, include)).toEqual([])
  })

  test('ignores preserved hyphenated protocol compounds', () => {
    const source = 'Use peer-to-peer and exact-network checks for a live-only feed.'
    const target = 'Используйте peer-to-peer и exact-network проверки для live-only канала.'

    expect(englishLeakageWords(source, target)).toEqual([])
  })

  test('does not mistake the Spanish or Portuguese imperative Use for English leakage', () => {
    const source = 'Use NFTs when records need unique identities.'

    expect(
      auditableUntranslatedEnglishRuns('es', source, 'Use NFTs cuando los registros necesiten identidad.'),
    ).toEqual([])
    expect(
      auditableUntranslatedEnglishRuns('pt', source, 'Use NFTs quando os registros precisarem de identidade.'),
    ).toEqual([])
    expect(auditableUntranslatedEnglishRuns('ja', source, 'Use NFTs で一意な記録を作成します。')).toEqual(['Use NFTs'])
  })
})

describe('translation audit link-label classification', () => {
  test.each([
    'Iroha CLI',
    'JavaScript / TypeScript SDK',
    'Kagami README',
    'SetKeyValue/RemoveKeyValue',
    'Wallet Connect',
  ])('preserves the technical or product label %s', (label) => {
    expect(isPreservedTechnicalLinkLabel(label)).toBe(true)
  })

  test('does not exempt ordinary untranslated link prose', () => {
    expect(isPreservedTechnicalLinkLabel('Install the CLI')).toBe(false)
  })
})
