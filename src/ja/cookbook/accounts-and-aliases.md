---
translation_locale: ja
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 6d36784afef0ef10113cabc995ddfb45fd8d382d7c32c553d77cf03ba5c1f65f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# アカウントとエイリアス {#accounts-and-aliases}

## 結果 {#outcome}

ドメインのないカノニカルな I105 アカウントID と、`treasury@payments.universal` のような個別に紐付けられた人間が読みやすいエイリアスを安全に使用してください。Taira アカウントを確認し、独自のカノニカルID を導き出し、ルーティングコンテキストとID を混同せずにエイリアスを解決します。

## 前提条件 {#prerequisites}

- `curl`、`jq`、Python 3.11以降、および現在の `iroha` CLI。
- 自分のアカウントを確認するときに、[Taira に接続する](./connect-to-taira.md)からの`taira.client.toml`。
- アカウント固有の読み取りが成功することを期待する前に、Taira テストネット資金提供サービスまたはネットワークの管理されたオンボーディング経路を通じてアカウントがプロビジョニングされます。

## ステップ {#steps}

### 1. Taira の公式アカウントを確認する {#_1-inspect-canonical-accounts-on-taira}

公開アカウントリストは常に正規の I105 ID を返します。主要なエイリアスは任意であり、別途報告されます。

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

`.id` の ID は厳格なアカウントフィールドに対して有効です。ドメインを付加しないでください。`.primary_alias` のエイリアスはユーザー向けの検索キーであり、別の正規の識別子ではありません。

### 2. あなたの Taira I105 ID を導出して正規化してください {#_2-derive-and-normalize-your-taira-i105-id}

ローカル構成から公開鍵のみを読み取ります。同じ公開鍵でも異なるパブリックブロックチェーンネットワークプロファイルでは異なる方法でエンコードされるため、`taira` を明示的に選択してください。

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

正規化された値は `TAIRA_ACCOUNT_ID` と同一である必要があります。TOML ファイルの `[account].domain` 設定は `wonderland.universal` にすることができますが、その値はルーティングとエイリアスコンテキストにのみ影響します。

### 3. 口座とその資産を確認する {#_3-read-the-account-and-its-assets}

アカウントがプロビジョニングされた後、直接クエリを実行し、制限された資産ページを一覧表示します。パスで使用する前に、I105 の値を URL でエンコードしてください。

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

### 4. アカウントに紐づけられた別名を確認する {#_4-look-up-aliases-bound-to-the-account}

リバースリゾルバーは、1つの正確な正規アカウントIDを受け入れます。パブリックデータスペースの行はリクエスト署名ヘッダーなしで読み取ることができます。制限付きデータスペースは、認証された署名付きリクエストが必要です。

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

`total: 0` は有効です: アカウントにはエイリアスを設定する必要はありません。バインディングが存在する場合、その正確な完全修飾エイリアスを解決し、返されたアカウントIDと比較してください:

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

::: warning 許可境界

Taira テストネット資金提供サービスは請求者アカウントを用意することができますが、それは一般的なアカウント登録やエイリアス管理の認可プリンシパルを付与するものではありません。別のアカウントを登録するには、アクティブなバリデータの下で `CanRegisterAccount` が必要です。アカウントの別名には通常、アクティブな SNS リースと適切な別名権限も必要です。管理されたオンボーディング/別名プランナーを使用するか、生成されたローカルネットワークに対して登録をリハーサルしてください。

:::

ローカルネットワークでは、セキュアな暗号署名キーのプロビジョニング手順が新しい標準的な `NEW_ACCOUNT_ID` をエクスポートした後、登録サーフェスは次の通りです:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

一致する秘密鍵をドキュメントやアプリケーションのリポジトリの外で生成して保存してください。コントローラキーを破棄したIDを登録すると、使用できないアカウントが作成されます。

## 確認する {#verify}

構成公開鍵、I105 エンコーディング、およびエイリアスのバインディングがすべて1つの標準的なアカウントIDに収束することを証明してください。

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

標準アカウントIDを保存します。署名、権限、およびトランザクション指示には標準IDを使用します。アプリケーションの境界でエイリアスを解決します。操作に使用された標準アカウントIDを保持します。

## トラブルシューティング {#troubleshooting}

- パースエラーやプレフィックスエラーは通常、アドレスが異なるネットワークプロファイル用にエンコードされていることを意味します。`--profile taira`で正規化し、不一致は拒否してください。
- テストネット資金提供サービス `202` の後のアカウント `404` は伝播遅延が発生する可能性があります。書き込みを送信する前に、アカウントまたは資金提供された資産を確認してください。
- リバースリゾルバからの`total: 0`は、表示されるエイリアスがバインドされていないことを意味します。これはアカウントの検索失敗ではありません。
- `401` または `403` がエイリアス経路から返される場合、それは制限されたデータスペースまたは十分な正確な解決権限がないことを示します。フォールバックとして広範なプレフィックス検索を使用しないでください。
- 読み取り可能な`name@domain.dataspace`値は、標準的な I105 IDが必要なすべての場所で受け入れられるわけではありません。まずそれを解決してください。
- ローカルアカウントの登録が成功しても、Taira がそれを拒否する場合、その違いは認証です。`CanRegisterAccount` を取得してください。検証を回避するためにアカウントIDを変更しないでください。

## ソースおよび関連文書 {#source-and-related-docs}

- [固定されたソースコードのリビジョンでの正規アカウントアドレスの実装](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/account/address.rs)
- [ピン留めされたソースコードのリビジョンでのアカウントとエイリアス Torii のテスト](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [アカウント](/ja/blockchain/accounts.md)
- [データモデルの別名](/ja/blockchain/data-model.md#aliases)
- [命名規則](/ja/reference/naming.md)
- [許可トークン](/ja/reference/permissions.md)
