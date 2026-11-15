---
translation_locale: uz
translation_source: /reference/data-model-schema.md
translation_source_hash: c4f0305c73f9470d1652b70e6787b59de2553a08b6c96603a9369512efbdb1af
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Ma'lumotlar Moduli Skemasi {#data-model-schema}

Integratsiyangiz nishonlaydigan aniq tugundan sxemani so‘rang. Torii ushbu yuzaki yoqilganda `GET /v1/schema` da faol ma’lumot modeli sxemasini taqdim etadi:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

Bog‘lanishlarni boshqa yig‘ilma uchun e’lon qilingan nusxadan emas, ayni javobdan yarating. Ishlayotgan tugunning javobi shu tugunning kompilyatsiya qilingan ma’lumotlar modeli uchun ishonchli manbadir; uni integratsiyangiz ishlatadigan tugun yig‘ilmasi bilan birga mahkamlang.
