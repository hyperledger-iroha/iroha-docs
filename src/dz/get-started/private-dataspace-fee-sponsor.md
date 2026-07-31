---
translation_locale: dz
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 270e6705186d74efad6a8d2e6eeb432ab1b12649b66d4b11309e7da1e07b384f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# སྒེར་གྱི་གནས་སྡུད་ཀྱི་དོན་ལུ་ རྒྱབ་སྐྱོར་འཐུས་ {#sponsor-fees-for-a-private-dataspace}

རྩིས་ཁྲ་རྒྱབ་སྐྱོར་གིས་ ལག་ལེན་འཐབ་མི་ཚུ་ལུ་ XOR མ་བཟུང་པར་ སྒེར་གྱི་གནས་སྡུད་ཀྱི་ཚོང་འབྲེལ་ཚུ་བཙུགས་ཚུགསཔ་བཟོཝ་ཨིན། ལག་ལེན་པ་འདི་གིས་ཡང་ ཚོང་འབྲེལ་དེ་གུ་ མཚན་རྟགས་གཏངམ་ཨིན། ཚོང་འབྲེལ་གྱི་བརྡ་དོན་འདི་ རྒྱབ་སྐྱོར་རྩིས་ཁྲ་ལུ་ཐོ་བཀོད་འབད་ཞིནམ་ལས་ རྒྱུན་འགྲུལ་འཐབ་པའི་དུས་ཚོད་དེ་གིས་ རྒྱབ་སྐྱོར་གྱི་དངུལ་ཀྲམ་ XOR ཕྲང་བའི་འཐུས་སྤྲོད་ནི་ཨིན་མས།

སྦྱོར་བ་འདི་ སྣུམ་འཁོར་གྱི་ཡན་ལག་གསུམ་ཡོདཔ་ཨིན།

1. node གིས་འཐུས་རྒྱབ་སྐྱོར་འབད་ཚུགསཔ་ཨིན།
2. རྒྱབ་སྐྱོར་གྱི་རྩིས་ཁྲ་དེ་ཡོད་མི་འདི་དང་ XOR
3. ལག་ལེན་པ་རེ་ལུ་ `CanUseFeeSponsor` གིས་ རྒྱབ་སྐྱོར་འབད་ཡོདཔ་ཨིན།

དེ་གི་ཤུལ་ལས་ རྒྱབ་སྐྱོར་འབད་མི་ལག་ལེན་འཐབ་མི་ ཕྱིར་ཚོང་རེ་རེ་གི་དོན་ལུ་ འདི་བཟུམ་གྱི་ metadataརྐྱངམ་གཅིག་ དགོཔ་ཨིན།

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

འ་ནི་ཤོག་ལེབ་འདི་ སྤྱིར་བཏང་གི་རྣམ་ཐོར་གཉིས་སྟོན་འབདཝ་ཨིན།

- རང་དབང་ཅན་གྱི་ལག་ལེན་པ་གིས་ཡི་གུ་འདི་འབྲི་དོ་: རྒྱབ་སྐྱོར་འདི་གིས་ XOR སྤྲོད་དོ་ཡོདཔ་དང་ ལག་ལེན་པ་གིས་ག་ནི་ཡང་མ་སྤྲོད་ཨིན།
- ས་གནས་ཀྱི་བརྡ་དོན་གྱི་འཐུས་: ལག་ལེན་པ་གིས་རྒྱབ་སྐྱོར་कर्ताལུ་ ཌོག་ཊར་གི་བརྡ་དོན་ཅིག་སྦེ་སྤྲོད་ནི་དང་ རྒྱབ་སྐྱོར་འདི་གིས་ XOR ལུ་ཐོ་བཀོད་འབད་ཡོདཔ་ཨིན།

དང་པ་ར་ Taira ཡང་ན་ སྒེར་གྱི་བརྟག་དཔྱད་འབད་ཐངས་ལག་ལེན་འཐབ་ཨིན། སྒེར་གྱི་གནས་སྡུད་གསརཔ་ཅིག་གིས་ ལག་ལེན་པ་དང་ལམ་ལུགས་བསྒྱུར་བཅོས་འབདཝ་ཨིན་ འདི་མཁོ་ཆས་ཀྱི་སྒྲིག་གཞི་ལུ་བརྟེན་ བཟོ་མི་ཚུགས།

## དཔེ་སྟོན་གྱི་གོང་ཚད་ཚུ་ {#example-values}

འོག་གི་བཀའ་རྒྱ་འདི་ནང་ལུ་ ས་གོ་འཛིན་པ་ཚུ་ ལག་ལེན་འཐབ་ཨིན།

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

ཁྱོད་ཀྱིས་ I105 རྩིས་ཁྲ་ IDs ལག་ལེན་འཐབ་དོ་ཡོདཔ་ད་ ག་དེམ་ཅིག་སྦེ་ ཁྱོད་ཀྱི་ལག་ལེན་ནང་ལུ་ རྩིས་ཁྲ་དེ་འདྲ་བའི་རྩིས་ཁྲ་ཚུ་གི་དོན་ལུ་ Active Account Aliases ཚུ་མེད་པ་ཅིན་མེན་ན།

## ༡ ཌེ་ཊ་ས་པི་འདི་ གྲ་སྒྲིག་འབད། {#_1-prepare-the-dataspace}

