---
translation_locale: mn
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: nllb-200-ct2

aside: false
pageClass: torii-api-console-page
---

# Torii API конзолын {#torii-api-console}

Замын хяналт шалгах, туршилт хүсэлт ирүүлэх, curl тушаалыг нунтаглах, үйлчлүүлэгчний код үүсгэхэд үйл ажиллагаа явуулж буй Torii эцсийн цэгээс амьд OpenAPI баримтыг ашигла.

<ToriiApiConsole />

## Шаардлага {#requirements}

- Torii төгсгөлийн цэг нь `/openapi.json`-ийг илрүүлнэ.
- Бrowser-ийн шинжилгээ нь CORS нь энэ баримтын эх үүсвэрийг зөвшөөрөх шаардлагатай юм.
- Бrowser нь төгсгөлийн цэгт шууд хүрэх боломжтой байх ёстой.
- Код үүсгэхэд Node.js, pnpm болон OpenAPI генераторуудад Java ажиллуулах цаг шаардлагатай.

Консоль нь `https://taira.sora.org` гэж тохируулж байна. Орон нутгийн хөгжил нь таны машинд Torii ажиллагаанд `http://127.0.0.1:8080`-тэй ажилладаг.

## Эхлээд Taira туршиж үзээрэй. {#try-taira-first}

Клиентыг үүсгэхээс өмнө OpenAPI олон нийтийн баримт бичгийг машиноос олж авах боломжтой эсэхийг шалгана уу:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

Дараа нь хуримтлах `https://taira.sora.org/openapi.json` консолд орж, зөвхөн унших чиглэлийг туршиж үзээрэй: `GET /status`, `GET /v1/domains`, эсвэл `GET /v1/assets/definitions`. Гарын үсэг зурсан гүйлгээ, хувийн ач холбогдолтой урсгалыг SDK эсвэл CLI Хэрэглэгч нь танай цаг хугацааны орчны нууцыг борлуулах.

## Хэрэглэгчид үүссэн {#generated-clients}

Женератор команд нь консолын ачаалалтай ижил амьд OpenAPI баримтыг ашигладаг. Энэ нь JSON оператор, судлаач, апп болон телеметрийн замаар ашигтай юм.

Гарын үсэг зурсан номын сангийн гүйлгээ, гарын үсэг зурасан асуултууд, Norito - үндсэн ашиг ачааллын хувьд албан ёсны Iroha SDKs хэрэглэгчдийг сонгоно. OpenAPI үйлчлүүлэгчид танд гарын үсгийн цуглуулж, дансны түлхүүр удирдахгүй, эсвэл Norito гүйлгээний байгууллагыг кодлахгүй.

OpenAPI генераторд дэмжлэг үзүүлдэг бүх генераторийг шалгахын тулд:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
