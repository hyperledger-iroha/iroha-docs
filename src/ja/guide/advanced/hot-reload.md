---
translation_locale: ja
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 熱いリロード Iroha a で Docker 容器 {#hot-reload-iroha-in-a-docker-container}

ローカルデバッグのみでホットリロードを使用します.通常のローカル開発のために,画像を再構築するか,新しい Kagami バンケットから生成された Docker Compose スタックを再起動することを好みます.

## ピアバイナリー を 置き換える {#replace-the-peer-binary}

アップストリームワークスペースからLinux対応のデモンバイナリを作成します

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

実行中の Peer コンテナにコピーして,そのコンテナを再起動します.

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

コンテナの名前を確認するには `docker ps` を使用します.生成されたスタックでは,同等コンテナは `./docker-compose.yml` で定義されています.

## 1つの使い捨てネットワークで創世記を再開する {#recommit-genesis-in-a-disposable-network}

同級者は,その保存が空いている場合にのみ生成を行う.使い捨て Docker ネットワークでは,スタックを停止し,生成された状態を取り除き,署名した生成バンドルを再生または置き換え,再起動します.

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

その状態を保つ必要があるネットワークの生成を入れ替えるな

## カスタム設定を使用する {#use-custom-configuration}

現在のピア設定は TOML.生成された `config.toml`, `genesis.signed.nrt`,および関連キーファイルを画像が期待するコンテナ経路に結合し,ピアを再起動します.生成されたファイルを一緒に保持する.異なる Kagami 実行からファイルを混ぜることで,デセリアライゼーションまたはコンセンサスの失敗が生じます.
