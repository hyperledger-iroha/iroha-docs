---
translation_locale: ar
translation_source: /reference/queries.md
translation_source_hash: 88dba1142d7b6a452a5f56d56640ceef47a52ca28e296d6d0ee5992b9005c3bb
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# الأسئلة {#queries}

يقرأ استفسارات Iroha حالة دفتر التسجيل دون تغييرها. يعرض نموذج البيانات الحالي شكلين واسعين من استفسارات:

- الأسئلة الفردية، التي تعود على كائن واحد أو قيمة واحدة
- استفسارات قابلة للتكرار ، والتي تعيد تدفق أو مجموعة ويمكن دمجها مع التصفية والتقسيم والتنبيه والصفحات حيث يدعم نوع الاستفسار ذلك

استخدم SDK صانعي النمط أو CLI بدلاً من بناء غلافات الاستفسارات يدوياً. الأسماء أدناه هي أنواع الاستفسارات الحالية المعروضة عن طريق `iroha_data_model::query`.

## وقت التشغيل والترتيب {#runtime-and-configuration}

|السؤال|الغرض|
| --- | --- |
|`FindAbiVersion` |إرجاع نسخة ABI. |
|`FindExecutorDataModel` |أعيد وصف نموذج البيانات التنفيذية. |
|`FindParameters` |إرجاع معايير تشكيل تنفيذ السلسلة. |

## الحسابات والإذن {#accounts-and-permissions}

|السؤال|الغرض|
| --- | --- |
|`FindAccountById` |العثور على حساب واحد حسب الحساب الكنسي ID. |
|`FindAccountByAlias` |حل حساب مستعار لحساب.|
|`FindAccounts` |إدراج حسابات مسجلة |
|`FindAccountIds` |القائمة الحساب المسجل IDs. |
|`FindAccountsWithAsset` |إدراج حسابات تحتوي على تعريف خاص للأصول. |
|`FindAliasesByAccountId` |إدراج أسماء مستعار مرتبطة بحساب |
|`FindAccountRecoveryPolicyByAlias` |ابحثي عن سياسة استرداد لـ (أليف)|
|`FindAccountRecoveryRequestByAlias` |ابحث عن طلب استرداد اسم مستعار.|
|`FindRoles` |قائمة الأدوار. |
|`FindRoleIds` |دور القائمة IDs. |
|`FindRolesByAccountId` |قائمة الأدوار الممنوحة لحساب. |
|`FindPermissionsByAccountId` |قائمة الإذن الممنوحة لحساب. |

## النطاقات و الأقران {#domains-and-peers}

|السؤال|الغرض|
| --- | --- |
|`FindDomainById` |إبحث عن نطاق واحد بواسطة `DomainId`. |
|`FindDomains` |إدراج الأسماء المسجلة. |
|`FindDomainsByAccountId` |إدراج الأسماء المملوكة لحساب. |
|`FindDomainEndorsements` |إدراج سجلات دعم النطاقات|
|`FindDomainEndorsementPolicy` |أعد سياسة تأييد النطاق|
|`FindDomainCommittee` |أعد لجنة النطاق|
|`FindPeers` |إدراج أقرانهم الموثوقين المعروفين في دفتر التسجيل. |

## الأصول، NFTs، و RWAs {#assets-nfts-and-rwas}

|السؤال|الغرض|
| --- | --- |
|`FindAssets` |إدراج رصيد الأصول |
|`FindAssetsDefinitions` |إدراج تعريفات الأصول |
|`FindAssetsByAccountId` |إدراج الأصول التي تمتلكها حساب. |
|`FindAssetById` |العثور على رصيد واحد من الأصول بحلول `AssetId`. |
|`FindAssetDefinitionById` |العثور على تعريف واحد للأصول بواسطة ID. |
|`FindNfts` |قائمة NFTs. |
|`FindNftsByAccountId` |قائمة NFTs تمتلكها حساب. |
|`FindRwas` |القائمة مسجلة الكثير من الأصول الحقيقية.|

## سجلات الاحتفاظ بالأموال والأدلة {#escrow-and-proof-records}

استفسارات الاحتفاظ بفحص السجلات التي تم إنشاؤها من قبل [مصادر الأصول المحلية الاحتفالية ISIs](/ar/blockchain/escrow.md)، بما في ذلك الاحتفاضات في الأسواق، وقفلات الأصول العامة، وسجلات الاحتفاذ المجهول.

