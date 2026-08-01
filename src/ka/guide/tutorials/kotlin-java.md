---
translation_locale: ka
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 91dfd38597028531ec579eeb97dcd5acbfcdf6d27ba51991ca96a2d40077aaef
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin, Android და ჯავა {#kotlin-android-and-java}

Kotlin SDK არის ჩვეულებრივი კლიენტის სტეიკი JVM და Android პროგრამებისთვის. იგი ცხოვრობს `kotlin/` ქვეშ Iroha საცავში და განკუთვნილია პლატფორმაზე, ასე რომ პორტაბილური კოდი არ იღებს დამოკიდებულებებს Android.

## მოდულები {#modules}

|არტეფაქტი |ტიპი |გამოყენება |
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm` |JAR |წმინდა Kotlin/JVM Norito, მონაცემთა მოდელი, კრიპტო, ტრანზაქცია, Torii და პროტოკოლის კოდი |
|`org.hyperledger.iroha.sdk:client-android` |AAR |Android საკვანძო შენახვის, მოწყობილობის ტელემეტრიისა და JNI მხარდაჭერილი კლიენტთა ინტეგრაციის |
|`org.hyperledger.iroha.sdk:offline-wallet-android` |AAR |Android ოფლაინ საფულის ტრანსპორტირება და ინტეგრაცია, რომელიც აგებულია `client-android`|

არტეფაქტები ჯერ არ არის გამოქვეყნებული Maven Central. ააშენეთ და გამოაქვეყნეთ ისინი ადგილობრივად ჩაკეტილი Iroha წყარო რევიზიონიდან:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

შემდეგ აირჩიეთ მხოლოდ ის არტეფაქტი, რომელიც თქვენს განაცხადშია საჭირო:

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

`core-jvm` არ შეიცავს Android დამოკიდებულებებს. შეინახეთ Android კლიენტის კოდი და საკვანძო შენახვის კოდი `client-android` და გამოიყენეთ `offline-wallet-android` მხოლოდ Android-ის ოფლაინ ქაღალდისთვის და JNI ნაკადებისთვის.

## Kotlin და Java-ს თავსებადობა {#kotlin-and-java-compatibility}

საზოგადოება API არის Kotlin-პირველად და უზრუნველყოფს Java interop სადაც JVM დამრეკველებს ეს სჭირდებათ. თანაბარი ცვლილებები ასახულია შესაბამის `java/` განხორციელება. ახალი Android ინტეგრაციები უნდა დაიწყოს: Kotlin ზემოდან არსებული არტეფაქტები.

ყველა Kotlin მოდულები აღსრულება JDK 8 API კომპილიტაციის დროს თავსებადობა `-Xjdk-release=8`, მიუხედავად იმისა, რომ მშენებლობის ინსტრუმენტების ჯაჭვი თავად იყენებს JDK 21. არ გამოიყენოთ JDK 9+ APIs დაწვრილებით SDK კოდი.

## ააშენეთ და შეამოწმეთ {#build-and-test}

ჩატარდეს პორტატული JVM ტესტები:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

შექმნა Android არტეფაქტები:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## ამჟამინდელი მოცულობა {#current-coverage}

Kotlin SDK მოიცავს:

- Norito კოდირება და დეკოდირება
- კანონიკური ანგარიშის და აქტივების მისამართების მართვა
- ტრანზაქციების შექმნა, ხელმოწერა და ოფლაინ კონვერტები
- Torii HTTP, WebSocket და SSE კლიენტები
- მულტიხელმოწერით, აბონენტობით, SoraFS, Nexus და Connect-ის მოდელებით
- Android საკვანძო შენახვისა და მოწყობილობის ტელემეტრიის ინტეგრაციები
- Android ოფლაინ QR, ახლომდებარე და NFC ტრანსპორტები

იხილეთ [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/main/kotlin/README.md) მოდულის სპეციფიკური APIs და ზუსტი მშენებლობის ბრძანებებისათვის.
