---
translation_locale: ja
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 648e69f2a572a0bb3e88919831774d21c1a17438b8bde742224a1457880539c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha を Bare Metal で 実行する {#running-iroha-on-bare-metal}

このワークフローを Docker Compose の代わりにホストでペアを直接実行したいときに使用します.現在のソースツリーでは,マッチングジェネシス,ピア設定,クライアント設定,およびスタート/ストップスクリプトを書く Kagami 発電機が提供されます.

## 1. バイナリー を 作る {#_1-build-the-binaries}

Iroha 上流作業場から:

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

これは:

- `target/release/iroha3d` ピアダイモン
- `target/release/iroha`について CLI
- `target/release/kagami` キー,ゲネス,ローカルネット生成

## 2. ローカル・ネットワークを作成する {#_2-generate-a-local-network}

4ペアを生成する Iroha 3 ローカルネット

```bash
target/release/kagami localnet --peers 4 --out-dir ./localnet
```

出力ディレクトリには,生成された `genesis.json`, `genesis.signed.nrt`,ペア`config.toml`ファイル,`client.toml`,ヘルパースクリプト,および生成された `README.md` が含まれ,そのバンドルに対する正確なコマンドが表示されます.

## 3. 同級者 を 開始 する {#_3-start-peers}

生成された使い捨てローカルネットでは,生成したスクリプトを使用します.

```bash
./localnet/start.sh
```

各ペアを systemd などのプロセス管理器にワイヤリングする必要がある場合は,各ペアに対して `./localnet/README.md` で記録された起動コマンドを使用します.それぞれのペアの `config.toml` プライベートキー,ストレージディレクトリ,ポートを別々に保持してください.

## 4. ネットワークを運営する {#_4-operate-the-network}

作成されたクライアント設定を使用します:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

生成されたローカルネットを:

```bash
./localnet/stop.sh
```

## 5. 生産記号 {#_5-production-notes}

- 生産のための新鮮なプライベートキーを生成し,リポジトリの外に保管します.
- 同じ署名されたジェネシス取引,トポロジー,信頼される同級生,検証者 PoPs に一致させる
- 他のマシンからピアがアクセスできない場合にのみ,ホストローカルインターフェースに聴衆のアドレスを結合する.
- Torii 曝露,基本的な auth, TLS,および速度の制限のために逆代理またはファイアウォールを使用します.
- ジェネスやコンセンサスのトポロジーへの変更は,単同ファイルの編集ではなく,調整された移行とみなす.

コンテナ化されたローカル開発では, [ランニング Iroha 3](../../get-started/launch-iroha.md) Docker Compose ワークフローを使用します.
