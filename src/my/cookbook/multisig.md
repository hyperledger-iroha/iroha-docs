---
translation_locale: my
translation_source: /cookbook/multisig.md
translation_source_hash: 7090228c4fea7321c93fe0d2c67ef6de842de95bc3befa11d83c12b9f15b4752
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# အလေးချိန် Multisig {#weighted-multisig}

## ရလဒ် {#outcome}

Taira တွင် သုံးဦးအလေးချိန်ထားသော multisig အကောင့်ကို မှတ်ပုံတင်ခြင်း၊ metadata ညွှန်ကြားချက်တစ်ခုကို အဆိုပြုခြင်း၊ quorum ကို ဖြည့်ဆည်းနိုင်လောက်အောင် အလေးချိန်ရှိပြီး ခွင့်ပြုခြင်းနှင့် multisig အကောင်၏ အခြေအနေမှ လုပ်ဆောင်မှုကို စစ်ဆေးခြင်း။

## လိုအပ်ချက်များ {#prerequisites}

- I105 လက်မှတ်ရေးထိုးသူ (၃) ဦး၊ `SIGNER_A`, `SIGNER_B` နှင့် `SIGNER_C` တို့တွင် လက်မှတ်ရေးဆွဲထားသော IDs
- လက်မှတ်ရေးထိုးသူ A နှင့် C တို့အတွက် ရင်းနှီးမြှုပ်နှံထားသော Taira ဖွဲ့စည်းပုံများ။ အဆိုပြုသူနှင့် အတည်ပြုသူတိုင်း မိမိတို့ ငွေပေးချေမှုအတွက် ပေးဆပ်ကြသည်။
- `taira.tx-metadata.json` ကို လက်ရှိ faucet တုံ့ပြန်မှုကနေ တည်ဆောက်ထားပြီး ဘယ်တော့မှ ကူးယူထားတဲ့ အခွန်အရင်းအမြစ် ID ကနေ မတည်ဆောက်ဘူး။
- Iroha အရင်းအမြစ်ကို ပြင်ဆင်ရန် Taira နှင့်အတူ မှတ်ပုံတင်မှု အဆင့်အတွက် ချိတ်ဆက်ထားသော Rust ဖောက်သည်စီမံကိန်း။ နောက်ပိုင်း အဆိုပြုချက်နှင့် ခွင့်ပြုချက် အဆင့်များတွင် CLI ကို အသုံးပြုသည်။
- လက်ရှိ အကောင်အထည်ဖော်သူ၏ multisig feature ကို enable လုပ်ထားသည်။ မှတ်ပုံတင်သည် ပုံမှန်စာရင်းများအတွက် default Iroha 3 runtime တွင်ရရှိနိုင်သော်လည်း Taira မူဝါဒနှင့်စရိတ်လက်ခံမှုသည်သက်သာနေဆဲဖြစ်သည်။ အများပြည်သူ ဖြန့်ဖြူးခြင်းက ငြင်းဆိုပါက localnet ကိုအသုံးပြုပါ။

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

Signer C မှာအလေးချိန် 2 ရှိတယ်၊ A နဲ့ B တို့မှာအလေးချိန် 1 ရှိတယ်။ ဒီတော့ 3 ရဲ့ quorum က C ကိုပေါင်းပြီး A (သို့) B ကိုလိုအပ်ပါတယ်။ မှတ်ပုံတင်မတိုင်ခင် ဒီတိကျတဲ့ မူဝါဒကနေ သမရိုးကျစာရင်းကို ထုတ်ယူပြီး တူညီတဲ့တန်ဖိုးကို `MultisigRegister::with_account` သို့ပြောင်းလိုက်ပါ။

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

CLI မှတ်ပုံတင်ကော်မရှင်သည် ၎င်း၏ ယာယီ မျိုးစေ့ကို runtime re-keys မလုပ်မီမှာ ရိုက်နှိပ်သည်။ ထိုမျိုးစေ့ကို ထိန်းချုပ်သူအဖြစ် ပြန်လည်အသုံးပြုခြင်းမရှိပါ။ ထိန်းချုပ်သူ ပုဂ္ဂလိက သော့မရှိပေ။ multisig အာဏာသည် ခွင့်ပြုထားသော အဆိုများမှသာ ရရှိသည်။

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

### (၃) လက်မှတ်ရေးထိုးသူအဖြစ် အဆိုပြုချက် A {#_3-propose-as-signer-a}

