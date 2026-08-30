---
translation_locale: ja
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 429535e5bb4ad1d3110f29a5b3896c0d3ce39264dbd357fa932fcc2a5f48d0f1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 口座と名前の表記 {#accounts-and-aliases}

## 成果 {#outcome}

ドメインレス・カノニカルで安全に作業する I105 口座 IDs 人に読めるような別々に結合された仮名 `treasury@payments.universal`. 検査する Taira 経歴は,あなたの独自の法典的な ID, ルーティングコンテキストとアイデンティティを混同することなく アニックネームを解く.

## 必須条件 {#prerequisites}

- `curl`,`jq`, Python 3.11またはそれ以降,および電流 `iroha` CLI.
- [からの `taira.client.toml` 自分の口座を検査するときに, Taira](./connect-to-taira.md) に連絡してください.
- Taira faucetまたはネットワークの管理されたオンボードパスを経由して,アカウント特別の読み取りが成功することを期待する前に提供される口座.

## ステップ {#steps}

### 1. Taira の法典的な会計を検査する {#_1-inspect-canonical-accounts-on-taira}

公開口座のリストでは常に正規 I105 IDs を返します. 主要な別名はオプションで,個別に報告されます.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

ID からの `.id` は,厳格なアカウントフィールドで有効である.ドメインを追加しないでください. `.primary_alias` の偽名はユーザー向け検索キーであり,他の定例的なアイデンティティではありません.

### 2. 導出し,正常化する Taira I105 ID {#_2-derive-and-normalize-your-taira-i105-id}

ローカル設定から公開鍵だけ読みます.同じ公開鍵は,異なる公共ネットワークプロフィールで異なった暗号化されますので,`taira` を明示的に選択してください.

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

標準化された値は `TAIRA_ACCOUNT_ID` と同じである. TOML ファイル内の `[account].domain`設定は `wonderland.universal` であるが,その値はルーティングと別名文脈にのみ影響する.

### 3. 会計とその資産を読む {#_3-read-the-account-and-its-assets}

アカウントがプロビジョニングされた後,直接查询し,制限された資産ページをリストする. URL - 経路で使用する前に I105 値を暗号化します.

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

### 4. 口座に結びついている偽名を探す {#_4-look-up-aliases-bound-to-the-account}

リバースリズラーは,正確な1つのカノニカルアカウント ID を受け入れます.公開データスペスの行は,要求署名ヘッダなしで読み取れます.制限されたデータスペスは承認された署名された要請が必要です.

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

`total: 0` は有効である:アカウントに偽名は必要ない.拘束力がある場合,その正確な完全に資格のある偽名を解除し,返済された口座 ID を比較してください.

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

::: warning 許可制限

Taira faucetは,請求者のアカウントを提供することができるが,それは一般口座登録または別名管理権限を与えていない.別の口座の登録には,アクティブ検証器の下での `CanRegisterAccount` が必要である.アカウント・アライアスは通常,アクティブ SNS リース契約と適切なアライアスの許可を必要とします.管理されたオンボード/アライアスプランナーを使用するか,生成されたローカルネットワークに対して登録を練習します.

:::

ローカルネットワークでは,安全な署名提供ステップが新しいカノニカル `NEW_ACCOUNT_ID` を輸出した後に,登録表面は:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

対応するプライベートキーをドキュメントまたはアプリケーションリポジトリの外で生成および保存します. コントローラーキーが捨てられた ID を登録すると,使用できないアカウントを作成します.

## 確認する {#verify}

公開鍵の設定を証明する I105 暗号化,およびすべての結合をアライアス1のカノニカルアカウントに収束する ID:

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

IDs を保存する.署名,許可およびトランザクション指示のために IDs を使用する.アプリケーションの境界で偽名を解決する.操作に使用された ID の正規アカウントを保持する.

## 問題を解く {#troubleshooting}

- 解析またはプレフィックスエラーは通常,別のネットワークプロファイルにアドレスが暗号化されたことを意味します. `--profile taira`で正常化し,不一致を拒絶します.
- `202` ポンプの後,アカウント `404` はプロパガンダ遅延である可能性があります.書き込みを送信する前に口座または資金調達資産を調査します.
- `total: 0` は逆解析器から,可視な偽名が結合されていないことを意味します. これはアカウント検索失敗ではありません.
- `401`または `403`という名前のルートから,データスペースが制限されているか,正確な解析許可が不足していることを示します.
- 読み取れる値 `name@domain.dataspace` は,常識的な I105 ID が要求されるすべての場所では受け入れられない.まずそれを解決する.
- ローカルアカウント登録が成功するが Taira がそれを拒否した場合,違いは承認である. `CanRegisterAccount` を取得する;認証を回避するために ID の口座を変更しないでください.

## ソースおよび関連文書 {#source-and-related-docs}

- [固定されたコミット](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/account/address.rs)でカノニカルアカウントアドレスの実装
- [固定されたコミット](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/tests/accounts_endpoints.rs)でのアカウントと別名テスト Torii
- [口座](/ja/blockchain/accounts.md)
- [データのモデル・アライス](/ja/blockchain/data-model.md#aliases)
- [名称に関する条約](/ja/reference/naming.md)
- [許可トークン](/ja/reference/permissions.md)
