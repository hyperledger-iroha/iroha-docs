---
translation_locale: my
translation_source: /reference/binaries.md
translation_source_hash: 1bf3f4697e44b3c8ef571eb9e5c0e301a1acbf76aa1c0666b3cd86e108bba6bf
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha ဘိုင်နရီများနှင့် အလုပ်လုပ်ခြင်း {#working-with-iroha-binaries}

Iroha 3 အော်ပရေတာရဲ့ အလုပ်ခွင်ဟာ အဓိက ဘိုင်နရီ လေးခုကို လှည့်ပတ်ပါတယ်။

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) Network peer daemon ကို run လုပ်ဖို့
- `iroha3d_taira` အတွက် Single Protocol Standard Taira validator launcher အတွက်
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) အတွက် CLI operator command တွေနဲ့
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) Key များ၊ blockchain genesis များ၊ localnets များနှင့် profile များအတွက်

## အရင်းအမြစ်မှ တည်ဆောက်ခြင်း {#build-from-source}

Upstream workspace root ကနေ:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

`target/release/` သို့ ပြန်လည်ဖြန့်ချိမှု ဘိုင်နရီများ ရရှိနိုင်ပါသည်။

အမိန့်မျက်နှာပြင်ကို စစ်ဆေးရန်:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## Repository မှ တိုက်ရိုက် Run {#run-directly-from-the-repository}

တစ်ကမ္ဘာလုံးမှာ ဘာကိုမှ မတပ်ချင်ဘူးဆိုရင် `cargo run` ကိုသုံးပါ။

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker ဓာတ်ပုံ {#docker-image}

တူညီသော ရင်းမြစ်ဗားရှင်းမှ ဘိုင်နရီဖိုင်များကို တည်ဆောက်ပြီး Docker တွင် အတည်ပြုသူ လေးခုကို စတင်ရန် [လွှတ်တင်ခြင်း Iroha 3](/my/get-started/launch-iroha.md) လမ်းညွှန်ကို လိုက်နာပါ။

## ဘယ် Binary ကို သုံးရမလဲ။ {#which-binary-should-i-use}

- အများပြည်သူ Taira validator release အပြင်မှာ network peers တွေကို start လုပ်နေစဉ် (သို့) operating လုပ်နေတဲ့အခါ `iroha3d` ကို အသုံးပြုပါ။
- `iroha3d_taira --sora` ကို ပရိုတိုကော စံတစ်ခုတည်းသော Taira validator deployment အတွက်သာ အသုံးပြုပါ။ ၎င်းသည် Taira ၏ ချိတ်ဆက်မှု၊ သိုလှောင်ခြင်းနှင့် runtime-signer profile များကို အားဖြည့်စေသည်။
- `iroha` ကို အသုံးပြုပြီး blockchain ledger ကို မေးမြန်းရန်၊ ငွေပေးချေမှု တင်ပြရန် သို့မဟုတ် operator API အဆုံးမှတ်များကို စစ်ဆေးရန် လိုအပ်ပါက။
- `kagami` ကို သော့တွေ၊ blockchain genesis နည်းပညာ manifesto တွေ၊ profile bundles တွေ ဒါမှမဟုတ် localnet အရင်းအမြစ်တွေ လိုအပ်တဲ့အခါ သုံးပါ။
