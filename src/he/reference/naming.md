---
translation_locale: he
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# שמות לאספות {#naming-conventions}

כאשר אתה שם חשבונות, דומנים או נכסים, עליך לזכור את הסכנות הבאות המשמשות ב Iroha:

1. יש מספר מפרידים מוגנים המשמשים לסוגים ספציפיים של בניינים:

   - `@` הוא מוגבל לכינוי שמה של חשבונות ומבחינים של חשבון/מפתח ציבורי
   - `#` הוא מוגבל לכינוי פרופיל להגדיר נכסים וליטרלים של תיקון נכסים
   - `::` הוא מוגבל לכינוי חוזה
   - `.` מיועד לכישור תחום ומרחב נתונים.
   - `$` מיועד לצפנים טקסטואליים עם גודל של תנין
   - `%` מיועד לצרכים טקסטליים בעלי גבולות אישור.

2. מספר המקסימלי של אותיות (כולל אותיות UTF-8) שמות יכולים להיות מוגבל על ידי שני גורמים: `[0, u32::MAX]` והמרחב המוקדם כרגע.

## נסה את זה על Taira {#try-it-on-taira}

לפתור כינוי נכס ציבורי להגדרה הקנונית של נכס ID:

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

הדמות `#` מפרידה שם כינוי של נכס מהקשר הדומיין. תשאיר אותו מחוץ לשמות פשוטים אלא אם כן אתה כותב בכוונה שם כינוי נכס או סכום נכסים מילולית.
