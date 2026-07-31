---
translation_locale: my
translation_source: /guide/tutorials/javascript.md
translation_source_hash: feddadb1b50c5cc8beea188fd7053eeaae58d6ab9203687e9a1378f203229168
translation_status: machine-validated
translation_engine: nllb-200-ct2
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

Native build သည် `cargo build -p iroha_js_host` ကိုဖုံးအုပ်ပြီး SDK startup တွင်အသုံးပြုသော platformer-specific checksum ကိုမှတ်တမ်းတင်သည်။ အရင်းအမြစ် build နေရာများသည် `native/` တွင်စစ်ဆေးထားသော host ကိုသာသတ်မှတ်သည်။ သီးခြားတည်ဆောက်ထားသော checksum စစ်ဆေးထားတဲ့ host ကိုရည်ရွယ်ချက်ရှိစွာဖြည့်သွင်းတဲ့အခါမှသာ `IROHA_JS_NATIVE_DIR` ကိုသတ်မှတ်ပါ။ Package က ESM - သာ ဖြစ်ပြီး CommonJS မှ dynamic `import()` ကို အသုံးပြုပါ။

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

const status = await fetch(`${root}/status`).then((res) => res.json());
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

`taira-readonly.mjs` အဖြစ် သိမ်းထားပြီးရင် Run လုပ်ပါ။

```bash
node taira-readonly.mjs
```

လက်မှတ်ထိုးထားသော SDK ဖုန်းခေါ်ဆိုမှုများကို ဤဖတ်ခြင်းသာ စစ်ဆေးချက်များ အလုပ်ဖြစ်ပြီးနောက်မှသာ ရွှေ့ပါ။ အများပြည်သူ Taira သည် satiated queue သို့မဟုတ် gateway error ကို ယာယီပြန်ပို့နိုင်သည်၊ ထို့ကြောင့် တိုက်ရိုက်ကွန်ရက် စမ်းသပ်မှုများ opt-in ကို CI တွင်ထိန်းသိမ်းပါ။

အသုံးဝင်တဲ့ အပိုလမ်းကြောင်းတင်သွင်းမှု

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

Browser တစ်ခုတည်းသော Connect bootstrap အတွက် Node-first `ToriiClient` မျက်နှာပြင်ကို တင်သွင်းခြင်းအစား `@iroha/iroha-js/connect-browser` ကိုအသုံးပြုပါ။

## Native Escrow {#native-escrow}

JavaScript နှင့် TypeScript Applications များသည် native escrow ကိုအသုံးပြုနိုင်သည်။ Kotodama လက်မှတ်ထိုးထားတဲ့ စာချုပ်တွေကို စုစည်းပါ။ `@iroha/iroha-js/kotodama-compiler`; Direct native escrow transaction builders တွေကို လက်ရှိမှာ JavaScript SDK. ကြည့်ပါ။ [Native Asset Escrow](/my/blockchain/escrow.md#javascript-and-typescript-kotodama) Escrow host-call နမူနာအတွက်ပါ။

## လက်ရှိအကာအကွယ် {#current-coverage}

SDK သည် အောက်ပါအချက်များအပေါ် အာရုံစိုက်သည်-

- Torii HTTP နှင့် WebSocket အကူအညီပေးသူများ
- Norito ငွေပေးချေခြင်းနှင့် ညွှန်ကြားချက် တည်ဆောက်သူများ
- Kotodama compilation၊ escrow host-call builds အပါအဝင်
- Ed25519 လက်မှတ်ရေးထိုးခြင်းနှင့် သော့မျိုးဆက်
- စာမျက်နှာပြုပြင်ခြင်းနှင့် ပြန်လည်စမ်းသပ်မှု အကူအညီများ
- Browser bootstrap အကူများကို ချိတ်ဆက်ပါ
- Kagemusha အသင့်ရှိမှု၊ ထပ်မံဖြည့်စွက်ခြင်း၊ ပြန်လည်ပေးသွင်းခြင်းနှင့် လုပ်ငန်းဆောင်ရွက်မှုအခြေအနေဆိုင်ရာ သယ်ယူပို့ဆောင်ရေးကူညီသူများ

## အထက်ပိုင်းဆိုင်ရာ ရည်ညွှန်းချက်များ {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
