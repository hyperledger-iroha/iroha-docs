---
translation_locale: zh-hant
translation_source: /cookbook/metadata.md
translation_source_hash: 07b065b28eca44939a92b40a81a47b57178de4539abb0daf51913969e34eced7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 超級數據 {#metadata}

## 結果 {#outcome}

閱讀 Taira 上的元數據,設置和驗證一個帳戶元數據值,使用明確支付費用的交易,然後再次刪除該價值.您將將本書對象元數據與交易費用元數據分開.

## 預先條件 {#prerequisites}

- `curl`,`jq`, Python 3.11或以後的電流,以及 `iroha` CLI.
- 資助的 `taira.client.toml`和`taira.tx-metadata.json`從 [連接到 Taira](./connect-to-taira.md).
- 對目標帳戶的元數據進行權威.該示例針對配置權威本身;另一個帳戶需要準確的許可.

## 步驟 {#steps}

### 1. 沒有簽字者閱讀元數據 {#_1-read-metadata-without-a-signer}

測量數據是檢查的`Name`到 JSON 地圖.空地圖和空的過輸出是有效的結果.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[] \
    | select((.metadata // {} | length) > 0) \
    | {id, name, metadata}'

curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

使用小描述或索引字段的元數據.將大型有效載荷從賬本中刪除,而不是存儲 URI 或 SoraFS 引用.

### 2. 導出目標賬戶 {#_2-derive-the-target-account}

僅從 Taira 配置中閱讀公鑰,並將其轉換爲無域名的法規形式 I105.

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
```

### 3. 設置一個值 JSON {#_3-set-one-json-value}

從標準輸入中讀取的 JSON 成爲賬戶的 `cookbook_profile` 值.相反,`--metadata ./taira.tx-metadata.json` 將費用字段添加到交易包裹中.這兩個地圖具有不同的目標和目的.

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      --metadata ./taira.tx-metadata.json \
      ledger account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

CLI 默認引用費用,簽字,提交和等待. 當下一次操作取決於此值時,不要添加 `--no-wait`.

::: warning 許可範圍

活躍驗證器決定誰可以突變每個對象.更新另一個帳戶通常需要 `CanModifyAccountMetadata`;域名,資產定義, NFTs,並觸發器有自己的目標特定的元數據權限.如果 Taira 沒有授予所需權限,運行相同的帳戶命令與 `./localnet/client.toml`,替代生成的本地網絡權威機構的常規 I105 ID,並省略 Taira 費用元數據文件. 保持明確的本地支付費者選擇.

:::

### 4. 移除鑰匙 {#_4-remove-the-key}

首先讀取承諾值,然後提交單獨的移動交易.

```bash
iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

對於 Python 應用程序,符合類型的構建器是`Instruction.set_account_key_value`和`Instruction.remove_account_key_value`;提交它們與交易元數據以及從 [Python 教程](/zh-hant/guide/tutorials/python.md#shared-setup)的等待輔助員.

## 驗證 {#verify}

在設置交易後, `meta get`必須將對象返回以 `version: 1`.在刪除之後,直接搜索不再可以返回一個值:

```bash
iroha --config ./taira.client.toml --machine ledger account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile; then
  printf '%s\n' 'metadata key still exists' >&2
  exit 1
else
  printf '%s\n' 'metadata key removed'
fi
```

單獨賬戶讀取區分缺失的元數據密鑰與網絡或帳戶故障.生產代碼也應在設置後驗證整個 JSON 值.

## 解決問題 {#troubleshooting}

- 標準輸入必須包含一個有效的 JSON 值.字符串需要 JSON 報價;對象和陣列必須是很好的.
- 分析後,元數據密鑰是`Name`值,並且對案例敏感.保持穩定的關鍵詞彙,而不是爲每一個方案更改創建版本密鑰.
- `--metadata`是交易元數據;它不設置賬本對象元數據.使用實體的`meta set`子命令用於後者.
- 一個成功提交後的舊閱讀可能會延遲傳播. 等待應用終結,然後在重新提交之前再試查詢.
- 拒絕許可識別目標對象和權限邊界. 在本地進行反或要求準確的代幣;不要將私人應用數據移動到公開的元數據領域以避免訪問控制.
- 永遠不要將私鑰,原始的個人標識符,訪問代幣或大型文件存儲在元數據中.

## 來源及相關文件 {#source-and-related-docs}

- [在固定的提交](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/queries/metadata.rs)中測試對元數據查詢集成
- [Python SDK 交易構建者在固定的承諾上](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/python/iroha_python/README.md)
- [超值數據](/zh-hant/blockchain/metadata.md)
- [大數據和賬本存儲的選擇](/zh-hant/guide/configure/metadata-and-store-assets.md)
- [指示參考](/zh-hant/reference/instructions.md)
- [許可證代幣](/zh-hant/reference/permissions.md)