[ནང་ གསལ་བཀོད་འབད་ཡོད་པའི་ སྒེར་གྱི་གནས་སྡུད་ཡིག་ཐོ་དང་ལམ་སྟོན་ལས་འགོ་བཙུགས་ཏེ་ SORA Nexus ཌེ་ཊ་ས་ཁེསི་](/dz/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace) ལུ་མཐུད་སྦྲེལ་འབདཝ་ཨིན། ལག་ལེན་པ་ཁ་ཐུག་གི་ཆ་ཤས་འདི་ འདི་བཟུམ་སྦེ་ཨིན།

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

ལག་ལེན་འཐབ་མི་གི་ཞལ་འདེབས་ལུ་མ་འགྱོ་བའི་ཧེ་མར་ བརྟག་ཞིབ་འབད་:

- སྒེར་གྱི་ལམ་འདི་ `/status` བརྒྱུད་འཕྲིན་ནང་མཐོང་འོང་།
- ལག་ལེན་པ་ཚུ་གི་རྩིས་ཁྲ་ཚུ་ ཁྱོད་ཀྱི་སྒེར་གྱི་འཛུལ་སྒོ་གི་ཐོག་ལས་ འཛུལ་ཞུགས་འབད་ཡོདཔ་ཨིན།
- རྒྱབ་སྐྱོར་གྱི་རྩིས་ཁྲ་དེ་ཡོདཔ་ཨིན།
- XOR གི་འཐུས་དངུལ་རྐྱང་དང་ དངུལ་རྐྱང་གི་རྩིས་ཁྲ་ཚུ་ གྲོག་ཐིག་ནང་ལུ་ ཆ་གནས་ཡོད་ཨིན།

## ཌེ་ཊ་ས་པི་སི་ནང་ལུ་ རྒྱུ་དངོས་ཚུ་ ཐོ་བཀོད་འབདཝ་ཨིན། {#_2-register-assets-in-the-dataspace}

