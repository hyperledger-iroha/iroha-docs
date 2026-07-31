---
translation_locale: he
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# סימני רשות {#permission-tokens}

דף זה מפרט את סוגי הרשיונות המקובלים של סימן רשיונות שנחשפו על ידי מודל הנתונים הנוכחי Iroha. עבור המדריך המושגי לתפקידים ורשיונות, ראה [רשויות](/he/blockchain/permissions.md).

בדיקות הרשיונות מבוקשות על ידי המאשר ל- runtime פעיל. שמות הטייקונים למטה מתארים את פני המדיניות הסטנדרטית, אך רשת יכולה להתאים אישור ל- run time על ידי העלאת האפגניזציה.

## סימנים מקובלים {#default-tokens}

|סימן אישור|קטגוריה |מבצע |
| --- | --- | --- |
|`CanManagePeers` |בן זוג|להירשם, לא להירשם או אחרת לנהל עמינים. |
|`CanManageLaneRelayEmergency` |בן זוג|לנהל את בקרות המנוחה למסלול חירום. |
|`CanRegisterDomain` |תחום |רשום דומיין.|
|`CanUnregisterDomain` |תחום |תבטל רישום תחום.|
|`CanModifyDomainMetadata` |תחום |לשנות מטא נתונים של תחום. |
|`CanRegisterAccount` |חשבון |רשום חשבון.|
|`CanUnregisterAccount` |חשבון |תבטל את החשבון.|
|`CanModifyAccountMetadata` |חשבון |לשנות מטא נתונים של חשבון. |
|`CanUnregisterAssetDefinition` |הגדרה של נכסים |לא רשום תיאור נכס. |
|`CanModifyAssetDefinitionMetadata` |הגדרה של נכסים |לשנות מטא-מידע על הגדרת נכסים. |
|`CanMintAssetWithDefinition` |נכסים |נכסי מטבעות עבור הגדרה ספציפית. |
|`CanBurnAssetWithDefinition` |נכסים |לשרוף נכסים עבור הגדרה ספציפית. |
|`CanTransferAssetWithDefinition` |נכסים |העברת נכסים להגדרה ספציפית. |
|`CanMintAsset` |נכסים |כותב סכום נכסים ספציפי. |
|`CanBurnAsset` |נכסים |לשרוף סכום נכסים ספציפי.|
|`CanTransferAsset` |נכסים |להעביר סכום נכסים מסוים. |
|`CanRegisterNft` |NFT |רשום NFT. |
|`CanUnregisterNft` |NFT |לא רשום את NFT. |
|`CanTransferNft` |NFT |להעביר NFT. |
|`CanModifyNftMetadata` |NFT |לשנות NFT מטא נתונים. |
|`CanSetParameters` |פרמטרים |להגדיר פרמטרים של ההסדרים על שרשרת. |
|`CanManageRoles` |תפקידים |רשום, לא רשום, לתת או לבטל תפקידים. |
|`CanRegisterTrigger` |תפעיל |רשום את ההדק.|
|`CanExecuteTrigger` |תפעיל |להוציא לפועל את ההדק.|
|`CanUnregisterTrigger` |תפעיל |תבטל את ההדק.|
|`CanModifyTrigger` |תפעיל |שינו את הגדרת ההדק. |
|`CanModifyTriggerMetadata` |תפעיל |שינו את הנתונים המפעילים. |
|`CanUpgradeExecutor` |יצרן |לשפר את המפעיל של זמן ההפעלה. |
|`CanRegisterSmartContractCode` |חוזה חכם.|רשום קוד חוזה חכם. |
|`CanUseFeeSponsor` |Nexus |כנסת דמי Nexus לחשבון ספונסר מסוים. |

## בעלות {#ownership}

סימני אישור רגישים לבעלים חייבים להתייחס לאובייקט הקנוני IDs שימוש במודל הנתונים הנוכחי. לדוגמה, רשיונות חשבון מתייחסים לחשבון קנוני ללא דומיין IDs, רשיונות תחום מתייחסים `domain.dataspace` תחום IDs, רשיונות נכסים מתייחסים להגדרה קנוניקה של נכס או נכס. IDs.

כאשר עסקה נכשלת עם טעות אישור, בדוק את שני הצדדים:

- החשבון אשר חותם על העסקה הוא החשבון הקנוני הנצפה.
- סימן רשות או תפקיד נתן עבור האובייקט המדויק ID המשמש בהוראה.
