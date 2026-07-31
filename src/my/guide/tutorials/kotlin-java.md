---
translation_locale: my
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 91dfd38597028531ec579eeb97dcd5acbfcdf6d27ba51991ca96a2d40077aaef
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin, Android, ဂါဝ {#kotlin-android-and-java}

နိုင်ငံခြားရေး Kotlin SDK ကို default client stack ဖြစ်ပါတယ် JVM နှင့် Android လျှောက်လွှာများ။
ဒါက အောက်မှာ နေထိုင်တယ်။ `kotlin/` အထဲမှာ Iroha သိုလှောင်ရုံနဲ့ platform ကို ခွဲခြားထားပါတယ်
portable code ကို မရယူနိုင်ပါ။ Android မှီခိုမှု။

## မော်ဂျူးများ {#modules}

| အနုပညာပစ္စည်း | အမျိုးအစား | အသုံးပြုခြင်း |
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR | စင်ကြယ် Kotlin/JVM Norito, ဒေတာပုံစံ၊ ငွေကြေးသိပ္ပံ၊ ငွေပေးချေမှု Torii, နှင့် ပရိုတိုကောဒ် |
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android key store, device telemetry နဲ့ JNI- ထောက်ခံတဲ့ ဖောက်သည် ပေါင်းစပ်မှု |
| `org.hyperledger.iroha.sdk:offline-wallet-android` | AAR | Android Offline wallet ပို့ဆောင်ရေးနှင့် ပေါင်းစည်းခြင်း `client-android` |

လက်ရာတွေဟာ Maven Central မှာ မထုတ်ဝေသေးဘူး။ ဆောက်ပြီး ထုတ်ဝေပါ။
ဒေသတွင်းမှာ ပိတ်ထားတာကနေ Iroha အရင်းအမြစ် ပြင်ဆင်မှု

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

`core-jvm` မပါပါဘူး။ Android အမှီအခိုကင်းမှုကို ထိန်းထားပါ။ Android Client နဲ့ Keystore
code ကို `client-android`, အသုံးပြုခြင်း `offline-wallet-android` အတွက် Android- တစ်ခုတည်းသော
offline wallet နဲ့ JNI စီးဆင်းပါတယ်။

## Kotlin နှင့် Java Compatibility {#kotlin-and-java-compatibility}

အများပြည်သူ API ရှိသည် Kotlin- ပထမဦးဆုံးနဲ့ Java interop ကိုပေးတယ်။ JVM ဖုန်းခေါ်ဆိုသူများ လိုအပ်ချက်
တူညီသော ပြောင်းလဲမှုများကို ကိုက်ညီသည့် `java/`
အကောင်အထည်ဖော်မှု Android ပေါင်းစည်းခြင်းတွေဟာ Kotlin
အထက်က လက်ရာတွေပါ။

အားလုံး Kotlin မော်ဂျူးများ အားပေး JDK 8 API compile အချိန်မှာ Compatibility ကို
`-Xjdk-release=8`, ဆောက်လုပ်ရေး toolchain ကိုယ်တိုင်အသုံးပြုသော်လည်း JDK (၂၁) မလုပ်ပါနဲ့
အသုံးပြုမှု JDK 9+ APIs အထဲမှာ SDK ကုဒ်ပါ။

## ဆောက်လုပ်ပြီး စမ်းသပ်ခြင်း {#build-and-test}

Portable ကို Run လုပ်ပါ JVM စမ်းသပ်မှု:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

ဆောက်လုပ်ခြင်း Android လက်ရာများ:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## လက်ရှိအကာအကွယ် {#current-coverage}

နိုင်ငံခြားရေး Kotlin SDK အောက်ပါအတိုင်း ပါဝင်သည်-

- Norito ကုဒ်သွင်းခြင်းနှင့် ကုဒ်ချိုးခြင်း
- ဘဏ္ဍာရေးဆိုင်ရာ စာရင်းနှင့် အရင်းအမြစ်လိပ်စာ စီမံခန့်ခွဲမှု
- ငွေပေးချေမှု တည်ဆောက်ခြင်း၊ လက်မှတ်ရေးထိုးခြင်းနှင့် offline envelopes များ
- Torii HTTP, WebSocket, နှင့် SSE ဖောက်သည်များ
- လက်မှတ်ပေါင်းများစွာ၊ လက်မှတ်ထိုးခြင်း SoraFS, Nexus, နှင့် Connect ပုံစံများ
- Android Key store နဲ့ device telemetry ပေါင်းစပ်မှု
- Android offline QR, နီးစပ်ရာမှာ NFC သယ်ယူပို့ဆောင်ရေး

ကြည့်ပါ။ [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/main/kotlin/README.md)
မော်ဂျူးအထူးအတွက် APIs ပြီးတော့ တိကျတဲ့ တည်ဆောက်မှု အမိန့်တွေပေါ့။
