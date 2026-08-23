---
translation_locale: ur
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 734437b8530ad0efb9ddd83b24cb90c30dc29843a03753babd8dca5e86a3f91d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# اجازت نامے اور کردار {#permissions-and-roles}

## نتیجہ {#outcome}

ایک کردار بنائیں جس میں ایک اکاؤنٹ کو ایک مخصوص اکاؤنٹ پر میٹا ڈیٹا اپ ڈیٹ کرنے کی اجازت دی جائے، اسے کسی مندوب کو تفویض کریں، تفویض شدہ تحریر ثابت کریں، اور اس کے مطابق ٹائپ کردہ Rust ہدایات دکھائیں۔

## لازمی شرائط {#prerequisites}

- Taira کے مالی اعانت یافتہ کلائنٹ اور فیس میٹا ڈیٹا [ سے Taira](./connect-to-taira.md) سے رابطہ کریں.
- `TARGET_ACCOUNT` اور `DELEGATE_ACCOUNT` کے لیے مقرر کیا گیا ہے جو کہ I105 اکاؤنٹ میں IDs ہے۔
- دستخط کرنے والے اکاؤنٹ کو ہدف کی اجازت اور کرداروں کا انتظام کرنے کی اجازت دی جانی چاہئے۔ Taira پر یہ ایک اجازت کے ساتھ بند انتظامی آپریشن ہے۔ حاصل کریں `CanManageRoles` اور اس دائرہ اختیار کی اجازت دینے کے لئے ضروری اتھارٹی، یا تخلیق کردہ مقامی نیٹ ورک پر ہدایت چلائیں.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

لکھنے کو ثابت کرنے کے لئے ایک دوسرے کلائنٹ کی ترتیب کا استعمال کریں:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## قدم {#steps}

### 1۔ خالی کردار رجسٹر کریں {#_1-register-an-empty-role}

ہر ریاستی تبدیلی CLI کمانڈ صریح طور پر فیس ادا کرنے والے کا نام دیتا ہے۔ میٹا ڈیٹا فائل میں نل کے جواب سے حاصل موجودہ Taira فیس اثاثہ ہوتا ہے۔

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### ٹارگٹ اکاؤنٹ میں ایک دائرہ اختیار شامل کریں۔ {#_2-add-a-permission-scoped-to-the-target-account}

اجازت کے ٹوکن JSON اشیاء میں ٹائپ کیے جاتے ہیں۔ اکاؤنٹ کو `payload` کے اندر I105 ID کے طور پر رکھیں؛ اس سخت فیلڈ میں ایک عرفی درست نہیں ہے۔

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3۔ نمائندے کو کردار تفویض کریں {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

کردار اور ان کی امداد ختم نہیں ہوتی۔ جب اس تک رسائی کی ضرورت نہ ہو تو انہیں واضح طور پر منسوخ کریں۔

### 4۔ تفویض شدہ اجازت کا استعمال کریں {#_4-exercise-the-delegated-permission}

لکھنے کے لئے مندوب کے دستخط اور فیس بیلنس کا استعمال کریں۔ JSON اقدار کو معیاری ان پٹ سے پڑھا جاتا ہے۔

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

ایک ہی ماڈل Rust کلائنٹس کے لئے دستیاب ہے۔ یہاں `client` `registrar_account` کے طور پر نشان لگاتا ہے ، جو کردار کا ابتدائی مالک بن جاتا ہے بالکل اسی طرح جیسے یہ CLI بہاؤ میں ہوتا ہے۔ تینوں اکاؤنٹ متغیرات پہلے ہی تجزیہ کیے گئے ہیں `AccountId` اقدار:

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

## تصدیق کریں {#verify}

کام کے دونوں پہلوؤں کو درج کریں، پھر نمائندے کی طرف سے لکھا گیا صحیح قدر پڑھیں:

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

اجازت کی فہرست میں `CanModifyAccountMetadata` شامل ہونا ضروری ہے جس کا دائرہ کار `TARGET_ACCOUNT` تک ہے، مندوب کے کردار کی فہرست میں`ROLE_ID` ہونا چاہئے، اور پڑھنے والے میٹا ڈیٹا کو واپس کرنا ضروری ہے `"delegated"`.

## خرابی کا سراغ لگانا {#troubleshooting}

- `Not permitted` رجسٹریشن ، ترمیم یا کردار تفویض کرتے وقت مطلب یہ ہے کہ دستخط کنندہ کو مطلوبہ Taira اتھارٹی کی کمی ہے۔ گنجائش والے ٹوکن کو گلوبل کے ساتھ متبادل نہ کریں؛ عین مطابق گرانٹ کی درخواست کریں یا لوکل نیٹ استعمال کریں۔
- ایک مفید بوجھ تجزیہ کی غلطی کا مطلب عام طور پر `account` `payload` کے ساتھ رکھا گیا تھا، I105 ID کے بجائے ایک عرفان فراہم کیا گیا تھا، یا JSON قدر دو بار حوالہ دیا گیا تھا.
- فیس کی مستردگی اس دستخط کنندہ سے تعلق رکھتی ہے جو یہ قدم پیش کرتا ہے۔ مینیجر کو فنڈ اور آزادانہ طور پر تفویض کرنا اور نل سے حاصل کردہ فیس اثاثہ میٹا ڈیٹا برقرار رکھنا۔
- ایک کامیاب کردار کی گرانٹ اس کے ٹوکن میں کوڈ کردہ دائرہ کار سے تجاوز نہیں کرتی ہے۔ یہ کردار صرف اجازت بوجھ میں نامی اکاؤنٹ کو تبدیل کرسکتا ہے۔
- صاف کرنے کے لئے، `ledger account role revoke` چلائیں، پھر `ledger role permission revoke`، اور آخر میں `ledger role unregister`؛ ہر ایک علیحدہ تحریر ہے اور اس میں `--fee-payer authority` اور فیس میٹا ڈیٹا شامل ہونا ضروری ہے.

## ماخذ اور متعلقہ دستاویزات {#source-and-related-docs}

- [پنڈ commit پر رول انٹیگریشن ٹیسٹ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/roles.rs)
- [مقررہ کمیٹ پر اجازت انٹیگریشن ٹیسٹ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/permissions.rs)
- [پنڈ commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_executor_data_model/src/permission.rs) پر بلٹ ان اجازت ڈیٹا ماڈل۔
- [اجازت اور کردار](/ur/blockchain/permissions.md)
- [اجازت ٹوکن حوالہ ](/ur/reference/permissions.md)
- [میٹا ڈیٹا](./metadata.md)
