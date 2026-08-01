---
translation_locale: my
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

ဤအပိုဒ်သည် သင်နှင့်အတူ အလုပ်လုပ်နေစဉ် ပြဿနာများရှိပါက ကူညီရန် ရည်ရွယ်ထားပါသည်။ Iroha. တစ်ခုခု မှားသွားရင် ကျေးဇူးပြုပါ။ [သော့တွေကို စစ်ကြည့်ပါ။](#check-the-keys) ပထမဦးဆုံး။ ဒါက မကူညီဘူးဆိုရင် အဆင့်တိုင်းအတွက် ပြဿနာဖြေရှင်းနည်းကို စစ်ကြည့်ပါ။

- [တပ်ဆင်မှု ပြဿနာများ](./installation-issues.md)
- [ဖွဲ့စည်းမှု ပြဿနာများ ](./configuration-issues.md)
- [တပ်ဆင်ရေး ပြဿနာများ ](./deployment-issues.md)
- [ပေါင်းစပ်မှု ပြဿနာများ ](./integration-issues.md)

သင်တွေ့နေရတဲ့ ပြဿနာကို ဒီမှာ ဖော်ပြမထားဘူးဆိုရင် [Telegram ](https://t.me/hyperledgeriroha) မှ ဆက်သွယ်ပါ။

## သော့တွေကို စစ်ကြည့်ပါ။ {#check-the-keys}

အဓိကအချက်အလက်များ မညီမျှခြင်းကြောင့် ပြဿနာအများစု ပေါ်လာတတ်သည်။ ဒါကြောင့် ကျွန်ုပ်တို့က ဤစည်းမျဉ်းကို လိုက်နာရန် အကြံပြုကြသည်- တစ်ခုခု မှားယွင်းသွားပါက၊ ပထမဦးဆုံး အချက်အလက်များကို စစ်ဆေးပါ။

ဒီမှာ ရှင်းပြချက် တစ်ခုရှိပါသေးတယ်- အဖော်တွေရဲ့ သော့တွေက ယုံကြည်ရတဲ့ အဖော်တွေထဲက သော့တွေနဲ့ မညီတဲ့အခါ ပေါ်လာတဲ့ အမှားသတင်းတွေကို ခြားနားဖို့မဖြစ်နိုင်ဘူး ဘာလို့ဆို ဒါက အဖော်တွေရဲ့ အများသုံး သော့ကို ပွင့်လင်းမြင်သာစေမှာမို့ပါ။ ထို့ကြောင့်၊ ပတ်ဝန်းကျင်ဆိုင်ရာ ကိန်းရှင်များမှတစ်ဆင့် သတ်မှတ်ထားသော သော့များနှင့်အတူ Helm chart သို့မဟုတ် Kubernetes deployments များရှိပါက, ပိုမြင့်မားသောအဆင့် ပျက်ကွက်မှုများကို စုံစမ်းရန်မတိုင်မီ ဖွဲ့စည်းထားသော [`public_key`](/my/reference/peer-config/params.md#param-public-key), [`private_key`](/my/reference/peer-config/params.md#param-private-key) နှင့် [`trusted_peers`](/my/reference/peer-config/params.md#param-trusted-peers) တန်ဖိုးများကို နှိုင်းယှဉ်ကြည့်ပါ။

သံသယရှိရင် [ key အသစ်တစ်စုံကို ဖန်တီးပါ ](/my/guide/security/generating-cryptographic-keys.md).
