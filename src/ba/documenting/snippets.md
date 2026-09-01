---
translation_locale: ba
translation_source: /documenting/snippets.md
translation_source_hash: 48d6670f100c7c6368fa03f163c9ff9e0322d36e51c22f89562b23b0e2ee2a2f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Код һыныфтары {#code-snippets}

Булдырылған снайпеттарҙа код, конфигурация һәм схемаларға бәйле миҫалдар һаҡлана. Iroha уларҙы барлыҡҡа килтергән ревизия.

## Iroha Яңыртҡыс әйберҙәр {#refreshing-iroha-artifacts}

Iroha-тан алынған өҙөктәре ябай сайттар төҙөү селтәренә инеү йәки туғандаш депозитарий талап итмәй. уларҙы асыҡтан-асыҡ яңыртыу:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

Checked-in `etc/refresh-iroha.ts` workflow clean source checkout-ты `provenance/iroha.json` менән verify итә, `/src/snippets` һәм Torii OpenAPI snapshot-ты яңынан generate итә һәм SHA-256 hashes-ты яңырта. Content һәм provenance changes-ты бергә review итегеҙ. Normal dependency install һәм VitePress build checked-in files-ты mutable branch fetch итмәйенсә ҡуллана.

## Сниппеттар ҙа шул иҫәптән {#including-snippets}

[VitePress код-сығылмаһы синтаксисын ҡулланығыҙ](https://vitepress.dev/guide/markdown#import-code-snippets) генерацияланған йәки локаль сығанаҡты индереү өсөн:

```md
<<< @/snippets/client.template.toml
```

Исемле кодлы төбәкте уның төбәк исемен ҡушып индерергә мөмкин:

```md
<<< @/example_code/lorem.rs#ipsum
```

Ҡулдан яҙылған миҫалдарҙы бәләкәй итеп һаҡлағыҙ. Йәмәғәт интерфейстары, конфигурация шаблондары, генерацияланған схемалар һәм командалар сығарыу өсөн яңыртылған сығанаҡ артефакттарын өҫтөнлөк бирегеҙ.
