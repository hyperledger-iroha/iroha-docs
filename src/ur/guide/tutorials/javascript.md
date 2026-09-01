---
translation_locale: ur
translation_source: /guide/tutorials/javascript.md
translation_source_hash: d12c715de68623a7dd671e4f2f91b93dbe9fdee42ed51e3a25fbad2a9b69ca8e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript اور TypeScript {#javascript-and-typescript}

موجودہ JavaScript SDK Iroha ماخذ درخت میں `@iroha/iroha-js` پیکیج ہے۔ یہ Node.js-پہلا SDK ہے Torii ، Norito بلڈرز ، دستخط ، صفحہ بندی ، کنیکٹ پیش نظارہ ، اور کگیموشا کمانڈ ٹرانسپورٹ کے لئے۔

## ماخذ سے تعمیر کریں {#build-from-source}

پیکیج فی الحال عوامی npm رجسٹری سے دستیاب نہیں ہے۔ اسے ہدف کردہ نوڈ کے طور پر اسی پنڈل Iroha ماخذ کی نظر ثانی سے بنائیں:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

مقامی بلڈ `cargo build -p iroha_js_host` کو لپیٹتا ہے اور SDK اسٹارٹ اپ میں استعمال ہونے والے پلیٹ فارم کے مخصوص چیکسم کو ریکارڈ کرتا ہے۔ ماخذ بلڈ مقامات جو میزبان کی تصدیق کرتے ہیں `native/` میں۔ `IROHA_JS_NATIVE_DIR` صرف اس وقت مقرر کریں جب جان بوجھ کر علیحدہ تعمیر شدہ ، چیکسوم کی تصدیق شدہ میزبان کو فراہم کیا جائے۔ پیکیج صرف ESM ہے۔ CommonJS سے ، متحرک استعمال کریں `import()`.

## فوری آغاز {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## کوشش کریں Taira صرف پڑھنا {#try-taira-read-only}

دستخط اور Norito ٹرانزیکشن کوڈ شامل کرنے سے پہلے Taira کی جانچ کرنے کے لئے Node.js 24 میں بلٹ ان `fetch` استعمال کریں:

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

اس کو `taira-readonly.mjs` کے طور پر محفوظ کریں، پھر اسے چلائیں:

```bash
node taira-readonly.mjs
```

سائن ان SDK کالز پر صرف اس کے بعد منتقل کریں کہ یہ صرف پڑھنے والے چیک کام کریں۔ عوامی Taira عارضی طور پر سیر شدہ قطار یا گیٹ وے کی خرابی واپس کر سکتا ہے ، لہذا براہ راست نیٹ ورک ٹیسٹ میں آپٹ-ان کو CI میں رکھیں۔

مفید ذیلی راستے کی درآمد:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

براؤزر کے لئے صرف کنیکٹ بوٹسٹریپ کے ل Node ، `@iroha/iroha-js/connect-browser` کا استعمال کریں بجائے Node-first `ToriiClient` سطح کی درآمد کریں۔

## مقامی ایایسکرو {#native-escrow}

JavaScript اور TypeScript ایپلی کیشنز Kotodama کانٹریکٹس کے ذریعے مقامی ایایسکرو استعمال کر سکتی ہیں۔ `@iroha/iroha-js/kotodama-compiler` کے ساتھ ایایسکرو host calls کمپائل کریں۔ براہِ راست مقامی ایایسکرو ٹرانزیکشن بلڈرز فی الحال JavaScript SDK میں دستیاب نہیں۔ ایایسکرو host-call مثال کے لیے [مقامی اثاثہ ایایسکرو](/ur/blockchain/escrow.md#javascript-and-typescript-kotodama) دیکھیں۔

## موجودہ کوریج {#current-coverage}

SDK پر توجہ مرکوز کرتا ہے:

- Torii HTTP اور WebSocket مددگار
- Norito ٹرانزیکشن اور ہدایات بنانے والے
- Kotodama مجموعہ، بشمول ایسوسی ایشن ہوسٹ کال بلڈنگ
- Ed25519 دستخط اور کلیدی نسل
- صفحہ بندی اور دوبارہ کوشش کرنے والے مددگار
- براؤزر بوٹسٹریپ ہیلپرز کو مربوط کریں
- کاگیموشا کی تیاری، بھرتی، واپسی اور آپریشن کے مقام پر ٹرانسپورٹ معاون

## اوور اسٹریم ریفرنسز {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
