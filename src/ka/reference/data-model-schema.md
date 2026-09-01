---
translation_locale: ka
translation_source: /reference/data-model-schema.md
translation_source_hash: cf27b1f313a695b648ae450564a51120af0e3e39641ed140a187d128b930da97
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# მონაცემთა მოდელის სქემა {#data-model-schema}

შეკითხვა სქემა ზუსტი კვანძიდან თქვენი ინტეგრაციის მიზნები. Torii ემსახურება აქტიური მონაცემთა მოდელის სქემის `GET /v1/schema` როდესაც ეს ზედაპირი ჩართულია:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

არ შეიქმნას ბმულები ჩანახული დოკუმენტაციის ნაწყვეტიდან, სანამ მისი წარმოშობის სტატუსი ელოდება. ცოცხალი ნოდის პასუხი ავტორიტეტულია იმ ნოდის შეკრული მონაცემების მოდელისათვის; ინტეგრაციის დროს გამოყენებული ნოდის შენობა-ნაგებობის გვერდით დაიცვას იგი.
