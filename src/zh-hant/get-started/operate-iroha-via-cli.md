---
translation_locale: zh-hant
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 5fb7abd4e152ece715a8337e8ef8e75330f634d2a1b26e0c5bd8308f1f3793a9
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# 透過 CLI 執行 Iroha 3 {#operate-iroha-3-via-cli}

`iroha`二進位制是 Iroha 3 的命令列客戶端. 使用它查詢賬本狀態,提交交易和檢查操作員端點.

## 1.先決條件 {#_1-prerequisites}

首先啟動一個本地網路:

- [啟動 Iroha 3](./launch-iroha.md)

在 [啟動 Iroha 3](./launch-iroha.md)中建立的本地網路中生成的客戶端配置:

```bash
./localnet/client.toml
```

## 2. 基本的 CLI 設定 {#_2-basic-cli-setup}

展示最高水平的幫助:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI 分為以下最高階別指揮組:

- `account`：讀取及修改帳戶
- `explorer`：提供使用共用篩選條件與分頁方式的區塊瀏覽器資料流
- `tx`：查詢交易狀態與使用交易輔助工具
- `ledger`用於鏈上讀取和寫入
- `trigger`：讀取、寫入及執行觸發器
- `ops` 用於操作員診斷
- `app`用於應用程式的 API 助手
- `contract`：合約呼叫、檢視及本機偵錯；部署則使用 `kagami contract deploy` 或 `musubi deploy`
- `tools`用於診斷和開發者公用事業
- `dataspace`：規劃、套用及檢視資料空間定義
- `taira`：執行 Taira 診斷與帳戶導入流程
- `offline`：使用離線編碼器、報告及診斷
- `soracloud`：使用 Soracloud 應用程式平台輔助工具
- `sccp`：執行 SORA 跨鏈協定的讀取、轉移與證明操作

每個提交交易的命令都必須明確指定費用支付者，例如 `--fee-payer authority`；CLI 會在簽署前計算確切費用。

使用 `--output-format text`用於人可讀操作員輸出和 `--machine`用於嚴格的自動化模式.

## 3. 嘗試公共測試網 Taira {#_3-try-the-public-taira-testnet}

在執行本地對等節點或建立簽名器之前,您可以嘗試僅閱讀的 Taira 檢查.這些命令使用公共的 Torii JSON 路線,並且不使用測試網 XOR.

檢查 Taira 的狀態:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

列出 `universal` 資料空間中的公開網域：

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

列出一些資產定義及其當前供應:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

如果您有當前的 `iroha`二進位制,請執行 Taira 診斷輔助器:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

只有在準備好測試簽署命令時，才建立 `taira.client.toml`。設定、測試網資金申領及基本測試流程，請參閱[連線至 SORA Nexus 資料空間](/zh-hant/get-started/sora-nexus-dataspaces.md)。在帳戶取得測試網資金服務提供的費用資產前，不要對 Taira 執行寫入命令。

執行任何需要支付費用的 Taira CLI 範例前，請先透過[在 Taira 取得測試網 XOR](/zh-hant/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)所列的資金申領流程為簽署帳戶注資，再檢查餘額：

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

若測試網資金服務的路由回傳 `502`，請等待並重試。這是公開測試網的可用性問題，不代表需要重新產生帳戶金鑰。

餘額可見後，請用 `--fee-payer authority` 提交寫入操作。CLI 會在簽署前，以 Taira 的費用資產計算確切費用：

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "hello from faucet-funded taira"
```

## 4. 基本賬本指令 {#_4-basic-ledger-commands}

列出所有域名:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

普通域名建立使用宣告別名計劃器; `ledger domain` 命令沒有 `register` 準備一個無秘密的機器. `AliasSetupPlanRequestV1` 目的 `docs.universal` 和你的 SDK 或安裝服務,然後規劃並應用:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

此意圖固定資料空間 ID、標準擁有者帳戶、租期與目前的報價檢查條件。規劃器會驗證即時狀態，並傳回要提交的確切原子 `EnsureAlias` 計畫。不要手動複製其他網路的檢查值。

傳送一個簡單的ping交易:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority tx ping --msg "hello from iroha"
```

閱讀最近的區塊或訂閱區塊事件:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. 操作員指揮 {#_5-operator-commands}

共識操作員命令需要允許清單中的執行時金鑰。不要將它放入 `client.toml`；請以絕對路徑指定僅限擁有者存取的檔案：

```bash
: "${OPERATOR_KEY_FILE:=$PWD/secrets/operator.key}"

cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
```

無權威排隊,管道,選舉和通道診斷:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
```

已提交的共識通道與本節點的實例狀態：

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi lanes
```

鏈上共識引數:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi params
```

## 6. 接下來要去哪裡 {#_6-where-to-go-next}

- [SDK 教程](/zh-hant/guide/tutorials/)
- [Torii 端點](/zh-hant/reference/torii-endpoints.md)
- [與 Iroha 二進位制](/zh-hant/reference/binaries.md) 合作
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)

若要從原始碼工作副本輸出完整的 Markdown 說明快照，請執行：

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > iroha-cli-help.md
```
