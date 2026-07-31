---
translation_locale: my
translation_source: /guide/best-practices/operations.md
translation_source_hash: de9e8129467b1111a58cee07acf43382d6cf3c352211a1511659ced422b46778
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# လုပ်ငန်းများ {#operations}

Operational readiness ဆိုသည်မှာ validator host များသို့ အလိုလိုဝင်ရောက်မှုအပေါ် မမှီခိုဘဲကွန်ရက်ကို စောင့်ကြည့်၊ ပြောင်းလဲ၊ back-up လုပ်ပြီး ပြန်လည်ထူထောင်နိုင်ခြင်းဖြစ်သည်။

## လေ့လာနိုင်မှု {#observability}

- Telemetry Profiles တွေကို ရည်ရွယ်ချက်ရှိစွာ enable လုပ်ပါ။ `/metrics` လိုအပ်တဲ့အခါ `extended` နဲ့ `full` ကို အသေးစိတ် Sumeragi operator routes များလိုအပ်တဲ့ စမ်းသပ်မှုတွေမှာ အသုံးပြုပါ။
- ဒက်ရှ်ဘုတ်က လက်ခံတဲ့ ထုတ်ကုန်၊ ပယ်ချထားတဲ့ ထုတ်ကုန်၊ commit latency, queue depth, queue saturation, view changes, dropped consensus messages နဲ့ storage pressure တွေကို သုံးပါတယ်။
- အခြေအနေ snapshots များ၊ metrics scrapes များ၊ log များနှင့် deployment configuration များကို incident သို့မဟုတ် benchmark artifact set တစ်ခုတည်းတွင် သိမ်းထားပါ။
- အတန်းတွေ ဆက်လက်တိုးလာတာ၊ မမျှော်လင့်တဲ့ ငြင်းပယ်မှု မြင့်တက်တာတွေ၊ ရပ်တန့်နေတဲ့ ဘလော့ပ်အမြင့်၊ ရှုထောင့်ပြောင်းလဲခြင်းနဲ့ တူညီသူတွေရဲ့ ကျန်းမာရေး ပြောင်းလဲမှုတွေ သတိထားပါ။

[ စွမ်းဆောင်ရည်နှင့် မက်ထရစ်များ](/my/guide/advanced/metrics.md) ကိုကြည့်ပါ။

## လမ်းလျှောက်စာအုပ်များ {#runbooks}

- peer restart, Torii degradation, key compromise, permission errors, fee sponsor depletion, stuck queues, and network partition symptoms အတွက် runbooks ရေးသားပါ။
- စာရေးခြင်း လုပ်ငန်းတွေ မလုပ်ခင် တိကျတဲ့ ဖတ်ရှုမှုသာ စစ်ဆေးမှုကို ထည့်သွင်းပါ၊ အထူးသဖြင့် အတန်းတူ မှတ်ပုံတင်မှု၊ ခွင့်ပြုချက်ပေးခြင်း၊ ပြောင်မြောက်မှု ပြောင်းလဲမှုတွေအတွက်ပါ။
- အရေးပေါ်ဆက်သွယ်မှုတွေနဲ့ တိုးတက်ရေး စည်းမျဉ်းတွေကို Docs repo ထဲမှာ ထည့်သွင်းထားရင် သီးသန့် လုပ်ငန်းဆိုင်ရာ ဒေတာတွေ ပါဝင်ပါက ထားပါ။
- ဖြစ်ရပ်တိုင်း၊ လေ့ကျင့်မှုတိုင်း၊ အကြီးမားဆုံး အဆင့်မြှင့်မှုတိုင်းနောက်မှာ လမ်းညွှန်စာအုပ်တွေကို စစ်ဆေးပါ။

[ လုပ်ငန်းလုံခြုံရေး ](/my/guide/security/operational-security.md) ကို ကြည့်ပါ။

## Backup နှင့် ပြန်လည်ထူထောင်ခြင်း {#backups-and-recovery}

