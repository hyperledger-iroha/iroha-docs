---
translation_locale: zh-hans
translation_source: /reference/torii-endpoints.md
translation_source_hash: f04e5e78329996d70926c4fd5dc034d41605d0a82fffd6460f67b252269480d9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# Torii 端点 {#torii-endpoints}

Torii 是 Iroha 3 的 HTTP、SSE 和 WebSocket 网关。它同时提供面向账本的 APIs 和运营端点。

目前的协议规则是:

- 规范二进制格式为 Norito
- 在发送 `Accept: application/json`时,许多终端也支持 JSON
- 在Prometheus格式中显示了指标.

对于格式细节,内容谈判,布局标志,方案哈希和 Norito RPC 指导,请参见[Norito 参考](/zh-hans/reference/norito.md).

## 共同的端点 {#common-endpoints}

|端点|格式| 用途                                                          |
| -------------------------------- | -------------- | ---------------------------------------------------------------- |
|`POST /v1/pipeline/transactions`|Norito|提交签署的交易|
|`POST /v1/query`|Norito|提交一个签名的查询|
|`GET /v1/events/ws`|WebSocket|订阅活动流程|
|`GET /v1/events/sse`|SSE|订阅 SSE 以上的事件流|
|`GET /v1/blocks/stream`|WebSocket|流动提交的区块|
|`GET /v1/peers`|JSON|Torii 所暴露的对等节点列表 |
|`GET /livez`|文本|只有流程活力;它并不意味着协议准备性 |
| `GET /readyz` | JSON | 完整节点就绪状态，包括强制离线现金检查 |
|`GET /health`|JSON|准备探测器使用相同的离线现金不可变量|
|`GET /v1/api/version`|文本|现在的区块标题版本|
|`GET /status`|Norito 或 JSON |高级诊断状态; 明确请求 JSON |
|`GET /metrics`|普罗梅蒂乌斯|普罗梅斯的剪伤端点|
|`GET /v1/schema`|JSON|当启用时,节点服务的数据模型方案快照|
|`GET /openapi.json`|JSON|OpenAPI 文件,用于活跃的 Torii HTTP 航线|
|`GET /v1/parameters`|JSON|节点参数快照|
|`GET /v1/node/capabilities`|JSON|节点能力和数据模型元数据|
|`GET /v1/time/now`|JSON|节点墙时钟快照|
|`GET /v1/time/status`|JSON|时间同步状态|

对于 SSE 请求,广告原始流量加上输入后退:

```http
Accept: text/event-stream, application/json
```

Torii 首先在请求层上谈判 JSON 或 Norito 的代表性,然后验证原生`text/event-stream`响应.因此只发送`text/event-stream`被拒绝使用`406`;[流事件操作指南](/zh-hans/cookbook/stream-events.md)使用完整标题.

`/openapi.json`是该方案中表示的路线的生成合同,而不是完整的运营探测器库存.当前文档遗漏了`/livez`和`/readyz`,其 `/health`描述可能会落后于准备处理器从现场文档生成路线客户端,但直接对运行节点和固定处理器进行活力和准备验证.确切的表面仍然取决于构建功能和运行时配置.使用 [Torii API 控制台](/zh-hans/reference/torii-api-console.md)来加载该现场文档,测试 JSON 路线,复制 curl 请求,并从当前的方案中生成客户端代码.

每个名单支持的 OpenAPI 操作都包含一个`x-iroha-route-auth`对象.名单支持 MCP 的工具都暴露出与 `_meta["iroha/routeAuth"]`相同的合同.两个投影都携带`schemaVersion`, `stableRouteId`, `authentication`和 `admission`.处理版本 `1`作为一个准确的合同:拒绝不支持的 `schemaVersion` 而不是猜测其认证或录取标签应该如何解释.路线元数据描述了请求边界;它不会取代该边界所要求的凭证.

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

如果公开测试网络路线返回 `502`,时间停止,或报告一个和的队列,将其视为端点可用性问题,然后在调整客户端代码之前再尝试.

