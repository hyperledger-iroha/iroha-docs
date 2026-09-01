---
translation_locale: am
translation_source: /get-started/launch-iroha.md
translation_source_hash: 63eed8f987d33a487bb6329266eacbc09d10bb429027413997957579e31e80b4
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# አስጀምር Iroha 3 {#launch-iroha-3}

ይህ ገጽ ከላይኛው ማከማቻ ነባሪ የስራ ቦታ ንብረቶችን በመጠቀም ለ Iroha 3 አሁን ባለው የአካባቢያዊ-አውታረ መረብ ፍሰት ውስጥ ያልፋል።

## 1. የአካባቢ ባለብዙ አቻ አውታረ መረብ ይፍጠሩ {#_1-generate-a-local-multi-peer-network}

ከአሁኑ Kagami ኮድ ባለአራት አቻ localnet ይፍጠሩ -

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

የውጤት ማውጫው ተዛማጅ የአውታረ መረብ አቻ ውቅሮችን፣ `genesis.json`፣ `genesis.signed.nrt`፣ `client.toml` እና ረዳት ስክሪፕቶችን ይዟል።

ለቤተኛ የአካባቢ የመጀመሪያ የስራ ሙከራ፣ የመነጨውን የአውታረ መረብ እኩዮች በቀጥታ ይጀምሩ -

```bash
./localnet/start.sh
```

ለኮንቴይነር አሂድ፣ ከተመሳሳይ localnet ማውጫ Compose ይፍጠሩ -

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./docker-compose.yml \
  --force

docker compose -f ./docker-compose.yml up
```

ነባሪው የመነጨው ቁልል ያጋልጣል -

- የአውታረ መረብ አቻ P2P ወደቦች `1337` ወደ `1340`
- Torii HTTP ወደቦች `8080` ወደ `8083`
- ዝግጁ የሆነ የደንበኛ ውቅር በ `./localnet/client.toml`

## 2. አውታረ መረቡ መጠናቀቁን ያረጋግጡ {#_2-verify-that-the-network-is-up}

በመጀመሪያው የአውታረ መረብ አቻ ላይ ያለውን ሁኔታ API የመጨረሻ ነጥብ ያረጋግጡ -

```bash
curl http://127.0.0.1:8080/status
```

ነባሪ የጤና ፍተሻዎች እንዲሁ ይጠቀሙ -

```bash
curl http://127.0.0.1:8080/status/blocks
```

ወዲያውኑ CLI በተጠቀለለው የደንበኛ ውቅር ላይ መጠቆም ይችላሉ -

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus መገለጫ {#_3-nexus-profile}

ማከማቻው በ`defaults/nexus/` ስር SORA Nexus ተኮር የውቅረት መገለጫ ይልካል።

ቤተኛ የአውታረ መረብ አቻ ከ Nexus መገለጫ ጋር ለማስኬድ -

```bash
./target/release/iroha3d --sora --config ./defaults/nexus/config.toml
```

ለዚያ መገለጫ CLI መዳረሻ `defaults/nexus/client.toml` ይጠቀሙ።

## 4. የአካባቢውን አውታረ መረብ ያቁሙ {#_4-stop-the-local-network}

ለቤተኛ የመነጨ የአካባቢ መረብ -

```bash
./localnet/stop.sh
```

ለተፈጠረው የ ጽሁፍ ቁልል -

```bash
docker compose -f ./docker-compose.yml down
```

አውታረ መረቡ ከሰራ በኋላ በ [Iroha 3 በ CLI በኩል ያሂዱ](/am/get-started/operate-iroha-via-cli.md) ይቀጥሉ።
