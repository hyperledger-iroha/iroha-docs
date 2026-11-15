---
translation_locale: my
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 804ef15b3d5ecdfae9fd559d3f312772571938ed9872f4adbd251baa3471e4e2
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-supplemental-naming-link+reviewed-delta
---
# Kotlin၊ Android နှင့် Java {#kotlin-android-and-java}

Kotlin SDK သည် JVM နှင့် Android အက်ပ်များအတွက် ပုံမှန် client နည်းပညာအစုဖြစ်သည်။ Iroha သိုလှောင်ရုံ၏ `kotlin/` အောက်တွင် ရှိပြီး အခြားပလက်ဖောင်းသို့ ရွှေ့နိုင်သောကုဒ်ထဲသို့ Android မှီခိုမှုများ မဝင်စေရန် ပလက်ဖောင်းအလိုက် ခွဲထားသည်။

## မော်ဂျူးများ {#modules}

|အနုပညာပစ္စည်း |အမျိုးအစား|အသုံးပြုခြင်း |
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm` |JAR |Pure Kotlin/JVM Norito, data model, crypto, transaction, Torii နဲ့ ပရိုတိုကောဒ် |
|`org.hyperledger.iroha.sdk:client-android` |AAR |Android keystore, device telemetry နဲ့ JNI ထောက်ပံ့ထားတဲ့ client integration တွေကို |
|`org.hyperledger.iroha.sdk:kagemusha-wallet-android` |AAR |Android `client-android` ကို အခြေခံပြီး Offline Wallet သယ်ယူပို့ဆောင်ရေးနှင့် ပေါင်းစပ်ခြင်း |

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
    // implementation("org.hyperledger.iroha.sdk:kagemusha-wallet-android:0.1.0")
}
```

`core-jvm` မပါပါဘူး။ Android အမှီအခိုကင်းမှုကို ထိန်းထားပါ။ Android client နဲ့ keystore ကိုဒ်ကို `client-android`, အသုံးပြုခြင်း `kagemusha-wallet-android` အတွက် Android- အွန်လိုင်းပိုက်ဆံအိတ်ကိုသာသုံးပြီး JNI စီးဆင်းပါတယ်။

## Kotlin နှင့် Java Compatibility {#kotlin-and-java-compatibility}

အများသုံး API သည် Kotlin ကို ဦးစားပေးပြီး Java ခေါ်ဆိုသူများအတွက် စံ အကောင်အထည်ဖော်မှု ဖြစ်သည်။ `core-jvm` ရှိ Java ရင်းမြစ်ကုဒ်ဖြင့်ရေးထားသော အသုံးပြုသူ စမ်းသပ်မှုများက ၎င်းကို တိုက်ရိုက် စမ်းသပ်သည်။ `java/` tree တွင် Kotlin module များထဲသို့ ပေါင်းထည့်ကာ ရပ်ဆိုင်းနေဆဲဖြစ်သော ထပ်နေသည့် အကောင်အထည်ဖော်မှုများ ရှိသည်။ Android ပေါင်းစည်းမှုအသစ်များသည် အထက်ပါ Kotlin artifact များဖြင့် စတင်သင့်သည်။

အားလုံး Kotlin မော်ဂျူးများအား ထိန်းချုပ် JDK 8 API compile အချိန်မှာ Compatibility ကို `-Xjdk-release=8`, ဆောက်လုပ်ရေး toolchain ကိုကိုယ်၌အသုံးပြုသော်လည်း JDK (၂၁) မသုံးပါ။ JDK 9+ APIs အထဲမှာ SDK ကုဒ်။

## တည်ဆောက်ခြင်းနှင့် စမ်းသပ်ခြင်း {#build-and-test}

Kotlin SDK README တွင် ဖော်ပြထားသည့်အတိုင်း `IROHA_NATIVE_LIBRARY_PATH` တွင် ရင်းမြစ်တူ `connect_norito_bridge` library နှင့် `IROHA_KOTLIN_FIXTURE_GEN_BIN` တွင် `kotlin-fixture-gen` ကို ထားရှိပြီး JVM စမ်းသပ်မှုများကို လုပ်ဆောင်ပါ။ ၎င်းတို့ မရှိပါက native ကို မှီခိုသော စမ်းသပ်မှုများ ကျရှုံးမည်:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Android လက်ရာတွေကို ဆောက်လုပ်ပါ။

```bash
./gradlew :client-android:assembleRelease \
  :kagemusha-wallet-android:assembleRelease --quiet
```

## လက်ရှိအကာအကွယ် {#current-coverage}

Kotlin SDK တွင် အောက်ပါအချက်များပါဝင်သည် -

- Norito ကုဒ်သွင်းခြင်းနှင့် ကုဒ်ဖော်ထုတ်ခြင်း
- Single Protocol Standard Account နဲ့ Asset Address ကို စီမံခန့်ခွဲမှု
- Transaction building၊ signing နဲ့ offline data containers တွေကို
- Torii HTTP၊ WebSocket နှင့် SSE ဝန်ထမ်းများ
- multisignature, subscription, SoraFS, SORA Nexus နှင့် Connect ပုံစံများ
- Android key store နှင့် device telemetry integration များ
- Android အွန်လိုင်း QR၊ နီးစပ်ရာနှင့် NFC သယ်ယူပို့ဆောင်ရေး

မော်ဂျူးအလိုက် APIs နှင့် တည်ဆောက်ရေးကွန်မန်းအတိအကျများအတွက် [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/kotlin/README.md) ကို ကြည့်ပါ။
