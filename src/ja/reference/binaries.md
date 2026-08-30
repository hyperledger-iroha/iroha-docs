---
translation_locale: ja
translation_source: /reference/binaries.md
translation_source_hash: 5a36877954bec97691e45697680bfbd6e0a7c7695e48a796bc7c9a41d4756644
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha バイナリーで作業 {#working-with-iroha-binaries}

Iroha 3 オペレーターのワークフローは4つの主要なバイナリを中心に回転します:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) ピアデモンを実行する
- `iroha3d_taira`は,カノニカルな Taira 検証器の打ち上げ機
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli)について CLI およびオペレーターコマンド
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) キー,ゲネス,ローカルネット,プロフィール

## 源 から 築く {#build-from-source}

アップストリームワークスペースのルーツから:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

リリースバイナリーは `target/release/` で利用可能である.

コマンドの表面を検査するには

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## 資料庫から直接実行する {#run-directly-from-the-repository}

グローバルにインストールしたくない場合は, `cargo run` を使用してください.

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
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
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## どちらのバイナリを使えばいいのか? {#which-binary-should-i-use}

- 公開された Taira バリダーターリリースの外で同級者を起動または操作するときに, `iroha3d` を使用します.
- 使用 `iroha3d_taira --sora` カノニカルでのみ Taira 検証器の部署は, Taira チェーン,ストレージ,ランタイムサインのプロフィール
- `iroha` を使って,本簿を查询したり,取引を送信したり,オペレーターエンドポイントの検査を行うとき.
- `kagami` を 鍵,生成マニフェスト,プロフィールバンドル,またはローカルネット資産が必要なときに使用します.
