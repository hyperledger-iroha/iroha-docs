---
translation_locale: zh-hans
translation_source: /reference/torii-endpoints.md
translation_source_hash: 6ee65d409642c79bea0f2c4ff0d8cd59b0ec0a29e115225045786d0816e8a6a7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Torii 终点 {#torii-endpoints}

Torii 是 HTTP, SSE, 并且 WebSocket 通过 Iroha 3. 这两者都是好用的.
面向账本 APIs 运营商终端点.

目前的协议规则是:

- 常规二进制格式是 **Norito**
- 许多终点也支持 JSON 当你发送 `Accept: application/json`
- 在Prometheus格式中显示的指标

对于格式细节,内容谈判,布局标志,方案哈希和
Norito RPC 导向,见 [Norito 参考](/zh-hans/reference/norito.md).

## 共同的终点 {#common-endpoints}

| 终点 | 格式 | 目的 |
| --- | --- | --- |
| `POST /transaction` | Norito | 提交签署的交易 |
| `POST /query` | Norito | 提交签名查询 |
| `GET /events` | WebSocket | 订阅活动流 |
| `GET /block/stream` | WebSocket | 流通承诺的区块 |
| `GET /peers` | JSON | 由 Torii |
| `GET /health` | JSON | 轻量级活力终点 |
| `GET /api_version` | JSON | 默认 API 版本 |
| `GET /status` | JSON | 运营商高级别状态总结 |
| `GET /metrics` | 普罗梅泰斯 | 预测的终点 |
| `GET /schema` | JSON | 节点服务的数据模型方案快照 |
| `GET /openapi` 或 `GET /openapi.json` | JSON | OpenAPI 活动的文件 Torii HTTP 航线 |
| `GET /v1/parameters` | JSON | 节点参数快照 |
| `GET /v1/node/capabilities` | JSON | 节点能力和数据模型元数据 |
| `GET /v1/api/versions` | JSON | 支持 Torii API 版本 |
| `GET /v1/events/sse` | SSE | 长期客户的事件流 |
| `GET /v1/time/now` | JSON | 节点壁表快照 |
| `GET /v1/time/status` | JSON | 时间同步状态 |

`/openapi` 是运行节点的权威终端点列表.
表面取决于构建功能和运行时间配置,因此生成
客户应该更喜欢直播. OpenAPI 在手复制的路线列表上.
使用 [Torii API 控制台](/zh-hans/reference/torii-api-console.md) 让它直播.
文件,测试 JSON 航线,副本 curl 要求,并从
目前的方案.

## 尝试生活 Taira 航线 {#try-live-taira-routes}

公众 Taira 测试网曝光相同的 Torii JSON 表面的应用
这些命令不需要密钥:

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

试图对世界现状进行分析:

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

如果公共测试网路线返回 `502`, 或报告和的
排队,把它视为终点可用性问题,然后再试一下
检查您的客户端代码.

## 共识和运行时间终点 {#consensus-and-runtime-endpoints}

| 终点 | 格式 | 目的 |
| --- | --- | --- |
| `GET /v1/sumeragi/commit-certificates` | JSON | 最近的承诺证书总结 |
| `GET /v1/sumeragi/validator-sets` | JSON | 验证器设置历史记录 |
| `GET /v1/sumeragi/validator-sets/{height}` | JSON | 验证器设置在块高度 |
| `GET /v1/sumeragi/status` | Norito 或 JSON | 详细的共识状态快照 |
| `GET /v1/sumeragi/status/sse` | SSE | 持续的共识状态流 |
| `GET /v1/sumeragi/leader` | JSON | 目前的领导信息 |
| `GET /v1/sumeragi/qc` | Norito 或 JSON | 最新票证书总结 |
| `GET /v1/sumeragi/checkpoints` | JSON | 共识检查点总结 |
| `GET /v1/sumeragi/consensus-keys` | JSON | 活跃的共识密钥 |
| `GET /v1/sumeragi/bls_keys` | JSON | 活动 BLS 共识密钥 |
| `GET /v1/sumeragi/phases` | JSON | 最新每个阶段延迟样本 |
| `GET /v1/sumeragi/rbc` | JSON | RBC 会议和吞吐量指标 |
| `GET /v1/sumeragi/rbc/sessions` | JSON | 活动 RBC 会议快照 |
| `GET /v1/sumeragi/pacemaker` | JSON | 心脏病计的状态 |
| `GET /v1/sumeragi/params` | JSON | 连锁电流 Sumeragi 参数 |
| `GET /v1/sumeragi/collectors` | JSON | 确定性收藏计划的快照 |
| `GET /v1/sumeragi/key-lifecycle` | JSON | 共识关键生命周期状态 |
| `GET /v1/sumeragi/telemetry` | JSON | 共识遥测快照 |
| `GET /v1/sumeragi/evidence` | JSON | 选择性通过查询字符串过的证据记录 |
| `GET /v1/sumeragi/evidence/count` | JSON | 证据记录数量 |
| `POST /v1/sumeragi/evidence/submit` | JSON | 提交共识证据 |
| `GET /v1/sumeragi/commit_qc/{hash}` | Norito 或 JSON | 承诺 QC 区块哈希的记录 |
| `GET /v1/runtime/abi/active` | JSON | 活动运行时间 ABI 描述符 |
| `GET /v1/runtime/abi/hash` | JSON | 活动运行时间 ABI 哈希 |
| `GET /v1/runtime/metrics` | JSON | 运行时间指标快照 |
| `GET /v1/runtime/upgrades` | JSON | 运行时间升级列表 |
| `POST /v1/runtime/upgrades/propose` | JSON | 提议升级运行时间 |
| `POST /v1/runtime/upgrades/activate/{id}` | JSON | 激活拟议的运行时间升级 |
| `POST /v1/runtime/upgrades/cancel/{id}` | JSON | 取消拟议的运行时间升级 |

## 应用程序和 SORA 路线家庭 {#app-and-sora-route-families}

当 Torii 应用程序面向的功能集,它暴露了额外的 JSON
探索者家庭, SORA 服务,桥梁流量,证据和存储.
不是每个网络配置文件都能启用家庭.

| 路线家族 | 目的 |
| --- | --- |
| `/v1/accounts/*`, `/v1/domains/*`, `/v1/assets/*` | JSON 阅读,查询辅助器,安装辅助器以及投资组合或持有者视图 |
| `/v1/nfts/*`, `/v1/rwas/*`, `/v1/confidential/*` | NFT, 现实资产和机密资产视图 |
| `/v1/aliases/*`, `/v1/assets/aliases/*`, `/v1/sns/*`, `/v1/identifiers/*` | 名称,号和识别符分辨率 |
| `/v1/explorer/*` | 基于探索器的账户,资产,区块,交易,指令,指标和流量视图 |
| `/v1/transactions/*`, `/v1/pipeline/*`, `/v1/iso20022/*` | 交易历史,管道恢复或状态; ISO 20022 助手 |
| `/v1/contracts/*` | 合同代码,部署,捆绑,调用,查看,事件,活动,滚动和状态路线 |
| `/v1/multisig/*`, `/v1/controls/*` | 多签证提案,批准和转移控制辅助人员 |
| `/v1/bridge/*`, `/v1/ledger/*`, `/v1/proofs/*` | 最终性,状态证明,区块证明,证据保留和证据查询路线 |
| `/v1/da/*` | 数据可用性摄入,表单,证据政策,承诺和定位意图 |
| `/v1/zk/*` | ZK 根,证据验证, IVM 证明,投票计数,验证密钥,证明记录和附件 |
| `/v1/gov/*`, `/v1/ministry/*` | 治理提案,投票表,理事会状态,保护名字空间,议程建议,颁布和最终制定 |
| `/v1/nexus/*`, `/v1/sccp/*` | Nexus 车道,数据空间和链交叉防护辅助器 |
| `/v1/musubi/*` | Musubi 包邮注册表阅和指令构建器 |
| `/v1/subscriptions/*` | 订阅计划,订阅生命周期,使用和收费助手 |
| `/v1/sorafs/*`, `/sorafs/*`, `/.well-known/sorafs/*` | SoraFS 提供商的发现,能力验证,定位,存储取货和公开内容服务 |
| `/v1/soracloud/*`, `/v1/soradns/*`, `/soradns/*`, `/api/*` | SoraCloud 服务生命周期,私人计算/模型流程,公开发现和托管的应用程序路由 |
| `/v1/connect/*`, `/v1/vpn/*` | Iroha 连接会议, WebSocket 运输, VPN 会议,个人资料和收据 |
| `/v1/app-api/*`, `/v1/api/*`, `/v1/content/*` | 应用程序 API 结合和捆绑/CID- 支持的内容路由 |
| `/v1/operator/*`, `/v1/mcp` | 运营商身份验证和本地 MCP JSON-RPC 桥梁 |
| `/v1/offline/*`, `/v1/repo/*`, `/v1/space-directory/*`, `/v1/ram-lfe/*` | 在线准备性,存储协议,数据库表格 [RAM-LFE 助手](/zh-hans/blockchain/ram-lfe.md#torii-routes) |
| `/v1/kaigi/*`, `/v1/webhooks/*`, `/v1/notify/*`, `/v1/telemetry/*` | 协作,网络连接,推送通知和直播远程测量集成 |

## ISO 20022 桥 {#iso-20022-bridge}

Torii 揭示了 ISO 20022 桥下 `/v1/iso20022/*` 在应用程序面向时
API 桥梁是故意设定的:
没有一般用途 ISO 20022清算门,但支持的子集为
将选定的支付消息转换为签名 Iroha 转移和跟踪
他们的账本状态.

### Torii ISO 20022 终点 {#torii-iso-20022-endpoints}

| 方法和终点 | 目的 |
| --- | --- |
| `POST /v1/iso20022/pacs008` | 提交一个 FI- 为了...FI 客户信用转账和建立匹配 Iroha 资产转移 |
| `POST /v1/iso20022/pacs009` | 提交一个 FI- 为了...FI 用于 PvP 或与证券相关的现金资助 |
| `POST /v1/iso20022/pacs002` | 提交支付状况报告 |
| `POST /v1/iso20022/pacs004` | 提交支付申报表 |
| `POST /v1/iso20022/camt056` | 提交取消支付的请求 |
| `POST /v1/iso20022/sese023` | 提交证券结算指示 |
| `POST /v1/iso20022/sese024` | 提交证券结算状态信息 |
| `POST /v1/iso20022/sese025` | 提交证券结算确认 |
| `POST /v1/iso20022/colr012` | 提交代价替换信息 |
| `GET /v1/iso20022/messages/{msg_id}` | 阅读经典的桥梁记录 |
| `GET /v1/iso20022/audit/messages` | 阅读"改"的信息审计说明书 |
| `GET /v1/iso20022/messages/{msg_id}/pacs002` | 将当前支付状态归类为 `pacs.002` XML |
| `GET /v1/iso20022/messages/{msg_id}/pacs004` | 将当前支付报表作为 `pacs.004` XML |
| `GET /v1/iso20022/messages/{msg_id}/camt029` | 将当前的取消分辨率作为 `camt.029` XML |
| `GET /v1/iso20022/messages/{msg_id}/sese024` | 将当前的结算状态转换为 `sese.024` XML |
| `GET /v1/iso20022/messages/{msg_id}/sese025` | 提交当前结算确认 `sese.025` XML |

`pacs.008` 提交必须提供信息 ID, 银行间结算
资金,货币,结算日期,债务人和债权人 IBANs, 和债务人
债权人 BICs. 当设置参考数据时,桥也检查了
BIC, IBAN, 并且 ISO 在生成的交易前4217个货币交叉路口
进入管道.

`pacs.009` 提交必须提供商业信息 ID, 信息定义
ID, 创建时间,银行间结算金额,货币,结算日期
授权和授权代理人 BICs, 债务人和债权人 IBANs. 如果
信息包括 `Purp`, 桥梁目前接受用于证券的资金
只有: `Purp=SECU`.

其他 `pacs.008` 并且 `pacs.009` 提交终点接受 XML ISO 包裹或
桥梁测试中使用的平面场格式. `SplmtryData` 字段
可以住目标 Iroha 大本,来源和目标账户 IDs 或地址,
和资产定义 ID. 答案是 `202 Accepted` 在 `message_id`,
`transaction_hash`, `status`, `pacs002_code`, 和已解决的
账本/帐户/资产背景.

### 额外的解析和绘图支持 {#additional-parser-and-mapping-support}

其他 IVM ISO 助手也验证并实现下面的信息
包裹验证,定居地图化或下游的家庭
它们没有独立的 Torii 路线.

| 消息家族 | 目前的支持 |
| --- | --- |
| `head.001` | 商业申请标题验证 ISO 包裹,包括 `BizMsgIdr`, `MsgDefIdr`, 创建时间和可选的发送/接收器 BIC 字段 |
| `pacs.007`, `pacs.028`, `pacs.029` | 支付逆转,状态要求和调查解决/状态分析 |
| `pain.001`, `pain.002` | 客户支付启动和支付状况报告验证 |
| `camt.052`, `camt.053`, `camt.054` | 账户报告,声明和通知验证 |

## Kaigi 会议 {#kaigi-sessions}

Kaigi 提供付费的实时音频/视频室 SORA Nexus. 在使用时
一个应用程序需要创建备份会议,编程变更,继电
显示,加密信号和使用计量而不是保存所有
会议的状态在链外.

面向账本的生命周期是:

- `CreateKaigi`: 在域名下创建调用,并存储其政策,
  时间表,元数据和可选的继电说明书.
- `JoinKaigi` 并且 `LeaveKaigi`: 在私人模式下,
  参与者使用承诺,取消和清单证明而不是
  参与者开户 IDs 直接的.
- `RecordKaigiUsage`: 添加计量时间和气体总数.
- `EndKaigi`: 结束会议并记录最后的时间.

Torii 显示继电器远程测量 `/v1/kaigi/relays`,
`/v1/kaigi/relays/{relay_id}`, `/v1/kaigi/relays/health`, 并且
`/v1/kaigi/relays/events` 当应用程序 API 电路测量功能已启用.
会议状态反映在 Kaigi 领域事件如
`KaigiRosterSummary`, `KaigiRelayManifestUpdated`,
`KaigiRelayHealthUpdated`, 并且 `KaigiUsageSummary`.

### CLI 烟雾测试 {#cli-smoke-test}

首先, `iroha kaigi` CLI 当你想验证一个 Torii 终点
接受 Kaigi 在连接前的交易 UI. 快启动命令
创造了一个临时的空间, Torii 终点和打印总结
与呼叫标识符,加入命令, SoraNet 子提示:

```bash
iroha kaigi quickstart --auto-join-host --summary-out kaigi-summary.json
```

对于脚本流,明确管理房间生命周期:

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

使用 `--room-policy public` 对于继电器可能在没有观众的情况下暴露的房间
门票或 `--room-policy authenticated` 当出口需要观众
认证.使用 `--privacy-mode zk-roster-v1` 只有在网络已
在 Kaigi 配置的清单和使用验证键;否则连接,页面,
在确定性验证期间,私人使用记录失败.

### 测试与 JavaScript 演示 {#testing-with-the-javascript-demo}

使用
[索拉米图/伊罗哈-示范JavaScript](https://github.com/soramitsu/iroha-demo-javascript)
这种测试是电子和Vue.
直接与 Torii 通过本地 `@iroha/iroha-js`
具有约束力,包括: `/kaigi` 浏览器原生单对一个媒体的路线.

使用示范
[`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js)
根据 Iroha 模拟键将 SDK 通过
`file:../iroha/javascript/iroha_js`, 所以把两支票都放在这个兄弟身上.
布局:

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

使用 Node.js 20或更新的和 Rust 工具链所以本土 `iroha_js_host`
模块可以构建. SDK 在兄弟姐妹中 Iroha 变换后的现金
其来源;清洁包装布局不包含货物工作空间
需要的 `npm run build:native`.

在控制测试中,将示范向一个 Kaigi- 有能力 Torii 终点:

1. 开始一个 Iroha 节点与 SORA/Kaigi 面向应用程序 APIs 启用或使用
   公共终点,揭示了 Kaigi 你需要的表面.
2. 检查基本可访问性 `/health`, 然后检查直线表面
   在 `/openapi` 或 `/openapi.json`. 一些部署也暴露
   `/v1/health`, 但 `/health` 是可移植的寿命检查.
3. 对于 TAIRA, 在尝试现场会议之前,验证继电器遥测路线:

   ```bash
   TAIRA=https://taira.sora.org
   curl -fsS "$TAIRA/health"
   curl -fsS "$TAIRA/v1/kaigi/relays"
   curl -fsS "$TAIRA/v1/kaigi/relays/health"
   ```

   这些检查证明, Torii 并且 Kaigi 接线遥测器可访问.
   不设立会议; `CreateKaigi` 并且 `JoinKaigi` 还需要资金
   钱包和签署的交易提交.
4. 打开演示,去 **设置**, 设置 Torii URL, 然后让应用程序加载
   连锁 ID 在终点上,
5. 在演示中创建或恢复两个本地钱包.
   机器,所以主机和客人有不同的钱包状态.

为了测试 Kaigi UI:

1. 在主机窗口,开放 **Kaigi**, 选择 **开始会议**, 设定一个标题,
   选择 **个人邀请** 或 **透明的邀请**.
2. 选择 **启动相机和麦克风** 所以 WebRTC 有当地媒体.
3. 选择 **创建会议链接**. 一个现场钱包提交 `CreateKaigi`; 在
   然后应用程序显示一个 `iroha://kaigi/join?call=...&secret=...` 邀请和一个
   `#/kaigi?...` 返回路线.
4. 保持主机窗户开放,与客人分享邀请.
5. 在客人窗口中,打开邀请或粘贴它 **加入会议**, 转
   在本地媒体上,选择 **加入会议**. 一个现场钱包带来
   提供加密的主机 Torii 提交 `JoinKaigi` 有加密
   答复的元数据.
6. 主持人应该通过流媒体或民意调查自动应用第一个答案 Kaigi
   两个窗口都应该显示连接的媒体和更新
   连接细节.
7. 在主机中结束此次会议,或者使用 CLI `iroha kaigi end` 的命令
   同样的电话 ID.

个人 Kaigi 保护的需求 XOR 为了支付私人入口点费用.
报告显示私人 Kaigi 保护的需求 XOR, 使用应用程序中
如果生成证据,
现场信号无法提供,演示可能会回归
透明/手动流量.在这种情况下,开放 **发达信号**, 复制
在另一个窗口中粘贴.

在演示备忘录中进行自动检查,运行:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
npm run verify
```

专注的Vitest套房覆盖面 Kaigi 会议链接创建,紧密邀请
装载,私人创建/加入/结束桥接通话,自屏幕提示,手动
答案调查. UI 烟雾测试包括 `/kaigi` 航线
在桌面和移动尺寸的视角端.
由于浏览器摄像头/麦克风权限,需要手动的两窗口测试
而同行媒体流量是环境特异性的.

对于样本集成代码,请参见
[嵌入式 Kaigi 在一个 JavaScript 应用程序](/zh-hans/guide/tutorials/kaigi.md).

## 状态和指标 {#status-and-metrics}

状态和指标终端点是第一个将线程输入到仪表板中:

- `/status` 揭示顶级同行,区块,队列和共识领域
- `/metrics` 揭露普罗梅泰斯计数器,测量仪和历史图

在 Nexus- 启用节点,状态输出也包括车道和数据空间意识
在哪里? `nexus.enabled = false`, 这些部分被遗漏.

## JSON 其他问题 Norito {#json-vs-norito}

数个运营商终端返回 Norito 默认情况下.当终端支持
JSON, 发送:

```http
Accept: application/json
```

这对于:

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`
- `/v1/sumeragi/commit_qc/{hash}`

当一个终点接受或返回输入时 Norito 直接使用
`application/x-norito` 作为内容类型或首选 `Accept` 价值.
[Norito](/zh-hans/reference/norito.md#torii-and-norito-rpc) 对于运输细节.

## 远程测量个人资料 {#telemetry-profiles}

终点可见性取决于远程测量设置.
五个档案级别:

| 个人资料 | `/status` | `/metrics` | 开发者路线 |
| --- | --- | --- | --- |
| `disabled` | 没有 | 没有 | 没有 |
| `operator` | 是的 | 没有 | 没有 |
| `extended` | 是的 | 是的 | 没有 |
| `developer` | 是的 | 没有 | 是的 |
| `full` | 是的 | 是的 | 是的 |

## CLI 快捷方式 {#cli-shortcuts}

其他 `iroha` CLI 现在,我们已经完成了许多目标:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml ops sumeragi params
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

## 上游引用 {#upstream-references}

- [README API 和可观察性的概述](https://github.com/hyperledger-iroha/iroha/blob/main/README.md)
- [ISO 200222 桥梁实施](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_torii/src/iso20022_bridge.rs)
- [绩效和指标](/zh-hans/guide/advanced/metrics.md)
