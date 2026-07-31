---
translation_locale: am
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 77780600fa59ba353e2aa79fb339adb6a02f7ac731e04cd0d5f51821ec54e794
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# እየሮጠ Iroha በባዶ ብረት ላይ {#running-iroha-on-bare-metal}

ይህን የስራ ፍሰት ይጠቀሙ እናንተ አስተናጋጆች ላይ በቀጥታ እኩዮች ለማሄድ ከፈለጉ ይልቅ
በኩል Docker Compose. የአሁኑ ምንጭ ዛፍ ይሰጣል Kagami ማመንጫዎች
የሚዛመዱትን ጀነሲስ፣ የእኩዮች ውቅር፣ የደንበኞችን ውቅር እና የመጀመር/የማቆም ስክሪፕቶችን ይፃፉ።

## 1. ባይናሪዎችን መገንባት {#_1-build-the-binaries}

ከዋና ጅረት Iroha የሥራ ቦታ:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

ይህም የሚከተሉትን ያስገኛል፦

- `target/release/irohad` ለባልደረባ ዳሚን
- `target/release/iroha` ለ CLI
- `target/release/kagami` ለቁልፍ፣ ለጄኔሲስ እና ለአካባቢያዊ አውታረ መረብ ማመንጫ

## 2. አካባቢያዊ አውታረ መረብ መፍጠር {#_2-generate-a-local-network}

አንድ አራት-አቻ ማመንጨት Iroha 3 localnet:

```bash
target/release/kagami localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

የውጤት ማውጫ የተፈጠሩትን ይዟል `genesis.json`,
`genesis.signed.nrt`, እኩዮች `config.toml` መዝገቦች፣ `client.toml`, ረዳት ስክሪፕቶች፣
እና የተፈጠረ `README.md` ለዚያ ጥቅል ትክክለኛ ትዕዛዞች ጋር.

## 3. እኩዮች መጀመራቸው {#_3-start-peers}

ለተፈጠረው የአንድ ጊዜ ነጠላ አካባቢያዊኔት የተፈጠረውን ስክሪፕት ይጠቀሙ:

```bash
./localnet/start.sh
```

እያንዳንዱን እኩዮች እንደ አንድ ሂደት አስተዳዳሪ ውስጥ ለማስተላለፍ ከፈለጉ systemd, አጠቃቀም
በ ውስጥ ተመዝግቧል `./localnet/README.md` ለእያንዳንዱ እኩዮች።
የባልደረባ `config.toml`, የግል ቁልፍ፣ የማከማቻ ማውጫ እና ወደቦች ተለይተው።

## 4. አውታረ መረቡን ማስተዳደር {#_4-operate-the-network}

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

- አዲስ የግል ቁልፎችን ለማምረት እና ከቤት ውጭ ማከማቸት
  ማከማቻ።
- ሁሉም እኩዮች ተመሳሳይ ፊርማ የተደረገበት የጀኔስ ግብይት፣ ቶፖሎጂ
  የታመኑ እኩዮች፣ እና ማረጋገጫ ሰጪ PoPs.
- የአድማጩ አድራሻዎችን ከአስተናጋጅ-አካባቢያዊ በይነገጾች ጋር ብቻ ያገናኙ
  ከሌሎች ማሽኖች ሊደረስባቸው አይችሉም ።
- ለ Torii ተፅዕኖ፣ መሰረታዊ ውጤት፣ TLS, እና ተመን
  ውስንነት።
- የመነሻ ወይም የስምምነት ቶፖሎጂ ለውጦችን የተቀናጀ ፍልሰቶች አድርገው ይመለከቱ ፣ አይደለም
  ነጠላ የፋይል አርትዖቶች።

ለኮንቴይነር አካባቢያዊ ልማት [ማስጀመሪያ Iroha 3](../../get-started/launch-iroha.md)
Docker Compose የስራ ፍሰት.
