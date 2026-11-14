---
translation_locale: ja
translation_source: /reference/binaries.md
translation_source_hash: 887291d6ef0d9a919b076e4b632ee1cec7a2c289b284b40346ed4b2a0f4a41b3
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Iroha バイナリとの作業 {#working-with-iroha-binaries}

Iroha 3 オペレーターのワークフローは、4つの主要なバイナリを中心に展開します:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/irohad) ネットワークピアデーモンを実行するために
- Taira 検証ランチャーの標準 `iroha3d_taira`
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli) のために CLI そしてオペレーターのコマンド
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_kagami) キー、ブロックチェーンのジェネシス、ローカルネット、プロファイル用

## ソースからビルド {#build-from-source}

上流のワークスペースのルートから：

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

リリースバイナリはその後、`target/release/`で利用可能になります。

コマンド画面を確認するには:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## リポジトリから直接実行する {#run-directly-from-the-repository}

もし何もグローバルにインストールしたくない場合は、`cargo run` を使用してください。

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker 画像 {#docker-image}

同じリビジョンのバイナリをビルドして Docker で 4 台のバリデータを起動する手順は、[Iroha 3 を起動](/ja/get-started/launch-iroha.md) を参照してください。

## どのバイナリを使うべきですか？ {#which-binary-should-i-use}

- パブリック Taira バリデータリリースの外でネットワークピアを開始または操作するときは、`iroha3d`を使用してください。
- `iroha3d_taira --sora` は、正規の Taira バリデータのデプロイメントにのみ使用してください。これは Taira のチェーン、ストレージ、およびランタイムサイナープロファイルを強制します。
- ブロックチェーン台帳を照会したり、取引を送信したり、オペレーター API のエンドポイントを確認する必要がある場合は、`iroha`を使用してください。
- キー、ブロックチェーンのジェネシス技術マニフェスト、プロファイルバンドル、またはローカルネット資産が必要な場合は、`kagami` を使用してください。
