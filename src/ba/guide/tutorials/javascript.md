---
translation_locale: ba
translation_source: /guide/tutorials/javascript.md
translation_source_hash: feddadb1b50c5cc8beea188fd7053eeaae58d6ab9203687e9a1378f203229168
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

Тыуған ерҙәрҙәге ҡоролмалар `cargo build -p iroha_js_host` һәм ҡулланылған платформаға специфик тикшереү суммаһын теркәп SDK башланғыс. сығанаҡ төҙөү урындары, тип раҫланған хост `native/`. Ҡуйылған `IROHA_JS_NATIVE_DIR` тик айырым төҙөлгән, сумма буйынса тикшерелгән хост менән тәьмин иткәндә генә. ESM- бары тик; CommonJS, ҡулланыу динамикаһы `import()`.

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

`taira-readonly.mjs` тип һаҡлағыҙ, һуңынан уны эшләтегеҙ:

```bash
node taira-readonly.mjs
```

SDK ҡул ҡуйылған шылтыратыуҙарға бары тик был уҡып ҡына тикшереүҙәр эшләгәндән һуң ғына күсергә мөмкин. Йәмәғәт Taira ваҡытлыса туйынған сиратты йәки шлюз ҡағиҙәһен кире ҡайтара ала, шуға күрә тере селтәрҙәге һынауҙарҙы opt-in CI менән үткәреүҙе дауам ит.

Файҙалы аҫты юл импорты:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

Бары тик браузер менән генә тоташтырыу старт-страп өсөн `@iroha/iroha-js/connect-browser` ҡулланырға, урынына индереү Node-первый `ToriiClient` өҫкө йөҙө.

## Тыуған эскровы {#native-escrow}

JavaScript һәм TypeScript ғаризалар ҡулланырға мөмкин урындағы депозит аша Kotodama контракттар. Эскроу хост шылтыратыуҙар `@iroha/iroha-js/kotodama-compiler`; тура урындағы эскроу транзакция төҙөүселәр әлеге ваҡытта JavaScript SDK. Күрәһегеҙме [Туған активтар иҫәбенә кредит](/ba/blockchain/escrow.md#javascript-and-typescript-kotodama) Эскроу хостинг саҡырыу миҫалы өсөн.

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
