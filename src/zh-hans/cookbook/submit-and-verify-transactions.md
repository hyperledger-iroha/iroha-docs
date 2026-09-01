---
translation_locale: zh-hans
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: 98e5c7e9db1ba8468cfd5409409b0e8d02251311dc85492f7b71675e983dc4fd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 提交和验证交易 {#submit-and-verify-transactions}

## 结果 {#outcome}

预先进行 Taira 交易,接受准确的收费报价,签署并提交它,等待应用最终性,并通过哈希验证提交的交易.

## 预先条件 {#prerequisites}

- 由 [生产的资助`taira.client.toml`,`taira.tx-metadata.json`,和`TAIRA_ACCOUNT_ID`连接到 Taira](./connect-to-taira.md).
- 电流 `iroha` CLI 和`jq`.
- 一次使用的 Taira 签名器.不要再使用其密钥或在 Minamoto 上写这些命令.

## 步骤 {#steps}

### 1. 预先确定端点,权力和费用余额 {#_1-preflight-the-endpoint-authority-and-fee-balance}

首先阅读队列快照,然后证明该机构的费用余额可见. 从连接操作指南生成的元数据中阅读Base58资产定义 ID.

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.gas_asset_id' taira.tx-metadata.json)"

iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

如果账户或费用余额缺席,则停止. 当其权限主体无法支付时,有效的指令不能通过收取费用.

### 2. 报价,签署和提交一次 {#_2-quote-sign-and-submit-once}

其他 CLI 发送准确的未签署的有效载荷,以收费报价,将接受的付款意图绑定到交易中,签署并提交. JSON 模式将交易哈希,签署的交易和被接受的报价一起返回.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

在此操作指南中不要使用 `--no-wait`.命令在写出成功收据之前等待确认.

### 3. 等待终端管道状态 {#_3-wait-for-terminal-pipeline-state}

使用输入状态辅助器,而不是从 HTTP 接受或排队录取中推断成功.在 `--wait` 中,安全路由范围自动选择,默认目标是应用最终性

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000 \
  > taira-final-status.json

jq . taira-final-status.json
```

`Rejected`和`Expired`是终端故障,而不是可重复的成功状态. 在更改或重新构建交易之前记录其原因.

### 4. 阅读存储的交易 {#_4-read-the-stored-transaction}

管道状况是否已完成加工.交易查询验证被允许的交易是存储在同一哈希下.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

探测器是第二个,只能阅读的观测表面. 它可能略落后于管道最终性.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

为了改变状态的指令,完成一个被突变的对象的查询. [元数据](./metadata.md), [性资产](./fungible-assets.md)和 [NFTs](./nfts.md)的操作指南包括后状态读取.

## 验证 {#verify}

检查所有三个记录都同意相同的哈希,并且探索者不再报告待定状态:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

保存提交的收据和最终状态作为测试证据.它们包含公开交易材料,而不是签字钥匙.

## 解决问题 {#troubleshooting}

- HTTP `202`或排队状态只证明录取. 继续对输入状态进行投票,直到应用,拒绝,过期或截止时间.
- 如果提交时间结束后返回一个哈希,在创建另一个交易之前查询该哈希.盲目重新提交会产生新的报价和签署的有效负载.
- 在签署之前,可以拒绝收费报价. 检查 `--fee-payer authority`, `gas_asset_id`,机构的余额和网络链 ID.
- `Rejected` 通常表示指令验证、权限、费用或过时状态。它是已提交的失败执行证据，不应重新分类为传输重试。
- 在应用程序后,一个探测器 `404` 可以将索引滞后. 再次尝试阅读;不要重新提交交易.
- 如果一个特权命令在生成的本地网络上运行,但 Taira 拒绝它,请获得准确的 Taira 许可或规定的命名空间分配.本地结果不授予公共网络权力.

## 来源及相关文件 {#source-and-related-docs}

- [在固定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)中提交交易和执行费率配额
- [固定 commit 上的交易确认实现与测试](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/src/client.rs)
- [交易](/zh-hans/blockchain/transactions.md)
- [CLI 指南](/zh-hans/get-started/operate-iroha-via-cli.md)
- [Torii 端点](/zh-hans/reference/torii-endpoints.md)
