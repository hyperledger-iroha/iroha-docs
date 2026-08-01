---
translation_locale: my
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ကိုက်ညီမှု Matrix {#compatibility-matrix}

Compatibility Matrix က လက်ရှိ Iroha 3 Docs set အတွက် cross-SDK စင်တီယာရိုင်းအကာအကွယ်ကိုပြသသည်။ အလိုလျောက်အားဖြင့်, စာမျက်နှာသည် pinned [ `hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha) ပြင်ဆင်မှုမှထုတ်လုပ်ထားသော bundled snapshot ကိုထည့်သွင်းသည်။

Matrix က အောက်ပါအတိုင်း ပါဝင်ပါတယ်။

- ပထမ စာပိုဒ်ထဲက ဇာတ်လမ်းများ
- SDKs ကျန်သော စာကြောင်းများတွင်
- Covered, failed နှင့် missing data များအတွက် status symbols များ

Refresh workflow ကနေ စစ်ဆေးထားတဲ့ ရလဒ်တွေပဲ Covered သို့မဟုတ် Failed အဖြစ် အစီရင်ခံထားရတာပါ။ pinned revision အတွက် အထောက်အထားမရှိတဲ့ စင်္ကားများဟာ အခြား Source revision တစ်ခုမှ ရလဒ်တွေကို အမွေခံရမယ့်အစား ပျောက်ဆုံးနေတဲ့ ဒေတာအဖြစ် ပြသတယ်။

<CompatibilityMatrixTable />

::: info
`VITE_COMPAT_MATRIX_URL` ကို ချိတ်ဆက်ထားတဲ့ snapshot ကို လိုက်ဖက်တဲ့ live backend နဲ့ override လုပ်ဖို့သာ သတ်မှတ်ပါ။ အဲဒီ variable ကင်းမဲ့ရင် စာမျက်နှာဟာ `src/public/compat-matrix.json` ကို load လုပ်ပါတယ်။
:::
