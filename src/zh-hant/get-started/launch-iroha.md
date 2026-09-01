---
translation_locale: zh-hant
translation_source: /get-started/launch-iroha.md
translation_source_hash: 63eed8f987d33a487bb6329266eacbc09d10bb429027413997957579e31e80b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 啟動 Iroha 3 {#launch-iroha-3}

本頁面透過使用上游儲存庫中的預設工作空間資產來檢視 Iroha 3 的當前本地網路流動.

## 1. 建立一個地方多對等節點網路 {#_1-generate-a-local-multi-peer-network}

從當前的 Kagami 程式碼生成一個四對子本地網路:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

輸出目錄包含相匹配的對等節點配置, `genesis.json`, `genesis.signed.nrt`, `client.toml`和輔助指令碼.

在本地冒煙測試中,直接啟動生成的對等節點:

```bash
./localnet/start.sh
```

在一個容器執行中,從同一 localnet目錄生成 Compose:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./docker-compose.yml \
  --force

docker compose -f ./docker-compose.yml up
```

預設生成的堆曝光:

- 同等 P2P 埠 `1337`到 `1340`
- Torii HTTP 港口 `8080`到 `8083`
- 在 `./localnet/client.toml` 設定已完成的客戶端配置

## 2. 檢查網路是否開通 {#_2-verify-that-the-network-is-up}

檢查第一個對等節點狀態端點:

```bash
curl http://127.0.0.1:8080/status
```

預設健康檢查還使用:

```bash
curl http://127.0.0.1:8080/status/blocks
```

您可以立即將 CLI 指向捆綁的客戶端配置:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus 個人資料 {#_3-nexus-profile}

儲存庫還將一個以 SORA Nexus 為導向的配置資料傳送到 `defaults/nexus/`.

執行一個具有 Nexus 配置檔案的原生對等節點:

```bash
./target/release/iroha3d --sora --config ./defaults/nexus/config.toml
```

使用 `defaults/nexus/client.toml`來獲取 CLI 該配置檔案.

## 4. 停止本地網路 {#_4-stop-the-local-network}

對於原生生成的本地網路:

```bash
./localnet/stop.sh
```

對於生成的Compose堆:

```bash
docker compose -f ./docker-compose.yml down
```

網路執行後,繼續使用 [透過 CLI](/zh-hant/get-started/operate-iroha-via-cli.md)執行 Iroha 3.
