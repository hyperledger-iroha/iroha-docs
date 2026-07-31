---
translation_locale: my
translation_source: /reference/binaries.md
translation_source_hash: fd9cefe7c0f5ee2f273a06b453d11d0e9bb896a35f872297276f5e052912a035
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# အလုပ်လုပ်ခြင်း Iroha ဘိုင်နရီများ {#working-with-iroha-binaries}

နိုင်ငံခြားရေး Iroha 3 Operator Workflow ဟာ အဓိက ဘိုင်နရီ သုံးခုကို လည်ပတ်ပါတယ်။

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) peer daemon ကို မောင်းနှင်တာအတွက်
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) အတွက် CLI အော်ပရေတာအမိန့်များ
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) သော့များ၊ ဇာစ်မြစ်များ၊ ဒေသတွင်းကွန်ရက်များနှင့် ပရိုဖိုင်များအတွက်

## အရင်းအမြစ်မှ တည်ဆောက်ခြင်း {#build-from-source}

Upstream workspace root ကနေ:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

အဲဒီနောက်မှာ release binaries တွေကို `target/release/`.

အမိန့်မျက်နှာပြင်ကို စစ်ဆေးရန်:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## Repository မှ တိုက်ရိုက် Run {#run-directly-from-the-repository}

တစ်ကမ္ဘာလုံးမှာ ဘာကိုမှ မတပ်ချင်ရင် `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker ရုပ်ပုံ {#docker-image}

အထက်ပိုင်း လုပ်ငန်းခွင် အသုံးပြုမှု `kagami localnet` နှင့် `kagami docker` ထုတ်လုပ်ရန်
Docker Compose စစ်ဆေးထားတဲ့ ကုဒ်နဲ့ ကိုက်ညီတဲ့ ဖိုင်တွေပေါ့။ `hyperledger/iroha:dev`
Image တွေကို ထုတ်ပေးထားတဲ့ ဖိုင်တွေနဲ့အတူ သုံးနိုင်ပါတယ်။

Run ကို CLI အိုးထဲတွင်

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

ပြေးပါ Kagami အိုးထဲတွင်

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

peer startup အတွက် localnet ကိုဖန်တီးပြီး First Compose file ကိုနှိပ်ပါ။

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## ဘယ် Binary ကို သုံးရမလဲ။ {#which-binary-should-i-use}

- အသုံးပြုခြင်း `irohad` သင်ဟာ အဖော်တွေကို စပြီး လုပ်ကိုင်နေစဉ် (သို့) လည်ပတ်နေချိန်မှာ
- အသုံးပြုခြင်း `iroha` စာရင်းအင်းကို မေးမြန်းရန်၊ ငွေပေးချေမှုတင်သွင်းရန် (သို့) Operator Endpoints တွေကို စစ်ဆေးရန် လိုအပ်ပါက
- အသုံးပြုခြင်း `kagami` သော့တွေ၊ Genesis Manifesto တွေ၊ Profile Bundles တွေ ဒါမှမဟုတ် Localnet အရင်းအမြစ်တွေ လိုအပ်တဲ့အခါမှာ
