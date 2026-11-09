---
translation_locale: my
translation_source: /get-started/install-iroha.md
translation_source_hash: f7f68228d219cc1c0ea5af128ba5dc956640df8a3d264ed3a4862447b3348a7d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 3 ကို တပ်ဆင်ပါ။ {#install-iroha-3}

ဤစာမျက်နှာသည် Iroha 3 toolchain နှင့် upstream `hyperledger-iroha/iroha` workspace ကိုအသုံးပြုသော binaries များအတွက်လက်ရှိ install workflow ကိုဖော်ပြသည်။

စက်ပေါ်တွင် တိုက်ရိုက်ထည့်သွင်းရန် အောက်ပါ Rust လမ်းညွှန်အတိုင်း လုပ်ဆောင်ပါ။ Docker ဖြင့် အတည်ပြုနိုဒ်လေးခုကို လုပ်ဆောင်လိုပါက [Iroha 3 ကို စတင်ခြင်း](/my/get-started/launch-iroha.md) လမ်းညွှန်မှ စတင်ပါ။

## (၁) ကြိုတင်လိုအပ်ချက်များ {#_1-prerequisites}

ဒါတွေကို အရင်တပ်ပါ။

- [rustup](https://www.rust-lang.org/tools/install) ဆိုတော့ ပိတ်ထားတဲ့ `rust-toolchain.toml` toolchain (`1.93.1`) ကို အလိုအလျောက် တပ်ဆင်ထားတယ်။
- `git`
- စက်တွင်း၌ နိုဒ်များစွာ အသုံးပြုမည့် အမြန်စတင်နည်းအတွက် လိုအပ်ပါက Docker နှင့် Docker Compose ကို ထည့်သွင်းပါ။

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

စနစ်စီမံသူများအတွက် လိုအပ်သည့် အဓိကပရိုဂရမ်များကိုသာ စက်ကုဒ်အဖြစ် ပြောင်းလိုပါက အောက်ပါအတိုင်း လုပ်ဆောင်ပါ။

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

- သာမန်ကွန်ရက်နိုဒ်၏ နောက်ခံလုပ်ငန်းစဉ်အတွက် `iroha3d`
- Taira အတည်ပြုနိုဒ်များအတွက် စံသတ်မှတ်ထားသော စတင်ပရိုဂရမ်မှာ `iroha3d_taira` ဖြစ်သည်။
- Torii နှင့် စီမံခန့်ခွဲသူသုံး လိပ်စာများကို CLI မှ ဆက်သွယ်ရန် `iroha`
- သော့များ၊ ပထမဘလောက် ဖော်ပြချက်များနှင့် စက်တွင်းစမ်းသပ်ကွန်ရက် ဆက်တင်များအတွက် `kagami`

## 5. Localnet နှင့် Docker Path ကို ရွေးချယ်ပါ။ {#_5-optional-localnet-and-docker-path}

Kagami က ရင်းမြစ်ကုဒ်မှ စက်တွင်းစမ်းသပ်ကွန်ရက်အတွက် လိုအပ်သည်များကို ပြင်ဆင်ပေးသည်။ ၎င်းက နိုဒ်ဆက်တင်များ၊ ပထမဘလောက်ဖိုင်များ၊ ကလိုင်းယင့်ဆက်တင်များ၊ အကူပရိုဂရမ်များနှင့် ရယူထားသည့်ကုဒ်နှင့် ကိုက်ညီသော ရွေးချယ်သုံးနိုင်သည့် Compose ဖိုင်ကို ရေးပေးသည်။

- စက်ပေါ်တွင် နိုဒ်များကို တိုက်ရိုက်စတင်ရန် အကူပရိုဂရမ်များ ရယူလိုပါက `kagami localnet` ကို သုံးပါ။
- စက်တွင်းစမ်းသပ်ကွန်ရက်၏ လမ်းညွှန်မှ Docker Compose ဖိုင်ကို ထုတ်ရန် `kagami docker` ကို သုံးပါ။

[လွှတ်တင်ခြင်း Iroha 3](/my/get-started/launch-iroha.md) ကို ဆက်လုပ်ပါ။
