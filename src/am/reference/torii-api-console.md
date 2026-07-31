---
translation_locale: am
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: nllb-200-ct2

aside: false
pageClass: torii-api-console-page
---

# Torii API ኮንሶል {#torii-api-console}

በቀጥታ ይጠቀሙ OpenAPI ከስራ ላይ ካለው ሰነድ Torii የመመርመሪያ መስመሮችን የማጠናቀቂያ ነጥብ፣
የሙከራ ጥያቄዎችን መላክ፣ ኮፒ ማድረግ curl ትዕዛዞች እና የደንበኛ ኮድ ማመንጨት.

<ToriiApiConsole />

## መስፈርቶች {#requirements}

- የ Torii መጨረሻ ነጥብ ማጋለጥ አለበት `/openapi.json`.
- የአሳሽ ሙከራ ያስፈልጋል CORS ይህ ሰነድ መነሻ እንዲኖረው ለማድረግ.
- አሳሹ በቀጥታ ወደ መጨረሻው ነጥብ መድረስ ይችላል።
- ኮድ ማመንጨት ይጠይቃል Node.js, pnpm, እና የጃቫ ሩጫ ጊዜ OpenAPI
  ጀነሬተር.

የኮንሶሉ ነባሪነት `https://taira.sora.org`. በአብዛኛው አካባቢያዊ ልማት
ጋር ይሰራል `http://127.0.0.1:8080` ስትሮጥ Torii በማሽኑ ላይ።

## ይሞክሩ Taira በመጀመሪያ {#try-taira-first}

አንድ ደንበኛ ማመንጨት በፊት, የሕዝብ OpenAPI ሰነዱ ተደራሽ ነው
ከመሳሪያዎ:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

ከዚያም አጣብቂኝ `https://taira.sora.org/openapi.json` ወደ ኮንሶሉ ውስጥ እና አንድ ይሞክሩ
የንባብ ብቻ መንገድ ለምሳሌ `GET /status`, `GET /v1/domains`, ወይም
`GET /v1/assets/definitions`. የተፈረሙ ግብይቶች እና የግል ቁልፍ ፍሰቶችን ለማስቀመጥ
አንድ SDK ወይም CLI የስራ ሰዓት አካባቢህን ሚስጥሮች የሚጫን ደንበኛ።

## የተፈጠሩ ደንበኞች {#generated-clients}

የጄኔሬተር ትዕዛዝ ተመሳሳይ ቀጥታ ይጠቀማል OpenAPI ኮንሶሉ
ይህ ለ JSON ኦፕሬተር፣ አስፋፊ፣ መተግበሪያ እና የቴሌሜትሪ መስመሮች።

ለተፈረሙ የቁጥር መዝገብ ግብይቶች ፣ ለተፈረሙ ጥያቄዎች እና Norito-የተፈጥሯቸው ጥቅሞች፣
ባለሥልጣኑን ይመርጣሉ Iroha SDKs. OpenAPI ደንበኞች ፊርማ አያሰባስቡም
የሂሳብ ቁልፎችን ያቀናብሩ ወይም ኮድ ያድርጉ Norito የግብይት አካላት ለእርስዎ።

እያንዳንዱን ጀነሬተር ለመፈተሽ OpenAPI ጄኔሬተር, ይሂዱ:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
