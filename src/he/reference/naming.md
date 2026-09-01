---
translation_locale: he
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# כללי מתן שמות {#naming-conventions}

בעת מתן שמות לחשבונות, לדומיינים או לנכסים, יש לזכור את הכללים הבאים הנהוגים ב־Iroha:

1. כמה מפרידים שמורים לשימוש במבנים מסוימים:

   - `@` שמור לכינויי חשבון ולצורות חשבון/מפתח ציבורי בעלות תחום
   - `#` שמור לכינויים של הגדרות נכס ולליטרלים של יתרות נכס
   - `::` שמור לכינויי חוזים
   - `.` שמור לציון תחום ומרחב נתונים
   - `$` שמור לצורות טקסטואליות בתחום של trigger
   - `%` שמור לצורות טקסטואליות בתחום של validator

2. מספר התווים המרבי בשם, כולל תווי UTF-8, מוגבל על ידי שני גורמים: הטווח `[0, u32::MAX]` וגודל המחסנית שהוקצה כעת.

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
