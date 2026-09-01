---
translation_locale: uz
translation_source: /guide/tutorials/javascript.md
translation_source_hash: d12c715de68623a7dd671e4f2f91b93dbe9fdee42ed51e3a25fbad2a9b69ca8e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# JavaScript va TypeScript {#javascript-and-typescript}

Hozirgi JavaScript SDK Iroha manba daraxtidagi `@iroha/iroha-js` paketidir. Bu Torii, Norito quruvchilar, imzolash, sahifalash, Connect ko‘rinishlari va Kagemusha buyruq uzatish uchun Node.js-birinchi SDK hisoblanadi.

## Manbadan Qurish {#build-from-source}

Paket hozirda ommaviy npm reyestrida mavjud emas. Uni siz mo‘ljallayotgan tugun bilan bir xil mahkamlashgan Iroha manba rejimidan qurish:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

Mahalliy qurilish `cargo build -p iroha_js_host` ni o'rab, SDK ishga tushirilganda ishlatiladigan platformaga xos tekshiruv yig'indisini yozadi. Manba qurilishi tekshirilgan xostni `native/` ga joylashtiradi. Faqat alohida qurilgan, tekshirilgan xostni ataylab taqdim etilganda `IROHA_JS_NATIVE_DIR` ni belgilang. Paket faqat ESM; CommonJS dan dinamik `import()` dan foydalaning.

## Tez boshlash {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## Urining Taira Faqat O'qish Uchun {#try-taira-read-only}

Node.js 24 da imzolash va Norito tranzaksiya kodini qo'shishdan oldin Taira ni tekshirish uchun o'rnatilgan `fetch` dan foydalaning:

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

Uni `taira-readonly.mjs` sifatida saqlang, keyin uni ishga tushiring:

```bash
node taira-readonly.mjs
```

Faqat ushbu faqat o‘qish uchun tekshiruvlar ishlagandan so‘ng imzolangan SDK texnik chaqiriqlarga o‘ting. Jamoat Taira vaqtincha to‘la navbat yoki gateway xatosini qaytarishi mumkin, shuning uchun jonli tarmoq testlarini CI da ixtiyoriy saqlang.

Foydali subyo‘l importlari:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

Faqat brauzer uchun Connect bootstrap ishlatganda, Node-dastlabki `ToriiClient` sathini import qilish o‘rniga `@iroha/iroha-js/connect-browser` dan foydalaning.

## Mahalliy Garov {#native-escrow}

JavaScript va TypeScript ilovalar Kotodama shartnomalari orqali mahalliy eskroudan foydalanishi mumkin. Eskrou host-funksiyasi chaqiruvlarini `@iroha/iroha-js/kotodama-compiler` bilan kompilyatsiya qiling; to‘g‘ridan-to‘g‘ri Mahalliy depozit operatsiyasi yaratkichlari hozirda JavaScript SDK tomonidan ochilmagan. Depozit xosti-texnik chaqirish misoli uchun [Mahalliy aktivlar garov hisobvarag‘i](/uz/blockchain/escrow.md#javascript-and-typescript-kotodama) ga qarang.

## Joriy qamrov {#current-coverage}

SDK quyidagilarga e'tibor qaratadi:

- Torii HTTP va WebSocket yordamchilar
- Norito tranzaksiya va ko‘rsatma quruvchilari
- Kotodama kompilyatsiyasi, escrow host-texnik chaqirish built-in funksiyalarini o'z ichiga oladi
- Ed25519 imzolash va kalit yaratish
- sahifalash va qayta urinib ko‘rish yordamchilari
- Brauzer bootstrap yordamchilariga ulaning
- Kagemusha tayyorgarlik, to'ldirish, qaytarib olish va operatsiya-holati tashish yordamchilari

## Oliy darajadagi manbalar {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
