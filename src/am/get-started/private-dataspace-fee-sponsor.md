---
translation_locale: am
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 270e6705186d74efad6a8d2e6eeb432ab1b12649b66d4b11309e7da1e07b384f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ለግል የውሂብ ቦታ ስፖንሰር ክፍያዎች {#sponsor-fees-for-a-private-dataspace}

የክፍያ ስፖንሰርነት ተጠቃሚዎች XOR ሳይይዙ የግል የውሂብ ቦታ ግብይቶችን እንዲያቀርቡ ያስችላቸዋል ። ተጠቃሚው አሁንም ግብይቱን ይፈርማል ። የግብይት ሜታዳታ በስፖንሰር መለያ ላይ ያነጣጥራል ፣ እና የአፈፃፀም ጊዜ ለኔትወርክ ክፍያ የስፖንሰርቱ XOR ቀሪ ሂሳብ ይቀበላል።

ውህደቱ ሦስት ተንቀሳቃሽ ክፍሎች አሉት:

1. አንጓው የክፍያ ስፖንሰርነትን ይፈቅዳል
2. የስፖንሰር ሂሳብ አለ እና XOR አለው
3. እያንዳንዱ ተጠቃሚ ለዚያ ስፖንሰር `CanUseFeeSponsor` አለው

ከዚያ በኋላ እያንዳንዱ የተደገፈ ተጠቃሚ ግብይት ይህን ሜታዳታ ብቻ ይፈልጋል-

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

ይህ ገጽ ሁለት የተለመዱ ንድፎችን ያሳያል-

- ነፃ ተጠቃሚ እንዲህ ይላል: ስፖንሰር XOR ይከፍላል እና ተጠቃሚው ምንም አይከፍልም.
- የአካባቢያዊ ምልክት ክፍያዎች ተጠቃሚው ስፖንሰርውን በመተግበሪያ ምልክት ይከፍላል ፣ እና ስፖንസർ አውታረመረብን በ XOR ይከፍላል።

በመጀመሪያ Taira ወይም የግል የሙከራ አውታረመረብ ይጠቀሙ። አዲስ የግል የመረጃ ክልል ኦፕሬተር እና የአስተዳደር ለውጥ ነው; በደንበኛ ውቅር አልተፈጠረም.

## ምሳሌ እሴቶች {#example-values}

ከዚህ በታች ያሉት ትዕዛዞች እነዚህን ቦታ መያዙን ይጠቀማሉ-

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

በተመሳሳይ መለያዎች ላይ ንቁ የመለያ ቅጽል ስሞች ካሉበት በስተቀር ቀኖናዊ I105 መለያ IDs ይጠቀሙ።

## 1. የመረጃ ቦታውን አዘጋጅ። {#_1-prepare-the-dataspace}

በ [ ውስጥ ከተገለጸው የግል የውሂብ ቦታ ካታሎግ እና የመመሪያ ሥራ ይጀምሩ ወደ SORA Nexus የውሂብ ክፍሎች ](/am/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace) ይገናኙ። ከኦፕሬተር ጋር የተያያዘ አንድ ቁራጭ እንደዚህ ይመስላል-

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

ወደ ተጠቃሚው ግብይቶች ከመሄድዎ በፊት የሚከተሉትን ያረጋግጡ:

- የግል ጎዳና በ `/status` መልስ ውስጥ ይታያል
- የተጠቃሚዎች መለያዎች በግለሰባዊ የመጫኛ ፍሰትዎ በኩል ይቀበላሉ
- የስፖንሰር ሂሳብ አለ
- የ XOR ክፍያ አክሲዮን እና የክፍያ ማጥፊያ ሂሳብ በኔትወርኩ ውስጥ ዋጋ ያላቸው ናቸው

## 2. የውሂብ ቦታ ውስጥ ያሉ ንብረቶችን መመዝገብ {#_2-register-assets-in-the-dataspace}

በመተግበሪያ አመክንዮ ውስጥ ከመጫንዎ በፊት ተጠቃሚዎች በግለሰብ የውሂብ ቦታ ውስጥ የሚይዙትን የንብረት ትርጉሞች ይመዝገቡ. ለአካባቢያዊ-ቶከን ክፍያ ንድፍ ፣ ትምህርቱ `usage#billing.team` ይጠቀማል:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

በመጀመሪያ የንብረት ስም ቦታ ባለቤት የሆኑትን ጎራ እና SNS ኪራይ ያዘጋጁ። የቁጥር `team` የውሂብ ክፍልን ID ፣ የካኖኒካል ባለቤትን ፣ የኪራይ ጊዜን እና የአሁኑን ጥቅስ ጠባቂን ጨምሮ ለ `$BILLING_DOMAIN` ምስጢራዊ ነፃ የሆነ `AliasSetupPlanRequestV1` ዓላማ ይፍጠሩ:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

ከዚያ የንብረት ትርጓሜውን ይመዝገቡ። ቀኖናዊው `--id` የአውታረ መረብ ደረጃ ንብረት ትርጓሜ ID ነው ። ስያሜው ገንቢዎች እና የመጨረሻ ተጠቃሚዎች በመረጃ ቦታ ኮድ ውስጥ ሊጠቀሙበት የሚገባው ስም ነው-

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

በመጫን ላይ በሚገኝበት ጊዜ አካባቢያዊውን ቶከን ለመጠቀም ወይም ለማስተላለፍ:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

የተጠቃሚውን ሚዛን ይመልከቱ:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

በመረጃ ቦታው ውስጥ ለሚገኙ የመተግበሪያ ንብረቶች ተመሳሳይ ንድፍ ይጠቀሙ። በአንድ ቶከን ላይ አንድ የንብረት ትርጓሜ ያስመዝግቡ ፣ ለእያንዳንዱ የውሂብ ክልል ቅጽል ስም ይስጡ እና በሃርድ ኮዲንግ ካኖኒካዊ የንብረት ትርጉም IDs ምትክ ከ SDK ኮድ ወደሚገኘው ቅጽል ስም ያመልክቱ።

## 3. የተጠቃሚ ስያሜዎችን መመዝገብ {#_3-register-user-aliases}

መለያዎች አሁንም ቀኖናዊ I105 መለያ IDs ናቸው ። የተጠቃሚ ስም የመለያ ቅጽል ስሞች ናቸው ፣ እና ቅጽል ስሞቹ እንደ `alice@team` ወይም `alice@members.team` ያሉ ስሜታዊ ያልሆኑ እጀታዎች መሆን አለባቸው። የስልክ ቁጥሮች ወይም የኢሜል አድራሻዎችን እንደ ቅጽል ስያሜ አይጠቀሙ ። እነዚህ በሚቀጥለው ክፍል ውስጥ ባለው የግል መታወቂያ ፍሰት ውስጥ ይገኙበታል ።

የአጠራር ማዋቀር እንደ ጎራ ማዋቀር ተመሳሳይ የማስጠንቀቂያ ዕቅድ አውጪን ይጠቀማል. የ SDK ወይም የመጫኛ አገልግሎት ሚስጥራዊ ያልሆነ `AliasSetupPlanRequestV1` ዓላማ እንዲፈጥር ያድርጉ ፣ የትኛው የሂሳብ-አልባነት መግቢያ ግቦች `$USER` ፣ የመጀመሪያውን ሚና ይምረጣል ፣ የቁጥር የውሂብ ቦታ ID ፒን ያደርጋል ፣ እና የአሁኑ የኪራይ ዋጋ መጠበቂያ ጠባቂ ይይዛል። ከዚያም አንድን የአቶሚክ ግብይት ለማቀድና ተግባራዊ ለማድረግ ሞክር።

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

ተጠቃሚው XOR መክፈል የማይገባበት ከሆነ, የቅንጅት ግብይቱን ለመገንባት እና ለማቅረብ የተረጋገጠውን ስፖንሰር-ማወቃቸውን የመስመር ላይ አገልግሎት ይጠቀሙ.

ቅጽል ስም ከተጣመረ በኋላ ከ CLI ያረጋግጡ:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

አዲስ መለያ ለመፍጠር, የግንባታ አንድ ማሰስ አገልግሎት ይመርጣሉ `NewAccount` በጣቢያው `uaid` አስፈላጊ ከሆነም የመጀመሪያውን `label`. ቀላል `ledger account register --id` ትዕዛዙ የካኖኒክ ሂሳቡን ብቻ ይመዘግባል። ID.

## ስልክ እና ኢሜይል በግል በ FHE ይመዝገቡ። {#_4-register-phone-and-email-privately-with-fhe}

የስልክ ቁጥሮች እና የኢሜይል አድራሻዎች እንደ የግል መታወቂያ የይገባኛል ጥያቄዎች ይጠቀሙ, እንጂ የህዝብ ቅጽል ስሞች አይደለም. በ FHE የተደገፈ ፍሰት ጥሬ የሆኑ መለያዎችን ከሂሳብ ቅጽል ስም, ከግብይት ሜታዳታ እና ከአለም ሁኔታ ያወጣል:

1. ኦፕሬተሩ ለስልክ እና ኢሜይል የ [RAM-LFE/FHE ፕሮግራም ፖሊሲ ](/am/blockchain/ram-lfe.md) ይመዝግባል።
2. ኦፕሬተሩ እንደ `phone#team` እና `email#team` ያሉ ንቁ መታወቂያ ፖሊሲዎችን ይመዘግባል።
3. የኪስ ቦርሳው ስልኩን ወይም ኢሜልን በአካባቢያዊ ሁኔታ ያስተካክላል
4. የኪስ ቦርሳው የተመሰጠረውን ዋጋ ወደ መፍትሄ ሰጪው ይልካል።
5. መፍትሄ ሰጪው `IdentifierResolutionReceipt` መልሶ ይሰጣል።
6. ተጠቃሚው `ClaimIdentifier` ደረሰኝውን ያቀርባል
7. ሰንሰለት ግልጽ ያልሆነ መታወቂያ እና ደረሰኝ ሃሽ ያስቀምጣል ፣ ጥሬ የስልክ ወይም የኢሜል ዋጋ አይደለም።

የኦፕሬተር-ጎን ፖሊሲ ቅንብር SDK ወይም የአገልግሎት ተግባር ነው. ለእያንዳንዱ መታወቂያ አይነት እነዚህን መመሪያ ጥንዶች ይገንቡ እና ያቅርቡ:

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

ለኢሜይል በድጋሚ ያድርጉት:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

በመጫን ላይ ሳለ የኪስ ቦርሳው ወይም የጀርባው መስመር በአካባቢው መደበኛ መሆን አለበት-

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

በደረጃ 8 ውስጥ የስፖንሰር ሜታዳታ ፋይሉ ከተፈጠረ በኋላ ተጠቃሚው የተፈረመበትን የይገባኛል ጥያቄ መመሪያ ከሜታዳታ ጋር ያቅርቡ:

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

የአሁኑ CLI ለእነዚህ መታወቂያ መመሪያዎች የተጻፉ ትዕዛዞችን አያጋልጥም. በ SDK ላይ ተከታታይነት ያላቸውን `InstructionBox` እሴቶች ያመነጩ እና በ `ledger transaction stdin` በኩል ይላኩ

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

እነዚህን መከላከያዎች በቦርድ አገልግሎት ውስጥ ጠብቁ:

- የሂሳብ ስያሜዎች ለሰው ብቻ ሊነበቡ የሚችሉ እጀታዎች ናቸው
- ጥሬ የስልክ እና የኢሜይል እሴቶች በስሞች ፣ በሜታዳታ ፣ በመለያዎች ወይም በግብይት ጥቅማጥቅሞች ውስጥ በጭራሽ አይታዩም ።
- መለያው የግል መታወቂያዎችን ከመጠየቁ በፊት `uaid` አለው
- የምስክር ወረቀቶች `policy_id`, `opaque_id`, `uaid`, `account_id` እና ጊዜያቸውን ማጠናቀቅ
- የመፍትሄ ቁልፎች እና የተደበቁ የፕሮግራም ግዴታዎች በአስተዳደር ቁጥጥር ስር ናቸው

## 5. በአውታረ መረብ ላይ ስፖንሰርነትን ያስችሉ። {#_5-enable-sponsorship-on-the-node}

የክፍያ ስፖንሰርነት አንድ ኖት / ሩጫ ጊዜ ፖሊሲ ነው. በ Nexus ክፍያ ውቅር ውስጥ ያግኙት:

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

`fee_asset_id` የአውታረ መረብ ክፍያ ንብረቱ ነው SORA Nexus ይህ ነው XOR. ንቁውን ይጠቀሙ XOR ቅጽል ስም ወይም ቀኖና XOR የአክሲዮን ትርጉም ID በአውታረ መረብዎ የተጋለጡ.

`sponsor_max_fee = "0"` ማለት በአንድ ትራንስክሽን ስፖንሰር ገደብ የለም ማለት ነው ለምርታማነት የውሂብ ቦታ ግብይቶችዎ መደበኛ መጠን እና ጋዝ መገለጫ ካወቁ በኋላ የዜሮ ያልሆነ ገደብ ያዘጋጁ ።

ይህንን ውቅር በተለመደው የኦፕሬተር ሂደት ውስጥ እንደገና ያስጀምሩ ወይም ያንሱ ።

## 6. ስፖንሰርን መፍጠርና የገንዘብ ድጋፍ ማድረግ {#_6-create-and-fund-the-sponsor}

አስፈላጊ ከሆነ ስፖንሰር ቁልፍ ጥንድ ማመንጨት:

```bash
kagami keys --algorithm ed25519 --json
```

የሕዝብ ቁልፍን ለኔትወርክዎ የመለያ ቅርጸት ይለውጡ:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

የስፖንሰር ሂሳቡን በግል የደንበኝነት ምዝገባዎ በኩል ይመዝገቡ:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

በ XOR አማካኝነት ስፖንሰርውን ከግምጃ ቤት ፣ ከአስፈላጊነት ሂሳብ ወይም ከሌላ የገንዘብ ድጋፍ የተደረገበት ሂሳብ ያግኙ:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

ለ Taira ሙከራዎች, የቧንቧ ረዳት ማስቀመጥ [Testnet ን ያግኙ XOR ላይ Taira](/am/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) እንደ `taira_faucet_claim.py`, ከዚያ በስፖንሰር ገንዘብ ዝውውር ይልቅ በሕዝብ ፋይናንስ ይፋ ያደርጋል:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

የስፖንሰር የ XOR ቀሪውን ይመልከቱ

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. ተጠቃሚው ወደ ስፖንሰር እንዲደርስ ያድርጉ {#_7-grant-a-user-access-to-the-sponsor}

ስፖንሰር ለእያንዳንዱ ተጠቃሚ ክፍያ ለመጠየቅ ፈቃድ መስጠት አለበት ። ተጠቃሚዎች የትዕግሥት ስፖንസർ መለያዎችን እንዳይሰየሙ የሚከለክለው ድጎማ ነው።

ይህንን እንደ ስፖንሰር መለያ ይሂዱ፣ ወይም በስራ ሰዓት ፖሊሲዎ የተፈቀደውን የአሠራር መለያ:

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

ለደንበኝነት ምዝገባ አገልግሎቶች ይህ መደበኛ የሂሳብ አቅርቦት ደረጃ እና መዝገብ ያድርጉ:

- የተጠቃሚ መለያ
- የስፖንሰር ሂሳብ
- የውሂብ ቦታ ወይም መተግበሪያ
- የምስክር ወረቀት ወይም የአስተዳደር ውሳኔ

የተጠቃሚውን ድጎማ ለመመርመር:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. የስፖንሰር ሜታዳታ አገናኝ {#_8-attach-sponsor-metadata}

ዳግም ጥቅም ላይ የሚውል ሜታዳታ ፋይል ይፍጠሩ:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

ከዚህ ሜታዳታ ጋር የሚቀርብ ማንኛውም ጽሑፍ ለስፖንሰር ክፍያ ይከፍላል-

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

ለ SDKs ተመሳሳይ የግብይት ሜታዳታ ንጥረ ነገር ለተፈረመው ግብይት ይጨምሩ ። ተጠቃሚው ግብይቱን በተጠቃሚው ቁልፍ ይፈርማል ። ስፖንሰር እያንዳንዱን የተጠቃሚ ግብይት አይፈርምም ምክንያቱም የቀድሞው `CanUseFeeSponsor` Grant ፈቃድ ነው ።

## ምሳሌ 1፦ ተጠቃሚዎች ክፍያ አይከፍሉም {#pattern-1-users-pay-no-fees}

አፕሊኬሽኑ ወይም ኦፕሬተሩ ሁሉንም የኔትወርክ ክፍያዎች በሚወስድበት ጊዜ ይህን ይጠቀሙ።

የገንቢ ፍተሻ ዝርዝር:

1. የተጠቃሚውን መደበኛ የግብይት ጭነት ሳይቀይር ያድርጉ።
2. `fee_sponsor` በሚለው የግብይት ሜታዳታ ይጨምሩ።
3. እንደ ተጠቃሚው ይመዝገቡ።
4. በግል የውሂብ ቦታ መንገድ በኩል ያቅርቡ.

የተጠቃሚው ሂሳብ የ XOR ቀሪ ገንዘብ አያስፈልገውም፤ ስፖንሰር ሂሳቡ የተቀየሱትን Nexus ክፍያዎች ለመሸፈን የሚያስችል በቂ መጠን ያለው XOR መያዝ አለበት።

## ምሳሌ 2፦ ተጠቃሚዎች የአካባቢውን ምልክት ይከፍላሉ {#pattern-2-users-pay-a-local-token}

ተጠቃሚዎች XOR መያዝ የለባቸውም ጊዜ ይህንን ይጠቀሙ ፣ ግን የውሂብ ክፍሉ አሁንም ውስጣዊ የመተግበሪያ ክፍያ ፣ የብድር ወጪ ወይም ኮታ ቶክንን ይፈልጋል ።

በዚህ ሞዴል ውስጥ, የአካባቢያዊ ቶከን የመተግበሪያ ክፍያ ነው. የኔትወርክ ክፍያ ንብረቱ አይደለም. ስፖንሰር አሁንም የኔትወርክን ክፍያ በ XOR ይከፍላል.

ለምሳሌ, የግል የውሂብ ቦታ ውስጥ አካባቢያዊ ምልክት ይጠቀሙ:

```text
usage#billing.team
```

`usage#billing.team` ጋር ገንዘብ ተጠቃሚዎች በማስገባት ወቅት, የደንበኝነት ምዝገባ ማዘመን, ወይም ኮታ አከፋፈል. ከዚያም የተጠቃሚው ግብይት አቶሚክ ማድረግ:

1. ከተጠቃሚው ወደ ስፖንሰር የሚያስተላልፉ አካባቢያዊ ቶኮኖች
2. የተጠየቀውን የመተግበሪያ ተግባር ማከናወን
3. `fee_sponsor` ሜታዳታ ይጨምራል ስለዚህ ስፖንሰር XOR ይከፍላል

አነስተኛ CLI ጭስ ሙከራ በ XOR የተደገፈ የአካባቢ ምልክት ማስተላለፍ ብቻ ነው ።

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

ለእውነተኛ መተግበሪያ, የአካባቢያዊ ቶከን ክፍያውን እንደ የተለየ ምርጥ ጥረት ግብይት አያቅርቡ. የክፍያውን እና የንግድ መመሪያውን የሚያካትት አንድ የተፈረመ ግብይት ይገንቡ, ወይም የንግድ ሥራውን ከመተግበርዎ በፊት አካባቢያዊ ቶከንን የሚሰበስብ የውል መግቢያ ነጥብ ያሳዩ.

የመቀየሪያ ፖሊሲውን በመተግበሪያዎ ወይም በውልዎ ውስጥ ያስቀምጡ:

- የትኛው አሠራር ምን ያህል የአካባቢያዊ ቶከን ዩኒቶች ያስከፍላል
- XOR ማሟያዎችን ለመደገፍ የአካባቢያዊ የቲኮን ፍሰት ካርታዎች እንዴት እንደሚመጡ
- ተጠቃሚው ሚዛን በጣም ዝቅተኛ ከሆነ ምን ይከሰታል
- ስፖንሰር XOR ሚዛኑ በጣም ዝቅተኛ ከሆነ ምን ይሆናል?

::: ማስጠንቀቂያ

`gas_asset_id` ለ "አካባቢያዊ-ቶከን ክፍያ" ንድፍ ጥቅም ላይ አይውሉ ፣ ካልፈለጉ በስተቀር ስፖንሰር በዚያ የጋዝ ንብረት ውስጥም እንዲከፍል ይፈልጋሉ ። አሁን ባለው የአሂድ ጊዜ ውስጥ ፣ `fee_sponsor` ስፖንሰሩን ለተዋቀሩ የቧንቧ መስመር-ጋዝ ንብረቶች ዕዳዎች ተመላጭ ያደርጋል። ለአካባቢያዊ ቶከን ተጠቃሚዎች ክፍያዎች ፣ ቶከኑን በግልጽ በዝውውር ወይም በውል ደንብ ያግኙ።

:::

## ያልተሳኩ የተደገፉ ግብይቶችን ማስተካከል {#debug-failed-sponsored-transactions}

የተለመዱ ውድቅ ምክንያቶች አብዛኛውን ጊዜ አንድ የጎደለው የማዋቀር እርምጃን ይጠቁማሉ-

|የስህተት ጽሑፍ |ምን መመርመር አለብኝ ?|
| --- | --- |
|`fee sponsorship is disabled` |`nexus.fees.sponsorship_enabled` አሁንም `false` ላይ ኖት ነው. |
|`fee sponsor is not authorized` |ተጠቃሚው ለዚህ ስፖንሰር `CanUseFeeSponsor` የለውም። |
|`fee asset ... is missing` |ስፖንሰር የተዋቀረውን XOR የክፍያ ንብረትን አይይዝም። |
|`fee balance ... is insufficient` |የስፖንሰር የ XOR ቀሪውን ይጨምሩ. |
|`fee exceeds sponsor_max_fee` |`sponsor_max_fee` ይጨምሩ ወይም የግብይት መጠን/ጋዝ ይቀንሱ። |
|`invalid nexus fee asset id` |`nexus.fees.fee_asset_id` ወይም XOR ንብረቶች ስም። |

ንድፍ 2 debugging ጊዜ, ሁለቱንም ሚዛኖች ይመልከቱ:

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

## ስፖንሰርን ይጠቀሙ {#operate-the-sponsor}

ስፖንሰርን እንደ የግምጃ ቤት ሂሳብ አድርገው ይይዙ:

- ለሙከራ አውታረ መረብ ፣ ለደረጃ እና ለዋና አውታረመረብ የተለያዩ ስፖንሰር ቁልፎችን ይያዙ ።
- የስፖንሰር XOR ሂሳብ የመግቢያ ፎቅ ላይ ከመድረሱ በፊት ማስጠንቀቂያ
- ትራፊክ ከተገለጸ በኋላ ከዜሮ ያልሆነ የ `sponsor_max_fee` ገደብ ያስቀምጡ
- የዋጋ ገደብ የተደገፈ ጽሁፎች በአመልካችዎ ወይም በጌትዌይ ውስጥ
- ተጠቃሚዎች የመረጃ ቦታውን ለቀው ሲወጡ `CanUseFeeSponsor` ን ይሰርዙ
- የተጠቃሚ ትራንስክሽን ሃሽስ ፣ አካባቢያዊ ቶከን ክፍያዎች እና ስፖንሰር XOR ክሬዲት ማመሳሰል

ለተጠቃሚው ስፖንሰርነት መሰረዝ:

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

- [ወደ SORA Nexus የውሂብ መዳረሻዎች](/am/get-started/sora-nexus-dataspaces.md) ይገናኙ
- [በ Iroha 3 በኩል ይሠራል CLI](/am/get-started/operate-iroha-via-cli.md)
- [ንብረቶች](/am/blockchain/assets.md)
- [ፍቃዶች](/am/blockchain/permissions.md)
- [የፈቃድ ማስያዣዎች](/am/reference/permissions.md)
