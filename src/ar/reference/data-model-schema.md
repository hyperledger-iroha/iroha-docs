---
translation_locale: ar
translation_source: /reference/data-model-schema.md
translation_source_hash: cf27b1f313a695b648ae450564a51120af0e3e39641ed140a187d128b930da97
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# مخطط نموذج البيانات {#data-model-schema}

استفسر عن المخطط من العقدة الدقيقة التي يستهدفها تكاملك. Torii يقدم مخطط نموذج البيانات النشط في `GET /v1/schema` عندما يتم تمكين تلك الواجهة:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

لا تقم بإنشاء روابط من مقتطف الوثائق المدرج في المستودع بينما يكون حالة أصله معلقة. استجابة العقدة الحية هي السلطة بالنسبة لنموذج البيانات المجمع لتلك العقدة؛ احتفظ بها مثبتة بجانب بنية العقدة المستخدمة في تكاملك.
