---
translation_locale: zh-hant
translation_source: /guide/tutorials/javascript.md
translation_source_hash: d12c715de68623a7dd671e4f2f91b93dbe9fdee42ed51e3a25fbad2a9b69ca8e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript 和 TypeScript {#javascript-and-typescript}

目前 JavaScript SDK 是`@iroha/iroha-js`源樹中的 Iroha 包.它是 Node.js-第一個 SDK 的 Torii,Norito 構建者,簽字,頁面化,連線預覽和Kagemusha命令運輸.

## 建立從源頭 {#build-from-source}

該包目前不在公開 npm 登錄檔中可用.從您的目標節點相同的固定 Iroha 源修改中構建它:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

原生建置封裝 `cargo build -p iroha_js_host`，並記錄 SDK 啟動時使用的特定平臺校驗和。原始碼建置會將經過驗證的主機放入 `native/`。僅在刻意提供另行建置且已驗證校驗和的主機時設定 `IROHA_JS_NATIVE_DIR`。此套件僅支援 ESM；從 CommonJS 使用時請呼叫動態 `import()`。

## 快速開始 {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## 試看 Taira 只閱讀 {#try-taira-read-only}

使用內建 `fetch` 在 Node.js 24 探測器 Taira 在加入簽名之前, Norito 交易程式碼:

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

儲存為 `taira-readonly.mjs`,然後執行:

```bash
node taira-readonly.mjs
```

僅在這些只閱讀檢查工作後才能移動到簽署的 SDK 呼叫.公眾 Taira 可以暫時返回和排隊或閘道器錯誤,因此保持現場網路測試選擇進入 CI.

有效的子路進口:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

對於只為瀏覽器使用的連線啟動帶,請使用 `@iroha/iroha-js/connect-browser` 而不是匯入 Node-first `ToriiClient`表面.

## 產業保險 {#native-escrow}

JavaScript 和 TypeScript 應用程式可以透過本地託管使用 Kotodama 合同. 編譯託管主機呼叫與 `@iroha/iroha-js/kotodama-compiler`; 目前,本地託管交易構建者未被 JavaScript SDK. 檢視 [產業資產保證](/zh-hant/blockchain/escrow.md#javascript-and-typescript-kotodama) 對於託管主機呼叫的例子.

## 目前覆蓋範圍 {#current-coverage}

SDK 專注於:

- Torii HTTP 和 WebSocket 的輔助員
- Norito 交易和指令構建者
- Kotodama 編譯,包括託管主機呼叫構建
- Ed25519 簽字和關鍵生成
- 頁面化和重試輔助器
- 連線瀏覽器啟動輔助器
- 卡蓋穆沙備用,補充,贖回和運營狀態的交通輔助人員

## 上游引用 {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
