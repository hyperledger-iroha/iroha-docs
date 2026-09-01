---
translation_locale: am
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 37a2c29dccf3d2abacbbba16869d65b70b93545875a122470601194231c2263b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ለግል ዳታ ቦታ የስፖንሰር ክፍያዎች {#sponsor-fees-for-a-private-dataspace}

የክፍያ ስፖንሰርሺፕ ተጠቃሚዎች XOR ሳይይዙ የግል-ዳታ ቦታ ግብይቶችን እንዲያቀርቡ ያስችላቸዋል። ተጠቃሚው አሁንም ግብይቱን ይፈርማል። የግብይቱ ሜታዳታ የሚያመለክተው የስፖንሰር መለያን ነው፣ እና የሶፍትዌር ማስፈጸሚያ አካባቢ የስፖንሰር አድራጊውን XOR ቀሪ ሂሳብ ለኔትወርክ ክፍያ ይቀንሳል።

ውህደቱ ሶስት ተንቀሳቃሽ ክፍሎች አሉት -

1. ኖድ ክፍያ ስፖንሰርሺፕ ይፈቅዳል
2. የስፖንሰር አካውንት አለ እና አለው XOR
3. እያንዳንዱ ተጠቃሚ ለዚያ ስፖንሰር `CanUseFeeSponsor` አለው።

ከዚያ በኋላ፣ እያንዳንዱ ስፖንሰር የተደረገ የተጠቃሚ ግብይት ይህን ሜታዳታ ብቻ ይፈልጋል -

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

ይህ ገጽ ሁለት የተለመዱ ቅጦችን ያሳያል -

- ነፃ ተጠቃሚ ጽፏል ስፖንሰር አድራጊው XOR ይከፍላል እና ተጠቃሚው ምንም አይከፍልም.
- የአካባቢያዊ-ቶከን ክፍያዎች ተጠቃሚው ስፖንሰር ለማድረግ በመተግበሪያ ቶከን ይከፍላል፣ እና ስፖንሰር አድራጊው አውታረ መረቡን በ XOR ይከፍላል።

መጀመሪያ Taira ወይም የግል የሙከራ አውታረ መረብ ይጠቀሙ። አዲስ የግል ዳታ ቦታ ኦፕሬተር እና የአስተዳደር ለውጥ ነው; በደንበኛ ውቅር አልተፈጠረም.

## ምሳሌ እሴቶች {#example-values}

ከታች ያሉት ትዕዛዞች እነዚህን ቦታ ያዢዎች ይጠቀማሉ

```bash
export DATASPACE="team"
export USER="<USER_ACCOUNT_I105>"
export SPONSOR="<SPONSOR_ACCOUNT_I105>"
export TREASURY="<TREASURY_ACCOUNT_I105>"
export XOR_ASSET="xor#universal"
export BILLING_DOMAIN="billing.team"
export LOCAL_FEE_ASSET="usage#billing.team"
export LOCAL_FEE_ASSET_ID="<LOCAL_FEE_ASSET_DEFINITION_BASE58>"
export USER_ALIAS="alice@team"
export PHONE_POLICY="phone#team"
export EMAIL_POLICY="email#team"
export POLICY_OWNER="<IDENTIFIER_POLICY_OWNER_ACCOUNT_I105>"
```

ማሰማራትዎ ለተመሳሳይ መለያዎች ንቁ የመለያ ተለዋጭ ስሞች ከሌለው በስተቀር ነጠላ ፕሮቶኮል-ስታንዳርድ I105 መለያ መታወቂያዎችን ይጠቀሙ።

## 1. የውሂብ ቦታን ያዘጋጁ {#_1-prepare-the-dataspace}

በ[ከ SORA Nexus የውሂብ ቦታዎች ጋር ይገናኙ](/am/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace) ውስጥ ከተገለጸው የግል ዳታ ቦታ ካታሎግ እና የማስተላለፊያ ስራ ይጀምሩ። ከኦፕሬተር ጋር የሚመለከት ቁርጥራጭ ይህን ይመስላል።

```toml
[[nexus.lane_catalog]]
index = 5
alias = "team-private"
description = "Private team lane"
dataspace = "team"
visibility = "private"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "team"
id = 42
description = "Private team dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "team"
[nexus.routing_policy.rules.matcher]
account_prefix = "team."
description = "Route team domains to the private dataspace"
```

ወደ የተጠቃሚ ግብይቶች ከመሄድዎ በፊት የሚከተሉትን ያረጋግጡ -

- የግል ማስፈጸሚያ መስመር በኖድ `/status` ምላሽ ውስጥ ይታያል
- የተጠቃሚ መለያዎች በእርስዎ የግል የመሳፈሪያ ፍሰት ይቀበላሉ
- የስፖንሰር መለያው አለ
- የ XOR ክፍያ ንብረት እና ክፍያ ማጠቢያ መለያ በአውታረ መረቡ ላይ የሚሰራ ነው።

## 2. በዳታ ቦታ ውስጥ ንብረቶችን ይመዝገቡ {#_2-register-assets-in-the-dataspace}

ተጠቃሚዎች ወደ አፕሊኬሽኑ አመክንዮ ከማገናኘትዎ በፊት በግል ዳታ ቦታ ውስጥ የሚይዙትን የንብረት ፍቺዎች ያስመዝግቡ። ለአካባቢያዊ-ቶከን ክፍያ ስርዓተ-ጥለት፣ አጋዥ ስልጠናው `usage#billing.team` ይጠቀማል -

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

በመጀመሪያ የንብረቱ የስም ቦታ ባለቤት የሆነውን ጎራ እና SNS የሊዝ ውል ያዋቅሩ። የቁጥር `team` የውሂብ ቦታ መታወቂያ፣ ነጠላ ፕሮቶኮል-መደበኛ ባለቤት፣ የሊዝ ውል እና የአሁኑን የየክፍያ ዋጋ ግምት ጠባቂን ጨምሮ ለ`$BILLING_DOMAIN` ከሚስጥር ነፃ የሆነ `AliasSetupPlanRequestV1` ዓላማ ይፍጠሩ።

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

ከዚያ የንብረት ፍቺውን ያስመዝግቡ። ነጠላ ፕሮቶኮል-ስታንዳርድ `--id` የአውታረ መረብ ደረጃ የንብረት ፍቺ መታወቂያ ነው። ተለዋጭ ስም ገንቢዎች እና የመጨረሻ ተጠቃሚዎች በዳታ ቦታ ኮድ ውስጥ ሊጠቀሙበት የሚገባው ነው -

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

በሚሳፈሩበት ጊዜ የአካባቢውን ቶከን ለተጠቃሚ ያውጡ ወይም ያስተላልፉ -

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

የተጠቃሚውን ቀሪ ሂሳብ ያረጋግጡ -

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

በዳታ ቦታ ውስጥ ለትግበራ ንብረቶች ተመሳሳይ ስርዓተ-ጥለት ይጠቀሙ። በአንድ ቶከን አንድ የንብረት ፍቺ ይመዝገቡ፣ ለእያንዳንዳቸው የውሂብ ቦታ ተለዋጭ ስም ይስጡ እና ነጠላ ፕሮቶኮል-ደረጃውን የጠበቀ የንብረት ፍቺ መታወቂያዎችን ከ SDK ኮድ ተለዋጭ ስም ይመልከቱ።

## 3. የተጠቃሚ ተለዋጭ ስሞችን ይመዝገቡ {#_3-register-user-aliases}

መለያዎች አሁንም ነጠላ ፕሮቶኮል-መደበኛ I105 መለያ መታወቂያዎች ናቸው። ተጠቃሚን የሚመለከቱ ስሞች የመለያ ተለዋጭ ስሞች ናቸው፣ እና ተለዋጭ ስሞች ሚስጥራዊነት የሌላቸው እጀታዎች መሆን አለባቸው እንደ `alice@team` ወይም `alice@members.team`። ስልክ ቁጥሮችን ወይም የኢሜይል አድራሻዎችን እንደ ተለዋጭ ስሞች አይጠቀሙ። እነዚያ በሚቀጥለው ክፍል ውስጥ ባለው የግል መለያ ፍሰት ውስጥ ናቸው።

ተለዋጭ ስም ማዋቀር እንደ ጎራ ማዋቀር ተመሳሳይ ገላጭ እቅድ አውጪ ይጠቀማል። የ SDK ወይም የመሳፈሪያ አገልግሎት ከሚስጥር ነፃ የሆነ `AliasSetupPlanRequestV1` ዓላማ እንዲፈጥር ያድርጉ መለያ-ተለዋጭ ስም የመግቢያ ኢላማ `$USER` ዋናውን ሚና ይመርጣል፣ የቁጥር ዳታ ቦታ መታወቂያውን ይሰካል እና የአሁኑን የሊዝ ክፍያ-ዋጋ ማረጋገጫ ጠባቂ ይይዛል። ከዚያ ያቅዱ እና እንደ አንድ የአቶሚክ ግብይት ይተግብሩ -

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

ተጠቃሚው መክፈል ካልቻለበት XOR የማዋቀር ግብይቱን ለመገንባት እና ለማስገባት የተፈቀደውን ስፖንሰር የሚያውቅ የመሳፈሪያ አገልግሎት ይጠቀሙ። የሊዝ ግዢን እና ተለዋጭ ስም አስገዳጅነትን ወደ ገለልተኛ የመተግበሪያ ግብይቶች አይከፋፍሉ።

ተለዋጭ ስሙ ከተጣበቀ በኋላ ከ CLI ያረጋግጡ

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

ለአዲስ መለያ መፍጠር፣ `NewAccount`ን በተረጋጋ `uaid` እና አስፈላጊ ከሆነም የመጀመሪያ `label` የሚገነባ የመሳፈሪያ አገልግሎትን ይምረጡ። ቀላሉ `ledger account register --id` ትዕዛዝ ነጠላ ፕሮቶኮል-ደረጃውን የጠበቀ መለያ መታወቂያ ብቻ ይመዘግባል።

## 4. በ FHE ስልክ እና ኢሜል በግል ይመዝገቡ {#_4-register-phone-and-email-privately-with-fhe}

ስልክ ቁጥሮችን እና የኢሜይል አድራሻዎችን እንደ የግል መለያ የይገባኛል ጥያቄዎች ይጠቀሙ እንጂ ይፋዊ ተለዋጭ ስሞች አይደሉም። በ FHE የተደገፈው ፍሰት ጥሬ መለያዎችን ከመለያ ተለዋጭ ስሞች፣ የግብይት ሜታዳታ እና የአለም ሁኔታ ያስቀምጣል -

1. ኦፕሬተሩ ለስልክ እና ለኢሜል [RAM-LFE/FHE የፕሮግራም ፖሊሲ](/am/blockchain/ram-lfe.md) ይመዘግባል
2. ኦፕሬተሩ እንደ `phone#team` እና `email#team` ያሉ ንቁ መለያ ፖሊሲዎችን ይመዘግባል
3. የኪስ ቦርሳው ስልኩን ወይም ኢሜይሉን በአገር ውስጥ መደበኛ ያደርገዋል
4. የኪስ ቦርሳው የተመሰጠረውን እሴት ወደ መፍትሄው ይልካል
5. ፈቺው ይመልሳል `IdentifierResolutionReceipt`
6. ተጠቃሚው ከደረሰኝ ጋር `ClaimIdentifier` ያቀርባል
7. ሰንሰለቱ ግልጽ ያልሆነ መለያ እና የደረሰኝ ምስጠራ ሃሽ ያከማቻል እንጂ ጥሬው ስልክ ወይም የኢሜል ዋጋ አይደለም

የኦፕሬተር-ጎን ፖሊሲ ማዋቀር SDK ወይም የአገልግሎት ተግባር ነው። ለእያንዳንዱ መለያ አይነት እነዚህን የመመሪያ ጥንዶች ይገንቡ እና ያስገቡ -

```text
RegisterRamLfeProgramPolicy(
  program_id = "phone_team",
  owner = "$POLICY_OWNER",
  backend = "bfv-programmed-sha3-256-v1",
  verification_mode = "signed",
  commitment = "<HIDDEN_PROGRAM_POLICY_COMMITMENT>",
  resolver_public_key = "<RESOLVER_PUBLIC_KEY>"
)
ActivateRamLfeProgramPolicy(program_id = "phone_team")

RegisterIdentifierPolicy(
  id = "$PHONE_POLICY",
  owner = "$POLICY_OWNER",
  normalization = "PhoneE164",
  program_id = "phone_team",
  note = "Private phone registration for team dataspace"
)
ActivateIdentifierPolicy(policy_id = "$PHONE_POLICY")
```

ለኢሜል ይድገሙት -

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

በሚሳፈሩበት ጊዜ፣ የኪስ ቦርሳው ወይም የጀርባው ክፍል በአካባቢው መደበኛ መሆን አለበት -

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

የስፖንሰር ሜታዳታ ፋይል በደረጃ 8 ከተፈጠረ በኋላ በተጠቃሚ የተፈረመ የይገባኛል ጥያቄ መመሪያ በዚያ ሜታዳታ ያስገቡ -

```text
ClaimIdentifier(
  account = "$USER",
  receipt = IdentifierResolutionReceipt {
    payload: {
      policy_id: "$PHONE_POLICY",
      opaque_id: "<OPAQUE_ACCOUNT_ID>",
      uaid: "<USER_UAID>",
      account_id: "$USER",
      ...
    },
    attestation: "<RESOLVER_SIGNATURE_OR_PROOF>"
  }
)
```

የአሁኑ CLI ለእነዚህ የማንነት መመሪያዎች የተተየቡ ትዕዛዞችን አያጋልጥም። ተከታታይ `InstructionBox` እሴቶችን በ SDK ይፍጠሩ እና በ`ledger transaction stdin` በኩል ያስገቡ -

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

እነዚህን የጥበቃ መንገዶች በመሳፈሪያ አገልግሎት ውስጥ ያስቀምጡ -

- የመለያ ተለዋጭ ስሞች በሰው ሊነበቡ የሚችሉ እጀታዎች ብቻ ናቸው
- ጥሬ የስልክ እና የኢሜል እሴቶች በተለዋጭ ስሞች፣ ሜታዳታ፣ ምዝግብ ማስታወሻዎች ወይም የግብይት ጭነቶች ውስጥ በጭራሽ አይታዩም
- መለያው የግል መለያዎችን ከመጠየቁ በፊት `uaid` አለው
- የደረሰኞች ማሰር `policy_id`፣ `opaque_id`፣ `uaid`፣ `account_id` እና ጊዜው ያለፈበት
- የመፍትሄ ቁልፎች እና የተደበቁ የፕሮግራም ክሪፕቶግራፊያዊ ኮሚትመንቶች በአስተዳደር ቁጥጥር ስር ናቸው

## 5. በኖድ ላይ ስፖንሰርሺፕን አንቃ {#_5-enable-sponsorship-on-the-node}

የክፍያ ስፖንሰርሺፕ የኖድ/የአሂድ ጊዜ ፖሊሲ ነው። በ Nexus የክፍያ ውቅር ውስጥ አንቃው -

```toml
[nexus.fees]
fee_asset_id = "xor#universal"
fee_sink_account_id = "<FEE_SINK_ACCOUNT_I105_OR_ALIAS>"
base_fee = "0"
per_byte_fee = "0"
per_instruction_fee = "0.001"
per_gas_unit_fee = "0.00005"
sponsorship_enabled = true
sponsor_max_fee = "0"
```

`fee_asset_id` የአውታረ መረብ ክፍያ ንብረት ነው። ለ SORA Nexus ይህ XOR ነው። በአውታረ መረብዎ የተጋለጠውን ገባሪ XOR ተለዋጭ ስም ወይም ነጠላ ፕሮቶኮል-ስታንዳርድ XOR የንብረት ፍቺ መታወቂያ ይጠቀሙ።

`sponsor_max_fee = "0"` ማለት የግብይት ስፖንሰር ካፕ የለም ማለት ነው። ለምርት፣ የእርስዎን ዳታ ቦታ ግብይቶች መደበኛ መጠን እና የግብይት ማስፈጸሚያ ወጪ መገለጫ ካወቁ በኋላ ዜሮ ያልሆነ ካፕ ያዘጋጁ።

ይህንን ውቅር በተለመደው የኦፕሬተር ሂደትዎ እንደገና ያስጀምሩ ወይም ይንከባለሉ።

## 6. ስፖንሰር አድራጊውን ይፍጠሩ እና ይደግፉ {#_6-create-and-fund-the-sponsor}

አስፈላጊ ከሆነ የስፖንሰር ቁልፍ ጥንድ ይፍጠሩ -

```bash
kagami keys --algorithm ed25519 --out-dir ./fee-sponsor-key
```

የህዝብ ቁልፉን ለአውታረ መረብዎ ወደ መለያ ቅርጸት ይለውጡ -

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

የስፖንሰር መለያውን በግል የመመዝገቢያ ፍሰትዎ በኩል ይመዝግቡ፦

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

ስፖንሰር አድራጊውን ከግምጃ ቤት፣ የይገባኛል ጥያቄ ሂሳብ ወይም ሌላ የገንዘብ ድጋፍ በማድረግ XOR የገንዘብ ድጋፍ ያድርጉ -

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

ለ Taira ልምምዶች፣ የቴስትኔት የገንዘብ ድጋፍ አገልግሎት አጋዥን ከ [Testnet XOR ን በ Taira ያግኙ](/am/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) እንደ `taira_faucet_claim.py` ያስቀምጡ፣ ከዚያ ከግምጃ ቤት ዝውውር ይልቅ ስፖንሰርውን በሕዝብ ቴስትኔት የገንዘብ ድጋፍ አገልግሎት ይደግፉ -

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

የስፖንሰር አድራጊውን XOR ቀሪ ሂሳብ ያረጋግጡ -

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. ለተጠቃሚ ስፖንሰር አድራጊውን መዳረሻ ይስጡ {#_7-grant-a-user-access-to-the-sponsor}

ስፖንሰር አድራጊው ለእያንዳንዱ ተጠቃሚ ክፍያ እንዲያስከፍል ፍቃድ መስጠት አለበት። ይህ ፍቃድ ተጠቃሚዎች የዘፈቀደ የስፖንሰር መለያዎችን እንዳይመርጡ የሚከለክለው ነው።

ይህንን እንደ ስፖንሰር መለያ ያሂዱ፣ ወይም በሶፍትዌር ማስፈጸሚያ አካባቢ ፖሊሲዎ የተፈቀደው እንደ ኦፕሬሽን መለያ -

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission grant --id "$USER"
```

ለመሳፈሪያ አገልግሎቶች፣ ይህንን መደበኛ የመለያ አቅርቦት እርምጃ ያድርጉት እና ይግቡ -

- የተጠቃሚ መለያ
- የስፖንሰር መለያ
- የውሂብ ቦታ ወይም መተግበሪያ
- የማጽደቅ ትኬት ወይም የአስተዳደር ውሳኔ

የተጠቃሚውን ድጎማዎች ለመመርመር -

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. የስፖንሰር ሜታዳታ ያያይዙ {#_8-attach-sponsor-metadata}

እንደገና ጥቅም ላይ ሊውል የሚችል ሜታዳታ ፋይል ይፍጠሩ -

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

ከዚህ ሜታዳታ ጋር የቀረበ ማንኛውም የመጻፍ ክዋኔ ለስፖንሰር አድራጊው እንዲከፍል ይደረጋል -

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

ለ SDKs፣ ተመሳሳዩን የግብይት ሜታዳታ ነገር ከተፈረመው ግብይት ጋር ያያይዙት። ተጠቃሚው ግብይቱን በተጠቃሚው ቁልፍ ይፈርማል። ስፖንሰር አድራጊው እያንዳንዱን የተጠቃሚ ግብይት አይፈርምም ምክንያቱም የቀደመው `CanUseFeeSponsor` ስጦታ ፍቃድ ነው።

## ስርዓተ-ጥለት 1 ተጠቃሚዎች ምንም ክፍያ አይከፍሉም {#pattern-1-users-pay-no-fees}

አፕሊኬሽኑ ወይም ኦፕሬተሩ ሁሉንም የአውታረ መረብ ክፍያዎች ሲወስድ ይህንን ይጠቀሙ።

የገንቢ ማረጋገጫ ዝርዝር -

1. የተጠቃሚውን መደበኛ የግብይት ጭነት ሳይለወጥ ያቆዩት።
2. የግብይት ሜታዳታ በ`fee_sponsor` ያክሉ።
3. እንደ ተጠቃሚ ምልክት ያድርጉ።
4. በግል የውሂብ ቦታ መንገድ በኩል ያስገቡ።

የተጠቃሚው መለያ XOR ቀሪ ሂሳብ አያስፈልገውም። የስፖንሰር መለያው የተዋቀሩትን Nexus ክፍያዎችን ለመሸፈን በቂ XOR መያዝ አለበት።

## ስርዓተ-ጥለት 2 ተጠቃሚዎች የአካባቢ ቶከን ይከፍላሉ {#pattern-2-users-pay-a-local-token}

ተጠቃሚዎች XOR ን መያዝ በማይኖርበት ጊዜ ይህንን ይጠቀሙ፣ ነገር ግን የውሂብ ቦታው አሁንም የውስጥ መተግበሪያ ክፍያ፣ የክሬዲት ወጪ ወይም የኮታ ቶከን ያስፈልገዋል።

በዚህ ስርዓተ-ጥለት, የአካባቢ ቶከን የመተግበሪያ ክፍያ ነው. የአውታረ መረብ ክፍያ ንብረት አይደለም. ስፖንሰር አድራጊው አሁንም የኔትወርክ ክፍያውን በ XOR ይከፍላል።

ለምሳሌ፣ በግል የውሂብ ቦታ ውስጥ የአካባቢ ቶከን ይጠቀሙ -

```text
usage#billing.team
```

በመሳፈር፣ በደንበኝነት ምዝገባ እድሳት ወይም በኮታ ድልድል ወቅት ለተጠቃሚዎች በ`usage#billing.team` የገንዘብ ድጋፍ ያድርጉ። ከዚያ የተጠቃሚውን ግብይት አቶሚክ ያድርጉት -

1. የአካባቢ ቶከኖችን ከተጠቃሚው ወደ ስፖንሰር አድራጊው ያስተላልፉ
2. የተጠየቀውን የመተግበሪያ ተግባር ያከናውኑ
3. ስፖንሰር አድራጊው እንዲከፍል `fee_sponsor` ሜታዳታን ያካትቱ XOR

አነስተኛ CLI የየመጀመሪያ የስራ ሙከራ በ XOR ስፖንሰር የተደረገው የአካባቢያዊ-ቶከን ዝውውር ብቻ ነው።

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

ለእውነተኛ መተግበሪያ፣ የአካባቢያዊ-ቶከን ክፍያን እንደ የተለየ የምርጥ ጥረት ግብይት አያስገቡ። ክፍያውን እና የንግድ መመሪያውን የያዘ አንድ የተፈረመ ግብይት ይገንቡ ወይም የንግድ ስራውን ከመተግበሩ በፊት የአካባቢውን ቶከን የሚሰበስብ የኮንትራት መግቢያ ነጥብ ያጋልጡ።

የልወጣ መመሪያን በመተግበሪያዎ ወይም ውልዎ ውስጥ ያስቀምጡ፦

- የትኛው ክዋኔ ምን ያህል የአካባቢ ቶከን ክፍሎች ያስከፍላል
- XOR መሙላትን ስፖንሰር ለማድረግ የአካባቢ ቶከን ፍሰት ካርታዎች እንዴት እንደሚገኙ
- የተጠቃሚ ቀሪ ሂሳብ በጣም ዝቅተኛ ከሆነ ምን ይከሰታል
- ስፖንሰር XOR ቀሪ ሒሳብ በጣም ዝቅተኛ ከሆነ ምን ይከሰታል

::: warning

ስፖንሰር አድራጊው በዚያ የግብይት ማስፈጸሚያ ወጪ ንብረት ውስጥ እንዲከፍል ካልፈለጉ በስተቀር `gas_asset_id`ን ለ"አካባቢያዊ-ቶከን ክፍያ" ስርዓተ-ጥለት አይጠቀሙ። አሁን ባለው የሶፍትዌር አፈፃፀም አካባቢ፣ `fee_sponsor` እንዲሁም ስፖንሰር ሰጪውን ለተዋቀሩ የሶፍትዌር ማቀነባበሪያ መስመር ጋዝ ንብረት ዴቢቶች ከፋይ ያደርገዋል። ለአካባቢያዊ-ቶከን ተጠቃሚ ክፍያዎች፣ ቶከኑን በዝውውር ወይም በኮንትራት ህግ በግልፅ ይሰብስቡ።

:::

## ማረም ያልተሳካ ስፖንሰር የተደረጉ ግብይቶች {#debug-failed-sponsored-transactions}

የተለመዱ ውድቅ ምክንያቶች ብዙውን ጊዜ አንድ የጎደለውን የማዋቀር ደረጃ ያመለክታሉ -

|የስህተት ጽሑፍ|ምን ማረጋገጥ እንዳለበት|
| --- | --- |
|`fee sponsorship is disabled`|`nexus.fees.sponsorship_enabled` አሁንም `false` በኖድ ላይ ነው።|
|`fee sponsor is not authorized`|ተጠቃሚው ለዚህ ስፖንሰር `CanUseFeeSponsor` የለውም።|
|`fee asset ... is missing`|ስፖንሰር አድራጊው የተዋቀረውን XOR የክፍያ ንብረት አይይዝም።|
|`fee balance ... is insufficient`|የስፖንሰር አድራጊውን XOR ቀሪ ሂሳብ ይሙሉ።|
|`fee exceeds sponsor_max_fee`|`sponsor_max_fee` ከፍ ያድርጉ ወይም የግብይት መጠን/ጋዝ ይቀንሱ።|
|`invalid nexus fee asset id`|`nexus.fees.fee_asset_id` ወይም XOR የንብረት ተለዋጭ ስም ያስተካክሉ።|

ስርዓተ-ጥለት 2ን ሲያርሙ ሁለቱንም ቀሪ ሒሳቦች ያረጋግጡ -

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"

iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

## ስፖንሰር ሰጪውን ያንቀሳቅሱ {#operate-the-sponsor}

ስፖንሰር አድራጊውን እንደ የግምጃ ቤት ሂሳብ ይያዙት -

- ለTestnet፣ Staging እና Mainnet የተለየ የስፖንሰር ቁልፎችን ያስቀምጡ
- ስፖንሰር አድራጊው XOR ቀሪ ሒሳብ የመግቢያ ወለል ላይ ከመድረሱ በፊት ማንቂያ
- ትራፊክ አንዴ ከታወቀ ዜሮ ያልሆነ `sponsor_max_fee` ካፕ ያዘጋጁ
- ተመን ገደብ ስፖንሰር የተደረገ የመጻፍ ክዋኔዎች በመተግበሪያዎ ወይም በመግቢያዎ ውስጥ
- ተጠቃሚዎች የውሂብ ቦታውን ለቀው ሲወጡ `CanUseFeeSponsor` ይሰርዙ
- የተጠቃሚ ግብይት ምስጠራ ሃሽዎችን፣ የአካባቢያዊ-ቶከን ክፍያዎችን እና ስፖንሰር XOR ዴቢቶችን ያስታርቁ

ለተጠቃሚ ስፖንሰርሺፕን ሰርዝ -

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission revoke --id "$USER"
```

## ተዛማጅ ገጾች {#related-pages}

- [ከ SORA Nexus የውሂብ ቦታዎች ጋር ይገናኙ](/am/get-started/sora-nexus-dataspaces.md)
- [Iroha 3 በ CLI በኩል ያሂዱ](/am/get-started/operate-iroha-via-cli.md)
- [ንብረቶች](/am/blockchain/assets.md)
- [ፈቃዶች](/am/blockchain/permissions.md)
- [የፍቃድ ቶከኖች](/am/reference/permissions.md)
