---
translation_locale: am
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 77780600fa59ba353e2aa79fb339adb6a02f7ac731e04cd0d5f51821ec54e794
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# በባዶ ብረት Iroha ላይ እየሮጠ {#running-iroha-on-bare-metal}

በ Docker Compose በኩል ሳይሆን በቀጥታ በአስተናጋጆች ላይ እኩዮችን ማሄድ በሚፈልጉበት ጊዜ ይህንን የስራ ፍሰት ይጠቀሙ። የአሁኑ ምንጭ ዛፍ ተዛማጅ ጅምር ፣ የእኩዮች ውቅር ፣ የደንበኛ ውቅር እና የመጀመር / የማቆም ስክሪፕቶችን የሚጽፉ Kagami ጀነሬተሮችን ይሰጣል ።

## 1. የሁለትዮሽ ስልቶችን መገንባት {#_1-build-the-binaries}

ከፕሮግራሙ Iroha የሥራ ቦታ:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

ይህም የሚከተሉትን ያመጣል፦

- `target/release/irohad` ለባልደረባ ዳይሞን
- `target/release/iroha` ለ CLI
- `target/release/kagami` ለቁልፍ፣ ለጄኔሲስ እና ለአካባቢያዊ አውታረ መረብ ማመንጫ

## 2. አካባቢያዊ አውታረ መረብ መፍጠር {#_2-generate-a-local-network}

የአራት እኩዮች Iroha 3 አካባቢያዊ አውታረ መረብ መፍጠር:

```bash
target/release/kagami localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

የውጤት ማውጫ የተፈጠረውን ይዟል `genesis.json`, `genesis.signed.nrt`, የእኩዮች `config.toml` መዝገቦች፣ `client.toml`, ረዳት ስክሪፕቶች፣ እና የተፈጠረ `README.md` ለዚያ ክምችት ትክክለኛ ትዕዛዞችን ጋር።

## 3. እኩዮችን ይጀምሩ {#_3-start-peers}

ለተፈጠረው የአንድ ጊዜ ነጠላ አካባቢያዊኔት የተፈጠረውን ስክሪፕት ይጠቀሙ፡-

```bash
./localnet/start.sh
```

እያንዳንዱን እኩያ እንደ systemd ባሉ የሂደት አስተዳዳሪ ውስጥ ማሰራት ከፈለጉ ለእያንዳንዱ እኩያ በ `./localnet/README.md` ላይ የተመዘገበውን የመነሻ ትዕዛዝ ይጠቀሙ። የእያንዳንዱን እኩዮች `config.toml` ፣ የግል ቁልፍ ፣ የማከማቻ ማውጫ እና ወደቦች ለየብቻ ያቆዩ ።

## 4. አውታረ መረቡን ማስተዳደር። {#_4-operate-the-network}

የተፈጠረውን የደንበኛ ውቅር ይጠቀሙ:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

የተፈጠረውን አካባቢያዊ አውታረ መረብ በ:

```bash
./localnet/stop.sh
```

## 5. የምርት ማስታወሻዎች {#_5-production-notes}

- ለምርቱ አዲስ የግል ቁልፎችን ያመነጩ እና ከማከማቻው ውጭ ያስቀምጧቸው ።
- ሁሉም እኩዮች ተመሳሳይ የተፈረመ የጄኔሲስ ግብይት ፣ ቶፖሎጂ ፣ የታመኑ እኩያዎች እና ማረጋገጫ PoPs ላይ ይስማሙ ።
- አቻው ከሌሎች ማሽኖች ሊደረስበት በማይችልበት ጊዜ ብቻ አስተናጋጅ-አካባቢያዊ በይነገጾች ላይ አድማጩን ያገናኙ።
- ለ Torii ተጋላጭነት, መሰረታዊ auth, TLS እና የፍጥነት ገደብ የኋላ ወኪል ወይም የእሳት ግድግዳ ይጠቀሙ.
- በጄኔሲስ ወይም በስምምነት ቶፖሎጂ ላይ የተደረጉ ለውጦችን እንደ የተቀናጀ ፍልሰቶች እንጂ ነጠላ-አቻ የፋይል አርትዖቶች አይይዙ።

ለኮንቴይነር አካባቢያዊ ልማት የ [ጀምር Iroha 3](../../get-started/launch-iroha.md) Docker Compose የስራ ፍሰት ይጠቀሙ.
