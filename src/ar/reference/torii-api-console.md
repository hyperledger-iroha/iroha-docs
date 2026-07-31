---
translation_locale: ar
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: nllb-200-ct2

aside: false
pageClass: torii-api-console-page
---

# Torii API أجهزة التحكم {#torii-api-console}

استخدم الموقع OpenAPI الوثيقة من جهاز تشغيل Torii نقطة النهاية لتحقيق الطرق،
إرسال طلبات الاختبار، نسخة curl أوامر، وتوليد رمز العميل.

<ToriiApiConsole />

## المتطلبات {#requirements}

- (الـ) Torii نقطة النهاية يجب أن تكشف `/openapi.json`.
- اختبار المتصفح يتطلب CORS السماح لهذه الوثائق المنشأ.
- يجب أن يكون المتصفح قادرًا على الوصول إلى نقطة النهاية مباشرة.
- إنشاء الرمز يتطلب Node.js, pnpm, وأوقات تشغيل جاوا OpenAPI
  مولد

أجهزة التحكم الافتراضية `https://taira.sora.org`. التنمية المحلية عادة
يعمل مع `http://127.0.0.1:8080` عندما تهرب Torii على جهازك

## حاولي Taira أولاً {#try-taira-first}

قبل إنشاء عميل، تحقق من أن الجمهور OpenAPI الوثيقة متاحة
من جهازك:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

ثم ضغط `https://taira.sora.org/openapi.json` إلى الجهاز ومحاولة
طريق القراءة فقط مثل: `GET /status`, `GET /v1/domains`, أو
`GET /v1/assets/definitions`. حفظ المعاملات الموقعة وتدفقات المفتاح الخاص
(أ) SDK أو CLI العميل الذي يحمل أسرار من بيئتك

## العملاء الذين تم إنشاؤهم {#generated-clients}

القيادة المولدة تستخدم نفس الحية OpenAPI الوثيقة التي أرسلتها الجهاز
هذه مفيدة JSON المُشغل، المستكشف، التطبيقات، والطرق المتعددة.

بالنسبة للمعاملات الموقعة في دفتر التسجيل، والمسائل الموقعة، و Norito-حمولات مفيدة،
تفضل المسؤول Iroha SDKs. OpenAPI لا يقوم العملاء بتجميع التوقيعات،
إدارة مفاتيح الحساب، أو تشفير Norito هيئات المعاملات لك.

للتفتيش على كل مولد مدعوم من OpenAPI مولد، تشغيل:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
