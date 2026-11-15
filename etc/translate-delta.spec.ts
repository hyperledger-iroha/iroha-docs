import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, test } from 'vitest'
import { TRANSLATED_LOCALES } from './locales'
import {
  assembleTranslationDelta,
  planTranslationDelta,
  namingOnlyDeltaTranslations,
  reuseNamingOnlyTranslation,
  publishTranslationDelta,
  splitTranslationDocument,
  translationSourceHash,
  validateTranslationDelta,
} from './translate-delta'

const locale = TRANSLATED_LOCALES.find((entry) => entry.key === 'fr')!
const route = 'guide/example.md'
const previous =
  '# Guide\n\nKeep this reviewed paragraph.\n\nRemove this obsolete paragraph.\n\n```toml\nenabled = false\n```\n'
const current =
  '# Guide\n\nKeep this reviewed paragraph.\n\nRead the current configuration.\n\n```toml\nenabled = true\n```\n'
const translated = (source: string, body: string) =>
  `---\ntranslation_locale: fr\ntranslation_source: /${route}\ntranslation_source_hash: ${translationSourceHash(source)}\ntranslation_status: machine-validated\ntranslation_engine: reviewed\n---\n${body}`
const original = translated(
  previous,
  '# Guide {#guide}\n\nConservez ce paragraphe déjà relu.\n\nSupprimez ce paragraphe obsolète.\n\n```toml\nenabled = false\n```\n',
)
const replacements = new Map([[3, 'Consultez la configuration actuelle.']])
const candidate = () => assembleTranslationDelta(previous, current, original, locale, replacements, 'reviewed-delta')
const roots: string[] = []
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })))
})

