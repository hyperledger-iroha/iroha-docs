---
translation_locale: hy
translation_source: /cookbook/multisig.md
translation_source_hash: e1b57e1c4310dd0db8be8d9f5a15e1d4f693abb90b634772857eb4b1e86e4baf
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Կշռված բազմաստորագրություն {#weighted-multisig}

## Արդյունքը {#outcome}

Taira հասցեում գրանցեք երեք անդամների ծանրաբեռնված բազմակողմանի հաշիվ, առաջարկեք մետադատային հրահանգ, հաստատեք այն բավարար քաշով, որպեսզի համապատասխանի քվորոմին, եւ ստուգեք բազմակողմ հաշիվի իրականացումը:

## Նախադրյալներ {#prerequisites}

- I105 երեք կանոնական ստորագրող IDs `SIGNER_A`, `SIGNER_B` եւ `SIGNER_C`:
- Ֆինանսավորված Taira ձեւավորումներ ստորագրողների համար A եւ C: Առաջարկողը եւ յուրաքանչյուր հավանություն տվողը վճարում են իրենց գործարքի համար:
- `taira.tx-metadata.json` կառուցված է ընթացիկ faucet արձագանքից, երբեք կրկնօրինակված վճարային ակտիվից ID:
- Rust հաճախորդի նախագիծ, որը գրանցման փուլում հավելված է նույն Iroha աղբյուրի վերանայման, ինչպես Taira: Հետագա առաջարկային եւ հաստատման փուլերում օգտագործվում է CLI:
- Ներկայումս կատարողի բազմազան նշանի առանձնահատկությունը ակտիվացված է: Գրանցումը հասանելի է սովորական հաշիվների համար նախընտրված Iroha 3 գործնական ժամին, չնայած Taira քաղաքականությունն ու վճարային ընդունումը դեռ կիրառվում են. օգտագործեք localnet- ը, եթե հանրային տեղակայումը դա մերժում է:

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Քայլեր {#steps}

### 1. Գրանցել քաշված քաղաքականություն {#_1-register-a-weighted-policy}

C ստորագրողի քաշը 2 է, A եւ B- ն յուրաքանչյուրն ունի 1 քաշ: 3 քվորումի համար անհրաժեշտ է C գումարած կամ A կամ B: Գրանցվելուց առաջ ճշգրիտ քաղաքականությունից հանեք կանոնական հաշիվը, ապա նույն արժեքը փոխանցեք `MultisigRegister::with_account`:

```rust
use std::{collections::BTreeMap, num::{NonZeroU16, NonZeroU64}};
use iroha::{
    data_model::{
        account::{MultisigMember, MultisigPolicy},
        prelude::*,
        transaction::FeePaymentIntent,
    },
    executor_data_model::isi::multisig::{
        MultisigApprove, MultisigPropose, MultisigRegister, MultisigSpec,
    },
};

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

registrar.submit_blocking::<InstructionBox>(
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

CLI գրանցման հրամանը տպագրում է իր ժամանակավոր սերմը, նախքան վազման ժամանակը վերականգնում է այն. Մի օգտագործեք այդ սերմը որպես վերահսկողություն: Չկա վերահսկողության մասնավոր բանալին. multisig լիազոր հաշիվը գալիս է միայն հաստատված առաջարկներից:

### 2. Ստեղծեք մեկ հրահանգ՝ առանց այն ուղարկելու {#_2-build-one-instruction-without-submitting-it}

Գլոբալ `-o` փոխանցիչը դասակարգում է հրահանգների շարքը ստանդարտ արտադրանքի վրա: Այն չի ներկայացնում գործարք եւ, հետեւաբար, չի ծախսում որեւէ վճար:

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. Ենթադրիր որպես ստորագրող A {#_3-propose-as-signer-a}

Առաջարկողը ավտոմատ կերպով նպաստում է իր սեփական քաշին: Գտեք հստակ հրահանգային հեշը, որը տպագրված է CLI; հաստատությունները կապվում են այդ հեշի հետ:

```bash
PROPOSE_OUTPUT="$({
  iroha --config "$SIGNER_A_CONFIG" \
    --output-format text \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger multisig propose \
    --account "$MULTISIG_ACCOUNT" \
    < multisig-instructions.json
})"
printf '%s\n' "$PROPOSE_OUTPUT"

