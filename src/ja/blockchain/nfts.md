---
translation_locale: ja
translation_source: /blockchain/nfts.md
translation_source_hash: 6dd2d21a29f352a14cb17046c66cfa541ef501b733b95bb6874d2d3f86ec0504
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

Iroha NFT は,単一の所有者を持つユニークな本簿オブジェクトである.レコードが独自のアイデンティティ,メタデータ,ライフサイクルイベント,所有権転送セマンティックを必要とする場合 NFTs を使用する.しかし,数値バランスを必要としていない.

数値的な [資産](/ja/blockchain/assets.md)とは異なり, NFT には精度や mintability,または毎アカウントの量がありません. NFT は登録されたオブジェクトとして存在し,所有権はそのオブジェクトに直接追記されます.

## 構造 {#structure}

登録された `Nft` には:

- `id`: a `NftId`
- `content`: NFT を記述するメタデータ
- `owned_by`: NFT の所有者口座

`content`フィールドは`Metadata`地図である.コンパクトに保存する:記述フィールド,安定参照,ハッシュ, URIs,または SoraFS 経路をそこに保管する.大きな文書,メディア,または高速度のアプリケーション状態をオフチェーンで保存し,確認可能な参照のみを NFT に保持する.

## Taira で試してみてください {#try-it-on-taira}

公開の Taira テストネットに現在 NFT の記録があるかどうかを確認する.

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

ノードが暴露した NFT 経路について,ライブ OpenAPI ドキュメントを確認する.

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

空っぽの `items` アレイは,公開テストネット上の有効な応答である.これは現在のページに NFTs が存在しないことを意味し, NFT の指示が利用できないということではない.

## NFT IDs {#nft-ids}

`NftId`は以下のテキスト形式を使用します.

```text
name$domain
name$domain.dataspace
```

たとえば, `badge$docs.universal` は`badge` NFT を `docs.universal` ドメインで識別する.データスペースが省略された場合,現在の解析器は `universal` データスペースを使用しているので, `badge$docs` は `badge$docs.universal` に解消される.

NFT IDs に対して安定した名前を使用します. ID は,指示,クエリ,許可,イベントフィルター,アプリケーション参照で使用されるオブジェクトアイデンティティです.

## ライフサイクル {#lifecycle}

NFT ライフサイクル運用使用 Iroha 特殊指示:

- [`Register`](/ja/blockchain/instructions.md#un-register) は,最初の `content` で NFT を作成します.
- [`Unregister`](/ja/blockchain/instructions.md#un-register)は, NFT を削除する.
- [`Transfer`](/ja/blockchain/instructions.md#transfer)の変更は, `owned_by`.
- [`SetKeyValue`と `RemoveKeyValue`](/ja/blockchain/instructions.md#setkeyvalue-removekeyvalue)の更新された NFT メタデータ.

## 地元 で 試す {#try-it-locally}

これらの例では,ローカルネットワークを起動し, [CLI ガイド](/ja/get-started/operate-iroha-via-cli.md)からクライアントの設定が生成されていることを仮定します:

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

生成されたローカルネットは既に設定されています `wonderland.universal` そしてその SNS 異なるドメインを使用するには,最初に宣言式で作成してください. `app alias setup plan` そして `app alias setup apply` ワークフローについて [ドメイン](/ja/blockchain/domains.md#registration).

NFT を登録する.登録は,標準入力から初期コンテンツ JSON を読み取る:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

NFT を直接検査し,すべての NFTs を完全なエントリでリストする.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

メタデータキーを追加して, NFT を再読み:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

メタデータキーを削除する:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

選択的に NFT を転送する.現在の所有者を `owned_by`から読み取るために `ledger nft get` を使用し,宛先口座 ID を探すために `ledger account list all` を使用する.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

NFT の例をウォークアウト後削除します.転送した場合は,転送して戻すか,または現在の所有者のアカウント設定で登録解除命令を送信してください.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## 疑問と出来事 {#queries-and-events}

使用 [`FindNfts`](/ja/reference/queries.md#assets-nfts-and-rwas) リストにする NFTs そして [`FindNftsByAccountId`](/ja/reference/queries.md#assets-nfts-and-rwas) リストにする NFTs 口座の所有者

NFT 登録,削除,転送,およびメタデータ更新は, NFT データイベントを発信します. 本簿の変更または NFT ライフサイクル イベントに反応するビルドトリガーを購読するとき, `Nft` データのイベントフィルターを使用してください.

## 許可 {#permissions}

デフォルト許可表には NFT 特定のトークンが含まれます.

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

許可確認は,アクティブランタイム検証器によって実行されるため,ネットワークが執行プログラムをアップグレードすることにより権限をカスタマイズすることができます.現在のデフォルトトークンリストについては [Permission Tokens](/ja/reference/permissions.md)を参照してください.

## NFTs を選択する {#choosing-nfts}

NFT を使って,独占性と所有権が重要である記録について:

- 証明書,バッジ,ライセンス,証明書
- 会員またはアクセス記録
- アイデンティティに縛られたまたは口座所有の申請記録
- チェーン外メディア,文書,またはマニフェストへの参照

フンジブルバランスのために数値資産を使用し,データが既存のレジャーオブジェクトのコンパクト属性だけである場合,単純な [メタデータ](/ja/blockchain/metadata.md) を使用します.

参照:

- [資産](/ja/blockchain/assets.md)
- [メタデータ](/ja/blockchain/metadata.md)
- [指示](/ja/blockchain/instructions.md)
- [問い合わせ](/ja/blockchain/queries.md)
