---
translation_locale: ja
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 648e69f2a572a0bb3e88919831774d21c1a17438b8bde742224a1457880539c1
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ベアメタル上で Iroha を実行する {#running-iroha-on-bare-metal}

ネットワークピアを Docker Compose 経由ではなくホスト上で直接実行したい場合は、このワークフローを使用してください。現在のソースツリーには、ブロックチェーンのジェネシス、ネットワークピアの設定、クライアント設定、起動/停止スクリプトに対応する Kagami ジェネレーターが用意されています。

## 1. バイナリを構築する {#_1-build-the-binaries}

上流の Iroha ワークスペースから：

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

これは次のものを生成します:

- ネットワークピアデーモン用の`target/release/iroha3d`
- CLI のための `target/release/iroha`
- `target/release/kagami` キー、ブロックチェーンのジェネシス、そしてローカルネットの生成のために

## 2. ローカルネットワークを生成する {#_2-generate-a-local-network}

4ピアの Iroha 3 ローカルネットを生成する:

```bash
target/release/kagami localnet --peers 4 --out-dir ./localnet
```

出力ディレクトリには、生成された`genesis.json`、`genesis.signed.nrt`、ネットワークピア`config.toml`ファイル、`client.toml`、ヘルパースクリプト、およびそのバンドルの正確なコマンドを含む生成された`README.md`が含まれています。

## 3. ネットワークピアを開始する {#_3-start-peers}

生成された使い捨てローカルネットワークの場合、生成されたスクリプトを使用してください：

```bash
./localnet/start.sh
```

各ネットワークピアを systemd のようなプロセスマネージャに接続する必要がある場合は、各ネットワークピアのために `./localnet/README.md` に記録された起動コマンドを使用してください。各ネットワークピアの `config.toml`、秘密鍵、ストレージディレクトリ、およびポートは別々に保管してください。

## 4. ネットワークを操作する {#_4-operate-the-network}

生成されたクライアント設定を使用してください:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

生成されたローカルネットを次で停止してください:

```bash
./localnet/stop.sh
```

## 5. 製作ノート {#_5-production-notes}

- 本番用に新しいプライベートキーを生成し、それらをリポジトリの外に保存してください。
- すべてのネットワークピアが、同じ署名付きブロックチェーンのジェネシストランザクション、トポロジー、信頼できるネットワークピア、およびバリデーター PoPs に同意するようにします。
- ネットワークピアが他のマシンから到達できない場合にのみ、リスナーアドレスをホストローカルインターフェースにバインドします。
- Torii の露出、基本認証、TLS、およびレート制限のためにリバースプロキシまたはファイアウォールを使用してください。
- ブロックチェーンのジェネシスやコンセンサストポロジーへの変更は、単一のピアによるファイル編集ではなく、協調された移行として扱うべきです。

コンテナ化されたローカル開発には、[Iroha 3 を起動](../../get-started/launch-iroha.md) Docker Compose ワークフローを使用してください。
