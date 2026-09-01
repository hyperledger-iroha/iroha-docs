---
translation_locale: ja
translation_source: /blockchain/nfts.md
translation_source_hash: 6dd2d21a29f352a14cb17046c66cfa541ef501b733b95bb6874d2d3f86ec0504
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# NFTs {#nfts}

「Iroha NFT」は、所有者が1人のユニークなブロックチェーン台帳オブジェクトです。記録に独自のID、メタデータ、ライフサイクルイベント、および所有権移転の意味を持たせたい場合に NFTs を使用しますが、数値の残高は必要ありません。

数値の[資産](/ja/blockchain/assets.md)とは異なり、NFT には精度、資産発行ポリシー、またはアカウントごとの数量はありません。NFT は1つの登録されたオブジェクトとして存在し、そのオブジェクト上で所有権が直接追跡されます。

## 構造 {#structure}

登録された`Nft`には以下が含まれます:

- `id`：1つの`NftId`
- `content`： NFT を説明するメタデータ
- `owned_by`：NFT を所有しているアカウント

`content` フィールドは `Metadata` マップです。コンパクトに保ちましょう：そこには説明フィールド、安定した参照、暗号ハッシュ、URIs、または SoraFS パスを保存します。大きな文書、メディア、または変動の激しいアプリケーション状態はオフチェーンに保存し、NFT には検証可能な参照のみを保持します。

## Taira でこのワークフローを実行してください {#try-it-on-taira}

現在、パブリック Taira テストネットに NFT 件の記録があるかどうかを確認してください:

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

ノードによって公開されている NFT ルートについては、ライブ OpenAPI ドキュメントを確認してください:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

空の `items` 配列は、パブリックテストネットで有効な応答です。これは現在のページに NFTs が存在しないことを意味し、NFT の指示が利用できないことを意味するわけではありません。

## NFT ID {#nft-ids}

`NftId` はこのテキスト形式を使用します:

```text
name$domain
name$domain.dataspace
```

例えば、`badge$docs.universal` は `docs.universal` ドメイン内の `badge` NFT を識別します。データスペースが省略された場合、現在のパーサーは `universal` データスペースを使用するため、`badge$docs` は `badge$docs.universal` に解決されます。

NFT IDには安定した名前を使用してください。このIDは、命令、クエリ、権限、イベントフィルター、およびアプリケーション参照で使用されるオブジェクト識別子です。

## ライフサイクル {#lifecycle}

NFT ライフサイクル操作は Iroha 指示操作を使用します:

- [`Register`](/ja/blockchain/instructions.md#un-register) 作る NFT 最初の状態で `content`.
- [`Unregister`](/ja/blockchain/instructions.md#un-register) を取り除く NFT.
- [`Transfer`](/ja/blockchain/instructions.md#transfer) 変化 `owned_by`.
- [`SetKeyValue` そして `RemoveKeyValue`](/ja/blockchain/instructions.md#setkeyvalue-removekeyvalue) 更新 NFT メタデータ。

## ローカルで試す {#try-it-locally}

これらの例は、ローカルネットワークを起動し、[CLI ガイド](/ja/get-started/operate-iroha-via-cli.md) から生成されたクライアント設定を持っていることを前提としています。

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

生成されたローカルネットはすでに`wonderland.universal`とその SNS リースを設定しています。別のドメインを使用するには、まず[ドメイン](/ja/blockchain/domains.md#registration)に記載されている宣言型`app alias setup plan`および`app alias setup apply`ワークフローでドメインを作成してください。

NFT を登録します。登録は標準入力から初期内容 JSON を読み取ります:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

直接 NFT を検査し、次にすべての NFTs を完全なエントリ付きで一覧にしてください:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

メタデータキーを追加して、再度 NFT を読み取ります:

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

オプションで NFT を転送します。`owned_by`から現在の所有者を読み取るには`ledger nft get`を使用し、宛先アカウントIDを見つけるには`ledger account list all`を使用します。

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

ウォークスルーの後に例 NFT を削除してください。もし転送した場合は、元に戻すか、現在の所有者のアカウント設定で登録解除コマンドを送信してください。

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## クエリとイベント {#queries-and-events}

使う [`FindNfts`](/ja/reference/queries.md#assets-nfts-and-rwas) 一覧にする NFTs そして [`FindNftsByAccountId`](/ja/reference/queries.md#assets-nfts-and-rwas) 一覧にする NFTs アカウントに所有されている。

NFT の登録、削除、移転、およびメタデータの更新は NFT データイベントを発行します。ブロックチェーン台帳の変更を購読する場合や NFT ライフサイクルイベントに反応するトリガーを作成する場合は、`Nft` データイベントフィルターを使用してください。

## 権限 {#permissions}

デフォルトの権限範囲には、NFT 固有のトークンが含まれます:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

権限チェックはアクティブなソフトウェアランタイムバリデータによって強制されるため、ネットワークは実行者をアップグレードすることで認可をカスタマイズできます。現在のデフォルトのトークンリストについては、[許可トークン](/ja/reference/permissions.md) を参照してください。

## NFTs を選択する {#choosing-nfts}

一意性と所有権が重要な記録には、NFT を使用してください:

- 証明書、バッジ、ライセンス、および証明書類
- 会員情報またはアクセス記録
- IDに紐づいたまたはアカウント所有のアプリケーション記録
- オフチェーンのメディア、文書、または技術マニフェストへの参照

代替可能な残高には数値資産を使用し、データが既存のブロックチェーン台帳オブジェクトのコンパクトな属性に過ぎない場合は、通常の [メタデータ](/ja/blockchain/metadata.md) を使用します。

参照：

- [資産](/ja/blockchain/assets.md)
- [メタデータ](/ja/blockchain/metadata.md)
- [指示](/ja/blockchain/instructions.md)
- [クエリ](/ja/blockchain/queries.md)
