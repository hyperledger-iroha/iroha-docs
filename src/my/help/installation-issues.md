---
translation_locale: my
translation_source: /help/installation-issues.md
translation_source_hash: 1a2519123edc5224e720e23ef3e2bc2a7b4dba38ef87af49216c31c054c85a2a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# တပ်ဆင်မှု ပြဿနာများ ဖြေရှင်းခြင်း {#troubleshooting-installation-issues}

ဤအခန်းတွင် Iroha 3 တပ်ဆင်မှုအတွက်ပြဿနာဖြေရှင်းရေး အကြံပေးချက်များကို ဖော်ပြထားပါသည်။ သင်တွေ့ရှိနေသည့် ပြဿနာကို ဒီမှာဖော်ပြခြင်းမရှိပါက [အွန်လိုင်း](https://t.me/hyperledgeriroha) မှတစ်ဆင့် ဆက်သွယ်ပါ။

## အလျင်အမြန် စစ်ဆေးခြင်း {#quick-checks}

တပ်ဆင်မှု ကျရှုံးမှု အများစုဟာ နေရာ လေးခုထဲက တစ်ခုကနေ လာတာပါ။

- a Rust toolchain ကို Upstream Workspace က ပိတ်ထားတဲ့ Version ထက် ပိုကြီးတဲ့
- `cargo` သို့မဟုတ် `rustc` သည် `rustup` နှင့်မတူသောစက်ရုံတစ်ခုသို့ ဖြေရှင်းသည်။
- C compiler, `pkg-config` သို့မဟုတ် CMake ကဲ့သို့သော missing system building tools များ
- အရင်းအမြစ် ပြင်ဆင်ချက်များကို ပြောင်းလဲပြီးနောက် ရှေးဟောင်းထုတ်လုပ်သော snippets သို့မဟုတ် ဒေသတွင်းတည်ဆောက်မှုလက်ရာများ

Iroha အရင်းအမြစ်ကုဒ်အလုပ်လုပ်စာရွက်စာတမ်းကနေ အောက်ပါအတိုင်း စတင်ပါ။

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

`cargo metadata` ပျက်ကွက်ပါက `pnpm refresh:iroha --source /path/to/iroha` ကိုမဖွင့်ခင် ဒေသတွင်း toolchain ကိုပြင်ဆင်ပါ။ အကြောင်းက update က လက်ရှိ data-model schema ကိုဖန်တီးဖို့ Kagami ကိုခေါ်ဆောင်နိုင်လို့ပါ။

## Rust ကိရိယာအစု ပြဿနာဖြေရှင်းခြင်း {#troubleshooting-rust-toolchain}

တစ်ခါတစ်လေမှာ စီစဉ်ထားတဲ့အတိုင်း မဖြစ်တတ်ဘူး။ အထူးသဖြင့် သင်လုပ်ခဲ့ရင် `rust` သင့်ရဲ့စနစ်မှာ ခဏလောက်ရှိပေမဲ့ မတိုးတက်ခဲ့ဘူး။ အလားတူပြဿနာတစ်ခုက Python: XKCD ဒါက ဘယ်လိုပုံပေါက်မလဲဆိုတဲ့ နာမည်ကျော် နမူနာတစ်ခုရှိတယ်။

<div class="flex justify-center">

![Python ပတ်ဝန်းကျင်ပြဿနာဖြေရှင်းရေး ကာတွန်း](/img/install-troubles.png)

</div>

### Rust ဗားရှင်းကို စစ်ဆေးပါ။ {#check-rust-version}

သင်နှင့် ကျွန်ုပ်တို့ နှစ်ဖက်စလုံး စိတ်ရှုပ်ထွေးမှု မဖြစ်စေရန် `cargo` ၏ မှန်ကန်သော ဗားရှင်းကို `rustc` ၏ မှန်ကန်သော ဗားရှင်းနှင့် တွဲဖက်ထားကြောင်း သေချာစေပါ။ လက်ရှိမူရင်းအလုပ်နယ်ပယ်တွင် `rust-version = "1.92"` ဟု ကြေညာထားပြီး ကိရိယာစုချန်နယ်ကို `rust-toolchain.toml` တွင် ပုံသေသတ်မှတ်ထားသည်။ ဗားရှင်းများကို ပြရန် အောက်ပါအတိုင်း လုပ်ဆောင်ပါ။

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

ပြီးရင်

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

သင့်ဗားရှင်းများက ပိုမြင့်ပါက အဆင်ပြေသည်။ ပိုနိမ့်ပါက မွမ်းမံရန် အောက်ပါကွန်မန်းကို လုပ်ဆောင်နိုင်သည်။

```bash
$ rustup toolchain update stable
```

### တပ်ဆင်တဲ့နေရာကို စစ်ဆေးပါ။ {#check-installation-location}

ပိုနိမ့်တဲ့ ဗားရှင်း နံပါတ်တွေရပြီး toolchain ကို update လုပ်လိုက်ရင် အလုပ်မဖြစ်ခဲ့ဘူးဆိုပါစို့။ ဒါက ပုံမှန်ပြဿနာတစ်ခုပဲဆိုပါစို့၊ ဒါပေမဲ့ တူညီတဲ့ ဖြေရှင်းနည်း မရှိပါဘူး။

ပထမဦးဆုံးအနေနဲ့ အသုံးပြုချင်တဲ့ ဗားရှင်းကို ဘယ်မှာ တပ်ဆင်ထားလဲဆိုတာ သတ်မှတ်သင့်ပါတယ်။

```bash
$ rustup which rustc
$ rustup which cargo
```

Toolchains တွေရဲ့ User Installations တွေက `~/.rustup/toolchains/stable-*/bin/` မှာ ဖြစ်တတ်ပါတယ်။ ဒါဆိုရင် သင် ပြေးနိုင်သင့်ပါတယ်။

```bash
$ rustup toolchain update stable
```

ဒါက သင့်ပြဿနာတွေကို ဖြေရှင်းသင့်ပါတယ်။

### မူရင်း Rust ကို စစ်ဆေးပါ။ {#check-the-default-rust-version}

နောက်ထပ်ဖြစ်နိုင်ခြေတစ်ခုမှာ သင့်တွင် နောက်ဆုံးပေါ် `stable` ကိရိယာစုရှိသော်လည်း ပုံမှန်အသုံးပြုမည့် ကိရိယာစုအဖြစ် သတ်မှတ်မထားခြင်းဖြစ်သည်။ အောက်ပါအတိုင်း လုပ်ဆောင်ပါ။

```bash
$ rustup default stable
```

`nightly` ဗားရှင်းတစ်ခု တပ်ဆင်ခြင်း (သို့) Rust ဗားရှင်းတစ်ခုကို နောက်ပိုင်း မဖွင့်ဘဲ သတ်မှတ်ထားခြင်းသည် ဒီပြဿနာကို ဖြစ်စေနိုင်ပါတယ်။

### အခြား Rust ဗားရှင်းတွေရှိမရှိကို စစ်ဆေးပါ။ {#check-if-there-are-other-rust-versions}

ပြဿနာဖြေရှင်းရေး rabbit hole ကို ဆက်လုပ်နေရင် shell aliases တွေရှိနိုင်ပါတယ်။

```bash
$ type rustc
$ type cargo
```

ဤအရာများက `rustup which *` ကို လုပ်ဆောင်စဉ် တွေ့ခဲ့သော နေရာမဟုတ်ဘဲ အခြားနေရာများကို ညွှန်ပြနေပါက ပြဿနာရှိသည်။ အောက်ပါကဲ့သို့ အမည်လွှဲများ ထည့်သွင်းရုံဖြင့် မလုံလောက်ကြောင်း သတိပြုပါ။

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

သင့်ရဲ့ shell aliases တွေကို ဘယ်လိုစီစဉ်ထားဖြစ် အတွင်းပိုင်း ဆင်ခြင်တုံတရားက ကျိုးဖောက်နိုင်တုန်းပါ။

ရိုးစင်းဆုံး ဖြေရှင်းနည်းက သင်မသုံးတဲ့ ဗားရှင်းတွေကို ဖယ်ရှားဖို့ပါ။

သို့သော် ထည့်သွင်းထားပြီး သင်အသုံးပြုနိုင်သော rustup ဗားရှင်းအားလုံးကို ခြေရာခံရန် လိုအပ်သဖြင့် _လုပ်ရသည်_ ထက် _ပြောရသည်_ က ပိုလွယ်သည်။ များသောအားဖြင့် နှစ်ခုသာ ရှိသည်။ တစ်ခုမှာ စနစ်၏ ပက်ကေ့ချ်စီမံရေးကိရိယာမှ ဗားရှင်းဖြစ်ပြီး နောက်တစ်ခုမှာ ဤသင်ခန်းစာအစရှိ ကွန်မန်းကို လုပ်ဆောင်စဉ် သင့်မူလဖိုင်တွဲ၏ စံနေရာတွင် ထည့်သွင်းခဲ့သော ဗားရှင်းဖြစ်သည်။ ပထမတစ်ခုအတွက် သင့် Linux ဖြန့်ချိမှု၏ လမ်းညွှန်ကို ကြည့်ပါ (`apt remove rust`)။ နောက်တစ်ခုအတွက် အောက်ပါအတိုင်း လုပ်ဆောင်ပါ။

```bash
$ rustup toolchain list
```

အဲဒီနောက်မှာ `<toolchain>` တစ်ခုစီအတွက် ( angle brackets မပါဘဲ)

```bash
$ rustup remove <toolchain>
```

toolchains တွေကို ဖယ်ရှားပြီးနောက်မှာ ဒီအမိန့်က command-not-found error ကို ဖော်ပြသင့်ပါတယ်-

```bash
$ cargo --help
```

အဲဒီအမှားက active Rust toolchain တစ်ခုမှ မတပ်ထားသေးတာကို အတည်ပြုပေးပါတယ်။

```bash
$ rustup toolchain install stable
```

## Python ကိရိယာကွင်းဆက်ကို ပြဿနာဖြေရှင်း {#troubleshooting-python-toolchain}

Python Wheel Package ကို [Python ဖောက်သည် setting](/my/guide/tutorials/python.md) ကာလအတွင်း pip ကိုသုံးပြီး install လုပ်တဲ့အခါ "iroha_python-*whl သည် ဤပလက်ဖောင်းတွင်ထောက်ပံ့သော wheel မဟုတ်ပါ" လိုအမှားတစ်ခု ကြုံတွေ့နိုင်သည်။

ဤအမှားသည် pip သည်သက်တမ်းလွန်နေပြီဖြစ်သောကြောင့်၎င်းကို update လုပ်ရန်လိုအပ်သည်။ ပထမဦးဆုံးအနေနဲ့ OS ကို update များအတွက်စစ်ဆေးပြီးစနစ် upgrade လုပ်ရန်အကြံပြုပါသည်။

ဒါက အလုပ်မဖြစ်ရင် `pip` ကို အသုံးပြုသူ direktorium အတွက် update လုပ်ကြည့်ပါ။

`python -m pip install --upgrade pip`

`pip` ကို သင့် home ဖိုင်တွဲ၌ ထည့်သွင်းထားကြောင်း သေချာပါစေ။ ထိုသို့စစ်ဆေးရန် `whereis pip` ကို လုပ်ဆောင်ပြီး လမ်းကြောင်းများတွင် `/home/username/.local/bin/pip` ပါမပါ ကြည့်ပါ။ မပါလျှင် သင့် shell ၏ `PATH` တန်ဖိုးကို ပြင်ဆင်ပါ။

ဒီပြဿနာ ဆက်ရှိနေရင် [ကျွန်တော်တို့နဲ့ ဆက်သွယ်ပါ။](/my/help/) နဲ့ ထုတ်ကုန်တွေကို အစီရင်ခံပေးပါ။

```
python --version
python3 --version
pip --version
pip3 --version
```
