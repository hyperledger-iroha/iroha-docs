---
translation_locale: my
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ဖွဲ့စည်းခြင်းနှင့် စီမံခန့်ခွဲမှု {#configuration-and-management}

Iroha ဖွဲ့စည်းပုံမှာ ခိုင်မာတဲ့ အလွှာနှစ်ခုရှိပါတယ်။

- TOML ဖိုင်များတွင် သိမ်းဆည်းထားပြီး လုပ်ငန်းစဉ်စတင်ချိန်တွင် ဖတ်ရှုနိုင်သော ဒေသခံ peer နှင့် client ကို configuration
- [ `SetParameter`](/my/blockchain/instructions.md#setparameter) မှတစ်ဆင့် ငွေပေးချေမှုဖြင့် ပြောင်းလဲသော ချိတ်ဆက်ထားသော စက်လှေပေါ်က ဖွဲ့စည်းပုံ

node identity, address, logging, storage, and client signing keys တို့အတွက် ဒေသတွင်း configuration ကို အသုံးပြုပါ။ ကွန်ရက်က သဘောတူပြီး deterministically ပြန်လည်ကစားရမယ့် တန်ဖိုးတွေအတွက် on-chain configuration ကို သုံးပါ။

ထုတ်လုပ်မှုအပြုအမူဟာ ဒီဖွဲ့စည်းမှု အလွှာတွေကနေ လာဖို့လိုပါတယ်။ ဒေသတွင်း ကိရိယာများအတွက် စမ်းသပ်မှု input တွေကို ထောက်ပံ့ဖို့ ပတ်ဝန်းကျင်ဆိုင်ရာ အပြောင်းအလဲတွေဟာ သက်တောင့်သက်သာဖြစ်လောက်ပေမဲ့ ၎င်းတို့ဟာ ထုတ်လုပ်ရေး လက္ခဏာဂိတ်တွေမဟုတ်ပြီး ကတိပေးထားတဲ့ ဖွဲ့စည်းမှုကို အစားထိုးတာ မဟုတ်ပါဘူး။

အဓိက configuration entry points တွေက-

- [Genesis](/my/guide/configure/genesis.md)
- [Client ဖွဲ့စည်းမှု](/my/guide/configure/client-configuration.md)
- [ကွန်ရက် ဖြန့်ချိရေးအတွက် သော့များ ](/my/guide/configure/keys-for-network-deployment.md)
- [bare metal ](/my/guide/advanced/running-iroha-on-bare-metal.md) နဲ့ ပြေးနေတာပါ။
- [Peer configuration Reference ](/my/reference/peer-config/index.md)
