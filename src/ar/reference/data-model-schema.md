---
translation_locale: ar
translation_source: /reference/data-model-schema.md
translation_source_hash: c4f0305c73f9470d1652b70e6787b59de2553a08b6c96603a9369512efbdb1af
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# مخطط نموذج البيانات {#data-model-schema}

استفسر عن المخطط من العقدة الدقيقة التي يستهدفها تكاملك. Torii يقدم مخطط نموذج البيانات النشط في `GET /v1/schema` عندما يتم تمكين تلك الواجهة:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

ولّد الربط البرمجي من تلك الاستجابة بدلًا من نسخة منشورة لبناء آخر. استجابة العقدة العاملة هي المرجع المعتمد لنموذج البيانات المضمّن في بنائها؛ فاحتفظ بها مثبتة مع بناء العقدة الذي يستخدمه تكاملك.
