---
translation_locale: zh-hant
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 886da937d92563cea49355fdccd411fc74d397fea28b521711e9089c8b047280
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
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
target/release/kagami localnet generate --peers 4 --out-dir ./localnet
```

輸出目錄包含產生的 `genesis.json`、`genesis.signed.nrt`、`genesis.expected_hash`、每個驗證者各一個的 `peerN.toml`、`client.toml`、`start.sh` 與 `stop.sh` 指令碼，以及一個產生的 `README.md`，其中包含該套件的確切命令。

## 3. 啟動對等節點 {#_3-start-peers}

對於生成一次性本地網路,使用生成的指令碼:

```bash
./localnet/start.sh
```

如果您需要將每個對等節點接入 systemd 等程序管理器，請遵循 `./localnet/start.sh` 中針對每個對等節點的命令：在 `<bundle>/state/peerN` 目錄下執行 `iroha3d --config <bundle>/peerN.toml`，並且僅在該對等節點首次啟動時傳入 `--sumeragi-assert-fresh-key`。請將每個對等節點的 `peerN.toml`、私鑰、儲存目錄與連接埠分開保存。

## 4. 運營網路 {#_4-operate-the-network}

使用生成的客戶端配置:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list --all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

停止生成的本地網路:

```bash
./localnet/stop.sh
```

## 5. 產品說明 {#_5-production-notes}

- 為正式環境產生新的私鑰，並將其存放於程式碼儲存庫之外。
- 讓每個對等節點都同意相同的簽名創世交易,拓,可信任的對等節點和驗證器 PoPs.
- 只有在其他機器不能從對等節點到達時,將收聽器繫結到主機本地介面.
- 使用反向代理或防火牆來對 Torii 曝光,基礎 auth, TLS 和速度限制.
- 將創世或共識拓撲的變化視為協調遷移,而不是單雙檔案編輯.

對於集裝本地開發,請使用 [啟動 Iroha 3](../../get-started/launch-iroha.md) Docker Compose 工作流.
