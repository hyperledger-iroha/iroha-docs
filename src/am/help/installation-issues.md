---
translation_locale: am
translation_source: /help/installation-issues.md
translation_source_hash: 1a2519123edc5224e720e23ef3e2bc2a7b4dba38ef87af49216c31c054c85a2a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የመጫን ችግሮች {#troubleshooting-installation-issues}

በዚህ ክፍል ውስጥ ለ Iroha 3 መጫን የችግር መፍታት ምክሮችን ይሰጣል። እርስዎ የሚያጋጥሟቸው ችግሮች እዚህ ካልተገለጹ በ [ቴሌግራም ](https://t.me/hyperledgeriroha) በኩል እኛን ያነጋግሩን።

## ፈጣን ምርመራዎች {#quick-checks}

አብዛኛዎቹ የመጫኛ ውድቀቶች ከአራት ቦታዎች በአንዱ ይመጣሉ-

- የ Rust መሳሪያ ሰንሰለት ከስራ ቦታው አናት ላይ ከተቀመጠው ስሪት የበለጠ ዕድሜ ያለው
- `cargo` ወይም `rustc` ከ `rustup` በተለየ ተከላ ውስጥ የሚፈታ
- እንደ C ኮምፓይለር ፣ `pkg-config` ወይም CMake ያሉ የጎደሉ የስርዓት ግንባታ መሳሪያዎች
- የመረጃ ምንጭ ማሻሻያዎችን ከተቀየሩ በኋላ የቆዩ የተፈጠሩ ቁርጥራጮች ወይም አካባቢያዊ የግንባታ ዕቃዎች

ከ Iroha ምንጭ ካሳ ጀምሮ የሚከተሉትን ይጀምሩ:

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

`cargo metadata` ካልተሳካ `pnpm refresh:iroha --source /path/to/iroha` ከመሮጥዎ በፊት አካባቢያዊውን የመሣሪያ ሰንሰለት ያስተካክሉ ፣ ምክንያቱም ማዘመን የአሁኑን የውሂብ ሞዴል መርሃግብር ለማመንጨት Kagami መጠየቅ ይችላል ።

## ችግሮችን መፍታት Rust የመሳሪያ ሰንሰለት {#troubleshooting-rust-toolchain}

አንዳንድ ጊዜ ነገሮች እንደታሰበው አይሄዱም. በተለይ ከጊዜ በፊት በስርዓትዎ ላይ `rust` ካለዎት, ነገር ግን ማሻሻል አላደረጉም. ተመሳሳይ ችግር በ Python ውስጥ ሊከሰት ይችላል: XKCD ምን እንደሚመስል አንድ ታዋቂ ምሳሌ አለው

<div class="flex justify-center">

![Python አካባቢ ችግር መፍታት አስቂኝ](/img/install-troubles.png)

</div>

### የ Rust ስሪት ይመልከቱ {#check-rust-version}

የእርስዎን እና የእኛን ጤናማ አእምሮ ለመጠበቅ ሲሉ, ትክክለኛውን ስሪት ያላቸው መሆኑን ያረጋግጡ `cargo` ከትክክለኛው ስሪት ጋር አብሮ `rustc`. የአሁኑ የስራ ቦታ አቃፊዎች `rust-version = "1.92"` እና መሳሪያ ሰንሰለት ሰርጥ ውስጥ ያጣሉ `rust-toolchain.toml`. ስሪቶች ለማሳየት, ማድረግ

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

ከዚያም

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

ከፍ ያሉ ስሪቶች ካሉዎት ደህና ነዎት። ዝቅተኛ ስሪቶች ካለዎት እሱን ለማዘመን የሚከተለውን ትዕዛዝ ማሄድ ይችላሉ-

```bash
$ rustup toolchain update stable
```

### የመጫኛ ቦታን ያረጋግጡ {#check-installation-location}

የዝቅተኛ ስሪት ቁጥሮች ማግኘት እና መሳሪያ ሰንሰለት ዘምኗል ከሆነ እና  አይሰራም... እስቲ ብቻ እንበል አንድ የተለመደ ችግር ነው, ነገር ግን አንድ የተለመደው መፍትሔ የለም.

በመጀመሪያ, መጠቀም የሚፈልጉት ስሪት የት እንደተጫነ መወሰን አለብዎት:

```bash
$ rustup which rustc
$ rustup which cargo
```

የመሳሪያ ሰንሰለቶች የተጠቃሚ መጫን አብዛኛውን ጊዜ በ `~/.rustup/toolchains/stable-*/bin/` ውስጥ ነው.

```bash
$ rustup toolchain update stable
```

ይህ ደግሞ ችግሮቻችሁን ሊፈታ ይገባል።

### ነባሪውን Rust ስሪት ያረጋግጡ {#check-the-default-rust-version}

ሌላ አማራጭ የዘመነ `stable` የመሳሪያ ሰንሰለት አለዎት, ነገር ግን እንደ ነባሪው አልተቀመጠም. ይሮጡ:

```bash
$ rustup default stable
```

`nightly` ስሪት መጫን ወይም በኋላ ላይ ሳትሰርዝ የተወሰነ Rust ስሪት ማዘጋጀት ይህንን ችግር ሊያስከትል ይችላል ።

### ሌሎች Rust ስሪቶች መኖራቸውን ያረጋግጡ {#check-if-there-are-other-rust-versions}

ችግሮችን ለመፍታት ቀጣይነት ያለው የዕሾች ቀዳዳ, እኛ shell ቅጽል መጠሪያ ሊኖረው ይችላል:

```bash
$ type rustc
$ type cargo
```

እነዚህ `rustup which *` በሚሄድበት ጊዜ ያየኸው ሌላ ቦታን የሚያመለክቱ ከሆነ, ችግር አለህ. እንደነዚህ ያሉ ቅጽል ስሞችን ማከል በቂ እንዳልሆነ ልብ በሉ:

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

ውስጣዊ አመክንዮ አሁንም ቢሆን የሻል ስሞችዎን እንዴት እንዳደራጁ ምንም ይሁን ምን ሊሰበር ይችላል.

በጣም ቀላልው መፍትሔ እርስዎ የማይጠቀሙባቸውን ስሪቶች ማስወገድ ነው።

ሆኖም ግን ከተደረገ ይልቅ ለመናገር ቀላል ነው ፣ ምክንያቱም የተጫኑትን እና ለእርስዎ የሚገኙትን የ rustup ሁሉንም ስሪቶች መከታተል ያስከትላል ። ብዙውን ጊዜ ሁለት ብቻ አሉ የስርዓት ፓኬጅ አስተዳዳሪ ስሪት እና በቤትዎ አቃፊ ውስጥ ባለው መደበኛ ቦታ ላይ የተጫነውን በዚህ ትምህርት መጀመሪያ ላይ ትዕዛዙን ሲሮጡ ። ለቀድሞው ፣ የ (ሊኑክስ) ስርጭት መመሪያዎን ይመልከቱ ፣ (`apt remove rust`። ለኋለኛው ፣ ይሂዱ:

```bash
$ rustup toolchain list
```

እና ከዚያም, ለእያንዳንዱ `<toolchain>` (በእርግጥ ማዕዘን ክፈፎች ያለ):

```bash
$ rustup remove <toolchain>
```

የመሳሪያ ሰንሰለቶችን ካስወገዱ በኋላ ይህ ትዕዛዝ አልተገኘም የሚል ስህተት ሪፖርት ማድረግ አለበት-

```bash
$ cargo --help
```

ይህ ስህተት ምንም ንቁ Rust መሣሪያ ሰንሰለት አልተጫነም መሆኑን ያረጋግጣል. ከዚያም ይሂዱ:

```bash
$ rustup toolchain install stable
```

## የመሳሪያ ሰንሰለት Python የችግር መፍታት {#troubleshooting-python-toolchain}

በ [Python የደንበኛ ማዋቀር ](/am/guide/tutorials/python.md) ወቅት ፒፕን በመጠቀም የ Python ጎማ ጥቅልን በሚጭኑበት ጊዜ "iroha_python-*.whl በዚህ መድረክ ላይ የሚደገፍ ጎማ አይደለም" የሚል ስህተት ሊያጋጥምዎት ይችላል ።

ይህ ስህተት pip ጊዜ ያለፈበት ነው ማለት ነው, ስለዚህ እሱን ማዘመን አለብዎት. በመጀመሪያ ደረጃ, የእርስዎን OS ዝማኔዎች ለመፈተሽ እና የስርዓት ማሻሻያ ለማከናወን ይመከራል.

ይህ አይሰራም ከሆነ, የእርስዎን ተጠቃሚ ማውጫ `pip` ለማዘመን መሞከር ይችላሉ.

`python -m pip install --upgrade pip`

ያረጋግጡ `pip` ይህን ለማድረግ, አሂድ `whereis pip` እና `/home/username/.local/bin/pip` ከመንገዶቹ መካከል ነው. ካልሆነ, የእርስዎ shell ዘምኗል `PATH` ተለዋዋጭ።

ችግሩ ከቀጠለ እባክዎ [ እኛን ](/am/help/) ያነጋግሩን እና ውጤቱን ሪፖርት ያድርጉ።

```
python --version
python3 --version
pip --version
pip3 --version
```
