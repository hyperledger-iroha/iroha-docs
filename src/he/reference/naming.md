---
translation_locale: he
translation_source: /reference/naming.md
translation_source_hash: 15d095e674edf780c5859abe6f4615d53338e3304e8eedfa494017911204d4b6
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-supplemental-naming-link+reviewed-delta
---
# כללי מתן שמות {#naming-conventions}

בעת מתן שמות לחשבונות, לדומיינים או לנכסים, יש לזכור את הכללים הבאים הנהוגים ב־Iroha:

1. כמה מפרידים שמורים לשימוש במבנים מסוימים:

   - `@` שמור לכינויי חשבון ולצורות חשבון/מפתח ציבורי בעלות תחום
   - `#` שמור לכינויים של הגדרות נכס ולליטרלים של יתרות נכס
   - `::` שמור לכינויי חוזים
   - `.` שמור לציון תחום ומרחב נתונים
   - `$` שמור למזהי NFT כגון `name$domain.dataspace`

2. שם חייב להיות לא ריק, בצורת Unicode NFC, באורך של 255 בתים לכל היותר ב־UTF-8, וללא רווחים לבנים, תווי בקרה ותווי בקרה דו־כיווניים.

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
