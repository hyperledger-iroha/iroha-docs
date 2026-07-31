---
translation_locale: zh-hans
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 63c317ab61ba912176c43c83d5b4f026f23a7a6e5fb633872a133c9ea1295686
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 继续下去 SORA 3: Taira 并且 Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3是基于应用程序的公共部署轨道 Iroha 3 并且 SORA
Nexus. 建立和练习 Taira 首先,然后移动相同的客户端形状
在 Minamoto 只有当你有单独的主网钥匙时,真实 XOR 对于费用,
和生产批准.

这本教程展示了如何配置一个 Iroha 客户公众 SORA 3
网络:

- Taira 测试网 `https://taira.sora.org`
- Minamoto 在 `https://minamoto.sora.org`

使用 Taira 对于集成测试,用水龙头资助的写字;
部署练习. Minamoto 仅适用于生产准备的主网
两个网络都收取费用 XOR:

- Taira 使用测试网 XOR 在公共水龙头.
- Minamoto 实际使用 XOR. 没有. Minamoto 一个水龙头.

## 建设者之路 {#builder-path}

| 步骤                        | Taira 测试网                                                | Minamoto 主要网                                   |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| 开始阅读网络状态 | 查询 `/status` 没有钥匙                                 | 查询 `/status` 没有钥匙                       |
| 选择一个数据空间            | 公共使用 `universal` 除非您的应用程序需要一个管理路径 | 仅在主网批准后使用相同的数据空间 |
| 获得费用资产               | 用公众 Taira 气管                                  | 接收 XOR 从资助的 Minamoto 账户或经批准的财政流动 |
| 测试写作                 | 使用水龙头资助的测试 XOR                                   | 不要使用测试工具;写字花费真实 XOR     |
| 促进                     | 继续尝试逻辑,监测和签名处理            | 使用单独的钥匙,资金和释放控制   |

实际流程是:

1. 构建客户对 Taira 并且使用公众 `universal` 数据空间.
2. 添加一个签字者,并通过 Taira 一个水龙头.
3. 运行应用程序的逻辑 Taira 直到失败变得无聊,
   它们是可观的.
4. 创建一个单独的 Minamoto 签署者,用真钱资助它 XOR, 只是移动
   保持相同的经过验证操作.

## 1. 了解你设定的目标 {#_1-understand-what-you-are-setting-up}

在 SORA Nexus, 数据空间是网络轨道和路由目录的一部分.
一个客户端不仅通过改变创建一个新的公共数据空间
`client.toml`. 客户端设置做了两件事:

1. 指向客户右边 Torii 终点
2. 选择域名和数据空间路由背景为其法规帐户

`AccountId` 总是可信且无域. `[account].domain` 在
`client.toml` 提供路由和别名语境;它不成为
对于大多数应用程序,从公众开始
`universal` 数据空间.域内文本使用 `domain.dataspace` 形式,
例如:

```text
wonderland.universal
```

