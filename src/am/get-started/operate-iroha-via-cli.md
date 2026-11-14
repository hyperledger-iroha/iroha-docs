---
translation_locale: am
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 5fb7abd4e152ece715a8337e8ef8e75330f634d2a1b26e0c5bd8308f1f3793a9
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Iroha 3 በ CLI በኩል ያሂዱ {#operate-iroha-3-via-cli}

የ`iroha` ሁለትዮሽ ለ Iroha 3 የትእዛዝ መስመር ደንበኛ ነው። የብሎክቼይን መዝገብ ሁኔታን ለመጠየቅ፣ ግብይቶችን ለማስገባት እና ኦፕሬተርን የመጨረሻ ነጥቦችን ለመመርመር ይጠቀሙበት።

## 1. ቅድመ ሁኔታዎች {#_1-prerequisites}

መጀመሪያ የአካባቢ አውታረ መረብ ይጀምሩ -

- [አስጀምር Iroha 3](./launch-iroha.md)

ከዚህ በታች ያሉት ምሳሌዎች በ[አስጀምር Iroha 3](./launch-iroha.md) ውስጥ ከተፈጠረው localnet የመነጨውን የደንበኛ ውቅር ይገምታሉ -

```bash
./localnet/client.toml
```

## 2. መሰረታዊ CLI ማዋቀር {#_2-basic-cli-setup}

የከፍተኛ ደረጃ እገዛን አሳይ

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI በእነዚህ ከፍተኛ ደረጃ የትዕዛዝ ቡድኖች የተደራጀ ነው -

- `account` ለመለያ ንባቦችና ለውጦች
- `explorer` ለአሳሽ ፍሰቶች፣ ከጋራ ማጣሪያዎችና ገጽ ክፍፍል ጋር
- `tx` ለግብይት ሁኔታና ረዳቶች
- `ledger` በብሎክቼይን መዝገብ ላይ ለማንበብ እና ለመጻፍ
- `trigger` ለትሪገር ንባብ፣ ለውጥና አፈጻጸም
- `ops` ለኦፕሬተር ምርመራ
- `app` ለመተግበሪያ API ረዳቶች
- `contract` ለኮንትራት ጥሪዎች፣ እይታዎችና አካባቢያዊ ስህተት ማረም፤ በ`kagami contract deploy` ወይም `musubi deploy` ያሰማሩ
- `tools` ለምርመራ እና ለገንቢ መገልገያዎች
- `dataspace` የውሂብ ቦታ ትርጉም ለማቀድ፣ ለመተግበርና ለመመርመር
- `taira` ለTaira ምርመራዎችና ለመለያ ማስገባት
- `offline` ከመስመር ውጭ ለሚሠሩ ኢንኮደሮች፣ ሪፖርቶችና ምርመራዎች
- `soracloud` ለSoracloud የመተግበሪያ መድረክ ረዳቶች
- `sccp` ለSORA Cross-Chain Protocol ንባቦች፣ ዝውውሮችና ማስረጃዎች

ግብይት የሚልክ እያንዳንዱ ትዕዛዝ እንደ `--fee-payer authority` ያለ በግልጽ የተጠቀሰ ከፋይ ይፈልጋል፤ CLI ከመፈረም በፊት ትክክለኛውን ክፍያ ያስላል።

በሰው ሊነበብ ለሚችል ኦፕሬተር ውፅዓት `--output-format text` እና `--machine` ለጥብቅ አውቶሜሽን ሁነታ ይጠቀሙ።

## 3. ይፋዊውን ይሞክሩ Taira Testnet {#_3-try-the-public-taira-testnet}

የአካባቢ አውታረ መረብ አቻ ከማስኬድዎ በፊት ወይም ምስጠራ ፈራሚ ከመፍጠርዎ በፊት ተነባቢ-ብቻ Taira ቼኮችን መሞከር ይችላሉ። እነዚህ ትዕዛዞች ይፋዊ Torii JSON መንገዶችን ይጠቀማሉ እና ቴስትኔት XOR አያወጡም።

Taira ሁኔታን ያረጋግጡ -

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

በ`universal` የውሂብ ቦታ ውስጥ ያሉ ክፍት ጎራዎችን ዘርዝሩ:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

ጥቂት የንብረት ትርጓሜዎችን እና የአሁኑን አቅርቦታቸውን ይዘርዝሩ -

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

የአሁኑ `iroha` ሁለትዮሽ ካለዎት የ Taira የምርመራ አጋዥን ያሂዱ -

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

የተፈረሙ ትዕዛዞችን ለመሞከር ሲዘጋጁ ብቻ `taira.client.toml` ይፍጠሩ። ለውቅር፣ ለፋውሴትና ለመሠረታዊ ሙከራ ሂደት [ከSORA Nexus የውሂብ ቦታዎች ጋር ይገናኙ](/am/get-started/sora-nexus-dataspaces.md) ይመልከቱ። መለያው በፋውሴት የክፍያ ንብረት እስኪሞላ ድረስ በTaira ላይ ሁኔታን የሚቀይሩ ትዕዛዞችን አያስኪዱ።

ክፍያ ለሚፈልግ ማንኛውም የTaira CLI ምሳሌ በ[በTaira ላይ የሙከራ አውታረ መረብ XOR ማግኘት](/am/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ያለውን ቀድሞ የማዘጋጀት ፋውሴት ሂደት ተጠቅመው ፈራሚውን ይሙሉ፣ ከዚያም ቀሪ ሒሳቡን ያረጋግጡ:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

የፋውሴት መንገድ `502` ከመለሰ ይጠብቁና እንደገና ይሞክሩ። ይህ የክፍት ሙከራ አውታረ መረቡ የተገኝነት ችግር ነው፣ የመለያ ቁልፎችን እንደገና ለማመንጨት ምልክት አይደለም።

ቀሪ ሒሳቡ ከታየ በኋላ ሁኔታን የሚቀይሩ ክዋኔዎችን በ`--fee-payer authority` ይላኩ። CLI ከመፈረም በፊት ትክክለኛውን ክፍያ በTaira የክፍያ ንብረት ያስላል:

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "hello from faucet-funded taira"
```

## 4. መሰረታዊ የብሎክቼይን መዝገብ ትዕዛዞች {#_4-basic-ledger-commands}

ሁሉንም ጎራዎች ይዘርዝሩ

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

ተራ ጎራ መፍጠር ገላጭ ተለዋጭ ስም እቅድ አውጪን ይጠቀማል; የ`ledger domain` ትዕዛዝ `register` ንዑስ ትዕዛዝ የለውም። ከእርስዎ SDK ወይም ከመሳፈሪያ አገልግሎት ጋር ለ`docs.universal` ከሚስጥር ነፃ የሆነ `AliasSetupPlanRequestV1` ዓላማ ያዘጋጁ፣ ከዚያ ያቅዱ እና ይተግብሩ -

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

የታቀደው ክዋኔ የውሂብ ቦታ IDን፣ ቀኖናዊ የባለቤት መለያን፣ የኪራይ ጊዜንና የአሁኑን የግምት መከላከያ ሁኔታ ያስራል። ዕቅድ አውጪው የቀጥታ ሁኔታን ያረጋግጣል፣ ለመላክ የሚያገለግለውን ትክክለኛ አቶሚክ `EnsureAlias` ዕቅድም ይመልሳል። የመከላከያ እሴቶችን ከሌላ አውታረ መረብ በእጅ አይቅዱ።

ቀላል የፒንግ ግብይት ይላኩ -

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority tx ping --msg "hello from iroha"
```

የቅርብ ጊዜ ብሎክን ያንብቡ ወይም ክስተቶችን ለማገድ ይመዝገቡ -

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. የኦፕሬተር ትዕዛዞች {#_5-operator-commands}

የመግባባት ኦፕሬተር ትዕዛዞች በፈቃድ ዝርዝር ያለ የሥራ ጊዜ ቁልፍ ይፈልጋሉ። ከ`client.toml` ውጭ ያቆዩት፣ ባለቤቱ ብቻ የሚያገኘውን ፋይል በፍጹም መንገዱ ይስጡ:

```bash
: "${OPERATOR_KEY_FILE:=$PWD/secrets/operator.key}"

cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
```

ስልጣን የሌለው ወረፋ፣ የሶፍትዌር ማቀነባበሪያ የስራ ሂደት፣ ምርጫ እና የማስፈጸሚያ መስመር ምርመራዎች -

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
```

commit የተደረጉ የመግባባት መስመሮች እና የዚህ ኖድ ኢንስታንስ ሁኔታ:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi lanes
```

በሰንሰለት ላይ የጋራ መግባባት መለኪያዎች -

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi params
```

## 6. ቀጥሎ የት መሄድ እንዳለበት {#_6-where-to-go-next}

- [SDK አጋዥ ስልጠናዎች](/am/guide/tutorials/)
- [Torii የመጨረሻ ነጥቦች](/am/reference/torii-endpoints.md)
- [ከ Iroha ሁለትዮሽ ጋር በመስራት ላይ](/am/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)

ከምንጭ ቼክአውቱ ሙሉ የMarkdown እርዳታ ቅጽበታዊ ቅጂ ለማተም ያስኪዱ:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > iroha-cli-help.md
```
