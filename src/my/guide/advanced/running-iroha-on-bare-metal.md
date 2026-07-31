---
translation_locale: my
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 77780600fa59ba353e2aa79fb339adb6a02f7ac731e04cd0d5f51821ec54e794
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ပြေးနေခြင်း Iroha Bare Metal ပေါ်မှာ {#running-iroha-on-bare-metal}

host တွေမှာ peers ကို တိုက်ရိုက် run လုပ်ချင်တဲ့အခါ ဒီ workflow ကို သုံးပါ။
ဖြတ်သန်း Docker Compose. လက်ရှိ အရင်းအမြစ် သစ်ပင်က Kagami ထုတ်ကုန်များ
ကိုက်ညီသော genesis, peer config များ၊ client config များနှင့် start/stop script များကိုရေးသားပါ။

## (၁) ဘိုင်နရီများ တည်ဆောက်ခြင်း {#_1-build-the-binaries}

မြစ်ပေါ်က Iroha လုပ်ငန်းခွင်:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

အဲဒါက:

- `target/release/irohad` တူညီတဲ့ နတ်ဆိုးအတွက်
- `target/release/iroha` အတွက် CLI
- `target/release/kagami` key, genesis နဲ့ localnet မျိုးဆက်အတွက်

## (၂) ဒေသတွင်းကွန်ရက်တစ်ခု ဖန်တီးခြင်း {#_2-generate-a-local-network}

၄- peer ကို ဖန်တီးပါ။ Iroha 3 localnet:

```bash
target/release/kagami localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

output directory မှာ generated `genesis.json`,
`genesis.signed.nrt`, တူညီသူ `config.toml` ဖိုင်များ၊ `client.toml`, အကူအညီပေးရေး စာသားတွေ၊
ပြီးတော့ ထုတ်လုပ်ထားတဲ့ `README.md` အဲဒီပုံးအတွက် တိကျတဲ့ ညွှန်ကြားချက်တွေနဲ့ပါ။

## (၃) အဖော်များ စလုပ်ခြင်း {#_3-start-peers}

Generated disposable localnet အတွက် generated script ကို အသုံးပြုပါ။

```bash
./localnet/start.sh
```

သင့်ရဲ့ peer တစ်ခုစီကို process manager ထဲမှာ wire လုပ်ဖို့လိုတယ်ဆိုရင် systemd, အသုံးပြုခြင်း
စေလွှတ်မှု အမိန့်ကို မှတ်တမ်းတင် `./localnet/README.md` တူညီတဲ့လူတိုင်းအတွက်ပါ။
တူညီသူ `config.toml`, ပုဂ္ဂလိက သော့၊ သိုလှောင်စာရင်းနဲ့ ဆိပ်ကမ်းတွေကို သီးခြားခွဲထားတယ်။

## (၄) ကွန်ရက်ကို စီမံခန့်ခွဲခြင်း {#_4-operate-the-network}

Generated Client Config ကို အသုံးပြုပါ

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

Generated localnet ကို:

```bash
./localnet/stop.sh
```

## 5. ထုတ်ကုန် မှတ်စုများ {#_5-production-notes}

- ထုတ်လုပ်ရေးအတွက် သွင်းချက်အသစ်တွေကို ထုတ်လုပ်ပြီး
  သိုလှောင်ခန်း။
- တူညီတဲ့ လက်မှတ်ရေးထိုးထားတဲ့ ဇီ၀ဖြစ်စဉ်၊ ထိပ်ပိုင်းဆိုင်ရာ ကိစ္စရပ်တွေ အားလုံးကို သဘောတူအောင်လုပ်ပါ။
  ယုံကြည်ရတဲ့ အဖော်တွေ၊ သက်သေခံ PoPs.
- အနားယူသူရဲ့ စကားဝှက်တွေကို host-local interfaces တွေကို peer က လုပ်သင့်တဲ့ အချိန်မှာပဲ ချိတ်ဆက်ပေးပါ။
  အခြားစက်တွေကနေ မရောက်နိုင်ပါ။
- Reverse proxy (သို့) firewall ကို အသုံးပြုပါ။ Torii ထိတွေ့မှု၊ အခြေခံအလောင်း TLS, ငွေကြေးနှုန်း
  အကန့်အသတ်ပေးတယ်။
- ဘီဘီစီ (သို့) သဘောတူညီမှု ထိပ်ပိုင်းဆိုင်ရာ အပြောင်းအလဲတွေကို ညှိနှိုင်းထားတဲ့ ရွှေ့ပြောင်းမှုအဖြစ် ဆက်ဆံပါ။
  တစ်တူတည်းသော ဖိုင် တည်းဖြတ်မှု။

containerized ဒေသတွင်းဖွံ့ဖြိုးမှုအတွက် [လွှတ်တင်ခြင်း Iroha 3](../../get-started/launch-iroha.md)
Docker Compose အလုပ်ဖြစ်စဉ်။
