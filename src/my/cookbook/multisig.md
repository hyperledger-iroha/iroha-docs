---
translation_locale: my
translation_source: /cookbook/multisig.md
translation_source_hash: 7fca7feca0c27d41a14d1c38497c23aa9f1afe37c5ac19cd8e79c487dc35cc5e
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# အလေးချိန် Multisig {#weighted-multisig}

## ရလဒ် {#outcome}

Taira တွင် သုံးဦးအလေးချိန်ထားသော multisig အကောင့်ကို မှတ်ပုံတင်ခြင်း၊ metadata ညွှန်ကြားချက်တစ်ခုကို အဆိုပြုခြင်း၊ quorum ကို ဖြည့်ဆည်းနိုင်လောက်အောင် အလေးချိန်ရှိပြီး ခွင့်ပြုခြင်းနှင့် multisig အကောင်၏ အခြေအနေမှ လုပ်ဆောင်မှုကို စစ်ဆေးခြင်း။

## လိုအပ်ချက်များ {#prerequisites}

- သုံးခုတည်းသော ပရိုတိုကုတ်စံညွှန်း I105 လက်မှတ်ထိုး ID များ `SIGNER_A`, `SIGNER_B`, နှင့် `SIGNER_C`.
- ငွေကြေးထောက်ပံ့ထားတဲ့ Taira ဖွဲ့စည်းပုံများအတွက် cryptographic signers A နှင့် C. အဆိုပြုသူနှင့် ခွင့်ပြုသူတိုင်းက သူတို့ကိုယ်တိုင် ငွေပေးချေမှုအတွက် ပေးဆပ်ပါတယ်။
- CLI ရေးသွင်းမှုများသည် `--fee-payer authority` ကို အသုံးပြုပြီး CLI သည် လက်မှတ်မထိုးမီ Taira ၏ အခွန်အရင်းအမြစ်ဖြင့် တိကျသော အခွန်ကို ခန့်မှန်းတွက်ချက်ပြသသည်။
- မှတ်ပုံတင်ခြင်းအဆင့်အတွက် `iroha` နှင့် `iroha_model_base` ကို မှီခိုထားပြီး Taira နှင့် တူညီသော Iroha source revision သို့ ပုံသေချိတ်ထားသော Rust client project တစ်ခု။ နောက်ပိုင်း အဆိုပြုချက်နှင့် ခွင့်ပြုချက် အဆင့်များတွင် CLI ကို အသုံးပြုသည်။
- လက်ရှိ အကောင်အထည်ဖော်သူ၏ multisig feature ကို enable လုပ်ထားသည်။ Iroha 3 software execution environment တွင် သာမန်စာရင်းများအတွက် မှတ်ပုံတင်နိုင်သည်၊ Taira မူဝါဒနှင့် အခွန်လက်ခံမှုမူဝါဒက ဆက်လက်သက်သာသော်လည်း အများပြည်သူ ဖြန့်ဖြူးခြင်းမှ ငြင်းဆိုပါက localnet ကိုအသုံးပြုပါ။

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## ခြေလှမ်း {#steps}

### (၁) အလေးချိန်ထားသော မူဝါဒကို မှတ်ပုံတင်ခြင်း {#_1-register-a-weighted-policy}

လက်မှတ်ထိုးသူ C တွင် အလေးချိန် 2 ရှိပြီး A နှင့် B တို့တွင် တစ်ခုလျှင် အလေးချိန် 1 စီ ရှိသည်။ ထို့ကြောင့် quorum 3 အတွက် C နှင့်အတူ A သို့မဟုတ် B တစ်ခုခု လိုအပ်သည်။ ဤနေရာတွင် `registrar` သည် `iroha::blocking::Client` ဖြစ်ပြီး ၎င်း၏ `submit` သည် Applied finality ကို စောင့်ဆိုင်းသည်။ မှတ်ပုံတင်ခြင်းမပြုမီ ထိုတိကျသော မူဝါဒမှ canonical အကောင့်ကို ထုတ်ယူပြီးနောက် တူညီသောတန်ဖိုးကို `MultisigRegister::with_account` သို့ ပေးပို့ပါ:

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

CLI အဆင့်များအတွက် ပုံနှိပ်တန်ဖိုးကို သိမ်းထားပါ။

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

