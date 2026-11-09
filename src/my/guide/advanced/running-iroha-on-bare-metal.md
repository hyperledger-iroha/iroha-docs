---
translation_locale: my
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 648e69f2a572a0bb3e88919831774d21c1a17438b8bde742224a1457880539c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Bare Metal ပေါ်တွင် ပြေးဆွဲနေသည် {#running-iroha-on-bare-metal}

Docker Compose မှတစ်ဆင့် မဟုတ်ဘဲ host များပေါ်တွင် peer များကို တိုက်ရိုက်လုပ်ဆောင်လိုသည့်အခါ ဤလုပ်ငန်းစဉ်ကို သုံးပါ။ လက်ရှိကုဒ်အစုတွင် ကိုက်ညီသော genesis၊ peer ပြင်ဆင်သတ်မှတ်ချက်များ၊ client ပြင်ဆင်သတ်မှတ်ချက်နှင့် စတင်/ရပ်တန့် script များကို ရေးထုတ်ပေးသော Kagami ထုတ်လုပ်ကိရိယာများ ပါဝင်သည်။

## (၁) ဘိုင်နရီများ တည်ဆောက်ခြင်း {#_1-build-the-binaries}

Iroha လုပ်ငန်းခွင်ထက်:

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

ဒါကတော့:

- peer ၏ နောက်ခံဝန်ဆောင်မှုအတွက် `target/release/iroha3d`
- `target/release/iroha` အတွက် CLI
- `target/release/kagami` key, blockchain genesis နဲ့ localnet မျိုးဆက်အတွက်

## (၂) ဒေသတွင်းကွန်ရက်တစ်ခု ဖန်တီးခြင်း {#_2-generate-a-local-network}

peer လေးခုပါသော Iroha 3 စက်တွင်းကွန်ရက်ကို ထုတ်လုပ်ပါ။

```bash
target/release/kagami localnet --peers 4 --out-dir ./localnet
```

ရလဒ်ဖိုင်တွဲတွင် ထုတ်လုပ်ထားသော `genesis.json`၊ `genesis.signed.nrt`၊ peer များ၏ `config.toml` ဖိုင်များ၊ `client.toml`၊ အကူ script များနှင့် ထိုအစုအတွက် တိကျသော command များပါသည့် ထုတ်လုပ်ထားသော `README.md` ပါဝင်သည်။

## (၃) ကွန်ရက်တူညီသူများကို စတင်ပါ။ {#_3-start-peers}

ထုတ်လုပ်ထားသော စွန့်ပစ်အစားထိုးနိုင်သည့် စက်တွင်းကွန်ရက်အတွက် ထုတ်လုပ်ထားသော script ကို သုံးပါ။

```bash
./localnet/start.sh
```

peer တစ်ခုချင်းကို systemd ကဲ့သို့ လုပ်ငန်းစဉ်စီမံခန့်ခွဲကိရိယာနှင့် ချိတ်ဆက်ရန် လိုအပ်ပါက peer တစ်ခုစီအတွက် `./localnet/README.md` တွင် မှတ်တမ်းတင်ထားသော စတင် command ကို သုံးပါ။ peer တစ်ခုစီ၏ `config.toml`၊ ကိုယ်ပိုင်ကီး၊ သိုလှောင်ဖိုင်တွဲနှင့် port များကို သီးခြားထားပါ။

## (၄) ကွန်ရက်ကို စီမံခန့်ခွဲခြင်း {#_4-operate-the-network}

ထုတ်လုပ်ထားသော client ပြင်ဆင်သတ်မှတ်ချက်ကို သုံးပါ။

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

ထုတ်လုပ်ထားသော စက်တွင်းကွန်ရက်ကို အောက်ပါအတိုင်း ရပ်တန့်ပါ။

```bash
./localnet/stop.sh
```

## (၅) ထုတ်ကုန် မှတ်စုများ {#_5-production-notes}

- ထုတ်လုပ်မှုအတွက် ကိုယ်ပိုင် သော့သစ်တွေ ထုတ်ပြီး သိုလှောင်ရုံအပြင်မှာ သိမ်းပါ။
- peer အားလုံးတွင် တူညီသော လက်မှတ်ထိုးထားသည့် genesis transaction၊ ချိတ်ဆက်ဖွဲ့စည်းပုံ၊ ယုံကြည်ရသော peer များနှင့် validator များ၏ PoPs ရှိစေပါ။
- peer ကို အခြားစက်များမှ မဆက်သွယ်သင့်သည့်အခါမှသာ နားထောင်လိပ်စာများကို host စက်တွင်း အင်တာဖေ့စ်များနှင့် ချိတ်ပါ။
- Torii exposure, basic auth, TLS နဲ့ rate limiting အတွက် reverse proxy (သို့) firewall ကိုသုံးပါ။
- ဘလော့ခ်ချ်ဖြစ်စဉ် (သို့) သဘောတူညီမှု ထိပ်ပိုင်းဆိုင်ရာ အပြောင်းအလဲများကို တစ်ပြိုင်နက် ဖိုင် တည်းဖြတ်ခြင်းမဟုတ်ဘဲ ညှိနှိုင်းထားတဲ့ ရွှေ့ပြောင်းမှုများအဖြစ် ရှုမြင်ပါ။

Containerized ဒေသတွင်းဖွံ့ဖြိုးမှုအတွက် [လွှတ်တင်ခြင်း Iroha 3](../../get-started/launch-iroha.md) Docker Compose အလုပ်ဖြစ်စဉ်ကိုအသုံးပြုပါ။
