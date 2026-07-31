---
translation_locale: he
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# חתיכות קוד {#code-snippets}

קטעים שנוצרו מחזיקים דוגמאות קשורות לקוד, להגדרת, ומערכות מההפכה Iroha שהייתה יוצרת אותם.

## חפצים מרעננים Iroha {#refreshing-iroha-artifacts}

חתיכות Iroha נגזרות נבדקות כך שפיתוחים של אתרים רגילים לא דורשים גישה לרשת או מאגר אחים.

```bash
pnpm refresh:iroha --source /path/to/iroha
```

זרימת העבודה [ `etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts) המודפסת בדיקת מקור נקי לעומת `provenance/iroha.json`, מגדירה את `/src/snippets` ואת תמונת ההצלחה Torii OpenAPI ומעדכנת את האש SHA-256. בדוק יחד את התוכן והשינויים בהיקף. ההתקנה הרגילה של התלות והבונים VitePress צורכים את הקבצים המזוהרים מבלי להביא ענף משתנה .

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
