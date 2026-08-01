---
translation_locale: am
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: ab8f3bf6d2259dc1ea649273e695429a992108b936475b263fe9d1fae59e8766
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 3 በ CLI በኩል ይሠራል {#operate-iroha-3-via-cli}

የ `iroha` ባይናሪ ለ Iroha 3 የትእዛዝ መስመር ደንበኛ ነው. የመረጃ ቋት ሁኔታን ለመጠየቅ, ግብይቶችን ለማቅረብ እና የአሠራር መጨረሻ ነጥቦችን ለመፈተሽ ይጠቀሙበት.

## 1. ቅድመ ሁኔታዎች {#_1-prerequisites}

በመጀመሪያ አካባቢያዊ አውታረ መረብ ይጀምሩ:

- [ማስጀመሪያ Iroha 3](./launch-iroha.md)

የሚከተሉት ምሳሌዎች [Launch Iroha 3](./launch-iroha.md) ውስጥ ከተፈጠረው አካባቢያዊ አውታረ መረብ የተፈጠረውን የደንበኛ ውቅር ይገምታሉ:

```bash
./localnet/client.toml
```

## 2. መሰረታዊ CLI ማዋቀር {#_2-basic-cli-setup}

ከፍተኛውን ደረጃ እርዳታ አሳይ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI በእነዚህ ከፍተኛ ደረጃ ትዕዛዞች ቡድኖች የተደራጀ ነው:

- `account` ለሂሳብ-ተኮር አቋራጭ መንገዶች
- `tx` ለግብይት ደረጃ ረዳቶች
- `ledger` ለሊነር ማንበብና መጻፍ
- `ops` ለኦፕሬተር ምርመራዎች
- `app` ለአፕሊኬሽኖች API ረዳቶች
- `contract` ለውል ማሰማራት እና ጥሪ
- `tools` ለዲጂኖስቲክስ እና ለገንቢ አገልግሎት ሰጪዎች
- `taira` ለ Taira እና Nexus ተኮር የስራ ፍሰቶች

የ `ledger` ቡድን እንደ `ledger transaction` ያሉ የጎራ-ተኮር የግብይት ረዳቶችን ያካትታል ።

ለሰው ሊነበብ የሚችል የኦፕሬተር ውፅዓት `--output-format text` እና ጥብቅ አውቶማቲክ ሁነታ `--machine` ን ይጠቀሙ።

## 3. የህዝብ Taira የሙከራ ኔትውን ይሞክሩ {#_3-try-the-public-taira-testnet}

አንድ አካባቢያዊ እኩዮች ማስኬድ ወይም ፊርማ ለመፍጠር በፊት ማንበብ ብቻ Taira ፍተሻዎችን መሞከር ይችላሉ. እነዚህ ትዕዛዞች የህዝብ Torii JSON መስመሮችን ይጠቀማሉ እና የሙከራ ኔት XOR አይጠቀሙም.

የ Taira ሁኔታ ይፈትሹ:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

`universal` የውሂብ ቦታ ውስጥ የሕዝብ ጎራዎችን ይዘርዝሩ:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

አንዳንድ የአክሲዮን ትርጉሞች እና ወቅታዊ አቅርቦታቸው ተዘርዝረዋል:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

የአሁኑ `iroha` ባይንሪ ካለዎት የ Taira የምርመራ ረዳት ይሂዱ:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

ይፍጠሩ `taira.client.toml` የተፈረሙትን ትዕዛዞች ለመፈተሽ ዝግጁ ከሆንክ ብቻ። [ጋር ይገናኙ SORA Nexus የመረጃ ቋቶች](/am/get-started/sora-nexus-dataspaces.md) ለኮንፊግ, ቧንቧ እና የካናሪ ፍሰት. Taira ሂሳቡ በቧንቧ ክፍያ አክሲዮን እስከሚከፈል ድረስ።

ለማንኛውም ክፍያ የሚከፈልበት Taira CLI ምሳሌ ፣ የቧንቧ ረዳቱን ከ [ ውስጥ ያስቀምጡ Testnet XOR በ Taira ](/am/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ላይ እንደ `taira_faucet_claim.py` ያግኙ ፣ ከዚያ በመጀመሪያ የሙከራ ኔት XOR ን ይጠይቁ:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

የቧንቧ እንቆቅልሽ ወይም የይገባኛል ጥያቄ መንገድ `502` የሚመለስ ከሆነ ይጠብቁ እና እንደገና ይሞክሩ. ይህ የህዝብ የሙከራ አውታረመረብ ተደራሽነት ችግር ነው, የመለያ ቁልፎችን ለማደስ ምልክት አይደለም.

ሚዛኑ ከተገለጠ በኋላ የክፍያ ንብረቱን ሜታዳታ ይጨምሩ እንዲህ ይላል:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. መሠረታዊ የመቁጠሪያ ትዕዛዞች {#_4-basic-ledger-commands}

ሁሉንም ጎራዎች ጻፍ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

የተለመደው ጎራ መፍጠር የዲክላረቲቭ ስያሜ ዕቅድ አውጪን ይጠቀማል; የ `ledger domain` ትዕዛዝ ምንም `register` ንዑስ ትዕዛዝ የለውም. ለ `docs.universal` ምስጢራዊ ያልሆነ `AliasSetupPlanRequestV1` ዓላማ በ SDK ወይም በመጫኛ አገልግሎትዎ ያዘጋጁ, ከዚያ እቅድ እና ተግባራዊ ያድርጉት:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

ዓላማው የመረጃ ቦታውን ID ፣ የካኖኒካል ባለቤት ሂሳብን ፣ የኪራይ አዋጁን ጊዜ እና የአሁኑን ጥቅስ መጠበቂያ ያጣራል ። ፕላነሩ የቀጥታ ሁኔታን ያረጋግጣል እና ለማቅረብ ትክክለኛውን አቶሚክ `EnsureAlias` ዕቅድ ይመልሳል ። የሌላ አውታረመረብ የጥበቃ እሴቶችን በእጅ አይገልፁ።

አንድ ቀላል ፒንግ ግብይት ላክ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

የቅርብ ጊዜውን ብሎክ ያንብቡ ወይም የብሎክ ክስተቶችን ይመዝገቡ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. የኦፕሬተር ትዕዛዞች {#_5-operator-commands}

የስምምነት ሁኔታ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi status
```

የደረጃ መዘግየት ቅጽበታዊ ገጽ እይታ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

ተደራሽነት, ሰብሳቢ, RBC የኋላ መለያ እና VRF ቅጽበታዊ ገጽ እይታ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

በሰንሰለት ላይ የጋራ ስምምነት መለኪያዎች:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## 6. ቀጥሎ የት መሄድ አለብን? {#_6-where-to-go-next}

- [SDK ትምህርቶች](/am/guide/tutorials/)
- [Torii መጨረሻ ነጥቦች](/am/reference/torii-endpoints.md)
- [በ Iroha ባይናሪዎች ላይ መሥራት ](/am/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md)

ሙሉውን የ Markdown እርዳታ ቅጽበታዊ ገጽ እይታ ከ ምንጭ ማረጋገጫ ለማደስ የሚከተለውን ይሮጡ:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
