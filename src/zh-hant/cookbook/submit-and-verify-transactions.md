---
translation_locale: zh-hant
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: 98e5c7e9db1ba8468cfd5409409b0e8d02251311dc85492f7b71675e983dc4fd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 提交和驗證交易 {#submit-and-verify-transactions}

## 結果 {#outcome}

預先進行 Taira 交易,接受準確的收費報價,簽署並提交它,等待應用最終性,並透過雜湊驗證提交的交易.

## 預先條件 {#prerequisites}

- 由 [生產的資助`taira.client.toml`,`taira.tx-metadata.json`,和`TAIRA_ACCOUNT_ID`連線到 Taira](./connect-to-taira.md).
- 電流 `iroha` CLI 和`jq`.
- 一次使用的 Taira 簽名器.不要再使用其金鑰或在 Minamoto 上寫這些命令.

## 步驟 {#steps}

### 1. 預先確定端點,權力和費用餘額 {#_1-preflight-the-endpoint-authority-and-fee-balance}

首先閱讀佇列快照,然後證明該機構的費用餘額可見. 從連線操作指南生成的後設資料中閱讀Base58資產定義 ID.

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

如果帳戶或費用餘額缺席,則停止. 當其權限主體無法支付時,有效的指令不能透過收取費用.

### 2. 報價,簽署和提交一次 {#_2-quote-sign-and-submit-once}

其他 CLI 傳送準確的未簽署的有效載荷,以收費報價,將接受的付款意圖繫結到交易中,簽署並提交. JSON 模式將交易雜湊,簽署的交易和被接受的報價一起返回.

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

在此操作指南中不要使用 `--no-wait`.命令在寫出成功收據之前等待確認.

### 3. 等待終端管道狀態 {#_3-wait-for-terminal-pipeline-state}

使用輸入狀態輔助器,而不是從 HTTP 接受或排隊錄取中推斷成功.在 `--wait` 中,安全路由範圍自動選擇,預設目標是應用最終性

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

`Rejected`和`Expired`是終端故障,而不是可重複的成功狀態. 在更改或重新構建交易之前記錄其原因.

### 4. 閱讀儲存的交易 {#_4-read-the-stored-transaction}

管道狀況是否已完成加工.交易查詢驗證被允許的交易是儲存在同一雜湊下.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

探測器是第二個,只能閱讀的觀測表面. 它可能略落後於管道最終性.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

為了改變狀態的指令,完成一個被突變的物件的查詢. [後設資料](./metadata.md), [性資產](./fungible-assets.md)和 [NFTs](./nfts.md)的操作指南包括後狀態讀取.

## 驗證 {#verify}

檢查所有三個記錄都同意相同的雜湊,並且探索者不再報告待定狀態:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

儲存提交的收據和最終狀態作為測試證據.它們包含公開交易材料,而不是簽字鑰匙.

## 解決問題 {#troubleshooting}

- HTTP `202`或排隊狀態只證明錄取. 繼續對輸入狀態進行投票,直到應用,拒絕,過期或截止時間.
- 如果提交時間結束後返回一個雜湊,在建立另一個交易之前查詢該雜湊.盲目重新提交會產生新的報價和簽署的有效負載.
- 在簽署之前,可以拒絕收費報價. 檢查 `--fee-payer authority`, `gas_asset_id`,機構的餘額和網路鏈 ID.
- `Rejected` 通常表示指令驗證、權限、費用或過時狀態。它是已提交的失敗執行證據，不應重新分類為傳輸重試。
- 在應用程式後,一個探測器 `404` 可以將索引滯後. 再次嘗試閱讀;不要重新提交交易.
- 如果一個特權命令在生成的本地網路上執行,但 Taira 拒絕它,請獲得準確的 Taira 許可或規定的名稱空間分配.本地結果不授予公共網路權力.

## 來源及相關檔案 {#source-and-related-docs}

- [在固定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)中提交交易和執行費率配額
- [固定 commit 上的交易確認實作與測試](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/src/client.rs)
- [交易](/zh-hant/blockchain/transactions.md)
- [CLI 指南](/zh-hant/get-started/operate-iroha-via-cli.md)
- [Torii 端點](/zh-hant/reference/torii-endpoints.md)
