---
translation_locale: my
translation_source: /guide/tutorials/javascript.md
translation_source_hash: 92389d3ad83ab32e85b4ca83ede9829d1a38afaad6e86da035da2829a3aaedfb
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# JavaScript နှင့် TypeScript {#javascript-and-typescript}

လက်ရှိ JavaScript SDK အဲဒါက `@iroha/iroha-js` အိတ်ထဲတွင် Iroha အရင်းအမြစ် သစ်ပင်ပါ။ Node.js- ပထမ SDK အတွက် Torii, Norito ဆောက်လုပ်သူတွေ၊ လက်မှတ်ရေးထိုးခြင်း၊ စာမျက်နှာပြုစုခြင်း၊ ချိတ်ဆက်မှု ကြိုတင်ကြည့်ရှုချက်များနှင့် Kagemusha command transport များ။

## အရင်းအမြစ်မှ တည်ဆောက်ခြင်း {#build-from-source}

အဆိုပါ package ကို အများပြည်သူ npm မှတ်ပုံတင်မှမရရှိပါ။ သင်ရည်ရွယ်သည့် node နှင့်အတူတူ pinned Iroha အရင်းအမြစ်ပြုပြင်မှုမှ တည်ဆောက်ပါ။

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

စက်ပေါ်တိုက်ရိုက်လည်ပတ်မည့် အစိတ်အပိုင်းတည်ဆောက်မှုသည် `cargo build -p iroha_js_host` ကို ခေါ်ယူပြီး SDK စတင်ချိန်တွင် အသုံးပြုသော ပလက်ဖောင်းအလိုက် စစ်ဆေးကိန်းကို မှတ်တမ်းတင်သည်။ ရင်းမြစ်မှ တည်ဆောက်ရာတွင် စစ်ဆေးပြီးသော လက်ခံအစိတ်အပိုင်းကို `native/` တွင် ထားသည်။ သီးခြားတည်ဆောက်ပြီး စစ်ဆေးကိန်းဖြင့် အတည်ပြုထားသော လက်ခံအစိတ်အပိုင်းကို ရည်ရွယ်ချက်ရှိရှိ ပံ့ပိုးသည့်အခါမှသာ `IROHA_JS_NATIVE_DIR` ကို သတ်မှတ်ပါ။ ဤပက်ကေ့ချ်သည် ESM ကိုသာ ပံ့ပိုးသည်။ CommonJS မှ အသုံးပြုလျှင် လည်ပတ်ချိန်ခေါ်ယူသော `import()` ကို သုံးပါ။

## အမြန်စတင်ခြင်း {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## Taira ကို စမ်းကြည့်ပါ။ ဖတ်ရုံပဲ {#try-taira-read-only}

Node.js 24 မှာ ထည့်သွင်းထားတဲ့ `fetch` ကို အသုံးပြုပြီး လက်မှတ်ထိုးခြင်းနှင့် Norito ငွေပေးချေမှု ကုဒ်ကို မထည့်မီ Taira ကို စစ်ဆေးပါ။

```js
const root = "https://taira.sora.org";

const status = await fetch(`${root}/status`, {
  headers: { Accept: "application/json" },
}).then((res) => res.json());
console.log({
  blocks: status.blocks,
  queueSize: status.queue_size,
  peers: status.peers,
});

const domains = await fetch(`${root}/v1/domains?limit=5`).then((res) =>
  res.json(),
);
console.log(domains.items.map((domain) => domain.id));

const assets = await fetch(`${root}/v1/assets/definitions?limit=5`).then((res) =>
  res.json(),
);
for (const asset of assets.items) {
  console.log(asset.id, asset.name, asset.total_quantity);
}
```

`taira-readonly.mjs` အဖြစ် သိမ်းဆည်းပြီးနောက် ၎င်းကို လုပ်ဆောင်ပါ။

```bash
node taira-readonly.mjs
```

လက်မှတ်ထိုးထားသော SDK နည်းပညာခေါ်ဆိုချက်များကို ဒီဖတ်မှုသာ စစ်ဆေးမှုများ အလုပ်ဖြစ်ပြီးနောက်မှသာ ပြောင်းပါ။ အများပြည်သူ Taira သည် ယာယီအပြည့်အဝတန်း (သို့) ဂိတ်တံခါးအမှားကိုပြန်ပို့နိုင်သည်၊ ထို့ကြောင့် တိုက်ရိုက်ကွန်ရက်စမ်းသပ်မှုများကို opt-in ကို CI တွင်ထိန်းသိမ်းပါ။

အသုံးဝင်တဲ့ အပိုလမ်းကြောင်း တင်သွင်းမှု

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

ဘရောက်ဇာသီးသန့် Connect စတင်ချိတ်ဆက်မှုအတွက် Node ကို ဦးစားပေးထားသော `ToriiClient` လုပ်ဆောင်ချက်များကို import လုပ်မည့်အစား `@iroha/iroha-js/connect-browser` ကို အသုံးပြုပါ။

## မူရင်းအာမခံအပ်နှံမှု {#native-escrow}

JavaScript နှင့် TypeScript အက်ပ်များသည် Kotodama စာချုပ်များမှတစ်ဆင့် မူရင်းအာမခံအပ်နှံမှုကို အသုံးပြုနိုင်သည်။ အာမခံအပ်နှံမှု host ခေါ်ယူချက်များကို `@iroha/iroha-js/kotodama-compiler` ဖြင့် compile လုပ်ပါ။ JavaScript SDK တွင် မူရင်းအာမခံအပ်နှံမှု transaction တည်ဆောက်ကိရိယာများကို တိုက်ရိုက် မပံ့ပိုးသေးပါ။ host ခေါ်ယူမှုနမူနာအတွက် [မူရင်းပိုင်ဆိုင်မှုအာမခံအပ်နှံခြင်း](/my/blockchain/escrow.md#javascript-and-typescript-kotodama) ကို ကြည့်ပါ။

## လက်ရှိအကာအကွယ် {#current-coverage}

SDK သည် အောက်ပါအချက်များအပေါ် အာရုံစိုက်သည်-

- Torii HTTP နှင့် WebSocket အကူအညီပေးသူများ
- Norito ငွေပေးချေခြင်းနှင့် ညွှန်ကြားချက် တည်ဆောက်သူများ
- Kotodama compilation၊ escrow host-technical invocation builds အပါအဝင်
- Ed25519 လက်မှတ်ထိုးခြင်းနှင့် ကီးဖန်တီးခြင်း
- စာမျက်နှာပြုပြင်ခြင်းနှင့် ပြန်လည်စမ်းသပ်မှု အကူအညီများ
- Browser bootstrap အကူများကို ချိတ်ဆက်ပါ

## အထက်ပိုင်းဆိုင်ရာ ရည်ညွှန်းချက်များ {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
