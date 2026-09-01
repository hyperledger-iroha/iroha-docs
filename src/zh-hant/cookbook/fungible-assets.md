---
translation_locale: zh-hant
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 29f2bdb390fc93b97f8ed9108634f70e21ba747c8606fb84093d37e9586516c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 性資產 {#fungible-assets}

## 結果 {#outcome}

現場檢查 Taira 資產定義和完成一個登錄檔,鑄造,轉賬,銷毀和餘額驗證在生成的本地網路上流動.該操作指南使用了可信無序Base58資產定義 IDs, 域名類別,無域名 I105 帳戶 IDs, 和明確的費用支付.

## 預先條件 {#prerequisites}

- `curl`, `jq`, Python 3.11或以後, Node.js 24,和目前的 `iroha` CLI.
- 僅可讀的 Taira 訪問.
- 對於寫入演練,一個來自 [啟動 Iroha](/zh-hant/get-started/launch-iroha.md), 與 `./localnet/client.toml` 和 Torii 在 `http://127.0.0.1:8080`.

## 步驟 {#steps}

### 1. 檢查 Taira 的定義,沒有簽字者 {#_1-inspect-taira-definitions-without-a-signer}

資產定義包含一個不透明的Base58 ID,顯示名稱,可選性政策,數量尺度,可選別名,所有者和總數.具體餘額還包括其持有人帳戶和可選資料空間範圍.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] \
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity] \
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

從生成的設定中取得公鑰並據此推導本機 authority，然後選擇另一個已註冊帳戶作為接收者。此操作不會輸出任何私鑰。

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
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

DESTINATION_ACCOUNT="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg source "$SOURCE_ACCOUNT" \
      '[.items[].id | select(. != $source)][0]'
)"
```

### 3. 記錄一個數字定義 {#_3-register-a-numeric-definition}

這個僅在本地使用的 ID 是一個有效的無前置 Base58 資產定義地址.這個別名提供了人類可讀的 `domain.dataspace`投影.尺度 `2`允許兩個分數數字;省略`--mint-once`則保持預設的 `Infinitely` 政策.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'
ASSET_ALIAS='cookbook_credit#wonderland.universal'

iroha --config "$LOCAL_CONFIG" \
  --machine \
  --fee-payer authority \
  ledger asset definition register \
  --id "$ASSET_DEFINITION_ID" \
  --name cookbook_credit \
  --description 'Local cookbook credit' \
  --alias "$ASSET_ALIAS" \
  --scale 2
```

在 Taira 上不要再使用 ID. 公共網路註冊需要新的規範檔案 ID,為您的申請分配的域名/代號,費用資金和執行期的資產註冊許可.

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

在銷毀後,預計來源餘額 `64.50`,目的地餘額 `25.50`和總量 `90.00`.

::: warning 許可範圍

在 Taira 上,新增自水龍頭衍生的 `taira.tx-metadata.json`並使用`--fee-payer authority`為每次寫.註冊和造需要活躍驗證者的許可;轉移和燒燬需要對源餘額的授權主體.一個由水龍頭資助的帳戶不會自動成為發行人.

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
- 第 2 步刻意選擇已註冊的目標帳戶。如果資產准入原則為 `ExplicitOnly`，請在轉帳前透過授權流程預置目標餘額。名稱相似的 CLI 保護選項不會註冊帳戶或餘額；它會中止操作，而不是再加入一條指令。
- 在正常指示成功之前,收費被拒絕. 選擇付款人,使用網路的收費資產後設資料,並驗證其餘額.
- 如果固定的本地定義已經存在於之前的執行中,請啟動新生成的本地網路或繼續其現有的狀態.永遠不要替代錯誤成形的隨機字串為 Base58 ID.

## 來源及相關檔案 {#source-and-related-docs}

- [資產生命週期整合測試在固定的提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Rust 固定提交的資產構建例子](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [資產](/zh-hant/blockchain/assets.md)
- [指示](/zh-hant/blockchain/instructions.md)
- [許可證代幣](/zh-hant/reference/permissions.md)
- [JavaScript 和 TypeScript](/zh-hant/guide/tutorials/javascript.md)
