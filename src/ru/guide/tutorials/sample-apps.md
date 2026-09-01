---
translation_locale: ru
translation_source: /guide/tutorials/sample-apps.md
translation_source_hash: 4979ab2c52eba4040d7f003f3da73dbc333fa7e047b0259816d0d34f97377749
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Образцы и рецепты {#samples-and-recipes}

Исходный репозиторий Iroha содержит SDK рецептов и тестовых наборов, которые отслеживают ту же редакцию, что и узел.

## JavaScript Рецепты {#javascript-recipes}

[`javascript/iroha_js/recipes`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/recipes) содержит конкретные примеры для детерминированной пакетной обработки транзакций, Nexus переводы через приложение NFT и итерация учётной записи, ISO мостовые потоки, и Torii потоковая передача. Каждый рецепт указывает, работает ли он офлайн или требует подключения в реальном времени Torii API конечная точка.

## Swift и iOS {#swift-and-ios}

Используйте `IrohaSwift/Tests/IrohaSwiftTests` для примеров, проверенных по текущему Swift SDK. См. [Swift и iOS](/ru/guide/tutorials/swift.md) для настройки пакета и моста.

## Android {#android}

Для новой работы Android используйте модули Kotlin-первых `core-jvm`, `client-android` и `offline-wallet-android`, описанные в [Kotlin, Android и Java](/ru/guide/tutorials/kotlin-java.md). Kotlin SDK является канонической отправной точкой для потребителей Android.
