---
translation_locale: zh-hant
translation_source: /help/deployment-issues.md
translation_source_hash: c220e127bc8081c9b457dfd67101aa44fb80d79c461cc7a7eda99584d74a8f19
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# 解決部署問題 {#troubleshooting-deployment-issues}

本節為 Iroha 3 部署提供了故障解決技巧.如果您遇到的問題沒有描述在這裡,請透過 [電報](https://t.me/hyperledgeriroha)聯絡我們

## 從生成的構件開始. {#start-with-generated-artifacts}

對於本地和測試部署,優先使用 Kagami 生成的構件而不是手寫的對等節點檔案:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

生成的目錄包含對等節點配置,創世材料,啟動指令碼以及 README 為 Iroha 3 構建線.

## 對等節點不開始 {#peer-does-not-start}

首先要檢查這些物品:

- `iroha3d --config <path>`在對等節點自己的檔案 TOML 中的點.
- 在同等配置中, `public_key` 和 `private_key`屬於同一鍵對.
- `genesis.public_key`與簽署創世交易所使用的金鑰相匹配.
- 驗證器對等節點身份使用 BLS-正常金鑰,並且`trusted_peers_pop`包含本地金鑰和可信任對等節點的擁有證明條目.
- Torii 和 P2P 的港口已經沒有其他工藝的約束.
- Kura 儲存目錄屬於同一個鏈,並不是從不同的網路配置檔案複製.

如果 daemon 閱讀超過一個 TOML 層時,請使用配置追蹤:

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --trace-config
```

## Docker 和複合 {#docker-and-compose}

生成 從當前的 Kagami localnet輸出中編寫,以便命令列引數和配置檔案與已檢查出來的程式碼匹配:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

如果構建部署開始,然後停下來,請檢查 daemon日誌:

- 沒有匹配 `chain`
- 一個使用不同的創世交易或表現的對等節點
- 廣告的 P2P 地址,僅在集裝箱網路內工作
- 在再生產後的本地體積重複使用

在測試新創世時,在重新啟動堆之前刪除舊的 Kura 卷.將舊塊儲存到新的創世中會導致重播失敗.

## 科伯尼特 {#kubernetes}

對於Kubernetes來說,將每個驗證器視為具有狀態的基礎設施:

- 給每個對等節點一個穩定的身份金鑰和穩定的持久量
- 暴露其他對等節點可以從叢集內部解決的 P2P 地址
- 裝備配置和生成檔案作為部署不可變的配置
- 推出所有創世或拓變化是故意的,而不是作為自動配置地圖更新

如果一個模組重啟一次,請將模組中的轉載配置與預期的 [`peer.template.toml`](/zh-hant/reference/peer-config/index.md#template)進行比較,並檢查對等節點是否正在播放舊的 Kura 資料.

## 索拉的個人資料 {#sora-profile}

使用 Nexus,SoraFS 或多行道流的私人或本地 Iroha 3 部署應啟動標準大emon,Sora配置檔案已實現:

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --sora
```

在同一網路中的驗證器中,使用相同的配置檔案.

公共的 Taira 驗證器使用專用啟動器,它執行 Taira 的精確連結,列表,禁用嵌入式儲存- SoraFS 和執行階段簽署者配置.在啟動之前驗證呈現的 Taira 配置:

```bash
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

不要開始一個公眾 Taira 具有通用驗證器 `iroha3d`; 檢視 [`iroha3d` CLI 參考](/zh-hant/reference/iroha3d-cli.md) 對於強制性個人資料.
