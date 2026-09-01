---
translation_locale: ja
translation_source: /guide/index.md
translation_source_hash: 5ea24369e85692bd9069e446d1e50612efade2d83e4ddf73a4980582a2064a0e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ガイド {#guide}

このセクションは、Iroha を構築、運用、または統合するときに使用してください。まず最初のクライアント向けの SDK チュートリアルから始め、その後、共有ネットワークに対して展開する前にベストプラクティスとオペレーター向けリファレンスに進んでください。

## セクション {#sections}

|セクション|それに使ってください|
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| [SDK チュートリアル](/ja/guide/tutorials/)                           |言語別クライアント設定とサンプルアプリケーション|
| [ベストプラクティス](/ja/guide/best-practices/)                     |開発、展開、運用、セキュリティ、およびリリースに関する生産ガイダンス|
| [構成と管理](/ja/guide/configure/overview.md) |ローカルネットワークピアの設定、ブロックチェーンのジェネシス、クライアントの設定、キー、およびネットワークピアの管理|
| [セキュリティ](/ja/guide/security/)                                 |キー管理、運用セキュリティ、VPNs、不正監視、および権限管理|
| [高度な操作](/ja/guide/advanced/metrics.md)            |メトリクス、パフォーマンスチェック、カオステスト、ホットリロード、ベアメタル操作|

## 推奨パス {#recommended-path}

1. [Iroha 3 をインストールする](/ja/get-started/install-iroha.md) と [ローカルネットワークを立ち上げる](/ja/get-started/launch-iroha.md)。
2. [SDK チュートリアル](/ja/guide/tutorials/)を選んで、小さい取引を提出してください。
3. アプリケーション API を作成する前に、[アプリケーション開発](/ja/guide/best-practices/application-development.md) と [データモデリング](/ja/guide/best-practices/data-modeling.md) を確認してください。
4. 共有ネットワークまたは本番ネットワークを実行する前に、[ネットワーク展開](/ja/guide/best-practices/network-deployment.md)、[オペレーション](/ja/guide/best-practices/operations.md)、および[セキュリティとアクセス](/ja/guide/best-practices/security-and-access.md)を使用してください。
5. ローカル開発から Taira、Minamoto、または他のライブ展開にプロモートする際は、[リリース準備](/ja/guide/best-practices/release-readiness.md) に従ってください。
