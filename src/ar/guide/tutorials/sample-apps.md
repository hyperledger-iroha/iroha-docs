---
translation_locale: ar
translation_source: /guide/tutorials/sample-apps.md
translation_source_hash: 4979ab2c52eba4040d7f003f3da73dbc333fa7e047b0259816d0d34f97377749
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# عينات ووصفات {#samples-and-recipes}

يحتوي مستودع المصدر Iroha على SDK وصفات ومجموعات اختبار تتبع نفس الإصدار مثل العقدة.

## JavaScript وصفات {#javascript-recipes}

[`javascript/iroha_js/recipes`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/recipes) يحتوي على أمثلة مركزة لتجميع المعاملات الحتمية، Nexus تحويلات التطبيق, NFT وتكرار الحساب، ISO تدفقات الجسر، و Torii البث المباشر. كل وصفة توثق ما إذا كانت تعمل بدون اتصال أو تحتاج إلى بث مباشر Torii API نقطة النهاية.

## Swift ونظام iOS {#swift-and-ios}

استخدم `IrohaSwift/Tests/IrohaSwiftTests` للأمثلة التي تم التحقق منها مقابل Swift SDK الحالية. انظر [Swift ونظام iOS](/ar/guide/tutorials/swift.md) لإعداد الحزمة والجسر.

## Android {#android}

بالنسبة للعمل الجديد Android، استخدم الوحدات Kotlin-الأولى `core-jvm`، `client-android`، و`offline-wallet-android` الموضحة في [Kotlin، Android، وجافا](/ar/guide/tutorials/kotlin-java.md). يعد Kotlin SDK نقطة البداية الأساسية لمستهلكي Android.
