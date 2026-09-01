---
translation_locale: my
translation_source: /cookbook/multisig.md
translation_source_hash: e1b57e1c4310dd0db8be8d9f5a15e1d4f693abb90b634772857eb4b1e86e4baf
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# အလေးချိန် Multisig {#weighted-multisig}

## ရလဒ် {#outcome}

Taira တွင် သုံးဦးအလေးချိန်ထားသော multisig အကောင့်ကို မှတ်ပုံတင်ခြင်း၊ metadata ညွှန်ကြားချက်တစ်ခုကို အဆိုပြုခြင်း၊ quorum ကို ဖြည့်ဆည်းနိုင်လောက်အောင် အလေးချိန်ရှိပြီး ခွင့်ပြုခြင်းနှင့် multisig အကောင်၏ အခြေအနေမှ လုပ်ဆောင်မှုကို စစ်ဆေးခြင်း။

## လိုအပ်ချက်များ {#prerequisites}

- သုံးခုတည်းသော ပရိုတိုကုတ်စံညွှန်း I105 လက်မှတ်ထိုး ID များ `SIGNER_A`, `SIGNER_B`, နှင့် `SIGNER_C`.
- ငွေကြေးထောက်ပံ့ထားတဲ့ Taira ဖွဲ့စည်းပုံများအတွက် cryptographic signers A နှင့် C. အဆိုပြုသူနှင့် ခွင့်ပြုသူတိုင်းက သူတို့ကိုယ်တိုင် ငွေပေးချေမှုအတွက် ပေးဆပ်ပါတယ်။
- `taira.tx-metadata.json` ကို လက်ရှိ testnet ဘဏ္ဍာရေး ဝန်ဆောင်မှု တုံ့ပြန်မှုကနေ တည်ဆောက်ထားပြီး ဘယ်တော့မှ ကူးယူထားတဲ့ အခွန်အရင်းအမြစ် ID ကနေမဟုတ်ဘူး။
- Iroha အရင်းအမြစ်ကို ပြင်ဆင်ရန် Taira နှင့်အတူ မှတ်ပုံတင်မှု အဆင့်အတွက် ချိတ်ဆက်ထားသော Rust ဖောက်သည်စီမံကိန်း။ နောက်ပိုင်း အဆိုပြုချက်နှင့် ခွင့်ပြုချက် အဆင့်များတွင် CLI ကို အသုံးပြုသည်။
- လက်ရှိ အကောင်အထည်ဖော်သူ၏ multisig feature ကို enable လုပ်ထားသည်။ Iroha 3 software execution environment တွင် သာမန်စာရင်းများအတွက် မှတ်ပုံတင်နိုင်သည်၊ Taira မူဝါဒနှင့် အခွန်လက်ခံမှုမူဝါဒက ဆက်လက်သက်သာသော်လည်း အများပြည်သူ ဖြန့်ဖြူးခြင်းမှ ငြင်းဆိုပါက localnet ကိုအသုံးပြုပါ။

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## ခြေလှမ်း {#steps}

### (၁) အလေးချိန်ထားသော မူဝါဒကို မှတ်ပုံတင်ခြင်း {#_1-register-a-weighted-policy}

cryptographic signer C မှာအလေးချိန် 2 ရှိတယ်၊ A နဲ့ B တို့မှာအလေးချိန် 1 ရှိတယ်။ 3 ရဲ့ quorum ကတော့ C + A သို့မဟုတ် B ကိုလိုအပ်ပါတယ်။ မှတ်ပုံတင်မတိုင်ခင် ဒီတိကျတဲ့ မူဝါဒကနေ single protocol-standard account ကို ထုတ်ယူပြီး တူညီတဲ့တန်ဖိုးကို `MultisigRegister::with_account` သို့ လွှဲပြောင်းပါ။

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

CLI အဆင့်များအတွက် ပုံနှိပ်တန်ဖိုးကို သိမ်းထားပါ။

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

CLI မှတ်ပုံတင်အမိန့်သည် software စီမံခန့်ခွဲမှု ပတ်ဝန်းကျင်က ပြန်လည်ဖွင့်ရန်မတိုင်မီ ၎င်း၏ ယာယီမျိုးစေ့ကို ပုံနှိပ်သည်။ ထိုမျိုးစေ့အား ထိန်းချုပ်သူအဖြစ် ထပ်မံအသုံးပြုခြင်းမရှိပါ။ ထိန်းချုပ်သူ ပုဂ္ဂလိက သော့မရှိပေ။ multisig ခွင့်ပြုချက် မူလက ခွင့်ပြုထားသော အဆိုများမှသာ ရရှိသည်။

### (၂) ညွှန်ကြားချက်တစ်ပုဒ်ကို မတင်ဘဲ တည်ဆောက်ပါ။ {#_2-build-one-instruction-without-submitting-it}

ကမ္ဘာလုံးဆိုင်ရာ `-o` switch သည် ညွှန်ကြားချက် array ကို ပုံမှန်ထွက်ပေါက်သို့ serialize လုပ်သည်။ ၎င်းသည် ငွေပေးချေမှုတစ်ခုမှ မတင်သွင်းခြင်းမရှိဘဲ၊ ထို့ကြောင့် အခွန်မသုံးပါ။

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### (၃) ဆန်းစစ်ရေး လက်မှတ်ထိုးသူအဖြစ် အဆိုပြုချက် A {#_3-propose-as-signer-a}

