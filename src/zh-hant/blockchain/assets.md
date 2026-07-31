---
translation_locale: zh-hant
translation_source: /blockchain/assets.md
translation_source_hash: 58c9f7657f5714dc4bbb884933a1c947687fcf6c83e471007e6c7885f1dab214
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 資產 {#assets}

其他國家 Iroha 數值是一個帳戶持有的數值余额.
均衡指數為 `AssetDefinition`, 定義描述了如何
這項資產可以命名,造,顯示和分割.

## 資產的定義 {#asset-definition}

其他國家 `AssetDefinition` 含有:

- `id`: 經典資產定義地址
- `name`: 顯示器名稱,可讀取
- `description`: 選擇性可閱讀人體的描述
- `alias`: 其他名稱 `<name>#<domain>.<dataspace>` 或是
  `<name>#<dataspace>` 形式
- `spec`: 對平衡的數字精度和限制
- `mintable`: 實施可靠性政策
- `logo`: 選擇性 `SoraFS` URI
- `metadata`: 任意的關鍵值元數據
- `balance_scope_policy`: 是否是全球性的,
  數據空間限制
- `owned_by`: 註冊或擁有定義的帳戶
- `total_quantity`: 已發行的總量
- `confidential_policy`: 保護資產運營政策

資產的定義 IDs 沒有任何可觀的地址.
建立在一個域名和名稱上, Iroha 能保留這個域名
預測時間 UX 但法典文本形式是生成的
這裡的地址.

## 資產平衡 {#asset-balance}

其他國家 `Asset` 含有:

- `id`: 其他國家 `AssetId`, 結合資產定義,持有者帳戶,
  以及可選擇的平衡範圍
- `value`: 其他 `Numeric` 平衡

持有者帳戶是法規的,沒有域名.
預測在一個數據空間合格的域下,例如
`payments.universal`.

## 可使用 {#mintability}

資產定義支持以下可控性模式:

| 方式         | 含義                                                           |
| ------------ | ----------------------------------------------------------------- |
| `Infinitely` | 這項資產可以重複造和燃燒.    |
| `Once`       | 這項證券可以一次造,        |
| `Not`        | 這項指令可燃燒,       |
| `Limited(n)` | 只有限量其他操作可使用造. |

使用 `Infinitely` 對正常彈性資產而言, `Once` 或是 `Limited(n)` 關於
固定供應或有限供應的資產. `Not` 作为一个初始
除非資產供應已經確定.

## 預算的範圍 {#balance-scope}

其他國家 `balance_scope_policy` 控制平衡如何進行:

- `Global`: 每個帳戶和資產的定義
- `DataspaceRestricted`: 數據空間背景下分為平衡

數據空間限制的余額是有用的,
在多種情況下使用 Nexus 數據區域,但平衡必須保持隔離.

## 試著使用 Taira {#try-it-on-taira}

這些只能閱讀的通話顯示了對公眾真正的資產定義 Taira 檢測網:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

找到電流 Taira XOR 收費資產的定義:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

找包含元數據的定義:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

這三個例子都是可讀的. Taira, 使用 a
預算和預算的流量
[接觸到 SORA Nexus 數據區域](/zh-hant/get-started/sora-nexus-dataspaces.md).

付費的費用 Taira 儲存水管助手的方法
[獲得測試網 XOR 在 Taira](/zh-hant/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
這樣的 `taira_faucet_claim.py`, 接著先要求水龙头的資產,
交易氣體資產:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

接著包括 `--metadata ./taira.tx-metadata.json` 在 `ledger asset mint`,
`ledger asset burn`, 及其他 `ledger asset transfer` 沒有任何指令.

## 指示 {#instructions}

該產品可注冊,造,燃燒和轉移. Iroha
特別指示:

- [`Register` 及其他 `Unregister`](/zh-hant/blockchain/instructions.md#un-register)
- [`Mint` 及其他 `Burn`](/zh-hant/blockchain/instructions.md#mint-burn)
- [`Transfer`](/zh-hant/blockchain/instructions.md#transfer)
- [`SetKeyValue` 及其他 `RemoveKeyValue`](/zh-hant/blockchain/instructions.md#setkeyvalue-removekeyvalue)

查看以下內容:

- [CLI 導覽](/zh-hant/get-started/operate-iroha-via-cli.md)
- [Rust 學習教程](/zh-hant/guide/tutorials/rust.md)
- [Python 學習教程](/zh-hant/guide/tutorials/python.md)
- [JavaScript/TypeScript 學習教程](/zh-hant/guide/tutorials/javascript.md)
- [數據模型](/zh-hant/blockchain/data-model.md)
- [NFTs](/zh-hant/blockchain/nfts.md)
