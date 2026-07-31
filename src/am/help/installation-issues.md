---
translation_locale: am
translation_source: /help/installation-issues.md
translation_source_hash: 2f548e96f8a72ea83a8b39fabf7f3713ad7b8df0eac627ed2138cbd9d3f7ea36
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የመጫን ችግሮች {#troubleshooting-installation-issues}

ይህ ክፍል ለችግር መፍታት ጠቃሚ ምክሮችን ይሰጣል Iroha 3 መጫን.
ያጋጠማችሁት ችግር እዚህ አልተገለጸም፤
እኛን በ [ቴሌግራም](https://t.me/hyperledgeriroha).

## ፈጣን ምርመራዎች {#quick-checks}

አብዛኛዎቹ የመጫኛ ውድቀቶች ከአራት ቦታዎች በአንዱ ይመጣሉ-

- ሀ Rust የስራ ቦታው በከፍተኛ ፍሰት የተጣበቀውን ስሪት ያረጀ የመሳሪያ ሰንሰለት
- `cargo` ወይም `rustc` ወደ ሌላ ተቋም መመለስ `rustup`
- እንደ C ኮምፒተር ያሉ የስርዓት ግንባታ መሳሪያዎች የጎደሉ ፣ `pkg-config`, ወይም CMake
- ምንጭ ከተቀየረ በኋላ አሮጌ የተፈጠሩ ቁርጥራጮች ወይም አካባቢያዊ የግንባታ ቅርሶች
  ማሻሻያዎች

ከ Iroha ምንጭ ማረጋገጫ፣ ከ:

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

ከሆነ `cargo metadata` አልተሳካም ፣ ከመሮጥዎ በፊት አካባቢያዊውን የመሣሪያ ሰንሰለት ያስተካክሉ
`pnpm refresh:iroha --source /path/to/iroha`, ምክንያቱም ማደስ
Kagami የአሁኑን የመረጃ ሞዴል መርሃግብር ለመፍጠር።

## ችግር መፍታት Rust የመሣሪያ ሰንሰለት {#troubleshooting-rust-toolchain}

አንዳንድ ጊዜ ነገሮች እንደታሰቡት አይሄዱም። `rust` በእርስዎ
ሥርዓት ለተወሰነ ጊዜ በፊት, ነገር ግን ማሻሻል አይደለም.
Python: XKCD ይህ ምን እንደሚመስል የሚያሳይ አንድ ታዋቂ ምሳሌ አለው፦

<div class="flex justify-center">

![Python የአካባቢ ችግር መፍታት አስቂኝ](/img/install-troubles.png)

</div>

### ይመልከቱ Rust ስሪት {#check-rust-version}

የአእምሮህንና የኛን ጤና ለመጠበቅ፣
ትክክለኛውን ስሪት አላቸው `cargo` ከትክክለኛው ስሪት ጋር የተያያዘ `rustc`.
የአሁኑ የስራ ቦታ አዋጅ `rust-version = "1.92"` እና pins
መሣሪያ ሰንሰለት ሰርጥ ውስጥ `rust-toolchain.toml`. ስሪቶችን ለማሳየት, ማድረግ

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

ከዚያም

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

ከፍ ያለ ስሪት ካለዎት ደህና ነዎት ዝቅተኛ ስሪት ካለዎ
የሚከተለውን ትዕዛዝ ማካሄድ ይችላሉ:

```bash
$ rustup toolchain update stable
```

### የመጫኛ ቦታን ያረጋግጡ {#check-installation-location}

ዝቅተኛ ስሪት ቁጥሮች ማግኘት ከሆነ **እና** መሣሪያ ሰንሰለት ዘምኗል እና ይህ
አልተሳካም... እስቲ እንበል ይህ የተለመደ ችግር ነው, ነገር ግን ምንም ችግር የለውም
የጋራ መፍትሔ።

በመጀመሪያ ደረጃ፣ መጠቀም የምትፈልገውን ስሪት የት እንደሆነ ማወቅ አለብህ
የተጫነ:

```bash
$ rustup which rustc
$ rustup which cargo
```

የመሳሪያ ሰንሰለቶች ተጠቃሚዎች ተጭነው _አብዛኛውን ጊዜ_ ውስጥ
`~/.rustup/toolchains/stable-*/bin/`. እንዲህ ከሆነ አንተም መሆን ይኖርብሃል
መሮጥ የሚችል

```bash
$ rustup toolchain update stable
```

ይህም ችግሮቻችሁን ሊፈታ ይገባል።

### ነባሪውን ይፈትሹ Rust ስሪት {#check-the-default-rust-version}

ሌላው አማራጭ ደግሞ የዘመኑ መረጃዎችን ማግኘት ነው። `stable` መሣሪያ ሰንሰለት, ነገር ግን
ነባሪ ሆኖ አልተቀመጠም።

```bash
$ rustup default stable
```

ይህ ሊከሰት የሚችለው አንድ `nightly` ስሪት, ወይም የተወሰነ ማዘጋጀት
Rust ስሪት, ነገር ግን ማስወገድ ረሳሁ.

### ሌሎችም ካሉ ይመልከቱ Rust ስሪቶች {#check-if-there-are-other-rust-versions}

ችግሮችን መፍታት ቀጣይነት ያለው ጥንቸል ቀዳዳ, እኛ shell ሊኖረው ይችላል
ስያሜዎች

```bash
$ type rustc
$ type cargo
```

እነዚህ ሩጫ ላይ ሳሉ ያየህትን ሌላ ቦታ የሚያመለክቱ ከሆነ
`rustup which *`, ያኔ ችግር አለብህ።
ብቻ

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

ምክንያቱም ምንም ይሁን ምን ሊሰበር የሚችል ውስጣዊ አመክንዮ አለ
የሻል ስሞችዎን እንደገና ያደራጁ።

ቀላሉ መፍትሔ የማይጠቀሙባቸውን ስሪቶች ማስወገድ ነው።

ቀላል ነው። _አለ_ ከ _የተጠናቀቀ_, ይሁን እንጂ ይህ ሁሉ መከታተልን ያካትታል
የመሳሪያ ስሪቶች rustup በአብዛኛዎቹ ጊዜዎች
ሁለት: የስርዓት ፓኬጅ አስተዳዳሪ ስሪት እና ውስጥ የተጫነ አንድ
በቤት አቃፊዎ ውስጥ ትዕዛዙን ሲሮጡ መደበኛ ቦታ
ለቀዳሚው, የእርስዎን (ሊኑክስ) ያማክሩ
የማከፋፈያ መመሪያ (`apt remove rust`) ለኋለኛው:

```bash
$ rustup toolchain list
```

ከዚያም ለእያንዳንዱ `<toolchain>` (በእርግጥም የኮንጅል አገናኞች ሳይኖሩ)

```bash
$ rustup remove <toolchain>
```

ከዚያ በኋላ, ያረጋግጡ

```bash
$ cargo --help
```

አንድ ትዕዛዝ አልተገኘም ስህተት ያስከትላል, ማለትም ምንም ንቁ Rust
ከዚያም ይሂዱ:

```bash
$ rustup toolchain install stable
```

## ችግር መፍታት Python የመሳሪያ ሰንሰለት {#troubleshooting-python-toolchain}

እርስዎ መጫን ጊዜ Python በፓይፕ ወቅት የሚጠቀሙት የጎማ ጥቅል [Python የደንበኛ ማዋቀር](/am/guide/tutorials/python.md), እንዲህ ያለ ስህተት ሊያጋጥምህ ይችላል፦
"ኢሮሃ_ፒቶን-*.whl በዚህ መድረክ ላይ የሚደገፍ ጎማ አይደለም.

ይህ ስህተት pip ጊዜ ያለፈበት ነው ማለት ነው, ስለዚህ እሱን ማዘመን አለብዎት.
በመጀመሪያ ደረጃ, የእርስዎን OS ለዘመናት እና የስርዓት ማሻሻያዎችን ለማከናወን።

ይህ አይሰራም ከሆነ, አንተ ዘመናዊ ለማድረግ መሞከር ይችላሉ `pip` ለተጠቃሚዎችዎ ማውጫ።

`python -m pip install --upgrade pip`

ያረጋግጡ `pip` ይህን ለማድረግ, አሂድ `whereis pip` እና `/home/username/.local/bin/pip` ካልሆነ የሻልዎን አዘምን `PATH` ተለዋዋጭ።

ችግሩ ከቀጠለ እባክዎን [እኛን ያነጋግሩን](/am/help/) ውጤቱን ሪፖርት አድርጉ።

```
python --version
python3 --version
pip --version
pip3 --version
```
