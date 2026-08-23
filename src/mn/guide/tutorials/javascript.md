---
translation_locale: mn
translation_source: /guide/tutorials/javascript.md
translation_source_hash: d12c715de68623a7dd671e4f2f91b93dbe9fdee42ed51e3a25fbad2a9b69ca8e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript болон TypeScript {#javascript-and-typescript}

Одоогийн JavaScript SDK нь Iroha эх үүсвэрийн мод дахь `@iroha/iroha-js` багц юм. Энэ бол Node.js-р SDK нь Torii, Norito бүтээн байгуулагчид, гарын үсэг зурах, хуудаслах, Connect урьдчилсан үзлэг, Kagemusha командын тээвэрлэлийн .

## Эх сурвалжаас бариарай {#build-from-source}

Энэ багцыг одоогоор npm нийтийн бүртгэлээс ашиглаж чадахгүй. Та зорилт тавьсан түймэртэй ижил Iroha эх үүсвэрийн шинэчилсэн найруулгаас бариарай:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

Нүүдэлчдийн бүтээн байгуулалтын хувцас `cargo build -p iroha_js_host` болон платформын хувьд ашигласан хяналтын хэмжээг бүртгэж, SDK эх үүсвэр нь хостийг баталгаажуулсан байршлыг `native/`. Тоглолт `IROHA_JS_NATIVE_DIR` Зөвхөн бие даасан баригдсан, хяналтын дүнгээр баталгаажуулсан хостын зориулалттай нийлүүлэлт хийх тохиолдолд л байна. ESM- зөвхөн; CommonJS, хэрэглээний динамик `import()`.

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

## Taira уншигчдаа л үзээрэй {#try-taira-read-only}

Node.js 24-ийн дотор `fetch` багтаан ашиглаж, гарын үсэг зурах болон Norito гүйлгээний код нэмэхээс өмнө Taira-ийг шалгах:

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

`taira-readonly.mjs` гэж хадгалж, дараа нь ажиллуул:

```bash
node taira-readonly.mjs
```

SDK дуудлагад гарын үсэг зурсны дараа л энэ уншилт цорын ганц шалгалтын ажиллана. Олон нийтийн Taira нь түр хугацаагаар дүүрэн шуурхай эсвэл хаалганы алдааг буцааж болно, тиймээс амьд сүлжээний туршилтыг сонгох CI-д байлгана.

Ашигтай дэд замны импортууд:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

Зөвхөн браузер ашиглах Connect bootstrap-ийн хувьд Node-first `ToriiClient` давхаргыг импортлох оронд `@iroha/iroha-js/connect-browser` -ийг ашиглаарай.

## Үндэсний хадгаламж {#native-escrow}

JavaScript болон TypeScript нэвтрүүлэгүүд нь гаралтай хадгаламж ашиглах боломжтой Kotodama гэрээ. Хөтөлбөрийн хөтөчийн дуудлага `@iroha/iroha-js/kotodama-compiler`; шууд эх оронч хадгаламжийн гүйлгээний бүтээн байгуулагчдыг одоогийн байдлаар JavaScript SDK. Та үзээрэй. [Тухайн хөрөнгийн хяналт тавих](/mn/blockchain/escrow.md#javascript-and-typescript-kotodama) Хөдөлмөрийн хөтөчийн дуудлагын жишээ.

## Одоогоор хамааралтай {#current-coverage}

SDK нь дараахь чиглэлээр ажилладаг:

- Torii HTTP болон WebSocket туслах
- Norito бүтээн байгуулалтын болон сургалтын бүтээн байгуулагч
- Kotodama хуримтлагыг эс тооцвол, хадгаламжийн хөтөч дуудлага
- Ed25519 гарын үсэг зурах, цөмөгний үе
- Pagination болон дахин туршиж үзэх туслах
- Бrowser bootstrap туслагчдыг холбох
- Кагемушагийн бэлэн байдал, нөхөн сэргээлт, төлбөр тооцоо, үйл ажиллагааны байдлын санхүүжилт

## Урьдчилсан нэвтрүүлэг {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
