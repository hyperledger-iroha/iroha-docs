---
translation_locale: uz
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: nllb-200-ct2

aside: false
pageClass: torii-api-console-page
---

# Torii API konsol {#torii-api-console}

Yo'nalishlarni tekshirish, sinov so'rovlarini yuborish, curl buyruqlarini nusxalash va mijoz kodini yaratish uchun ishlatiladigan Torii oxirgi nuqtadan jonli OpenAPI hujjatidan foydalaning.

<ToriiApiConsole />

## Talablar {#requirements}

- Torii oxirgi nuqtasi `/openapi.json` ni ko'rsatishi kerak.
- Ushbu hujjatlarning kelib chiqishiga ruxsat berish uchun brauzer sinovlari CORS ni talab qiladi.
- Brauzer to'g'ridan-to'g'ri oxirgi nuqtaga yetib borishi kerak.
- Kod ishlab chiqarish uchun Node.js, pnpm va OpenAPI generator uchun Java ishga tushirish vaqti kerak.

Konsol andoza `https://taira.sora.org`. Mahalliy rivojlanish odatda `http://127.0.0.1:8080` bilan ishlaydi, siz mashinangizda Torii ishga tushirganingizda.

## Avvalo Taira ni sinab ko'ring {#try-taira-first}

Mijoz yaratishdan oldin, ommaviy OpenAPI hujjatini mashinangizdan olish mumkinligini tekshiring:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

Keyin `https://taira.sora.org/openapi.json` ni konsolga qo'yib, `GET /status`, `GET /v1/domains` yoki `GET /v1/assets/definitions` kabi o'qish uchun mo'ljallangan yo'lni sinab ko'ring. O'zingizning ish vaqti muhitingizdan sirlarni yuklaydigan SDK yoki CLI mijozi uchun imzolangan tranzaksiya va xususiy kalit oqimlarini saqlash.

## Ishlab chiqarilgan mijozlar {#generated-clients}

Generator buyruqida konsol yuklaydigan bir xil jonli OpenAPI hujjati ishlatiladi. Bu JSON operatori, qidiruvchisi, dastur va telemetriya yo'nalishlari uchun foydali.

Imzolangan katta qog'ozlar tranzaksiyalari, imzolangan so'rovlar va Norito natijali faydali yuklar uchun rasmiy Iroha SDKs ni afzal ko'rish kerak. OpenAPI mijozlar siz uchun imzolarni yig'maydilar, hisob kalitlarini boshqarmaydilar yoki Norito tranzaksiyalar organlarini kodlamaydilar.

OpenAPI generator tomonidan qo'llab-quvvatlanadigan har bir generatorni tekshirish uchun quyidagilarni o'tkazing:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
