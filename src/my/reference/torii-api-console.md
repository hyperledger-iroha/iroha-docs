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

လမ်းကြောင်းများကို စစ်ဆေးရန်၊ စမ်းသပ်မှုတောင်းဆိုချက်များ ပေးပို့ရန်၊ curl အမိန့်များကို ကူးယူရန်နှင့် ဖောက်သည်ကုဒ်ကို ထုတ်လုပ်ရန် ပြေးဆွဲနေသော Torii အဆုံးမှတ်မှ တိုက်ရိုက် OpenAPI စာရွက်စာတမ်းကို အသုံးပြုပါ။

<ToriiApiConsole />

## လိုအပ်ချက်များ {#requirements}

- Torii အဆုံးသတ်မှတ်ချက်မှာ `/openapi.json` ကို ဖော်ပြရပါမယ်။
- Browser စမ်းသပ်မှုမှာ CORS က ဒီ doc ကို origin လုပ်ခွင့်ပြုဖို့ လိုအပ်ပါတယ်။
- Browser က Endpoint ကို တိုက်ရိုက်ရောက်ရှိနိုင်ဖို့ လိုပါတယ်။
- ကုဒ်ထုတ်လုပ်မှု လိုအပ်ချက် Node.js, pnpm, ပြီးတော့ Java Runtime ကို OpenAPI Generator ကို။

Console ကို default ကနေ `https://taira.sora.org`. ဒေသတွင်းဖွံ့ဖြိုးတိုးတက်ရေးမှာ ပုံမှန်အားဖြင့် `http://127.0.0.1:8080` သင် ပြေးတဲ့အခါ Torii သင့်စက်ပေါ်မှာပါ။

## Taira ကို အရင် စမ်းကြည့်ပါ။ {#try-taira-first}

Client ကို မဖန်တီးခင် အများပြည်သူ OpenAPI စာရွက်စာတမ်းကို သင့်စက်ကနေ ရယူနိုင်တာကို စစ်ဆေးပါ။

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

ပြီးရင် paste လုပ်ပါ။ `https://taira.sora.org/openapi.json` Console ထဲကို ဝင်ပြီး read only route ကို စမ်းကြည့်ပါ။ ဥပမာ `GET /status`, `GET /v1/domains`, ဒါမှမဟုတ် `GET /v1/assets/definitions`. လက်မှတ်ရေးထိုးထားသော ငွေပေးချေမှုနှင့် ပုဂ္ဂလိက သော့စီးကြောင်းများကို SDK ဒါမှမဟုတ် CLI သင့်ရဲ့ Runtime ပတ်ဝန်းကျင်က လျှို့ဝှက်ချက်တွေကို တင်တဲ့ ဖောက်သည်ပါ။

## ထုတ်လုပ်သော ဖောက်သည်များ {#generated-clients}

Generator command မှာ console က load လုပ်နေတဲ့ live OpenAPI စာရွက်စာတမ်းကိုပဲ သုံးပါတယ်။ ဒါက JSON operator, explorer, app နဲ့ telemetry routes တွေအတွက် အသုံးဝင်ပါတယ်။

လက်မှတ်ရေးထိုးထားသော စာရင်းအင်းလုပ်ငန်းများ၊ လက်မှတ်ရေးဆွဲထားသော မေးမြန်းချက်များနှင့် Norito - ဒေသခံ အသုံးဝင် ဝန်ဆောင်မှုများအတွက် တရားဝင် Iroha SDKs ကို ဦးစားပေးပါ။ OpenAPI ဖောက်သည်များသည်လက်မှတ်များကိုစုဆောင်းခြင်း၊ အကောင့်ဖိုင်များကို စီမံခန့်ခွဲခြင်း သို့မဟုတ် Norito ငွေချေးငွေအဖွဲ့အစည်းများကို သင်အတွက်ကုဒ်မပေးခြင်းမရှိပါ။

OpenAPI Generator ကိုထောက်ပံ့တဲ့ generator တစ်ခုစီကို စစ်ဆေးဖို့ Run:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
