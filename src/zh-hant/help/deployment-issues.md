---
translation_locale: zh-hant
translation_source: /help/deployment-issues.md
translation_source_hash: 6f35ac59053e312f56a716810c8f0b625752500d1fc64b27d93cbd8317b6cc19
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 解決部署問題 {#troubleshooting-deployment-issues}

這部分提供解決問題的建議. Iroha 3 如果有問題,
你所經歷的情況並沒有被描述,
透過網路聯絡我們 [電子郵件](https://t.me/hyperledgeriroha).

## 開始使用產品. {#start-with-generated-artifacts}

在本地和測試部署中, Kagami 而是
在手寫的同行檔案中:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

產生的目錄包含同行聯繫,創始資料,開始
其他國家的原住民 README 關於 Iroha 3 建立線路.

## 兩位同行不會開始 {#peer-does-not-start}

請先檢查這些項目:

- `irohad --config <path>` 在同行自己的分數 TOML 這樣的文件.
- `public_key` 及其他 `private_key` 在同行配置中,屬於相同的鍵
  這是一對.
- `genesis.public_key` 這項交易與簽署基因交易所使用的關鍵相匹配.
- 認證者同行身份使用 BLS- 通常的關鍵, `trusted_peers_pop`
  包含本地關鍵及可信的同行所有權證明資料.
- 港口為 Torii 及其他 P2P 沒有其他過程的束縛.
- 這項政策 Kura 該店目錄屬於同一連鎖,並非從
  不同的網絡配置.

使用設定追蹤,當 daemon 閱讀超過一本 TOML 層次:

```bash
cargo run --bin irohad -- --config ./config.toml --trace-config
```

## Docker 編輯 {#docker-and-compose}

生成從現在組成 Kagami 這樣的命令行
參考資料和設定檔案符合已退出的代碼:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

如果組裝部署開始,然後停下來,

- 不匹配 `chain`
- 使用不同的基因交易或明示
- 廣告 P2P 只有在容器網絡內工作的地址
- 在再生基因后重用本地量

在試驗新生產時, Kura 在重新啟動之前的數量
保持舊區塊存儲,

## 科伯納特斯 {#kubernetes}

對於 Kubernetes 來說, 每個驗證器都當成有狀態的基礎設施:

- 給每位同行一個穩定的身份密钥和穩定的持久量
- 顯示 P2P 其他同行可以從集群中解決的地址
- 設置配置和基因檔案,作為部署不可變的配置
- 並不是自動的變化,
  設定圖更新

如果一個子重啟,
預期 [`peer.template.toml`](/zh-hant/reference/peer-config/index.md#template) 及其他
檢查對象是否正在重播舊 Kura 數據.

## 索拉的形狀 {#sora-profile}

Iroha 3 使用的部署 Nexus, SoraFS, 或是多行道流量應該開始
有 Sora 形狀的妖怪:

```bash
cargo run --bin irohad -- --config ./config.toml --sora
```

在同一網絡中的驗證器中使用相同的配置文件.
