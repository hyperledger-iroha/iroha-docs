---
translation_locale: am
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: bing-translator-llm

aside: false
pageClass: torii-api-console-page
---

# Torii API ኮንሶል {#torii-api-console}

መንገዶችን ለመመርመር፣ የሙከራ ጥያቄዎችን ለመላክ፣ የ curl ትዕዛዞችን ለመቅዳት እና የደንበኛ ኮድ ለማመንጨት የቀጥታ OpenAPI ሰነዱን ከሩጫ Torii API የመጨረሻ ነጥብ ይጠቀሙ።

<ToriiApiConsole />

## መስፈርቶች {#requirements}

- Torii API የመጨረሻ ነጥብ `/openapi.json` ማጋለጥ አለበት።
- የአሳሽ ሙከራ ይህንን ሰነድ አመጣጥ ለመፍቀድ CORS ያስፈልገዋል።
- አሳሹ በቀጥታ ወደ API የመጨረሻ ነጥብ መድረስ መቻል አለበት።
- ኮድ ማመንጨት Node.js፣ pnpm እና የጃቫ ሶፍትዌር ማስፈጸሚያ አካባቢን ለ OpenAPI ጀነሬተር ያስፈልገዋል።

ኮንሶሉ ነባሪ ወደ `https://taira.sora.org` ነው። በማሽንዎ ላይ Torii ሲያሄዱ የአካባቢ ልማት ብዙውን ጊዜ ከ`http://127.0.0.1:8080` ጋር ይሰራል።

## መጀመሪያ ይሞክሩ Taira {#try-taira-first}

ደንበኛ ከማመንጨትዎ በፊት ይፋዊው OpenAPI ሰነድ ከማሽንዎ ሊደረስበት የሚችል መሆኑን ያረጋግጡ -

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

ከዚያ `https://taira.sora.org/openapi.json` ወደ ኮንሶሉ ይለጥፉ እና እንደ `GET /status`፣ `GET /v1/domains` ወይም `GET /v1/assets/definitions` ያሉ ተነባቢ-ብቻ መንገድ ይሞክሩ። ከሶፍትዌር ማስፈጸሚያ አካባቢዎ ሚስጥሮችን ለሚጭን SDK ወይም CLI ደንበኛ የተፈረመ ግብይት እና የግል ቁልፍ ፍሰቶችን ያስቀምጡ።

## የመነጩ ደንበኞች {#generated-clients}

የጄነሬተር ትዕዛዙ ኮንሶሉ የሚጭነውን ተመሳሳይ የቀጥታ OpenAPI ሰነድ ይጠቀማል። ይህ ለ JSON ኦፕሬተር፣ አሳሽ፣ መተግበሪያ እና የቴሌሜትሪ መስመሮች ጠቃሚ ነው።

ለተፈረሙ የብሎክቼይን መዝገብ ግብይቶች፣ የተፈረሙ መጠይቆች እና Norito-ቤተኛ ጭነቶች፣ ኦፊሴላዊውን Iroha SDKs ይመርጣሉ። OpenAPI ደንበኞች ፊርማዎችን አይሰበስቡም፣ የመለያ ቁልፎችን አያስተዳድሩም ወይም Norito የግብይት አካላትን ኮድ አያደርጉልዎትም።

በ OpenAPI ጄነሬተር የሚደገፈውን እያንዳንዱን ጀነሬተር ለመፈተሽ ያሂዱ -

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
