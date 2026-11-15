---
translation_locale: my
translation_source: /reference/data-model-schema.md
translation_source_hash: c4f0305c73f9470d1652b70e6787b59de2553a08b6c96603a9369512efbdb1af
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# ဒေတာပုံစံ အစီအစဉ် {#data-model-schema}

သင့်ပေါင်းစည်းမှုက ပစ်မှတ်ထားသော နိုဒ်အတိအကျထံမှ ဒေတာဖွဲ့စည်းပုံကို မေးမြန်းပါ။ Torii သည် ထိုမျက်နှာပြင်ကို ဖွင့်ထားလျှင် လက်ရှိဒေတာမော်ဒယ်၏ ဖွဲ့စည်းပုံကို `GET /v1/schema` တွင် ပေးသည်။

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

အခြားဆော့ဖ်ဝဲတည်ဆောက်မှုအတွက် ထုတ်ပြန်ထားသော မိတ္တူအစား ထိုတုံ့ပြန်ချက်မှ ချိတ်ဆက်အသုံးပြုရန်ကုဒ်ကို ထုတ်လုပ်ပါ။ လက်ရှိနိုဒ်၏ တုံ့ပြန်ချက်သည် ထိုနိုဒ်တွင် စုစည်းတည်ဆောက်ထားသော ဒေတာမော်ဒယ်အတွက် အတည်ပြုရင်းမြစ်ဖြစ်သည်။ သင့်ပေါင်းစည်းမှုတွင် သုံးသော နိုဒ်ဆော့ဖ်ဝဲတည်ဆောက်မှုနှင့်အတူ ၎င်းကို သတ်မှတ်ချည်နှောင်ထားပါ။
