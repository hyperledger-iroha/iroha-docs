---
translation_locale: he
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# פתרון בעיות {#troubleshooting}

הפרק הזה נועד לעזור אם אתה נתקל בבעיות בעת עבודה עם Iroha. אם משהו הולך לא בסדר, בבקשה. [בדוק את המפתחות.](#check-the-keys) אם זה לא עוזר, בדוק את הוראות פתרון בעיות עבור כל שלב.

- [בעיות התקנת ](./installation-issues.md)
- [בעיות בהסדרות ](./configuration-issues.md)
- [בעיות הפעלת ](./deployment-issues.md)
- [בעיות אינטגרציה](./integration-issues.md)

אם הבעיה שאתם חווים אינה מתוארת כאן, התקשרו אלינו באמצעות [טלגרם ](https://t.me/hyperledgeriroha).

## בדוק את המפתחות. {#check-the-keys}

רוב הבעיות מתעוררות כתוצאה מפתחות שאינן מקבילות. לכן אנו ממליצים לעקוב אחר הכלל הזה: אם משהו משתבש, בדוק קודם את המפתחות.

הנה הסבר מהיר: אי אפשר להבחין בין הודעות הטעות שנגרמות כאשר מפתחות של עמיתים לא מתאימים עם המפתחות ברשימת עמיתים אמינים כי זה יחשוף את המפתח הציבורי של העמיתים. כתוצאה מכך, אם יש לך תארים של הלם או פיתוחי קברנטיס עם מפתחות מוגדרות באמצעות משתנים סביבתיים, השווא את הערכים המוגדרים [`public_key`](/he/reference/peer-config/params.md#param-public-key), [`private_key`](/he/reference/peer-config/params.md#param-private-key), ו [`trusted_peers`](/he/reference/peer-config/params.md#param-trusted-peers) לפני שתחקור כישלונות ברמה גבוהה יותר. .

אם אין ספק, [ יצר זוג מפתחות חדש ](/he/guide/security/generating-cryptographic-keys.md).
