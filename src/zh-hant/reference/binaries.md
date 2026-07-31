---
translation_locale: zh-hant
translation_source: /reference/binaries.md
translation_source_hash: fd9cefe7c0f5ee2f273a06b453d11d0e9bb896a35f872297276f5e052912a035
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 工作與 Iroha 雙數字 {#working-with-iroha-binaries}

其他國家 Iroha 3 操作員工作流程以三個主要二元為主:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) 經營同行妖怪
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) 關於 CLI 操作員的命令
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) 關鍵,基因,局域網和配置文件

## 建立從源頭 {#build-from-source}

來自上流工作空間根:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

發放二元數據則可在 `target/release/`.

檢查指令表面:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## 直接從資料庫中執行 {#run-directly-from-the-repository}

如果您不想在全球安裝任何東西, `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker 圖像 {#docker-image}

上游工作空間使用 `kagami localnet` 及其他 `kagami docker` 產生
Docker Compose 文件與已查出的代碼相匹配. `hyperledger/iroha:dev`
圖像可以與生成的檔案一起使用.

運行 CLI 在容器中:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

跑起來 Kagami 在容器中:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

建立一個本地網,

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## 該使用哪一種二元? {#which-binary-should-i-use}

- 使用 `irohad` 在您開始或經營同行時.
- 使用 `iroha` 在您需要查詢本簿,提交交易或檢查操作員端點時.
- 使用 `kagami` 在您需要關鍵,創世記錄, 配置文件捆綁或本地網路資產時.
