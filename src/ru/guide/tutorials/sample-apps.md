---
translation_locale: ru
translation_source: /guide/tutorials/sample-apps.md
translation_source_hash: af3e0b8698f877c035ccd3bb71926cea14d1029fc2eb73e23756d57357935f0e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Образцы и рецепты {#samples-and-recipes}

Сборник Iroha источник хранилища содержит SDK рецепты и тестовые комплекты, которые отслеживают
одинаковый пересмотр с узлом.

## JavaScript Рецепты {#javascript-recipes}

[`javascript/iroha_js/recipes`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js/recipes)
содержит целенаправленные примеры детерминистических партий транзакций, Nexus приложение
перечисления, NFT и перечисления счетов, ISO мостовые потоки и Torii Поток.
Каждый рецепт документирует, работает ли он вне интернета или нуждается в живой Torii конечная точка.

## Swift и iOS {#swift-and-ios}

Использование `IrohaSwift/Tests/IrohaSwiftTests` для примеров, подтвержденных по сравнению с текущим
Swift SDK. Посмотрите. [Swift и iOS](/ru/guide/tutorials/swift.md) для упаковки и моста
Установка.

## Android {#android}

Для новых Android работа, используйте Kotlin-первое. `core-jvm`, `client-android`, и
`offline-wallet-android` модули, описанные в
[Kotlin, Android, и Java](/ru/guide/tutorials/kotlin-java.md). Сборник Kotlin SDK является
каноническая отправная точка для Android потребителям.
