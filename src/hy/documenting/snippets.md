---
translation_locale: hy
translation_source: /documenting/snippets.md
translation_source_hash: 48d6670f100c7c6368fa03f163c9ff9e0322d36e51c22f89562b23b0e2ee2a2f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Կոդի կտորներ {#code-snippets}

Ստեղծված հատվածները պահում են օրինակներ, որոնք կապված են Iroha վերանայման կոդի, կազմաձեւման եւ սխեմաների հետ, որոնք ստեղծեցին դրանք:

## Թարմացնող Iroha արվեստի գործիքներ {#refreshing-iroha-artifacts}

Iroha-ից բխող հատվածները ստուգվում են այնպես, որ սովորական կայքի կառուցվածքները չեն պահանջում ցանցային մուտք կամ եղբայրական պահեստ: Լրացրեք դրանք բացարձակապես.

```bash
pnpm refresh:iroha --source /path/to/iroha
```

Գրանցված `etc/refresh-iroha.ts` workflow-ը մաքուր source checkout-ը ստուգում է `provenance/iroha.json`-ի նկատմամբ, վերագեներացնում է `/src/snippets`-ը եւ Torii OpenAPI snapshot-ը եւ թարմացնում SHA-256 hashes-ը։ Բովանդակության եւ provenance-ի փոփոխությունները միասին վերանայեք։ Սովորական dependency installation-ը եւ VitePress build-ը օգտագործում են գրանցված ֆայլերը՝ առանց mutable branch fetch անելու։

## Ներառված հատվածներ {#including-snippets}

Օգտագործեք [VitePress կոդային հատվածի սինթակսը](https://vitepress.dev/guide/markdown#import-code-snippets) ՝ ներառելու ստեղծված կամ տեղական աղբյուրը.

```md
<<< @/snippets/client.template.toml
```

Նշված կոդային տարածաշրջանը կարող է ներառվել՝ հավելելով իր տարածաշրջանի անվանումը.

```md
<<< @/example_code/lorem.rs#ipsum
```

Պահպանեք ձեռքով գրված օրինակները փոքր. նախընտրեք թարմացված աղբյուրային արվեստի գործիքներ հանրային ինտերֆեյսների, կազմաձեւման ձեւանմուշների, ստեղծված սխեմաների եւ հրամանների արտադրանքի համար:
