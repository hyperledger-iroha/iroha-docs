---
translation_locale: my
translation_source: /get-started/install-iroha.md
translation_source_hash: 49e1a29243151fec1ada2729c315378455a8502811e1ae124e5917a88d59b55d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 3 ကို တပ်ဆင်ပါ။ {#install-iroha-3}

ဤစာမျက်နှာသည် Iroha 3 toolchain နှင့် upstream `hyperledger-iroha/iroha` workspace ကိုအသုံးပြုသော binaries များအတွက်လက်ရှိ install workflow ကိုဖော်ပြသည်။

## (၁) ကြိုတင်လိုအပ်ချက်များ {#_1-prerequisites}

ဒါတွေကို အရင်တပ်ပါ။

- [rustup](https://www.rust-lang.org/tools/install) ဆိုတော့ ပိတ်ထားတဲ့ `rust-toolchain.toml` toolchain (`1.93.1`) ကို အလိုအလျောက် တပ်ဆင်ထားတယ်။
- `git`
- Docker နှင့် Docker Compose တို့ကို ရွေးချယ်၍ ဒေသတွင်း multi-peer quickstart အတွက်။

## (၂) Workspace ကို clone လုပ်ပါ။ {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## (၃) အလုပ်ခွင်ကို ဆောက်လုပ်ပါ။ {#_3-build-the-workspace}

အရာရာကို ဆောက်လုပ်ပါ။

```bash
cargo build --workspace
```

operator-focused အသေးစား build အတွက် အဓိက binaries တွေကိုသာ compile လုပ်ပါ။

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

ရလာသော ဘိုင်နရီများကို `target/debug/` သို့မဟုတ် `target/release/` သို့ ရေးသားထားပါသည်။

## 4. တပ်ဆင်ထားသော ကိရိယာများကို စစ်ဆေးပါ။ {#_4-verify-the-installed-tools}

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

ပုံမှန်သုံးတဲ့ ဘိုင်နရီ သုံးခုက-

- `irohad` တူညီတဲ့ နတ်ဆိုးအတွက်
- `iroha` အတွက် CLI ကို Torii နှင့် လုပ်ငန်းရှင်များ၏ အဆုံးသတ်မှတ်ချက်များသို့ ဝင်ရောက်ရန်။
- `kagami` သော့များ၊ ဗီဇထုတ်ပြန်ချက်များနှင့် localnet profile များအတွက်။

## 5. Localnet နှင့် Docker Path ကို ရွေးချယ်ပါ။ {#_5-optional-localnet-and-docker-path}

လက်ရှိ source-backed localnet flow ကို Kagami ကဖန်တီးထားသည်။ ၎င်းသည် peer config များ၊ genesis artefacts များ၊ client config များ, helper script များနှင့် checked out code နှင့်အံတူသော ရွေးချယ်စရာ Compose ဖိုင်ကိုရေးသားထားသည်။

- `kagami localnet` တိုင်းရင်းသား ဒေသခံ စာသားများအတွက်
- `kagami docker`အတွက် Docker Compose ကို localnet directory မှထုတ်လုပ်ထားသည်

[စတင်ခြင်း Iroha 3](/my/get-started/launch-iroha.md)ဖြင့် ဆက်လုပ်ပါ။
