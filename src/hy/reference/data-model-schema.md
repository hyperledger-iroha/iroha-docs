---
translation_locale: hy
translation_source: /reference/data-model-schema.md
translation_source_hash: c4f0305c73f9470d1652b70e6787b59de2553a08b6c96603a9369512efbdb1af
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Տվյալների մոդելային ծրագիր {#data-model-schema}

Ստուգեք սխեման ձեր ինտեգրման նպատակների ճշգրիտ հանգույցից: Torii ծառայում է ակտիվ տվյալների մոդելի սխեմային `GET /v1/schema` , երբ այդ մակերեսը հնարավորություն է տալիս.

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

Կապակցող կոդը ստեղծեք այդ պատասխանից, ոչ թե այլ հավաքման համար հրապարակված պատճենից։ Գործող հանգույցի պատասխանը դրա կազմարկված տվյալների մոդելի լիազորված աղբյուրն է․ այն ամրագրեք ձեր ինտեգրման օգտագործած հանգույցի հավաքման հետ միասին։