གནས་སྡུད་གི་འགྲེལ་བཤད་ཚུ་ ཐོ་བཀོད་འབད་ཞིནམ་ལས་ ལག་ལེན་འཐབ་མི་ཚུ་གིས་ རང་སོའི་གནས་སྡུད་ནང་བཞག་འོང་ before you wire them into application logic. local-token fee pattern for the tutorial, uses `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

དང་པ་རང་ domain དང་ SNS lease གཞི་བཙུགས་འབད་ཞིནམ་ལས་ asset name space གི་ཇོ་བདག་ཚུ་ཨིན། གསང་བ་མེད་པའི་ intent `AliasSetupPlanRequestV1` བཟོ་ནི་དེ་ `$BILLING_DOMAIN`གི་དོན་ལུ་ཨིན་ འདི་གིས་རྩིས་ཏེ་ numeric `team` dataspace ID, canonical owner, lease term, and current quote guard:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

འདི་གི་ཤུལ་ལས་ རྒྱུ་དངོས་གི་འགྲེལ་བཤད་འདི་ ཐོ་བཀོད་འབད། `--id` ཀ་ནོ་ནི་ཀ་འདི་གིས་ འབྲེལ་མཐུད་ཀྱི་གནས་ཚད་ནང་ རྒྱུ་དངོས་གྱི་འགྲེལ་བཤད་ ID ཨིན། མིང་མིང་འདི་གོང་འཕེལ་བཀོད་མི་དང་ མཐའ་མཇུག་གི་ལག་ལེན་འཐབ་མི་ཚུ་གིས་ data space codeནང་ལུ་ ལག་ལེན་འཐབ་དགོཔ་ཨིན་མས།

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

ས་གནས་ཀྱི་རྟགས་མཚན་འདི་ Onboarding གི་སྐབས་ལུ་ ལག་ལེན་འཐབ་མི་ཅིག་ལུ་ བཏོན་གཏང་ནི་:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

ལག་ལེན་འཐབ་མི་གི་གནས་ཚད་བརྟག་དཔྱད་འབད་:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

ཌེ་ཊ་ས་པི་སི་ནང་ལུ་ལག་ལེན་གྱི་ རྒྱུ་དངོས་ཚུ་གི་དོན་ལུ་ དཔེ་སྒྲོམ་འདི་རང་ ལག་ལེན་འཐབ་ཨིན། ཐོ་བཀོད་རྐྱང་ཅིག་ལུ་ རྒྱུ་དངོས་གི་འགྲེལ་བཤད་བཀོད་ཚུགས། མི་རེ་རེ་ལུ་ datapace alias བྱིན་ཏེ་ འདི་ནང་ལས་གི་ alias SDK code གི་ཚབ་ལུ་ hard-coding canonical asset definition IDs.

## User Aliases ཐོ་བཀོད་འབདཝ་ཨིན། {#_3-register-user-aliases}

རྩིས་ཁྲ་ཚུ་ ད་ལྟོའི་བར་ན་ཡང་ དམ་ཚིག་ཅན་ཨིན། I105 རྩིས་ཁྲ་ IDs. ལག་ལེན་འཐབ་མི་གི་མིང་འདི་རྩིས་ཁྲ་གི་མཚན་རྟགས་ཚུ་ཨིན་ དེ་ལས་མཚན་རྟགས་འདི་ ཚོར་སྣང་མེད་པའི་ལག་ལེན་ཚུ་ཨིན། `alice@team` ཡང་ན་ `alice@members.team`. གློག་འཕྲིན་ཨང་དང་ བརྒྱུད་འཕྲིན་ཨང་ཚུ་ མིང་མིང་སྦེ་ལག་ལེན་འཐབ་མ་དགོ། འདི་ཚུ་ཡང་ སྒེར་གྱི་ངོ་རྟགས་ཀྱི་ཐོ་བཀོད་ནང་ ཤུལ་མའི་ས་ཆ་ནང་ལུ་ཡོདཔ་ཨིན།

Alias setup གིས་ domain setup དང་འདྲན་འདྲ་སྦེ་ declarative planner ལག་ལེན་འཐབ་ཨིན། SDK ཡང་ན་ onboarding ཞབས་ཏོག་གིས་ གསང་བ་མེད་པའི་ `AliasSetupPlanRequestV1` དམིགས་གཏད་ཅིག་བཟོ། འདི་གི་རྩིས་ཁྲ་-alias འཛུལ་ཞུགས་ཀྱི་དམིགས་གཏད་འདི་ `$USER`ཨིན་ དེ་ལས་ གཞི་རྟེན་འགན་ཁུར་དེ་ གདམ་ཁ་རྐྱབ་སྟེ་ ཨང་གྲངས་ཡིག་སྣེ་ཁ་ (numeric data space) ID ཟེར་ཨེབ་གཏང་འབད་ཞིནམ་ལས་ ད་ལྟོའི་ lease quote guard བཏོན་འོང་། འདི་གི་ཤུལ་ལས་ འཆར་གཞི་བཟོ་སྟེ་ བཏོན་གཏང་ནི་ འདི་ཨ་ཊོམ་གྱི་ འབྲེལ་བ་གཅིག་སྦེ་ཨིན།

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

ལག་ལེན་འཐབ་མི་ཚུ་གིས་ XOR སྤྲོད་མ་དགོ་པ་ཅིན་ རྒྱབ་སྐྱོར་འབད་མི་ལུ་ ཤེས་རྟོགས་ཡོད་པའི་ Onboarding ཞབས་ཏོག་ལག་ལེན་འཐབ་སྟེ་ གཞི་སྒྲིག་གི་ཅ་ལ་བཟོ་བཀོད་དང་བཙུགས་དགོ། ཁང་གླ་ཉོ་ནི་དང་ བསྡུ་ལེན་འབད་ནི་གི་མིང་གཉིས་ཆ་ར་ རང་དབང་ཅན་གྱི་ལག་ལེན་གྱི་ཅ་ལ་ཚུ་ནང་བགོ་བཤའ་རྐྱབ་མི་དགོ།

མིང་རྟགས་དེ་བསྡམས་ཚར་བའི་ཤུལ་ལས་ CLI ལས་ བཏོན་གཏང་དགོ།

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

Account གསར་བཙུགས་འབད་ནི་ལུ་ Onboarding ཞབས་ཏོག་འདི་ གདམ་ཁ་རྐྱབས། འདི་གིས་ `NewAccount` འོག་གི་ཤོག་ལེབ་ཚུ་ `uaid` དེ་ལས་ དགོས་མཁོ་ཡོད་པ་ཅིན་ འགོ་ཐོག་ `label`. དྭངས་འཕྲོས་འཕྲོས་ `ledger account register --id` བཀའ་རྒྱ་འདི་གིས་ ཐོ་བཀོད་འབད་མི་ཡིག་ཆ་ཚུ་རྐྱངམ་གཅིག་འབདཝ་ཨིན། ID.

## FHE ལུ་ ཐོ་བཀོད་འབད་ནིའི་དོན་ལས་ གློག་འཕྲིན་དང་ བརྒྱུད་འཕྲིན་ཚུ་ སྒེར་གྱི་ནང་བཙུགས་དགོ། {#_4-register-phone-and-email-privately-with-fhe}

འགྲུལ་འཕྲིན་ཨང་གྲངས་དང་ ཡོངས་འབྲེལ་ཁ་བྱང་ཚུ་ གསེར་གྱི་ངོ་རྟགས་ཀྱི་མིང་སྦེ་ལག་ལེན་འཐབ་ནི་ དེ་ལས་ མི་མང་གི་མིང་མ་བཏགས་པར་ ལག་ལེན་འཐབ་དགོ། FHE གིས་རྒྱབ་སྐྱོར་འབད་མི་ཐངས་འདི་གིས་ རྩིས་ཁྲ་གི་མིང་དང་ ཕྱིར་འབུད་ཀྱི་བརྡ་དོན་ དེ་ལས་ འཛམ་གླིང་གནས་སྟངས་ཚུ་ནང་ལས་ སྣུམ་འཁོར་གྱི་ངོ་རྟགས་མ་བཟོ་མི་ཚུ་ བཀག་བཞག་ནུག

1. ལས་འཛིན་གྱིས་ གློག་འཕྲིན་དང་གློག་འཕྲིན་གྱི་དོན་ལུ་ [RAM-LFE/FHE གི་ལས་རིམ་ལམ་ལུགས་](/dz/blockchain/ram-lfe.md) ཐོ་བཀོད་འབདཝ་ཨིན།
2. ལས་འཛིན་གྱིས་ `phone#team` དང་ `email#team`བཟུམ་ཅིག་སྦེ་ ལག་ལེན་འཐབ་མི་ ངོ་རྟགས་ངོ་མ་གི་ སྲིད་བྱུས་ཚུ་ ཐོ་བཀོད་འབདཝ་ཨིན།
3. ཤོག་སྒྲོམ་འདི་གིས་ གློག་འཕྲིན་དང་ ཡོངས་འབྲེལ་ཡིག་ཆ་ཚུ་ གནས་སྟངས་ནང་གནས་རིམ་སྒྲིག་འབདཝ་ཨིན།
4. ཤོག་སྒྲོམ་འདི་གིས་ ཨེབ་གཏང་འབད་ཡོད་པའི་གོང་ཚད་འདི་ resolver ལུ་བཏང་འོང་།
5. resolver གིས་ `IdentifierResolutionReceipt` སླར་ལོག་འབདཝ་ཨིན།
6. ལག་ལེན་འཐབ་མི་ཚུ་གིས་ `ClaimIdentifier` བཏང་ཐོག་ལས་ བཏང་ཨིན།
7. ལྕགས་ཐག་གིས་ གསལ་ཏོག་ཏོ་མེད་པའི་ ངོས་འཛིན་དང་ བཏང་ཐོ་བཀོད་གི་ཁྱད་ཚད་ཚུ་ ཐིམ་ཕུག་ལུ་བཞག་དོ་ཡོདཔ་མ་གཏོགས་ གློག་འཕྲིན་དང་ ཡོངས་འབྲེལ་གྱི་གོང་ཚད་ངོ་མ་མེདཔ།

