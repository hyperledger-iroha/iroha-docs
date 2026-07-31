---
translation_locale: he
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# סימני רשות {#permission-tokens}

דף זה רשימה של סוגים מקובלים של סימני הרשיונות חשופים על ידי הזמנים הנוכחיים
Iroha מודל הנתונים של מבצע. עבור המדריך המושגי לתפקידים ולרשיונות,
ראו [רשיונות](/he/blockchain/permissions.md).

בדיקות רשיונות מבוקשות על ידי מדריך ההישג הפעיל.
שמות למטה מתארים את שטח מדיניות סטנדרטי, אבל רשת יכולה להתאים
אישור זמן ההפעלה על ידי העדכון של המבצע.

## סימנים מקובלים {#default-tokens}

| סימן רשות | קטגוריה | מבצע |
| --- | --- | --- |
| `CanManagePeers` | עמיתים | רשום, לא רשום, או אחרת לנהל עמיתים. |
| `CanManageLaneRelayEmergency` | עמיתים | לנהל את בקרות המנוחה למסלול חירום. |
| `CanRegisterDomain` | תחום | רשום דומיין. |
| `CanUnregisterDomain` | תחום | לא להירשם דומיין. |
| `CanModifyDomainMetadata` | תחום | לשנות מטא נתונים של תחום. |
| `CanRegisterAccount` | חשבון | רשום חשבון. |
| `CanUnregisterAccount` | חשבון | לא להירשם חשבון. |
| `CanModifyAccountMetadata` | חשבון | לשנות את הנתונים המעטה של החשבון. |
| `CanUnregisterAssetDefinition` | הגדרה של נכסים | לא רשום הגדרה של נכס. |
| `CanModifyAssetDefinitionMetadata` | הגדרה של נכסים | לשנות מטא-מידע של הגדרת נכס. |
| `CanMintAssetWithDefinition` | נכסים | נכסים של מטבעות עבור הגדרה ספציפית. |
| `CanBurnAssetWithDefinition` | נכסים | לשרוף נכסים עבור הגדרה ספציפית. |
| `CanTransferAssetWithDefinition` | נכסים | העברת נכסים להגדרה ספציפית. |
| `CanMintAsset` | נכסים | כותב סכום נכסים ספציפי. |
| `CanBurnAsset` | נכסים | לשרוף איזון נכסים ספציפי. |
| `CanTransferAsset` | נכסים | להעביר סכום נכסים ספציפי. |
| `CanRegisterNft` | NFT | רשום NFT. |
| `CanUnregisterNft` | NFT | לא רשום NFT. |
| `CanTransferNft` | NFT | להעביר NFT. |
| `CanModifyNftMetadata` | NFT | שינויים NFT מטא-מנתונים. |
| `CanSetParameters` | פרמטרים | להגדיר פרמטרים של ההשפעה על שרשרת. |
| `CanManageRoles` | תפקידים | רשום, לא רשום, להעניק או לבטל תפקידים. |
| `CanRegisterTrigger` | מפיץ | רשום את ההדק. |
| `CanExecuteTrigger` | מפיץ | תפעיל כפתור. |
| `CanUnregisterTrigger` | מפיץ | תבטל את ההדק. |
| `CanModifyTrigger` | מפיץ | שינו את הגדרת ההדק. |
| `CanModifyTriggerMetadata` | מפיץ | שינו את הנתונים המפעילים. |
| `CanUpgradeExecutor` | מבצע | העדוף את המפעיל של זמן ההפעלה. |
| `CanRegisterSmartContractCode` | חוזה חכם | רשום קוד חוזה חכם. |
| `CanUseFeeSponsor` | Nexus | תשלום Nexus תשלום לחשבון ספונסר מסוים. |

## בעלות {#ownership}

סימני רשות רגישים לבעלים חייבים להתייחס לאובייקט הקנוני IDs משמש
לדוגמה, הרשויות של חשבונות מתייחסות לקנוניקה
חשבון ללא דומיין IDs, רשיונות דומיין מתייחסים `domain.dataspace` תחום
IDs, והרשיונות של נכסים מתייחסים להגדרה הקנוניקה של נכס או נכס. IDs.

כאשר עסקה נכשלת עם טעות אישור, לבדוק את שני הצדדים:

- החשבון המחתם על העסקה הוא החשבון הקנוני הנחמד
- סימן או תפקיד אישור נתן עבור האובייקט המדויק ID בשימוש ב
  הוראות
