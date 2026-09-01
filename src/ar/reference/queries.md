---
translation_locale: ar
translation_source: /reference/queries.md
translation_source_hash: 88dba1142d7b6a452a5f56d56640ceef47a52ca28e296d6d0ee5992b9005c3bb
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# استفسارات {#queries}

Iroha الاستعلامات تقرأ حالة دفتر الأستاذ البلوكتشين دون تعديلها. نموذج البيانات الحالي يكشف عن نوعين عامين من الاستعلامات:

- استعلامات مفردة، التي تُرجع كائنًا واحدًا أو قيمة واحدة
- الاستعلامات القابلة للتكرار، والتي تُرجع تدفقًا أو مجموعة ويمكن دمجها مع التصفية والترتيب والإسقاط والتقسيم إلى صفحات حيث يدعم نوع الاستعلام ذلك

استخدم البناة من نوع SDK أو CLI بدلاً من بناء حاويات بيانات الاستعلام يدويًا. الأسماء أدناه هي أنواع الاستعلام الحالية المتاحة من قبل `iroha_data_model::query`.

## بيئة تنفيذ البرمجيات والتكوين {#runtime-and-configuration}

|استعلام|الغرض|
| --- | --- |
| `FindAbiVersion` |إرجع نسخة المنفذ ABI.|
| `FindExecutorDataModel` |إرجاع وصف نموذج بيانات المنفذ.|
| `FindParameters` |إرجاع معلمات تكوين المنفذ على السلسلة.|

## الحسابات والأذونات {#accounts-and-permissions}

|استعلام|الغرض|
| --- | --- |
| `FindAccountById` |اعثر على حساب واحد باستخدام معرف حساب قياسي لبروتوكول مفرد.|
| `FindAccountByAlias` |حل اسم الحساب المستعار إلى حساب.|
| `FindAccounts` |قم بعرض الحسابات المسجلة.|
| `FindAccountIds` |قائمة معرفات الحسابات المسجلة.|
| `FindAccountsWithAsset` |قائمة الحسابات التي تمتلك تعريف الأصل المحدد.|
| `FindAliasesByAccountId` |عرض الأسماء المستعارة المرتبطة بحساب.|
| `FindAccountRecoveryPolicyByAlias` |ابحث عن سياسة الاسترداد لاسم مستعار.|
| `FindAccountRecoveryRequestByAlias` |ابحث عن طلب الاسترداد لاسم مستعار.|
| `FindRoles` |قائمة الأدوار.|
| `FindRoleIds` |قم بسرد معرفات الأدوار.|
| `FindRolesByAccountId` |عرض الأدوار الممنوحة لحساب.|
| `FindPermissionsByAccountId` |عرض الأذونات الممنوحة لحساب.|

## النطاقات ونظائر الشبكة {#domains-and-peers}

|استعلام|الغرض|
| --- | --- |
| `FindDomainById` |ابحث عن نطاق واحد بواسطة `DomainId`.|
| `FindDomains` |قم بسرد النطاقات المسجلة.|
| `FindDomainsByAccountId` |قائمة المجالات التي يمتلكها الحساب.|
| `FindDomainEndorsements` |قائمة سجلات تأييد المجال.|
| `FindDomainEndorsementPolicy` |أعد سياسة تأييد المجال.|
| `FindDomainCommittee` |أعد لجنة المجال.|
| `FindPeers` |قائمة بالأقران الموثوقين في الشبكة المعروفين لدى دفتر الأستاذ الخاص بالبلوكشين.|

## الأصول، NFTs، و RWAs {#assets-nfts-and-rwas}

|استعلام|الغرض|
| --- | --- |
| `FindAssets` |قم بسرد أرصدة الأصول.|
| `FindAssetsDefinitions` |قم بسرد تعريفات الأصول.|
| `FindAssetsByAccountId` |قائمة الأصول المحتفظ بها بواسطة حساب.|
| `FindAssetById` |اعثر على رصيد أحد الأصول بواسطة `AssetId`.|
| `FindAssetDefinitionById` |ابحث عن تعريف أصل واحد بالمعرّف.|
| `FindNfts` |قائمة NFTs.|
| `FindNftsByAccountId` |قائمة NFTs المملوكة بواسطة حساب.|
| `FindRwas` |عرض قوائم الأصول الحقيقية المسجلة.|

## سجلات الحساب الضماني والإثبات {#escrow-and-proof-records}

تستعرض استفسارات الضمان السجلات التي أنشأها [الضمان للأصل المحلي ISIs](/ar/blockchain/escrow.md)، بما في ذلك ضمانات السوق، وتأمينات الأصول العامة، وسجلات الضمان المجهولة.

