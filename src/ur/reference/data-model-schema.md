---
translation_locale: ur
translation_source: /reference/data-model-schema.md
translation_source_hash: cf27b1f313a695b648ae450564a51120af0e3e39641ed140a187d128b930da97
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# ڈیٹا ماڈل اسکیم {#data-model-schema}

اپنے انٹیگریشن کے اہداف کے عین مطابق نوڈ سے اسکیما کو دریافت کریں۔ Torii فعال ڈیٹا ماڈل اسکیم کو `GET /v1/schema` پر خدمت کرتا ہے جب اس سطح کو چالو کیا گیا ہو:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

چیک ان دستاویزات کے ٹکڑے سے پابندیاں پیدا نہ کریں جب تک کہ اس کی اصل کی حیثیت زیر التواء ہو۔ براہ راست نوڈ کا جواب اس نوڈ کے مرتب کردہ ڈیٹا ماڈل کے لئے بااختیار ہے۔ اسے اپنے انضمام کے ذریعہ استعمال ہونے والے نوڈ بلڈ کے ساتھ منسلک رکھیں.