အဆိုပြုသူသည် မိမိကိုယ်ပိုင်အလေးချိန်ကို အလိုအလျောက် ထည့်သွင်းသည်။ CLI မှ ရိုက်နှိပ်ထားသော ညွှန်ကြားချက် hash ကိုတိကျစွာ သိမ်းဆည်းပါ။ ခွင့်ပြုချက်များက အဲဒီ hash ကို ချိတ်ဆက်ပေးတယ်။

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

### 4. လက်မှတ်ရေးထိုးသူ C အဖြစ် အတည်ပြု {#_4-approve-as-signer-c}

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

မီတာဒေတာတန်ဖိုးသည် `"approved"` ဖြစ်ရမည်၊ သိမ်းဆည်းထားသော ညွှန်ကြားချက် ဟက်ရှ်ကို စောင့်ဆိုင်းနေဆဲအဖြစ် ပြသခြင်း မရှိတော့ရပေ။ စစ်ဆေးခံရသည့် ထိန်းချုပ်သူသည် အလေးချိန်များ `1, 1, 2` ကို ကော်မွန်း `3` ဖြင့် ပြသရမည်။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- `signatory is not part of multisig` ဆိုသည်မှာ အဆိုပြုနေသော သို့မဟုတ် အတည်ပြုနေသော ဖောက်သည်သည်သည် မူဝါဒတွင် မှတ်ပုံတင်ထားသည့် I105 IDs သို့ မလိုက်လျောညီထွေဖြစ်ခြင်းဖြစ်သည်။
- multisig account မှာ အဆိုပြုထားတဲ့ ညွှန်ကြားချက်တွေကို အကောင်အထည်ဖော်ဖို့ ခွင့်ပြုချက်မရှိတဲ့အခါ နောက်ဆုံး အတည်ပြုချက်ကို ပယ်ချနိုင်တာပါ။ multisig account ကို လက်မှတ်ထိုးသူ တစ်ဦးချင်းကိုသာမဟုတ်ပဲ အာဏာပေးပြီး ကျန်တဲ့လက်မှတ်ထိုးသူကို ထပ်မံကြိုးစားခွင့်ပြုပါ။
- မတွေ့ရှိသေးတဲ့ အဆိုပြုချက်တစ်ခုက TTL ကို သက်တမ်းကုန်ဆုံးသွားပြီ၊ (သို့) ညွှန်ကြားမှု hash/စာရင်းရွေးချယ်သူ မှားယွင်းခဲ့တယ်လို့ဆိုနိုင်ပါတယ်။ ထပ်ပြီး အဆိုပြုမလုပ်ခင် post-state ကို မေးပါ။
- ခွင့်ပြုချက် နှစ်မျိုးလုံးက အလေးချိန် မတိုးစေပါ။ မှတ်ပုံတင် လက်မှတ်ရေးထိုးသူတစ်ဦးစီဟာ ၎င်းရဲ့ ဖွဲ့စည်းထားသော အလေးချိန်ကို အများဆုံးတစ်ကြိမ်သာ ထည့်သွင်းပေးပါတယ်။
- ထိန်းချုပ်သူအဖြစ် ပုံမှန် ငွေပေးချေမှုတစ်ခုကို တိုက်ရိုက်လက်မှတ်ထိုးတာ တားမြစ်ထားတယ်။ အမြဲတမ်း `MultisigPropose` နဲ့ `MultisigApprove` ကို အသုံးပြုပါ။
- CLI မှတ်ပုံတင်စဉ်တွင် ပုံနှိပ်ထားသောစာရင်းကို နောက်ပိုင်းမှာ command များက ရှာမတွေ့နိုင်ပါက ယာယီစေ့ကို သိမ်းဆည်းထားပါ။ အမိန့်ချမှတ်ထားသည့် မူဝါဒမှ ကန်နီကန်စာရင်းကို ရယူပြီး အထက်ဖော်ပြထားသလို ထိုတန်ဖိုးနှင့် မှတ်ပုံတင်ပါ။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [ချိတ်ဆက်ထားသော commit ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/multisig.rs) တွင် multisig ပေါင်းစပ်မှု စမ်းသပ်မှုများ။
- [ချိတ်ဆက်ထားသော commit ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_executor_data_model/src/isi.rs) တွင် multisig ဒေတာပုံစံ
- [CLI multisig implementation at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [ငွေလဲလှယ်မှု](/my/blockchain/transactions.md)
- [ခွင့်ပြုချက်များနှင့် ကဏ္ဍများ ](./permissions-and-roles.md)
