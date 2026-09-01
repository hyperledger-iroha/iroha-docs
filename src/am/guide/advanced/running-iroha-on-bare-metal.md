---
translation_locale: am
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 648e69f2a572a0bb3e88919831774d21c1a17438b8bde742224a1457880539c1
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# በባዶ ብረት ላይ Iroha መሮጥ {#running-iroha-on-bare-metal}

በ Docker Compose ሳይሆን የአውታረ መረብ እኩዮችን በቀጥታ በአስተናጋጆች ላይ ማስኬድ ሲፈልጉ ይህንን የስራ ሂደት ይጠቀሙ። የአሁኑ የምንጭ ዛፍ ተዛማጅ የብሎክቼይን ጀነሲስ፣ የአውታረ መረብ አቻ ውቅረቶች፣ የደንበኛ ውቅር እና የጅምር/ማቆሚያ ስክሪፕቶችን የሚጽፉ Kagami ጀነሬተሮችን ያቀርባል።

## 1. ሁለትዮሽ ይገንቡ {#_1-build-the-binaries}

ከላይ Iroha የስራ ቦታ -

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

ይህ የሚያመርተው -

- `target/release/iroha3d` ለአውታረ መረብ አቻ ዴሞን
- `target/release/iroha` ለ CLI
- `target/release/kagami` ለቁልፍ፣ ለብሎክቼይን ጀነሲስ እና ለlocalnet ትውልድ

## 2. የአካባቢ አውታረ መረብ ይፍጠሩ {#_2-generate-a-local-network}

ባለአራት አቻ Iroha 3 localnet ይፍጠሩ

```bash
target/release/kagami localnet --peers 4 --out-dir ./localnet
```

የውጤት ማውጫው የመነጨውን `genesis.json`፣ `genesis.signed.nrt`፣ የአውታረ መረብ አቻ `config.toml` ፋይሎች፣ `client.toml`፣ አጋዥ ስክሪፕቶች እና የመነጨ `README.md` ለዚያ ጥቅል ትክክለኛ ትዕዛዞችን ይዟል።

## 3. የአውታረ መረብ እኩዮችን ይጀምሩ {#_3-start-peers}

ለተፈጠረ የሚጣል localnet፣ የመነጨውን ስክሪፕት ይጠቀሙ -

```bash
./localnet/start.sh
```

እያንዳንዱን የአውታረ መረብ አቻ እንደ systemd ወዳለው የሂደት አስተዳዳሪ ማገናኘት ከፈለጉ ለእያንዳንዱ የአውታረ መረብ አቻ በ`./localnet/README.md` የተመዘገበውን የማስጀመሪያ ትዕዛዝ ይጠቀሙ። የእያንዳንዱን የአውታረ መረብ አቻ `config.toml`፣ የግል ቁልፍ፣ የማከማቻ ማውጫ እና ወደቦች ይለያዩ።

## 4. አውታረ መረቡን ያሂዱ {#_4-operate-the-network}

የተፈጠረውን የደንበኛ ውቅር ይጠቀሙ -

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

የመነጨውን localnet በ

```bash
./localnet/stop.sh
```

## 5. የምርት ማስታወሻዎች {#_5-production-notes}

- ለምርት አካባቢ አዲስ የግል ቁልፎችን ያመንጩ እና ከኮድ ማከማቻው ውጭ ያከማቹ።
- እያንዳንዱ የአውታረ መረብ አቻ በተመሳሳይ የተፈረመ የብሎክቼይን ጀነሲስ ግብይት፣ ቶፖሎጂ፣ የታመኑ የአውታረ መረብ እኩዮች እና አረጋጋጭ PoPs ላይ እንዲስማሙ ያድርጉ።
- የአድማጭ አድራሻዎችን ከአስተናጋጅ-አካባቢያዊ በይነገጾች ጋር ያያይዙት የአውታረ መረብ አቻው ከሌሎች ማሽኖች ሊደረስበት በማይችልበት ጊዜ ብቻ ነው።
- ለ Torii መጋለጥ፣ መሰረታዊ ማድረግ፣ TLS እና የፍጥነት ገደብ የተገላቢጦሽ ፕሮክሲ ወይም ፋየርዎል ይጠቀሙ።
- በብሎክቼይን ጀነሲስ ወይም በስምምነት ቶፖሎጂ ላይ የተደረጉ ለውጦችን እንደ የተቀናጁ ፍልሰት አድርገው ይያዙት እንጂ ነጠላ-አቻ ፋይል አርትዖቶች አይደሉም።

ለኮንቴይነር የአካባቢ ልማት፣ የ[አስጀምር Iroha 3](../../get-started/launch-iroha.md) Docker Compose የስራ ሂደትን ይጠቀሙ።
