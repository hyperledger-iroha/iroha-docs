---
translation_locale: ja
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 29f2bdb390fc93b97f8ed9108634f70e21ba747c8606fb84093d37e9586516c1
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# 代替可能資産 {#fungible-assets}

## 結果 {#outcome}

生成されたローカルネットワーク上で、ライヴの Taira 資産定義を確認し、登録、発行、転送、破棄、および残高確認のフローを完了する。このレシピでは、正規の接頭辞なしのBase58資産定義ID、ドメイン付きのエイリアス、ドメインなしの I105 アカウントID、および明示的な手数料支払いを使用します。

## 前提条件 {#prerequisites}

- `curl`、`jq`、Python 3.11以降、Node.js 24、そして現在の`iroha` CLI。
- 読み取り専用 Taira アクセス。
- 書き込みの手順については、[Iroha を起動](/ja/get-started/launch-iroha.md) から生成されたローカルネットワークで、`http://127.0.0.1:8080` 上に `./localnet/client.toml` と Torii がいます。

## ステップ {#steps}

### 1. 暗号署名者なしで Taira 定義を検査する {#_1-inspect-taira-definitions-without-a-signer}

資産の定義には、不透明なBase58 ID、表示名、資産発行ポリシー、数値スケール、オプションの別名、所有者、および総数量が含まれます。具体的な残高には、保有しているアカウントとオプションのデータスペーススコープも含まれます。

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

`node taira-assets.mjs`で JavaScript フォームを実行します。公開資産IDは素のBase58値です。`cookbook_credit#wonderland.universal`のような読みやすい値は、これらのIDのいずれかに解決されるエイリアスです。

### 2. ローカル認証プリンシパルと宛先を準備する {#_2-prepare-the-local-authority-and-destination}

生成された設定の公開鍵からローカル認証プリンシパルを導出し、他の登録済みアカウントを受信者として選択します。秘密鍵は表示されません。

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

### 3. 数値定義を登録する {#_3-register-a-numeric-definition}

このローカル専用IDは、有効な接頭辞なしのBase58資産定義アドレスです。エイリアスは、人間が読みやすい`domain.dataspace`プロジェクションを提供します。スケール`2`は2桁の小数を許可します。`--mint-once`を省略すると、デフォルトの`Infinitely`ポリシーが維持されます。

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

そのIDを Taira で再利用しないでください。パブリックブロックチェーンネットワークへの登録には、新しい標準的なID、アプリケーションに割り当てられたドメイン/エイリアス、手数料の資金、そしてソフトウェアランタイムの資産登録権限が必要です。

### 4. 発行、譲渡、および破棄 {#_4-mint-transfer-and-burn}

すべての書き込みコマンドでは、手数料支払者として認可主体を明示的に指定します。CLI は署名前に対象トランザクションの正確な手数料見積もりを提示し、既定では完了を待機します。

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

破壊後、元の残高 `64.50`、宛先の残高 `25.50`、および合計数量 `90.00` を確認してください。

::: warning 許可境界

オン Taira, 蛇口由来のものを取り付ける `taira.tx-metadata.json` そして使う `--fee-payer authority` すべての書き込みに対して。登録および発行には、アクティブなバリデーターの権限が必要です； 転送と破棄には、元の残高に対する認可権限が必要です。 テストネットで資金提供されたアカウントは、自動的に発行者になるわけではありません。

:::

## 確認する {#verify}

両方の具体的な残高を読み、その後に定義を読みなさい。これらの事後状態のクエリが成功基準であり、提出プロトコルの結果記録だけでは成功基準とはなりません。

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

アプリケーションのアサーションは、バイナリ浮動小数点値ではなく固定小数点の値として数値を比較し、アカウントだけでなく定義IDも検証する必要があります。

## トラブルシューティング {#troubleshooting}

- `#` を含む ID はエイリアスまたは具体的な残高リテラルであり、標準的な資産定義 ID ではありません。`--definition` にはベアの Base58 値を使用するか、`--definition-alias` にはバウンドされたエイリアスを渡してください。
- `Scale` エラーは、数量が定義で許可されているよりも多くの小数桁を持っていることを意味します。
- `Mintability` の拒否とは、`Once`、`Not`、または `Limited(n)` のポリシーが発行を使い果たしたか、許可されていないことを意味します。履歴を書き換えないでください。定義クエリで返されたポリシーを使用してください。
- ステップ2では、登録済みの宛先アカウントを意図的に選択します。資産の入金が`ExplicitOnly`の場合、承認された方法で宛先残高を供給します転送する前にフロー。同様の名前の CLI ガードはアカウントや残高を登録せず、別の命令を追加する代わりに中止します。
- 手数料の拒否は、通常の指示が成功する前に発生します。支払者を選択し、ネットワークの手数料資産のメタデータを使用し、その残高を確認してください。
- 以前の実行から固定のローカル定義がすでに存在する場合は、新たに生成されたローカルネットを起動するか、既存の状態を継続してください。Base58 IDの代わりに不正なランダム文字列を置き換えてはいけません。

## ソースと関連ドキュメント {#source-and-related-docs}

- [固定されたソースコードリビジョンでのアセットライフサイクル統合テスト](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Rust ピン留めされたソースコードのリビジョンでのアセット構築例](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [資産](/ja/blockchain/assets.md)
- [指示](/ja/blockchain/instructions.md)
- [許可トークン](/ja/reference/permissions.md)
- [JavaScript と TypeScript](/ja/guide/tutorials/javascript.md)
