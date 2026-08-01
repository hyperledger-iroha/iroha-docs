---
translation_locale: my
translation_source: /guide/best-practices/network-deployment.md
translation_source_hash: 312f9cb3c6fd937b3e7c30ea27d1876ea7901cfa79eced352611db99bbca4a70
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ကွန်ရက် ဖြန့်ချိခြင်း {#network-deployment}

Iroha ကွန်ရက်ကို ညှိနှိုင်းထားတဲ့ စနစ်တစ်ခုအဖြစ် ဆက်ဆံပါ။ ကွန်ရက်က ဘလော့တွေကို စတင်ပြီး အဆုံးသတ်နိုင်ဖို့ မတိုင်ခင် validators တွေဟာ မျိုးရိုးဗီဇ၊ ထိပ်ပိုင်းဆိုင်ရာ၊ ယုံကြည်မှုရှိတဲ့ အဖော်တွေနဲ့ သဘောတူညီချက်နဲ့ သက်ဆိုင်တဲ့ ဖွဲ့စည်းပုံအပေါ် သဘောတူဖို့လိုပါတယ်။

## ပတ်ဝန်းကျင်ခွဲခြားမှု {#environment-separation}

- ဒေသတွင်း ဖွံ့ဖြိုးတိုးတက်မှု၊ မျှဝေထားတဲ့ စမ်းသပ်ရေးကွန်ရက်၊ အဆင့်သတ်မှတ်ခြင်းနဲ့ ထုတ်လုပ်မှုအတွက် သီးခြား ကွန်ပြူတာစုစည်းမှုကို ထိန်းသိမ်းပါ။
- တစ်ထည်သုံးလို့မရတဲ့ ပတ်ဝန်းကျင်တိုင်းအတွက် သော့သစ်တွေ ထုတ်ပေးပါ။ ထုတ်လုပ်မှုမှာ localnet (သို့) Taira သော့ပစ္စည်းကို ပြန်မသုံးပါနဲ့။
- peer config၊ client config, signed genesis, scripts နဲ့ deployment notes တွေကို versioned release artifact အဖြစ် အတူတကွထားပါ။
- Private key တွေကို repositories နဲ့ deployment templates အပြင်မှာ သိမ်းထားပါ။

[ကွန်ရက်ဖြန့်ချိမှုအတွက် သော့များ](/my/guide/configure/keys-for-network-deployment.md) ကိုကြည့်ပါ။

## Genesis နှင့် Topology {#genesis-and-topology}

- အတည်ပြုသူတိုင်းဟာ လက်မှတ်ထိုးထားတဲ့ Genesis Transaction, Trusted Peer Set, Topology နဲ့ validator Proof-of-Possession တွေကိုပဲ သုံးစေပါ။
- အနည်းဆုံး Byzantine fault-tolerant deployment အတွက် validator လေးခုလောက်ကို သုံးပါ။
- စွမ်းဆောင်ရည် စီမံခန့်ခွဲမှုတွင် လေ့လာသူများမှ ကွဲပြားသော အတည်ပြုသူများ။ လေ့လာသူများသည် မဲမပေး၊ အဆိုပြုခြင်း သို့မဟုတ် စုဆောင်းခြင်းမရှိသော်လည်း သိုလှောင်ခြင်း၊ ဘလော့ကက် sync နှင့် ကွန်ရက် bandwidth များကို သုံးစွဲနေသည်။
- မျိုးရိုးဗီဇ၊ အကောင်အထည်ဖော်သူနဲ့ ထိပ်ပိုင်းဆိုင်ရာ အပြောင်းအလဲတွေကို တစ်တူတည်း တည်းဖြတ်မှုအစား ညှိနှိုင်းထားတဲ့ ရွှေ့ပြောင်းမှုတွေအဖြစ် ကုသပါ။

[Genesis](/my/reference/genesis.md)၊ [Peer Management](/my/guide/configure/peer-management.md) နှင့် [Performance and Metrics](/my/guide/advanced/metrics.md#node-count-and-quorum) ကိုကြည့်ပါ။

## Torii နှင့် Network Access {#torii-and-network-access}

- Torii ကို အိမ်ရှင် (သို့) ပုဂ္ဂိုလ်ရေးကွန်ရက်အပြင်မှာ ပွင့်လင်းမြင်သာမှုရှိတဲ့အခါ ပြောင်းပြန် proxy (သို့) firewall နောက်ကွယ်မှာထည့်ပါ။
- TLS ကို အဆုံးသတ်ပြီး အခြေခံအတည်ပြုမှု၊နှုန်းသတ်ခြင်းနှင့်တောင်းဆိုမှုအရွယ်အစားထိန်းချုပ်မှုကို ဖြန့်ချိမှုလိုအပ်တဲ့အခါ အစွန်းမှာအသုံးပြုပါ။
- ပတ်ဝန်းကျင်အတွက် လိုအပ်တဲ့ အဆုံးသတ်မှတ်ချက်တွေကိုသာ ထုတ်ဝေပါ။ အသုံးပြုသူနဲ့ တယ်လီမီထရီ လမ်းကြောင်းတွေဟာ အများပြည်သူ ဖတ်လို့ရတဲ့ လမ်းကြောင်းတွေထက် ပိုပြီး ကန့်သတ်သင့်တယ်။
- အထက်တန်းစားတွေက ဝေးလံတဲ့ ယာဉ်ကြောကို တိုက်ရိုက် လက်မခံသင့်တဲ့အခါ host-local interfaces တွေနဲ့ နားဆင်သူရဲ့လိပ်စာတွေကို ချိတ်ဆက်ပါ။

[Torii Endpoints](/my/reference/torii-endpoints.md) နှင့် [Virtual Private Networks ](/my/guide/security/vpn.md) ကိုကြည့်ပါ။

## သဘောတူညီချက်နှင့် အရည်အသွေး {#consensus-and-capacity}

- သဘောတူညီချက်ချိန်ကို ညှိမပေးခင် ဖြန့်ချိမှုကို တိုင်းထွာပါ။ ကွန်ရက်၊ သိုလှောင်ခြင်းနှင့် လုပ်ဆောင်မှု အလွှာများ လိုက်လျောညီထွေနေစဉ်မှသာ အချိန်ဆွဲမှု လျော့နည်းစေနိုင်ပါသည်။
- အတန်းရဲ့ ဦးတည်ချက်ကို စောင့်ကြည့်ပါ၊ သယ်ယူပို့ဆောင်မှု နမူနာတိုတွေတင် မဟုတ်ပါ။ တည်ငြိမ်တဲ့ ဝန်ထုပ်ချိန်မှာ ကြီးထွားလာတဲ့ အတန်းက ကွန်ရက်ဟာ အလွန်အကျွံ ဝန်ထုပ်ခံရတာလို့ ဆိုလိုတယ်။
- ထိရောက်သော Sumeragi ပမာဏများ၊ တယ်လီမီထရီပရိုဖိုင်း၊ အတည်ပြုသူအရေအတွက်၊ ကွန်ရက် RTT၊ အလုပ်အကိုင်အားပုံစံနှင့် တိုင်းတာချက်တစ်ခုစီအတွက် Hardware အသေးစိတ်အချက်အလက်များကို မှတ်တမ်းတင်ပါ။
- နောက်ဆုတ်မှု၊ ယာဉ်ကြောနဲ့ backpressure အချက်ပြမှုတွေကို နှိုင်းယှဉ်ပြီးနောက်မှပဲ ကောက်ခံအားကို မြှင့်တင်ပါ။

[ စွမ်းဆောင်ရည်နှင့် မက်ထရစ်များ](/my/guide/advanced/metrics.md) ကိုကြည့်ပါ။

## Bare-Metal နှင့် Process စီမံခန့်ခွဲမှု {#bare-metal-and-process-management}

- တူညီတဲ့ `config.toml`, private key, storage directory နဲ့ ports တွေကို သီးခြားထားပါ။
- systemd ကဲ့သို့သော လုပ်ငန်းစဉ် စီမံခန့်ခွဲသူများကို ရှင်းလင်းစွာ restart၊ logging နှင့် resource policy များနှင့်အတူ အသုံးပြုပါ။
- ထုတ်လုပ်ထားသော ထိန်းသိမ်းမှု README command တွေကို Start ကနေ Kagami test topology ကို managed host တွေကို ဘာသာပြန်တဲ့အခါ localnet bundles တွေပါ။

[ Bare Metal ](/my/guide/advanced/running-iroha-on-bare-metal.md) အတွက် Running Iroha ကို ကြည့်ပါ။
