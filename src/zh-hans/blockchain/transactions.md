---
translation_locale: zh-hans
translation_source: /blockchain/transactions.md
translation_source_hash: 91c06ab61c7f8ec96554bc89b31b2f281bb3a7d7edd484defe61dcde5a3fb710
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
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

这仍是只读操作。提交交易需要已签名的 Norito 封装、正确的链 ID 和网络 ID、明确的费用支付方，以及通过水龙头获得资金的 Taira 账户。

运行 Taira 付费示例前，请按[在 Taira 获取测试网 XOR](/zh-hans/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)中带有准备步骤的水龙头流程为签名账户提供资金，再确认费用资产余额：

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

如果水龙头路由返回 `502`，先等待并重试，再排查交易本身。

然后在提交交易时选择费用支付方。使用 `--fee-payer authority` 时，由签署账户支付，且 CLI 在签署前会以 Taira 的费用资产报价具体费用：

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "faucet-funded taira transaction"
```

## 离线交易 {#offline-transactions}

Iroha 有两种离线交易工作流程:

- **离线签名**会在签名设备断开连接时创建普通的已签名交易。在在线客户端将已签名封包提交给 Torii 之前，交易不会被处理，因此它仍需正确的链 ID、权限主体、权限、费用和交易生命周期。
- **Kagemusha 离线现金**在已注册、由硬件提供保障的钱包在线时向其装载价值，支持两个钱包均离线时进行钱包间支付，并在钱包重新联网后将剩余价值卸载到账本账户。

Torii 提供一条 Kagemusha 路由：`POST /v1/kagemusha/enrollment`。它接受经过账户认证的 `application/x-norito` 注册帧，并返回不得缓存的私有响应。生命周期的账本侧使用携带 `KagemushaWalletLedgerV1` 指令的普通签名交易：

|动作| 用途 |
| --- | --- |
| `Activate` | 激活已注册的钱包；必须执行原生引导验证 |
| `IssueLoad` | 从付款方扣款，并原子地记录钱包的下一次 Load |
| `Unload` | 将完整的 Unload 申领支付到其绑定账户，最多一次 |
| `ClaimFee` | 将完整的费用申领支付给其固定受益人 |
| `Abandon` |放弃未使用的注册|

典型流程如下：

1. 使用具有类型化接口的 Swift 或 Android 钱包，通过 `/v1/kagemusha/enrollment` 注册钱包，然后将其激活。
2. 提交 `IssueLoad` 交易。执行时会检查预期的下一次 Load 序号和非零请求 ID，因此过期或被修改的重试会失败。如果响应丢失，应读取原始 Load 回执，而不是签署另一笔 Load。
3. 钱包离线时，在本地交换并验证钱包间支付；在确认每次转移之前，先持久化钱包状态。
4. 钱包重新联网后，提交其 Unload 申领并等待最终性。

在票据状态通过在线生命周期回传之前，账本无法发现相互冲突的离线交接。因此，钱包和运营方策略应强制执行价值上限、到期时间、获准发行方、持久化本地存储和对账时限。

以下示例使用 `Grant` 指令创建新交易。在该交易中，Mouse 将指定角色（`role_id`）授予 Alice。请参阅[完整示例](./permissions.md#register-a-new-role)。

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
