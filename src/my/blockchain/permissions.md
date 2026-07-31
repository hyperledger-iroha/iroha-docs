---
translation_locale: my
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ခွင့်ပြုချက်များ {#permissions}

အကောင့်တွေမှာ blockchain ပေါ်က လုပ်ဆောင်ချက်အမျိုးမျိုးအတွက် ခွင့်ပြုချက် လက်မှတ်တွေ လိုအပ်တယ်။ ဥပမာ
အရင်းအမြစ်တွေကို မီးရှို့ဖို့ (သို့) လောင်ကျွမ်းဖို့

အများပြည်သူနဲ့ ပုဂ္ဂလိက blockchain တွေကြားမှာ ကွာခြားချက်ရှိတယ်
အများပြည်သူ blockchain တွင်အကောင့်အများစုမှာ
ခွင့်ပြုချက်တွေရဲ့ တစ်စုံတစ်ရာပါ။ ပုဂ္ဂလိက blockchain မှာ အကောင့်အများစုဟာ
သူတို့ကို ပေးထားတဲ့ အာဏာအပြင် ဘာမှ မလုပ်နိုင်ဘူးလို့ ယူဆ
သက်ဆိုင်ရာ ခွင့်ပြုချက်ကို ရှင်းလင်းစွာ မပေးဘဲနဲ့။

တစ်ခုခုလုပ်ဖို့ ခွင့်ပြုချက်ရှိခြင်းဟာ အကောင့်မှာ
ကိုက်ညီသော `Permission`. ခွင့်ပြုချက်များကို တိုက်ရိုက် သို့မဟုတ်
[`Role`](#permission-groups-roles), ဒါက ခွင့်ပြုချက် အစုကို စုစည်းပါတယ်။
ခွင့်ပြုချက်များကို `Grant` ညွှန်ကြားချက်။ ခွင့်ပြုချက်များနှင့် အခန်းကဏ္ဍများ
သက်တမ်းမကုန်ပါနဲ့။ `Revoke` ညွှန်ကြားချက်။

## ခွင့်ပြုချက် လက်မှတ်များ {#permission-tokens}

Permission tokens တွေဟာ active executor က သတ်မှတ်ထားတဲ့ typeed objects တွေပါ။
tokens တွေဟာ ကမ္ဘာလုံးဆိုင်ရာဖြစ်ပါတယ် ဥပမာ `CanManagePeers`, အခြားသူများသည်
Account, asset, asset definition, domain စတဲ့ သီးခြားစာရင်းအင်းအရာရှိများ
NFT, အခန်းကဏ္ဍ၊ ဒါမှမဟုတ် အစပျိုးမှု။

permission tokens များအတွက် အသုံးပြုသော parameters အချို့ကို အောက်တွင်ဖော်ပြပါအတိုင်း ဖော်ပြထားပါသည်။

- Account တစ်ခုအတွက် metadata ကိုပြင်ဆင်ရန် ခွင့်ပြုချက်ပေးသည့် token
  သယ်ဆောင်သည် `account` ကွင်း:

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- ငွေကြေးကို လွှဲပြောင်းခွင့်ပြုတဲ့ Token
  အဓိပ္ပါယ်ဖွင့်ဆိုချက် `asset_definition` ကွင်း:

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- ကမ္ဘာလုံးဆိုင်ရာ token တစ်ခုဖြစ်တဲ့ `CanManagePeers` ကွင်းမရှိပါ

  ```json
  {}
  ```

### Pre-configured Permission Tokens များ {#pre-configured-permission-tokens}

Pre-configured permission tokens တွေရဲ့စာရင်းကို [ရည်ညွှန်းချက်](/my/reference/permissions) အခန်း။

## ခွင့်ပြုချက် အုပ်စုများ (ခန်းကဏ္ဍ) {#permission-groups-roles}

ခွင့်ပြုချက် အစုကို **ကဏ္ဍ**. ခွင့်ပြုချက် လက်မှတ်တွေလိုပဲ
အခန်းကဏ္ဍများကို အသုံးပြု၍ ပေးအပ်နိုင်ပါသည်။ `Grant` ညွှန်ကြားချက်ကို အသုံးပြုပြီး ရုပ်သိမ်းလိုက်ပါတယ်။
`Revoke` ညွှန်ကြားချက်။

အကောင့်တစ်ခုသို့ အခန်းကဏ္ဍမပေးမီ၊ အခန်းက႑ကို ပထမဦးဆုံး မှတ်ပုံတင်သင့်သည်။

စာရင်းအင်းများစွာက ခွင့်ပြုချက်တစ်ခုတည်းရတဲ့အခါ အခန်းကဏ္ဍတွေဟာ အသုံးဝင်ပါတယ်။
စာရင်းသွင်းပြီး ခွင့်ပြုချက်ပေးပြီး
တစ်ဦးချင်းစာရင်းအတွက် အခန်းကဏ္ဍကို ရုပ်သိမ်းပါ။

### အခန်းကဏ္ဍသစ်ကို မှတ်ပုံတင်ပါ။ {#register-a-new-role}

ခွင့်ပြုတဲ့အခါ အခြားစာရင်းကိုခွင့်ပြုမယ့် အခန်းကဏ္ဍသစ်တစ်ခုကို မှတ်ပုံတင်ရအောင်။
ရယူခွင့် [metadata များ](/my/blockchain/metadata.md) Mouse ရဲ့စာရင်းမှာ-

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### အခန်းကဏ္ဍကို ပေးပါ။ {#grant-a-role}

အခန်းကဏ္ဍကို မှတ်ပုံတင်ပြီးနောက် Mouse က Alice ကိုပေးနိုင်ပါတယ်။

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```

## ခွင့်ပြုချက် အတည်ပြုကိရိယာများ {#permission-validators}

ခွင့်ပြုချက်များရှိသည်ဆိုပါက လိုအပ်သော ခွင့်ပြုမှု အမှတ်တံဆိပ်နှင့်အတူစာရင်းများသာရှိသည်
ကာကွယ်ထားတဲ့ လုပ်ဆောင်ချက်တစ်ခု လုပ်နိုင်တယ်
ညွှန်ကြားချက်၊ မေးမြန်းချက်နဲ့ စကားလုံး အကောင်အထည်ဖော်မှုအတွင်းမှာပါ။

Default validator မျက်နှာပြင်ကို ledger area နဲ့ အုပ်စုလိုက်ပါတယ်။

- တန်းတူစီမံခန့်ခွဲမှု
- ဒိုမင်များနှင့် အကောင့်များ
- အရင်းအမြစ်များ NFTs, ငွေကြေးထောက်ပံ့မှု
- trigger များ
- အခန်းကဏ္ဍနှင့် ခွင့်ပြုချက်များ
- အကောင်အထည်ဖော်သူ/အလုပ်လုပ်ချိန်၊ အထောက်အထားများ၊ တံတားများနှင့် SORA/Nexus မော်ဂျူးများ

တိကျတဲ့ token စာရင်းကို source backed in the
[ခွင့်ပြုချက် Token ကို ရည်ညွှန်းခြင်း](/my/reference/permissions.md).

### Runtime Validators များ {#runtime-validators}

ခွင့်ပြုချက် စစ်ဆေးမှုများကို တက်ကြွတဲ့ အကောင်အထည်ဖော်သူက လုပ်ဆောင်ပေးသည်။
အကောင်အထည်ဖော်သူက built-in permission validators နဲ့ token definitions တွေကို ပေးပါတယ်။
ပြီးတော့ ကွန်ရက်တစ်ခုဟာ ၎င်းသုံးတဲ့ အကောင်အထည်ဖော်သူကို အဆင့်မြှင့်ခြင်းဖြင့် မူဝါဒကို ပြောင်းလဲနိုင်ပါတယ်။

အတည်ပြုသူတွေက ပြန်ပို့တယ် **အတည်ပြုချက် ဆုံးဖြတ်ချက်**. အတည်ပြုသူက
(သို့) အပြင်ဘက်က လုပ်ဆောင်ချက်ဖြစ်ပါက အကြောင်းပြချက်တစ်ခုနဲ့ ငြင်းပယ်ခြင်း သို့မဟုတ် ကျော်လွန်ခြင်း
ရွေးချယ်ခံရတဲ့ တရားသူကြီးက ဒီဆုံးဖြတ်ချက်တွေကို ပေါင်းစပ်ပြီး
ညွှန်ကြားချက်၊ မေးမြန်းမှု (သို့) ထုတ်ဖော်ချက်ကို ဆက်လုပ်နိုင်မလား ဆုံးဖြတ်ပါ။

## ထောက်ခံသော မေးခွန်းများ {#supported-queries}

ခွင့်ပြုချက် လက်မှတ်များနှင့် အခန်းကဏ္ဍများကို မေးမြန်းနိုင်ပါသည်။

ကဏ္ဍအတွက် မေးမြန်းချက်များ:

- [`FindRoles`](/my/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/my/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/my/reference/queries.md#accounts-and-permissions)

ခွင့်ပြုချက် လက်မှတ်များအတွက် မေးမြန်းမှု

- [`FindPermissionsByAccountId`](/my/reference/queries.md#accounts-and-permissions)
