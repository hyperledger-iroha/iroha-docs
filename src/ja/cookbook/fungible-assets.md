---
translation_locale: ja
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 6b50c995afaf9f46df6fdaab31add40b106cfa12fdaa31dabbb74448486f87f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 浮動資産 {#fungible-assets}

## 成果 {#outcome}

直接検査 Taira 資産の定義とレジスタ,ミント,転送,燃焼,およびバランスチェックを完了するこのレシピは,カノニカルな未定のBase58資産定義を使用する. IDs, 域名限定のニックネーム,ドメインレス I105 口座 IDs, そして明示的な手数料の支払い.

## 必須条件 {#prerequisites}

- `curl`,`jq`, Python 3.11 またはそれ以降, Node.js 24,および電流 `iroha` CLI.
- Taira 読み込みのみアクセス
- 作成されたローカルネットワークから [打ち上げ Iroha](/ja/get-started/launch-iroha.md), と `./localnet/client.toml` そして Torii について `http://127.0.0.1:8080`.

## ステップ {#steps}

### 1. Taira の定義を署名者なしでチェックする. {#_1-inspect-taira-definitions-without-a-signer}

資産定義には不透明なBase58 ID,表示名, mintabilityポリシー,数値スケール,オプションのニックネーム,所有者,および総量が含まれています.具体的なバランスはまた保有者のアカウントとオプションのデータスペース範囲を含みます.

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

JavaScript フォームを `node taira-assets.mjs` で実行する.公的資産 IDs は,裸のBase58値である; `cookbook_credit#wonderland.universal` のような読み取れる値は,それらの IDs の1つに解決する異名です.

### 2. 地方自治体と目的地を準備する {#_2-prepare-the-local-authority-and-destination}

作成された設定の公開鍵から地方自治体を誘導し,受信者として別の登録アカウントを選択します.プライベート鍵は印刷されません.

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

### 3. 番号の定義を登録する {#_3-register-a-numeric-definition}

このローカルのみの ID は,有効な未設定Base58資産定義アドレスである.このニックネームは人間に読み取れる `domain.dataspace` プロジェクションを提供します.スケール `2`は2つの割引数字を許可し,`--mint-once` を省略するとデフォルトの `Infinitely` ポリシーを維持します.

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

ID を Taira で再利用しないでください.公共ネットワークの登録には,新しい法典的な ID,あなたの申請に割り当てられたドメイン/エイリアス,料金の資金提供,および実行時の資産登録許可が必要です.

### 4. ミント,移転,焼却 {#_4-mint-transfer-and-burn}

すべての書き込みコマンドは,手数料の支払者として権限を明示的に選択します. CLI は署名前に正確な取引を引用し,デフォルトで待機する.

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

燃焼後,ソースバランス `64.50`,目的地バランس `25.50`,および総量 `90.00`を予想する.

::: warning 許可制限

Taira に, faucet-derived `taira.tx-metadata.json` を添付し,すべての書き込みのために `--fee-payer authority` を使用する.登録と鋳造にはアクティブ検証者の許可が必要です.転送および燃焼はソースバランスの権限を必要とします. faucet 資金の口座は自動的に発行者ではありません.

:::

## 確認する {#verify}

具体的なバランスと定義の両方を読んでください. これらのポストステートクエリは成功基準であり,提出領収書自体はそうではありません.

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

アプリケーションの主張は,二重浮動点値ではなく,定位点数値として数値値を比較し,定義 ID とアカウントを検証すべきである.

## 問題を解く {#troubleshooting}

- ア ID 含有する `#` 代名詞または具体的なバランス文字ではなく,法典的な資産定義です ID. 単に Base58 の値で `--definition`, 結ばれた偽名で `--definition-alias`.
- `Scale` 誤りとは,定義が許容するよりも多くの割引数を持つ量です.
- `Mintability` 拒否とは, `Once`, `Not`,または `Limited(n)` のポリシーが鋳造を枯渇させたり許さないことを意味します.履歴を再書きしないでください;定義クエリで返されたポリシーを使用してください.
- ステップ 2 は故意に登録された目的地口座を選択します.資産入口が `ExplicitOnly`である場合は,許可された経由で目的地余分を預算する CLI 類似の名前のガードは,口座やバランスを記録せず,別の指示を追加する代わりに流失します.
- 料金拒否は,通常の指示の成功前に発生します. 支払者を選択し,ネットワークの料金の資産メタデータを使用し,その余分を確認します.
- 固定ローカル定義が以前の実行から既に存在している場合は,新しく生成されたローカルネットを起動するか,既存の状態で継続してください. バース58 ID に誤ったランダム文字列を置き換えることは決してありません.

## ソースおよび関連文書 {#source-and-related-docs}

- [固定されたコミット](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/asset.rs)での資産ライフサイクル統合テスト
- [Rust 固定されたコミットで資産構築例](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha/examples/tutorial.rs)
- [資産](/ja/blockchain/assets.md)
- [指示](/ja/blockchain/instructions.md)
- [許可トークン](/ja/reference/permissions.md)
- [JavaScript と TypeScript](/ja/guide/tutorials/javascript.md)
