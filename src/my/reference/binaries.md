---
translation_locale: my
translation_source: /reference/binaries.md
translation_source_hash: 5a36877954bec97691e45697680bfbd6e0a7c7695e48a796bc7c9a41d4756644
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha ဘိုင်နရီများနှင့် အလုပ်လုပ်ခြင်း {#working-with-iroha-binaries}

Iroha 3 အော်ပရေတာရဲ့ အလုပ်ခွင်ဟာ အဓိက ဘိုင်နရီ လေးခုကို လှည့်ပတ်ပါတယ်။

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) ကို peer daemon ကို run လုပ်ဖို့
- `iroha3d_taira` ကို Canonical Taira validator launcher အတွက်။
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) အတွက် CLI နှင့် operator command များအတွက်
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) သော့များ၊ ဇာစ်မြစ်များ၊ ဒေသတွင်းကွန်ရက်များနှင့် ပရိုဖိုင်များအတွက်

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

အထက်ပိုင်း လုပ်ငန်းခွင် အသုံးပြုမှု `kagami localnet` နှင့် `kagami docker` ထုတ်လုပ်ရန် Docker Compose စစ်ဆေးထားတဲ့ ကုဒ်နဲ့ ကိုက်ညီတဲ့ ဖိုင်တွေ။ `hyperledger/iroha:dev` Image တွေကို ထုတ်ပေးထားတဲ့ ဖိုင်တွေနဲ့အတူ သုံးနိုင်ပါတယ်။

CLI ကို container တစ်ခုထဲ ထည့်ပေးပါ။

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Kagami ကို container တစ်ခုထဲထည့်ပါ။

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

peer startup အတွက် localnet ကိုဖန်တီးပြီး First Compose file ကိုလုပ်ပါ။

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## ဘယ် Binary ကို သုံးရမလဲ။ {#which-binary-should-i-use}

- `iroha3d` ကို အများပြည်သူ Taira validator release အပြင်မှာ peers တွေကိုစတင် (သို့) လည်ပတ်နေစဉ် အသုံးပြုပါ။
- `iroha3d_taira --sora` ကို Canonical Taira validator deployment အတွက်သာ အသုံးပြုပါ။ ဒါက Taira ရဲ့ Chain, Storage နဲ့ Runtime-signer profile တွေကို အားဖြည့်ပေးပါတယ်။
- `iroha` ကို အသုံးပြုပြီး စာရင်းအင်းစာအုပ်ကို မေးမြန်းရန်၊ ငွေပေးချေမှုတင်သွင်းရန် (သို့) Operator Endpoints တွေကို စစ်ဆေးရန် လိုအပ်ပါက။
- `kagami` ကို သော့များ၊ ဇီ၀ဖြစ်စဉ် မှတ်တမ်းများ၊ ပရိုဖိုင် ဘန်ဒယ်များ သို့မဟုတ် localnet အရင်းအမြစ်များ လိုအပ်ပါက သုံးပါ။
