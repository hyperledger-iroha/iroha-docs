---
translation_locale: ur
translation_source: /reference/data-model-schema.md
translation_source_hash: c4f0305c73f9470d1652b70e6787b59de2553a08b6c96603a9369512efbdb1af
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# ڈیٹا ماڈل اسکیم {#data-model-schema}

اپنے انٹیگریشن کے اہداف کے عین مطابق نوڈ سے اسکیما کو دریافت کریں۔ Torii فعال ڈیٹا ماڈل اسکیم کو `GET /v1/schema` پر خدمت کرتا ہے جب اس سطح کو چالو کیا گیا ہو:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

بائنڈنگز اسی جواب سے بنائیں، کسی دوسری بلڈ کے لیے شائع کردہ نقل سے نہیں۔ چلتے ہوئے نوڈ کا جواب اس نوڈ کے مرتب شدہ ڈیٹا ماڈل کا مستند ماخذ ہے؛ اسے اپنی انٹیگریشن میں استعمال ہونے والی نوڈ بلڈ کے ساتھ مقرر رکھیں۔
