---
translation_locale: he
translation_source: /reference/queries.md
translation_source_hash: 22e8a75acd72d066e3516ba46a0afe075d2d02790154458aec00a5d8bb861838
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# שאלות {#queries}

Iroha שאלונות קוראים את מצב ההדף מבלי לשנות אותו.
מגלה שני צורות חיפוש רחבות:

- **שאלות בודדות**, שמחזרים אובייקט אחד או ערך אחד
- **שאלות חוזרות**, אשר חוזרים על זרם או אספקה וניתן לשלב אותם
  עם סינון, סורטציה, זריקת ופרשנות דפים שבו סוג החיפוש
  תומך בו

שימוש SDK הבניינים הטייפדים או CLI במקום לבנות קופסאות חיפוש
שמות הבאים הם סוגים של בקשות הנוכחיים
`iroha_data_model::query`.

## זמן ההפעלה וההסדר {#runtime-and-configuration}

| שאלה | מטרה |
| --- | --- |
| `FindAbiVersion` | תחזיר את המוציא להורג ABI גרסה. |
| `FindExecutorDataModel` | תחזיר את תיאור דגם הנתונים של המוציא לפועל. |
| `FindParameters` | תחזיר את פרמטרי ההשפעה של המפעיל על שרשרת. |

## חשבונות ותאפשרויות {#accounts-and-permissions}

| שאלה | מטרה |
| --- | --- |
| `FindAccountById` | תמצאו חשבון אחד לפי חשבון קאנוני ID. |
| `FindAccountByAlias` | לפתור חשבון תחת השם לחשבון. |
| `FindAccounts` | רשימה של חשבונות רשומים. |
| `FindAccountIds` | רשימה חשבון רשום IDs. |
| `FindAccountsWithAsset` | רשימה של חשבונות שיש להם הגדרה נכס נתונה. |
| `FindAliasesByAccountId` | רשימה של שם כינוי קשור לחשבון. |
| `FindAccountRecoveryPolicyByAlias` | תמצא את מדיניות השיקום של שם פרטי. |
| `FindAccountRecoveryRequestByAlias` | תמצא את בקשת השיקום עבור שם פרטי. |
| `FindRoles` | רשימת תפקידים. |
| `FindRoleIds` | תפקיד רשימה IDs. |
| `FindRolesByAccountId` | רשימת תפקידים שניתנו לחשבון. |
| `FindPermissionsByAccountId` | רשימה של הרשויות שניתנו לחשבון. |

## דומנים ושותפים {#domains-and-peers}

| שאלה | מטרה |
| --- | --- |
| `FindDomainById` | מצא תחום אחד על ידי `DomainId`. |
| `FindDomains` | רשימה של דומיינים רשומים. |
| `FindDomainsByAccountId` | רשימה תחומים בבעלות חשבון. |
| `FindDomainEndorsements` | רשום רישומי אישור דומיין. |
| `FindDomainEndorsementPolicy` | תחזיר את מדיניות אישור הדומיין. |
| `FindDomainCommittee` | תחזיר את ועדת הדומיין. |
| `FindPeers` | רשימה של עמינים אמינים ידועים בספר. |

## נכסים, NFTs, ו RWAs {#assets-nfts-and-rwas}

| שאלה | מטרה |
| --- | --- |
| `FindAssets` | רשימה של סולדות נכסים. |
| `FindAssetsDefinitions` | רשימה של הגדרות נכסים. |
| `FindAssetsByAccountId` | רשימה נכסים שנחזיקו בחשבון. |
| `FindAssetById` | תמצאו סכום נכס אחד על ידי `AssetId`. |
| `FindAssetDefinitionById` | מצא הגדרה אחת של נכס על ידי ID. |
| `FindNfts` | רשימה NFTs. |
| `FindNftsByAccountId` | רשימה NFTs שייך לחשבון. |
| `FindRwas` | רשימה רשום הרבה נכסים בעולם האמיתי. |

## רישומי אבטחה וראיות {#escrow-and-proof-records}

שאילת אבטחה בודקת את הרשומות שנוצרו על ידי
[אבטחה של נכסים מקומיים ISIs](/he/blockchain/escrow.md), כולל שוק
מאבטחים, סגרות נכסים גנריות, ושישומים מאבטחים אנונימיים.

