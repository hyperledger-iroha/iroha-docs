---
translation_locale: uz
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kod parchalari {#code-snippets}

Ishlab chiqarilgan snippetlar kod, konfiguratsiya va sxemalarga bog'liq misollarni saqlaydi
ko'rsatilgan Iroha ularni ishlab chiqargan qayta ko'rib chiqish.

## Charchatadigan Iroha San'at asarlar {#refreshing-iroha-artifacts}

Iroha-dan kelib chiqadigan kesimlar tekshirilgan, shuning uchun oddiy sayt qurilishi talab qilinmaydi
Tarmoqga kirish yoki qarindoshlar ma'muriyati.

```bash
pnpm refresh:iroha --source /path/to/iroha
```

Kirganlar
[`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts)
ish oqimlari toza manba checking bilan taqqoslaydi `provenance/iroha.json`,
qayta tiklanadi `/src/snippets` va Torii OpenAPI tezkor va yangilanishlar SHA-256
hashlar. tarkib va kelib chiqish o'zgarishlarini birgalikda ko'rib chiqing.
o'rnatish va VitePress Builds cheklangan fayllarni iste'mol qilmasdan
o'zgaruvchan bo'lakni olib keling.

## Snippets ham kiradi {#including-snippets}

Foydalanish
[VitePress kod-snippet sintaxasi](https://vitepress.dev/guide/markdown#import-code-snippets)
ishlab chiqarilgan yoki mahalliy manbalarni o'z ichiga olish:

```md
<<< @/snippets/client.template.toml
```

Nomlangan kod mintaqasini o'z mintaqa nomi bilan qo'shish mumkin:

```md
<<< @/example_code/lorem.rs#ipsum
```

Qo'lda yozilgan misollarni kichik saqlang.
interfeyslar, konfiguratsiya namunalari, ishlab chiqarilgan sxemalar va buyruq chiqish.
