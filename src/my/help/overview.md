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

အကျဉ်းချုပ်ရှင်းပြရလျှင် peer များ၏ ကီးများသည် ယုံကြည်ထားသော peer အစုရှိ ကီးများနှင့် မကိုက်ညီသောအခါ ထွက်လာသည့် အမှားစာများကို ခွဲခြားပြသ၍ မရပါ၊ အကြောင်းမှာ ထိုသို့ပြသခြင်းက peer များ၏ အများသုံးကီးကို ဖော်ထုတ်မည်ဖြစ်သောကြောင့် ဖြစ်သည်။ ထို့ကြောင့် ကီးများကို ပတ်ဝန်းကျင်တန်ဖိုးများဖြင့် သတ်မှတ်ထားသော Helm chart သို့မဟုတ် Kubernetes deployment များ ရှိလျှင် အဆင့်မြင့်ချို့ယွင်းမှုများကို မစုံစမ်းမီ သတ်မှတ်ထားသော [`public_key`](/my/reference/peer-config/params.md#param-public-key)၊ [`private_key`](/my/reference/peer-config/params.md#param-private-key) နှင့် [`trusted_peers`](/my/reference/peer-config/params.md#param-trusted-peers) တန်ဖိုးများကို နှိုင်းယှဉ်ပါ။

သံသယရှိရင် [သော့စုံသစ်ကို ဖန်တီးပါ။](/my/guide/security/generating-cryptographic-keys.md)
