---
translation_locale: am
translation_source: /help/installation-issues.md
translation_source_hash: 1a2519123edc5224e720e23ef3e2bc2a7b4dba38ef87af49216c31c054c85a2a
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# የመጫን ችግሮችን መላ መፈለግ {#troubleshooting-installation-issues}

ይህ ክፍል ለ Iroha 3 ጭነት የመላ መፈለጊያ ምክሮችን ይሰጣል። እያጋጠመዎት ያለው ችግር እዚህ ካልተገለጸ፣ በ[ቴሌግራም](https://t.me/hyperledgeriroha) በኩል ያግኙን።

## ፈጣን ፍተሻዎች {#quick-checks}

አብዛኛዎቹ የመጫኛ ውድቀቶች ከአራት ቦታዎች ከአንዱ ይመጣሉ -

- በላይኛው የስራ ቦታ ከተሰካው ስሪት የቆየ Rust የመሳሪያ ሰንሰለት
- `cargo` ወይም `rustc` ከ `rustup` የተለየ ጭነት መፍታት
- እንደ C compiler፣ `pkg-config` ወይም CMake ያሉ የስርዓት ግንባታ መሳሪያዎች ይጎድላሉ
- የምንጭ ክለሳዎችን ከቀየሩ በኋላ የቆዩ ቅንጥቦች ወይም የአካባቢ ግንባታ አርቲፋክቶች

ከ Iroha ምንጭ-ኮድ የስራ ቅጂ፣ በሚከተሉት ይጀምሩ -

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

`cargo metadata` ካልተሳካ፣ `pnpm refresh:iroha --source /path/to/iroha` ከማስኬድዎ በፊት የአካባቢውን የመሳሪያ ሰንሰለት ያስተካክሉ፣ ምክንያቱም ማደሱ የአሁኑን የውሂብ-ሞዴል እቅድ ለማመንጨት Kagami ሊጠራ ይችላል።

## መላ መፈለግ Rust የመሳሪያ ሰንሰለት {#troubleshooting-rust-toolchain}

አንዳንድ ጊዜ ነገሮች እንደታቀደው አይሄዱም። በተለይ ከጥቂት ጊዜ በፊት በስርዓትዎ ላይ `rust` ካለዎት ነገር ግን ካላሻሻሉ። ተመሳሳይ ችግር በ Python ውስጥ ሊከሰት ይችላል XKCD ምን ሊመስል እንደሚችል ታዋቂ ምሳሌ አለው -

<div class="flex justify-center">

![Python የአካባቢ መላ መፈለጊያ አስቂኝ](/img/install-troubles.png)

</div>

### Rust ስሪትን ያረጋግጡ {#check-rust-version}

ሁለቱንም እና የኛን ጤንነት ለመጠበቅ ሲባል፣ ትክክለኛው የ`cargo` ስሪት ከትክክለኛው የ`rustc` ስሪት ጋር የተጣመረ መሆኑን ያረጋግጡ። የአሁኑ የላይኛው ተፋሰስ የስራ ቦታ `rust-version = "1.92"` ያውጃል እና የመሳሪያ ሰንሰለት ቻናሉን በ `rust-toolchain.toml` ውስጥ ይሰካዋል። ስሪቶቹን ለማሳየት ያድርጉ

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

እና ከዚያ

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

ከፍ ያሉ ስሪቶች ካሉዎት ደህና ነዎት። ዝቅተኛ ስሪቶች ካሉዎት እሱን ለማዘመን የሚከተለውን ትዕዛዝ ማሄድ ይችላሉ።

```bash
$ rustup toolchain update stable
```

### የመጫኛ ቦታን ያረጋግጡ {#check-installation-location}

ዝቅተኛ የስሪት ቁጥሮችን ካገኙ እና የመሳሪያ ሰንሰለቱን ካዘመኑ እና ካልሰራ... የተለመደ ችግር ነው እንበል ግን የጋራ መፍትሄ የለውም።

በመጀመሪያ ፣ ሊጠቀሙበት የሚፈልጉት ስሪት የት እንደተጫነ መወሰን አለብዎት -

```bash
$ rustup which rustc
$ rustup which cargo
```

የመሳሪያ ሰንሰለቶች የተጠቃሚ ጭነቶች ብዙውን ጊዜ በ `~/.rustup/toolchains/stable-*/bin/` ውስጥ ናቸው. ጉዳዩ ይህ ከሆነ, መሮጥ መቻል አለብዎት

```bash
$ rustup toolchain update stable
```

እና ያ ችግሮችዎን ማስተካከል አለበት.

### ነባሪውን Rust ስሪት ያረጋግጡ {#check-the-default-rust-version}

ሌላው አማራጭ የዘመነው `stable` የመሳሪያ ሰንሰለት እንዳለህ ነው፣ ነገር ግን እንደ ነባሪ አልተዋቀረም። አሂድ

```bash
$ rustup default stable
```

የ`nightly` ስሪት መጫን ወይም የተወሰነ Rust ስሪት ማቀናበር በኋላ ላይ ሳያዋቅር ይህንን ችግር ሊያስከትል ይችላል።

### ሌሎች Rust ስሪቶች ካሉ ያረጋግጡ {#check-if-there-are-other-rust-versions}

የመላ መፈለጊያ ጥንቸል ጉድጓድ በመቀጠል፣ የሼል ተለዋጭ ስሞች ሊኖረን ይችላል -

```bash
$ type rustc
$ type cargo
```

እነዚህ `rustup which *` ሲያሄዱ ካዩት ቦታ ውጪ የሚያመለክቱ ከሆነ ችግር አለብዎት። እንደነዚህ ያሉ ተለዋጭ ስሞችን ማከል በቂ እንዳልሆነ ልብ ይበሉ -

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

የሼል ተለዋጭ ስሞችዎን እንዴት ቢያዘጋጁ ውስጣዊ አመክንዮ አሁንም ሊሰበር ይችላል።

በጣም ቀላሉ መፍትሔ እርስዎ የማይጠቀሙባቸውን ስሪቶች ማስወገድ ነው.

ነገር ግን ሁሉንም የተጫኑትን እና ለእርስዎ የሚገኙትን የ rustup ስሪቶች መከታተልን ስለሚያካትት ከመናገር ይልቅ ቀላል ነው። ብዙውን ጊዜ ሁለት ብቻ አሉ - በዚህ አጋዥ ስልጠና መጀመሪያ ላይ ትዕዛዙን ሲያሄዱ የስርዓት ጥቅል አስተዳዳሪ ስሪት እና በቤትዎ አቃፊ ውስጥ ወደ መደበኛው ቦታ የተጫነው። ለቀድሞው፣ የእርስዎን (ሊኑክስ) ስርጭት መመሪያ (`apt remove rust`) ያማክሩ። ለኋለኛው ያሂዱ -

```bash
$ rustup toolchain list
```

እና ከዚያ፣ ለእያንዳንዱ `<toolchain>` (ያለ የማዕዘን ቅንፎች በእርግጥ)

```bash
$ rustup remove <toolchain>
```

የመሳሪያ ሰንሰለቶችን ካስወገዱ በኋላ ይህ ትዕዛዝ ያልተገኘ ስህተት ማሳየት አለበት -

```bash
$ cargo --help
```

ያ ስህተት ምንም ንቁ Rust የመሳሪያ ሰንሰለት እንደተጫነ ያረጋግጣል። ከዚያ አሂድ -

```bash
$ rustup toolchain install stable
```

## መላ መፈለግ Python የመሳሪያ ሰንሰለት {#troubleshooting-python-toolchain}

በ[Python የደንበኛ ማዋቀር](/am/guide/tutorials/python.md) ጊዜ ፒፕን በመጠቀም የ Python ዊል ጥቅልን ሲጭኑ እንደ "iroha_python-*.whl በዚህ መድረክ ላይ የሚደገፍ ጎማ አይደለም" የሚል ስህተት ሊያጋጥምዎት ይችላል።

ይህ ስህተት ፒፕ ጊዜው ያለፈበት ነው ማለት ነው, ስለዚህ ማዘመን ያስፈልግዎታል. በመጀመሪያ ደረጃ, የእርስዎን OS ለዝማኔዎች ለመፈተሽ እና የስርዓት ማሻሻያ እንዲያደርጉ ይመከራል.

ይህ የማይሰራ ከሆነ ለተጠቃሚ ማውጫዎ `pip`ን ለማዘመን መሞከር ይችላሉ።

`python -m pip install --upgrade pip`

`pip` በቤትዎ ማውጫ ውስጥ መጫኑን ያረጋግጡ። ይህንን ለማድረግ `whereis pip`ን ያሂዱ እና `/home/username/.local/bin/pip` ከመንገዶቹ መካከል መሆኑን ያረጋግጡ። ካልሆነ፣ የሼልዎን `PATH` ተለዋዋጭ ያዘምኑ።

ጉዳዩ ከቀጠለ፣ እባክዎን [ያነጋግሩን](/am/help/) እና ውጤቶቹን ሪፖርት ያድርጉ።

```
python --version
python3 --version
pip --version
pip3 --version
```
