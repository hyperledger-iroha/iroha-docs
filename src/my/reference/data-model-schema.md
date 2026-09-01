---
translation_locale: my
translation_source: /reference/data-model-schema.md
translation_source_hash: cf27b1f313a695b648ae450564a51120af0e3e39641ed140a187d128b930da97
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ဒေတာပုံစံ အစီအစဉ် {#data-model-schema}

Torii ကတော့ Active Data-Model Schema ကို `GET /v1/schema` မှာ လုပ်ဆောင်ပေးပါတယ်။ အဲဒီမျက်နှာပြင်ကို enable လုပ်တဲ့အခါမှာ

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

Check-in လုပ်ထားတဲ့ စာရွက်စာတမ်း snippet ကနေ ၎င်းရဲ့ provenance status ကို စောင့်ဆိုင်းနေစဉ်မှာ bindings တွေကို မဖန်တီးပါနဲ့။ Live node တုံ့ပြန်မှုက အဲဒီ node ရဲ့ compiled data model အတွက် အာဏာရှိပြီး သင့်ရဲ့ integration သုံးတဲ့ node build အနားမှာ ပိတ်ထားပါ။
