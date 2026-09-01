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

Software Processing Workflow ဖြစ်ရပ်များသည် ငွေပေးချေမှုများကို ဘလော့ (ခ်) တွင်တင်သွင်းခြင်း၊ အကောင်အထည်ဖော်ခြင်း သို့မဟုတ် အဆုံးသတ်ခြင်းဖြင့် ထုတ်လွှင့်ခြင်းဖြစ်သည်။ Software Processing workflow ဖြစ်စဉ်တွင် အောက်ပါအချက်အလက်များပါဝင်သည်-ဖြစ်ရပ်ကိုဖြစ်စေသော entity အမျိုးအစား (transaction or block), ၎င်း၏ cryptographic hash နှင့်အခြေအနေ။ ဒီအခြေအနေက `Validating` (လက်ရှိတည်ငြိမ်မှု) ၊ `Rejected` သို့မဟုတ် `Committed` ဖြစ်နိုင်ပါတယ်။ Entity တစ်ခုကို ပယ်ချခဲ့ရင် ပယ်ချခြင်း အကြောင်းရင်းကို ဖော်ပြပါတယ်။

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

ချောင်းဖွင့်နေစဉ်မှာ ငွေပေးချေမှုမရှိရင် လမ်းကြောင်းက ကျန်းမာပေမဲ့ အမိန့်ဟာ တိတ်ဆိတ်စွာ ရပ်တည်နိုင်ပါတယ်။

## ဒေတာဖြစ်ရပ်များ {#data-events}

ဒေတာဖြစ်ရပ်များကို blockchain ledger အချက်အလက်များနှင့် ပတ်သက်၍ network peers, domains, accounts, assets, asset definitions, NFTs, trigger များကဲ့သို့သောပြောင်းလဲမှုရှိသောအခါ ထုတ်လွှင့်သည်။ Roles, on-chain configuration, executor state, proofs, confidential assets, bridges, or SORA/Nexus-specific objects. ဒီဖြစ်ရပ်အမျိုးအစားတွေကို [ဒေတာဖြစ်ရပ် စစ်ဆေးချက်များ](./filters.md#data-event-filters) မှာ အသုံးပြုပါတယ်။

## အချိန်ကို အခြေခံတဲ့ အဖြစ်အပျက် အကြောင်းကြားချက်များ {#time-events}

ကမ္ဘာ့အခြေအနေအမြင်ကို ကိုင်တွယ်ဖို့ အဆင်သင့်ဖြစ်တဲ့အခါ အချိန်အခြေခံ အဖြစ်အပျက် အကြောင်းကြားချက်တွေကို ထုတ်လွှင့်ပါတယ်။ [အချိန်ကို စေ့ဆော်ပေးသူ](./triggers.md#time-triggers).

## trigger execution ဖြစ်ရပ်များ {#trigger-execution-events}

trigger execution events တွေကို emit လုပ်တဲ့အခါမှာ [`ExecuteTrigger`](./instructions.md#executetrigger) ညွှန်ကြားချက်ကို အကောင်အထည်ဖော်ပြီးနောက် trigger completion events တွေကို emit လုပ်ပေးပါတယ်။
