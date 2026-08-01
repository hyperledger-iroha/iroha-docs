---
translation_locale: my
translation_source: /guide/security/index.md
translation_source_hash: ec7fc2f950b007f52d837473ad7021565923e537df1d18b86055fb483cda375c
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# လုံခြုံရေး {#security}

Iroha deployment ကို sensitive data နဲ့ value တွေကို စီမံခန့်ခွဲတဲ့ စနစ်တိုင်းလိုပဲ Secure လုပ်ပါ။ Signing keys, network access, node operations, monitoring, and incident response တို့ကို ကာကွယ်ပါ။ ဒီထိန်းချုပ်မှုတွေရဲ့ လိုအပ်ချက်ကို Ledger က ဖယ်ရှားမပေးပါဘူး။

### ရေကူးရေး {#navigation}

ဒီပိုင်းမှာ သင့်ရဲ့ Iroha ကွန်ရက်ကို လုံခြုံဖို့ ရှုထောင့်အမျိုးမျိုးအကြောင်း သင်လေ့လာနိုင်ပါတယ်။ ပိုမိုသိရှိလိုပါက အောက်ပါအကြောင်းအရာများထဲက တစ်ခုကို ရွေးချယ်ပါ။

- [လုံခြုံရေးမူများ ](./security-principles):

အချက်အလက်များကို ကာကွယ်ရန်နှင့် ချိုးဖောက်မှုအန္တရာယ်ကို လျှော့ချရန် အခြေခံမူများ။

- [Virtual Private Networks](./vpn.md):

VPN ကို ပုဂ္ဂလိက (သို့) ပူးပေါင်းဆောင်ရွက်မှုများတွင် peer-to-peer, Torii နှင့် operator access များကို ကန့်သတ်ရန် အသုံးပြုပုံ။

- [လုပ်ငန်းလုံခြုံရေး ](./operational-security.md):

ဝင်ရောက်မှု၊ စောင့်ကြည့်ခြင်း၊ ဖြစ်ရပ်ကို တုံ့ပြန်ခြင်းနှင့် လုပ်ငန်းရှင် အလုပ်ရုံများအတွက် နေ့စဉ် ထိန်းချုပ်မှု။

- [လိမ်လည်မှု စောင့်ကြည့်ခြင်း ](./fraud-monitoring.md):

သံသယရှိတဲ့အလုပ်ကို ရှာဖွေဖို့နဲ့ တုံ့ပြန်မှုသက်သေတွေကို ထိန်းသိမ်းဖို့ Ledger အဖြစ်အပျက်တွေ၊ မေးမြန်းချက်တွေ၊ ခွင့်ပြုချက်တွေနဲ့ လုပ်ဆောင်တဲ့ အချက်ပြမှုတွေကို ဘယ်လိုသုံးရမလဲ။

- [Password Security ](./password-security.md):

စကားဝှက် entropy, ခိုင်မာတဲ့ စကားဝှက်ဆောက်လုပ်မှု, ပြီးတော့ ပုံမှန် ကျရှုံးမှု mode တွေပါ။

- [Public Key Cryptography](./public-key-cryptography.md): အများသုံးသော သော့များ

အများသုံးသော့ကုဒ်သွင်းခြင်း၊ လက်မှတ်များနှင့် စစ်ဆေးသော ဆက်သွယ်မှု။

  - [Cryptographic Key များကို ထုတ်လုပ်ခြင်း ](./generating-cryptographic-keys.md):

`kagami` ဖြင့်ထောက်ပံ့သော cryptographic key များကိုထုတ်လုပ်ပါ။

  - [Cryptographic Keys ကို သိုလှောင်ခြင်း ](./storing-cryptographic-keys.md):

တပ်ဆင်မှုအတွက် သင့်တော်တဲ့ layered controls တွေကို အသုံးပြုပြီး cryptographic keys ကို သိမ်းဆည်းပါ။
