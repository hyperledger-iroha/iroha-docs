---
translation_locale: zh-hans
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 98c351372551b08bda4911f52bfb3cc70c53b6125d8045c17abb205b27960f6d
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# 使用 Taira 和 Minamoto 在 SORA Nexus 上开发 {#build-on-sora-3-taira-and-minamoto}

SORA Nexus 基于 Iroha 3 运行。请先在 Taira 上开发和测试应用。只有在备好主网专用密钥、用于支付手续费的真实 XOR，并获得生产环境运行许可后，才将同一套客户端配置迁移到 Minamoto。

本指南介绍如何为 SORA Nexus 的两个公共网络配置 Iroha 客户端。

- Taira 测试网在 `https://taira.sora.org`
- Minamoto 主网在 `https://minamoto.sora.org`

使用 Taira 进行集成测试、由水龙头资助的写入 canary 测试和部署演练.只使用 Minamoto 用于生产准备的主网活动.两个网络都在 XOR 收取费用:

- Taira 使用公共水龙头的测试网 XOR.
- Minamoto 使用真实的 XOR.没有 Minamoto 水龙头.

## 建设者之路 {#builder-path}

|步骤|Taira 测试网|Minamoto 主要网|
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|开始阅读网络状态|查询 `/status` 没有钥匙| 先确认端点并验证 TLS 证书 |
|选择一个数据空间|使用公开 `universal` 除非您的应用程序需要一个受监管的路径|仅在主网批准后使用相同的数据空间|
|获得费用资产.|使用公众的 Taira 水龙头|从资助的 Minamoto 账户或经批准的财政流通中获得 XOR|
|测试写入|使用水龙头资助的测试 XOR |不要使用测试工具; 写入会消耗真实 XOR |
|促进|继续尝试逻辑,监测和签名处理|使用单独的钥匙,资金和释放控制|

实际流程是:

1. 针对 Taira 开发客户端，并使用公开的 `universal` 数据空间。
2. 添加一个签字者,并用 Taira 水龙头资助它.
3. 运行应用程序的逻辑与 Taira 相比,直到故障无聊和可观察.
4. 创建一个单独的 Minamoto 签名者，用真实 XOR 为其提供资金，并且只将同样经过验证的操作迁移到主网。

## 继续使用操作指南 {#continue-with-the-cookbook}

使用此指南来选择网络,配置签名器和资金费用.然后继续使用与您想要构建的应用程序行为相匹配的操作指南:

|目标|操作指南|
| --- | --- |
|检查 Taira 和配置一个客户端 | [连接到 Taira](/zh-hans/cookbook/connect-to-taira.md)|
|发送一个第一次写下来,验证结果| [提交和验证交易](/zh-hans/cookbook/submit-and-verify-transactions.md) |
|注册、铸造和转移价值| [性资产](/zh-hans/cookbook/fungible-assets.md) |
|阅读过的申请状态| [查询账本状态](/zh-hans/cookbook/query-ledger-state.md) |
|应对提交的变化反应| [流动事件](/zh-hans/cookbook/stream-events.md) |

书籍将每个工作流程集中,并在需要 Taira 资金或 SORA Nexus 网络环境时链接到此处.

## 1. 了解你设定的目标 {#_1-understand-what-you-are-setting-up}

在 SORA Nexus 中，数据空间目录定义数据空间。执行通道目录则单独定义执行通道：每个执行通道引用一个数据空间，而一个数据空间可以包含多个执行通道。仅修改 `client.toml` 并不会创建新的公开数据空间。客户端配置执行两项工作：

1. 向客户指向右端点 Torii
2. 为其规范账户选择网络上下文和签名密钥

`AccountId` 始终是规范且不含域的标识，`client.toml` 也没有域设置：`[account].profile` 仅选择网络的 I105 前缀。域上下文属于别名及域拥有的对象。大多数应用应从公开的 `universal` 数据空间开始。域上下文采用 `domain.dataspace` 形式，例如：

```text
wonderland.universal
```

