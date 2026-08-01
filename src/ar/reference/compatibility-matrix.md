---
translation_locale: ar
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# المصفوفة التوافق {#compatibility-matrix}

المصفوفة التوافقية تظهر SDK تغطية السيناريوهات الحالية Iroha 3 تعيين الوثائق. افتراضيًا ، تحميل الصفحة اللقطة المجمعة التي تم إنشاؤها من الحلقة [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha) المراجعة

تتكون المصفوفة من:

- قصص في العمدة الأولى
- SDKs عبر العمود المتبقية
- رموز حالة للبيانات المغطاة والفاشلة والمفقودة.

يتم الإبلاغ عن النتائج التي تم التحقق منها من خلال تدفق العمل التحديث كمتغطية أو فشلت. يتم عرض سيناريوهات بدون دليل على المراجعة المسجلة باعتبارها بيانات مفقودة بدلاً من الوراثة النتائج من مراجعة مصدر أخرى.

<CompatibilityMatrixTable />

::: info
حدد `VITE_COMPAT_MATRIX_URL` فقط لتجاوز اللقطة الفورية المجمعة مع الخلفية الحية المتوافقة. بدون هذه المتغيرة، تحميل الصفحة `src/public/compat-matrix.json`.
:::
