---
translation_locale: my
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ကိုက်ညီမှု Matrix {#compatibility-matrix}

Compatibility Matrix က Cross-SDK လက်ရှိ အခြေအနေများအတွက် စင်္ကြံအကာအကွယ်
Iroha 3 Docs set. default အနေနဲ့ စာမျက်နှာက ထုတ်လုပ်ထားတဲ့ snapshot ကို load လုပ်ပေးပါမယ်။
ပိတ်ထားတဲ့အပိုင်းကနေ [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha)
ပြန်လည်သုံးသပ်ခြင်း။

Matrix က အောက်ပါအတိုင်း ပါဝင်ပါတယ်။

- **ပုံပြင်များ** ပထမ အပိုင္း
- **SDKs** ကျန်တဲ့ အတန်းတွေပေါ်မှာ
- **အခြေအနေ သင်္ကေတ** Covered, failed နဲ့ missing data တွေအတွက်

ပြန်လည်ဆန်းသစ်ရေး အလုပ်ဖြစ်စဉ်မှ စစ်ဆေးသော ရလဒ်များသာ ဖော်ပြထားသည်
မအောင်မြင်နိုင်ခဲ့ပါ။ ပိတ်ထားတဲ့ ပြင်ဆင်မှုအတွက် အထောက်အထားမရှိတဲ့ ဇာတ်ညွှန်းတွေကို
နောက်တစ်ခုမှ အရင်းအမြစ် ပြင်ဆင်မှုမှ ရလဒ်များကို အမွေရယူခြင်းထက် ပျောက်ဆုံးနေသော ဒေတာများ။

<CompatibilityMatrixTable />

::: info
Set `VITE_COMPAT_MATRIX_URL` အစုလိုက် snapshot ကို
backend ကိုက်ညီအောင်လုပ်ပါ။ အဲဒီ variable မပါဘဲ စာမျက်နှာကို load
`src/public/compat-matrix.json`.
:::
