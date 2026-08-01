---
translation_locale: ru
translation_source: /guide/tutorials/javascript.md
translation_source_hash: feddadb1b50c5cc8beea188fd7053eeaae58d6ab9203687e9a1378f203229168
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript и TypeScript {#javascript-and-typescript}

Текущий JavaScript SDK является пакетом `@iroha/iroha-js` в источниковом дереве Iroha. Это первый Node.js-первый SDK для конструкторов Torii, Norito, подписи, pagination, предварительных просмотров соединения и Kagemusha командный транспорт.

## Строить из источника {#build-from-source}

Пакет в настоящее время не доступен из общедоступного реестра npm. Создайте его из того же закрепленного Iroha исходного пересмотра, что и узел, на который вы ориентируетесь:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

Местные постройки заворачиваются `cargo build -p iroha_js_host` и записывает сумму проверки, используемую на платформе SDK Источник создает места, которые проверяют хост в `native/`. Установка `IROHA_JS_NATIVE_DIR` только при намеренном поставке отдельно построенного хоста с проверкой сумм. ESM- только; от CommonJS, динамика использования `import()`.

## Быстрый старт {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## Попробуйте Taira Читайте только {#try-taira-read-only}

Используйте встроенный `fetch` в Node.js 24 для исследования Taira перед добавлением кода подписи и транзакции Norito:

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

Сохранить его как `taira-readonly.mjs`, а затем запустить:

```bash
node taira-readonly.mjs
```

Перейти к подписанным SDK звонкам только после того, как эти проверки для чтения будут работать. Общественное Taira может временно возвращать насыщенную очередь или ошибку шлюза, поэтому поддерживайте выбор в тестах в живой сети в CI.

Прием полезных поддорожников:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

Для браузера Connect bootstrap, используйте `@iroha/iroha-js/connect-browser` вместо импорта поверхности Node-first `ToriiClient`.

## Местные банковские кредиты {#native-escrow}

JavaScript и TypeScript приложения могут использовать нативный депозит через Kotodama Составить сопроводительные звонки хозяина `@iroha/iroha-js/kotodama-compiler`; непосредственными создателями транзакций налога не подвергаются риску в настоящее время JavaScript SDK. Смотрите . [Сберегательная задолженность за собственные активы](/ru/blockchain/escrow.md#javascript-and-typescript-kotodama) для экспонатов по вызову хозяина.

## Нынешнее охватывание {#current-coverage}

SDK сосредоточен на:

- Torii HTTP и WebSocket помощники
- Norito конструкторы транзакций и инструкций
- Kotodama сборник, включающий в себя конфиденциальные хостинг-связи
- Ed25519 Подпись и генерация ключей
- помощники по пересмотру страниц и повторной пробке
- Подключить помощники для загрузки браузера
- Готовность Kagemusha, пополнение, выкуп и транспортные помощники с эксплуатационным статусом

## Ссылки вверх по течению {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
