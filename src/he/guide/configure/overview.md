---
translation_locale: he
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# הגדרות והניהול {#configuration-and-management}

הקונפיגורת Iroha יש שתי שכבות סמכותיות:

- קונפיגורציה מקומית של עמיתים ולקוחות, שמוחמרת בקבצים TOML וקראת בהתחלה של התהליך
- תיקון שרשרת, שינה על ידי עסקאות באמצעות [`SetParameter`](/he/blockchain/instructions.md#setparameter)

השתמשו בקונפיגירציה מקומית עבור זהות הערך, כתובות, רשום, אחסון ומפתחות חתימה של הלקוח. השתמשו בהקונפיגורציה על שרשרת עבור ערכים אשר חייבים להיות מסכימים על ידי הרשת ולשחק מחדש באופן דeterministic.

התנהגות הייצור חייבת לבוא מכתבי הקונפיגורציה אלה. משתנים סביבתיים עשויים להיות נוחים לספק סיכומים של בדיקות למכשירים מקומיים, אבל הם אינם שערות תכונות ייצור ולא מחליפים את הקונפיגרציה המחויבת.

נקודות הכניסה העיקריות של ההסדרות הן:

- [בראשית ](/he/guide/configure/genesis.md)
- [קונפיגורת הלקוח](/he/guide/configure/client-configuration.md)
- [מפתחות לשימוש ברשת ](/he/guide/configure/keys-for-network-deployment.md)
- [רץ על מתכת עירומה ](/he/guide/advanced/running-iroha-on-bare-metal.md)
- [דוגמה להגדרת עמיתים](/he/reference/peer-config/index.md)
