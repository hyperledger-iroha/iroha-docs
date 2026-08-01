---
translation_locale: my
translation_source: /guide/tutorials/rust.md
translation_source_hash: 2044ca68337afb2663b4ab5fda63cb72b5c90ce850d028d09ef8569897e315cd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

Rust အကောင်အထည်ဖော်မှုက အဓိက အလုပ်ခွင်မှာ တည်ရှိပြီး Iroha 3 ကုဒ်ဘေ့စ်နဲ့ အလုပ်လုပ်ဖို့ တိုက်ရိုက်ဆုံးနည်းလမ်းဖြစ်နေဆဲပါ။

## ဘာရမလဲ {#what-you-get}

Upstream repository မှာ လက်ရှိမှာ ဖော်ပြထားတာက-

- `iroha` Rust ဝယ်သူသေတ္တာ
- `iroha` CLI ကို အပြည့်အဝဆုံး ရည်ညွှန်းသော ဖောက်သည်အဖြစ်။
- SDK အလွှာမှာ အသုံးပြုတဲ့ မျှဝေထားတဲ့ ဒေတာပုံစံ၊ crypto နှင့် Norito သေတ္တာများ

## အကြံပြုချက် {#recommended-starting-point}

ပရိုဂျက်ရဲ့ လက်ရှိအခြေအနေအတွက် CLI ကို ရည်ညွှန်းချက်နဲ့ အလုပ်ခွင်ကို စတင်ပါ။

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

Reference client ကို check-in လုပ်ထားတဲ့ default client configuration နဲ့ run လုပ်ပါ။

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
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
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

`taira.client.toml` ကိုဖန်တီးပြီးနောက်၊ တူညီတဲ့ binary က Taira အပေါ် လက်မှတ်ထိုးထားတဲ့ canary commands တွေကို run လုပ်နိုင်သည်။ ဒါတွေကို သာမန် unit test တွေကနေ သီးခြားထားပါ။ အကြောင်းက ၎င်းတို့အတွက် faucet ငွေကြေးထောက်ပံ့တဲ့ အကောင့်တစ်ခုနဲ့ live testnet ရရှိမှုလိုအပ်လို့ပါ။

## Rust Client Crate ကို အသုံးပြုခြင်း {#using-the-rust-client-crate}

သင့်ကွန်ရက် အသုံးပြုတဲ့ Iroha Git revision ကို Pin လုပ်ပါ။

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

Rust မျက်နှာပြင်တွေကို လက်တွေ့မှာ အသုံးပြုပုံရဲ့ အပြည့်အစုံဆုံး နမူနာတွေ လိုအပ်ရင် စစ်ဆေးပါ-

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

စာရင်းအင်းမှာ စီမံခန့်ခွဲတဲ့ အလှူခံ လုပ်ငန်းခွင်များအတွက် ကြည့်ပါ။ [Native Asset Escrow](/my/blockchain/escrow.md#rust-sdk). နိုင်ငံတကာ Rust ဒေတာမော်ဒယ်မှာ လက်ရှိတွင် စျေးကွက်အမှတ်တံဆိပ်၊ ယေဘုယျအရင်းအမြစ်ပိတ်၊ အမည်မဲ့အမှတ်တံ ဆိပ်၊ မေးမြန်းချက်များအတွက် အပြည့်အစုံဆုံး အမျိုးအစားကာကွယ်မှုရှိသည်။ အဖြစ်အပျက်တွေပေါ့။

ဒေသတွင်း CLI အကူအညီ snapshot ကို ပြန်လည်ဖန်တီးနိုင်ပါတယ်:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## မှတ်ချက်များ {#notes}

- CLI သည် လက်ရှိတွင် standalone box doc များထက် ပိုမိုကောင်းမွန်သောအကာအကွယ်ပေးသည်။
- လုပ်ငန်းရှင်ပုံစံ စီးဆင်းမှုအတွက် CLI စာရွက်စာတမ်းဟာ လက်ရှိဆုံး အရင်းအမြစ်ပါ။
