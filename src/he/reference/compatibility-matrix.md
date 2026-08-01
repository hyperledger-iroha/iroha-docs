---
translation_locale: he
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# מאטריקס התאמה {#compatibility-matrix}

מתריסת ההתאמה מציגה כיסוי סצנרים צלולי SDK עבור קבוצת התיקים הנוכחית Iroha 3. בדפוס, הדף מטען את תמונת ההצלחה המובולקת שנוצרה מההפגנות הנתבעת [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha).

המתריס מורכב מ:

- סיפורים בעמוד הראשון.
- SDKs על פני העמודות השאריות
- סימבלים של מצב עבור נתונים סגורים, נכשלים וחסרים

רק תוצאות שמבחינות על ידי זרימת העבודה של העדכון מדווחות כמכוסות או נכשלות. סצנרים ללא ראיות עבור התיקון הקשור מוצגים כמנתונים חסרים במקום ליורשת תוצאות ממתיקון מקור אחר.

<CompatibilityMatrixTable />

::: info
להגדיר `VITE_COMPAT_MATRIX_URL` רק כדי לשבור את תמונת ההצלחה המובולקת עם אחורה חיה מתאימה. ללא משתנה זה, הדף ממלא `src/public/compat-matrix.json`.
:::
