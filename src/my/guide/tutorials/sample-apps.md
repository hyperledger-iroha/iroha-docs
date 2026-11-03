---
translation_locale: my
translation_source: /guide/tutorials/sample-apps.md
translation_source_hash: c1432d8d2483f67b6ab81680f6c5457cab470db7944512626242a1446a7d501f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# နမူနာများနှင့် ချက်ပြုတ်ချက်များ {#samples-and-recipes}

Iroha source repository မှာ SDK recipe တွေနဲ့ test suites တွေပါဝင်ပြီး node နဲ့တူတဲ့ revision တွေကို track လုပ်ပေးပါတယ်။

## JavaScript ချက်ပြုတ်ချက်များ {#javascript-recipes}

[`javascript/iroha_js/recipes`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/recipes) Deterministic transaction batching အတွက် အဓိက နမူနာတွေ ပါဝင်ပါတယ်။ Nexus app ကို လွှဲပြောင်းခြင်း NFT မှတ်ပုံတင်ကို ပြန်လည်သုံးသပ်ခြင်း ISO တံတားစီးကြောင်းများ၊ Torii အွန်လိုင်းမှာ ပြသတာ (သို့) တိုက်ရိုက် ပြသဖို့ လိုအပ်တယ်ဆိုတဲ့အချက်အလက်တိုင်းက Torii API အဆုံးသတ်မှတ်ချက်ပါ။

## Swift နှင့် iOS {#swift-and-ios}

အသုံးပြုခြင်း `IrohaSwift/Tests/IrohaSwiftTests` လက်ရှိအတိုင်းအတာနဲ့ စစ်ဆေးထားတဲ့ နမူနာတွေအတွက် Swift SDK. ကြည့်ပါ။ [Swift နှင့် iOS](/my/guide/tutorials/swift.md) Package နဲ့ Bridge setup အတွက်ပါ။

## Android {#android}

အသစ်အတွက် Android အလုပ်ကိုသုံးပြီး Kotlin- ပထမ `core-jvm`, `client-android`, နှင့် `offline-wallet-android` မော်ဂျူးများ [Kotlin, Android, နှင့် Java](/my/guide/tutorials/kotlin-java.md). နိုင်ငံတကာ Kotlin SDK တစ်ခုတည်းသော ပရိုတိုကောလစ် စံချိန်တင်စတင်ချက်ဖြစ်သည် Android စားသုံးသူ။
