---
translation_locale: ja
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 3287a6bbaf06ec92ebbe9ac33a8294d4e1d232bc01fd6a5da13ddd166c620965
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# 代替可能資産 {#fungible-assets}

## 結果 {#outcome}

稼働中の Taira の資産定義を確認し、生成されたローカルネットワーク上で発行、転送、破棄、および残高確認のフローを完了します。このレシピでは、正規の接頭辞なしの Base58 資産定義ID、ドメインなしの I105 アカウントID、および明示的な手数料支払いを使用します。

## 前提条件 {#prerequisites}

- `curl`、`jq`、Python 3.11以降、Node.js 24、そして現在の `iroha` および `kagami` CLIs。
- 読み取り専用 Taira アクセス。
- 書き込みの手順には、[Iroha を起動](/ja/get-started/launch-iroha.md) と同じく `kagami localnet generate --peers 4 --out-dir ./localnet` で生成し、`--asset-definition-id 66owaQmAQMuHxPzxUN3bqZ6FJfDa` を追加したローカルネットワークを使用します。これにより、`./localnet/client.toml` と、`http://127.0.0.1:8080` 上の Torii が提供されます。

## ステップ {#steps}

### 1. 暗号署名者なしで Taira 定義を検査する {#_1-inspect-taira-definitions-without-a-signer}

資産の定義には、不透明なBase58 ID、表示名、資産発行ポリシー、数値スケール、オプションの別名、所有者、オプションの所有ドメインまたはデータスペース、残高ポリシー、および総数量が含まれます。具体的な残高には、保有しているアカウントとオプションのデータスペーススコープも含まれます。

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

`node taira-assets.mjs`で JavaScript フォームを実行します。公開資産IDは素のBase58値です。`cookbook_credit#wonderland.universal`のような読みやすい値は、これらのIDのいずれかに解決されるエイリアスです。

### 2. ローカル認証プリンシパルと宛先を準備する {#_2-prepare-the-local-authority-and-destination}

生成された設定の公開鍵からローカル認証プリンシパルを導出し、新しい受信者アカウント用の鍵ペアを作成して登録します。秘密鍵は表示されません。

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

### 3. クライアントが所有する数値定義を使用する {#_3-use-a-client-owned-numeric-definition}

ジェネシス以外では、定義は署名者が所有するドメイン（`--domain` で指定する所有ドメイン）の下に登録されますが、生成されたローカルネットのクライアントはドメインを所有していません。`--asset-definition-id` を指定して生成したローカルネットには、この定義がすでに存在します。ジェネシスがスケール制約なしでこの定義を登録し、クライアントを所有者に設定し、クライアントに 1,000,000,000 単位を発行しています。

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

そのIDを Taira で再利用しないでください。パブリックブロックチェーンネットワークへの登録には、新しい標準的なID、自分のアカウントが所有する所有ドメイン（`ledger asset definition register` に `--domain` として渡します）、エイリアスを使う場合はその `CanManageAssetDefinitionAlias` の付与、そして手数料の資金が必要です。

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

破壊後、元の残高 `1000000064.50`、宛先の残高 `25.50`、および合計数量 `1000000090.00` を確認してください。

::: warning 許可境界

Taira では、すべての書き込みに `--fee-payer authority` を使用してください。CLI は署名前に、Taira の手数料資産で表した正確な手数料の見積もりを提示します。登録には定義の `--domain` を所有していることが必要で、エイリアスにはさらに `CanManageAssetDefinitionAlias` が必要です。発行には、定義を所有しているか、`CanMintAssetWithDefinition` または `CanMintAssetToAccount` を保持していることが必要です。転送と破棄には、元の残高に対する権限が必要です。フォーセットから資金提供されたアカウントが、自動的に発行者になるわけではありません。

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
- ステップ2では宛先アカウントを明示的に登録するため、アカウントの受け入れ方式が `ExplicitOnly` の場合でも転送は機能します。同様の名前の CLI ガードはアカウントや残高を登録せず、別の命令を追加する代わりに中止します。
- 手数料の拒否は、通常の指示が成功する前に発生します。支払者を選択し、CLI の手数料見積もりに示された手数料資産と上限額を確認したうえで、その残高を検証してください。
- 同じローカルネットで再実行すると以前の残高から始まり、`kagami keys` は既存の `./cookbook-recipient` を拒否します。新たに生成されたローカルネットを起動してそのディレクトリを削除するか、絶対値ではなく残高の変化を比較してください。Base58 IDの代わりに不正なランダム文字列を置き換えてはいけません。

## ソースと関連ドキュメント {#source-and-related-docs}

- [固定されたソースコードリビジョンでのアセットライフサイクル統合テスト](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/asset.rs)
- [Rust ピン留めされたソースコードのリビジョンでのアセット構築例](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/examples/tutorial.rs)
- [資産](/ja/blockchain/assets.md)
- [指示](/ja/blockchain/instructions.md)
- [許可トークン](/ja/reference/permissions.md)
- [JavaScript と TypeScript](/ja/guide/tutorials/javascript.md)
