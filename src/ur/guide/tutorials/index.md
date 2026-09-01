---
translation_locale: ur
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK سبق {#sdk-tutorials}

ان صفحات میں مرکزی کام کی جگہ سے بھیجے گئے Iroha 3 کلائنٹ داخلہ پوائنٹس کا خلاصہ کیا گیا ہے، بشمول کینیکل پیکجوں کے نام، تنصیب کے راستے، اور کم از کم شروعاتی مقامات شامل ہیں.

## سفارش کردہ حکم {#recommended-order}

1. [Iroha 3](/ur/get-started/install-iroha.md) انسٹال کریں
2. [لانچنگ Iroha 3](/ur/get-started/launch-iroha.md)
3. SDK کا انتخاب کریں:
   - [Rust](/ur/guide/tutorials/rust.md)
   - [Python](/ur/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/ur/guide/tutorials/javascript.md)
   - [Kotlin،Android، اور جاوا ](/ur/guide/tutorials/kotlin-java.md)
   - [Swift اور iOS](/ur/guide/tutorials/swift.md)
4. مکمل کلائنٹ ایپلی کیشن ریفرنس چاہتے ہیں تو [ نمونہ ایپس](/ur/guide/tutorials/sample-apps.md) کا جائزہ لیں.
5. [Kaigi کو ضم کریں](/ur/guide/tutorials/kaigi.md) کا استعمال کریں جب آپ اپنے ایپ میں بٹوے کے ساتھ آڈیو / ویڈیو میٹنگز شامل کرنا چاہتے ہیں۔
6. [Musubi پیکجوں](/ur/guide/tutorials/musubi.md) کا استعمال کریں جب آپ کو دوبارہ قابل استعمال Kotodama سورس لائبریریوں کی ضرورت ہو جس میں منسلک آن چین رجسٹری انحصار ہوتا ہے۔

## نمونے {#samples}

اپ اسٹریم ورک اسپیس میں JavaScript ترکیبیں اور Swift/iOS نمونہ منصوبے شامل ہیں۔ Android کے لئے ، Kotlin SDK ماڈیولز اور ان کے ٹیسٹ سے شروع کریں۔

- [نمونہ ایپلی کیشنز کا جائزہ](/ur/guide/tutorials/sample-apps.md)
- [ایک JavaScript ایپ میں Kaigi ایمبیڈ کریں ](/ur/guide/tutorials/kaigi.md)

## سچائی کا منبع {#source-of-truth}

یہاں کے تمام SDK صفحات موجودہ اپ اسٹریم ورک اسپیس سے اخذ کیے گئے ہیں۔

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (جاوا آئینہ Kotlin-پہلی Android سطح کا)
- `IrohaSwift`
- `crates/musubi`

جب شک ہو تو، ان ڈائرکٹریوں میں README اور پیکج میٹا ڈیٹا کو ترجیح دیں؛ وہ آپ کی تعمیر کے ذریعہ نظر ثانی کی وضاحت کرتے ہیں.
