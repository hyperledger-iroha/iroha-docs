---
translation_locale: ka
translation_source: /reference/data-model-schema.md
translation_source_hash: c4f0305c73f9470d1652b70e6787b59de2553a08b6c96603a9369512efbdb1af
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# მონაცემთა მოდელის სქემა {#data-model-schema}

შეკითხვა სქემა ზუსტი კვანძიდან თქვენი ინტეგრაციის მიზნები. Torii ემსახურება აქტიური მონაცემთა მოდელის სქემის `GET /v1/schema` როდესაც ეს ზედაპირი ჩართულია:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

ბმები ამ პასუხიდან დააგენერირეთ და არა სხვა აწყობისთვის გამოქვეყნებული ასლიდან. მოქმედი კვანძის პასუხი ამ კვანძის კომპილირებული მონაცემთა მოდელის ავტორიტეტული წყაროა; იგი თქვენი ინტეგრაციის მიერ გამოყენებულ კვანძის აწყობასთან ერთად დააფიქსირეთ.
