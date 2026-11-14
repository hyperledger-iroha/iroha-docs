---
translation_locale: my
translation_source: /reference/naming.md
translation_source_hash: 15d095e674edf780c5859abe6f4615d53338e3304e8eedfa494017911204d4b6
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-supplemental-naming-link+reviewed-delta
---
# ညီလာခံ အမည်ပေးခြင်း {#naming-conventions}

အကောင့်၊ ဒိုမိန်း သို့မဟုတ် ပိုင်ဆိုင်မှုများကို အမည်ပေးရာတွင် Iroha ၌ အသုံးပြုသော အောက်ပါစည်းမျဉ်းများကို သတိပြုရမည်။

1. သီးခြားဖွဲ့စည်းပုံအမျိုးအစားများအတွက် သီးသန့်ချန်ထားသော ခွဲခြားသင်္ကေတများ ရှိသည်။

   - `@` Account aliases နှင့် scoped account/public-key ပုံစံများအတွက် သီးသန့်ထားပါသည်။
   - `#` ကို ပိုင်ဆိုင်မှုသတ်မှတ်ချက် alias များနှင့် ပိုင်ဆိုင်မှုလက်ကျန်တန်ဖိုးအတိအကျများအတွက် သီးသန့်ထားသည်
   - `::` စာချုပ်အမည်များအတွက် သီးသန့်ထားသည်
   - `.` ဒိုမင်နဲ့ ဒေတာနေရာ အရည်အချင်းအတွက် သီးသန့်ထားတာပါ။
   - `$` ကို `name$domain.dataspace` ကဲ့သို့သော NFT identifier များအတွက် သီးသန့်ထားသည်

2. အမည်တစ်ခုသည် ဗလာမဖြစ်ရ၊ Unicode NFC ပုံစံဖြင့် ရှိရမည်၊ UTF-8 bytes 255 ထက် မရှည်ရဘဲ နေရာလွတ်စာလုံး၊ ထိန်းချုပ်စာလုံးနှင့် နှစ်ဘက်ဦးတည်ချက် ထိန်းချုပ်စာလုံးများ ကင်းရမည်။

## Taira တွင် ဤအလုပ်ခွင်ကို run လုပ်ပါ။ {#try-it-on-taira}

အများပြည်သူ အရင်းအမြစ်အမည်ကို ၎င်းရဲ့ Single Protocol-standard asset definition ID ထဲမှာ ဖြေရှင်းပါ။

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
