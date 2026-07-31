---
translation_locale: ru
translation_source: /guide/tutorials/javascript.md
translation_source_hash: feddadb1b50c5cc8beea188fd7053eeaae58d6ab9203687e9a1378f203229168
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript и TypeScript {#javascript-and-typescript}

Текущий JavaScript SDK Это `@iroha/iroha-js` в упаковке Iroha
источник дерева. Node.js-первое. SDK для Torii, Norito строители, подпись,
Веб-казино, превью соединения и транспорт кагемуши.

## Строить из источника {#build-from-source}

Пакет в настоящее время не доступен для общественности npm Реестр.
из одного и того же запчасти Iroha пересмотр источника в качестве узла , на который вы ориентируетесь:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

Коренные постройки . `cargo build -p iroha_js_host` и записывает
Платформа-специфическая сумма проверки, используемая на SDK источник создает места, которые
проверенный хост в `native/`. Сборник `IROHA_JS_NATIVE_DIR` только в том случае, если они намеренно
поставки отдельно построенного, проверенного суммой хоста. ESM- только;
от CommonJS, динамика использования `import()`.

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

## Попробуйте . Taira Читать только {#try-taira-read-only}

Использование встроено `fetch` в Node.js 24 к зонде Taira до добавления подписи и
Norito код сделки:

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

Сохраните его как `taira-readonly.mjs`, Затем запустить:

```bash
node taira-readonly.mjs
```

Перейти к подписанному SDK Звонок только после того, как эти проверки для чтения будут работать. Taira
может временно вернуть насыщенную очередь или ошибку шлюза, так что держите живую сеть
тесты opt-in CI.

Полезный импорт подпады:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

Для браузера только загрузки Connect, используйте `@iroha/iroha-js/connect-browser`
вместо импорта узла-первый `ToriiClient` поверхность.

## Начальная сберегательная плата {#native-escrow}

JavaScript и TypeScript приложения могут использовать нативный депозит через Kotodama
Составить сопроводительные звонки хозяина с
`@iroha/iroha-js/kotodama-compiler`; прямые создатели транзакций налога на хранение
В настоящее время они не подвергаются воздействию JavaScript SDK. Посмотрите.
[Осуществление сбережений на собственные активы](/ru/blockchain/escrow.md#javascript-and-typescript-kotodama)
на примере по вызову хозяина-эскроя.

## Нынешнее охватывание {#current-coverage}

Сборник SDK сосредоточено на:

- Torii HTTP и WebSocket помощники
- Norito строители транзакций и инструкций
- Kotodama компиляция, включающая в себя сборки по вызову хозяина депозита
- Ed25519 подпись и генерация ключей
- помощники по пересмотру страниц и повторной пробке
- Подключить помощники для загрузки браузера
- Готовность Kagemusha, пополнение, выкуп и эксплуатационный статус транспорта
  помощники

## Ссылки вверх {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
