---
translation_locale: ar
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# رموز الإذن {#permission-tokens}

هذه الصفحة تدرج أنواع الإذن الاختيارية الافتراضية المعروضة من قبل الحالي
Iroha نموذج البيانات التنفيذية. للدليل المفاهيمي للأدوار والإذن،
انظر [الإذن](/ar/blockchain/permissions.md).

يتم إجراء عمليات التحقق من الإذن بواسطة مؤكدة وقت تشغيل نشط.
الأسماء أدناه تصف سطح السياسة القياسية، ولكن الشبكة يمكن تخصيص
التحقق من وقت تشغيل عن طريق تحديث المنفذ.

## رموز افتراضية {#default-tokens}

| رمز الإذن | الفئة | العملية |
| --- | --- | --- |
| `CanManagePeers` | الأقران | التسجيل أو عدم التسجيل، أو إدارة أقرانه بطريقة أخرى. |
| `CanManageLaneRelayEmergency` | الأقران | إدارة التحكمات الطارئة. |
| `CanRegisterDomain` | النطاق | سجل النطاق |
| `CanUnregisterDomain` | النطاق | إلغاء تسجيل النطاق |
| `CanModifyDomainMetadata` | النطاق | تعديل بيانات المجال |
| `CanRegisterAccount` | الحساب | قم بتسجيل حساب |
| `CanUnregisterAccount` | الحساب | لا تسجيل الحساب |
| `CanModifyAccountMetadata` | الحساب | تعديل بيانات حساب |
| `CanUnregisterAssetDefinition` | تعريف الأصول | إلغاء تسجيل تعريف الأصول |
| `CanModifyAssetDefinitionMetadata` | تعريف الأصول | تعديل البيانات المعدنية لتحديد الأصول |
| `CanMintAssetWithDefinition` | الأصول | أصول النقود لتحديد محدد. |
| `CanBurnAssetWithDefinition` | الأصول | حرق الأصول لتحديد محدد |
| `CanTransferAssetWithDefinition` | الأصول | تحويل الأصول لتعريف محدد. |
| `CanMintAsset` | الأصول | صوّر رصيد خاص للأصول |
| `CanBurnAsset` | الأصول | احرق رصيد أصول محدد |
| `CanTransferAsset` | الأصول | تحويل رصيد خاص للأصول |
| `CanRegisterNft` | NFT | تسجيل NFT. |
| `CanUnregisterNft` | NFT | إزالة تسجيل NFT. |
| `CanTransferNft` | NFT | تحويل NFT. |
| `CanModifyNftMetadata` | NFT | تعديل NFT البيانات المتعددة |
| `CanSetParameters` | المعايير | تعيين معايير تشكيل السلسلة. |
| `CanManageRoles` | الأدوار | تسجيل أو إلغاء التسجيل أو منح أو إلغائها |
| `CanRegisterTrigger` | محفز | سجل الزناد. |
| `CanExecuteTrigger` | محفز | أطلق النار |
| `CanUnregisterTrigger` | محفز | لا تسجيل الزناد. |
| `CanModifyTrigger` | محفز | تعديل تشكيل الزناد |
| `CanModifyTriggerMetadata` | محفز | تعديل بيانات البيانات |
| `CanUpgradeExecutor` | الجهة التنفيذية | قم بتحديث جهاز تنفيذ وقت التشغيل |
| `CanRegisterSmartContractCode` | العقد الذكي | سجل رمز العقد الذكي. |
| `CanUseFeeSponsor` | Nexus | الرسوم Nexus الرسوم إلى حساب راعي محدد. |

## الملكية {#ownership}

يجب أن تشير رموز الإذن الحساسة للمالك إلى الكائن القنوني IDs المستخدمة
على سبيل المثال، تُشار الإذنات الحسابية إلى
حساب بدون نطاق IDs, تصاريح النطاق تشير إلى `domain.dataspace` النطاق
IDs, وتشير تصاريح الأصول إلى تعريف الأصول القنوني أو الأصول IDs.

عندما تفشل المعاملة بسبب خطأ في الإذن، تحقق من كلا الجانبين:

- الحساب الذي يوقع على المعاملة هو الحساب القنوني المتوقع
- تم منح رمز أو دور الإذن للشيء الدقيق ID المستخدمة في
  التعليمات
