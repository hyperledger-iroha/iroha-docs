---
translation_locale: he
translation_source: /reference/data-model-schema.md
translation_source_hash: cf27b1f313a695b648ae450564a51120af0e3e39641ed140a187d128b930da97
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# תוכנית מודל נתונים {#data-model-schema}

בצעו שאילתה על הסכמה מהצומת המדויק שאליו מכוונת האינטגרציה. Torii מגיש את סכמת מודל הנתונים הפעילה ב-`GET /v1/schema` כאשר הממשק מופעל:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

אל תייצרו bindings מקטע התיעוד שנשמר במאגר כל עוד מצב המקור שלו ממתין. תגובת הצומת החי היא המקור המוסמך למודל הנתונים שקוּמפל בצומת זה; קבעו אותה לצד גרסת הבנייה של הצומת שבה משתמש השילוב שלכם.
