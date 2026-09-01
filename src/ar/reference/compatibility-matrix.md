---
translation_locale: ar
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# مصفوفة التوافق {#compatibility-matrix}

تُظهر مصفوفة التوافق التبادل المتقاطع SDK تغطية السيناريو للحالي Iroha 3 تم إعداد المستندات. بشكل افتراضي، تقوم الصفحة بتحميل عرض بيانات نقطة زمنية المدمج الذي تم إنشاؤه من المثبت [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha) مراجعة.

المصفوفة تتكون من:

- القصص في العمود الأول
- SDKs عبر الأعمدة المتبقية
- رموز الحالة للبيانات المغطاة والفاشلة والمفقودة

يتم الإبلاغ عن النتائج التي تم التحقق منها فقط بواسطة سير عمل التحديث على أنها مغطاة أو فاشلة. يتم عرض السيناريوهات التي لا تحتوي على أدلة للنسخة المثبتة على أنها بيانات مفقودة بدلاً من وراثة النتائج من نسخة مصدر أخرى.

<CompatibilityMatrixTable />

::: info
قم بتعيين `VITE_COMPAT_MATRIX_URL` فقط لتجاوز عرض البيانات اللحظية المدمج باستخدام خلفية حية متوافقة. بدون هذه المتغير، يتم تحميل الصفحة `src/public/compat-matrix.json`.
:::
