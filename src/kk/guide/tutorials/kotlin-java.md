---
translation_locale: kk
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 804ef15b3d5ecdfae9fd559d3f312772571938ed9872f4adbd251baa3471e4e2
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-supplemental-naming-link+reviewed-delta
---
# Kotlin, Android, және Java {#kotlin-android-and-java}

Kotlin SDK JVM және Android қосымшалары үшін әдепкі клиент стекі болып табылады. Ол Iroha репозиторийіндегі `kotlin/` астында орналасқан және платформаға бөлінген, сондықтан портативті код Android тәуелділіктерін алмайды.

## Модульдер {#modules}

|Артефакт|Тип|Пайдалану|
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR |Таза Kotlin/JVM Norito, деректер моделі, крипто, транзакция, Torii, және протокол коды|
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android кілтсақтаушы, құрылғы телеметриясы және JNI-қолдаған клиент интеграциялары |
| `org.hyperledger.iroha.sdk:kagemusha-wallet-android` | AAR | Android офлайн- әмияндарды тасымалдау және `client-android` негізінде интеграция|

Артефакттер әлі Maven Central-да жарияланған жоқ. Оларды жергілікті деңгейде бекітілген Iroha көзі нұсқасынан құрастырып, жариялаңыз:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

Содан кейін тек сіздің қосымшаңызға қажет артефактіні таңдаңыз:

```kotlin
repositories {
    mavenLocal()
}

dependencies {
    implementation("org.hyperledger.iroha.sdk:core-jvm:0.1.0")
    // Android client features:
    // implementation("org.hyperledger.iroha.sdk:client-android:0.1.0")
    // Android offline-wallet features:
    // implementation("org.hyperledger.iroha.sdk:kagemusha-wallet-android:0.1.0")
}
```

`core-jvm` ешқандай Android тәуелділіктерді қамтымайды. Android клиент және кілттер қоймасы кодын `client-android`-де сақтаңыз, ал тек Android-үшін офлайн- әмиян және JNI ағымдар үшін `kagemusha-wallet-android`-ны пайдаланыңыз.

## Kotlin және Java үйлесімділігі {#kotlin-and-java-compatibility}

Қоғамдық API Kotlin-бірінші тәсілге негізделген және Java шақырушылары үшін канондық іске асыру болып табылады; `core-jvm` ішіндегі Java бастапқы кодты тұтынушы тесттері оны тікелей тексереді. `java/` ағашында Kotlin модульдеріне ауыстырылып, қолданыстан шығарылып жатқан қайталама іске асырулар сақталады. Жаңа Android интеграциялары жоғарыдағы Kotlin артефактілерінен басталуы керек.

Барлық Kotlin модульдер JDK 8 API үйлесімділігін компиляциялау кезінде `-Xjdk-release=8` қамтамасыз етеді, тіпті құрастыру құралдар тізбегі өзі JDK 21 қолданса да. SDK кодында JDK 9+ APIs қолданбаңыз.

## Құру және сынау {#build-and-test}

Kotlin SDK README файлында сипатталғандай, JVM тесттерін `IROHA_NATIVE_LIBRARY_PATH` ішіндегі бір бастапқы кодтан құрастырылған `connect_norito_bridge` кітапханасымен және `IROHA_KOTLIN_FIXTURE_GEN_BIN` ішіндегі `kotlin-fixture-gen` құралымен іске қосыңыз; оларсыз нативті кодқа тәуелді тесттер сәтсіз аяқталады:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Android артефакттарын құрыңыз:

```bash
./gradlew :client-android:assembleRelease \
  :kagemusha-wallet-android:assembleRelease --quiet
```

## Ағымдағы қамту {#current-coverage}

Kotlin SDK мыналарды қамтиды:

- Norito кодтау және декодтау
- бір протокол-стандартты есепшот пен актив мекенжайын өңдеу
- операцияны құру, қол қою және офлайн деректер контейнерлері
- Torii HTTP, WebSocket және SSE клиенттер
- көпқолтаңба, жазылым, SoraFS, SORA Nexus, және Connect модельдері
- Android кілт сақтау қоймасы және құрылғы телеметриясын біріктіру
- Android офлайн QR, Жақын жерде және NFC көліктер

Модульге қатысты нақты APIs және құрылысты командаларды білу үшін [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/kotlin/README.md)-ты қараңыз.
