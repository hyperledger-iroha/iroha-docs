---
translation_locale: ar
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# رموز الإذن {#permission-tokens}

وتعرض هذه الصفحة أنواع الإجازات الافتراضية التي تعرض لها نموذج بيانات تنفيذ Iroha الحالي. للحصول على الدليل الفكري للأدوار والإذن، انظر [الإجازات](/ar/blockchain/permissions.md).

يتم إجراء عمليات التحقق من الإذن بواسطة مؤكّد وقت التشغيل النشط. وتصف أسماء أنواع الوهم أدناه سطح السياسة القياسية، ولكن يمكن لشبكة تخصيص تأكييد الوقت التشغيلي عن طريق تحديث المنفذ.

## رموز الافتراضية {#default-tokens}

|إشارة الإذن|الفئة |العملية|
| --- | --- | --- |
|`CanManagePeers` |الزملاء|التسجيل أو عدم التسجيل، أو إدارة الأقران بطريقة أخرى. |
|`CanManageLaneRelayEmergency` |الزملاء|إدارة التحكمات الطارئة. |
|`CanRegisterDomain` |النطاق |سجل النطاق.|
|`CanUnregisterDomain` |النطاق |إلغاء تسجيل النطاق.|
|`CanModifyDomainMetadata` |النطاق |تعديل بيانات المجال. |
|`CanRegisterAccount` |الحساب |سجل حساباً|
|`CanUnregisterAccount` |الحساب |لا تسجيل حساب. |
|`CanModifyAccountMetadata` |الحساب |تعديل بيانات حساب. |
|`CanUnregisterAssetDefinition` |تعريف الأصول |إلغاء تسجيل تعريف الأصول|
|`CanModifyAssetDefinitionMetadata` |تعريف الأصول |تعديل البيانات الأساسية لتحديد الأصول|
|`CanMintAssetWithDefinition` |الأصول |أصول النقود من أجل تعريف محدد. |
|`CanBurnAssetWithDefinition` |الأصول |حرق الأصول لتحديد محدد|
|`CanTransferAssetWithDefinition` |الأصول |تحويل الأصول لتحديد محدد. |
|`CanMintAsset` |الأصول |وضع ميزان خاص للأصول.|
|`CanBurnAsset` |الأصول |احرق ميزان أصول محدد|
|`CanTransferAsset` |الأصول |تحويل ميزان أصول محدد |
|`CanRegisterNft` |NFT |سجل NFT. |
|`CanUnregisterNft` |NFT |لا تسجيل NFT. |
|`CanTransferNft` |NFT |تحويل NFT. |
|`CanModifyNftMetadata` |NFT |تعديل NFT البيانات المعدنية. |
|`CanSetParameters` |المعلمات |حدد معايير تشكيل السلسلة. |
|`CanManageRoles` |الأدوار |تسجيل، إلغاء التسجيل، منح، أو إلغاء الأدوار.|
|`CanRegisterTrigger` |المحفز |سجل الزناد.|
|`CanExecuteTrigger` |المحفز |أطلق النار.|
|`CanUnregisterTrigger` |المحفز|إزالة تسجيل الزناد|
|`CanModifyTrigger` |المحفز|تعديل تشكيل الزناد|
|`CanModifyTriggerMetadata` |المحفز|قم بتعديل بيانات البيانات المثبتة|
|`CanUpgradeExecutor` |المُجرم |قم بتحديث جهاز تنفيذ وقت التشغيل|
|`CanRegisterSmartContractCode` |عقد ذكي |سجل رمز العقد الذكي. |
|`CanUseFeeSponsor` |Nexus |فرض رسوم Nexus على حساب الراعي المحدد. |

## الملكية {#ownership}

يجب أن تشير رموز الإذن الحساسة للمالك إلى الكائن الكنسي IDs المستخدمة من قبل نموذج البيانات الحالي. على سبيل المثال ، تشير الإذن للحسابات إلى حساب قائدي بدون نطاق. IDs, تصريحات النطاق تشير إلى `domain.dataspace` النطاق IDs, وتشير تصاريح الأصول إلى تعريف الأصول القنوني أو الأصول IDs.

عندما تفشل المعاملة بسبب خطأ في الإذن، تحقق من كلا الجانبين:

- الحساب الذي يوقع على المعاملة هو الحساب الكنسي المتوقع
- تم منح رمز الإذن أو الدور للكائن الدقيق ID المستخدم في التعليمات.
