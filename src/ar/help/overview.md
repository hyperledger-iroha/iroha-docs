---
translation_locale: ar
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# استكشاف الأخطاء وإصلاحها {#troubleshooting}

هذا القسم مخصص للمساعدة إذا واجهت مشاكل أثناء العمل مع Iroha. إذا حدث خطأ ما، يرجى [تحقق من المفاتيح](#check-the-keys) أولاً. إذا لم يساعد ذلك، تحقق من تعليمات استكشاف الأخطاء لكل مرحلة:

- [مشاكل التثبيت](./installation-issues.md)
- [مشاكل التكوين](./configuration-issues.md)
- [مشاكل النشر](./deployment-issues.md)
- [مشاكل التكامل](./integration-issues.md)

إذا كانت المشكلة التي تواجهها غير مذكورة هنا، فاتصل بنا عبر [تليغرام](https://t.me/hyperledgeriroha).

## تحقق من المفاتيح {#check-the-keys}

تنشأ معظم المشاكل نتيجة للمفاتيح غير المتطابقة. لهذا نوصي باتباع هذه القاعدة: إذا حدث خطأ ما، تحقق من المفاتيح أولاً.

إليكم شرح سريع: من غير الممكن التمييز بين رسائل الخطأ التي تظهر عندما لا تتطابق مفاتيح نظراء الشبكة مطابقة المفاتيح في مصفوفة الأقران الموثوقين في الشبكة لأنها قد تعرض المفتاح العام للأقران في الشبكة. على هذا النحو، إذا كان لديك مخططات Helm أو نشرات Kubernetes مع مفاتيح معرفة عبر متغيرات البيئة، قارن الإعدادات [`public_key`](/ar/reference/peer-config/params.md#param-public-key), [`private_key`](/ar/reference/peer-config/params.md#param-private-key), و [`trusted_peers`](/ar/reference/peer-config/params.md#param-trusted-peers) القيم قبل التحقيق في الإخفاقات على مستوى أعلى.

إذا كنت في شك، [توليد زوج جديد من المفاتيح](/ar/guide/security/generating-cryptographic-keys.md).
