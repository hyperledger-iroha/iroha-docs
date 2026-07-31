---
translation_locale: he
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# מאטריקס התאמה {#compatibility-matrix}

המתריס של התאמה מראה צומת-SDK כיסוי סצינרים לבעיה הנוכחית
Iroha 3 קבוצת מסמכים. בדפוס מקובל, הדף משאיר את תמונת ההצלמה המובולקת
ממתקעים [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha)
ביקורת.

המתריס מורכב מ:

- **סיפורים** בעמוד הראשון
- **SDKs** על פני העמודות השאריות
- **סימבולות מצב** עבור נתונים מכוסים, נכשלים וחסרים

רק תוצאות שמבחינות על ידי זרימת העבודה של העדכון מדווחות כמוכסות או
תרחישים ללא ראיות עבור התיקון המוקדש מוצגים כ
נתונים חסרים במקום להורשת תוצאות ממבחן מקור אחר.

<CompatibilityMatrixTable />

::: info
המוסד `VITE_COMPAT_MATRIX_URL` רק כדי לשבור את תמונת ההצלחה המובולקת עם
ללא משתנה זה, הדף עומס
`src/public/compat-matrix.json`.
:::
