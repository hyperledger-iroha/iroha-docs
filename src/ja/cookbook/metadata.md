---
translation_locale: ja
translation_source: /cookbook/metadata.md
translation_source_hash: bb486994faabb29fb48609a886862e44e565148be4800ec1244218ef37e2e54b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# メタデータ {#metadata}

## 結果 {#outcome}

Taira のメタデータを読み取り、明示的に手数料を支払うトランザクションで1つのアカウントメタデータ値を設定および確認し、再度その値を削除します。ブロックチェーン台帳オブジェクトのメタデータはトランザクション手数料のメタデータとは別に保持します。

## 前提条件 {#prerequisites}

- `curl`、`jq`、Python 3.11以降、および現在の`iroha`CLI。
- [Taira に接続する](./connect-to-taira.md)から資金提供を受けた`taira.client.toml`と`taira.tx-metadata.json`。
- 対象アカウントのメタデータに対する認可プリンシパル。例は設定された認可プリンシパル自体を対象としており、別のアカウントには正確な権限が必要です。

## ステップ {#steps}

### 1. 暗号署名者なしでメタデータを読む {#_1-read-metadata-without-a-signer}

メタデータは `Name` から JSON への確認済みマップです。空のマップや空のフィルタリングされた出力も有効な結果です。

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

小さな記述的または索引用のフィールドにはメタデータを使用してください。大きなペイロードはブロックチェーン台帳の外に置き、暗号学的ダイジェスト値、URI、または SoraFS 参照を代わりに保存してください。

### 2. 目標アカウントを導き出す {#_2-derive-the-target-account}

Taira 設定から公開鍵のみを読み取り、標準的なドメインなしの I105 形式に変換します。

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

### 3. 1つの JSON の値を設定する {#_3-set-one-json-value}

標準入力から読み取られた JSON はアカウントの `cookbook_profile` 値になります。それに対して、`--metadata ./taira.tx-metadata.json` は手数料フィールドを取引データコンテナに添付します。これら二つのマップは対象と目的が異なります。

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

CLI はデフォルトで料金を見積もり、署名し、提出し、待機します。この値に次の操作が依存する場合は、`--no-wait` を追加しないでください。

::: warning 許可境界

アクティブなバリデーターは、各オブジェクトを変更できる人を決定します。別のアカウントを更新するには通常 `CanModifyAccountMetadata` が必要です。ドメイン、資産定義、NFTs、およびトリガーには、それぞれ特定のターゲットに対するメタデータ権限があります。もし Taira が必要な認可プリンシパルを付与していない場合、同じアカウントコマンドを`./localnet/client.toml`で実行し、生成されたlocalnet認可プリンシパルの正準 I105 IDを置き換え、Taira の手数料メタデータファイルを省略してください。明示的なローカルの手数料支払者の選択は保持してください。

:::

### 4. 鍵を取り外す {#_4-remove-the-key}

まず確定した値を読み取り、その後別の削除トランザクションを送信してください。

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

Python のアプリケーションには、対応する型付きビルダーは `Instruction.set_account_key_value` と `Instruction.remove_account_key_value` です；それらをトランザクションメタデータおよび [Python チュートリアル](/ja/guide/tutorials/python.md#shared-setup) からの待機ヘルパーと一緒に提出してください。

## 確認する {#verify}

設定された取引の後、`meta get` は `version: 1` を持つオブジェクトを返さなければなりません。削除後、直接の検索では値を返してはいけません。

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

別々のアカウント読み取りは、ネットワークやアカウントの障害とは別にメタデータキーの欠落を区別します。実際のコードでは、設定後に JSON 値全体も確認する必要があります。

## トラブルシューティング {#troubleshooting}

- 標準入力には有効な JSON 値が1つ含まれている必要があります。文字列は JSON の引用符が必要です。オブジェクトと配列は正しく構成されている必要があります。
- メタデータキーは`Name`の値であり、解析後は大文字と小文字が区別されます。スキーマ変更ごとにバージョン付きキーを作成するのではなく、安定したキーの語彙を維持してください。
- `--metadata` はトランザクションのメタデータであり、ブロックチェーンの台帳オブジェクトのメタデータを設定するものではありません。後者の場合は、エンティティの `meta set` サブコマンドを使用してください。
- 古い読み取りの後に成功した送信がある場合、それは伝播遅延の可能性があります。適用済みの確定を待ってから、再送信する前にクエリを再試行してください。
- 権限拒否は、対象オブジェクトと認可プリンシパルの境界を識別します。ローカルでリハーサルするか、正確なトークンを要求してください。アクセス制御を回避するために、プライベートなアプリケーションデータを公開メタデータフィールドに移動しないでください。
- メタデータに秘密鍵、生の個人識別子、アクセス・トークン、大きなドキュメントを保存しないでください。

## ソースと関連ドキュメント {#source-and-related-docs}

- [固定されたソースコードリビジョンでのメタデータクエリ統合テスト](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/queries/metadata.rs)
- [Python SDK ピン留めされたソースコードのリビジョンでのトランザクションビルダー](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/README.md)
- [メタデータ](/ja/blockchain/metadata.md)
- [メタデータとブロックチェーン台帳の保存方法の選択](/ja/guide/configure/metadata-and-store-assets.md)
- [指示の参照](/ja/reference/instructions.md)
- [許可トークン](/ja/reference/permissions.md)
