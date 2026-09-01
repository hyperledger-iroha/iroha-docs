---
translation_locale: ar
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: bing-translator-llm

aside: false
pageClass: torii-api-console-page
---

# Torii API وحدة التحكم {#torii-api-console}

استخدم المستند الحي OpenAPI من نقطة النهاية API لـ Torii قيد التشغيل لفحص المسارات، إرسال طلبات اختبار، نسخ أوامر curl، وإنشاء كود العميل.

<ToriiApiConsole />

## متطلبات {#requirements}

- يجب أن يكشف نقطة النهاية Torii API عن `/openapi.json`.
- اختبار المتصفح يتطلب CORS للسماح بهذا الأصل للوثائق.
- يجب أن يكون المتصفح قادرًا على الوصول إلى نقطة النهاية API مباشرة.
- تتطلب توليد الكود Node.js و pnpm وبيئة تشغيل برنامج جافا لـ OpenAPI Generator.

تقوم وحدة التحكم بالتعيين الافتراضي إلى `https://taira.sora.org`. عادةً ما يعمل التطوير المحلي مع `http://127.0.0.1:8080` عند تشغيل Torii على جهازك.

## جرب Taira أولاً {#try-taira-first}

قبل إنشاء عميل، تحقق من أن المستند العام OpenAPI يمكن الوصول إليه من جهازك:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

ثم الصق `https://taira.sora.org/openapi.json` في وحدة التحكم وجرب مساراً للقراءة فقط مثل `GET /status`، `GET /v1/domains`، أو `GET /v1/assets/definitions`. احفظ تدفقات المعاملات الموقعة والمفتاح الخاص لعميل SDK أو CLI الذي يقوم بتحميل الأسرار من بيئة تشغيل البرنامج الخاص بك.

## العملاء الناتجون {#generated-clients}

يستخدم أمر المولد نفس مستند OpenAPI الحي الذي يقوم الكونسول بتحميله. هذا مفيد لمسار المشغل JSON، المستكشف، التطبيق، والقياسات عن بُعد.

للمعاملات المدرجة في دفتر الأستاذ على البلوك تشين الموقعة، والاستفسارات الموقعة، والتحميلات الأصلية من نوع Norito، يفضل استخدام Iroha الرسمي SDKs. عملاء OpenAPI لا يجمعون التواقيع، ولا يديرون مفاتيح الحساب، ولا يشفرون أجسام المعاملات من نوع Norito نيابة عنك.

لفحص كل مولد مدعوم بواسطة مولد OpenAPI، قم بتشغيل:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
