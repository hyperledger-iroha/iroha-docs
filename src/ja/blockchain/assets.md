---
translation_locale: ja
translation_source: /blockchain/assets.md
translation_source_hash: c80e6025007653b355d373394465d04adefc1221c8f34d9008f1c9cbabd3dc40
translation_status: machine-validated
translation_engine: bing-translator-llm
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
- `balance_scope_policy`: 残高がグローバルかデータスペース制限かどうか
- `owned_by`: 定義を登録した、または所有しているアカウント
- `total_quantity`：総発行数量
- `confidential_policy`：シールド資産運用の方針

アセット定義IDは標準の不透明なアドレスです。定義がドメインと名前から構築されると、Iroha は UX およびクエリ用にそのドメイン/名前の射影を保持できますが、標準のテキスト形式は生成されたアドレスです。

## 資産残高 {#asset-balance}

一つの `Asset` 含む:

- `id`：`AssetId`で、資産の定義、保有者アカウント、およびオプションの資産残高範囲を組み合わせたもの
- `value`：`Numeric`のバランス

ホルダーアカウントは正準でドメインを持ちません。アセット定義は、例えば `payments.universal` のようなデータスペースで修飾されたドメインの下で投影される場合があります。

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
- `DataspaceRestricted`: 残高はデータスペースのコンテキストごとに分割されます

データスペース制限付き残高は、同じ資産定義が複数の Nexus データスペースで使用される場合に便利ですが、残高は分離されたままでなければなりません。

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

三つの例はすべて読み取りです。Taira で資産を発行、破棄、または転送するには、テストネット資金付きアカウントと[SORA Nexus データスペースに接続](/ja/get-started/sora-nexus-dataspaces.md)の保護されたフローを使用してください。

手数料支払い用の Taira 資産の例として、[Taira でテストネット XOR を入手する](/ja/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)からテストネット資金提供サービスヘルパーを`taira_faucet_claim.py`として保存し、まずテストネット資金提供サービス資産を取得して、取引実行コスト資産として使用します:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

それから、`ledger asset mint`、`ledger asset burn`、および`ledger asset transfer`のコマンドに`--metadata ./taira.tx-metadata.json`を含めてください。

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
