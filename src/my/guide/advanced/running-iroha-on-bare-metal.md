---
translation_locale: my
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 648e69f2a572a0bb3e88919831774d21c1a17438b8bde742224a1457880539c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Bare Metal ပေါ်တွင် ပြေးဆွဲနေသည် {#running-iroha-on-bare-metal}

Docker Compose မှတစ်ဆင့်အစား host များတွင် network peers ကို တိုက်ရိုက် run လုပ်ချင်ပါက ဤ workflow ကိုအသုံးပြုပါ။ လက်ရှိ source tree သည် Kagami generator များကိုပေးသည်၊ ၎င်းတို့သည် blockchain genesis, network peer config, client config နှင့် start/stop scripts တို့ကိုရေးသားသည်။

## (၁) ဘိုင်နရီများ တည်ဆောက်ခြင်း {#_1-build-the-binaries}

Iroha လုပ်ငန်းခွင်ထက်:

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

ဒါကတော့:

- `target/release/iroha3d` ကွန်ရက် peer daemon အတွက်
- `target/release/iroha` အတွက် CLI
- `target/release/kagami` key, blockchain genesis နဲ့ localnet မျိုးဆက်အတွက်

## (၂) ဒေသတွင်းကွန်ရက်တစ်ခု ဖန်တီးခြင်း {#_2-generate-a-local-network}

၄- peer Iroha 3 localnet ကိုဖန်တီးပါ။

```bash
target/release/kagami localnet --peers 4 --out-dir ./localnet
```

Output directory မှာ generated `genesis.json`, `genesis.signed.nrt`, network peer `config.toml` files, `client.toml`, helper scripts နဲ့ အဲဒီ bundle အတွက် တိကျတဲ့ command တွေပါတဲ့ generated `README.md` ကို ထည့်ထားပါတယ်။

## (၃) ကွန်ရက်တူညီသူများကို စတင်ပါ။ {#_3-start-peers}

Generated disposable localnet အတွက် generated script ကိုသုံးပါ။

```bash
./localnet/start.sh
```

Network peer တစ်ခုစီကို systemd ကဲ့သို့သော Process Manager ထဲသို့ wired လုပ်ရန်လိုအပ်ပါက, network peer တစ်ခုချင်းအတွက် `./localnet/README.md` တွင် မှတ်တမ်းတင်ထားသည့် launch command ကိုအသုံးပြုပါ။ network peerတစ်ခုစီ၏ `config.toml`၊ private key၊ storage directory နှင့် port များကို သီးခြားထားပါ။

## (၄) ကွန်ရက်ကို စီမံခန့်ခွဲခြင်း {#_4-operate-the-network}

Generated client configuration ကို အသုံးပြုပါ

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

Generated localnet ကို:

```bash
./localnet/stop.sh
```

## (၅) ထုတ်ကုန် မှတ်စုများ {#_5-production-notes}

- ထုတ်လုပ်မှုအတွက် ကိုယ်ပိုင် သော့သစ်တွေ ထုတ်ပြီး သိုလှောင်ရုံအပြင်မှာ သိမ်းပါ။
- လက်မှတ်ရေးထိုးထားတဲ့ blockchain genesis transaction, topology, trusted network peers နဲ့ validator PoPs ကိုတော့ ကွန်ရက်ရဲ့ peer တွေအားလုံး သဘောတူအောင်လုပ်ပါ။
- Network peer ကို တခြားစက်တွေကနေ မရောက်ရှိသင့်တဲ့ အချိန်မှာသာ host-local interfaces တွေကို Bind listener address တွေကို ဆက်သွယ်ပေးပါ။
- Torii exposure, basic auth, TLS နဲ့ rate limiting အတွက် reverse proxy (သို့) firewall ကိုသုံးပါ။
- ဘလော့ခ်ချ်ဖြစ်စဉ် (သို့) သဘောတူညီမှု ထိပ်ပိုင်းဆိုင်ရာ အပြောင်းအလဲများကို တစ်ပြိုင်နက် ဖိုင် တည်းဖြတ်ခြင်းမဟုတ်ဘဲ ညှိနှိုင်းထားတဲ့ ရွှေ့ပြောင်းမှုများအဖြစ် ရှုမြင်ပါ။

Containerized ဒေသတွင်းဖွံ့ဖြိုးမှုအတွက် [လွှတ်တင်ခြင်း Iroha 3](../../get-started/launch-iroha.md) Docker Compose အလုပ်ဖြစ်စဉ်ကိုအသုံးပြုပါ။
