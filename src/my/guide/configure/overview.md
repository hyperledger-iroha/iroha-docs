---
translation_locale: my
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# စီမံခန့်ခွဲမှုနှင့် ဖွဲ့စည်းခြင်း {#configuration-and-management}

Iroha ဖွဲ့စည်းပုံမှာ အာဏာရှိတဲ့ အလွှာနှစ်ခုရှိပါတယ်။

- **ဒေသတွင်း peer နှင့် client ကို configuration**, သိုလှောင် TOML စာရွက်စာတမ်းများနှင့် ဖတ်ရှု
  လုပ်ငန်းစဉ်စတင်ခြင်း
- **ချိတ်ဆက်ထားသော configuration**, ငွေလဲလှယ်နှုန်း
  [`SetParameter`](/my/blockchain/instructions.md#setparameter)

node identity, addresses, logging, storage နှင့်
client sign key များကို အသုံးပြုပါ။ သဘောတူညီရန်လိုအပ်သော တန်ဖိုးများအတွက် on-chain ဖွဲ့စည်းမှုကိုအသုံးပြုပါ
ကွန်ရက်ကနေပြီး deterministically ပြန်လည်ဖြန့်ချိတယ်။

ထုတ်လုပ်မှု အပြုအမူဟာ ဒီဖွဲ့စည်းပုံ အလွှာတွေကနေ လာဖို့လိုတယ်။ ပတ်ဝန်းကျင်
အပြောင်းအလဲတွေဟာ ဒေသတွင်း ကိရိယာတွေကို စမ်းသပ်မှု input တွေ ပေးပို့ဖို့ အဆင်ပြေနိုင်ပေမဲ့
၎င်းတို့ဟာ ထုတ်လုပ်ရေး လက္ခဏာ တံခါးတွေ မဟုတ်ကြသလို ကတိပေးထားတဲ့ အရာတွေကို အစားထိုးမပေးနိုင်ပါ။
ဖွဲ့စည်းမှု။

အဓိက configuration entry points တွေက-

- [ဇင်နဝါရီ](/my/guide/configure/genesis.md)
- [Client ဖွဲ့စည်းပုံ](/my/guide/configure/client-configuration.md)
- [Network deployment အတွက် Key များ](/my/guide/configure/keys-for-network-deployment.md)
- [ပိုးမွှားနဲ့ ပြေးနေတာပါ။](/my/guide/advanced/running-iroha-on-bare-metal.md)
- [Peer ဖွဲ့စည်းမှု ရည်ညွှန်းချက်](/my/reference/peer-config/index.md)
