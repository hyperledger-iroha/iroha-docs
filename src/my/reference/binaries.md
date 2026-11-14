---
translation_locale: my
translation_source: /reference/binaries.md
translation_source_hash: 75848623e735abc80326f9ebda6f74ab438b67eaeddeacdd4d8c5509856a999e
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Iroha ဘိုင်နရီများနှင့် အလုပ်လုပ်ခြင်း {#working-with-iroha-binaries}

Iroha 3 အော်ပရေတာရဲ့ အလုပ်ခွင်ဟာ အဓိက ဘိုင်နရီ လေးခုကို လှည့်ပတ်ပါတယ်။

- အဆင့်တူနိုဒ် နောက်ခံဝန်ဆောင်မှုကို လည်ပတ်ရန် [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/irohad)
- Taira အတည်ပြုသူအတွက် စံသတ်မှတ် စတင်ကိရိယာဖြစ်သော `iroha3d_taira`
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli) အတွက် CLI operator command တွေနဲ့
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_kagami) Key များ၊ blockchain genesis များ၊ localnets များနှင့် profile များအတွက်

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

## ရင်းမြစ်ကုဒ်သိုလှောင်ရာမှ တိုက်ရိုက်လုပ်ဆောင်ခြင်း {#run-directly-from-the-repository}

တစ်ကမ္ဘာလုံးမှာ ဘာကိုမှ မတပ်ချင်ဘူးဆိုရင် `cargo run` ကိုသုံးပါ။

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker ဓာတ်ပုံ {#docker-image}

မူရင်းလုပ်ငန်းခွင်ရှိ ရင်းမြစ်ကုဒ်နှင့် ကိုက်ညီသော Docker Compose ဖိုင်များ ထုတ်လုပ်ရန် `kagami localnet generate` နှင့် `kagami docker` ကို အသုံးပြုသည်။ ထုတ်လုပ်ထားသော ထိုဖိုင်များနှင့် `hyperledger/iroha:dev` အဆင်သင့်ဆော့ဖ်ဝဲပုံရိပ်ကို တွဲသုံးနိုင်သည်။

CLI ကို container တစ်ခုထဲ ထည့်ပေးပါ။

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Kagami ကို container တစ်ခုထဲထည့်ပါ။

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

နိုဒ်ကို စတင်ရန် ဒေသတွင်းကွန်ရက်နှင့် Compose ဖိုင်ကို ဦးစွာ ဖန်တီးပါ။

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## ဘယ် Binary ကို သုံးရမလဲ။ {#which-binary-should-i-use}

- အများသုံး Taira အတည်ပြုနိုဒ် ထုတ်ဝေမှုအပြင်ဘက်တွင် နိုဒ်များကို စတင်ခြင်း သို့မဟုတ် လည်ပတ်ခြင်းအတွက် `iroha3d` ကို အသုံးပြုပါ။
- စံသတ်မှတ် Taira အတည်ပြုနိုဒ် ဖြန့်ချိတပ်ဆင်မှုအတွက်သာ `iroha3d_taira --sora` ကို အသုံးပြုပါ။ ၎င်းသည် Taira ၏ ဘလော့ခ်ချိန်း၊ သိုလှောင်မှုနှင့် လည်ပတ်ချိန်လက်မှတ်ထိုးသူ ပရိုဖိုင်တို့ကို မဖြစ်မနေလိုက်နာစေသည်။
- `iroha` ကို အသုံးပြုပြီး blockchain ledger ကို မေးမြန်းရန်၊ ငွေပေးချေမှု တင်ပြရန် သို့မဟုတ် operator API အဆုံးမှတ်များကို စစ်ဆေးရန် လိုအပ်ပါက။
- ကီးများ၊ genesis manifest များ၊ ပရိုဖိုင်အစုများ သို့မဟုတ် localnet ဒေတာများ လိုအပ်လျှင် `kagami` ကို အသုံးပြုပါ။
