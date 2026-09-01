---
translation_locale: zh-hant
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: e14be7d9314f26f40f6aa30678fddcfcfea39eda9b98016f1b2f84838203c548
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 連線到 Taira {#connect-to-taira}

## 結果 {#outcome}

確認 Taira 可存取，從本機使用者端設定中擷取規範 I105 帳戶 ID，用測試網 XOR 為簽署者注資，並提交一筆帶費用報價的 canary 交易。此操作指南絕不會向 Minamoto 傳送寫入。

## 預先條件 {#prerequisites}

- `curl`,`jq`, Python 3.11或後期,以及當前的 `iroha`和 `kagami`二進位制.
- 使用 Taira 鏈,端點,帳戶配置檔案和專門的測試網鍵建立`taira.client.toml`. 按照 [建立一個 Taira 客戶端配置](/zh-hant/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config)並保持檔案不受源控制.
- 準備執行的 `taira_faucet_claim.py` 來自 [獲取測試網 XOR 在 Taira](/zh-hant/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira), 儲存在客戶端配置旁邊.

## 步驟 {#steps}

### 1. 活力與準備的分離 {#_1-separate-liveness-from-readiness}

`/livez` 是一個簡體文字過程壽命探測器. `/status`, `/health`和 `/readyz`返回 JSON.當需要的子系統被封鎖時,執行節點可以合法地從準備探測器中返回 `503`.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

僅使用 `/livez` 判斷程式是否有回應。使用 `/readyz` 進行流量准入；在將 `503` 視為服務中斷之前，先檢查其 JSON blocker 詳細資料。

### 2. 開展公共診斷 {#_2-run-the-public-diagnostics}

此檢查僅可閱讀,不載入簽字器配置:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

當醫生報告一個硬 DNS, TLS,鏈或端點失敗時,不要繼續執行寫入操作.一個和的公眾佇列是過渡性的;等待再嘗試一個有限的政策.

### 3. 在不列印密碼的情況下取出 Taira 帳戶 ID {#_3-derive-the-taira-account-id-without-printing-a-secret}

僅從配置中閱讀公鑰,然後用 Taira I105 配置檔案編碼它. `[account].domain`值提供路由文字;它不是帳戶 ID 的一部分.

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"

export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"
printf '%s\n' "$TAIRA_ACCOUNT_ID"
```

輸出是一個無域名的規範地址 I105.像 `wallet@payments.universal`這樣的名稱是稱,必須在嚴格帳戶領域使用之前解決.

### 4. 索賠當前費用資產 Taira {#_4-claim-the-current-taira-fee-asset}

收費資產定義的真相來源是水龍頭響應.保留返回 Base58 ID 而不是從另一個網路或舊執行中複製 ID.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

最多一個分鐘的餘額查詢. 在融資交易可見之前,水龍頭可以返回 `202 Accepted`.

```bash
funded=false
for attempt in 1 2 3 4 5 6 7 8 9 10 11 12; do
  if iroha --config ./taira.client.toml ledger asset get \
    --definition "$TAIRA_FEE_ASSET" \
    --account "$TAIRA_ACCOUNT_ID"; then
    funded=true
    break
  fi
  sleep 5
done
test "$funded" = true
```

`gas_asset_id`是交易後設資料.明確的 `--fee-payer authority`選項是簽名約束的,並且在簽署之前,CLI 獲得了準確的費用報價.

## 驗證 {#verify}

提交日誌說明,儲存 JSON 收據,並等待應用終結. 排放 `--no-wait` 也使初始提交等待確認;明確的狀態讀取證明瞭最終管道狀態.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

最後命令只有交易達到預設狀態之後才能成功 `Applied` 在測試證據中儲存雜湊,永遠不要儲存私鑰或完整的客戶端配置.

## 解決問題 {#troubleshooting}

- `/livez`在要求 JSON 時返回`406`,因為該端點是 `text/plain`.如上所示,傳送 `Accept: text/plain`.
- `/health`或`/readyz`可以用機器可讀的阻塞器返回 `503`,即使在 `/livez`和 `/status`工作期間. 固定或等待該阻塞器;再生鍵不會改變節點準備性.
- 一個水龍頭 `502`,時間休息,或過時的證明工作是公共服務失敗.
- 一個 I105 前置錯誤意味著公鑰被錯誤的配置檔案編碼. 再執行 `iroha tools address convert --profile taira`.
- 收費率的拒絕通常意味著該機構沒有獲得資金,收費資產後設資料已經過時,或者沒有明確的收費者被選中.
- 即使此金絲雀測試成功，註冊、鑄造或命名空間管理操作仍可能被拒絕。這些操作需要各自的執行階段權限；如果尚未取得 Taira 存取權，請在產生的本機網路上演練。

## 來源及相關檔案 {#source-and-related-docs}

- [Taira CLI 診斷和 canary 原始碼在固定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/taira.rs)
- [顯而易見的費用選擇和提交源 CLI 在固定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Taira 帳戶和水龍頭指南](/zh-hant/get-started/sora-nexus-dataspaces.md)
- [客戶端配置](/zh-hant/guide/configure/client-configuration.md)
- [交易](/zh-hant/blockchain/transactions.md)