ပုံသေသတ်မှတ်ထားသော commit တွင် CLI မှတ်ပုံတင် command သည် runtime က သော့အသစ်ပြန်မပြောင်းမီ ၎င်း၏ ယာယီ seed ကို ထုတ်ပြသည်။ ထို seed ကို controller အဖြစ် ပြန်မသုံးပါနှင့်။ controller ပုဂ္ဂလိကသော့ မရှိပါ- multisig authority သည် အတည်ပြုထားသော အဆိုပြုချက်များမှသာ ရရှိသည်။ ယင်းအစား CLI မှ မှတ်ပုံတင်လိုပါက မူဝါဒမှ ထုတ်ယူထားသောတန်ဖိုးကို `ledger multisig register --account` သို့ ပေးပို့ပါ။

### (၂) ညွှန်ကြားချက်တစ်ပုဒ်ကို မတင်ဘဲ တည်ဆောက်ပါ။ {#_2-build-one-instruction-without-submitting-it}

ကမ္ဘာလုံးဆိုင်ရာ `--emit-instructions` switch သည် ညွှန်ကြားချက် array ကို တင်သွင်းမည့်အစား standard output သို့ ထုတ်ပြသောကြောင့် အခွန် မသုံးစွဲပါ။

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" --emit-instructions \
    account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### (၃) ဆန်းစစ်ရေး လက်မှတ်ထိုးသူအဖြစ် အဆိုပြုချက် A {#_3-propose-as-signer-a}

အဆိုပြုသူသည် မိမိကိုယ်ပိုင်အလေးချိန်ကို အလိုအလျောက် ထည့်သွင်းသည်။ အဆိုပြုချက် nonce အသစ်တစ်ခုကို ဖန်တီးပြီး ထပ်မံကြိုးစားမှုတိုင်းအတွက် သိမ်းထားပါ။ CLI က ထုတ်ပြသော အဆိုပြုချက် ID နှင့် ညွှန်ကြားချက် hash ကို မှတ်သားထားပါ။ အတည်ပြုချက်များသည် ၎င်းနှစ်ခုလုံးနှင့် ချိတ်ဆက်ထားသည်။

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

