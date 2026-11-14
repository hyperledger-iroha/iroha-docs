---
translation_locale: am
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: d4fd88de377b9c88e0293ed07f307ad38c3f8b05ed898fd051c5bfb738d66681
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# ትኩስ ዳግም ጫን Iroha በ Docker መያዣ ውስጥ {#hot-reload-iroha-in-a-docker-container}

ለአካባቢያዊ ማረም ብቻ ትኩስ ዳግም መጫን ይጠቀሙ። ለመደበኛ የአካባቢ ልማት ምስሉን እንደገና መገንባት ወይም የተፈጠረውን Docker Compose ቁልል ከአዲስ Kagami ጥቅል እንደገና ማስጀመርን ይመርጣሉ።

## የአውታረ መረብ አቻውን ይተኩ ሁለትዮሽ {#replace-the-peer-binary}

ከላይኛው የስራ ቦታ ከሊኑክስ ጋር ተኳሃኝ የሆነ ዴሞን ሁለትዮሽ ይገንቡ -

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

ወደ ሩጫ የአውታረ መረብ አቻ ኮንቴይነር ይቅዱት እና ከዚያ ያንን መያዣ እንደገና ያስጀምሩት -

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

የመያዣውን ስም ለማረጋገጥ `docker ps` ይጠቀሙ። በተፈጠረው ቁልል ውስጥ የአውታረ መረብ አቻ ኮንቴይነሮች በ `./docker-compose.yml` ይገለፃሉ።

## ሊጣል በሚችል አውታረ መረብ ውስጥ የብሎክቼይን ጀነሲስን እንደገና ይፈጽሙ {#recommit-genesis-in-a-disposable-network}

የአውታረ መረብ አቻ የብሎክቼይን ጀነሲስን የሚያጠናቅቀው ማከማቻው ባዶ ሲሆን ብቻ ነው። ሊጣል ለሚችል Docker አውታረ መረብ፣ ቁልሉን ያቁሙ፣ የተፈጠረውን ሁኔታ ያስወግዱ፣ የተፈረመውን የብሎክቼይን ጀነሲስ ቅርቅብ እንደገና ያድሱ ወይም ይተኩ እና እንደገና ይጀምሩ -

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

ግዛቱ ተጠብቆ መቆየት ያለበት አውታረ መረብ ላይ የብሎክቼይን ጀነሲስን አይተኩ።

## ብጁ ውቅረትን ተጠቀም {#use-custom-configuration}

የአሁኑ የአውታረ መረብ አቻ ውቅር TOML ነው። የመነጨውን `config.toml`፣ `genesis.signed.nrt` እና ተዛማጅ ቁልፍ ፋይሎችን በ በሚጠበቀው የእቃ መያዣ ዱካዎች ውስጥ ይጫኑ ወይም ይቅዱ ምስል፣ ከዚያ የአውታረ መረብ አቻውን እንደገና ያስጀምሩ። የተፈጠሩትን ፋይሎች አንድ ላይ ያስቀምጡ; ከተለያዩ Kagami ሩጫዎች ፋይሎችን መቀላቀል ተከታታይ ወይም የጋራ መግባባት ውድቀቶችን ሊያስከትል ይችላል።
