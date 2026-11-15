---
translation_locale: mn
translation_source: /reference/data-model-schema.md
translation_source_hash: c4f0305c73f9470d1652b70e6787b59de2553a08b6c96603a9369512efbdb1af
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Өгөгдлийн загварын схем {#data-model-schema}

Таны нэгдэл чиглүүлж буй яг тэр зангилаагаас схемийг лавлаарай. Torii энэ гадаргуу идэвхтэй байх үед `GET /v1/schema` дээр идэвхтэй өгөгдлийн загварын схемийг өгдөг:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

Өөр бүтээлтэд зориулж нийтэлсэн хуулбараас бус, тэр хариунаас холболтын код үүсгэнэ. Ажиллаж буй зангилааны хариу нь түүний компайлдсан өгөгдлийн загварын эрх бүхий эх сурвалж; интеграцдаа ашиглаж буй зангилааны бүтээлттэй хамт тогтоож хадгална.
