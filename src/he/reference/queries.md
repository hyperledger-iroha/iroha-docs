---
translation_locale: he
translation_source: /reference/queries.md
translation_source_hash: 88dba1142d7b6a452a5f56d56640ceef47a52ca28e296d6d0ee5992b9005c3bb
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# שאילתות {#queries}

דרישות Iroha קוראים את מצב הספר הגדול ללא שינוי בו. מודל הנתונים הנוכחי חושף שני צורות חיפוש רחבות:

- **שאילתות יחידניות**, המחזירות אובייקט אחד או ערך אחד
- **שאילתות איטרטיביות**, המחזירות זרם או אוסף ואפשר לשלב אותן עם סינון, מיון, projection ועימוד כאשר סוג השאילתה תומך בכך

השתמשו בבוני SDK בעלי טיפוס או ב־CLI במקום להרכיב מעטפות שאילתה ידנית. השמות להלן הם טיפוסי השאילתה הנוכחיים מתוך `iroha_data_model::query`.

## זמן ההפעלה וההסדר {#runtime-and-configuration}

|שאילתה |מטרה.|
| --- | --- |
|`FindAbiVersion` |תחזירו את הגרסה של ABI. |
|`FindExecutorDataModel` |תחזיר את תיאור דגם הנתונים של המוציא לפועל. |
|`FindParameters` |להחזיר את פרמטרי ההסדר של המפעיל על שרשרת. |

## חשבונות ורישיון {#accounts-and-permissions}

|שאילתה |מטרה.|
| --- | --- |
|`FindAccountById` |תמצא חשבון אחד לפי חשבון קנוני ID. |
|`FindAccountByAlias` |לפתור חשבון בשם חשבון. |
|`FindAccounts` |רשימה של חשבונות רשומים. |
|`FindAccountIds` |רשימה חשבון רשום IDs. |
|`FindAccountsWithAsset` |רשימה של חשבונות שיש להם תיאור נכס מסוים. |
|`FindAliasesByAccountId` |רשימה של שם כינוי קשור לחשבון. |
|`FindAccountRecoveryPolicyByAlias` |תמצא את מדיניות השיקום של שם פרטי. |
|`FindAccountRecoveryRequestByAlias` |תמצא את בקשת השיקום עבור שם פרטי. |
|`FindRoles` |רשימת תפקידים.|
|`FindRoleIds` |תפקיד רשימה IDs. |
|`FindRolesByAccountId` |רשימה של תפקידים שניתנו לחשבון. |
|`FindPermissionsByAccountId` |רשימה של הרשויות שניתנו לחשבון. |

## דומיינים וצמתים {#domains-and-peers}

|שאילתה |מטרה.|
| --- | --- |
|`FindDomainById` |תמצא תחום אחד ב `DomainId`. |
|`FindDomains` |רשימה של תחומים רשומים. |
|`FindDomainsByAccountId` |רשימה דומנים בבעלות חשבון. |
|`FindDomainEndorsements` |רשום רישומי אישור תחום. |
|`FindDomainEndorsementPolicy` |תחזיר את מדיניות אישור הדומיין. |
|`FindDomainCommittee` |תחזיר את ועדת הדומיין.|
|`FindPeers` |רשימה של צמתים אמינים ידועים בספר. |

## נכסים, NFTs, ו RWAs {#assets-nfts-and-rwas}

|שאילתה |מטרה.|
| --- | --- |
|`FindAssets` |רשימה של סולציות נכסים. |
|`FindAssetsDefinitions` |רשימה של הגדרות נכסים. |
|`FindAssetsByAccountId` |רשימה של נכסים שנחזיקו בחשבון. |
|`FindAssetById` |מצא סכום נכס אחד על ידי `AssetId`. |
|`FindAssetDefinitionById` |מצא הגדרה אחת של נכס על ידי ID. |
|`FindNfts` |רשימה NFTs. |
|`FindNftsByAccountId` |רשימה NFTs בבעלות חשבון. |
|`FindRwas` |רשימה רשומה של נכסים אמיתיים. |

## רשומות נאמנות והוכחה {#escrow-and-proof-records}

שאילתות נאמנות בודקות את הרשומות שנוצרו על ידי [ה־ISIs של נאמנות מובנית לנכסים](/he/blockchain/escrow.md), ובהן נאמנויות של זירת מסחר, נעילות נכסים כלליות ורשומות נאמנות אנונימיות.

