---
translation_locale: zh-hans
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 交易 {#transactions}

交易是一个签署的请求来执行在区块链上的工作.可执行的有效载荷可以是有序的序列 [指令](./instructions.md), 一个合同调用, IVM 字节代码,或一个被证明的 IVM 执行死刑. [智能合同](./smart-contracts.md) 对于当前的合同执行模式.

交易执行状态变化或可执行的工作.仅阅读检查使用签署的查询或公开阅读终端点,并不会创建交易.

已提交的区块中被录取的交易与其执行结果,包括执行拒绝存储.在区块录取之前被拒绝的请求,如无效包裹或排队拒绝的交易,不会存储在区块中.

关于保护隐私的资产流动,请参见 [匿名交易](./anonymous-transactions.md).匿名交易使用屏蔽的资产纸币,承诺,取消符号和零知识证明,而不是公开账户到账户余额变化.

对于选择透明执行效果的证据,请参见 [FastPQ](./fastpq.md). FastPQ 在正常交易执行后消耗了执行见证人,并为支持状态过渡构建了确定性证明批量.

## 在 Taira 试看. {#try-it-on-taira}

使用探索者路线检查最近的公开 Taira 区块和交易状态,而不需要签署账户:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

为了跟踪您的应用程序之前提交的交易, 从列表中复制`hash`并检查探索者的详细路线:

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

提交交易需要签署的 Norito 包裹,正确的链接 ID,费用元数据和一个头资助的 Taira 账户.

对于支付费用的例子 Taira, 拯救水龙头助手 [获取测试网 XOR 在 Taira](/zh-hans/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) 作为 `taira_faucet_claim.py`, 然后通过公共水龙头来资助签署者:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

如果水龙头拼图或索赔路径返回 `502`,在调试交易之前,等待并再次尝试.

然后,在提交交易时附加 Taira 费用资产的元数据:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## 离线交易 {#offline-transactions}

Iroha 有两种离线交易工作流程:

- 在线签字创建一个正常的签名交易,而签名设备被断开.在网上客户端向 Torii 提交签名包裹之前,该交易不会进行处理,因此它仍然需要正确的链接 ID,权威,许可证,费用和交易寿命.
- 在网上时,Kagemusha在线现金充满钱包,支持接收者启动的钱包到钱包交付,同时两者都当收件人返回网上时,收取结果的笔记状态.

Torii 将整个Kagemusha生命周期暴露在`/v1/offline/*`下:

|方法和终点|目的|
| --- | --- |
|`GET /v1/offline/readiness`|评估 Kagemusha 的准备性 `asset_definition_id` |
|`POST /v1/offline/receiver-lineage`|解决签署的收件人请求的有效登记谱系|
|`POST /v1/offline/top-up`|提交已签署的在线到离线补充操作|
|`POST /v1/offline/redeem`|提交一个签署的离线赎回操作|
|`GET /v1/offline/operations/{operation_id}`|阅读补充或赎回的法规状态|

在构建离线运营之前,检查资产的准备性:

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

准备将钱包连接到活跃的桥梁. ABI 21 证实 V4 后代,补充和赎回请求使用输入 `application/x-norito` 存档,补充和赎回 `202 Accepted` 有一个 `Location` 标题指向操作资源;嵌入式非零操作 ID 提供了无权的钥匙.

典型的流量是:

1. 如果 `ready` 是假的或任何阻塞器适用,请查询准备性和停止.
2. 使用打字的 Swift 或 JVM 钱包构建常规补充档案,提交它,并保留输入笔记状态和操作 ID,直到操作达到最终链状态.
3. 在需要时解决接收者注册后代,本地构建和验证每个同行传递,并在确认转移之前保持加密的笔记状态.
4. 当接收者在网上时,建立了法典赎回档案,提交,并对其运营资源进行调查.

在网上生命周期中,笔记本无法观察到相互矛盾的离线转移.因此,钱包和运营商政策应强制执行价值限制,过期期限,接受发行人,可持续的本地存储和和解窗口.

以下是使用 `Grant` 指令创建新交易的一个例子. 在此交易中,鼠标正在赋予爱丽丝指定的角色 (`role_id`).查看 [完整例](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
