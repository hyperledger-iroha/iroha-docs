---
translation_locale: he
translation_source: /reference/queries.md
translation_source_hash: 88dba1142d7b6a452a5f56d56640ceef47a52ca28e296d6d0ee5992b9005c3bb
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# שאלות {#queries}

דרישות Iroha קוראים את מצב הספר הגדול ללא שינוי בו. מודל הנתונים הנוכחי חושף שני צורות חיפוש רחבות:

- שאילות ייחודיות, שבהן חוזרות אובייקט אחד או ערך אחד
- שאלות חוזרות, אשר מחזרות זרם או אוסף ויכולים להיות משולבים עם פילטר, סורטינג, פרויקציה ופגינציה כאשר סוג המשאל תומך בו

שימוש SDK הבניינים הטייפדים או CLI במקום לבנות מעטפות בקשת יד. שמות למטה הם סוגים של בקשות הנוכחיים `iroha_data_model::query`.

## זמן ההפעלה וההסדר {#runtime-and-configuration}

|שאלה |מטרה.|
| --- | --- |
|`FindAbiVersion` |תחזירו את הגרסה של ABI. |
|`FindExecutorDataModel` |תחזיר את תיאור דגם הנתונים של המוציא לפועל. |
|`FindParameters` |להחזיר את פרמטרי ההסדר של המפעיל על שרשרת. |

## חשבונות ורישיון {#accounts-and-permissions}

|שאלה |מטרה.|
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

## דומנים ושותפים {#domains-and-peers}

|שאלה |מטרה.|
| --- | --- |
|`FindDomainById` |תמצא תחום אחד ב `DomainId`. |
|`FindDomains` |רשימה של תחומים רשומים. |
|`FindDomainsByAccountId` |רשימה דומנים בבעלות חשבון. |
|`FindDomainEndorsements` |רשום רישומי אישור תחום. |
|`FindDomainEndorsementPolicy` |תחזיר את מדיניות אישור הדומיין. |
|`FindDomainCommittee` |תחזיר את ועדת הדומיין.|
|`FindPeers` |רשימה של עמיתים אמינים ידועים בספר. |

## נכסים, NFTs, ו RWAs {#assets-nfts-and-rwas}

|שאלה |מטרה.|
| --- | --- |
|`FindAssets` |רשימה של סולציות נכסים. |
|`FindAssetsDefinitions` |רשימה של הגדרות נכסים. |
|`FindAssetsByAccountId` |רשימה של נכסים שנחזיקו בחשבון. |
|`FindAssetById` |מצא סכום נכס אחד על ידי `AssetId`. |
|`FindAssetDefinitionById` |מצא הגדרה אחת של נכס על ידי ID. |
|`FindNfts` |רשימה NFTs. |
|`FindNftsByAccountId` |רשימה NFTs בבעלות חשבון. |
|`FindRwas` |רשימה רשומה של נכסים אמיתיים. |

## רישומי אבטחה וראיות {#escrow-and-proof-records}

בקשות אבטחה בודקות את הרשומות שנוצרו על ידי [ אבטחת נכסים מקומיים ISIs](/he/blockchain/escrow.md), כולל אבטחות בשוק, סגרות נכסים גנריות ורישומים אבטחים אנונימיים.

|שאלה |מטרה.|
| --- | --- |
|`FindAssetEscrows` |רשום רישומי אבטחת נכסים. |
|`FindAssetEscrowById` |תמצאו מאבטחת נכסים אחת עד ID. |
|`FindAssetEscrowsBySeller` |רשימה של אבטחות נכסים לפי מוכר. |
|`FindAssetEscrowsByBuyer` |רשימה של נכסים על ידי קונה. |
|`FindAssetEscrowsByStatus` |רשימה של נכסים על פי מצבם. |
|`FindAnonymousAssetEscrows` |רשום רישומי אבטחה של נכסים אנונימיים.|
|`FindAnonymousAssetEscrowById` |תמצא מאבטח נכסים אנונימי אחד על ידי ID. |
|`FindAnonymousAssetEscrowsBySeller` |רשימה של אבטחות אנונימיות על ידי מוכר.|
|`FindAnonymousAssetEscrowsByBuyer` |רשימה של אבטחות אנונימיות על ידי קונה.|
|`FindAnonymousAssetEscrowsByStatus` |רשימה של מאבטחים אנונימיים לפי מצבם. |
|`FindProofRecordById` |מצא רישום ראיות אחד על ידי ID. |
|`FindProofRecords` |רשום רישומי ראיות.|
|`FindProofRecordsByBackend` |רשום רישומים של הוכחה ל-backend ראיה. |
|`FindProofRecordsByStatus` |רשימה רשומות הוכחה לפי מצב. |

## Nexus, זמינות הנתונים וארכיבים {#nexus-data-availability-and-packages}

|שאלה |מטרה.|
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
|`FindMusubiExactReleaseV1` |קרא תמונה אחת מדויקת של השחרור.|
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

|שאלה |מטרה.|
| --- | --- |
|`FindActiveTriggerIds` |רשום את המפעיל הפעיל IDs. |
|`FindTriggers` |רשימת גורמים. |
|`FindTriggerById` |מצא תפעיל אחד ב ID. |
|`FindContractManifestByCodeHash` |מצא מסמך חוזים חכמים על ידי קוד האש.|
|`FindTransactions` |רשימה של עסקאות מחויבות. |
|`FindBlocks` |בלוקים של רשימה.|
|`FindBlockHeaders` |רשימה כותרות בלוק. |

## סינון ושידור עמודים {#filtering-and-pagination}

שאילתות משוחרות יכולות לחשוף תמיכה בעובדה ובבחור. השתמשו בפילטרים מדפוסים ספציפיים למשאלה מ- SDK כך שהכניסת הסידור מתאימה לסוג יצירתו של השאלת. עבור קבוצות התוצאות גדולות, השתמשו בפרמטרים של השאלות כגון כורסר והגבול במקום לקבל כל שורה בו זמנית.
