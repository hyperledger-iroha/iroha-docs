---
translation_locale: ja
translation_source: /get-started/launch-iroha.md
translation_source_hash: 63eed8f987d33a487bb6329266eacbc09d10bb429027413997957579e31e80b4
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha 3 を起動 {#launch-iroha-3}

このページでは、上流リポジトリのデフォルトワークスペース資産を使用して、Iroha 3 の現在のローカルネットワークフローについて説明します。

## 1. ローカルマルチピアネットワークを生成する {#_1-generate-a-local-multi-peer-network}

現在の Kagami コードから、4ピアのローカルネットを生成する:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

出力ディレクトリには、対応するネットワークピアの設定ファイル `genesis.json`、`genesis.signed.nrt`、`client.toml` およびヘルパースクリプトが含まれています。

ネイティブのローカルスモークテストを行うには、生成されたネットワークピアを直接起動します:

```bash
./localnet/start.sh
```

コンテナ化された実行の場合、同じ localnet ディレクトリから Compose を生成します:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./docker-compose.yml \
  --force

docker compose -f ./docker-compose.yml up
```

デフォルトで生成されたスタックは次のものを公開します:

- ネットワークピア P2P ポート `1337` から `1340` へ
- Torii HTTP ポートを `8080` から `8083` へ
- `./localnet/client.toml` にある既製のクライアント設定

## 2. ネットワークが稼働していることを確認する {#_2-verify-that-the-network-is-up}

最初のネットワークピアで API エンドポイントのステータスを確認してください:

```bash
curl http://127.0.0.1:8080/status
```

デフォルトのヘルスチェックは次も使用します:

```bash
curl http://127.0.0.1:8080/status/blocks
```

バンドルされたクライアント設定にすぐに CLI を指すことができます：

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus プロフィール {#_3-nexus-profile}

このリポジトリは、`defaults/nexus/`の下で SORA Nexus 指向の設定プロファイルも提供します。

Nexus プロファイルでネイティブネットワークピアを実行するには:

```bash
./target/release/iroha3d --sora --config ./defaults/nexus/config.toml
```

そのプロフィールへの CLI アクセスには`defaults/nexus/client.toml`を使用してください。

## 4. ローカルネットワークを停止する {#_4-stop-the-local-network}

ネイティブ生成のローカルネットの場合:

```bash
./localnet/stop.sh
```

生成されたComposeスタックの場合：

```bash
docker compose -f ./docker-compose.yml down
```

ネットワークが稼働した後、[CLI を介して Iroha 3 を操作する](/ja/get-started/operate-iroha-via-cli.md) を続けてください。
