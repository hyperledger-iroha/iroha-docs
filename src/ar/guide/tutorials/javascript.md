---
translation_locale: ar
translation_source: /guide/tutorials/javascript.md
translation_source_hash: feddadb1b50c5cc8beea188fd7053eeaae58d6ab9203687e9a1378f203229168
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript و TypeScript {#javascript-and-typescript}

الحالي JavaScript SDK هو حزمة `@iroha/iroha-js` في شجرة المصدر Iroha. إنها Node.js-أول SDK لبنائه Torii ، Norito ، والتوقيع ، والصفحات ، ومشاهدات سابقة Connect ، ونقل الأوامر كاغيموشا.

## بناء من مصدر {#build-from-source}

الحزمة غير متوفرة حاليًا من سجل npm العام. قم ببناءها من نفس مراجعة المصدر المثبتة Iroha مثل العقدة التي تستهدفها:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

يقوم البناء الأصلي بتغطية `cargo build -p iroha_js_host` وتسجيل مبلغ التحقق المحدد للمنصة المستخدم في بدء SDK. يقوم المصدر ببناء الأماكن التي تؤكد استضافة في `native/`. يضع `IROHA_JS_NATIVE_DIR` فقط عند توفير مستضيف تم تصنيعه بشكل منفصل، ومجموع التحقق من المعلومات. الحزمة هي ESM فقط؛ من CommonJS، استخدام ديناميكي `import()`.

## بداية سريعة {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## جرب Taira القراءة فقط {#try-taira-read-only}

استخدم `fetch` متكامل في Node.js 24 لتحقيق Taira قبل إضافة رمز التوقيع و Norito لعملية المعاملات:

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

حفظها على `taira-readonly.mjs` ، ثم تشغيلها:

```bash
node taira-readonly.mjs
```

الانتقال إلى المكالمات الموقعة SDK فقط بعد أن تعمل هذه التحققات القائمة على القراءة فقط. يمكن للجمهور Taira إرجاع خطوة مكتظة أو خطأ بوابة مؤقتًا ، لذلك حافظ على اختبارات الشبكة الحية اختيار الدخول في CI.

الواردات المفيدة للطريق الفرعي:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

لاستخدام `@iroha/iroha-js/connect-browser` بدلاً من استيراد سطح Node-first `ToriiClient` لـ Connect bootstrap للمصفح فقط

## الخصم الأصلي {#native-escrow}

يمكن أن تستخدم التطبيقات JavaScript و TypeScript الاحتفاظ الأصلي من خلال عقود Kotodama. قم بتجميع دعوات استضافة الاحتفاض مع `@iroha/iroha-js/kotodama-compiler` ؛ لا يتم عرض بناء معاملات الاحتفاذ الأصلية المباشرة حاليًا من قبل JavaScript SDK. انظر [ الاحتفاظ بالأصول الطبيعية](/ar/blockchain/escrow.md#javascript-and-typescript-kotodama) لمثال استدعاء مضيف الاحتفاض.

## التغطية الحالية {#current-coverage}

SDK يركز على:

- Torii HTTP و WebSocket المساعدين
- Norito صانعي المعاملات والتعليمات
- Kotodama التجميع، بما في ذلك مدخلات دعوة استضافة الاحتفاظ بها
- إد 25519 توقيع وتوليد المفاتيح
- المساعدون في تصفية الصفحات وإعادة المحاولة
- قم بتوصيل مساعدات تشغيل المتصفح
- إعداد كاغيموشا ومكملاتها وإفراجها ومساعدات النقل في حالة تشغيل

## الإشارات المتقدمة {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
