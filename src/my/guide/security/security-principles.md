---
translation_locale: my
translation_source: /guide/security/security-principles.md
translation_source_hash: 20139011c663a0bca6f9e486ef81f698370c34f8f02319317805b0d1dfb049c7
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# လုံခြုံရေး မူဝါဒများ {#security-principles}

Iroha ledger သည် လက်မှတ်ရေးထိုးထားသော ညွှန်ကြားချက်များကို စစ်ဆေးပြီး ခွင့်ပြုချက်များကို အသုံးပြုသည်။ ၎င်းသည် private key များ၊ host များ၊ application များ၊ operator workstation များ သို့မဟုတ် governance လုပ်ငန်းစဉ်များကို လုံခြုံစေခြင်း မရှိပါ။ deployment က ထိုစနစ်များကို ကာကွယ်ရမည်။

Iroha ကွန်ရက်ကို ဒီဇိုင်းထုတ်ပြီး လည်ပတ်တဲ့အခါ ဒီအယူအဆတွေကို အသုံးပြုပါ။

## အာဏာပိုင်များကို လုံခြုံရေး နယ်နိမိတ်အဖြစ် ဆက်ဆံပါ {#treat-authority-as-a-security-boundary}

- ပုဂ္ဂလိက သော့ကို ထိန်းချုပ်တဲ့ တစ်ဦးဦး (သို့) လုပ်ငန်းစဉ်ဟာ အဲဒီသော့အတွက် တာဝန်ပေးထားတဲ့ အာဏာနဲ့ လုပ်ဆောင်နိုင်ပါတယ်။
- ပတ်ဝန်းကျင်နဲ့ လုပ်ငန်းတာဝန်တိုင်းအတွက် သီးခြားအာဏာပိုင်ကို ပေးပါ။
- production key များနှင့် recovery key များကို ပုံမှန် development နှင့် test credential များမှ ခွဲထားပါ။
- အာဏာတစ်ခုစီရဲ့ ပိုင်ရှင် ဘယ်သူလဲ၊ လက်မှတ်ထိုးသူကို ဘယ်မှာ ထားထားသလဲ၊ ဒါကို ဘယ်လို အစားထိုး (သို့) ရုပ်သိမ်းရမလဲဆိုတာကို မှတ်တမ်းတင်ပါ။

[Public-Key Cryptography](./public-key-cryptography.md) နှင့် [Storing Cryptographic Keys](./storing-cryptographic-keys.md) ကိုကြည့်ပါ။

## အနည်းဆုံးအခွင့်အရေးကို အသုံးချပါ {#apply-least-privilege}

- Role တစ်ခုအတွက် လိုအပ်တဲ့ Iroha ခွင့်ပြုချက်တွေ၊ host access နဲ့ network access တွေကိုသာ ပေးပါ။
- ပုံမှန် transaction signing ကို governance၊ deployment နှင့် recovery authority များမှ ခွဲထားပါ။
- validator membership၊ privileged permission များ သို့မဟုတ် တန်ဖိုးမြင့် asset များကို သက်ရောက်နိုင်သော ပြောင်းလဲမှုများအတွက် သီးခြားသုံးသပ်သူ၏ approval ကို တောင်းဆိုပါ။
- အခန်းကဏ္ဍ ပြောင်းလဲပြီးနောက် ဝင်ရောက်မှုကို ပြန်လည်သုံးသပ်ပြီး မလိုတော့တဲ့ ဝင်ရောက်မှုတွေကို ဖယ်ရှားပါ။

## ကာကွယ်ရေး အလွှာများ အသုံးပြုခြင်း {#use-layers-of-protection}

- လက်မှတ်ရေးထိုးသူများ၊ အက်ပ်များ၊ လည်ပတ်ရေးစနစ်များ၊ ကွန်ရက်များနှင့် ရုပ်ပိုင်းဝင်ရောက်မှုကို ကာကွယ်ပါ။ ထိန်းချုပ်မှုတစ်ခုတည်းကို မမှီခိုပါ။
- deployment အတွက် လိုအပ်သော Torii၊ peer၊ monitoring နှင့် application route များကိုသာ ဖွင့်ထားပါ။
- administrative access နှင့် sensitive data အတွက် authenticated၊ encrypted channel များကို အသုံးပြုပါ။
- စနစ်တွေကို patched ထားပြီး deployment မသုံးတဲ့ ဝန်ဆောင်မှုတွေကို ပိတ်ထားပါ။
- secret များကို source control၊ command line၊ log၊ ticket၊ chat နှင့် public documentation များထဲတွင် မထည့်ပါနှင့်။

