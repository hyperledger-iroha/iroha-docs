---
translation_locale: kk
translation_source: /guide/tutorials/javascript.md
translation_source_hash: feddadb1b50c5cc8beea188fd7053eeaae58d6ab9203687e9a1378f203229168
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript және TypeScript {#javascript-and-typescript}

Ағымдағы JavaScript SDK болып табылады `@iroha/iroha-js` жинақталған Iroha Бастапқы ағаш. Node.js- Біріншісі SDK үшін Torii, Norito Құрылысшылар, қолтаңбалау, бетбелгілеу, қосылу алдын ала қарау және Кагемуша командасы көлігі.

## Қайдан пайда болғаныңды біліп ал {#build-from-source}

Пакет қазіргі уақытта npm мемлекеттік тіркелгіден қолжетімді емес. Оны мақсат еткен түйінге сәйкес тіктелген Iroha көзді қайта қараудан жасаңыз:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

Түпкiлiктi қаптамалар `cargo build -p iroha_js_host` және платформаға қатысты пайдаланылған тексеру сомасын есепке алады SDK бастау. Бастапқы орындар құрылады `native/`. Жинақтау `IROHA_JS_NATIVE_DIR` Тек жеке салынған, санмен тексерілетін хостты қасақана жеткізу кезінде ғана. ESM- тек қана; CommonJS, пайдалану динамикасы `import()`.

## Шұғыл бастау {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## Taira Тек оқуға тырыс {#try-taira-read-only}

Құрылысқан пайдалану `fetch` ішінде Node.js Зондқа 24 Taira қол қоюдан бұрын және Norito транзакциялық код:

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

`taira-readonly.mjs` деп сақтау, содан кейін орындаңыз:

```bash
node taira-readonly.mjs
```

Тек осы тек оқуға арналған тексерулер жұмыс істегеннен кейін ғана қол қойылған SDK шақыруларға өту. Қоғамдық Taira уақытша толы кезекті немесе шлюз қатесін қайтара алады, сондықтан тірі желілік тестілерді CI таңдап алуды сақтау керек.

Пайдалы қосалқы жолды импорттау:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

Тек браузерге қосылған Connect ботстрап үшін Node-first `ToriiClient` бетін импорттаудың орнына `@iroha/iroha-js/connect-browser` пайдалану.

## Жергiлiктi банктер {#native-escrow}

JavaScript және TypeScript қолданбалар арқылы жергiлiктi кепілдендіруді пайдалана алады Kotodama Контракттар. `@iroha/iroha-js/kotodama-compiler`; Тiкелей жергiлiктi кепілгерлік транзакция жасаушылары JavaScript SDK. Қараңыз [Жергiлiктi активтердi басқару](/kk/blockchain/escrow.md#javascript-and-typescript-kotodama) Эскорлық қоректенуші шақыру үлгісі үшін.

## Қазіргі кездегі қамту {#current-coverage}

SDK мыналарға баса назар аударады:

- Torii HTTP және WebSocket көмекшілер
- Norito транзакциялар және нұсқаулар жасаушылар
- Kotodama жинағы, оның ішінде депозиттік қоректендіруші шақыру құрылымы
- Ed25519 қолтаңбалау және кілттің ұрпағы
- параметрлеу және қайта сынау көмекшілері
- Браузерді бастау қапшығы көмекшілерін қосу
- Кагемушаның дайындығы, толықтыруы, құнын өтеу және қызмет ету жағдайындағы көлік көмекшілері.

## Өскемендік сілтемелер {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
