---
translation_locale: my
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 91dfd38597028531ec579eeb97dcd5acbfcdf6d27ba51991ca96a2d40077aaef
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin၊ Android နှင့် Java {#kotlin-android-and-java}

နိုင်ငံတကာ Kotlin SDK ကို default client stack ဖြစ်ပါတယ် JVM နှင့် Android Applications များ။ ၎င်းသည် `kotlin/` အထဲမှာ Iroha repository ကို platform ကွဲပြားပြီး portable code မရရှိနိုင်အောင် Android မှီခိုမှု။

## မော်ဂျူးများ {#modules}

|အနုပညာပစ္စည်း |အမျိုးအစား|အသုံးပြုခြင်း |
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm` |JAR |Pure Kotlin/JVM Norito, data model, crypto, transaction, Torii နဲ့ ပရိုတိုကောဒ် |
|`org.hyperledger.iroha.sdk:client-android` |AAR |Android keystore, device telemetry နဲ့ JNI ထောက်ပံ့ထားတဲ့ client integration တွေကို |
|`org.hyperledger.iroha.sdk:offline-wallet-android` |AAR |Android `client-android` ကို အခြေခံပြီး Offline Wallet သယ်ယူပို့ဆောင်ရေးနှင့် ပေါင်းစပ်ခြင်း |

ဒီလက်ရာတွေကို Maven Central မှာ မထုတ်ဝေသေးပါဘူး။ ပိတ်ထားတဲ့ Iroha အရင်းအမြစ် ပြင်ဆင်ချက်ကနေ ဒေသတွင်းမှာ တည်ဆောက်ပြီး ထုတ်ဝေပါ။

```bash
cd kotlin
./gradlew publishToMavenLocal
```

အဲဒီနောက်မှာ သင့်ရဲ့ လျှောက်လွှာအတွက် လိုအပ်တဲ့ လက်ရာပစ္စည်းကိုသာ ရွေးချယ်ပါ။

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

`core-jvm` မပါပါဘူး။ Android အမှီအခိုကင်းမှုကို ထိန်းထားပါ။ Android client နဲ့ keystore ကိုဒ်ကို `client-android`, အသုံးပြုခြင်း `offline-wallet-android` အတွက် Android- အွန်လိုင်းပိုက်ဆံအိတ်ကိုသာသုံးပြီး JNI စီးဆင်းပါတယ်။

## Kotlin နှင့် Java Compatibility {#kotlin-and-java-compatibility}

အများပြည်သူ API သည် Kotlin-ပထမဆုံးဖြစ်ပြီး JVM ဖုန်းခေါ်ဆိုသူများလိုအပ်သည့်နေရာတွင် Java interop ကိုပေးသည်။ ညီမျှသောပြောင်းလဲမှုများသည် သက်ဆိုင်ရာ `java/` အကောင်အထည်ဖော်မှုမှာ ထင်ဟပ်သည်။ အသစ် Android ပေါင်းစပ်ခြင်းများသည် Kotlin လက်ရာများနှင့်စသင့်သည်။

အားလုံး Kotlin မော်ဂျူးများအား ထိန်းချုပ် JDK 8 API compile အချိန်မှာ Compatibility ကို `-Xjdk-release=8`, ဆောက်လုပ်ရေး toolchain ကိုကိုယ်၌အသုံးပြုသော်လည်း JDK (၂၁) မသုံးပါ။ JDK 9+ APIs အထဲမှာ SDK ကုဒ်။

## တည်ဆောက်ခြင်းနှင့် စမ်းသပ်ခြင်း {#build-and-test}

portable JVM စမ်းသပ်မှုကို လုပ်ဆောင်ပါ။

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Android လက်ရာတွေကို ဆောက်လုပ်ပါ။

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## လက်ရှိအကာအကွယ် {#current-coverage}

Kotlin SDK တွင် အောက်ပါအချက်များပါဝင်သည် -

- Norito ကုဒ်သွင်းခြင်းနှင့် ကုဒ်ဖော်ထုတ်ခြင်း
- ဘဏ္ဍာရေးစာရင်းများနှင့် အရင်းအမြစ်လိပ်စာများကို စီမံခန့်ခွဲခြင်း
- ငွေပေးချေမှု တည်ဆောက်ခြင်း၊ လက်မှတ်ရေးထိုးခြင်းနှင့် offline envelopes များ
- Torii HTTP၊ WebSocket နှင့် SSE ဝန်ထမ်းများ
- multisignature, subscription, SoraFS, Nexus နှင့် Connect ပုံစံများ
- Android key store နှင့် device telemetry integration များ
- Android အွန်လိုင်း QR၊ နီးစပ်ရာနှင့် NFC သယ်ယူပို့ဆောင်ရေး

[Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/main/kotlin/README.md) ကို ကြည့်ပါ module-specific APIs နှင့် exact build command များအတွက်။
