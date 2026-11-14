---
translation_locale: ru
translation_source: /reference/data-model-schema.md
translation_source_hash: c4f0305c73f9470d1652b70e6787b59de2553a08b6c96603a9369512efbdb1af
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Схема модели данных {#data-model-schema}

Запрашивайте схему с того точного узла, на который нацелена ваша интеграция. Torii предоставляет активную схему модели данных на `GET /v1/schema`, когда эта поверхность включена:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

Генерируйте привязки из этого ответа, а не из копии, опубликованной для другой сборки. Ответ работающего узла является первичным источником сведений о скомпилированной модели данных этого узла. Сохраняйте его закреплённую копию вместе со сборкой узла, используемой вашей интеграцией.
