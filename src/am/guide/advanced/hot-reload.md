---
translation_locale: am
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ትኩስ ዳግም መጫን Iroha በ Docker ኮንቴይነር {#hot-reload-iroha-in-a-docker-container}

ለአካባቢያዊ debugging ብቻ ሙቅ ዳግም መጫን ይጠቀሙ. ለተለመደው አካባቢያዊ ልማት ምስሉን እንደገና መገንባት ወይም የተፈጠረውን Docker Compose ክምችት ከአዲስ Kagami ጥቅል ዳግም ማስጀመር ይመርጣሉ።

## የባልደረባ ባነሪን ይተካሉ {#replace-the-peer-binary}

ከሊኑክስ ጋር ተኳሃኝ የሆነ ዳይሞን ባናሪ ከስራ ቦታው ይገንቡ:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

በሂደት ላይ ባለው የእኩዮች ኮንቴይነር ውስጥ ቅጂ ያድርጉት, ከዚያም ያንን ኮንቴነር እንደገና ይጀምሩ:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

የመያዣውን ስም ለማረጋገጥ `docker ps` ይጠቀሙ። በተፈጠረው ክምችት ውስጥ የእኩዮቹ መያዣዎች በ `./docker-compose.yml` ተለይተዋል ።

## የዘፍጥረት ዘገባን በአንድ ጊዜ ሊጣሉ በሚችሉ አውታረመረቦች ውስጥ እንደገና ያስገቡ {#recommit-genesis-in-a-disposable-network}

አንድ እኩያ ማከማቻው ባዶ በሚሆንበት ጊዜ ብቻ ጀኔሲስን ይፈጽማል ። ለአንድ ጊዜ የሚጣፍጥ Docker አውታረመረብ ፣ ክምችቱን ያቁሙ ፣ የተፈጠረውን ሁኔታ ያስወግዱ ፣ የተፈረመውን የጀኔሲስ ጥቅል መልሰዋል ወይም ይተካሉ ፣ እና እንደገና ይጀምሩ:

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

ሁኔታውን መጠበቅ ያለበት አውታረመረብ ላይ መፈጠራትን አይተካው ።

## ብጁ አወቃቀር ይጠቀሙ {#use-custom-configuration}

የአሁኑ የእኩዮች ውቅር TOML ነው ። የተፈጠሩትን `config.toml` ፣ `genesis.signed.nrt` እና ተዛማጅ ቁልፍ ፋይሎችን ወደ ምስሉ የሚጠበቁ የኮንቴይነር ዱካዎች ያያይዙ ወይም ቅጂ ያድርጉ ፣ ከዚያ እኩያውን እንደገና ይጀምሩ። የተፈጠሩትን ፋይሎች አንድ ላይ ያቆዩ; ከተለያዩ Kagami ሩጫዎች የሚመጡ ፋይሎችን ማደባለቅ የዴሴሪያላይዜሽን ወይም የስምምነት ውድቀቶችን ሊያመጣ ይችላል ።
