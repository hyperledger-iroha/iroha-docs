---
translation_locale: hy
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 62d6f434e5af4213420c456ee27ebdc260c8b0e9f7a85bc3ba955ee9c79a058d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin, Android եւ Java {#kotlin-android-and-java}

Գլխավոր էջ Kotlin SDK է ստանդարտ հաճախորդի փաթեթը JVM եւ Android Կենդանակերպի նշաններ `kotlin/` դաշտում Iroha պահեստային եւ բաժանված է հարթակի այնպես, որ պորտալ կոդը չի ձեռք բերել Android կախվածություն:

## Մոդուլներ {#modules}

|Արտֆակտ |Տիպը |Օգտագործել |
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm` |JAR |Pure Kotlin/JVM Norito, տվյալների մոդել, կրիպտո, գործարք, Torii եւ արձանագրության կոդ |
|`org.hyperledger.iroha.sdk:client-android` |AAR |Android ստեղնաշարի, սարքավորումների հեռաչափության եւ JNI աջակցությամբ հաճախորդների ինտեգրման |
|`org.hyperledger.iroha.sdk:offline-wallet-android` |AAR |Android անջատված դրամապանակի տրանսպորտ եւ ինտեգրում, որը կառուցվել է `client-android` |

Գործիքները դեռ չեն հրապարակվել Maven Central- ում: Կառուցեք եւ տեղականորեն հրապարակի՛ր դրանք փակված Iroha աղբյուրի վերանայման միջոցով.

```bash
cd kotlin
./gradlew publishToMavenLocal
```

Այնուհետեւ ընտրեք միայն այն արվեստի գործարքը, որը անհրաժեշտ է ձեր դիմման համար.

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

`core-jvm` պարունակում է ոչ Android կախվածություններ: Android Client եւ keystore կոդը `client-android`, եւ օգտագործումը `offline-wallet-android` համար Android-միայն անջատված դրամապանակի եւ JNI հոսում է:

## Kotlin եւ Java համատեղելիություն {#kotlin-and-java-compatibility}

Հանրությունը API է Kotlin-առաջին եւ ապահովում է Java interop որտեղ JVM Զանգահարողները դրա կարիքն ունեն: Նման փոփոխություններ են արտացոլվում համապատասխան `java/` իրականացում: Նոր Android ինտեգրումը պետք է սկսվի Kotlin վերեւում գտնվող արվեստագետները:

Բոլորը Kotlin մոդուլների կիրառման JDK 8 API համատեղելիություն կազմման ժամանակ `-Xjdk-release=8`, չնայած կառուցման գործիքների շղթան ինքն է օգտագործում JDK 21. Մի օգտագործեք JDK 9+ APIs մինետ SDK կոդը:

## Կառուցեք եւ փորձարկեք {#build-and-test}

Փորձարկել JVM պորտալ փորձարկումները.

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Կառուցեք Android արվեստի գործիքները.

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## Ներկայիս ծավալը {#current-coverage}

Kotlin SDK-ը ներառում է:

- Norito կոդավորում եւ կոդավորումը
- վարկային հաշիվների եւ ակտիվների հասցեների կառավարումը
- գործարքների կառուցում, ստորագրում եւ անջատված փաթեթներ
- Torii HTTP, WebSocket եւ SSE հաճախորդների
- Multisignature, բաժանորդագրություն, SoraFS, Nexus եւ Connect մոդելներ
- Android առանցքային պահեստի եւ սարքի հեռաչափության ինտեգրումը
- Android անջատված QR, մոտակա եւ NFC տրանսպորտներ

Նայեք [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/kotlin/README.md) մոդուլ-հատուկ APIs եւ ճշգրիտ կառուցման հրամանները:
