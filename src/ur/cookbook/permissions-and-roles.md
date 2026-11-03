---
translation_locale: ur
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 40fe8b19344d8eff66b178dc8576e2e049fef50bd3212fbddc5c0d5f7f37fa03
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# اجازت نامے اور کردار {#permissions-and-roles}

## نتیجہ {#outcome}

ایک کردار بنائیں جس میں ایک اکاؤنٹ کو ایک مخصوص اکاؤنٹ پر میٹا ڈیٹا اپ ڈیٹ کرنے کی اجازت دی جائے، اسے کسی مندوب کو تفویض کریں، تفویض شدہ تحریر ثابت کریں، اور اس کے مطابق ٹائپ کردہ Rust ہدایات دکھائیں۔

## لازمی شرائط {#prerequisites}

- [Taira سے رابطہ کریں](./connect-to-taira.md) سے حاصل کردہ مالی اعانت یافتہ Taira کلائنٹ۔
- `TARGET_ACCOUNT` اور `DELEGATE_ACCOUNT` کے لیے مقرر کیا گیا ہے جو کہ I105 اکاؤنٹ میں IDs ہے۔
- دستخط کرنے والے اکاؤنٹ کے پاس `CanManageRoles` ہونا چاہیے اور اسے محدود دائرہ کار والی اجازت تفویض کرنے کے قابل ہونا چاہیے: یعنی وہ خود `TARGET_ACCOUNT` ہو یا اس اکاؤنٹ کے لیے پہلے سے `CanModifyAccountMetadata` رکھتا ہو۔ Taira پر یہ ایک اجازت کے ساتھ بند انتظامی آپریشن ہے۔ پیدا کردہ لوکل نیٹ کے کلائنٹ کے پاس `CanManageRoles` نہیں ہوتا، اس لیے اس نسخے کو ایسے نیٹ ورک کی ضرورت ہے جس کا جینیسس یہ اجازت عطا کرتا ہو۔

```bash
CONFIG=./taira.client.toml
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

حالت بدلنے والی ہر CLI کمانڈ صریح طور پر فیس ادا کرنے والے کا نام دیتی ہے۔ CLI دستخط سے پہلے Taira کے فیس اثاثے میں عین فیس کی کوٹیشن دیتا ہے۔

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  ledger role register --id "$ROLE_ID"
```

### ٹارگٹ اکاؤنٹ میں ایک دائرہ اختیار شامل کریں۔ {#_2-add-a-permission-scoped-to-the-target-account}

اجازت کے ٹوکن JSON اشیاء میں ٹائپ کیے جاتے ہیں۔ اکاؤنٹ کو `payload` کے اندر I105 ID کے طور پر رکھیں؛ اس سخت فیلڈ میں ایک عرفی درست نہیں ہے۔

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    ledger role permission grant --id "$ROLE_ID"
```

### 3۔ نمائندے کو کردار تفویض کریں {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

کردار اور ان کی اجازتیں ختم نہیں ہوتی۔ جب اس تک رسائی کی ضرورت نہ ہو تو انہیں واضح طور پر منسوخ کریں۔

### 4۔ تفویض شدہ اجازت کا استعمال کریں {#_4-exercise-the-delegated-permission}

لکھنے کے لئے مندوب کے دستخط اور فیس بیلنس کا استعمال کریں۔ JSON اقدار کو معیاری ان پٹ سے پڑھا جاتا ہے۔

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

یہی ماڈل Rust کلائنٹس کے لئے دستیاب ہے۔ یہاں `client` ایک `iroha::blocking::Client` ہے جو `registrar_account` کے طور پر دستخط کرتا ہے، جو کردار کا ابتدائی مالک بن جاتا ہے بالکل اسی طرح جیسے CLI بہاؤ میں ہوتا ہے۔ تینوں اکاؤنٹ متغیرات پہلے ہی تجزیہ شدہ `AccountId` اقدار ہیں:

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

## تصدیق کریں {#verify}

نمائندے کی مؤثر اجازتیں پڑھیں، جن میں کرداروں کے ذریعے عطا کردہ اجازتیں شامل ہیں، پھر نمائندے کی طرف سے لکھی گئی عین قدر پڑھیں:

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

مندوب کی مؤثر اجازتوں میں `CanModifyAccountMetadata` شامل ہونا ضروری ہے جس کا دائرہ کار `TARGET_ACCOUNT` تک ہے، اور میٹا ڈیٹا کی پڑھائی کو `"delegated"` واپس کرنا ضروری ہے۔ Torii دستخط شدہ استفسارات کے ذریعے کرداروں کی فہرستیں دینے سے انکار کرتا ہے، اس لیے مؤثر اجازتوں کی فہرست ہی تفویض کی جانچ ہے۔

## خرابی کا سراغ لگانا {#troubleshooting}

- رجسٹریشن، ترمیم یا کردار تفویض کرتے وقت `Not permitted` کا مطلب یہ ہے کہ دستخط کنندہ کے پاس مطلوبہ Taira اتھارٹی کی کمی ہے۔ محدود دائرہ کار والے ٹوکن کو عالمی ٹوکن سے تبدیل نہ کریں؛ عین مطابق تفویض کی درخواست کریں۔
- ایک پے لوڈ تجزیہ کی غلطی کا مطلب عام طور پر `account` `payload` کے ساتھ رکھا گیا تھا، I105 ID کے بجائے ایک عرفان فراہم کیا گیا تھا، یا JSON قدر دو بار حوالہ دیا گیا تھا.
- فیس کی مستردگی اس دستخط کنندہ سے تعلق رکھتی ہے جو یہ قدم پیش کرتا ہے۔ مینیجر اور مندوب کو ہر فیس کوٹیشن میں بتائے گئے فیس اثاثے میں الگ الگ فنڈ کریں۔
- ایک کامیاب کردار کی تفویض اس کے ٹوکن میں کوڈ کردہ دائرہ کار سے تجاوز نہیں کرتی ہے۔ یہ کردار صرف اجازت بوجھ میں نامی اکاؤنٹ کو تبدیل کرسکتا ہے۔
- صاف کرنے کے لئے، `account role revoke` چلائیں، پھر `ledger role permission revoke`، اور آخر میں `ledger role unregister`؛ ہر ایک علیحدہ تحریر ہے اور اس میں `--fee-payer authority` شامل ہونا ضروری ہے۔

## ماخذ اور متعلقہ دستاویزات {#source-and-related-docs}

- [پنڈ commit پر رول انٹیگریشن ٹیسٹ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/roles.rs)
- [مقررہ کمیٹ پر اجازت انٹیگریشن ٹیسٹ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/permissions.rs)
- [پنڈ commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/permission.rs) پر بلٹ ان اجازت ڈیٹا ماڈل۔
- [اجازت اور کردار](/ur/blockchain/permissions.md)
- [اجازت ٹوکن حوالہ ](/ur/reference/permissions.md)
- [میٹا ڈیٹا](./metadata.md)
