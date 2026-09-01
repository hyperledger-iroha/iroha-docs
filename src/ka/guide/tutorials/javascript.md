---
translation_locale: ka
translation_source: /guide/tutorials/javascript.md
translation_source_hash: d12c715de68623a7dd671e4f2f91b93dbe9fdee42ed51e3a25fbad2a9b69ca8e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript და TypeScript {#javascript-and-typescript}

მიმდინარე JavaScript SDK არის Iroha-ს წყაროს ხეში არსებული `@iroha/iroha-js` პაკეტი. ეს არის Node.js-ზე ორიენტირებული SDK Torii-სთვის, Norito-ს შემქმნელებისთვის, ხელმოწერისთვის, გვერდებად დაყოფისთვის, Connect-ის წინასწარი დათვალიერებისთვის და Kagemusha-ს ბრძანებების ტრანსპორტისთვის.

## შენება წყაროდან {#build-from-source}

პაკეტი ამჟამად არ არის ხელმისაწვდომი საჯარო npm რეესტრიდან. შეიქმნას იგი იმავე დამაგრებული Iroha წყაროს რევიზიიდან, როგორც კვანძი თქვენ მიზნად:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

ადგილობრივი ნაგებობა დაფარავს `cargo build -p iroha_js_host` და აღწერს პლატფორმის სპეციფიკური შემოწმების რაოდენობას, რომელიც გამოიყენება SDK სტარტაპზე. წყარო ნაგებობის ადგილებში, რომლებიც შეამოწმეს ჰოსტი `native/`. შეადგინეთ `IROHA_JS_NATIVE_DIR` მხოლოდ ცალკე აშენებული, შემოწმების თანხით დადასტურებული მასპინძლის განზრახ მიწოდებისას. პაკეტი არის ESM - მხოლოდ; CommonJS-დან გამოიყენეთ დინამიური `import()`.

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

შეინახეთ იგი `taira-readonly.mjs`, შემდეგ გაუშვით:

```bash
node taira-readonly.mjs
```

ხელმოწერილ SDK გამოძახებებზე მხოლოდ ამ მხოლოდ-წაკითხვის შემოწმებების წარმატებით დასრულების შემდეგ გადადით. საჯარო Taira-მ შეიძლება დროებით გადატვირთული რიგის ან კარიბჭის შეცდომა დააბრუნოს, ამიტომ მოქმედ ქსელზე ტესტები CI-ში არჩევითი დატოვეთ.

სასარგებლო ქვემავალიანი იმპორტი:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

მხოლოდ ბრაუზერისთვის Connect საწყისი გამართვა- ისთვის, გამოიყენეთ `@iroha/iroha-js/connect-browser` ნაცვლად კვანძი-პირველი `ToriiClient` ზედაპირის იმპორტის.

## ადგილობრივი საფინანსო ანაზღაურება {#native-escrow}

JavaScript და TypeScript აპლიკაციები შეიძლება გამოიყენოს ადგილობრივი ესქრო მეშვეობით Kotodama კონტრაქტები. შეადგინეთ ესქრო ჰოსტ-ფუნქციის მოწოდებები `@iroha/iroha-js/kotodama-compiler`; პირდაპირი ადგილობრივი საფინანსო ტრანზაქციების შემქმნელები ამჟამად არ არიან ექსპოზიციონერები JavaScript SDK. იხილეთ [ნაციონალური აქტივების დაფარვა](/ka/blockchain/escrow.md#javascript-and-typescript-kotodama) დაფარვის მასპინძლის ტექნიკური მოწოდების მაგალითისთვის.

## ამჟამინდელი მოცულობა {#current-coverage}

SDK ორიენტირებულია:

- Torii HTTP და WebSocket დამხმარეები
- Norito ტრანზაქციების და ინსტრუქციის შემქმნელები
- Kotodama შედგენა, მათ შორის დაფარვის ჰოსტი ტექნიკური ინვოკაციის ნაგებობები
- Ed25519 ხელმოწერა და საკვანძო თაობა
- პაჟინაციის და განმეორებითი გამოცდის დამხმარეები
- ბრაუზერის საწყისი გამართვა დამხმარეების დაკავშირება
- კაგემუშას მზაობა, დამატება, გადახდა და ექსპლუატაციის სტატუსის ტრანსპორტის დამხმარეები

## წინსავალი რეფერენციები {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
