---
translation_locale: ba
translation_source: /guide/tutorials/javascript.md
translation_source_hash: d12c715de68623a7dd671e4f2f91b93dbe9fdee42ed51e3a25fbad2a9b69ca8e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript һәм TypeScript {#javascript-and-typescript}

Ағым JavaScript SDK был `@iroha/iroha-js` пакеты Iroha сығанағы ағасы. Node.js- тәүҙә SDK өсөн Torii, Norito Төҙөүселәр, ҡултамғалау, биттәрҙе биҙәү, "Коннект" премьералары һәм Кагемуша командаһы транспорты.

## Сығышығыҙҙан төҙөгөҙ {#build-from-source}

Пакеты әлеге ваҡытта асыҡ npm реестрында юҡ. уны һеҙ маҡсатҡа ҡуйған узел менән бер үк тығыҙланған Iroha сығанаҡ ревизияһынан төҙөгөҙ:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

Native төҙөлөш `cargo build -p iroha_js_host` командаһын урай һәм SDK эш башлағанда ҡулланылған платформаға хас checksum-ды теркәй. Сығанаҡтан төҙөлөш тикшерелгән host-ты `native/` эсенә ҡуя. `IROHA_JS_NATIVE_DIR`-ҙы тик айырым төҙөлгән һәм checksum-ы тикшерелгән host-ты аңлы рәүештә биргәндә генә көйләгеҙ. Пакет ESM өсөн генә; CommonJS-та динамик `import()` ҡулланығыҙ.

## Тиҙерәк старт {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## Taira Тик уҡырға ғына {#try-taira-read-only}

Node.js 24-тә төҙөлгән `fetch` ҡултамғалау һәм Norito транзакция кодын өҫтәр алдынан Taira тикшерергә ҡулланыу:

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

`taira-readonly.mjs` тип һаҡлағыҙ, һуңынан уны эшләтегеҙ:

```bash
node taira-readonly.mjs
```

SDK ҡул ҡуйылған саҡырыуҙарға бары тик был уҡып ҡына тикшереүҙәр эшләгәндән һуң ғына күсергә мөмкин. Йәмәғәт Taira ваҡытлыса туйынған сиратты йәки шлюз ҡағиҙәһен кире ҡайтара ала, шуға күрә тере селтәрҙәге һынауҙарҙы opt-in CI менән үткәреүҙе дауам ит.

Файҙалы аҫты юл импорты:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

Бары тик браузер менән генә тоташтырыу старт-страп өсөн `@iroha/iroha-js/connect-browser` ҡулланырға, урынына индереү Node-первый `ToriiClient` өҫкө йөҙө.

## Протоколға индерелгән эскроу {#native-escrow}

JavaScript һәм TypeScript ҡушымталары Kotodama contracts аша native escrow ҡуллана ала. Escrow host calls-ты `@iroha/iroha-js/kotodama-compiler` менән compile итегеҙ; JavaScript SDK әлегә direct native escrow transaction builders тәҡдим итмәй. Escrow host-call миҫалын [JavaScript һәм TypeScript Kotodama](/ba/blockchain/escrow.md#javascript-and-typescript-kotodama) бүлегендә ҡарағыҙ.

## Хәҙерге яҡтыртыу {#current-coverage}

SDK түбәндәгеләргә иғтибар итә:

- Torii HTTP һәм WebSocket ярҙамсылары
- Norito операциялар һәм инструкция төҙөүселәре
- Kotodama йыйынтығын, шул иҫәптән эскроу-хост саҡырыу ҡоролмаларын
- Ed25519 ҡултамғалау һәм асҡыс генерацияһы
- һылтанма һәм ҡабаттан һынау ярҙамсылары
- Браузерҙы стартлау ярҙамсыларын тоташтырыу
- Кагемушаға әҙерлек, өҫтәмәләр, түләүҙәр һәм хеҙмәтләндереү статусы буйынса транспорт ярҙамсылары

## Үрге йүнәлештәге белешмәләр {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
