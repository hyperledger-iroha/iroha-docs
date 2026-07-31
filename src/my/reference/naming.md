---
translation_locale: my
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# နာမည်ပေးသော ညီလာခံများ {#naming-conventions}

အကောင့်၊ ဒိုမီနန်း (သို့) အရင်းအမြစ်တွေကို နာမည်ပေးတဲ့အခါ သတိထားဖို့လိုတယ်။
အောက်ပါ စည်းမျဉ်းစည်းကမ်းများ Iroha:

1. သီးသန့်အတွက် အသုံးပြုတဲ့ သီးခြား ခွဲခြားကိရိယာတွေ ရှိပါတယ်။
   အဆောက်အအုံအမျိုးအစားများ

   - `@` Account aliases နှင့် scoped account/public-key ပုံစံများအတွက် သီးသန့်သတ်မှတ်ထားသည်
   - `#` အရင်းအမြစ်သတ်မှတ်ချက် အမည်မဖော်လိုသူများနှင့် အရင်းအမြတ်စုဆောင်းမှု စာရင်းများအတွက် သီးသန့်ထားသည်
   - `::` စာချုပ်အမည်များအတွက် သီးသန့်သတ်မှတ်ထားသည်
   - `.` ဒိုမင်နဲ့ ဒေတာနေရာ အရည်အချင်းအတွက် သီးသန့်ထားတာပါ။
   - `$` trigger-scoped စာသားပုံစံများအတွက် သီးသန့်ထားသည်
   - `%` validator scope ရှိ စာသားပုံစံများအတွက် သီးသန့်ထားသည်

2. အက္ခရာ အများဆုံး (အပါအဝင်) UTF-8 စာလုံးများ) အမည်တစ်ခု
   (၂) နှစ်ခုက အကန့်အသတ်ထားတယ်။ `[0, u32::MAX]` လက်ရှိတွင်
   ဖြန့်ဖြူးထားသော စကိတ်နေရာ။

## ဒါကို စမ်းကြည့်ပါ။ Taira {#try-it-on-taira}

ပြည်သူ့လက်ဝယ်အမည်ကို တရားဝင်လက်ဝယ်သတ်မှတ်ချက်ထဲတွင် ဖြေရှင်းရန် ID:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

ဒါကို အရင်းအမြစ် အဓိပ္ပါယ်သတ်မှတ်ချက် စာရင်းနဲ့ နှိုင်းယှဉ်ကြည့်ပါ။

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

နိုင်ငံခြားရေး `#` character က asset alias ကို domain context ကနေ ခွဲခြားပေးတယ်
ကိုယ်ရည်ရွယ်ချက်နဲ့ ပိုင်ဆိုင်မှု အမည်မဖော်လိုတာ (သို့) ပိုင်ဆိုင်မှုကို ရေးသားနေခြင်းမှလွဲရင် သာမန်အမည်တွေနဲ့
ဟန်ချက်ညီမှုဆိုတာက တကယ့်ကိုပါ။
