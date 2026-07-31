---
translation_locale: ar
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# حل المشاكل {#troubleshooting}

هذا القسم يهدف إلى المساعدة إذا واجهت مشاكل أثناء العمل مع
Iroha. إذا حدث شيء خاطئ، من فضلك [تحقق من المفاتيح](#check-the-keys)
أولاً، إذا لم يساعدك ذلك، تحقق من تعليمات حل المشاكل
كل مرحلة:

- [مشاكل في التثبيت](./installation-issues.md)
- [مشكلات التشغيل](./configuration-issues.md)
- [قضايا الانتشار](./deployment-issues.md)
- [قضايا التكامل](./integration-issues.md)

إذا لم يتم وصف المشكلة التي تواجهها هنا، اتصل بنا عبر
[تلغرام](https://t.me/hyperledgeriroha).

## تحقق من المفاتيح {#check-the-keys}

معظم المشاكل تنشأ نتيجة لمفاتيح غير متطابقة لهذا السبب نوصي
لتحقيق هذه القاعدة: **إذا حدث شيء خاطئ، تحقق من المفاتيح
أولاً**.

وهنا تفسير سريع: ليس من الممكن التمييز بين الخطأ
الرسائل التي تنشأ عندما مفاتيح الأقران لا تتطابق مع المفاتيح في صف
أقرانهم الموثوقين لأنه سيُكشف عن مفتاحهم العام.
لديهم مخططات هيلم أو تنفيذ Kubernetes مع مفاتيح محددة من خلال البيئة
المتغيرات، مقارنة المكونات
[`public_key`](/ar/reference/peer-config/params.md#param-public-key),
[`private_key`](/ar/reference/peer-config/params.md#param-private-key), و
[`trusted_peers`](/ar/reference/peer-config/params.md#param-trusted-peers)
القيم قبل التحقيق في الفشل على مستوى أعلى.

إذا كان هناك شك، [توليد زوج جديد من المفاتيح](/ar/guide/security/generating-cryptographic-keys.md).
