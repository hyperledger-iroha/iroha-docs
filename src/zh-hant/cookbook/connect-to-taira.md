---
translation_locale: zh-hant
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 31555f0c56bddb8892d09af250cef732a2dfdd39564c83de8b344200157751b9
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# 連線到 Taira {#connect-to-taira}

## 結果 {#outcome}

確認 Taira 可存取，從本機使用者端設定中擷取規範 I105 帳戶 ID，用測試網 XOR 為簽署者注資，並提交一筆帶費用報價的 canary 交易。此操作指南絕不會向 Minamoto 傳送寫入。

## 預先條件 {#prerequisites}

- `curl`,`jq`, Python 3.11或後期,以及當前的 `iroha`和 `kagami`二進位制.
- 一個以 Taira 鏈、確切的 `network_id`、端點、帳戶設定檔和專用測試網金鑰建立的 `taira.client.toml`。請按照 [建立一個 Taira 客戶端配置](/zh-hant/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) 操作，並將該檔案排除在原始碼版本控制之外。
- 一個用於水龍頭日誌的可寫入工作目錄：`iroha taira account faucet prepare` 會以私有權限建立 `./taira-faucet`，並拒絕取代已存在的目錄。

## 步驟 {#steps}

### 1. 活力與準備的分離 {#_1-separate-liveness-from-readiness}

`/livez`、`/health` 和 `/readyz` 是純文字探測端點；`/status` 返回 JSON。當共識准入或其他必要的子系統無法使用時，正在執行的節點可以合法地從 `/readyz` 返回 `503`。

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: text/plain, application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

僅使用 `/livez` 判斷程式是否有回應。使用 `/readyz` 進行流量准入。它的 `503` 是一個不含阻塞原因詳細資料的 `service_unavailable` 錯誤封裝，因此在將其視為服務中斷之前，請先執行下面的診斷。

### 2. 開展公共診斷 {#_2-run-the-public-diagnostics}

此檢查僅可閱讀,不載入簽字器配置:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

當醫生報告一個硬 DNS, TLS,鏈或端點失敗時,不要繼續執行寫入操作.一個和的公眾佇列是過渡性的;等待再嘗試一個有限的政策.

### 3. 在不列印密碼的情況下取出 Taira 帳戶 ID {#_3-derive-the-taira-account-id-without-printing-a-secret}

僅從設定中讀取公鑰，然後以 Taira I105 設定檔對其編碼。帳戶 ID 不包含域名；`[account].profile` 只選擇其網路前綴。

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

水龍頭政策會指明目前的費用資產定義。請保留其 Base58 ID，而不是從其他網路或舊的執行中複製 ID。該政策是未經簽署的探索資料，因此自動化流程應固定其預期的發行者、資產定義和金額，而不是信任每次的回應。

```bash
curl -fsS -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/faucet/policy \
  | tee taira-faucet-policy.json

export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` 會求解工作量證明並保存確切的已簽署交易；`submit` 只傳送一次，並在交易套用後返回。如果 `submit` 回報 `Pending` 或逾時，請使用相同的設定和日誌執行 `taira account faucet resume`，而不是準備另一個申領。之後最多輪詢餘額一分鐘。

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

每次 Taira 寫入都使用 `--fee-payer authority`。此選擇與簽名繫結，CLI 會在簽署前給出以 Taira 費用資產計價的確切費用報價。

## 驗證 {#verify}

提交日誌說明,儲存 JSON 收據,並等待應用終結. 排放 `--no-wait` 也使初始提交等待確認;明確的狀態讀取證明瞭最終管道狀態.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  tx ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  tx status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

最後一個命令只有在確切的全域狀態回報經狀態解析的 `Applied` 最終性之後才會成功。請將雜湊保存在測試證據中；切勿將私鑰或完整的客戶端設定與其一起儲存。

## 解決問題 {#troubleshooting}

- 只要求 JSON 時，`/livez`、`/health` 和 `/readyz` 會返回 `406`，因為它們以 `text/plain` 回應。請傳送上面所示的 `Accept` 標頭。
- 即使 `/livez` 和 `/status` 正常運作，`/readyz` 仍可能返回帶有 `service_unavailable` 錯誤封裝的 `503`。請等待節點就緒或執行 `iroha taira doctor`；重新產生金鑰不會改變節點的就緒狀態。
- `submit` 期間出現水龍頭 `502` 或逾時，會使申領結果未知：請使用相同的設定和日誌執行 `taira account faucet resume`，而不是準備另一個申領。過時的工作量證明錨點會使 `prepare` 失敗；請在新的日誌目錄中重新準備。
- 一個 I105 前置錯誤意味著公鑰被錯誤的配置檔案編碼. 再執行 `iroha tools address convert --profile taira`.
- 費用報價被拒絕通常表示授權主體尚未注資，或設定的 `network_id` 不是 Taira 的。缺少 `--fee-payer`，或在 `--metadata` 中放入 `gas_asset_id` 之類的費用鍵，會在報價之前於本機失敗。
- 即使此金絲雀測試成功，註冊、鑄造或命名空間管理操作仍可能被拒絕。這些操作需要各自的執行階段權限；如果尚未取得 Taira 存取權，請在產生的本機網路上演練。

## 來源及相關檔案 {#source-and-related-docs}

- 固定提交中的 [Taira CLI 診斷和 canary 原始碼](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira.rs) 與[水龍頭命令](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira_onboarding.rs)
- [顯而易見的費用選擇和提交源 CLI 在固定提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Taira 帳戶和水龍頭指南](/zh-hant/get-started/sora-nexus-dataspaces.md)
- [客戶端配置](/zh-hant/guide/configure/client-configuration.md)
- [交易](/zh-hant/blockchain/transactions.md)
