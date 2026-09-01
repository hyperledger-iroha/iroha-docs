---
translation_locale: zh-hant
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: c070c86b715b36079a7b6a47de2e31144187d7ebc6309f294a346be61a372660
translation_status: machine-validated
translation_engine: nllb-200-ct2
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

- `account` 針對帳戶指導的快捷方式
- `tx` 對於交易級助理
- `ledger`用於鏈上讀取和寫入
- `ops` 用於操作員診斷
- `app`用於應用程式的 API 助手
- `contract` 關於合同部署和呼叫
- `tools`用於診斷和開發者公用事業
- `taira` 對於 Taira 和 Nexus- 工作流程

`ledger`集團還包含特定領域的交易助理,如`ledger transaction`.

使用 `--output-format text`用於人可讀操作員輸出和 `--machine`用於嚴格的自動化模式.

## 3. 嘗試公共測試網 Taira {#_3-try-the-public-taira-testnet}

在執行本地對等節點或建立簽名器之前,您可以嘗試僅閱讀的 Taira 檢查.這些命令使用公共的 Torii JSON 路線,並且不使用測試網 XOR.

檢查 Taira 的狀態:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

列出 `universal` 資料空間中的公共域名:

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

僅在準備測試簽署命令時建立 `taira.client.toml`.檢視[連線到 SORA Nexus 資料空間](/zh-hant/get-started/sora-nexus-dataspaces.md)為配置,水龍頭和 canary 流程.直到帳戶透過水龍頭費資產融資之前,不要對 Taira 進行寫入命令.

對於任何付費 Taira CLI 例如,拯救水龍頭輔助器 [獲取測試網 XOR 在 Taira](/zh-hant/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) 作為 `taira_faucet_claim.py`, 然後索賠測試網 XOR 首先:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

如果水龍頭拼圖或索賠路線返回 `502`,請等待,再試一次.這是一個公共測試網可用性問題,而不是一個重建帳戶金鑰的訊號

在餘額可見後,附加費用資產的後設資料以寫:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. 基本賬本指令 {#_4-basic-ledger-commands}

列出所有域名:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

普通域名建立使用宣告別名計劃器; `ledger domain` 命令沒有 `register` 準備一個無秘密的機器. `AliasSetupPlanRequestV1` 目的 `docs.universal` 和你的 SDK 或安裝服務,然後規劃並應用:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

意圖鍵是資料空間 ID,規範所有者帳戶,租期限和當前報價保護.計劃器驗證現實狀態並返回提交的精確原子`EnsureAlias`計劃.不要手動複製其他網路的保護值.

傳送一個簡單的ping交易:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

閱讀最近的區塊或訂閱區塊事件:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. 操作員指揮 {#_5-operator-commands}

共識操作員命令需要一個允許列出的執行階段金鑰.將其保持在 `client.toml`之外,並明確傳遞僅限所有者讀取的檔案:

```bash
: "${OPERATOR_KEY_FILE:=./secrets/operator.key}"

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

最高和最密封的定數證書:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi qc
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
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/README.md)

為了從源檢查中恢復一個完整的Markdown幫助快照,執行:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
