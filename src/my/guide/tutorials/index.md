---
translation_locale: my
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK သင်တန်းများ {#sdk-tutorials}

ဤစာမျက်နှာများသည် အဓိက လုပ်ငန်းခွင်မှ ပို့ဆောင်သော Iroha 3 ဖောက်သည်ဝင်ရောက်မှုမှတ်ချက်များကို စုစည်းဖော်ပြထားသည်၊ တစ်ခုတည်းသော ပရိုတိုကောစံညွှန်းပါကတ်အမည်များ၊ တပ်ဆင်ရေးလမ်းကြောင်းများနှင့် အနိမ့်ဆုံးစတင်မှတ်များ ပါဝင်သည်။

## အကြံပြုချက် {#recommended-order}

1. [တပ်ဆင်ရန် Iroha 3](/my/get-started/install-iroha.md)
2. [လွှတ်တင်ခြင်း Iroha 3](/my/get-started/launch-iroha.md)
3. SDK ကို ရွေးပါ။
   - [Rust](/my/guide/tutorials/rust.md)
   - [Python](/my/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/my/guide/tutorials/javascript.md)
   - [Kotlin, Android နှင့် Java](/my/guide/tutorials/kotlin-java.md)
   - [Swift နှင့် iOS](/my/guide/tutorials/swift.md)
4. [နမူနာ app များ](/my/guide/tutorials/sample-apps.md) ကို အပြည့်အဝ ဝယ်သူ လျှောက်လွှာ ရည်ညွှန်းချက်လိုတဲ့အခါ ပြန်ကြည့်ပါ။
5. [Embedded Kaigi](/my/guide/tutorials/kaigi.md) ကို သုံးပြီး သင့်ရဲ့ app ထဲမှာ ပိုက်ဆံအိတ်ကို ထောက်ပံ့ထားတဲ့ အသံ/ဗီဒီယို အစည်းအဝေးတွေ ထည့်ချင်တဲ့အခါမှာ သုံးပါ။
6. [Musubi ထုတ်ကုန်များ](/my/guide/tutorials/musubi.md) ကို ချိတ်ဆက်ထားသော ကွင်းဆက်ပေါ်က မှတ်ပုံတင် မှီခိုချက်များနှင့်အတူ ပြန်လည်အသုံးပြုနိုင်သော Kotodama အရင်းအမြစ်စာကြည့်တိုက်များလိုအပ်ပါက အသုံးပြုပါ။

## နမူနာများ {#samples}

Upstream အလုပ်ခွင်မှာ JavaScript ချက်ပြုတ်ချက်တွေနဲ့ Swift/iOS နမူနာ ပရောဂျက်တွေ ပါဝင်ပါတယ်။ Android အတွက်တော့ Kotlin SDK မော်ဒူးတွေနဲ့ စမ်းသပ်မှုတွေ စပါ။

- [နမူနာ app တွေရဲ့ Overview](/my/guide/tutorials/sample-apps.md)
- [Kaigi ကို JavaScript app ထဲမှာ ထည့်သွင်းထားပါ။](/my/guide/tutorials/kaigi.md)

## အမှန်တရား၏ အရင်းအမြစ် {#source-of-truth}

SDK စာမျက်နှာအားလုံးက လက်ရှိ Upstream အလုပ်ခွင်ကနေ ရယူထားတာပါ။

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (Java Mirror of the Kotlin- ပထမ Android မျက်နှာပြင်)
- `IrohaSwift`
- `crates/musubi`

သံသယရှိရင် ဒီစာအုပ်တွေမှာ README နဲ့ package metadata တွေကို ဦးစားပေးပါ။ ဒါတွေက သင်တည်ဆောက်နေတဲ့ အရင်းအမြစ် ပြင်ဆင်မှုကို ဖော်ပြတယ်။