အဆိုပြုသူသည် မိမိကိုယ်ပိုင်အလေးချိန်ကို အလိုအလျောက် ထည့်သွင်းသည်။ CLI မှ ပုံနှိပ်ထားသော တိကျတဲ့ ညွှန်ကြားချက် cryptographic hash ကိုဖမ်းယူပါ; ခွင့်ပြုချက်များက ထို cryptographic Hash သို့ ချိတ်ဆက်ပါ။

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
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust ဖောက်သည်သည်သည် မူဝါဒမှသက်ရောက်သည့်စာရင်းနှင့် အထက်ပါ သက်တမ်းပတ်ဝန်းကျင် ညွှန်ကြားချက်နှစ်ခုကို ဆက်လက်သုံးစွဲနိုင်သည်။

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

## စစ်ဆေးပါ {#verify}

ပြည်နယ်အပြီး စာဖတ်ပြီး အဆိုပြုချက်ကို စောင့်ဆိုင်းနေခြင်း မရှိတော့ဘူးလို့ အတည်ပြုပါ။

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

မီတာဒေတာတန်ဖိုးက `"approved"` ဖြစ်ရမည်၊ ဖမ်းယူထားသော ညွှန်ကြားချက် cryptographic hash ကတော့ စောင့်ဆိုင်းနေဆဲအဖြစ် ပေါ်မလာရတော့နှင့် စစ်ဆေးခံရသည့် ထိန်းချုပ်သူသည် အလေးချိန်များကို `1, 1, 2` ကို quorum `3` နှင့်အတူ ပြသရမည်။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- `signatory is not part of multisig` ဆိုသည်မှာ အဆိုပြုနေသော သို့မဟုတ် အတည်ပြုနေသော ဖောက်သည်သည်သည် မူဝါဒတွင် မှတ်ပုံတင်ထားသည့် I105 ID တစ်ခုနှင့် ကိုက်ညီခြင်းမရှိပါ။
- multisig အကောင့်မှာ အဆိုပြုထားတဲ့ ညွှန်ကြားချက်တွေကို လုပ်ဆောင်ဖို့ ခွင့်ပြုချက်မရှိတဲ့အခါ နောက်ဆုံး အတည်ပြုချက်ကို ပယ်ချနိုင်ပါတယ် Multisig အကောင့်ကို ခွင့်ပြုမှု မူဝါဒပေးပြီး ၎င်းရဲ့ သီးခြား cryptographic လက်မှတ်ရေးထိုးသူတွေကိုသာမက ကျန်တဲ့ cryptographic signature ကိုလည်း ထပ်မံကြိုးစားခွင့်ပေးပါ။
- မတွေ့ရှိသေးတဲ့ အဆိုပြုချက်တစ်ခုက TTL ကို သက်တမ်းကုန်ဆုံးသွားပြီ၊ (သို့) ညွှန်ကြားမှု hash/စာရင်းရွေးချယ်သူ မှားယွင်းခဲ့တယ်လို့ဆိုနိုင်ပါတယ်။ ထပ်ပြီး အဆိုပြုမလုပ်ခင် post-state ကို မေးပါ။
- ခွင့်ပြုချက် နှစ်မျိုးလုံးက အလေးချိန် မတိုးစေပါ။ မှတ်ပုံတင် လက်မှတ်ရေးထိုးသူတစ်ဦးစီဟာ ၎င်းရဲ့ ဖွဲ့စည်းထားသော အလေးချိန်ကို အများဆုံးတစ်ကြိမ်သာ ထည့်သွင်းပေးပါတယ်။
- ထိန်းချုပ်သူအဖြစ် ပုံမှန် ငွေပေးချေမှုတစ်ခုကို တိုက်ရိုက်လက်မှတ်ထိုးတာ တားမြစ်ထားတယ်။ အမြဲတမ်း `MultisigPropose` နဲ့ `MultisigApprove` ကို အသုံးပြုပါ။
- CLI မှတ်ပုံတင်မှုအတွင်း ပုံနှိပ်ထားသော အကောင့်ကို နောက်ပိုင်းမှာ command တွေက ရှာမတွေ့နိုင်ပါက ယာယီ seed ကို သိမ်းဆည်းလိုက်ပြီ ဖြစ်ပါသည်။ အမိန့်ချမှတ်ထားတဲ့ မူဝါဒကနေ single protocol-standard account ကို ထုတ်ယူပြီး အထက်ဖော်ပြထားသလို အဲဒီတန်ဖိုးနဲ့ register လုပ်ပါ။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [ပိတ်ထားတဲ့ အရင်းအမြစ်ကုဒ် ပြင်ဆင်မှုမှာ Multisig ပေါင်းစပ်မှု စမ်းသပ်ချက်များ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/multisig.rs)
- [ပိတ်ထားတဲ့ အရင်းအမြစ်ကုဒ် ပြင်ဆင်မှုမှာ multisig ဒေတာပုံစံ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/isi.rs)
- [CLI ပိတ်ထားသော အရင်းအမြစ်ကုဒ် ပြင်ဆင်မှုတွင် multisig အကောင်အထည်ဖော်ခြင်း](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [ငွေပေးချေမှု](/my/blockchain/transactions.md)
- [ခွင့်ပြုချက်များနှင့် ကဏ္ဍများ](./permissions-and-roles.md)
