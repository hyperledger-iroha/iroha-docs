---
translation_locale: zh-hant
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 77780600fa59ba353e2aa79fb339adb6a02f7ac731e04cd0d5f51821ec54e794
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 跑步 Iroha 在純金屬上 {#running-iroha-on-bare-metal}

請使用此工作流程,
通過 Docker Compose. 目前的來源樹提供 Kagami 發電機
寫出匹配的基因,同行配置,客戶端配置和開啟/停止脚本.

## 1. 建立二元數字 {#_1-build-the-binaries}

來自上流的 Iroha 工作空間:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

這會產生:

- `target/release/irohad` 為了同行妖怪
- `target/release/iroha` 關於 CLI
- `target/release/kagami` 關鍵,基因和本地網路生成

## 2. 建立一個本地網絡 {#_2-generate-a-local-network}

產生四個同行 Iroha 3 地方網路:

```bash
target/release/kagami localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

输出目錄包含生成的 `genesis.json`,
`genesis.signed.nrt`, 同級人 `config.toml` 文件, `client.toml`, 助手筆記,
並產生了 `README.md` 這項小組的指令是正確的.

## 3. 開始同行 {#_3-start-peers}

在生成一次性本地網中,使用生成的脚本:

```bash
./localnet/start.sh
```

如果您需要將每個同行連接到一個流程管理器中, systemd, 使用
發射指令在 `./localnet/README.md` 每個同行都能獲得,
其他國家 `config.toml`, 密钥,存儲目錄和端口分別.

## 4. 運用網路 {#_4-operate-the-network}

使用生成的客戶端配置:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

停止生成的本地網路使用:

```bash
./localnet/stop.sh
```

## 5. 產品記錄 {#_5-production-notes}

- 製造新鮮的私钥,
  這裡有數據庫.
- 請各位同意相同的簽名基因交易,
  值得信賴的同行,以及認證者 PoPs.
- 只有在同行應使用的情況下,
  其他機器無法使用.
- 使用反向代理或防火牆 Torii 經營性, TLS, 及利率
  限制他們.
- 處理基因或共識拓的變化為協調的遷移,
  單位檔案編輯.

在集裝置的本地發展中, [發射 Iroha 3](../../get-started/launch-iroha.md)
Docker Compose 工作流程.
