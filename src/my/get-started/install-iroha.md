---
translation_locale: my
translation_source: /get-started/install-iroha.md
translation_source_hash: 4c7c62c23166a19ccc3a6a4bb42d808038d755b8c05e87b9e2ce21fbbe31a6ac
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Iroha 3 ကို တပ်ဆင်ပါ။ {#install-iroha-3}

ဤစာမျက်နှာသည် Iroha 3 toolchain နှင့် upstream `hyperledger-iroha/iroha` workspace ကိုအသုံးပြုသော binaries များအတွက်လက်ရှိ install workflow ကိုဖော်ပြသည်။

## (၁) ကြိုတင်လိုအပ်ချက်များ {#_1-prerequisites}

ဒါတွေကို အရင်တပ်ပါ။

- [rustup](https://www.rust-lang.org/tools/install) ဆိုတော့ ပိတ်ထားတဲ့ `rust-toolchain.toml` toolchain (`1.93.1`) ကို အလိုအလျောက် တပ်ဆင်ထားတယ်။
- `git`
- စက်တွင်း peer အများအပြားဖြင့် အမြန်စတင်ရန် ရွေးချယ်နိုင်သော Docker နှင့် Docker Compose

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

အော်ပရေတာအတွက် ဦးစားပေးထားသော ပိုသေးငယ်သည့် build ရရန် အဓိက binary များကိုသာ compile လုပ်ပါ။

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

ရလာသော ဘိုင်နရီများကို `target/debug/` သို့မဟုတ် `target/release/` သို့ ရေးသားထားပါသည်။

## 4. တပ်ဆင်ထားသော ကိရိယာများကို စစ်ဆေးပါ။ {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

ပုံမှန်သုံးတဲ့ ဘိုင်နရီ လေးခုက-

- ပုံမှန် peer နောက်ခံပရိုဂရမ် အတွက် `iroha3d`
- စံ Taira ၏ validator စတင်ပေးသည့် ပရိုဂရမ်အတွက် `iroha3d_taira`
- `iroha` အတွက် CLI ရယူခွင့် Torii လုပ်ငန်းရှင်များ API အဆုံးသတ်မှတ်ချက်များ
- `kagami` ခလုတ်များအတွက်၊ ဘလော့ကချ်ဗီဇ နည်းပညာထုတ်ပြန်ချက်များအတွက်နှင့် localnet profile များအတွက်

## 5. Localnet နှင့် Docker Path ကို ရွေးချယ်ပါ။ {#_5-optional-localnet-and-docker-path}

လက်ရှိ source နှင့် ကိုက်ညီသော localnet လုပ်ငန်းစဉ်ကို Kagami က ထုတ်လုပ်သည်။ ၎င်းက ထုတ်ယူထားသော ကုဒ်နှင့် ကိုက်ညီသည့် peer ပြင်ဆင်သတ်မှတ်မှုများ၊ genesis artifact များ၊ client ပြင်ဆင်သတ်မှတ်မှု၊ အကူ script များနှင့် ရွေးချယ်နိုင်သော Compose ဖိုင်ကို ရေးပေးသည် -

- Kagami က စတင်၍ ကြီးကြပ်ပေးသော စီမံထိန်းသိမ်းထားသည့် ဒေသတွင်းကွန်ရက်အတွက် `kagami localnet up`
- မူရင်းစနစ်ပေါ် လုပ်ဆောင်မည့် ဒေသတွင်း peer script များအတွက် `kagami localnet generate`
- Localnet ဖိုင်တွဲ မှ Docker Compose ထုတ်လုပ်ရန် `kagami docker` ကို သုံးပါ။

[လွှတ်တင်ခြင်း Iroha 3](/my/get-started/launch-iroha.md) ကို ဆက်လုပ်ပါ။
