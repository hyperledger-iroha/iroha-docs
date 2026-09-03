---
translation_locale: zh-hans
translation_source: /reference/torii-endpoints.md
translation_source_hash: 29cb291e63f427a4e71296e4244eaf71dc4651d486e3d15fb3d1045230f6023e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Torii 终点 {#torii-endpoints}

Torii 是 HTTP, SSE, 和 WebSocket 的门户 Iroha 3. 它们都面向本书. APIs 和运营商终端点.

目前的协议规则是:

- 常规二进制格式为 Norito
- 在发送 `Accept: application/json`时,许多终端也支持 JSON
- 在Prometheus格式中显示了指标.

对于格式细节,内容谈判,布局标志,方案哈希和 Norito RPC 指导,请参见[Norito 参考](/zh-hans/reference/norito.md).

## 共同的终点 {#common-endpoints}

|终点|格式|目的|
| --- | --- | --- |
|`POST /v1/pipeline/transactions`|Norito|提交签署的交易|
|`POST /v1/query`|Norito|提交一个签名的查询|
|`GET /v1/events/ws`|WebSocket|订阅活动流|
|`GET /v1/events/sse`|SSE|订阅 SSE 以上的事件流|
|`GET /v1/blocks/stream`|WebSocket|流动承诺的区块|
|`GET /v1/peers`|JSON|Torii 所暴露的同行列表 |
|`GET /livez`|文本|只有流程活力;它并不意味着协议准备性 |
|`GET /readyz`|JSON|无线现金检查,包括强制性的无线现货检查|
|`GET /health`|JSON|准备探测器使用相同的离线现金不可变量|
|`GET /v1/api/version`|文本|现在的区块标题版本|
|`GET /status`|Norito 或 JSON |高级诊断状态; 明确请求 JSON |
|`GET /metrics`|普罗梅蒂乌斯|普罗梅蒂乌斯的痕终点|
|`GET /v1/schema`|JSON|当启用时,节点服务的数据模型方案快照|
|`GET /openapi`或 `GET /openapi.json` |JSON|OpenAPI 文件,用于活跃的 Torii HTTP 航线|
|`GET /v1/parameters`|JSON|节点参数快照|
|`GET /v1/node/capabilities`|JSON|节点能力和数据模型元数据|
|`GET /v1/time/now`|JSON|节点墙时钟快照|
|`GET /v1/time/status`|JSON|时间同步状态|

对于 SSE 请求,广告原始流量加上输入后退:

```http
Accept: text/event-stream, application/json
```

Torii 首先在请求层上谈判 JSON 或 Norito 的代表性,然后验证原生`text/event-stream`响应.因此只发送`text/event-stream`被拒绝使用`406`;[流事件配方](/zh-hans/cookbook/stream-events.md)使用完整标题.

`/openapi`是该方案中表示的路线的主要生成合同,而不是完整的运营探测器库存.当前文档遗漏`/livez`和`/readyz`,其 `/health`描述可能会落后于准备处理器.从现场文档生成路线客户端,但直接对运行节点和固定处理器进行活力和准备验证.确切的表面仍然取决于构建功能和运行时间配置.使用 [Torii API 控制台](/zh-hans/reference/torii-api-console.md)来加载该现场文档,测试 JSON 路线,复制 curl 请求,并从当前的方案中生成客户端代码.

## 试看直播 Taira 路线 {#try-live-taira-routes}

公共的 Taira 测试网暴露出应用客户端仅用于阅读探索的相同的 Torii JSON 表面.这些命令不需要密钥:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TAIRA_ROOT/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA_ROOT/openapi.json" \
  | jq -r '.paths | keys[]' \
  | grep '^/v1/' \
  | head -n 20

curl -fsS -H 'Accept: application/json' \
  "$TAIRA_ROOT/v1/node/capabilities" \
  | jq '{abi_version, data_model_version, query: .query.aggregate.supported_resources}'
```

试看资源对当前世界状况:

```bash
curl -fsS "$TAIRA_ROOT/v1/domains?limit=5" \
  | jq -r '.items[].id'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=5" \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

如果公开测试网络路线返回 `502`,时间停止,或报告一个和的队列,将其视为终点可用性问题,然后在调整客户端代码之前再尝试.

## 达成共识和运行时间终点 {#consensus-and-runtime-endpoints}

|终点|格式|目的|
| --- | --- | --- |
|`GET /v1/sumeragi/commit-certificates`|JSON|最近的承诺证书总结 |
|`GET /v1/sumeragi/validator-sets`|JSON|验证器设置历史记录|
|`GET /v1/sumeragi/validator-sets/{height}`|JSON|验证器设置在一个区块高度|
|`GET /v1/sumeragi/status`|Norito 或 JSON |详细的共识状态快照|
|`GET /v1/sumeragi/status/sse`|SSE|持续的共识状态流|
|`GET /v1/sumeragi/leader`|JSON|目前的领导信息 |
|`GET /v1/sumeragi/qc`|Norito 或 JSON |最新的数证书总结 |
|`GET /v1/sumeragi/checkpoints`|JSON|共识检查点总结|
|`GET /v1/sumeragi/consensus-keys`|JSON|活跃的共识密钥|
|`GET /v1/sumeragi/bls_keys`|JSON|活跃的 BLS 共识密钥|
|`GET /v1/sumeragi/phases`|JSON|最新的每个阶段延迟样本|
|`GET /v1/sumeragi/rbc`|JSON|RBC 会议和吞吐量指标 |
|`GET /v1/sumeragi/rbc/sessions`|JSON|活动的 RBC 会议快照|
|`GET /v1/sumeragi/pacemaker`|JSON|心脏缓慢器的状态|
|`GET /v1/sumeragi/params`|JSON|连锁电流参数 Sumeragi |
|`GET /v1/sumeragi/collectors`|JSON|确定性集体计划的快照|
|`GET /v1/sumeragi/key-lifecycle`|JSON|共识关键生命周期状态|
|`GET /v1/sumeragi/telemetry`|JSON|共识远程测量快照|
|`GET /v1/sumeragi/evidence`|JSON|选择性通过查询字符串过的证据记录|
|`GET /v1/sumeragi/evidence/count`|JSON|证据记录数量|
|`POST /v1/sumeragi/evidence/submit`|JSON|提交共识证据|
|`GET /v1/sumeragi/commit_qc/{hash}`|Norito 或 JSON |提交 QC 记录为区块哈希|
|`GET /v1/runtime/abi/active`|JSON|活跃运行时间描述器 ABI |
|`GET /v1/runtime/abi/hash`|JSON|活跃运行时间 ABI 哈希|
|`GET /v1/runtime/metrics`|JSON|运行时间指标快照|
|`GET /v1/runtime/upgrades`|JSON|运行时间升级列表|
|`POST /v1/runtime/upgrades/propose`|JSON|提议升级运行时间|
|`POST /v1/runtime/upgrades/activate/{id}`|JSON|启动拟议的运行时间升级|
|`POST /v1/runtime/upgrades/cancel/{id}`|JSON|取消拟议的运行时间升级|

## 应用程序和 SORA 路线家庭 {#app-and-sora-route-families}

当 Torii 用面向应用程序的功能集构建时,它会暴露在探索者, SORA 服务,桥梁流量,证明和存储的额外 JSON 家庭中.这些家庭并非所有网络配置文件都启用.

|路线家族|目的|
| --- | --- |
|`/v1/accounts/`, `/v1/domains/`,`/v1/assets/*` |JSON 阅读,查询辅助器,登录辅助器以及投资组合或持有者的视图|
|`/v1/nfts/`, `/v1/rwas/`,`/v1/confidential/*` |NFT,现实资产,以及机密资产视图|
|`/v1/aliases/`, `/v1/assets/aliases/`,`/v1/sns/`, `/v1/identifiers/` |姓名,别名和识别符分辨率|
|`/v1/explorer/*`|基于探索器的账户,资产,区块,交易,指令,指标和流量视图.|
|`/v1/transactions/`, `/v1/pipeline/`,`/v1/iso20022/*` |交易历史,管道恢复或状态以及 ISO 20022助理|
|`/v1/contracts/*`|合同代码,部署,捆绑,呼叫,视图,事件,活动,推进和状态路线|
|`/v1/multisig/`, `/v1/controls/` |多签署的提案,批准和转移控制辅助者 |
|`/v1/bridge/`, `/v1/ledger/`,`/v1/proofs/*` |终止性,状态证明,区块证明,证据保留和证据查询路线|
|`/v1/da/*`|数据可用性摄入,表格,证明政策,承诺和明确意图 |
|`/v1/zk/*`|ZK 根,证据验证, IVM 证明,投票计数,验证钥匙,证据记录和附件 |
|`/v1/gov/`, `/v1/ministry/` |管理提案,投票表,理事会状态,保护名字空间,议程建议,颁布和最终制定|
|`/v1/nexus/`, `/v1/sccp/` |Nexus 车道,数据空间和跨链防护辅助员|
|`/v1/musubi/*`|Musubi 包装注册表阅和指令制造商|
|`/v1/subscriptions/*`|订阅计划,订阅生命周期,使用和收费助手|
|`/v1/sorafs/`, `/sorafs/`,`/.well-known/sorafs/*` |SoraFS 供应商的发现,能力验证,粘贴,存储收集和公开内容服务 |
|`/v1/soracloud/`, `/v1/soradns/`,`/soradns/`, `/api/` |SoraCloud 服务生命周期,私人计算/模型流量,公开发现和托管应用程序路由 |
|`/v1/connect/`, `/v1/vpn/` |Iroha 连接会话, WebSocket 运输,VPN 会议,个人资料和收据|
|`/v1/app-api/`, `/v1/api/`,`/v1/content/*` |应用程序 API 绑定和捆绑/CID 支持的内容路由 |
|`/v1/operator/*`, `/v1/mcp` |运营商认证和本地 MCP JSON-RPC 桥梁 |
|`/v1/offline/`, `/v1/repo/`,`/v1/space-directory/`, `/v1/ram-lfe/` |在线准备,存储协议,数据空间表格和[RAM-LFE 助手](/zh-hans/blockchain/ram-lfe.md#torii-routes) |
|`/v1/kaigi/`, `/v1/webhooks/`,`/v1/notify/`, `/v1/telemetry/` |合作,网络连接,推送通知和直播远程测量集成|

## 账户身份验证,可见性和探险器的客 {#account-authentication-visibility-and-explorer-cursors}

应用程序面向账本阅读使用一个可选的常规帐户签名界限.未签署的请求只收到活跃的公共数据库.有效的签署的要求添加了与调用者的当前 UAID 绑定的数据库和该帐户的 `CanReadRestrictedDataspace`权限命名的确切数据库路线.`CanReadAllLedgerData`在每个数据空间中提供可见性.只提供`X-Iroha-Account`,或者任何不完整或错误的签名标题集,返回`401 Unauthorized`;它不会回到匿名可见性的状态.

同样的可见性对象过帐户,域名,资产定义,资产, NFT, RWA,持有者和探险器.一个缺失的对象和一个在调用者的可见路线之外的对象是故意无法区分的.只有当交易所记录的每条路线脚图可见时,就会显示承诺的交易和指令历史.因此,当连一个参与者腿都不在调用者的范围之外时,隐藏; 缺失,过时或错误的路由文本仅可见于全球读者.

Torii 在使用者过器,页面化,计数或对 SSE,WebSocket,合同事件和重播路径的投影之前应用这一范围.长期流程重新评估相同的授权随着账本权限的变化,并在访问后终止与通用授权失败.已撤销.

全球支持的六个Explorer集合使用不透明的正规base64url键盘设置缓冲器.默认页面限制为 25,最大是100,一个页面检查最多512个候选键.每个缓解器都与其集合,过器,法定最后键和调用者的可见路线设置消化联系在一起,因此不能在另一个查询或调用者可视性发生变化后重播.

区块,交易,最新事务,指令和最新指令历史线索 additionally pin the committed snapshot height and block hash.响应显示`pagination.limit`, `pagination.snapshot_height`, `pagination.snapshot_hash`, `pagination.next_cursor`,和 `pagination.has_more`.另一个路线或过器设置的导向器,改变的可见性消化,或者节点不再可以验证的快照被关闭.在阻塞工作者运行时,历史扫描仍然存在于 Torii 的查询录取许可中.

随着账本权限的变化, Explorer WebSocket 流发出过总结和重新计算可见性.本地 `GET /v1/blocks/stream` 路线不同:它发射完整在手握时需要 `CanReadAllLedgerData`,并在后面撤销该许可的情况下关闭.

现场 `GET /v1/sumeragi/status/sse`共识诊断流也不是一个匿名的数据空间输送.它需要在每个连接尝试中完成操作员签名头条四旋翼.客户为精确流 URI 生成一个新签名,并不会通过自动重新尝试运输来遵循转向或重播已签署的尝试.

## ISO 20022 桥 {#iso-20022-bridge}

Torii 将 ISO 20022桥暴露在 `/v1/iso20022/*`下,当应用程序面向 API 和桥运行时间启用时.桥是故意设定的:它不是一个一般用途的 ISO 20022清算网关,而是用于将选定的支付消息转换为签署的 Iroha 转账和跟踪其账本状态的支持子集.

### Torii ISO 20022 终点 {#torii-iso-20022-endpoints}

|方法和终点|目的|
| --- | --- |
|`POST /v1/iso20022/pacs008`|提交 FI 到 FI 客户信贷转账,并构建匹配的 Iroha 资产转账|
|`POST /v1/iso20022/pacs009`|提交用于 PvP 或与证券相关的现金资助的 FI 到 FI 信用转账|
|`POST /v1/iso20022/pacs002`|提交对方所拥有的支付状况报告;结算需要承诺的交易证据|
|`POST /v1/iso20022/pacs004`|提交对方所拥有的付款申报表|
|`POST /v1/iso20022/camt056`|提交原始人的取消支付请求|
|`POST /v1/iso20022/sese023`|提交证券结算说明|
|`POST /v1/iso20022/sese024`|提交对方所有的证券结算状态信息 |
|`POST /v1/iso20022/sese025`|提交对方持有的证券结算确认|
|`POST /v1/iso20022/colr012`|提交一个抵押替换信息|
|`GET /v1/iso20022/messages/{msg_id}`|阅读一条经典的桥梁记录.|
|`GET /v1/iso20022/audit/messages`|阅读"改"的信息审计表.|
|`GET /v1/iso20022/messages/{msg_id}/pacs002`|将当前支付状况归纳为 `pacs.002` XML |
|`GET /v1/iso20022/messages/{msg_id}/pacs004`|提交当前支付申报表为 `pacs.004` XML |
|`GET /v1/iso20022/messages/{msg_id}/camt029`|输出当前取消分辨率为 `camt.029` XML |
|`GET /v1/iso20022/messages/{msg_id}/sese024`|转换当前结算状态为 `sese.024` XML |
|`GET /v1/iso20022/messages/{msg_id}/sese025`|提交当前结算确认号为 `sese.025` XML |

`pacs.008` 提交的内容必须提供信息 ID, 银行间结算金额,货币,结算日期,债务人和债权人 IBANs, 债务人和债权人 BICs. 当设置参考数据时,桥也会检查 BIC, IBAN, 和 ISO 在生成的交易进入管道之前,4217个货币交叉路口.

`pacs.009`提交的信息必须包含业务消息 ID,信息定义 ID,创建时间,银行间结算额,货币,结算日期,指示和指令代理人 BICs,债务人和信贷者 IBANs.如果信息包含`Purp`,桥梁目前只接受用于证券的资金: `Purp=SECU`.

其他 `pacs.008` 和 `pacs.009` 提交终点接受 XML ISO 在桥梁测试中使用的封筒或平面场格式.可选 `SplmtryData` 字段可以定目标 Iroha 总账户,来源和目标帐户 IDs 或地址,以及资产定义 ID. 答案是 `202 Accepted` 与 `message_id`, `transaction_hash`, `status`, `pacs002_code`, 解决账本/帐户/资产背景.

### 参与者授权和生命周期所有权 {#participant-authorization-and-lifecycle-ownership}

每个启用桥都有参与者目录.每个参与者入口都有一个独特的参与者 ID,一个或多个运营商公钥,一个或更多的财务标识符,允许的个人资料集和`originator`, `counterparty`,或者两个角色.运营商密钥和财务识别符不能属于多个参与者.单独配置 `audit_admin_keys`;一个审计管理员密钥也不能是参与者的突变密钥.

所有的 ISO 路线需要新的运营商签名. `pacs.008`, `pacs.009`, `sese.023`, 或 `colr.012` 提交,验证的运营商必须属于申请标题所识别的参与者 `From` 金融身份. `To` 身份必须指定另一个配置参与者,并且对双方都允许选择的个人资料.持久的录取记录原始人,对方,承认参与者和运营商密钥,以及原始配置文件和嵌入式签名政策.

生命周期授权来源于该不可改变的记录,而不是来自调用者选择的值:

|生命周期信息|要求参与者|
| --- | --- |
|`pacs.002`, `pacs.004`,`sese.024`, `sese.025` |具有 `counterparty`角色的原始对方 |
|`camt.056`|具有 `originator`角色的原始创始人|

原始的个人资料和签名政策将保留在整个文件中调用者不能选择一个较弱的配置文件来更新. `pacs.002` 代表结算的代码 (`ACSC`, `ACCP`, `SETT`, 或 `SETTLED`) 只有当原始记录被调整为结算 Torii 已提交交易证据.

任何原始方都可以阅读其消息记录和生成的输出箱文件. 审计终点只返回验证参与者是发起者或对方的记录. 单独配置的审计管理员收到全局仅可阅读的审计视图,不能提交或更改消息. 不知名参与者和无关的消息标识符不披露.

### 持久重播身份和签署的输出箱文件 {#durable-replay-identity-and-signed-outbox-documents}

ISO 记录存储只接受图案 V3 记录和重播墓碑. Torii 如果保留的数据不符合该方案,则出现明显的兼容性错误.每个富有的记录都保留着.一个独立的持久墓碑保留了信息. ID, 使用负载哈希,业务信息 ID, 和 UETR 对于完整的减倍 TTL 即使有丰富的记录细节被剪切.

Torii 在签署或处理生命周期消息之前仍然存在重播录取.它永远不会驱逐未到期的重播身份.如果配置记录容量仅包含 TTL 受保护的输入,则提交文件会得到可转换的 `503 Service Unavailable` 没有改变生命周期或会计状态.

每个生成的 `pacs.002`, `pacs.004`, `camt.029`, `sese.024`或 `sese.025` 文件都以`application/xml` 返回这些响应标题:

|标题| 含义 |
| --- | --- |
|`X-Iroha-Iso-Signature-Domain`|总是 `iroha.iso20022.outbound.v2`|
|`X-Iroha-Iso-Signer`|配置桥签名器的可нони公钥 |
|`X-Iroha-Iso-Signature`|在域分隔的 XML 字节上使用Base64签名|

验证 UTF-8 字节序列 `iroha.iso20022.outbound.v2`,一个零字节,以及精确的响应体上的签名. 在验证之前不要重新格式化或正常化 XML

### 额外的解析和绘图支持 {#additional-parser-and-mapping-support}

IVM ISO 辅助器还验证并实现下列信息家族,用于包裹验证,定居地图化或下游调整.它们没有独立的 Torii 路线.

|消息家庭|目前的支持|
| --- | --- |
|`head.001`|商业应用程序标题验证 ISO 封,包括 `BizMsgIdr`, `MsgDefIdr`,创建时间和可选的发送/接收者 BIC 字段|
|`pacs.007`, `pacs.028`,`pacs.029` |支付逆转,状态要求和调查解决/状态分析|
|`pain.001`, `pain.002` |客户支付启动和支付状态报告验证 |
|`camt.052`, `camt.053`,`camt.054` | 账户报告、对账单和通知的验证 |

## Kaigi 会议 {#kaigi-sessions}

Kaigi 在 SORA Nexus 上提供付费的实时音频/视频室. 使用它,当应用程序需要创建账本支持的会话,变更名单,继电表格,加密信号和使用计量,而不是将所有会议状态关闭链.

面向账本的生命周期是:

- `CreateKaigi`:在域名下创建呼叫,并存储其政策,时间表,元数据和可选的继电说明书.
- `JoinKaigi`和`LeaveKaigi`:更新呼叫名单.在私人模式下,参与者使用承诺,取消符号和名单证明,而不是直接暴露参与者的帐户 IDs.
- `RecordKaigiUsage`:添加计量时间和气体总数.
- `EndKaigi`:结束会议并记录最后的时刻.

Torii 显示继电器远程测量 `/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}`, `/v1/kaigi/relays/health`, 和 `/v1/kaigi/relays/events` 当应用程序 API 会议状态反映通过: Kaigi 领域事件如: `KaigiRosterSummary`, `KaigiRelayManifestUpdated`, `KaigiRelayHealthUpdated`, 和 `KaigiUsageSummary`.

### CLI 烟雾测试 {#cli-smoke-test}

在连接一个 UI 之前,开始使用`iroha kaigi` CLI 来验证 Torii 终端点接受 Kaigi 交易.快启动命令对活跃的 Torii 终端点创建一个临时空间,并打印了一个总结,包含呼叫标识符,加入命令和 SoraNet 卷轴提示:

```bash
iroha kaigi quickstart --auto-join-host --summary-out kaigi-summary.json
```

对于编写的流量,明确管理房间生命周期:

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

使用 `--room-policy public` 对于继电器可以在没有观众门票的情况下暴露的房间,或 `--room-policy authenticated` 当出口必须需要观众身份验证时. `--privacy-mode zk-roster-v1` 只有在网络获得了 Kaigi 列表和使用验证键配置;否则连接,页面,在确定性验证过程中,私人使用记录失败.

### 使用 JavaScript 示范测试 {#testing-with-the-javascript-demo}

使用 [soramitsu/iroha-demo-javascript](https://github.com/soramitsu/iroha-demo-javascript)桌面演示程序进行端到端钱包测试.该演示程序是电子和Vue应用程序,通过本地 `@iroha/iroha-js`绑定直接与 Torii 交谈,并包括浏览器原生一个对一个媒体的 `/kaigi`路线.

使用 [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js)从 Iroha 源存储库的演示.演示针是 SDK 到 `file:../iroha/javascript/iroha_js`,所以保持这两个支票在兄弟布局:

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

使用 Node.js 20 或更新版本和 Rust 工具链,以便本土的 `iroha_js_host` 模块构建.在改变其源头后重建 Iroha 收银器中的 SDK;清洁包装布局不包含 `npm run build:native` 所需的货物工作空间.

在控制测试中,指向示范器到一个 Kaigi - 能力的 Torii 终点:

1. 启动一个 Iroha 节点,使用 SORA/Kaigi 应用程序面向 APIs 启用,或者使用一个公开的终端点,将所需的 Kaigi 表面暴露出来.
2. 通过 `/health`检查基本可达性,然后使用 `/openapi`或 `/openapi.json`检查实行路线表面.一些部署也会暴露`/v1/health`,但`/health`是便携式活力检测.
3. 对于 TAIRA,在尝试现场会议之前,验证继电器远程测量路线

   ```bash
   TAIRA=https://taira.sora.org
   curl -fsS "$TAIRA/health"
   curl -fsS "$TAIRA/v1/kaigi/relays"
   curl -fsS "$TAIRA/v1/kaigi/relays/health"
   ```

这些检查证明 Torii 和 Kaigi 继电远程测量可访问.它们不会创建会议;`CreateKaigi`和`JoinKaigi`仍然需要资助的钱包和签署交易提交.
4. 打开演示,进入设置,设置 Torii URL,然后让应用程序从终端点上加载链接 ID 和网络前.
5. 在演示中创建或恢复两个本地钱包. 使用单独的应用程序窗户,个人资料或机器,以便主机和客人有单独的钱包状态.

为了测试 Kaigi UI:

1. 在主机窗口中,打开 Kaigi,选择开始会议,设置标题,然后选择私人邀请或透明邀请.
2. 选择开摄像头和麦克风,所以 WebRTC 有本地媒体.
3. 选择创建会议链接. 一个现场钱包提交 `CreateKaigi`;然后应用程序显示`iroha://kaigi/join?call=...&secret=...`邀请和`#/kaigi?...`回归路线.
4. 保持主机窗户开放,并与客人分享邀请.
5. 在客户窗口中,打开邀请或粘贴在加入会议中,启动本地媒体,然后选择加入会议. 现场钱包从 Torii 获取加密的主机报价,并提交`JoinKaigi`加密答案元数据.
6. 主机应通过播放或投票 Kaigi 电话信号自动应用第一个答案. 两个窗口都应该显示连接的媒体和更新的连接细节.
7. 从主机中结束会议,或者使用 CLI `iroha kaigi end` 命令进行相同的调用 ID.

个人 Kaigi 保护的需求 XOR 如果演示报告说私人进入点费用, Kaigi 保护的需求 XOR, 使用应用程序内自屏幕提示,再尝试创建或加入操作.如果无法生成证据,私人资金或直播信号,则演示程序可以恢复到透明/手动流程.在这种情况下,打开高级信号,复制原始的报价或答案包,然后将其粘贴在另一个窗口.

在测试 repo 中进行自动检查,运行:

```bash
npm test -- tests/kaigiView.spec.ts tests/preloadKaigiBridge.spec.ts
npm run e2e:ui
npm run verify
```

专注的Vitest套房覆盖面 Kaigi 会议链接创建,紧的邀请加载,私人创建/加入/结束 警卫,手动反弹和回答民意调查. UI 烟雾测试包括: `/kaigi` 在桌面和移动尺寸的视频端上. 两个钱包之间的直播媒体仍然需要手动两窗口测试,因为浏览器摄像头/麦克风权限和同行媒体流量是特定环境的.

对于样本集成代码,请见 [在 JavaScript App](/zh-hans/guide/tutorials/kaigi.md)中包含 Kaigi.

## 状态和指标 {#status-and-metrics}

状态和指标终端点是第一个进入仪表板的东西:

- `/status` 揭示顶级同行,区块,队列和共识领域
- `/metrics` 暴露了Prometheus计量器,测量仪和历史图表

在启用 Nexus 的节点上,状态输出还包括车道和数据空间意识的部分.当`nexus.enabled = false`时,这些部分会被省略.

## JSON vs Norito {#json-vs-norito}

几个运营商终端点默认返回 Norito.当终端点支持 JSON,发送:

```http
Accept: application/json
```

这对于以下情况尤其有用:

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`
- `/v1/sumeragi/commit_qc/{hash}`

当终端点接收或直接输入 Norito 时,使用`application/x-norito`作为内容类型或首选 `Accept`值.查看 [Norito](/zh-hans/reference/norito.md#torii-and-norito-rpc)的运输详细信息.

## 远程测量个人资料 {#telemetry-profiles}

终点可见性取决于节点的 `telemetry.profile`设置.当前配置显示了五个个人资料级别:

|个人资料|`/status`|`/metrics`|开发人员的路线|
| --- | --- | --- | --- |
|`disabled`|没有.|没有.|没有.|
|`operator`|是的.|没有.|没有.|
|`extended`|是的.|是的.|没有.|
|`developer`|是的.|没有.|是的.|
|`full`|是的.|是的.|是的.|

## CLI 快捷方式 {#cli-shortcuts}

`iroha` CLI 已经包裹了许多这些终端点:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml ops sumeragi params
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

## 上游引用 {#upstream-references}

- [README API 和可观测性概述](https://github.com/hyperledger-iroha/iroha/blob/main/README.md)
- [ISO 200222桥梁实施](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_torii/src/iso20022_bridge.rs)
- [性能和指标](/zh-hans/guide/advanced/metrics.md)
