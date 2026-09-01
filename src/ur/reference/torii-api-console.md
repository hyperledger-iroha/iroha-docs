---
translation_locale: ur
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: nllb-200-ct2

aside: false
pageClass: torii-api-console-page
---

# کنسول Torii API {#torii-api-console}

راستوں کا معائنہ کرنے، ٹیسٹ کی درخواستیں بھیجنے، curl کمانڈز کو کاپی کرنے اور کلائنٹ کوڈ پیدا کرنے کے لئے چلنے والے Torii اختتامی نقطہ سے براہ راست OpenAPI دستاویز کا استعمال کریں۔

<ToriiApiConsole />

## ضروریات {#requirements}

- Torii اختتامی نقطہ `/openapi.json` کو بے نقاب کرنا چاہئے.
- براؤزر ٹیسٹنگ CORS اس دستاویزات کی اصل کی اجازت دینے کے لئے کی ضرورت ہے.
- براؤزر کو براہ راست اختتامی نقطہ تک پہنچنے کے قابل ہونا ضروری ہے.
- کوڈ کی پیداوار کے لئے Node.js ، pnpm، اور ایک جاوا رن ٹائم کی ضرورت ہے OpenAPI جنریٹر.

کنسول ڈیفالٹ `https://taira.sora.org`. مقامی ترقی عام طور پر `http://127.0.0.1:8080` کے ساتھ کام کرتا ہے جب آپ اپنی مشین پر Torii چلاتے ہیں.

## Taira سب سے پہلے کوشش کریں {#try-taira-first}

ایک کلائنٹ پیدا کرنے سے پہلے، چیک کریں کہ عوامی OpenAPI دستاویز آپ کی مشین سے قابل رسائی ہے:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

پھر `https://taira.sora.org/openapi.json` کو کنسول میں چسپاں کریں اور صرف پڑھنے کے راستے کی کوشش کریں جیسے `GET /status` ، `GET /v1/domains`، یا `GET /v1/assets/definitions`۔ دستخط شدہ ٹرانزیکشن اور نجی کلید کے بہاؤ کو SDK یا CLI کلائنٹ کے لئے محفوظ کریں جو آپ کے رن ٹائم ماحول سے راز بھری ہوئی ہے۔

## پیدا کردہ کلائنٹ {#generated-clients}

جنریٹر کمانڈ ایک ہی لائیو OpenAPI دستاویز کا استعمال کرتا ہے جو کنسول لوڈ کرتی ہے۔ یہ JSON آپریٹر ، ایکسپلورر ، ایپ اور ٹیلی میٹری راستوں کے لئے مفید ہے۔

signed ledger transactions، signed queries اور Norito-native payloads کے لیے سرکاری Iroha SDKs کو ترجیح دیں۔ OpenAPI clients آپ کی جانب سے signatures نہیں بناتے، account keys کا انتظام نہیں کرتے اور Norito transaction bodies encode نہیں کرتے۔

OpenAPI جنریٹر کی حمایت سے ہر جنریٹر کا معائنہ کرنے کے لئے، چلائیں:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
