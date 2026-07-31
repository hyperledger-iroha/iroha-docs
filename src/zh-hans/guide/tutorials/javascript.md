---
translation_locale: zh-hans
translation_source: /guide/tutorials/javascript.md
translation_source_hash: feddadb1b50c5cc8beea188fd7053eeaae58d6ab9203687e9a1378f203229168
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript 并且 TypeScript {#javascript-and-typescript}

电流 JavaScript SDK 是 `@iroha/iroha-js` 包装 Iroha
源树. Node.js- 首先 SDK 对于 Torii, Norito 施工者,签字者
连接预览,和Kagemusha命令运输.

## 从源头开始建设 {#build-from-source}

目前,该包尚未向公众提供 npm 建立它.
从同一个子 Iroha 来源修改作为您目标的节点:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

印第安人制造的包裹 `cargo build -p iroha_js_host` 并记录了
在使用的平台特定检查额 SDK 源构建的地点
验证的主机 `native/`. 设置 `IROHA_JS_NATIVE_DIR` 只有故意
提供单独构建的检查数值验证的主机. ESM- 只有;
在 CommonJS, 使用动态 `import()`.

## 快速启动 {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## 试着 Taira 只有阅读 {#try-taira-read-only}

使用内置 `fetch` 在 Node.js 24 探测器 Taira 在加入签名之前,
Norito 交易代码:

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

保存作为 `taira-readonly.mjs`, 然后运行它:

```bash
node taira-readonly.mjs
```

移动到签署 SDK 只有在这些只读的检查工作后才会打电话. Taira
可以暂时返回一个和排队或网关错误,所以保持现实网络
选择参加的测试 CI.

有用的子路进口:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

对于只使用浏览器的连接启动带,使用 `@iroha/iroha-js/connect-browser`
而不是进口第一个节点 `ToriiClient` 表面.

## 产业保险 {#native-escrow}

JavaScript 并且 TypeScript 申请可以通过本地保证 Kotodama
合同. 编译托管主机电话
`@iroha/iroha-js/kotodama-compiler`; 直接的本地保证金交易构建者
目前没有被曝光 JavaScript SDK. 看看
[产业资产抵押](/zh-hans/blockchain/escrow.md#javascript-and-typescript-kotodama)
对于托管主机电话的例子.

## 目前的覆盖范围 {#current-coverage}

其他 SDK 专注于:

- Torii HTTP 并且 WebSocket 助手
- Norito 交易和指令制造商
- Kotodama 编译,包括托管主机呼叫构建
- Ed25519签字和关键生成
- 页面化和重试辅助器
- 连接浏览器启动辅助器
- 卡盖穆沙备用,补充,赎回和运营状态的运输
  助手

## 上游引用 {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