ལས་འཛིན་གྱི་ཁ་ཐུག་གི་ སྲིད་བྱུས་གཞི་སྒྲིག་འདི་ SDK ཡང་ན་ ཞབས་ཏོག་ལས་འགན་ཨིན། ངོས་འཛིན་འབད་ནིའི་དབྱེ་བ་རེ་རེ་གི་དོན་ལུ་ འ་ནི་བསླབ་བྱ་རྣམ་པ་ཚུ་བཟོ་སྟེ་ བཏང་དགོ།

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

འདི་གི་དོན་ལུ་ བརྒྱུད་འཕྲིན་ཨེབ་གཏང་འབད་:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

གློག་ཐག་ར་བ་ནང་བཙུགས་པའི་སྐབས་ལུ་ དངུལ་ཁུག་དང་རྒྱབ་ཀྱི་མཐའ་མ་ཚུ་ ས་གནས་ནང་ལུ་ རང་བཞིན་སྒྲིག་འགྱོ་དགོ།

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

གྲལ་ཐིག་༨ པའི་ནང་ རྒྱབ་སྐྱོར་གྱི་བརྡ་དོན་ཡིག་སྣོད་བཟོ་ཚར་བའི་ཤུལ་ལས་ ལག་ལེན་པ་གིས་ཡི་གུ་བཀོད་མི་ སྙན་ཞུ་བཀོད་རྒྱ་ཅིག་ འདི་དང་གཅིག་ཁར་བརྡ་དོན་ཚུ་བཙུགས་དགོ།

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

ད་ལྟོའི་ CLI གིས་ འ་ནི་ ངོས་འཛིན་གྱི་བསླབ་བྱ་ཚུ་གི་དོན་ལུ་ ཐོ་བཀོད་འབད་ཡོད་པའི་བཀའ་རྒྱ་ཚུ་བཏོན་མི་བཏུབ་ཨིན། SDK དང་གཅིག་ཁར་རིམ་སྒྲིག་ཅན་གྱི་ `InstructionBox` གནས་གོང་ཚུ་བཟོ་སྟེ་ `ledger transaction stdin` གི་ཐོག་ལས་གཏང་དགོ།

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

འ་ནི་སྲུང་སྐྱོབས་ཚུ་ འཛུལ་ཞུགས་ཞབས་ཏོག་ནང་ལུ་བཞག་ནི།

- རྩིས་ཁྲ་གི་མིང་འདི་ མི་གིས་ལྷག་ཚུགས་པའི་ལག་ལེན་ཚུ་རྐྱངམ་གཅིག་ཨིན།
- སྣུམ་འཁོར་དང་ གློག་འཕྲིན་གྱི་གོང་ཚད་ཚུ་ ཨ་ལའི་ཨེབ་གནང། མེ་ཊ་ཌེ་ཊ་ཡཱན། ལཱག་ ཡང་ན་ ཕྱིར་ཚོང་གི་ཁེ་ཕན་ནང་ལུ་ནམ་ཡང་མཐོང་མ་ཚུགས།
- རྩིས་ཁྲ་དེ་ནང་ `uaid` ཡོད་པའི་ཁར་ དེ་གིས་ སྒེར་གྱི་ངོ་རྟགས་ཚུ་ ཐོབ་མ་ཚུགསཔ་ཨིན།
- འཁྲུན་ཆོད་ཚུ་ བསྡུ་སྒྲིག་འབད་ `policy_id`, `opaque_id`, `uaid`, `account_id`དང་ དུས་ཡུན་ཚང་ནི་ཨིན།
- resolver keys དང་སྦ་བཞག་པའི་ལས་རིམ་གི་འགན་ཁུར་ཚུ་ གཞུང་སྐྱོང་གིས་འཛིན་བཟུང་འབདཝ་ཨིན།

## 5. Node ལུ་རྒྱབ་སྐྱོར་འབད་ཚུགསཔ་བཟོ། {#_5-enable-sponsorship-on-the-node}

ཟད་འགྲོ་རྒྱབ་སྐྱོར་དེ་ node/runtime སྲིད་བྱུས་ཨིན། Nexus ཟད་འགྲོ་བཏང་ནིའི་ལམ་ལུགས་ནང་ལུ་འདི་སེལ་འཐུ་འབད།:

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

