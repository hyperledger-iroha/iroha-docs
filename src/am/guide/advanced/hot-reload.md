---
translation_locale: am
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 2c71e6c135d862d626d3b184eef3cbed350f1353d7dee78cc129092e7b857924
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ትኩስ ዳግም መጫን Iroha በ Docker ኮንቴይነር {#hot-reload-iroha-in-a-docker-container}

ለአካባቢያዊ debugging ብቻ ሙቅ ዳግም መጫን ይጠቀሙ. ለተለመደው አካባቢያዊ ልማት ምስሉን እንደገና መገንባት ወይም የተፈጠረውን Docker Compose ክምችት ከአዲስ Kagami ጥቅል ዳግም ማስጀመር ይመርጣሉ።

## የባልደረባ ባነሪን ይተካሉ {#replace-the-peer-binary}

ከሊኑክስ ጋር ተኳሃኝ የሆነ ዳይሞን ባናሪ ከስራ ቦታው ይገንቡ:

```bash
cargo build --release -p irohad --target x86_64-unknown-linux-musl
```

በሂደት ላይ ባለው የእኩዮች ኮንቴይነር ውስጥ ቅጂ ያድርጉት, ከዚያም ያንን ኮንቴነር እንደገና ይጀምሩ:

```bash
docker cp target/x86_64-unknown-linux-musl/release/irohad <container>:/usr/local/bin/irohad
docker restart <container>
```

የመያዣውን ስም ለማረጋገጥ `docker ps` ይጠቀሙ። በተፈጠረው ክምችት ውስጥ የእኩዮቹ መያዣዎች በ `./localnet/docker-compose.yml` ተለይተዋል ።

## የዘፍጥረት ዘገባን በአንድ ጊዜ ሊጣሉ በሚችሉ አውታረመረቦች ውስጥ እንደገና ያስገቡ {#recommit-genesis-in-a-disposable-network}

አንድ እኩያ ማከማቻው ባዶ በሚሆንበት ጊዜ ብቻ ጀኔሲስን ይፈጽማል ። ለአንድ ጊዜ የሚጣፍጥ Docker አውታረመረብ ፣ ክምችቱን ያቁሙ ፣ የተፈጠረውን ሁኔታ ያስወግዱ ፣ የተፈረመውን የጀኔሲስ ጥቅል መልሰዋል ወይም ይተካሉ ፣ እና እንደገና ይጀምሩ:

```bash
docker compose -f ./localnet/docker-compose.yml down
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

ሁኔታውን መጠበቅ ያለበት አውታረመረብ ላይ መፈጠራትን አይተካው ።

## ብጁ አወቃቀር ይጠቀሙ {#use-custom-configuration}

የአሁኑ የእኩዮች ውቅር TOML ነው ። የተፈጠሩትን `config.toml` ፣ `genesis.signed.nrt` እና ተዛማጅ ቁልፍ ፋይሎችን ወደ ምስሉ የሚጠበቁ የኮንቴይነር ዱካዎች ያያይዙ ወይም ቅጂ ያድርጉ ፣ ከዚያ እኩያውን እንደገና ይጀምሩ። የተፈጠሩትን ፋይሎች አንድ ላይ ያቆዩ; ከተለያዩ Kagami ሩጫዎች የሚመጡ ፋይሎችን ማደባለቅ የዴሴሪያላይዜሽን ወይም የስምምነት ውድቀቶችን ሊያመጣ ይችላል ።