| שאלה | מטרה |
| --- | --- |
| `FindAssetEscrows` | רשום רישומי אבטחה של נכסים. |
| `FindAssetEscrowById` | תמצאו אבטחה אחת של נכסים ID. |
| `FindAssetEscrowsBySeller` | רשימה של אבטחות נכסים לפי מכר. |
| `FindAssetEscrowsByBuyer` | רשימה של אבטחות נכסים על ידי הקונה. |
| `FindAssetEscrowsByStatus` | רשימה של אבטחות נכסים לפי מצבם. |
| `FindAnonymousAssetEscrows` | רשום רישומים אנונימיים של אבטחת נכסים. |
| `FindAnonymousAssetEscrowById` | תמצאו מאבטח נכסים אנונימי אחד ID. |
| `FindAnonymousAssetEscrowsBySeller` | רשימה של מאבטחים אנונימיים לפי מוכר. |
| `FindAnonymousAssetEscrowsByBuyer` | רשימה של מאבטחים אנונימיים לפי קונה. |
| `FindAnonymousAssetEscrowsByStatus` | רשימה של אבטחות אנונימיות לפי מצבם. |
| `FindProofRecordById` | תמצאו רישום ראיות אחד על ידי ID. |
| `FindProofRecords` | רשימת רשומות ראיות. |
| `FindProofRecordsByBackend` | תאר רישומים של הוכחה עבור סיבוב ראיה. |
| `FindProofRecordsByStatus` | רשימה רשומות הוכחה לפי מצב. |

## Nexus, זמינות הנתונים והחבילות {#nexus-data-availability-and-packages}

| שאלה | מטרה |
| --- | --- |
| `FindRepoAgreements` | רשימה של הסכמי אחסון שמוצאים על שרשרת. |
| `FindTwitterBindingByHash` | לפתור קישור בטוויטר באמצעות האש. |
| `FindDaPinIntentByTicket` | תמצאו כוונה של סימן זמינות נתונים לפי כרטיס. |
| `FindDaPinIntentByManifest` | תמצא כוונה של סימן על ידי התייחסות מפורשת. |
| `FindDaPinIntentByAlias` | תמצא כוונה של סימן תחת השם. |
| `FindDaPinIntentByLaneEpochSequence` | תמצאו את כוונת הסינור לפי כיוון, תקופה ותור. |
| `FindLaneRelayEnvelopeByRef` | תמצא מעטפה מאובטחת. |
| `FindSorafsProviderOwner` | לפתור את בעל SoraFS ספקית. |
| `FindDataspaceNameOwnerById` | לפתור בעל שם חלל נתונים. |
| `FindMusubiReleaseByRef` | תמצאו Musubi שחרור בדף. |
| `FindMusubiPackageVersions` | רשימת גרסאות ל Musubi חבילה. |
| `FindMusubiPackageReleases` | רשימות שחרור עבור Musubi חבילה. |
| `FindMusubiShortAliasByName` | לפתור Musubi פרופיל קצר. |

## גורמים, חוזים, עסקאות ובלוקים {#triggers-contracts-transactions-and-blocks}

| שאלה | מטרה |
| --- | --- |
| `FindActiveTriggerIds` | רשימה תפעול פעיל IDs. |
| `FindTriggers` | רשימת גורמים. |
| `FindTriggerById` | תמצאו את ההדק. ID. |
| `FindContractManifestByCodeHash` | תמצאי מוניסטר חוזים חכמים באמצעות קוד האש. |
| `FindTransactions` | רשימה של עסקאות מחויבות. |
| `FindBlocks` | בלוקים של רשימה. |
| `FindBlockHeaders` | רשימת כותרות בלוק. |

## סינון ושידור עמודים {#filtering-and-pagination}

שאילתות משוחרות יכולות לחשוף תמיכה בעובדות ובחוררים.
פילטרים מדבקים SDK אז הכניסה של הסינון תואמת את סוג ההוצאת של החיפוש.
עבור קבוצות תוצאות גדולות, השתמשו במקום בפרמטרים של בקשת כגון קורסר וגבול
של להביא כל שורה בו זמנית.
