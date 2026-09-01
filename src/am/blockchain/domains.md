---
translation_locale: am
translation_source: /blockchain/domains.md
translation_source_hash: 5e52579436a181d76c83fa549991e56064ae57349b7109d5c41ec7953e5cbb2e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ጎራዎች {#domains}

ጎራዎች በ`World` ውስጥ የተመዘገቡ የስም ቦታዎች ተብለው ይሰየማሉ። አሁን ባለው Iroha 3 የውሂብ ሞዴል፣ አንድ ጎራ በወላጅ ዳታ ቦታ ብቁ ነው፣ ስለዚህ ነጠላ ፕሮቶኮል-ስታንዳርድ መለያ የሚከተለው ነው -

```text
domain.dataspace
```

ለምሳሌ፣ `payments.universal` በ`universal` የውሂብ ቦታ ውስጥ ያለውን `payments` ጎራ ይሰይማል።

## መዋቅር {#structure}

የተመዘገበ `Domain` የሚከተሉትን ያጠቃልላል -

- `id` የውሂብ ቦታ ብቁ `DomainId`
- `logo` አማራጭ `SoraFS` URI ለጎራ አርማ
- `metadata` የዘፈቀደ ቁልፍ-እሴት ሜታዳታ
- `owned_by` የጎራው ባለቤት የሆነው መለያ፣ አብዛኛውን ጊዜ የተመዘገበው መለያ

ጎራን እውን ለማድረግ የሚያገለግለው የማስነሻ ጭነት `NewDomain` ነው። `id`፣ አማራጭ `logo` እና የመጀመሪያ `metadata` ይይዛል። የሶፍትዌር ማስፈጸሚያ አካባቢ `owned_by` ከፈቃድ ባለቤት ይሞላል። ተራ ደንበኞች ይህንን ጭነት በቀጥታ አያቀርቡም።

## መመዝገብ {#registration}

ተራ ጎራ መፍጠር ገላጭ ተለዋጭ ስም ማዋቀር ፍሰትን ይጠቀማል። ይህ የ SNS የሊዝ ውል፣ የባለቤት ችሎታዎች፣ የክፍያ-ዋጋ ማረጋገጫ ጠባቂ እና የጎራ ረድፍ በአንድ የአቶሚክ `EnsureAlias` ግብይት ውስጥ ያቆያል። `Register::Domain` የጀነሲስ / ቡት ማሰሪያ ወለል ሆኖ ይቆያል፣ እና `ledger domain` ትዕዛዙ `register` ንዑስ ትዕዛዝ የለውም።

በ SDK ወይም በመሳፈሪያ አገልግሎት ከሚስጥር ነፃ የሆነ `AliasSetupPlanRequestV1` ዓላማ ይፍጠሩ፣ ከዚያ CLI በቀጥታ ሁኔታ ላይ ያቅዱት እና ያንን ትክክለኛ እቅድ ያቅርቡ -

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

ዓላማው `payments.universal`ን፣ የቁጥር የመረጃ ቦታውን፣ ካኖኒካል I105 ባለቤቱን፣ የሊዝ ማግኛ ጊዜውን እና የአሁኑን የፖሊሲ/ክፍያ ግምት መከላከያ ይለያል። የእቅድ አውጪው መጨረሻ ነጥብ `POST /v1/aliases/setup/plan` ነው፤ የሚመልሰው እቅድ ከሰንሰለቱ፣ ከባለሥልጣኑ፣ ከሁኔታው እና ከጊዜ ገደቡ ጋር የታሰረ ነው። ጎራን ለማስወገድ አሁንም [`Unregister`](/am/blockchain/instructions.md#un-register) ይጠቀሙ።

ጎራን ለመፍጠር ወይም ለማስወገድ በንቁ የአፈጻጸም አካባቢ አረጋጋጭ ሥር ተገቢው የጎራ አስተዳደር ፈቃድ ያስፈልጋል። ባለሥልጣኑ ያንን ጎራ የማሻሻል ፈቃድ ሲኖረው፣ የጎራውን ሜታዳታ በ [`SetKeyValue` እና `RemoveKeyValue`](/am/blockchain/instructions.md#setkeyvalue-removekeyvalue) ማዘመን ይቻላል።

## ይህንን የስራ ፍሰት በ Taira ላይ ያሂዱ {#try-it-on-taira}

በአሁኑ ጊዜ በይፋዊ Taira የሙከራ መረብ ላይ የሚታዩትን ጎራዎች ይዘርዝሩ

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

የህዝብ ማስፈጸሚያ መስመር ካታሎግ ወደ ዳታ ቦታ ተለዋጭ ስሞች ይመለሱ -

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

አንድ መተግበሪያ ጎራ መኖሩን ማረጋገጥ ሲፈልግ የመጀመሪያውን ትዕዛዝ ይጠቀሙ። የውሂብ ቦታ ይፋዊ፣ የተገደበ ወይም ከዋናው የማስፈጸሚያ መስመር ጀርባ የዘገየ መሆኑን ማረጋገጥ ሲፈልጉ የማስፈጸሚያ መስመር ካታሎግ ይጠቀሙ።

የጎራ ማዋቀር ክፍያ የሚጠይቅ የመጻፍ ክዋኔ ነው። በ Taira ላይ ከመሞከርዎ በፊት የቴስትኔት ገንዘብ ድጋፍ አጋዡን ከ [በ Taira የሙከራ መረብ XOR ያግኙ](/am/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ወስደው `taira_faucet_claim.py` በሚል ስም ያስቀምጡ፣ ፈራሚውን በሕዝብ የገንዘብ ድጋፍ አገልግሎት በኩል ይሙሉ እና የክፍያ ሜታዳታን ያያይዙ፦

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

በተደጋጋሚ የቴስትኔት ሩጫዎች ላይ ለየት ያለ የጎራ ስም አላማ ይገንቡ እና የ Taira የአሁኑን ፖሊሲ እና የክፍያ-ንብረት ክፍያ-ዋጋ ማረጋገጫ ጥበቃን ይጠቀሙ። ለlocalnet ወይም Minamoto የተሰራውን እቅድ እንደገና አይጠቀሙ።

## ከሌሎች አካላት ጋር ያለው ግንኙነት {#relationship-to-other-entities}

ጎራዎች የብሎክቼይን መዝገብ ነገሮችን ይመድቡ እና ለጎራ ወሰን ያለው ውሂብ የስም ቦታ ይሰጣሉ። የንብረት ፍቺዎች ለጎራ ብቁ የሆኑ መለያዎችን ይጠቀማሉ፣ እና መጠይቆች ጎራዎችን መዘርዘር ይችላሉ ወይም ወደ ጎራ የተያዙ ነገሮችን ያግኙ። መለያዎች እራሳቸው አሁን ባለው የውሂብ ሞዴል ጎራ የሌላቸው ናቸው፣ ነገር ግን መለያዎች ጎራዎች ባለቤት ሊሆኑ እና ፍቺዎቻቸው በጎራዎች ስር የሚኖሩ ንብረቶችን መያዝ ይችላሉ።

በተጨማሪ አንብበው

- [ዓለም](/am/blockchain/world.md)
- [ንብረቶች](/am/blockchain/assets.md)
- [ሜዳዳታ](/am/blockchain/metadata.md)
- [ደንቦችን መሰየም](/am/reference/naming.md)