## 达成共识和运行时端点 {#consensus-and-runtime-endpoints}

下面的每个 Sumeragi 路线都需要运营商请求签名.状态,诊断,流,领导者,关键, QC 和参数路线也需要设置远程测量功能.

|端点|格式| 用途                                                 |
| ----------------------------------------- | -------------- | ------------------------------------------------------- |
|`GET /v1/sumeragi/status`|Norito 或 JSON |权威的减产者持有的共识状态|
|`GET /v1/sumeragi/diagnostics`|JSON|无权威的管道,排队和通道诊断|
| `GET /v1/sumeragi/status/sse` | SSE | 持续的权威共识状态流 |
|`GET /v1/sumeragi/leader`|JSON|目前的领导信息 |
|`GET /v1/sumeragi/qc`|Norito 或 JSON |最高的和锁定的数证书快照|
|`GET /v1/sumeragi/consensus-keys`|JSON|活跃的共识密钥|
|`GET /v1/sumeragi/bls-keys`|JSON|活跃的 BLS 共识密钥|
|`GET /v1/sumeragi/params`|JSON| 连锁电流 Sumeragi 参数                    |
|`GET /v1/sumeragi/evidence`|JSON|选择性按查询字符串过的证据记录|
|`GET /v1/sumeragi/evidence/count`|JSON|证据记录数量|
|`GET /v1/runtime/abi/active`|JSON|活跃运行时描述器 ABI |
|`GET /v1/runtime/abi/hash`|JSON|活跃运行时 ABI 哈希|
|`GET /v1/runtime/metrics`|JSON|运行时指标快照|
|`GET /v1/runtime/upgrades`|JSON|运行时升级列表|
|`POST /v1/runtime/upgrades/propose`|JSON|提议升级运行时|
|`POST /v1/runtime/upgrades/activate/{id}`|JSON|启动拟议的运行时升级|
|`POST /v1/runtime/upgrades/cancel/{id}`|JSON|取消拟议的运行时升级|

## 应用程序和 SORA 路线家庭 {#app-and-sora-route-families}

当 Torii 用面向应用程序的功能集构建时,它会暴露在探索者, SORA 服务,桥梁流量,证明和存储的额外 JSON 家庭中.这些家庭并非所有网络配置文件都启用.

`/openapi.json`描述了在生成的app-API 目录中注册的路线;它对所包含的条目是权威的,而不是每个安装的路线. 特别是公共局域 SoraFS CID 和已知路线在生成的文件之外安装,必须直接进行探测.