`fee_asset_id` འབྲེལ་མཐུད་ཀྱི་འཐུས་གྱི་ རྒྱུ་དངོས་ཚུ་ཨིན། SORA Nexus འདི་འདི་ཨིན། XOR. Active འདི་ལག་ལེན་འཐབ་ XOR གཞན་མིང་ ཡང་ན་ ཀ་ནོ་ཀཱན་གྱི་མིང་། XOR རྒྱུ་དངོས་གི་འགྲེལ་བཤད་ ID ཁྱོད་ཀྱི་ཁ་ཐུག་ལུ་ གསལ་སྟོན་འབད་ཡོདཔ་ཨིན།

`sponsor_max_fee = "0"` གིས་ ཌེ་ཊ་ས་པི་ལེནཌ་གི་ཚོང་འབྲེལ་གྱི་ཐད་ལུ་ མཚམས་འཇོག་འབད་ནིའི་ཚད་གཞི་མེད་ཟེར་ཨིན་མས། བཟོ་སྐྲུན་གི་དོན་ལུ་ ཁྱོད་ཀྱིས་ ཌེ་ཀྲ་ས་པིལེནཌའི་ ཚོང་འབྲེལ་ཚུ་གི་ རང་བཞིན་གྱི་ཆེ་ཆུང་དང་ ས་སྣུམ་གྱི་གནས་སྟངས་ཤེས་པའི་ཤུལ་ལས་ བརྒྱ་ཆ་ ༠ ལས་བརྒལ་མེདཔ་སྦེ་ གཞི་སྒྲིག་འབད།

འ་ནི་སྒྲིག་གཞི་འདི་ རང་བཞིན་གྱི་ལག་ལེན་འཐབ་མི་ལམ་ལུགས་ནང་ལུ་ ལོག་འགོ་བཙུགས་གཏང་། ཡང་ན་ བཏུབ་གཏང་།

## 6. རྒྱབ་སྐྱོར་འབད་མི་ལུ་ མ་དངུལ་སྤྲོད་ནི་ {#_6-create-and-fund-the-sponsor}

དགོས་མཁོ་ཡོད་པ་ཅིན་ རྒྱབ་སྐྱོར་ལྡེ་མིག་གཉིས་བཟོ་ནི།

```bash
kagami keys --algorithm ed25519 --json
```

མི་མང་གི་ལྡེ་མིག་འདི་ ཁྱོད་ཀྱི་དྲ་རྒྱ་གི་དོན་ལུ་རྩིས་ཁྲ་བཟོ་རྣམ་ལུ་བསྒྱུར་འབད།

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

ཁྱོད་རའི་ སྒེར་གྱི་འཛུལ་ཞུགས་རྒྱུན་འགྲུལ་ལམ་བརྒྱུད་དེ་ རྒྱབ་སྐྱོར་རྩིས་ཁྲ་བཙུགས་:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

མ་དངུལ་རྒྱབ་སྐྱོར་कर्ताལུ་ XOR དངུལ་ཁང་གི་རྩིས་ཁྲ་, སྐྱིན་འགྲུལ་རྩིས་ཁྲ་ ཡང་ན་མ་དངུལ་གྱི་རྩིས་ཁྲ་གཞན་ཅིག་ནང་ལས་བྱིན་ནི།

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

