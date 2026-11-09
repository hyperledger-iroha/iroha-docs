---
translation_locale: ja
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 8cdae05a133736fe528bf9d7e709af5c704e85e5f7dee09e0aa762f3214efd2d
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Docker コンテナ内のホットリロード Iroha {#hot-reload-iroha-in-a-docker-container}

ホットリロードはローカルでのデバッグにのみ使用してください。 同じリビジョンのバイナリをビルドして Docker で 4 台のバリデータを起動する手順は、[Iroha 3 を起動](/ja/get-started/launch-iroha.md) を参照してください。

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

`docker ps` で対象のコンテナを確認します。デーモンを置き換える前に、イメージ内のパスを確認してください。

## 使い捨てネットワークでブロックチェーンのジェネシスを再コミットする {#recommit-genesis-in-a-disposable-network}

新しいジェネシスブロックを使用するには、ピアのストレージが空である必要があります。 同じネットワークを再起動するには、`python3 poc.py down`、`python3 poc.py up` の順に実行します。`state/` は 4 つの Docker ボリュームと一緒に保管してください。

## カスタム設定を使用 {#use-custom-configuration}

現在のネットワークピアの構成は TOML です。生成された `config.toml`、`genesis.signed.nrt`、および関連する鍵ファイルを、コンテナが期待するパスにバインドマウントまたはコピーしてください。イメージを作成したら、ネットワークピアを再起動してください。生成されたファイルはまとめて保持してください。異なる Kagami 実行からのファイルを混ぜると、逆シリアル化やコンセンサスの失敗が発生する可能性があります。
