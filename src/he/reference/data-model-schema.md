---
translation_locale: he
translation_source: /reference/data-model-schema.md
translation_source_hash: c4f0305c73f9470d1652b70e6787b59de2553a08b6c96603a9369512efbdb1af
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# תוכנית מודל נתונים {#data-model-schema}

בצעו שאילתה על הסכמה מהצומת המדויק שאליו מכוונת האינטגרציה. Torii מגיש את סכמת מודל הנתונים הפעילה ב-`GET /v1/schema` כאשר הממשק מופעל:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

צרו קישורי קוד מהתשובה הזאת במקום מעותק שפורסם עבור בנייה אחרת. תשובת הצומת החי היא המקור הסמכותי למודל הנתונים שקוּמפל בצומת הזה; שמרו אותה מקובעת לצד בניית הצומת ששילובכם משתמש בה.
