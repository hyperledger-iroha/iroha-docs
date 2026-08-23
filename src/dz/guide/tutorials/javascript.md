---
translation_locale: dz
translation_source: /guide/tutorials/javascript.md
translation_source_hash: d12c715de68623a7dd671e4f2f91b93dbe9fdee42ed51e3a25fbad2a9b69ca8e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript དང་ TypeScript {#javascript-and-typescript}

ད་ལྟོའི་ JavaScript SDK འདི་ `@iroha/iroha-js` སྦ་སྒོར་འདི་ཨིན། Iroha གཞི་རྟེན་ཤིང་ནང་ཡོདཔ་ཨིན། འདི་གིས་ Node.js དང་པ་ SDK འབད་ནི་འདི་གིས་ Torii, Norito སྒྲིག་བཟོ་མི་ཚུ་གི་དོན་ལུ་ཨིན་ ཨེབ་གཏང་འབད་ཐངས་, pagination, Connect སྔོན་བལྟ་ཐངས་དང་ Kagemusha བཀའ་ཤོག་སྐྱེལ་འདྲེན་ཚུ་ཨིན།

## གཞི་རྟེན་ནང་ལས་ བཟོ་སྐྲུན་འབད་ {#build-from-source}

ཕབ་ལེཊ་འདི་ ད་རེས་ མི་མང་གི་ npm ཐོ་བཀོད་ནང་ལས་ལག་ལེན་འཐབ་མ་ཚུགསཔ་ཨིན། ཁྱོད་ཀྱིས་དམིགས་གཏད་འབད་ཡོད་པའི་ཨེབ་གཏང་འབད་ཡོད་མི་ Iroha གཞི་རྟེན་བསྐྱར་བཅོས་ལས་ བཟོ་:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

རང་ལུགས་བཟོ་སྐྲུན་འདི་གིས་ `cargo build -p iroha_js_host` སྦྲགས་ཏེ་ SDK འགོ་བཙུགས་པའི་སྐབས་ལུ་ལག་ལེན་འཐབ་མི་ platform-specific checksum འདི་ཐོ་བཀོད་འབདཝ་ཨིན། གཞི་རྟེན་བཟོ་སྐྲུན་ས་ཁོངས་འདི་ `native/` ནང་ host བརྟག་ཞིབ་འབད་ཡོད་པའི་ས་སྒོ་ཨིན། `IROHA_JS_NATIVE_DIR` གཞི་བཙུགས་འབད་ཞིནམ་ལས་རྐྱངམ་ཅིག་ དམིགས་བསལ་དུ་བཟོ་སྐྲུན་འབད་མི་, checksum-verified host མཁོ་སྤྲོད་འབད་བའི་སྐབས་འབད། སྦ་སྒོར་འདི་ ESM -རྐྱངམ་ཅིག་ཨིན། CommonJS ལས་, ལག་ལེན་འཐབ་ནི་ཤུགས་ཅན་ `import()`.

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

འདི་ `taira-readonly.mjs`སྦེ་བཞག་ཞིནམ་ལས་ བཏོན་གཏང་:

```bash
node taira-readonly.mjs
```

ཐོ་བཀོད་འབད་མི་ SDK བརྒྱུད་འཕྲིན་ཚུ་ ཀློག་རྐྱང་གི་བརྟག་དཔྱད་ཚུ་ འབད་ཚར་བའི་ཤུལ་ལས་རྐྱངམ་གཅིག་ བསྡུ་ལེན་འབད་ཚུགས། མི་མང་ Taira གིས་ གནས་སྐབས་ཀྱི་དོན་ལུ་ མཚམས་སྦྱོར་ཅན་གྱི་གྲལ་ཐིག་ ཡང་ན་ gateway གི་འཛོལ་བ་ལོག་གཏང་ཚུགས་ནི་ཨིནམ་ལས་ ཕྲ་ལམ་མཐུད་སྦྲེལ་གྱི་བརྟག་དཔྱད་འབད་ནི་ལུ་ opt-in འབད་ནི་འདི་ CI ལུ་བཞག་ནི།

ཕན་ཐོགས་ཅན་གྱི་ ས་འོག་ལམ་གྱི་ ནང་འདྲེན་:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

བོསི་རྐྱང་གི་ connect bootstrapགི་དོན་ལུ་ Node-first `ToriiClient` ས་ཐིག་འདི་ ནང་འདྲེན་འབད་བ་ཚབ་ལུ་ `@iroha/iroha-js/connect-browser` ལག་ལེན་འཐབ་དགོ།

## རང་ལུགས་ཀྱི་ Escrow {#native-escrow}

JavaScript དང་TypeScript གི་ལག་ལེན་ཚུ་ནང་ native escrow གྱི་ཐོག་ལས་ Kotodama གི་ཞལ་འཆེས་ཚུ་ ལག་ལེན་འཐབ་ཚུགས། `@iroha/iroha-js/kotodama-compiler`དང་གཅིག་ཁར་ escrow host calls བསྡུ་སྒྲིག་འབད། direct native escrew ཚོང་འབྲེལ་བཟོ་མི་ཚུ་ ད་རེས་ JavaScript SDK གིས་ ཉེན་ཁ་མ་ཐོནམ་ཨིན། དཔེ་འདི་བལྟ་ནིའི་དོན་ལུ་ [ Native Asset Escrow](/dz/blockchain/escrow.md#javascript-and-typescript-kotodama) འདི་ལྟ་དགོ།

## ད་ལྟོའི་ཁེ་ཕན་ {#current-coverage}

SDK འདི་ནང་ལུ་ དམིགས་གཏད་བཀོད་ནི་དེ་:

- Torii HTTP དང་ WebSocket གི་ཆ་རོགས་འབད་མི་ཚུ་
- Norito ཚོང་འབྲེལ་དང་བཀོད་རྒྱ་བཟོ་སྐྲུན་འབད་མི་
- Kotodama བསྡུ་སྒྲིག་འབད་ཐངས་དང་རྩིས་ཏེ་ སྦྲེལ་གཏུགས་ host call building
- Ed25519 རྟགས་མཚན་དང་ལྡན། བཟོ་སྐྲུན་
- ཤོག་ལེབ་བཟོ་སྐྲུན་དང་ བསྐྱར་ཞིབ་འབད་ཐངས་ཚུ་
- གློག་ཀླད་འདི་ bootstrap ཆ་རོགས་འབད་མི་ཚུ་མཐུད་སྦྲེལ་འབད།
- Kagemusha གྲ་སྒྲིག་འབད་ནི་དང་ བསྡུ་ལེན་འབད་ནི་ དེ་ལས་ སྐྱེལ་འདྲེན་གྱི་གནས་སྟངས་ལུ་ རྒྱབ་སྐྱོར་འབད་མི་ཚུ་

## གཙོ་རིམ་གོང་མའི་ཁ་བྱང་ཚུ་ {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