အတည်မပြုသေးတဲ့ အဆိုကို တိကျပြီး အဆုံးသတ်ထားတဲ့ ရွေးချယ်မှုတစ်ခုနဲ့စာရင်းပေးပါ။

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. cryptographic signer အဖြစ် ခွင့်ပြုချက် C {#_4-approve-as-signer-c}

A ရဲ့အလေးချိန် 1 နဲ့ C ရဲ့အလေးအစား 2 က quorum 3 ကိုရောက်ရှိပြီး အဆိုပြုထားတဲ့ ညွှန်ကြားချက်ကို multisig account အဖြစ် လုပ်ဆောင်တယ်။

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --proposal-id "$PROPOSAL_ID" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust client သည် မူဝါဒမှ ထုတ်ယူထားသော တူညီသည့်အကောင့်နှင့် အထက်တွင် အသုံးပြုခဲ့သော lifecycle ညွှန်ကြားချက် နှစ်ခုဖြင့် ဆက်လက်လုပ်ဆောင်နိုင်သည်။ လက်မှတ်ထိုးသူ client တစ်ခုစီသည် `iroha::blocking::Client` ဖြစ်ပြီး အဆိုပြုချက် ID ကို client ၏ ကွန်ရက်၊ multisig အကောင့်နှင့် nonce အသစ်တစ်ခုမှ ထုတ်ယူသည်:

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

## စစ်ဆေးပါ {#verify}

ပြည်နယ်အပြီး စာဖတ်ပြီး အဆိုပြုချက်ကို စောင့်ဆိုင်းနေခြင်း မရှိတော့ဘူးလို့ အတည်ပြုပါ။

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

မီတာဒေတာတန်ဖိုးသည် `"approved"` ဖြစ်ရမည်၊ မှတ်သားထားသော အဆိုပြုချက် ID နှင့် ညွှန်ကြားချက် hash သည် ဆိုင်းငံ့ထားဆဲအဖြစ် ပေါ်မလာတော့ရပါ၊ စစ်ဆေးထားသော controller သည် `threshold` `3`၊ `total_weight` `4` နှင့် အဖွဲ့ဝင်အလေးချိန် 1၊ 1 နှင့် 2 ကို ပြသရမည်။ အဖွဲ့ဝင်များကို အများသုံးသော့ အစီအစဉ်အတိုင်း စာရင်းပြုစုထားသည်။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- `not qualified to propose multisig` သို့မဟုတ် `not qualified to approve multisig` ဆိုသည်မှာ အဆိုပြုနေသော သို့မဟုတ် အတည်ပြုနေသော client သည် မူဝါဒတွင် မှတ်ပုံတင်ထားသည့် I105 ID များအနက် တစ်ခုနှင့်မျှ မကိုက်ညီကြောင်း ဆိုလိုသည်။
- multisig အကောင့်မှာ အဆိုပြုထားတဲ့ ညွှန်ကြားချက်တွေကို လုပ်ဆောင်ဖို့ ခွင့်ပြုချက်မရှိတဲ့အခါ နောက်ဆုံး အတည်ပြုချက်ကို ပယ်ချနိုင်ပါတယ် Multisig အကောင့်ကို ခွင့်ပြုမှု မူဝါဒပေးပြီး ၎င်းရဲ့ သီးခြား cryptographic လက်မှတ်ရေးထိုးသူတွေကိုသာမက ကျန်တဲ့ cryptographic signature ကိုလည်း ထပ်မံကြိုးစားခွင့်ပေးပါ။
- ဆိုင်းငံ့ထားသော အဆိုပြုချက် ပျောက်နေခြင်းသည် quorum ပြည့်ပြီးသွားခြင်း၊ TTL သက်တမ်းကုန်သွားခြင်း သို့မဟုတ် မှားယွင်းသော အဆိုပြုချက် ID၊ ညွှန်ကြားချက် hash သို့မဟုတ် အကောင့် selector ကို အသုံးပြုခဲ့ခြင်းကို ဆိုလိုနိုင်သည်။ nonce အသစ်ဖြင့် ထပ်မံမအဆိုပြုမီ post-state ကို query လုပ်ပါ။
- ခွင့်ပြုချက် နှစ်မျိုးလုံးက အလေးချိန် မတိုးစေပါ။ မှတ်ပုံတင် လက်မှတ်ရေးထိုးသူတစ်ဦးစီဟာ ၎င်းရဲ့ ဖွဲ့စည်းထားသော အလေးချိန်ကို အများဆုံးတစ်ကြိမ်သာ ထည့်သွင်းပေးပါတယ်။
- ထိန်းချုပ်သူအဖြစ် ပုံမှန် ငွေပေးချေမှုတစ်ခုကို တိုက်ရိုက်လက်မှတ်ထိုးတာ တားမြစ်ထားတယ်။ အမြဲတမ်း `MultisigPropose` နဲ့ `MultisigApprove` ကို အသုံးပြုပါ။
- CLI မှတ်ပုံတင်မှုအတွင်း ပုံနှိပ်ထားသော အကောင့်ကို နောက်ပိုင်းမှာ command တွေက ရှာမတွေ့နိုင်ပါက ယာယီ seed ကို သိမ်းဆည်းလိုက်ပြီ ဖြစ်ပါသည်။ အမိန့်ချမှတ်ထားတဲ့ မူဝါဒကနေ single protocol-standard account ကို ထုတ်ယူပြီး အထက်ဖော်ပြထားသလို အဲဒီတန်ဖိုးနဲ့ register လုပ်ပါ။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [ပိတ်ထားတဲ့ အရင်းအမြစ်ကုဒ် ပြင်ဆင်မှုမှာ Multisig ပေါင်းစပ်မှု စမ်းသပ်ချက်များ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/multisig.rs)
- [ပိတ်ထားတဲ့ အရင်းအမြစ်ကုဒ် ပြင်ဆင်မှုမှာ multisig ဒေတာပုံစံ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/isi.rs)
- [CLI ပိတ်ထားသော အရင်းအမြစ်ကုဒ် ပြင်ဆင်မှုတွင် multisig အကောင်အထည်ဖော်ခြင်း](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [ငွေပေးချေမှု](/my/blockchain/transactions.md)
- [ခွင့်ပြုချက်များနှင့် ကဏ္ဍများ](./permissions-and-roles.md)
