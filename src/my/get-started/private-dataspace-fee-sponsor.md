---
translation_locale: my
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 270e6705186d74efad6a8d2e6eeb432ab1b12649b66d4b11309e7da1e07b384f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ပုဂ္ဂလိက ဒေတာနေရာအတွက် ထောက်ပံ့သူ အခွန်များ {#sponsor-fees-for-a-private-dataspace}

အခကြေးထောက်ပံ့မှုသည် အသုံးပြုသူများအား သီးသန့်ဒေတာနေရာမှ ငွေပေးချေမှုများ မတင်သွင်းဘဲ
စိုက်ပျိုးရေးလုပ်ငန်း XOR. သုံးစွဲသူက ငွေပေးချေမှုကို လက်မှတ်ထိုးနေဆဲပါ။
ပံ့ပိုးသူရဲ့ အကောင့်မှာ အချက်တွေရှိပြီး Runtime က ပံ့ပိုးပေးသူရဲ့ XOR ဟန်ချက်ညီမှု
ကွန်ရက်ခအတွက်ပါ။

ပေါင်းစပ်မှုမှာ ရွေ့လျားနေတဲ့ အစိတ်အပိုင်း သုံးခုရှိပါတယ်။

1. node က fee sponsor လုပ်ခွင့်ပေးတယ်
2. ပံ့ပိုးသူစာရင်းရှိပြီး ရှိပါသည် XOR
3. သုံးစွဲသူတိုင်းမှာ `CanUseFeeSponsor` ဒီထောက်ခံသူအတွက်

အဲဒီနောက်မှာ ထောက်ပံ့တဲ့ သုံးစွဲသူတိုင်းရဲ့ ငွေပေးချေမှုအတွက် ဒီမီတာဒေတာတွေပဲ လိုပါတယ်။

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

ဒီစာမျက်နှာမှာ တွေ့နေကျ ပုံစံနှစ်ခုကို ပြထားပါတယ်-

- **အခမဲ့ အသုံးပြုသူ ရေးသည်**: ပံ့ပိုးပေးသူက ပေးဆပ်တယ်။ XOR သုံးစွဲသူက ဘာမှမပေးဘူး။
- **ဒေသတွင်းတန်ဖိုးများအတွက် အခွန်များ**: သုံးစွဲသူက ပံ့ပိုးသူကို app token ဖြင့်ပေးပြီး
  ပံ့ပိုးပေးသူက ကွန်ရက်ကို XOR.

အသုံးပြုခြင်း Taira (သို့) မူပိုင် စမ်းသပ်ရေးကွန်ရက်ကို အရင်ဆုံး။
Operator နဲ့ Governance ပြောင်းလဲမှုပါ၊ client configuration ကနေ မဖန်တီးပါဘူး။

## ဥပမာ တန်ဖိုးများ {#example-values}

အောက်က command တွေမှာ placeholder တွေကို သုံးပါတယ်။

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

Canonical ကို အသုံးပြုပါ။ I105 အကောင့် IDs သင့်ရဲ့ တပ်ချထားမှုမှာ တက်ကြွတဲ့ အကောင့်မရှိရင်
စာရင်းတွေအတွက် အမည်မဖော်လိုပါ။

## (၁) ဒေတာနေရာကို ပြင်ဆင်ပါ။ {#_1-prepare-the-dataspace}

Private Data Space Catalogue နှင့် Routing Work များမှ စတင်၍
[ချိတ်ဆက် SORA Nexus ဒေတာနေရာများ](/my/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace).
Operator ကို မျက်နှာမူထားတဲ့ အပိုင်းလေးက ဒီလိုပါ။

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

User Transactions ကို မပြောင်းခင်မှာ

- Private lane က node ထဲမှာ ပေါ်လာတယ် `/status` တုံ့ပြန်မှု
- သုံးစွဲသူ အကောင့်တွေကို သင့်ရဲ့ ပုဂ္ဂလိက အွန်ဘုတ်စီးဆင်းမှုကနေ လက်ခံပါတယ်။
- ပံ့ပိုးသူစာရင်းရှိတယ်
- ကော်မတီ XOR ငွေကြေးခွန်များနှင့် ငွေကြေးစွန့်လွှတ်မှု အကောင့်များက ကွန်ရက်တွင် သက်ဝင်သည်။

## (၂) ဒေတာနေရာတွင် အရင်းအမြစ်များကို မှတ်ပုံတင်ခြင်း {#_2-register-assets-in-the-dataspace}

အသုံးပြုသူများက သီးသန့်အတွင်းမှာ သိမ်းဆည်းထားကြမယ့် အရင်းအမြစ်အနက်ကောက်ချက်များကို မှတ်ပုံတင်ပါ။
ဒေတာပမာဏကို Application Logic ထဲသို့ သွယ်ဝိုက်မပေးခင်
ပုံစံ၊ သင်ခန်းစာသုံး `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

ပထမ domain ကို set up လုပ်ပြီး SNS asset name space ကို ပိုင်ဆိုင်တဲ့ ငှားရမ်းမှု
လျှို့ဝှက်ချက်မဲ့ `AliasSetupPlanRequestV1` ရည်ရွယ်ချက် `$BILLING_DOMAIN`, ပါဝင်သည်
ဂဏန်းကိန်း `team` ဒေတာနေရာ ID, တရားဝင်ပိုင်ရှင်၊ ငှားရမ်းမှုသက်တမ်းနဲ့ လက်ရှိ quote
စောင့်:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

အဲဒီနောက်မှာ အရင်းအမြစ်ရဲ့ အဓိပ္ပါယ်ဖွင့်ဆိုချက်ကို မှတ်တမ်းတင်ပါ။ `--id` network level ကို
အရင်းအမြစ် သတ်မှတ်ချက် ID. အမည်မဖော်လိုတာက ဒီဇိုင်နာတွေနဲ့ အဆုံးသုံးသူတွေ သုံးသင့်တဲ့
ဒေတာနေရာကုဒ်:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

Onboarding လုပ်နေစဉ်မှာ ဒေသတွင်း token ကို အသုံးပြုသူဆီ လွှဲပြောင်းပေးခြင်း

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

သုံးစွဲသူရဲ့ ဟန်ချက်ညီမှုကို စစ်ဆေးပါ။

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

Datapace ထဲက Application assets တွေအတွက် အလားတူ ပုံစံကို သုံးပါ။
token တစ်ခုစီအတွက် asset definition ကိုပေးပြီး data space alias တစ်ခုစီ ပေးပြီး
အမည်မဖော်လိုသူ SDK Code အစား Hard-coding ကနေ Canonical asset definition ကို IDs.

## သုံးစွဲသူ အမည်များကို မှတ်ပုံတင်ပါ။ {#_3-register-user-aliases}

စာရင်းတွေက တရားဝင်ပဲ I105 အကောင့် IDs. အသုံးပြုသူ မျက်နှာစာ အမည်များက အကောင့်
အမည်မဖော်လိုတဲ့ လက်ကိုင်အမည်တွေ ဖြစ်သင့်ပါတယ်။ `alice@team` ဒါမှမဟုတ်
`alice@members.team`. ဖုန်းနံပါတ် (သို့) အီးမေးလ်လိပ်စာတွေကို အမည်မဖော်လိုပါနဲ့။
ဒါတွေဟာ နောက်ပိုင်းမှာရှိတဲ့ ပုဂ္ဂလိက မှတ်သားရေး flux ထဲကို ဝင်ပါတယ်။

alias setup က domain setup လို declarative planner ကိုပဲ သုံးတယ္။ SDK ဒါမှမဟုတ်
Onboarding ဝန်ဆောင်မှုကို လျှို့ဝှက်ချက်မဲ့ ဖန်တီးပါ။ `AliasSetupPlanRequestV1` ရည်ရွယ်ချက်
စာရင်းဝင်ရန် ရည်မှန်းချက်များ `$USER`, အဓိကအခန်းကဏ္ဍကို ရွေးချယ်ပြီး ကိန်းဂဏန်းကို ပိုက်
ဒေတာနေရာ ID, လက်ရှိ ငှားရမ်းမှု quote guard ကို သယ်ဆောင်ပြီး ဒါကို စီစဉ်ပြီး အသုံးချပါ။
အဏုမြူလုပ်ငန်းတစ်ခုအဖြစ်:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

သုံးစွဲသူက မပေးသင့်ဘူးဆိုရင် XOR, ခွင့်ပြုထားတဲ့ ပံ့ပိုးသူသိတဲ့ Onboarding ကို သုံးပါ။
စီမံကိန်းကို တည်ဆောက်ပြီး တင်ပြဖို့ ဝန်ဆောင်မှု။ ငှားရမ်းမှုကို ခွဲမထားပါ။
လွတ်လပ်တဲ့ လျှောက်လွှာ ငွေကြေး ရယူမှုတွေနဲ့ အမည်မဖော်လိုပါ။

အမည်မဖော်လိုတဲ့နောက် ဒါကို စစ်ဆေးပါ။ CLI:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

Account အသစ်တစ်ခု ဖန်တီးဖို့ build လုပ်တဲ့ Onboarding ဝန်ဆောင်မှုကို ကြိုက်တယ်။
`NewAccount` ခန်းခုံနဲ့ `uaid` လိုအပ်ရင် အစပိုင်း `label`. နိုင်ငံခြားရေး
ရိုးစင်း `ledger account register --id` Command က Canonical ကိုပဲ မှတ်ပုံတင်တယ်
အကောင့် ID.

## 4. ဖုန်းနဲ့ အီးမေးလ်ကို သီးသန့် မှတ်ပုံတင်ပါ။ FHE {#_4-register-phone-and-email-privately-with-fhe}

ဖုန်းနံပါတ်များနှင့် အီးမေးလ်လိပ်စာများကို အများပြည်သူမဟုတ်ဘဲ ပုဂ္ဂလိကအမှတ်တံဆိပ်များအဖြစ် အသုံးပြုပါ။
အမည်မဖော်လိုသူတွေ၊ FHE- backed flow က account aliases တွေကနေ raw identifier တွေကို ဖယ်ရှားပေးတယ်။
ငွေလဲလှယ်မှု metadata နဲ့ ကမ္ဘာ့အခြေအနေ

1. လုပ်ငန်းရှင်က မှတ်ပုံတင်
   [RAM-LFE/FHE အစီအစဉ် မူဝါဒ](/my/blockchain/ram-lfe.md) ဖုန်းနဲ့ အီးမေးလ်အတွက်
2. လုပ်ငန်းရှင်က Active Identifier Policies တွေကို မှတ်ပုံတင်ပေးတယ် `phone#team` နှင့်
   `email#team`
3. ပိုက်ဆံအိတ်က ဖုန်း (သို့) အီးမေးလ်ကို ဒေသတွင်းမှာ ပုံမှန်လုပ်ပေးတယ်။
4. ပိုက်ဆံအိတ်က Encrypted Value ကို Resolver သို့ ပို့ပေးတယ်။
5. Resolver က `IdentifierResolutionReceipt`
6. သုံးစွဲသူက တင်ပြသည် `ClaimIdentifier` လက်မှတ်နဲ့အတူ
7. ကွင်းဆက်က မရှင်းလင်းတဲ့ ID နဲ့ လက်မှတ် hash ကို သိမ်းထားတယ်၊ ဆန်ဖုန်းမဟုတ်ဘူး။
   အီးမေးလ်တန်ဖိုး

လုပ်ငန်းရှင်ဘက်က မူဝါဒ သတ်မှတ်ချက်ဟာ SDK (သို့) ဝန်ဆောင်မှုတာဝန်။ တည်ဆောက်ပြီး တင်ပြပါ။
ဒီညွှန်ကြားချက်စုံတိုင်းအတွက် မှတ်သားစရာ အမျိုးအစား:

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

အီးမေးလ်အတွက် ထပ်လုပ်ပါ

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

Onboarding လုပ်နေစဉ်မှာ Wallet (သို့) Backend ကို ဒေသတွင်း ပုံမှန်ဖြစ်သင့်ပါတယ်။

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

Step 8 မှာ sponsor metadata file ကို ဖန်တီးပြီးနောက် user လက်မှတ်ထိုးထားတဲ့
အဲဒီ metadata ကို အသုံးပြုပြီး claim instruction ကို:

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

လက်ရှိ CLI ဤအမည်များအတွက် ရိုက်ထည့်ထားသော အမိန့်များကို ဖော်ပြခြင်းမရှိပါ။
ညွှန်ကြားချက်များ။ `InstructionBox` တန်ဖိုးများနှင့် SDK နှင့်
အပြီးသတ် တင်ပြပါ `ledger transaction stdin`:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

ဒီကာကွယ်ရေးအခွံတွေကို Onboarding ဝန်ဆောင်မှုမှာ ထားပါ။

- Account aliases တွေက လူဖတ်လို့ရတဲ့ လက်ကိုင်တွေပဲ
- raw phone နဲ့ email value တွေဟာ aliases, metadata, logs တွေမှာ ဘယ်တော့မှ မပေါ်ဘူး
  ကုန်သွယ်မှု အသုံးဝင်ဝန်ဆောင်မှုများ
- စာရင်းမှာ `uaid` ပုဂ္ဂလိက မှတ်သားစရာတွေ တောင်းမခံရခင်
- လက်မှတ်များ ချုပ်ဆို `policy_id`, `opaque_id`, `uaid`, `account_id`, သက်တမ်းကုန်ဆုံး
- resolver key တွေနဲ့ hidden program commitments တွေကို governance က ထိန်းချုပ်ပါတယ်။

## (၅) Node မှာ Sponsorship ကို Activate လုပ်ပါ။ {#_5-enable-sponsorship-on-the-node}

အခွန်ထောက်ပံ့မှုသည် node/runtime မူဝါဒတစ်ခုဖြစ်သည်။ Nexus အခွန်ပုံပြင်:

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

`fee_asset_id` Network fee asset ဖြစ်ပါတယ် SORA Nexus ဒါကတော့ XOR. သုံးပါ
တက်ကြွ XOR alias သို့မဟုတ် canonical XOR အရင်းအမြစ် သတ်မှတ်ချက် ID သင့်ကွန်ရက်ကနေ ဖေါ်ထုတ်ခံရတယ်။

`sponsor_max_fee = "0"` ငွေပေးချေမှုတစ်ခုအတွက် ပံ့ပိုးသူထိပ်တန်းမရှိခြင်းပါ။
ထုတ်လုပ်မှုမှာ ပုံမှန်အရွယ်အစားနဲ့ ဓာတ်ငွေ့ပရိုဖိုင်းကို သိပြီးတဲ့နောက် သုညမဟုတ်တဲ့ထိပ်သတ်မှတ်ပါ။
သင့်ရဲ့ ဒေတာဇုန် ငွေကြေးဆိုင်ရာ ကိစ္စရပ်တွေထဲက

သင့်ရဲ့ ပုံမှန် operator ဖြစ်စဉ်ကနေ ဒီ configuration ကို ပြန်စတင် (သို့) Roll လုပ်ပါ။

## (၆) ထောက်ပံ့သူကို ဖန်တီးပြီး ငွေကြေးထောက်ပံ့ပေးခြင်း {#_6-create-and-fund-the-sponsor}

လိုအပ်ရင် sponsor key pair ကို ဖန်တီးပါ။

```bash
kagami keys --algorithm ed25519 --json
```

အများသုံး သော့ကို ကွန်ရက်အတွက် အကောင့်ပုံစံသို့ ပြောင်းပါ။

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

Sponsor account ကို သင့်ရဲ့ Private Onboarding flow ကနေ မှတ်ပုံတင်ပါ။

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

ပံ့ပိုးသူကို ငွေကြေးထောက်ပံ့မှု XOR ဘဏ္ဍာငွေ၊ ချေးငွေစာရင်း (သို့) အခြား ငွေကြေးထောက်ပံ့မှုတစ်ခုမှ
စာရင်း:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

အတွက် Taira လေ့ကျင့်ခန်းတွေမှာ ရေချိုးစက်ကူညီသူကို ကယ်တင်ပါ။
[Testnet ကို ရယူပါ။ XOR အပေါ် Taira](/my/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
အတိုင်း `taira_faucet_claim.py`, အဲဒီနောက်မှာ ပံ့ပိုးသူကို အများပြည်သူရဲ့ ရေနွေးကြိုးနဲ့ ငွေပေးချေပေးပါ။
ငွေလွှဲပြောင်းမှုအစား

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

ပံ့ပိုးသူကို စစ်ကြည့်ပါ။ XOR ဟန်ချက်ညီမှု

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## (၇) သုံးစွဲသူအား Sponsor သို့ ဝင်ရောက်ခွင့်ပေးခြင်း {#_7-grant-a-user-access-to-the-sponsor}

ပံ့ပိုးသူသည် အသုံးပြုသူတစ်ဦးစီအား အခွန်ကောက်ခံရန် ခွင့်ပြုချက်ပေးရမည်။
သုံးစွဲသူတွေကို အလိုလို sponsor account တွေကို နာမည်မပေးတာကို တားဆီးပါတယ်။

ဒါကို ပံ့ပိုးသူ အကောင့်အဖြစ် (သို့) သင့်ရဲ့ ခွင့်ပြုထားတဲ့ လုပ်ငန်း အကောင့်အဖြစ်
ပြေးချိန် မူဝါဒ:

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

Onboarding ဝန်ဆောင်မှုအတွက် ဒါကို ပုံမှန်စာရင်းပေးသွင်းရေး အဆင့်တစ်ခုအဖြစ်လုပ်ပြီး မှတ်တမ်းတင်ပါ။

- အသုံးပြုသူစာရင်း
- ပံ့ပိုးသူစာရင်း
- ဒေတာနေရာ (သို့) အက်ပ်
- ခွင့်ပြုချက်လက်မှတ် (သို့) အုပ်ချုပ်ရေး ဆုံးဖြတ်ချက်

သုံးစွဲသူရဲ့ ထောက်ပံ့ငွေတွေကို စစ်ဆေးဖို့:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## (၈) ပံ့ပိုးသူ၏ မီတာဒေတာကို ချိတ်ဆက်ပေးပါ {#_8-attach-sponsor-metadata}

ပြန်လည်သုံးနိုင်တဲ့ metadata ဖိုင်ကို ဖန်တီးပါ။

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

ဤ metadata နှင့်အတူတင်သွင်းသော စာရင်းများအား sponsor မှစရိတ်ကောက်ခံသည်။

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

အတွက် SDKs, လက်မှတ်ရေးထိုးထားသော စာရွက်စာတမ်းတွင် တူညီသော ငွေကြေးဆိုင်ရာ metadata object ကို ချိတ်ဆက်ပါ
ငွေပေးချေမှု။ သုံးစွဲသူက အသုံးပြုသူရဲ့ သော့နဲ့ လက်မှတ်ထိုးတယ်။ ပံ့ပိုးသူ
user transaction တစ်ခုစီကို လက်မှတ်ထိုးမပေးပါဘူး `CanUseFeeSponsor`
ထောက်ပံ့မှုက ခွင့်ပြုချက်ပါ။

## ပုံစံ (၁) သုံးစွဲသူများ အခမဲ့ပေးသွင်းခြင်း {#pattern-1-users-pay-no-fees}

ဒီစနစ်ကို အသုံးပြုပြီး အပ်လီကေးရှင်း (သို့) အော်ပရေတာက ကွန်ရက်ခအားလုံး ကို စုပ်ယူတဲ့အခါမှာ သုံးပါ။

ဆောက်လုပ်သူ စစ်ဆေးစာရင်း:

1. သုံးစွဲသူရဲ့ ပုံမှန် ငွေကြေး ကုန်သွယ်မှု ဝန်ဆောင်မှုကို မပြောင်းလဲစေပါ။
2. Transaction metadata ကို `fee_sponsor`.
3. သုံးစွဲသူအဖြစ် လက်မှတ်ထိုးပါ။
4. ပုဂ္ဂလိက ဒေတာနေရာ လမ်းကြောင်းကနေ တင်ပါ။

သုံးစွဲသူကောင့်အတွက် XOR ငွေကြေးပံ့ပိုးသူရဲ့စာရင်းမှာ
လုံလောက်တယ် XOR configured ကိုဖုံးအုပ်ရန် Nexus အခွန်များ။

## ပုံစံ (၂) သုံးစွဲသူများက ဒေသတွင်းမှတ်တံဆိပ်ကို ပေးသွင်းခြင်း {#pattern-2-users-pay-a-local-token}

အသုံးပြုသူက မကိုင်ထားသင့်တဲ့ အချိန်မှာ ဒါကို သုံးပါ။ XOR, ဒါပေမဲ့ ဒေတာနေရာက still လိုချင်တယ်
အတွင်းပိုင်း app အခကြေး၊ ခရက်ဒစ်သုံးစွဲမှု (သို့) ကော်တို token

ဒီပုံစံမှာ ဒေသတွင်း token ဟာ application payment ပါ။
Network fee asset ကို ပံ့ပိုးသူက Network fee ကို XOR.

ဥပမာ၊ ပုဂ္ဂလိက ဒေတာနေရာတွင် ဒေသတွင်း token ကို အသုံးပြုပါ။

```text
usage#billing.team
```

ရင်းနှီးမြှုပ်နှံမှု အသုံးပြုသူများ `usage#billing.team` Onboarding လုပ်နေစဉ်၊ subscription renewal လုပ်နေစဉ်
အဲဒီနောက်မှာ သုံးစွဲသူရဲ့ ငွေကြေးကို အက်တမ်လုပ်ပါ။

1. ဒေသတွင်း tokens ကို အသုံးပြုသူမှ sponsor သို့ လွှဲပြောင်းပေးရန်
2. requested app operation ကို လုပ်ဆောင်ပါ။
3. ပါဝင်ပါ `fee_sponsor` metadata ဆိုတော့ sponsor ကပေးတယ် XOR

အနည်းဆုံး CLI မီးခိုးစမ်းသပ်မှုဟာ ဒေသတွင်းက Token လွှဲပြောင်းမှုသာဖြစ်ပါတယ် XOR:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

တကယ့် app တစ်ခုအတွက်တော့ Local Token payment ကို သီးခြားအဖြစ် မတင်ပါနဲ့။
အကောင်းဆုံး အားထုတ်မှု ငွေကြေးပေးချေမှုကို တည်ဆောက်ပါ။
ငွေပေးချေမှုနှင့် လုပ်ငန်းညွှန်ကြားချက်များ သို့မဟုတ် စာချုပ်ဝင်ရောက်ရေးနေရာကို ဖော်ပြခြင်း
လုပ်ငန်းဆောင်ရွက်မှုကို မလုပ်ဆောင်ခင် ဒေသတွင်း token ကို ကောက်ယူတယ်။

သင့်ရဲ့ app (သို့) စာချုပ်မှာ ငွေလွှဲပြောင်းရေး မူဝါဒကို သိမ်းထားပါ။

- ဘယ်လုပ်ငန်းက ဘယ်လောက် ဒေသတွင်း token ယူနစ်တွေ ကုန်ကျမလဲ
- ဒေသတွင်း token စီးဆင်းမှုမြေပုံများ sponsor ကိုဘယ်လို XOR အပြည့်အစုံ
- သုံးစွဲသူရဲ့ ဟန်ချက်ညီမှုက အရမ်းနိမ့်တဲ့အခါ ဘာတွေဖြစ်လာမလဲ
- ပံ့ပိုးပေးသူ XOR ဟန်ချက်ညီမှုဟာ အရမ်းနိမ့်လွန်းတယ်။

::: warning

မသုံးပါ `gas_asset_id` "ဒေသတွင်းမှတ်တံဆိပ်ခ" ပုံစံအတွက် သင်မလိုရင်
လက်ရှိ ပြေးဆွဲချိန်အတွင်းမှာ
`fee_sponsor` ပံ့ပိုးပေးသူကို စီစဉ်ထားတဲ့ ဘိုက်လိုင်း ဓာတ်ငွေ့အတွက် ပေးသွင်းသူအဖြစ်လည်း သတ်မှတ်ထားတယ်။
ဒေသတွင်း token သုံးစွဲသူ အခကြေးများအတွက် token ကို explicitly
လွှဲပြောင်းခြင်း သို့မဟုတ် စာချုပ်စည်းမျဉ်း။

:::

## မအောင်မြင်သော ပံ့ပိုးမှုရောင်းဝယ်မှုများကို ပြင်ဆင်ခြင်း {#debug-failed-sponsored-transactions}

မကြာခဏဆိုသလို ငြင်းပယ်ခြင်း အကြောင်းပြချက်တွေက တစ်ဆင့်က ပျောက်နေတာကို ညွှန်ပြပါတယ်။

| အမှား စာသား | ဘာကို စစ်ဆေးရမလဲ |
| --- | --- |
| `fee sponsorship is disabled` | `nexus.fees.sponsorship_enabled` ဆက်ရှိနေဆဲပါ။ `false` node မှာပါ။ |
| `fee sponsor is not authorized` | သုံးစွဲသူသည် `CanUseFeeSponsor` ဒီထောက်ခံသူအတွက်ပါ။ |
| `fee asset ... is missing` | ပံ့ပိုးသူသည် ဖွဲ့စည်းထားသော XOR အခွန်အထောက်အပံ့ |
| `fee balance ... is insufficient` | ပံ့ပိုးသူရဲ့ အပို XOR ဟန်ချက်ညီမှု။ |
| `fee exceeds sponsor_max_fee` | မြှင့်တင် `sponsor_max_fee` (သို့) ငွေပေးချေမှု အရွယ်အစား/ဓာတ်ငွေ့ကို လျှော့ချပါ။ |
| `invalid nexus fee asset id` | ပြင်ဆင်ခြင်း `nexus.fees.fee_asset_id` ဒါမှမဟုတ် XOR အရင်းအမြစ် အမည်မဖော်လိုပါ။ |

Debug pattern 2 ကို စစ်တဲ့အခါ balance နှစ်ခုစလုံးကိုစစ်ပါ။

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

## ပံ့ပိုးပေးသူကို ထိန်းချုပ်ပါ {#operate-the-sponsor}

ပံ့ပိုးသူကို ဘဏ္ဍာရေးစာရင်းအဖြစ် ဆက်ဆံပါ။

- testnet၊ staging နဲ့ mainnet အတွက် သီးခြား sponsor key တွေကို သိမ်းထားပါ။
- ပံ့ပိုးသူကို သတိပေးချက် XOR ဟန်ချက်ညီမှုက ဝင်ခွင့်အဆင့်ကို ရောက်သွားတယ်။
- သုညမဟုတ်တဲ့ ကိန်းကို သတ်မှတ်ပါ။ `sponsor_max_fee` Traffic ကို characterization လုပ်ပြီးတာနဲ့ cap
- သင့်ရဲ့ လျှောက်လွှာ (သို့) ဂိတ်ဝေ့စ်မှာ ငွေကြေး အကန့်အသတ် ပံ့ပိုးစာသားတွေ
- ရုပ်သိမ်းခြင်း `CanUseFeeSponsor` အသုံးပြုသူများက ဒေတာနေရာမှ ထွက်သွားသောအခါ
- user transaction hashes, local-token payments နဲ့ sponsor တွေကို ပေါင်းစပ်ပေးပါ။ XOR
  ငွေချေးငွေ

သုံးစွဲသူအတွက် ပံ့ပိုးမှုကို ဖျက်သိမ်းပါ

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

## ဆက်စပ် စာမျက်နှာများ {#related-pages}

- [ချိတ်ဆက် SORA Nexus ဒေတာနေရာများ](/my/get-started/sora-nexus-dataspaces.md)
- [လုပ်ဆောင်မှု Iroha 3 အပြင် CLI](/my/get-started/operate-iroha-via-cli.md)
- [အရင်းအမြစ်များ](/my/blockchain/assets.md)
- [ခွင့်ပြုချက်များ](/my/blockchain/permissions.md)
- [ခွင့်ပြုချက် လက်မှတ်များ](/my/reference/permissions.md)
