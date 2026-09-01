---
translation_locale: my
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

ဤအပိုင်းသည် Iroha နှင့် အလုပ်လုပ်နေစဉ်တွင်ပြဿနာများရှိပါက ကူညီရန် ရည်ရွယ်ထားသည်။ တစ်ခုခု မှားယွင်းသွားပါက ကျေးဇူးပြု၍ [သော့တွေကို စစ်ကြည့်ပါ။](#check-the-keys) ကိုပထမဦးဆုံးကူညီပါ။ အကယ်၍မကူညီပါက အဆင့်တစ်ခုစီအတွက်ပြဿနာဖြေရှင်းခြင်း ညွှန်ကြားချက်များကိုစစ်ဆေးပါ။

- [တပ်ဆင်မှု ပြဿနာများ](./installation-issues.md)
- [ဖွဲ့စည်းမှု ပြဿနာများ](./configuration-issues.md)
- [နေရာချထားမှု ပြဿနာများ](./deployment-issues.md)
- [ပေါင်းစပ်ရေး ကိစ္စရပ်များ](./integration-issues.md)

သင်တွေ့နေရတဲ့ ပြဿနာကို ဒီမှာ ဖော်ပြမထားဘူးဆိုရင် [အွန်လိုင်း](https://t.me/hyperledgeriroha) မှ ဆက်သွယ်ပါ။

## သော့တွေကို စစ်ကြည့်ပါ။ {#check-the-keys}

အဓိကအချက်အလက်များ မညီမျှခြင်းကြောင့် ပြဿနာအများစု ပေါ်လာတတ်သည်။ ဒါကြောင့် ကျွန်ုပ်တို့က ဤစည်းမျဉ်းကို လိုက်နာရန် အကြံပြုကြသည်- တစ်ခုခု မှားယွင်းသွားပါက၊ ပထမဦးဆုံး အချက်အလက်များကို စစ်ဆေးပါ။

Network peers' keys မပါတဲ့အခါ ပေါ်လာတဲ့ error message တွေကို ခွဲခြားဖို့မဖြစ်နိုင်ပါဘူး။ ယုံကြည်စိတ်ချရတဲ့ ကွန်ရက် အဖော်တွေရဲ့ array ထဲက key တွေကို match လုပ်လိုက်ပါ၊ အကြောင်းက ဒါက network peers ရဲ့ public key ကို ပွင့်လင်းမြင်သာစေမှာမို့ပါ။ ဒီလိုနဲ့ Helm chart တွေ (သို့) Kubernetes deployments တွေရှိရင် ပတ်ဝန်းကျင် ကိန်းရှင်တွေကနေ အဓိပ္ပါယ်ဖွင့်ထားတဲ့ keys တွေရှိတယ်ဆိုရင် configured ကို နှိုင်းယှဉ်ကြည့်ပါ။ [`public_key`](/my/reference/peer-config/params.md#param-public-key), [`private_key`](/my/reference/peer-config/params.md#param-private-key), နှင့် [`trusted_peers`](/my/reference/peer-config/params.md#param-trusted-peers) အဆင့်မြင့် ကျရှုံးမှုများကို စုံစမ်းမစခင် တန်ဖိုးများ။

သံသယရှိရင် [သော့စုံသစ်ကို ဖန်တီးပါ။](/my/guide/security/generating-cryptographic-keys.md)
