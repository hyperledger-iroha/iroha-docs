---
translation_locale: kk
translation_source: /reference/data-model-schema.md
translation_source_hash: cf27b1f313a695b648ae450564a51120af0e3e39641ed140a187d128b930da97
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Деректер моделі схемасы {#data-model-schema}

Интеграцияның мақсатты торабынан тікелей схеманы сұраңыз. Torii осы интерфейс қосылған кезде `GET /v1/schema` активті деректер моделінің схемасын ұсынады:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

Провизия статусы күтілуде тұрған кезде тіркелген құжаттаманың үзіндісінен байланыстар жасамаңыз. Сол түйіннің компиляцияланған деректер моделі үшін тірі түйін жауапты болып табылады; оны интеграцияңызда қолданылатын түйін құралының қасында бекітілген күйде ұстаңыз.
