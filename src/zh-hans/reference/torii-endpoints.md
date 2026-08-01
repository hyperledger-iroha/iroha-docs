---
translation_locale: zh-hans
translation_source: /reference/torii-endpoints.md
translation_source_hash: 9bec41b1b419e252fdcff8328e7950a294bdad3ac40112a5a7f2ce451d19e9cb
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Torii 端点 {#torii-endpoints}

Torii 是 Iroha 3 的 HTTP、SSE 和 WebSocket 网关，同时提供面向账本的 APIs 和运维端点。

当前协议规则如下：

- 规范二进制格式是 **Norito**
- 发送 `Accept: application/json` 时，许多端点也支持 JSON
- 指标以 Prometheus 格式公开

有关格式细节、内容协商、布局标志、模式哈希和 Norito RPC 指南，请参阅 [Norito 参考](/zh-hans/reference/norito.md)。

## 常用端点 {#common-endpoints}

| 端点 | 格式 | 用途 |
| --- | --- | --- |
| `POST /transaction` | Norito | 提交已签署的交易 |
| `POST /query` | Norito | 提交已签名的查询 |
| `GET /events` | WebSocket | 订阅事件数据流 |
| `GET /block/stream` | WebSocket | 流式传输已完成共识提交的区块 |
| `GET /peers` | JSON | Torii 公开的对等节点清单 |
| `GET /health` | JSON | 轻量型存活端点 |
| `GET /api_version` | JSON | 默认 API 版本 |
| `GET /status` | JSON | 供运维人员使用的高级状态摘要 |
| `GET /metrics` | Prometheus | Prometheus 抓取端点 |
| `GET /schema` | JSON | 节点提供的数据模型模式快照 |
| `GET /openapi` or `GET /openapi.json` | JSON | 活动 Torii HTTP 路由的 OpenAPI 文档 |
| `GET /v1/parameters` | JSON | 节点参数快照 |
| `GET /v1/node/capabilities` | JSON | 节点能力和数据模型元数据 |
| `GET /v1/api/versions` | JSON | 支持的 Torii API 版本 |
| `GET /v1/events/sse` | SSE | 面向长连接客户端的事件流 |
| `GET /v1/time/now` | JSON | 节点墙上时钟快照 |
| `GET /v1/time/status` | JSON | 时间同步状态 |

对于运行中的节点，`/openapi` 是权威的端点列表。确切接口取决于构建功能和运行时配置，因此生成的客户端应优先使用实时 OpenAPI 文档，而不是手动复制的路由列表。使用 [Torii API 控制台](/zh-hans/reference/torii-api-console.md)可以加载该实时文档、测试 JSON 路由、复制 curl 请求，并根据当前模式生成客户端代码。

## 试用 Taira 实时路由 {#try-live-taira-routes}

公共 Taira 测试网公开与应用客户端相同的 Torii JSON 接口，可供只读探索。以下命令不需要密钥：

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA_ROOT/openapi.json" \
  | jq -r '.paths | keys[]' \
  | grep '^/v1/' \
  | head -n 20

curl -fsS "$TAIRA_ROOT/v1/node/capabilities" \
  | jq '{abi_version, data_model_version, query: .query.aggregate.supported_resources}'
```

尝试读取当前世界状态中的资源：

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

如果公共测试网路由返回 `502`、超时或报告队列已饱和，请先将其视为端点可用性问题并稍后重试，再调试客户端代码。

## 共识和运行时端点 {#consensus-and-runtime-endpoints}

| 端点 | 格式 | 用途 |
| --- | --- | --- |
| `GET /v1/sumeragi/commit-certificates` | JSON | 最近的提交凭证摘要 |
| `GET /v1/sumeragi/validator-sets` | JSON | 验证者集合历史 |
| `GET /v1/sumeragi/validator-sets/{height}` | JSON | 指定区块高度的验证者集合 |
| `GET /v1/sumeragi/status` | Norito or JSON | 详细共识状态快照 |
| `GET /v1/sumeragi/status/sse` | SSE | 持续的共识状态数据流 |
| `GET /v1/sumeragi/leader` | JSON | 当前领导者信息 |
| `GET /v1/sumeragi/qc` | Norito or JSON | 最新的法定人数凭证摘要 |
| `GET /v1/sumeragi/checkpoints` | JSON | 共识检查点摘要 |
| `GET /v1/sumeragi/consensus-keys` | JSON | 活动共识密钥 |
| `GET /v1/sumeragi/bls_keys` | JSON | 活动 BLS 共识密钥 |
| `GET /v1/sumeragi/phases` | JSON | 最新的各阶段延迟样本 |
| `GET /v1/sumeragi/rbc` | JSON | RBC 会话和吞吐量指标 |
| `GET /v1/sumeragi/rbc/sessions` | JSON | 活动 RBC 会话快照 |
| `GET /v1/sumeragi/pacemaker` | JSON | Pacemaker 状态 |
| `GET /v1/sumeragi/params` | JSON | 当前链上 Sumeragi 参数 |
| `GET /v1/sumeragi/collectors` | JSON | 确定性的收集者计划快照 |
| `GET /v1/sumeragi/key-lifecycle` | JSON | 共识密钥生命周期状态 |
| `GET /v1/sumeragi/telemetry` | JSON | 共识遥测快照 |
| `GET /v1/sumeragi/evidence` | JSON | 证据记录，可以选择按查询字符串筛选 |
| `GET /v1/sumeragi/evidence/count` | JSON | 证据记录数量 |
| `POST /v1/sumeragi/evidence/submit` | JSON | 提交共识证据 |
| `GET /v1/sumeragi/commit_qc/{hash}` | Norito or JSON | 指定区块哈希的 Commit QC 记录 |
| `GET /v1/runtime/abi/active` | JSON | 活动运行时 ABI 描述符 |
| `GET /v1/runtime/abi/hash` | JSON | 活动运行时 ABI 哈希 |
| `GET /v1/runtime/metrics` | JSON | 运行时指标快照 |
| `GET /v1/runtime/upgrades` | JSON | 运行时升级列表 |
| `POST /v1/runtime/upgrades/propose` | JSON | 提议运行时升级 |
| `POST /v1/runtime/upgrades/activate/{id}` | JSON | 激活已提议的运行时升级 |
| `POST /v1/runtime/upgrades/cancel/{id}` | JSON | 取消已提议的运行时升级 |

## 应用和 SORA 路由族 {#app-and-sora-route-families}

使用面向应用的功能集构建 Torii 时，Torii 会为浏览器、SORA 服务、桥接流程、证明和存储公开额外的 JSON 路由族。并非每种网络配置文件都会启用所有路由族。

| 路由族 | 用途 |
| --- | --- |
| `/v1/accounts/*`, `/v1/domains/*`, `/v1/assets/*` | JSON 读取、查询辅助函数、入门辅助函数，以及投资组合或持有人视图 |
| `/v1/nfts/*`, `/v1/rwas/*`, `/v1/confidential/*` | NFT、现实世界资产和机密资产视图 |
| `/v1/aliases/*`, `/v1/assets/aliases/*`, `/v1/sns/*`, `/v1/identifiers/*` | 名称、别名及识别码解析 |
| `/v1/explorer/*` | 面向浏览器的账户、资产、区块、交易、指令、指标和数据流视图 |
| `/v1/transactions/*`, `/v1/pipeline/*`, `/v1/iso20022/*` | 交易历史、管线恢复或状态，以及 ISO 20022 辅助函数 |
| `/v1/contracts/*` | 合约代码、部署、包、调用、视图、事件、活动、Rollup 和状态路由 |
| `/v1/multisig/*`, `/v1/controls/*` | 多重签名提案、批准和转账控制辅助函数 |
| `/v1/bridge/*`, `/v1/ledger/*`, `/v1/proofs/*` | 最终性、状态证明、区块证明、证明保留和证明查询路由 |
| `/v1/da/*` | 数据可用性接入、清单、证明策略、承诺和固定意图 |
| `/v1/zk/*` | ZK 根、证明验证、IVM 证明、投票计数、验证密钥、证明记录及附件 |
| `/v1/gov/*`, `/v1/ministry/*` | 治理提案、选票、委员会状态、受保护命名空间、议程提案、实施和最终确定 |
| `/v1/nexus/*`, `/v1/sccp/*` | Nexus 通道、数据空间和跨链证明辅助函数 |
| `/v1/musubi/*` | Musubi 包注册表读取和指令构建器 |
| `/v1/subscriptions/*` | 订阅计划、订阅生命周期、用量和计费辅助函数 |
| `/v1/sorafs/*`, `/sorafs/*`, `/.well-known/sorafs/*` | SoraFS 提供商发现、容量证明、固定、存储提取和公共内容服务 |
| `/v1/soracloud/*`, `/v1/soradns/*`, `/soradns/*`, `/api/*` | SoraCloud 服务生命周期、私有计算／模型流程、公共发现和托管应用路由 |
| `/v1/connect/*`, `/v1/vpn/*` | Iroha Connect 会话、WebSocket 传输、VPN 会话、配置文件和收据 |
| `/v1/app-api/*`, `/v1/api/*`, `/v1/content/*` | App API 绑定和由包／CID 支持的内容路由 |
| `/v1/operator/*`, `/v1/mcp` | 操作员身份验证和原生 MCP JSON-RPC 桥接器 |
| `/v1/offline/*`, `/v1/repo/*`, `/v1/space-directory/*`, `/v1/ram-lfe/*` | 离线就绪状态、仓库协议、数据空间清单和 [RAM-LFE 辅助函数](/zh-hans/blockchain/ram-lfe.md#torii-routes) |
| `/v1/kaigi/*`, `/v1/webhooks/*`, `/v1/notify/*`, `/v1/telemetry/*` | 协作、Webhook、推送通知和实时遥测集成 |

## ISO 20022 桥 {#iso-20022-bridge}

启用面向应用的 API 和桥接运行时后，Torii 会在 `/v1/iso20022/*` 下公开 ISO 20022 桥接器。该桥接器刻意限定了范围：它不是通用 ISO 20022 清算网关，而是受支持的子集，用于将选定的支付消息转换为已签名的 Iroha 转账，并跟踪其账本状态。

### Torii ISO 20022 端点 {#torii-iso-20022-endpoints}

| 方法与端点 | 用途 |
| --- | --- |
| `POST /v1/iso20022/pacs008` | 提交 FI-to-FI 客户贷记转账，并构建对应的 Iroha 资产转账 |
| `POST /v1/iso20022/pacs009` | 提交用于付款对付款（PvP）或证券相关现金融资的 FI-to-FI 贷记转账 |
| `POST /v1/iso20022/pacs002` | 提交付款状态报告 |
| `POST /v1/iso20022/pacs004` | 提交付款退回消息 |
| `POST /v1/iso20022/camt056` | 提交付款取消请求 |
| `POST /v1/iso20022/sese023` | 提交证券结算指令 |
| `POST /v1/iso20022/sese024` | 提交证券结算状态消息 |
| `POST /v1/iso20022/sese025` | 提交证券结算确认 |
| `POST /v1/iso20022/colr012` | 提交抵押品替换消息 |
| `GET /v1/iso20022/messages/{msg_id}` | 读取一条消息的规范桥接记录 |
| `GET /v1/iso20022/audit/messages` | 读取可检测篡改的消息审计清单 |
| `GET /v1/iso20022/messages/{msg_id}/pacs002` | 将当前支付状态呈现为 `pacs.002` XML |
| `GET /v1/iso20022/messages/{msg_id}/pacs004` | 将当前付款退回呈现为 `pacs.004` XML |
| `GET /v1/iso20022/messages/{msg_id}/camt029` | 将当前取消处理结果呈现为 `camt.029` XML |
| `GET /v1/iso20022/messages/{msg_id}/sese024` | 将当前结算状态呈现为 `sese.024` XML |
| `GET /v1/iso20022/messages/{msg_id}/sese025` | 将当前结算确认呈现为 `sese.025` XML |

`pacs.008` 提交必须提供消息 ID、银行间结算金额、货币、结算日期、债务人和债权人的 IBANs，以及债务人和债权人的 BICs。配置参考数据后，桥接器还会在生成的交易进入管线前检查 BIC、IBAN 和 ISO 4217 货币映射。

`pacs.009` 提交必须提供业务消息 ID、消息定义 ID、创建时间、银行间结算金额、货币、结算日期、指示代理人和受指示代理人的 BICs，以及债务人和债权人的 IBANs。如果消息包含 `Purp`，桥接器当前只接受证券用途的资金：`Purp=SECU`。

`pacs.008` 和 `pacs.009` 提交端点接受 XML ISO 信封，或桥接测试使用的扁平字段格式。可选的 `SplmtryData` 字段可以固定目标 Iroha 账本、源和目标账户 IDs 或地址，以及资产定义 ID。响应为 `202 Accepted`，其中包含 `message_id`、`transaction_hash`、`status`、`pacs002_code` 和解析后的账本／账户／资产上下文。

### 其他解析和映射支持 {#additional-parser-and-mapping-support}

IVM ISO 辅助函数还会验证并实例化以下消息族，用于信封验证、结算映射或下游对账。它们没有独立的 Torii 路由。

| 消息族 | 当前支持 |
| --- | --- |
| `head.001` | ISO 信封的业务应用头验证，包括 `BizMsgIdr`、`MsgDefIdr`、创建时间和可选的发送方／接收方 BIC 字段 |
| `pacs.007`, `pacs.028`, `pacs.029` | 付款冲销、状态请求和调查解决／状态解析 |
| `pain.001`, `pain.002` | 客户付款发起及付款状态报告验证 |
| `camt.052`, `camt.053`, `camt.054` | 账户报告、对账单和通知验证 |

## Kaigi 会话 {#kaigi-sessions}

Kaigi 在 SORA Nexus 上提供付费的实时音频／视频房间。当应用需要由账本支持的会话创建、名册变更、中继清单、加密信令和用量计量，而不是将所有会议状态都保留在链下时，请使用 Kaigi。

面向账本的生命周期如下：

- `CreateKaigi`：在一个域下创建通话，并存储其策略、日程、元数据和可选的中继清单。
- `JoinKaigi` 和 `LeaveKaigi`：更新通话名册。在私密模式下，参与者使用承诺、nullifier 和名册证明，而不直接暴露参与者的账户 IDs。
- `RecordKaigiUsage`：追加计量的持续时间和 Gas 总量。
- `EndKaigi`：关闭会话并记录最终时间戳。

启用应用 API 和遥测功能后，Torii 会在 `/v1/kaigi/relays`、`/v1/kaigi/relays/{relay_id}`、`/v1/kaigi/relays/health` 和 `/v1/kaigi/relays/events` 下公开中继遥测数据。会话状态通过 `KaigiRosterSummary`、`KaigiRelayManifestUpdated`、`KaigiRelayHealthUpdated` 和 `KaigiUsageSummary` 等 Kaigi 域事件呈现。

### CLI 冒烟测试 {#cli-smoke-test}

如果要在连接 UI 前确认 Torii 端点能够接受 Kaigi 交易，请先使用 `iroha kaigi` CLI。快速入门命令会针对活动 Torii 端点创建临时房间，并输出包含通话标识符、加入命令和 SoraNet spool 提示的摘要：

```bash
iroha kaigi quickstart --auto-join-host --summary-out kaigi-summary.json
```

对于脚本化流程，请显式管理房间生命周期：

```bash
iroha kaigi create \
  --domain streaming \
  --call-name daily \
  --host <i105-account-id> \
  --privacy-mode transparent \
  --room-policy authenticated

iroha kaigi join --domain streaming --call-name daily --participant <i105-account-id>
iroha kaigi leave --domain streaming --call-name daily --participant <i105-account-id>

iroha kaigi record-usage \
  --domain streaming \
  --call-name daily \
  --duration-ms 120000 \
  --billed-gas 1500

iroha kaigi end --domain streaming --call-name daily
```

对于中继可以在没有查看者票据的情况下公开的房间，请使用 `--room-policy public`；如果出口必须要求查看者进行身份验证，则使用 `--room-policy authenticated`。只有在网络已配置 Kaigi 名册和用量验证密钥后，才能使用 `--privacy-mode zk-roster-v1`；否则，加入、离开和私密用量记录都会在确定性验证期间失败。

### 使用 JavaScript 演示应用测试 {#testing-with-the-javascript-demo}

使用 [soramitsu/iroha-demo-javascript](https://github.com/soramitsu/iroha-demo-javascript) 桌面演示应用进行端到端钱包测试。该演示是一个 Electron 和 Vue 应用，通过本地 `@iroha/iroha-js` 绑定直接与 Torii 通信，并包含用于浏览器原生一对一媒体的 `/kaigi` 路由。

请将该演示与 Iroha 源代码仓库中的 [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js) 配合使用。演示通过 `file:../iroha/javascript/iroha_js` 固定 SDK，因此请将两个检出目录保持为以下同级布局：

```bash
mkdir iroha-wallet-workspace
cd iroha-wallet-workspace
git clone https://github.com/hyperledger-iroha/iroha.git
git clone https://github.com/soramitsu/iroha-demo-javascript.git

cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist

cd ../../../iroha-demo-javascript
npm install
npm run dev
```

请使用 Node.js 20 或更高版本以及 Rust 工具链，以便构建原生 `iroha_js_host` 模块。更改 SDK 源代码后，请在同级 Iroha 检出目录中重新构建；干净的软件包布局不包含 `npm run build:native` 所需的 Cargo 工作区。

对于受控测试，请将演示应用连接到支持 Kaigi 的 Torii 端点：

1. 启动已启用 SORA/Kaigi 面向应用 APIs 的 Iroha 节点，或使用公开所需 Kaigi 接口的公共端点。
2. 先使用 `/health` 检查基本可达性，再使用 `/openapi` 或 `/openapi.json` 检查实时路由接口。某些部署也会公开 `/v1/health`，但 `/health` 是可移植的存活检查端点。
3. 对于 TAIRA，在尝试实时会议前先验证中继遥测路由：

   ```bash
   TAIRA=https://taira.sora.org
   curl -fsS "$TAIRA/health"
   curl -fsS "$TAIRA/v1/kaigi/relays"
   curl -fsS "$TAIRA/v1/kaigi/relays/health"
   ```

   这些检查只能证明 Torii 和 Kaigi 中继遥测可以访问，并不会创建会议；`CreateKaigi` 和 `JoinKaigi` 仍然需要已有资金的钱包并提交已签名交易。
4. 打开演示应用，前往 **Settings**，设置 Torii URL，让应用从端点加载链 ID 和网络前缀。
5. 在演示应用中创建或恢复两个本地钱包。请使用不同的应用窗口、配置文件或机器，使主机和访客具有独立的钱包状态。

若要测试 Kaigi UI：

1. 在主机窗口中打开 **Kaigi**，选择 **Start meeting**，设置标题，然后选择 **Private invite** 或 **Transparent invite**。
2. 选择 **Turn on camera and mic**，使 WebRTC 获得本地媒体。
3. 选择 **Create meeting link**。在线钱包会提交 `CreateKaigi`；然后应用会显示 `iroha://kaigi/join?call=...&secret=...` 邀请和 `#/kaigi?...` 回退路由。
4. 保持主机窗口打开，并与访客分享邀请。
5. 在访客窗口中打开邀请，或将其粘贴到 **Join meeting**；打开本地媒体后选择 **Join meeting**。在线钱包会从 Torii 获取加密的主机 offer，并提交带有加密 answer 元数据的 `JoinKaigi`。
6. 主机应通过流式传输或轮询 Kaigi 通话信号自动应用第一个 answer。两个窗口都应显示已连接的媒体和更新后的连接详细信息。
7. 从主机结束会话，或对同一个通话 ID 使用 CLI `iroha kaigi end` 命令。

私密 Kaigi 需要隐私保护（shielded）的 XOR 来支付私密入口费用。如果演示应用报告私密 Kaigi 需要隐私保护（shielded）的 XOR，请使用应用内的 self-shield 提示，然后重试创建或加入操作。如果无法生成证明、私密资金不可用或实时信令不可用，演示应用可以回退到透明／手动流程。在这种情况下，打开 **Advanced signaling**，复制原始 offer 或 answer 数据包，再粘贴到另一个窗口中。

在演示应用仓库中运行自动检查时，请执行：

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
npm run verify
```

这些专项 Vitest 测试套件涵盖 Kaigi 会议链接创建、紧凑邀请加载、私密创建／加入／结束桥接调用、self-shield 提示、手动回退和 answer 轮询。UI 冒烟测试涵盖桌面和移动设备大小视口中的 `/kaigi` 路由。两个钱包之间的实时媒体仍需进行手动双窗口测试，因为浏览器摄像头／麦克风权限和对等媒体流取决于具体环境。

集成代码示例请参阅[在 JavaScript 应用中嵌入 Kaigi](/zh-hans/guide/tutorials/kaigi.md)。

## 状态和指标 {#status-and-metrics}

状态和指标端点应优先接入仪表板：

- `/status` 公开最上层的对等节点、区块、队列与共识字段
- `/metrics` 公开 Prometheus 计数器、仪表和直方图

在启用 Nexus 的节点上，状态输出还包含感知通道和数据空间的部分。当 `nexus.enabled = false` 时，这些部分会被省略。

## JSON 与 Norito {#json-vs-norito}

一些运维端点默认返回 Norito。当端点支持 JSON 时，请发送：

```http
Accept: application/json
```

这对下列端点特别有用：

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`
- `/v1/sumeragi/commit_qc/{hash}`

当端点直接接受或返回类型化 Norito 时，请使用 `application/x-norito` 作为内容类型或首选 `Accept` 值。传输细节请参阅 [Norito](/zh-hans/reference/norito.md#torii-and-norito-rpc)。

## 遥测配置文件 {#telemetry-profiles}

端点可见性取决于节点的 `telemetry.profile` 设置。当前配置提供五个配置文件级别：

| 配置文件 | `/status` | `/metrics` | 开发者路由 |
| --- | --- | --- | --- |
| `disabled` | 否 | 否 | 否 |
| `operator` | 是 | 否 | 否 |
| `extended` | 是 | 是 | 否 |
| `developer` | 是 | 否 | 是 |
| `full` | 是 | 是 | 是 |

## CLI 快捷方式 {#cli-shortcuts}

`iroha` CLI 已封装其中许多端点：

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml ops sumeragi params
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

## 上游参考 {#upstream-references}

- [README API 与可观测性概述](https://github.com/hyperledger-iroha/iroha/blob/main/README.md)
- [ISO 20022 桥接实现](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_torii/src/iso20022_bridge.rs)
- [性能和指标](/zh-hans/guide/advanced/metrics.md)
