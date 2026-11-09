---
translation_locale: my
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ဖြစ်ရပ်များ {#events}

Typed event notification တွေကို blockchain အတွင်းမှာ တစ်ခုခုဖြစ်တဲ့အခါ ထုတ်ပေးပါတယ်။ ဥပမာ အကောင့်သစ်တစ်ခု ဖန်တီးတာ (သို့) ဘလော့က နောက်ဆုံးသတ်မှတ်ထားတာပါ။

- ဆော့ဖ်ဝဲ စီမံခန့်ခွဲမှု အလုပ်ဖြစ်စဉ်များ
- ဒေတာဖြစ်ရပ်များ
- အချိန်ကို အခြေခံတဲ့ အဖြစ်အပျက် အကြောင်းကြားချက်များ
- trigger execution ဖြစ်ရပ်များ

## ဆော့ဖ်ဝဲ စီမံခန့်ခွဲမှု လုပ်ငန်းခွင်များ ဖြစ်ရပ်များ {#pipeline-events}

Transaction များကို တင်သွင်းသည့်အခါ၊ လုပ်ဆောင်သည့်အခါ သို့မဟုတ် ဘလော့ခ်ထဲတွင် commit လုပ်သည့်အခါ pipeline ဖြစ်ရပ်များကို ထုတ်ပေးသည်။ Pipeline ဖြစ်ရပ်တွင် ဖြစ်ရပ်ကို ဖြစ်စေသော အရာ၏ အမျိုးအစား (transaction သို့မဟုတ် ဘလော့ခ်)၊ ၎င်း၏ ဟက်ရှ်နှင့် အခြေအနေတို့ ပါဝင်သည်။ အခြေအနေမှာ `Validating` (စစ်ဆေးနေဆဲ)၊ `Rejected` သို့မဟုတ် `Committed` ဖြစ်နိုင်သည်။ အရာတစ်ခုကို ငြင်းပယ်ခဲ့လျှင် ငြင်းပယ်ရသည့် အကြောင်းရင်းကို ဖော်ပြပေးသည်။

### Taira တွင် ဤအလုပ်ခွင်ကို run လုပ်ပါ။ {#try-it-on-taira}

အများသုံး ဆော့ဖ်ဝဲ စီမံခန့်ခွဲမှု အလုပ်ခွင်ဖြစ်စဉ်စီးကြောင်းကို တပ်ဆင်ထားတာကို စစ်ဆေးပါ။

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

Stream ကို ဖွင့်မထားဘဲ စစ်ဆေးနိုင်မယ့် point-in-time data view တစ်ခုအတွက် မကြာသေးခင်က explorer transaction တွေကို ဖတ်ရှုပါ။

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
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
