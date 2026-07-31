---
translation_locale: my
translation_source: /help/deployment-issues.md
translation_source_hash: 6f35ac59053e312f56a716810c8f0b625752500d1fc64b27d93cbd8317b6cc19
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ပြဿနာဖြေရှင်းခြင်း {#troubleshooting-deployment-issues}

ဤအပိုဒ်သည် ပြဿနာဖြေရှင်းနည်းများအတွက် အကြံပြုချက်များကိုပေးသည်။ Iroha 3 စေလွှတ်မှုတွေရှိတယ်ဆိုရင်
သင်ခံစားနေရတာက ဒီမှာ ဖော်ပြထားတာမဟုတ်ဘူး။
ကျွန်ုပ်တို့အား ဆက်သွယ်ရန် [Telegram ကို](https://t.me/hyperledgeriroha).

## ဖန်တီးထားတဲ့ လက်ရာတွေနဲ့ စလိုက်ပါ {#start-with-generated-artifacts}

ဒေသတွင်းနဲ့ စမ်းသပ်မှု နေရာချထားမှုအတွက် Kagami ဒီအစား
လက်နဲ့ရေးသားထားတဲ့ အချိတ်အဆက် ဖိုင်များ:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

ဖန်တီးထားတဲ့ directory မှာ peer configs, genesis material, start တွေပါဝင်ပါတယ်။
စာသားများနှင့် README အတွက် Iroha 3 ဆောက်လုပ်ရေး လိုင်း။

## Peer က မစဘူး {#peer-does-not-start}

ဒီပစ္စည်းတွေကို အရင်စစ်ကြည့်ပါ။

- `irohad --config <path>` တူညီသူရဲ့ အမှတ်တွေ TOML မှတ်တမ်းတင်ပါ။
- `public_key` နှင့် `private_key` peer config မှာ တူညီတဲ့ key ကိုပိုင်ဆိုင်တယ်
  စုံတွဲပါ။
- `genesis.public_key` Genesis Transaction ကို လက်မှတ်ရေးထိုးဖို့ အသုံးပြုခဲ့တဲ့ သော့နဲ့ ကိုက်ညီပါတယ်။
- validator peer identities အသုံးပြုခြင်း BLS- ပုံမှန် သော့တွေ၊ `trusted_peers_pop`
  ဒေသတွင်း သော့နဲ့ ယုံကြည်ရတဲ့ အဖော်တွေအတွက် ပိုင်ဆိုင်မှု သက်သေခံ စာရင်းတွေ ပါဝင်ပါတယ်။
- ဆိပ်ကမ်းများ Torii နှင့် P2P အခြားလုပ်ငန်းစဉ်တစ်ခုနဲ့ ချည်နှောင်ထားခြင်း မရှိသေးပါ။
- ကော်မတီ Kura store directory ကို chain တစ်ခုတည်းနဲ့ဆိုင်ပြီး copy လုပ်ထားတာမဟုတ်ဘူး။
  မတူတဲ့ ကွန်ရက် ပရိုဖိုင်ပါ။

Daemon ကို read များစွာသောအခါ config tracing ကိုအသုံးပြုပါ TOML အလွှာ:

```bash
cargo run --bin irohad -- --config ./config.toml --trace-config
```

## Docker နောက်ပြီး Composite {#docker-and-compose}

Generate Current မှပေါင်းစပ်ခြင်း Kagami localnet output ကို command-line ကို
အငြင်းပွားချက်များနှင့် ဖိုင်များကို check-out code နှင့် ကိုက်ညီသည်

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

compose deployment ကိုစတင်ပြီးနောက် stalks လုပ်ရင် daemon log တွေကို စစ်ဆေးပါ

- မညီမညီ `chain`
- အခြား genesis transaction (သို့) manifest ကိုသုံးတဲ့ peer တစ်ခု
- ကြော်ငြာ P2P container network အတွင်းမှာသာ အလုပ်လုပ်တဲ့ address တွေ
- ဒေသတွင်းပမာဏကို ပြန်လည်သုံးစွဲခြင်း Genesis ပြန်လည်ပြုပြင်ပြီးနောက်

အသစ်ဖြစ်စဉ်ကို စမ်းသပ်တဲ့အခါ အဟောင်းတွေကို ဖယ်ရှားပါ။ Kura ပြန်လည်စတင်ခြင်းမတိုင်မီ Volume များ
ဘလော့ခ်ဟောင်းကို အသစ်တစ်ခုနဲ့ သိုလှောင်ထားခြင်းက ပြန်လည်ကစားမှုကို ကျရှုံးစေမှာပါ။

## Kubernetes {#kubernetes}

Kubernetes အတွက် validator တစ်ခုစီကို stateful အခြေခံအဆောက်အအုံအဖြစ် සලකාကြည့်ပါ။

- တူညီသူတိုင်းအတွက် တည်ငြိမ်တဲ့ ကိုယ်စားလှယ်လက္ခဏာ သော့နဲ့ တည်ငြိမ်နေတဲ့ ပမာဏကို ပေးပါ။
- ပွင့်လင်းမြင်သာမှု P2P cluster ထဲက အခြား peers တွေ ဖြေရှင်းနိုင်မယ့် addresses များ
- configuration နှင့် genesis ဖိုင်များကို roll-out အတွက်မပြောင်းလဲနိုင်သော config အဖြစ်တပ်ဆင်ပါ။
- ဂင်းနစ် (သို့) ထိပ်ပိုင်းဆိုင်ရာ အပြောင်းအလဲအားလုံးကို အလိုလိုမဟုတ်ဘဲ ကြံစည်ပြီး ဖြန့်ချိပါ။
  config-map ကို update လုပ်ပေးရန်

Capsule တစ်ခုကို အကြိမ်ကြိမ် ပြန်လည်စတင်ပါက capsule ထဲက rendered config ကို
မျှော်မှန်းချက် [`peer.template.toml`](/my/reference/peer-config/index.md#template) နှင့်
တူညီသူက အဟောင်းကို ပြန်လည်ကစားနေလားဆိုတာ စစ်ဆေးပါ။ Kura ဒေတာ။

## Sora profile ကို {#sora-profile}

Iroha 3 အသုံးပြုတဲ့ တပ်ဆင်မှု Nexus, SoraFS, (သို့) multi-lane စီးဆင်းမှု စတင်သင့်သည်
Sora profile ရှိ daemon က:

```bash
cargo run --bin irohad -- --config ./config.toml --sora
```

ကွန်ရက်တစ်ခုတည်းရှိ validator များအကြားမှာ တူညီသော profile ကို တစ်ချိန်လုံးအသုံးပြုပါ။
