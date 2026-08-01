---
translation_locale: zh-hant
translation_source: /blockchain/assets.md
translation_source_hash: c80e6025007653b355d373394465d04adefc1221c8f34d9008f1c9cbabd3dc40
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 資產 {#assets}

一個 Iroha 資產是一個賬戶持有的數值餘額.每個具體的餘額指向一個 `AssetDefinition`,定義描述了該資產可以如何命名,造,顯示和分區.

## 資產的定義 {#asset-definition}

一個 `AssetDefinition` 包含:

- `id`:資產定義規範地址
- `name`:可以讀取的人類顯示名稱
- `description`:可供人類閱讀的選擇性描述
- `alias`:在`<name>#<domain>.<dataspace>`或 `<name>#<dataspace>`表格中使用可選的別名
- `spec`:對平衡的數值精度和限制
- `mintable`:可接受性政策
- `logo`:可選的 `SoraFS` URI
- `metadata`:任意的關鍵值元數據
- `balance_scope_policy`:資產負債是否是全球性或數據空間有限的
- `owned_by`:已註冊或擁有定義的賬戶
- `total_quantity`:發行總量
- `confidential_policy`:保護資產運營的政策

資產定義 IDs 是正規的不透明地址.當從域名和名稱構建一個定義時, Iroha 可以保留該域名/名稱投影爲 UX 和查詢,但正規的文本形式就是生成的地址.

## 資產平衡 {#asset-balance}

一個 `Asset` 包含:

- `id`:結合資產定義,持有者賬戶和可選餘額範圍的`AssetId`
- `value`:一個 `Numeric`的餘額

持有者賬戶是規範性的,無域名的.資產定義可以在一個數據空間合格的域名下進行預測,例如 `payments.universal`.

## 料可使用 {#mintability}

資產定義支持以下可 mintability模式:

|模式|這意味着|
| ------------ | ----------------------------------------------------------------- |
|`Infinitely`|彈性供應.資產可以多次造和燃燒. |
|`Once`|固定供應代幣,可以一次造,然後燒掉.|
|`Not`|固定供應的代幣可以被燒燬,但不能再發明.|
|`Limited(n)`|該政策允許在有限數量的額外交易中發行新資產單元. |

使用 `Infinitely`用於正常彈性資產和`Once`或 `Limited(n)`用於固定供應或有限供應的資產.除非資產供應已經確定,否則不要作爲初始政策使用 `Not`.

## 資產負債範圍 {#balance-scope}

`balance_scope_policy` 控制了平衡的運行方式:

- `Global`:每個賬戶和資產定義的1個餘額桶
- `DataspaceRestricted`:按數據空間背景劃分了餘額

在多個 Nexus 數據庫中使用相同資產定義時,數據空間限制的餘額是有用的,但必須保持孤立的餘額.

## 在 Taira 試看. {#try-it-on-taira}

這些只可閱讀的呼叫顯示了公共 Taira 測試網上的實際資產定義:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

找當前 Taira XOR 費用資產定義:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

尋找含有元數據的定義:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

所有三種例子都是可以讀的. Taira, 使用水龍頭資助的賬戶和保證流量 [連接到 SORA Nexus 數據庫](/zh-hant/get-started/sora-nexus-dataspaces.md).

在付費資產 Taira 示例中,保存從 [獲取 Taira](/zh-hant/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)上測試網 XOR 爲 `taira_faucet_claim.py`,然後首先索賠水龍頭資產並將其作爲交易氣體資產:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

然後在 `ledger asset mint`,`ledger asset burn`和 `ledger asset transfer`命令中輸入 `--metadata ./taira.tx-metadata.json`.

## 指示 {#instructions}

資產可以以 Iroha 特殊指令進行註冊,造,燃燒和轉讓:

- [`Register`和 `Unregister`](/zh-hant/blockchain/instructions.md#un-register)
- [`Mint`和 `Burn`](/zh-hant/blockchain/instructions.md#mint-burn)
- [`Transfer`](/zh-hant/blockchain/instructions.md#transfer)
- [`SetKeyValue`和 `RemoveKeyValue`](/zh-hant/blockchain/instructions.md#setkeyvalue-removekeyvalue)

此外,請參見:

- [CLI 指南](/zh-hant/get-started/operate-iroha-via-cli.md)
- [Rust 教程](/zh-hant/guide/tutorials/rust.md)
- [Python 教程](/zh-hant/guide/tutorials/python.md)
- [JavaScript/TypeScript 教程](/zh-hant/guide/tutorials/javascript.md)
- [數據模型](/zh-hant/blockchain/data-model.md)
- [NFTs](/zh-hant/blockchain/nfts.md)
