---
translation_locale: ur
translation_source: /guide/tutorials/javascript.md
translation_source_hash: feddadb1b50c5cc8beea188fd7053eeaae58d6ab9203687e9a1378f203229168
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

مقامی تعمیر لفافے `cargo build -p iroha_js_host` اور پلیٹ فارم کے لئے مخصوص چیک کی رقم ریکارڈ کرتا ہے SDK سٹارٹ اپ. ماخذ تعمیر مقامات میں میزبان کی تصدیق `native/`. سیٹ `IROHA_JS_NATIVE_DIR` صرف جب جان بوجھ کر ایک علیحدہ تعمیر، چیکسوم کی تصدیق شدہ میزبان فراہم کیا جاتا ہے. ESM-صرف؛ سے CommonJS, استعمال کی متحرک `import()`.

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

## مقامی ایسکرو {#native-escrow}

JavaScript اور TypeScript ایپلی کیشنز کے ذریعے مقامی سکرو کا استعمال کر سکتے ہیں Kotodama معاہدوں. ایسکرو میزبان کالز مرتب کریں `@iroha/iroha-js/kotodama-compiler`; براہ راست مقامی ایسکرو ٹرانزیکشن بنانے والے فی الحال JavaScript SDK. دیکھو [مقامی اثاثہ جات کا حصول](/ur/blockchain/escrow.md#javascript-and-typescript-kotodama) اسرو میزبان کال کی مثال کے لیے۔

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
