---
translation_locale: my
translation_source: /help/installation-issues.md
translation_source_hash: 2f548e96f8a72ea83a8b39fabf7f3713ad7b8df0eac627ed2138cbd9d3f7ea36
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# တပ်ဆင်မှု ပြဿနာများ ဖြေရှင်းခြင်း {#troubleshooting-installation-issues}

ဤအခန်းတွင် Iroha 3 တပ်ဆင်မှုအတွက်ပြဿနာဖြေရှင်းနည်းများကိုပေးထားသည်။ သင်တွေ့နေသည့် ပြဿနာကိုဤနေရာတွင်ဖော်ပြခြင်းမရှိပါက [Telegram](https://t.me/hyperledgeriroha) မှ ဆက်သွယ်ပါ။

## အလျင်အမြန် စစ်ဆေးခြင်း {#quick-checks}

တပ်ဆင်မှု ကျရှုံးမှု အများစုဟာ နေရာ လေးခုထဲက တစ်ခုကနေ လာတာပါ။

- a Rust toolchain ကို Upstream Workspace က ပိတ်ထားတဲ့ Version ထက် ပိုကြီးတဲ့
- `cargo` သို့မဟုတ် `rustc` သည် `rustup` နှင့်မတူသောစက်ရုံတစ်ခုသို့ ဖြေရှင်းသည်။
- C compiler, `pkg-config` သို့မဟုတ် CMake ကဲ့သို့သော missing system building tools များ
- အရင်းအမြစ် ပြင်ဆင်ချက်များကို ပြောင်းလဲပြီးနောက် ရှေးဟောင်းထုတ်လုပ်သော snippets သို့မဟုတ် ဒေသတွင်းတည်ဆောက်မှုလက်ရာများ

Iroha အရင်းအမြစ် စစ်ဆေးမှုကနေ စတင်ပါ-

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

`cargo metadata` ပျက်ကွက်ပါက `pnpm refresh:iroha --source /path/to/iroha` ကိုမဖွင့်ခင် ဒေသတွင်း toolchain ကိုပြင်ဆင်ပါ။ အကြောင်းက update က လက်ရှိ data-model schema ကိုဖန်တီးဖို့ Kagami ကိုခေါ်ဆောင်နိုင်လို့ပါ။

## Troubleshooting Rust Toolchain {#troubleshooting-rust-toolchain}

တစ်ခါတစ်လေမှာ စီစဉ်ထားတဲ့အတိုင်း မဖြစ်တတ်ဘူး။ အထူးသဖြင့် သင်လုပ်ခဲ့ရင် `rust` သင့်ရဲ့စနစ်မှာ ခဏလောက်ရှိပေမဲ့ မတိုးတက်ခဲ့ဘူး။ အလားတူပြဿနာတစ်ခုက Python: XKCD ဒါက ဘယ်လိုပုံပေါက်မလဲဆိုတဲ့ နာမည်ကျော် နမူနာတစ်ခုရှိတယ်။

<div class="flex justify-center">

![Python ပတ်ဝန်းကျင်ပြဿနာဖြေရှင်းရေး comic](/img/install-troubles.png)

</div>

### Rust ဗားရှင်းကို စစ်ဆေးပါ။ {#check-rust-version}

`cargo` ၏ မှန်ကန်သောဗားရှင်းနှင့်တွဲပြီး `rustc` ၏ မှန်ကန်သည့်ဗားရှင်းရှိသည်ကို သေချာအောင်လုပ်ပါ။ လက်ရှိအထက်စီးဆင်း အလုပ်ခွင်သည် `rust-version = "1.92"` ကိုကြေညာကာ toolchain channel ကို `rust-toolchain.toml` တွင်ပိတ်ထားသည်။ ဗားရှင်းများကိုပြရန်,

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

ပြီးရင်

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

ပိုမြင့်တဲ့ ဗားရှင်းတွေရှိရင် အဆင်ပြေပါတယ်။ ပိုနိမ့်တဲ့ဗားရှင်းတွေ ရှိရင် ဒါကို update လုပ်ဖို့ အောက်ပါ command ကို run လုပ်နိုင်ပါတယ်။

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

`~/.rustup/toolchains/stable-*/bin/` တွင် toolchains များ၏အသုံးပြုသူတပ်ဆင်မှုများဖြစ်ပါသည်။

```bash
$ rustup toolchain update stable
```

ဒါက သင့်ပြဿနာတွေကို ဖြေရှင်းသင့်ပါတယ်။

### မူရင်း Rust ကို စစ်ဆေးပါ။ {#check-the-default-rust-version}

`stable` toolchain ကို update လုပ်ထားပေမယ့် default အနေနဲ့ set မလုပ်ရပါဘူး။ Run:

```bash
$ rustup default stable
```

`nightly` ဗားရှင်းကို တပ်ဆင်ထားပြီး (သို့) တိကျတဲ့ Rust ဗားရှင်းတစ်ခုကို သတ်မှတ်ထားပေမဲ့ မသတ်မှတ်တာ မေ့သွားရင် ဖြစ်နိုင်ပါတယ်။

### အခြား Rust ဗားရှင်းတွေရှိမရှိကို စစ်ဆေးပါ။ {#check-if-there-are-other-rust-versions}

ပြဿနာဖြေရှင်းရေး rabbit hole ကို ဆက်လုပ်နေရင် shell aliases တွေရှိနိုင်ပါတယ်။

```bash
$ type rustc
$ type cargo
```

`rustup which *` ကို run လုပ်နေစဉ်မှာ မြင်ခဲ့တဲ့ နေရာတွေထက် အခြားနေရာတွေကို ညွှန်ပြရင် ပြဿနာတစ်ခု ရှိပါသေးတယ်။

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

ဘာလို့လဲဆိုတော့ သင့်ရဲ့ shell aliases တွေကို ဘယ်လိုပဲ ပြန်လည်စီစဉ်ထားဖြစ် ပျက်စီးနိုင်မယ့် အတွင်းပိုင်း logic တစ်ခုရှိလို့ပါ။

ရိုးစင်းဆုံး ဖြေရှင်းနည်းက သင်မသုံးတဲ့ ဗားရှင်းတွေကို ဖယ်ရှားဖို့ပါ။

rustup ၏ တည်ထောင်ထားပြီး သင့်အတွက် ရယူနိုင်သော ဗားရှင်းအားလုံးကို ခြေရာခံခြင်းကြောင့် လုပ်တာထက် ပြောတာ ပိုလွယ်ပါတယ်။ ယေဘုယျအားဖြင့် နှစ်ခုပဲရှိပါတယ် ဒီသင်ခန်းစာရဲ့ အစမှာ Command ကို Run လုပ်တဲ့အခါ သင့်ရဲ့ Home Folder ထဲက Standard Location မှာ Install လုပ်ထားတဲ့ System Package Manager ဗားရှင်းနဲ့ပါ။ ပထမတစ်ခုအတွက် သင့်ရဲ့ (Linux) ဖြန့်ဖြူးမှု Manual ကို ကြည့်ပါ၊ (`apt remove rust`). နောက်တစ်ခုအတွက် run:

```bash
$ rustup toolchain list
```

အဲဒီနောက်မှာ `<toolchain>` တစ်ခုစီအတွက် ( angle brackets မပါဘဲ)

```bash
$ rustup remove <toolchain>
```

အဲဒီနောက်မှာ သေချာအောင်လုပ်ပါ။

```bash
$ cargo --help
```

command-not-found error ဖြစ်စေတယ်၊ ဆိုလိုတာက active Rust toolchain ကို မတပ်ထားတာပါ။ ပြီးရင် run:

```bash
$ rustup toolchain install stable
```

## Python ကိရိယာကွင်းဆက်ကို ပြဿနာဖြေရှင်း {#troubleshooting-python-toolchain}

Python Wheel Package ကို [Python client setup](/my/guide/tutorials/python.md) အတွင်းမှာ pip ကိုသုံးပြီး install လုပ်တဲ့အခါ "iroha_python-*.whl သည် ဤပလက်ဖောင်းပေါ်တွင် မထောက်ခံသော wheel မဟုတ်ပါ" လိုအမှားတစ်ခု ကြုံတွေ့နိုင်သည်။

ဤအမှားသည် pip သည်သက်တမ်းလွန်နေပြီဖြစ်သောကြောင့်၎င်းကို update လုပ်ရန်လိုအပ်သည်။ ပထမဦးဆုံးအနေနဲ့ OS ကို update များအတွက်စစ်ဆေးပြီးစနစ် upgrade လုပ်ရန်အကြံပြုပါသည်။

ဒါက အလုပ်မဖြစ်ရင် `pip` ကို အသုံးပြုသူ direktorium အတွက် update လုပ်ကြည့်ပါ။

`python -m pip install --upgrade pip`

သေချာအောင်လုပ်ပါ။ `pip` Home Directory ထဲမှာ တပ်ဆင်ထားတာပါ။ ဒါကိုလုပ်ဖို့ Run `whereis pip` နောက်ပြီး စစ်ဆေးပါ `/home/username/.local/bin/pip` လမ်းကြောင်းတွေအကြားမှာရှိတယ် မဟုတ်ရင် သင့်ရဲ့ shell ကို update လုပ်လိုက်ပါ။ `PATH` အပြောင်းအလဲပါ။

ဒီပြဿနာက ဆက်ရှိနေရင် ကျေးဇူးပြုပြီး [ကျွန်တော်တို့နဲ့ ဆက်သွယ်ပါ။](/my/help/) ပြီးတော့ ထုတ်ကုန်တွေကို အစီရင်ခံပါ။

```
python --version
python3 --version
pip --version
pip3 --version
```
