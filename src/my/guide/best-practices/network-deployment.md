---
translation_locale: my
translation_source: /guide/best-practices/network-deployment.md
translation_source_hash: 7839268b8c1f6700b0c26652e3308fa4e8acef4717d8527c609b6f30fb8c84ab
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ကွန်ရက် ဖြန့်ချိခြင်း {#network-deployment}

Iroha ကွန်ရက်ကို ညှိနှိုင်းထားတဲ့ စနစ်တစ်ခုအဖြစ် ဆက်ဆံပါ။ အတည်ပြုသူတွေဟာ ကွန်ရက်က ဘလော့ခ်တွေကို စတင်ပြီး အဆုံးသတ်နိုင်ဖို့ မတိုင်ခင် blockchain မျိုးဆက်၊ ထိပ်ပိုင်းဆိုင်ရာ၊ ယုံကြည်မှုရှိတဲ့ ကွန်ရက်ပြိုင်ဘက်တွေနဲ့ သဘောတူညီချက်နဲ့ သက်ဆိုင်တဲ့ ဖွဲ့စည်းပုံအပေါ် သဘောတူဖို့လိုတယ်။

## ပတ်ဝန်းကျင်ခွဲခြားမှု {#environment-separation}

- ဒေသတွင်း ဖွံ့ဖြိုးတိုးတက်မှု၊ မျှဝေထားတဲ့ စမ်းသပ်ရေးကွန်ရက်၊ အဆင့်သတ်မှတ်ခြင်းနဲ့ ထုတ်လုပ်မှုအတွက် သီးခြား ကွန်ပြူတာစုစည်းမှုကို ထိန်းသိမ်းပါ။
- တစ်ထည်သုံးလို့မရတဲ့ ပတ်ဝန်းကျင်တိုင်းအတွက် သော့သစ်တွေ ထုတ်ပေးပါ။ ထုတ်လုပ်မှုမှာ localnet (သို့) Taira သော့ပစ္စည်းကို ပြန်မသုံးပါနဲ့။
- Network peer config၊ client config, signed blockchain genesis, scripts နဲ့ deployment notes တွေကို versioned release artifact အဖြစ် အတူတကွ ထိန်းထားပါ။
- Private key တွေကို repositories နဲ့ deployment templates အပြင်မှာ သိမ်းထားပါ။

[ကွန်ရက် ဖြန့်ချိခြင်းအတွက် သော့ချက်များ](/my/guide/configure/keys-for-network-deployment.md) ကို ကြည့်ပါ။

## blockchain မျိုးဆက်နှင့် Topology {#genesis-and-topology}

- အတည်ပြုသူတိုင်းကို လက်မှတ်ထိုးထားတဲ့ blockchain genesis transaction တစ်ခုတည်း၊ ယုံကြည်မှုရှိတဲ့ ကွန်ရက် peer set, topology နဲ့ validator Proofs-of-Possession ကို profile ကလိုအပ်တဲ့အခါ သုံးစေပါ။
- အနည်းဆုံး Byzantine fault-tolerant deployment အတွက် validator လေးခုလောက်ကို သုံးပါ။
- စွမ်းဆောင်ရည် စီမံခန့်ခွဲမှုတွင် လေ့လာသူများမှ ကွဲပြားသော အတည်ပြုသူများ။ လေ့လာသူများသည် မဲမပေး၊ အဆိုပြုခြင်း သို့မဟုတ် စုဆောင်းခြင်းမရှိသော်လည်း သိုလှောင်ခြင်း၊ ဘလော့ကက် sync နှင့် ကွန်ရက် bandwidth များကို သုံးစွဲနေသည်။
- တစ်ခုတည်းသော peer edits များထက် blockchain ဖြစ်စဉ်၊ အကောင်အထည်ဖော်သူနှင့် topology အပြောင်းအလဲများကို ညှိနှိုင်းထားသည့် ရွှေ့ပြောင်းမှုများအဖြစ် ကုသပါ။

[blockchain ပေါ်ထွန်းမှု](/my/reference/genesis.md)၊ [ကွန်ရက် peer Management](/my/guide/configure/peer-management.md) နှင့် [စွမ်းဆောင်ရည်နှင့် မက်ထရစ်များ](/my/guide/advanced/metrics.md#node-count-and-quorum) ကိုကြည့်ပါ။

## Torii နှင့် Network Access {#torii-and-network-access}

- Torii ကို အိမ်ရှင် (သို့) ပုဂ္ဂိုလ်ရေးကွန်ရက်အပြင်မှာ ပွင့်လင်းမြင်သာမှုရှိတဲ့အခါ ပြောင်းပြန် proxy (သို့) firewall နောက်ကွယ်မှာထည့်ပါ။
- TLS ကို အဆုံးသတ်ပြီး အခြေခံအတည်ပြုမှု၊နှုန်းသတ်ခြင်းနှင့်တောင်းဆိုမှုအရွယ်အစားထိန်းချုပ်မှုကို ဖြန့်ချိမှုလိုအပ်တဲ့အခါ အစွန်းမှာအသုံးပြုပါ။
- ပတ်ဝန်းကျင်အတွက် လိုအပ်တဲ့ API အကန့်အသတ်မှတ်ချက်တွေကိုသာ ထုတ်ဝေပါ။ သုံးစွဲသူနဲ့ တယ်လီမီထရီ လမ်းကြောင်းတွေဟာ အများပြည်သူ ဖတ်လို့ရတဲ့ လမ်းကြောင်းတွေထက် ပိုပြီး ကန့်သတ်ထားသင့်ပါတယ်။
- Network peers တွေက Remote Traffic ကို တိုက်ရိုက် လက်မခံသင့်တဲ့အခါ host-local interfaces တွေကို Listener address တွေကို Bind လုပ်ပေးပါ။

[Torii API အဆုံးသတ်မှတ်ချက်များ](/my/reference/torii-endpoints.md) နှင့် [Virtual Private Networks များ](/my/guide/security/vpn.md) ကိုကြည့်ပါ။

## သဘောတူညီချက်နှင့် အရည်အသွေး {#consensus-and-capacity}

- သဘောတူညီချက်ချိန်ကို ညှိမပေးခင် ဖြန့်ချိမှုကို တိုင်းထွာပါ။ ကွန်ရက်၊ သိုလှောင်ခြင်းနှင့် လုပ်ဆောင်မှု အလွှာများ လိုက်လျောညီထွေနေစဉ်မှသာ အချိန်ဆွဲမှု လျော့နည်းစေနိုင်ပါသည်။
- အတန်းရဲ့ ဦးတည်ချက်ကို စောင့်ကြည့်ပါ၊ သယ်ယူပို့ဆောင်မှု နမူနာတိုတွေတင် မဟုတ်ပါ။ တည်ငြိမ်တဲ့ ဝန်ထုပ်ချိန်မှာ ကြီးထွားလာတဲ့ အတန်းက ကွန်ရက်ဟာ အလွန်အကျွံ ဝန်ထုပ်ခံရတာလို့ ဆိုလိုတယ်။
- ထိရောက်သော Sumeragi ပမာဏများ၊ တယ်လီမီထရီပရိုဖိုင်း၊ အတည်ပြုသူအရေအတွက်၊ ကွန်ရက် RTT၊ အလုပ်အကိုင်အားပုံစံနှင့် တိုင်းတာချက်တစ်ခုစီအတွက် Hardware အသေးစိတ်အချက်အလက်များကို မှတ်တမ်းတင်ပါ။
- တစ်ချိန်တည်းမှာ ကန့်သတ်ထားတဲ့ စာတန်းတစ်ခု (သို့) အသုံးဝင် ဝန်ဆောင်မှု ပြန်လည်ထူထောင်ရေး အကန့်အသတ်ကို ပြောင်းလဲပြီး မတိုင်ခင်နဲ့ နောက်ပိုင်း နှောင့်နှေးမှု၊ ယာဉ်ကြော၊ မှတ်ဉာဏ်နဲ့ အပြန်အလှန် ဖိအားသက်သေတွေကို ထိန်းသိမ်းပါ။

[စွမ်းဆောင်ရည်နှင့် မက်ထရစ်များ](/my/guide/advanced/metrics.md) ကို ကြည့်ပါ။

## Bare-Metal နှင့် Process စီမံခန့်ခွဲမှု {#bare-metal-and-process-management}

- Network peer တစ်ခုစီရဲ့ `config.toml`, private key, storage directory နဲ့ ports တွေကို သီးခြားထားပါ။
- systemd ကဲ့သို့သော လုပ်ငန်းစဉ် စီမံခန့်ခွဲသူများကို ရှင်းလင်းစွာ restart၊ logging နှင့် resource policy များနှင့်အတူ အသုံးပြုပါ။
- ထုတ်လုပ်ထားသော ထိန်းသိမ်းမှု README command တွေကို Start ကနေ Kagami test topology ကို managed host တွေကို ဘာသာပြန်တဲ့အခါ localnet bundles တွေပါ။

[Bare Metal မှာ Running Iroha](/my/guide/advanced/running-iroha-on-bare-metal.md) ကို ကြည့်ပါ။
