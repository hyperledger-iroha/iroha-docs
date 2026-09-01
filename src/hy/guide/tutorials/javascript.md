---
translation_locale: hy
translation_source: /guide/tutorials/javascript.md
translation_source_hash: d12c715de68623a7dd671e4f2f91b93dbe9fdee42ed51e3a25fbad2a9b69ca8e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript եւ TypeScript {#javascript-and-typescript}

Ներկայումս JavaScript SDK-ը `@iroha/iroha-js` փաթեթն է Iroha աղբյուրի ծառում: Այն Node.js-ի առաջին SDK է Torii, Norito շինարարների համար, ստորագրություն, էջավորումը, Connect նախադասությունները եւ Kagemusha հրաման տրանսպորտի համար:

## Կառուցեք աղբյուրից {#build-from-source}

Փաթեթը ներկայումս հասանելի չէ հանրային npm գրանցամատյակից: Կառուցեք այն նույն փակված Iroha աղբյուրի վերանայման միջոցով, ինչպես ձեր թիրախավորած հանգույցը.

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

Բնական հավաքումը ներառում է `cargo build -p iroha_js_host` հրամանը և գրանցում հարթակին հատուկ ստուգիչ գումարը, որն օգտագործվում է SDK-ի գործարկման պահին։ Սկզբնաղբյուրից հավաքման ժամանակ այդ ստուգված հոսթը տեղադրվում է `native/` պանակում։ `IROHA_JS_NATIVE_DIR`-ը սահմանեք միայն այն դեպքում, երբ միտումնավոր տրամադրում եք առանձին հավաքված և ստուգիչ գումարով հաստատված հոսթ։ Փաթեթը միայն ESM-ի համար է. CommonJS-ից օգտագործեք դինամիկ `import()`։

## Արագ սկիզբ {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## Փորձեք Taira Միայն կարդալ {#try-taira-read-only}

Կառուցված օգտագործումը `fetch` մինետ Node.js 24 հետաքննություն Taira նախքան ստորագրություն ավելացնելը եւ Norito գործարքի կոդը.

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

Պահպանեք այն `taira-readonly.mjs`, ապա գործարկեք այն.

```bash
node taira-readonly.mjs
```

Գնացեք ստորագրված SDK զանգերին միայն այն բանից հետո, երբ այս միայն ընթերցման ստուգումները գործում են: Հանրային Taira կարող է ժամանակավորապես վերադարձնել հագեցած հերթը կամ մուտքի ուղու սխալը, այնպես որ պահեք կենդանի ցանցի փորձարկումների opt-in-ը CI.

Օգտակար ենթուղիների ներմուծում.

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

Միայն բրաուզերային Connect bootstrap- ի համար օգտագործեք `@iroha/iroha-js/connect-browser` ՝ փոխարենը ներմուծելով Node- ի առաջին `ToriiClient` մակերեսը:

## Բնակչական վարձակալություն {#native-escrow}

JavaScript եւ TypeScript ծրագրերը կարող են օգտագործել ներքին պահպանումներ Kotodama պայմանագրերի միջոցով: Կազմեք պահպանումների հյուրընկալող զանգեր `@iroha/iroha-js/kotodama-compiler`; ուղղակի ներքին պահապան Գործարքի կառուցողները ներկայումս չեն ենթարկվում JavaScript SDK հաշվետվության: Դիտեք [Ակտիվների ներկառուցված էսքրո](/hy/blockchain/escrow.md#javascript-and-typescript-kotodama) վարկային հյուրընկալող զանգերի օրինակը:

## Ներկայիս ծավալը {#current-coverage}

SDK կենտրոնանում է հետեւյալ վրա.

- Torii HTTP եւ WebSocket օգնականներ
- Norito գործարքների եւ հրահանգների կառուցողներ
- Kotodama կոմպիլացիան, ներառյալ հյուրընկալող զանգերի կառուցվածքները:
- Ed25519 ստորագրում եւ առանցքային սերունդ
- pagination եւ retry օգնականներ
- Կապացրեք բրաուզերների bootstrap օգնականները
- Kagemusha- ի պատրաստակամություն, լրացում, փոխհատուցում եւ շահագործման կարգավիճակի տրանսպորտային օգնականներ

## Վերածննդային հղումներ {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
