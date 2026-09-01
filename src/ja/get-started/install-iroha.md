---
translation_locale: ja
translation_source: /get-started/install-iroha.md
translation_source_hash: 613e81510c9de1bf341e545521fc27fa6a5e145ea3bbaab41664e95199ffbf35
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha 3 をインストールする {#install-iroha-3}

このページでは、上流の`hyperledger-iroha/iroha`ワークスペースを使用した Iroha 3 ツールチェーンとバイナリの現在のインストールワークフローについて説明します。

## 1. 前提条件 {#_1-prerequisites}

まずこれらをインストールしてください：

- [rustup](https://www.rust-lang.org/tools/install)、そのため固定された`rust-toolchain.toml`ツールチェーン(`1.93.1`)が自動的にインストールされます
- `git`
- 任意で、ローカルマルチピアクイックスタート用の Docker と Docker Compose

## 2. ワークスペースをクローンする {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. 作業スペースを作る {#_3-build-the-workspace}

すべてを構築する:

```bash
cargo build --workspace
```

より小規模でオペレーター向けのビルドの場合、メインのバイナリだけをコンパイルします:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

生成されたバイナリは `target/debug/` または `target/release/` に書き込まれます。

## 4. インストールされたツールを確認する {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

通常使用する4つのバイナリは次の通りです:

- `iroha3d` 標準ネットワークピアデーモン用
- `iroha3d_taira` の標準的な Taira バリデータランチャー用
- CLI が Torii およびオペレーター API エンドポイントにアクセスするための`iroha`
- `kagami` キー、ブロックチェーンジェネシス技術マニフェスト、およびローカルネットプロファイル用

## 5. 任意のローカルネットと Docker パス {#_5-optional-localnet-and-docker-path}

現在のソースバック付きローカルネットフローは Kagami によって生成されます。これはネットワークピアの設定、ブロックチェーンのジェネシスアーティファクト、クライアント設定、ヘルパースクリプト、およびチェックアウトされたコードに一致するオプションのComposeファイルを書き込みます:

- `kagami localnet` ネイティブのローカルネットワークピアスクリプト用
- Docker Compose のための `kagami docker` がローカルネットディレクトリから生成されました

[Iroha 3 を起動](/ja/get-started/launch-iroha.md)を続けてください。
