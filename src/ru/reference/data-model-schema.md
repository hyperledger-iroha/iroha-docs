---
translation_locale: ru
translation_source: /reference/data-model-schema.md
translation_source_hash: cf27b1f313a695b648ae450564a51120af0e3e39641ed140a187d128b930da97
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Схема модели данных {#data-model-schema}

Запрашивайте схему с того точного узла, на который нацелена ваша интеграция. Torii предоставляет активную схему модели данных на `GET /v1/schema`, когда эта поверхность включена:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

Не создавайте привязки из зафиксированного фрагмента документации, пока его статус происхождения находится в ожидании. Ответ живого узла является авторитетным для скомпилированной модели данных этого узла; держите его закрепленным вместе с сборкой узла, используемой в вашей интеграции.
