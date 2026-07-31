---
translation_locale: kk
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 91dfd38597028531ec579eeb97dcd5acbfcdf6d27ba51991ca96a2d40077aaef
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin, Android және Java {#kotlin-android-and-java}

Kotlin SDK JVM және Android қолданбалары үшін әдеттегі клиенттік топтамасы болып табылады. Ол Iroha қоймасында `kotlin/` астында тұрады және платформа бойынша бөлінеді, сондықтан портативті код Android тәуелділіктерін иеленбейді.

## Модульдер {#modules}

|Артефакт|Түрі |Пайдалану |
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm` |JAR |Таза Kotlin/JVM Norito, дерек үлгісі, крипто, транзакция, Torii және хаттама коды |
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

`core-jvm` құрамында Android тәуелділіктері жоқ. Android клиенті мен кілт-шоу кодын `client-android`-да сақтаңыз және Android - тек офлайн-кешелек пен JNI ағындары үшін `offline-wallet-android` қолданыңыз.

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
- Torii HTTP, WebSocket және SSE клиенттері
- көп қолтаңба, жазылу, SoraFS, Nexus және Connect үлгілері
- Android кілт қоймасы мен құрылғының телеметриялық интеграциялары
- Android офлайн QR, жақын маңдағы және NFC тасымалдау

[Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/main/kotlin/README.md) дегенді қараңыз, модульге тән APIs және нақты құрылыс командалары үшін.