- Deployment အတွက်လိုအပ်တဲ့ Recovery Point ကိုလိုက်ပြီး peer storage ကို back up လုပ်ပါ။ non-production host တွေမှာ validate restores လုပ်ပါ။
- လက်မှတ်ထိုးထားတဲ့ ဇာစ်မြစ်၊ metadata ထုတ်ပေးခြင်း၊ peer config နဲ့ key custody records တွေကို validator host မပါသေးတောင် ပြန်လည်ရရှိနိုင်အောင် ထိန်းသိမ်းပါ။
- ပြန်လည်ထူထောင်ရေး လုပ်ငန်းစဉ်တစ်ခုက မျိုးရိုးဗီဇကနေ ဆောက်လုပ်၊ snapshot ကနေ ပြန်လည်တည်ဆောက်တာ (သို့) ကျရှုံးတဲ့ တူညီသူကို ကိုယ်ပိုင်လက္ခဏာသစ်နဲ့ အစားထိုးပေးလားဆိုတာ မှတ်တမ်းတင်ပါ။
- ထုတ်လုပ်မှုဖြစ်စဉ်တစ်ခုအတွင်းမှာ ပထမဆုံးအကြိမ် ပြန်လည်ပြုပြင်တဲ့ လုပ်ငန်းစဉ်တွေကို ဘယ်တော့မှ မစမ်းသပ်ပါနဲ့။

## အပြောင်းအလဲ စီမံခန့်ခွဲမှု {#change-management}

- On-chain configuration အပြောင်းအလဲတွေကို review, preflight read, authorization နဲ့ post-change verification လိုတဲ့ ငွေကြေးပူးပေါင်းဆောင်ရွက်မှုအဖြစ် မှတ်ယူပါ။
- Compatibility plan နဲ့ rollback decision point တွေနဲ့အတူ peer binary upgrades ကိုဖြန့်ချိပါ။
- ရွှေ့ပြောင်းရေး အစီအစဉ်က မလိုအပ်ရင် တူညီတဲ့ ထိန်းသိမ်းမှု ပြူတင်းပေါက်မှာ တူညီတဲ့ topology၊ သဘောတူညီချက် အချိန်ဆွဲမှု၊ လုပ်ဆောင်ချက် အလုပ်ချိန်ကို ပြောင်းဖို့ ရှောင်ရှားပါ။
- လုပ်ငန်းဆိုင်ရာ အပြောင်းအလဲများအတွက် ငွေပေးချေမှု ဟက်ရှ်နှင့် ဘလော့ အမြင့်များကို မှတ်တမ်းတင်ပါ။

ကြည့်ပါ။ [အပူပြန်တင်ခြင်း](/my/guide/advanced/hot-reload.md) နှင့် [ကိုက်ညီမှု Matrix](/my/reference/compatibility-matrix.md).

## စွမ်းဆောင်ရည် သုံးသပ်ချက်များ {#capacity-reviews}

- validator count, hardware, network placement, workload mix, or consensus parameters တွေ ပြောင်းလဲတဲ့အခါ load checks ကိုပြန်လည် run လုပ်ပါ။
- အပူချိန်၊ တည်ငြိမ်မှုအခြေအနေနဲ့ မျှော်မှန်းထားတဲ့ အမြင့်ဆုံးဝန်ဆောင်မှုကို အတိုချိုအကောင်းဆုံးဖြစ်စဉ်ထုတ်လုပ်မှုနမူနာကို အားကိုးခြင်းအစား တိုင်းတာပါ။
- လက်ခံတဲ့ ထုတ်ကုန်ကို ကတိပြုထားတဲ့ ထုတ်ကုန်နဲ့ တန်းစီအနက်နဲ့ နှိုင်းယှဉ်ပါ။ ပေးပို့ထားတာက TPS ကတိပေးထားတဲ့ TPS ကိုကျော်ပြီး တန်းစီတွေ တိုးလာရင် ကွန်ရက်ဟာ ၎င်းရဲ့ ရေရှည်တည်တံ့တဲ့ အဝှေ့အလွှာကို ကျော်ဖြတ်သွားတာပါ။
