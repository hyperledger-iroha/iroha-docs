---
translation_locale: he
translation_source: /reference/permissions.md
translation_source_hash: a21f947225ff9ac1a353a5a15e8807788e362f3bf0ddb9cb106df83524917532
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# סימני רשות {#permission-tokens}

דף זה מפרט את סוגי הרשיונות המקובלים של סימן רשיונות שנחשפו על ידי מודל הנתונים הנוכחי Iroha. עבור המדריך המושגי לתפקידים ורשיונות, ראה [רשויות](/he/blockchain/permissions.md).

בדיקות הרשאות נאכפות בידי המאמת הפעיל של סביבת הריצה. שמות סוגי האסימונים שלהלן מתארים את ממשק המדיניות הסטנדרטי, אך רשת יכולה להתאים את האימות בזמן הריצה באמצעות שדרוג המבצע.

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
|`CanMintAssetWithDefinition` |נכסים |להנפיק נכסים עבור הגדרה מסוימת. |
|`CanBurnAssetWithDefinition` |נכסים |לשרוף נכסים עבור הגדרה ספציפית. |
|`CanTransferAssetWithDefinition` |נכסים |העברת נכסים להגדרה ספציפית. |
|`CanMintAsset` |נכסים |להנפיק יתרת נכס מסוימת. |
|`CanBurnAsset` |נכסים |לשרוף סכום נכסים ספציפי.|
|`CanTransferAsset` |נכסים |להעביר סכום נכסים מסוים. |
|`CanRegisterNft` |NFT |רשום NFT. |
|`CanUnregisterNft` |NFT |לא רשום את NFT. |
|`CanTransferNft` |NFT |להעביר NFT. |
|`CanModifyNftMetadata` |NFT |לשנות NFT מטא נתונים. |
|`CanSetParameters` |פרמטרים |להגדיר פרמטרים של ההסדרים על שרשרת. |
|`CanManageRoles` |תפקידים |רשום, לא רשום, לתת או לבטל תפקידים. |
|`CanRegisterTrigger` |טריגר |רישום טריגר.|
|`CanExecuteTrigger` |טריגר |הפעלת טריגר.|
|`CanUnregisterTrigger` |טריגר |הסרת טריגר מרישום.|
|`CanModifyTrigger` |טריגר |שינוי הגדרת טריגר. |
|`CanModifyTriggerMetadata` |טריגר |שינוי מטא־הנתונים של טריגר. |
|`CanUpgradeExecutor` |יצרן |לשפר את המפעיל של זמן ההפעלה. |
|`CanRegisterSmartContractCode` |חוזה חכם.|רשום קוד חוזה חכם. |
| `CanManageFeeSponsorProgram` | SORA Nexus | ניהול תוכניות שבבעלות חשבון נותן החסות המדויק. |
| `CanEnrollFeeSponsorProgram` | SORA Nexus | ניהול מוטבים של תוכנית מימון מדויקת אחת. |

## בעלות {#ownership}

סימני אישור רגישים לבעלים חייבים להתייחס לאובייקט הקנוני IDs שימוש במודל הנתונים הנוכחי. לדוגמה, רשיונות חשבון מתייחסים לחשבון קנוני ללא דומיין IDs, רשיונות תחום מתייחסים `domain.dataspace` תחום IDs, רשיונות נכסים מתייחסים להגדרה קנוניקה של נכס או נכס. IDs.

כאשר עסקה נכשלת עם טעות אישור, בדוק את שני הצדדים:

- החשבון אשר חותם על העסקה הוא החשבון הקנוני הנצפה.
- סימן רשות או תפקיד נתן עבור האובייקט המדויק ID המשמש בהוראה.
