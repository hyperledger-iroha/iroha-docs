---
translation_locale: my
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 8d6fd7101094ba21cfc2c5fb9a89d2acd7e67f13ff47b9f8c8e01bbbd7bf2836
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ခွင့်ပြုချက်များနှင့် အခန်းကဏ္ဍ {#permissions-and-roles}

## ရလဒ် {#outcome}

Account တစ်ခုမှာ metadata ကို update လုပ်ဖို့ ခွင့်ပြုချက် ပေးတဲ့ Role တစ်ခုကို ဖန်တီးပြီး ကိုယ်စားလှယ်တစ်ယောက်ဆီ လွှဲပြောင်းပေးပါ၊ ကိုယ်စားလှေစာရေးတာကို သက်သေပြပြီး သင့်လျော်တဲ့ Rust ရိုက်ထားတဲ့ ညွှန်ကြားချက်ကို ပြသပါ။

## လိုအပ်ချက်များ {#prerequisites}

- ငွေကြေးထောက်ပံ့တဲ့ Taira ဖောက်သည်နှင့် အခွန် metadata ကို [Taira သို့ ချိတ်ဆက်ပါ။](./connect-to-taira.md) မှ ရရှိထားသည်။
- `TARGET_ACCOUNT` နှင့် `DELEGATE_ACCOUNT` ကို Single Protocol-Standard I105 account ID များအဖြစ် သတ်မှတ်ထားသည်။
- Taira မှာ permission-gated အုပ်ချုပ်ရေးလုပ်ဆောင်မှုတစ်ခုဖြစ်သည်; `CanManageRoles` နှင့် scoped ခွင့်ပြုချက်ပေးရန်လိုအပ်သော ခွင့်ပြုမှု မူလစာရင်းကိုရယူခြင်း၊ (သို့) ဖန်တီးထားသော ဒေသတွင်းကွန်ရက်တွင်နည်းပြကို run လုပ်ခြင်း။

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
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

နိုင်ငံတော်ပြောင်းလဲမှု CLI command တစ်ခုစီမှာ အခွန်ပေးသူရဲ့ အမည်ကို ရှင်းလင်းစွာ ဖော်ပြထားတယ်။ metadata file မှာ testnet ထောက်ပံ့ရေး ဝန်ဆောင်မှု တုံ့ပြန်မှုကနေ ရယူထားတဲ့ လက်ရှိ Taira အခွန်အရင်းအမြစ် ပါဝင်ပါတယ်။

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### (၂) ရည်မှန်းချက်စာရင်းတွင် ခွင့်ပြုချက်အကန့်အသတ် ထည့်သွင်းပါ။ {#_2-add-a-permission-scoped-to-the-target-account}

ခွင့်ပြုချက်လက်မှတ်များသည် JSON အရာဝတ္ထုများကို ရိုက်နှိပ်ထားသည်။ အကောင့်ကို `payload` အတွင်းတွင် I105 ID အဖြစ်သိမ်းထားပါ။ ဤတင်းကျပ်သော ကွင်းတွင် အမည်မဖော်လိုပါ။

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### (၃) ကိုယ်စားလှယ်ကို တာဝန်ပေးခြင်း {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
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
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

Rust ဖောက်သည်များအတွက် အလားတူမော်ဒယ်ရရှိနိုင်သည်။ ဤတွင် `client` သည် `registrar_account` အဖြစ်မှတ်သားထားပြီး CLI စီးဆင်းမှုမှာလိုပဲ အခန်းကဏ္ဍ၏ မူလပိုင်ရှင်ဖြစ်လာသည်။ သုံးခုစလုံးသောစာရင်းအပြောင်းအရွှေ့များသည် `AccountId` တန်ဖိုးများကိုစစ်ဆေးပြီးသားဖြစ်သည်:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};
use iroha_executor_data_model::permission::account::CanModifyAccountMetadata;

let role_id: RoleId = "cookbook_metadata_editors".parse()?;
let role = Role::new(role_id.clone(), registrar_account).add_permission(
    CanModifyAccountMetadata {
        account: target_account.clone(),
    },
);

