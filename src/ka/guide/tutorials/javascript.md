---
translation_locale: ka
translation_source: /guide/tutorials/javascript.md
translation_source_hash: feddadb1b50c5cc8beea188fd7053eeaae58d6ab9203687e9a1378f203229168
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript და TypeScript {#javascript-and-typescript}

ამჟამინდელი JavaScript SDK არის `@iroha/iroha-js` პაკეტი Iroha წყარო ხეში. ეს არის Node.js-პირველი SDK for Torii, Norito builders, signing, pagination, Connect previews, and Kagemusha command transport.

## შენება წყაროდან {#build-from-source}

პაკეტი ამჟამად არ არის ხელმისაწვდომი საჯარო npm რეესტრიდან. შეიქმნას იგი იმავე pinned Iroha წყაროს რევიზიიდან, როგორც კვანძი თქვენ მიზნად:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

ადგილობრივი ნაგებობა დაფარავს `cargo build -p iroha_js_host` და აღწერს პლატფორმის სპეციფიკური შემოწმების რაოდენობას, რომელიც გამოიყენება SDK სტარტაპზე. წყარო ნაგებობის ადგილებში, რომლებიც შეამოწმეს მასპინძელი `native/`. შეადგინეთ `IROHA_JS_NATIVE_DIR` მხოლოდ ცალკე აშენებული, შემოწმების თანხით დადასტურებული მასპინძლის განზრახ მიწოდებისას. პაკეტი არის ESM - მხოლოდ; CommonJS-დან გამოიყენეთ დინამიური `import()`.

## სწრაფი დასაწყისი {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## შეეცადეთ Taira მხოლოდ წაკითხვა {#try-taira-read-only}

გამოიყენეთ ჩაშენებული `fetch` Node.js 24-ში, რათა შეამოწმოთ Taira ხელმოწერისა და Norito ტრანზაქციის კოდის დამატებამდე:

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

შეინახეთ იგი `taira-readonly.mjs`, შემდეგ გაუშვით:

```bash
node taira-readonly.mjs
```

გადადით SDK ხელმოწერილ ზარებზე მხოლოდ მას შემდეგ, რაც ეს წაკითხვა-მხოლოდ შემოწმებები მუშაობს. საჯარო Taira შეიძლება დროებით დაბრუნდეს შეჯერებული რიგის ან კარიბჭე შეცდომა, ასე რომ შეინახეთ ცოცხალი ქსელის ტესტები opt-in in CI.

სასარგებლო ქვემავალიანი იმპორტი:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

მხოლოდ ბრაუზერისთვის Connect bootstrap- ისთვის, გამოიყენეთ `@iroha/iroha-js/connect-browser` ნაცვლად Node-first `ToriiClient` ზედაპირის იმპორტის.

## ადგილობრივი საფინანსო ანაზღაურება {#native-escrow}

JavaScript და TypeScript აპლიკაციებში შეიძლება გამოყენებულ იქნას ადგილობრივი საფარდნო კონტრაქტები Kotodama ხელშეკრულებების მეშვეობით. შეადგინეთ საფარდო მასპინძელი მოწოდებები `@iroha/iroha-js/kotodama-compiler`; პირდაპირი ადგილობრივი ოდენობა ტრანზაქციის შემქმნელები ამჟამად არ არიან გამოფენილი JavaScript SDK. იხილეთ [ Native Asset Escrow](/ka/blockchain/escrow.md#javascript-and-typescript-kotodama) ესკროვის მასპინძელი მოწოდების მაგალითისთვის.

## ამჟამინდელი მოცულობა {#current-coverage}

SDK ორიენტირებულია:

- Torii HTTP და WebSocket დამხმარეები
- Norito ტრანზაქციების და ინსტრუქციის შემქმნელები
- Kotodama კომპილაცია, მათ შორის საფარდობო მასპინძელი მოწოდების ნაგებობები
- Ed25519 ხელმოწერა და საკვანძო თაობა
- პაჟინაციის და განმეორებითი გამოცდის დამხმარეები
- ბრაუზერის bootstrap დამხმარეების დაკავშირება
- კაგემუშას მზაობა, დამატება, გადახდა და ექსპლუატაციის სტატუსის ტრანსპორტის დამხმარეები

## წინსავალი რეფერენციები {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
