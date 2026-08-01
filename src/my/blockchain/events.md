---
translation_locale: my
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ဖြစ်ရပ်များ {#events}

events တွေကို blockchain အတွင်းမှာ ဖြစ်ပျက်တဲ့အခါ ထုတ်လွှင့်ပါတယ်။ ဥပမာ အကောင့်သစ်တစ်ခု ဖန်တီးတာ (သို့) ဘလော့က committed လုပ်တာမျိုးပါ။

- ပိုက်လိုင်း ဖြစ်ရပ်များ
- ဒေတာဖြစ်ရပ်များ
- အချိန်ဖြစ်ရပ်များ
- trigger execution ဖြစ်ရပ်များ

## ပိုက်လိုင်း ဖြစ်ရပ်များ {#pipeline-events}

pipeline events ကို transaction သို့မဟုတ် block တစ်ခုကို တင်သွင်း၊ အကောင်အထည်ဖော် (သို့မဟုတ်) commit လုပ်တဲ့အခါ ထုတ်လွှင့်ပါတယ်။ pipeline event မှာ အောက်ပါ အချက်အလက်တွေပါဝင်ပါတယ်- ဖြစ်စဉ်တစ်ခုဖြစ်ပေါ်စေတဲ့ entity အမျိုးအစား (transaction or block), ၎င်းရဲ့ hash နှင့်အခြေအနေ။ ဒီအခြေအနေက `Validating` (လက်ရှိတည်ငြိမ်မှု) ၊ `Rejected` သို့မဟုတ် `Committed` ဖြစ်နိုင်ပါတယ်။ Entity တစ်ခုကို ပယ်ချခဲ့ရင် ပယ်ချခြင်း အကြောင်းရင်းကို ဖော်ပြပါတယ်။

### Taira မှာ စမ်းကြည့်ပါ။ {#try-it-on-taira}

အများသုံး pipeline event stream ကို တပ်ဆင်ထားတာကို စစ်ဆေးပါ။

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

ရေစီးကြောင်းကို ဖွင့်မထားဘဲ စစ်ဆေးနိုင်တဲ့ အရှိန်အဟုန်ပြချက်အတွက် မကြာသေးခင်က Explorer Transactions ကို ဖတ်ရှုပါ။

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

SSE လမ်းကြောင်းကို တိုက်ရိုက်ပွဲတွေ လိုအပ်တဲ့အခါ Terminal တစ်ခုမှာ ဖွင့်ပါ။

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

ချောင်းဖွင့်နေစဉ်မှာ ငွေပေးချေမှုမရှိရင် လမ်းကြောင်းက ကျန်းမာပေမဲ့ အမိန့်ဟာ တိတ်ဆိတ်စွာ ရပ်တည်နိုင်ပါတယ်။

## ဒေတာဖြစ်ရပ်များ {#data-events}

ဒေတာဖြစ်ရပ်များကို စာရင်းအင်းဒေတာများနှင့်စပ်လျဉ်း၍ အပြောင်းအလဲရှိသည့်အခါ ထုတ်လွှင့်ခြင်းဖြစ်သည်။ ဥပမာ တူညီသူများ၊ နယ်ပယ်များ၊ အကောင့်များ၊ အရင်းအမြစ်များ၊ ပိုင်ဆိုင်မှု အဓိပ္ပါယ်ဖွင့်ဆိုချက်များ၊ NFTs၊ trigger များ၊ အခန်းကဏ္ဍများ၊ ကွင်းဆက်ပေါ်က ဖွဲ့စည်းပုံ၊ အကောင်အထည်ဖော်သူအခြေအနေ၊ အထောက်အထားများ၊ လျှို့ဝှက်အရင်းအမြစ်၊ တံတားများ သို့မဟုတ် SORA/Nexus- သီးခြားအရာရာများ။ [data event filters ](./filters.md#data-event-filters) မှာ ဒီအဖြစ်အပျက်အမျိုးအစားတွေကို သုံးပါတယ်။

## အချိန်ကာလ ဖြစ်ရပ်များ {#time-events}

အချိန်ဖြစ်ရပ်တွေကို ကမ္ဘာ့နိုင်ငံရေးအမြင်က ကိုင်တွယ်ဖို့ အသင့်ရှိတဲ့အခါ ထုတ်လွှတ်တယ်။ [အချိန် trigger များ](./triggers.md#time-triggers).

## trigger execution ဖြစ်ရပ်များ {#trigger-execution-events}

Trigger execution events များကို [`ExecuteTrigger`](./instructions.md#executetrigger) ညွှန်ကြားချက်အား အကောင်အထည်ဖော်သည့်အခါ ထုတ်လွှတ်ပေးသည်။ trigger completion events များသည် trigger လုပ်ဆောင်မှုတစ်ခု ပြီးဆုံးပြီးနောက်မှထုတ်လွှတ်ပေးသည်။
