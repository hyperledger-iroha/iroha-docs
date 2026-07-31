---
translation_locale: my
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

ဤအပိုဒ်သည် သင်နှင့်အတူ အလုပ်လုပ်နေစဉ်တွင် ပြဿနာများရှိပါက ကူညီရန် ရည်ရွယ်ထားသည်။
Iroha. တစ်ခုခု မှားသွားရင် ကျေးဇူးပြုပြီး [သော့တွေကို စစ်ကြည့်ပါ။](#check-the-keys)
ပထမဦးဆုံး။ ဒါက မကူညီဘူးဆိုရင်
အဆင့်တိုင်းမှာ

- [တပ်ဆင်မှု ပြဿနာများ](./installation-issues.md)
- [ဖွဲ့စည်းမှု ပြဿနာများ](./configuration-issues.md)
- [နေရာချထားမှု ပြဿနာများ](./deployment-issues.md)
- [ပေါင်းစပ်ရေး ပြဿနာများ](./integration-issues.md)

သင်တွေ့နေရတဲ့ ပြဿနာကို ဒီမှာ ဖော်ပြမထားဘူးဆိုရင်
[Telegram ကို](https://t.me/hyperledgeriroha).

## သော့တွေကို စစ်ကြည့်ပါ။ {#check-the-keys}

အများစုက မတူညီတဲ့ သော့တွေကြောင့် ဖြစ်ပေါ်တာပါ။ ဒါကြောင့် အကြံပြုတာက
ဒီစည်းမျဉ်းကို လိုက်နာဖို့: **တစ်ခုခု မှားသွားရင် သော့တွေကို စစ်ကြည့်ပါ။
ပထမဦးဆုံး**.

ဒီမှာရှင်းပြချက်လေးပါ- အမှားကို ခွဲခြားလို့မရဘူး
တူညီသူတွေရဲ့ သော့တွေ array ထဲက သော့တွေနဲ့ မတူတဲ့အခါ ပေါ်လာတဲ့ သတင်းစကားတွေ
သင့်အဖော်တွေရဲ့ အများသုံး သော့ကို ဖော်ထုတ်နိုင်လို့ပါ။
ပတ်ဝန်းကျင်ကနေ အဓိပ္ပါယ်သတ်မှတ်ထားတဲ့ သော့တွေနဲ့ Helm Chart (သို့) Kubernetes deployments တွေရှိတယ်
variable တွေကို နှိုင်းယှဉ်ကြည့်ပါ
[`public_key`](/my/reference/peer-config/params.md#param-public-key),
[`private_key`](/my/reference/peer-config/params.md#param-private-key), နှင့်
[`trusted_peers`](/my/reference/peer-config/params.md#param-trusted-peers)
အဆင့်မြင့် ကျရှုံးမှုများကို စုံစမ်းမစခင် တန်ဖိုးများ။

သံသယရှိရင် [သော့စုံသစ်ကို ဖန်တီးပါ။](/my/guide/security/generating-cryptographic-keys.md).
