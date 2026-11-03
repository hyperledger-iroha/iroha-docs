---
translation_locale: am
translation_source: /cookbook/metadata.md
translation_source_hash: 88298912f083d79a9fdfe5e8d0a89d49acb97d814d3871db0c874cb40db5342b
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# ሜዳዳታ {#metadata}

## ውጤት {#outcome}

በ Taira ላይ ሜታዳታ ያንብቡ፣ አንድ የመለያ ሜታዳታ እሴትን በግልፅ ክፍያ በሚከፍል ግብይት ያዘጋጁ እና ያረጋግጡ እና እሴቱን እንደገና ያስወግዱት። የብሎክቼይን መዝገብ ነገር ሜታዳታ ከግብይት ሜታዳታ እንዲለይ ያደርጋሉ።

## ቅድመ ሁኔታዎች {#prerequisites}

- `curl`፣ `jq`፣ Python 3.11 ወይም ከዚያ በኋላ፣ እና የአሁኑ `iroha` CLI።
- በገንዘብ የተደገፈ `taira.client.toml` ከ[ከ Taira ጋር ይገናኙ](./connect-to-taira.md)።
- በዒላማው መለያ ሜታዳታ ላይ የፈቃድ ባለቤት። ምሳሌው የተዋቀረውን የፈቃድ ባለቤት ራሱ ያነጣጠረ ነው; ሌላ መለያ ትክክለኛ ፈቃድ ያስፈልገዋል።

## እርምጃዎች {#steps}

### 1. ያለ ምስጠራ ፈራሚ ሜታዳታ ያንብቡ {#_1-read-metadata-without-a-signer}

