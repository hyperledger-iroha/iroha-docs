---
translation_locale: my
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ဖွဲ့စည်းခြင်းနှင့် စီမံခန့်ခွဲမှု {#configuration-and-management}

Iroha ဖွဲ့စည်းပုံမှာ ခိုင်မာတဲ့ အလွှာနှစ်ခုရှိပါတယ်။

- Local network peer နဲ့ client configuration ကို TOML file တွေမှာ သိမ်းထားပြီး process startup မှာ ဖတ်ရှုတယ်။
- on-chain configuration ကို Transaction တွေကနေ ပြောင်းလဲလိုက်တဲ့ [`SetParameter`](/my/blockchain/instructions.md#setparameter)

node identity, address, logging, storage, and client signing keys တို့အတွက် ဒေသတွင်း configuration ကို အသုံးပြုပါ။ ကွန်ရက်က သဘောတူပြီး deterministically ပြန်လည်ကစားရမယ့် တန်ဖိုးတွေအတွက် on-chain configuration ကို သုံးပါ။

ထုတ်လုပ်မှုအပြုအမူဟာ ဒီဖွဲ့စည်းမှု အလွှာတွေကနေ လာဖို့လိုပါတယ်။ ပတ်ဝန်းကျင်ဆိုင်ရာ ကိန်းရှင်တွေဟာ ဒေသတွင်း tooling ကို စမ်းသပ်မှု input တွေကို ထောက်ပံ့ဖို့ အဆင်ပြေနိုင်ပေမဲ့ ဒါတွေဟာ ထုတ်လုပ်ရေး feature gate တွေမဟုတ်ဘူး၊ ပြီးဆုံးတဲ့ဖွဲ့စည်းမှုကို အစားထိုးတာမဟုတ်ဘူး။

အဓိက configuration entry points တွေက-

- [blockchain ပေါ်ထွန်းမှု](/my/guide/configure/genesis.md)
- [Client ဖွဲ့စည်းမှု](/my/guide/configure/client-configuration.md)
- [Network deployment အတွက် သော့များ](/my/guide/configure/keys-for-network-deployment.md)
- [ပိုးမွှားနဲ့ ပြေးနေတာပါ။](/my/guide/advanced/running-iroha-on-bare-metal.md)
- [Network peer configuration ကို ရည်ညွှန်းချက်](/my/reference/peer-config/index.md)
