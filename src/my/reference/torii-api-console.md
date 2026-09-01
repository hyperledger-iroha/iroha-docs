---
translation_locale: my
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: nllb-200-ct2

aside: false
pageClass: torii-api-console-page
---

# Torii API Console {#torii-api-console}

လမ်းကြောင်းများကို စစ်ဆေးရန်၊ စမ်းသပ်မှုတောင်းဆိုချက်များ ပို့ရန်၊ curl အမိန့်များကို ကူးယူရန်နှင့် ဖောက်သည်ကုဒ်ကို ထုတ်လုပ်ရန် ပြေးဆွဲနေသော Torii API အဆုံးမှတ်မှ တိုက်ရိုက် OpenAPI စာရွက်စာတမ်းကို အသုံးပြုပါ။

<ToriiApiConsole />

## လိုအပ်ချက်များ {#requirements}

- နိုင်ငံတကာ Torii API အဆုံးသတ်မှတ်ချက်က ဖေါ်ပြရမယ်။ `/openapi.json`.
- Browser စမ်းသပ်မှုမှာ CORS က ဒီ doc ကို origin လုပ်ခွင့်ပြုဖို့ လိုအပ်ပါတယ်။
- Browser က API endpoint ကို တိုက်ရိုက်ရောက်ရှိနိုင်ရပါမယ်။
- ကုဒ်ထုတ်လုပ်မှု လိုအပ်ချက် Node.js, pnpm, Java ဆော့ဝဲ အကောင်အထည်ဖော်မှု ပတ်ဝန်းကျင်ကို OpenAPI Generator ကို။

Console ကို default ကနေ `https://taira.sora.org`. ဒေသတွင်းဖွံ့ဖြိုးတိုးတက်ရေးမှာ ပုံမှန်အားဖြင့် `http://127.0.0.1:8080` သင် ပြေးတဲ့အခါ Torii သင့်စက်ပေါ်မှာပါ။

## Taira ကို အရင် စမ်းကြည့်ပါ။ {#try-taira-first}

Client ကို မဖန်တီးခင် အများပြည်သူ OpenAPI စာရွက်စာတမ်းကို သင့်စက်ကနေ ရယူနိုင်တာကို စစ်ဆေးပါ။

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

ထို့နောက် `https://taira.sora.org/openapi.json` ကို console ထဲသို့ paste လုပ်ပြီး `GET /status`, `GET /v1/domains` သို့မဟုတ် `GET /v1/assets/definitions` ကဲ့သို့သော read-only route တစ်ခုကို စမ်းပါ။ သင့်ရဲ့ software စီမံခန့်ခွဲမှု ပတ်ဝန်းကျင်မှ လျှို့ဝှက်ချက်များကို ထည့်သွင်းတဲ့ SDK (သို့) CLI ဖောက်သည်အတွက် လက်မှတ်ထိုးထားသော ငွေကြေးလွှဲပြောင်းခြင်းနှင့် private key စီးဆင်းမှုကို သိမ်းဆည်းပါ။

## ထုတ်လုပ်သော ဖောက်သည်များ {#generated-clients}

Generator command မှာ console က load လုပ်နေတဲ့ live OpenAPI စာရွက်စာတမ်းကိုပဲ သုံးပါတယ်။ ဒါက JSON operator, explorer, app နဲ့ telemetry routes တွေအတွက် အသုံးဝင်ပါတယ်။

လက်မှတ်ရေးထိုးထားတဲ့ blockchain ledger ငွေပေးချေမှုအတွက်၊ လက်မှတ်ရေးဆွဲထားသော မေးမြန်းချက်များနှင့် Norito - ဒေသခံ အသုံးဝင်ဝန်ဆောင်မှုများအတွက် တရားဝင် Iroha SDKs ကို ဦးစားပေးပါ။ OpenAPI ဖောက်သည်များသည်လက်မှတ်များကိုစုဆောင်းခြင်း၊ အကောင့်အဓိကအချက်အလက်များကို စီမံခန့်ခွဲခြင်း သို့မဟုတ် သင့်အတွက် Norito ငွေလဲလှယ်မှုအဖွဲ့အစည်းများကို ကုဒ်မသွင်းခြင်းမဟုတ်ပါ။

OpenAPI Generator ကိုထောက်ပံ့တဲ့ generator တစ်ခုစီကို စစ်ဆေးဖို့ Run:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
