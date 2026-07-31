---
translation_locale: my
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ညီလာခံ အမည်ပေးခြင်း {#naming-conventions}

Iroha တွင် အသုံးပြုသော အောက်ပါ စည်းကမ်းချက်များကို မှတ်သားရန် လိုအပ်ပါသည်။

1. ဆောက်လုပ်မှုအမျိုးအစားတစ်ခုခုအတွက် အသုံးပြုတဲ့ သီးခြားခွဲခြားကိရိယာတွေ အများကြီးရှိပါတယ်။

   - `@` Account aliases နှင့် scoped account/public-key ပုံစံများအတွက် သီးသန့်ထားပါသည်။
   - `#` အရင်းအမြစ်အဓိပ္ပါယ်ဖွင့်ဆိုမှု အမည်မဖော်လိုသူများနှင့် ရင်းနှီးမြှုပ်နှံမှု ဘားလံစာရင်းများအတွက် သီးသန့်ထားသည်
   - `::` စာချုပ်အမည်များအတွက် သီးသန့်ထားသည်
   - `.` ဒိုမင်နဲ့ ဒေတာနေရာ အရည်အချင်းအတွက် သီးသန့်ထားတာပါ။
   - `$` trigger-scoped စာသားပုံစံများအတွက် သီးသန့်ထားသည်
   - `%` validator scope ရှိ စာသားပုံစံများအတွက် သီးသန့်ထားပါသည်။

2. UTF-8 အက္ခရာများအပါအဝင် နာမည်တစ်ခုတွင် ရှိနိုင်သော အများဆုံး စာလုံးအရေအတွက်ကို အချက်နှစ်ချက်ဖြင့် ကန့်သတ်ထားသည်- `[0, u32::MAX]` နှင့် လက်ရှိဖြန့်ဝေထားသည့် stack space ကို။

## Taira မှာ စမ်းကြည့်ပါ။ {#try-it-on-taira}

အများပြည်သူ အရင်းအမြစ်အမည်မဖော်လိုသော အမည်ကို ၎င်း၏ တရားဝင်အရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုချက် ID တွင် ဖြေရှင်းရန်။

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

အရင်းအမြစ် သတ်မှတ်ချက် စာရင်းနဲ့ နှိုင်းယှဉ်ကြည့်ပါ။

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

`#` စာလုံးက asset alias ကို domain context ကနေ ခွဲခြားပေးပါတယ်။ ကိုယ်ရည်ရွယ်ပြီး asset alias (သို့) asset balance literal ကိုမရေးဘူးဆိုရင်တော့ ရိုးရှင်းတဲ့ နာမည်တွေကနေ ရှောင်ပါ။
