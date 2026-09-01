---
translation_locale: my
translation_source: /guide/tutorials/rust.md
translation_source_hash: 98b0c3a193c6dfe8b266bcc498d7016426cf2f838a7bf7ebfbef145ffdcc7944
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

Rust အကောင်အထည်ဖော်မှုက အဓိက အလုပ်ခွင်မှာ တည်ရှိပြီး Iroha 3 ကုဒ်ဘေ့စ်နဲ့ အလုပ်လုပ်ဖို့ တိုက်ရိုက်ဆုံးနည်းလမ်းဖြစ်နေဆဲပါ။

## ဘာရမလဲ {#what-you-get}

Upstream repository မှာ လက်ရှိမှာ ဖော်ပြထားတာက-

- `iroha` Rust ဖောက်သည် ဆော့ဝဲအစီအစဉ်
- `iroha` CLI ကို အပြည့်အဝဆုံး ရည်ညွှန်းသော ဖောက်သည်အဖြစ်။
- SDK အလွှာမှာ အသုံးပြုတဲ့ မျှဝေထားသော ဒေတာပုံစံ၊ crypto နှင့် Norito ဆော့ဝဲပက်ကတ်များ

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
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

`taira.client.toml` ကိုဖန်တီးပြီးနောက် တူညီတဲ့ binary က Taira အပေါ် လက်မှတ်ထိုးထားတဲ့ canary commands တွေကို run လုပ်နိုင်ပါတယ်။ testnet မှထောက်ပံ့တဲ့ account နဲ့ live testnet ရရှိနိုင်မှုလိုအပ်တာကြောင့် သာမန် unit testing တွေကနေ သီးခြားထားပါ။

## Rust Client Software Package ကို အသုံးပြုခြင်း {#using-the-rust-client-crate}

သင့်ကွန်ရက် အသုံးပြုတဲ့ Iroha Git revision ကို Pin လုပ်ပါ။

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

Rust မျက်နှာပြင်တွေကို လက်တွေ့မှာ အသုံးပြုပုံရဲ့ အပြည့်အစုံဆုံး နမူနာတွေ လိုအပ်ရင် စစ်ဆေးပါ-

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

blockchain ledger မှစီမံခန့်ခွဲသော escrow အလုပ်ဖြစ်စဉ်များအတွက် [Native Asset Escrow](/my/blockchain/escrow.md#rust-sdk) ကိုကြည့်ပါ။ Rust ဒေတာမော်ဒယ်သည် လက်ရှိတွင်စျေးကွက် escrow၊ ယေဘုယျအရင်းအမြစ် lock များ, အမည်မသိ escrow, မေးမြန်းချက်များနှင့်ဖြစ်ရပ်များအတွက်အပြည့်အဝရိုက်ကူးထားသည့်ကာကွယ်မှုတစ်ခုဖြစ်သည်။

ဒေသခံ CLI အကူအညီ point-in-time data view ကို ပြန်လည်ဖန်တီးနိုင်သည်:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## မှတ်ချက်များ {#notes}

- CLI သည် လက်ရှိတွင် standalone software package doc များထက် ပိုမိုကောင်းမွန်သောအကာအကွယ်ပေးသည်။
- လုပ်ငန်းရှင်ပုံစံ စီးဆင်းမှုအတွက် CLI စာရွက်စာတမ်းဟာ လက်ရှိဆုံး အရင်းအမြစ်ပါ။
