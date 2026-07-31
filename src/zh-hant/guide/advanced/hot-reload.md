---
translation_locale: zh-hant
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 2c71e6c135d862d626d3b184eef3cbed350f1353d7dee78cc129092e7b857924
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 熱的重載 Iroha 在一個 Docker 集裝箱 {#hot-reload-iroha-in-a-docker-container}

請使用溫度重裝,只能進行本地調查.
再建圖像或重新啟動生成的圖像 Docker Compose 來自一個
新鮮 Kagami 這樣的東西,

## 取代同行二元 {#replace-the-peer-binary}

在上游工作空間中建立一個與 Linux 兼容的 daemon 雙數字:

```bash
cargo build --release -p irohad --target x86_64-unknown-linux-musl
```

複製到正在運行的同行容器,

```bash
docker cp target/x86_64-unknown-linux-musl/release/irohad <container>:/usr/local/bin/irohad
docker restart <container>
```

使用 `docker ps` 在生成的堆中,
容器的定義是: `./localnet/docker-compose.yml`.

## 在一次性網路上重新啟動創世記 {#recommit-genesis-in-a-disposable-network}

只有在庫空時才開始生產. Docker
網路,停止堆,移除生成的狀態,再生或更換
開始重新進行:

```bash
docker compose -f ./localnet/docker-compose.yml down
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

必須保持其狀態.

## 使用定制配置 {#use-custom-configuration}

目前的同行配置是 TOML. 綁定或複製生成的
`config.toml`, `genesis.signed.nrt`, 並將相關的關鍵檔案放入容器
保持生成的檔案.
混合不同檔案 Kagami 這種運行可能會產生脫氧化或
沒有共識.
