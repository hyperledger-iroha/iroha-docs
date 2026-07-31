---
translation_locale: he
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# קטעי קוד {#code-snippets}

חתיכות יוצרות שומרות דוגמאות קשורות לקוד, להגדרת, ומערכות
ה- Iroha תיקון שהייצר אותם.

## מרענן Iroha חפצים {#refreshing-iroha-artifacts}

Irohaחתיכות נגזרות נבדקות, כך שבניית אתר רגילה לא דורשת
גישה לרשת או מאגר אחים.

```bash
pnpm refresh:iroha --source /path/to/iroha
```

המוכרים.
[`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts)
זרימת העבודה מאשרת את הבדיקת המקור הנקי `provenance/iroha.json`,
מתחדש `/src/snippets` ו... Torii OpenAPI תמונה מיידית, עדכונים SHA-256
חישבו את התוכן ואת ההשוואה משתנות יחד. תלות נורמלית
ההתקנה וה VitePress מבנים צורכים את הקבצים המזוהרים בלי
להביא ענף משתנה.

## כולל סניפטים {#including-snippets}

השתמש ב
[VitePress סינטקס של קטעי קוד](https://vitepress.dev/guide/markdown#import-code-snippets)
לכלול מקור מקומי או מנגן:

```md
<<< @/snippets/client.template.toml
```

אזור קוד שנקרא ניתן לכלול על ידי תוספת שם האזור שלו:

```md
<<< @/example_code/lorem.rs#ipsum
```

שמרו על דוגמאות כתובות ביד קטנות. מעדיפים חפצים מקורות מתחדשים לציבור
אינטרפרייסים, דפוסים של הגדרות, סכמות שנוצרו ויוצאת הפקודה.
