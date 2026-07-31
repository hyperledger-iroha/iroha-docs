---
translation_locale: zh-hant
translation_source: /get-started/launch-iroha.md
translation_source_hash: 9341b2404624dec2230bc294c3d60dc124ac9574a0a5803b9bba744f4c5e7f50
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 發射 Iroha 3 {#launch-iroha-3}

這個頁面通過目前的本地網絡流程, Iroha 3 透過使用
從上流資料庫中預設的工作空間資產.

## 1. 建立一個當地多同行網絡 {#_1-generate-a-local-multi-peer-network}

在電流中生成四對的本地網 Kagami 代碼:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

顯示出口目錄包含匹配的同行配置, `genesis.json`,
`genesis.signed.nrt`, `client.toml`, 並有助手的經典.

在本地吸煙測試中, 直接開始生成的同行:

```bash
./localnet/start.sh
```

在同一 localnet 目錄中生成 Compose:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./localnet/docker-compose.yml \
  --force

docker compose -f ./localnet/docker-compose.yml up
```

預設生成的堆積物顯示:

- 同級人 P2P 港口 `1337` 必須 `1340`
- Torii HTTP 港口 `8080` 必須 `8083`
- 已完成的客戶配置 `./localnet/client.toml`

## 2. 檢查網路是否開通 {#_2-verify-that-the-network-is-up}

檢查第一個等級的狀態終點:

```bash
curl http://127.0.0.1:8080/status
```

預設健康檢查也使用:

```bash
curl http://127.0.0.1:8080/status/blocks
```

您可以立即指向 CLI 在捆綁的客戶端配置上:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus 專屬資料 {#_3-nexus-profile}

存儲庫也提供了 SORA Nexus- 導向的配置格式
`defaults/nexus/`.

在這個國家的經濟狀況下, Nexus 簡介:

```bash
./target/release/irohad --sora --config ./defaults/nexus/config.toml
```

使用 `defaults/nexus/client.toml` 關於 CLI 該網站的使用者可獲得此檔案.

## 4. 停止本地網路 {#_4-stop-the-local-network}

對於原生產的本地網路:

```bash
./localnet/stop.sh
```

關於生成的 Compose 堆:

```bash
docker compose -f ./localnet/docker-compose.yml down
```

在網路開通後,
[運行 Iroha 3 透過 CLI](/zh-hant/get-started/operate-iroha-via-cli.md).
