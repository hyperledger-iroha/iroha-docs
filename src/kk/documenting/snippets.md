---
translation_locale: kk
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Код кескіндері {#code-snippets}

Жаратылған үзінділер оларды шығарған Iroha түзетуден код, конфигурация және схемаларға байланысты мысалдарды сақтайды.

## Жаңарушы Iroha бұйымдар {#refreshing-iroha-artifacts}

Iroha -дан алынған үзінділер әдеттегі сайттардың құрылымында желіге кіруді немесе бауырлас қоймасын қажет етпеу үшін тексеріледі. Оларды айқын жаңартыңыз:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

Тіркелгендер [`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts) жұмыс ағыны таза көзді тексеруге қарсы `provenance/iroha.json`, қалпына келтіреді `/src/snippets` және Torii OpenAPI слайдтар және жаңартулар SHA-256 hashes. мазмұн мен шығу тегі өзгеруін бірге қараңыз. VitePress Құрылыстары өзгеріске ұшырамайтын тармақтарды алып келмей, тіркелген файлдарды жейді.

## Снипперлерді қоса алғанда {#including-snippets}

Пайдалану [VitePress код-снипттер синтаксисі ](https://vitepress.dev/guide/markdown#import-code-snippets) пайдаланған немесе жергілікті көзді қосу үшін:

```md
<<< @/snippets/client.template.toml
```

Аталған кодтық аймақты оның аймақ атауын қоса беру арқылы қосуға болады:

```md
<<< @/example_code/lorem.rs#ipsum
```

Қолмен жазылған мысалдарды кішкентай етіп сақтаңыз. Қоғамдық интерфейстер, конфигурация үлгілері, құрылған схемалар және командалар шығару үшін жаңартылған бастапқы артефакттерді артық көресіз.