ሜታዳታ የተረጋገጠ `Name` ወደ JSON ካርታ ነው። ባዶ ካርታዎች እና ባዶ የተጣራ ውፅዓት ትክክለኛ ውጤቶች ናቸው።

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[]
    | select((.metadata // {} | length) > 0)
    | {id, name, metadata}'

curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

ለአነስተኛ ገላጭ ወይም መረጃ ጠቋሚ መስኮች ሜታዳታ ይጠቀሙ። ትላልቅ ሸክሞችን ከብሎክቼይን መዝገብ ውጭ ያስቀምጡ እና በምትኩ የምስጠራ ዳይጀስት እሴት፣ URI ወይም SoraFS ማጣቀሻ ያከማቹ።

### 2. የታለመውን መለያ ያውጡ {#_2-derive-the-target-account}

የህዝብ ቁልፉን ከ Taira ውቅር ብቻ ያንብቡ እና ወደ ነጠላ ፕሮቶኮል-መደበኛ ጎራ አልባ I105 ቅጽ ይለውጡት።

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

### 3. አንድ JSON እሴት ያዘጋጁ {#_3-set-one-json-value}

ከመደበኛ ግቤት የተነበበው JSON የመለያው `cookbook_profile` እሴት ይሆናል። በ`--metadata <file>` የሚያያዝ የግብይት ሜታዳታ በግብይት ውሂብ መያዣው ላይ ያለ የተለየ ካርታ ነው እና ክፍያዎችን በጭራሽ አይመርጥም፦ ክፍያዎችን የሚመርጡት `--fee-payer` እና የ CLI ትክክለኛ የክፍያ ዋጋ ግምት ናቸው፣ እና ደንበኛው `gas_asset_id`፣ `gas_limit` ወይም `fee_sponsor` ቁልፎችን የያዘ የግብይት ሜታዳታን አይቀበልም።

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

CLI ከመፈረሙ በፊት ትክክለኛውን ክፍያ በ Taira የክፍያ ንብረት የሚገልጽ የክፍያ ዋጋ ግምት ያቀርባል፣ ከዚያም ግብይቱን ያስገባል እና ከመመለሱ በፊት የተተገበረውን የመጨረሻነት ይጠብቃል።

::: warning የፍቃድ ወሰን

ንቁ አስፈፃሚው እያንዳንዱን ነገር ማን እንደሚቀይር ይወስናል። ሌላ መለያ ማዘመን በመደበኛነት `CanModifyAccountMetadata` ያስፈልገዋል፤ ጎራዎች፣ የንብረት ፍቺዎች፣ NFTs እና ቀስቅሴዎች የራሳቸው ኢላማ-ተኮር ሜታዳታ ፈቃዶች አሏቸው። Taira የሚፈለገውን ስልጣን ካልሰጠ፣ ተመሳሳይ የመለያ ትዕዛዞችን በ`./localnet/client.toml` ያሂዱ እና የመነጨውን የlocalnet የፈቃድ ባለቤት ነጠላ ፕሮቶኮል-ስታንዳርድ I105 መታወቂያ ይተኩ። ግልጽ የሆነውን የአካባቢ ክፍያ ከፋይ ምርጫ ያቆዩ።

:::

### 4. ቁልፉን ያስወግዱ {#_4-remove-the-key}

በመጀመሪያ የተጠናቀቀውን እሴት ያንብቡ እና የተለየ የማስወገጃ ግብይት ያስገቡ።

```bash
iroha --config ./taira.client.toml --machine account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

ለ Python መተግበሪያዎች፣ ተዛማጅ የተተየቡ ግንበኞች `Instruction.set_account_key_value` እና `Instruction.remove_account_key_value` ናቸው። ከግብይቱ ሜታዳታ እና ከ[Python አጋዥ ስልጠና](/am/guide/tutorials/python.md#shared-setup) በመጠባበቂያ ረዳት ያስገቡዋቸው።

## አረጋግጥ {#verify}

ከተቀመጠው ግብይት በኋላ `meta get` እቃውን በ `version: 1` መመለስ አለበት። ከተወገደ በኋላ፣ ቀጥተኛ ፍለጋ ከአሁን በኋላ እሴት መመለስ የለበትም -

```bash
iroha --config ./taira.client.toml --machine account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile; then
  printf '%s\n' 'metadata key still exists' >&2
  exit 1
else
  printf '%s\n' 'metadata key removed'
fi
```

የተለየ መለያ የተነበበ የጎደለውን ሜታዳታ ቁልፍ ከአውታረ መረብ ወይም ከመለያ ውድቀት ይለያል። የምርት ኮድ ካቀናበረ በኋላ ሙሉውን JSON እሴት ማረጋገጥ አለበት።

## መላ ፍለጋ {#troubleshooting}

- መደበኛ ግቤት አንድ ትክክለኛ JSON እሴት መያዝ አለበት። ሕብረቁምፊዎች JSON ጥቅሶች ያስፈልጋቸዋል; እቃዎች እና ድርድሮች በደንብ መፈጠር አለባቸው.
- የሜታዳታ ቁልፎች `Name` እሴቶች ናቸው እና ከተተነተኑ በኋላ ለጉዳይ ስሜታዊ ናቸው። ለእያንዳንዱ የመርሃግብር ለውጥ የተስተካከሉ ቁልፎችን ከመፍጠር ይልቅ የተረጋጋ የቁልፍ መዝገበ ቃላት ያስቀምጡ።
- `--metadata` የግብይት ሜታዳታ ነው; . የብሎክቼይን መዝገብ ነገር ሜታዳታ አያዘጋጅም። ለኋለኛው የድርጅቱን `meta set` ንዑስ ትዕዛዝ ይጠቀሙ።
- የተሳካ ማስረከቢያ እና የድሮ ንባብ ተከትሎ የማሰራጨት መዘግየት ሊሆን ይችላል። የተተገበረውን የመጨረሻነት ይጠብቁ እና እንደገና ከማስገባትዎ በፊት ጥያቄውን እንደገና ይሞክሩ።
- የፍቃድ አለመቀበል የታለመውን ነገር እና የፍቃድ ርእሰ መምህሩን ድንበር ይለያል። በአገር ውስጥ ይለማመዱ ወይም ትክክለኛውን ቶከን ይጠይቁ; የመዳረሻ መቆጣጠሪያ ችግሮችን ለማስወገድ የግል መተግበሪያ ውሂብን ወደ ይፋዊ ሜታዳታ መስክ አያንቀሳቅሱ።
- የግል ቁልፎችን፣ ጥሬ የግል መለያዎችን፣ የመዳረሻ ቶከኖችን ወይም ትላልቅ ሰነዶችን በሜታዳታ በጭራሽ አያስቀምጡ።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ የሜታዳታ መጠይቅ ውህደት ሙከራዎች](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/queries/metadata.rs)
- [Python SDK የግብይት ግንበኞች በተሰካው የምንጭ-ኮድ ክለሳ ላይ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/python/iroha_python/README.md)
- [ሜዳዳታ](/am/blockchain/metadata.md)
- [ሜታዳታ እና blockchain መዝገብ ማከማቻ ምርጫዎች](/am/guide/configure/metadata-and-store-assets.md)
- [የመመሪያ ማጣቀሻ](/am/reference/instructions.md)
- [የፍቃድ ምልክቶች](/am/reference/permissions.md)
