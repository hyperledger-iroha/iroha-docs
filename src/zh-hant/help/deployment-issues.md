---
translation_locale: zh-hant
translation_source: /help/deployment-issues.md
translation_source_hash: 6f35ac59053e312f56a716810c8f0b625752500d1fc64b27d93cbd8317b6cc19
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 解決部署問題 {#troubleshooting-deployment-issues}

本節爲 Iroha 3 部署提供了故障解決技巧.如果您遇到的問題沒有描述在這裏,請通過 [電報](https://t.me/hyperledgeriroha)聯繫我們

## 從生成的文物開始. {#start-with-generated-artifacts}

對於本地和測試部署,優先使用 Kagami 生成的文物而不是手寫的同行文件:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

生成的目錄包含同行配置,基因材料,啓動腳本以及 README 爲 Iroha 3 構建線.

## 同齡人不開始 {#peer-does-not-start}

首先要檢查這些物品:

- `irohad --config <path>`在同行自己的檔案 TOML 中的點.
- 在同等配置中, `public_key` 和 `private_key`屬於同一鍵對.
- `genesis.public_key`與簽署基因交易所使用的密鑰相匹配.
- 驗證器同行身份使用 BLS-正常密鑰,並且`trusted_peers_pop`包含本地密鑰和可信任同行的擁有證明條目.
- Torii 和 P2P 的港口已經沒有其他工藝的約束.
- Kura 存儲目錄屬於同一個鏈,並不是從不同的網絡配置文件複製.

如果 daemon 閱讀超過一個 TOML 層時,請使用配置追蹤:

```bash
cargo run --bin irohad -- --config ./config.toml --trace-config
```

## Docker 和複合 {#docker-and-compose}

生成 從當前的 Kagami localnet輸出中編寫,以便命令行參數和配置文件與已檢查出來的代碼匹配:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

如果構建部署開始,然後停下來,請檢查 daemon日誌:

- 沒有匹配 `chain`
- 一個使用不同的基因交易或表現的同行
- 廣告的 P2P 地址,僅在集裝箱網絡內工作
- 在再生產後的本地體積重複使用

在測試新基因時,在重新啓動堆之前刪除舊的 Kura 卷.將舊塊存儲到新的基因中會導致重播失敗.

## 科伯尼特 {#kubernetes}

對於Kubernetes來說,將每個驗證器視爲具有狀態的基礎設施:

- 給每個同齡人一個穩定的身份密鑰和穩定的持久量
- 暴露其他同行可以從集羣內部解決的 P2P 地址
- 裝備配置和生成文件作爲部署不可變的配置
- 推出所有基因或拓變化是故意的,而不是作爲自動配置地圖更新

如果一個模塊重啓一次,請將模塊中的轉載配置與預期的 [`peer.template.toml`](/zh-hant/reference/peer-config/index.md#template)進行比較,並檢查同行是否正在播放舊的 Kura 數據.

## 索拉的個人資料 {#sora-profile}

Iroha 3 使用 Nexus, SoraFS 或多道流的部署應啓動索拉配置文件的妖怪:

```bash
cargo run --bin irohad -- --config ./config.toml --sora
```

在同一網絡中的驗證器中,使用相同的配置文件.
