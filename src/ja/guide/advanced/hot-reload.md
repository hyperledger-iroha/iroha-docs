---
translation_locale: ja
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Docker コンテナ内のホットリロード Iroha {#hot-reload-iroha-in-a-docker-container}

ホットリロードはローカルデバッグ時のみに使用してください。通常のローカル開発では、イメージを再構築するか、新しい Kagami バンドルから生成された Docker Compose スタックを再起動することを推奨します。

## ネットワークピアのバイナリを置き換える {#replace-the-peer-binary}

アップストリームの作業領域からLinux対応のデーモンバイナリをビルドする:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

それを実行中のネットワークピアコンテナにコピーしてから、そのコンテナを再起動します:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

`docker ps`を使用してコンテナ名を確認します。生成されたスタックでは、ネットワークピアコンテナは`./docker-compose.yml`によって定義されています。

## 使い捨てネットワークでブロックチェーンのジェネシスを再コミットする {#recommit-genesis-in-a-disposable-network}

ネットワークピアは、そのストレージが空の場合にのみブロックチェーンのジェネシスを確定します。使い捨ての Docker ネットワークでは、スタックを停止し、生成された状態を削除し、署名されたブロックチェーンジェネシスバンドルを再生成または置き換え、再度開始します:

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

状態を保持する必要があるネットワークでブロックチェーンのジェネシスを置き換えないでください。

## カスタム設定を使用 {#use-custom-configuration}

現在のネットワークピアの構成は TOML です。生成された `config.toml`、`genesis.signed.nrt`、および関連する鍵ファイルを、コンテナが期待するパスにバインドマウントまたはコピーしてください。イメージを作成したら、ネットワークピアを再起動してください。生成されたファイルはまとめて保持してください。異なる Kagami 実行からのファイルを混ぜると、逆シリアル化やコンセンサスの失敗が発生する可能性があります。
