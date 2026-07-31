---
translation_locale: zh-hant
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 9391bab95aa0ee20c7f036cc175f3a6d3a8852e6ea90b09d9ebf1a838973c765
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 運行 Iroha 3 透過 CLI {#operate-iroha-3-via-cli}

其他國家 `iroha` 單元是命令行客戶端 Iroha 3. 使用它查詢
總帳號,提交交易和檢查運營商的終點.

## 1. 必須的前提 {#_1-prerequisites}

開始一個本地網路:

- [發射 Iroha 3](./launch-iroha.md)

下面的例子假設來自本地網路的客戶端配置
成立於 [發射 Iroha 3](./launch-iroha.md):

```bash
./localnet/client.toml
```

## 2.基本的情況 CLI 設置 {#_2-basic-cli-setup}

顯示最高層次的幫助:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

其他國家 CLI 組織成這些最高級指挥組:

- `account` 針對會計的快捷方式
- `tx` 對交易水平的助手
- `ledger` 在帳簿上閱讀和寫作
- `ops` 為了操作員診斷
- `app` 適用於應用程式 API 助手
- `contract` 請負部署和呼籲
- `tools` 對於診斷和開發人員的公用品
- `taira` 關於 Taira 及其他 Nexus- 工作流程

其他國家 `ledger` 該團體也包含特定域的交易助手,
`ledger transaction`.

使用 `--output-format text` 對於可閱讀的人體操作員的輸出, `--machine`
適用於嚴格自動化模式.

## 3. 試圖向公眾展示 Taira 測試網 {#_3-try-the-public-taira-testnet}

您可以試看閱讀. Taira 在執行本地同行或建立一個
這些命令使用公眾 Torii JSON 沒有使用測試網的路線
XOR.

檢查 Taira 健康:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

列出這些公共領域 `universal` 數據空間:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

列出一些資產定義及其目前供應:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

如果您有電流, `iroha` 執行這個 Taira 診斷助理:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

創建 `taira.client.toml` 只有當你準備試驗簽名命令時.
請看 [接觸到 SORA Nexus 數據區域](/zh-hant/get-started/sora-nexus-dataspaces.md)
請不要使用任何命令,
Taira 在該帳戶由水龙頭手續費資產提供資金之前.

任何付費 Taira CLI 預防水管助手
[獲得測試網 XOR 在 Taira](/zh-hant/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
這樣的 `taira_faucet_claim.py`, 接著要求測試網 XOR 首先:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

如果水龙头拼圖或索取路徑返回 `502`, 這就是一個很棒的方法.
公共測試網可用性問題,而不是一個重建帳戶密碼的訊號.

在預算表顯示後, 附加收費資產元數據寫:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. 基本帳號命令 {#_4-basic-ledger-commands}

列出所有域名:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

常見的域名創建使用宣言名稱規劃器; `ledger
domain` 沒有命令 `register` 預備一個無秘密的任務.
`AliasSetupPlanRequestV1` 目的是 `docs.universal` 在你的 SDK 或是
預訂並使用:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

意圖將資料空間固定 ID, 經典所有者帳戶,租賃期限,
預算器檢查現實狀態,並返回正確的
原子能 `EnsureAlias` 請不要將其他值複製.
網路的使用.

發送一個簡單的ping交易:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

閱讀最近的區塊或訂閱區塊事件:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. 操作員指令 {#_5-operator-commands}

意見共識狀態:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi status
```

暫停使用時間:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

收藏者, RBC 預備量,以及 VRF 快速拍攝:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

在連鎖上共識參數:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## 6. 接下來要去哪裡? {#_6-where-to-go-next}

- [SDK 學習教程](/zh-hant/guide/tutorials/)
- [Torii 目的地](/zh-hant/reference/torii-endpoints.md)
- [工作與 Iroha 二进制](/zh-hant/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md)

若要從源頭查詢中恢復完整的 Markdown 幫助快照,

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
