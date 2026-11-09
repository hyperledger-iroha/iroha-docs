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

ရင်းမြစ်အတည်ပြုမှုအခြေအနေ မပြီးသေးစဉ် သိုလှောင်ရုံရှိ စာရွက်စာတမ်းကုဒ်အပိုင်းမှ ချိတ်ဆက်ကုဒ်များကို မဖန်တီးပါနှင့်။ တိုက်ရိုက်နိုဒ်၏ တုံ့ပြန်ချက်သည် ထိုနိုဒ်တွင် compile လုပ်ထားသော ဒေတာမော်ဒယ်အတွက် အတည်ဖြစ်သည်။ သင့်ပေါင်းစည်းမှုအသုံးပြုသော နိုဒ် build နှင့်အတူ ၎င်းကို ပုံသေချိတ်ထားပါ။
