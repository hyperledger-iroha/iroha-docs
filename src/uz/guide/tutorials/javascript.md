---
translation_locale: uz
translation_source: /guide/tutorials/javascript.md
translation_source_hash: d12c715de68623a7dd671e4f2f91b93dbe9fdee42ed51e3a25fbad2a9b69ca8e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript va TypeScript {#javascript-and-typescript}

Joriy JavaScript SDK bo ' lmoqda `@iroha/iroha-js` toʻplamda Iroha manbai daraxt. Bu Node.js- Birinchidan SDK uchun Torii, Norito Builderlar, imzolash, sahifalashtirish, Connect previews va Kagemusha buyruq transport.

## Manbaiga asoslanib quring {#build-from-source}

To'plam hozirda npm davlat ro'yxatidan mavjud emas. Uni maqsadli bo'lgan nod bilan bir xil biriktirilgan Iroha manba o'zgarishidan quring:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

Yerli qurilmalar toʻplami `cargo build -p iroha_js_host` va platformasiga oid tekshiruvlar summasini qayd etadi; SDK boshlang'ich. Manba o'rnatilgan joylar `native/`. Oʻrnatilgan `IROHA_JS_NATIVE_DIR` faqat alohida qurilgan, checksum-verified uy egasi bilan qasddan ta'minlangan holda. ESM- faqat; CommonJS, foydalanish dinamikasi `import()`.

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

## Taira Faqat o'qishga harakat qiling {#try-taira-read-only}

Imzolash va Norito muomala kodini qo'shishdan oldin Taira ni tekshirish uchun Node.js 24 da o'rnatilgan `fetch`dan foydalaning:

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

Uni `taira-readonly.mjs` sifatida saqlash, so'ngra uni ishga tushirish:

```bash
node taira-readonly.mjs
```

SDK imzolangan qo'ng'iroqlarga faqat ushbu o'qish-o'qish tekshiruvlari ishlagandan so'ng o'ting. Umumiy Taira vaqtincha to'yilgan navbat yoki darvoza xatosiga qaytishi mumkin, shuning uchun jonli tarmoq sinovlarini CI ga kirishga ruxsat bering.

Foydalanuvchi kichik yo'l importlari:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

Faqat brauzerda ishlaydigan Connect bootstrap uchun Node-first `ToriiClient` yuzasini import qilish o'rniga `@iroha/iroha-js/connect-browser` dan foydalaning.

## Native escrow {#native-escrow}

JavaScript va TypeScript ilovalari Kotodama shartnomalari orqali natiy escrowdan foydalanishlari mumkin. `@iroha/iroha-js/kotodama-compiler` bilan escrow host qo'ng'iroqlarini tuzish; to'g'ridan-to'g'ri natiy escro JavaScript SDK tomonidan amal qiluvchilar hozirda ekspozitsiya qilinmaydi. [Native Asset Escrow](/uz/blockchain/escrow.md#javascript-and-typescript-kotodama) ni ko'rib chiqing.

## Joriy qamrov {#current-coverage}

SDK quyidagilarga e'tibor qaratadi:

- Torii HTTP va WebSocket yordamchilari
- Norito tranzaksiyalar va ko'rsatmalar quruvchilari
- Kotodama to'plami, shu jumladan depozit uyasi qo'ng'iroqlar o'rnatilishi
- Ed25519 imzolash va kalit avlodi
- sahifalashtirish va qayta urinish yordamchilari
- Browserni ishga tushirish yordamchilarini ulash
- Kagemusha tayyorgarligi, to'ldirish, sotib olish va faoliyat ko'rsatishi holatidagi transport yordamchilari

## Yuqori yo'nalishdagi referentlar {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
