---
translation_locale: hy
translation_source: /reference/data-model-schema.md
translation_source_hash: cf27b1f313a695b648ae450564a51120af0e3e39641ed140a187d128b930da97
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# Տվյալների մոդելային ծրագիր {#data-model-schema}

Ստուգեք սխեման ձեր ինտեգրման նպատակների ճշգրիտ հանգույցից: Torii ծառայում է ակտիվ տվյալների մոդելի սխեմային `GET /v1/schema` , երբ այդ մակերեսը հնարավորություն է տալիս.

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

Մի՛ ստեղծեք կապեր ստուգված փաստաթղթերի կտորից, քանի դեռ դրա ծագման վիճակը սպասվում է: Կենդանի հանգույցի արձագանքը հեղինակավոր է այդ հանգույցի կոմպիլացված տվյալների մոդելի համար. պահեք այն ձեր ինտեգրման կողմից օգտագործվող հանգույցի կառուցվածքի կողքին.
