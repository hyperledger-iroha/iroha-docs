---
translation_locale: zh-hans
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 交易 {#transactions}

一个 **交易** 是一个签署的请求执行区块链工作.
可执行的有效载荷可以是
[指令](./instructions.md), 一个合同调用, IVM 字节码,或一个
证明 IVM 执行死刑. [智能合同](./smart-contracts.md) 对于目前
合同执行模式.

交易执行状态变化或可执行的工作.
使用已签署的查询或公开阅读终端点,不创建交易.

在承诺区块中被录取的交易与其执行一起存储
结果,包括执行拒绝.
录取,如无效的包裹或被排队拒绝的交易
它们不会存储在一个街区.

关于保护隐私的资产流动,见
[匿名交易](./anonymous-transactions.md). 匿名
交易使用保护的资产证券,承诺,取消符号和
无知识证明,而不是公开账户对账户余额的变化.

对于选择透明执行效果的证据,请见
[FastPQ](./fastpq.md). FastPQ 在正常情况下,消耗了死刑证人.
交易执行和构建支持的确定性证明批量
国家过渡.

## 试着. Taira {#try-it-on-taira}

使用探险者路线检查最近的公众 Taira 区块和交易
没有签字账户的状态:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

为了跟踪您的应用程序之前提交的交易, `hash` 根据
列出并检查探险员的详细路线:

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

提交交易需要签署 Norito
包裹,正确的链 ID, 费用元数据,以及一个通过水龙头资助的 Taira 账户.

对于付费的例子, Taira, 拯救水龙头助手
[获取测试网 XOR 在 Taira](/zh-hans/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
作为 `taira_faucet_claim.py`, 然后通过公共水龙头资助签署者
首先:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

如果水龙头拼图或索赔路径返回 `502`, 之前再试一次
调试交易本身.

然后将 Taira 在提交交易时,收费资产元数据:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## 离线交易 {#offline-transactions}

Iroha 有两个离线交易工作流程:

- **在线签字** 创建正常签署的交易
  交易不会在网上进行处理
  客户将签署的封面提交给 Torii, 所以它仍然需要
  正确的链 ID, 权限,许可证,费用和交易寿命.
- **卡盖穆沙离线现金** 在网上,支持一个钱包
  收件人启动的钱包到钱包交付,而两个钱包都是
  在线,并在收件人返回时收取结果的注释状态
  在线.

Torii 揭露了整个 Kagemusha 的生命周期 `/v1/offline/*`:

| 方法和终点 | 目的 |
| --- | --- |
| `GET /v1/offline/readiness` | 评估 Kagemusha 的准备 `asset_definition_id` |
| `POST /v1/offline/receiver-lineage` | 为签署的接收者请求解决证明性活跃注册系 |
| `POST /v1/offline/top-up` | 提交签署的在线到离线补充操作 |
| `POST /v1/offline/redeem` | 提交已签署的离线赎回操作 |
| `GET /v1/offline/operations/{operation_id}` | 阅读补充或赎回的法规状态 |

在构建离线运营之前,检查资产的准备性:

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

准备将钱包绑定到活跃的桥梁 ABI 21 证实 V4
后代,补充和赎回请求使用输入
`application/x-norito` 收费和回报 `202 Accepted`
有一个 `Location` 标题指向操作资源;嵌入式
非零操作 ID 提供无权的钥匙.

典型的流量是:

1. 问准备,停止如果 `ready` 是假的,或者任何阻塞剂都适用.
2. 使用打字 Swift 或 JVM 钱包用于构建法典补充档案,
   提交,并保留输入说明状态和运行 ID 在
   操作达到最后的链状态.
3. 在需要时,解决接收器注册后代,构建和
   在本地验证每个同行传递,并坚持加密笔记状态
   在确认转移之前.
4. 当接收者上网时, 建立法规赎回档案,
   提交,并调查其运营资源到最后.

在注释状态之前,账本无法观察冲突的离线传输
在网上生命周期中返回.
因此,执行价值限制,过期期权,已接受的发行商,持久本地
存储和调整窗口.

这是一个创建新交易的例子. `Grant`
在这笔交易中,鼠标正在授予爱丽丝所规定的
角色 (`role_id`) 检查
[完整的例子](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
