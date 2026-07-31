---
translation_locale: ja
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 構成と管理 {#configuration-and-management}

Iroha 構成は2つの権威層を有する.

- TOML ファイルに保存され,プロセスの起動時に読み取られる.
- [`SetParameter`](/ja/blockchain/instructions.md#setparameter)を通じて取引によって変更されたチェーン上の配置

ノードアイデンティティ,アドレス,ログイン,ストレージ,クライアントサインキーのためのローカル設定を使用します.ネットワークが合意し決定的に再生しなければならない値のためにチェーン上の設定を使用する.

生産行動はこれらの構成層から来なければならない.環境変数は,地元のツールにテストインプットを供給するのに便利かもしれないが,それらは生産機能ゲートではないし,コミットされた構成を置き換えない.

主なコンフィギュレーションエントリーポイントは:

- [創世記](/ja/guide/configure/genesis.md)
- [クライアントの設定](/ja/guide/configure/client-configuration.md)
- [ネットワーク部署のキー](/ja/guide/configure/keys-for-network-deployment.md)
- [裸金属で動作する](/ja/guide/advanced/running-iroha-on-bare-metal.md)
- [ピア・コンフィギュレーション参照](/ja/reference/peer-config/index.md)
