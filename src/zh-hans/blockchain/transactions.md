---
translation_locale: zh-hans
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 交易 {#transactions}

交易是执行区块链操作的已签名请求。可执行载荷可以是有序的[指令](./instructions.md)序列、合约调用、IVM 字节码或经证明的 IVM execution。有关当前合约执行模型，请参阅[智能合约](./smart-contracts.md)。

交易执行状态变化或可执行的工作.仅阅读检查使用签署的查询或公开阅读端点,并不会创建交易.

已提交的区块中被录取的交易与其执行结果,包括执行拒绝存储.在区块录取之前被拒绝的请求,如无效封装或排队拒绝的交易,不会存储在区块中.

关于保护隐私的资产流动,请参见 [匿名交易](./anonymous-transactions.md).匿名交易使用屏蔽的资产票据,承诺,取消符号和零知识证明,而不是公开账户到账户余额变化.

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

这仍然是只读操作。提交交易需要已签名的 Norito 封包、正确的链 ID、费用元数据，以及通过水龙头获得资金的 Taira 账户。

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

- **离线签名**会在签名设备断开连接时创建普通的已签名交易。在在线客户端将已签名封包提交给 Torii 之前，交易不会被处理，因此它仍需正确的链 ID、权限主体、权限、费用和交易生命周期。
- **Kagemusha 离线现金**会在钱包在线时充值，支持两个钱包均离线时由接收方发起的钱包间交接，并在接收方恢复在线后赎回生成的票据状态。

Torii 通过 `/v1/offline/*` 提供完整的 Kagemusha 生命周期：

| 方法和端点 | 用途 |
| --- | --- |
| `GET /v1/offline/readiness` | 评估一个 `asset_definition_id` 的 Kagemusha 就绪状态 |
| `POST /v1/offline/receiver-lineage` | 为已签名的接收方请求解析带证明的有效注册谱系 |
| `POST /v1/offline/top-up` | 提交已签名的在线转离线充值操作 |
| `POST /v1/offline/redeem` | 提交已签名的离线赎回操作 |
| `GET /v1/offline/operations/{operation_id}` | 读取充值或赎回的规范状态 |

构建离线操作前，请检查该资产的就绪状态：

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

就绪检查会将钱包绑定到当前启用的桥接 ABI 21 和已认证的 V4 工件集。注册谱系、充值和赎回请求使用类型化的 `application/x-norito` 归档。充值和赎回会返回 `202 Accepted`，其 `Location` 标头指向操作资源；其中嵌入的非零操作 ID 用作幂等键。

典型流程如下：

1. 查询就绪状态；如果 `ready` 为 false 或存在任何阻断项，则停止。
2. 使用类型安全的 Swift 或 JVM 钱包构建规范充值归档并提交；在操作达到最终链上状态前，保留输入票据状态和操作 ID。
3. 必要时解析接收方注册谱系，在本地构建并验证每次点对点交接；确认转移前，持久保存加密的票据状态。
4. 接收方上线后，构建并提交规范赎回归档，然后轮询其操作资源，直到达到最终状态。

在票据状态通过在线生命周期回传之前，账本无法发现相互冲突的离线交接。因此，钱包和运营方策略应强制执行价值上限、到期时间、获准发行方、持久化本地存储和对账时限。

以下示例使用 `Grant` 指令创建新交易。在该交易中，Mouse 将指定角色（`role_id`）授予 Alice。请参阅[完整示例](./permissions.md#register-a-new-role)。

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
