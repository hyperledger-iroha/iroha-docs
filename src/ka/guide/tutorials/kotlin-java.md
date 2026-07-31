---
translation_locale: ka
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 91dfd38597028531ec579eeb97dcd5acbfcdf6d27ba51991ca96a2d40077aaef
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin, Android, და Java {#kotlin-android-and-java}

სააგენტო Kotlin SDK არის default კლიენტის stack for JVM და Android განაცხადები.
ის ცხოვრობს ქვეშ `kotlin/` დაწვრილებით Iroha რეპროექტორია და არის გაყოფილი პლატფორმა ასე რომ
პორტატული კოდი არ იღებს Android დამოკიდებულებები.

## მოდულები {#modules}

| ხელოვნური ნივთი | ტიპი | გამოყენება |
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR | სუფთა Kotlin/JVM Norito, მონაცემთა მოდელი, კრიპტოვალუტა, ტრანზაქცია, Torii, და პროტოკოლი კოდი |
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android საკვანძო ქაღალდის, მოწყობილობის ტელემეტრიისა და JNI- მხარდაჭერილი კლიენტების ინტეგრაცია |
| `org.hyperledger.iroha.sdk:offline-wallet-android` | AAR | Android ონლაინ საფულეების ტრანსპორტირება და ინტეგრაცია `client-android` |

არტეფაქტები ჯერ არ გამოქვეყნებულა Maven Central. ააშენეთ და გამოაქვეყნეთ ისინი
ადგილობრივად, ჩაკეტილიდან Iroha წყარო რევიზია:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

შემდეგ აირჩიეთ მხოლოდ არტეფაქტი თქვენი განაცხადის საჭიროება:

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

`core-jvm` არ შეიცავს Android დამოკიდებულებები. შენარჩუნება Android კლიენტი და საკვანძო მაღაზია
კოდი `client-android`, და გამოყენება `offline-wallet-android` სამედიცინო Android-მხოლოდ
Offline ქაღალდი და JNI მდინარეები.

## Kotlin და Java თავსებადობა {#kotlin-and-java-compatibility}

საზოგადოება API არის Kotlin-პირველად და უზრუნველყოფს Java interop სადაც JVM დამრეკველებს სჭირდებათ
თანაბარი ცვლილებები ასახულია შესაბამისი `java/`
განხორციელება. Android ინტეგრაციები უნდა დაიწყოს Kotlin
ზემოთ არსებული არტეფაქტები.

ყველა Kotlin მოდულები JDK 8 API შედგენის დროს თავსებადობა
`-Xjdk-release=8`, მიუხედავად იმისა, რომ მშენებლობის ინსტრუმენტების ჯაჭვი თავად იყენებს JDK 21. არ გააკეთოთ
გამოყენება JDK 9+ APIs დაწვრილებით SDK კოდი.

## ააშენეთ და შეამოწმეთ {#build-and-test}

აწარმოე მობილური JVM ტესტები:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

ააშენეთ Android არტეფაქტები:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## მიმდინარე დაფარვა {#current-coverage}

სააგენტო Kotlin SDK მოიცავს:

- Norito კოდირება და დეკოდირება
- კანონიკური ანგარიშისა და აქტივების მისამართების მართვა
- ტრანზაქციების შექმნა, ხელმოწერა და ოფლაინ კონვერტები
- Torii HTTP, WebSocket, და SSE კლიენტები
- მრავალხელმოწერა, გამოწერა, SoraFS, Nexus, და Connect-ის მოდელები
- Android საკვანძო შენახვისა და მოწყობილობის ტელემეტრიის ინტეგრაციები
- Android ოფლაინ QR, ახლოს, და NFC ტრანსპორტირება

იხილეთ [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/main/kotlin/README.md)
მოდულის სპეციფიკისთვის APIs და ზუსტი მშენებლობის ბრძანებები.
