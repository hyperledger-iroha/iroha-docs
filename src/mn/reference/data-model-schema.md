---
translation_locale: mn
translation_source: /reference/data-model-schema.md
translation_source_hash: cf27b1f313a695b648ae450564a51120af0e3e39641ed140a187d128b930da97
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Өгөгдлийн загварын схем {#data-model-schema}

Таны нэгдэл чиглүүлж буй яг тэр зангилаагаас схемийг лавлаарай. Torii энэ гадаргуу идэвхтэй байх үед `GET /v1/schema` дээр идэвхтэй өгөгдлийн загварын схемийг өгдөг:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

Батлагдсан бичиг баримтын хэсгээс үүсгэсэн холболтыг түүний гарал үүсэл хэвийн бус байдал хүлээгдэж байх үед бүү үүсгэ. Амьд зангилааны хариу нь тухайн зангилааны нийлэгжүүлсэн өгөгдлийн загварын эрх мэдэлт мэдээлэл бөгөөд интеграцид ашигласан зангилааны бүтээлийн хамт хадгалагдсан байлгах.
