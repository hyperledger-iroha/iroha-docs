---
translation_locale: ur
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# مطابقت میٹرکس {#compatibility-matrix}

مطابقت میٹرکس موجودہ Iroha 3 دستاویزات سیٹ کے لئے کراس-SDK سناریو کی کوریج کو ظاہر کرتا ہے۔ ڈیفالٹ کے طور پر ، صفحہ پنڈ [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha) ترمیم سے تیار کردہ بنڈل اسنیپ شاٹ لوڈ کرتا ہے۔

میٹرکس میں شامل ہیں:

- پہلا کالم میں کہانیاں
- SDKs باقی کالموں میں
- احاطہ شدہ، ناکام اور لاپتہ اعداد و شمار کے لئے حیثیت کی علامتیں

تازہ کاری ورک فلو کے ذریعہ تصدیق شدہ نتائج ہی احاطہ یا ناکام ہونے کی اطلاع دی جاتی ہے۔ پنڈ revisions کے لئے ثبوت کے بغیر منظرنامے کسی دوسرے ماخذ revisions سے نتائج کا ورثہ لینے کے بجائے لاپتہ اعداد و شمار کے طور پر دکھائے جاتے ہیں۔

<CompatibilityMatrixTable />

::: معلومات
`VITE_COMPAT_MATRIX_URL` کو صرف ہم آہنگ لائیو بیک اینڈ کے ساتھ بنڈل شدہ اسنیپ شاٹ کو ختم کرنے کے لئے ترتیب دیں۔ اس متغیر کے بغیر ، صفحہ لوڈ ہوتا ہے `src/public/compat-matrix.json`.
:::
