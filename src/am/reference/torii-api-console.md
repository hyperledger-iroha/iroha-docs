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

መስመሮችን ለመፈተሽ፣ የሙከራ ጥያቄዎችን ለመላክ፣ curl ትዕዛዞችን ለመቅዳት እና የደንበኛ ኮድ ለማመንጨት ከሂደቱ Torii መጨረሻ ነጥብ የቀጥታ OpenAPI ሰነዱን ይጠቀሙ።

<ToriiApiConsole />

## መስፈርቶች {#requirements}

- የ Torii መጨረሻ ነጥብ `/openapi.json` ን ማሳየት አለበት.
- የአሳሽ ሙከራ ይህንን ሰነድ መነሻ ለመፍቀድ CORS ይጠይቃል ።
- አሳሹ በቀጥታ ወደ መጨረሻው ነጥብ መድረስ ይችላል.
- ኮድ ማመንጨት Node.js, pnpm, እና የጃቫ ሩጫ ጊዜ ይጠይቃል OpenAPI Generator.

የኮንሶሉ ነባሪነት `https://taira.sora.org`. አካባቢያዊ ልማት አብዛኛውን ጊዜ `http://127.0.0.1:8080` ስትሮጥ Torii በማሽኑ ላይ።

## መጀመሪያ Taira ይሞክሩ {#try-taira-first}

ደንበኛ ከመፍጠርዎ በፊት የህዝብ OpenAPI ሰነድ ከማሽኑዎ ተደራሽ መሆኑን ያረጋግጡ:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

ከዚያም በኮንሶሉ ውስጥ `https://taira.sora.org/openapi.json` ይጫኑ እና እንደ `GET /status` ፣ `GET /v1/domains` ወይም `GET /v1/assets/definitions` ያሉ ለማንበብ-ብቻ መንገድ ይሞክሩ ። የተፈረሙትን ግብይቶች እና የግል ቁልፍ ፍሰቶችን ከስራ ሰዓት አካባቢዎ ሚስጥሮችን ለሚጭነው የ SDK ወይም CLI ደንበኛ ያስቀምጡ።

## የተፈጠሩ ደንበኞች {#generated-clients}

የጄኔሬተር ትዕዛዙ በኮንሶሉ ውስጥ የሚጫነው ተመሳሳይ የቀጥታ OpenAPI ሰነድ ይጠቀማል ። ይህ ለ JSON ኦፕሬተር ፣ አሳሽ ፣ መተግበሪያ እና ለቴሌሜትሪ መስመሮች ጠቃሚ ነው።

ለተፈረሙ መቁጠሪያ ግብይቶች, ለተፈረሙ ጥያቄዎች, እና Norito- የአገሬው ተወላጅ ሸክሞች፣ ባለሥልጣናትን ይመርጣሉ። Iroha SDKs. OpenAPI ደንበኞች ፊርማዎችን አያሰባስቡም ፣ የሂሳብ ቁልፎችን አያስተዳድሩም ወይም አይኮዱም Norito የግብይት አካላት ለእርስዎ።

በ OpenAPI ጀነሬተር የሚደገፉትን እያንዳንዱን ጄኔሬተር ለመመርመር የሚከተሉትን ይሂዱ:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
