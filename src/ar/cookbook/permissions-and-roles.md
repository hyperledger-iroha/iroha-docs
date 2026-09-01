---
translation_locale: ar
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 8d6fd7101094ba21cfc2c5fb9a89d2acd7e67f13ff47b9f8c8e01bbbd7bf2836
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# الأذونات والأدوار {#permissions-and-roles}

## نتيجة {#outcome}

إنشاء دور يمنح حسابًا واحدًا إذنًا لتحديث البيانات الوصفية على حساب محدد واحد، وتعيينه إلى مفوض، وإثبات الكتابة المفوضة، وعرض التعليمات المطابقة المكتوبة Rust.

## المتطلبات الأساسية {#prerequisites}

- عميل مموّل Taira وبيانات الرسوم من [الاتصال بـ Taira](./connect-to-taira.md).
- `TARGET_ACCOUNT` و `DELEGATE_ACCOUNT` تم تعيينهما إلى معرفات حساب I105 وفقًا لبروتوكول واحد.
- يجب أن يُسمح للحساب الموقع بإدارة الإذن والأدوار المستهدفة. على Taira هذه عملية إدارية محمية بالإذن؛ احصل على `CanManageRoles` وأساس التفويض اللازم لمنح الإذن المحدد، أو نفذ الوصفة على شبكة محلية مولدة.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
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

كل أمر يغير الحالة CLI يذكر دافع الرسوم صراحة. يحتوي ملف البيانات الوصفية على أصل الرسوم الحالي Taira المستمد من استجابة خدمة التمويل لشبكة الاختبار.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### ٢. أضف تصريحًا محدد النطاق للحساب المستهدف {#_2-add-a-permission-scoped-to-the-target-account}

رموز الإذن هي كائنات من نوع JSON. احتفظ بالحساب داخل `payload` كمعرف I105؛ الاسم المستعار غير صالح في هذا الحقل الصارم.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. قم بتعيين الدور للموفد {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
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
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

يتوفر نفس النموذج لعملاء Rust. هنا يقوم `client` بالتوقيع بصفتها `registrar_account`، والتي تصبح المالك الأول للدور تمامًا كما هو الحال في تدفق CLI. جميع متغيرات الحساب الثلاثة قد تم تحليل قيم `AccountId` بالفعل:

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

## تحقق {#verify}

اكتب جانبي الواجب، ثم اقرأ القيمة الدقيقة المكتوبة بواسطة المندوب:

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

يجب أن تحتوي قائمة الأذونات على `CanModifyAccountMetadata` المقيّد بـ `TARGET_ACCOUNT`، ويجب أن تحتوي قائمة أدوار المندوب على `ROLE_ID`، ويجب أن تُرجع قراءة البيانات الوصفية `"delegated"`.

## استكشاف الأخطاء وإصلاحها {#troubleshooting}

- `Not permitted` أثناء التسجيل أو التعديل أو تعيين الدور يعني أن الموقع التوقيعي التشفيري يفتقر إلى المسؤولية التفويضية المطلوبة Taira. لا تقم باستبدال الرمز المميز ذي النطاق برمز عام؛ اطلب التفويض الدقيق أو استخدم الشبكة المحلية.
- عادةً ما يعني خطأ تحليل الحمولة أن `account` وُضع بجانب `payload`، أو تم تزويد اسم مستعار بدلًا من معرف I105، أو تم اقتباس قيمة JSON مرتين.
- رفض الرسوم ينتمي إلى الموقع التشفيري الذي يقدم تلك الخطوة. قم بتمويل المدير وتفويضه بشكل مستقل واحتفظ ببيانات أصول الرسوم المستمدة من الصنبور.
- منحة الدور الناجحة لا تتجاوز النطاق المضمن في رموزها. يمكن لهذا الدور تعديل الحساب المسمى في حمولة الإذن فقط.
- للتنظيف، قم بتشغيل `ledger account role revoke`، ثم `ledger role permission revoke`، وأخيرًا `ledger role unregister`؛ كل منها عملية كتابة منفصلة ويجب أن تتضمن `--fee-payer authority` وبيانات الرسوم.

## المصدر والمستندات ذات الصلة {#source-and-related-docs}

- [اختبارات تكامل الأدوار عند مراجعة كود المصدر المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [اختبارات تكامل الأذونات عند مراجعة كود المصدر المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)
- [نموذج بيانات الأذونات المدمج في مراجعة الشيفرة المصدرية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs)
- [الأذونات والأدوار](/ar/blockchain/permissions.md)
- [مرجع رمز الإذن](/ar/reference/permissions.md)
- [البيانات الوصفية](./metadata.md)
