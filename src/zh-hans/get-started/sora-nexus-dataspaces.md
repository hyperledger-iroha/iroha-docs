---
translation_locale: zh-hans
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: f766c604b0220fc03cacd7c0b9cbb5f94f415c5ec61eba89de7a5e310a1dfe79
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 建立在 SORA 3:Taira 和 Minamoto 上 {#build-on-sora-3-taira-and-minamoto}

SORA 3是基于 Iroha 3 和 SORA Nexus 构建的应用面向公众部署轨道. 首先在 Taira 上构建和练习,然后将相同的客户端形状移动到 Minamoto,只有当您有单独的主网钥匙时,费用为真实 XOR 和生产批准.

这本教程展示了如何配置一个 Iroha 客户端为公共的 SORA 3个网络:

- Taira 测试网在 `https://taira.sora.org`
- Minamoto 主网在 `https://minamoto.sora.org`

使用 Taira 进行集成测试、由水龙头资助的写入 canary 测试和部署演练.只使用 Minamoto 用于生产准备的主网活动.两个网络都在 XOR 收取费用:

- Taira 使用公共水龙头的测试网 XOR.
- Minamoto 使用真实的 XOR.没有 Minamoto 水龙头.

## 建设者之路 {#builder-path}

|步骤|Taira 测试网|Minamoto 主要网|
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|开始阅读网络状态|查询 `/status` 没有钥匙|查询 `/status` 没有钥匙|
|选择一个数据空间|使用公开 `universal` 除非您的应用程序需要一个受监管的路径|仅在主网批准后使用相同的数据空间|
|获得费用资产.|使用公众的 Taira 水龙头|从资助的 Minamoto 账户或经批准的财政流通中获得 XOR|
|测试写入|使用水龙头资助的测试 XOR |不要使用测试工具; 写入会消耗真实 XOR |
|促进|继续尝试逻辑,监测和签名处理|使用单独的钥匙,资金和释放控制|

实际流程是:

1. 建立客户端与 Taira 相反,并使用公开的 `universal`数据空间.
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

在 SORA Nexus 中,一个数据空间是网络通道和路由目录的一部分.客户端不仅仅通过更改`client.toml`来创建新的公共数据空间. 客户端设置可以做两件事:

1. 向客户指向右端点 Torii
2. 选择域名和数据空间路由文本为其规范帐户

`AccountId`始终是规范的,无域名. `client.toml`中的`[account].domain`值提供了路由和称语境;它不会成为帐户身份的一部分.对于大多数应用程序来说,从公开的 `universal`数据空间开始.域名文本使用`domain.dataspace`形式,例如:

```text
wonderland.universal
```

如果您需要一个新的组织数据空间,请编制一份目录和路由建议,而不是试图从普通客户端帐户注册. 查看下面[提供新数据空间](#_8-provision-a-new-dataspace).

## 2. 检查公众 Torii 端点 {#_2-check-the-public-torii-endpoint}

在配置签名器之前,请检查目标终端直播.

对于 Taira:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

对于 Minamoto:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

检查节点暴露的数据空间和路径视图:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

使用 `https://minamoto.sora.org/status` 的相同命令用于主网.

## Taira MCP 用于代理人 {#taira-mcp-for-agents}

Taira 还为代理运行时公开了一个 Torii 原生的模型上下文协议（MCP）桥。当代理需要实时 testnet 读取、脚本化诊断或经过严格审查的写入演练，而又不想先构建自定义 Torii 客户端时，请使用它。

|设置|价值|
| --- | --- |
|MCP 端点 |`https://taira.sora.org/v1/mcp`|
|网络根|`https://taira.sora.org`|
|预期使用|Taira 测试网读取和水龙头资助的写入演练.|
|产量等价| 不要将此条目指向 Minamoto 除了主网外 MCP 端点和释放控制明确批准 |

在添加签字材料之前,检查桥梁的元数据:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
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

这些示例只能阅读,除非注明.它们在你生成密钥之前工作,并且可以安全地对付两个公共网络.

比较 Taira 测试网和 Minamoto 主网的健康:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    -H 'Accept: application/json' \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

列出 Taira 所曝光的公共数据空间路径:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

当您需要主网视图时,运行同样的命令对 Minamoto:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

为仪表板,机器人或部署检查建立一个小的 Node.js 状态探测器:

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`, {
    headers: { Accept: 'application/json' },
  }).then((res) => res.json());
  const publicSpaces = status.teu_lane_commit
    .filter((lane) => lane.visibility === 'public')
    .map((lane) => `${lane.dataspace_alias}:${lane.block_height}`)
    .join(', ');

  console.log(
    `${name}: ${status.blocks} blocks, ${status.queue_size} queued, public spaces ${publicSpaces}`,
  );
}
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
torii_url = "https://taira.sora.org/"

[account]
domain = "wonderland.universal"
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

顶级层次 `chain` 是确切的 Taira 交易链 ID. 其他 `[account].profile = "taira"` 设置独立选择 Taira I105 连锁区分剂. ID 没有选择帐户配置文件.

执行仅阅读的检查:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

在写入测试之前,执行公开的 Taira 诊断:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

在运行费用笔记之前,通过水龙头来资助 Taira 账户.直接的水龙头流程是在 [Get Testnet XOR 上 Taira](#_4-get-testnet-xor-on-taira).

在接收水龙头索赔和资助账户之后, Taira canary 测试是可选的冒烟测试:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

金丝雀测试会提交已签名的 ping、等待确认，并在提供 `--write-config` 时写入运行时签名者配置。Taira 是公共测试网，因此即使水龙头本身正常，队列饱和也可能导致已签名的 ping 失败。如果 `taira doctor` 报告队列饱和，或金丝雀测试返回 `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`，请先等待并重试，再将其视为客户端配置错误。

对于无监督冒烟测试,将 canary 放入有界重试循环中:

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml taira write-canary \
    --public-root https://taira.sora.org \
    --write-config ./taira.canary.client.toml \
    --json && ok=true && break

  sleep 60
done

test "$ok" = true
```

如果 `iroha taira doctor` 显示出严重失败,停止重新试验.排队和收费拒绝是公共测试网络的过渡条件;DNS, TLS 或 `status = "fail"`诊断不是.

## 创建一个 SORA Nexus 帐户 ID {#generate-a-sora-nexus-account-id}

SORA Nexus 账户 ID 是一个源于帐户公钥和目标网络前的规范 I105 地址,而不是客户端 TOML 中的`[account].domain`值.同样的公共密钥在 Taira 和 Minamoto 上对不同的 IDs 进行编码,生产用户应该为 Minamoto 生成单独的密钥组.

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

在 Nexus API 或 CLI 命令要求一个规范帐户 ID 的情况下,使用结果的账号 ID 例如 Taira 水龙头 `account_id`,在您的客户端配置中保存匹配的私钥,并选择相同的公共网络以 `[account].profile = "taira"`或 `[account].profile = "minamoto"`.

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

直接使用公共水龙头,流量是:

1. 创建或加载签字符,并计算其规范账户 Taira ID.
2. 带来当前的水龙头拼图.
3. 如果 `difficulty_bits` 超过 `0` 则解决题.
4. 提交水龙头申请.
5. 在发送付费写入操作之前,等到账户或资产余额显现.

将公钥转换到 Taira I105 账户 ID 中,该水龙头预期:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

拿来这个题:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle \
  -H 'Accept: application/json' \
  | jq .
```

水龙头是公共测试网服务。如果谜题或领取端点返回 `502`、超时或其他网关级错误，请先等待并重试，再更改密钥或客户端配置。

答案是这样的:

```json
{
  "algorithm": "scrypt-leading-zero-bits-v1",
  "difficulty_bits": 8,
  "anchor_height": 741,
  "anchor_block_hash_hex": "05d2...",
  "challenge_salt_hex": null,
  "scrypt_log_n": 13,
  "scrypt_r": 8,
  "scrypt_p": 1,
  "max_anchor_age_blocks": 6
}
```

当 `difficulty_bits`为 `0`时,只提交 ID 的账户:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}' \
  | tee ./taira-faucet-response.json \
  | jq .
```

当 `difficulty_bits` 超过 `0`时,解答题并包括杆高度加上nonce:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }' \
  | tee ./taira-faucet-response.json \
  | jq .
```

题算法是:

1. 构建挑战为 SHA-256:
   - `iroha:accounts:faucet:pow:v2`的字节
   - UTF-8 的账户 ID
   - `anchor_height`作为一个大子 `u64`
   - `anchor_block_hash_hex`被解码为字节
   - `challenge_salt_hex`在存在时被解码为字节
2. 试用 `u64` nonce编码为大数值8字节.
3. 对于每一个nonce,运行脚本:
   - 密码：8 字节 nonce
   - 盐:32字节的挑战
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - 输出长度: 32 字节
4. 获胜的 nonce是第一个以至少 `difficulty_bits`为首的零位的摘要.

管道响应包括资产资金和排列交易哈希:

```json
{
  "account_id": "<TAIRA_I105_ACCOUNT_ID>",
  "asset_definition_id": "<TAIRA_FEE_ASSET_DEFINITION_ID>",
  "asset_id": "...",
  "amount": "<FUNDED_AMOUNT>",
  "tx_hash_hex": "...",
  "status": "QUEUED"
}
```

答案目前以 HTTP `202 Accepted`返回.其 `asset_definition_id`是由公共水龙头资助的当前 Taira 费用资产;从答案中取出,而不是复制一个例子 ID.该水龙头在返回`tx_hash_hex`和 `status: "QUEUED"`时已经接受了请求.

然后在提交您自己的付费交易之前,查询资产:

```bash
TAIRA_FEE_ASSET_DEFINITION=$(
  jq -er '.asset_definition_id' ./taira-faucet-response.json
)

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET_DEFINITION" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

如果头索赔被接受,但账户或资产尚未可见,交易仍在公共测试网队列处理后. 在发送写入操作之前等待再尝试阅读.

对于准备运行的直接检查 API,将此存储为 `taira_faucet_claim.py`并通过 Taira I105 帐户 ID:

```python
#!/usr/bin/env python3
import hashlib
import json
import sys
import urllib.request


def has_leading_zero_bits(digest: bytes, bits: int) -> bool:
    full, rem = divmod(bits, 8)
    if digest[:full] != b"\0" * full:
        return False
    return rem == 0 or digest[full] >> (8 - rem) == 0


root = "https://taira.sora.org"
account_id = sys.argv[1]

puzzle_request = urllib.request.Request(
    f"{root}/v1/accounts/faucet/puzzle",
    headers={"Accept": "application/json"},
)

with urllib.request.urlopen(puzzle_request) as res:
    puzzle = json.load(res)

claim = {"account_id": account_id}
difficulty = int(puzzle["difficulty_bits"])

if difficulty > 0:
    challenge = hashlib.sha256()
    challenge.update(b"iroha:accounts:faucet:pow:v2")
    challenge.update(account_id.encode())
    challenge.update(int(puzzle["anchor_height"]).to_bytes(8, "big"))
    challenge.update(bytes.fromhex(puzzle["anchor_block_hash_hex"]))
    if puzzle.get("challenge_salt_hex"):
        challenge.update(bytes.fromhex(puzzle["challenge_salt_hex"]))

    n = 1 << int(puzzle["scrypt_log_n"])
    r = int(puzzle["scrypt_r"])
    p = int(puzzle["scrypt_p"])
    salt = challenge.digest()

    for nonce in range(1_000_000):
        nonce_bytes = nonce.to_bytes(8, "big")
        digest = hashlib.scrypt(nonce_bytes, salt=salt, n=n, r=r, p=p, dklen=32)
        if has_leading_zero_bits(digest, difficulty):
            claim["pow_anchor_height"] = puzzle["anchor_height"]
            claim["pow_nonce_hex"] = nonce_bytes.hex()
            break
    else:
        raise SystemExit("faucet nonce not found")

request = urllib.request.Request(
    f"{root}/v1/accounts/faucet",
    data=json.dumps(claim).encode(),
    headers={"Accept": "application/json", "content-type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as res:
    print(json.dumps(json.load(res), indent=2))
```

水龙头仅适用于 Taira 测试网资金.在 Minamoto 流动中,不要使用测试网 XOR,水龙头账户或 Taira canary 签名者.

## 5. 创建一个 Minamoto 客户端配置. {#_5-create-a-minamoto-client-config}

使用 Minamoto 单独的键组.不要重复使用 Taira 关键在主网上.

创建 `minamoto.client.toml`:

```toml
chain = "00000000-0000-0000-0000-000000000753"
torii_url = "https://minamoto.sora.org/"

[account]
domain = "wonderland.universal"
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

顶级层次 `chain` 是电流 Nexus 主网链 ID. `[account].profile = "minamoto"` 选择了 Minamoto I105 链区分器;端点主机名称和链 ID 不要隐含地选择它.

将 Minamoto 公共密钥转换为其规范的 I105 账户 ID,并附上主网前:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

在账户通过主网上登录或管理流程提供储备和资金之前,仅进行阅读侧检查:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

切勿针对 Minamoto 运行 Taira 水龙头或 write-canary 辅助工具.

## 6. 在 XOR 中资助 Minamoto 账户. {#_6-fund-a-minamoto-account-with-xor}

Minamoto 费用由生产 XOR 支付,而 Minamoto 没有公共水龙头.通过批准的主网登录或财政转账来资助配置的帐户,或者从现有资助的 Minamoto 账户中获得 XOR.

在提交笔记之前,请检查规范账户 ID 和资金使用仅阅读检查. 作为生产资金,将 Minamoto XOR 视为生产资金:先在 Taira 上练习同样的操作,保留单独的生产密钥,不要假设可以重置主网交易.

Taira XOR 不能支付 Minamoto 费用.测试网余额和水龙头索赔不会转移到 Minamoto.

## 7. 在现有的数据空间内工作 {#_7-work-inside-an-existing-dataspace}

使用在数据空间内居住的账本对象的完全合格域名.例如,公共数据空间中的项目域名应该使用:

```text
apps.universal
```

在您的帐户获得所需权限后,为域名创建一个无秘密的 `AliasSetupPlanRequestV1` 意图,并使用声明计划器:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

对于 Minamoto,生成并批准单独的主网意图和计划.计划与其链,授权主体,现实状态和截止日期有关,因此不能推广或重播 Taira 计划:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

帐户号使用相同的数据空间后音:

```text
alice@apps.universal
alice@universal
```

严格账户字段仍然使用规范 I105 帐户 IDs.将别名视为可以读取的人类的绑定,并解决规范账户 IDs.

## 8. 提供新的数据空间 {#_8-provision-a-new-dataspace}

一个新的数据区是一个运营商和治理变化.公众 Torii 端点可以将流量导向配置的数据区,但它会拒绝未知的数据区别别名.

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

除非通道 ID,数据空间 ID,验证器设置,故障耐受性,清单,路由规则和运营所有者一起经过审查,否则不得推广新的号.一个正常的用户帐户,具有所需权限,可以通过代号规划器在现有数据空间内获得域名和其 SNS 租;它不能安全地添加新的公共数据空间.

对于私人或组织数据空间,编制一项目录变更,包括:

- 唯一的数据空间别名和数字 `id`
- 一个相匹配的通道入口或现有通道分配
- 数据空间 `fault_tolerance`
- 路由指令或帐户范围的规则,应在此登陆
- 空间目录表或相等的部署证据,当数据区暴露 UAID 功能时
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
account_prefix = "payments."
description = "Route payments domains to the payments dataspace"
```

运营商的接受应包括以下门户:

- `iroha3d --sora --config <config.toml> --trace-config` 传输已解决的节点配置
- 生成或检查的清单是用哈希和签名存档的
- 在任何 Minamoto 促销之前,冒烟测试通过 Taira
- 变更后的目录 `/status` 表示预期的通道和数据空间
- `iroha app nexus lane-report --summary` 没有报告缺失所需的清单

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

只有在 Taira 部署,冒烟测试,监控和治理证据完成后才能将相同的数据空间推广到 Minamoto.

## 相关页面 {#related-pages}

- [安装 Iroha 3](/zh-hans/get-started/install-iroha.md)
- [通过 CLI](/zh-hans/get-started/operate-iroha-via-cli.md)运行 Iroha 3
- [对私人数据空间的赞助费用](/zh-hans/get-started/private-dataspace-fee-sponsor.md)
- [Torii 端点](/zh-hans/reference/torii-endpoints.md)
- [创世记引用](/zh-hans/reference/genesis.md)
