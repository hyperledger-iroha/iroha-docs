---
translation_locale: he
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# שמות של ישיבות {#naming-conventions}

כשאתם מכנים חשבונות, דומיינים או נכסים, אתם צריכים לזכור
הסכנות הבאות המשמשות ב Iroha:

1. יש מספר מפרידים מוגבלים שמשמשים
   סוגים של בניינים:

   - `@` הוא מוגבל לכינוי שמה של חשבונות ולסמכים של חשבון/נפתח ציבורי.
   - `#` הוא מוגבל לכינוי בעל שם של הגדרת נכסים וליטרלים של תיקון נכסים
   - `::` הוא מוגבל לכינוי חוזה
   - `.` מיועד לכישורים של תחום ומרחב נתונים
   - `$` הוא מוגבל לצפנים טקסטואליים בעלי גבולת תירוץ.
   - `%` מיועד לצרכים טקסטליים בעלי גבולת אישור

2. מספר המקסימלי של אותיות (כולל UTF-8 אותיות) שם יכול
   יש מוגבל על ידי שני גורמים: `[0, u32::MAX]` ושל
   חלל סטק מיועד.

## נסה את זה. Taira {#try-it-on-taira}

לפתור נכס ציבורי תחת השוואה להגדירתו הקנונית של נכסים ID:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

השווא את זה עם רשימת ההגדרה של נכסים:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

ה- `#` הדמות מופרדת את שם הכספוי מהקשר של השטח.
של שמות פשוטים, אלא אם כן אתה כותב בכוונה כינוי נכס או נכס
איזון פשוטו כמשמעו.
