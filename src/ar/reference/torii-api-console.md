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

استخدم وثيقة OpenAPI الحية من نقطة نهاية تعمل Torii للتفتيش على الطرق وإرسال طلبات الاختبار ونسخ أوامر curl وإنشاء رمز العميل.

<ToriiApiConsole />

## المتطلبات {#requirements}

- يجب على نقطة نهاية Torii أن تكشف `/openapi.json`.
- اختبار المتصفح يتطلب CORS للسماح لهذه الوثائق من أصل.
- يجب أن يكون المتصفح قادراً على الوصول مباشرة إلى نقطة النهاية.
- يتطلب توليد الشفرة Node.js، pnpm، وقتا تشغيل جاوا لجهاز توليد OpenAPI.

الجهاز الافتراضي هو `https://taira.sora.org`. التطوير المحلي عادة ما يعمل مع `http://127.0.0.1:8080` عند تشغيل Torii على جهازك.

## حاول Taira أولاً {#try-taira-first}

قبل إنشاء عميل، تحقق من إمكانية الوصول إلى وثيقة OpenAPI العامة من جهازك:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

ثم ضعي `https://taira.sora.org/openapi.json` في جهاز الاشتراك ومحاولة طريق القراءة فقط مثل `GET /status`، `GET /v1/domains`، أو `GET /v1/assets/definitions`. حفظ المعاملات الموقعة وتدفقات المفاتيح الخاصة لعميل SDK أو CLI الذي يحمل الأسرار من بيئة وقت التشغيل الخاص بك .

## العملاء المولودين {#generated-clients}

يستخدم أمر المولد نفس وثيقة OpenAPI الحية التي تحملها جهاز التحكم. هذا مفيدًا لمشغل JSON ، والمستكشف ، والتطبيقات ، والطرق التلفازية.

بالنسبة للمعاملات الموقعة في دفتر التسجيل ، والمسائل الموقعة ، و Norito - الحمولة الفائدة الأصلية ، تفضل الرسمية Iroha SDKs. لا يقوم عملاء OpenAPI بتجميع توقيعات أو إدارة مفاتيح الحسابات ، أو تشفير أجسام المعاملات Norito لك. .

للتفتيش على كل مولد يدعمها مولد OpenAPI، قم بتشغيل:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
