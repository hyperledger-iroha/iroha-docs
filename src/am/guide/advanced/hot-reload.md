---
translation_locale: am
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 2c71e6c135d862d626d3b184eef3cbed350f1353d7dee78cc129092e7b857924
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ሞቃት ዳግም ጭነት Iroha በ Docker መያዣ {#hot-reload-iroha-in-a-docker-container}

ለአካባቢያዊ debugging ብቻ ሙቅ ዳግም መጫን ይጠቀሙ.
ምስሉን እንደገና መገንባት ወይም የተፈጠረውን ዳግም ማስጀመር Docker Compose ከ አንድ
ትኩስ Kagami አሽከርካሪ።

## የእኩዮች ባነሪን ይተካሉ {#replace-the-peer-binary}

ከሊነክስ ጋር ተኳሃኝ የሆነ ዳይሞን ባናሪ ከስራ ቦታው ይገንቡ:

```bash
cargo build --release -p irohad --target x86_64-unknown-linux-musl
```

በሂደት ላይ ወደሚገኝ የእኩዮች ኮንቴይነር ቅጂ ያድርጉት፣ ከዚያም ያንን ኮንቴነር ዳግም ይጀምሩ:

```bash
docker cp target/x86_64-unknown-linux-musl/release/irohad <container>:/usr/local/bin/irohad
docker restart <container>
```

አጠቃቀም `docker ps` የተፈጠረውን ክምችት ውስጥ አቻው
መያዣዎች በ `./localnet/docker-compose.yml`.

## ጄኔሲን በአንድ ጊዜ የሚጣሉ አውታረመረብ ውስጥ እንደገና ያስገቡ {#recommit-genesis-in-a-disposable-network}

አንድ እኩያ የጄኔሲስን ሥራ የሚፈጽምበት ቦታ ባዶ በሚሆንበት ጊዜ ብቻ ነው። Docker
አውታረ መረብ, አቃፊውን ያቁሙ, የተፈጠረውን ሁኔታ ያስወግዱ, መልሶ ማቋቋም ወይም መተካት
የተፈረመ የጄኔሲስ ጥቅል, እና እንደገና ይጀምሩ:

```bash
docker compose -f ./localnet/docker-compose.yml down
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

ሁኔታውን መጠበቅ ያለበት አውታረመረብ ላይ መፈጠራትን አትተካ።

## ብጁ አወቃቀር ይጠቀሙ {#use-custom-configuration}

የአሁኑ የእኩዮች ውቅር ነው TOML. የተፈጠረውን ማሰሪያ አገናኝ ወይም ቅጂ
`config.toml`, `genesis.signed.nrt`, እና ተዛማጅ ቁልፍ ፋይሎች ወደ መያዣው ውስጥ
ምስሉ የሚጠብቀው መንገድ, ከዚያም እኩዮች ዳግም ማስጀመር. የተፈጠሩ ፋይሎችን ጠብቅ
በአንድ ላይ፤ ከተለያዩ ፋይሎች መቀላቀል Kagami ሩጫዎች deserialization ሊያመጣ ይችላል ወይም
የስምምነት ውድቀቶች።
