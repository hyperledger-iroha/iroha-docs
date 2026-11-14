---
translation_locale: kk
translation_source: /reference/data-model-schema.md
translation_source_hash: c4f0305c73f9470d1652b70e6787b59de2553a08b6c96603a9369512efbdb1af
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Деректер моделі схемасы {#data-model-schema}

Интеграцияның мақсатты торабынан тікелей схеманы сұраңыз. Torii осы интерфейс қосылған кезде `GET /v1/schema` активті деректер моделінің схемасын ұсынады:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

Байланыстыру кодын басқа құрастыру үшін жарияланған көшірмеден емес, осы жауаптан жасаңыз. Жұмыс істеп тұрған түйіннің жауабы сол түйіннің компиляцияланған деректер моделі үшін өкілетті дереккөз болып табылады; оны интеграция қолданатын түйін құрастыруымен бірге бекітіп сақтаңыз.
