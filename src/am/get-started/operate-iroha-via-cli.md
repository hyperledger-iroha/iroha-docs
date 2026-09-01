---
translation_locale: am
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: c070c86b715b36079a7b6a47de2e31144187d7ebc6309f294a346be61a372660
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha 3 በ CLI በኩል ያሂዱ {#operate-iroha-3-via-cli}

የ`iroha` ሁለትዮሽ ለ Iroha 3 የትእዛዝ መስመር ደንበኛ ነው። የብሎክቼይን መዝገብ ሁኔታን ለመጠየቅ፣ ግብይቶችን ለማስገባት እና ኦፕሬተርን API የመጨረሻ ነጥቦችን ለመመርመር ይጠቀሙበት።

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

- `account` መለያ-ተኮር አቋራጮች
- `tx` ለግብይት ደረጃ ረዳቶች
- `ledger` በብሎክቼይን መዝገብ ላይ ለማንበብ እና ለመጻፍ
- `ops` ለኦፕሬተር ምርመራ
- `app` ለመተግበሪያ API ረዳቶች
- `contract` ለኮንትራት ማሰማራት እና ቴክኒካዊ ጥሪዎች
- `tools` ለምርመራ እና ለገንቢ መገልገያዎች
- `taira` ለ Taira እና Nexus ተኮር የስራ ፍሰቶች

የ`ledger` ቡድን እንደ `ledger transaction` ያሉ ጎራ-ተኮር የግብይት ረዳቶችንም ይዟል።

በሰው ሊነበብ ለሚችል ኦፕሬተር ውፅዓት `--output-format text` እና `--machine` ለጥብቅ አውቶሜሽን ሁነታ ይጠቀሙ።

## 3. ይፋዊውን ይሞክሩ Taira Testnet {#_3-try-the-public-taira-testnet}

የአካባቢ አውታረ መረብ አቻ ከማስኬድዎ በፊት ወይም ምስጠራ ፈራሚ ከመፍጠርዎ በፊት ተነባቢ-ብቻ Taira ቼኮችን መሞከር ይችላሉ። እነዚህ ትዕዛዞች ይፋዊ Torii JSON መንገዶችን ይጠቀማሉ እና ቴስትኔት XOR አያወጡም።

Taira ሁኔታን ያረጋግጡ -

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

ይዘርዝሩ ይፋዊ ጎራዎች በ `universal` የውሂብ ቦታ ውስጥ

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

የተፈረሙ ትዕዛዞችን ለመሞከር ዝግጁ ሲሆኑ ብቻ `taira.client.toml`ን ይፍጠሩ። ለማዋቀር፣ ለቴስትኔት የገንዘብ ድጋፍ አገልግሎት እና ለካናሪ ፍሰት [ከ SORA Nexus የውሂብ ቦታዎች ጋር ይገናኙ](/am/get-started/sora-nexus-dataspaces.md)ን ይመልከቱ። መለያው በቴስትኔት የገንዘብ ድጋፍ አገልግሎት ክፍያ ንብረት እስኪደገፍ ድረስ በ Taira ላይ የመጻፍ ክዋኔ ትዕዛዞችን አያሂዱ።

ለማንኛውም ክፍያ የሚከፈል Taira CLI ምሳሌ፣ የቴስትኔት የገንዘብ ድጋፍ አገልግሎት አጋዥን ከ[Testnet XOR ን በ Taira ያግኙ](/am/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) እንደ `taira_faucet_claim.py` ያስቀምጡ፣ ከዚያ መጀመሪያ ቴስትኔት XOR ይጠይቁ -

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

የቴስትኔት የገንዘብ ድጋፍ አገልግሎት እንቆቅልሽ ወይም የይገባኛል ጥያቄ መንገድ ከተመለሰ `502`፣ ይጠብቁ እና እንደገና ይሞክሩ። ያ የህዝብ ቴስትኔት ተገኝነት ጉዳይ እንጂ የመለያ ቁልፎችን እንደገና ለማደስ ምልክት አይደለም።

ቀሪ ሂሳቡ ከታየ በኋላ የክፍያውን የንብረት ሜታዳታ ለመጻፍ ያያይዙ -

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. መሰረታዊ የብሎክቼይን መዝገብ ትዕዛዞች {#_4-basic-ledger-commands}

ሁሉንም ጎራዎች ይዘርዝሩ

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

ተራ ጎራ መፍጠር ገላጭ ተለዋጭ ስም እቅድ አውጪን ይጠቀማል; የ`ledger domain` ትዕዛዝ `register` ንዑስ ትዕዛዝ የለውም። ከእርስዎ SDK ወይም ከመሳፈሪያ አገልግሎት ጋር ለ`docs.universal` ከሚስጥር ነፃ የሆነ `AliasSetupPlanRequestV1` ዓላማ ያዘጋጁ፣ ከዚያ ያቅዱ እና ይተግብሩ -

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

ዓላማው የውሂብ ቦታ መታወቂያውን፣ ነጠላ ፕሮቶኮል-ደረጃውን የጠበቀ የባለቤት መለያ፣ የሊዝ ውል እና የአሁኑን የክፍያ-ዋጋ ማረጋገጫ ጠባቂ ይሰካል። እቅድ አውጪው የቀጥታ ሁኔታን ያረጋግጣል እና ለማስገባት ትክክለኛውን የአቶሚክ `EnsureAlias` እቅድ ይመልሳል። የጥበቃ እሴቶችን ከሌላ አውታረ መረብ በእጅ አይቅዱ።

ቀላል የፒንግ ግብይት ይላኩ -

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

የቅርብ ጊዜ ብሎክን ያንብቡ ወይም ክስተቶችን ለማገድ ይመዝገቡ -

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. የኦፕሬተር ትዕዛዞች {#_5-operator-commands}

የጋራ ስምምነት ኦፕሬተር ትዕዛዞች የተፈቀደ የሶፍትዌር ማስፈጸሚያ አካባቢ ቁልፍ ያስፈልጋቸዋል። ከ`client.toml` ያስወግዱት እና የባለቤቱን ብቻ ፋይል በግልፅ ያስተላልፉ -

```bash
: "${OPERATOR_KEY_FILE:=./secrets/operator.key}"

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

ከፍተኛ እና የተቆለፈ የጋራ ስምምነት ምልአተ ጉባኤ የምስክር ወረቀቶች -

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi qc
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
- [Torii API የመጨረሻ ነጥቦች](/am/reference/torii-endpoints.md)
- [ከ Iroha ሁለትዮሽ ጋር በመስራት ላይ](/am/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/README.md)

ከምንጭ-ኮድ የስራ ቅጂ ሙሉ የማርክዳውን የእገዛ ነጥብ-በጊዜ ውሂብ እይታን እንደገና ለማደስ ያሂዱ -

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
