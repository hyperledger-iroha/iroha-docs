---
translation_locale: ja
translation_source: /reference/binaries.md
translation_source_hash: fd9cefe7c0f5ee2f273a06b453d11d0e9bb896a35f872297276f5e052912a035
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha バイナリーで作業 {#working-with-iroha-binaries}

Iroha 3 オペレーターのワークフローは3つの主要なバイナリを中心に回転します:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) ピアデモンを実行する
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli)について CLI およびオペレーターコマンド
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) キー,ゲネス,ローカルネット,プロフィール

## 源 から 築く {#build-from-source}

アップストリームワークスペースのルーツから:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

リリースバイナリーは `target/release/` で利用可能である.

コマンドの表面を検査するには

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## 資料庫から直接実行する {#run-directly-from-the-repository}

グローバルにインストールしたくない場合は, `cargo run` を使用してください.

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker 画像 {#docker-image}

アップストリームワークスペースは,チェックアウトコードに一致する Docker Compose ファイルを生成するために `kagami localnet` と `kagami docker` を使用します.その生成されたファイルで`hyperledger/iroha:dev` 画像を使用することができます.

CLI をコンテナで運ぶ.

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Kagami をコンテナで運ぶ.

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

ピアスタートアップでは,ローカルネットを生成し,まずファイルをコンパoseします:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## どちらのバイナリを使えばいいのか? {#which-binary-should-i-use}

- `irohad` を 同僚を起動または操作する際に使用してください.
- `iroha` を使って,本簿を查询したり,取引を送信したり,オペレーターエンドポイントの検査を行うとき.
- `kagami` を 鍵,生成マニフェスト,プロフィールバンドル,またはローカルネット資産が必要なときに使用します.
