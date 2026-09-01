---
translation_locale: zh-hans
translation_source: /guide/tutorials/javascript.md
translation_source_hash: d12c715de68623a7dd671e4f2f91b93dbe9fdee42ed51e3a25fbad2a9b69ca8e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript 和 TypeScript {#javascript-and-typescript}

目前 JavaScript SDK 是`@iroha/iroha-js`源树中的 Iroha 包.它是 Node.js-第一个 SDK 的 Torii,Norito 构建者,签字,页面化,连接预览和Kagemusha命令运输.

## 建立从源头 {#build-from-source}

该包目前不在公开 npm 注册表中可用.从您的目标节点相同的固定 Iroha 源修改中构建它:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

原生构建封装 `cargo build -p iroha_js_host`，并记录 SDK 启动时使用的特定平台校验和。源码构建会将经过验证的宿主放入 `native/`。仅在有意提供单独构建且已验证校验和的宿主时设置 `IROHA_JS_NATIVE_DIR`。该包仅支持 ESM；从 CommonJS 使用时请调用动态 `import()`。

## 快速开始 {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## 试看 Taira 只阅读 {#try-taira-read-only}

使用内置 `fetch` 在 Node.js 24 探测器 Taira 在加入签名之前, Norito 交易代码:

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

保存为 `taira-readonly.mjs`,然后运行:

```bash
node taira-readonly.mjs
```

仅在这些只阅读检查工作后才能移动到签署的 SDK 调用.公众 Taira 可以暂时返回和排队或网关错误,因此保持现场网络测试选择进入 CI.

有效的子路进口:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

对于只为浏览器使用的连接启动带,请使用 `@iroha/iroha-js/connect-browser` 而不是导入 Node-first `ToriiClient`表面.

## 产业保险 {#native-escrow}

JavaScript 和 TypeScript 应用程序可以通过本地托管使用 Kotodama 合同. 编译托管主机调用与 `@iroha/iroha-js/kotodama-compiler`; 目前,本地托管交易构建者未被 JavaScript SDK. 查看 [产业资产保证](/zh-hans/blockchain/escrow.md#javascript-and-typescript-kotodama) 对于托管主机调用的例子.

## 目前覆盖范围 {#current-coverage}

SDK 专注于:

- Torii HTTP 和 WebSocket 的辅助员
- Norito 交易和指令构建者
- Kotodama 编译,包括托管主机调用构建
- Ed25519 签字和关键生成
- 页面化和重试辅助器
- 连接浏览器启动辅助器
- 卡盖穆沙备用,补充,赎回和运营状态的交通辅助人员

## 上游引用 {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