|السؤال|الغرض|
| --- | --- |
|`FindAssetEscrows` |إدراج سجلات الاحتفاظ بالأصول.|
|`FindAssetEscrowById` |العثور على واحد من الاحتفاظ بالأصول بحلول ID. |
|`FindAssetEscrowsBySeller` |إدراج الاحتفاظ بالأصول حسب البائع. |
|`FindAssetEscrowsByBuyer` |إدراج الاحتفاظ بالأصول حسب المشتري. |
|`FindAssetEscrowsByStatus` |إدراج الاحتفاظ بالأصول حسب الحالة. |
|`FindAnonymousAssetEscrows` |قم بإدراج سجلات الاحتفاظ بالأصول المجهولة|
|`FindAnonymousAssetEscrowById` |العثور على أحد الأصول الاحتياطية المجهولة من قبل ID. |
|`FindAnonymousAssetEscrowsBySeller` |إدراج الاحتياطيات المجهولة حسب البائع. |
|`FindAnonymousAssetEscrowsByBuyer` |إدراج الاحتياطيات المجهولة حسب المشتري.|
|`FindAnonymousAssetEscrowsByStatus` |إدراج الاحتياطيات المجهولة حسب الحالة. |
|`FindProofRecordById` |العثور على سجل دليل واحد من قبل ID. |
|`FindProofRecords` |قم بإدراج سجلات الدليل|
|`FindProofRecordsByBackend` |قم بإدراج سجلات إثبات لخلفية دليل. |
|`FindProofRecordsByStatus` |إدراج سجلات الدليل حسب الحالة. |

## Nexus ، توافر البيانات، والحزم {#nexus-data-availability-and-packages}

|السؤال|الغرض|
| --- | --- |
|`FindRepoAgreements` |إدراج اتفاقات مخزن تخزين على سلسلة. |
|`FindTwitterBindingByHash` |حل الارتباطات على تويتر بواسطة الهاش|
|`FindDaPinIntentByTicket` |العثور على نية البيانات المتاحة عن طريق التذكرة. |
|`FindDaPinIntentByManifest` |ابحث عن نية اللوحة من خلال إشارة واضحة. |
|`FindDaPinIntentByAlias` |ابحث عن مقصود من قبل مستعار|
|`FindDaPinIntentByLaneEpochSequence` |ابحث عن مقصود اللوحة حسب المسار، العصر، والترتيب|
|`FindLaneRelayEnvelopeByRef` |ابحث عن غطاء مُحقق.|
|`FindSorafsProviderOwner` |تحل مالك مقدم SoraFS |
|`FindDataspaceNameOwnerById` |حل مالك مساحة بيانات اسم. |
|`FindMusubiExactPackageV1` |اقرأ سجل الحزمة المحددة ومراجعاتها الحالية. |
|`FindMusubiExactReleaseV1` |اقرأ صورة واحدة دقيقة|
|`FindMusubiProviderBundleAttestationV1` |اقرأ شهادة مجموعة الأرشيف من مقدم واحد. |
|`FindMusubiResolverIndexV1` |صفحة مؤشر حل النهائي. |
|`FindMusubiVersionsV1` |الصفحة الإصدارات النهائية لحزمة واحدة. |
|`FindMusubiMaintainersV1` |الصفحة قبلت الحفاظ والدعوات المنتظرة. |
|`FindMusubiArchiveLocationsV1` |الصفحة النهائية SoraFS المواقع لمؤلف واحد. |
|`FindMusubiArchiveRetentionV1` |صفحة سجلات الاحتفاظ بالأرشيف |
|`FindMusubiAliasV1` |اقرأ الهدف الحالي ومراجعة الاسم العالمي |
|`FindMusubiAliasHistoryV1` |صفحة تاريخ إعادة الهدف غير المتغير من مستعار عالمي. |
|`FindMusubiOrderedPrefixV1` |حزم الصفحات تحت إضافة هيكلية واحدة مرتبة. |

## المحفزات والعقود والمعاملات والحواجز {#triggers-contracts-transactions-and-blocks}

|السؤال|الغرض|
| --- | --- |
|`FindActiveTriggerIds` |إدراج الزناد النشط IDs. |
|`FindTriggers` |قائمة محفزات. |
|`FindTriggerById` |ابحث عن محفز واحد بحلول ID. |
|`FindContractManifestByCodeHash` |ابحث عن مذكرة عقود ذكية بواسطة رمز "هاشش"|
|`FindTransactions` |قائمة المعاملات الملتزمة. |
|`FindBlocks` |كتلة قائمة.|
|`FindBlockHeaders` |إدراج عناوين كتلة.|

## الفلتر والصفحات {#filtering-and-pagination}

استفسارات قابلة للتكرار يمكن أن تعرض دعم المواعيد والمتحركات. استخدم مرشحات نمطية محددة للمسألة من SDK بحيث يتناسب مدخل المرشح مع نوع خروج المسألة. بالنسبة لمجموعات النتائج الكبيرة ، استخدم معايير المسؤلة مثل المؤشر والحد بدلاً من الحصول على كل سطر في وقت واحد
