---
translation_locale: ar
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# الأذونات {#permissions}

تحتاج الحسابات إلى رموز إذن للقيام بإجراءات مختلفة على البلوكشين، مثل إصدار أو حرق الأصول.

هناك فرق بين البلوكشين العام والخاص من حيث الأذونات الممنوحة للمستخدمين. في البلوكشين العام، تمتلك معظم الحسابات نفس مجموعة الأذونات. في البلوكتشين الخاص، يُفترض أن معظم الحسابات لا تستطيع القيام بأي شيء خارج الصلاحيات الممنوحة لها ما لم يتم منحها صراحة الإذن ذي الصلة.

الحصول على إذن للقيام بشيء ما يعني أن الحساب لديه المقابل `Permission`. يمكن منح الأذونات مباشرة أو من خلال [`Role`](#permission-groups-roles), الذي يجمع مجموعة من الأذونات. يتم منح الأذونات مع `Grant` التعليمات. الأذونات والأدوار لا تنتهي صلاحيتها؛ قم بإزالتها باستخدام `Revoke` تعليمات.

## رموز الإذن {#permission-tokens}

رموز الإذن هي كائنات محددة النوع يتم تعريفها بواسطة المنفذ النشط. بعض الرموز عامة، مثل `CanManagePeers`، والبعض الآخر مرتبط بكائن دفتر حسابات محدد على البلوكشين، مثل حساب، أصل، تعريف أصل، نطاق، NFT، دور، أو مشغل.

فيما يلي بعض الأمثلة على المعايير المستخدمة لرموز الأذونات المختلفة:

- رمز يمنح إذنًا لتعديل البيانات الوصفية لحساب معين يحتوي على حقل `account`:

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- الرمز الذي يمنح الإذن لنقل الأصول لتعريف أصل محدد يحمل حقل `asset_definition`:

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- رمز عالمي مثل `CanManagePeers` ليس له حقول:

  ```json
  {}
  ```

### رموز الإذن المُعدة مسبقًا {#pre-configured-permission-tokens}

يمكنك العثور على قائمة رموز الأذونات المهيأة مسبقًا في الفصل [مرجع](/ar/reference/permissions).

## مجموعات الأذونات (الأدوار) {#permission-groups-roles}

مجموعة من الأذونات تُسمى دورًا. وبالمثل مثل رموز الأذونات، يمكن منح الأدوار باستخدام أمر `Grant` وسحبها باستخدام أمر `Revoke`.

قبل منح دور لحساب، يجب تسجيل الدور أولاً.

الأدوار مفيدة عندما يجب أن تحصل عدة حسابات على نفس مجموعة الأذونات. قم بتسجيل الدور مرة واحدة، امنح الأذونات للدور، ثم امنح أو حرر الدور للحسابات الفردية.

### تسجيل دور جديد {#register-a-new-role}

لنسجل دورًا جديدًا، وعند منحه، سيسمح لحساب آخر بالوصول إلى [البيانات الوصفية](/ar/blockchain/metadata.md) في حساب Mouse:

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### منح دور {#grant-a-role}

بعد تسجيل الدور، يمكن لـ Mouse منحه إلى Alice:

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```

## متحققو الأذونات {#permission-validators}

توجد الأذونات بحيث يمكن للحسابات التي تحتوي على رمز الإذن المطلوب فقط تنفيذ إجراء محمي. يقوم المنفذ الافتراضي بفحص الأذونات أثناء تنفيذ التعليمات والاستعلامات والتعبيرات.

يتم تجميع واجهة المدقق الافتراضية حسب منطقة دفتر الأستاذ الخاص بالبلوكتشين:

- إدارة أقران الشبكة
- النطاقات والحسابات
- الأصول، NFTs، والحسابات الضمان
- المحفزات
- الأدوار والأذونات
- المنفذ/وقت التشغيل، الإثباتات، الجسور، ووحدات SORA/Nexus

قائمة الرموز الدقيقة مدعومة بالمصدر في [مرجع رموز الإذن](/ar/reference/permissions.md).

### محاكيات تشغيل البرمجيات {#runtime-validators}

تتم فرض فحوصات الأذونات بواسطة المنفذ النشط. يوفر المنفذ الافتراضي أدوات التحقق من الأذونات المدمجة وتعريفات الرموز، ويمكن للشبكة تغيير السياسة من خلال ترقية المنفذ الذي تستخدمه.

يعيد المحققون حكم التحقق. يمكن للمحقق أن يسمح بعملية ما، أو يرفضها مع تقديم سبب، أو يتجاوزها إذا كانت العملية خارج نطاق ذلك المحقق. يجمع القاضي المختار تلك الأحكام ليقرر ما إذا كان يمكن للتعليمات أو الاستعلام أو التعبير أن يستمر.

## الاستفسارات المدعومة {#supported-queries}

يمكن الاستعلام عن رموز الأذونات والأدوار.

استفسارات عن الأدوار:

- [`FindRoles`](/ar/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/ar/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/ar/reference/queries.md#accounts-and-permissions)

استعلامات عن رموز الأذونات:

- [`FindPermissionsByAccountId`](/ar/reference/queries.md#accounts-and-permissions)
