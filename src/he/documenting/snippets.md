---
translation_locale: he
translation_source: /documenting/snippets.md
translation_source_hash: 48d6670f100c7c6368fa03f163c9ff9e0322d36e51c22f89562b23b0e2ee2a2f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# חתיכות קוד {#code-snippets}

קטעים שנוצרו מחזיקים דוגמאות קשורות לקוד, להגדרת, ומערכות מההפכה Iroha שהייתה יוצרת אותם.

## ארטיפקטים מרעננים Iroha {#refreshing-iroha-artifacts}

חתיכות Iroha נגזרות נבדקות כך שפיתוחים של אתרים רגילים לא דורשים גישה לרשת או מאגר אחים.

```bash
pnpm refresh:iroha --source /path/to/iroha
```

זרימת העבודה `etc/refresh-iroha.ts` המודפסת בדיקת מקור נקי לעומת `provenance/iroha.json`, מגדירה את `/src/snippets` ואת תמונת ההצלחה Torii OpenAPI ומעדכנת את האש SHA-256. בדוק יחד את התוכן והשינויים בהיקף. ההתקנה הרגילה של התלות והבונים VitePress צורכים את הקבצים המזוהרים מבלי להביא ענף משתנה .

## כולל חתיכות {#including-snippets}

השתמשו בסינטקס [VitePress של חתיכת קוד ](https://vitepress.dev/guide/markdown#import-code-snippets) כדי לכלול מקור מקומי או מובנה:

```md
<<< @/snippets/client.template.toml
```

ניתן להוסיף אזור קוד בשם על ידי תוספת שמו של אזור:

```md
<<< @/example_code/lorem.rs#ipsum
```

שמרו על דוגמאות כתובות ביד קטנות. מעדיפים ארטיפקטים מקור מתחדשים עבור אינטרסים ציבוריים, טמבלטים של הגדרציה, סכמות שנוצרות ומוצאת פקודות.
