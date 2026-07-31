---
translation_locale: kk
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 91dfd38597028531ec579eeb97dcd5acbfcdf6d27ba51991ca96a2d40077aaef
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin, Android, және Java {#kotlin-android-and-java}

Қауымдастық Kotlin SDK үшін әдеттегі клиент тізбегі JVM және Android Қолданбалар. `kotlin/` және Iroha репозиторий және платформа бойынша бөлінеді, сондықтан тасымалданатын кодтар Android тәуелділіктер.

## Модульдер {#modules}

|Артефакт|Түрі |Пайдалану |
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm` |JAR | Таза Kotlin/JVM Norito, деректер моделі, крипто, транзакция, Torii, және протокол коды |
|`org.hyperledger.iroha.sdk:client-android` |AAR |Android кілт-шоу, құрылғылар телеметриясы және JNI қолданатын клиент интеграциялары |
|`org.hyperledger.iroha.sdk:offline-wallet-android` |AAR |Android `client-android` негізінде желіден тыс қапшықты тасымалдау және интеграциялау |

Артефакттар әлі Maven Central-ке жарияланбаған. оларды тігілген Iroha көзбен қайта қараудан жергілікті түрде құру және жариялау:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

Одан кейін өтінішке қажетті артефактті ғана таңдаңыз:

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

`core-jvm` құрамында жоқ Android тәуелділіктері. Android клиенттің және кілт-шоу кодтары `client-android`, және пайдалану `offline-wallet-android` үшін Android- тек офлайн-бухгалтерлік есепшот және JNI ағынды.

## Kotlin және Java үйлестіруі {#kotlin-and-java-compatibility}

Қоғам API болып табылады Kotlin- бірінші болып және Java interop береді, онда JVM шақырушыларды қажет етеді. Тиісті өзгерістер тиісті `java/` іске асыру. Жаңа Android интеграциялар басталуы тиіс Kotlin Жоғарыдағы артефакттар.

Барлығы Kotlin модульдерді орындау JDK 8 API жинақтау кезінде үйлесімділік `-Xjdk-release=8`, Құрылыс құралдар тізбекінің өзі JDK 21. пайдаланбаңыз JDK 9+ APIs ішінде SDK код.

## Құрылыс және сынақ {#build-and-test}

Қолданбалы JVM сынақтарын орындау:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Android артефактілерін жасау:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## Қазіргі кездегі қамту {#current-coverage}

Kotlin SDK мыналарды қамтиды:

- Norito кодтау және кодтамалау
- Қасиетті шоттар мен активтердің адрестерін басқару
- транзакцияны құру, қол қою және офлайн конверттер
- Torii HTTP, WebSocket, және SSE клиенттер
- көп қолтаңба, жазылу, SoraFS, Nexus және Connect үлгілері
- Android кілт қоймасы мен құрылғының телеметриялық интеграциялары
- Android желіден тыс QR, Жақын жерде және NFC тасымалдау

Қараңыз [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/main/kotlin/README.md) модульге арналған APIs және нақты құрылыс командалары.
