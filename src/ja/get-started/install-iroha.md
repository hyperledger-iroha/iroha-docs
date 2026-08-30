---
translation_locale: ja
translation_source: /get-started/install-iroha.md
translation_source_hash: 613e81510c9de1bf341e545521fc27fa6a5e145ea3bbaab41664e95199ffbf35
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 設置 Iroha 3 {#install-iroha-3}

このページは,上流 `hyperledger-iroha/iroha` 作業空間を使用した Iroha 3 ツールチェーンの現在のインストールワークフローとバイナリーをカバーする.

## 1. 必須条件 {#_1-prerequisites}

まずはこれらをインストールする

- [rustup](https://www.rust-lang.org/tools/install)では,固定された `rust-toolchain.toml`ツールチェーン (`1.93.1`) が自動的にインストールされます.
- `git`
- Docker と Docker Compose を選択して,ローカル・マルチペア 快スタート

## 2. ワークスペースをクローンする {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. 作業場 を 建設 する {#_3-build-the-workspace}

すべてを建設する

```bash
cargo build --workspace
```

小規模なオペレーターに焦点を当てたビルドでは,主要なバイナリーのみをまとめます:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

結果のバイナリは `target/debug/` または `target/release/` に書き込まれます.

## 4. 設置された道具を確認する {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

通常使用する4つのバイナリーは:

- `iroha3d` 標準的なペアダイモン
- `iroha3d_taira`は,カノニカルな Taira 検証器の打ち上げ機
- `iroha` に関する CLI アクセス Torii 操作者のエンドポイント
- `kagami` 鍵,創始表およびローカルネットプロファイル

## 5. オプションローカルネットと Docker パス {#_5-optional-localnet-and-docker-path}

現在のソースサポートのローカルネットフローは Kagami によって生成されます. 同級構成,ジェネシスアーティファクト,クライアント構成,ヘルパースクリプトおよびチェックアウトされたコードに一致するオプションのコンポーズファイルを作成します:

- `kagami localnet` オリジナル・ローカル・ペアスクリプト
- ローカルネットディレクトリから生成された Docker Compose に対する `kagami docker`

[開始 Iroha 3](/ja/get-started/launch-iroha.md)を継続する.
