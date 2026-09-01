---
translation_locale: zh-hant
translation_source: /cookbook/metadata.md
translation_source_hash: bb486994faabb29fb48609a886862e44e565148be4800ec1244218ef37e2e54b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 超級資料 {#metadata}

## 結果 {#outcome}

閱讀 Taira 上的後設資料,設定和驗證一個帳戶後設資料值,使用明確支付費用的交易,然後再次刪除該價值.您將將帳本物件後設資料與交易費用後設資料分開.

## 預先條件 {#prerequisites}

- `curl`,`jq`, Python 3.11或以後的電流,以及 `iroha` CLI.
- 資助的 `taira.client.toml`和`taira.tx-metadata.json`從 [連線到 Taira](./connect-to-taira.md).
- 對目標帳戶的後設資料進行授權主體.該示例針對配置授權主體本身;另一個帳戶需要準確的許可.

## 步驟 {#steps}

### 1. 沒有簽字者閱讀後設資料 {#_1-read-metadata-without-a-signer}

後設資料是經過檢查的 `Name` 到 JSON 的映射。空映射和經過篩選的空輸出都是有效結果。

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

使用小描述或索引欄位的後設資料.將大型有效載荷從賬本中刪除,而不是儲存 URI 或 SoraFS 引用.

### 2. 匯出目標帳戶 {#_2-derive-the-target-account}

僅從 Taira 配置中閱讀公鑰,並將其轉換為無域名的法規形式 I105.

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

### 3. 設定一個值 JSON {#_3-set-one-json-value}

從標準輸入讀取的 JSON 會成為帳戶的 `cookbook_profile` 值。相比之下，`--metadata ./taira.tx-metadata.json` 會把費用欄位附加到交易封裝。兩者是目標與用途不同的映射。

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

CLI 預設報價費用,簽字,提交和等待. 當下一次操作取決於此值時,不要新增 `--no-wait`.

::: warning 許可範圍

活躍驗證器決定誰可以突變每個物件.更新另一個帳戶通常需要 `CanModifyAccountMetadata`;域名,資產定義, NFTs,並觸發器有自己的目標特定的後設資料許可權.如果 Taira 沒有授予所需許可權,執行相同的帳戶命令與 `./localnet/client.toml`,替代生成的本地網路授權主體機構的規範 I105 ID,並省略 Taira 費用後設資料檔案. 保持明確的本地支付費者選擇.

:::

### 4. 移除鑰匙 {#_4-remove-the-key}

首先讀取提交值,然後提交單獨的移動交易.

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

對於 Python 應用程式,符合型別的構建器是`Instruction.set_account_key_value`和`Instruction.remove_account_key_value`;提交它們與交易後設資料以及從 [Python 教程](/zh-hant/guide/tutorials/python.md#shared-setup)的等待輔助員.

## 驗證 {#verify}

在設定交易後, `meta get`必須將物件返回以 `version: 1`.在刪除之後,直接搜尋不再可以返回一個值:

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

單獨帳戶讀取區分缺失的後設資料金鑰與網路或帳戶故障.生產程式碼也應在設定後驗證整個 JSON 值.

## 解決問題 {#troubleshooting}

- 標準輸入必須包含一個有效的 JSON 值.字串需要 JSON 報價;物件和陣列必須是很好的.
- 分析後,後設資料金鑰是`Name`值,並且對案例敏感.保持穩定的關鍵詞彙,而不是為每一個方案更改建立版本金鑰.
- `--metadata`是交易後設資料;它不設定賬本物件後設資料.使用實體的`meta set`子命令用於後者.
- 一個成功提交後的舊閱讀可能會延遲傳播. 等待應用終結,然後在重新提交之前再試查詢.
- 權限拒絕會標識目標物件和權限邊界。在本機演練或申請確切的權杖；不要為了繞過存取控制而把私人應用資料移到公開的後設資料欄位。
- 永遠不要將私鑰,原始的個人識別符號,訪問代幣或大型檔案儲存在後設資料中.

## 來源及相關檔案 {#source-and-related-docs}

- [在固定的提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/queries/metadata.rs)中測試對後設資料查詢整合
- [Python SDK 交易構建者在固定的提交上](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/README.md)
- [超值資料](/zh-hant/blockchain/metadata.md)
- [大資料和賬本儲存的選擇](/zh-hant/guide/configure/metadata-and-store-assets.md)
- [指示參考](/zh-hant/reference/instructions.md)
- [許可證代幣](/zh-hant/reference/permissions.md)
