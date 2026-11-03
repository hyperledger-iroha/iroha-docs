---
translation_locale: my
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 40fe8b19344d8eff66b178dc8576e2e049fef50bd3212fbddc5c0d5f7f37fa03
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# ခွင့်ပြုချက်များနှင့် အခန်းကဏ္ဍ {#permissions-and-roles}

## ရလဒ် {#outcome}

Account တစ်ခုမှာ metadata ကို update လုပ်ဖို့ ခွင့်ပြုချက် ပေးတဲ့ Role တစ်ခုကို ဖန်တီးပြီး ကိုယ်စားလှယ်တစ်ယောက်ဆီ လွှဲပြောင်းပေးပါ၊ ကိုယ်စားလှေစာရေးတာကို သက်သေပြပြီး သင့်လျော်တဲ့ Rust ရိုက်ထားတဲ့ ညွှန်ကြားချက်ကို ပြသပါ။

## လိုအပ်ချက်များ {#prerequisites}

- [Taira သို့ ချိတ်ဆက်ပါ](./connect-to-taira.md) မှ ငွေထည့်ထားသော Taira client တစ်ခု။
- `TARGET_ACCOUNT` နှင့် `DELEGATE_ACCOUNT` ကို Single Protocol-Standard I105 account ID များအဖြစ် သတ်မှတ်ထားသည်။
- လက်မှတ်ထိုးသည့်အကောင့်သည် `CanManageRoles` ကို ကိုင်ဆောင်ထားရမည်ဖြစ်ပြီး scope သတ်မှတ်ထားသော ခွင့်ပြုချက်ကို လွှဲအပ်နိုင်ရမည်- ၎င်းသည် `TARGET_ACCOUNT` ကိုယ်တိုင် ဖြစ်ရမည် သို့မဟုတ် ထိုအကောင့်အတွက် `CanModifyAccountMetadata` ကို ကိုင်ဆောင်ထားပြီးသား ဖြစ်ရမည်။ Taira တွင် ၎င်းသည် ခွင့်ပြုချက်ဖြင့် ကန့်သတ်ထားသော စီမံခန့်ခွဲရေးလုပ်ဆောင်ချက် ဖြစ်သည်။ ဖန်တီးထားသော localnet ၏ client သည် `CanManageRoles` ကို မကိုင်ဆောင်ထားသောကြောင့် ဤလမ်းညွှန်အတွက် genesis က ၎င်းကို ခွင့်ပြုချက်ပေးအပ်ထားသော ကွန်ရက်တစ်ခု လိုအပ်သည်။

```bash
CONFIG=./taira.client.toml
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

စာသားကို သက်သေပြတဲ့အခါ ကိုယ်စားလှယ်အတွက် ဒုတိယ client ကို configuration သုံးပါ။

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## ခြေလှမ်း {#steps}

### (၁) နေရာလွတ်ကို မှတ်ပုံတင်ပါ။ {#_1-register-an-empty-role}

အခြေအနေကို ပြောင်းလဲစေသော CLI command တိုင်းသည် အခွန်ပေးဆောင်သူကို ရှင်းလင်းစွာ အမည်ဖော်ပြသည်။ CLI သည် လက်မှတ်မထိုးမီ Taira ၏ အခွန်အရင်းအမြစ်ဖြင့် တိကျသော အခွန်ကို ခန့်မှန်းတွက်ချက်ပြသသည်။

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  ledger role register --id "$ROLE_ID"
```

### (၂) ရည်မှန်းချက်စာရင်းတွင် ခွင့်ပြုချက်အကန့်အသတ် ထည့်သွင်းပါ။ {#_2-add-a-permission-scoped-to-the-target-account}

ခွင့်ပြုချက်လက်မှတ်များသည် JSON အရာဝတ္ထုများကို ရိုက်နှိပ်ထားသည်။ အကောင့်ကို `payload` အတွင်းတွင် I105 ID အဖြစ်သိမ်းထားပါ။ ဤတင်းကျပ်သော ကွင်းတွင် အမည်မဖော်လိုပါ။

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    ledger role permission grant --id "$ROLE_ID"
```

### (၃) ကိုယ်စားလှယ်ကို တာဝန်ပေးခြင်း {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

အခန်းကဏ္ဍများနှင့် ၎င်းတို့၏ ထောက်ပံ့ငွေများသည် သက်တမ်းကုန်ဆုံးခြင်းမရှိဘဲ ဝင်ရောက်ရန် မလိုတော့သည့်အခါ တိတိကျကျ ပြန်လည်သိမ်းဆည်းပါ။

### (၄) ခွင့်ပြုချက်ပေးခြင်း {#_4-exercise-the-delegated-permission}

စာရေးခြင်းအတွက် ကိုယ်စားလှယ်ရဲ့ cryptographic signer နဲ့ fee balance ကို အသုံးပြုပါ။ JSON တန်ဖိုးတွေကို ပုံမှန် input ကနေဖတ်ပါတယ်။

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

Rust client များအတွက်လည်း တူညီသော မော်ဒယ်ကို အသုံးပြုနိုင်သည်။ ဤနေရာတွင် `client` သည် `registrar_account` အဖြစ် လက်မှတ်ထိုးသော `iroha::blocking::Client` ဖြစ်ပြီး ၎င်းသည် CLI လုပ်ငန်းစဉ်တွင်ကဲ့သို့ပင် အခန်းကဏ္ဍ၏ ကနဦးပိုင်ရှင် ဖြစ်လာသည်။ အကောင့် variable သုံးခုစလုံးသည် parse လုပ်ပြီးသား `AccountId` တန်ဖိုးများ ဖြစ်သည်:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};
use iroha_executor_data_model::permission::account::CanModifyAccountMetadata;

let role_id: RoleId = "cookbook_metadata_editors".parse()?;
let role = Role::new(role_id.clone(), registrar_account).add_permission(
    CanModifyAccountMetadata {
        account: target_account.clone(),
    },
);

client.submit_all::<InstructionBox>(
    [
        Register::role(role).into(),
        Grant::account_role(role_id, delegate_account).into(),
    ],
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## စစ်ဆေးပါ {#verify}

အခန်းကဏ္ဍမှ ပေးအပ်ထားသော ခွင့်ပြုချက်များ ပါဝင်သည့် ကိုယ်စားလှယ်၏ အမှန်တကယ် သက်ရောက်နေသော ခွင့်ပြုချက်များကို ဖတ်ပြီးနောက် ကိုယ်စားလှယ်က ရေးသားခဲ့သော တိကျသည့်တန်ဖိုးကို ဖတ်ပါ:

```bash
iroha --config "$CONFIG" --machine account permission list \
  --id "$DELEGATE_ACCOUNT" --all \
  | jq -e --arg account "$TARGET_ACCOUNT" \
    '.items | any(.name == "CanModifyAccountMetadata"
      and .payload.account == $account)'

