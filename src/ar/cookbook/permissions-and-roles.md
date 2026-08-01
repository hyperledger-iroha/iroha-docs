---
translation_locale: ar
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 734437b8530ad0efb9ddd83b24cb90c30dc29843a03753babd8dca5e86a3f91d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# الترخيصات والأدوار {#permissions-and-roles}

## النتيجة {#outcome}

قم بإنشاء دور يمنح أحد الحسابات إذنًا بتحديث البيانات الأساسية في حساب معين واحد، ومرخصه إلى مندوب، وإثبات الكتابة المفوضة، وعرض التعليمات المقابلة التي تم كتابتها Rust.

## الشروط المسبقة {#prerequisites}

- بيانات العميل الممولة Taira والرسوم من [تصل إلى Taira](./connect-to-taira.md).
- `TARGET_ACCOUNT` و `DELEGATE_ACCOUNT` المحددة على الحساب القنوني I105 IDs.
- يجب السماح لحساب التوقيع بإدارة الإذن المستهدف والأدوار. في Taira هذه عملية إدارية محددة للإذن ؛ الحصول على `CanManageRoles` والسلطة اللازمة لمنح الإذن المحدد ، أو تشغيل الوصفة على شبكة محلية تم إنشاؤها.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

استخدم تكوين العميل الثاني لل مندوب عند إثبات كتابة:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## الخطوات {#steps}

### 1- تسجيل دور فارغ {#_1-register-an-empty-role}

كل أمر يتغير الحالة CLI يسمي مدفع الرسوم صراحة. يحتوي ملف البيانات الأساسية على أصول الرسوم الحالية Taira المستمدة من استجابة الصمام.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### إضافة إذن محدد إلى الحساب المستهدف {#_2-add-a-permission-scoped-to-the-target-account}

يتم تطبيق رموز الإذن على كائنات JSON. احتفظ بالحساب داخل `payload` باعتباره I105 ID. لا ينطبق الاسم الألي في هذا الحقل الصارم.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3 - تفويض الدور إلى المندوب {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

الدورات والمنح التي تمنحها لا تنتهي، إلغاءها صراحة عندما لا يكون الوصول ضروريًا بعد الآن.

### 4 - ممارسة الإذن المفوض {#_4-exercise-the-delegated-permission}

استخدم توقيع المندوب و ميزان الرسوم في الكتابة. يتم قراءة قيم JSON من المدخل القياسي.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

يتوفر نفس النموذج لعملاء Rust. هنا `client` يشير إلى `registrar_account` ، والذي يصبح المالك الأولي للدور تماما كما يفعل في تدفق CLI. جميع متغيرات الحساب الثلاثة يتم تحليلها بالفعل قيم `AccountId`:

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

## التحقق {#verify}

قم بإدراج كلا الجانبين من المهمة، ثم اقرأ القيمة الدقيقة التي كتبها المشارك:

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

يجب أن تحتوي قائمة الإذن على `CanModifyAccountMetadata` المحددة إلى `TARGET_ACCOUNT`، ويجب أن تتضمن قائمة الأدوار الخاصة بالموثوق `ROLE_ID`، ويتعين أن تعود البيانات الضخمة القراءة `"delegated"`.

## حل المشاكل {#troubleshooting}

- `Not permitted` أثناء تسجيل أو تحرير أو تخصيص الدور يعني أن الموقّع يفتقر إلى السلطة المطلوبة Taira. لا تستبدل الرمزية المحدودة بأحد عالمي؛ اطلب المنحة الدقيقة أو استخدم localnet.
- خطأ في تحليل الحمولة المفيدة عادة ما يعني أن `account` تم وضعها بجانب `payload` ، أو تم تقديم اسم مستعار بدلاً من I105 ID ، أو تم اقتباس قيمة JSON مرتين.
- إن رفض الرسوم ينتمي إلى الموقّع الذي يقدم هذه الخطوة. تمويل المشرف والمنصب بشكل مستقل ويحفظ البيانات الأساسية للأصول المتعلقة بالرسوم المستمدة من الصنبورة.
- لا تتجاوز منح الدور الناجح نطاق تشفير رموزها. يمكن لهذا الدور تعديل الحساب المشار إليه في حمولة الإذن فقط.
- للتنظيف، قم بتشغيل `ledger account role revoke` ، ثم `ledger role permission revoke` ، وأخيراً `ledger role unregister`؛ كل منهما كتابة منفصلة ويجب أن يحتوي على `--fee-payer authority` وميتات بيانات الرسوم.

## المصدر والوثائق ذات الصلة {#source-and-related-docs}

- [اختبارات تكامل الأدوار في الالتزام المتعلق ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/roles.rs)
- [اختبارات التكامل المسموح بها في الالتزام المتعلق ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/permissions.rs)
- [نموذج بيانات الإذن المدمجة في الالتزام المثبت ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_executor_data_model/src/permission.rs)
- [الترخيصات والأدوار ](/ar/blockchain/permissions.md)
- [إشارة رمز الإذن ](/ar/reference/permissions.md)
- [البيانات الأساسية](./metadata.md)
