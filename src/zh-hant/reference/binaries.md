---
translation_locale: zh-hant
translation_source: /reference/binaries.md
translation_source_hash: 3d1cddb466092770376bcb150963d5df29a6ebc5cf6e670baa3a5c277082fdab
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 使用 Iroha 二進位程式 {#working-with-iroha-binaries}

Iroha 3 操作員的工作流程圍繞四個主要二進位制:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad)用於執行一個對等節點守護程式
- `iroha3d_taira` 對於規範 Taira 驗證器啟動器
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli)用於 CLI 和操作員指令
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami)用於金鑰,創世,區域網和個人資料

## 建立從源頭 {#build-from-source}

從上游工作空間的根源:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

在 `target/release/` 中,釋放二進製品可使用.

為了檢查指揮面:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## 直接從儲存庫中執行 {#run-directly-from-the-repository}

如果您不想在全球範圍內安裝任何東西,請使用 `cargo run`:

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker 影象 {#docker-image}

上游工作空間使用 `kagami localnet` 和 `kagami docker` 產生 Docker Compose 檔案與檢查出來的程式碼相匹配. `hyperledger/iroha:dev` 影象可以與生成的檔案一起使用.

執行 CLI 在一個容器中:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

在容器中執行 Kagami:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

為對等節點啟動,先生成一個本地網,然後編寫檔案:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## 我應該使用哪個二進位程式？ {#which-binary-should-i-use}

- 使用 `iroha3d` 當您在公共 Taira 驗證器版本之外啟動或執行對等節點時.
- 使用 `iroha3d_taira --sora` 僅用於規範的 Taira 驗證器部署;它強制執行 Taira 的鏈,儲存和執行階段簽字元配置檔案.
- 在需要查詢帳本,提交交易或檢查運營商端點時使用 `iroha`.
- 使用 `kagami`當您需要金鑰,創世清單,個人資料捆綁或本地網資產時.