|路线家族| 用途                                                                                                                   |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
|`/v1/accounts/*`, `/v1/domains/*`,`/v1/assets/*` |JSON 阅读,查询辅助器,登录辅助器以及投资组合或持有者的视图|
|`/v1/nfts/*`, `/v1/rwas/*`,`/v1/confidential/*` |NFT,现实资产,以及机密资产视图|
|`/v1/aliases/*`, `/v1/assets/aliases/*`,`/v1/sns/*`, `/v1/identifiers/*` |姓名,别名和识别符分辨率|
|`/v1/explorer/*`|基于探索器的账户,资产,区块,交易,指令,指标和流量视图.|
|`/v1/transactions/*`, `/v1/pipeline/*`,`/v1/iso20022/*` |交易历史,管道恢复或状态以及 ISO 20022助理|
|`/v1/contracts/*`|合同代码,部署,捆绑,呼叫,视图,事件,活动,推进和状态路线|
|`/v1/multisig/*`, `/v1/controls/*` |多签署的提案,批准和转移控制辅助者 |
|`/v1/bridge/*`, `/v1/ledger/*`,`/v1/proofs/*` |终止性,状态证明,区块证明,证明保留和证明查询路线|
|`/v1/da/*`|数据可用性摄入,清单,证明政策,承诺和明确意图 |
|`/v1/zk/*`|ZK 根,证明验证, IVM 证明,投票计数,验证钥匙,证明记录和附件 |
|`/v1/gov/*`, `/v1/ministry/*` |管理提案,投票表,理事会状态,保护名字空间,议程建议,颁布和最终制定|
|`/v1/nexus/*`, `/v1/sccp/*` |Nexus 通道,数据空间和跨链防护辅助员|
|`/v1/musubi/*`|Musubi 包装注册表阅和指令制造商|
|`/v1/subscriptions/*`|订阅计划,订阅生命周期,使用和收费助手|
|`/v1/sorafs/*`, `/sorafs/*`,`/.well-known/sorafs/*` |SoraFS 供应商的发现,能力验证,固定操作,存储收集和公开内容服务 |
|`/v1/soracloud/*`, `/v1/soradns/*`,`/soradns/*`, `/api/*` |SoraCloud 服务生命周期,私人计算/模型流量,公开发现和托管应用程序路由 |
|`/v1/connect/*`, `/v1/vpn/*` |Iroha 连接会话, WebSocket 运输,VPN 会议,个人资料和收据|
|`/v1/app-api/*`, `/v1/api/*`,`/v1/content/*` |应用程序 API 绑定和捆绑/CID 支持的内容路由 |
|`/v1/operator/*`, `/v1/mcp` |运营商认证和本地 MCP JSON-RPC 桥梁 |
|`/v1/offline/*`, `/v1/repo/*`,`/v1/space-directory/*`, `/v1/ram-lfe/*` |在线准备,存储协议,数据空间清单和[RAM-LFE 助手](/zh-hans/blockchain/ram-lfe.md#torii-routes) |
|`/v1/kaigi/*`, `/v1/webhooks/*`,`/v1/notify/*`, `/v1/telemetry/*` |合作,网络连接,推送通知和直播远程测量集成|

## 账户身份验证、可见性和 Explorer 游标 {#account-authentication-visibility-and-explorer-cursors}

### 应用程序账户请求协议 {#app-account-request-protocol}

面向应用的路由接受以下三种形式之一：不带任何身份验证标头、一个直接单密钥证明，或一个多重签名见证。每个身份验证标头最多只能出现一次。

为了得到直接的证明,请把四个标题都放在一起:

- `X-Iroha-Account`:正确的规范小字母 `0x`账户地址六字母或活跃的规范 ASCII 账户别名. I105 文本不安全作为一个 HTTP 字段值;使用规范六字母拼写为该帐户.
- `X-Iroha-Signature`:严格填充的64基签名有效载荷.
- `X-Iroha-Timestamp-Ms`：规范的无符号十进制 Unix 毫秒时间戳，且位于配置的时钟偏差窗口内。
- `X-Iroha-Nonce`: 1至256可打印 ASCII 字节 (`0x21` 通过 `0x7e`),在重播窗口中是唯一的.

已注册的单键控制器签署了这些字节:

```text
iroha.app.request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

规范查询构造会将原始查询解析为 `application/x-www-form-urlencoded`（`+` 表示空格），对各键值对进行百分号解码，按 `(key, value)` 排序，然后重新进行表单编码。协议最多允许 64 个解码后的键值对和 64 KiB 原始查询文本。必须对传输时的确切正文字节进行哈希。不得在固定的 32 字节网络 ID 与大写方法之间插入分隔符。

V1 验证器还会在解析前将方法令牌限制为 32 字节、将百分号编码的请求路径限制为 64 KiB，并将直接账户身份限制为 36 KiB。账户别名有更严格的结构限制：三个名称段及其分隔符。超过任一限制会在签名验证或按源大小分配内存之前导致身份验证失败。

多重签名控制器必须改为将 `X-Iroha-Witness` 作为严格的、带填充的 Base64 规范 Norito 发送，并省略 `X-Iroha-Signature`、`X-Iroha-Timestamp-Ms` 和 `X-Iroha-Nonce`。在此形式下，`X-Iroha-Account` 是可选的；如果存在，它必须等于见证中的 `subject_account`。`CanonicalRequestWitnessV1` 包含 `schema_version`、`subject_account`、`timestamp_ms`、`nonce`、从方法到正文摘要的精确网络请求字节的 Iroha `Hash`（不含新鲜度字段），以及最多 64 个成员签名。每个成员都对不含签名数组的同一有效载荷的规范 Norito 编码签名。已验证成员必须满足该账户当前的多重签名策略。编码后的见证上限为 1 MiB。

提供无身份验证标题选择匿名访问.提供任何部分,混合,重复,错形,过时或重播的证明失败了身份验证;它从来没有回到匿名可见性.

### 运营商请求协议 {#operator-request-protocol}

标记为经营者认证的路线需要所有四个单标头:

- `x-iroha-operator-public-key`:规范的 Iroha 多密码公钥.
- `x-iroha-operator-timestamp-ms`:在毫秒的规范未签名的Unix时刻标志.
- `x-iroha-operator-nonce`: 1至256个可打印的 ASCII 字节,是重播窗口中的该键的唯一字节.
- `x-iroha-operator-signature`:严格填充的64基签名有效载荷.

标头值不得包含前后空白。运营人员密钥对以下内容签名：

```text
iroha.operator.http-request.network.v1\0 || <genesis-derived network_id[32]> ||
<UPPERCASE_METHOD>\n
<exact request path>\n
<canonical query>\n
<lowercase hex SHA-256 of the raw body>\n
<canonical timestamp_ms>\n
<nonce>
```

路径,查询,体格,时刻印章和nonce规则是应用程序协议使用的相同的规范规规则.关键也必须由 `[torii.operator_signatures]`:列出在 `allowed_public_keys`,或明确启用`allow_node_key`当使用节点键时.重放缓存饱和时，系统会以 `503 Service Unavailable` 采用失败关闭策略。

准确的申请签名是必须的. `[torii.operator_auth].enabled = true`, 每个普通运营商路线也需要有效的路线 `x-iroha-operator-session`; 什么时候 `require_mtls = true`, 它还要求 `x-forwarded-client-cert` 任何一个因素都不能取代请求签名.

WebAuthn 注册和登录使用以下四个 JSON 端点:

|方法和端点| 用途                                  |
| --------------------------------------------- | ---------------------------------------- |
|`POST /v1/operator/auth/registration/options`|开始 WebAuthn 凭证注册|
|`POST /v1/operator/auth/registration/verify`|验证和坚持凭证|
|`POST /v1/operator/auth/login/options`|开始 WebAuthn 身份验证|
|`POST /v1/operator/auth/login/verify`|验证声明,并发出会议.|

配置 `torii.operator_auth.tokens` 用专门的启动链值.在任何证书存在之前,请发送一个为 `x-iroha-operator-token`开始首次注册.该代币从来不授权普通操作员路线,而听取者`x-api-token`值永远不会用于此流程.一旦一个凭证存在,注册另一个凭证需要进行验证的会话.登录验证返回会话代币以与每个新鲜的网络操作员请求签名一起发送.凭证在 `<torii.data_dir>/operator_auth/operator_webauthn.json`下保留.

ISO 20022路线采用两个独立的检查. 要求必须首先通过运营商许可名单和签字协议; ISO 处理器则需要相同的密钥,以占据以下描述的准确参与者或审计角色.

### 账本可见性和探险器曲者 {#ledger-visibility-and-explorer-cursors}

应用程序面向账本阅读使用上述可选的应用程序帐户边界.未签名请求只接收为公开配置的数据空间.有效的签名请求添加连接到调用者的当前 UAID 的数据空间,每个受限的数据空间以准确的 `CanReadRestrictedDataspace { dataspace }`许可命名,或者所有路线,如果账户有 `CanReadAllLedgerData`.

使用与呼叫者的授权主体相匹配的路线:

|方法和端点|验证和可见性|
| ------------------------------------- | --------------------------------------------------------------- |
|`POST /v1/transactions/visible/query`|卡通账户签名;应用呼叫者的可见性|
|`POST /v1/transactions/query`|运营商请求签名;允许全球运营商视图|
|`GET /v1/triggers/completed`|运营商请求签名;读取节点本地完成记录|

同一可见性对象会过滤账户、域、资产定义、资产、NFT、RWA、持有者和 Explorer 读取。不存在的对象与位于调用者可见路由之外的对象有意保持不可区分。仅当交易记录的每个路由段均可见时，才显示已提交的交易和指令历史。因此，只要有一个参与方路由段超出调用者范围，混合数据空间交易就会被隐藏；缺失、过时或格式错误的路由上下文仅对全局读取者可见。

由世界状态支持的六个 Explorer 集合使用不透明的规范 base64url 键集游标。默认页面限制为 25，最大值为 100，每页最多检查 512 个候选键。每个游标都绑定到其集合、筛选条件、规范最后键以及调用者的可见路由集摘要，因此不能在另一个查询中重放，也不能在调用者可见性发生变化后重放。

区块,交易,最新交易,指令和最新指令的历史游标还会固定已提交快照的高度和区块哈希.响应显示`pagination.limit`, `pagination.snapshot_height`, `pagination.snapshot_hash`, `pagination.next_cursor`,和 `pagination.has_more`.另一个路线或过滤器设置的导向器,改变的可见性摘要,或者节点不再可以验证的快照被关闭.在阻塞工作者运行时,历史扫描仍然存在于 Torii 的查询录取许可中.

Explorer WebSocket 流会发出经过筛选的摘要，并随着账本权限变化重新计算可见性。原生 `GET /v1/blocks/stream` 路由有所不同：它会发出完整的已签名区块，在握手期间要求 `CanReadAllLedgerData`，并在该权限后来被撤销时关闭。不要将原生流用于限定数据空间范围的 Explorer。

## ISO 20022 桥 {#iso-20022-bridge}

Torii 将 ISO 20022桥暴露在 `/v1/iso20022/*`下,当应用程序面向 API 和桥运行时启用时.桥是故意设定的:它不是一个一般用途的 ISO 20022清算网关,而是用于将选定的支付消息转换为签署的 Iroha 转账和跟踪其账本状态的支持子集.

在允许任何提交之前配置一个持久的本地 `torii.iso_bridge.store_dir`. 配置字段仅是可选的,因此节点可以启动只用于阅读或诊断使用:每个认证的 ISO 提交都需要目录,并且在没有持久性或重播重放防护标记或富记录写失败时返回可复试`503 Service Unavailable`.

### Torii ISO 20022 端点 {#torii-iso-20022-endpoints}

|方法和端点| 用途                                                                                            |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
|`POST /v1/iso20022/pacs008`|提交 FI 到 FI 客户信贷转账,并构建匹配的 Iroha 资产转账|
|`POST /v1/iso20022/pacs009`|提交用于 PvP 或与证券相关的现金资助的 FI 到 FI 信用转账|
|`POST /v1/iso20022/pacs002`|提交对方所拥有的支付状态报告;结算需要提交的交易证据 |
|`POST /v1/iso20022/pacs004`|提交对方所拥有的付款申报表|
|`POST /v1/iso20022/camt056`|提交原始人的取消支付请求|
|`POST /v1/iso20022/sese023`|提交证券结算说明|
|`POST /v1/iso20022/sese024`|提交对方所有的证券结算状态信息 |
|`POST /v1/iso20022/sese025`|提交对方持有的证券结算确认|
|`POST /v1/iso20022/colr012`|提交一个担保替代信息|
|`GET /v1/iso20022/messages/{msg_id}`|阅读一条经典的桥梁记录|
|`GET /v1/iso20022/audit/messages`|阅读"改"的信息审计表|
|`GET /v1/iso20022/messages/{msg_id}/pacs002`|将当前支付状况归纳为 `pacs.002` XML |
|`GET /v1/iso20022/messages/{msg_id}/pacs004`|提交当前支付申报表为 `pacs.004` XML |
|`GET /v1/iso20022/messages/{msg_id}/camt029`|输出当前取消分辨率为 `camt.029` XML |
|`GET /v1/iso20022/messages/{msg_id}/sese024`|转换当前结算状态为 `sese.024` XML |
|`GET /v1/iso20022/messages/{msg_id}/sese025`|提交当前结算确认号为 `sese.025` XML |

`pacs.008` 提交的内容必须提供信息 ID, 银行间结算金额,货币,结算日期,债务人和债权人 IBANs, 债务人和债权人 BICs. 当设置参考数据时,桥也会检查 BIC, IBAN, 和 ISO 在生成的交易进入管道之前,4217个货币交叉路口.

`pacs.009`提交的信息必须包含业务消息 ID,信息定义 ID,创建时间,银行间结算额,货币,结算日期,指示和指令代理人 BICs,债务人和信贷者 IBANs.如果信息包含`Purp`,桥梁目前只接受用于证券的资金: `Purp=SECU`.

其他 `pacs.008` 和 `pacs.009` 提交端点接受 XML ISO 封装，或桥接测试所用的扁平字段格式。可选的 `SplmtryData` 字段可以固定目标 Iroha 账本、源和目标账户 IDs 或地址以及资产定义 ID。响应为 `202 Accepted`，并包含 `message_id`、`transaction_hash`、`status`、`pacs002_code` 和解析后的账本/账户/资产上下文。

### 参与者授权和生命周期所有权 {#participant-authorization-and-lifecycle-ownership}

每个启用桥都有参与者目录.每个参与者入口都有一个独特的参与者 ID,一个或多个运营商公钥,一个或更多的财务标识符,允许配置文件集以及`originator`, `counterparty`或两个角色.运营商密钥和财务识别符不能属于多个参与者.单独配置 `audit_admin_keys`;审计管理员密钥也不能成为参与者的突变密钥.

所有 ISO 路由都要求新的操作员签名。对于首次提交 `pacs.008`、`pacs.009`、`sese.023` 或 `colr.012`，经过身份验证的操作员必须属于应用标头 `From` 中的金融身份所标识的参与者。`To` 身份必须解析为具有 `counterparty` 角色的已配置参与者，并且所选配置文件必须同时获准用于双方。持久准入记录会保存发起方、交易对手方、准入参与者和操作员密钥，以及原始配置文件和嵌入式签名策略。

生命周期授权来源于该不可改变的记录,而不是来自调用者选择的值:

|生命周期信息|要求参与者|
| ---------------------------------------------- | -------------------------------------------------- |
|`pacs.002`, `pacs.004`,`sese.024`, `sese.025` |具有 `counterparty`角色的原始对方 |
|`camt.056`|具有 `originator`角色的原始创始人|

原始的个人资料和签名政策将保留在整个文件中调用者不能选择一个较弱的配置文件来更新. `pacs.002` 代表结算的代码 (`ACSC`, `ACCP`, `SETT`, 或 `SETTLED`) 只有当原始记录被调整为结算 Torii 已提交交易证据.

原始交易的任一方都可以读取其消息记录和生成的发件箱文档。审计端点只返回已认证参与者为发起方或交易对手方的记录。单独配置的审计管理员可以获得全局只读审计视图，但不能提交或更改消息。系统不会泄露未知参与者或无关消息标识符是否存在。

### 持久重播身份和签署的输出箱文件 {#durable-replay-identity-and-signed-outbox-documents}

重放重放防护标记是严格的准入边界。对于不可读、过大、格式错误、名称错误、冲突或明确不兼容的重放防护标记，Torii 会中止启动。对于架构版本明确不兼容的详细记录、当前配置中不存在的参与者、配置文件或签名策略，或缺失或不匹配的实时重放防护标记，Torii 也会中止启动。

其他详细记录损坏的处理方式不同：不可读或过大的文件、无效 JSON、无效的当前架构记录、非规范文件名以及相互冲突的重放身份，会被记入日志或跳过。不可读或无效的当前版本审计索引会根据保留的记录重新生成；只有明确不兼容的审计索引版本才会中止启动。请监控启动日志并核对重新生成的审计清单，不要假定每个损坏的详细记录文件都会阻止节点提供服务。

每条保留的详细记录都保存不可变的参与者来源。即使详细记录内容被清除，一个独立的持久重放防护标记仍会在完整的去重 TTL 期间保留消息 ID、有效载荷哈希、业务消息 ID 和 UETR。

Torii 会在签署或处理生命周期消息之前持久化重放准入记录。它绝不会逐出未到期的重放身份。如果配置容量完全由受保护记录或未到期的重放身份占用，提交会收到可重试的 `503 Service Unavailable`，且不会改变生命周期或记账状态。

每个生成的 `pacs.002`, `pacs.004`, `camt.029`, `sese.024`或 `sese.025` 文档都以`application/xml` 为回应标题返回:

|标题| 含义                                               |
| ------------------------------ | ----------------------------------------------------- |
|`X-Iroha-Iso-Signature-Domain`|总是 `iroha.iso20022.outbound.v2`|
|`X-Iroha-Iso-Signer`|配置桥签名器的公开标准钥匙|
|`X-Iroha-Iso-Signature`|在域分隔的 XML 字节上使用Base64签名|

验证 UTF-8 字节序列 `iroha.iso20022.outbound.v2`,一个零字节,以及精确的响应体上的签名. 在验证之前不要重新格式化或正常化 XML.

### 额外的解析和绘图支持 {#additional-parser-and-mapping-support}

IVM ISO 辅助器还验证并实现下列信息家族,用于封装验证,定居地图化或下游调整.它们没有独立的 Torii 路线.

|消息家庭|目前的支持|
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
|`head.001`|商业应用程序标题验证 ISO 封,包括 `BizMsgIdr`, `MsgDefIdr`,创建时间和可选的发送/接收者 BIC 字段|
|`pacs.007`, `pacs.028`,`pacs.029` |支付逆转,状态要求和调查解决/状态分析|
|`pain.001`, `pain.002` |客户支付启动和支付状态报告验证 |
|`camt.052`, `camt.053`,`camt.054` | 账户报告、对账单和通知的验证                                                                                               |

## Kaigi 会议 {#kaigi-sessions}

Kaigi 在 SORA Nexus 上提供付费的实时音频/视频室. 使用它,当应用程序需要创建账本支持的会话,变更名单,继电清单,加密信号和使用计量,而不是将所有会议状态关闭链.

面向账本的生命周期是:

- `CreateKaigi`:在域名下创建呼叫,并存储其政策,时间表,元数据和可选的继电说明书.
- `JoinKaigi`:更新呼叫名单.在 `zk-roster-v1`模式下,公开呼叫视图显示了承诺和无效数量,而不是参与者帐户 IDs.
- `LeaveKaigi`:将参与者从透明调用中移除.私人模式的离开在首发协议中是离链的.
- `RecordKaigiUsage`:添加计量时间和gas总数.
- `EndKaigi`:结束会议并记录最后的时刻.

Torii 揭示了以下面向应用程序的读数:

|路线|验证| 用途                                    |
| ----------------------------------- | --------------------------------------- | ------------------------------------------ |
|`/v1/kaigi/calls/{call_id}`|公共|目前的呼叫记录|
|`/v1/kaigi/calls/{call_id}/signals`|准确网络账户要求|页面化的提交信号传输元数据|
|`/v1/kaigi/calls/{call_id}/events`|准确网络账户要求|调用生命周期流程|
|`/v1/kaigi/relays`|允许上市的运营商请求|连接总结|
|`/v1/kaigi/relays/{relay_id}`|允许上市的运营商请求|一个继电器的注册和健康细节 |
|`/v1/kaigi/relays/health`|允许上市的运营商请求|综合继电器健康|
|`/v1/kaigi/relays/events`|准确网络账户要求|连接注册和健康活动流程|

必须启用应用 API。中继摘要和健康路由即使是只读的，也属于运营方接口；未签名的 `curl` 请求不是有效的可用性探测。会话状态还会通过 `KaigiRosterSummary`、`KaigiRelayManifestUpdated`、`KaigiRelayHealthUpdated` 和 `KaigiUsageSummary` 等 Kaigi 域事件反映。

### CLI 冒烟测试 {#cli-smoke-test}

开始使用 `iroha app kaigi` CLI 当您想验证 Torii 端点在连接 UI 之前接受 Kaigi 交易时.快启动命令会对配置的端点创建一个空间,打印其呼叫标识符,并加入元数据:

```bash
iroha app kaigi quickstart \
  --domain kaigi.universal \
  --summary-out kaigi-summary.json
```

对于编写的流量,明确管理房间生命周期:

```bash
iroha app kaigi create \
  --domain kaigi.universal \
  --call-name daily \
  --host <i105-account-id> \
  --privacy-mode transparent \
  --room-policy authenticated

iroha app kaigi join \
  --domain kaigi.universal \
  --call-name daily \
  --participant <i105-account-id>

iroha app kaigi leave \
  --domain kaigi.universal \
  --call-name daily \
  --participant <i105-account-id>

iroha app kaigi record-usage \
  --domain kaigi.universal \
  --call-name daily \
  --duration-ms 120000 \
  --billed-gas 1500

iroha app kaigi end --domain kaigi.universal --call-name daily
```

使用 `--room-policy public` 对于继电器可以在没有观众门票的情况下暴露的房间,或 `--room-policy authenticated` 当出口必须需要观众身份验证时. `--privacy-mode zk-roster-v1` 只有在网络获得了 Kaigi 列表和使用验证键配置;否则连接,页面,在确定性验证过程中,私人使用记录失败.

### JavaScript 集成 {#javascript-integration}

目前的 [Iroha JavaScript 演示](https://github.com/soramitsu/iroha-demo-javascript)实现了透明,认证的一对一会议配置文件.它不暴露协议的`zk-roster-v1`证明流程.它的渲染器创建 WebRTC 的提议和应答,而特权桥梁使用本地 [`@iroha/iroha-js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js)工作副本来报价,签署,提交并等待完成的 Kaigi 交易.

查看 [在 JavaScript App](/zh-hans/guide/tutorials/kaigi.md)中嵌入 Kaigi,准确的路线身份验证,邀请格式,桥边界和当前的演示测试指令.

## 状态和指标 {#status-and-metrics}

状态和指标端点是第一个进入仪表板的东西:

- `/status` 揭示顶级对等节点,区块,队列和共识领域
- `/metrics` 暴露了Prometheus计量器,测量仪和历史图表

在启用 Nexus 的节点上,状态输出还包括通道和数据空间意识的部分.当`nexus.enabled = false`时,这些部分会被省略.

## JSON vs Norito {#json-vs-norito}

几个运营商端点默认返回 Norito.当端点支持 JSON,发送:

```http
Accept: application/json
```

这对于以下情况尤其有用:

- `/v1/sumeragi/status`
- `/v1/sumeragi/qc`

当端点接收或直接输入 Norito 时,使用`application/x-norito`作为内容类型或首选 `Accept`值.查看 [Norito](/zh-hans/reference/norito.md#torii-and-norito-rpc)的运输详细信息.

## 远程测量个人资料 {#telemetry-profiles}

端点可见性取决于节点的 `telemetry.profile`设置.当前配置显示了五个个人资料级别:

|个人资料|`/status`|`/metrics`|开发人员的路线|
| ----------- | --------- | ---------- | ---------------- |
|`disabled`|没有.|没有.|没有.|
|`operator`|是的.|没有.|没有.|
|`extended`|是的.|是的.|没有.|
|`developer`|是的.|没有.|是的.|
|`full`|是的.|是的.|是的.|

## CLI 快捷方式 {#cli-shortcuts}

`iroha` CLI 已经包裹了许多这些端点:

```bash
export IROHA_OPERATOR_KEY_FILE=/run/secrets/iroha/operator.key

iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  ops sumeragi params
iroha --config ./localnet/client.toml --operator-private-key-file "$IROHA_OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi evidence count
```

## 上游引用 {#upstream-references}

- [README API 和可观测性概述](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/README.md)
- [ISO 20022 桥接实现](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/src/iso20022_bridge.rs)
- [性能和指标](/zh-hans/guide/advanced/metrics.md)
