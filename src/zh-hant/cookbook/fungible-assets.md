---
translation_locale: zh-hant
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 3287a6bbaf06ec92ebbe9ac33a8294d4e1d232bc01fd6a5da13ddd166c620965
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# 性資產 {#fungible-assets}

## 結果 {#outcome}

檢查線上 Taira 網路的資產定義，並在生成的本地網路上完成鑄造、轉賬、銷毀和餘額驗證流程。本操作指南使用規範的無前綴 Base58 資產定義 ID、無域名的 I105 帳戶 ID，以及明確的費用支付。

## 預先條件 {#prerequisites}

- `curl`、`jq`、Python 3.11 或更新版本、Node.js 24，以及目前的 `iroha` 和 `kagami` CLIs。
- 僅可讀的 Taira 訪問.
- 對於寫入演練，需要一個按照 [啟動 Iroha](/zh-hant/get-started/launch-iroha.md) 的做法，以 `kagami localnet generate --peers 4 --out-dir ./localnet` 並加上 `--asset-definition-id 66owaQmAQMuHxPzxUN3bqZ6FJfDa` 生成的本地網路。它提供 `./localnet/client.toml`，以及位於 `http://127.0.0.1:8080` 的 Torii。

## 步驟 {#steps}

### 1. 檢查 Taira 的定義,沒有簽字者 {#_1-inspect-taira-definitions-without-a-signer}

資產定義包含不透明的 Base58 ID、顯示名稱、可鑄造性政策、數量尺度、可選別名、所有者、可選的所屬域名或資料空間、餘額政策，以及總數量。具體餘額還包括其持有人帳戶和可選的資料空間範圍。

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[]
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity]
    | @tsv'
```

```js [Node.js]
const response = await fetch(
  'https://taira.sora.org/v1/assets/definitions?limit=10',
  { headers: { Accept: 'application/json' } },
)
if (!response.ok) throw new Error(`Taira returned HTTP ${response.status}`)

const { items } = await response.json()
for (const definition of items) {
  console.log({
    id: definition.id,
    name: definition.name,
    mintable: definition.mintable,
    total: definition.total_quantity,
  })
}
```

:::

執行 JavaScript 版本使用 `node taira-assets.mjs`.公共資產 IDs 是空白的Base58值;可讀的值如 `cookbook_credit#wonderland.universal`是一個以其中一個 IDs 為代號的代號.

### 2. 準備本地授權帳戶和目的地 {#_2-prepare-the-local-authority-and-destination}

從生成的設定中取得公鑰並據此推導本機 authority，然後為新的接收者帳戶建立金鑰對並註冊該帳戶。此操作不會輸出任何私鑰。

```bash
LOCAL_CONFIG='./localnet/client.toml'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
SOURCE_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

kagami keys --out-dir ./cookbook-recipient
DESTINATION_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert \
    "$(cat ./cookbook-recipient/public.key)"
)"
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  account register --id "$DESTINATION_ACCOUNT"
```

### 3. 使用由客戶端擁有的數值定義 {#_3-use-a-client-owned-numeric-definition}

在創世之外，定義會註冊在簽署者所擁有的所屬 `--domain` 之下，而生成的本地網路的客戶端並不擁有任何域名。以 `--asset-definition-id` 生成的本地網路已經包含此定義：創世以不受限制的尺度註冊了它，將客戶端設為其所有者，並向客戶端鑄造了 1,000,000,000 個單位。

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

不要在 Taira 上重複使用該 ID。公共網路註冊需要一個新的規範 ID、一個由您的帳戶擁有的所屬域名（作為 `--domain` 傳給 `ledger asset definition register`）、任何別名所需的 `CanManageAssetDefinitionAlias` 授權，以及費用資金。

### 4. 鑄造,轉移和銷毀 {#_4-mint-transfer-and-burn}

所有寫入命令都明確選擇授權主體作為費用付款人. CLI 在簽署之前報價了準確的交易,並預設等待.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset mint \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 100.00

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset transfer \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --to "$DESTINATION_ACCOUNT" \
  --quantity 25.50

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset burn \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 10.00
```

在銷毀後,預計來源餘額 `1000000064.50`,目的地餘額 `25.50`和總量 `1000000090.00`.

::: warning 許可範圍

在 Taira 上，每次寫入都要使用 `--fee-payer authority`；CLI 會在簽署前給出以 Taira 費用資產計價的確切費用報價。註冊需要擁有定義的 `--domain`，別名還需要 `CanManageAssetDefinitionAlias`。鑄造需要擁有該定義，或持有 `CanMintAssetWithDefinition` 或 `CanMintAssetToAccount`；轉移和銷毀需要擁有對來源餘額的權限。由水龍頭注資的帳戶不會自動成為發行人。

:::

## 驗證 {#verify}

先讀取兩個實際餘額，再讀取資產定義。這些 post-state 查詢才是成功標準；僅有 submission receipt 並不足以證明成功。

```bash
iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$DESTINATION_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

應用宣告應比較數字值作為固定點數,而不是二進位制浮點值,並應當驗證定義 ID 以及帳戶.

## 解決問題 {#troubleshooting}

- 包含 ID 的 `#` 是一個字面別名或具體餘額字面值,而不是一項規範資產定義 ID.使用`--definition`的裸體Base58值,或者透過`--definition-alias`的繫結別名.
- `Scale` 錯誤意味著一個數量比定義允許的多個分數.
- `Mintability`拒絕是指`Once`, `Not`或 `Limited(n)`的政策已經耗盡或禁止造.不要重寫歷史記錄;使用定義查詢返回的政策.
- 第 2 步明確註冊目標帳戶，因此即使帳戶准入原則為 `ExplicitOnly`，轉帳也能正常進行。名稱相似的 CLI 保護選項不會註冊帳戶或餘額；它會中止操作，而不是再加入一條指令。
- 費用拒絕會在指令正常成功之前發生。請選擇付款人，檢查 CLI 費用報價中的費用資產和最高金額，並驗證該餘額。
- 在同一個本地網路上重新執行時，會從先前的餘額開始，而且 `kagami keys` 會拒絕已存在的 `./cookbook-recipient`。請啟動新生成的本地網路並刪除該目錄，或改為比較餘額的變化而非絕對值。永遠不要用格式錯誤的隨機字串替代 Base58 ID。

## 來源及相關檔案 {#source-and-related-docs}

- [資產生命週期整合測試在固定的提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/asset.rs)
- [Rust 固定提交的資產構建例子](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/examples/tutorial.rs)
- [資產](/zh-hant/blockchain/assets.md)
- [指示](/zh-hant/blockchain/instructions.md)
- [許可證代幣](/zh-hant/reference/permissions.md)
- [JavaScript 和 TypeScript](/zh-hant/guide/tutorials/javascript.md)
