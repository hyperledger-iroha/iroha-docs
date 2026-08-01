---
translation_locale: my
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK သင်တန်းများ {#sdk-tutorials}

ဤစာမျက်နှာများသည် အဓိက လုပ်ငန်းခွင်မှ ပို့ဆောင်သော Iroha 3 client entry points များကို စုစည်းဖော်ပြထားသည်မှာ Canonical package names, installation paths နှင့် minimal starting points တို့ပါ ၀ င်သည်။

## အကြံပြုချက် {#recommended-order}

1. [Iroha 3](/my/get-started/install-iroha.md) ကို တပ်ဆင်ပါ။
2. [လွှတ်တင်ခြင်း Iroha 3](/my/get-started/launch-iroha.md)
3. SDK ကို ရွေးပါ။
   - [Rust](/my/guide/tutorials/rust.md)
   - [Python](/my/guide/tutorials/python.md)
   - [JavaScript /TypeScript ](/my/guide/tutorials/javascript.md)
   - [Kotlin၊ Android နှင့် Java](/my/guide/tutorials/kotlin-java.md)
   - [Swift နှင့် iOS](/my/guide/tutorials/swift.md)
4. [မူကြမ်း အက်ပ်များ](/my/guide/tutorials/sample-apps.md) ကို အပြည့်အဝ Client Application Reference တစ်ခုလိုပါက ပြန်ကြည့်ပါ။
5. [Embed Kaigi](/my/guide/tutorials/kaigi.md) ကို မိမိ၏ပရိုဂရမ်ထဲတွင် ပိုက်ဆံအိတ်ဖြင့် ထောက်ခံသော အသံ/ဗီဒီယို အစည်းအဝေးများကို ထည့်သွင်းလိုပါက အသုံးပြုပါ။
6. [Musubi ပက်ကတ်များ](/my/guide/tutorials/musubi.md) ကိုအသုံးပြုပါ သင် reusable Kotodama အရင်းအမြစ်စာကြည့်တိုက်များနှင့် pinned on-chain registry မှီခိုမှုများကိုလိုအပ်သောအခါ။

## နမူနာများ {#samples}

Upstream အလုပ်ခွင်မှာ JavaScript ချက်ပြုတ်ချက်တွေနဲ့ Swift/iOS နမူနာ ပရောဂျက်တွေ ပါဝင်ပါတယ်။ Android အတွက်တော့ Kotlin SDK မော်ဒူးတွေနဲ့ စမ်းသပ်မှုတွေ စပါ။

- [နမူနာ app များ၏ Overview](/my/guide/tutorials/sample-apps.md)
- [ထည့်သွင်းထားသည် Kaigi a တွင် JavaScript app ကို](/my/guide/tutorials/kaigi.md)

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
