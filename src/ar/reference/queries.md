---
translation_locale: ar
translation_source: /reference/queries.md
translation_source_hash: 22e8a75acd72d066e3516ba46a0afe075d2d02790154458aec00a5d8bb861838
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# الأسئلة {#queries}

Iroha استفسارات تقرأ حالة الكتيب دون تغييرها
يعرض شكلين واسعين من أشكال الاستفسار:

- **أسئلة فردية**, التي تعيد كائن واحد أو قيمة واحدة
- **استفسارات قابلة للتكرار**, التي تعيد تدفق أو جمع ويمكن دمجها
  مع تصفية، فرز، عرض، وتصفيف صفحة حيث نوع الاستفسار
  يدعمها

الاستخدام SDK البناء المخطط أو CLI بدلاً من بناء غلافات الاستفسارات
الأسماء أدناه هي أنواع الاستفسارات الحالية المعروضة من قبل
`iroha_data_model::query`.

## وقت التشغيل والترتيب {#runtime-and-configuration}

| السؤال | الغرض |
| --- | --- |
| `FindAbiVersion` | أعيد المُجرم ABI الإصدار |
| `FindExecutorDataModel` | أعيد وصف نموذج البيانات التنفيذية. |
| `FindParameters` | عودة معايير تشكيل تنفيذ السلسلة. |

## الحسابات والإذن {#accounts-and-permissions}

| السؤال | الغرض |
| --- | --- |
| `FindAccountById` | العثور على رواية واحدة حسب الحسابات القنونية ID. |
| `FindAccountByAlias` | حل حساب مستعار للحساب. |
| `FindAccounts` | إدراج الحسابات المسجلة |
| `FindAccountIds` | قائمة الحساب المسجل IDs. |
| `FindAccountsWithAsset` | إدراج حسابات تحتوي على تعريف خاص للأصول. |
| `FindAliasesByAccountId` | إدراج أسماء مستعار مرتبطة بحساب |
| `FindAccountRecoveryPolicyByAlias` | ابحث عن سياسة استرداد لـ (أليكس) |
| `FindAccountRecoveryRequestByAlias` | ابحث عن طلب استرداد لـ"هوية مستعارة". |
| `FindRoles` | قائمة الأدوار. |
| `FindRoleIds` | دور القائمة IDs. |
| `FindRolesByAccountId` | قائمة الأدوار الممنوحة لحساب. |
| `FindPermissionsByAccountId` | إدراج الإذنات الممنوحة لحساب. |

## النطاقات و الأقران {#domains-and-peers}

| السؤال | الغرض |
| --- | --- |
| `FindDomainById` | ابحث عن نطاق واحد من خلال `DomainId`. |
| `FindDomains` | إدراج الأسماء المسجلة. |
| `FindDomainsByAccountId` | قم بإدراج النطاقات المملوكة لحساب |
| `FindDomainEndorsements` | قم بإدراج سجلات إقرار المجال |
| `FindDomainEndorsementPolicy` | أعد سياسة تأييد النطاق |
| `FindDomainCommittee` | أعيد لجنة المجال |
| `FindPeers` | إدراج أقرانهم الموثوقين الذين يعرفهم الكتاب الرئيسي |

## الأصول NFTs, و RWAs {#assets-nfts-and-rwas}

| السؤال | الغرض |
| --- | --- |
| `FindAssets` | إدراج رصيد الأصول |
| `FindAssetsDefinitions` | إدراج تعريفات الأصول |
| `FindAssetsByAccountId` | إدراج الأصول التي تحتفظ بها الحساب. |
| `FindAssetById` | العثور على رصيد واحد من الأصول `AssetId`. |
| `FindAssetDefinitionById` | ابحث عن تعريف واحد للأصول ID. |
| `FindNfts` | القائمة NFTs. |
| `FindNftsByAccountId` | القائمة NFTs تمتلك حساباً |
| `FindRwas` | القائمة تسجل الكثير من الأصول الحقيقية. |

## سجلات الاحتفاظ بالأموال والدليل {#escrow-and-proof-records}

استفسارات الاحتفاظ بفحص السجلات التي تم إنشاؤها بواسطة
[الاحتفاظ بالأصول الأصلية ISIs](/ar/blockchain/escrow.md), بما في ذلك السوق
الاحتفاظ، قفل الأصول العامة، و سجلات الاحتفاض المجهول.

