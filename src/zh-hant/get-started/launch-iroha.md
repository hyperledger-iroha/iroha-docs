---
translation_locale: zh-hant
translation_source: /get-started/launch-iroha.md
translation_source_hash: 9341b2404624dec2230bc294c3d60dc124ac9574a0a5803b9bba744f4c5e7f50
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 發射 Iroha 3 {#launch-iroha-3}

本頁面通過使用上游存儲庫中的默認工作空間資產來查看 Iroha 3 的當前本地網絡流動.

## 1. 創建一個地方多同行網絡 {#_1-generate-a-local-multi-peer-network}

從當前的 Kagami 代碼生成一個四對子本地網絡:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

輸出目錄包含相匹配的同行配置, `genesis.json`, `genesis.signed.nrt`, `client.toml`和輔助腳本.

在本地煙霧測試中,直接啓動生成的同齡人:

```bash
./localnet/start.sh
```

在一個容器運行中,從同一 localnet目錄生成 Compose:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./localnet/docker-compose.yml \
  --force

docker compose -f ./localnet/docker-compose.yml up
```

默認生成的堆曝光:

- 同等 P2P 端口 `1337`到 `1340`
- Torii HTTP 港口 `8080`到 `8083`
- 在 `./localnet/client.toml` 設置已完成的客戶端配置

## 2. 檢查網絡是否開通 {#_2-verify-that-the-network-is-up}

檢查第一個同行狀態終點:

```bash
curl http://127.0.0.1:8080/status
```

默認健康檢查還使用:

```bash
curl http://127.0.0.1:8080/status/blocks
```

您可以立即將 CLI 指向捆綁的客戶端配置:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus 個人資料 {#_3-nexus-profile}

存儲庫還將一個以 SORA Nexus 爲導向的配置資料發送到 `defaults/nexus/`.

運行一個具有 Nexus 配置文件的原生同行:

```bash
./target/release/irohad --sora --config ./defaults/nexus/config.toml
```

使用 `defaults/nexus/client.toml`來獲取 CLI 該配置文件.

## 4. 停止本地網絡 {#_4-stop-the-local-network}

對於原生生成的本地網絡:

```bash
./localnet/stop.sh
```

對於生成的Compose堆:

```bash
docker compose -f ./localnet/docker-compose.yml down
```

網絡運行後,繼續使用 [通過 CLI](/zh-hant/get-started/operate-iroha-via-cli.md)運行 Iroha 3.
