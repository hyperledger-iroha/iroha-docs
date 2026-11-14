---
translation_locale: az
translation_source: /reference/data-model-schema.md
translation_source_hash: c4f0305c73f9470d1652b70e6787b59de2553a08b6c96603a9369512efbdb1af
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Məlumat Modeli SXeması {#data-model-schema}

İnteqrasiyanızın hədəf aldığı dəqiq noddan sxemi sorğulayın. Torii səthi aktiv olduqda `GET /v1/schema` ünvanında aktiv məlumat modeli sxemini təqdim edir:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

Bağlamaları başqa yığım üçün yayımlanmış nüsxədən deyil, həmin cavabdan yaradın. Canlı qovşağın cavabı onun kompilyasiya edilmiş məlumat modeli üçün səlahiyyətli mənbədir; onu inteqrasiyanızın istifadə etdiyi qovşaq yığımı ilə yanaşı sabitləyin.
