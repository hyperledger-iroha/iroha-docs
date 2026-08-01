---
translation_locale: am
translation_source: /cookbook/metadata.md
translation_source_hash: 07b065b28eca44939a92b40a81a47b57178de4539abb0daf51913969e34eced7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ሜታዳታ {#metadata}

## ውጤቱ {#outcome}

በ Taira ላይ ሜታዳታ ያንብቡ ፣ በግልጽ ክፍያ የሚከፈልበት ግብይት ጋር የአንድ የሂሳብ ሜታዳታ እሴት ያዘጋጁ እና ያረጋግጡ ፣ እና ዋጋውን እንደገና ያስወግዱ ። የመረጃ ቋት-ዕቃዎች ሜታዳታ ከግብይት ክፍያ ሜታዳታ የተለየ ይደረጋል ።

## ቅድመ ሁኔታዎች {#prerequisites}

- `curl`, `jq`, Python 11 ወይም ከዚያ በኋላ, እና የአሁኑ `iroha` CLI.
- የገንዘብ ድጋፍ `taira.client.toml` እና `taira.tx-metadata.json` ከ [ጋር ይገናኙ Taira](./connect-to-taira.md).
- የዒላማው መለያ ሜታዳታ ላይ ባለስልጣን። ምሳሌው የተዋቀረውን ባለስልጣን ራሱ ያነጣጠረ ሲሆን ሌላ መለያ ትክክለኛ ፈቃድ ይፈልጋል ።

## እርምጃዎች {#steps}

### 1. ሜታዳታዎችን ያለ ፊርማ ማንበብ {#_1-read-metadata-without-a-signer}

ሜታዳታ ከ `Name` ወደ JSON ካርታ የተፈተነ ነው። ባዶ ካርታዎች እና ባዶ የተጣራ ውፅዓት ትክክለኛ ውጤቶች ናቸው።

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[] \
    | select((.metadata // {} | length) > 0) \
    | {id, name, metadata}'

curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

ለትንሽ መግለጫ ወይም ኢንዴክሰሪንግ መስኮች ሜታዳታ ይጠቀሙ. ትላልቅ ጥቅማጥቅሞችን ከሊጀር አስወግዱ እና በምትኩ URI ወይም SoraFS ማጣቀሻን ያከማቹ ።

### 2. የዒላማውን ሂሳብ ማውጣት {#_2-derive-the-target-account}

ከ Taira ውቅር የሕዝብ ቁልፍን ብቻ ያንብቡ እና ወደ ካኖኒካል ጎራ የሌለው I105 ቅጽ ይቀይሩ ።

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"
```

### አንድ JSON እሴት ያዘጋጁ። {#_3-set-one-json-value}

ከተለመደው ግብዓት የተነበበው JSON የሂሳብ ዋጋ `cookbook_profile` ይሆናል ። በተቃራኒው ፣ `--metadata ./taira.tx-metadata.json` የክፍያ መስኮችን ለግብይት ፖስታ ያያይዛል። ሁለቱ ካርታዎች የተለያዩ ግቦች እና ዓላማዎች አሏቸው ።

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      --metadata ./taira.tx-metadata.json \
      ledger account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

የ CLI ክፍያ ይጠቀማል, ፊርማዎች, ያቀርባል, እና በነባሪ ይጠብቃል. በሚቀጥለው ክወና በዚህ ዋጋ ላይ የሚወሰን ጊዜ `--no-wait` አይጨምርም.

::: warning የተፈቀደለት ገደብ

እያንዳንዱን ነገር ማን ሊለውጠው እንደሚችል የሚወስነው ንቁ ማረጋገጫ ነው። ሌላ መለያ ማዘመን በተለምዶ `CanModifyAccountMetadata` ይጠይቃል; ጎራዎች ፣ የንብረት ትርጓሜዎች ፣ NFTs እና አስነሳሾች የራሳቸው ዒላማ-ተኮር ሜታዳታ ፈቃድ አላቸው ። Taira የተጠየቀውን ስልጣን ካልሰጠ ፣ ተመሳሳይ የሂሳብ ትዕዛዞችን በ `./localnet/client.toml` ያካሂዱ ፣ የተፈጠረውን የአካባቢያዊ አውታረ መረብ ባለስልጣን ካኖኒካል I105 ID ይተኩ እና Taira ክፍያ ሜታዳታ ፋይልን ያስወግዱ ።

:::

### 4. ቁልፉን አስወግድ። {#_4-remove-the-key}

በመጀመሪያ የተሰጠውን ዋጋ አንብበው፣ ከዚያም የተለየ የማስወገድ ግብይት ያቅርቡ።

```bash
iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

ለ Python አፕሊኬሽኖች ፣ የሚዛመዱ የተጻፉ ገንቢዎች `Instruction.set_account_key_value` እና `Instruction.remove_account_key_value` ናቸው; ከግብይት ሜታዳታ እና ከ [ Python መማሪያ ](/am/guide/tutorials/python.md#shared-setup) ጋር ያቅርቡት.

## ያረጋግጡ {#verify}

ከተቀመጠው ግብይት በኋላ `meta get` ዕቃውን በ `version: 1` መመለስ አለበት። ከወሰዱ በኋላ ቀጥተኛ ፍለጋ ከእንግዲህ ዋጋን መመለስ የለበትም።

```bash
iroha --config ./taira.client.toml --machine ledger account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile; then
  printf '%s\n' 'metadata key still exists' >&2
  exit 1
else
  printf '%s\n' 'metadata key removed'
fi
```

በተለየ የሂሳብ ንባብ የጎደለውን ሜታዳታ ቁልፍ ከአውታረ መረብ ወይም ከሂሳብ ብልሽት ይለያል። የምርት ኮድ ደግሞ ሙሉውን JSON እሴት ካስቀመጠ በኋላ ማረጋገጥ አለበት ።

## ችግሮችን መፍታት {#troubleshooting}

- መደበኛ ግብዓት አንድ ትክክለኛ JSON ዋጋ ሊኖረው ይገባል ። ገመዶች JSON ጥቅሶች ያስፈልጋሉ ፣ ዕቃዎች እና ቅጥያዎች በደንብ የተዋቀሩ መሆን አለባቸው።
- የሜታዳታ ቁልፎች `Name` እሴቶች ናቸው እና ከፓንስ በኋላ ለጉዳዩ ስሜታዊ ናቸው። ለእያንዳንዱ መርሃግብር ለውጥ ስሪት ቁልፎችን ከመፍጠር ይልቅ የተረጋጋ ቁልፍ ቃላት ይያዙ ።
- `--metadata` የግብይት ሜታዳታ ነው; ይህ የመረጃ ቋት-ዕቃዎች ሜታዳታ አያዘጋጅም። ለኋለኛው የድርጅት `meta set` ንዑስ ትዕዛዝ ይጠቀሙ።
- አንድ ስኬታማ ማቅረቢያ ከቀድሞው አንባቢ በኋላ የስርጭት መዘግየት ሊሆን ይችላል። ለተተገበረ ፍፃሜ ይጠብቁ እና እንደገና ከመላክዎ በፊት ጥያቄውን እንደገና ይሞክሩ።
- ፍቃድ መከልከል የዒላማውን ነገር እና የሥልጣን ወሰን ይገልጻል። በአካባቢው እንደገና ይለማመዱ ወይም ትክክለኛውን ምልክት ይጠይቁ; የመዳረሻ ቁጥጥርን ለማስወገድ የግል የመተግበሪያ መረጃዎችን ወደ ህዝባዊ ሜታዳታ መስክ አይንቀሳቀሱ ።
- የግል ቁልፎችን፣ ጥሬ የግል መታወቂያዎችን፣ የመዳረሻ ኮዶችን ወይም ትላልቅ ሰነዶችን በሜታዳታ ውስጥ በጭራሽ አታስቀምጥ።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [የሜታዳታ መጠይቅ ውህደት ሙከራዎች በፒን የተደረገለት ተልእኮ ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/queries/metadata.rs)
- [Python SDK የግብይት ገንቢዎች በተቀመጠው ተሳትፎ ላይ ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/python/iroha_python/README.md)
- [ሜታ መረጃዎች](/am/blockchain/metadata.md)
- [ሜታዳታ እና መቁጠሪያ ማከማቻ አማራጮች ](/am/guide/configure/metadata-and-store-assets.md)
- [መመሪያ ማጣቀሻ ](/am/reference/instructions.md)
- [የፈቃድ ማስያዣዎች](/am/reference/permissions.md)