iroha --config "$CONFIG" account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

ကိုယ်စားလှယ်၏ အမှန်တကယ် သက်ရောက်နေသော ခွင့်ပြုချက်များတွင် `TARGET_ACCOUNT` သို့ scope သတ်မှတ်ထားသော `CanModifyAccountMetadata` ပါဝင်ရမည်ဖြစ်ပြီး metadata ဖတ်ရှုမှုသည် `"delegated"` ကို ပြန်ပေးရမည်။ Torii သည် လက်မှတ်ထိုးထားသော query များမှတစ်ဆင့် အခန်းကဏ္ဍစာရင်းများကို ငြင်းပယ်သောကြောင့် အမှန်တကယ်သက်ရောက်နေသော ခွင့်ပြုချက်စာရင်းသည် အခန်းကဏ္ဍ သတ်မှတ်ပေးမှုကို စစ်ဆေးသည့်နည်း ဖြစ်သည်။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- အခန်းကဏ္ဍကို မှတ်ပုံတင်ခြင်း၊ တည်းဖြတ်ခြင်း သို့မဟုတ် သတ်မှတ်ပေးခြင်းအတွင်း `Not permitted` ဖြစ်ပါက လက်မှတ်ထိုးသူတွင် လိုအပ်သော Taira authority မရှိကြောင်း ဆိုလိုသည်။ scope သတ်မှတ်ထားသော token ကို global token ဖြင့် အစားမထိုးပါနှင့်။ တိကျသော ခွင့်ပြုချက်ပေးအပ်မှုကို တောင်းဆိုပါ။
- `payload` အနားမှာ `account` ကို တပ်ဆင်ထားတယ်၊ I105 ID အစား အမည်မဖော်လိုတာ (သို့) JSON တန်ဖိုးကို နှစ်ကြိမ် ဖော်ပြတာလို့ အများအားဖြင့် အဓိပ္ပါယ်ရှိပါတယ်။
- အခွန်ငြင်းပယ်မှုသည် ထိုအဆင့်ကို တင်သွင်းသော လက်မှတ်ထိုးသူနှင့် သက်ဆိုင်သည်။ စီမံခန့်ခွဲသူနှင့် ကိုယ်စားလှယ်ကို အခွန်စျေးနှုန်းခန့်မှန်းချက်တစ်ခုစီတွင် ဖော်ပြထားသော အခွန်အရင်းအမြစ်ဖြင့် သီးခြားစီ ငွေထည့်ပါ။
- အောင်မြင်သော role grant သည် token များတွင် ကုဒ်သွင်းထားသော scope ကို override မပြုပါ။ ဤ role သည် permission payload တွင်အမည်ပေးထားသည့် account ကိုသာပြောင်းလဲနိုင်သည်။
- ရှင်းလင်းရန် `account role revoke`၊ ထို့နောက် `ledger role permission revoke` နှင့် နောက်ဆုံးတွင် `ledger role unregister` ကို လုပ်ဆောင်ပါ။ တစ်ခုချင်းစီသည် သီးခြားရေးသွင်းမှု ဖြစ်ပြီး `--fee-payer authority` ပါဝင်ရမည်။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [pinned source code revision မှာ Role Integration စမ်းသပ်မှု](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/roles.rs)
- [ခွင့်ပြုချက် ပေါင်းစပ်မှု စမ်းသပ်မှုများ ပိတ်ထားသော အရင်းအမြစ်ကုဒ် ပြင်ဆင်ခြင်း](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/permissions.rs)
- [ပိတ်ထားတဲ့ source code ကို ပြန်လည်ပြင်ဆင်ခြင်းမှာ built-in ခွင့်ပြုချက် ဒေတာပုံစံ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/permission.rs)
- [ခွင့်ပြုချက်များနှင့် ကဏ္ဍများ](/my/blockchain/permissions.md)
- [ခွင့်ပြုချက် အမှတ်တံဆိပ် စာရင်း](/my/reference/permissions.md)
- [မီတာဒေတာ](./metadata.md)
