---
translation_locale: ar
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# الإذن {#permissions}

يحتاج الحسابات إلى رموز ترخيص لمختلف الإجراءات على بلوكتشين، على سبيل المثال لقطع الأصول أو حرقها.

هناك فرق بين البلوكشين العام والخاص من حيث الإذنات الممنوحة للمستخدمين. في بلوكشين عام، معظم الحسابات لديها نفس مجموعة من الإذنات. في بلوكتشين خاص، يفترض أن معظم الحسابات لا تكون قادرة على القيام بأي شيء خارج السلطة الممنوحة لهم ما لم يتم منح الإذن المناسب صراحة.

الحصول على إذن للقيام بشيء يعني أن الحساب لديه `Permission` المقابلة. يمكن منح الإذن مباشرة أو من خلال [`Role`](#permission-groups-roles), والتي تجمع مجموعة من الإذنات. يتم منح الإذن مع تعليمة `Grant`. الأذونات والأدوار لا تنتهي؛ إزالتها مع تعليمات `Revoke`.

## رموز الإذن {#permission-tokens}

توكنات السماح هي كائنات تم تصنيفها من قبل المنفذ النشط. بعض التوكنات عالمية، مثل `CanManagePeers` ، والبعض الآخر يتم تحديد نطاقه إلى كائن رئيسي محدد، مثل الحساب أو الأصول أو تعريف الأصول أو النطاق أو NFT أو الدور أو المحرك.

فيما يلي بعض الأمثلة على المعلمات المستخدمة لمختلف رموز الإذن:

- رمز يمنح الإذن بتعديل البيانات المعدنية لحساب معين يحمل حقل `account`:

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- رمز يمنح الإذن بنقل الأصول لتحديد خاص للأصول يحمل حقل `asset_definition`:

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- رمز عالمي مثل `CanManagePeers` لا يحتوي على حقل:

  ```json
  {}
  ```

### رموز الإذن المحددة مسبقاً {#pre-configured-permission-tokens}

يمكنك العثور على قائمة رموز الإذن المحددة مسبقاً في الفصل [Reference](/ar/reference/permissions).

## مجموعات الإذن (الأدوار) {#permission-groups-roles}

يطلق على مجموعة من الإذنات دورًا. وبمثل رموز الإذن، يمكن منح الأدوار باستخدام تعليمة `Grant` وإلغاءها باستخدام تعليمات `Revoke`.

قبل منح دور لحساب، يجب تسجيل الدور أولاً.

تكون الأدوار مفيدة عندما يتعين على العديد من الحسابات الحصول على نفس مجموعة الإذن. قم بتسجيل الدور مرة واحدة، ومنح الإذن للدور، ثم منح أو إلغاء الدور للحسابات الفردية.

### سجل دور جديد {#register-a-new-role}

دعونا نسجل دوراً جديداً، عندما يُمنح، سيسمح لحساب آخر بالوصول إلى [البيانات الأساسية](/ar/blockchain/metadata.md) في حساب الفأر:

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

## مؤكّدات الإذن {#permission-validators}

تتوفر الإذنات بحيث لا يمكن إلا للحسابات التي تحتوي على رمز الإذن المطلوب تنفيذ إجراء محمي. يقوم جهاز التنفيذ الافتراضي بتحقق الإذنات أثناء تنفيذ التعليمات والاستفسار والتعبيرات.

يتم تجميع سطح التحقق الافتراضي حسب مساحة الكتيب:

- إدارة الأقران
- المجال والحسابات
- الأصول، NFTs ، والضمانيات
- المحفزات
- الأدوار والإذن
- الجهاز التنفيذي/وقت التشغيل والدليلات والجسور وحدة SORA/Nexus

القائمة الدقيقة للرموز مدعومة من المصدر في إشارة رموز الإذن [ ](/ar/reference/permissions.md).

### مؤكّدات وقت التشغيل {#runtime-validators}

يتم تطبيق عمليات التحقق من الإذن من قبل المنفذ النشط. يقوم المنفذ الافتراضي بتزويد مرخصي الإذن والتحديدات الرمزية المدمجة، ويمكن لشبكة أن تتغير السياسة عن طريق تحديث المنفذ الذي تستخدمه.

يقوم المحققون بإرسال حكم التحقق. يمكن للمحقق أن يسمح بعملية أو ينكرها مع سبب، أو يغيب عنها إذا كانت العملية خارج نطاق هذا المحقق. يجمع القاضي المختار هذه الحكمات ليقرر ما إذا كان من الممكن مواصلة التعليمات أو الاستفسارات أو الإعلان.

## الأسئلة المدعومة {#supported-queries}

يمكن استفسار رموز الإذن و الأدوار

أسئلة عن الأدوار:

- [`FindRoles`](/ar/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/ar/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/ar/reference/queries.md#accounts-and-permissions)

أسئلة عن رموز الإذن:

- [`FindPermissionsByAccountId`](/ar/reference/queries.md#accounts-and-permissions)
