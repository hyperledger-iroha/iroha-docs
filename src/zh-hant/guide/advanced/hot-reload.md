---
translation_locale: zh-hant
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 熱的重載 Iroha 在一個 Docker 集裝箱 {#hot-reload-iroha-in-a-docker-container}

對於正常的本地開發,更好重建圖像或從新增的 Kagami 捆綁中重新啓動生成的 Docker Compose 堆

## 取代同行二進制 {#replace-the-peer-binary}

從上游工作空間構建一個與Linux兼容的 daemon二進制:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

複製到運行的同行容器中,然後重新啓動該容器:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

使用 `docker ps`來確認容器名稱.在生成的堆中,同等容器由 `./docker-compose.yml`定義.

## 在一次性網絡中重複創世紀 {#recommit-genesis-in-a-disposable-network}

在一個一次性 Docker 網絡中,停止堆,刪除生成狀態,再生或更換籤署的創新捆綁,然後重新啓動:

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

不要在一個必須保存狀態的網絡上取代基因.

## 使用定製配置 {#use-custom-configuration}

目前的同行配置是 TOML.將生成的 `config.toml`, `genesis.signed.nrt` 和相關關鍵文件綁定或複製到預期的容器路徑中.將生成的文件放在一起;從不同的 Kagami 運行中混合文件可能會導致消產或共識失敗.
