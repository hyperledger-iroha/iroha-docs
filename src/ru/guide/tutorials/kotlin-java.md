---
translation_locale: ru
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: f2411fec1cc35b1bf7795a7ab5a0eb7a8eb6b60b4799ebf3db47208b902f87e6
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Kotlin, Android и Java {#kotlin-android-and-java}

Kotlin SDK является стандартным клиентским стеком для приложений JVM и Android. Он находится под `kotlin/` в репозитории Iroha и разделен по платформам, поэтому переносимый код не приобретает зависимости от Android.

## Модули {#modules}

|Артефакт|Тип|Использовать|
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR |Чистый Kotlin/JVM Norito, модель данных, крипто, транзакция, Torii и код протокола|
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android хранилище ключей, телеметрия устройства и интеграции клиентов на базе JNI|
| `org.hyperledger.iroha.sdk:offline-wallet-android` | AAR | Android оффлайн-кошелек транспортирует и интегрируется на основе `client-android` |

Артефакты еще не опубликованы в Maven Central. Соберите и опубликуйте их локально из закрепленной исходной версии Iroha:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

Затем выберите только тот артефакт, который нужен вашему приложению:

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

`core-jvm` не содержит зависимостей от Android. Сохраняйте код клиента и хранилища ключей Android в `client-android` и используйте `offline-wallet-android` для Android-только офлайн-кошелька и JNI потоков.

## Kotlin и совместимость с Java {#kotlin-and-java-compatibility}

Публичный API является Kotlin-первым и обеспечивает взаимодействие с Java там, где это требуется запрашивающими клиентами JVM. Эквивалентные изменения отражены в соответствующей реализации `java/`. Новые интеграции Android должны начинаться с приведенных выше артефактов Kotlin.

Все модули Kotlin обеспечивают совместимость JDK 8 API во время компиляции с `-Xjdk-release=8`, даже несмотря на то, что сама сборочная цепочка использует JDK 21. Не используйте JDK 9+ APIs в коде SDK.

## Собрать и протестировать {#build-and-test}

Запустите переносимые тесты JVM:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Создайте артефакты Android:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## Текущее покрытие {#current-coverage}

Kotlin SDK включает:

- Norito кодирование и декодирование
- каноническая обработка учетных записей и адресов активов
- формирование транзакции, подпись и офлайн-контейнеры данных
- Torii HTTP, WebSocket и SSE клиенты
- мультиподпись, подписка, SoraFS, Nexus и модели Connect
- Android интеграции хранилища ключей и телеметрии устройства
- Android оффлайн QR, поблизости и NFC транспортировки

Смотрите [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/kotlin/README.md) для модуль-специфических APIs и точных команд сборки.
