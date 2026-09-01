---
translation_locale: ru
translation_source: /guide/tutorials/javascript.md
translation_source_hash: d12c715de68623a7dd671e4f2f91b93dbe9fdee42ed51e3a25fbad2a9b69ca8e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# JavaScript и TypeScript {#javascript-and-typescript}

Текущий JavaScript SDK является пакетом `@iroha/iroha-js` в исходном дереве Iroha. Это Node.js-й SDK для Torii, Norito сборщиков, подписания, нумерации страниц, предварительного просмотра Connect и передачи команд Kagemusha.

## Собрать из исходников {#build-from-source}

Пакет в настоящее время недоступен из публичного реестра npm. Сборка его из той же закрепленной версии исходного кода Iroha, что и узел, на который вы нацелены:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

Нативная сборка оборачивает `cargo build -p iroha_js_host` и записывает платформо-специфическую контрольную сумму, используемую при запуске SDK. Исходная сборка помещает этот проверенный хост в `native/`. Устанавливайте `IROHA_JS_NATIVE_DIR` только при намеренном предоставлении отдельно собранного хоста с проверкой контрольной суммы. Пакет предназначен только для ESM; из CommonJS используйте динамический `import()`.

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

## Попробуйте Taira Только для чтения {#try-taira-read-only}

Используйте встроенный `fetch` в Node.js 24 для проверки Taira перед добавлением подписи и кода транзакции Norito:

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

Сохраните это как `taira-readonly.mjs`, затем запустите:

```bash
node taira-readonly.mjs
```

Переходите к подписанным SDK техническим вызовам только после того, как эти проверки только для чтения будут работать. Публичный Taira может временно возвращать переполненную очередь или ошибку шлюза, поэтому тесты в реальной сети оставляйте по выбору в CI.

Полезные подпайпинговые импорты:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

Для загрузки Connect через браузер используйте `@iroha/iroha-js/connect-browser` вместо импорта сначала Node `ToriiClient` поверхности.

## Нативный эскроу {#native-escrow}

Приложения JavaScript и TypeScript могут использовать нативный эскроу через контракты Kotodama. Компилируйте вызовы эскроу-хост-функций с помощью `@iroha/iroha-js/kotodama-compiler`; напрямую родные конструкторы эскроу-транзакций в настоящее время не доступны через JavaScript SDK. См. [Эскроу для родных активов](/ru/blockchain/escrow.md#javascript-and-typescript-kotodama) для примера вызова эскроу-хоста с технической стороны.

## Текущее покрытие {#current-coverage}

Фокус SDK заключается в:

- Torii HTTP и WebSocket помощники
- Norito сборщики транзакций и инструкций
- Kotodama компиляция, включая встроенные функции вызова эскроу хост-технологии
- Подписание и генерация ключей Ed25519
- помощники для постраничного отображения и повторных попыток
- Подключить вспомогательные модули Bootstrap для браузера
- Помощники по транспортировке готовности Kagemusha, пополнения, выкупа и состояния работы

## Исходные ссылки {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
