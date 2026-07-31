---
translation_locale: ba
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
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

Иҫәпкә алынғандар [`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts) эш ағымы саф сығанаҡ иҫкәртеү менән раҫлай `provenance/iroha.json`, регенерация `/src/snippets` һәм Torii OpenAPI фотоһүрәт һәм яңылыҡтар SHA-256 hashes. йөкмәтке һәм килеп сығыу үҙгәрештәрен бергә тикшереү. ғәҙәти бәйлелек ҡуйыу һәм VitePress төҙөлөштәр теркәлгән файлдарҙы үҙгәреүсән тармаҡ алып килмәйенсә ҡулланыу.

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
