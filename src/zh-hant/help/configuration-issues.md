---
translation_locale: zh-hant
translation_source: /help/configuration-issues.md
translation_source_hash: b62b106e985933d90dab1258d3b991674dd75d14322f2326148164b0fbee0f20
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 解決設定問題 {#troubleshooting-configuration-issues}

這部分提供解決問題的建議. Iroha 3 確保您的設定.
[檢查了關鍵](./overview.md#check-the-keys) 首先,因為它是最
共同的問題來源 Iroha.

如果您所遇到的問題沒有在此描述,
[電子郵件](https://t.me/hyperledgeriroha).

## 已過期的起源 Docker Compose 設置 {#outdated-genesis-on-a-docker-compose-setup}

當您使用 Docker Compose 該版本的 Iroha, 你可能會遇到
沒有任何問題,
`Failed to deserialize raw genesis block` 這通常意味著同行,
已簽署的基因交易,
不同的 Iroha 修改或配置文件.

使用以下步骤檢查故障:

1. 使用 `docker ps` 檢查目前的容器.
   您通常會看到 `hyperledger/iroha:dev`
   預設的容器 Docker Compose 配置文件包含四個同行
   容器, 雖然您的生成 `docker-compose.yml` 可能不同.

2. 檢查日志,
   `Failed to deserialize raw genesis block` 如果您開始使用
   Iroha 在 daemon 模式下, `docker compose up -d`, 使用
   `docker compose logs` 沒有任何樓盤符合您的搜尋.

如何解決這種問題取決於使用 Iroha. 如果這是一個
沒有必要保存同行數據,
地方網路或 Docker Compose 包裝 Kagami:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml
```

接著將舊容器移除,
`genesis.signed.nrt`, 同級人 `config.toml` 文件,以及 `client.toml`.

如果您需要恢復 Iroha 實例數據,請做以下工作:

1. 聯繫第二個 Iroha 該網站將從第一個資料中複製
   沒有任何樓盤符合您的搜尋 -
2. 請等待新同行將數據與第一個同行同步.
3. 讓新同學活跃.
4. 更新第一個同行的基因和配置文件,
   協調的遷徙.

::: info

沒有一般的自動重寫路徑,
保護舊的國家,
只有在此之前,
運營商同意移民計劃.

:::

## 密钥和公钥的多哈希格式 {#multihash-format-of-private-and-public-keys}

如果您看到了
[客戶端配置](/zh-hant/guide/configure/client-configuration.md), 你會這樣做
請注意, 這裡的關鍵是
[多個hash格式](https://github.com/multiformats/multihash).

如果您從來沒有使用多密碼,
右邊的字符並不是按六位數表示關鍵字體
(每字體有兩種符號), ASCII (或是 UTF-8),
接著打電話 `from_hex` 在兩個字符串上, `public_key` 及其他
`private_key` 這樣的情況,

這也是自然的假設, `PrivateKey::try_from_str` 在
如果您得到了數字,
這樣就會造成錯誤.
這就是我的訊息.

**這兩種假設都是錯誤的.** 沒有任何錯誤.
這樣的錯誤並不幫忙.

**如何修復**: 使用 `hex_literal`. 這也會改變一個醜的連串
字符在顯然六十分的小表格中.

::: warning

甚至是 `try_from_str` 實現不能確定是否已指定字符串是
有效的 `PrivateKey` 警告你如果沒有.

如果字符串包含無效的字符串,
但因為我們支持許多關鍵格式,
沒有任何其他方法. _正确的_ 隱私關鍵 _關於這些數據
帳號_ 除非您提供指示.

:::

These 這種微不足道的錯誤可以避免,
直接從字符串字母中消化, 或是生成新的
在合理的地方,
