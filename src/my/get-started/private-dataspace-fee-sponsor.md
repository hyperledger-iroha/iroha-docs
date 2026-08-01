---
translation_locale: my
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 270e6705186d74efad6a8d2e6eeb432ab1b12649b66d4b11309e7da1e07b384f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ပုဂ္ဂလိက ဒေတာနေရာအတွက် ထောက်ပံ့မှုခများ {#sponsor-fees-for-a-private-dataspace}

အခွန်ထောက်ပံ့မှုသည်အသုံးပြုသူများအနေဖြင့် XOR ကိုမကိုင်တွယ်ဘဲ ပုဂ္ဂလိကဒေတာနေရာဆိုင်ရာ ငွေကြေးပေးချေမှုများကိုတင်သွင်းနိုင်သည်။ အသုံးပြုသူသည် ယင်းငွေကြေးကို လက်မှတ်ရေးထိုးနေဆဲဖြစ်သည်။ ငွေကြေးဆောင်ရွက်မှု metadata သည် sponsor အကောင့်တွင်မှတ်သားထားပြီး runtime သည် network fee အတွက် sponsor ၏ balance XOR ကို debit ဖြစ်စေသည်။

ပေါင်းစပ်မှုမှာ ရွေ့လျားနေတဲ့ အစိတ်အပိုင်း သုံးခုရှိပါတယ်။

1. node က fee sponsor လုပ်ခွင့်ပေးတယ်
2. ပံ့ပိုးသူစာရင်းရှိပြီး XOR ရှိသည်။
3. သုံးစွဲသူတိုင်းအတွက် `CanUseFeeSponsor` ရှိသည်။

အဲဒီနောက်မှာ ထောက်ပံ့တဲ့ သုံးစွဲသူတိုင်းရဲ့ ငွေပေးချေမှုအတွက် ဒီမီတာဒေတာတွေပဲ လိုပါတယ်။

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

ဒီစာမျက်နှာမှာ တူညီတဲ့ ပုံစံနှစ်ခုကို ပြထားပါတယ်-

- အခမဲ့ အသုံးပြုသူ ရေးသားသည်မှာ: ပံ့ပိုးပေးသူက XOR ပေးပြီး သုံးစွဲသူက ဘာမှမပေးပါ။
- Local Token Fees: သုံးစွဲသူက Sponsor ကို App Token ဖြင့် ပေးဆပ်ပြီး Sponsor က Network ကို XOR ဖြင့်ပေးဆပ်ပါတယ်။

Taira သို့မဟုတ် ပုဂ္ဂလိက စမ်းသပ်ရေးကွန်ရက်ကို ပထမဦးဆုံး အသုံးပြုပါ။ ပုဂ္ဂလိক ဒေတာစေးသစ်သည် လုပ်ငန်းရှင်နှင့် အုပ်ချုပ်မှု ပြောင်းလဲမှုတစ်ခုဖြစ်ပြီး ဖောက်သည် ညွှန်ကြားချက်ဖြင့် ဖန်တီးခြင်းမဟုတ်ပါ။

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

သင့်ရဲ့ ဖြန့်ချိမှုမှာ တူညီတဲ့ အကောင့်တွေအတွက် တက်ကြွတဲ့ အကောင့် အမည်မပါက Canonical I105 account IDs ကိုသုံးပါ။

## (၁) ဒေတာနေရာကို ပြင်ဆင်ပါ။ {#_1-prepare-the-dataspace}

[ တွင်ဖော်ပြထားသော ပုဂ္ဂလိကဒေတာနေရာစာရင်းနှင့် လမ်းညွှန်ရေးအလုပ်များမှစ၍ SORA Nexus ဒေတာနေရာများသို့ ချိတ်ဆက်ပါ ](/my/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace) အော်ပရေတာကို မျက်နှာမူသည့်အပိုင်းအစသည် အောက်ပါအတိုင်းဖြစ်ပါသည်။

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

User Transactions ကို မပြောင်းခင်:

- Private lane ကို node `/status` တုံ့ပြန်မှုမှာတွေ့ရမှာပါ။
- သုံးစွဲသူအကောင့်တွေကို သင့်ရဲ့ ပုဂ္ဂလိက Onboarding စီးဆင်းမှုကနေ ဝင်ခွင့်ပြုပါတယ်။
- Sponsor account ရှိတယ်
- XOR အခွန်အရင်းအမြစ်နှင့် အခွန်အကောင့်သည် ကွန်ရက်တွင် သက်ဝင်သည်။

## 2. Data Spaces တွင် Assets များကို မှတ်ပုံတင်ပါ။ {#_2-register-assets-in-the-dataspace}

သုံးစွဲသူများက သီးသန့်ဒေတာနေရာအတွင်းမှာ သိမ်းထားရမည့် အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက်များကို application logic ထဲသို့ ထည့်သွင်းရန် မှတ်ပုံတင်ပါ။ ဒေသတွင်း token fee ပုံစံအတွက် သင်ခန်းစာတွင် `usage#billing.team` ကို အသုံးပြုသည်။

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

ပထမ domain ကို set up လုပ်ပြီး SNS အရင်းအမြစ်အမည်နေရာကိုပိုင်ဆိုင်တဲ့ ငှားရမ်းမှု။ လျှို့ဝှက်ချက်မဲ့ `AliasSetupPlanRequestV1` ရည်ရွယ်ချက် `$BILLING_DOMAIN`, အပါအဝင် ကိန်းဂဏန်း `team` ဒေတာနေရာ ID, Canonical ပိုင်ရှင်၊ ငှားရမ်းမှုသက်တမ်းနဲ့ လက်ရှိ quote guard:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

`--id` သည်ကွန်ရက်အဆင့်အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုချက် ID ဖြစ်သည်။ ဆောက်လုပ်သူများနှင့် နောက်ဆုံးအသုံးပြုသူများသည်ဒေတာနေရာကုဒ်တွင် အသုံးပြုသင့်သော alias ဖြစ်ပါသည်။

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

Onboarding လုပ်နေစဉ်မှာ ဒေသတွင်း token ကို အသုံးပြုသူဆီ လွှဲပြောင်းပေးပါ

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

ဒေတာနေရာတွင် application assets များအတွက်လည်း အလားတူပုံစံကို အသုံးပြုပါ။ Token တစ်ခုလျှင် asset definition ကို မှတ်ပုံတင်ပါ၊ တစ်ခုစီအား datapace alias ပေးပြီး hard-coding canonical asset definition IDs အစား SDK code မှ alias ကို reference လုပ်ပါ။

## သုံးစွဲသူ အမည်တွေကို မှတ်ပုံတင်ပါ။ {#_3-register-user-aliases}

စာရင်းတွေက တရားဝင်ပဲ I105 အကောင့် IDs. User-facing name တွေဟာ account aliases ဖြစ်ပြီး aliases တွေက non-sensitive handle တွေဖြစ်သင့်ပါတယ် `alice@team` ဒါမှမဟုတ် `alice@members.team`. ဖုန်းနံပါတ် (သို့) အီးမေးလ်လိပ်စာတွေကို အမည်မဖော်လိုပါနဲ့။ ဒါတွေဟာ နောက်ပိုင်းမှာရှိတဲ့ ပုဂ္ဂလိက မှတ်သားရေး အရည်အချင်းထဲ ပါဝင်ပါတယ်။

alias setup မှာ domain setup နဲ့အတူ declarative planner ကိုပဲ သုံးပါတယ်။ SDK (သို့) Onboarding ဝန်ဆောင်မှုကို လျှို့ဝှက်မှုမရှိတဲ့ `AliasSetupPlanRequestV1` ရည်ရွယ်ချက်၊ စာရင်းဝင်ရန် ရည်မှန်းချက်များ `$USER`, အဓိကအခန်းကဏ္ဍကို ရွေးချယ်ပြီး ကိန်းဂဏန်းဒေတာနေရာကို Pin လုပ်ပေးတယ်။ ID, လက်ရှိ ငှားရမ်းမှု quote guard ကို သယ်ဆောင်ပြီး နောက်မှာ စီစဉ်ပြီး အက်တမ် ငွေပေးချေမှုတစ်ခုအဖြစ် အသုံးချပါ။

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

အကယ်၍ အသုံးပြုသူသည် XOR ကိုမပေးသင့်ပါက အတည်ပြုထားသော ပံ့ပိုးသူ အသိအမှတ်ပြုထားတဲ့ Onboarding ဝန်ဆောင်မှုကို သုံးပြီး Setup Transaction ကို တည်ဆောက်ပြီး တင်ပြပါ။ ငှားရမ်းမှုဝယ်ယူခြင်းနှင့် အမည်မဖော်လိုဘဲ ချုပ်ဆိုခြင်းကို သီးခြားလျှောက်လွှာ ငွေချေးမှုအဖြစ် မခွဲခြားပါနဲ့။

အမည်မဖော်လိုသူကို ချည်နှောင်ပြီးနောက်၊ CLI မှ စစ်ဆေးပါ။

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

Account အသစ်တစ်ခု ဖန်တီးဖို့ build လုပ်တဲ့ Onboarding ဝန်ဆောင်မှုကို ပိုနှစ်သက်ပါ။ `NewAccount` စခန်းတစ်ခုနဲ့ `uaid` လိုအပ်ပါက အစောပိုင်း `label`. ရိုးရှင်းတဲ့ `ledger account register --id` command က Canonical account ကိုပဲ မှတ်ပုံတင်ပေးတယ် ID.

## (၄) FHE တွင် ဖုန်းနှင့် အီးမေးလ်ကို သီးသန့် မှတ်ပုံတင်ပါ။ {#_4-register-phone-and-email-privately-with-fhe}

ဖုန်းနံပါတ်များနှင့် အီးမေးလ်လိပ်စာများကို အများပြည်သူအမည်မဖော်လိုဘဲ ပုဂ္ဂလိကအမည်ဖော်လိုသူများအဖြစ် အသုံးပြုပါ။ FHE အားထောက်ပံ့သော စီးဆင်းမှုသည် အကောင့်အမည်၊ ငွေလွှဲပြောင်းမှု metadata နှင့်ကမ္ဘာအခြေအနေမှ raw identifiers များကို ပယ်ရှားထားသည်။

1. ဖုန်းနဲ့ အီးမေးလ်အတွက် [RAM-LFE/FHE အစီအစဉ် မူဝါဒ](/my/blockchain/ram-lfe.md) ကို operator က မှတ်ပုံတင်ပေးတယ်။
2. လုပ်ငန်းရှင်သည် `phone#team` နှင့် `email#team` ကဲ့သို့သော Active Identifier Policies များကို မှတ်ပုံတင်သည်။
3. ပိုက်ဆံအိတ်က ဖုန်း (သို့) အီးမေးလ်ကို ဒေသတွင်းမှာ ပုံမှန်လုပ်ပေးတယ်။
4. ပိုက်ဆံအိတ်က Encrypted Value ကို Resolver ကိုပို့ပေးတယ်။
5. Resolver က `IdentifierResolutionReceipt` ကို ပြန်ပို့တယ်။
6. သုံးစွဲသူက လက်မှတ်နှင့်အတူ `ClaimIdentifier` ကို တင်ပြသည်။
7. ကွင်းဆက်မှာ ပွင့်လင်းမြင်သာမှုမရှိတဲ့ ID နဲ့ လက်မှတ် hash ကို သိုလှောင်ထားတယ်၊ ဆန်ဖုန်း (သို့) အီးမေးလ် တန်ဖိုးမဟုတ်ဘူး။

Operator Side Policy Setup က SDK (သို့) ဝန်ဆောင်မှု တာဝန်ပါ။ အထောက်အထားအမျိုးအစားတိုင်းအတွက် ဒီညွှန်ကြားချက်စုံကို တည်ဆောက်ပြီး တင်ပြပါ:

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

Onboarding လုပ်နေစဉ်မှာ ပိုက်ဆံအိတ် (သို့) backend ကို ဒေသတွင်း ပုံမှန်ဖြစ်အောင်လုပ်သင့်ပါတယ်။

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

အဆင့် (၈) တွင် sponsor metadata file ကို ဖန်တီးပြီးနောက် အသုံးပြုသူလက်မှတ်ထိုးထားသော တောင်းဆိုချက် ညွှန်ကြားချက်ကို ထို metadata နှင့်အတူ တင်ပြပါ။

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

လက်ရှိ CLI သည် ဤသမိုင်းညွှန်ကြားချက်များအတွက် ရိုက်ထည့်ထားသော အမိန့်များကို ဖော်ပြခြင်းမရှိပါ။ SDK နှင့်အတူ serialized `InstructionBox` တန်ဖိုးများကိုထုတ်လုပ်ပြီး `ledger transaction stdin` မှတစ်ဆင့်ပို့ပါ:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

ဒီကာကွယ်ရေးအခွံတွေကို Onboarding ဝန်ဆောင်မှုမှာ ထိန်းထားပါ။

- Account aliases တွေက လူဖတ်လို့ရတဲ့ လက်ကိုင်တွေပဲ
- raw phone နဲ့ email values တွေကို aliases, metadata, logs, or transaction payloads တွေမှာ ဘယ်တော့မှ မပေါ်ပါဘူး။
- ငွေစာရင်းမှာ `uaid` ရှိပြီး private identifier တွေကို မတောင်းဆိုခင်
- လက်မှတ်များ `policy_id`, `opaque_id`, `uaid`၊ `account_id` နှင့် သက်တမ်းကုန်ဆုံးခြင်း
- resolver key တွေနဲ့ hidden-program commits တွေကို governance က ထိန်းချုပ်တယ်။

## (၅) Node မှာ Sponsorship ကို Activate လုပ်ပါ။ {#_5-enable-sponsorship-on-the-node}

အခကြေးထောက်ပံ့မှုသည် node/runtime မူဝါဒတစ်ခုဖြစ်သည်။ Nexus အခကြေး configuration တွင်ဖွင့်ပါ:

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

`fee_asset_id` network fee asset ဖြစ်ပါတယ် SORA Nexus ဒါကတော့ XOR. Active ကို အသုံးပြုပါ။ XOR အမည်မဖော်လိုသူ (သို့) တရားဝင် XOR အရင်းအမြစ် သတ်မှတ်ချက် ID သင့်ကွန်ရက်ကနေ ပွင့်လင်းမြင်သာလာခဲ့တယ်။

`sponsor_max_fee = "0"` ဆိုတာက ငွေပေးချေမှုတစ်ခုအတွက် ပံ့ပိုးသူထိပ်တန်းမရှိဘူးဆိုတာပါ။ ထုတ်ကုန်အတွက်တော့ သင့်ဒေတာစင်တာရယူမှုတွေရဲ့ ပုံမှန်အရွယ်အစားနဲ့ ဓာတ်ငွေ့ပရိုဖိုင်ကို သိပြီးနောက် သုညမဟုတ်တဲ့ထိပ်တန်း သတ်မှတ်ပါ။

ပုံမှန် Operator ဖြစ်စဉ်ကို ပြန်လည်စတင် (သို့) Roll လုပ်ပါ။

## (၆) ပံ့ပိုးပေးသူကို ဖန်တီးပြီး ငွေကြေးထောက်ပံ့ခြင်း {#_6-create-and-fund-the-sponsor}

လိုအပ်ရင် sponsor key pair ကို ဖန်တီးပါ။

```bash
kagami keys --algorithm ed25519 --json
```

အများသုံး သော့ကို သင့်ကွန်ရက်အတွက် အကောင့်ပုံစံသို့ ပြောင်းပါ။

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

ငွေကြေးထောက်ပံ့သူကို XOR ဖြင့် ဘဏ္ဍာငွေ၊ ချေးငွေစာရင်း (သို့) အခြားဘဏ္ဍာငွေပေးချေသည့်စာရင်းမှ ရင်းနှီးမြှုပ်နှံခြင်း။

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

Taira လေ့ကျင့်ခန်းများအတွက်၊ faucet အကူအညီကို [ မှ သိမ်းထားပါ။ Testnet XOR ကို Taira](/my/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) တွင် `taira_faucet_claim.py` အဖြစ်ရယူပြီး ငွေကြေးလွှဲပြောင်းမှုအစား အများပြည်သူ faucet ဖြင့် ပံ့ပိုးပေးသူအား ရန်ပုံငွေပေးပါ။

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

ပံ့ပိုးသူရဲ့ XOR ငွေကြေးစာရင်းကို စစ်ဆေးပါ။

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## (၇) သုံးစွဲသူအား Sponsor သို့ ဝင်ရောက်ခွင့်ပေးပါ။ {#_7-grant-a-user-access-to-the-sponsor}

Sponsor က သုံးစွဲသူတိုင်းကို အခွန်ကောက်ခံဖို့ ခွင့်ပြုချက်ပေးဖို့လိုတယ်။ ထောက်ပံ့မှုက သုံးစွဲသူတွေကို အလိုလို ပံ့ပိုးတဲ့ အကောင့်တွေကို နာမည်မပေးတာ တားဆီးပါတယ်။

ဒါကို ပံ့ပိုးသူ အကောင့်အဖြစ် (သို့) သင့်ရဲ့ Runtime မူဝါဒက ခွင့်ပြုတဲ့ လုပ်ငန်းခွင် အကောင့်အဖြစ် ပြသပါ။

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
- ဒေတာနေရာ (သို့) အသုံးချမှု
- အတည်ပြုလက်မှတ် (သို့) အုပ်ချုပ်ရေး ဆုံးဖြတ်ချက်

သုံးစွဲသူရဲ့ ထောက်ပံ့ငွေတွေကို စစ်ဆေးဖို့:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## (၈) ပံ့ပိုးသူရဲ့ မီတာဒေတာကို ချိတ်ဆက်ပေးပါ။ {#_8-attach-sponsor-metadata}

ပြန်လည်သုံးလို့ရတဲ့ metadata ဖိုင်ကို ဖန်တီးပါ။

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

ဤ metadata နှင့်အတူတင်ပြထားသော စာရွက်စာတမ်းတိုင်းကို ပံ့ပိုးပေးသူအား စရိတ်ကောက်ခံသည်။

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

SDKs အတွက် လက်မှတ်ထိုးထားတဲ့ ငွေပေးချေမှုအတွက် တူညီတဲ့ ငွေလဲလှယ်မှု metadata object ကို ချိတ်ဆက်ပါ။ အသုံးပြုသူက သုံးစွဲသူရဲ့ သော့နဲ့ ငွေပေးချေးမှုကို လက်မှတ်ထိုးတယ်။ ပံ့ပိုးသူဟာ သုံးစွဲသူတိုင်းရဲ့ ငွေပေးချီမှုအားလုံးကို လက်မှတ်ထိုးတာမဟုတ်ဘူး၊ အကြောင်းက အရင်က `CanUseFeeSponsor` ထောက်ပံ့မှုက ခွင့်ပြုချက်ဖြစ်လို့ပါ။

## ပုံစံ (၁) သုံးစွဲသူများက အခွန်မပေးကြပါ။ {#pattern-1-users-pay-no-fees}

ဒီနည်းကို အသုံးပြုပါ Application (သို့) Operator က Network Fees အားလုံးကို စုပ်ယူတဲ့အခါမှာပါ။

ဖွံ့ဖြိုးရေး စာရင်း:

1. သုံးစွဲသူရဲ့ ပုံမှန် ငွေပေးချေမှု ကုန်ကျစရိတ်ကို မပြောင်းလဲစေပါ။
2. `fee_sponsor` ဖြင့် ငွေပေးချေမှု metadata ကိုထည့်သွင်းပါ။
3. အသုံးပြုသူအဖြစ် လက်မှတ်ရေးထိုးပါ။
4. ပုဂ္ဂလိက ဒေတာနေရာလမ်းကြောင်းမှတဆင့် တင်ပါ။

သုံးစွဲသူအကောင့်အတွက် XOR ငွေကြေးပံ့ပိုးသူရဲ့ အကောင့်မှာ လုံလောက်အောင် ထိန်းထားဖို့လိုပါတယ်။ XOR configured ကိုဖုံးအုပ်ရန် Nexus အခွန်များ။

## ပုံစံ (၂) သုံးစွဲသူများက ဒေသတွင်းမှတ်တံဆိပ်ကို ပေးသွင်း {#pattern-2-users-pay-a-local-token}

XOR ကို သုံးစွဲသူတွေ မကိုင်ထားသင့်ပေမဲ့ ဒေတာဇုန်က အတွင်းပိုင်း app အခကြေး၊ ခရက်ဒစ်ကုန်ကျမှု (သို့) ကော်တို token လိုချင်နေတုန်းပါ။

ဤပုံစံတွင်, ဒေသတွင်း token သည် application payment ဖြစ်သည်။ ၎င်းသည် net fee asset မဟုတ်ပါ။ sponsor က XOR တွင် net fee ကိုသာပေးသည်။

ဥပမာ၊ ပုဂ္ဂလိက ဒေတာနေရာတွင် ဒေသတွင်း token ကို အသုံးပြုပါ။

```text
usage#billing.team
```

`usage#billing.team` ကို Onboarding၊ Subscription Renewal သို့မဟုတ် Quota Allocation လုပ်နေစဉ်မှာ ရင်းနှီးမြှုပ်နှံသူတွေကို ငွေကြေးပေးပါ။

1. ဒေသတွင်း tokens ကို အသုံးပြုသူမှ sponsor သို့ လွှဲပြောင်းပေးရန်
2. requested app operation ကို ပြုလုပ်ပါ။
3. `fee_sponsor` metadata ကို ထည့်သွင်းပြီး sponsor က XOR ပေးဆပ်ပေးတယ်။

အနိမ့်ဆုံး CLI မီးခိုးစမ်းသပ်မှုက XOR က ထောက်ပံ့တဲ့ ဒေသတွင်းမှတ်တံဆိပ်လွှဲပြောင်းမှုသက်သက်ပါ။

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

တကယ့် app အတွက်တော့ Local Token payment ကို သီးခြား Best-effort Transaction အဖြစ် မတင်ပါနဲ့။ Payment နဲ့ Business Instruction နှစ်ခုစလုံးပါဝင်တဲ့ လက်မှတ်ထိုးထားတဲ့ Transaction တစ်ခုကို ဆောက်လုပ်ပါ၊ (သို့) Business Operation ကို အသုံးမပြုမီမှာ Local token ကို ကောက်ယူတဲ့ Contract Entry Point ကို ဖော်ပြပါ။

သင့်ရဲ့ app (သို့) စာချုပ်မှာ ငွေလွှဲပြောင်းမှု မူဝါဒကို သိမ်းထားပါ။

- ဘယ်လုပ်ငန်းက ဘယ်လောက် ဒေသတွင်း token ယူနစ်တွေ ကုန်ကျသလဲ
- XOR top-up တွေကို ထောက်ပံ့ဖို့ ဒေသတွင်း token inflow မြေပုံတွေကို ဘယ်လိုလုပ်ရမလဲ။
- သုံးစွဲသူရဲ့ ဟန်ချက်ညီမှုက အရမ်းနိမ့်တဲ့အခါ ဘာဖြစ်လာမလဲ။
- ပံ့ပိုးသူ XOR ငွေကြေးပမာဏက အရမ်းနိမ့်တဲ့အခါ ဘာတွေဖြစ်မလဲ။

::: warning

`gas_asset_id` ကို "ဒေသတွင်းအမှတ်တံဆိပ်ခ" ပုံစံအတွက် မသုံးပါနဲ့ သင်က ပံ့ပိုးသူကို ဒီဓာတ်ငွေ့လက်ဝယ်မှာလည်း စရိတ်ကောက်ခံစေချင်တာမဟုတ်ရင်ပေါ့၊ လက်ရှိ runtime မှာ `fee_sponsor` ကလည်း ပံ့ပိုးမှုကို configured pipeline-gas asset debit တွေအတွက် ပေးသွင်းသူဖြစ်စေတယ်။ Local Token သုံးစွဲသူ အခွန်များအတွက် ငွေလွှဲပြောင်းမှု (သို့) စာချုပ်စည်းမျဉ်းတစ်ခုဖြင့် ပွင့်လင်းစွာ Token ကိုကောက်ယူပါ။

:::

## ကျရှုံးခဲ့သော ပံ့ပိုးမှု ရင်းနှီးမြှုပ်နှံမှုများအား ပြင်ဆင်ခြင်း {#debug-failed-sponsored-transactions}

ရှားပါးတဲ့ ငြင်းပယ်ခြင်း အကြောင်းပြချက်တွေက ပုံမှန်အားဖြင့် ချွတ်ယွင်းနေတဲ့ တပ်ဆင်ရေး အဆင့်တစ်ခုကို ညွှန်ပြတယ်။

|အမှား စာသား |ဘာကို စစ်ဆေးရမလဲ။|
| --- | --- |
|`fee sponsorship is disabled` | `nexus.fees.sponsorship_enabled` ဆက်ရှိနေဆဲပါ။ `false` node မှာပါ။ |
|`fee sponsor is not authorized` |သုံးစွဲသူမှာ `CanUseFeeSponsor` မရှိပါဘူး။|
|`fee asset ... is missing` |Sponsor သည် configured fee asset XOR ကို မပိုင်ဆိုင်ပါ။ |
|`fee balance ... is insufficient` |ပံ့ပိုးသူရဲ့ XOR ငွေကြေးငွေကို ထပ်ဖြည့်ပေးပါ။ |
|`fee exceeds sponsor_max_fee` |`sponsor_max_fee` မြှင့်တင်ခြင်း (သို့မဟုတ်) ငွေပေးချေမှု အရွယ်အစား/ဓာတ်ငွေ့ကို လျှော့ချခြင်း။ |
|`invalid nexus fee asset id` |Fix `nexus.fees.fee_asset_id` သို့မဟုတ် XOR အရင်းအမြစ်အမည်များ။ |

Pattern 2 ကို debugging လုပ်တဲ့အခါ balance နှစ်ခုစလုံးကို စစ်ကြည့်ပါ။

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

ပံ့ပိုးသူကို ဘဏ္ဍာရေးစာရင်းတစ်ခုလို ဆက်ဆံပါ။

- testnet၊ staging နဲ့ mainnet အတွက် သီးခြား sponsor key တွေကို သိမ်းထားပါ။
- စပွန်ဆာ XOR ဘားလန်က အဝင်အဆင့်ကို မရောက်ခင် သတိပေးချက်
- သုညမဟုတ်တဲ့ ကိန်းကို သတ်မှတ် `sponsor_max_fee` Traffic ကို characterization လုပ်ပြီးတာနဲ့ cap
- သင့်ရဲ့ လျှောက်လွှာ (သို့) ဂိတ်ဝေ့စ်မှာ ငွေကြေး အကန့်အသတ် ထောက်ပံ့စာရေးသားချက်များ
- `CanUseFeeSponsor` ကို ဖျက်သိမ်းရန် အသုံးပြုသူများက ဒေတာနေရာမှ ထွက်ခွာသောအခါ
- user transaction hashes များ၊ local token payments များနှင့် sponsor debits XOR တို့ကို ပေါင်းစပ်ပေးရန်။

သုံးစွဲသူအတွက် ပံ့ပိုးမှု ဖျက်သိမ်းခြင်း

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

- [SORA Nexus ဒေတာနေရာများ](/my/get-started/sora-nexus-dataspaces.md) သို့ ချိတ်ဆက်ပါ။
- [လည်ပတ်မှု Iroha 3 မှတဆင့် CLI](/my/get-started/operate-iroha-via-cli.md)
- [အရင်းအမြစ်များ](/my/blockchain/assets.md)
- [ခွင့်ပြုချက်များ](/my/blockchain/permissions.md)
- [ခွင့်ပြုချက် လက်မှတ်များ ](/my/reference/permissions.md)
