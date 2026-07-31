---
translation_locale: ka
translation_source: /guide/tutorials/javascript.md
translation_source_hash: feddadb1b50c5cc8beea188fd7053eeaae58d6ab9203687e9a1378f203229168
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript და TypeScript {#javascript-and-typescript}

მიმდინარე JavaScript SDK ეს არის `@iroha/iroha-js` შეფუთვა Iroha
წყარო ხე. ეს არის Node.js- პირველი. SDK სამედიცინო Torii, Norito მშენებლები, ხელმოწერა,
პაგინაცია, კონექტის წინათვალი და კაგემუშას ბრძანების ტრანსპორტი.

## შენება წყაროდან {#build-from-source}

პაკეტი ამჟამად საჯარო არ არის ხელმისაწვდომი npm კაპიტარი. ააშენეთ იგი
ერთი და იმავე ჩაკეტილიდან Iroha წყაროს რევიზიონი, როგორც თქვენი მიზნობრივი კვანძი:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

ადგილობრივი ნაგებობები `cargo build -p iroha_js_host` და აღწერს
პლატფორმაზე სპეციფიკური შემოწმების თანხა, რომელიც გამოიყენება SDK საწყისი. წყარო ქმნის ადგილებს, რომლებიც
შემოწმებული მასპინძელი `native/`. კომპლექტი `IROHA_JS_NATIVE_DIR` მხოლოდ მაშინ, როდესაც მიზანმიმართულად
ცალკე აშენებული, გადარიცხვით შემოწმებული მასპინძლის მიწოდება. ESM-მხოლოდ;
საგანგებო CommonJS, გამოყენების დინამიკა `import()`.

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

## სცადე. Taira მხოლოდ წაკითხვა {#try-taira-read-only}

გამოყენება ჩაშენებული `fetch` დაწვრილებით Node.js 24 სონდში Taira სანამ ხელმოწერა შეემატება და
Norito ტრანზაქციის კოდი:

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

შეინახეთ როგორც `taira-readonly.mjs`, შემდეგ გაუშვი:

```bash
node taira-readonly.mjs
```

გადასვლა ხელმოწერილი SDK ზარები მხოლოდ მას შემდეგ, რაც ეს მხოლოდ წაკითხვის შემოწმებები მუშაობს. Taira
შეუძლია დროებით დაბრუნდეს შეჯერებული რიგის ან საღობე შეცდომა, ასე რომ, შეინარჩუნოს ცოცხალი ქსელი
ტესტები opt-in CI.

სასარგებლო ქვემავალი იმპორტი:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

მხოლოდ ბრაუზერისთვის Connect bootstrap, გამოიყენეთ `@iroha/iroha-js/connect-browser`
ნაცვლად იმპორტის Node-პირველი `ToriiClient` ზედაპირი.

## ნაციონალური საფინანსო დავალიანება {#native-escrow}

JavaScript და TypeScript აპლიკაციები შეიძლება გამოიყენოს native escrow Kotodama
კონტრაქტები. შეადგინეთ escrow მასპინძელი ზარები
`@iroha/iroha-js/kotodama-compiler`; პირდაპირი ადგილობრივი საფინანსო ტრანზაქციების შემქმნელები
ამჟამად არ არის გამოფენილი JavaScript SDK. იხილეთ
[ნაციონალური აქტივების გადახდა](/ka/blockchain/escrow.md#javascript-and-typescript-kotodama)
საფლავის მასპინძელი ზარის მაგალითისთვის.

## მიმდინარე დაფარვა {#current-coverage}

სააგენტო SDK ყურადღება გამახვილებულია:

- Torii HTTP და WebSocket დამხმარეები
- Norito ტრანზაქციების და ინსტრუქციის შემქმნელები
- Kotodama კომპილიტაცია, მათ შორის საფინანსო მასპინძელი ზარის ჩაშენებები
- Ed25519 ხელმოწერა და საკვანძო თაობა
- გვერდების დარეგისტრირება და განახლება
- ბრაუზერის bootstrap დამხმარეებს დააკავშიროთ
- კაგემუშას მზაობა, დამატება, გადახდა და ექსპლუატაციის სტატუსის ტრანსპორტი
  დამხმარეები

## წინსავალი რეფერენციები {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
