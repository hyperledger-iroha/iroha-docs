---
translation_locale: kk
translation_source: /guide/tutorials/javascript.md
translation_source_hash: d12c715de68623a7dd671e4f2f91b93dbe9fdee42ed51e3a25fbad2a9b69ca8e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# JavaScript және TypeScript {#javascript-and-typescript}

Қазіргі JavaScript SDK Iroha дереккөз ағашындағы `@iroha/iroha-js` пакеті болып табылады. Бұл Torii, Norito құрастырушылар, қол қою, бет нөмірлеу, Connect алдын ала қараулар және Kagemusha командасын тасымалдау үшін Node.js-бірінші SDK.

## Дереккөзден құру {#build-from-source}

Бұл пакет қазіргі уақытта жалпыға қолжетімді npm репестрінен табылмайды. Оны мақсат етіп отырған түйінмен бірдей бекітілген Iroha бастапқы өзгертуден жинаңыз:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

Туған жердегі құрастыру `cargo build -p iroha_js_host`-ны орап, SDK іске қосу кезінде қолданылатын платформаға тән тексеру сомасын жазады. Дереккөз құрастыру дәлелденген хостты `native/`-ге орналастырады. Тек бөлек құрылған, чекжұмысы тексерілген хостты саналы түрде ұсынған кезде `IROHA_JS_NATIVE_DIR`-ні орнатыңыз. Пакет тек ESM; CommonJS-тен динамикалық `import()` қолданыңыз.

## Жылдам бастау {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## Сынап көріңіз Taira Тек оқу үшін {#try-taira-read-only}

Node.js 24 ішіндегі кірістірілген `fetch`-ты Taira-ді қосу және Norito транзакциялық кодын енгізер алдында тексеру үшін пайдаланыңыз:

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

Оны `taira-readonly.mjs` ретінде сақтаңыз, содан кейін іске қосыңыз:

```bash
node taira-readonly.mjs
```

Осы тек оқу үшін арналған тексерулер жұмыс істегеннен кейін ғана қол қойылған SDK техникалық шақыруларға өтіңіз. Қоғамдық Taira уақытша қаныққан кезек немесе шлюз қатесін қайтаруы мүмкін, сондықтан тікелей желі тесттерін CI опция ретінде қалдырыңыз.

Пайдалы қосымша жол импорттары:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

Тек браузерге арналған Connect bootstrap үшін Node-басты `ToriiClient` бетін импорттаудың орнына `@iroha/iroha-js/connect-browser` пайдаланыңыз.

## Табиғи сенімгерлік есеп {#native-escrow}

JavaScript және TypeScript қосымшалары Kotodama келісімшарттары арқылы жергілікті эскроуды пайдалана алады. Эскроу хост-функция шақыруларын `@iroha/iroha-js/kotodama-compiler` арқылы жинақтаңыз; тікелей Туған escrow транзакция жасаушылар қазіргі уақытта JavaScript SDK арқылы қол жетімді емес. Escrow хост-texникалық шақыру мысалы үшін [Туынды активтерді сенімхатта сақтау](/kk/blockchain/escrow.md#javascript-and-typescript-kotodama) қараңыз.

## Ағымдағы қамту {#current-coverage}

SDK назар аударады:

- Torii HTTP және WebSocket көмекшілері
- Norito транзакция және нұсқаулық құрастырушылар
- Kotodama компиляциясы, оның ішінде эскроу хост-техникалық шақыру builtins
- Ed25519 қол қою және кілт генерациясы
- беттілеу және қайтадан көріп шығу көмекшілері
- Браузерді қосуды бастапқы көмекшілермен қосу
- Kagemusha дайындық, толықтыру, айырбастау және операциялық күйді тасымалдау көмекшілері

## Ағыстарға сілтемелер {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
