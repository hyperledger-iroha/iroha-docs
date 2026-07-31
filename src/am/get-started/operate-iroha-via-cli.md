---
translation_locale: am
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 9391bab95aa0ee20c7f036cc175f3a6d3a8852e6ea90b09d9ebf1a838973c765
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ይሠራል Iroha 3 በኩል CLI {#operate-iroha-3-via-cli}

የ `iroha` ባይናሪ ለ ትዕዛዝ መስመር ደንበኛ ነው Iroha 3. መጠየቅ ይጠቀሙበት
መቁጠሪያ ማስገባት፣ ግብይቶችን ማቅረብ እና የኦፕሬተሩ መጨረሻ ነጥቦችን ለመፈተሽ።

## 1. ቅድመ ሁኔታዎች {#_1-prerequisites}

በመጀመሪያ አካባቢያዊ አውታረ መረብ ይጀምሩ:

- [ማስጀመሪያ Iroha 3](./launch-iroha.md)

ከዚህ በታች ያሉት ምሳሌዎች ከ localnet የተፈጠረውን የደንበኛ ውቅር ይገምታሉ
የተፈጠረው በ [ማስጀመሪያ Iroha 3](./launch-iroha.md):

```bash
./localnet/client.toml
```

## 2. መሠረታዊ CLI ማዋቀር {#_2-basic-cli-setup}

ከፍተኛውን እርዳታ አሳይ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

የ CLI በነዚህ ከፍተኛ ደረጃ የኮማንድ ቡድኖች የተደራጀ ነው

- `account` በሂሳብ ላይ የተመሠረቱ አቋራጭ መንገዶች
- `tx` ለግብይት ደረጃ ረዳቶች
- `ledger` በሊጀር ላይ የሚነበብ እና የሚጽፍ
- `ops` ለኦፕሬተር ዲያግኖስቲክስ
- `app` ለአፕሊኬሽኑ API ረዳቶች
- `contract` ለውል ማሰማራት እና ጥሪ
- `tools` ለዲጂኖስቲክስ እና ለገንቢ አገልግሎት ሰጪዎች
- `taira` ለ Taira እና Nexus-ተኮር የስራ ፍሰቶች

የ `ledger` ቡድኑ እንዲሁ እንደ ጎራ-ተኮር የግብይት ረዳቶችን ይ containsል
`ledger transaction`.

አጠቃቀም `--output-format text` ለሰው ሊነበብ የሚችል የኦፕሬተር ውፅዓት እና `--machine`
ለጥብቅ አውቶማቲክ ሁነታ።

## 3. ለሕዝብ ተናገር Taira የሙከራ አውታር {#_3-try-the-public-taira-testnet}

በንባብ ብቻ መሞከር ትችላለህ Taira የአካባቢያዊ እኩዮችን ከማካሄድ ወይም
እነዚህ ትዕዛዞች የህዝብ አጠቃቀም Torii JSON መስመሮች እና testnet አያወጡም
XOR.

ይመልከቱ Taira ጤና:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

የሕዝብ ጎራዎችን በ `universal` የመረጃ ቦታ:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

አንዳንድ የአክሲዮን ትርጉሞች እና ወቅታዊ አቅርቦታቸው ተዘርዝረዋል

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

አንተ ዥረት ካለዎት `iroha` ባይናሪ, አሂድ Taira የምርመራ ረዳት:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

መፍጠር `taira.client.toml` የተፈረሙትን ትዕዛዞች ለመፈተሽ ዝግጁ ከሆንክ ብቻ።
ተመልከት [ጋር ይገናኙ SORA Nexus የመረጃ ቋቶች](/am/get-started/sora-nexus-dataspaces.md)
ለኮንፊግ, ቧንቧ እና የካናሪ ፍሰት.
Taira ሂሳቡ ከፋይኔት ክፍያ አክሲዮን እስከሚከፈል ድረስ።

ማንኛውም ክፍያ Taira CLI ለምሳሌ ፣ የቧንቧ ረዳት ከ
[ቴስትኔት ያግኙ XOR ላይ Taira](/am/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
እንደ `taira_faucet_claim.py`, ከዚያም የይገባኛል ጥያቄ የሙከራ ኔት XOR አንደኛ፡

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

የቧንቧው እንቆቅልሽ ወይም የይገባኛል ጥያቄ መንገድ ከተመለሰ `502`, ቆይ እና እንደገና ይሞክሩ.
የሕዝብ የሙከራ ኔትወርክ ተደራሽነት ጉዳይ እንጂ የመለያ ቁልፎችን መልሶ ማቋቋም የሚቻልበት ምልክት አይደለም።

ቀሪውን ከተመለከተ በኋላ የክፍያ ንብረቱን ሜታዳታ ይጨምሩ እንዲህ ይላል:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. መሰረታዊ የመቁጠሪያ ትዕዛዞች {#_4-basic-ledger-commands}

ሁሉንም ጎራዎች ይዘርዝሩ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

የተለመደ ጎራ መፍጠር የአስፈጻሚ አጠራር ዕቅድ አውጪን ይጠቀማል `ledger
domain` ትዕዛዝ የለም `register` የጦር መኮንን፣ ሚስጥራዊ ያልሆነ
`AliasSetupPlanRequestV1` ዓላማ `docs.universal` ከራስህ ጋር SDK ወይም
የቦርድ አገልግሎት, ከዚያም እቅድ እና ተግባራዊ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

ዓላማው የመረጃ ቦታውን ይጣበቃል ID, የካኖኒክ ባለቤት ሂሳብ፣ የኪራይ ጊዜ እና
የፕላነር የቀጥታ ሁኔታ ያረጋግጣል እና ትክክለኛውን ይመልሳል
የአቶሚክ `EnsureAlias` ለሌላ ሰው የመከላከያ እሴቶችን በእጅ አይኮፒ
አውታረመረብ።

አንድ ቀላል ፒንግ ግብይት ላክ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

በቅርብ ጊዜ የተሰራውን ብሎክ አንብቡ ወይም ለብሎክ ክስተቶች ይመዝገቡ:

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

ተደራሽነት, ሰብሳቢ, RBC የኋላ ዥረት፣ እና VRF ቅጽበታዊ ገጽ እይታ

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

በሰንሰለት ላይ የጋራ ስምምነት መለኪያዎች

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## 6. ቀጥሎ የት መሄድ አለብን? {#_6-where-to-go-next}

- [SDK ትምህርቶች](/am/guide/tutorials/)
- [Torii የመጨረሻ ነጥቦች](/am/reference/torii-endpoints.md)
- [ጋር መሥራት Iroha የሁለትዮሽ](/am/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md)

ከምንጭ ማረጋገጫ ሙሉውን የ Markdown እርዳታ ቅጽበታዊ ገጽ እይታ ለመቀየር የሚከተለውን ይሮጡ:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
