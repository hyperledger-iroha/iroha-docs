---
translation_locale: am
translation_source: /get-started/launch-iroha.md
translation_source_hash: 9341b2404624dec2230bc294c3d60dc124ac9574a0a5803b9bba744f4c5e7f50
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ማስጀመሪያ Iroha 3 {#launch-iroha-3}

ይህ ገጽ የአሁኑን አካባቢያዊ አውታረ መረብ ፍሰት በኩል ይሄዳል Iroha 3 በመጠቀም
ከቅድመ-መንገድ ማከማቻ ውስጥ ያሉ ነባሪ የስራ ቦታ ንብረቶች።

## 1. አካባቢያዊ ባለብዙ እኩዮች አውታረመረብ መፍጠር {#_1-generate-a-local-multi-peer-network}

የአሁኑን አራት-አቻ አካባቢያዊ አውታረ መረብ ይፍጠሩ Kagami ኮድ:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

የውጤት ማውጫው የሚዛመዱ የእኩዮች ውቅር ይዟል, `genesis.json`,
`genesis.signed.nrt`, `client.toml`, እና ረዳት ጽሑፎች።

ለአካባቢያዊ የጭስ ሙከራ በቀጥታ የተፈጠሩትን እኩዮች ይጀምሩ

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

በነባሪነት የተፈጠረው ክምችት የሚከተሉትን ይገልጻል

- እኩዮች P2P ወደቦች `1337` ወደ `1340`
- Torii HTTP ወደቦች `8080` ወደ `8083`
- አንድ ዝግጁ ደንበኛ ውቅር በ `./localnet/client.toml`

## 2. አውታረ መረቡን ማግኘቱን ያረጋግጡ {#_2-verify-that-the-network-is-up}

በመጀመሪያው እኩያ ላይ ያለውን የአቋም መጨረሻ ነጥብ ይመልከቱ:

```bash
curl http://127.0.0.1:8080/status
```

ነባሪ የጤና ምርመራዎችም የሚከተሉትን ይጠቀማሉ

```bash
curl http://127.0.0.1:8080/status/blocks
```

ወዲያውኑ ወደ CLI በተቀናጀ የደንበኛ ውቅር ላይ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus መገለጫ {#_3-nexus-profile}

የመረጃ ቋቱ ደግሞ SORA Nexus-የተመሠረተው የመዋቅር መገለጫ
`defaults/nexus/`.

አንድ ተወላጅ እኩዮች ጋር ለማሄድ Nexus መገለጫ:

```bash
./target/release/irohad --sora --config ./defaults/nexus/config.toml
```

አጠቃቀም `defaults/nexus/client.toml` ለ CLI ወደዚያ መገለጫ መዳረሻ።

## 4. የአካባቢውን አውታረመረብ ያቁሙ {#_4-stop-the-local-network}

ለአገር ውስጥ የተፈጠረ አካባቢያዊ አውታረ መረብ:

```bash
./localnet/stop.sh
```

ለተፈጠረው የኮምፖዝ ክምር:

```bash
docker compose -f ./localnet/docker-compose.yml down
```

አውታረ መረቡ ከተሰራ በኋላ
[ይሠራል Iroha 3 በኩል CLI](/am/get-started/operate-iroha-via-cli.md).
