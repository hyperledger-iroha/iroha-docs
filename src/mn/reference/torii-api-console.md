---
translation_locale: mn
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: nllb-200-ct2

aside: false
pageClass: torii-api-console-page
---

# Torii API Төмөрөгч {#torii-api-console}

Амьдралыг ашигла OpenAPI гүйлтийн баримт бичиг Torii хяналтын замыг шалгах төгсгөлийн цэг,
шалгалтын хүсэлтийг илгээх, хуулбарлах curl команд, үйлчлүүлэгчний код бий болгох.

<ToriiApiConsole />

## Шаардлага {#requirements}

- Хөдөлмөрийн Torii эцсийн цэг нь илрүүлэх `/openapi.json`.
- Бrowser-ийн туршилт шаарддаг CORS Энэ баримтыг үүсгэх боломжтой болгоно.
- Бrowser нь төгсгөлийн цэгт шууд хүрэх боломжтой байх ёстой.
- Код үүсгэх шаардлагатай Node.js, pnpm, Java-ийн ажиллуулах цаг OpenAPI
  Женератор.

Консолын хувьд `https://taira.sora.org`. Орон нутгийн хөгжил
ажилтай `http://127.0.0.1:8080` гүйх үед Torii Таны машин дээр.

## Та үүнийг туршиж үзээрэй. Taira Эхлээд {#try-taira-first}

Та үйлчлүүлэгчийг үүсгэхээс өмнө олон нийтэд OpenAPI баримт бичиг хүрэлцэх боломжтой
Таны машиныхаа:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

Дараа нь хуримтлаарай `https://taira.sora.org/openapi.json` консолд орж,
зөвхөн уншигч замыг ашигладаг: `GET /status`, `GET /v1/domains`, эсвэл
`GET /v1/assets/definitions`. Гарын үсэг зурсан гүйлгээ, хувийн ач холбогдолтой урсгалыг хадгалах
нэг SDK эсвэл CLI Танай цаг хугацааны орчны нууцыг борлуулах үйлчлүүлэгч.

## Хэрэглэгчид үүссэн {#generated-clients}

Женератор команд нь мөн адил амьд OpenAPI консолын
Энэ нь JSON оператор, судлаач, апп, телеметрийн замыг.

Гарын үсэг зурсан томоохон бүртгэлийн гүйлгээ, гарын үсэг зурасан хайгуулын хувьд; Norito-Төрийн хэрэгсэл,
албан тушаалтан Iroha SDKs. OpenAPI үйлчлүүлэгчид гарын үсэг цуглуулахгүй,
дансны түлхүүр удирдах, эсвэл кодлах Norito Худалдааны байгууллагууд танд зориулагдсан.

Бүх генераторуудыг шалгах OpenAPI Үндэсний тоног төхөөрөмж:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
