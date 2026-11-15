---
translation_locale: zh-hant
translation_source: /blockchain/assets.md
translation_source_hash: f5f0eb99e76287db695cc21b8580fd2a9b4dc2a989237c1a1d3d7333c14561ce
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# 資產 {#assets}

一個 Iroha 資產是一個帳戶持有的數值餘額.每個具體的餘額指向一個 `AssetDefinition`,定義描述了該資產可以如何命名、鑄造、顯示和分割槽.

## 資產的定義 {#asset-definition}

一個 `AssetDefinition` 包含:

- `id`:資產定義規範地址
- `name`:可以讀取的人類顯示名稱
- `description`:可供人類閱讀的選擇性描述
- `alias`:在`<name>#<domain>.<dataspace>`或 `<name>#<dataspace>`形式中使用可選的別名
- `spec`:對餘額的數值精度和限制
- `mintable`:可接受性政策
- `logo`:可選的 `SoraFS` URI
- `metadata`:任意的關鍵值後設資料
- `balance_scope_policy`：餘額屬於全域，或受資料空間範圍限制
- `owning_domain`：由網域擁有的定義所屬的網域；直接在資料空間中註冊的定義不含此欄位
- `owned_by`:已註冊或擁有定義的帳戶
- `total_quantity`:發行總量
- `confidential_policy`:保護資產運營的政策

資產定義 IDs 是規範的不透明地址.當從域名和名稱構建一個定義時, Iroha 可以保留該域名/名稱投影為 UX 和查詢,但規範的文字形式就是生成的地址.

## 資產餘額 {#asset-balance}

一個 `Asset` 包含:

- `id`:結合資產定義,持有者帳戶和可選餘額範圍的`AssetId`
- `value`:一個 `Quantity`的餘額

持有者帳戶採用不含網域的標準身分。資產定義可呈現在附有資料空間限定名稱的網域下，例如 `payments.universal`。

## 料可使用 {#mintability}

資產定義支援以下可 mintability模式:

|模式|這意味著|
| ------------ | ----------------------------------------------------------------- |
|`Infinitely`|彈性供應.資產可以多次鑄造和銷毀. |
|`Once`|固定供應代幣,只能鑄造一次,之後可以銷毀.|
|`Not`|固定供應代幣可以銷毀,但不能再次鑄造.|
|`Limited(n)`|該政策允許在有限數量的額外交易中發行新資產單元. |

使用 `Infinitely`用於正常彈性資產和`Once`或 `Limited(n)`用於固定供應或有限供應的資產.除非資產供應已經確定,否則不要作為初始政策使用 `Not`.

## 資產負債範圍 {#balance-scope}

`balance_scope_policy` 控制了餘額的執行方式:

- `Global`:每個帳戶和資產定義的1個餘額桶
- `DataspaceRestricted`：餘額依資料空間脈絡分區

當多個 SORA Nexus 資料空間使用同一資產定義，但餘額必須彼此隔離時，可使用受資料空間限制的餘額。

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

尋找含有後設資料的定義:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

這三個範例都是讀取操作。若要在 Taira 上鑄造、銷毀或轉移資產，請使用已由測試網資金服務注資的帳戶，並遵循[使用 Taira 和 Minamoto 在 SORA Nexus 上開發](/zh-hant/get-started/sora-nexus-dataspaces.md)中設有檢查保護的流程。

執行需要支付費用的 Taira 資產範例前，請先透過[在 Taira 取得測試網 XOR](/zh-hant/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)所列的資金申領流程，為簽署帳戶注資。接著在 `ledger asset mint`、`ledger asset burn` 和 `ledger asset transfer` 命令中傳入 `--fee-payer authority`；CLI 會在簽署前，以 Taira 的費用資產計算確切費用：

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  ledger asset transfer \
  --definition "<ASSET_DEFINITION_BASE58>" \
  --account "<TAIRA_I105_ACCOUNT_ID>" \
  --to "<RECIPIENT_I105_ACCOUNT_ID>" \
  --quantity 1
```

## 指示 {#instructions}

資產可以以 Iroha 特殊指令進行註冊,鑄造,銷毀和轉讓:

- [`Register`和 `Unregister`](/zh-hant/blockchain/instructions.md#un-register)
- [`Mint`和 `Burn`](/zh-hant/blockchain/instructions.md#mint-burn)
- [`Transfer`](/zh-hant/blockchain/instructions.md#transfer)
- [`SetKeyValue`和 `RemoveKeyValue`](/zh-hant/blockchain/instructions.md#setkeyvalue-removekeyvalue)

此外,請參見:

- [CLI 指南](/zh-hant/get-started/operate-iroha-via-cli.md)
- [Rust 教程](/zh-hant/guide/tutorials/rust.md)
- [Python 教程](/zh-hant/guide/tutorials/python.md)
- [JavaScript/TypeScript 教程](/zh-hant/guide/tutorials/javascript.md)
- [資料模型](/zh-hant/blockchain/data-model.md)
- [NFTs](/zh-hant/blockchain/nfts.md)