|استعلام|الغرض|
| --- | --- |
| `FindAssetEscrows` |قائمة سجلات الضمان للأصول.|
| `FindAssetEscrowById` |ابحث عن ضمانة أصل واحدة بواسطة المعرف.|
| `FindAssetEscrowsBySeller` |قائمة الضمانات المالية للأصول حسب البائع.|
| `FindAssetEscrowsByBuyer` |قائمة الضمانات المالية للأصول حسب المشتري.|
| `FindAssetEscrowsByStatus` |قائمة الضمانات المالية للأصول حسب الحالة.|
| `FindAnonymousAssetEscrows` |عرض سجلات الضمان للأصول المجهولة|
| `FindAnonymousAssetEscrowById` |ابحث عن حساب ضمان أصول مجهول واحد بواسطة المعرف.|
| `FindAnonymousAssetEscrowsBySeller` |قائمة الضمانات المجهولة حسب البائع.|
| `FindAnonymousAssetEscrowsByBuyer` |قائمة الضمانات المجهولة حسب المشتري.|
| `FindAnonymousAssetEscrowsByStatus` |قائمة الضمانات المجهولة حسب الحالة.|
| `FindProofRecordById` |ابحث عن سجل إثبات واحد بواسطة المعرف.|
| `FindProofRecords` |قم بسرد سجلات الإثبات.|
| `FindProofRecordsByBackend` |عرض سجلات الإثبات لنظام إثبات خلفي.|
| `FindProofRecordsByStatus` |عرض سجلات الإثبات حسب الحالة.|

## Nexus، توفر البيانات، والحزم {#nexus-data-availability-and-packages}

|استعلام|الغرض|
| --- | --- |
| `FindRepoAgreements` |قائمة اتفاقيات المستودع المخزنة على السلسلة.|
| `FindTwitterBindingByHash` |حل ربط تويتر بواسطة التجزئة التشفيرية.|
| `FindDaPinIntentByTicket` |ابحث عن نية تثبيت توفر البيانات بواسطة التذكرة.|
| `FindDaPinIntentByManifest` |ابحث عن نية الدبوس عن طريق مرجع المانيفست الفني.|
| `FindDaPinIntentByAlias` |ابحث عن نية دبوس بواسطة الاسم المستعار.|
| `FindDaPinIntentByLaneEpochSequence` |ابحث عن نية دبوس حسب مسار التنفيذ والعصر والتسلسل.|
| `FindLaneRelayEnvelopeByRef` |ابحث عن حاوية بيانات تبديل الممرات الموثوقة.|
| `FindSorafsProviderOwner` |حل صاحب مزود SoraFS.|
| `FindDataspaceNameOwnerById` |حل مالك اسم مساحة البيانات.|
| `FindMusubiExactPackageV1` |اقرأ سجل حزمة واحد بالضبط ومراجعاته الحالية.|
| `FindMusubiExactReleaseV1` |اقرأ لقطة إصدار واحدة بالضبط.|
| `FindMusubiProviderBundleAttestationV1` |اقرأ تصريح حزمة الأرشيف لمزود واحد.|
| `FindMusubiResolverIndexV1` |صفحة فهرس المحلل النهائي.|
| `FindMusubiVersionsV1` |نسخ الصفحات النهائية لحزمة واحدة.|
| `FindMusubiMaintainersV1` |الصفحة تعرض المطوّرين المعتمدين والدعوات المعلقة.|
| `FindMusubiArchiveLocationsV1` |تم الانتهاء من الصفحة SoraFS للمواقع لأرشيف واحد.|
| `FindMusubiArchiveRetentionV1` |سجلات أرشيف الاحتفاظ بالصفحات.|
| `FindMusubiAliasV1` |اقرأ الهدف الحالي والمراجعة لاسم مستعار عالمي.|
| `FindMusubiAliasHistoryV1` |صفح السجل غير القابل للتغيير لإعادة الاستهداف لاسم مستعار عالمي.|
| `FindMusubiOrderedPrefixV1` |تجميع الصفحات تحت بادئة هيكلية مرتبة واحدة.|

## المحفزات، العقود، المعاملات، والكتل {#triggers-contracts-transactions-and-blocks}

|استعلام|الغرض|
| --- | --- |
| `FindActiveTriggerIds` |قائمة معرفات المشغلات النشطة.|
| `FindTriggers` |قائمة المحفزات.|
| `FindTriggerById` |اعثر على مشغل واحد بواسطة المعرف.|
| `FindContractManifestByCodeHash` |ابحث عن تصريح تقني للعقد الذكي بواسطة تجزئة تشفيرية للكود.|
| `FindTransactions` |قم بسرد المعاملات النهائية.|
| `FindBlocks` |قائمة الكتل.|
| `FindBlockHeaders` |قم بسرد رؤوس الكتل.|

## التصفية والتقسيم الصفحي {#filtering-and-pagination}

يمكن أن تكشف الاستعلامات القابلة للتكرار عن دعم المحدد والاختيار. استخدم المرشحات المحددة بالنوع الخاصة بالاستعلام من SDK بحيث تتطابق إدخالات المرشح مع نوع إخراج الاستعلام. بالنسبة لمجموعات النتائج الكبيرة، استخدم معلمات الاستعلام مثل المؤشر والحد بدلًا من جلب كل صف مرة واحدة.
