---
translation_locale: uz
translation_source: /guide/tutorials/javascript.md
translation_source_hash: feddadb1b50c5cc8beea188fd7053eeaae58d6ab9203687e9a1378f203229168
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript va TypeScript {#javascript-and-typescript}

Joriy JavaScript SDK bu `@iroha/iroha-js` toʻplamda Iroha
manbai daraxt. Node.js- Birinchidan SDK uchun Torii, Norito qurilishchilar, imzolash,
Paginalash, Qo'shish oldindan ko'rib chiqish va Kagemusha buyruq transporti.

## Manbaiga asoslanib quring {#build-from-source}

Ushbu paket hozirda jamoatchilik uchun mavjud emas npm Reyestrni quring.
bir xil pishirilgan Iroha manbai oʻzgarishi siz maqsad qilgan nod sifatida:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

Yerli qurilmalar toʻplami `cargo build -p iroha_js_host` va
platformasiga oid tekshirish summasi SDK boshlang'ich. Manba joylarni quradi
sertifikatlangan uy egasi `native/`. Oʻrnatilgan `IROHA_JS_NATIVE_DIR` faqat qasddan
alohida qurilgan, checksum-verified uy egasini ta'minlaydi. ESM- faqat;
bilan CommonJS, foydalanish dinamikasi `import()`.

## Tez ishga tushirish {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## Sinang . Taira Faqat oʻqish {#try-taira-read-only}

Oʻrnatilgan foydalanish `fetch` yo'nalishi Node.js 24 sondasiga Taira imzo qo'shishdan oldin va
Norito Transaksiya kodi:

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

Uni quyidagicha saqlash `taira-readonly.mjs`, soʻngra uni ishga tushiring:

```bash
node taira-readonly.mjs
```

Imzoga oʻtish SDK faqat o'qish uchun tekshiruvlar ishlaganidan so'ng qo'ng'iroq qiladi. Taira
to'yilgan navbat yoki darvoza xatosi vaqtincha qaytarilishi mumkin, shuning uchun jonli tarmoqni saqlang
testlar opt-in CI.

Foydali subhod importlari:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

Faqat brauzerda ishlatiladigan Connect bootstrap uchun `@iroha/iroha-js/connect-browser`
Node-firstni import qilish oʻrniga `ToriiClient` yuzasi.

## Asosiy depozit {#native-escrow}

JavaScript va TypeScript ilovalar nativ escrow orqali foydalanish mumkin Kotodama
kontraktlar.
`@iroha/iroha-js/kotodama-compiler`; to'g'ridan-to'g'ri mahalliy depozit tranzaksiyalari quruvchilari
hozirgi vaqtda JavaScript SDK. Koʻring
[Asosiy aktivlar eskorovi](/uz/blockchain/escrow.md#javascript-and-typescript-kotodama)
"Eskrow host call" misoli uchun.

## Joriy qamrov {#current-coverage}

O ' zbekiston Respublikasi SDK quyidagilarga e'tibor qaratadi:

- Torii HTTP va WebSocket yordamchilar
- Norito Transaksiya va ko'rsatma ishlab chiqaruvchilari
- Kotodama to'plash, shu jumladan eskor host-talqinlar tarkiblari
- Ed25519 imzo va kalit avlod
- sahifalashtirish va qayta urish yordamchilari
- Brauzerni ishga tushirish yordamchilarini ulash
- Kagemusha tayyorgarligi, to'ldirish, sotib olish va operatsion holatda transport
  yordamchilar

## Yuqoridagi ma'lumotlar {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
