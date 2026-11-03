---
translation_locale: ru
translation_source: /guide/tutorials/sample-apps.md
translation_source_hash: c1432d8d2483f67b6ab81680f6c5457cab470db7944512626242a1446a7d501f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Образцы и рецепты {#samples-and-recipes}

Исходный репозиторий Iroha содержит SDK рецептов и тестовых наборов, которые отслеживают ту же редакцию, что и узел.

## JavaScript Рецепты {#javascript-recipes}

[`javascript/iroha_js/recipes`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/recipes) содержит конкретные примеры для детерминированной пакетной обработки транзакций, Nexus переводы через приложение NFT и итерация учётной записи, ISO мостовые потоки, и Torii потоковая передача. Каждый рецепт указывает, работает ли он офлайн или требует подключения в реальном времени Torii API конечная точка.

## Swift и iOS {#swift-and-ios}

Используйте `IrohaSwift/Tests/IrohaSwiftTests` для примеров, проверенных по текущему Swift SDK. См. [Swift и iOS](/ru/guide/tutorials/swift.md) для настройки пакета и моста.

## Android {#android}

Для новой работы Android используйте модули Kotlin-первых `core-jvm`, `client-android` и `offline-wallet-android`, описанные в [Kotlin, Android и Java](/ru/guide/tutorials/kotlin-java.md). Kotlin SDK является канонической отправной точкой для потребителей Android.
