---
translation_locale: uz
translation_source: /documenting/snippets.md
translation_source_hash: 48d6670f100c7c6368fa03f163c9ff9e0322d36e51c22f89562b23b0e2ee2a2f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Kod parchalari {#code-snippets}

Yaratilgan qisqacha misollar ularni ishlab chiqqan Iroha tahriridan kod, sozlamalar va sxemalarga bog‘laydi.

## Yangilanmoqda Iroha Artefaktlar {#refreshing-iroha-artifacts}

Iroha-dan olingan bo‘lakchalar tekshiriladi, shuning uchun oddiy sayt qurilishlari tarmoqga yoki qo‘shni omborga kirishni talab qilmaydi. Ularni aniq yangilang:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

Tekshirilgan `etc/refresh-iroha.ts` ish jarayoni toza manba nusxasini `provenance/iroha.json` ga qarshi tekshiradi, `/src/snippets` va Torii OpenAPI vaqt-ko‘rsatkichli ma’lumotlar ko‘rinishini qayta yaratadi, va yangilaydi SHA-256 kriptografik xeshlarni. Mazmun va kelib chiqish o'zgarishlarini birgalikda ko'rib chiqing. Normal bog'liqlik o'rnatilishi va VitePress qurilishlar o'zgartirilishi mumkin bo'lgan shoxni yuklamasdan tekshirilgan fayllardan foydalanadi.

## Qismchalarni o'z ichiga oladi {#including-snippets}

[VitePress kod-qism sintaksisi](https://vitepress.dev/guide/markdown#import-code-snippets) dan foydalanib, yaratilgan yoki mahalliy manbalarni qo'shing:

```md
<<< @/snippets/client.template.toml
```

Nomlangan kod hududi uning hudud nomini qo‘shish orqali kiritilishi mumkin:

```md
<<< @/example_code/lorem.rs#ipsum
```

Qo'lda yozilgan misollarni kichik tuting. Jamoat interfeyslari, sozlash shablonlari, yaratilgan sxemalar va buyruq natijalari uchun yangilangan manba ob'ektlarini afzal qiling.
