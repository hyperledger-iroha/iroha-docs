---
translation_locale: ja
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# 構成と管理 {#configuration-and-management}

Iroha の構成には、2つの権限レイヤーがあります:

- ローカルネットワークのピアおよびクライアント構成は、TOML ファイルに保存され、プロセス起動時に読み込まれます
- オンチェーン設定は、トランザクションを通じて変更されます [`SetParameter`](/ja/blockchain/instructions.md#setparameter)

ノードの識別、アドレス、ログ、ストレージ、クライアント署名キーにはローカル設定を使用してください。ネットワークで合意され、決定的に再生される必要がある値にはオンチェーン設定を使用してください。

本番での動作はこれらの設定レイヤーから来なければなりません。環境変数はローカルツールにテスト入力を提供するためには便利かもしれませんが、本番の機能ゲートではなく、最終的に確定した設定の代わりにはなりません。

主な設定のエントリーポイントは次のとおりです:

- [ブロックチェーンのジェネシス](/ja/guide/configure/genesis.md)
- [クライアント設定](/ja/guide/configure/client-configuration.md)
- [ネットワーク展開のためのキー](/ja/guide/configure/keys-for-network-deployment.md)
- [ベアメタルで動作する](/ja/guide/advanced/running-iroha-on-bare-metal.md)
- [ネットワークピア設定リファレンス](/ja/reference/peer-config/index.md)
