---
translation_locale: mn
translation_source: /guide/tutorials/javascript.md
translation_source_hash: d12c715de68623a7dd671e4f2f91b93dbe9fdee42ed51e3a25fbad2a9b69ca8e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# JavaScript ба TypeScript {#javascript-and-typescript}

Одоогийн JavaScript SDK нь Iroha эх үүсвэр модны `@iroha/iroha-js` багц юм. Энэ нь Torii, Norito баригчид, гарын үсэг зурах, хуудаслах, Connect урьдчилсан үзэлт, болон Kagemusha команд дамжуулалтын хувьд Node.js-р SDK юм.

## Эх сурвалжаас бүтээх {#build-from-source}

Энэ багц одоогоор олон нийтийн npm бүртгэлээс авах боломжтойгүй байна. Та зорьж буй node-той адил бэхлэгдсэн Iroha эх хувилбараас үүнийг бүтээ:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

Улсын түвшний бүтээл `cargo build -p iroha_js_host`-г ороож, платформтой холбоотой шалгалтын нийлбэрийг SDK эхлэлтэд бүртгэдэг. Эх кодоор бүтээгдсэн хувилбар баталгаажсан серверийг `native/`-д байрлуулдаг. Зөвхөн тусдаа бүтээгдсэн, шалгалттай хостыг зориудаар нийлүүлж байвал `IROHA_JS_NATIVE_DIR`-г тохируулна уу. Багц нь зөвхөн ESM; CommonJS-ээс `import()`-ийг динамикаар ашиглана уу.

## Хурдан эхлэлт {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## Оролдоно уу Taira Зөвхөн унших {#try-taira-read-only}

Гарын авлагад буй `fetch`-г Node.js 24-д ашиглан Taira-ийг шалгаад дараа нь гарын үсэглэлт болон Norito гүйлгээний кодыг нэмнэ:

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

Үүнийг `taira-readonly.mjs` гэж хадгалаад, дараа нь ажиллуул:

```bash
node taira-readonly.mjs
```

Эдгээр зөвхөн уншдаг шалгалтууд ажилласны дараа зөвшөөрөгдсөн SDK техникийн дуудах функцууд руу шилж. Олон нийтийн Taira түр хугацаанд дүүрсэн ээлж эсвэл гарцын алдаа буцааж магадгүй тул амьд сүлжээний туршилтуудыг CI дээр сонгон хэрэгжүүлэх хэрэгтэй.

Ашигтай дэд замын импорт:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

Зөвхөн браузерт зориулсан Connect bootstrap-ийн хувьд Node-first `ToriiClient` гадаргууг импортлохын оронд `@iroha/iroha-js/connect-browser` ашиглана уу.

## Эх нутгийн хадгаламж {#native-escrow}

JavaScript ба TypeScript програмууд Kotodama гэрээнүүдээр дамжуулан нутгийн хадгаламжийг ашиглаж болно. Хадгаламжийн хост-функцийн дуудлагуудыг `@iroha/iroha-js/kotodama-compiler` ашиглан бүрдүүлнэ; шууд Төрөлх escrow гүйлгээ бүтээгчүүд одоогоор JavaScript SDK-аар илэрхийлэгдээгүй байна. Escrow хост-техникийн дуудах жишээг үзэхийн тулд [Уугуул хөрөнгийн хадгаламж](/mn/blockchain/escrow.md#javascript-and-typescript-kotodama)-ийг харна уу.

## Өнөөгийн хамрах хүрээ {#current-coverage}

SDK нь дараах зүйлд төвлөрдөг:

- Torii HTTP ба WebSocket туслагчид
- Norito гүйлгээ ба заавар үүсгэгчид
- Kotodama цуглуулга, төлбөр зуучлагч хост-техникийн дуудах бүрэлдэхүүнүүдийг багтаасан
- Ed25519 гарын үсэг зуралт ба түлхүүр үүсгэх
- хуудаслал болон дахин оролдох туслагчид
- Хөтчийн bootstrap туслах хэрэгслүүдтэй холбох
- Кагемуша бэлэн байдал, нөхөх, буцаан авах, ба үйлдлийн төлөвийг тээвэрлэх туслахууд

## Дээшээ чиглэсэн лавлагаа {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