## အသုံးချမှုများကို ပြန်လည်သုံးသပ်နိုင်အောင် လုပ်ပေးပါ။ {#make-deployments-reviewable}

- ဗားရှင်းထိန်းချုပ်မှုမှာ လျှို့ဝှက်မဟုတ်တဲ့ ဖွဲ့စည်းမှုနဲ့ ဖြန့်ဖြူးခြင်း အလိုအလျောက်ကို ထိန်းထားပါ။
- binary၊ configuration၊ genesis material၊ validator membership၊ permission နှင့် public route ပြောင်းလဲမှုများကို review လုပ်ပါ။
- ဖြန့်ချိခြင်းမတိုင်မီ ထုတ်ပြန်မှုလက်ရာများကို စစ်ဆေးပါ။ ခွင့်ပြုထားတဲ့ဗားရှင်းများနှင့် hash များကို မှတ်တမ်းတင်ပါ။
- ထုတ်လုပ်မှုမှာ လည်ပတ်မယ့် တိကျတဲ့ binary နဲ့ configuration ပေါင်းစပ်မှုကို စမ်းသပ်ပါ။
- Network ရဲ့ deterministic behaviour ကို ထိန်းထားပါ။ Hardware အရှိန်မြှင့်မှုဟာ peer-visible ရလဒ်တွေကို မပြောင်းလဲစေရ။

## အထောက်အထားကို စောင့်ကြည့်ကာ ထိန်းသိမ်းခြင်း {#monitor-and-preserve-evidence}

- peer health၊ consensus progress၊ permission change၊ privileged instruction၊ authentication failure နှင့် မမျှော်လင့်သော configuration change များကို စောင့်ကြည့်ပါ။
- ထိခိုက်ခံရတဲ့ အိမ်ရှင်ကို မမှီခိုတဲ့ စနစ်ကို အရေးပါတဲ့ သတိပေးချက်တွေ ပို့ပါ။
- သက်ဆိုင်ရာ logs များ၊ ledger references များ၊ configuration snapshots များနှင့် transaction hash များကို ယုံကြည်စိတ်ချရတဲ့ အချိန်တံဆိပ်များဖြင့် ထိန်းသိမ်းပါ။
- ပျောက်နေတဲ့ စောင့်ကြည့်မှု ဒေတာကို စုံစမ်းစစ်ဆေးဖို့ လိုအပ်တဲ့ လုပ်ငန်းပြဿနာတစ်ခုအဖြစ် ဆက်ဆံပါ။

## မစတင်မီ ပြန်လည်ထူထောင်ရန် ပြင်ဆင်ပါ {#prepare-recovery-before-launch}

- ဖြစ်ရပ်ကို ဘယ်သူက ကြေညာနိုင်လဲ၊ ဘယ်သူက ပြန်လည်ထူထောင်ရေး လုပ်ဆောင်ချက်တွေကို အတည်ပြုနိုင်လဲဆိုတာ သတ်မှတ်ပါ။
- Backup, Restore, Key Replacement, Permission Revocation နဲ့ peer recovery လုပ်နည်းတွေကို စမ်းသပ်ပါ။
- incident တစ်ခုအတွင်း trusted release artifact များ၊ configuration၊ genesis record များနှင့် inventory များကို အသုံးပြုနိုင်အောင် ထားပါ။
- read operation များနှင့် monitoring ကို အရင် restore လုပ်ပါ။ ပြန်လည်ထူထောင်ထားသော network နှင့် dependent application များက စစ်ဆေးမှုများကို အောင်မြင်ပြီးမှသာ write operation များကို ပြန်လည်စတင်ပါ။
- ဖြစ်ရပ်တိုင်းကို စစ်ဆေးပြီး ထိန်းချုပ်မှုတွေ၊ အလိုအလျောက်လုပ်ခြင်းနဲ့ လေ့ကျင့်ခန်းတွေကို မွမ်းမံပါ။

::: warning

Ledger action များသည် နောက်ပြန်မပြောင်းနိုင်သော action ဖြစ်နိုင်သည်။ recovery သို့မဟုတ် governance transaction မတင်မီ ကြိုတင် review လုပ်ထားသော လုပ်ငန်းစဉ်များကို လိုက်နာပြီး လိုအပ်သော approval များကို ရယူပါ။

:::

[ Operational Security](./operational-security.md) နှင့် [Release Readiness ](../best-practices/release-readiness.md) တို့ကို ဆက်လုပ်ပါ။
