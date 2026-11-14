---
translation_locale: ja
translation_source: /blockchain/assets.md
translation_source_hash: 4d0a3f54a0c70d08d11160b9ec66d6538aa2c49c7771a13e4a070b61a9cb3e4b
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# 資産 {#assets}

Iroha 資産とは、アカウントが保持する数値の残高です。すべての具体的な残高は`AssetDefinition`を指しており、その定義はその資産がどのように命名、発行、表示、そして分割されるかを説明します。

## 資産の定義 {#asset-definition}

`AssetDefinition` には以下が含まれています:

- `id`：正規の資産定義アドレス
- `name`：人間に読みやすい表示名
- `description`：任意の人間が読める説明
- `alias`：オプションの別名は`<name>#<domain>.<dataspace>`または`<name>#<dataspace>`の形式で
- `spec`：残高の数値精度と制約
- `mintable`：資産発行方針の方針
- `logo`：任意 `SoraFS` URI
- `metadata`：任意のキーと値のメタデータ
- `balance_scope_policy`: 残高をグローバルに扱うか、データスペース内に制限するかを定めるポリシー
- `owned_by`: 定義を登録した、または所有しているアカウント
- `total_quantity`：総発行数量
- `confidential_policy`：シールド資産運用の方針

アセット定義IDは標準の不透明なアドレスです。定義がドメインと名前から構築されると、Iroha は UX およびクエリ用にそのドメイン/名前の射影を保持できますが、標準のテキスト形式は生成されたアドレスです。

## 資産残高 {#asset-balance}

一つの `Asset` 含む:

- `id`：`AssetId`で、資産の定義、保有者アカウント、およびオプションの資産残高範囲を組み合わせたもの
- `value`：`Numeric`のバランス

保有者のアカウントは、ドメインを含まない正規の識別子を持ちます。資産定義は、`payments.universal` など、データスペース名で修飾されたドメインの下に対応付けることができます。

## 資産発行方針 {#mintability}

資産定義は、これらの資産発行ポリシーモードをサポートします:

|モード|意味|
| ------------ | ----------------------------------------------------------------- |
| `Infinitely` |弾力的な供給。資産は繰り返し発行および破棄することができます。|
| `Once`       |固定供給のトークン。一度発行されると、その後破棄されることができます。|
| `Not`        |再発行はできないが、破壊可能な固定供給トークン。|
| `Limited(n)` |この方針では、限られた追加操作の中で新しい資産単位を発行することが許可されています。|

通常のエラスティック資産には `Infinitely` を使用し、固定供給または供給上限のある資産には `Once` または `Limited(n)` を使用してください。資産の供給がすでに確立されている場合を除き、初期方針として `Not` を使用しないでください。

## 資産残高の範囲 {#balance-scope}

`balance_scope_policy`は、残高がどのように分割されるかを制御します:

- `Global`: アカウントおよび資産定義ごとの1つの残高パーティション
- `DataspaceRestricted`: データスペースの文脈ごとに残高を分ける

同じ資産定義を複数の SORA Nexus データスペースで使いながら、残高を相互に分離しておく必要がある場合は、データスペース内に制限した残高が役立ちます。

## Taira でこのワークフローを実行してください {#try-it-on-taira}

これらの読み取り専用の API リクエストは、パブリック Taira テストネット上の実際の資産定義を示しています:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

現在の Taira XOR 手数料資産定義を見つけてください:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

メタデータを持つ定義を探してください:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

三つの例はいずれも読み取り操作です。Taira で資産を発行、焼却、送金する場合は、フォーセットから資金供給を受けたアカウントを使い、[SORA Nexus データスペースへの接続](/ja/get-started/sora-nexus-dataspaces.md)に記載されたガード付きの手順に従ってください。

手数料を支払う Taira の資産操作では、まず[Taira でテストネット XOR を取得する](/ja/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)に記載された、事前準備を伴うフォーセットの手順で署名者に資金を供給します。次に、`ledger asset mint`、`ledger asset burn`、`ledger asset transfer` の各コマンドに `--fee-payer authority` を指定します。CLI は署名前に、Taira の手数料資産建てで正確な手数料を見積もります。

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  ledger asset transfer \
  --definition "<ASSET_DEFINITION_BASE58>" \
  --account "<TAIRA_I105_ACCOUNT_ID>" \
  --to "<RECIPIENT_I105_ACCOUNT_ID>" \
  --quantity 1
```

## 指示 {#instructions}

資産は、Iroha 命令操作で登録、発行、破棄、転送することができます。

- [`Register` そして `Unregister`](/ja/blockchain/instructions.md#un-register)
- [`Mint` そして `Burn`](/ja/blockchain/instructions.md#mint-burn)
- [`Transfer`](/ja/blockchain/instructions.md#transfer)
- [`SetKeyValue` そして `RemoveKeyValue`](/ja/blockchain/instructions.md#setkeyvalue-removekeyvalue)

参照：

- [CLI ガイド](/ja/get-started/operate-iroha-via-cli.md)
- [Rust チュートリアル](/ja/guide/tutorials/rust.md)
- [Python チュートリアル](/ja/guide/tutorials/python.md)
- [JavaScript/TypeScript チュートリアル](/ja/guide/tutorials/javascript.md)
- [データモデル](/ja/blockchain/data-model.md)
- [NFTs](/ja/blockchain/nfts.md)
