---
translation_locale: ar
translation_source: /guide/tutorials/javascript.md
translation_source_hash: feddadb1b50c5cc8beea188fd7053eeaae58d6ab9203687e9a1378f203229168
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript و TypeScript {#javascript-and-typescript}

التيار JavaScript SDK هو `@iroha/iroha-js` الحزمة في Iroha
شجرة المصدر Node.js- أولاً SDK لـ Torii, Norito البناء، التوقيع
التصفحات، مُشاهدة الإضافات المتصلة، ونقل القيادة الكاغيموشا.

## بناء من مصدر {#build-from-source}

الحزمة ليست متاحة للجمهور حالياً npm السجل، قم ببناءها
من نفس اللوحة Iroha مراجعة المصدر كالعقدة التي تستهدفها:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

البناء الأصلي يُغلف `cargo build -p iroha_js_host` وتسجل
مبلغ التحقق المحدد للمنصة المستخدم في SDK البداية. المصدر يبني أماكن
المضيف المؤكد في `native/`. المجموعة `IROHA_JS_NATIVE_DIR` فقط عندما يكون عمداً
وتزويد مستضيف مُبني بشكل منفصل، معتمد على المبالغ المحددة. ESM- فقط
من CommonJS, استخدام ديناميكي `import()`.

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

## حاولي Taira القراءة فقط {#try-taira-read-only}

استخدام متكامل `fetch` في Node.js 24 للقناة Taira قبل إضافة التوقيع
Norito رمز المعاملة:

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

احفظها ك `taira-readonly.mjs`, ثم تشغيله:

```bash
node taira-readonly.mjs
```

انتقل إلى الموقع SDK الاتصالات فقط بعد أن تعمل هذه الشيكات القراءة فقط Taira
يمكن أن يعود مؤقتاً خطوة في الصف أو البوابة المشبعة ، لذا حافظ على شبكة الإنترنت
اختبارات الاختيار CI.

الواردات المفيدة للطريق الفرعي:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

لتنفيذ إطار تشغيل الاتصال فقط في المتصفح ، استخدم `@iroha/iroha-js/connect-browser`
بدلاً من استيراد العقدة الأولى `ToriiClient` سطح.

## الاحتفاظ بالأموال {#native-escrow}

JavaScript و TypeScript التطبيقات يمكن استخدام الاحتفاظ الأصلي من خلال Kotodama
الإتفاقيات. قم بتجميع مكالمات مضيف الاحتفاظ
`@iroha/iroha-js/kotodama-compiler`; البناء المباشر للمعاملات الاحتفاظية الأصلية
لا يتم عرضهم حالياً من قبل JavaScript SDK. انظروا
[الاحتفاظ بالأصول الأصلية](/ar/blockchain/escrow.md#javascript-and-typescript-kotodama)
على سبيل المثال، مكالمة استضافة الاحتفاظ.

## التغطية الحالية {#current-coverage}

(الـ) SDK يركز على:

- Torii HTTP و WebSocket المساعدين
- Norito صانعي المعاملات والمعلومات
- Kotodama التجميع، بما في ذلك مدخلات استضافة المكالمات
- إد25519 توقيع وتوليد المفاتيح
- المساعدون في تصفح الصفحات وإعادة المحاولة
- قم بتوصيل المساعدات لتنفيذ إزالة المتصفح
- إعداد كاغيموشا، وتكملاتها، وإعادة التأمين، وحالة النقل
  المساعدين

## الإشارات المتقدمة {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
