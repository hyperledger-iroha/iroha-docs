---
translation_locale: am
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ጎራዎች {#domains}

ጎራዎች በ `World` ውስጥ የተመዘገቡ የስም ቦታዎች ናቸው. አሁን ባለው Iroha 3 የውሂብ ሞዴል አንድ ጎራ በዋናው የመረጃ ቦታው ተመድቧል, ስለዚህ የካኖኒካል መታወቂያ ነው:

```text
domain.dataspace
```

ለምሳሌ፣ `payments.universal` በ `universal` የውሂብ ቦታ ውስጥ ያለውን `payments` ጎራ ይጠቅሳል.

## መዋቅር {#structure}

የተመዘገበ `Domain` የሚከተሉትን ያካትታል፦

- `id`: የመረጃ ቦታ ብቃት ያለው `DomainId`
- `logo`: ለጎራ አርማ አማራጭ የሆነ `SoraFS` URI
- `metadata`: የትዕግሥት ቁልፍ ዋጋ ሜታዳታ
- `owned_by`: የጎራውን ባለቤት የሆነበት መለያ፣ በተለምዶ የተመዘገበበት መለያ

አንድ ጎራ ለመጨመር ጥቅም ላይ የዋለው bootstrap payload ነው `NewDomain`. ይህ የ `id`, አማራጭ `logo`, እና የመጀመሪያ `metadata`. የሩጫ ጊዜ ይሞላል `owned_by` ተራ ደንበኞች ይህንን ጭነት በቀጥታ አያቀርቡም ።

## ምዝገባ {#registration}

የተለመደው ጎራ መፍጠር የአዋጅ ቅጽል ስም ማዋቀር ፍሰት ይጠቀማል. ይህ SNS ኪራይ, ባለቤት አቅም, ጥቅስ ጠባቂ, እና በአንድ የአቶሚክ ውስጥ ጎራ ረድፍ `EnsureAlias` ግብይት. `Register::Domain` የጀኔዝ / ቡትስታፕ ወለል ሆኖ ይቆያል ፣ እና `ledger domain` ትዕዛዝ የለም `register` የጦር አዛዥ።

በ SDK ወይም በማስገባት አገልግሎት ውስጥ ምስጢራዊ ያልሆነ `AliasSetupPlanRequestV1` ዕቅድ ይፍጠሩ ፣ ከዚያ CLI ከቀጥታ ሁኔታ ጋር እቅድ ያድርጉት እና ያንን ትክክለኛ እቅድ ያቅርቡ ።

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

ዓላማው `payments.universal` ፣ ቁጥራዊ የውሂብ ቦታውን ፣ ቀኖናዊውን I105 ባለቤት ፣ የኪራይ ግዥን ጊዜ እና የአሁኑ ፖሊሲ / የክፍያ ዋጋ ጠባቂን ይገልጻል ። የታቀደው መጨረሻ ነጥብ `POST /v1/aliases/setup/plan` ነው ፤ የተመለሰው እቅድ ሰንሰለት ፣ ስልጣን ፣ ግዛት እና የጊዜ ገደብ የተገደበ ነው ። የጎራ ማስወገጃ አሁንም [`Unregister`](/am/blockchain/instructions.md#un-register) ይጠቀማል.

ጎራ ለመፍጠር ወይም ለማስወገድ በተግባር ባለው የሂደት ጊዜ ማረጋገጫ ስር ተገቢውን የጎራ አስተዳደር ፈቃድ ይጠይቃል። ባለሥልጣኑ ያንን ጎራ ለማሻሻል ፈቃድ ካለው የጎራ ሜታዳታ በ [`SetKeyValue` እና `RemoveKeyValue`](/am/blockchain/instructions.md#setkeyvalue-removekeyvalue) ሊዘመን ይችላል።

## Taira ላይ ይሞክሩት {#try-it-on-taira}

በሕዝብ Taira የሙከራ ኔትወርክ ላይ በአሁኑ ጊዜ የሚታዩትን ጎራዎች ይዘርዝሩ:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

የሕዝብ ጎዳና ካታሎግ ወደ ዳታስፔስ ስያሜዎች ተመልሶ ካርታ:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

አንድ መተግበሪያ ጎራ መኖር አለመኖሩን ለመመርመር ሲፈልግ የመጀመሪያውን ትእዛዝ ይጠቀሙ። የመረጃ ቦታው በይፋዊ ፣ የተገደበ ወይም ከዋናው ጎዳና በስተጀርባ መቆየቱን ለማረጋገጥ በሚፈልጉበት ጊዜ የጎዳና ካታሎግ ይጠቀሙ።

Taira ላይ ለመሞከር ከመሞከርዎ በፊት የቧንቧ ረዳት ከ [ ውስጥ ያስቀምጡ Testnet XOR በ Taira](/am/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ላይ እንደ `taira_faucet_claim.py` ያግኙ ፣ በመደበኛ ቧንቧ በኩል ፊርማውን የገንዘብ ድጋፍ ያድርጉ እና ክፍያ ሜታዳታ ይጨምሩ:

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

በተደጋጋሚ የሙከራ አውታረመረብ ሩጫዎች ላይ ለየት ያለ የጎራ ስም ዓላማን መገንባት እና የ Taira ወቅታዊ ፖሊሲ እና የክፍያ-አክሲዮን ዋጋ መጠበቂያ ይጠቀሙ። ለ localnet ወይም Minamoto የተዘጋጀውን ዕቅድ እንደገና አይጠቀሙ ።

## ከሌሎች አካላት ጋር ያለው ግንኙነት {#relationship-to-other-entities}

ጎራዎች የቡድን መቁጠሪያ ዕቃዎችን ይሰጣሉ እና የጎራ-ስኬድ መረጃዎች ለስም ቦታ ያቀርባሉ ። የንብረት ትርጉሞች የጎራ ብቃት ያላቸው መታወቂያዎችን ይጠቀማሉ ፣ መጠይቆች ጎራዎችን ሊዘርዝሩ ወይም ወደ ጎራ የተዘረዘሩ ነገሮችን ሊያገኙ ይችላሉ ። መለያዎች እራሳቸው አሁን ባለው የመረጃ ሞዴል ውስጥ ጎራ የሌላቸው ናቸው ፣ ግን መለያዎች ጎራዎችን ሊይዙ እና ትርጓሜዎቻቸው በጎራ ስር የሚኖሩ ንብረቶችን ሊይዙ ይችላሉ ።

በተጨማሪም ተመልከት።

- [ዓለም](/am/blockchain/world.md)
- [ንብረቶች](/am/blockchain/assets.md)
- [ሜታ መረጃዎች](/am/blockchain/metadata.md)
- [የስም አሰጣጥ ደንቦች](/am/reference/naming.md)
