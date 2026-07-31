---
translation_locale: am
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 270e6705186d74efad6a8d2e6eeb432ab1b12649b66d4b11309e7da1e07b384f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ለግል የመረጃ ቦታ የሚከፈልባቸው የስፖንሰር ክፍያዎች {#sponsor-fees-for-a-private-dataspace}

የክፍያ ስፖንሰርነት ተጠቃሚዎች የግል የውሂብ ቦታ ግብይቶችን ያለ
እርሻ XOR. ተጠቃሚው አሁንም ግብይቱን ይፈርማል
በስፖንሰር ሂሳብ ላይ ያሉ ነጥቦች፣ እና የሂደት ጊዜ የስፖንሰር ክፍያዎች XOR ሚዛን
ለኔትወርክ ክፍያ።

ውህደቱ ሦስት ተንቀሳቃሽ ክፍሎች አሉት

1. አገናኙ የክፍያ ስፖንሰርነትን ይፈቅዳል
2. የስፖንሰር ሂሳቡ አለ እና አለው XOR
3. እያንዳንዱ ተጠቃሚ `CanUseFeeSponsor` ለዚያ ስፖንሰር

ከዚያ በኋላ እያንዳንዱ የተደገፈ ተጠቃሚ ግብይት ይህንን ሜታዳታ ብቻ ይፈልጋል-

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

ይህ ገጽ ሁለት የተለመዱ ንድፎችን ያሳያል:

- **ነፃ ተጠቃሚ ይጽፋል**: ስፖንሰር የሚከፍለው XOR ተጠቃሚው ምንም አይከፍልም።
- **የአካባቢያዊ ቶን ክፍያዎች**: ተጠቃሚው በስፖንሰርነት በመተግበሪያ ምልክት ይከፍላል ፣ እና
  ስፖንሰር ለኔትወርኩ የሚከፍለው XOR.

አጠቃቀም Taira አዲስ የግል የውሂብ ቦታ
ኦፕሬተር እና የአስተዳደር ለውጥ; በደንበኛ ውቅር የተፈጠረ አይደለም.

## ምሳሌ እሴቶች {#example-values}

ከታች ያሉት ትዕዛዞች እነዚህን ቦታ መያዙን ይጠቀማሉ:

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

ቀኖናዊ አጠቃቀም I105 መለያ IDs የእርስዎ ተሰማሪነት ንቁ መለያ ካለው በስተቀር
ተመሳሳይ ሂሳቦችን የሚመለከቱ ስያሜዎች።

## 1. የመረጃ ቦታውን አዘጋጅ {#_1-prepare-the-dataspace}

በዝርዝሩ ውስጥ ከተገለጸው የግል የመረጃ ቦታ ካታሎግ እና የጉዞ ሥራ ይጀምሩ
[ጋር ይገናኙ SORA Nexus የመረጃ ቋቶች](/am/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace).
ከኦፕሬተሩ ጋር የተያያዘ አንድ ቁራጭ እንደዚህ ይመስላል:

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

- የግል መስመሩ በቆንጆው ውስጥ ይታያል `/status` ምላሽ
- የተጠቃሚ መለያዎች የግል ውስጣዊ ፍሰትዎን በመጠቀም ይቀበላሉ
- የስፖንሰር ሂሳብ አለ
- የ XOR የክፍያ አክሲዮን እና የክፍያው ማጠፊያ ሂሳብ በኔትወርኩ ውስጥ ትክክለኛ ናቸው

## 2. በመረጃ ቦታ ውስጥ ያሉ ንብረቶችን መመዝገብ {#_2-register-assets-in-the-dataspace}

ተጠቃሚዎች የግል ውስጥ ይይዛሉ መሆኑን ንብረት ትርጉሞች መመዝገብ
መተግበሪያ አመክንዮ ውስጥ እነሱን ማሰራት በፊት የውሂብ ቦታ.
ሞዴል, የ መማሪያ ይጠቀማል `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

በመጀመሪያ ጎራውን ያዘጋጁ እና SNS የአክሲዮን ስም ቦታ ባለቤት የሆኑ የኪራይ ስም.
ሚስጥር የለሽ `AliasSetupPlanRequestV1` ዓላማ `$BILLING_DOMAIN`, ጨምሮ
የቁጥር `team` የመረጃ ቦታ ID, የካኖኒክ ባለቤት፣ የኪራይ ጊዜና የአሁኑ ዋጋ
ጠባቂ

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

ከዚያም የንብረት ማብራሪያ መዝገብ. `--id` የኔትወርክ ደረጃ ነው
የአክሲዮን ትርጉም ID. ስያሜው ገንቢዎች እና የመጨረሻ ተጠቃሚዎች
የመረጃ ቋት ኮድ:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

በቦርድ ላይ በሚገኝበት ጊዜ አካባቢያዊውን ቶከን ለመጠቀም ወይም ለማስተላለፍ:

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

በመረጃ አከባቢው ውስጥ ላሉት የመተግበሪያ ንብረቶች ተመሳሳይ ንድፍ ይጠቀሙ
የንብረት ትርጉም በአንድ ቶከን, ለእያንዳንዱ አንድ የውሂብ ቦታ ስያሜ መስጠት, እና ወደ
ከ SDK በሃርድ-ኮዲንግ ካኖኒካዊ የንብረት ትርጉም ፋንታ ኮድ IDs.

## 3. የተጠቃሚ ስያሜዎችን መመዝገብ {#_3-register-user-aliases}

ሂሳቦች አሁንም ሕጋዊ ናቸው I105 መለያ IDs. የተጠቃሚ ስም መለያዎች
ስያሜዎች, እና ስያሜዎችን እንደ-ስሜታዊ ያልሆኑ እጀታዎች መሆን አለባቸው `alice@team` ወይም
`alice@members.team`. የስልክ ቁጥሮች ወይም የኢሜይል አድራሻዎች ስያሜ ሆነው አይጠቀሙ።
እነዚህ በቀጣዩ ክፍል ውስጥ በሚገኘው የግል መታወቂያ ፍሰት ውስጥ ይገባሉ።

የቅጽል ስም ማዋቀር እንደ ጎራ ማዋቀር ተመሳሳይ አወጅ መርሃግብር ይጠቀማል. SDK ወይም
የማስገባት አገልግሎት ምስጢራዊ ነፃ `AliasSetupPlanRequestV1` ዓላማቸው
የሂሳብ-አልባነት ግቦች `$USER`, የመጀመሪያውን ሚና ይመርጣል ፣ የቁጥር ቁጥሮችን ያጣጥላል
የመረጃ ቦታ ID, እና የአሁኑን የኪራይ ዋጋ ጠባቂ ይይዛል. ከዚያም እቅድ እና ተግባራዊ
እንደ አንድ የአቶሚክ ግብይት:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

ተጠቃሚው መክፈል የማይገባ ከሆነ XOR, የተረጋገጠውን ስፖንሰር-አውቀው የሚጓዙበት መንገድ ይጠቀሙ
የመዋቅር ግብይቱን ለመገንባት እና ለማቅረብ አገልግሎት መስጠት።
በገለልተኛ የማመልከቻ ግብይቶች ውስጥ የሚጣበቁ ግዥዎች እና ቅጽል ስሞች።

ቅጽል ስም ከተገናኘ በኋላ ከ CLI:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

አዲስ መለያ ለመፍጠር፣
`NewAccount` በጣቢያው `uaid` አስፈላጊ ከሆነም የመጀመሪያውን `label`. የ
ቀላል `ledger account register --id` ትዕዛዙ የቅዱሳን መጻሕፍትን ብቻ ይመዘግባል።
መለያ ID.

## 4. ስልክ እና ኢሜይል በግል ይመዝገቡ FHE {#_4-register-phone-and-email-privately-with-fhe}

የስልክ ቁጥሮች እና የኢሜይል አድራሻዎች እንደ የግል መታወቂያ ማረጋገጫ ይጠቀሙ ፣ በይፋ አይደሉም
ስያሜዎች FHE- የተደገፈ ፍሰት የሂሳብ ስያሜዎችን ከቀይ መለያዎች ያስወግዳል፣
የግብይት ሜታዳታ እና የዓለም ሁኔታ

1. ኦፕሬተሩ አንድ
   [RAM-LFE/FHE የፕሮግራሙ ፖሊሲ](/am/blockchain/ram-lfe.md) ለስልክ እና ኢሜይል
2. ኦፕሬተሩ እንደ ንቁ መታወቂያ ፖሊሲዎችን ይመዘግባል `phone#team` እና
   `email#team`
3. የኪስ ቦርሳው ስልኩን ወይም ኢሜልን በአካባቢው ይደሰታል
4. የኪስ ቦርሳው የተመሰጠረውን እሴት ወደ መፍትሄ ሰጪው ይልካል
5. መፍትሄው አንድ `IdentifierResolutionReceipt`
6. ተጠቃሚው ያቀርባል `ClaimIdentifier` ደረሰኝ
7. ሰንሰለት ግልጽ ያልሆነ መታወቂያ እና ደረሰኝ ሃሽ ይይዛል ፣ ጥሬ ስልኩን ወይም
   የኢሜይል ዋጋ

የኦፕሬተር-የጎን ፖሊሲ ቅንብሮች SDK ወይም የአገልግሎት ተግባር.
ለእያንዳንዱ መታወቂያ አይነት እነዚህ መመሪያ ጥንዶች:

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

ለኢሜይል ይህን በድጋሚ ያድርጉ:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

በማስገባት ወቅት የኪስ ቦርሳው ወይም የጀርባው ክፍል በአካባቢው መደበኛ መሆን አለበት-

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

በደረጃ 8 ውስጥ የስፖንሰር ሜታዳታ ፋይል ከተፈጠረ በኋላ የተጠቃሚው የተፈረመ
በዚህ ሜታዳታ ጋር የመጠየቅ መመሪያ:

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

የአሁኑ CLI ለእነዚህ ማንነቶች የተጻፉ ትዕዛዞችን አያጋልጥም
መመሪያዎች. ተከታታይ ማመንጨት `InstructionBox` እሴቶች ጋር SDK እና
ያቅርቡት `ledger transaction stdin`:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

እነዚህን መከላከያዎች በቦርድ አገልግሎት ውስጥ ያቆዩ:

- የሂሳብ ስያሜዎች ለሰው ብቻ የሚነበቡ የእጅ አገናኞች ናቸው
- ጥሬ የስልክ እና የኢሜል እሴቶች በስያሜዎች ፣ በሜታዳታ ፣ በመዝገብ ወይም
  የግብይት ጥቅማጥቅሞች
- ሂሳቡ `uaid` የግል መታወቂያዎችን ከመጠየቁ በፊት
- ደረሰኞች ተያይዘዋል `policy_id`, `opaque_id`, `uaid`, `account_id`, እና ማብቂያ
- መፍትሔ ቁልፎች እና የተደበቁ ፕሮግራም ግዴታዎች በመንግስት ቁጥጥር ይደረግባቸዋል

## 5. በአውድ ውስጥ ስፖንሰርነትን ያግኙ {#_5-enable-sponsorship-on-the-node}

የክፍያ ስፖንሰርሺፕ የአገናኝ / ሩጫ ጊዜ ፖሊሲ ነው Nexus የክፍያ አወቃቀር

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

`fee_asset_id` የአውታረ መረብ ክፍያ አክሲዮን ነው SORA Nexus ይህ ነው XOR. ይጠቀሙ
ንቁ XOR ቅጽል ስም ወይም ቀኖናዊ XOR የአክሲዮን ትርጉም ID በኔትዎርክ የተጋለጡ ናቸው።

`sponsor_max_fee = "0"` ይህ ማለት በአንድ ግብይት ላይ የተሰጠው ስፖንሰር ገደብ የለም ማለት ነው።
ምርት, መደበኛ መጠን እና ጋዝ መገለጫ ካወቁ በኋላ ዜሮ ያልሆነ ገደብ ማዘጋጀት
የውሂብ ማዕከላት ግብይቶች.

ይህንን ውቅር በተለመደው የኦፕሬተር ሂደት ውስጥ እንደገና ያስጀምሩ ወይም ያንሱ.

## 6. ስፖንሰርን መፍጠርና የገንዘብ ድጋፍ ማድረግ {#_6-create-and-fund-the-sponsor}

አስፈላጊ ከሆነ አንድ ስፖንሰር ቁልፍ ጥንድ ማመንጨት:

```bash
kagami keys --algorithm ed25519 --json
```

የሕዝብ ቁልፍን ለኔትወርክዎ የመለያ ቅርጸት ይለውጡ:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

በስፖንሰር ሂሳብዎ በኩል የግል የደንበኝነት ምዝገባዎን ይመዝገቡ:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

ስፖንሰርን በ XOR ከግምጃ ቤት፣ ካፒታል ወይም ከሌላ የገንዘብ ድጋፍ የተደረገበት
ሂሳብ:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

ለ Taira ሙከራዎች, የቧንቧ ረዳት ማስቀመጥ
[ቴስትኔት ያግኙ XOR ላይ Taira](/am/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
እንደ `taira_faucet_claim.py`, ከዚያም ስፖንሰርውን በሕዝብ ማሰሮ ይደግፋል
ከግምጃ ቤት ዝውውር ይልቅ:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

የስፖንሰርሹን ይመልከቱ XOR ሚዛን:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. አንድ ተጠቃሚ ወደ ስፖንሰርው መዳረሻ እንዲያገኝ ማድረግ {#_7-grant-a-user-access-to-the-sponsor}

ስፖንሰር ለእያንዳንዱ ተጠቃሚ ክፍያ ለመጠየቅ ፈቃድ መስጠት አለበት።
ተጠቃሚዎች የትዕግሥት ስፖንሰር መለያዎችን እንዳይሰየሙ የሚከለክላቸው።

ይህንን እንደ ስፖንሰር መለያ ወይም በርስዎ የተፈቀደለት የአሠራር መለያ አድርገው ይሂዱ
የስራ ሰዓት ፖሊሲ

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

ለኦንቦርድ አገልግሎቶች ይህ መደበኛ የሂሳብ አቅርቦት ደረጃ እና መዝገብ ያድርጉ:

- የተጠቃሚ መለያ
- የስፖንሰር ሂሳብ
- የመረጃ ክልል ወይም ትግበራ
- የምስክር ወረቀት ወይም የአስተዳደር ውሳኔ

የተጠቃሚውን ድጎማ ለመመርመር:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. የስፖንሰር ሜታዳታ አገናኝ {#_8-attach-sponsor-metadata}

እንደገና ጥቅም ላይ የሚውል ሜታዳታ ፋይል ይፍጠሩ:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

በዚህ ሜታዳታ የተላከ ማንኛውም ጽሑፍ ለስፖንሰር ይከፍላል-

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

ለ SDKs, ተመሳሳይ የግብይት ሜታዳታ ዕቃ በፈረመው ላይ ይጨምሩ
ግብይት ተጠቃሚው ግብይቱን በመጠቀም ይፈርማል
እያንዳንዱ ተጠቃሚ ግብይት አይፈርም ምክንያቱም ቀደም ሲል `CanUseFeeSponsor`
ድጎማው ፈቃድ ነው።

## ምሳሌ 1፦ ተጠቃሚዎች ክፍያ አይከፍሉም {#pattern-1-users-pay-no-fees}

መተግበሪያው ወይም ኦፕሬተሩ ሁሉንም የአውታረ መረብ ክፍያዎች ሲቀበሉ ይህንን ይጠቀሙ።

የገንቢዎች ዝርዝር:

1. የተጠቃሚውን መደበኛ የግብይት ጭነት ያለ ለውጥ ይጠብቁ።
2. የግብይት ሜታ መረጃዎችን በ `fee_sponsor`.
3. እንደ ተጠቃሚው ይመዝገቡ።
4. የግል የውሂብ ቦታ መንገድ በኩል ያቅርቡ.

የተጠቃሚው መለያ XOR የገንዘብ ሚዛን
በቂ XOR የተዋቀሩትን ለመሸፈን Nexus ክፍያዎች።

## ምሳሌ 2፦ ተጠቃሚዎች የአካባቢውን ምልክት ይከፍላሉ {#pattern-2-users-pay-a-local-token}

ተጠቃሚዎች መያዝ የለባቸውም ጊዜ ይህን ይጠቀሙ XOR, ነገር ግን የመረጃ ክፍሉ አሁንም አንድ ይፈልጋል
የውስጥ የመተግበሪያ ክፍያ፣ የብድር ወጪ ወይም ኮታ ምልክት።

በዚህ ሞዴል ውስጥ, አካባቢያዊ ምልክት መተግበሪያ ክፍያ ነው.
የአውታረ መረብ ክፍያ አክሲዮን. XOR.

ለምሳሌ፣ የግል የውሂብ ቦታ ውስጥ አንድ አካባቢያዊ ምልክት ይጠቀሙ:

```text
usage#billing.team
```

የገንዘብ ተጠቃሚዎች `usage#billing.team` የደንበኝነት ምዝገባ ማዘመን፣
ከዚያ የተጠቃሚውን ግብይት አቶም ያድርጉ

1. ከተጠቃሚው ወደ ስፖንሰር የሚያስተላልፉ አካባቢያዊ ቶኮኖች
2. የተጠየቀውን የመተግበሪያ ተግባር ማከናወን
3. ያካትታል `fee_sponsor` ሜታዳታ ስለዚህ ስፖንሰር ይከፍላል XOR

አነስተኛ CLI የጭስ ሙከራ በአካባቢው ምልክት ማስተላለፍ ብቻ ነው XOR:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

ለእውነተኛ መተግበሪያ, የ አካባቢያዊ ምልክት ክፍያ እንደ የተለየ ማስገባት አይደለም
አንድ የተፈረመ ግብይት ይገንቡ
የክፍያ እና የንግድ መመሪያ, ወይም አንድ ውል መግቢያ ነጥብ ያጋልጣል
የንግድ ሥራውን ከመተግበርዎ በፊት አካባቢያዊውን ቶከን ይሰበስባል ።

በመተግበሪያዎ ወይም በውልዎ ውስጥ የመቀየሪያ ፖሊሲን ያስቀምጡ:

- የትኛው ተግባር ምን ያህል የአካባቢያዊ የቶከን አሃዶች ያስከፍላል
- የአካባቢያዊ የቶኪን ፍሰት ካርታዎች እንዴት እንደሚደገፉ XOR ተጨማሪዎች
- የተጠቃሚው ሚዛን በጣም ዝቅተኛ ከሆነ ምን ይሆናል
- ስፖንሰር ሲባል ምን ይሆናል? XOR ሚዛኑ በጣም ዝቅተኛ ነው

::: warning

አይጠቀሙ `gas_asset_id` "የአካባቢያዊ ምልክት ክፍያ" ንድፍ ላይ ካልፈለጉ በስተቀር
በወቅቱ በሚሰራበት ጊዜ፣
`fee_sponsor` በተጨማሪም ስፖንሰር የተዋቀረ የፓይፕላይን ጋዝ ተመላሽ እንዲሆን ያደርጋል
ለአካባቢያዊ ቶከን ተጠቃሚ ክፍያዎች፣ ቶከኑን በግልጽ በ
የማስተላለፍ ወይም የውል ደንብ።

:::

## ያልተሳካ የተደገፉ ግብይቶችን ማስተካከል {#debug-failed-sponsored-transactions}

የተለመዱ ውድቅ ምክንያቶች አብዛኛውን ጊዜ አንድ የጎደለው የመዋቅር እርምጃን ያመለክታሉ

| የስህተት ጽሑፍ | ምን ማረጋገጥ እንዳለበት |
| --- | --- |
| `fee sponsorship is disabled` | `nexus.fees.sponsorship_enabled` አሁንም ቢሆን `false` በቁስሉ ላይ። |
| `fee sponsor is not authorized` | ተጠቃሚው `CanUseFeeSponsor` ለዚህ ስፖንሰር። |
| `fee asset ... is missing` | ስፖንሰር የተዋቀረው XOR የክፍያ ንብረት። |
| `fee balance ... is insufficient` | የስፖንሰርስ ማሟያ XOR ሚዛን። |
| `fee exceeds sponsor_max_fee` | ከፍ ማድረግ `sponsor_max_fee` ወይም የግብይት መጠን/ጋዝ መቀነስ። |
| `invalid nexus fee asset id` | ማስተካከል `nexus.fees.fee_asset_id` ወይም XOR የአክሲዮን ስያሜ። |

ንድፍ 2 debugging ጊዜ, ሁለቱም ሚዛኖች ይመልከቱ:

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

ስፖንሰሩን እንደ የግምጃ ቤት ሂሳብ አድርገው ይይዙ

- ለሙከራ አውታረመረብ ፣ ለደረጃ ማድረስ እና ለዋና አውታረ መረብ የተለያዩ ስፖንሰር ቁልፎችን ይያዙ
- ለስፖንሰር ማስጠንቀቂያ XOR ሚዛኑ የመግቢያ ፎቅ ላይ ደርሷል
- 0 ያልሆነን ያስቀምጡ `sponsor_max_fee` ትራፊክ ከተገለጸ በኋላ የቁጥር ገደብ
- የክፍያ ገደብ የተደገፈ ጽሑፍ በአመልካችዎ ወይም በጌትዌይ ውስጥ
- መሰረዝ `CanUseFeeSponsor` ተጠቃሚዎች የመረጃ ቦታውን ሲለቁ
- የተጠቃሚ ግብይቶች ሃሽስ፣ አካባቢያዊ ቶከን ክፍያዎች እና ስፖንሰርዎችን ማመሳሰል XOR
  ክፍያዎች

ለተጠቃሚው ስፖንሰርነት መሰረዝ

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

- [ጋር ይገናኙ SORA Nexus የመረጃ ቋቶች](/am/get-started/sora-nexus-dataspaces.md)
- [ይሠራል Iroha 3 በኩል CLI](/am/get-started/operate-iroha-via-cli.md)
- [ንብረቶች](/am/blockchain/assets.md)
- [ፍቃዶች](/am/blockchain/permissions.md)
- [የመፍቀድ ምልክት](/am/reference/permissions.md)
