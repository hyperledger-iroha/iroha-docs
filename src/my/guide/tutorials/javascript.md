---
translation_locale: my
translation_source: /guide/tutorials/javascript.md
translation_source_hash: feddadb1b50c5cc8beea188fd7053eeaae58d6ab9203687e9a1378f203229168
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript နှင့် TypeScript {#javascript-and-typescript}

လက်ရှိ JavaScript SDK အဲဒါက `@iroha/iroha-js` အိတ်ထဲတွင် Iroha
အရင်းအမြစ် သစ်ပင်ပါ။ Node.js- ပထမ SDK အတွက် Torii, Norito ဆောက်လုပ်ရေးသမားတွေ၊ လက်မှတ်ထိုးသူတွေ၊
Pagination, Connect Previews နဲ့ Kagemusha command transport တွေကို ကြည့်ပါ။

## အရင်းအမြစ်မှ ဆောက်လုပ်ခြင်း {#build-from-source}

ပိတ်ရက်ကို အများပြည်သူအတွက် လက်ရှိမှာ မရရှိနိုင်ပါ။ npm မှတ်ပုံတင်ကို တည်ဆောက်ပါ။
တူညီတဲ့ ပိုက်ခုံကနေ Iroha source revision ကို သင်ရည်မှန်းထားတဲ့ node အဖြစ်:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

ဒေသခံ ဆောက်လုပ်ရေး ပုံးများ `cargo build -p iroha_js_host` ပြီးတော့ မှတ်တမ်းတင်ထားတယ်
Platform-specific checksum ကို အသုံးပြုခြင်း SDK source က နေရာတွေကို တည်ဆောက်တယ်။
verified host ကို `native/`. Set `IROHA_JS_NATIVE_DIR` ရည်ရွယ်ချက်ရှိရင်သာ
သီးခြားတည်ဆောက်ပြီး checksum စစ်ဆေးထားတဲ့ host ကိုပေးပို့တယ်။ ESM- တစ်ခုတည်းပါ။
မှ CommonJS, အသုံးပြုမှု ဒိုင်နမစ် `import()`.

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

## စမ်းကြည့်ပါ။ Taira စာဖတ်ခြင်းသာ {#try-taira-read-only}

အသုံးပြုမှု တည်ဆောက်ထားသည် `fetch` အထဲမှာ Node.js 24 ကို probe ကို Taira လက်မှတ်ထိုးခြင်း မတင်ခင်နဲ့
Norito ငွေပေးချေမှု ကုဒ်:

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

ဒါကို Save လုပ်ပါ။ `taira-readonly.mjs`, ဒါဆို Run လုပ်ပါ။

```bash
node taira-readonly.mjs
```

လက်မှတ်ထိုးရန် ရွှေ့ပါ။ SDK စာဖတ်လို့သာရတဲ့ စစ်ဆေးမှုတွေ အလုပ်ဖြစ်ပြီးနောက်ပဲ ဖုန်းဆက်တာပါ။ Taira
Saturated queue (သို့) gateway error ကို ယာယီပြန်ပို့နိုင်တယ်ဆိုတော့ live network ကိုဆက်သွယ်ထားပါ
စစ်ဆေးမှုများ opt-in CI.

အသုံးဝင်တဲ့ အပိုလမ်းကြောင်း တင်သွင်းမှု

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

Browser တစ်ခုတည်းသော Connect bootstrap အတွက် အသုံးပြုပါ `@iroha/iroha-js/connect-browser`
Node-first ကို တင်သွင်းမယ့်အစား `ToriiClient` မျက်နှာပြင်။

## Native Escrow {#native-escrow}

JavaScript နှင့် TypeScript လျှောက်လွှာများသည် native escrow ကိုအသုံးပြုနိုင်သည်။ Kotodama
စာချုပ်များ။
`@iroha/iroha-js/kotodama-compiler`; Direct native escrow transaction builders များ
လက်ရှိတွင် JavaScript SDK. ကြည့်ပါ။
[Native Asset Escrow](/my/blockchain/escrow.md#javascript-and-typescript-kotodama)
အငှားလက်ခံခေါ်ဆိုမှု ဥပမာအတွက်ပါ။

## လက်ရှိအကာအကွယ် {#current-coverage}

နိုင်ငံခြားရေး SDK အောက်ပါအချက်များကို အဓိကထားပြောဆိုနေသည်-

- Torii HTTP နှင့် WebSocket အကူအညီပေးသူများ
- Norito ကုန်သွယ်မှုနှင့် ညွှန်ကြားချက် ဆောက်လုပ်သူများ
- Kotodama ကောက်ယူမှုအပါအဝင် escrow host-call builds
- Ed25519 လက်မှတ်ရေးထိုးခြင်းနှင့် သော့မျိုးဆက်
- စာမျက်နှာပြုပြင်ခြင်းနှင့် ပြန်လည်စမ်းသပ်မှုကူညီသူများ
- Browser bootstrap အကူများကို ချိတ်ဆက်ပါ
- Kagemusha အသင့်ရှိမှု၊ ထပ်မံဖြည့်စွက်ခြင်း၊ ပြန်လည်ပေးသွင်းခြင်းနှင့် လုပ်ငန်းအခြေအနေဆိုင်ရာ ပို့ဆောင်မှု
  အကူအညီပေးသူများ

## မြင့်တက်သော ရည်ညွှန်းချက်များ {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
