---
translation_locale: my
translation_source: /guide/tutorials/sample-apps.md
translation_source_hash: af3e0b8698f877c035ccd3bb71926cea14d1029fc2eb73e23756d57357935f0e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# နမူနာများနှင့် ချက်ပြုတ်ချက်များ {#samples-and-recipes}

Iroha source repository မှာ SDK recipe တွေနဲ့ test suites တွေပါဝင်ပြီး node နဲ့တူတဲ့ revision တွေကို track လုပ်ပေးပါတယ်။

## JavaScript ချက်ပြုတ်ချက်များ {#javascript-recipes}

[`javascript/iroha_js/recipes`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js/recipes) Deterministic transaction batching အတွက် အဓိက နမူနာတွေ ပါဝင်ပါတယ်။ Nexus app ကို လွှဲပြောင်းခြင်း NFT မှတ်ပုံတင်ကို ပြန်လည်သုံးသပ်ခြင်း ISO တံတားစီးကြောင်းများ၊ Torii အွန်လိုင်းမှာ ပြသတာ (သို့) တိုက်ရိုက် ပြသဖို့ လိုအပ်တယ်ဆိုတဲ့အချက်အလက်တိုင်းက Torii အဆုံးသတ်မှတ်ချက်ပါ။

## Swift နှင့် iOS {#swift-and-ios}

Swift SDK current နဲ့ စစ်ဆေးထားတဲ့ နမူနာတွေအတွက် `IrohaSwift/Tests/IrohaSwiftTests` ကို အသုံးပြုပါ။ package နဲ့ bridge setup အတွက် [Swift နှင့် iOS](/my/guide/tutorials/swift.md) ကို ကြည့်ပါ။

## Android {#android}

အသစ်အတွက် Android အလုပ်ကိုသုံးပြီး Kotlin- ပထမ `core-jvm`, `client-android`, နှင့် `offline-wallet-android` မော်ဂျူးများ [Kotlin, Android, နှင့် Java](/my/guide/tutorials/kotlin-java.md). နိုင်ငံတကာ Kotlin SDK ကန်နီကလစ် စွန့်ဦးတည်ချက်ဖြစ်ပါတယ် Android စားသုံးသူ။
