---
translation_locale: uz
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kod parchalari {#code-snippets}

Ishlab chiqarilgan snippetlar ularni ishlab chiqaradigan Iroha o'zgarishidan kod, konfiguratsiya va sxemalarga bog'liq bo'lgan misollar saqlanadi.

## O'zgartiruvchi Iroha artefaktlar {#refreshing-iroha-artifacts}

Iroha-dan kelib chiqqan snippetlar oddiy sayt qurilmalarida tarmoqga kirish yoki aka-uka ma'muriyati talab qilinmaydigan tarzda tekshirilgan.

```bash
pnpm refresh:iroha --source /path/to/iroha
```

Ro'yxatdan o'tganlar [`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts) ish oqimi toza manba bilan bogʻliq hisob-kitobni tekshirish `provenance/iroha.json`, qayta tiklanadi `/src/snippets` va Torii OpenAPI tezkor fotosurat va yangilanishlar SHA-256 hashlar. tarkib va kelib chiqishi o'zgarishlarini birgalikda ko'rib chiqish. Oddiy bog'liqlik o'rnatish va VitePress Buildlar o'zgaruvchan bo'limiga ega bo'lmasdan checked-in fayllar iste'mol qiladi.

## Snippets-lar ham kiradi {#including-snippets}

[VitePress kod-snippet sintaksasi ](https://vitepress.dev/guide/markdown#import-code-snippets) dan foydalanib, generatsiya qilingan yoki mahalliy manbalarni o'z ichiga oling:

```md
<<< @/snippets/client.template.toml
```

Nomlangan kod mintaqasini o'z mintaqa nomi bilan qo'shish mumkin:

```md
<<< @/example_code/lorem.rs#ipsum
```

Qo'lda yozilgan misollarni kichik saqlang. Jamoat interfeyslari, konfiguratsiya namunalari, ishlab chiqarilgan sxemalar va buyruq chiqarish uchun yangilangan manba artefaktlarini afzal ko'ring.