Taira སྦྱོང་བརྡར་ཚུ་གི་དོན་ལུ་, [ལས་ faucet རྒྱབ་སྐྱོར་མ་བཞག་པར་ Testnet XOR ལུ་ Taira](/dz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ལུ་ཐོབ་སྟེ་ `taira_faucet_claim.py`སྦེ་རྐྱབས་ཞིནམ་ལས་ རིན་བསྡུར་མ་དངུལ་གྱི་ཚབ་ལུ་ མི་མང་གི་ faucet ལག་ལེན་འཐབ་ཐོག་ལས་རྒྱབ་སྐྱོར་བྱིན་:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

རྒྱབ་སྐྱོར་གྱི་དངུལ་ཀྲམ་ XOR བརྟག་དཔྱད་འབད་:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. ལག་ལེན་པ་ཅིག་ལུ་ རྒྱབ་སྐྱོར་བྱིན་མི་གི་ཁ་ཐུག་ལས་ གོ་སྐབས་ཐོབ་བཅུག། {#_7-grant-a-user-access-to-the-sponsor}

རྒྱབ་སྐྱོར་འདི་གིས་ ལག་ལེན་པ་སོ་སོ་ལུ་ དངུལ་གྱི་འཐུས་སྤྲོད་ནིའི་དོན་ལུ་ ངོས་ལེན་བྱིན་དགོཔ་ཨིན། གནང་བ་འདི་ ལག་ལེན་པ་ཚུ་གིས་ རང་འདོད་ཅན་གྱི་རྒྱབ་སྐྱོར་རྩིས་ཁྲ་ཚུ་མིང་བཏགས་ནི་ལས་བཀག་ཚུགས།

འདི་རྒྱབ་སྐྱོར་གྱི་རྩིས་ཁྲ་སྦེ་ལག་ལེན་འཐབ་ ཡང་ན་ ཁྱོད་ཀྱི་རྒྱུན་འགྲུལ་ལམ་ལུགས་ནང་བཀོད་མི་ ལག་ལེན་རྩིས་ཁྲ་ཅིག་སྦེ་ལག་ལེན་འཐབ་:

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

འཛུལ་ཞུགས་འབད་ནིའི་ ཞབས་ཏོག་ཚུ་གི་དོན་ལུ་ འདི་རྩིས་ཁྲ་སྤྲོད་ནི་གི་ ཐབས་ལམ་ངོ་མ་ཅིག་སྦེ་བཟོ་སྟེ་ དུས་ཡུན་ཐོ་འགོད་:

- ལག་ལེན་འཐབ་མི་རྩིས་
- རྒྱབ་སྐྱོར་གྱི་རྩིས་ཁྲ་
- ཌེ་ཊའི་ས་ཁོངས། ཡང་ན་ ལག་ལེན་
- ངོས་ལེན་གྱི་ཐོ་བཀོད་ ཡང་ན་ གྲོས་ཐག་བཅད།

ལག་ལེན་པ་ཚུ་གི་གྲོགས་རམ་ཚུ་ བརྟག་ཞིབ་འབད་ནིའི་དོན་ལུ་:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## ༨.རྒྱབ་སྐྱོར་འབད་མི་ལུ་ གཞི་རྟེན་རྩིས་ཚུ་ བསྡུ་སྒྲིག་འབད། {#_8-attach-sponsor-metadata}

སླར་ལོག་སྤྱོད་འབད་ཚུགས་པའི་ metadata ཌའི་ལོག་བཟོ་ནི།

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

འ་ནི་ metadata ཚུ་དང་གཅིག་ཁར་བཙུགས་མི་ཡིག་ཚང་ག་ར་ sponsor ལུ་རྩིས་སྤྲོད་འབད་ཡོདཔ་ཨིན།

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

SDKs གི་ཐད་ཁར་ ཐོ་བཀོད་ཅན་གྱི་ཚོང་འབྲེལ་ལུ་ ཌེ་བི་ཊ་ཌའི་གི་ གནད་དོན་གཅིག་རང་ མཐུད་སྦྲེལ་འབད་ཡོདཔ་ཨིན། ལག་ལེན་པ་གིས་ལག་ལེན་གྱི་ལྡེ་མིག་དང་གཅིག་ཁར་ ཚོང་འབྲེལ་གུ་ མཚན་རྟགས་རྐྱབ་ཨིན། རྒྱབ་སྐྱོར་འདི་གིས་ ལག་ལེན་པ་ཚུ་གི་ ཚོང་འབྲེལ་ཆ་མཉམ་ར་གུ་ མཚན་རྟགས་མ་བཙུགས་ ག་ཅི་སྨོ་ཟེར་བ་ཅིན་ ཧེ་མ་གི་ `CanUseFeeSponsor` གྲོགས་རམ་འདི་ ངོས་འཛིན་འབདཝ་ཨིན་མས།

## ཐབས་ལམ་༡: ལག་ལེན་འཐབ་མི་ཚུ་གིས་ འཐུས་སྤྲོད་མི་ཚུགས། {#pattern-1-users-pay-no-fees}

འདི་ལག་ལེན་འཐབ་ནི་དེ་ ལག་ལེན་པ་ཡང་ན་ ལས་འཛིན་གྱིས་ ཐོ་བཀོད་ཡོངས་འབྲེལ་གྱི་འཐུས་ཚུ་ བསྡུ་ལེན་འབད་བའི་སྐབས་ཨིན།

གོང་འཕེལ་གྱི་དཔྱད་ཡིག་:

1. ལག་ལེན་འཐབ་མི་གི་ རྒྱུན་ཆད་ཅན་གྱི་ཚོང་འབྲེལ་གྱི་ཁེ་ཕན་འདི་ བསྒྱུར་བཅོས་མེད་པར་བཞག་ནི།
2. གནད་དོན་འདི་ `fee_sponsor` ལུ་རྩིས་སྤྲོད་འབད་ནིའི་དོན་ལས་ཨིན།
3. ལག་ལེན་འཐབ་མི་སྦེ་རྟགས་བཀོད་རྐྱབས།
4. སྒེར་གྱི་གནས་སྡུད་ས་ཁོངས་ལམ་བརྒྱུད་དེ་ བཏང་གཏང་།

ལག་ལེན་འཐབ་མི་རྩིས་དེ་ དགོས་མཁོ་མེད་ XOR ཟད་འགྲོ་བཏང་མི་གི་རྩིས་ཁྲ་དེ་ ལེ་ཤ་བཞག་དགོཔ་ཨིན། XOR བསྡུ་སྒྲིག་འབད་ཡོད་པའི་ Nexus འཐུས་སྤྲོད་ནི་ཨིན་མས།

## ཐབས་ལམ་༢: ལག་ལེན་པ་ཚུ་གིས་ ས་གནས་ཀྱི་བརྡ་རྟགས་སྤྲོད་ཨིན། {#pattern-2-users-pay-a-local-token}

འདི་ལག་ལེན་འཐབ་ནི་དེ་ ལག་ལེན་པ་ཚུ་གིས་ XOR མ་བཟུང་རུང་ ཌེ་ཊ་ས་པི་སི་གིས་ ད་ལྟོའི་བར་ན་ཡང་ ནང་འཁོད་གི་ app fees, credit spend, ཡང་ན་ quota token དགོཔ་ཨིན།

འདི་ནང་ལུ་ ས་གནས་ཀྱི་རྟགས་མཚན་འདི་ ཐོ་བཀོད་གྱི་གླ་འཐུས་ཨིན། འདི་གིས་ གྲོག་ཐིག་གི་གླ་ཆ་མ་ཡིན། རྒྱབ་སྐྱོར་འདི་གིས་ XOR ལུ་ ཡོངས་འབྲེལ་གྱི་གླ་ཆ་སྤྲོད་དོ་ཡོདཔ་ཨིན།

དཔེ་འབད་བ་ཅིན་ སྒེར་གྱི་ཡིག་སྣོད་ནང་ལུ་ ས་གནས་ཀྱི་རྟགས་མཚན་ལག་ལེན་འཐབ་ནི།

```text
usage#billing.team
```

`usage#billing.team` འབྲེལ་གཏོགས་འབད་ནི་དང་ ཐོ་བཀོད་བསྐྱར་གསོ་འབད་ནི་ ཡང་ན་ གྲོགས་རམ་བགོ་བཀྲམ་འབད་བའི་སྐབས་ལུ་ དངུལ་རྐྱང་ལག་ལེན་པ་ཚུ་ལུ་དངུལ་ཕོགས་བྱིན་ཞིནམ་ལས་ ལག་ལེན་འཐབ་མི་ཞལ་འདེབས་འདི་ atomic བཟོ་:

1. ས་གནས་ཀྱི་རྟགས་མཚན་ཚུ་ ལག་ལེན་པ་ལས་ རྒྱབ་སྐྱོར་कर्ताལུ་ བཏབ་ནི།
2. བརྒྱུད་འཕྲིན་ལག་ལེན་དེ་ བཏོན་གཏང་
3. `fee_sponsor` མེ་ཊ་ཌའི་ཊཱག་ཚུ་ནང་བཙུགས་ཏེ་ སྲིད་སྐྱོང་པ་གིས་ XOR སྤྲོད་དགོཔ་ཨིན།

ཉུང་མཐའ་ CLI དུ་པ་བརྟག་དཔྱད་འདི་ XOR གིས་རྒྱབ་སྐྱོར་འབད་མི་ ས་གནས་ཀྱི་རྟགས་མཚན་སྤེལ་འབད་ནི་རྐྱངམ་གཅིག་ཨིན།

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

ངོ་མ་ལག་ལེན་གྱི་དོན་ལུ་ ས་གནས་ཀྱི་རྟགས་མཚན་སྤྲོད་ནི་དེ་ བརྩོན་ཤུགས་དྲག་ཤོས་ཀྱི་ལཱ་སོ་སོ་སྦེ་མ་བཙུགས་པར་ ཟད་འགྲོ་བཏང་མི་ཅ་ཆས་ཅིག་བཟོ་སྟེ་ ཐོ་བཀོད་འབད་ཡོདཔ་ལས་ དངུལ་སྤྲོད་ནི་དང་ ཚོང་འབྲེལ་བཀོད་རྒྱ་གཉིས་ཆ་ར་ ཡོདཔ་ཨིན། ཡང་ན་ ཚོང་འབྲེལ་འཐབ་པའི་ཧེ་མར་ ས་གནས་གི་རྟགས་མཚན་བསྡུ་ལེན་འབད་མི་ གྲོས་ཆོད་ནང་འཛུལ་སྒོ་ཅིག་བཏོན་དགོ།

ཁྱོད་ཀྱི་ལག་ལེན་དང་གན་ཡིག་ནང་ལུ་ བསྒྱུར་བཅོས་ཀྱི་ སྲིད་བྱུས་འདི་བཞག་:

- བྱ་སྒོ་ག་ཅི་ལུ་བརྟེན་ ས་གནས་ཀྱི་ ཌོག་ཊཱོན་ ཡུ་ནིཊ་ག་དེམ་ཅིག་ ཟད་འགྲོ་འོང་དོ་ཡོདཔ་
- XOR top-up ཚུ་རྒྱབ་སྐྱོར་འབད་ནིའི་དོན་ལུ་ ས་གནས་ཀྱི་ token inflow maps ག་དེ་སྦེ་འབད་ནི་ཨིན་ན་
- ལག་ལེན་འཐབ་མི་གི་ཆ་སྙོམས་དེ་ ཉུང་དྲགས་སྦེ་ཡོད་པ་ཅིན་ ག་ཅི་འབྱུང་ནི་ཨིན་ན?
- sponsor XOR balance ཉམ་ཆུང་སྦེ་མཐོང་པ་ཅིན་ ག་ཅི་འབྱུང་ནི་ཨིན་ན?

::: དྲན་བསྐུལ་

ཁྱོད་ཀྱིས་ `gas_asset_id` ལག་ལེན་འཐབ་མ་དགོ་ "ས་གནས་-token fee" བཟོ་བཀོད་འབད་ནིའི་དོན་ལུ་ ག་དེམ་ཅིག་སྦེ་ ཁྱོད་ཀྱིས་ རྒྱབ་སྐྱོར་कर्ताལུ་ ས་སྣུམ་གྱི་ རྒྱུ་དངོས་དེ་ནང་ཡང་ རྩིས་སྤྲོད་འབད་དགོ་པ་ཅིན་མ་གཏོགས་། ད་ལྟོའི་ runtime ལུ་ `fee_sponsor` འདི་གིས་ཡང་ པི་པི་ལིན་-gas asset debits གི་དོན་ལུ་ དངུལ་ཕོགས་སྤྲོད་མི་ཅིག་བཟོ་ཡོདཔ་ཨིན། ས་གནས་ཀྱི་བརྡ་དོན་ལག་ལེན་གྱི་འཐུས་ཚུ་གི་དོན་ལུ་ ཐོ་བཀོད་དང་འཁྲིལཝ་ད་ ཌོག་ཊར་ཚུ་ བགོ་བཀྲམ་འབད་ནི་དང་ ཡང་ན་ རིན་བསྡུར་འབད་དགོཔ་ཨིན།

:::

## གྲུབ་འབྲས་མ་གྲུབ་པའི་རྒྱབ་སྐྱོར་ཅན་གྱི་ཚོང་འབྲེལ་ཚུ་ སེལ་འཐུ་འབད། {#debug-failed-sponsored-transactions}

མང་ཤོས་ར་ ཆ་མེད་གཏང་ནི་གི་རྒྱུ་རྐྱེན་འདི་ གཞི་སྒྲིག་འབད་ནིའི་ ཐབས་ལམ་གཅིག་ལུ་ སྟོན་དོ་ཡོདཔ་ཨིན།

|འཛོལ་བ་ཡི་གུ་ |དབྱེ་ཞིབ་འབད་དགོཔ་འདི་ག་ཅི་ཨིན་ན?|
| --- | --- |
|`fee sponsorship is disabled` |`nexus.fees.sponsorship_enabled` ད་ལྟོ་ཡང་ `false` མཚམས་འཇོག་འབད་ཐངས་ལུ་ཡོདཔ་ཨིན། |
|`fee sponsor is not authorized` |ལག་ལེན་འཐབ་མི་གིས་ `CanUseFeeSponsor` འདི་གི་དོན་ལུ་ རྒྱབ་སྐྱོར་འབད་མ་ཚུགས།|
|`fee asset ... is missing` |རྒྱབ་སྐྱོར་པ་གིས་ གཞི་སྒྲིག་འབད་ཡོད་པའི་ XOR འཐུས་དངུལ་ཀྲམ་དེ་ ལག་ལེན་འཐབ་མི་མེདཔ།|
|`fee balance ... is insufficient` |རྒྱབ་སྐྱོར་གྱི་དངུལ་ཀྲམ་ XOR བསྡུ་སྒྲིག་འབདཝ་ཨིན། |
|`fee exceeds sponsor_max_fee` |`sponsor_max_fee` ཡར་སེང་འབད་ནི་དང་ ཡང་ན་ ཕྱིར་ཚོང་གི་རྒྱ་ཁྱོན་/གེསི་ མར་ཕབ་འབད་ནི།|
|`invalid nexus fee asset id` |གཞི་བཙུགས་འབད་ `nexus.fees.fee_asset_id` ཡང་ན་ XOR རྒྱུ་དངོས་གི་མིང་། |

ཌེ་བི་གཱོན་པེཊར་ ༢ ལུ་ བརྟག་ཞིབ་འབད་ཐངས་གཉིས་ཆ་རང་:

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

## རྒྱབ་སྐྱོར་འབད་མི་ལུ་ ཆ་རོགས་འབད་ {#operate-the-sponsor}

རྒྱབ་སྐྱོར་པ་ལུ་ དངུལ་རྩིས་ཀྱི་རྩིས་ཁྲ་ཅིག་སྦེ་བཞག་ནི།

- བརྟག་དཔྱད་ཐིག་, ཨིསི་ཊར་དང་ མའི་ནེཊི་གི་དོན་ལུ་ རྒྱབ་སྐྱོར་གྱི་ལྡེ་མིག་སོ་སོ་བཞག་ནི།
- གྲོགས་རམ་བྱིན་མི་དངུལ་ཀྲམ་ XOR གིས་ འཛུལ་ཞུགས་འབད་ནིའི་གནས་ཚད་ལུ་ལྷོད་པའི་ཧེ་མ་ དྲན་བསྐུལ་འབདཝ་ཨིན།
- སྣུམ་འཁོར་རྒྱུན་འགྲུལ་འཐབ་ཚར་བའི་ཤུལ་ལས་ `sponsor_max_fee` ཚད་མ་ཚང་ཅིག་ གཞི་བཙུགས་འབདཝ་ཨིན།
- རིན་གོང་ཚད་མ་ཆད་པར་རྒྱབ་སྐྱོར་འབད་མི་ ཡིག་ཆ་ཚུ་ ཁྱོད་ཀྱི་ལག་ལེན་དང་ཡང་ན་སྒོ་སྒྲིག་ནང་ལུ་
- `CanUseFeeSponsor` ཌེ་ཊ་ས་པི་སི་ནང་ལས་ཐོན་འགྱོ་མི་ཚུ་ལུ་ ཆ་མེད་གཏང་དགོ།
- ལག་ལེན་འཐབ་མི་ ཌེ་བི་ཊར་ནེགསི་ (hashes) དང་ ས་གནས་ཀྱི་ ཐོ་ཀིན་སྤྲོད་ལེན་དང་ རྒྱབ་སྐྱོར་འབད་མི་ཚུ་ མཐུན་རྐྱེན་བཟོ་ནི། XOR དངུལ་ཕོགས་ཚུ་

ལག་ལེན་པ་ཅིག་གི་དོན་ལུ་ རྒྱབ་སྐྱོར་མ་བཏུབ་:

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

## འབྲེལ་ཡོད་ཤོག་ལེབ་ཚུ་ {#related-pages}

- [SORA Nexus ཌེ་ཊའི་བེསི་](/dz/get-started/sora-nexus-dataspaces.md) ལུ་མཐུད་སྦྲེལ་འབདཝ་ཨིན།
- [Iroha 3 གི་ཐོག་ལས་ལཱ་འབད་ CLI](/dz/get-started/operate-iroha-via-cli.md)
- [རྒྱུ་དངོས་ཚུ་](/dz/blockchain/assets.md)
- [ངོས་ལེན་ཚུ་](/dz/blockchain/permissions.md)
- [ངོས་ལེན་གྱི་རྟགས་མཚན་](/dz/reference/permissions.md)
