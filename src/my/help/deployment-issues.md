---
translation_locale: my
translation_source: /help/deployment-issues.md
translation_source_hash: 6f35ac59053e312f56a716810c8f0b625752500d1fc64b27d93cbd8317b6cc19
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ဖြန့်ချိမှု ပြဿနာများ ဖြေရှင်းခြင်း {#troubleshooting-deployment-issues}

ဤအခန်းတွင် Iroha 3 deployments များအတွက်ပြဿနာဖြေရှင်းရေး အကြံပြုချက်များကိုပေးထားပါသည်။ သင်တွေ့နေရတဲ့ ပြဿနာကို ဒီမှာဖော်ပြမထားပါက [Telegram](https://t.me/hyperledgeriroha) မှ ဆက်သွယ်ပါ။

## ဖန်တီးထားတဲ့ လက်ရာတွေနဲ့ စတင်ပါ။ {#start-with-generated-artifacts}

ဒေသတွင်း (သို့) စမ်းသပ်မှု ဖြန့်ချိချက်များအတွက် Kagami မှထုတ်လုပ်ထားသော အနုပညာပစ္စည်းများကို လက်နဲ့ရေးသားထားသည့် တူညီတဲ့ ဖိုင်တွေအစား ဦးစားပေးပါ။

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Generated directory မှာ peer configs, genesis material, start script တွေနဲ့ README build line အတွက် Iroha 3 ကို ထည့်သွင်းထားတယ်။

## Peer က မစဘူး။ {#peer-does-not-start}

ဒီပစ္စည်းတွေကို အရင်စစ်ကြည့်ပါ။

- `irohad --config <path>` အချက်အလက်များကို တူညီသူ၏ TOML ဖိုင်တွင် ထည့်သွင်းထားပါသည်။
- `public_key` နဲ့ `private_key` တို့ဟာ တူညီတဲ့ သော့စုံကို ပိုင်ဆိုင်ပါတယ်။
- `genesis.public_key` က genesis transaction ကို လက်မှတ်ရေးထိုးဖို့ အသုံးပြုခဲ့တဲ့ သော့နဲ့ ကိုက်ညီပါတယ်။
- validator peer identities use BLS-Normal keys, and `trusted_peers_pop` contains proof of possession entries for the local key and trusted peers (ထည့်သွင်းရန်လိုအပ်သော)
- Torii နှင့် P2P အတွက်ဆိပ်ကမ်းများကို အခြားလုပ်ငန်းစဉ်တစ်ခုဖြင့် ချည်နှောင်ထားခြင်း မရှိပါ။
- Kura store directory ဟာ တူညီတဲ့ ကွင်းဆက်ထဲ ပါဝင်ပြီး အခြားကွန်ရက် ပရိုဖိုင်တစ်ခုကနေ ကူးယူထားတာ မဟုတ်ဘူး။

Daemon က TOML အလွှာတစ်ခုထက်ပိုပြီးဖတ်တဲ့အခါ config tracing ကိုသုံးပါ။

```bash
cargo run --bin irohad -- --config ./config.toml --trace-config
```

## Docker နှင့် Composite {#docker-and-compose}

Generate Current Kagami localnet output မှပေါင်းစပ်ပါ command line arguments နှင့် config files များသည် check-out code ကိုက်ညီစေရန်:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

compose deployment ကိုစတင်ပြီးနောက် stalks လုပ်ရင် daemon log တွေကို စစ်ဆေးပါ

- မှားယွင်းသော `chain`
- Genesis Transaction သို့မဟုတ် Manifest တစ်ခုကို အသုံးပြုတဲ့ peer
- ကြော်ငြာပြုလုပ်ထားသော P2P လိပ်စာများမှာ ကွန်ပျူတာ ကွန်ရက်အတွင်းတွင်သာ အလုပ်ဖြစ်ပါသည်။
- ဒေသတွင်းပမာဏ ပြန်လည်သုံးစွဲခြင်း Genesis ပြန်လည်ပြုပြင်ပြီးနောက်

ဗီဇသစ်ကို စစ်ဆေးတဲ့အခါ stack ကို ပြန်စတင်မလုပ်ခင် Kura အရွယ်အစားဟောင်းတွေကို ဖယ်ရှားပါ။ ဗီဇအသစ်နဲ့ ဘလော့ကစ်ဟောင်းတွေ သိုလှောင်ထားခြင်းက playback ကျရှုံးစေပါလိမ့်မယ်။

## Kubernetes {#kubernetes}

Kubernetes အတွက် validator တစ်ခုစီကို stateful အခြေခံအဆောက်အအုံတစ်ခုအဖြစ် ဆက်ဆံပါ။

- တူညီမှုရှိသူတိုင်းအတွက် တည်ငြိမ်တဲ့ ကိုယ်ပိုင်လက္ခဏာ သော့နဲ့ တည်ငြိမ်နေတဲ့ ပမာဏကို ပေးပါ။
- P2P လိပ်စာများကို အခြားအဖော်များက အုပ်စုအတွင်းမှ ဖြေရှင်းနိုင်သော လိပ်စာများအား ဖော်ပြပါ။
- configuration နှင့် genesis files များကို roll-out အတွက်မပြောင်းလဲနိုင်သော config အဖြစ်တပ်ဆင်ပါ။
- ဗီဇ (သို့) ထိပ်ပိုင်းဆိုင်ရာ အပြောင်းအလဲအားလုံးကို အလိုအလျောက် ပြုပြင်ခြင်းမဟုတ်ဘဲ ရည်ရွယ်ချက်ရှိပြီး ဖြန့်ချိပေးပါ။

Pod တစ်ခုကို အကြိမ်ကြိမ် ပြန်လည်စတင်ပါက၊ pod ထဲရှိ rendered config ကို မျှော်မှန်းထားသော [`peer.template.toml`](/my/reference/peer-config/index.md#template) နဲ့ နှိုင်းယှဉ်ပြီး peer က Kura ဒေတာဟောင်းတွေကို ပြန်လည်ကစားနေလား စစ်ဆေးပါ။

## Sora ၏ ပရိုဖိုင် {#sora-profile}

Iroha 3 deployments များမှာ Nexus၊ SoraFS သို့မဟုတ် multi-lane flows တွေကို အသုံးပြုရင် Sora profile ကို activated လုပ်ထားပြီး daemon ကို start လုပ်သင့်ပါတယ်။

```bash
cargo run --bin irohad -- --config ./config.toml --sora
```

ကွန်ရက်တစ်ခုတည်းရှိ validator များအကြားမှာ တူညီသော profile ကို တစ်ချိန်လုံးအသုံးပြုပါ။
