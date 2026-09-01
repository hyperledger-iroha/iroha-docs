---
translation_locale: ar
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# رموز الإذن {#permission-tokens}

تسرد هذه الصفحة أنواع رموز الأذونات الافتراضية التي يكشف عنها نموذج بيانات المنفذ الحالي Iroha. للإرشادات المفاهيمية حول الأدوار والأذونات، انظر [الأذونات](/ar/blockchain/permissions.md).

يتم فرض فحوصات الأذونات بواسطة مدقق بيئة تنفيذ البرمجيات النشط. تصف أسماء أنواع الرموز أدناه سطح السياسة القياسية، لكن يمكن للشبكة تخصيص تحقق بيئة تنفيذ البرمجيات عن طريق ترقية المنفذ.

## الرموز الافتراضية {#default-tokens}

|رمز الإذن|الفئة|عملية|
| --- | --- | --- |
| `CanManagePeers` |نظير الشبكة|سجّل أو ألغِ التسجيل أو قم بإدارة نظراء الشبكة بطريقة أخرى.|
| `CanManageLaneRelayEmergency` |نظير الشبكة|إدارة ضوابط تحويل الحارة الطارئة.|
| `CanRegisterDomain` |نطاق|قم بتسجيل نطاق.|
| `CanUnregisterDomain` |نطاق|إلغاء تسجيل نطاق.|
| `CanModifyDomainMetadata` |نطاق|تعديل بيانات تعريف النطاق.|
| `CanRegisterAccount` |حساب|قم بتسجيل حساب.|
| `CanUnregisterAccount` |حساب|إلغاء تسجيل الحساب.|
| `CanModifyAccountMetadata` |حساب|تعديل بيانات الحساب الوصفية.|
| `CanUnregisterAssetDefinition` |تعريف الأصل|إلغاء تسجيل تعريف الأصل.|
| `CanModifyAssetDefinitionMetadata` |تعريف الأصل|تعديل بيانات تعريف الأصل.|
| `CanMintAssetWithDefinition` |أصل|إصدار الأصول لتعريف محدد.|
| `CanBurnAssetWithDefinition` |أصل|تدمير الأصول لتعريف محدد.|
| `CanTransferAssetWithDefinition` |أصل|نقل الأصول لتعريف محدد.|
| `CanMintAsset` |أصل|إصدار رصيد أصل محدد.|
| `CanBurnAsset` |أصل|تدمير رصيد أصل محدد.|
| `CanTransferAsset` |أصل|نقل رصيد أصل محدد.|
| `CanRegisterNft` | NFT |سجّل NFT.|
| `CanUnregisterNft` | NFT |إلغاء تسجيل NFT.|
| `CanTransferNft` | NFT |نقل NFT.|
| `CanModifyNftMetadata` | NFT |تعديل بيانات التعريف NFT.|
| `CanSetParameters` |المعلمات|تعيين معلمات التكوين على الشبكة|
| `CanManageRoles` |الأدوار|تسجيل، إلغاء التسجيل، منح، أو سحب الأدوار.|
| `CanRegisterTrigger` |زناد|قم بتسجيل مشغل.|
| `CanExecuteTrigger` |زناد|تنفيذ مُحفِّز.|
| `CanUnregisterTrigger` |زناد|إلغاء تسجيل المحفز.|
| `CanModifyTrigger` |زناد|تعديل تكوين المحفز.|
| `CanModifyTriggerMetadata` |زناد|تعديل بيانات تعريف المحفز.|
| `CanUpgradeExecutor` |المنفذ|قم بترقية منفذ تنفيذ بيئة تشغيل البرنامج.|
| `CanRegisterSmartContractCode` |العقد الذكي|تسجيل رمز العقد الذكي.|
| `CanUseFeeSponsor` | Nexus |فرض رسوم Nexus على حساب الراعي المحدد.|

## الملكية {#ownership}

يجب أن تشير رموز الأذونات الحساسة للمالك إلى معرفات الكائن القياسية للبروتوكول المفردة المستخدمة في نموذج البيانات الحالي. على سبيل المثال، تشير أذونات الحساب إلى واحدة معرّفات الحسابات بدون نطاق وفقًا للبروتوكول القياسي، تشير أذونات النطاق إلى معرفات النطاق `domain.dataspace`، وتشير أذونات الأصول إلى تعريف أصول واحد وفقًا للبروتوكول القياسي أو معرّفات الأصول.

عندما تفشل المعاملة بخطأ تفويض، تحقق من كلا الجانبين:

- الحساب الذي يوقع المعاملة هو الحساب الموحد المتوقع وفقًا لمعيار البروتوكول
- تم منح رمز الإذن أو الدور لمعرف الكائن الدقيق المستخدم في التعليمات
