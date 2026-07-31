---
translation_locale: he
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# פתרון בעיות {#troubleshooting}

החלק הזה נועד לעזור אם אתה נתקל בבעיות בעת עבודה עם
Iroha. אם משהו הולך לא בסדר, בבקשה. [בדוק את המפתחות.](#check-the-keys)
אם זה לא עוזר, בדוק את הוראות פתרון בעיות
כל שלב:

- [בעיות ההתקנה](./installation-issues.md)
- [בעיות בהסדר](./configuration-issues.md)
- [נושאי הפעלת](./deployment-issues.md)
- [בעיות אינטגרציה](./integration-issues.md)

אם הבעיה שאתם חווים אינה מתוארת כאן, התקשרו אלינו באמצעות
[טלגרם](https://t.me/hyperledgeriroha).

## בדוק את המפתחות. {#check-the-keys}

רוב הבעיות נובעות כתוצאה מפתחות בלתי מנוגדות.
לציית לחוק זה: **אם משהו הולך לא בסדר, בדוק את המפתחות.
ראשית**.

הנה הסבר מהיר: אי אפשר להבחין בין הטעות
הודעות שנוצרו כאשר המפתחות של עמיתים לא מתאימים למפתחות במערכת
כי זה יחשוף את המפתח הציבורי של השותפים.
יש תארים של כדורים או פיתוחי קוברנטיס עם מפתחות מוגדרות באמצעות סביבה
משתנים, להשוות את המשתנה
[`public_key`](/he/reference/peer-config/params.md#param-public-key),
[`private_key`](/he/reference/peer-config/params.md#param-private-key), ו
[`trusted_peers`](/he/reference/peer-config/params.md#param-trusted-peers)
הערכים לפני חקירה של כישלונות ברמה גבוהה יותר.

אם אתה בספק, [ליצור זוג מפתחות חדש](/he/guide/security/generating-cryptographic-keys.md).
