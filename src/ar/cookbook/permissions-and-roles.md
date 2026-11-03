---
translation_locale: ar
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 40fe8b19344d8eff66b178dc8576e2e049fef50bd3212fbddc5c0d5f7f37fa03
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# الأذونات والأدوار {#permissions-and-roles}

## نتيجة {#outcome}

إنشاء دور يمنح حسابًا واحدًا إذنًا لتحديث البيانات الوصفية على حساب محدد واحد، وتعيينه إلى مفوض، وإثبات الكتابة المفوضة، وعرض التعليمات المطابقة المكتوبة Rust.

## المتطلبات الأساسية {#prerequisites}

- عميل Taira مموّل من [الاتصال بـ Taira](./connect-to-taira.md).
- `TARGET_ACCOUNT` و `DELEGATE_ACCOUNT` تم تعيينهما إلى معرفات حساب I105 وفقًا لبروتوكول واحد.
- يجب أن يحمل الحساب الموقِّع `CanManageRoles` وأن يكون قادرًا على تفويض الإذن المحدد النطاق: أي أن يكون هو `TARGET_ACCOUNT` نفسه أو يحمل مسبقًا `CanModifyAccountMetadata` لذلك الحساب. على Taira هذه عملية إدارية محمية بالإذن. لا يحمل عميل الشبكة المحلية المُولَّدة `CanManageRoles`، لذا تحتاج الوصفة إلى شبكة تمنحه إياه كتلة التكوين الخاصة بها.

```bash
CONFIG=./taira.client.toml
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

استخدم تكوين عميل ثانٍ للمندوب عند إثبات الكتابة:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## خطوات {#steps}

### 1. تسجيل دور فارغ {#_1-register-an-empty-role}

كل أمر CLI يغيّر الحالة يذكر دافع الرسوم صراحة. يعرض CLI تقدير سعر الرسوم الدقيق بأصل رسوم Taira قبل التوقيع.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  ledger role register --id "$ROLE_ID"
```

### ٢. أضف تصريحًا محدد النطاق للحساب المستهدف {#_2-add-a-permission-scoped-to-the-target-account}

رموز الإذن هي كائنات من نوع JSON. احتفظ بالحساب داخل `payload` كمعرف I105؛ الاسم المستعار غير صالح في هذا الحقل الصارم.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. قم بتعيين الدور للموفد {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

الأدوار ومنحها لا تنتهي صلاحيتها. قم بإلغائها صراحةً عندما لا يكون الوصول مطلوبًا بعد الآن.

### 4. ممارسة الإذن المفوض {#_4-exercise-the-delegated-permission}

استخدم موقع التوقيع التشفيري للوكيل ورصيد الرسوم للكتابة. يتم قراءة قيم JSON من الإدخال القياسي.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

يتوفر نفس النموذج لعملاء Rust. هنا `client` هو `iroha::blocking::Client` يوقّع بصفة `registrar_account`، الذي يصبح المالك الأول للدور تمامًا كما هو الحال في تدفق CLI. جميع متغيرات الحساب الثلاثة هي قيم `AccountId` تم تحليلها بالفعل:

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

## تحقق {#verify}

اقرأ الأذونات الفعلية للمندوب، والتي تشمل منح الأدوار، ثم اقرأ القيمة الدقيقة المكتوبة بواسطة المندوب:

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

يجب أن تحتوي الأذونات الفعلية للمندوب على `CanModifyAccountMetadata` المقيّد بـ `TARGET_ACCOUNT`، ويجب أن تُرجع قراءة البيانات الوصفية `"delegated"`. يرفض Torii عرض قوائم الأدوار عبر الاستعلامات الموقعة، لذا فإن قائمة الأذونات الفعلية هي وسيلة التحقق من التعيين.

## استكشاف الأخطاء وإصلاحها {#troubleshooting}

- `Not permitted` أثناء التسجيل أو التعديل أو تعيين الدور يعني أن الموقّع يفتقر إلى الصلاحية المطلوبة على Taira. لا تقم باستبدال الرمز المميز ذي النطاق برمز عام؛ اطلب المنح الدقيق.
- عادةً ما يعني خطأ تحليل الحمولة أن `account` وُضع بجانب `payload`، أو تم تزويد اسم مستعار بدلًا من معرف I105، أو تم اقتباس قيمة JSON مرتين.
- رفض الرسوم يخص الموقّع الذي يقدم تلك الخطوة. موّل المدير والمندوب كلًّا على حدة بأصل الرسوم المذكور في كل تقدير لسعر الرسوم.
- منحة الدور الناجحة لا تتجاوز النطاق المضمن في رموزها. يمكن لهذا الدور تعديل الحساب المسمى في حمولة الإذن فقط.
- للتنظيف، قم بتشغيل `account role revoke`، ثم `ledger role permission revoke`، وأخيرًا `ledger role unregister`؛ كل منها عملية كتابة منفصلة ويجب أن تتضمن `--fee-payer authority`.

## المصدر والمستندات ذات الصلة {#source-and-related-docs}

- [اختبارات تكامل الأدوار عند مراجعة كود المصدر المثبتة](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/roles.rs)
- [اختبارات تكامل الأذونات عند مراجعة كود المصدر المثبتة](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/permissions.rs)
- [نموذج بيانات الأذونات المدمج في مراجعة الشيفرة المصدرية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/permission.rs)
- [الأذونات والأدوار](/ar/blockchain/permissions.md)
- [مرجع رمز الإذن](/ar/reference/permissions.md)
- [البيانات الوصفية](./metadata.md)
