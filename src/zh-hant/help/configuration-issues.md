---
translation_locale: zh-hant
translation_source: /help/configuration-issues.md
translation_source_hash: b62b106e985933d90dab1258d3b991674dd75d14322f2326148164b0fbee0f20
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 解決配置問題 {#troubleshooting-configuration-issues}

本節提供 Iroha 3 配置的故障解決技巧.請先檢查 [鍵](./overview.md#check-the-keys),因爲這是 Iroha 中最常見的問題.

如果您所遇到的問題未被描述在這裏,請通過 [電報](https://t.me/hyperledgeriroha)聯繫我們.

## 在 Docker Compose 設置上過時的基因 {#outdated-genesis-on-a-docker-compose-setup}

當您使用 Docker Compose 的版本 Iroha, 你可能會遇到一個同等容器的故障問題 `Failed to deserialize raw genesis block` 這通常意味着同行,簽署的基因交易和生成的配置是由不同的 Iroha 修訂或個人資料.

通過以下步驟檢查故障:

1. 使用 `docker ps`來檢查當前的容器.根據生成的配置文件,您通常會看到`hyperledger/iroha:dev`容器.默認的 Docker Compose 配置文件包含四個同行容器,儘管您生成的 `docker-compose.yml`可能不同.

2. 檢查日誌並尋找`Failed to deserialize raw genesis block`錯誤. 如果您啓動了 Iroha 在 daemon模式中使用`docker compose up -d`,請使用 `docker compose logs`命令.

解決此類問題的方法取決於使用 Iroha.如果這是一個基本的演示程序,並且不需要保存同行數據,請重建與 Kagami 相匹配的本地網絡或 Docker Compose 捆綁:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml
```

然後從再生的 `genesis.signed.nrt`,同行`config.toml`和 `client.toml`文件中刪除舊容器狀態,重新啓動.

如果您需要恢復 Iroha 實例數據,請執行以下操作:

1. 連接第二個 Iroha 同行,將複製第一個 (失敗) 同行的數據.
2. 等新同行將數據與第一個同行同步.
3. 讓新同齡人活躍.
4. 僅作爲協調遷移的一部分更新第一個同行的生成和配置文件.

::: info

在現場網絡上,沒有一般的自動重寫路徑來替換基因.把它視爲一個協調的遷移:保存舊狀態,提起兼容的同行,並且只有經營者同意遷徙計劃後纔將驗證器轉移到新配置.

:::

## 密鑰和公鑰的多哈希格式 {#multihash-format-of-private-and-public-keys}

如果您查看 [客戶端配置](/zh-hant/guide/configure/client-configuration.md),您會注意到那裏的密鑰是以 [多哈什格式](https://github.com/multiformats/multihash).

如果您以前從未使用多哈什,那麼自然可以假設右邊不是六分之一.代表關鍵字節 (每字節的兩個符號),而更好的是編碼爲 ASCII (或 UTF-8),並調用 `from_hex` 在兩個字符串上, `public_key` 和 `private_key` 一個實例.

也是自然的假設,在字符串字母上調用 `PrivateKey::try_from_str`只會產生正確的鍵.所以如果你錯誤地讀取鍵中的比特數量,例如32字節對64字節,那就會引起一個錯誤信息.

這兩種假設都是錯誤的. 遺憾的是,錯誤信息並沒有幫助解決這種特殊的失敗.

如何修復:使用 `hex_literal`. 這也將使一個醜的字符串變成一個很好的小表,顯然是六十分數.

::: warning

即使是 `try_from_str` 實現也無法驗證給定的字符串是否是一個有效的 `PrivateKey`,並且警告你如果不是.

它會發現一些明顯的錯誤,例如如果字符串包含無效的符號.然而,由於我們旨在支持許多鍵格式,它不能做很多其他事情. 除非您提交指示外,它也無法判斷密鑰是否是給定的帳戶的正確私鑰.

:::

這種微妙的錯誤可以避免,例如,通過直接從字符串文字中排序,或者在有意義的地方生成一個新的鍵對.
