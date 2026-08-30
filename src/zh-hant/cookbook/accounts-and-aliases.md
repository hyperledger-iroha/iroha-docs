---
translation_locale: zh-hant
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 429535e5bb4ad1d3110f29a5b3896c0d3ce39264dbd357fa932fcc2a5f48d0f1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 賬戶和姓名 {#accounts-and-aliases}

## 結果 {#outcome}

在無域名的法典中安全工作 I105 賬戶 IDs 和單獨綁定的人類可讀的別名,如 `treasury@payments.universal`. 你會檢查 Taira 根據自己的法典, ID, 解決別名,不使路由背景與身份混爲一談.

## 預先條件 {#prerequisites}

- `curl`,`jq`, Python 3.11或以後的電流,以及 `iroha` CLI.
- 一個 `taira.client.toml` 來自 [連接到 Taira](./connect-to-taira.md) 當你檢查自己的賬戶時.
- 通過 Taira 水龍頭或網絡的管理登錄路徑預期成功之前提供賬戶特定閱讀.

## 步驟 {#steps}

### 1. 檢查 Taira 的法典賬戶 {#_1-inspect-canonical-accounts-on-taira}

公開賬戶列表總是返回正文號 I105 IDs.主要姓氏是可選的,並單獨報告.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

ID 從 `.id` 適用於嚴格的賬戶字段.不要添加一個域名. `.primary_alias` 的別名是面向用戶的搜索密鑰,而不是另一種正義身份.

### 2. 導出和正常化您的 Taira I105 ID {#_2-derive-and-normalize-your-taira-i105-id}

在本地配置中只讀取公鑰.相同的公鑰對不同的公共網絡配置文件進行了不同編碼,所以明確選擇 `taira`.

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

printf '%s\n' "$TAIRA_ACCOUNT_ID" \
  | iroha tools address normalize --profile taira
```

規範值應與 `TAIRA_ACCOUNT_ID`相同. TOML 文件中的`[account].domain`設置可以是 `wonderland.universal`,但該值隻影響路由和別名文本.

### 3. 閱讀賬戶及其資產 {#_3-read-the-account-and-its-assets}

在賬戶提供後,直接查詢它並列出一個有界限的資產頁面. URL -在使用其在路徑之前加密 I105 值.

```bash
iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

ENCODED_ACCOUNT_ID="$(
  python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1], safe=""))' \
    "$TAIRA_ACCOUNT_ID"
)"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/accounts/$ENCODED_ACCOUNT_ID/assets?limit=10" \
  | jq '{total, items}'
```

### 4. 查找與賬戶相關的名 {#_4-look-up-aliases-bound-to-the-account}

逆解析器接受一個準確的正規帳戶 ID.公開數據庫行可以在沒有請求籤名標題的情況下讀取;限制的數據庫需要授權簽署的請求.

```bash
jq -nc --arg account_id "$TAIRA_ACCOUNT_ID" \
  '{account_id: $account_id}' > alias-by-account.json

curl -fsS -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  --data-binary @alias-by-account.json \
  https://taira.sora.org/v1/aliases/by-account \
  | tee alias-bindings.json \
  | jq '{account_id, total, items}'
```

`total: 0`是有效的:一個賬戶不需要姓氏.如果存在綁定,解決其完全合格的姓氏,並比較返回帳戶 ID:

```bash
ALIAS_WAS_RESOLVED=false
if TAIRA_ALIAS="$(jq -er '.items[0].alias' alias-bindings.json)"; then
  jq -nc --arg alias "$TAIRA_ALIAS" \
    '{alias: $alias}' > alias-resolve.json

  curl -fsS -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    --data-binary @alias-resolve.json \
    https://taira.sora.org/v1/aliases/resolve \
    | tee alias-resolution.json \
    | jq '{alias, account_id, source}'
  ALIAS_WAS_RESOLVED=true
else
  printf '%s\n' 'No visible alias is bound to this account.'
fi
```

::: warning 許可範圍

Taira 龍頭可以提供其申請人賬戶,但這不授予一般帳戶註冊或稱管理權. 註冊另一個賬戶需要在活躍的驗證器下進行`CanRegisterAccount`.帳戶密碼通常還需要活躍的 SNS 租合同和適當的密碼許可. 使用管理的登錄/密碼規劃器,或對生成的本地網絡進行註冊練習.

:::

在本地網絡上,一旦一個安全的簽名供應步驟出口了新的正規 `NEW_ACCOUNT_ID`,登記表面是:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

生成和存儲相匹配的私鑰在文檔或應用程序庫外. 註冊丟棄控制密鑰的 ID 創建了一個無法使用的帳戶.

## 驗證 {#verify}

證明公鑰的配置, I105 編碼,並稱爲結合所有 converge 在一個法典帳戶 ID:

```bash
NORMALIZED_ACCOUNT_ID="$(
  printf '%s\n' "$TAIRA_ACCOUNT_ID" \
    | iroha tools address normalize --profile taira
)"
test "$NORMALIZED_ACCOUNT_ID" = "$TAIRA_ACCOUNT_ID"

if test "${ALIAS_WAS_RESOLVED:-false}" = true; then
  test "$(jq -r '.account_id' alias-resolution.json)" = "$TAIRA_ACCOUNT_ID"
fi
```

存儲常規帳戶 IDs.使用常規賬戶 IDs 爲簽名,權限和交易說明.在應用程序邊界解決一個別名.保留用於操作的常規賬號 ID.

## 解決問題 {#troubleshooting}

- 一個解析或前置錯誤通常意味着一個地址爲不同的網絡配置文件編碼.用 `--profile taira`來正常化,並拒絕不匹配.
- 一個賬戶 `404` 在水龍頭之後 `202` 在發送信件之前,請查詢賬戶或資產.
- `total: 0` 來自反向解析器意味着沒有可見的代號綁定;這不是一個賬戶查找失敗.
- `401`或`403`來自一個別名路線表示數據空間有限或精確解析權限不足.不要作爲倒退使用寬的前搜索.
- 一個可讀的 `name@domain.dataspace`值不被接受在任何地方需要一個正義的 I105 ID.首先解決它.
- 如果本地賬戶註冊成功,但 Taira 拒絕它,則區別是授權.獲取 `CanRegisterAccount`;不要改變帳戶 ID 以繞過驗證.

## 來源及相關文件 {#source-and-related-docs}

- [在固定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/account/address.rs)中實現可尼卡帳戶地址
- [賬戶和別名 Torii 在固定定位的測試](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [賬戶](/zh-hant/blockchain/accounts.md)
- [數據模型別名](/zh-hant/blockchain/data-model.md#aliases)
- [命名公約](/zh-hant/reference/naming.md)
- [許可證代幣](/zh-hant/reference/permissions.md)