describe('incremental translation propagation', () => {
  test('reuses only exact naming changes while protecting code, destinations, anchors, and BIS Nexus', () => {
    expect(
      reuseNamingOnlyTranslation(
        'Nexus dataspaces hold data.',
        'SORA Nexus data spaces hold data.',
        'Les espaces de données Nexus contiennent les données.',
        locale,
      ),
    ).toBe('Les espaces de données SORA Nexus contiennent les données.')
    expect(
      reuseNamingOnlyTranslation(
        'Use `dataspace` for Nexus.',
        'Use `data space` for SORA Nexus.',
        'Utilisez `dataspace` pour Nexus.',
        locale,
      ),
    ).toBeUndefined()
    expect(
      reuseNamingOnlyTranslation(
        '[Nexus](/nexus) uses dataspaces.',
        '[SORA Nexus](/new) uses data spaces.',
        '[Nexus](/fr/nexus) utilise des espaces de données.',
        locale,
      ),
    ).toBeUndefined()
    expect(
      reuseNamingOnlyTranslation('# Nexus {#nexus}', '# SORA Nexus {#sora-nexus}', '# Nexus {#nexus}', locale),
    ).toBeUndefined()
    expect(
      reuseNamingOnlyTranslation(
        'BIS Nexus uses dataspaces.',
        'BIS SORA Nexus uses data spaces.',
        'BIS Nexus utilise des espaces de données.',
        locale,
      ),
    ).toBeUndefined()
    expect(
      reuseNamingOnlyTranslation(
        'Nexus certifies batches.',
        'SORA Nexus executes batches.',
        'Nexus certifie les lots.',
        locale,
      ),
    ).toBeUndefined()
  })

  test('holds mixed platform names and nonplatform Sora terms for review without renaming products', () => {
    for (const name of ['Sora profile', 'SORA Parliament', 'Sora product']) {
      expect(
        reuseNamingOnlyTranslation(
          `Nexus dataspaces use the ${name}.`,
          `SORA Nexus data spaces use the ${name}.`,
          `Les espaces de données Nexus utilisent ${name}.`,
          locale,
        ),
      ).toBeUndefined()
    }
    expect(
      reuseNamingOnlyTranslation(
        'Nexus dataspaces use SoraCloud, SoraFS, and SoraNet.',
        'SORA Nexus data spaces use SoraCloud, SoraFS, and SoraNet.',
        'Les espaces de données Nexus utilisent SoraCloud, SoraFS et SoraNet.',
        locale,
      ),
    ).toBe('Les espaces de données SORA Nexus utilisent SoraCloud, SoraFS et SoraNet.')
  })

  test('finds a unique naming-only predecessor without replacing unchanged reviewed units', () => {
    const old = 'Before.\n\nNexus dataspaces.\n\nAfter.\n'
    const next = 'Before.\n\nSORA Nexus data spaces.\n\nAfter.\n'
    const local = 'Avant.\n\nEspaces de données Nexus.\n\nAprès.\n'
    expect([...namingOnlyDeltaTranslations(old, next, local, locale)]).toEqual([
      [2, { previousUnit: 2, translation: 'Espaces de données SORA Nexus.' }],
    ])
    expect(
      namingOnlyDeltaTranslations(
        'Nexus dataspaces.\n\nNexus dataspaces.\n',
        'SORA Nexus data spaces.\n',
        'Espaces de données Nexus.\n\nEspaces de données Nexus.\n',
        locale,
      ).size,
    ).toBe(0)
  })
  test('retains each occurrence of a repeated paragraph in order while detecting inserted and deleted units', () => {
    const plan = planTranslationDelta('Same.\n\nObsolete.\n\nSame.\n', 'New.\n\nSame.\n\nSame.\n')
    expect(plan.units.map((unit) => unit.previousUnit)).toEqual([null, 1, 3])
    expect(plan.previousHash).toBe(translationSourceHash('Same.\n\nObsolete.\n\nSame.\n'))
    expect(plan.currentHash).not.toBe(plan.previousHash)
  })

  test('keeps exact reviewed prose while using new source literals and source hash', () => {
    const output = candidate()
    expect(output).toContain('Conservez ce paragraphe déjà relu.')
    expect(output).toContain('Consultez la configuration actuelle.')
    expect(output).toContain('enabled = true')
    expect(output).not.toContain('enabled = false')
    expect(output).not.toContain('obsolète')
    expect(output).toContain(`translation_source_hash: ${translationSourceHash(current)}`)
    expect(output).toContain('translation_engine: reviewed+reviewed-delta')
    expect(splitTranslationDocument(output).body).toMatch(/^# Guide \{#guide\}/u)
  })

  test('refuses incomplete translation and attempts to replace retained prose', () => {
    expect(() => assembleTranslationDelta(previous, current, original, locale, new Map(), 'reviewed')).toThrow(
      'Missing translation',
    )
    expect(() =>
      assembleTranslationDelta(previous, current, original, locale, new Map([[2, 'Changed']]), 'reviewed'),
    ).toThrow('unchanged')
  })

  test('refuses the wrong baseline, misaligned translated prose, and changed English frontmatter', () => {
    expect(() =>
      assembleTranslationDelta(previous + '\n', current, original, locale, replacements, 'reviewed'),
    ).toThrow('baseline')
    expect(() =>
      assembleTranslationDelta(previous, current, original + '\nExtra.\n', locale, replacements, 'reviewed'),
    ).toThrow('misaligned')
    expect(() =>
      assembleTranslationDelta(
        previous,
        `---\ntitle: Changed\n---\n${current}`,
        original,
        locale,
        replacements,
        'reviewed',
      ),
    ).toThrow('frontmatter')
  })

  test('checks protected literals, links, list markers, and table cells before assembly', () => {
    const examples = [
      ['Use `AccountId`.', 'Utilisez un identifiant.'],
      ['Read [the guide](/guide/).', 'Lisez [le guide](/incorrect/).'],
      ['- Read the configuration.', 'Lisez la configuration.'],
      ['| Name | Meaning |', '| Nom |'],
    ]
    for (const [english, replacement] of examples) {
      const before = 'Old paragraph.\n'
      const localized = translated(before, 'Ancien paragraphe.\n')
      expect(() =>
        assembleTranslationDelta(before, english, localized, locale, new Map([[1, replacement]]), 'reviewed'),
      ).toThrow()
    }
  })

  test('accepts a complete candidate and rejects untranslated changed prose', async () => {
    expect(await validateTranslationDelta(current, candidate(), route, locale)).toEqual([])
    const fallback = assembleTranslationDelta(
      previous,
      current,
      original,
      locale,
      new Map([[3, 'Read the current configuration.']]),
      'reviewed',
    )
    expect((await validateTranslationDelta(current, fallback, route, locale)).join('\n')).toMatch(/untranslated/u)
  })

  test('publishes only after validation and checks source and translation snapshots', async () => {
    const sourceRoot = await mkdtemp(path.join(tmpdir(), 'delta-test-'))
    roots.push(sourceRoot)
    const target = path.join(sourceRoot, locale.path, route)
    const source = path.join(sourceRoot, route)
    await mkdir(path.dirname(source), { recursive: true })
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(source, current)
    await writeFile(target, original)
    const options = {
      sourceRoot,
      route,
      locale,
      english: current,
      previousTranslation: original,
      candidate: candidate(),
    }
    await writeFile(source, current + '\n')
    await expect(publishTranslationDelta(options)).rejects.toThrow('English changed')
    expect(await readFile(target, 'utf8')).toBe(original)
    await writeFile(source, current)
    await writeFile(target, original + '\n')
    await expect(publishTranslationDelta(options)).rejects.toThrow('Translation changed')
    await writeFile(target, original)
    await publishTranslationDelta(options)
    expect(await readFile(target, 'utf8')).toBe(options.candidate)
  })
})
