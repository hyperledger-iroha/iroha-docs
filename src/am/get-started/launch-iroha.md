---
translation_locale: am
translation_source: /get-started/launch-iroha.md
translation_source_hash: 9341b2404624dec2230bc294c3d60dc124ac9574a0a5803b9bba744f4c5e7f50
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ማስጀመሪያ Iroha 3 {#launch-iroha-3}

ይህ ገጽ የስራ ቦታ ነባሪ ንብረቶችን በመጠቀም Iroha 3 የአሁኑን የአካባቢያዊ አውታረመረብ ፍሰት ይጠቀማል ከቅድሚያ ማከማቻ.

## 1. አካባቢያዊ ባለብዙ እኩዮች አውታረመረብ መፍጠር {#_1-generate-a-local-multi-peer-network}

የአሁኑን Kagami ኮድ ከ 4 ፒር localnet ይፍጠሩ:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

የውጤት ማውጫው ተዛማጅ የእኩዮች ውቅር, `genesis.json`, `genesis.signed.nrt`, `client.toml`, እና ረዳት ስክሪፕቶች ይዟል.

ለአካባቢያዊ ጭስ ሙከራ በቀጥታ የተፈጠሩትን እኩዮችን ይጀምሩ:

```bash
./localnet/start.sh
```

ለኮንቴይነር አሂድ ከዚሁ localnet ማውጫ ያዘጋጁ:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./localnet/docker-compose.yml \
  --force

docker compose -f ./localnet/docker-compose.yml up
```

በነባሪነት የተፈጠረው ክምር የሚከተሉትን ይገልጻል:

- ከ P2P ወደቦች `1337` እስከ `1340`
- Torii HTTP ወደቦች `8080` ወደ `8083`
- በ `./localnet/client.toml` ላይ ዝግጁ የሆነ የደንበኛ ውቅር

## 2. አውታረ መረቡ የተሠራ መሆኑን አረጋግጡ {#_2-verify-that-the-network-is-up}

በመጀመሪያው እኩያ ላይ ያለውን ሁኔታ መጨረሻ ነጥብ ይፈትሹ:

```bash
curl http://127.0.0.1:8080/status
```

ነባሪ የጤና ምርመራዎችም የሚከተሉትን ይጠቀማሉ።

```bash
curl http://127.0.0.1:8080/status/blocks
```

ወዲያውኑ የ CLI በቡንድ ደንበኛ ውቅር ላይ ማጣቀሻ ይችላሉ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus መገለጫ {#_3-nexus-profile}

የመረጃ ቋቱ SORA Nexus ላይ የተመሠረተ የኮንፊግሽን መገለጫ በ `defaults/nexus/` ስር ይልካል ።

Nexus መገለጫ ጋር ተወላጅ እኩዮችን ለማሄድ:

```bash
./target/release/irohad --sora --config ./defaults/nexus/config.toml
```

ለ CLI ወደዚያ መገለጫ ለመድረስ `defaults/nexus/client.toml` ይጠቀሙ።

## 4. የአካባቢውን አውታረመረብ ያቁሙ {#_4-stop-the-local-network}

ለአገር ውስጥ የተፈጠረ አካባቢያዊ አውታረመረብ:

```bash
./localnet/stop.sh
```

ለተፈጠረው የኮምፖዝ ክምር:

```bash
docker compose -f ./localnet/docker-compose.yml down
```

አውታረ መረቡ ከተሰራ በኋላ [በ CLI](/am/get-started/operate-iroha-via-cli.md) በኩል Iroha 3 ይሂዱ.
