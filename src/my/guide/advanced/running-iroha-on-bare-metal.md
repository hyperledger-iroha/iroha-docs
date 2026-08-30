---
translation_locale: my
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 648e69f2a572a0bb3e88919831774d21c1a17438b8bde742224a1457880539c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Bare Metal ပေါ်တွင် ပြေးဆွဲနေသည် {#running-iroha-on-bare-metal}

Docker Compose မှတစ်ဆင့်မဟုတ်ဘဲ host များတွင် peers ကိုတိုက်ရိုက် run လုပ်ချင်ပါက ဤ workflow ကိုအသုံးပြုပါ။ လက်ရှိ source tree က Kagami generator များကိုပေးသည်. ၎င်းတို့သည် matching genesis, peer config, client config နှင့် start/stop script များကိုရေးသားသည်။

## (၁) ဘိုင်နရီများ တည်ဆောက်ခြင်း {#_1-build-the-binaries}

Iroha လုပ်ငန်းခွင်ထက်:

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

ဒါကတော့:

- `target/release/iroha3d` တူညီသော daemon အတွက်
- `target/release/iroha` အတွက် CLI
- `target/release/kagami` key၊ genesis နဲ့ localnet မျိုးဆက်အတွက်

## (၂) ဒေသတွင်းကွန်ရက်တစ်ခု ဖန်တီးခြင်း {#_2-generate-a-local-network}

၄- peer Iroha 3 localnet ကိုဖန်တီးပါ။

```bash
target/release/kagami localnet --peers 4 --out-dir ./localnet
```

Output directory မှာ generated `genesis.json`, `genesis.signed.nrt`, peer `config.toml` files, `client.toml`, helper scripts နဲ့ အဲဒီ bundle အတွက် တိကျတဲ့ commands တွေပါတဲ့ generated `README.md` ကို ထည့်သွင်းထားပါတယ်။

## (၃) တန်းတူလူငယ်များ စတင်ခြင်း {#_3-start-peers}

Generated disposable localnet အတွက် generated script ကိုသုံးပါ။

```bash
./localnet/start.sh
```

systemd လို process manager ထဲမှာ peer တစ်ခုစီကို wired လုပ်ဖို့လိုတယ်ဆိုရင်, peer တစ်ခုချင်းအတွက် `./localnet/README.md` မှာ မှတ်တမ်းတင်ထားတဲ့ launch command ကိုသုံးပါ။ peer တစ်ခုတိုင်းရဲ့ `config.toml` private key၊ storage directory နဲ့ ports တွေကို သီးခြားထားလိုက်ပါ။

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
- တူညီတဲ့ လက်မှတ်ထိုးထားတဲ့ ဇီ၀ဖြစ်စဉ် ကုန်သွယ်မှု၊ ထိပ်ပိုင်းဆိုင်ရာ၊ ယုံကြည်မှုရှိတဲ့ တူညီသူတွေနဲ့ အတည်ပြုသူ PoPs ကို တူညီအောင်လုပ်ပါ။
- အခြားစက်များမှ peer ကို မရရှိနိုင်သည့်အခါသာ host-local interfaces များသို့ Bind listener address များကို ဆက်သွယ်ပါ။
- Torii exposure, basic auth, TLS နဲ့ rate limiting အတွက် reverse proxy (သို့) firewall ကိုသုံးပါ။
- မျိုးရိုးဗီဇ (သို့) သဘောတူညီမှု ထိပ်ပိုင်းဆိုင်ရာ အပြောင်းအလဲများကို တစ်ပြိုင်နက် ဖိုင် တည်းဖြတ်ခြင်းမဟုတ်ဘဲ ညှိနှိုင်းထားတဲ့ ရွှေ့ပြောင်းမှုများအဖြစ် ဆက်ဆံပါ။

Containerized ဒေသတွင်းဖွံ့ဖြိုးမှုအတွက် [Launch Iroha 3](../../get-started/launch-iroha.md) Docker Compose အလုပ်ဖြစ်စဉ်ကိုအသုံးပြုပါ။
