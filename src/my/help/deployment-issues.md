---
translation_locale: my
translation_source: /help/deployment-issues.md
translation_source_hash: c220e127bc8081c9b457dfd67101aa44fb80d79c461cc7a7eda99584d74a8f19
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ဖြန့်ချိမှု ပြဿနာများ ဖြေရှင်းခြင်း {#troubleshooting-deployment-issues}

Iroha 3 deployments များအတွက်ပြဿနာဖြေရှင်းရေး အကြံပေးချက်များကို ဤအခန်းတွင်ဖော်ပြထားပါသည်။ သင်တွေ့နေရတဲ့ ပြဿနာကို ဒီမှာ ဖော်ပြခြင်းမရှိပါက [အွန်လိုင်း](https://t.me/hyperledgeriroha) မှတစ်ဆင့် ကျွန်ုပ်တို့နှင့် ဆက်သွယ်ပါ။

## ဖန်တီးထားတဲ့ လက်ရာတွေနဲ့ စတင်ပါ။ {#start-with-generated-artifacts}

ဒေသတွင်း (သို့) စမ်းသပ်မှု အကောင်အထည်ဖော်မှုအတွက် Kagami မှထုတ်လုပ်ထားသော လက်ကိုင်ရေးသားထားတဲ့ ကွန်ရက် peer ဖိုင်တွေအစား ရှေးဟောင်းပစ္စည်းတွေကို ဦးစားပေးပါ။

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Generated directory တွင် network peer config များ၊ blockchain genesis ပစ္စည်းများ၊ start script များနှင့် README အတွက် Iroha 3 build line များပါဝင်သည်။

## Network peer မစတင်တော့ဘူး {#peer-does-not-start}

ဒီပစ္စည်းတွေကို အရင်စစ်ကြည့်ပါ။

- `iroha3d --config <path>` အချက်အလက်များကို ကွန်ရက် peer's own TOML ဖိုင်တွင် ထည့်သွင်းထားပါသည်။
- `public_key` နဲ့ `private_key` တို့ဟာ Network Peer Config ထဲမှာ တူညီတဲ့ Key Pair တစ်ခုတည်းပါ။
- `genesis.public_key` ကတော့ blockchain Genesis Transaction ကို လက်မှတ်ရေးထိုးဖို့ အသုံးပြုခဲ့တဲ့ သော့နဲ့ တူပါတယ်။
- validator network peer identities use BLS-Normal keys, and `trusted_peers_pop` contains proof of possession entries for the local key and trusted network peers.
- Torii နှင့် P2P အတွက်ဆိပ်ကမ်းများကို အခြားလုပ်ငန်းစဉ်တစ်ခုဖြင့် ချည်နှောင်ထားခြင်း မရှိပါ။
- Kura store directory ဟာ တူညီတဲ့ ကွင်းဆက်ထဲ ပါဝင်ပြီး အခြားကွန်ရက် ပရိုဖိုင်တစ်ခုကနေ ကူးယူထားတာ မဟုတ်ဘူး။

Daemon က TOML အလွှာတစ်ခုထက်ပိုပြီးဖတ်တဲ့အခါ config tracing ကိုသုံးပါ။

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --trace-config
```

## Docker နှင့် Composite {#docker-and-compose}

Generate Current Kagami localnet output မှပေါင်းစပ်ပါ command line arguments နှင့် config files များသည် check-out code ကိုက်ညီစေရန်:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

compose deployment ကိုစတင်ပြီးနောက် stalks လုပ်ရင် daemon log တွေကို စစ်ဆေးပါ

- မှားယွင်းသော `chain`
- အခြား blockchain genesis transaction သို့မဟုတ် technical manifest ကိုသုံးတဲ့ network peer တစ်ခု
- ကြော်ငြာပြုလုပ်ထားသော P2P လိပ်စာများမှာ ကွန်ပျူတာ ကွန်ရက်အတွင်းတွင်သာ အလုပ်ဖြစ်ပါသည်။
- ဒေသတွင်းပမာဏကို ပြန်လည်သုံးစွဲပြီးနောက် blockchain genesis ကိုပြန်လည်ပြုပြင်ခြင်း

အသစ်သော blockchain genesis ကိုစမ်းသပ်တဲ့အခါ stack ကိုပြန်လည်စတင်မလုပ်ခင် Kura အရွယ်အစားဟောင်းတွေကို ဖယ်ရှားပါ။ blockchain genesis အသစ်တစ်ခုနဲ့အဟောင်းဘလော့ကို သိုလှောင်ထားခြင်းက playback ကျရှုံးစေလိမ့်မယ်။

## Kubernetes {#kubernetes}

Kubernetes အတွက် validator တစ်ခုစီကို stateful အခြေခံအဆောက်အအုံတစ်ခုအဖြစ် ဆက်ဆံပါ။

- Network peer တစ်ခုစီကို တည်ငြိမ်တဲ့ Identity Key နဲ့ တည်ငြိမ်နေတဲ့ Volume ကို ပေးပါ။
- P2P Address တွေကို ဖေါ်ပြပါ အခြား Network Peers တွေက Cluster အတွင်းကနေ ဖြေရှင်းနိုင်ပါတယ်
- မော်တော်ယာဉ် Config နှင့် blockchain ဘီလူးဖိုင်များအတွက်မပြောင်းလဲနိုင်သော config ကိုဖြန့်ချိရန်
- ဘလော့ခ်ချ်ရဲ့ ဇာစ်မြစ် (သို့) ထိပ်ပိုင်းဆိုင်ရာ အပြောင်းအလဲအားလုံးကို အလိုအလျောက် မပြုပြင်ဘဲ ရည်ရွယ်ချက်ရှိပြီး ဖြန့်ဖြူးပေးပါ။

Capsule တစ်ခုကို ထပ်ခါထပ်ခါ restart လုပ်ရင် Capsule ထဲက rendered config ကို မျှော်မှန်းချက်နဲ့ နှိုင်းယှဉ်ပါ။ [`peer.template.toml`](/my/reference/peer-config/index.md#template) network peer က အဟောင်းကို ပြန်လည်ကစားနေလားဆိုတာ စစ်ဆေးပါ။ Kura ဒေတာ။

## Sora ၏ ပရိုဖိုင် {#sora-profile}

Nexus၊ SoraFS သို့မဟုတ် multi-lane စီးဆင်းမှုများကို အသုံးပြုသော ပုဂ္ဂလိက (သို့) ဒေသတွင်း Iroha 3 ဖြန့်ချိမှုများတွင် Sora profile ကို ဖွင့်ထားသည့် ပုံမှန် daemon ကို စတင်သင့်ပါသည်။

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --sora
```

ကွန်ရက်တစ်ခုတည်းရှိ validator များအကြားမှာ တူညီသော profile ကို တစ်ချိန်လုံးအသုံးပြုပါ။

အများပြည်သူ Taira အတည်ပြုသူများက ရည်စူးထားသော စေလွှတ်စက်ကိုသုံးပြီး Taira ၏တိကျသောချိတ်ဆက်၊ စာရင်း၊ ပိတ်လိုက်သော embedded-SoraFS သိုလှောင်ခြင်းနှင့် runtime-signer profile ကိုအားပေးသည်။ ၎င်းကိုမစတင်မီ rendered Taira ဖွဲ့စည်းမှုကိုအတည်ပြုပါ:

```bash
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

လူထုကို မစတင်ပါနဲ့ Taira အထွေထွေသုံး validator `iroha3d`; ကြည့်ပါ [`iroha3d` CLI ရည်ညွှန်းချက်](/my/reference/iroha3d-cli.md) အတင်းအကျပ် ချုပ်ဆိုထားမှုအတွက်ပါ။
