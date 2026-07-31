---
translation_locale: ar
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ماتريكس التوافق {#compatibility-matrix}

المصفوفة التوافقية تظهر SDK تغطية السيناريوهات الحالية
Iroha 3 مجموعة المستندات. افتراضيًا ، تقوم الصفحة بتحميل اللقطة الفورية المجمعة التي تم إنشاؤها
" من المكسرين " [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha)
مراجعة.

تتكون المصفوفة من:

- **القصص** في العمود الأول
- **SDKs** عبر الأعمدة المتبقية
- **رموز الحالة** للبيانات المغطاة والفاشلة والمفقودة

يتم الإبلاغ عن النتائج المحققة فقط من خلال تدفق العمل التجديد على أنها تغطية أو
فشلت. سيناريوهات بدون دليل على الإصلاح المثبت يتم عرضها ك
البيانات المفقودة بدلاً من إرث النتائج من مراجعة مصدر آخر.

<CompatibilityMatrixTable />

::: info
المجموعة `VITE_COMPAT_MATRIX_URL` فقط للتغلب على الصورة الفورية المجمعة
متوافقة الخلفية الحية. بدون هذا المتغير، الصفحة تحميل
`src/public/compat-matrix.json`.
:::
