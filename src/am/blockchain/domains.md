---
translation_locale: am
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ጎራዎች {#domains}

ጎራዎች በስም ቦታዎች ውስጥ የተመዘገቡ ናቸው `World`. በወቅቱ Iroha
3 የውሂብ ሞዴል አንድ ጎራ በዋናው የመረጃ ቦታው የተመሰረተው ነው, ስለዚህ የካኖኒካል
መታወቂያ:

```text
domain.dataspace
```

ለምሳሌ፣ `payments.universal` ስሞቹ `payments` በ ውስጥ ጎራ
`universal` የመረጃ ቦታ።

## መዋቅር {#structure}

የተመዘገበ `Domain` የሚከተሉትን ይ containsል:

- `id`: የውሂብ ቦታ ብቃት ያለው `DomainId`
- `logo`: አማራጭ `SoraFS` URI ለጎራ አርማ
- `metadata`: የትርፍ ጊዜ ማሳለፊያ
- `owned_by`: ጎራውን የሚይዘው መለያ፣ በተለምዶ
  ተመዝግቧል

አንድ ጎራ ለመጨመር ጥቅም ላይ የዋለው bootstrap payload ነው `NewDomain`. ይሸከማል
የ `id`, አማራጭ `logo`, እና የመጀመሪያ `metadata`. የስራ ሰዓት ይሞላል
`owned_by` መደበኛ ደንበኞች ይህንን ጠቃሚ ጭነት አያቀርቡም
በቀጥታ።

## ምዝገባ {#registration}

የተለመደው ጎራ መፍጠር የአስተያየት ቅጅ ፍሰት ይጠቀማል
SNS ኪራይ, ባለቤት አቅም, ጥቅስ ጠባቂ, እና በአንድ የአቶሚክ ውስጥ ጎራ ረድፍ
`EnsureAlias` ግብይት. `Register::Domain` ጅማሬ/ጀማሪ ቀበቶ ሆኖ ይቆያል።
እና `ledger domain` ትዕዛዝ የለም `register` የጦር አዛዥ።

ሚስጥር የሌለበት `AliasSetupPlanRequestV1` ዓላማ SDK ወይም መጫን
አገልግሎት, ከዚያም አላቸው CLI በቀጥታ ሁኔታ ላይ እቅድ አውጥተው ትክክለኛውን ያቅርቡ
እቅድ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

ዓላማው ይለያል `payments.universal`, ቁጥራዊ የመረጃ ቦታው፣ ካኖኒካል
I105 ባለቤት፣ የኪራይ ግዥ ጊዜ እና የአሁኑ ፖሊሲ/የክፍያ ዋጋ ጥበቃ።
የፕላነር መጨረሻ ነጥብ ነው `POST /v1/aliases/setup/plan`; የተመለሰው ዕቅድ
ሰንሰለት፣ ሥልጣን፣ ግዛት እና የጊዜ ገደብ የተገደበ።
[`Unregister`](/am/blockchain/instructions.md#un-register).

አንድ ጎራ መፍጠር ወይም ማስወገድ ተገቢውን የጎራ አስተዳደር ይጠይቃል
ንቁ የስራ ሰዓት ማረጋገጫ ስር ፈቃድ.
[`SetKeyValue` እና `RemoveKeyValue`](/am/blockchain/instructions.md#setkeyvalue-removekeyvalue)
ባለሥልጣኑ ያንን ጎራ ለመቀየር ፈቃድ ሲኖረው።

## ሞክር Taira {#try-it-on-taira}

በአሁኑ ጊዜ በአደባባይ የሚታዩትን ጎራዎች ይዘርዝሩ Taira የሙከራ አውታረመረብ:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

የሕዝብ ጎዳና ካታሎግ ወደ ዳታስፔስ ስያሜዎች መልሰው ያቅርቡ:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

አንድ መተግበሪያ ጎራ መኖር አለመኖሩን ለመፈተሽ ሲፈልግ የመጀመሪያውን ትእዛዝ ይጠቀሙ።
የመረጃ ቦታው በይፋ መሆኑን ማረጋገጥ ሲፈልጉ የመንገድ ካታሎግ፣
የተገደበ ወይም ከዋናው ጎዳና በስተጀርባ ያለው።

የጎራ ማዋቀር ክፍያ የሚከፈልበት ጽሑፍ ነው. Taira, ማስቀመጥ
የቧንቧ ረዳት
[ቴስትኔት ያግኙ XOR ላይ Taira](/am/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
እንደ `taira_faucet_claim.py`, ፊርማውን በሕዝብ ማቀነባበሪያ በኩል ለማገዝ፣
የክፍያ ሜታ መረጃዎች:

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

በተደጋጋሚ የሙከራ አውታረመረብ ሩጫዎች ላይ ለየት ያለ የጎራ ስም ዓላማን ይገንቡ እና ይጠቀሙ
Taira የአሁኑ ፖሊሲ እና የክፍያ አክሲዮን ዋጋ ጥበቃ.
ለአካባቢያዊ አውታረ መረብ ወይም Minamoto.

## ከሌሎች አካላት ጋር ያለው ግንኙነት {#relationship-to-other-entities}

ጎራዎች ዋና መቁጠሪያ ዕቃዎችን ያደራጃሉ እና የጎራ-ተኮር መረጃዎች የስም ቦታን ይሰጣሉ።
የንብረት ትርጉሞች የጎራ ብቁ የሆኑ መታወቂያዎችን ይጠቀማሉ፣ መጠይቆችም ሊዘረዝሩ ይችላሉ
መለያዎች ራሳቸው
አሁን ባለው የውሂብ ሞዴል ውስጥ ጎራ የሌለው, ነገር ግን መለያዎች ጎራዎችን ሊይዙ እና ሊያከናውኑ ይችላሉ
ትርጉማቸው በዘርፉ ውስጥ የሚገኝ ንብረት።

በተጨማሪም ተመልከት:

- [ዓለም](/am/blockchain/world.md)
- [ንብረቶች](/am/blockchain/assets.md)
- [ሜታዳታ](/am/blockchain/metadata.md)
- [የስም አሰጣጥ ደንቦች](/am/reference/naming.md)