|שאילתה |מטרה.|
| --- | --- |
|`FindAssetEscrows` |מציג רשומות נאמנות לנכסים. |
|`FindAssetEscrowById` |מוצא נאמנות נכסים אחת לפי ID. |
|`FindAssetEscrowsBySeller` |מציג נאמנויות נכסים לפי מוכר. |
|`FindAssetEscrowsByBuyer` |מציג נאמנויות נכסים לפי קונה. |
|`FindAssetEscrowsByStatus` |מציג נאמנויות נכסים לפי מצב. |
|`FindAnonymousAssetEscrows` |מציג רשומות נאמנות אנונימית לנכסים.|
|`FindAnonymousAssetEscrowById` |מוצא נאמנות אנונימית אחת לנכסים לפי ID. |
|`FindAnonymousAssetEscrowsBySeller` |מציג נאמנויות אנונימיות לפי מוכר.|
|`FindAnonymousAssetEscrowsByBuyer` |מציג נאמנויות אנונימיות לפי קונה.|
|`FindAnonymousAssetEscrowsByStatus` |מציג נאמנויות אנונימיות לפי מצב. |
|`FindProofRecordById` |מוצא רשומת הוכחה אחת לפי ID. |
|`FindProofRecords` |מציג רשומות הוכחה.|
|`FindProofRecordsByBackend` |מציג רשומות הוכחה עבור מנגנון הוכחה. |
|`FindProofRecordsByStatus` |מציג רשומות הוכחה לפי מצב. |

## Nexus, זמינות הנתונים וארכיבים {#nexus-data-availability-and-packages}

|שאילתה |מטרה.|
| --- | --- |
|`FindRepoAgreements` |רשימה של הסכמי אחסון שמוצאים על שרשרת. |
|`FindTwitterBindingByHash` |לפתור קישור טוויטר באמצעות האש. |
|`FindDaPinIntentByTicket` |תמצאו כוונה של קישור זמינות נתונים לפי כרטיס.|
|`FindDaPinIntentByManifest` |תמצאו כוונה של סימן על ידי התייחסות מפורשת. |
|`FindDaPinIntentByAlias` |תמצאי כוונה של סימן תחת השם.|
|`FindDaPinIntentByLaneEpochSequence` |תמצאו כוונה של סינור לפי שדה, תקופה וסדר. |
|`FindLaneRelayEnvelopeByRef` |תמצא מעטפה מאושרת.|
|`FindSorafsProviderOwner` |לפתור את הבעלים של ספק SoraFS. |
|`FindDataspaceNameOwnerById` |לפתור בעל שמות חלל נתונים. |
|`FindMusubiExactPackageV1` |קראו רישום מסגר מדויק אחד ושינויים הנוכחיים בו. |
|`FindMusubiExactReleaseV1` |קורא תמונת מצב מדויקת אחת של הפצה.|
|`FindMusubiProviderBundleAttestationV1` |קראו את תעודת האריכיון של ספקית אחת. |
|`FindMusubiResolverIndexV1` |דף האינדקס של הגורם הסופי. |
|`FindMusubiVersionsV1` |דף גרסאות סופיות עבור חבילת אחת. |
|`FindMusubiMaintainersV1` |דף קיבל מחזיקים וזמנות ממתינות. |
|`FindMusubiArchiveLocationsV1` |דף סיים את מקומות SoraFS לארכיון אחד. |
|`FindMusubiArchiveRetentionV1` |דף רשומות אחסון ארכיון. |
|`FindMusubiAliasV1` |קראו את המטרה הנוכחית וההפכה של שם גלובלי. |
|`FindMusubiAliasHistoryV1` |תפרסם את ההיסטוריה הבלתי משתנה של התכלית העולמית. |
|`FindMusubiOrderedPrefixV1` |חבילות עמודים תחת תצוגה מבוצעת אחת. |

## גורמים, חוזים, עסקאות ובלוקים {#triggers-contracts-transactions-and-blocks}

|שאילתה |מטרה.|
| --- | --- |
|`FindActiveTriggerIds` |מציג IDs של טריגרים פעילים. |
|`FindTriggers` |מציג טריגרים. |
|`FindTriggerById` |מוצא טריגר אחד לפי ID. |
|`FindContractManifestByCodeHash` |מצא מסמך חוזים חכמים על ידי קוד האש.|
|`FindTransactions` |רשימה של עסקאות commit. |
|`FindBlocks` |בלוקים של רשימה.|
|`FindBlockHeaders` |רשימה כותרות בלוק. |

## סינון ושידור עמודים {#filtering-and-pagination}

שאילתות איטרטיביות יכולות לתמוך ב-predicate וב-selector. השתמשו במסננים בעלי טיפוסים הייחודיים לשאילתה מתוך ה-SDK, כדי שקלט המסנן יתאים לסוג הפלט של השאילתה. עבור קבוצות תוצאות גדולות, השתמשו בפרמטרי שאילתה כגון cursor ו-limit במקום לאחזר את כל השורות בבת אחת.
