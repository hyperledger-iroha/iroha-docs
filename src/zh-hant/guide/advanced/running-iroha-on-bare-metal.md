---
translation_locale: zh-hant
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 648e69f2a572a0bb3e88919831774d21c1a17438b8bde742224a1457880539c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 在 Bare Metal 上運行 Iroha {#running-iroha-on-bare-metal}

當您想通過 Docker Compose 而不是在主機上直接運行同行時使用此工作流程.當前的源樹提供 Kagami 生成器,用於編寫匹配基因組,同行配置,客戶端配置和啓動/停止腳本.

## 1. 構建二進制 {#_1-build-the-binaries}

從上游 Iroha 工作空間:

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

這產生了:

- `target/release/iroha3d` 對同齡妖怪
- `target/release/iroha`用於 CLI
- `target/release/kagami`用於關鍵,基因和局域網生成

## 2. 創建本地網絡 {#_2-generate-a-local-network}

創建一個四對的 Iroha 3 本地網絡:

```bash
target/release/kagami localnet --peers 4 --out-dir ./localnet
```

輸出目錄包含生成的 `genesis.json`, `genesis.signed.nrt`,同行`config.toml`文件, `client.toml`,輔助腳本以及生成的 `README.md`,其中包含該捆綁的確切命令.

## 3. 開始同齡 {#_3-start-peers}

對於生成一次性本地網絡,使用生成的腳本:

```bash
./localnet/start.sh
```

如果您需要將每個同行連接到像 systemd 這樣的進程管理器中,請使用爲每一個同行記錄在 `./localnet/README.md` 的啓動命令. 保持每個同行的 `config.toml`,私鑰,存儲目錄和端口分開.

## 4. 運營網絡 {#_4-operate-the-network}

使用生成的客戶端配置:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

停止生成的本地網絡:

```bash
./localnet/stop.sh
```

## 5. 產品說明 {#_5-production-notes}

- 創建生產的新私鑰,並將其存儲在倉庫外.
- 讓每個同齡人都同意相同的簽名基因交易,拓,可信任的同齡人和驗證器 PoPs.
- 只有在其他機器不能從同行到達時,將收聽器綁定到主機本地接口.
- 使用反向代理或防火牆來對 Torii 曝光,基礎 auth, TLS 和速度限制.
- 將基因或共識拓學的變化視爲協調遷移,而不是單雙文件編輯.

對於集裝本地開發,請使用 [啓動 Iroha 3](../../get-started/launch-iroha.md) Docker Compose 工作流.
