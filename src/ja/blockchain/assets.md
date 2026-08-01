---
translation_locale: ja
translation_source: /blockchain/assets.md
translation_source_hash: c80e6025007653b355d373394465d04adefc1221c8f34d9008f1c9cbabd3dc40
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 資産 {#assets}

Iroha 資産は,口座が保有する数値余分である.すべての具体的な余分は`AssetDefinition`を指し,その定義では,その資産の名前付け,鋳造,表示,分割する方法について説明します.

## 資産の定義 {#asset-definition}

`AssetDefinition`は,以下のものを含む.

- `id`:法定資産定義アドレス
- `name`:人間に読み取れるディスプレイ名
- `description`: 選択的に人間に読める記述
- `alias`: `<name>#<domain>.<dataspace>`または`<name>#<dataspace>`の形式で選択的な仮名
- `spec`:バランスのための数値精度と制約
- `mintable`:可決性政策
- `logo`: 選択式 `SoraFS` URI
- `metadata`:任意のキー値メタデータ
- `balance_scope_policy`:バランスがグローバルかデータスペースに制限されているか
- `owned_by`:定義を登録した口座または所有者
- `total_quantity`:発行された総量
- `confidential_policy`: 保護された資産の取引に関するポリシー

資産定義 IDs は,法典的な不透明なアドレスである.定義がドメインと名前から構築された場合, Iroha は UX およびクエリのためにそのドメイン/名前投影を保持することができるが,法典的テキスト形式は生成されたアドレスである.

## 資産バランス {#asset-balance}

`Asset`は,以下のものを含む.

- `id`:資産定義,保有者の口座,オプションのバランスの範囲を組み合わせる `AssetId`
- `value`: `Numeric`のバランス

保有者アカウントは定規でありドメインなしである.資産定義は,データスペースに適したドメイン (例えば `payments.universal`) で予測される可能性があります.

## 保存可能性 {#mintability}

資産定義は,これらの mintability モードをサポートします:

|モード|意味|
| ------------ | ----------------------------------------------------------------- |
|`Infinitely`|エラスティックな供給. 資産は何度も鋳造され燃焼することができます.|
|`Once`|固定供給符号は 1回鋳造して燃やすことができます|
|`Not`|燃やされても 再現されない固定供給証券です|
|`Limited(n)`|政策は,限られた数の追加取引で新しい資産単位を発行することを許可します. |

通常の弾性資産に対して `Infinitely` を使用し,固定供給または限られた供給資産については `Once` または `Limited(n)` を使用する.既に資産供給が確立されていない限り,初期ポリシーとして `Not` を使用しないでください.

## バランスの範囲 {#balance-scope}

`balance_scope_policy`は,バランスの取扱いを制御する:

- `Global`: 口座と資産の定義ごとに1つのバランスバケット
- `DataspaceRestricted`: 余分はデータスペースの文脈によって分割されています

Nexus 複数のデータデータベースで同じ資産定義を使用する場合,データスペース制限のバランスは有用であるが,バランスは孤立したままに保持する必要があります.

## Taira で試してみてください {#try-it-on-taira}

Taira 公開テストネットで実際の資産定義が表示される.

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

現在の Taira XOR 料金の資産の定義を見つける.

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

メタデータを持つ定義を探してください.

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

Taira の資産を鋳造,燃焼,または転送するには, faucet 資金による口座と [で保護された流れを使用して, SORA Nexus データスペック](/ja/get-started/sora-nexus-dataspaces.md)に接続します.

料金を支払う資産 Taira の例では, faucet helper を [から保存し, Taira](/ja/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) で Testnet XOR を `taira_faucet_claim.py` として取得して,まず faucet アセットを請求し,取引ガスアセットとして使用します.

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

`ledger asset mint`,`ledger asset burn`,および `ledger asset transfer`のコマンドに `--metadata ./taira.tx-metadata.json` を入力します.

## 指示 {#instructions}

資産は Iroha の特殊指示に従って登録,鋳造,燃焼および移転することができる.

- [`Register`および `Unregister`](/ja/blockchain/instructions.md#un-register)
- [`Mint`および `Burn`](/ja/blockchain/instructions.md#mint-burn)
- [`Transfer`](/ja/blockchain/instructions.md#transfer)
- [`SetKeyValue`および `RemoveKeyValue`](/ja/blockchain/instructions.md#setkeyvalue-removekeyvalue)

参照:

- [CLI ガイド](/ja/get-started/operate-iroha-via-cli.md)
- [Rust チュートリアル](/ja/guide/tutorials/rust.md)
- [Python チュートリアル](/ja/guide/tutorials/python.md)
- [JavaScript/TypeScript 教科書](/ja/guide/tutorials/javascript.md)
- [データのモデル](/ja/blockchain/data-model.md)
- [NFTs](/ja/blockchain/nfts.md)
