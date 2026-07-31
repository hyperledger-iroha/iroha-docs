---
translation_locale: ja
translation_source: /get-started/launch-iroha.md
translation_source_hash: 9341b2404624dec2230bc294c3d60dc124ac9574a0a5803b9bba744f4c5e7f50
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 打ち上げ Iroha 3 {#launch-iroha-3}

このページは,上流リポジトリからのデフォルトワークスペース資産を使用した Iroha 3 の現在のローカルネットワークフローを閲覧します.

## 1. ローカル・マルチピアネットワークを作成する {#_1-generate-a-local-multi-peer-network}

現在の Kagami コードから4ペアローカルネットを生成する:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

出力ディレクトリには,匹敵するペアコンフィギュレーション, `genesis.json`, `genesis.signed.nrt`, `client.toml`,およびヘルパースクリプトが含まれています.

地元の煙のテストでは,生成された同類を直接開始します.

```bash
./localnet/start.sh
```

コンテナ化された実行では,同じローカルネットディレクトリからComposeを生成します:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./localnet/docker-compose.yml \
  --force

docker compose -f ./localnet/docker-compose.yml up
```

デフォルトで生成されたスタックは:

- ピア P2P ポート `1337`から `1340`まで
- Torii HTTP 港口 `8080` について `8083`
- `./localnet/client.toml`で完成したクライアント設定

## 2. ネットワーク が 稼働 し て いる か を 確認 する {#_2-verify-that-the-network-is-up}

最初のピアでステータスエンドポイントを確認する:

```bash
curl http://127.0.0.1:8080/status
```

デフォルトの健康チェックには以下が含まれています.

```bash
curl http://127.0.0.1:8080/status/blocks
```

CLI をすぐにバンドされたクライアント設定に指すことができます:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus プロフィール {#_3-nexus-profile}

SORA Nexus に指向された設定プロフィールも `defaults/nexus/` に送信する.

Nexus プロフィールでネイティブピアを実行するには:

```bash
./target/release/irohad --sora --config ./defaults/nexus/config.toml
```

そのプロフィールへのアクセス CLI に `defaults/nexus/client.toml` を使用する.

## 4. ローカルネットワークを停止する {#_4-stop-the-local-network}

ネイティブ生成ローカルネット:

```bash
./localnet/stop.sh
```

生成されたコンポーズスタックについては:

```bash
docker compose -f ./localnet/docker-compose.yml down
```

ネットワークが実行された後, [で続行する Iroha 3 を介して CLI](/ja/get-started/operate-iroha-via-cli.md)を操作する.
