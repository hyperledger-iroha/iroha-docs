---
translation_locale: my
translation_source: /help/installation-issues.md
translation_source_hash: 2f548e96f8a72ea83a8b39fabf7f3713ad7b8df0eac627ed2138cbd9d3f7ea36
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# တပ်ဆင်မှု ပြဿနာများ ဖြေရှင်းခြင်း {#troubleshooting-installation-issues}

ဤအပိုဒ်သည် ပြဿနာဖြေရှင်းနည်းများအတွက် အကြံပြုချက်များကိုပေးသည်။ Iroha 3 တပ်ဆင်ခြင်း။
သင်တွေ့နေရတဲ့ ပြဿနာကို ဒီနေရာမှာ မဖော်ပြပါဘူး။
ကျွန်ုပ်တို့အား ဆက်သွယ်ရန် [Telegram ကို](https://t.me/hyperledgeriroha).

## အလျင်အမြန် စစ်ဆေးခြင်း {#quick-checks}

အစိတ်အပိုင်း ၄ ခုထဲက တစ်ခုက အများစု တပ်ဆင်မှု ပျက်ကွက်မှုတွေ ဖြစ်ပေါ်စေပါတယ်။

- (က) Rust toolchain ကို Upstream WorkSpace က ပိတ်ထားတဲ့ version ထက် ပိုကြီးတဲ့
- `cargo` ဒါမှမဟုတ် `rustc` အခြားစက်ရုံတစ်ခုသို့ ဖြေရှင်းခြင်း `rustup`
- missing system build tools တွေလို C compiler လိုမျိုး၊ `pkg-config`, ဒါမှမဟုတ် CMake
- အရင်းအမြစ်ပြောင်းပြီးနောက် ရှေးဟောင်းထုတ်လုပ်ထားတဲ့ snippets သို့မဟုတ် ဒေသတွင်းတည်ဆောက်မှုလက်ရာများ
  ပြင်ဆင်ချက်များ

ကနေ Iroha အရင်းအမြစ် စစ်ဆေးမှု စတင်ပါ

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

(သို့) `cargo metadata` မအောင်မြင်ခင် ဒေသတွင်း toolchain ကို ပြင်ပါ။
`pnpm refresh:iroha --source /path/to/iroha`, ဘာလို့ဆို refresh က
Kagami လက်ရှိ ဒေတာပုံစံ အစီအစဉ်ကို ဖန်တီးဖို့ပါ။

## ပြဿနာဖြေရှင်းခြင်း Rust ကိရိယာကွင်းဆက် {#troubleshooting-rust-toolchain}

တစ်ခါတစ်လေမှာ စီစဉ်ထားတဲ့အတိုင်း မဖြစ်တတ်ဘူး။ အထူးသဖြင့် သင်က `rust` သင့်ရဲ့
စနစ်ကို ခဏအကြာကြီး မွမ်းမံခဲ့ပါ။ အလားတူပြဿနာတစ်ခု
Python: XKCD ဒါက ဘယ်လိုပုံပေါက်မလဲဆိုတဲ့ နာမည်ကျော် ဥပမာတစ်ခုရှိတယ်။

<div class="flex justify-center">

![Python ပတ်ဝန်းကျင်ပြဿနာဖြေရှင်းရေး ကာတွန်း](/img/install-troubles.png)

</div>

### စစ်ဆေးပါ Rust မူကွဲ {#check-rust-version}

သင့်ရဲ့ စိတ်ကျန်းမာရေးနဲ့ ကျွန်မတို့ရဲ့ စိတ်ကျန်းမာမှုကို ထိန်းသိမ်းဖို့ သေချာအောင်လုပ်ပါ။
မှန်ကန်တဲ့ ပုံစံရှိဖို့ `cargo` မှန်ကန်တဲ့ ပုံစံနဲ့တွဲထားတဲ့ `rustc`.
လက်ရှိ Upstream အလုပ်ခွင်က Declares `rust-version = "1.92"` ပြီးတော့ ပိုက်တွေကို
toolchain channel ကို `rust-toolchain.toml`. ဗားရှင်းတွေကို ပြဖို့ လုပ်ပါ။

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

နောက်တော့

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

ပိုမြင့်တဲ့ဗားရှင်းတွေရှိရင် အဆင်ပြေပါတယ်။
ဒါကို update လုပ်ဖို့ အောက်ပါ command ကို run လုပ်လို့ရပါတယ်။

```bash
$ rustup toolchain update stable
```

### တပ်ဆင်ရေးနေရာကို စစ်ဆေးပါ။ {#check-installation-location}

ပိုနိမ့်တဲ့ ဗားရှင်း နံပါတ်တွေရရင် **နှင့်** toolchain ကို update လုပ်ပြီး
အလုပ်မဖြစ်ခဲ့ဘူးဆိုပါစို့ ဒါက ပုံမှန်ပြဿနာတစ်ခုပဲ
တူညီတဲ့ ဖြေရှင်းနည်း

ပထမဦးဆုံးအနေနဲ့ ကိုယ်သုံးချင်တဲ့ ဗားရှင်းက ဘယ်မှာလဲဆိုတာ သတ်မှတ်သင့်ပါတယ်။
တပ်ဆင်ထားသည်

```bash
$ rustup which rustc
$ rustup which cargo
```

Toolchains များ၏ အသုံးပြုသူများ၏ တပ်ဆင်မှုများမှာ _အများအားဖြင့်_ အထဲမှာ
`~/.rustup/toolchains/stable-*/bin/`. ဒါဆိုရင် သင်ဟာ
ပြေးနိုင်တယ်

```bash
$ rustup toolchain update stable
```

ဒါက သင့်ပြဿနာတွေကို ဖြေရှင်းသင့်ပါတယ်။

### အလိုအလျောက်ကို စစ်ဆေးပါ Rust မူကွဲ {#check-the-default-rust-version}

နောက်ထပ် ရွေးချယ်စရာတစ်ခုက နောက်ဆုံးပေါ် သတင်းအချက်အလက်တွေ ရှိဖို့ပါ။ `stable` toolchain ကို, ဒါပေမဲ့
default အဖြစ် မသတ်မှတ်ပါ။ Run:

```bash
$ rustup default stable
```

ဒီလိုမျိုး ဖြစ်ပျက်နိုင်တာက `nightly` မူကွဲ သို့မဟုတ် သတ်မှတ်ချက်
Rust Version ကို မေ့သွားပေမဲ့ Un-set လုပ်ဖို့မေ့လိုက်

### အခြားပစ္စည်းတွေရှိမရှိ စစ်ဆေးပါ။ Rust မူကွဲများ {#check-if-there-are-other-rust-versions}

ပြဿနာဖြေရှင်းရေး rabbit hole ကိုဆက်ပြီးသွားရင် Shell ရှိနိုင်တယ်
အမည်မဖော်လိုသူ:

```bash
$ type rustc
$ type cargo
```

ဒါတွေက ပြေးနေတုန်း မြင်ခဲ့တဲ့ နေရာတွေထက် အခြားနေရာတွေကို ညွှန်ပြရင်
`rustup which *`, ဒါဆို ပြဿနာတစ်ခုရှိတယ် သတိထားပါ ဒါက မလုံလောက်ဘူး
ဒါပဲ

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

ဘာလို့လဲဆိုတော့ ကိုယ်က ဘယ်လိုပဲလုပ်လုပ် ခွဲခြားနိုင်တဲ့ အတွင်းပိုင်း ယုတ္တိတစ်ခုရှိလို့ပါ
သင့်ရဲ့ shell aliases ကို ပြန်လည်စီစဉ်ပါ။

ရိုးရှင်းဆုံး ဖြေရှင်းနည်းက မသုံးတဲ့ ဗားရှင်းတွေကို ဖယ်ရှားဖို့ပါ။

ပိုလွယ်ပါတယ်။ _ပြောခဲ့သည်_ ထက် _ပြီးသွားပြီ_, ဒါပေမဲ့၊ အဲဒါဟာ အားလုံးကို ခြေရာခံဖို့ လိုအပ်နေလို့
မူကွဲများ rustup Installed and available to you များသောအားဖြင့်
နှစ်။ System package manager version နဲ့ install လုပ်ထားတဲ့ version
Home folder ထဲက command ကို run လုပ်လိုက်တဲ့ အခါမှာ default location ကို
ဒီသင်ခန်းစာရဲ့ အစမှာ။ ပထမတစ်ခုအတွက် သင့် (Linux) ကို တိုင်ပင်ပါ။
ကန့်သတ်ချက်များ (`apt remove rust`) နောက်တစ်ခုအတွက် run:

```bash
$ rustup toolchain list
```

နောက်ပြီး `<toolchain>` (ထောင့်အချိတ်တွေမပါဘဲ)

```bash
$ rustup remove <toolchain>
```

အဲဒီနောက်မှာ သေချာအောင်လုပ်ပါ။

```bash
$ cargo --help
```

command-not-found error ဖြစ်ပေါ်စေတယ် Rust
toolchain ကို တပ်ဆင်ထားပြီးနောက် run:

```bash
$ rustup toolchain install stable
```

## ပြဿနာဖြေရှင်းခြင်း Python ကိရိယာကွင်းဆက် {#troubleshooting-python-toolchain}

Install လုပ်တဲ့အခါ Python ဘီးအိတ်မှာ pip ကိုသုံးပြီး [Python client ကို setup လုပ်ပေးခြင်း](/my/guide/tutorials/python.md), ဒီလိုအမှားကို တွေ့နိုင်ပါတယ်။
"Iroha"_ပိုက်တွန် -*.whl ဟာ ဒီပလက်ဖောင်းမှာ ထောက်ခံတဲ့ ဘီးမဟုတ်ဘူး။"

ဒီအမှားက pip ကို ခေတ်နောက်ကျနေပြီလို့ ဆိုလိုတာမို့ ဒါကို မွမ်းမံဖို့လိုပါတယ်။
ပထမဦးဆုံးအနေနဲ့ သင့်ရဲ့ OS အဆင့်မြှင့်တင်ခြင်းများအတွက် စနစ်ကို အဆင့်မြှင့်ပေးရန်။

ဒါက အလုပ်မဖြစ်ဘူးဆိုရင်၊ ခင်ဗျားက အပေါ်ယံကို စမ်းကြည့်လို့ရပါတယ်။ `pip` သင့်ရဲ့ User Directory အတွက်ပါ။

`python -m pip install --upgrade pip`

သေချာအောင်လုပ်ပါ။ `pip` Home Directory ထဲမှာ တပ်ဆင်ထားတာပါ။ `whereis pip` ပြီးတော့ စစ်ဆေးပါ `/home/username/.local/bin/pip` လမ်းကြောင်းတွေထဲမှာ ရှိပါသေးတယ်။ မဟုတ်ရင် သင့်ရဲ့ shell ကို update လုပ်ပါ။ `PATH` အပြောင်းအလဲပါ။

ဒီပြဿနာက ဆက်ဖြစ်နေရင် ကျေးဇူးပြုပြီး [ကျွန်တော်တို့နဲ့ ဆက်သွယ်ပါ။](/my/help/) ရလဒ်တွေကို အစီရင်ခံပါ။

```
python --version
python3 --version
pip --version
pip3 --version
```
