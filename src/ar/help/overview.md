---
translation_locale: ar
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# حل المشاكل {#troubleshooting}

يهدف هذا القسم إلى المساعدة إذا واجهت مشاكل أثناء العمل مع Iroha. إذا حدث خطأ ما، يرجى التحقق من [ المفاتيح](#check-the-keys) أولاً. إذا لم يساعد ذلك، تحقق من تعليمات حل المشكلات لكل مرحلة:

- [مشكلات التثبيت](./installation-issues.md)
- [مشاكل في التكوين](./configuration-issues.md)
- [قضايا الانتشار](./deployment-issues.md)
- [قضايا التكامل](./integration-issues.md)

إذا لم يتم وصف المشكلة التي تواجهها هنا، اتصل بنا عن طريق [التليغرام ](https://t.me/hyperledgeriroha).

## تحقق من المفاتيح {#check-the-keys}

غالبية المشكلات تنشأ نتيجة لمفاتيح غير متطابقة لهذا السبب نوصي بتتبع هذه القاعدة: إذا حدث خطأ، تحقق من المفاتيح أولاً.

إليك تفسير سريع: ليس من الممكن التمييز بين رسائل الخطأ التي تنشأ عندما مفاتيح الأقران لا تتطابق مع المفاتيح في صف الأقران الموثوقين لأنها ستكشف مفتاح أقرانه العام. على هذا النحو ، إذا كان لديك مخططات Helm أو نشر Kubernetes مع مفاتيح محددة من خلال متغيرات البيئة ، قم بمقارنة القيم الموضحة [`public_key`](/ar/reference/peer-config/params.md#param-public-key) ، [`private_key`](/ar/reference/peer-config/params.md#param-private-key) ، و [`trusted_peers`](/ar/reference/peer-config/params.md#param-trusted-peers) قبل التحقيق في الفشل على مستوى أعلى.

إذا كان هناك شك، [إنتاج زوج جديد من المفاتيح ](/ar/guide/security/generating-cryptographic-keys.md).
