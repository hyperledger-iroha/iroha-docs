---
translation_locale: dz
translation_source: /guide/tutorials/javascript.md
translation_source_hash: d12c715de68623a7dd671e4f2f91b93dbe9fdee42ed51e3a25fbad2a9b69ca8e
translation_status: machine-validated
translation_engine: human-reviewed
---
# JavaScript དང་ TypeScript {#javascript-and-typescript}

ད་ལྟོའི་ JavaScript SDK འདི་ `@iroha/iroha-js` ཆ་ཚན་འདི་ཨིན། Iroha གཞི་རྟེན་ཤིང་ནང་ཡོདཔ་ཨིན། འདི་གིས་ Node.js དང་པ་ SDK འབད་ནི་འདི་གིས་ Torii, Norito སྒྲིག་བཟོ་མི་ཚུ་གི་དོན་ལུ་ཨིན་ ཨེབ་གཏང་འབད་ཐངས་, ཤོག་ལེབ, མཐུད་སྦྲེལ སྔོན་བལྟ་ཐངས་དང་ Kagemusha བཀའ་ཤོག་སྐྱེལ་འདྲེན་ཚུ་ཨིན།

## གཞི་རྟེན་ནང་ལས་ བཟོ་སྐྲུན་འབད་ {#build-from-source}

ཕབ་ལེཊ་འདི་ ད་རེས་ མི་མང་གི་ npm ཐོ་བཀོད་ནང་ལས་ལག་ལེན་འཐབ་མ་ཚུགསཔ་ཨིན། ཁྱོད་ཀྱིས་དམིགས་གཏད་འབད་ཡོད་པའི་ཨེབ་གཏང་འབད་ཡོད་མི་ Iroha གཞི་རྟེན་བསྐྱར་བཅོས་ལས་ བཟོ་:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

རང་ལུགས་བཟོ་སྐྲུན་འདི་གིས་ `cargo build -p iroha_js_host` སྦྲགས་ཏེ་ SDK འགོ་བཙུགས་པའི་སྐབས་ལུ་ལག་ལེན་འཐབ་མི་ སྟེགས་བུ-དམིགས་བསལ ཞིབ་དཔྱད་བསྡོམས འདི་ཐོ་བཀོད་འབདཝ་ཨིན། གཞི་རྟེན་བཟོ་སྐྲུན་ས་ཁོངས་འདི་ `native/` ནང་ མགྲོན་སྐྱོང་གློག་འཕྲུལ བརྟག་ཞིབ་འབད་ཡོད་པའི་ས་སྒོ་ཨིན། `IROHA_JS_NATIVE_DIR` གཞི་བཙུགས་འབད་ཞིནམ་ལས་རྐྱངམ་ཅིག་ དམིགས་བསལ་དུ་བཟོ་སྐྲུན་འབད་མི་, ཞིབ་དཔྱད་བསྡོམས-བདེན་དཔྱད་གྲུབ མགྲོན་སྐྱོང་གློག་འཕྲུལ མཁོ་སྤྲོད་འབད་བའི་སྐབས་འབད། ཆ་ཚན་འདི་ ESM -རྐྱངམ་ཅིག་ཨིན། CommonJS ལས་, ལག་ལེན་འཐབ་ནི་ཤུགས་ཅན་ `import()`.

## མགྱོགས་པ་རང་འགོ་བཙུགས་ {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## Taira ཀློག་རྐྱབས་ཅིག་ལུ་ བརྟག་དཔྱད་འབད་ {#try-taira-read-only}

Node.js 24ནང་ལུ་བཙུགས་ཡོད་པའི་ `fetch` ལག་ལེན་འཐབ་སྟེ་ Taira བརྟག་ཞིབ་འབད་ཞིནམ་ལས་ རྟགས་མཚན་དང་ Norito ཕྱིར་ཚོང་གི་ལྡེ་མིག་ཚུ་མ་གཏངམ་ད་:

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

`taira-readonly.mjs` སྦེ་སྲུང་བཞག་འབད་ཞིནམ་ལས་ གཡོག་བཀོལ།

```bash
node taira-readonly.mjs
```

