---
translation_locale: my
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ကိုက်ညီမှု Matrix {#compatibility-matrix}

ကိုက်ညီမှု မေထရစ်က Cross-SDK လက်ရှိအခြေအနေအတွက် စင်္ကြန်အကာအကွယ် Iroha 3 Docs set ကို default အနေနဲ့ စာမျက်နှာက pinned ကနေထုတ်လုပ်ထားတဲ့ bundled point-in-time data view ကို load လုပ်ပေးပါတယ်။ [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha) ပြင်ဆင်ခြင်း။

Matrix က အောက်ပါအတိုင်း ပါဝင်ပါတယ်။

- ပထမ စာပိုဒ်ထဲက ဇာတ်လမ်းများ
- SDKs ကျန်သော စာကြောင်းများတွင်
- Covered, failed နှင့် missing data များအတွက် status symbols များ

Refresh workflow ကနေ စစ်ဆေးထားတဲ့ ရလဒ်တွေပဲ Covered သို့မဟုတ် Failed အဖြစ် အစီရင်ခံထားရတာပါ။ pinned revision အတွက် အထောက်အထားမရှိတဲ့ စင်္ကားများဟာ အခြား Source revision တစ်ခုမှ ရလဒ်တွေကို အမွေခံရမယ့်အစား ပျောက်ဆုံးနေတဲ့ ဒေတာအဖြစ် ပြသတယ်။

<CompatibilityMatrixTable />

::: info
`VITE_COMPAT_MATRIX_URL` ကို ချိတ်ဆက်ထားသော point-in-time data view ကို လိုက်ဖက်တဲ့ live backend ဖြင့် override လုပ်ရန်သာ သတ်မှတ်ပါ။ ထိုကိန်းရှင်မရှိရင် စာမျက်နှာကို load `src/public/compat-matrix.json` ဖြစ်စေသည်။
:::
