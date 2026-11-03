---
translation_locale: hy
translation_source: /cookbook/multisig.md
translation_source_hash: 7fca7feca0c27d41a14d1c38497c23aa9f1afe37c5ac19cd8e79c487dc35cc5e
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Կշռված բազմաստորագրություն {#weighted-multisig}

## Արդյունքը {#outcome}

Taira հասցեում գրանցեք երեք անդամների ծանրաբեռնված բազմակողմանի հաշիվ, առաջարկեք մետադատային հրահանգ, հաստատեք այն բավարար քաշով, որպեսզի համապատասխանի քվորոմին, եւ ստուգեք բազմակողմ հաշիվի իրականացումը:

## Նախադրյալներ {#prerequisites}

- I105 երեք կանոնական ստորագրող IDs `SIGNER_A`, `SIGNER_B` եւ `SIGNER_C`:
- Ֆինանսավորված Taira ձեւավորումներ ստորագրողների համար A եւ C: Առաջարկողը եւ յուրաքանչյուր հավանություն տվողը վճարում են իրենց գործարքի համար:
- CLI-ով գրառումներն օգտագործում են `--fee-payer authority`; CLI-ն ստորագրելուց առաջ ստանում է ճշգրիտ վճարային առաջարկ Taira-ի վճարային ակտիվով։
- Գրանցման քայլի համար՝ Rust հաճախորդի նախագիծ, որը կախված է `iroha`-ից և `iroha_model_base`-ից և ամրագրված է Iroha-ի աղբյուրի նույն տարբերակին, ինչ Taira-ն։ Հետագա առաջարկի և հաստատման քայլերն օգտագործում են CLI-ն։
- Ներկայումս կատարողի բազմազան նշանի առանձնահատկությունը ակտիվացված է: Գրանցումը հասանելի է սովորական հաշիվների համար նախընտրված Iroha 3 գործնական ժամին, չնայած Taira քաղաքականությունն ու վճարային ընդունումը դեռ կիրառվում են. օգտագործեք localnet- ը, եթե հանրային տեղակայումը դա մերժում է:

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Քայլեր {#steps}

### 1. Գրանցել քաշված քաղաքականություն {#_1-register-a-weighted-policy}

C ստորագրողի կշիռը 2 է, A-ինը և B-ինը՝ 1-ական։ Հետևաբար 3-ի քվորումի համար անհրաժեշտ է C-ն՝ A-ի կամ B-ի հետ միասին։ Այստեղ `registrar`-ը `iroha::blocking::Client` է, որի `submit`-ը սպասում է Applied վերջնականությանը։ Գրանցումից առաջ կանոնիկ հաշիվը ստացեք հենց այդ քաղաքականությունից, ապա նույն արժեքը փոխանցեք `MultisigRegister::with_account`-ին:

```rust
use std::{collections::BTreeMap, num::{NonZeroU16, NonZeroU64}};
use iroha::{
    data_model::{
        account::{MultisigMember, MultisigPolicy},
        prelude::*,
        transaction::FeePaymentIntent,
    },
    executor_data_model::isi::multisig::{
        MultisigApprove, MultisigProposalId, MultisigProposalNonce,
        MultisigPropose, MultisigRegister, MultisigSpec,
    },
};
use iroha_model_base::domain::DomainId;

let spec = MultisigSpec::new(
    BTreeMap::from([
        (signer_a.clone(), 1),
        (signer_b.clone(), 1),
        (signer_c.clone(), 2),
    ]),
    NonZeroU16::new(3).unwrap(),
    NonZeroU64::new(3_600_000).unwrap(),
);
let members = spec
    .signatories
    .iter()
    .map(|(account, weight)| {
        let key = account
            .controller()
            .single_signatory()
            .expect("multisig members must be single-key accounts");
        MultisigMember::new(key.clone(), u16::from(*weight))
            .expect("weights are nonzero")
    })
    .collect();
let policy = MultisigPolicy::new(spec.quorum.get(), members)?;
let multisig_account = AccountId::new_multisig(policy);
let register = MultisigRegister::with_account(
    multisig_account.clone(),
    None::<DomainId>,
    spec,
);

registrar.submit::<InstructionBox>(
    register.into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
println!("{}", multisig_account.canonical_i105()?);
```

Պահպանեք տպագրված արժեքը CLI քայլերի համար.

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

Ամրագրված commit-ում CLI-ի գրանցման հրամանը տպում է իր ժամանակավոր seed-ը, նախքան կատարման միջավայրը կփոխի դրա բանալին։ Մի՛ օգտագործեք այդ seed-ը որպես վերահսկիչ։ Վերահսկիչի մասնավոր բանալի գոյություն չունի: բազմաստորագրային լիազորությունը գալիս է միայն հաստատված առաջարկներից։ Փոխարենը CLI-ից գրանցելու համար քաղաքականությունից ստացված արժեքը փոխանցեք `ledger multisig register --account`-ին։

### 2. Ստեղծեք մեկ հրահանգ՝ առանց այն ուղարկելու {#_2-build-one-instruction-without-submitting-it}

Գլոբալ `--emit-instructions` փոխանջատիչը հրահանգների զանգվածը ներկայացնելու փոխարեն տպում է ստանդարտ ելքում, ուստի վճար չի ծախսվում։

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" --emit-instructions \
    account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. Ենթադրիր որպես ստորագրող A {#_3-propose-as-signer-a}

Առաջարկողն ավտոմատ կերպով ավելացնում է իր սեփական կշիռը։ Ստեղծեք առաջարկի նոր nonce և պահեք այն ցանկացած կրկնակի փորձի համար։ Պահպանեք CLI-ի տպած առաջարկի ID-ն և հրահանգի հեշը; հաստատումները կապվում են երկուսին էլ։

```bash
PROPOSAL_NONCE="$(openssl rand -hex 32)"
PROPOSE_OUTPUT="$({
  iroha --config "$SIGNER_A_CONFIG" \
    --output-format text \
    --fee-payer authority \
    ledger multisig propose \
    --proposal-nonce "$PROPOSAL_NONCE" \
    --account "$MULTISIG_ACCOUNT" \
    < multisig-instructions.json
})"
printf '%s\n' "$PROPOSE_OUTPUT"

PROPOSAL_ID="$({
  printf '%s\n' "$PROPOSE_OUTPUT" |
    sed -n 's/^proposal_id: //p' |
    head -n 1
})"
INSTRUCTIONS_HASH="$({
  printf '%s\n' "$PROPOSE_OUTPUT" |
    sed -n 's/^instructions_hash: //p' |
    head -n 1
})"
test -n "$PROPOSAL_ID"
test -n "$INSTRUCTIONS_HASH"
```

Նշեք դեռ սպասվող առաջարկը բացասական վերջնական ընտրիչով.

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. հաստատել որպես ստորագրող C {#_4-approve-as-signer-c}

A-ի քաշը 1 + C-ի քանակը 2 հասնում է քվորում 3-ին եւ կատարում առաջարկված հրահանգը որպես բազմակողմանի հաշիվ:

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --proposal-id "$PROPOSAL_ID" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust հաճախորդը կարող է շարունակել նույն, քաղաքականությունից ստացված հաշվով և վերևում օգտագործված կյանքի ցիկլի երկու հրահանգներով։ Յուրաքանչյուր ստորագրողի հաճախորդ `iroha::blocking::Client` է; առաջարկի ID-ն ստացվում է հաճախորդի ցանցից, բազմաստորագրային հաշվից և նոր nonce-ից:

```rust
let instructions = vec![SetKeyValue::account(
    multisig_account.clone(),
    "cookbook_quorum".parse()?,
    Json::from("approved"),
).into()];
let instructions_hash = HashOf::new(&instructions);
// A fresh nonzero nonce, for example from `openssl rand -hex 32`.
let proposal_nonce: MultisigProposalNonce = "<FRESH_64_HEX_NONCE>".parse()?;
let proposal_id = MultisigProposalId::derive(
    signer_a_client.client().network_id(),
    &multisig_account,
    &proposal_nonce,
);
signer_a_client.submit::<InstructionBox>(
    MultisigPropose::new(
        multisig_account.clone(),
        proposal_nonce,
        instructions,
        None,
    )
    .into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
signer_c_client.submit::<InstructionBox>(
    MultisigApprove::new(multisig_account, proposal_id, instructions_hash)
        .into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## Փորձարկել {#verify}

Կարդացեք նամակը եւ հաստատեք, որ առաջարկը այլեւս սպասարկված չէ.

```bash
iroha --config "$SIGNER_A_CONFIG" account meta get \
  --id "$MULTISIG_ACCOUNT" \
  --key cookbook_quorum

iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"

iroha --config "$SIGNER_A_CONFIG" ledger multisig inspect \
  --account "$MULTISIG_ACCOUNT" \
  --json |
  jq .
```

Մետատվյալների արժեքը պետք է լինի `"approved"`, պահպանված առաջարկի ID-ն և հրահանգի հեշը այլևս չպետք է երևան որպես սպասող, իսկ ստուգված վերահսկիչը պետք է ցույց տա `threshold` `3`, `total_weight` `4` և անդամների կշիռները՝ 1, 1 և 2; անդամները թվարկված են հանրային բանալիների հերթականությամբ։

## Խնդիրների լուծում {#troubleshooting}

- `not qualified to propose multisig` կամ `not qualified to approve multisig` սխալը նշանակում է, որ առաջարկող կամ հաստատող հաճախորդը չի համապատասխանում քաղաքականության մեջ գրանցված I105 ID-ներից ոչ մեկին։
- Վերջնական հաստատումը կարող է մերժվել այն դեպքում, երբ multisig հաշիվը բացակայում է առաջարկված հրահանգների կատարման թույլտվության: Տվեք լիազորություն multisig հաշվի, եւ ոչ միայն նրա անհատական ստորագրողներին, ապա թող մնացած ստորագրողը կրկին փորձի:
- Սպասող առաջարկի բացակայությունը կարող է նշանակել, որ քվորումն արդեն հավաքվել է, TTL-ի ժամկետը լրացել է, կամ օգտագործվել է սխալ առաջարկի ID, հրահանգի հեշ կամ հաշվի ընտրիչ։ Նոր nonce-ով կրկին առաջարկելուց առաջ հարցումով ստուգեք գործողությունից հետո ստացված վիճակը։
- Կրկնակի հավանության դեպքում ավելացվում է քաշը: Յուրաքանչյուր գրանցված ստորագրող առավելագույնս մեկ անգամ ներդրում է կատարում իր կոմֆիգուրացված քաշի մեջ:
- Արգելվում է անմիջականորեն ստորագրել նորմալ գործարքը, քանի որ վերահսկողն է: Միշտ օգտագործեք `MultisigPropose` եւ `MultisigApprove`:
- Եթե հետագա հրամանները չեն կարող գտնել հաշիվը, որը տպագրվել է CLI գրանցման ընթացքում, դուք ձերբակալել ժամանակավոր սերմ. Գտեք կանոնական հաշիվը պատվերված քաղաքականությունից եւ գրանցվեք այդ արժեքով, ինչպես ցույց է տրվում վերեւում:

## Աղբյուրը եւ դրա հետ կապված փաստաթղթերը {#source-and-related-docs}

- [Մուլտիսիգ ինտեգրման փորձարկումները փակված commit-ում](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/multisig.rs)
- [Multisig տվյալների մոդելը փակված commit- ում](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/isi.rs)
- [CLI բազում նշանների իրականացում փաթեթավորված commit վրա](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Գործարքներ](/hy/blockchain/transactions.md)
- [թույլտվություններ եւ դերակատարություններ](./permissions-and-roles.md)
