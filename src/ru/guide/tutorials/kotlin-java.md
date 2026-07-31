---
translation_locale: ru
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 91dfd38597028531ec579eeb97dcd5acbfcdf6d27ba51991ca96a2d40077aaef
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin, Android, и Java {#kotlin-android-and-java}

Сборник Kotlin SDK является стандартным клавиатуром клиента для JVM и Android заявления.
Он живет под `kotlin/` в Iroha хранилище и разделено по платформе так
портативный код не приобретает Android зависимости.

## Модули {#modules}

| Артефакт | Тип | Использование |
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR | Чистая Kotlin/JVM Norito, модель данных, крипто, транзакция, Torii, и код протокола |
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android клавиатура, телеметрия устройства и JNI- поддерживаемая интеграция клиентов |
| `org.hyperledger.iroha.sdk:offline-wallet-android` | AAR | Android Транспорт и интеграция оффлайн-кошелька, основанные на `client-android` |

Артефакты еще не опубликованы в Maven Central.
локально от застрявшего Iroha пересмотр источника:

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

`core-jvm` не содержит Android Зависимости. Android клиент и клавиатура
код в `client-android`, и использование `offline-wallet-android` для Android- Только
офлайн-кошелек и JNI Поток.

## Kotlin и Java совместимость {#kotlin-and-java-compatibility}

Общественность API является Kotlin-первое и обеспечивает Java-интерплей, где JVM нуждаются в звонках
Соответствующие изменения отражены в соответствующих `java/`
Реализация. Android Интеграции должны начинаться с Kotlin
Артефакты наверху.

Все Kotlin Модули применения JDK 8 API совместимость во время составления с
`-Xjdk-release=8`, Хотя строительная цепочка инструментов сама использует JDK 21. Не
использование JDK 9+ APIs в SDK Код.

## Строить и испытать {#build-and-test}

Запустить портативный JVM испытания:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Создать Android артефакты:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## Нынешнее охватывание {#current-coverage}

Сборник Kotlin SDK включает в себя:

- Norito кодирование и декодирование
- канонический учет и обработка адресов активов
- создание транзакций, подписание и офлайн-конверты
- Torii HTTP, WebSocket, и SSE клиенты
- многоподпись, подписка, SoraFS, Nexus, и модели Connect
- Android интеграции клавиатуры и телеметрии устройств
- Android оффлайн QR, Вблизи, и NFC перевозки

Смотрите [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/main/kotlin/README.md)
для модулей APIs и точные команды по строительству.
