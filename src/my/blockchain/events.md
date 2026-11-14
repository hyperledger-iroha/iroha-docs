---
translation_locale: my
translation_source: /blockchain/events.md
translation_source_hash: 2777cbe4e72a50c4790e50b59c3e695feb5814314cc9afccdfd994f6409c195e
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-supplemental-naming-link+reviewed-delta
---
# ဖြစ်ရပ်များ {#events}

Typed event notification တွေကို blockchain အတွင်းမှာ တစ်ခုခုဖြစ်တဲ့အခါ ထုတ်ပေးပါတယ်။ ဥပမာ အကောင့်သစ်တစ်ခု ဖန်တီးတာ (သို့) ဘလော့က နောက်ဆုံးသတ်မှတ်ထားတာပါ။

- ဆော့ဖ်ဝဲ စီမံခန့်ခွဲမှု အလုပ်ဖြစ်စဉ်များ
- ဒေတာဖြစ်ရပ်များ
- အချိန်ကို အခြေခံတဲ့ အဖြစ်အပျက် အကြောင်းကြားချက်များ
- trigger execution ဖြစ်ရပ်များ

## ဆော့ဖ်ဝဲ စီမံခန့်ခွဲမှု လုပ်ငန်းခွင်များ ဖြစ်ရပ်များ {#pipeline-events}

Transaction များနှင့် ဘလော့ခ်များ pipeline ကို ဖြတ်သန်းသွားသည်နှင့်အမျှ pipeline ဖြစ်ရပ်များကို ထုတ်ပေးသည်။ Transaction ဖြစ်ရပ်တွင် transaction ဟက်ရှ်၊ ဘလော့ခ်အမြင့်၊ lane နှင့် data space ID များနှင့် အခြေအနေတစ်ခု ပါဝင်သည်- `Queued`၊ `Expired`၊ `Approved` သို့မဟုတ် ငြင်းပယ်ရသည့် အကြောင်းရင်းနှင့်အတူ `Rejected`။ ဘလော့ခ်ဖြစ်ရပ်တွင် ဘလော့ခ်ခေါင်းစီးနှင့် အခြေအနေတစ်ခု ပါဝင်သည်- `Created`၊ `Approved`၊ အကြောင်းရင်းနှင့်အတူ `Rejected`၊ `Committed` သို့မဟုတ် `Applied`။

### Taira တွင် ဤအလုပ်ခွင်ကို run လုပ်ပါ။ {#try-it-on-taira}

အများသုံး ဆော့ဖ်ဝဲ စီမံခန့်ခွဲမှု အလုပ်ခွင်ဖြစ်စဉ်စီးကြောင်းကို တပ်ဆင်ထားတာကို စစ်ဆေးပါ။

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

Stream ကို ဖွင့်မထားဘဲ စစ်ဆေးနိုင်မယ့် point-in-time data view တစ်ခုအတွက် မကြာသေးခင်က explorer transaction တွေကို ဖတ်ရှုပါ။

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?limit=5' \
  | jq '{next_cursor, txs: [.items[] | {hash, block, status, executable}]}'
```

SSE လမ်းကြောင်းကို တိုက်ရိုက်ပွဲတွေ လိုအပ်တဲ့အခါ Terminal တစ်ခုမှာ ဖွင့်ပါ။

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

Stream ဖွင့်ထားစဉ် transaction မတင်သွင်းပါက လမ်းကြောင်း ကောင်းစွာအလုပ်လုပ်နေလျှင်ပင် command သည် ဘာမျှမထုတ်ပြဘဲ ရှိနေနိုင်သည်။

## ဒေတာဖြစ်ရပ်များ {#data-events}

Peer များ၊ domain များ၊ အကောင့်များ၊ ပိုင်ဆိုင်မှုများ၊ ပိုင်ဆိုင်မှုသတ်မှတ်ချက်များ၊ NFTs များ၊ trigger များ၊ role များ၊ on-chain ပြင်ဆင်သတ်မှတ်မှု၊ executor အခြေအနေ၊ proof များ၊ လျှို့ဝှက်ပိုင်ဆိုင်မှုများ၊ bridge များ သို့မဟုတ် SORA Nexus ဆိုင်ရာ အရာများကဲ့သို့ လယ်ဂျာဒေတာနှင့် ပတ်သက်သော ပြောင်းလဲမှုဖြစ်သည့်အခါ ဒေတာဖြစ်ရပ်များကို ထုတ်ပေးသည်။ ဤဖြစ်ရပ်အမျိုးအစားများကို [ဒေတာဖြစ်ရပ် စစ်ထုတ်မှုများ](./filters.md#data-event-filters) တွင် သုံးသည်။

## အချိန်ကို အခြေခံတဲ့ အဖြစ်အပျက် အကြောင်းကြားချက်များ {#time-events}

ကမ္ဘာ့အခြေအနေအမြင်ကို ကိုင်တွယ်ဖို့ အဆင်သင့်ဖြစ်တဲ့အခါ အချိန်အခြေခံ အဖြစ်အပျက် အကြောင်းကြားချက်တွေကို ထုတ်လွှင့်ပါတယ်။ [အချိန်ကို စေ့ဆော်ပေးသူ](./triggers.md#time-triggers).

## trigger execution ဖြစ်ရပ်များ {#trigger-execution-events}

trigger execution events တွေကို emit လုပ်တဲ့အခါမှာ [`ExecuteTrigger`](./instructions.md#executetrigger) ညွှန်ကြားချက်ကို အကောင်အထည်ဖော်ပြီးနောက် trigger completion events တွေကို emit လုပ်ပေးပါတယ်။
