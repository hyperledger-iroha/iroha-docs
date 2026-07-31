---
translation_locale: my
translation_source: /guide/tutorials/rust.md
translation_source_hash: 2044ca68337afb2663b4ab5fda63cb72b5c90ce850d028d09ef8569897e315cd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

နိုင်ငံခြားရေး Rust အကောင်အထည်ဖော်မှုသည် အဓိက လုပ်ငန်းခွင်တွင် တည်ရှိပြီး တိုက်ရိုက်ဆုံးဖြစ်နေဆဲဖြစ်သည်။
အလုပ်လုပ်နည်း Iroha 3 ကုဒ်အခြေခံချက်။

## ဘာရမလဲ {#what-you-get}

Upstream repository က လက်ရှိမှာ ဖော်ပြထားတာက-

- ကော်မတီ `iroha` Rust ဖောက်သည်သေတ္တာ
- ကော်မတီ `iroha` CLI အပြည့်အဝဆုံး ရည်ညွှန်းချက် ဖောက်သည်အဖြစ်
- မျှဝေထားတဲ့ ဒေတာပုံစံ၊ crypto နဲ့ Norito အင်းစိန်က သုံးတဲ့ သေတ္တာ SDK အလွှာ

## အကြံပြုချက် {#recommended-starting-point}

လက်ရှိအခြေအနေအတွက် ရည်ညွှန်းချက်နဲ့စပါ။ CLI နောက်ပြီး
အလုပ်ခွင်တစ်ခုတည်း:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

Check-in လုပ်ထားတဲ့ default client configuration ကို အသုံးပြုပြီး Reference Client ကို Run:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## စမ်းကြည့်ပါ။ Taira စာဖတ်ခြင်းသာ {#try-taira-read-only}

အလားတူ အလုပ်ခွင်က စစ်ဆေးမှုကနေ အများပြည်သူကို စမ်းကြည့်ပါ။ Taira ရောဂါရှာဖွေရေး အကူ:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

လမ်းကြောင်းအဆင့် စစ်ဆေးမှုအတွက် အသုံးပြုပါ Torii ဒါက JSON API တိုက်ရိုက်:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

သင်ဖန်တီးပြီးနောက်မှာ `taira.client.toml`, တူညီတဲ့ binary က Signed Canary ကို run လုပ်နိုင်တယ်
ဆန့်ကျင်တဲ့ အမိန့်များ Taira. သာမန် ယူနစ် စမ်းသပ်မှုတွေကနေ သီးခြားထားပါ။
သူတို့အတွက် faucet ငွေကြေးထောက်ပံ့တဲ့ အကောင့်နဲ့ live testnet ရှိဖို့ လိုအပ်ပါတယ်။

## အသုံးပြုခြင်း Rust ဖောက်သည်သေတ္တာ {#using-the-rust-client-crate}

Pin ကို Iroha သင့်ကွန်ရက်မှ အသုံးပြုသော Git revision:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

ဘယ်လိုလုပ်ပြီး Rust မျက်နှာပြင်များတွင် အသုံးပြုသည်
လေ့ကျင့်ခြင်း၊ စစ်ဆေးခြင်း

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

စာရင်းအင်းမှာ စီမံခန့်ခွဲတဲ့ အလှူခံ လုပ်ငန်းခွင်များအတွက်၊
[Native Asset Escrow](/my/blockchain/escrow.md#rust-sdk). နိုင်ငံခြားရေး Rust ဒေတာပုံစံ
လက်ရှိတွင် စျေးကွက်အမှတ်တံဆိပ်များအတွက် အပြည့်အစုံဆုံး အမျိုးအစားကာကွယ်မှုရှိသည်
အရင်းအမြစ်ပိတ်ခြင်း၊ အမည်မဲ့ ဂိုဏ်း၊ မေးမြန်းချက်များနှင့် ဖြစ်ရပ်များ။

ဒေသခံကို ပြန်လည်ဖန်တီးနိုင်တယ် CLI အကူအညီ snapshot ကို:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## မှတ်ချက်များ {#notes}

- နိုင်ငံခြားရေး CLI လက်ရှိမှာ standalone crate doc တွေထက် ပိုကောင်းမွန်တဲ့ ကွပ်ကဲမှုကို ပေးပါတယ်။
- Operator ပုံစံ စီးဆင်းမှုအတွက် CLI စာရွက်စာတမ်းဟာ နောက်ဆုံးပေါ် အရင်းအမြစ်ပါ။
