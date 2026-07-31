---
translation_locale: zh-hant
translation_source: /guide/tutorials/javascript.md
translation_source_hash: feddadb1b50c5cc8beea188fd7053eeaae58d6ab9203687e9a1378f203229168
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript 及其他 TypeScript {#javascript-and-typescript}

目前的 JavaScript SDK 這是 `@iroha/iroha-js` 包裝在 Iroha
這就是源樹. Node.js- 首先, SDK 關於 Torii, Norito 建築師,簽名,
聯繫預覽, 和 Kagemusha 命令運輸.

## 建立從源頭 {#build-from-source}

目前沒有公開的包裹 npm 建立它.
來自同一塊 Iroha 檢視您的目標節點:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

這種原住民的建築包裹 `cargo build -p iroha_js_host` 並記錄
在使用的平台特定檢查額度 SDK 開始使用.
已確認的主機在 `native/`. 裝置 `IROHA_JS_NATIVE_DIR` 只有故意
提供獨立建造的檢查數量驗證的主機. ESM- 只有;
來自 CommonJS, 使用動態 `import()`.

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

## 請試下 Taira 只有閱讀 {#try-taira-read-only}

使用內建 `fetch` 在 Node.js 檢測的 24 Taira 在加入簽名之前,
Norito 交易代碼:

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

保存它為 `taira-readonly.mjs`, 然後執行它:

```bash
node taira-readonly.mjs
```

移動到簽名 SDK 只有在這些只能閱讀的檢查工作後才打電話. Taira
能暫時返回飽和的排隊或門口錯誤,
檢測選擇加入 CI.

有用的子通道進口:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

只有在浏览器上使用 Connect bootstrap, `@iroha/iroha-js/connect-browser`
而不是輸入第一個結 `ToriiClient` 表面.

## 預借貸款 {#native-escrow}

JavaScript 及其他 TypeScript 應用程序可以使用本地保證 Kotodama
收錄對象的呼叫
`@iroha/iroha-js/kotodama-compiler`; 直接的本地保證交易建設者
目前沒有被曝光 JavaScript SDK. 請看
[預借本地資產](/zh-hant/blockchain/escrow.md#javascript-and-typescript-kotodama)
預約主持電話的例子.

## 目前的覆蓋 {#current-coverage}

其他國家 SDK 專注於:

- Torii HTTP 及其他 WebSocket 助手
- Norito 交易和指令制造商
- Kotodama 包含預托主機呼叫內置,
- Ed25519 簽名和關鍵生成
- 頁面化和重新嘗試的輔助器
- 连接浏览器 bootstrap助手
- 卡蓋穆沙準備,補充,償還和運行狀態的交通
  助手

## 上游參考資料 {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