若需要新的组织数据空间，应准备目录和路由提案，而非尝试通过普通客户端账户注册。请参阅下文[配置新的数据空间](#_8-provision-a-new-data-space)。

## 2. 检查公众 Torii 端点 {#_2-check-the-public-torii-endpoint}

使用 `curl` 和 `jq` 检查 Taira 测试网的状态。这项检查无需密钥或本地节点。

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

检查节点提供的数据空间与执行通道视图：

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

使用 Minamoto 前，请向运营方确认主网服务端点，并验证 TLS 证书与主机名匹配。

## Taira MCP 用于代理人 {#taira-mcp-for-agents}

Taira 还为代理运行时公开了一个 Torii 原生的模型上下文协议（MCP）桥。当代理需要实时 testnet 读取、脚本化诊断或经过严格审查的写入演练，而又不想先构建自定义 Torii 客户端时，请使用它。

|设置|价值|
| --- | --- |
|MCP 端点 |`https://taira.sora.org/v1/mcp`|
|网络根|`https://taira.sora.org`|
|预期使用|Taira 测试网读取和水龙头资助的写入演练.|
|产量等价| 不要将此条目指向 Minamoto 除了主网外 MCP 端点和释放控制明确批准 |

该桥接接口仅接受无状态的 JSON-RPC `POST` 请求。添加签名材料之前，请先检查其发现元数据：

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'MCP-Protocol-Version: 2026-07-28' \
  -H 'Mcp-Method: server/discover' \
  -d '{"jsonrpc":"2.0","id":1,"method":"server/discover","params":{"_meta":{"io.modelcontextprotocol/protocolVersion":"2026-07-28","io.modelcontextprotocol/clientCapabilities":{}}}}' \
  | jq '{versions: .result.supportedVersions, server: .result._meta["io.modelcontextprotocol/serverInfo"].name, toolset: .result.capabilities.extensions["org.hyperledger.iroha/tools"].toolsetVersion}'
```

在代理运行时中，将该 URL 配置为用户本地 MCP 服务器。不要把代理 MCP 配置、API 令牌、转发的身份验证标头、`authority` 或 `private_key` 值提交到此文档仓库或应用仓库。

代理提示规则与 Taira 工作良好:

- 在调用之前,从 MCP 服务器中发现工具;如果服务器报告 `listChanged`,重新发现.
- 宁愿选用 `iroha.*`工具,而不是原始的 `torii.*`.
- 开始仅阅读:在提出笔记之前检查状态,账户,资产,号,区块,治理状态和交易状态.
- 在实时测试网络突变之前,需要明确的人类指示.对于预先签署的交易封装,请使用 `iroha.transactions.submit_and_wait`,以便代理只等待结果而不是仅提交.
- 在代理响应中总结交易哈希,最终状态和服务器验证错误.

### 开发工作流程与代理人 {#development-workflow-with-agents}

使用代理作为 Iroha 客户端,交易构建者,诊断脚本和测试网运行簿的开发助手.它可以检查代码,读取 Taira 状态,提出更改和运行本地测试, 但它不应该转变一个活跃的网络直到人类批准准确的操作.

实际的工作流程是:

1. 在编写代码之前,请代理检查相关的文件, SDK 代码, CLI 命令或 MCP 工具计划.
2. 让代理先写出最小的客户端路径:状态检查,账户搜索,号分辨率或余额搜索.
3. 只有在仅阅读通话对 Taira 工作后,只添加交易构建代码.
4. 保持现实网络测试的选择,例如在 `TAIRA_LIVE=1` 后面,以便正常的单元测试运行从来不花费测试网资金或取决于网络可用性.
5. 要求经纪人在提交任何交易之前报告网络根,链,授权主体账户,说明总结,费用资产和预期状态变化.
6. 在将生成的代码推广到 CI 或主网工作流之前，请审查其秘密处理、重试行为、幂等性和拒绝处理。

只有阅读的有用 MCP 开发工具包括账户资产查找,别名解析,区块查询,交易查找,交易列表,在提交任何签署的有效载荷之前,使用这些来建立信心.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### 经过代理人的交易工作流程 {#transaction-workflow-through-agents}

MCP 桥梁可以提交签署的 Iroha 交易,但它不删除正常的交易要求. 交易仍然需要正确的授权主体,许可证,费用资金,链 ID,元数据和签名.

对于原始 Iroha 交易,先用 SDK 或 CLI 编写和签署交易封装,然后只向代理提供规范的文件.签署的交易字节编码为 `body_base64`.代理人可以用 `iroha.transactions.submit_and_wait`提交封装,或用 `iroha.transactions.submit`提交轮询和 `iroha.transactions.wait`提交轮询.

不要将私钥粘贴到代理提示中. 如果一个代理需要构建交易,请把它指向加载用户运行时的秘密的地方代码.经纪人永远不应该将密钥材料写入Markdown、测试数据、日志或 commit.

在提交交易之前,请让代理人编写一个简短的交易计划:

- `network`:Taira 测试网根和链 ID
- `authority`:签署和支付费用的账户
- `instructions`：注册、铸造、销毁、转移,元数据,许可或合同调用总结
- `fee asset`:将对 Taira 征收资产
- `preflight reads`:已进行的账户,资产余额,许可证,代名或区块检查
- `expected result`:确认后应该可见的状态
- `idempotency`：重试相同请求时会发生什么？

提交后,让代理等待终端状态,然后通过读取查询验证状态变化.有用的完成报告包括:

- 交易哈希
- 终端状态如 `Committed`, `Applied`, `Rejected`或`Expired`
- 在可用时,区块或探险器细节
- 验证阅读结果
- 拒绝消息和失败是否像许可证,费用,验证,陈旧状态或终端可用性.

举个例子:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

当已准备签署的封装时:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

处理 Taira MCP 作为公共测试网控制表面. Taira 键,测试网 XOR,水龙头账户和 canary 签名者是可一次性使用的,必须与 Minamoto 钥匙和生产释放工作流程保持分离.

## 你现在可以试玩具的例子 {#toy-examples-you-can-try-now}

以下示例仅读取 Taira 的数据，无需账户密钥。

列出 Taira 提供的公开数据空间执行通道：

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | select(.visibility == "public")
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

为仪表板,机器人或部署检查建立一个小的 Node.js 状态探测器:

```bash
node --input-type=module <<'EOF'
const response = await fetch('https://taira.sora.org/status', {
  headers: { Accept: 'application/json' },
});
if (!response.ok) throw new Error(`Taira HTTP ${response.status}`);
const status = await response.json();
const publicLanes = status.teu_lane_commit
  .filter((lane) => lane.visibility === 'public')
  .map((lane) => `${lane.alias}@${lane.dataspace_alias}:${lane.block_height}`)
  .join(', ');
console.log(`Taira: ${status.blocks} blocks, ${status.queue_size} queued, public lanes ${publicLanes}`);
EOF
```

首个写入侧练习应该是 Taira 水龙头索赔.它使用测试网 XOR,并且永远不应指向 Minamoto.

## 3. 创建一个 Taira 客户端配置. {#_3-create-a-taira-client-config}

如果您还没有一个键组,生成键组:

```bash
kagami keys --algorithm ed25519 --out-dir ./taira-client-key
```

创建 `taira.client.toml`:

```toml
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
# The exact `network_id` from https://taira.sora.org/v1/accounts/capabilities
network_id = "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774"
torii_url = "https://taira.sora.org/"

[account]
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

顶层的 `chain` 是准确的 Taira 交易链 ID，`network_id` 是每个签名所绑定的准确网络身份。必须且只能配置 `network_id` 或 `network_id_file` 中的一项。`[account].profile = "taira"` 独立选择 Taira I105 链判别值。链 ID 不负责选择账户配置。

执行仅阅读的检查:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

在写入测试之前,执行公开的 Taira 诊断:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

执行付费写入之前，请通过水龙头为 Taira 账户提供资金。带有准备步骤的水龙头流程见[在 Taira 获取测试网 XOR](#_4-get-testnet-xor-on-taira)。

账户获得资金后，可选用签名日志指令进行写入冒烟测试。每笔提交的交易都会明确指定费用支付方，CLI 会在签名前给出准确的费用报价：

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  tx ping --msg "taira smoke test"
```

该命令会等待确认。Taira 是公开测试网，因此即使水龙头本身工作正常，队列饱和也可能导致 ping 失败。若 `taira doctor` 报告队列饱和，或 ping 返回 `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`，请先等待并重试，再判断是否存在客户端配置错误。

无人值守的冒烟测试应将 ping 放入有界重试循环中：

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml --fee-payer authority \
    tx ping --msg "taira smoke test" && ok=true && break

  sleep 60
done

test "$ok" = true
```

如果 `iroha taira doctor` 显示出严重失败,停止重新试验.排队和收费拒绝是公共测试网络的过渡条件;DNS, TLS 或 `status = "fail"`诊断不是.

## 创建一个 SORA Nexus 帐户 ID {#generate-a-sora-nexus-account-id}

SORA Nexus 账户 ID 是根据账户公钥和目标网络前缀派生的规范 I105 地址。同一公钥在 Taira 和 Minamoto 上会编码为不同的 ID；生产用户应为 Minamoto 生成独立的密钥对。

创建或加载将控制帐户的Ed25519键组:

```bash
kagami keys --algorithm ed25519 --out-dir ./nexus-account-key
```

转换公钥为 Taira 账户 ID:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

转换一个 Minamoto 公共密钥,使用主网前:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

凡 SORA Nexus API 或 CLI 命令要求规范账户 ID 的地方，都应使用生成的账户 ID，例如余额查询、严格账户字段或别名绑定。将对应私钥保存在客户端配置中，并使用 `[account].profile = "taira"` 或 `[account].profile = "minamoto"` 选择同一个公开网络。

生成 ID 本身并不能创建一个资助的连锁账户.在 Taira 上,水龙头可以创建和资助测试网写帐户.在 Minamoto 上,使用已批准的主网安装或财政流程.

### 关键存储和备份 {#key-storage-and-backup}

账户 ID 和公钥可以共享.相匹配的私钥,密码短语,种子和恢复材料必须被保密.

在 SORA Nexus 账户中使用这些实践:

- 存储私钥在加密密码管理器,硬件支持的关键存储器或专用签字服务中.不要将密钥交给源控制,也不要把生产密钥留在 Shell 历史记录,日志,聊天,门票或未加密备份中.
- 使用每个保险柜或生产签名器的独特高密码. 存储密码在密码管理器或分类保管过程中,而不是与加密私钥相同的文件或备份捆绑中.
- 保持 Taira 和 Minamoto 的密钥分开,把 Taira 的密钥作为一次性测试网材料和 Minamoto 的密钥当作生产资金授权主体.
- 备份私钥,公钥,帐户 ID,账户配置文件以及任何需要恢复签署者的帐户恢复或存储记录.在恢复过程中很容易滥用没有网络文本的私钥.
- 保持至少一个加密的离线备份和一个地理位置分开的加密备份,用于生产签名器.在依赖备份之前测试恢复,只需进行小型读取操作.
- 如果私钥,密码短语,备份媒体或签名主机可能被曝光,请旋转或更换签名器.

详细见 [存储密码密钥](/zh-hans/guide/security/storing-cryptographic-keys.md)和 [密码安全](/zh-hans/guide/security/password-security.md).

## 4. 获取测试网 XOR 在 Taira {#_4-get-testnet-xor-on-taira}

通过 CLI 带有准备步骤的水龙头流程领取测试网 XOR。水龙头为 `taira.client.toml` 中配置的账户提供资金；若账户尚不存在，会先注册账户。流程如下：

1. 读取公开的水龙头策略：水龙头授权主体、费用资产及金额。
2. 准备领取申请。CLI 求解工作量证明，核验 Torii 准备并签名的准确交易，然后将其保存在私有日志目录中，暂不提交。
3. 将保存的交易提交一次。
4. 等待资产余额可见后，再发送付费写入。

读取策略：

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
  -H 'Accept: application/json' \
  | tee ./taira-faucet-policy.json \
  | jq .
```

答案是这样的:

```json
{
  "schema_version": 1,
  "network_id": "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774",
  "network_prefix": 369,
  "authority": "<TAIRA_FAUCET_AUTHORITY_I105>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "amount": "25000"
}
```

该策略是未签名的发现数据。自动化流程应固定预期的授权主体、资产定义及金额，而非信任每次响应。若准备好的交易与所传入的值不同，`prepare` 会拒绝该交易。

准备并提交领取申请：

```bash
export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' ./taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' ./taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' ./taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` 以私有访问权限创建日志目录，并拒绝替换已有目录，因此每次领取都应使用新目录。水龙头是公开测试网服务。若 `submit` 报告 `Pending`、超时或收到 `502`，请使用同一配置和日志运行 `taira account faucet resume`，不要重新准备另一笔领取申请。过期的工作量证明锚点会使 `prepare` 失败；此时应在新日志目录中重新准备。

然后在提交您自己的付费交易之前,查询资产:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

若领取已生效但资产尚不可见，请等待并重试读取，再发送写入。

水龙头仅适用于 Taira 测试网资金.在 Minamoto 流动中,不要使用测试网 XOR,水龙头账户或 Taira canary 签名者.

## 5. 创建一个 Minamoto 客户端配置. {#_5-create-a-minamoto-client-config}

使用 Minamoto 前，请向运营方确认主网服务端点，并验证 TLS 证书与主机名匹配。

使用 Minamoto 单独的键组.不要重复使用 Taira 关键在主网上.

创建 `minamoto.client.toml`:

```toml
chain = "00000000-0000-0000-0000-000000000753"
# The exact `network_id` from https://minamoto.sora.org/v1/accounts/capabilities
network_id = "<MINAMOTO_NETWORK_ID>"
torii_url = "https://minamoto.sora.org/"

[account]
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

顶层的 `chain` 是当前 SORA Nexus 主网链 ID，`network_id` 是 Minamoto 的准确网络身份；首次签名操作之前，应从能力路由读取该值。`[account].profile = "minamoto"` 选择 Minamoto I105 链判别值；端点主机名和链 ID 不会隐式选择它。

将 Minamoto 公共密钥转换为其规范的 I105 账户 ID,并附上主网前:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

在账户通过主网上登录或管理流程提供储备和资金之前,仅进行阅读侧检查:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

不要针对 Minamoto 运行 Taira 水龙头或冒烟测试命令。

## 6. 在 XOR 中资助 Minamoto 账户. {#_6-fund-a-minamoto-account-with-xor}

Minamoto 费用由生产 XOR 支付,而 Minamoto 没有公共水龙头.通过批准的主网登录或财政转账来资助配置的帐户,或者从现有资助的 Minamoto 账户中获得 XOR.

在提交笔记之前,请检查规范账户 ID 和资金使用仅阅读检查. 作为生产资金,将 Minamoto XOR 视为生产资金:先在 Taira 上练习同样的操作,保留单独的生产密钥,不要假设可以重置主网交易.

Taira XOR 不能支付 Minamoto 费用.测试网余额和水龙头索赔不会转移到 Minamoto.

## 7. 在现有数据空间中工作 {#_7-work-inside-an-existing-data-space}

对数据空间内的账本对象使用完全限定域名。例如，公开数据空间中的项目域应采用：

```text
apps.universal
```

在您的帐户获得所需权限后,为域名创建一个无秘密的 `AliasSetupPlanRequestV1` 意图,并使用声明计划器:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

对于 Minamoto,生成并批准单独的主网意图和计划.计划与其链,授权主体,现实状态和截止日期有关,因此不能推广或重播 Taira 计划:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

账户别名使用相同的数据空间后缀：

```text
alice@apps.universal
alice@universal
```

严格账户字段仍然使用规范 I105 帐户 IDs.将别名视为可以读取的人类的绑定,并解决规范账户 IDs.

## 8. 配置新的数据空间 {#_8-provision-a-new-data-space}

新增数据空间需要运维和治理变更。公开 Torii 端点可将流量路由至已配置的数据空间，但会拒绝未知的数据空间别名。

在准备更改之前,捕捉当前的现场目录:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

对于运营商账户,请检查通道表姿势:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

执行通道 ID、数据空间 ID、验证者集合、容错能力、清单、路由规则及运维负责人必须一同经过审查，之后才能推广新别名。具有所需权限的普通用户账户可通过别名规划器，在现有数据空间中取得域及其 SNS 租约；它不能安全地添加新的公开数据空间。

对于私有或组织数据空间，应准备包含下列内容的目录变更：

- 唯一的数据空间别名及数值 `id`
- 一个相匹配的通道入口或现有通道分配
- 数据空间的 `fault_tolerance`
- 路由指令或帐户范围的规则,应在此登陆
- 若数据空间提供 UAID 能力，还需提供空间目录清单或等效的部署证据
- 对验证器,合规性,结算和监测政策的治理批准

一个可查看的配置片段是这样的:

```toml
[[nexus.lane_catalog]]
index = 5
alias = "payments"
description = "Payments lane"
dataspace = "payments"
visibility = "public"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "payments"
id = 20
description = "Payments dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "payments"
[nexus.routing_policy.rules.matcher]
instruction = "transfer::asset"
description = "Route asset transfers to the payments dataspace"
```

运营商的接受应包括以下门户:

- `iroha3d --sora --config <config.toml> --trace-config` 传输已解决的节点配置
- 生成或检查的清单是用哈希和签名存档的
- 在任何 Minamoto 促销之前,冒烟测试通过 Taira
- 变更后的 `/status` 目录显示预期的执行通道和数据空间
- `iroha app nexus lane-report --summary` 没有报告缺失所需的清单

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

仅在 Taira 部署、冒烟测试、监控及治理证据均完成后，才将相同的数据空间推广至 Minamoto。

## 相关页面 {#related-pages}

- [安装 Iroha 3](/zh-hans/get-started/install-iroha.md)
- [通过 CLI](/zh-hans/get-started/operate-iroha-via-cli.md)运行 Iroha 3
- [为私有数据空间赞助费用](/zh-hans/get-started/private-dataspace-fee-sponsor.md)
- [Torii 端点](/zh-hans/reference/torii-endpoints.md)
- [创世记引用](/zh-hans/reference/genesis.md)
