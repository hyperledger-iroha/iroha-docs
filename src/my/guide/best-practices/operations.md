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
- Dashboard က လက်ခံတဲ့ throughput၊ ပယ်ချလိုက်တဲ့ throughput, protocol finalisation latency, queue depth, queue saturation, view changes, dropped consensus messages နဲ့ storage pressure တွေကို သုံးပါတယ်။
- Status point-in-time data views များ၊ metrics scrapes များ၊ logs များနှင့် deployment configuration များကို incident သို့မဟုတ် benchmark artifact set တစ်ခုတည်းတွင် ထိန်းသိမ်းပါ။
- အတန်းတွေ ဆက်လက် ကြီးထွားလာတာ၊ မမျှော်လင့်တဲ့ ပယ်ချမှု မြင့်တက်မှု၊ ရပ်တန့်နေတဲ့ ဘလော့ အမြင့်၊ ရှုခင်း ပြောင်းလဲခြင်းနဲ့ ကွန်ရက် အဖော်တွေရဲ့ ကျန်းမာရေး အပြောင်းအလဲတွေကို သတိပေးပါ။

[စွမ်းဆောင်ရည်နှင့် မက်ထရစ်များ](/my/guide/advanced/metrics.md) ကို ကြည့်ပါ။

## လမ်းလျှောက်စာအုပ်များ {#runbooks}

- Network peer restart, Torii degradation, key compromise, permission errors, fee sponsor depletion, stuck queues နဲ့ network partition ရောဂါလက္ခဏာတွေအတွက် runbook တွေရေးပါ။
- စာရေးခြင်း လုပ်ငန်းများမတိုင်မီ တိကျသော ဖတ်ရှုမှုသာ စစ်ဆေးမှုကို ထည့်သွင်းပါ၊ အထူးသဖြင့် ကွန်ရက် တူညီသူ မှတ်ပုံတင်မှု၊ ခွင့်ပြုချက်ပေးခြင်း၊ ပြောင်မြောက်မှု ပြောင်းလဲမှုများအတွက်ပါ။
- အရေးပေါ်ဆက်သွယ်မှုတွေနဲ့ တိုးတက်ရေး စည်းမျဉ်းတွေကို Docs repo ထဲမှာ ထည့်သွင်းထားရင် သီးသန့် လုပ်ငန်းဆိုင်ရာ ဒေတာတွေ ပါဝင်ပါက ထားပါ။
- ဖြစ်ရပ်တိုင်း၊ လေ့ကျင့်မှုတိုင်း၊ အကြီးမားဆုံး အဆင့်မြှင့်မှုတိုင်းနောက်မှာ လမ်းညွှန်စာအုပ်တွေကို စစ်ဆေးပါ။

[လုပ်ငန်းလုံခြုံရေး](/my/guide/security/operational-security.md) ကို ကြည့်ပါ။

## Backup နှင့် ပြန်လည်ထူထောင်ခြင်း {#backups-and-recovery}

- Network peer storage ကို deployment အတွက်လိုအပ်တဲ့ recovery point ကိုအလိုက် back up လုပ်ပါ။ non-production host တွေမှာ validate restores လုပ်ပါ။
- လက်မှတ်ရေးထိုးထားတဲ့ blockchain မျိုးဆက်ကို ထိန်းသိမ်း၊ metadata ထုတ်လွှတ်ခြင်း၊ ကွန်ရက် peer config နဲ့ key custody မှတ်တမ်းတွေကို validator host မပါရှိတောင် ပြန်လည်ရရှိနိုင်အောင်ပါ။
- ပြန်လည်ထူထောင်ရေး လုပ်ငန်းစဉ်တစ်ခုက blockchain မျိုးဆက်ကနေ ပြန်တည်ဆောက်တာ၊ အချိန်ကာလအတွင်း ဒေတာအမြင်ကနေ ပြန်လည်ဖန်တီးတာ (သို့) ကျရှုံးတဲ့ ကွန်ရက်တူညီသူကို ကိုယ်ပိုင်လက္ခဏာသစ်နဲ့ အစားထိုးတာဆိုတာကို မှတ်တမ်းတင်ပါ။
- ထုတ်လုပ်မှုဖြစ်စဉ်တစ်ခုအတွင်းမှာ ပထမဆုံးအကြိမ် ပြန်လည်ပြုပြင်တဲ့ လုပ်ငန်းစဉ်တွေကို ဘယ်တော့မှ မစမ်းသပ်ပါနဲ့။

## အပြောင်းအလဲ စီမံခန့်ခွဲမှု {#change-management}

- On-chain configuration အပြောင်းအလဲတွေကို review, preflight read, authorization နဲ့ post-change verification လိုတဲ့ ငွေကြေးပူးပေါင်းဆောင်ရွက်မှုအဖြစ် မှတ်ယူပါ။
- Network peer binary upgrades တွေကို compatibility plan နဲ့ rollback decision point နဲ့ ဖြန့်ချိပေးပါ။
- Network peer topology, consensus timing နဲ့ application workload တွေကို maintenance window တစ်ခုတည်းမှာ ပြောင်းဖို့ ရှောင်ကြဉ်ပါ။ ရွှေ့ပြောင်းရေး အစီအစဉ်က မလိုအပ်ဘူးဆိုရင်ပေါ့။
- ငွေလဲလှယ်မှု cryptographic hashes တွေကို မှတ်တမ်းတင်ပြီး လုပ်ဆောင်ချက် အပြောင်းအလဲများအတွက် ဘလော့အမြင့်တွေကို မှတ်တမ်းတင်ပါ။

[အပူပြန်တင်ခြင်း](/my/guide/advanced/hot-reload.md) နှင့် [ကိုက်ညီမှု Matrix](/my/reference/compatibility-matrix.md) ကိုကြည့်ပါ။

## စွမ်းဆောင်ရည် သုံးသပ်ချက်များ {#capacity-reviews}

- validator count, hardware, network placement, workload mix, or consensus parameters တွေ ပြောင်းလဲတဲ့အခါ load checks ကိုပြန်လည် run လုပ်ပါ။
- အပူချိန်၊ တည်ငြိမ်မှုအခြေအနေနဲ့ မျှော်မှန်းထားတဲ့ အမြင့်ဆုံးဝန်ဆောင်မှုကို အတိုချိုအကောင်းဆုံးဖြစ်စဉ်ထုတ်လုပ်မှုနမူနာကို အားကိုးခြင်းအစား တိုင်းတာပါ။
- လက်ခံရရှိသော ထုတ်လွှင့်မှုများကို နောက်ဆုံးထုတ်လွှင့်မှုနှင့် အတန်းအနက်ကို နှိုင်းယှဉ်ပါ။ ပေးပို့ထားသည့် TPS သည် နောက်ဆုံးထုတ် TPS ကိုကျော်ပြီး အတန်းများ တိုးလာပါက ကွန်ရက်သည် ၎င်း၏ ရေရှည်တည်တံ့သော လုပ်ဆောင်မှု ကန့်သတ်ချက်ကို ကျော်ဖြတ်ခဲ့သည်။
