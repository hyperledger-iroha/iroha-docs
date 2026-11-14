---
translation_locale: ba
translation_source: /reference/data-model-schema.md
translation_source_hash: c4f0305c73f9470d1652b70e6787b59de2553a08b6c96603a9369512efbdb1af
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Мәғлүмәт моделе схемаһы {#data-model-schema}

Интеграция маҡсаттарығыҙҙың теүәл узелынан схеманы һорағыҙ. Torii актив мәғлүмәт моделе схемаһын `GET /v1/schema` адресы буйынса хеҙмәтләндерә, әгәр был өҫкө йөҙ булдырылған икән:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

Бәйләү кодын башҡа йыйылма өсөн баҫылған күсермәнән түгел, ә ошо яуаптан булдырығыҙ. Тере төйөн яуабы шул төйөндөң компиляцияланған мәғлүмәт моделе өсөн вәкәләтле сығанаҡ булып тора; уны интеграцияғыҙ ҡулланған төйөн йыйылмаһы менән бергә беркетеп һаҡлағыҙ.
