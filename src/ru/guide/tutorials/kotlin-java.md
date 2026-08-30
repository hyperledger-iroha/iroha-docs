---
translation_locale: ru
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 62d6f434e5af4213420c456ee27ebdc260c8b0e9f7a85bc3ba955ee9c79a058d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin, Android и Java {#kotlin-android-and-java}

Kotlin SDK является по умолчанию клиентским стеком для приложений JVM и Android. Он находится под `kotlin/` в хранилище Iroha и разделен на платформы, поэтому портативный код не приобретает зависимости от Android.

## Модули {#modules}

|Артефакт |Тип |Использовать |
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm` |JAR |Чистая Kotlin/JVM Norito, модель данных, крипто, транзакция, Torii и код протокола |
|`org.hyperledger.iroha.sdk:client-android` |AAR |Ключевое хранилище Android, телеметрия устройств и интеграции с клиентами, поддерживаемые JNI |
|`org.hyperledger.iroha.sdk:offline-wallet-android` |AAR |Android Транспорт и интеграция оффлайн-кошелька на основе `client-android` |

Артефакты еще не опубликованы в Maven Central. Создайте и опубликуйте их на местном уровне из закрепленного Iroha пересмотра источника:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

Затем выберите только артефакт , который нужен вашему приложению:

```kotlin
repositories {
    mavenLocal()
}

dependencies {
    implementation("org.hyperledger.iroha.sdk:core-jvm:0.1.0")
    // Android client features:
    // implementation("org.hyperledger.iroha.sdk:client-android:0.1.0")
    // Android offline-wallet features:
    // implementation("org.hyperledger.iroha.sdk:offline-wallet-android:0.1.0")
}
```

`core-jvm` не содержит зависимости от Android. Сохраняйте код клиента и клавиатуры Android в `client-android`, а также используйте `offline-wallet-android` для потоков оффлайн-кошелька и JNI только для Android.

## Kotlin и Java совместимость {#kotlin-and-java-compatibility}

Общественность API - это Kotlin- в первую очередь и предоставляет Java интероп, где JVM Соответствующие изменения отображаются в соответствующих `java/` Реализация. Android интеграции должны начинаться с Kotlin Артефакты наверху.

Все . Kotlin модули применения JDK 8 API совместимость на момент составления с `-Xjdk-release=8`, даже несмотря на то, что строительная цепочка инструментов сама использует JDK 21. Не используйте JDK 9+ APIs в SDK Код.

## Строить и испытать {#build-and-test}

Используйте переносные испытания JVM:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Сооружение артефактов Android:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## Нынешнее охватывание {#current-coverage}

В Kotlin SDK входят:

- Norito кодирование и декодирование
- обработка канонических счетов и адресов активов
- создание транзакций, подписание и офлайн-конверты
- Клиенты Torii HTTP, WebSocket и SSE
- мультиподпись, подписка, SoraFS, Nexus и модели Connect
- Android Интеграция клавиатуры и устройства телеметрии
- Транспорт Android вне интернета QR, близлежащий и NFC

См. [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/kotlin/README.md) для специальных модулей APIs и точных команд по созданию.
