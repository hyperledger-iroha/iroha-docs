---
translation_locale: hy
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
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

Գրանցվելը [`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts) աշխատանքային հոսքը ստուգում է մաքուր աղբյուրի հաշվարկը `provenance/iroha.json`, վերածվում է `/src/snippets` եւ Torii OpenAPI շտապ լուսանկար եւ թարմացումներ SHA-256 hashes. Վերանայեք բովանդակության եւ ծագման փոփոխությունները միասին: Սովորական կախվածության տեղադրում եւ VitePress շինարարությունները սպառում են գրանցված ֆայլերը ՝ առանց փոփոխվող մասնաճյուղի բերման:

## Ներառված է Snippets- ը {#including-snippets}

Օգտագործեք [VitePress կոդային հատվածի սինթակսը](https://vitepress.dev/guide/markdown#import-code-snippets) ՝ ներառելու ստեղծված կամ տեղական աղբյուրը.

```md
<<< @/snippets/client.template.toml
```

Նշված կոդային տարածաշրջանը կարող է ներառվել՝ հավելելով իր տարածաշրջանի անվանումը.

```md
<<< @/example_code/lorem.rs#ipsum
```

Պահպանեք ձեռքով գրված օրինակները փոքր. նախընտրեք թարմացված աղբյուրային արվեստի գործիքներ հանրային ինտերֆեյսների, կազմաձեւման ձեւանմուշների, ստեղծված սխեմաների եւ հրամանների արտադրանքի համար:
