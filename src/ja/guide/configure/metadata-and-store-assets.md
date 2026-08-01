---
translation_locale: ja
translation_source: /guide/configure/metadata-and-store-assets.md
translation_source_hash: b538b2cad11d4fd3b2b7d201a20882389049d3e4453f11baa6f854861bda6b51
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# メタデータとレジャーストレージの選択肢 {#metadata-and-ledger-storage-choices}

Iroha 3 データモデルには任意のキー値データについて別々の `Store` アセットタイプはありません.次のストレージオプションを使用してください.

## メタデータ {#metadata}

[メタデータ](/ja/blockchain/metadata.md)は,レジャーオブジェクトに属する小さな JSON フィールドに使用します.

- 名称とラベルを表示する
- 統合 IDs
- 小型の政策旗
- URIs,CIDs,または SoraFS のパスが,より大きな役に立たない負荷を指す.

メタデータは世界状態の一部であり,それを所有するオブジェクトとともに返されます.キーが安定し,値はコンパクトで,許可は明示的に保持します.大きなドキュメントやログ,または高速アプリケーションの状態をメタデータに直接保存しないでください.

## 数値資産と NFTs {#numeric-assets-and-nfts}

[資産](/ja/blockchain/assets.md)および [NFTs](/ja/blockchain/nfts.md)を,状態が価値をもたらす場合に使用する.

- フンギブル・バランスの数値資産
- NFTs 単独所有の記録について
- [RWAs](/ja/blockchain/rwas.md)および他のドメイン特有のオブジェクトが,アクティブデータモデルによって暴露される場合

資産と NFTs には独自の IDs,ライフサイクルイベント,転送行動,許可チェックがあります.所有権,不十分さ,または転送履歴が重要な場合,それらはメタデータよりも優れています.

## チェーン外データ {#off-chain-data}

大型または変形可能な有用荷物に対して,チェーン外のストレージを使用します. チェーンの上で安定した参照のみを保管してください:

- 内容ハッシュ
- a URI
- SoraFS 経路または表参照
- 申請証明書で使用されたコンパクトなコミットメント

これは, WSV を小さく保つ一方,依然としてアプリケーションが連鎖外の有用な負荷が連鎖上の参照に一致していることを確認できるようにします.

## 場所 を 選ぶ {#choosing-a-location}

この手指ルを使ってください

- レジャーオブジェクトのコンパクト属性であれば メタデータを使用します.
- NFT またはドメイン特有のオブジェクトとしてモデル化する.
- WSV の外に保管し,検証可能な参照をチェーン上に配置する.

メタデータ権限については, [Permission Tokens](/ja/reference/permissions.md)を参照してください.
