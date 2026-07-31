---
translation_locale: hy
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 270e6705186d74efad6a8d2e6eeb432ab1b12649b66d4b11309e7da1e07b384f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Անձնային տվյալների տարածքի համար հովանավորի վճարներ {#sponsor-fees-for-a-private-dataspace}

Վճարային հովանավորումը թույլ է տալիս օգտատերերին ներկայացնել մասնավոր տվյալների տարածքի գործարքներ ՝ առանց XOR պահելու: Օգտատերը դեռ ստորագրում է գործարքը: Գործարքի մետադատները նշվում են հովանու հաշիվի վրա, եւ ընթացիկ ժամանակը պարտք է կատարում հովանուի XOR հավասարակշռությունը ցանցային վճարների համար.

Ինտեգրումը բաղկացած է երեք շարժական մասերից.

1. բջիջը թույլ է տալիս վճարային հովանավորումը
2. հովանավորի հաշիվը գոյություն ունի եւ ունի XOR
3. յուրաքանչյուր օգտատեր ունի `CanUseFeeSponsor` այդ հովանավորի համար

Այնուհետեւ, յուրաքանչյուր հովանավորված օգտագործողի գործարքի համար անհրաժեշտ է միայն այս մետադատա:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

Այս էջը ցույց է տալիս երկու ընդհանուր ձեւաչափեր.

- Անվճար օգտվողը գրում է. հովանավորը վճարում է XOR եւ օգտագործողը ոչինչ չի վճարում:
- Տեղական տոկենների վճարներ. Օգտատերը վճարում է հովանավորին հավելվածի տոկենով, իսկ հովանաւորը վճարում է ցանցին XOR:

Նախ օգտագործեք Taira կամ մասնավոր փորձարկման ցանց: Նոր մասնավոր տվյալների տիրույթը օպերատոր եւ կառավարման փոփոխություն է, այն չի ստեղծվում հաճախորդի կոնֆիգուրացիայով:

## Օրինակային արժեքներ {#example-values}

Ստորեւ բերված հրամանները օգտագործում են հետեւյալ տեղակալները.

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

Օգտագործեք կանոնիկ I105 հաշիվը IDs, եթե ձեր տեղակայումը նույն հաշիվների համար ակտիվ հաշիվներ չունի:

## 1. Պատրաստեք տվյալների տարածքը {#_1-prepare-the-dataspace}

Սկսեք [-ում նկարագրված մասնավոր տվյալների տարածքի կատալոգից եւ երթեւեկման աշխատանքից Կապվեք SORA Nexus տվյալների տարածքներին](/hy/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace): Օպերատորի դեմ ուղղված կտորը նման է հետեւյալին.

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

Օգտատերերի գործարքների անցնելուց առաջ ստուգեք, որ

- մասնավոր երթուղին հայտնվում է `/status` բջիջի պատասխանում:
- օգտատերերի հաշիվները մուտքագրվում են ձեր անձնական ներբեռնման հոսքի միջոցով
- հովանավորի հաշիվը գոյություն ունի
- XOR վճարային ակտիվը եւ վճարային հաշիվը վավեր են ցանցում:

## 2. Տվյալների տարածքում ակտիվներ գրանցել {#_2-register-assets-in-the-dataspace}

Գրանցեք ակտիվների սահմանումները, որոնք օգտվողները պահելու են մասնավոր տվյալների տարածքում, նախքան դրանք տեղադրելը հավելվածի տրամաբանության մեջ: Տեղական տոկենների վճարային ձեւաչափի համար ձեռնարկում օգտագործվում է `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

Նախ սահմանեք դոմեյնը եւ SNS վարձակալությունը, որոնք պատկանում են ակտիվի անվան տարածությանը: Ստեղծեք գաղտնիքազերծված `AliasSetupPlanRequestV1` մտադրություն `$BILLING_DOMAIN`- ի համար, ներառյալ թվային `team` տվյալների տարածքը ID, կանոնական սեփականատերը, վարձակալության ժամկետը եւ ընթացիկ գովազդային պահապանը.

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

Այնուհետեւ գրանցեք ակտիվի սահմանումը: Կանոնիկ `--id` ցանցային մակարդակի ակտիվի սահմանումն է ID. Անանունը այն է, ինչ պետք է օգտագործեն մշակողները եւ վերջնական օգտատերերը տվյալների տարածքի կոդում.

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

Մինետ կամ տեղական տոկոն փոխանցել օգտատերերին ներբորդման ընթացքում.

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

Ստուգեք օգտվողի հավասարակշռությունը.

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

Օգտագործեք տվյալների տարածքում հավելվածային ակտիվների համար նույն ձեւաչափը: Գրանցեք մեկ ակտիվի սահմանումը յուրաքանչյուր տոկենով, յուրաքանչյուրին տվեք տվյալների գոտու alias եւ հղում արեք SDK կոդից ստացված alias- ին ՝ հստակ կոդավորվող կանոնիկ ակտիվի սահմանման փոխարեն IDs:

## 3. Գրանցեք օգտվողի անունները {#_3-register-user-aliases}

Հաշվետքերը դեռ կանոնիկ են I105 հաշիվը IDs։ Օգտատերերի անունները հաշիվների կեղծանուններ են, եւ կեղծանվանները պետք է լինեն ոչ զգայուն ձեռքեր, ինչպիսիք են `alice@team` կամ `alice@members.team`։ Չօգտագործեք հեռախոսահամարներ կամ էլ.փոստի հասցեներ որպես կեղծանուներ: Նրանք պատկանում են հաջորդ բաժնում գտնվող մասնավոր նույնականացման հոսքին:

Alias setup- ը օգտագործում է նույն հայտարարագրական պլանավորիչը, ինչպես դոմեյնային կազմաձեւումը: Թող SDK կամ ներկառուցման ծառայությունը ստեղծի գաղտնազերծված `AliasSetupPlanRequestV1` մտադրություն, որի հաշիվի alias մուտքի թիրախները `$USER` են, ընտրում է առաջնային դերը, փայլակում է թվային տվյալների տարածքը ID եւ պահում է ընթացիկ վարձակալության գովազդի պահպանումը. Այնուհետեւ պլանավորեք եւ կիրառեք այն որպես մեկ ատոմային գործարք.

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

Եթե օգտատերը չի վճարում XOR, օգտագործեք հովանավորի կողմից ճանաչված ներբեռնման ծառայությունը ստեղծելու եւ տեղադրման գործարքը ներկայացնելու համար: Մի բաժանեք վարձակալության ձեռքբերումը եւ կեղծ անունով պարտադիր գործողությունները անկախ դիմումների գործարքներով:

Անանունը կապվելուց հետո ստուգեք այն CLI

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

Նոր հաշիվ ստեղծելու համար նախընտրեք ներբեռնման ծառայություն, որը կառուցում է `NewAccount` կայուն `uaid` եւ, անհրաժեշտության դեպքում, սկզբնական `label`: Պարզ `ledger account register --id` հրամանը գրանցում է միայն կանոնիկ հաշիվը ID:

## 4. Հեռախոսային եւ էլեկտրոնային փոստի անձնական գրանցում FHE: {#_4-register-phone-and-email-privately-with-fhe}

Օգտագործեք հեռախոսահամարներ եւ էլ.փոստի հասցեներ որպես մասնավոր նույնականացման պահանջներ, այլ ոչ թե հանրային կեղծանուններ: FHE- ի աջակցությամբ հոսքը պահում է բնական նույնականացումները հաշիվների կեղծանուներից, գործարքի մետադատայից եւ աշխարհի վիճակից դուրս:

1. օպերատորը գրանցում է [RAM-LFE/FHE ծրագրի քաղաքականությունը ](/hy/blockchain/ram-lfe.md) հեռախոսային եւ էլեկտրոնային փոստի համար
2. օպերատորը գրանցում է ակտիվ նույնականացման քաղաքականությունը, ինչպիսիք են `phone#team` եւ `email#team`:
3. դրամապանակը կարգավորում է հեռախոսը կամ էլեկտրոնային փոստի տեղական
4. դրամապանակը ուղարկում է կոդավորված արժեքը լուծիչին
5. լուծիչը վերադարձնում է `IdentifierResolutionReceipt`
6. Օգտագործողը ուղարկում է `ClaimIdentifier` ստուգման հետ:
7. շղթան պահպանում է ոչ թափանցիկ նույնականացողի եւ ստուգման хэշը, այլ ոչ թե բնական հեռախոսի կամ էլ.փոստի արժեքը

Օպերատորի կողմից սահմանված քաղաքականությունը SDK կամ ծառայության խնդիր է: Ստեղծեք եւ ներկայացրեք այս հրահանգների զույգերը յուրաքանչյուր նույնականացման տեսակի համար.

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

Կրկնեք այն էլեկտրոնային փոստի համար:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

Մուտքագրման ընթացքում դրամապանակը կամ հետեւային կողմը պետք է տեղական կարգավորվի.

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

Սպոնորի մետադատա ֆայլը ստեղծվելուց հետո 8-րդ քայլում, այն պետք է ներկայացնի օգտագործողի կողմից ստորագրված պահանջի հրահանգ՝ այդ մեթադատաների հետ:

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

CLI հոսքը չի բացատրում այս նույնականացման հրահանգների համար տիպված հրամանները: Սերիալացված `InstructionBox` արժեքներ ստեղծեք SDK-ի միջոցով եւ ուղարկեք դրանք `ledger transaction stdin`:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

Պահեք այս պահպանակները բեռնափոխադրման ծառայության մեջ.

- հաշիվի կեղծանունները միայն մարդկային ընթերցելի ձեռքեր են
- բնական հեռախոսային եւ էլեկտրոնային փոստի արժեքները երբեք չեն հայտնվում aliases, metadata, logs կամ գործարքների payloads
- հաշիվը ունի `uaid`, մինչդեռ այն պահանջում է մասնավոր նույնականացումներ
- Գնացքների կապ `policy_id`, `opaque_id`, `uaid`, `account_id`, եւ ժամկետը
- Resolver բանալիները եւ թաքնված ծրագրային պարտավորությունները վերահսկվում են կառավարման

## 5. Աջակցել հովանավորմանը Նոդում: {#_5-enable-sponsorship-on-the-node}

Հաշվարկային հովանավորումը բջիջների/կատարման ժամանակի քաղաքականություն է: Թույլ տվեք այն Nexus վճարային կարգավորման մեջ.

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

`fee_asset_id` ցանցի վճարային ակտիվն է: SORA Nexus-ի համար սա XOR է: Օգտագործեք ձեր ցանցի կողմից բացահայտված ակտիվ XOR կեղծանունը կամ կանոնիկ XOR ակտիվի սահմանումը ID:

`sponsor_max_fee = "0"` նշանակում է, որ չկա յուրաքանչյուր գործարքի համար հովանավորի տափ: արտադրության համար սահմանեք ոչ զրոյական տափ, երբ իմանաք ձեր տվյալների տարածքի գործարքների սովորական չափը եւ գազի պրոֆիլը:

Վերագործարկել կամ անցնել այս կարգավորումը ձեր սովորական օպերատոր գործընթացի միջոցով:

## 6. Ստեղծել եւ ֆինանսավորել հովանավորը {#_6-create-and-fund-the-sponsor}

Եթե անհրաժեշտ է, ստեղծեք հովանավորի բանալիների զույգ:

```bash
kagami keys --algorithm ed25519 --json
```

Փոխակերպեք հանրային բանալին ձեր ցանցի համար հաշիվի ձեւաչափով.

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

Գրանցեք հովանավորի հաշիվը ձեր անձնական ներբեռնման հոսքի միջոցով.

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

XOR ով ֆինանսավորել հովանավորը գանձարանից, պահանջների հաշվից կամ այլ ֆինանսավորված հաշվից:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

Taira վերապատրաստումների համար պահեք ջրհեղեղեղի օգնականը [Get Testnet XOR on Taira](/hy/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) as `taira_faucet_claim.py`, ապա ֆինանսավորեք հովանավորը պետական ջրհղակի միջոցով, այլ ոչ թե գանձարանի փոխանցմամբ.

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

Ստուգեք հովանավորի XOR հավասարակշռությունը.

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. Օգտատիրոջը թույլ տվեք մուտք գործել հովանավոր {#_7-grant-a-user-access-to-the-sponsor}

Sponsor- ը պետք է յուրաքանչյուր օգտվողի թույլտվություն տրամադրի վճարներ վերցնելու համար: Դրամատն այն է, ինչ արգելում է օգտագործողներին անվանել կամայական sponsor հաշիվները:

Գործարկեք սա որպես հովանավորի հաշիվ, կամ որպես գործառնական հաշիվ, որը թույլատրվում է ձեր Runtime քաղաքականությամբ.

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

Ներբեռնման ծառայությունների համար, դա պետք է լինի հաշվետվության տրամադրման սովորական քայլ եւ արձանագրեք.

- օգտվողի հաշիվ
- հովանավորի հաշիվ
- տվյալների տարածք կամ ծրագիր
- հաստատման տոմս կամ կառավարման որոշում

Օգտատիրոջ դրամաշնորհների ստուգման համար'

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. Կապակեք հովանավորի մետադատա {#_8-attach-sponsor-metadata}

Ստեղծեք վերաօգտագործելի մետադատա ֆայլ.

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

Այս մետադատայով ներկայացված ցանկացած գրառումը վճարվում է հովանավորի կողմից.

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

SDKs համար միացրեք նույն գործարքի մետադատա օբյեկտը ստորագրված գործարքին: Օգտագործողը ստորագրում է գործարքը օգտագործողի բանալինով: Sponsor- ը չի ստորագրում յուրաքանչյուր օգտվողի գործարք, քանի որ նախորդ `CanUseFeeSponsor` շնորհումը թույլտվություն է:

## Նշանակություն 1: Օգտատերերը վճարում են անվճար {#pattern-1-users-pay-no-fees}

Օգտագործեք սա, երբ դիմումը կամ օպերատորը ներբեռնում են բոլոր ցանցային վճարները:

Գործարարների ստուգման ցուցակ.

1. Պահպանեք օգտագործողի սովորական գործարքի օգտակար բեռը անփոփոխ:
2. Գործարքի մետադատա լրացրեք `fee_sponsor`
3. Սեղմեք որպես օգտատեր:
4. Ներկայացրեք մասնավոր տվյալների տարածքի երթուղով:

Օգտատերերի հաշիվը չի պահանջում XOR հավասարակշռություն: Sponsor-ի հաշիվը պետք է պահպանի բավականաչափ XOR ՝ կազմված Nexus վճարները ապահովելու համար:

## Երկրորդ ձեւը. Օգտագործողները վճարում են տեղական նշան {#pattern-2-users-pay-a-local-token}

Օգտագործեք սա, երբ օգտվողները չպետք է ունենան XOR, բայց տվյալների տարածքը դեռ ցանկանում է ներքին հավելվածի վճար, վարկային ծախսեր կամ կոտո տոկոն:

Այս ձեւաչափում տեղական տոկոնը դիմման վճար է, այլ ոչ թե ցանցային վճարների ակտիվ: Sponsor- ը դեռ վճարում է ցանցային վճարները XOR.

Օրինակ, օգտագործեք տեղական տոքեր անձնական տվյալների տարածքում.

```text
usage#billing.team
```

Ֆոնդային օգտատերերի հետ `usage#billing.team` ներմուծման, բաժանորդագրության նորացման կամ կվոտայի բաժնետոմսերի ընթացքում: Այնուհետեւ օգտագործողի գործարքը կատարեք ատոմային:

1. տեղական տոքեր փոխանցել օգտագործողի կողմից հովանավորին
2. իրականացնել խնդրվող հավելվածի գործողությունը
3. ներառում է `fee_sponsor` մետադատա, որպեսզի հովանավորը վճարի XOR:

Նվազագույն CLI ծխի փորձարկումը միայն տեղական տոքերների փոխանցումն է, որը հովանավորվում է XOR:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

Իրական հավելվածի համար տեղական տոքերով վճարումը մի ներկայացրեք որպես առանձին լավագույն ջանքերի գործարք: Կառուցեք ստորագրված գործարք, որը պարունակում է ինչպես վճարման, այնպես էլ բիզնես հրահանգները կամ բացահայտեք պայմանագրի մուտքի կետ, որը հավաքում է տեղական տոնենը նախքան գործարքը կիրառելը։

Պահեք փոխակերպման քաղաքականությունը ձեր հավելվածում կամ պայմանագրում.

- որ գործողությունը ծախսում է քանի տեղական տոկին միավորներ
- ինչպես տեղական տոքերների ներմուծման քարտեզները XOR լրացումների հովանավորելու համար
- ինչ է կատարվում, երբ օգտագործողի հավասարակշռությունը չափազանց ցածր է:
- ինչ է կատարվում, երբ հովանավորի հավասարակշռությունը XOR չափազանց ցածր է

::: նախազգուշացում

Մի օգտագործեք `gas_asset_id` "տեղական տոքերային վճարների" ձեւաչափի համար, եթե չեք ցանկանում, որ հովանավորը նաեւ գազային ակտիվում վարձատրվի: Ներկա ընթացիկ ժամանակահատվածում `fee_sponsor`- ը նաեւ հովանաւորին դարձնում է սահմանված խողովակաշարային գազի ակտիվների պարտքերի վճարող: Տեղական տոկենների օգտվողի վճարների համար զեկույցը բացահայտորեն հավաքեք փոխանցման կամ պայմանագրի կանոնով:

:::

## Փոխհատուցում չհաջողված հովանավորվող գործարքների վերաբերյալ {#debug-failed-sponsored-transactions}

Հաճախակի մերժման պատճառները սովորաբար ցույց են տալիս, որ բացակայում է մեկ տեղադրման քայլ.

|սխալ տեքստ |Ինչ պետք է ստուգել:|
| --- | --- |
|`fee sponsorship is disabled` |`nexus.fees.sponsorship_enabled` դեռեւս գտնվում է `false` հանգույցի վրա: |
|`fee sponsor is not authorized` |Օգտատերուն չունի `CanUseFeeSponsor` այս հովանավորի համար: |
|`fee asset ... is missing` |Sponsor- ը չի պահում կազմված XOR վճարային ակտիվը: |
|`fee balance ... is insufficient` |Բարձրացրեք հովանավորի հավասարակշռությունը XOR|
|`fee exceeds sponsor_max_fee` |Բարձրացնել `sponsor_max_fee` կամ նվազեցնել գործարքի չափը/գազը: |
|`invalid nexus fee asset id` |Ֆիքս `nexus.fees.fee_asset_id` կամ XOR ակտիվի alias: |

Երբ debugging ձեւանմուշը 2, ստուգեք երկու հավասարակշռությունը:

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

## Օգտագործեք հովանավորը {#operate-the-sponsor}

Պաշտպանել հովանավորը որպես գանձարանային հաշիվ.

- պահել փորձարկման ցանցի, բեմադրման եւ հիմնական ցանցի համար առանձին հովանավորների բանալիները
- նախքան հովանավորի XOR հավասարակշռությունը հասնել ընդունելության մակարդակի:
- սահմանել ոչ զրոյական `sponsor_max_fee` ծայրահեղություն, երբ երթեւեկությունը բնութագրվի
- Ձեր դիմումի կամ մուտքի փակուղու գծով սփոնսորացված գրություններ
- չեղարկել `CanUseFeeSponsor`, երբ օգտվողները լքում են տվյալների տարածքը:
- համատեղել օգտագործողի գործարքների хэշերը, տեղական տոքերով վճարումները եւ սպոնսորների XOR վարկանիշները

Օգտագործողի համար հովանավորումը չեղարկել.

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

## Կապակցված էջեր {#related-pages}

- [Կապվեք SORA Nexus Տվյալների տիրույթներին](/hy/get-started/sora-nexus-dataspaces.md):
- [Գործարկել Iroha 3 միջոցով CLI](/hy/get-started/operate-iroha-via-cli.md):
- [Գործիքներ](/hy/blockchain/assets.md)
- [թույլտվություններ](/hy/blockchain/permissions.md)
- [թույլտվության տոմսեր](/hy/reference/permissions.md)
