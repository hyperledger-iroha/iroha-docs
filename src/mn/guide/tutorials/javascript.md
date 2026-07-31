---
translation_locale: mn
translation_source: /guide/tutorials/javascript.md
translation_source_hash: feddadb1b50c5cc8beea188fd7053eeaae58d6ab9203687e9a1378f203229168
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript болон TypeScript {#javascript-and-typescript}

Одоогийн JavaScript SDK Энэ бол `@iroha/iroha-js` багц Iroha
Эх үүсэл мод. Node.js- Нэгдүгээрт SDK . Torii, Norito барилгын ажилчид, гарын үсэг зурагч
Pagination, Connect Previews, Kagemusha командны тээвэр.

## Эх сурвалжаас бариарай {#build-from-source}

Тус багцыг одоогоор олон нийтэд хүргэж чадахгүй байна npm Тэмцээ хий.
мөн адил хуурсан Iroha эх сурвалжийн шинэчлэл, та зорилтот цэг:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

Нүүдэлчдийн барилга нь `cargo build -p iroha_js_host` .
Платформад зориулсан хяналтын хэмжээ SDK эх үүсвэр нь
баталгаажуулсан халамжлагч `native/`. Нөхөнтөгч `IROHA_JS_NATIVE_DIR` Зөвхөн санаатайгаар
Тус багц нь тусдаа баригдсан, хяналтын хэмжээгээр баталгаажуулсан хостийг нийлүүлнэ. ESM- зөвхөн;
цаашид CommonJS, ашиглах динамик `import()`.

## Удахгүй эхлэх {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## Та үүнийг туршиж үзээрэй. Taira Зөвхөн уншигч {#try-taira-read-only}

Барилсан хэрэглээ `fetch` .д Node.js 24 хайгуулын Taira гарын үсэг нэмэхээс өмнө,
Norito гүйлгээний код:

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

Энэ нь `taira-readonly.mjs`, Дараа нь үүнийг ажиллуул:

```bash
node taira-readonly.mjs
```

Дахиалсан руу шилжүүлнэ SDK Зөвхөн уншигч шалгалтын дараа л дууддаг. Taira
түр зуурын дараагийн эсвэл галт тэрэгний алдааг түргэн ирүүлж болно, тиймээс шууд сүлжээг хадгалах
шалгалт CI.

Ашигтай дэд замын импорт:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

Зөвхөн хөтөчээр ашиглах Connect bootstrap-ийг ашигла `@iroha/iroha-js/connect-browser`
Нот-н анхны импортлох оронд `ToriiClient` гадаргуу.

## Тухайн хяналтын төлбөр {#native-escrow}

JavaScript болон TypeScript нэвтрүүлэгүүд нь гаралтай хадгаламж ашиглах боломжтой Kotodama
гэрээний тухай.
`@iroha/iroha-js/kotodama-compiler`; шууд эх оронч хадгаламжийн гүйлгээний бүтээн байгуулагчид
. JavaScript SDK. Та үзээрэй.
[Үндэсний хөрөнгийн хяналт](/mn/blockchain/escrow.md#javascript-and-typescript-kotodama)
Хөдөлмөрийн хэрэгслийн төлөөлөгч:

## Одоогийн хамрааллалт {#current-coverage}

Хөдөлмөрийн SDK дараахь чиглэлд төвлөрдөг:

- Torii HTTP болон WebSocket туслах
- Norito бүтээн байгуулалтын болон заалын гүйцэтгэгч
- Kotodama бүрэлдэхүүнтэй, эсхүлдэлээс хамаарагч дуудлагатай
- Ed25519 гарын үсэг зурах, цулгын үйлдвэрлэл
- Pagination болон дахин туршилтын туслах
- Бrowser bootstrap туслалцааг холбох
- Кагемушагийн бэлэн байдал, нөхөн сэргээлт, төлбөр тооцоо, үйл ажиллагааны нөхцөл байдлын хүрээнд тээвэрлэлт
  туслах

## Өмнөд чиглэлийн сэнслэл {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