client.submit_all_blocking::<InstructionBox>(
    [
        Register::role(role).into(),
        Grant::account_role(role_id, delegate_account).into(),
    ],
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## စစ်ဆေးပါ {#verify}

တာဝန်ရဲ့ နှစ်ဖက်စလုံးကို စာရင်းပေးပြီး ကိုယ်စားလှယ်က ရေးသားတဲ့ တိကျတဲ့ တန်ဖိုးကို ဖတ်ပါ။

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

ခွင့်ပြုချက်စာရင်းမှာ ပါဝင်ရပါမယ်။ `CanModifyAccountMetadata` ကန့်သတ်ချက် `TARGET_ACCOUNT`, ကိုယ်စားလှယ်ရဲ့ အခန်းကဏ္ဍစာရင်းမှာ ပါဝင်ရမယ်။ `ROLE_ID`, စာဖတ်တဲ့ metadata က ပြန်လာရပါမယ်။ `"delegated"`.

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- `Not permitted` ကိုမှတ်ပုံတင်ခြင်း၊ တည်းဖြတ်ခြင်း သို့မဟုတ်အခန်းကဏ္ဍတာဝန်ပေးခြင်းဆိုသည်မှာ cryptographic လက်မှတ်ရေးထိုးသူသည်လိုအပ်သော Taira ခွင့်ပြုချက် မူဝါဒမရှိပါ။ Scopeed Token ကိုကမ္ဘာလုံးဆိုင်ရာတစ်ခုနှင့်မအစားထိုးပါနဲ့။ တိကျတဲ့ထောက်ပံ့မှုတောင်းခံပါ (သို့) localnet ကိုအသုံးပြုပါ။
- `payload` အနားမှာ `account` ကို တပ်ဆင်ထားတယ်၊ I105 ID အစား အမည်မဖော်လိုတာ (သို့) JSON တန်ဖိုးကို နှစ်ကြိမ် ဖော်ပြတာလို့ အများအားဖြင့် အဓိပ္ပါယ်ရှိပါတယ်။
- အခွန်ကို ငြင်းပယ်ခြင်းသည် ထိုအဆင့်ကိုတင်သွင်းသော cryptographic signer ကိုပိုင်ဆိုင်သည်။ စီမံခန့်ခွဲသူအား ငွေကြေးထောက်ပံ့ခြင်း၊ လွတ်လပ်စွာ လွှဲပြောင်းခြင်းနှင့် faucet မှသက်ရောက်သည့်ခွန်လက်ရှိ metadata များကို ထိန်းသိမ်းခြင်း။
- အောင်မြင်သော role grant သည် token များတွင် ကုဒ်သွင်းထားသော scope ကို override မပြုပါ။ ဤ role သည် permission payload တွင်အမည်ပေးထားသည့် account ကိုသာပြောင်းလဲနိုင်သည်။
- သန့်ရှင်းရေးအတွက် `ledger account role revoke`, နောက် `ledger role permission revoke` နှင့် နောက်ဆုံး `ledger role unregister` ကို run လုပ်ပါ။ တစ်ခုချင်းစီက သီးခြားစာရင်းဖြစ်ပြီး `--fee-payer authority` နဲ့ အခွန် metadata တွေပါဝင်ဖို့လိုပါတယ်။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [pinned source code revision မှာ Role Integration စမ်းသပ်မှု](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [ခွင့်ပြုချက် ပေါင်းစပ်မှု စမ်းသပ်မှုများ ပိတ်ထားသော အရင်းအမြစ်ကုဒ် ပြင်ဆင်ခြင်း](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)
- [ပိတ်ထားတဲ့ source code ကို ပြန်လည်ပြင်ဆင်ခြင်းမှာ built-in ခွင့်ပြုချက် ဒေတာပုံစံ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs)
- [ခွင့်ပြုချက်များနှင့် ကဏ္ဍများ](/my/blockchain/permissions.md)
- [ခွင့်ပြုချက် အမှတ်တံဆိပ် စာရင်း](/my/reference/permissions.md)
- [မီတာဒေတာ](./metadata.md)
