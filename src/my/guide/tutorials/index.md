---
translation_locale: my
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK သင်ခန်းစာများ {#sdk-tutorials}

ဒီစာမျက်နှာတွေက Iroha 3 ဝန်ထမ်းဝင်ရောက်မှုမှတ်တိုင်များ
အလုပ်ခွင်၊ Canonical package နာမည်များ၊ တပ်ဆင်ရေးလမ်းကြောင်းများနှင့် အနည်းဆုံး
အစအဆုံးတွေ။

## အကြံပြုချက် {#recommended-order}

1. [တပ်ဆင်ခြင်း Iroha 3](/my/get-started/install-iroha.md)
2. [လွှတ်တင်ခြင်း Iroha 3](/my/get-started/launch-iroha.md)
3. ရွေးချယ်ပါ။ SDK:
   - [Rust](/my/guide/tutorials/rust.md)
   - [Python](/my/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/my/guide/tutorials/javascript.md)
   - [Kotlin, Android, ဂါဝ](/my/guide/tutorials/kotlin-java.md)
   - [Swift ပြီးတော့ iOS](/my/guide/tutorials/swift.md)
4. ပြန်လည်သုံးသပ်ခြင်း [နမူနာ app များ](/my/guide/tutorials/sample-apps.md) သင်ဟာ
   ဝယ်သူ လျှောက်လွှာ အပြည့်အစုံပါ။
5. အသုံးပြုခြင်း [ပူးပေါင်းခြင်း Kaigi](/my/guide/tutorials/kaigi.md) ထပ်ဖြည့်ချင်ရင်
   သင့်ရဲ့ ကိုယ်ပိုင် app မှာ ပိုက်ဆံအိတ်ကိုထောက်ပံ့ထားတဲ့ အသံ/ဗီဒီယို အစည်းအဝေးတွေပါ။
6. အသုံးပြုခြင်း [Musubi အိတ်များ](/my/guide/tutorials/musubi.md) ပြန်သုံးလို့ရတဲ့ ပစ္စည်းတွေ လိုအပ်တဲ့အခါ
   Kotodama ချိတ်ဆက်ထားသော အချိုးအကန့်အသတ် မှတ်ပုံတင် မှီခိုချက်များနှင့်အတူ source library များ။

## နမူနာများ {#samples}

Upstream အလုပ်ခွင်မှာ JavaScript ချက်ပြုတ်ချက်များ Swift/iOS နမူနာ
စီမံကိန်းများအတွက် Android, အစက Kotlin SDK မော်ဂျူးတွေနဲ့ စမ်းသပ်မှုတွေ

- [အပ်လီကေးရှင်းများ၏ နမူနာများ](/my/guide/tutorials/sample-apps.md)
- [ပူးပေါင်းခြင်း Kaigi a တွင် JavaScript app ကို](/my/guide/tutorials/kaigi.md)

## သမ္မာတရား၏ရင်းမြစ် {#source-of-truth}

အားလုံး SDK ဤစာမျက်နှာများသည် လက်ရှိ Upstream လုပ်ငန်းခွင်မှ ရရှိထားသည် -

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (Java Mirror of the Kotlin- ပထမ Android မျက်နှာပြင်)
- `IrohaSwift`
- `crates/musubi`

သံသယရှိရင် README ဒီစာအုပ်တွေမှာ ပါကတ် metadata တွေပါ
ခင်ဗျား တည်ဆောက်နေတဲ့ Source Revision ကို ဖော်ပြပါတယ်။