| السؤال | الغرض |
| --- | --- |
| `FindAssetEscrows` | قم بإدراج سجلات الاحتفاظ بالأصول |
| `FindAssetEscrowById` | إبحث عن أحد الأصول الاحتفاظ بها ID. |
| `FindAssetEscrowsBySeller` | إدراج الاحتفاظ بالأصول حسب البائع. |
| `FindAssetEscrowsByBuyer` | إدراج الاحتفاظ بالأصول حسب المشتري |
| `FindAssetEscrowsByStatus` | قم بإدراج الاحتفاظ بالأصول حسب الحالة. |
| `FindAnonymousAssetEscrows` | قم بإعداد سجلات الاحتفاظ بالأصول المجهولة |
| `FindAnonymousAssetEscrowById` | إبحث عن أحد الأصول المحتفظة مجهولة ID. |
| `FindAnonymousAssetEscrowsBySeller` | إدراج الاحتياطيات المجهولة حسب البائع |
| `FindAnonymousAssetEscrowsByBuyer` | إدراج الاحتفاظات المجهولة حسب المشتري. |
| `FindAnonymousAssetEscrowsByStatus` | قم بإدراج الاحتياطيات المجهولة حسب الحالة. |
| `FindProofRecordById` | ابحث عن سجل دليل واحد ID. |
| `FindProofRecords` | أكتب سجلات الدليل |
| `FindProofRecordsByBackend` | قم بإدراج سجلات إثبات لإعطاء مؤخرة إثبات. |
| `FindProofRecordsByStatus` | قم بإدراج سجلات الإثبات حسب الحالة |

## Nexus, توافر البيانات والحزم {#nexus-data-availability-and-packages}

| السؤال | الغرض |
| --- | --- |
| `FindRepoAgreements` | إدراج اتفاقات مخزن تخزين على سلسلة. |
| `FindTwitterBindingByHash` | حلّ التوثيق على تويتر بواسطة الهيش. |
| `FindDaPinIntentByTicket` | ابحث عن مقصود البيانات المتاحة بالبطاقة |
| `FindDaPinIntentByManifest` | ابحث عن مقصود اللوحة من خلال الإشارة المعلنة |
| `FindDaPinIntentByAlias` | ابحث عن نية اللوحة باسم مستعار |
| `FindDaPinIntentByLaneEpochSequence` | ابحث عن مقصود الرمز حسب المسار والعصر والترتيب |
| `FindLaneRelayEnvelopeByRef` | ابحث عن ملف موثّق |
| `FindSorafsProviderOwner` | الحل مالك SoraFS المزود |
| `FindDataspaceNameOwnerById` | تحل مالك مساحة البيانات |
| `FindMusubiReleaseByRef` | إبحث عن Musubi الإفراج عن طريق الإشارة. |
| `FindMusubiPackageVersions` | إصدارات قائمة ل Musubi الحزمة |
| `FindMusubiPackageReleases` | إصدارات القائمة Musubi الحزمة |
| `FindMusubiShortAliasByName` | الحل Musubi مستعار قصير |

## أسباب الإطلاق والعقود والمعاملات والحواجز {#triggers-contracts-transactions-and-blocks}

| السؤال | الغرض |
| --- | --- |
| `FindActiveTriggerIds` | إدراج الزناد النشط IDs. |
| `FindTriggers` | قائمة محفزات. |
| `FindTriggerById` | إبحث عن أحد الزنادات ID. |
| `FindContractManifestByCodeHash` | إبحث عن مذكرة عقد ذكية بواسطة رمز "هاشش" |
| `FindTransactions` | قائمة المعاملات الملتزمة. |
| `FindBlocks` | كتلة قائمة. |
| `FindBlockHeaders` | قم بإدراج رؤوس الكتل |

## الفلتر والصفحات {#filtering-and-pagination}

الاستفسارات المتكررة يمكن أن تعرض دعم المواعظ والمتحركات. استخدم استفسار محدد
الصفائح المطبوعة من SDK لذا فإن مدخل المرشح يطابق نوع إصدار الاستطلاع.
بالنسبة لمجموعات النتائج الكبيرة، استخدم معايير الاستفسار مثل المؤشر والحد بدلاً من ذلك
من جلب كل صف في وقت واحد.
