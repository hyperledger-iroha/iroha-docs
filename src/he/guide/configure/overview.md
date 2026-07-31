---
translation_locale: he
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# סידור וניהול {#configuration-and-management}

Iroha הקונפיגורציה יש שתי שכבות סמכותיות:

- **תיקון מקומי של עמיתים ולקוחות**, מאוחסנים TOML קבצים וקריאה ב
  התחלה של התהליך
- **קונפיגורת שרשרת**, שינו על ידי עסקאות באמצעות
  [`SetParameter`](/he/blockchain/instructions.md#setparameter)

השתמשו בהקנה מקומית עבור זהות הערך, כתובות
סימון מפתחות לקלינט. השתמשו בהקנה על שרשרת עבור ערכים שצריך להסכים
על-ידי הרשת ושיחקו מחדש באופן דטרמיסטי.

התנהגות הייצור חייבת לבוא מכתבי ההסדרים האלה.
משתנים עשויים להיות נוחים למסור דרישות בדיקות לכלי עבודה מקומיים, אך
הם אינם שערות תכונות ייצור ואינם מחליפים את ההתחייבויות
הגדרות.

נקודות הכניסה העיקריות של ההסדרות הן:

- [בראשית](/he/guide/configure/genesis.md)
- [הגדרת הלקוח](/he/guide/configure/client-configuration.md)
- [מפתחות לשימוש ברשת](/he/guide/configure/keys-for-network-deployment.md)
- [רץ על מתכת עירומה](/he/guide/advanced/running-iroha-on-bare-metal.md)
- [דף קונפיגורציה של עמיתים](/he/reference/peer-config/index.md)
