---
translation_locale: ka
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 804ef15b3d5ecdfae9fd559d3f312772571938ed9872f4adbd251baa3471e4e2
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-supplemental-naming-link+reviewed-delta
---
# Kotlin, Android და ჯავა {#kotlin-android-and-java}

Kotlin SDK არის ჩვეულებრივი კლიენტის სტეიკი JVM და Android პროგრამებისთვის. იგი ცხოვრობს `kotlin/` ქვეშ Iroha საცავში და განკუთვნილია პლატფორმაზე, ასე რომ პორტაბილური კოდი არ იღებს დამოკიდებულებებს Android.

## მოდულები {#modules}

|არტეფაქტი |ტიპი |გამოყენება |
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm` |JAR |წმინდა Kotlin/JVM Norito, მონაცემთა მოდელი, კრიპტო, ტრანზაქცია, Torii და პროტოკოლის კოდი |
|`org.hyperledger.iroha.sdk:client-android` |AAR |Android საკვანძო შენახვის, მოწყობილობის ტელემეტრიისა და JNI მხარდაჭერილი კლიენტთა ინტეგრაციის |
|`org.hyperledger.iroha.sdk:kagemusha-wallet-android` |AAR |Android ოფლაინ საფულის ტრანსპორტირება და ინტეგრაცია, რომელიც აგებულია `client-android`|

არტეფაქტები ჯერ არ არის გამოქვეყნებული Maven ცენტრალური. ააშენეთ და გამოაქვეყნეთ ისინი ადგილობრივად ჩაკეტილი Iroha წყარო რევიზიონიდან:

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
    // implementation("org.hyperledger.iroha.sdk:kagemusha-wallet-android:0.1.0")
}
```

`core-jvm` არ შეიცავს Android დამოკიდებულებებს. შეინახეთ Android კლიენტის კოდი და საკვანძო შენახვის კოდი `client-android` და გამოიყენეთ `kagemusha-wallet-android` მხოლოდ Android-ის ოფლაინ ქაღალდისთვის და JNI ნაკადებისთვის.

## Kotlin და Java-ს თავსებადობა {#kotlin-and-java-compatibility}

საჯარო API არის Kotlin-ზე ორიენტირებული და Java-დან გამომძახებლებისთვის კანონიკურ იმპლემენტაციას წარმოადგენს; `core-jvm`-ში Java-ის წყაროზე დაფუძნებული მომხმარებლის ტესტები მას პირდაპირ ამოწმებს. `java/` ხე შეიცავს დუბლირებულ იმპლემენტაციებს, რომლებიც ეტაპობრივად Kotlin-ის მოდულებში გადაიტანება და გაუქმდება. ახალი Android ინტეგრაციები ზემოთ მოცემული Kotlin არტეფაქტებით უნდა დაიწყოს.

ყველა Kotlin მოდულები აღსრულება JDK 8 API კომპილიტაციის დროს თავსებადობა `-Xjdk-release=8`, მიუხედავად იმისა, რომ მშენებლობის ინსტრუმენტების ჯაჭვი თავად იყენებს JDK 21. არ გამოიყენოთ JDK 9+ APIs დაწვრილებით SDK კოდი.

## ააშენეთ და შეამოწმეთ {#build-and-test}

გაუშვით JVM ტესტები იმავე წყაროდან აგებული `connect_norito_bridge` ბიბლიოთეკით `IROHA_NATIVE_LIBRARY_PATH`-ში და `kotlin-fixture-gen`-ით `IROHA_KOTLIN_FIXTURE_GEN_BIN`-ში, როგორც ეს Kotlin SDK-ის README-შია აღწერილი; მათ გარეშე ნატიურ კომპონენტებზე დამოკიდებული ტესტები ვერ გაივლის:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

შექმნა Android არტეფაქტები:

```bash
./gradlew :client-android:assembleRelease \
  :kagemusha-wallet-android:assembleRelease --quiet
```

## ამჟამინდელი მოცულობა {#current-coverage}

Kotlin SDK მოიცავს:

- Norito კოდირება და დეკოდირება
- კანონიკური ანგარიშის და აქტივების მისამართების მართვა
- ტრანზაქციების შექმნა, ხელმოწერა და ოფლაინ მონაცემთა კონტეინერები
- Torii HTTP, WebSocket და SSE კლიენტები
- მულტიხელმოწერით, აბონენტობით, SoraFS, SORA Nexus და Connect-ის მოდელებით
- Android საკვანძო შენახვისა და მოწყობილობის ტელემეტრიის ინტეგრაციები
- Android ოფლაინ QR, ახლომდებარე და NFC ტრანსპორტები

იხილეთ [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/kotlin/README.md) მოდულის სპეციფიკური APIs და ზუსტი მშენებლობის ბრძანებებისათვის.
