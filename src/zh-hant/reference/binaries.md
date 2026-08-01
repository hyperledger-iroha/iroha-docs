---
translation_locale: zh-hant
translation_source: /reference/binaries.md
translation_source_hash: fd9cefe7c0f5ee2f273a06b453d11d0e9bb896a35f872297276f5e052912a035
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 與 Iroha 二進制貨幣合作 {#working-with-iroha-binaries}

Iroha 3 操作員的工作流程圍繞三個主要二進制:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad)用於運行一個同類妖怪
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli)用於 CLI 和操作員指令
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami)用於密鑰,基因,局域網和個人資料

## 建立從源頭 {#build-from-source}

從上游工作空間的根源:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

在 `target/release/` 中,釋放二進制品可使用.

爲了檢查指揮面:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## 直接從存儲庫中運行 {#run-directly-from-the-repository}

如果您不想在全球範圍內安裝任何東西,請使用 `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker 圖像 {#docker-image}

上游工作空間使用 `kagami localnet` 和 `kagami docker` 產生 Docker Compose 文件與檢查出來的代碼相匹配. `hyperledger/iroha:dev` 圖像可以與生成的文件一起使用.

運行 CLI 在一個容器中:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

在容器中運行 Kagami:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

爲同行啓動,先生成一個本地網,然後編寫文件:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## 我應該使用哪個二元貨幣? {#which-binary-should-i-use}

- 使用 `irohad` 當您開始或運行同齡人時.
- 在需要查詢本書,提交交易或檢查運營商終端點時使用 `iroha`.
- 使用 `kagami`當您需要密鑰,基因表格,個人資料捆綁或本地網資產時.
