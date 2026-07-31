---
translation_locale: my
translation_source: /get-started/install-iroha.md
translation_source_hash: 49e1a29243151fec1ada2729c315378455a8502811e1ae124e5917a88d59b55d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# တပ်ဆင်ခြင်း Iroha 3 {#install-iroha-3}

ဤစာမျက်နှာသည် လက်ရှိ installation workflow ကိုဖုံးအုပ်သည်။ Iroha 3 ကိရိယာကွင်းဆက်
ဘိုင်နရီတွေကို စီးဆင်းမှုထက်ကို သုံးပြီး `hyperledger-iroha/iroha` အလုပ်ခွင်။

## (၁) လိုအပ်ချက်များ {#_1-prerequisites}

ဒါတွေကို အရင်တပ်ပါ။

- [rustup](https://www.rust-lang.org/tools/install), ဒီတော့ ပိတ်ထားတဲ့
  `rust-toolchain.toml` ကိရိယာကွင်းဆက် (`1.93.1`) ကို အလိုအလျောက် တပ်ဆင်ထားပါသည်။
- `git`
- ရွေးချယ်မှုတစ်ခုမှာ Docker နှင့် Docker Compose ဒေသတွင်း multi- peer quickstart အတွက်

## (၂) လုပ်ငန်းခွင်ကို ခလုန်းလုပ်ခြင်း {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## (၃) အလုပ်ခွင်ကို တည်ဆောက်ပါ {#_3-build-the-workspace}

အရာရာကို တည်ဆောက်ပါ။

```bash
cargo build --workspace
```

Operator ကို အာရုံစိုက်တဲ့ အသေးစား build အတွက် အဓိက binaries တွေကိုပဲ compile လုပ်ပါ။

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

ရလာတဲ့ ဘိုင်နရီတွေဟာ `target/debug/` ဒါမှမဟုတ် `target/release/`.

## 4. တပ်ဆင်ထားသော ကိရိယာများကို စစ်ဆေးပါ။ {#_4-verify-the-installed-tools}

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

ပုံမှန်သုံးတဲ့ ဘိုင်နရီ သုံးခုက-

- `irohad` တူညီတဲ့ နတ်ဆိုးအတွက်
- `iroha` အတွက် CLI ရယူခွင့် Torii အော်ပရေတာအဆုံးမှတ်များ
- `kagami` သော့များ၊ ဇာစ်မြစ်ထုတ်ပြန်ချက်များနှင့် localnet profile များအတွက်

## 5. ရွေးချယ်စရာ Localnet နှင့် Docker လမ်းကြောင်း {#_5-optional-localnet-and-docker-path}

လက်ရှိ source-backed localnet စီးဆင်းမှုကို Kagami. စာသားက တူညီတဲ့သူ
config, genesis artifacts, client config, helper scripts နဲ့ optional တစ်ခု
check-out code ကိုက်ညီတဲ့ ဖိုင်ကို ရေးသားပါ

- `kagami localnet` ဒေသတွင်းတူစာသားများအတွက်
- `kagami docker` အတွက် Docker Compose localnet directory တစ်ခုမှ ဖန်တီးထားသည်

ဆက်လုပ်ပါ [လွှတ်တင်ခြင်း Iroha 3](/my/get-started/launch-iroha.md).
