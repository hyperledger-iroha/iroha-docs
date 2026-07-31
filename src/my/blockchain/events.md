---
translation_locale: my
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ဖြစ်ရပ်များ {#events}

ဖြစ်ရပ်တွေကို ထုတ်လွှင့်တာက blockchain အတွင်းမှာ အချို့အရာတွေဖြစ်တဲ့အခါပါ၊ ဥပမာ
အကောင့်သစ်တစ်ခု ဖန်တီးထားသည် သို့မဟုတ် ဘလော့က ချမှတ်ခံရသည်။ အမျိုးအစားအမျိုးမျိုးရှိသည်
အဖြစ်အပျက်များ

- ဘိုက်လိုင်း ဖြစ်ရပ်များ
- ဒေတာဖြစ်ရပ်များ
- အချိန်ဖြစ်ရပ်များ
- trigger execution ဖြစ်ရပ်များ

## ဘိုက်လိုင်း ဖြစ်ရပ်များ {#pipeline-events}

Pipeline ဖြစ်ရပ်တွေကို ငွေကြေးလုပ်ငန်းတွေ တင်သွင်း၊ အကောင်အထည်ဖော်တဲ့အခါ ထုတ်လွှင့်ပါတယ်။
ပိုက်လိုင်းဖြစ်စဉ်မှာ အောက်ပါ အချက်အလက်တွေ ပါဝင်ပါတယ်။
ဖြစ်ရပ်တစ်ခုဖြစ်စေတဲ့ အဖွဲ့အစည်းအမျိုးအစား (ရောင်းဝယ်မှု သို့မဟုတ် ဘလော့ခ်) ၎င်းရဲ့ hash
အခြေအနေက `Validating` (တည်ငြိမ်မှုဖြစ်စဉ်)
`Rejected`, ဒါမှမဟုတ် `Committed`. ကုမ္ပဏီကို ပယ်ချခဲ့ရင် အကြောင်းပြချက်က
ငြင်းပယ်မှု ရှိတယ်။

### ဒါကို စမ်းကြည့်ပါ။ Taira {#try-it-on-taira}

အများသုံး pipeline event stream ကို တပ်ဆင်ထားတာကို စစ်ဆေးပါ။

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

ရေစီးကြောင်းကို ဖွင့်မထားဘဲ စစ်ဆေးနိုင်မယ့် အရှိန်အဟုန်ရှိ ဓာတ်ပုံအတွက် မကြာသေးခင်က ဖတ်ရှုခဲ့ပါ
စူးစမ်းရေးလုပ်ငန်းများ:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

ဖွင့်လိုက်ပါ SSE တိုက်ရိုက်ပွဲတွေလိုတဲ့အခါ terminal တစ်ခုမှာ လမ်းကြောင်း:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

Stream ဖွင့်နေစဉ်မှာ ငွေပေးချေမှု မရှိရင် Command ကို Stay လုပ်လို့ရပါတယ်။
လမ်းကြောင်းက ကျန်းမာပေမဲ့ ငြိမ်သက်တယ်။

## ဒေတာဖြစ်ရပ်များ {#data-events}

ဒေတာဖြစ်ရပ်များကို ထုတ်လွှင့်ခြင်းသည် ledger အချက်အလက်များနှင့် ပတ်သက်၍ ပြောင်းလဲမှုတစ်ခုရှိသည့်အခါဖြစ်သည်။
တူညီသောနေရာများ၊ ဒိုမင်များ၊ အကောင့်များ၊ အရင်းအမြစ်များ၊ ရင်းနှီးမြှုပ်နှံမှုဆိုင်ရာ အဓိပ္ပါယ်ဖွင့်ဆိုချက်များ NFTs, အစပျိုးစက်များ၊
အခန်းကဏ္ဍများ၊ ချိတ်ဆက်ထားသော ကွန်ပြူတာပုံစံ၊ အကောင်အထည်ဖော်သူအခြေအနေ၊ သက်သေခံချက်များ၊ လျှို့ဝှက်အရင်းအမြစ်များ
တံတားများ သို့မဟုတ် SORA/Nexus- တိကျတဲ့ အရာဝတ္ထုများ
[ဒေတာဖြစ်ရပ် စစ်ဆေးချက်များ](./filters.md#data-event-filters).

## အချိန်ကာလ ဖြစ်ရပ်များ {#time-events}

ကမ္ဘာ့အခြေအနေအမြင်က ကိုင်တွယ်ဖို့ အသင့်ရှိတဲ့အခါ အချိန်ဖြစ်ရပ်တွေကို ထုတ်လွှင့်တယ်။
[အချိန် trigger များ](./triggers.md#time-triggers).

## Trigger Execution ဖြစ်ရပ်များ {#trigger-execution-events}

trigger execution events တွေကို emit လုပ်တဲ့အခါ
[`ExecuteTrigger`](./instructions.md#executetrigger) ညွှန်ကြားချက်
trigger completion events တွေကို trigger action တစ်ခုပြီးရင် ထုတ်လွှတ်ပေးပါတယ်။
အဆုံးသတ်တယ်။
