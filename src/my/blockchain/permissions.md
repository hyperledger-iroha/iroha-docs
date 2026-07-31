---
translation_locale: my
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ခွင့်ပြုချက်များ {#permissions}

အကောင့်တွေဟာ blockchain ပေါ်မှာ လုပ်ဆောင်ချက်အမျိုးမျိုးအတွက် ခွင့်ပြုချက် လက်မှတ်တွေ လိုအပ်ပါတယ်၊ ဥပမာ အရင်းအမြစ်တွေကို မိတ်ကပ်ဖို့ (သို့) မီးရှို့ဖို့ပါ။

အများပိုင် blockchain နှင့် ပုဂ္ဂလိက blockchain အကြားမှာ အသုံးပြုသူများအား ပေးအပ်သော ခွင့်ပြုချက်များအရ ခြားနားမှုရှိသည်။ အများပိုင် blockchain တွင် အကောင့်အများစုသည် ခွင့်ပြုချက်တွေ တူညီသည်။ ပုဂ္ဂလိက blockchain တွင်၊ သက်ဆိုင်ရာ ခွင့်ပြုချက်ကို ရှင်းလင်းစွာ မပေးဘဲနဲ့ အများစုသော အကောင့်များဟာ သူတို့ကို ပေးထားတဲ့ အာဏာအပြင်မှာ ဘာမှမလုပ်နိုင်ဘူးလို့ ယူဆထားတယ်။

တစ်ခုခုလုပ်ဖို့ ခွင့်ပြုချက်ရှိတာဆိုတာက အကောင့်မှာ ကိုက်ညီတဲ့ `Permission`. ခွင့်ပြုချက်များကို တိုက်ရိုက် သို့မဟုတ် [`Role`](#permission-groups-roles), ခွင့်ပြုချက် အစုအဝေးကို အုပ်စုလိုက်ပါတယ်။ `Grant` ခွင့်ပြုချက်များနှင့် အခန်းကဏ္ဍများသည် သက်တမ်းကုန်ဆုံးခြင်းမရှိပါ။ `Revoke` ညွှန်ကြားချက်။

## ခွင့်ပြုချက် လက်မှတ်များ {#permission-tokens}

ခွင့်ပြုချက် tokens များသည် active executor မှသတ်မှတ်ထားသော typeed objects များဖြစ်သည်။ တစ်ချို့ tokens များမှာ global ဖြစ်ပြီး `CanManagePeers` ကဲ့သို့ဖြစ်ပြီးအခြားများတွင် account, asset, asset definition, domain, NFT, role သို့မဟုတ် trigger ကဲ့သို့သော သီးသန့် ledger object တစ်ခုကို scoped လုပ်ထားသည်။

permission tokens များအတွက် အသုံးပြုသော parameters နမူနာအချို့ကို ဖော်ပြပါသည်-

- Account တစ်ခုအတွက် metadata ကို ပြင်ဆင်ဖို့ ခွင့်ပြုချက် ပေးတဲ့ Token မှာ `account` ကွင်းတစ်ခုရှိပါတယ်။

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- အရင်းအမြစ်ဆိုင်ရာ သတ်မှတ်ချက်တစ်ခုအတွက် အရင်းအမြစ်ကို လွှဲပြောင်းခွင့်ပြုတဲ့ Token တစ်ခုမှာ `asset_definition` ကွင်းရှိတယ်။

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- `CanManagePeers` ကဲ့သို့သော ကမ္ဘာလုံးဆိုင်ရာ အမှတ်တံဆိပ်မှာ fields မရှိပါ။

  ```json
  {}
  ```

### Pre-configured Permission Tokens များ {#pre-configured-permission-tokens}

[Reference](/my/reference/permissions) အခန်းမှာ ကြိုတင်ပြင်ဆင်ထားသော ခွင့်ပြုချက် လက်မှတ်စာရင်းကို တွေ့နိုင်ပါတယ်။

## ခွင့်ပြုချက် အုပ်စုများ (ခန်းကဏ္ဍ) {#permission-groups-roles}

ခွင့်ပြုချက်စုကို Role လို့ခေါ်ပါတယ်။ permission tokens တွေလိုပဲ `Grant` ညွှန်ကြားချက်ကို အသုံးပြုပြီး Roles ကို ပေးအပ်နိုင်ပြီး `Revoke` ညွှန်ပြချက်ကို သုံးပြီး ရုပ်သိမ်းနိုင်တာပါ။

အကောင့်တစ်ခုအတွက် အခန်းကဏ္ဍကို မပေးမီမှာ ဒီအခန်းကဏ္ဍဟာ ပထမဆုံး မှတ်ပုံတင်သင့်ပါတယ်။

Roles တွေဟာ Account များအတွက် ခွင့်ပြုချက် တစ်ခုတည်းကို ရယူဖို့ လိုအပ်တဲ့အခါမှာ အသုံးဝင်ပါတယ်။ Role ကို တစ်ကြိမ် မှတ်ပုံတင်ပြီး Role အတွက် ခွင့်ပြုချက်တွေပေးပြီး နောက် Account တစ်ဦးချင်းအတွက် Role ကို ပေးအပ် (သို့) ပယ်ဖျက်ပါ။

### အခန်းကဏ္ဍသစ်ကို မှတ်ပုံတင်ပါ။ {#register-a-new-role}

Mouse ရဲ့ အကောင့်ထဲက [ metadata ](/my/blockchain/metadata.md) ကို အခြားအကောင့်တစ်ခု ဝင်ရောက်ခွင့်ပြုမယ့် အခန်းကဏ္ဍသစ်တစ်ခုကို မှတ်ပုံတင်ရအောင်။

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### အခန်းကဏ္ဍကို ပေးပါ။ {#grant-a-role}

အခန်းကဏ္ဍကို မှတ်ပုံတင်ပြီးနောက် Mouse က Alice ကို ပေးနိုင်ပါတယ်

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```

## ခွင့်ပြုချက် အတည်ပြုသူများ {#permission-validators}

ခွင့်ပြုချက်များရှိသည့်ကြောင့် လိုအပ်သော ခွင့်ပြုမှု အမှတ်တံဆိပ်ပါ ၀ င်သည့် အကောင့်များသာ ကာကွယ်ထားသောလုပ်ဆောင်မှုကို လုပ်ဆောင်နိုင်သည်။ အလိုအလျောက် အကောင်အထည်ဖော်သူက ညွှန်ကြားချက်၊ မေးမြန်းချက်နှင့် ဖော်ပြချက် အကောင်အ ထည်လုပ်စဉ်မှာ ခွင့်ပြုချက်ကို စစ်ဆေးသည်။

Default validator မျက်နှာပြင်ကို Ledger Area နဲ့ အုပ်စုလိုက်ပါတယ်။

- တန်းတူစီမံခန့်ခွဲမှု
- ဒိုမင်များနှင့် အကောင့်များ
- အရင်းအမြစ်များ၊ NFTs နှင့် အာမခံချက်များ
- trigger များ
- အခန်းကဏ္ဍများနှင့် ခွင့်ပြုချက်များ
- အကောင်အထည်ဖော်သူ/အလုပ်လုပ်ချိန်၊ အထောက်အထားများ၊ တံတားများနှင့် SORA/Nexus မော်ဂျူးများ

တိကျတဲ့ Token စာရင်းကို [ Permission Tokens ကို ရည်ညွှန်းချက် ](/my/reference/permissions.md) တွင် အရင်းအမြစ်ထောက်ခံထားသည်။

### Runtime Validators များ {#runtime-validators}

ခွင့်ပြုချက် စစ်ဆေးမှုများကို တက်ကြွတဲ့ အကောင်အထည်ဖော်သူက လုပ်ဆောင်ပေးသည်။ အလိုလျောက် အကောင်အ ထည်လုပ်သူသည် ထည့်သွင်းထားသော ခွင့်ပြုမှု အတည်ပြုသူများနှင့် အမှတ်တံဆိပ် အဓိပ္ပါယ်ဖွင့်ဆိုချက်များကို ပေးပြီး ကွန်ရက်တစ်ခုသည် ၎င်းအသုံးပြုသည့် အကောင်အတန့်ကို အဆင့်မြှင့်တင်ခြင်းဖြင့် မူဝါဒကိုပြောင်းလဲနိုင်ပါသည်။

Validators သည် validation verdict ကိုပြန်လည်ထုတ်ပြန်သည်။ validator သည်အစီအစဉ်တစ်ခုကိုခွင့်ပြုနိုင်သည်၊ အကြောင်းပြချက်တစ်ခုနှင့်ငြင်းပယ်နိုင်သည် သို့မဟုတ် validator ၏နယ်ပယ်မှထွက်ပါက ကျော်လွန်နိုင်သည်။ ရွေးချယ်သော တရားသူကြီးသည်ညွှန်ကြားချက်၊ မေးမြန်းမှု (သို့) ထုတ်ဖော်ပြောဆိုမှုကို ဆက်လက်လုပ်ဆောင်နိုင်မလား ဆုံးဖြတ်ရန် ထိုဆုံးဖြတ်ချက်များကို ပေါင်းစပ်ပေးသည်။

## အထောက်အပံ့ပြုသော မေးခွန်းများ {#supported-queries}

ခွင့်ပြုချက် လက်မှတ်များနှင့် အခန်းကဏ္ဍများကို မေးမြန်းနိုင်ပါသည်။

ကဏ္ဍအတွက် မေးမြန်းချက်များ:

- [`FindRoles`](/my/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/my/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/my/reference/queries.md#accounts-and-permissions)

ခွင့်ပြုချက် လက်မှတ်များအတွက် မေးမြန်းမှု:

- [`FindPermissionsByAccountId`](/my/reference/queries.md#accounts-and-permissions)
