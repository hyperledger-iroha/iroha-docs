---
translation_locale: zh-hant
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 648e69f2a572a0bb3e88919831774d21c1a17438b8bde742224a1457880539c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 在裸機上執行 Iroha {#running-iroha-on-bare-metal}

當您想透過 Docker Compose 而不是在主機上直接執行對等節點時使用此工作流程.當前的源樹提供 Kagami 生成器,用於編寫匹配創世組,對等節點配置,客戶端配置和啟動/停止指令碼.

## 1. 構建二進位制 {#_1-build-the-binaries}

從上游 Iroha 工作空間:

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

這產生了:

- `target/release/iroha3d` 對等節點守護程式
- `target/release/iroha`用於 CLI
- `target/release/kagami`用於關鍵,創世和區域網生成

## 2. 建立本地網路 {#_2-generate-a-local-network}

建立一個四對的 Iroha 3 本地網路:

```bash
target/release/kagami localnet --peers 4 --out-dir ./localnet
```

輸出目錄包含生成的 `genesis.json`, `genesis.signed.nrt`,對等節點`config.toml`檔案, `client.toml`,輔助指令碼以及生成的 `README.md`,其中包含該捆綁的確切命令.

## 3. 啟動對等節點 {#_3-start-peers}

對於生成一次性本地網路,使用生成的指令碼:

```bash
./localnet/start.sh
```

如果您需要將每個對等節點連線到像 systemd 這樣的程序管理器中,請使用為每一個對等節點記錄在 `./localnet/README.md` 的啟動命令. 保持每個對等節點的 `config.toml`,私鑰,儲存目錄和埠分開.

## 4. 運營網路 {#_4-operate-the-network}

使用生成的客戶端配置:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

停止生成的本地網路:

```bash
./localnet/stop.sh
```

## 5. 產品說明 {#_5-production-notes}

- 建立生產的新私鑰,並將其儲存在倉庫外.
- 讓每個對等節點都同意相同的簽名創世交易,拓,可信任的對等節點和驗證器 PoPs.
- 只有在其他機器不能從對等節點到達時,將收聽器繫結到主機本地介面.
- 使用反向代理或防火牆來對 Torii 曝光,基礎 auth, TLS 和速度限制.
- 將創世或共識拓撲的變化視為協調遷移,而不是單雙檔案編輯.

對於集裝本地開發,請使用 [啟動 Iroha 3](../../get-started/launch-iroha.md) Docker Compose 工作流.