ལྷག་རྐྱངམ་ཅིག་ཞིབ་དཔྱད་འདི་ཚུ་ལཱ་འབད་བའི་ཤུལ་ལས་རྐྱངམ་ཅིག་ མིང་རྟགས་བཀོད་ཡོད་པའི་ SDK འབོད་བརྡ་ཚུ་ལུ་སྤོ་བཤུད་འབད། མི་མང་ Taira གིས་ གནས་སྐབས་ཅིག་གི་དོན་ལུ་ ཚད་གཞི་ཚངམ་སྦེ་ཡོད་མི་ བང་རིམ་ཡང་ན་ འཛུལ་སྒོ་འཛོལ་བ་སླར་ལོག་འབད་ཚུགས། དེ་འབདཝ་ལས་ ཡོངས་འབྲེལ་བརྟག་དཔྱད་ཚུ་ CI ནང་ལུ་ གདམ་ཁ་རྐྱབ་སྟེ་བཞག།

ཕན་ཐོགས་ཅན་གྱི་ཡན་ལག་འགྲུལ་ལམ་ནང་འདྲེན་ཚུ།

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

བརྡ་འཚོལ་རྐྱངམ་ཅིག་མཐུད་པའི་བུཊི་སི་ཊརཔ་གི་དོན་ལུ་ མཐུད་མཚམས་-དང་པ་ `ToriiClient` ཁ་ཐོག་ནང་འདྲེན་འབད་ནིའི་ཚབ་ལུ་ `@iroha/iroha-js/connect-browser` ལག་ལེན་འཐབ།

## རང་ལུགས་ཀྱི་ བར་གཏོགས་བདག་ཉར {#native-escrow}

JavaScript དང་ TypeScript ཞུ་ཡིག་ཚུ་གིས་ Kotodama གན་རྒྱ་བརྒྱུད་དེ་ ས་གནས་ཀྱི་ བཀག་ཆ་ལག་ལེན་འཐབ་བཏུབ། `@iroha/iroha-js/kotodama-compiler` དང་ཅིག་ཁར་ ཨེསི་ཀོརོ་ཧོསིཊི་འབོད་བརྡ་ཚུ་ བསྡུ་སྒྲིག་འབད། ཐད་ཀར་ས་གནས་ཀྱི་ བཀག་སྡོམ་ཚོང་འབྲེལ་བཟོ་མི་ཚུ་ ད་ལྟོ་ JavaScript SDK གིས་ གསལ་སྟོན་འབད་མི་བཏུབ། བལྟ། [ས་གནས་ཀྱི་རྒྱུ་དངོས་ཨེས་ཀོར](/dz/blockchain/escrow.md#javascript-and-typescript-kotodama) ཨེས་ཀོརོ་ཧོསིཊི་-འབོད་བརྡ་དཔེ་ལུ།

## ད་ལྟོའི་ཁྱབ་ཚད་ {#current-coverage}

SDK གིས་གཙོ་བོར་བཏོན་ཡོད།

- Torii HTTP དང་ WebSocket གི་ཆ་རོགས་འབད་མི་ཚུ་
- Norito ཚོང་འབྲེལ་དང་བཀོད་རྒྱ་བཟོ་སྐྲུན་འབད་མི་
- Kotodama ཕྱོགས་བསྒྲིགས།
- Ed25519 མིང་རྟགས་དང་ལྡེ་མིག་བཟོ་སྐྲུན།
- ཤོག་ལེབ་བཟོ་ནི་དང་ ལོག་འབད་ནིའི་གྲོགས་རམ་འབད་མི་ཚུ།
- བརྡ་འཚོལ་བུཊི་སི་ཊརཔ་གྲོགས་རམ་འབད་མི་ཚུ་མཐུད།
- ཀ་གེ་མུ་ཤ་གྲ་སྒྲིག་དང་ ཁ་སྐོང་ བསྐྱར་གསོ་ དེ་ལས་ ལག་ལེན་གནས་ཚད་སྐྱེལ་འདྲེན་གྱི་གྲོགས་རམ་འབད་མི་ཚུ་

## གཙོ་རིམ་གོང་མའི་ཁ་བྱང་ཚུ་ {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