INSTRUCTIONS_HASH="$({
  printf '%s\n' "$PROPOSE_OUTPUT" |
    sed -n 's/^instructions_hash: //p' |
    head -n 1
})"
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
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust հաճախորդը կարող է շարունակել նույն քաղաքականությունից բխող հաշիվով եւ վերոհիշյալ օգտագործված կյանքի շրջանակի երկու հրահանգներով.

```rust
let instructions = vec![SetKeyValue::account(
    multisig_account.clone(),
    "cookbook_quorum".parse()?,
    Json::from("approved"),
).into()];
let instructions_hash = HashOf::new(&instructions);
signer_a_client.submit_blocking::<InstructionBox>(
    MultisigPropose::new(multisig_account.clone(), instructions, None).into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
signer_c_client.submit_blocking::<InstructionBox>(
    MultisigApprove::new(multisig_account, instructions_hash).into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## Փորձարկել {#verify}

Կարդացեք նամակը եւ հաստատեք, որ առաջարկը այլեւս սպասարկված չէ.

```bash
iroha --config "$SIGNER_A_CONFIG" ledger account meta get \
  --id "$MULTISIG_ACCOUNT" \
  --key cookbook_quorum

iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"

iroha --config "$SIGNER_A_CONFIG" ledger multisig inspect \
  --account "$MULTISIG_ACCOUNT" \
  --json |
  jq .
```

Մետադատային արժեքը պետք է լինի `"approved"`, գրավված հրահանգների հաշինգը չպետք է հայտնվի որպես սպասվող, եւ ստուգված վերահսկողությունը պետք է ցուցադրի քաշերը `1, 1, 2` ՝ քվորոմով `3`.

## Խնդիրների լուծում {#troubleshooting}

- `signatory is not part of multisig` նշանակում է, որ առաջարկող կամ հաստատող հաճախորդը չի համապատասխանում քաղաքականության մեջ գրանցված I105 IDs անձանցից մեկին:
- Վերջնական հաստատումը կարող է մերժվել այն դեպքում, երբ multisig հաշիվը բացակայում է առաջարկված հրահանգների կատարման թույլտվության: Տվեք լիազորություն multisig հաշվի, եւ ոչ միայն նրա անհատական ստորագրողներին, ապա թող մնացած ստորագրողը կրկին փորձի:
- Մնացած սպասվող առաջարկը կարող է նշանակել, որ արդեն հասել է քվորումի, TTL ժամկետը լրանացել է կամ սխալ հրամանագրային հեշ / հաշիվ ընտրիչ օգտագործվել է: Կատարեք հարցում հետագա վիճակը, նախքան կրկին առաջարկելը:
- Կրկնակի հավանության դեպքում ավելացվում է քաշը: Յուրաքանչյուր գրանցված ստորագրող առավելագույնս մեկ անգամ ներդրում է կատարում իր կոմֆիգուրացված քաշի մեջ:
- Արգելվում է անմիջականորեն ստորագրել նորմալ գործարքը, քանի որ վերահսկողն է: Միշտ օգտագործեք `MultisigPropose` եւ `MultisigApprove`:
- Եթե հետագա հրամանները չեն կարող գտնել հաշիվը, որը տպագրվել է CLI գրանցման ընթացքում, դուք ձերբակալել ժամանակավոր սերմ. Գտեք կանոնական հաշիվը պատվերված քաղաքականությունից եւ գրանցվեք այդ արժեքով, ինչպես ցույց է տրվում վերեւում:

## Աղբյուրը եւ դրա հետ կապված փաստաթղթերը {#source-and-related-docs}

- [Մուլտիսիգ ինտեգրման փորձարկումները փակված commit-ում](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/multisig.rs)
- [Multisig տվյալների մոդելը փակված commit- ում](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/isi.rs)
- [CLI բազում նշանների իրականացում փաթեթավորված commit վրա](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Գործարքներ](/hy/blockchain/transactions.md)
- [թույլտվություններ եւ դերակատարություններ](./permissions-and-roles.md)
