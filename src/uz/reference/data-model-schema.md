---
translation_locale: uz
translation_source: /reference/data-model-schema.md
translation_source_hash: cf27b1f313a695b648ae450564a51120af0e3e39641ed140a187d128b930da97
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Ma'lumotlar Moduli Skemasi {#data-model-schema}

Integratsiyangiz nishonlaydigan aniq tugundan sxemani so‘rang. Torii ushbu yuzaki yoqilganda `GET /v1/schema` da faol ma’lumot modeli sxemasini taqdim etadi:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

Manba holati kutish rejimida bo'lgan hujjat parchasidan bog‘lamlarni yaratmang. Jonli tugun javobi ushbu tugunning kompilyatsiya qilingan ma'lumot modeliga oid rasmiy manbadir; uni integratsiyangiz tomonidan ishlatilgan tugun qurilishi bilan birga saqlang.
