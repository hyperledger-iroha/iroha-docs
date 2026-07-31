---
translation_locale: ar
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# الإذن {#permissions}

يحتاج الحسابات إلى رموز الإذن لأعمال مختلفة على بلوكتشين ، مثل:
لتحطيم أو حرق الأصول.

هناك فرق بين البلوكشين العام والخاص من حيث
الإذنات الممنوحة للمستخدمين. في بلوكتشين عام، معظم الحسابات لديها
نفس مجموعة من الإذن. في بلوكتشين خاصة، معظم الحسابات
يفترضون عدم القدرة على القيام بأي شيء خارج السلطة الممنوحة لهم
إلا إذا تم منح الإذن المناسب صراحة.

الحصول على إذن للقيام بشيء يعني أن الحساب لديه
المقابلة `Permission`. يمكن منح الإذن مباشرة أو من خلال
[`Role`](#permission-groups-roles), التي تجمع مجموعة من الإذن.
يتم منح الإذن مع `Grant` الإرشادات و الأدوار
لا تنتهي؛ إزالتهم مع `Revoke` التعليمات

## رموز الإذن {#permission-tokens}

رموز الإذن هي كائنات يتم تطبيقها التي حددتها المنفذ النشط.
الرموز العالمية، مثل `CanManagePeers`, والبعض الآخر يصل إلى
كائن محدد من دفتر التسجيل، مثل الحساب، الأصول، تعريف الأصول، النطاق،
NFT, أدوار أو محفز

فيما يلي بعض الأمثلة على المعلمات المستخدمة لمختلف رموز الإذن:

- رمز يعطي الإذن بتعديل البيانات المعدنية لحساب معين
  يحمل `account` الحقل:

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- رمز يعطي الإذن لنقل الأصول لأصل معين
  تعريف يحمل `asset_definition` الحقل:

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- رمز عالمي مثل `CanManagePeers` لا توجد حقل:

  ```json
  {}
  ```

### رموز الإذن المحددة مسبقاً {#pre-configured-permission-tokens}

يمكنك العثور على قائمة رموز الإذن المحددة مسبقاً في [الإشارة](/ar/reference/permissions) الفصل

## مجموعات الإذن (الأدوار) {#permission-groups-roles}

مجموعة من الإذنات تسمى **الدور**. بنفس الطريقة مع رموز الإذن
يمكن منح الأدوار باستخدام `Grant` التوجيهات والإلغاء باستخدام
`Revoke` التعليمات

قبل منح دور لحساب، يجب تسجيل الدور أولاً.

الأدوار مفيدة عندما يحصل العديد من الحسابات على نفس الإذن
تسجيل الدور مرة واحدة، منح الإذن للدور، ومن ثم منح أو
إلغاء دور الحسابات الفردية.

### تسجيل دور جديد {#register-a-new-role}

دعونا نسجل دوراً جديداً، عندما يُمنح، سيسمح بحساب آخر
الوصول إلى [البيانات](/ar/blockchain/metadata.md) في حساب الفأر:

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### اعطني دوراً {#grant-a-role}

بعد أن يتم تسجيل الدور، يمكن للفأر منحها إلى أليس:

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```

## مؤكدان الإذن {#permission-validators}

هناك إذن بحيث لا يوجد سوى حسابات مع رمز الإذن المطلوب
يمكن تنفيذ إجراء محمي. يقوم المنفذ الافتراضي بتحقق الإذن
أثناء إدارة التعليمات والسؤال والتعبيرات.

يتم تجميع سطح المحقق الافتراضي حسب مساحة الكتيب:

- إدارة الأقران
- المجال والحسابات
- الأصول NFTs, و الاحتياطيات
- المحفزات
- الأدوار والإذن
- الجهاز التنفيذي/وقت التشغيل، والدليلات، والجسور، SORA/Nexus وحدات

قائمة الرموز الدقيقة مدعومة من المصدر في
[إشارة رموز السماح](/ar/reference/permissions.md).

### مؤكدة الوقت التشغيلي {#runtime-validators}

يتم إجراء عمليات التحقق من الإذن بواسطة المنفذ النشط
يقوم المنفذ بتزويد مرخصات الإذن والتحديدات الرمزية المدمجة،
ويمكن لشبكة أن تغير السياسة عن طريق تحديث المنفذ الذي تستخدمه.

المحققون يعودون **حكم التحقق**. يمكن للمؤكد أن يسمح
العملية ، أو رفضها مع سبب ، أو تفوتها إذا كانت العملية خارج
القاضي المختار يجمع بين هذه الأحكام
يقرر ما إذا كان التعليم أو الاستفسار أو التعبير يمكن أن يستمر.

## الأسئلة المدعومة {#supported-queries}

يمكن استفسار رموز الإذن و الأدوار

أسئلة عن الأدوار:

- [`FindRoles`](/ar/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/ar/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/ar/reference/queries.md#accounts-and-permissions)

استفسارات عن رموز الإذن:

- [`FindPermissionsByAccountId`](/ar/reference/queries.md#accounts-and-permissions)
