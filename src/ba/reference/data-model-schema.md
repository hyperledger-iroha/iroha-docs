---
translation_locale: ba
translation_source: /reference/data-model-schema.md
translation_source_hash: cf27b1f313a695b648ae450564a51120af0e3e39641ed140a187d128b930da97
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# Мәғлүмәт моделе схемаһы {#data-model-schema}

Интеграция маҡсаттарығыҙҙың теүәл узелынан схеманы һорағыҙ. Torii актив мәғлүмәт моделе схемаһын `GET /v1/schema` адресы буйынса хеҙмәтләндерә, әгәр был өҫкө йөҙ булдырылған икән:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

Уның килеп сығыу статусы көтөлгән ваҡытта теркәлгән документация снайпетынан бәйләнештәр тупламағыҙ. Тере узел реакцияһы был узелдың тупланған мәғлүмәттәр моделе өсөн авторитетлы; уны интеграцияла ҡулланылған узел төҙөлөшө менән бер рәттән тоташтырығыҙ.
