---
translation_locale: zh-hant
translation_source: /help/configuration-issues.md
translation_source_hash: 4b96a4f740203aace2e8c091ed89156146ba117e23eff1d08f3bbb01de92f24a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 解決配置問題 {#troubleshooting-configuration-issues}

本節提供 Iroha 3 配置的故障解決技巧.請先檢查 [鍵](./overview.md#check-the-keys),因為這是 Iroha 中最常見的問題.

如果您所遇到的問題未被描述在這裡,請透過 [電報](https://t.me/hyperledgeriroha)聯絡我們.

## 在 Docker Compose 設定上過時的創世 {#outdated-genesis-on-a-docker-compose-setup}

當您使用 Docker Compose 的版本 Iroha, 你可能會遇到一個對等節點容器的故障問題 `Failed to deserialize raw genesis block` 這通常意味著對等節點,簽署的創世交易和生成的配置是由不同的 Iroha 修訂或個人資料.

透過以下步驟檢查故障:

1. 使用 `docker ps`來檢查當前的容器.根據生成的配置檔案,您通常會看到`hyperledger/iroha:dev`容器.預設的 Docker Compose 配置檔案包含四個對等節點容器,儘管您生成的 `docker-compose.yml`可能不同.

2. 檢查日誌並尋找`Failed to deserialize raw genesis block`錯誤. 如果您啟動了 Iroha 在 daemon模式中使用`docker compose up -d`,請使用 `docker compose logs`命令.

解決此類問題的方法取決於使用 Iroha.如果這是一個基本的演示程式,並且不需要儲存對等節點資料,請重建與 Kagami 相匹配的本地網路或 Docker Compose 捆綁:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml
```

然後從再生的 `genesis.signed.nrt`,對等節點`config.toml`和 `client.toml`檔案中刪除舊容器狀態,重新啟動.

如果您需要恢復 Iroha 例項資料,請執行以下操作:

1. 連線第二個 Iroha 對等節點,將複製第一個 (失敗) 對等節點的資料.
2. 等新對等節點將資料與第一個對等節點同步.
3. 讓新對等節點活躍.
4. 僅作為協調遷移的一部分更新第一個對等節點的生成和配置檔案.

::: info

在現場網路上,沒有一般的自動重寫路徑來替換創世.把它視為一個協調的遷移:儲存舊狀態,提起相容的對等節點,並且只有經營者同意遷徙計劃後才將驗證器轉移到新配置.

:::

## 金鑰和公鑰的多雜湊格式 {#multihash-format-of-private-and-public-keys}

如果您檢視 [客戶端配置](/zh-hant/guide/configure/client-configuration.md),您會注意到那裡的金鑰是以 [多哈什格式](https://github.com/multiformats/multihash).

如果您以前從未使用多哈什,那麼自然可以假設右邊不是六分之一.代表關鍵位元組 (每位元組的兩個符號),而更好的是編碼為 ASCII (或 UTF-8),並呼叫 `from_hex` 在兩個字串上, `public_key` 和 `private_key` 一個例項.

也是自然的假設,在字串字母上呼叫 `PrivateKey::try_from_str`只會產生正確的鍵.所以如果你錯誤地讀取鍵中的位元數量,例如32位元組對64位元組,那就會引起一個錯誤資訊.

這兩種假設都是錯誤的. 遺憾的是,錯誤資訊並沒有幫助解決這種特殊的失敗.

如何修復:使用 `hex_literal`. 這也將使一個醜的字串變成一個很好的小表,顯然是六十分數.

::: warning

即使是 `try_from_str` 實現也無法驗證給定的字串是否是一個有效的 `PrivateKey`,並且警告你如果不是.

它會發現一些明顯的錯誤,例如如果字串包含無效的符號.然而,由於我們旨在支援許多鍵格式,它不能做很多其他事情. 除非您提交指示外,它也無法判斷金鑰是否是給定的帳戶的正確私鑰.

:::

這種微妙的錯誤可以避免,例如,透過直接從字串文字中排序,或者在有意義的地方生成一個新的鍵對.
