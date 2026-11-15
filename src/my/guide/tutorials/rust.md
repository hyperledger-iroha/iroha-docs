---
translation_locale: my
translation_source: /guide/tutorials/rust.md
translation_source_hash: 9d9848de91a85c84221efc39bc7dfb8443f5c50b448d336207c06efce3bc07e8
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Rust {#rust}

Rust အကောင်အထည်ဖော်မှုက အဓိက အလုပ်ခွင်မှာ တည်ရှိပြီး Iroha 3 ကုဒ်ဘေ့စ်နဲ့ အလုပ်လုပ်ဖို့ တိုက်ရိုက်ဆုံးနည်းလမ်းဖြစ်နေဆဲပါ။

## ဘာရမလဲ {#what-you-get}

Upstream repository မှာ လက်ရှိမှာ ဖော်ပြထားတာက-

- `iroha` Rust ဖောက်သည် ဆော့ဝဲအစီအစဉ်
- `iroha` CLI ကို အပြည့်အဝဆုံး ရည်ညွှန်းသော ဖောက်သည်အဖြစ်။
- SDK အလွှာမှာ အသုံးပြုတဲ့ မျှဝေထားသော ဒေတာပုံစံ၊ crypto နှင့် Norito ဆော့ဝဲပက်ကတ်များ

## အကြံပြုချက် {#recommended-starting-point}

ပရောဂျက်၏ လက်ရှိအခြေအနေအတွက် ရည်ညွှန်းအကောင်အထည်ဖော်မှု CLI နှင့် အလုပ်နယ်ပယ်ကိုယ်တိုင်မှ စတင်ပါ။

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

သိုလှောင်ရုံတွင် ထည့်ထားသော ပုံမှန် client ပြင်ဆင်သတ်မှတ်မှုဖြင့် အကိုးအကား client ကို လုပ်ဆောင်ပါ။

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list --all
```

## Taira ကို စမ်းကြည့်ပါ။ ဖတ်ရုံပဲ {#try-taira-read-only}

အလားတူ အလုပ်ခွင် စစ်ဆေးမှုကနေ အများပြည်သူ Taira ရောဂါရှာဖွေရေး အကူအညီကို စမ်းကြည့်ပါ။

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

လမ်းကြောင်းအဆင့် စစ်ဆေးမှုအတွက် Torii ရဲ့ JSON API ကို တိုက်ရိုက်အသုံးပြုပါ။

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

`taira.client.toml` ကို ဖန်တီးပြီးနောက် တူညီသော binary ဖြင့် `iroha taira account` ကို သုံး၍ အကောင့်တစ်ခုကို စတင်မှတ်ပုံတင်ပြီး ငွေဖြည့်နိုင်ကာ Taira သို့ ပုံမှန် လက်မှတ်ထိုးထားသော လယ်ဂျာ command များကို တင်သွင်းနိုင်သည်။ ၎င်းတို့အတွက် faucet မှ ငွေဖြည့်ထားသော အကောင့်နှင့် တိုက်ရိုက်လည်ပတ်နေသော testnet ရရှိနိုင်မှု လိုအပ်သဖြင့် သာမန် unit စမ်းသပ်မှုများနှင့် သီးခြားထားပါ။

## Rust Client Software Package ကို အသုံးပြုခြင်း {#using-the-rust-client-crate}

သင့်ကွန်ရက် အသုံးပြုတဲ့ Iroha Git revision ကို Pin လုပ်ပါ။

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

Rust အင်တာဖေ့စ်များကို လက်တွေ့အသုံးပြုပုံ၏ အပြည့်စုံဆုံး နမူနာများ လိုအပ်ပါက အောက်ပါတို့ကို စစ်ဆေးပါ။

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

လယ်ဂျာက စီမံခန့်ခွဲသော escrow လုပ်ငန်းစဉ်များအတွက် [ပိုင်ဆိုင်မှုများကို စံညွှန်ကြားချက်ဖြင့် ကြားခံထိန်းသိမ်းခြင်း](/my/blockchain/escrow.md#rust-sdk) ကို ကြည့်ပါ။ Rust ဒေတာမော်ဒယ်သည် လက်ရှိတွင် စျေးကွက် escrow၊ ယေဘုယျ ပိုင်ဆိုင်မှု lock များ၊ အခြေအနေအလိုက် escrow၊ မေးမြန်းချက်များနှင့် ဖြစ်ရပ်များအတွက် အပြည့်စုံဆုံး အမျိုးအစားသတ်မှတ် ပံ့ပိုးမှုကို ပေးသည်။

ဒေသခံ CLI အကူအညီ point-in-time data view ကို ပြန်လည်ဖန်တီးနိုင်သည်:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## မှတ်ချက်များ {#notes}

- CLI သည် လက်ရှိတွင် standalone software package doc များထက် ပိုမိုကောင်းမွန်သောအကာအကွယ်ပေးသည်။
- လုပ်ငန်းရှင်ပုံစံ စီးဆင်းမှုအတွက် CLI စာရွက်စာတမ်းဟာ လက်ရှိဆုံး အရင်းအမြစ်ပါ။
