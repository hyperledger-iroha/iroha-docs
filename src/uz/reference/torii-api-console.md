---
translation_locale: uz
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: nllb-200-ct2

aside: false
pageClass: torii-api-console-page
---

# Torii API Konsol {#torii-api-console}

Toʻgʻridan-toʻgʻri foydalaning OpenAPI Ishlab boruvchi hujjat Torii yo'nalishlarni tekshirish uchun yakuniy punkt,
sinov talablarini yuborish, nusxa olish curl buyruqlar va mijoz kodini yaratadi.

<ToriiApiConsole />

## Talablar {#requirements}

- O ' zbekiston Respublikasi Torii oxirgi nuqta ko'rsatishi kerak `/openapi.json`.
- Brauzer sinovlari talab etiladi CORS bu hujjatlarning kelib chiqishiga yo'l qo'yish.
- Brauzer to'g'ridan-to'g'ri oxirgi nuqtaga yetib borishi kerak.
- Kod ishlab chiqarish talab qiladi Node.js, pnpm, va Java uchun ish vaqti OpenAPI
  Generator.

Konsolning andoza parametrlari `https://taira.sora.org`. Mahalliy rivojlanish
bilan ishlaydi `http://127.0.0.1:8080` qochganingizda Torii mashinangizda.

## Sinang . Taira Avvalo {#try-taira-first}

Mijozni yaratishdan oldin, jamoatchilikning OpenAPI hujjatga erishish mumkin
mashinangiz:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

Keyin pastlang . `https://taira.sora.org/openapi.json` konsolga kiring va bir
o'qish uchun mo'ljallangan yo'l, masalan: `GET /status`, `GET /v1/domains`, yoki
`GET /v1/assets/definitions`. Imzolangan tranzaksiya va xususiy kalit oqimlarini saqlash
bir SDK yoki CLI Sizning ish vaqti muhitingizdagi sirlarni yuklaydigan mijoz.

## Oʻrnatilgan mijozlar {#generated-clients}

Generator buyruqida xuddi shu jonli OpenAPI konsolning
yuklar. Bu JSON operator, kashfiyotchi, dastur va telemetriya yo'nalishlari.

imzolangan katta qog'ozlar bilan bog'liq bitimlar, imzolangan so'rovlar va Norito- mahalliy yuklar,
mansabdor shaxsni afzal koʻrish Iroha SDKs. OpenAPI mijozlar imzolar yig'maydi,
hisob kalitlarini boshqarish yoki kodlash Norito Siz uchun tranzaksiya organlari.

Har bir generatorni tekshirish uchun OpenAPI Generatorni ishga tushiring:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
