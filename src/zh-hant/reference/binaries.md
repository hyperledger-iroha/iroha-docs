---
translation_locale: zh-hant
translation_source: /reference/binaries.md
translation_source_hash: 5a36877954bec97691e45697680bfbd6e0a7c7695e48a796bc7c9a41d4756644
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 與 Iroha 二進制貨幣合作 {#working-with-iroha-binaries}

Iroha 3 操作員的工作流程圍繞四個主要二進制:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad)用於運行一個同類妖怪
- `iroha3d_taira` 對於法典 Taira 驗證器發射器
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli)用於 CLI 和操作員指令
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami)用於密鑰,基因,局域網和個人資料

## 建立從源頭 {#build-from-source}

從上游工作空間的根源:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

在 `target/release/` 中,釋放二進制品可使用.

爲了檢查指揮面:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## 直接從存儲庫中運行 {#run-directly-from-the-repository}

如果您不想在全球範圍內安裝任何東西,請使用 `cargo run`:

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
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
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## 我應該使用哪個二元貨幣? {#which-binary-should-i-use}

- 使用 `iroha3d` 當您在公共 Taira 驗證器版本之外啓動或運行同行時.
- 使用 `iroha3d_taira --sora` 僅用於常規的 Taira 驗證器部署;它強制執行 Taira 的鏈,存儲和運行時間簽字符配置文件.
- 在需要查詢本書,提交交易或檢查運營商終端點時使用 `iroha`.
- 使用 `kagami`當您需要密鑰,基因表格,個人資料捆綁或本地網資產時.
