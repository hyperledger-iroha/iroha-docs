---
translation_locale: am
translation_source: /blockchain/domains.md
translation_source_hash: 26e8efe6c728d0f819b12e7d8257777d3d4ea272f42fabf8aec727467146500f
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# ጎራዎች {#domains}

ጎራዎች በ`World` ውስጥ የተመዘገቡ ስም ያላቸው የስም ቦታዎች ናቸው። በአሁኑ Iroha 3 የውሂብ ሞዴል ጎራ በወላጁ የውሂብ ቦታ ይለያል፤ ስለዚህ ቀኖናዊው መለያ እንዲህ ነው:

```text
domain.dataspace
```

ለምሳሌ `payments.universal` በ`universal` የውሂብ ቦታ ውስጥ ያለውን `payments` ጎራ ይሰይማል።

## መዋቅር {#structure}

የተመዘገበ `Domain` የሚከተሉትን ያጠቃልላል -

- `id`፦ በውሂብ ቦታ የተለየው `DomainId`
- `logo` አማራጭ `SoraFS` URI ለጎራ አርማ
- `metadata` የዘፈቀደ ቁልፍ-እሴት ሜታዳታ
- `owned_by`፦ የጎራው ባለቤት የሆነው መለያ፣ አብዛኛውን ጊዜ ጎራውን ያስመዘገበው መለያ

ጎራን እውን ለማድረግ የሚያገለግለው የማስነሻ ጭነት `NewDomain` ነው። `id`፣ አማራጭ `logo` እና የመጀመሪያ `metadata` ይይዛል። የሶፍትዌር ማስፈጸሚያ አካባቢ `owned_by` ከፈቃድ ባለቤት ይሞላል። ተራ ደንበኞች ይህንን ጭነት በቀጥታ አያቀርቡም።

## መመዝገብ {#registration}

ተራ ጎራ መፍጠር ገላጭ ተለዋጭ ስም ማዋቀር ፍሰትን ይጠቀማል። ይህ የ SNS የሊዝ ውል፣ የባለቤት ችሎታዎች፣ የክፍያ-ዋጋ ማረጋገጫ ጠባቂ እና የጎራ ረድፍ በአንድ የአቶሚክ `EnsureAlias` ግብይት ውስጥ ያቆያል። `Register::Domain` የጀነሲስ / ቡት ማሰሪያ ወለል ሆኖ ይቆያል፣ እና `ledger domain` ትዕዛዙ `register` ንዑስ ትዕዛዝ የለውም።

በ SDK ወይም በመሳፈሪያ አገልግሎት ከሚስጥር ነፃ የሆነ `AliasSetupPlanRequestV1` ዓላማ ይፍጠሩ፣ ከዚያ CLI በቀጥታ ሁኔታ ላይ ያቅዱት እና ያንን ትክክለኛ እቅድ ያቅርቡ -

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list --all
```

የታቀደው ክዋኔ `payments.universal`፣ ቁጥራዊ የውሂብ ቦታውን፣ ቀኖናዊ I105 ባለቤቱን፣ የኪራይ ግዥ ጊዜውን እና የአሁኑን የፖሊሲ/የክፍያ ግምት መከላከያ ሁኔታ ይለያል። የዕቅድ አውጪው መገናኛ ነጥብ `POST /v1/aliases/setup/plan` ነው፤ የሚመልሰው ዕቅድ ከሰንሰለት፣ ከፈቃድ ሰጪ፣ ከሁኔታ እና ከማብቂያ ጊዜ ጋር የተሳሰረ ነው። ጎራን ማስወገድ አሁንም [`Unregister`](/am/blockchain/instructions.md#un-register) ይጠቀማል።

ጎራን ለመፍጠር ወይም ለማስወገድ በንቁ የአፈጻጸም አካባቢ አረጋጋጭ ሥር ተገቢው የጎራ አስተዳደር ፈቃድ ያስፈልጋል። ባለሥልጣኑ ያንን ጎራ የማሻሻል ፈቃድ ሲኖረው፣ የጎራውን ሜታዳታ በ [`SetKeyValue` እና `RemoveKeyValue`](/am/blockchain/instructions.md#setkeyvalue-removekeyvalue) ማዘመን ይቻላል።

## ይህንን የስራ ፍሰት በ Taira ላይ ያሂዱ {#try-it-on-taira}

በአሁኑ ጊዜ በይፋዊ Taira የሙከራ መረብ ላይ የሚታዩትን ጎራዎች ይዘርዝሩ

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

ክፍቱን የመስመር ካታሎግ ከውሂብ ቦታ ተለዋጭ ስሞች ጋር ያዛምዱ:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

መተግበሪያ ጎራ መኖሩን ለማረጋገጥ ሲፈልግ የመጀመሪያውን ትዕዛዝ ይጠቀሙ። ከውሂብ ቦታ ጋር የተያያዙ መስመሮችን፣ የእያንዳንዱን ክፍት ወይም የተገደበ ታይነት እና ከዋናው መስመር አንጻር ያላቸውን የማመሳሰል ሁኔታ ለማየት የመስመር ካታሎጉን ይጠቀሙ።

ጎራ ማዋቀር ክፍያ የሚፈልግ ሁኔታን የሚቀይር ክዋኔ ነው። በTaira ላይ ከመሞከርዎ በፊት በ[በTaira ላይ የሙከራ አውታረ መረብ XOR ማግኘት](/am/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ያለውን ቀድሞ የማዘጋጀት ፋውሴት ሂደት ተጠቅመው ፈራሚውን ይሙሉ፣ ከዚያ ከፋዩን በግልጽ ጠቅሰው ዕቅዱን ይተግብሩ። CLI ከመፈረም በፊት ትክክለኛውን ክፍያ ያስላል:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
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
