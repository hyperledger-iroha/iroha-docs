---
translation_locale: zh-hant
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 669b5a1c12e9ab6ffb64e149148993e7b924feb29c6fa4db883a2065f58ecd7e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 性資產 {#fungible-assets}

## 結果 {#outcome}

現場檢查 Taira 資產定義和完成一個註冊表,硬幣,轉賬,燃燒和平衡驗證在生成的本地網絡上流動.該配方使用了可信無序Base58資產定義 IDs, 域名類別,無域名 I105 賬戶 IDs, 和明確的費用支付.

## 預先條件 {#prerequisites}

- `curl`, `jq`, Python 3.11或以後, Node.js 24,和目前的 `iroha` CLI.
- 僅可讀的 Taira 訪問.
- 對於寫入通行,一個來自 [發射 Iroha](/zh-hant/get-started/launch-iroha.md), 與 `./localnet/client.toml` 和 Torii 在 `http://127.0.0.1:8080`.

## 步驟 {#steps}

### 1. 檢查 Taira 的定義,沒有簽字者 {#_1-inspect-taira-definitions-without-a-signer}

資產定義包含一個不透明的Base58 ID,顯示名稱,可選性政策,數量尺度,可選別名,所有者和總數.具體餘額還包括其持有人帳戶和可選數據空間範圍.

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

運行 JavaScript 表格使用 `node taira-assets.mjs`.公共資產 IDs 是空白的Base58值;可讀的值如 `cookbook_credit#wonderland.universal`是一個以其中一個 IDs 爲代號的代號.

### 2. 準備地方政府和目的地 {#_2-prepare-the-local-authority-and-destination}

從生成的配置中公鑰中提取本地當局,然後選擇另一個註冊帳戶作爲接收者.

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

這個僅在本地使用的 ID 是一個有效的無前置 Base58 資產定義地址.這個別名提供了人類可讀的 `domain.dataspace`投影.尺度 `2`允許兩個分數數字;省略`--mint-once`則保持默認的 `Infinitely` 政策.

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

在 Taira 上不要再使用 ID. 公共網絡註冊需要新的法典文件 ID,爲您的申請分配的域名/代號,費用資金和運行期的資產註冊許可.

### 4. 薄荷,轉移和燃燒 {#_4-mint-transfer-and-burn}

所有寫字命令都明確選擇權威作爲費用付款人. CLI 在簽署之前引用了準確的交易,並默認等待.

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

在燃燒後,預計來源餘額 `64.50`,目的地餘額 `25.50`和總量 `90.00`.

::: warning 許可範圍

在 Taira 上,添加自龍頭衍生的 `taira.tx-metadata.json`並使用`--fee-payer authority`爲每次寫.註冊和造需要活躍驗證者的許可;轉移和燒燬需要對源餘額的權威.一個由龍頭資助的賬戶不會自動成爲發行人.

:::

## 驗證 {#verify}

閱讀兩個具體的平衡和定義. 這些國家後的查詢是成功標準;提交收據本身並非.

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

應用聲明應比較數字值作爲固定點數,而不是二進制浮點值,並應當驗證定義 ID 以及帳戶.

## 解決問題 {#troubleshooting}

- 包含 ID 的 `#` 是一個字面別名或混凝土平衡字母,而不是一項常規資產定義 ID.使用`--definition`的裸體Base58值,或者通過`--definition-alias`的綁定別名.
- `Scale` 錯誤意味着一個數量比定義允許的多個分數.
- `Mintability`拒絕是指`Once`, `Not`或 `Limited(n)`的政策已經耗盡或禁止造.不要重寫歷史記錄;使用定義查詢返回的政策.
- 如果資產入口爲 `ExplicitOnly`,通過授權的賬戶提供目標餘額.轉移前的流量.同樣名爲 CLI 的監視器不記錄賬戶或餘額;它取消,而不是添加另一個指示.
- 在正常指示成功之前,收費被拒絕. 選擇付款人,使用網絡的收費資產元數據,並驗證其餘額.
- 如果固定的本地定義已經存在於之前的運行中,請啓動新生成的本地網絡或繼續其現有的狀態.永遠不要替代錯誤成形的隨機字符串爲 Base58 ID.

## 來源及相關文件 {#source-and-related-docs}

- [資產生命週期集成測試在固定的承諾](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Rust 固定承諾的資產構建例子](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [資產](/zh-hant/blockchain/assets.md)
- [指示](/zh-hant/blockchain/instructions.md)
- [許可證代幣](/zh-hant/reference/permissions.md)
- [JavaScript 和 TypeScript](/zh-hant/guide/tutorials/javascript.md)