如果您需要一个新的组织数据空间,请编制一份目录和路由
而不是试图从普通客户账户注册.
看看 [提供新的数据空间](#_8-provision-a-new-dataspace) 在下面.

## 2. 检查公众 Torii 终点 {#_2-check-the-public-torii-endpoint}

在配置签名器之前,请检查目标终点是否活跃.

对于 Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

对于 Minamoto:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

检查节点暴露的数据空间和行径视图:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

使用同一个命令 `https://minamoto.sora.org/status` 为了主网.

## Taira MCP 对于代理人 {#taira-mcp-for-agents}

Taira 也揭示了一个 Torii-本地模型文本议定书 (MCP) 的桥梁
用它当一个代理需要直播测试网阅读,脚本
检测,或严格审查的写作试验
Torii 首先是客户.

| 设置 | 价值 |
| --- | --- |
| MCP 终点 | `https://taira.sora.org/v1/mcp` |
| 网络根 | `https://taira.sora.org` |
| 预期使用 | Taira 测试网阅读和水所资助的写作练习 |
| 产量相当 | 不要将此条目指向 Minamoto 除了主网外 MCP 终点和释放控制明确批准 |

在添加签字材料之前,检查桥梁元数据:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

设置 URL 作为用户本地 MCP 在代理运行时间.
承诺代理人 MCP 配置, API 代币,转发的作者标题, `authority`, 或
`private_key` 在此文档 repo 或应用程序 repo 中的值.

代理提示规则,与 Taira:

- 发现来自 MCP 在打电话给服务器之前;
  服务器报告 `listChanged`.
- 最好是选的 `iroha.*` 工具比原材料 `torii.*` 工具.
- 开始仅阅读:检查状态,账户,资产,姓氏,区块
  在提出书面之前, 管理状态和交易状态.
- 在实验网突变发生之前,需要明确的人类指令.
  预先签署的交易包裹,使用 `iroha.transactions.submit_and_wait`
  所以代理人等待结果,而不是只提交.
- 总结交易哈希,最终状态和服务器验证错误
  代理的反应.

### 与代理人合作的发展工作流程 {#development-workflow-with-agents}

用代理作为发展辅助者 Iroha 客户,交易构建者
检查脚本和测试网运行书籍.
它可以检查代码,阅读 Taira 州,提出变化,并进行本地测试,
但它不应该改变一个直播网络,直到人类批准了
运营.

实际工作流程是:

1. 要求代理检查相关的医生, SDK 代码, CLI 命令,或 MCP
   在编写代码之前的工具方案.
2. 让代理先写出最小的客户端路径:状态检查,帐户
   分析,分辨率或平衡检查.
3. 仅在只读取调用后添加交易构建代码
   Taira.
4. 保持现场网络测试的选择,例如在后面 `TAIRA_LIVE=1`, 所以一个
   通常的单元测试运行不会花费测试网资金或依赖网络
   提供可用性
5. 要求代理报告网络根,链,权威账户,
   在提交之前,指令总结,费用资产和预期状态变化
   任何交易.
6. 检查生成的密码处理,重新尝试行为,无能能力和
   在推广之前处理拒绝 CI 或持续的工作流程.

仅可阅读的有用 MCP 开发工具包括查看账户资产,
其他类型:
在提交任何文件之前,使用这些检查来建立信心.
签署的有效载荷.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### 通过代理人进行交易工作流程 {#transaction-workflow-through-agents}

其他 MCP 桥可以提交签名的文件 Iroha 交易,但它不删除
一个交易仍然需要正确的
权力,许可证,费用资金,链 ID, 标签和数据.

对于原料 Iroha 交易,构建和签署交易包裹
SDK 或 CLI 首先,然后只给代理人加拿大签署的交易
编码为 `body_base64`. 代理人可以提交封面
`iroha.transactions.submit_and_wait`, 或提交与
`iroha.transactions.submit` 和民意调查 `iroha.transactions.wait`.

如果一个代理需要建立一个
运行,将它指向本地代码,
环境,钥匙链,硬件签名器或无视测试网配置文件.
代理人永远不应该把关键材料写入Markdown,灯具,日志或
承诺.

在提交交易之前,让代理完成一个短暂的交易
计划:

- `network`: Taira 测试网根和链 ID
- `authority`: 签署和支付费用的账户
- `instructions`: 登记,清单,烧毁,转移,元数据,许可或
  合同调用总结
- `fee asset`: 收费的资产 Taira
- `preflight reads`: 账户,资产余额,许可证,别名或区块
  已经进行的检查
- `expected result`: 确认后应该看到的状态
- `idempotency`: 如果重新试验相同的请求,会发生什么?

在提交后,让代理人等待终端状态,然后验证
使用阅读查询的状态变化.有用的完成报告包括:

- 交易哈希
- 终端状态如 `Committed`, `Applied`, `Rejected`, 或 `Expired`
- 在可用时,区块或探险器细节
- 验证阅读结果
- 拒绝消息以及失败是否像许可证,费用,
  验证,陈旧状态或终点可用性

举个例子:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

当签署的包裹已经准备:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

治疗 Taira MCP 作为公共测试网控制表面. Taira 密钥,测试网 XOR,
卡纳里签名器是可处置的,必须与
Minamoto 关键和生产释放工作流程.

## 你现在可以试玩具的例子 {#toy-examples-you-can-try-now}

这些例子只能读取,除非你注意到.
它们可以安全地对抗两个公共网络.

相比较 Taira 测试网和 Minamoto 主营健康:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

列出公开数据空间路径 Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

运行同样的命令 Minamoto 当您需要主网视图时:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

建立一个小的 Node.js 仪表板,机器人或部署的状态探测器
检查:

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`).then((res) => res.json());
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

最早的写字玩具应该是 Taira 它使用测试网
XOR 也不应该指向 Minamoto.

## 3. 创建一个 Taira 客户端配置 {#_3-create-a-taira-client-config}

如果您还没有一个键组,请生成一个键组:

```bash
kagami keys --algorithm ed25519 --json
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

最高层次 `chain` 是确切的 Taira 交易链 ID. 其他
`[account].profile = "taira"` 设置独立选择 Taira I105
连锁区分剂. ID 没有选择账户配置文件.

执行仅阅读的检查:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

运行公众 Taira 在写作测试之前的诊断:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

资助 Taira 在你运行收费的书写之前,请通过水龙头进行帐户.
直接的水龙头流量在
[获取测试网 XOR 在 Taira](#_4-get-testnet-xor-on-taira).

在收取水龙头索赔和账户融资后, Taira
卡纳里是一种可选的写烟测试:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

鱼提交了签名的 ping,等待确认,
运行时间签名器配置 `--write-config` 提供. Taira 是一个公众
测试网,所以排列度可以使签署的ping失败即使在
水龙头本身就能工作. `taira doctor` 报告一个和排队或
鱼回报 `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, 等待,再试一次
作为客户端配置错误.

对于无监督烟雾测试,将鱼包装在一个有限的重试循环中:

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

停止再次尝试如果 `iroha taira doctor` 排列度
收费拒绝是公共测试网络的过渡条件; DNS,
TLS, 或 `status = "fail"` 诊断是不是.

## 产生一个 SORA Nexus 账户 ID {#generate-a-sora-nexus-account-id}

一个 SORA Nexus 账户 ID 是一个法典 I105 来自
账户公钥和目标网络前.
`[account].domain` 在客户端中的值 TOML. 同样的公共密钥编码为
不同 IDs 在 Taira 并且 Minamoto, 而生产用户应该产生
单独的键对 Minamoto.

生成或加载将控制账户的Ed25519键组:

```bash
kagami keys --algorithm ed25519 --json
```

将公钥转换为 Taira 账户 ID:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

转换一个 Minamoto 公共密钥,主要网前:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

使用结果的帐户 ID 任何一个 Nexus API 或 CLI 命令要求一个
圣经记载 ID, 例如: Taira 气管 `account_id`, 平衡
查询,严格的账户字段或别名绑定.
在客户端配置中,选择相同的公共网络
`[account].profile = "taira"` 或 `[account].profile = "minamoto"`.

产生 ID 没有自行创建资助的连锁账户.
Taira, 水龙头可以创建和资助测试网写的账户.
Minamoto, 使用已批准的主网上载或财政流.

### 关键存储和备份 {#key-storage-and-backup}

账户 ID 公共钥匙可以共享.
密码,种子和恢复材料必须被保密.

使用这些做法来 SORA Nexus 账户:

- 存储私钥在加密密码管理器,支持硬件
  密钥存储器或专用签字服务.
  控制或留在格历史,日志,聊天,门票中的生产密钥,
  或非加密备份.
- 用一个独特的高密码,
  存储密码在密码管理器或分类保管过程中,而不是
  与加密私钥相同的文件或备份捆绑.
- 保持 Taira 并且 Minamoto 关键分开. Taira 作为一次性使用的钥匙
  测试网材料和 Minamoto 作为生产资金机构的关键.
- 备份私钥,公钥,账户 ID, 账户配置文件,以及任何
  需要恢复签署者的账户回收或保密记录.
  在恢复过程中,没有网络环境的密钥很容易滥用.
- 保持至少一个加密的离线备份,
  测试恢复使用一个
  在取决于备份之前,只需要读取的小操作.
- 如果私钥,密码短语,备份媒体,
  或是签署主机可能暴露.

更多详细信息见
[存储加密钥](/zh-hans/guide/security/storing-cryptographic-keys.md)
并且 [密码安全](/zh-hans/guide/security/password-security.md).

## 4. 获取测试网 XOR 在 Taira {#_4-get-testnet-xor-on-taira}

直接使用公共水龙头.流量是:

1. 创建或加载一个签字符,并计算它的正规性 Taira 账户 ID.
2. 带来当前的水龙头拼图.
3. 解决这个难题,如果 `difficulty_bits` 是比 `0`.
4. 提交水龙头申请.
5. 在发送之前等到账户或资产余额变得可见
   付费的书写.

将公钥转换为 Taira I105 账户 ID 预计水龙头:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

带来这个题:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
```

水龙头是一个公共测试网服务.
返回 `502`, 一个时间过关,或另一种网关级别错误,等待再尝试
在更改密钥或客户端配置之前.

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

当 `difficulty_bits` 是 `0`, 仅提交账户 ID:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}'
```

当 `difficulty_bits` 是比 `0`, 解决这个难题,并包括
杆高度加上杆:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }'
```

题算法是:

1. 构建挑战作为 SHA-256 在:
   - 的字节 `iroha:accounts:faucet:pow:v2`
   - 在 UTF-8 账户 ID
   - `anchor_height` 作为一个大子 `u64`
   - `anchor_block_hash_hex` 解码为字节
   - `challenge_salt_hex` 在存在时,被解码为字节
2. 试着 `u64` 编码为大端8字节值.
3. 对于每一个nonce,使用:
   - 密码: 8 字节的无数
   - 盐:32字节的挑战
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - 输出长度:32字节
4. 获胜的是第一个至少有 `difficulty_bits`
   导致零位.

管道响应包括资产资金和排队交易哈希:

```json
{
  "account_id": "<TAIRA_I105_ACCOUNT_ID>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "asset_id": "...",
  "amount": "25000",
  "tx_hash_hex": "...",
  "status": "QUEUED"
}
```

目前回复的答案是 HTTP `202 Accepted`. 资产
定义 ID 上面是 Taira 公共水龙头资助的费用资产.
在回报时,龙头已经接受了请求 `tx_hash_hex` 并且
`status: "QUEUED"`.

然后在提交您自己的费用之前,进行投资.
交易:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition 6TEAJqbb8oEPmLncoNiMRbLEK6tw \
  --account <TAIRA_I105_ACCOUNT_ID>
```

如果水龙头索赔被接受,但账户或资产不可见
然而,交易仍在公共测试网络排队处理后面.
在发送信件之前再试阅读.

对于准备运行的直线 API 查看,保存这个作为 `taira_faucet_claim.py`
通过 Taira I105 账户 ID:

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

with urllib.request.urlopen(f"{root}/v1/accounts/faucet/puzzle") as res:
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
    headers={"content-type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as res:
    print(json.dumps(json.load(res), indent=2))
```

龙头只用于 Taira 测试网资金.不要使用测试网 XOR, 气管
账户或 Taira 卡纳里签名器 Minamoto 流动.

## 5. 创建一个 Minamoto 客户端配置 {#_5-create-a-minamoto-client-config}

使用单独的键对 Minamoto. 不要再使用 Taira 关键是主网.

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

最高层次 `chain` 是电流 Nexus 主网链 ID.
`[account].profile = "minamoto"` 选择了 Minamoto I105 连锁
区别性;终端点主机名称和链 ID 没有被暗示的选择.

转换一个 Minamoto 公开关键在其法典中 I105 账户 ID 在
主网前:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

运行只阅读边检查,直到账户提供储备和资金
通过主网络上网或管理流程:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

不要运行 Taira 水管或可写的辅助器 Minamoto.

## 6. 基金 a Minamoto 账户与 XOR {#_6-fund-a-minamoto-account-with-xor}

Minamoto 费用与生产相结合. XOR, 并且 Minamoto 没有公众
通过批准的主网安装来资助配置账户
或收到资金转移, XOR 从现有资助的 Minamoto
账户.

验证法典账号 ID 之前的仅阅读检查资金
提交一份信件. Minamoto XOR 作为生产资金:
在 Taira 首先,保持分别的生产钥匙,
假设可以重置主网交易.

Taira XOR 无法支付 Minamoto 测试网余额和水龙头索赔
没有转移到 Minamoto.

## 7. 在现有数据空间内工作 {#_7-work-inside-an-existing-dataspace}

使用一个本书内居住的类型对象的完全合格域名
例如,公共数据空间中的一个项目域应该是
使用:

```text
apps.universal
```

在您的帐户获得了所需权限后,创建一个免于秘密的
`AliasSetupPlanRequestV1` 对域名的意图和使用声明规划器:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

对于 Minamoto, 产生和批准单独的主网意图和计划.
它们的链接,权威,现实状态和截止日期.
Taira 计划不能推广或重播:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

账户号使用相同的数据空间后音:

```text
alice@apps.universal
alice@universal
```

严格的帐户字段仍然使用法典 I105 账户 IDs. 处理别名
作为人类可读的结合,解决了神圣帐户 IDs.

## 8. 提供新的数据空间 {#_8-provision-a-new-dataspace}

新的数据空间是运营商和治理变化. Torii
终端点可以将流量导向配置的数据域,但它会拒绝
不知名的数据空间别名.

在准备更改之前,请捕获当前的现场目录:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

对于运营商账户,请检查车道明示表姿势:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

除非车道 ID, 数据空间 ID, 验证器集,
错误耐受性,明确性,路由规则和运营所有者
一个正常的用户帐户,有所需的权限可以
获得一个域名和其 SNS 在现有数据空间内通过
它不能安全地添加一个新的公共数据空间.

对于私人或组织数据空间,编制一项目录变更:

- 一个独特的数据空间别名和数字 `id`
- 一个匹配的车道入口或现有车道分配
- 数据空间 `fault_tolerance`
- 应登陆的指令或帐户范围的路由规则
  在那里
- 空间目录的明示或同等部署证据,
  数据空间曝光 UAID 能力
- 对验证器,合规性,结算和监测的治理批准
  政策

可检查的配置片段看起来像这样:

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

运营商接受应包括以下门户:

- `irohad --sora --config <config.toml> --trace-config` 通过
  解决节点配置
- 生成或审查的表格是用哈希和签名存档的
- 烟雾测试通过 Taira 在任何 Minamoto 提升
- 变更后的情况 `/status` 目录显示预期的车道和数据空间
- `iroha app nexus lane-report --summary` 没有报告失踪要求
  标签

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

促进相同的数据空间到 Minamoto 只有在 Taira 部署,
烟雾测试,监控和治理证据已经完成.

## 相关页面 {#related-pages}

- [安装 Iroha 3](/zh-hans/get-started/install-iroha.md)
- [运行 Iroha 3 通过 CLI](/zh-hans/get-started/operate-iroha-via-cli.md)
- [提供私人数据空间的赞助费用](/zh-hans/get-started/private-dataspace-fee-sponsor.md)
- [Torii 终点](/zh-hans/reference/torii-endpoints.md)
- [创世记的参考](/zh-hans/reference/genesis.md)
