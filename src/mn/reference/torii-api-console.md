---
translation_locale: mn
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: bing-translator-llm

aside: false
pageClass: torii-api-console-page
---

# Torii API Консол {#torii-api-console}

Ажиллаж буй Torii API төгсгөлийн цэгээс амьд OpenAPI баримтыг ашиглан маршрутуудыг шалгах, туршилтын хүсэлт илгээх, curl командуудыг хуулж авах, болон клиент код үүсгэх.

<ToriiApiConsole />

## Шаардлагууд {#requirements}

- Torii API төгсгөл нь `/openapi.json`-г ил гаргах ёстой.
- Браузер туршилт хийхэд энэ бичиг баримтын гарал үүсэлд орохоор CORS-ийг зөвшөөрөх шаардлагатай болно.
- Веб хөтөч нь API төгсгөлийн цэгт шууд хандах боломжтой байх ёстой.
- Код үүсгэхэд Node.js, pnpm, болон OpenAPI Генераторын Java програмын гүйцэтгэх орчин шаардлагатай.

Консол нь үндсэндээ `https://taira.sora.org` -нд тохируулагдсан байдаг. Орон нутгийн хөгжүүлэлт нь ихэвчлэн таны компьютер дээр Torii гүйцэтгэхэд `http://127.0.0.1:8080` -тэй ажилладаг.

## Эхлээд Taira оролдож үзээрэй {#try-taira-first}

Клиент үүсгэхээс өмнө таны машинаас олон нийтэд зориулсан OpenAPI баримт бичигт хандаж болох эсэхийг шалгаарай:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

Дараа нь `https://taira.sora.org/openapi.json`-г консол руу буулгаж, зөвхөн унших замуудыг туршиж үзээрэй, жишээ нь `GET /status`, `GET /v1/domains`, эсвэл `GET /v1/assets/definitions`. Гарын үсэгтэй гүйлгээ болон хувийн түлвэрийн урсгалыг SDK эсвэл CLI клиентэд хадгалах, эдгээр нь таны програмын гүйцэтгэлийн орчинөөс нууцыг ачаалдаг.}

## Үүсгэсэн үйлчлүүлэгчид {#generated-clients}

Генераторын команд нь консол ачаалдагтай ижил амьд OpenAPI баримт бичгийг ашигладаг. Энэ нь JSON оператор, судлаач, апп, болон телеметри маршрутуудад зориулж ашигтай юм.

Гарын үсэгтэй блокчэйн бүртгэлийн гүйлгээ, гарын үсэгтэй асуулгууд, болон Norito-дунд төрөлт агуулгыг ашиглахдаа албан ёсны Iroha SDKs-ийг сонгоорой. OpenAPI клиентүүд таны төлөө гарын үсгийг нэгтгэх, дансны түлхүүрийг удирдах, эсвэл Norito гүйлгээний биеийг кодлохгүй.

OpenAPI Генератороор дэмжигдсэн бүх генераторыг шалгахын тулд дараахийг ажиллуулна уу:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
