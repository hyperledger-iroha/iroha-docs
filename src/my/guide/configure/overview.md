---
translation_locale: my
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ဖွဲ့စည်းခြင်းနှင့် စီမံခန့်ခွဲမှု {#configuration-and-management}

Iroha ဖွဲ့စည်းပုံမှာ ခိုင်မာတဲ့ အလွှာနှစ်ခုရှိပါတယ်။

- TOML ဖိုင်များတွင် သိမ်းထားပြီး လုပ်ငန်းစဉ်စတင်ချိန်၌ ဖတ်ယူသော **စက်တွင်း peer နှင့် client ပြင်ဆင်သတ်မှတ်မှု**
- [`SetParameter`](/my/blockchain/instructions.md#setparameter) ကို အသုံးပြုသော transaction များဖြင့် ပြောင်းလဲသည့် **ဘလော့ခ်ချိန်းပေါ်ရှိ ပြင်ဆင်သတ်မှတ်မှု**

နိုဒ်အထောက်အထား၊ လိပ်စာ၊ မှတ်တမ်း၊ သိမ်းဆည်းမှုနှင့် client လက်မှတ်ထိုးကီးများအတွက် စက်တွင်းပြင်ဆင်သတ်မှတ်မှုကို အသုံးပြုပါ။ ကွန်ရက်တစ်ခုလုံး သဘောတူရပြီး ပြန်လည်လုပ်ဆောင်တိုင်း ရလဒ်တူညီရမည့် တန်ဖိုးများအတွက် ဘလော့ခ်ချိန်းပေါ်ရှိ ပြင်ဆင်သတ်မှတ်မှုကို အသုံးပြုပါ။

ထုတ်လုပ်မှုအပြုအမူဟာ ဒီဖွဲ့စည်းမှု အလွှာတွေကနေ လာဖို့လိုပါတယ်။ ပတ်ဝန်းကျင်ဆိုင်ရာ ကိန်းရှင်တွေဟာ ဒေသတွင်း tooling ကို စမ်းသပ်မှု input တွေကို ထောက်ပံ့ဖို့ အဆင်ပြေနိုင်ပေမဲ့ ဒါတွေဟာ ထုတ်လုပ်ရေး feature gate တွေမဟုတ်ဘူး၊ ပြီးဆုံးတဲ့ဖွဲ့စည်းမှုကို အစားထိုးတာမဟုတ်ဘူး။

အဓိက ပြင်ဆင်သတ်မှတ်မှု စတင်ရာနေရာများမှာ အောက်ပါအတိုင်းဖြစ်သည်။

- [blockchain ပေါ်ထွန်းမှု](/my/guide/configure/genesis.md)
- [Client ဖွဲ့စည်းမှု](/my/guide/configure/client-configuration.md)
- [ကွန်ရက် deployment အတွက် ကီးများ](/my/guide/configure/keys-for-network-deployment.md)
- [ပိုးမွှားနဲ့ ပြေးနေတာပါ။](/my/guide/advanced/running-iroha-on-bare-metal.md)
- [peer ပြင်ဆင်သတ်မှတ်မှု အကိုးအကား](/my/reference/peer-config/index.md)
