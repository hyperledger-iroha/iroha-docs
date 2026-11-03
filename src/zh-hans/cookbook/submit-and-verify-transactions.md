---
translation_locale: zh-hans
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: de608ef52ad3a999c0e253e6683e454f8f66f399a690dce4c2185c79d02334cd
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# 提交和验证交易 {#submit-and-verify-transactions}

## 结果 {#outcome}

预先进行 Taira 交易,接受准确的收费报价,签署并提交它,等待应用最终性,并通过哈希验证提交的交易.

## 预先条件 {#prerequisites}

- 由 [连接到 Taira](./connect-to-taira.md) 生成的已注资 `taira.client.toml`、`taira-faucet-policy.json` 和 `TAIRA_ACCOUNT_ID`。写入使用 `--fee-payer authority`；CLI 会在签名前给出以 Taira 费用资产计价的确切费用报价。
- 电流 `iroha` CLI 和`jq`.
- 一次使用的 Taira 签名器.不要再使用其密钥或在 Minamoto 上写这些命令.

## 步骤 {#steps}

### 1. 预先确定端点,权力和费用余额 {#_1-preflight-the-endpoint-authority-and-fee-balance}

先读取队列快照，然后证明授权主体的费用余额可见。从连接操作指南所保存的水龙头政策中读取 Base58 资产定义 ID。

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet-policy.json)"

iroha --config ./taira.client.toml account get \
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
  tx ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

在此操作指南中不要使用 `--no-wait`.命令在写出成功收据之前等待确认.

### 3. 等待终端管道状态 {#_3-wait-for-terminal-pipeline-state}

请使用带类型的状态辅助工具，而不是根据 HTTP 接受或队列准入推断成功。使用 `--wait` 时，CLI 会轮询确切的全局状态，并且只有在达到经状态解析的 `Applied` 最终性时才会成功。

```bash
iroha --config ./taira.client.toml \
  --machine \
  tx status \
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
  tx get --hash "$TAIRA_TX_HASH" \
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

检查三条记录是否都对应同一个哈希，以及区块浏览器报告的是 `Committed` 而不是 `Rejected`：

```bash
jq -e --arg hash "$TAIRA_TX_HASH" \
  '.hash == $hash and .terminal_kind == "Applied"' taira-final-status.json

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '(.hash | ascii_downcase | ltrimstr("hash:") | split("#")[0]) == $hash
      and .status == "Committed"'
```

保存提交的收据和最终状态作为测试证据.它们包含公开交易材料,而不是签字钥匙.

## 解决问题 {#troubleshooting}

- HTTP `202`或排队状态只证明录取. 继续对输入状态进行投票,直到应用,拒绝,过期或截止时间.
- 如果提交时间结束后返回一个哈希,在创建另一个交易之前查询该哈希.盲目重新提交会产生新的报价和签署的有效负载.
- 费用报价可能在签名前被拒绝。请检查 `--fee-payer authority`、授权主体的余额、配置的 `chain` 和 `network_id`，并确认 `--metadata` 未携带 `gas_asset_id` 之类的费用键。
- `Rejected` 通常表示指令验证、权限、费用或过时状态。它是已提交的失败执行证据，不应重新分类为传输重试。
- 在应用程序后,一个探测器 `404` 可以将索引滞后. 再次尝试阅读;不要重新提交交易.
- 如果一个特权命令在生成的本地网络上运行,但 Taira 拒绝它,请获得准确的 Taira 许可或规定的命名空间分配.本地结果不授予公共网络权力.

## 来源及相关文件 {#source-and-related-docs}

- [在固定提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)中提交交易和执行费率配额
- [固定 commit 上的交易确认实现与测试](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/client.rs)
- [交易](/zh-hans/blockchain/transactions.md)
- [CLI 指南](/zh-hans/get-started/operate-iroha-via-cli.md)
- [Torii 端点](/zh-hans/reference/torii-endpoints.md)
