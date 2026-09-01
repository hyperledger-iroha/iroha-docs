---
translation_locale: ar
translation_source: /guide/tutorials/javascript.md
translation_source_hash: d12c715de68623a7dd671e4f2f91b93dbe9fdee42ed51e3a25fbad2a9b69ca8e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# JavaScript و TypeScript {#javascript-and-typescript}

الحزمة الحالية JavaScript SDK هي الحزمة `@iroha/iroha-js` في شجرة مصدر Iroha. إنها Node.js-الأولى SDK لـ Torii، وبناة Norito، والتوقيع، والتقسيم إلى صفحات، ومعاينات Connect، ونقل أوامر Kagemusha.

## البناء من المصدر {#build-from-source}

الحزمة غير متوفرة حاليًا من السجل العام npm. قم ببنائها من نفس مراجعة المصدر المثبتة Iroha كما هو الحال بالنسبة للعقدة التي تستهدفها:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

البناء الأصلي يلف `cargo build -p iroha_js_host` ويسجل مجموع الاختيار الخاص بالمنصة المستخدم عند بدء تشغيل SDK. البناء المصدر يضع المضيف الذي تم التحقق منه في `native/`. قم بتعيين `IROHA_JS_NATIVE_DIR` فقط عند توفير مضيف تم بناؤه بشكل منفصل وتم التحقق من المجموع الاختباري له عن قصد. الحزمة هي ESM-فقط؛ من CommonJS، استخدم `import()` الديناميكي.

## البدء السريع {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## حاول Taira للقراءة فقط {#try-taira-read-only}

استخدم `fetch` المدمج في Node.js 24 لفحص Taira قبل إضافة توقيع و Norito رمز المعاملة:

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

احفظه باسم `taira-readonly.mjs`، ثم شغّله:

```bash
node taira-readonly.mjs
```

انتقل إلى الاستدعاءات الفنية الموقعة SDK فقط بعد أن تعمل هذه الفحوصات للقراءة فقط. يمكن لـ Taira العام إرجاع خطأ في طابور ممتلئ أو بوابة مؤقتًا، لذلك احتفظ باختبارات الشبكة الحية اختيارية في CI.

استيرادات المسار الفرعي المفيدة:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

لاستخدام Connect bootstrap المخصص للمتصفح فقط، استخدم `@iroha/iroha-js/connect-browser` بدلًا من استيراد واجهة `ToriiClient` المخصصة للنود أولاً.

## الضمان المحلي {#native-escrow}

يمكن لتطبيقات JavaScript و TypeScript استخدام الضمانة الأصلية من خلال عقود Kotodama. قم بتجميع استدعاءات وظائف المضيف للضمانة باستخدام `@iroha/iroha-js/kotodama-compiler`; مباشر منشئو معاملات الضمان الأصليون غير مكشوفين حاليًا بواسطة JavaScript SDK. انظر [ضمان الأصل الأصلي](/ar/blockchain/escrow.md#javascript-and-typescript-kotodama) لمثال الاستدعاء التقني لمضيف الضمان.

## التغطية الحالية {#current-coverage}

يركز SDK على:

- Torii HTTP و WebSocket مساعدين
- Norito منشئو المعاملات والتعليمات
- Kotodama التجميع، بما في ذلك الاستدعاءات التقنية للمضيف بواسطة نظام الضمان
- توقيع Ed25519 وتوليد المفاتيح
- مساعدو الترقيم وإعادة المحاولة
- الاتصال بمساعدي التمهيد للمتصفح
- مساعدو نقل جاهزية كاجيموشا، التعبئة، الاسترداد، وحالة التشغيل

## المراجع العليا {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
