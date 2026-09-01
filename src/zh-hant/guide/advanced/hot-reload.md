---
translation_locale: zh-hant
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 熱的過載 Iroha 在一個 Docker 集裝箱 {#hot-reload-iroha-in-a-docker-container}

僅將熱重新載入用於本機偵錯。對於一般本機開發，優先重新建置映像，或使用新的 Kagami 套件重新啟動所產生的 Docker Compose 堆疊。

## 取代對等節點二進位制 {#replace-the-peer-binary}

從上游工作空間構建一個與Linux相容的 daemon二進位制:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

複製到執行的對等節點容器中,然後重新啟動該容器:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

使用 `docker ps`來確認容器名稱.在生成的堆中,對等節點容器由 `./docker-compose.yml`定義.

## 在一次性網路中重複創世紀 {#recommit-genesis-in-a-disposable-network}

對等節點僅在其儲存空白時提交創世區塊。對於一次性 Docker 網路，請停止堆疊、刪除產生的狀態、重新產生或替換已簽署的創世套件，然後重新啟動：

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

不要在一個必須儲存狀態的網路上取代創世.

## 使用定製配置 {#use-custom-configuration}

目前的對等節點配置是 TOML.將生成的 `config.toml`, `genesis.signed.nrt` 和相關關鍵檔案繫結或複製到預期的容器路徑中.將生成的檔案放在一起;從不同的 Kagami 執行中混合檔案可能會導致消產或共識失敗.
