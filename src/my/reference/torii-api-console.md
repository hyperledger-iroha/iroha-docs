---
translation_locale: my
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: nllb-200-ct2

aside: false
pageClass: torii-api-console-page
---

# Torii API ကွန်စောလ် {#torii-api-console}

Live ကို သုံးပါ။ OpenAPI ပြေးနေသော စာရွက်စာတမ်း Torii စစ်ဆေးရေးလမ်းကြောင်းများအတွက် နောက်ဆုံးမှတ်တိုင်၊
စမ်းသပ်မှုတောင်းဆိုချက်များ ပို့ပေးခြင်း၊ ကူးယူခြင်း curl commands တွေကို လုပ်ပြီး client code ကို ထုတ်ပေးတယ်။

<ToriiApiConsole />

## လိုအပ်ချက်များ {#requirements}

- နိုင်ငံခြားရေး Torii အဆုံးအသတ်မှတ်ချက်က ထုတ်လွှင့်ဖို့လိုတယ်။ `/openapi.json`.
- Browser စမ်းသပ်မှု လိုအပ်ချက် CORS ဒီ Docs ကို Origin လုပ်ခွင့်ပြုဖို့ပါ။
- ဘရာဆာဟာ အဆုံးအမှတ်ကို တိုက်ရိုက် ရောက်ရှိနိုင်ဖို့ လိုပါတယ်။
- ကုဒ်ထုတ်လုပ်မှု လိုအပ်ချက် Node.js, pnpm, Java Runtime ကို OpenAPI
  Generator ကို။

Console ကို default လုပ်ထားသည် `https://taira.sora.org`. ဒေသတွင်း ဖွံ့ဖြိုးတိုးတက်မှု
နှင့်အတူအလုပ်များ `http://127.0.0.1:8080` ပြေးတဲ့အခါ Torii သင့်စက်ပေါ်မှာပါ။

## စမ်းကြည့်ပါ။ Taira ပထမ {#try-taira-first}

ဖောက်သည်ကို မဖန်တီးခင် အများပြည်သူက OpenAPI စာရွက်စာတမ်းကို ရောက်ရှိနိုင်ပါသည်။
သင့်စက်ကနေ:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

ပြီးရင် ကပ်လိုက်ပါ။ `https://taira.sora.org/openapi.json` Console ထဲကိုဝင်ပြီး
ဖတ်လို့သာရတဲ့ လမ်းကြောင်းများ `GET /status`, `GET /v1/domains`, ဒါမှမဟုတ်
`GET /v1/assets/definitions`. လက်မှတ်ရေးထိုးထားတဲ့ ငွေပေးချေမှုတွေနဲ့ ပုဂ္ဂလိက သော့စီးကြောင်းတွေကို သိမ်းထားပါ။
တစ် SDK ဒါမှမဟုတ် CLI သင့် runtime ပတ်ဝန်းကျင်က လျှို့ဝှက်ချက်တွေကို တင်တဲ့ ဖောက်သည်ပါ။

## ထုတ်လုပ်သော ဖောက်သည်များ {#generated-clients}

Generator command က Live ကိုပဲသုံးတယ် OpenAPI Console ကို မှတ်တမ်းတင်
ဝန်ထုပ်များအတွက် အသုံးဝင်ပါတယ်။ JSON operator, explorer, app နဲ့ telemetry လမ်းကြောင်းတွေ

လက်မှတ်ရေးထိုးထားတဲ့ စာရင်းအင်းလုပ်ငန်းများအတွက် လက်မှတ်ရေးဆွဲထားသော မေးမြန်းချက်များနှင့် Norito- ဒေသခံ အသုံးဝင်ပစ္စည်းများ၊
တာဝန်ရှိသူကို ပိုနှစ်သက်တယ်။ Iroha SDKs. OpenAPI ဖောက်သည်တွေက လက်မှတ်တွေ မစုဆောင်းဘူး။
Account key တွေကို စီမံခန့်ခွဲဖို့ (သို့) encode လုပ်ဖို့ Norito သင့်အတွက် ငွေပေးချေမှု အဖွဲ့အစည်းတွေပါ။

ထောက်ပံ့တဲ့ generator တစ်ခုစီကို စစ်ဆေးဖို့ OpenAPI Generator ကို run လုပ်ပါ

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
