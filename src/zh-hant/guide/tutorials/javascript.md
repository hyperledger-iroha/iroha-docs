---
translation_locale: zh-hant
translation_source: /guide/tutorials/javascript.md
translation_source_hash: feddadb1b50c5cc8beea188fd7053eeaae58d6ab9203687e9a1378f203229168
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript 和 TypeScript {#javascript-and-typescript}

目前 JavaScript SDK 是`@iroha/iroha-js`源樹中的 Iroha 包.它是 Node.js-第一個 SDK 的 Torii,Norito 構建者,簽字,頁面化,連接預覽和Kagemusha命令運輸.

## 建立從源頭 {#build-from-source}

該包目前不在公開 npm 註冊表中可用.從您的目標節點相同的固定 Iroha 源修改中構建它:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

本土構建包裹`cargo build -p iroha_js_host`並記錄在 SDK 啓動中使用的平臺特定檢查數量.源構建地址驗證了主機在 `native/`.設置 `IROHA_JS_NATIVE_DIR`只有當故意供應單獨構建的,檢查數量驗證的主機時.包裝僅是 ESM;從 CommonJS,使用動態 `import()`.

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

使用內置 `fetch` 在 Node.js 24 探測器 Taira 在加入簽名之前, Norito 交易代碼:

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

保存爲 `taira-readonly.mjs`,然後運行:

```bash
node taira-readonly.mjs
```

僅在這些只閱讀檢查工作後才能移動到簽署的 SDK 電話.公衆 Taira 可以暫時返回和排隊或網關錯誤,因此保持現場網絡測試選擇進入 CI.

有效的子路進口:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

對於只爲瀏覽器使用的連接啓動帶,請使用 `@iroha/iroha-js/connect-browser` 而不是導入 Node-first `ToriiClient`表面.

## 產業保險 {#native-escrow}

JavaScript 和 TypeScript 應用程序可以通過本地託管使用 Kotodama 合同. 編譯託管主機電話與 `@iroha/iroha-js/kotodama-compiler`; 目前,本地保證金交易構建者未被 JavaScript SDK. 查看 [產業資產保證](/zh-hant/blockchain/escrow.md#javascript-and-typescript-kotodama) 對於託管主機電話的例子.

## 目前覆蓋範圍 {#current-coverage}

SDK 專注於:

- Torii HTTP 和 WebSocket 的輔助員
- Norito 交易和指令構建者
- Kotodama 編譯,包括託管主機調用構建
- Ed25519 簽字和關鍵生成
- 頁面化和重試輔助器
- 連接瀏覽器啓動輔助器
- 卡蓋穆沙備用,補充,贖回和運營狀態的交通輔助人員

## 上游引用 {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
