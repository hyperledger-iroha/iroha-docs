---
translation_locale: ar
translation_source: /guide/tutorials/sample-apps.md
translation_source_hash: 50fac5ad01faf8d09441cba90f29472da04630dbeb3c80111a19f3fb50bb1224
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-supplemental-naming-link+reviewed-delta
---
# عينات ووصفات {#samples-and-recipes}

يحتوي مستودع المصدر Iroha على SDK وصفات ومجموعات اختبار تتبع نفس الإصدار مثل العقدة.

## JavaScript وصفات {#javascript-recipes}

[`javascript/iroha_js/recipes`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/recipes) يحتوي على أمثلة مركزة لتجميع المعاملات الحتمية، SORA Nexus تحويلات التطبيق, NFT وتكرار الحساب، ISO تدفقات الجسر، و Torii البث المباشر. كل وصفة توثق ما إذا كانت تعمل بدون اتصال أو تحتاج إلى بث مباشر Torii API نقطة النهاية.

## Swift ونظام iOS {#swift-and-ios}

استخدم `IrohaSwift/Tests/IrohaSwiftTests` للأمثلة التي تم التحقق منها مقابل Swift SDK الحالية. انظر [Swift ونظام iOS](/ar/guide/tutorials/swift.md) لإعداد الحزمة والجسر.

## Android {#android}

بالنسبة للعمل الجديد Android، استخدم الوحدات Kotlin-الأولى `core-jvm`، `client-android`، و`kagemusha-wallet-android` الموضحة في [Kotlin، Android، وجافا](/ar/guide/tutorials/kotlin-java.md). يعد Kotlin SDK نقطة البداية الأساسية لمستهلكي Android.
