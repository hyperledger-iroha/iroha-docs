---
translation_locale: zh-hant
translation_source: /guide/configure/peer-management.md
translation_source_hash: 4e48c937ca973319cd060876b123ff405d27d9d8bc11818e608d821295412c77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 同級管理 {#peer-management}

如果您遵循任何特定語言指南,
該組織將會成為人們想要加入的良好運作網絡.

## 公共區塊 {#public-blockchain}

在開放網絡中, 同級者接入仍然是連鎖政策的決定.
可以執行正確的軟體, Torii, 但它只會參與
在網路承認其同行身份後,

## 私人區塊 {#private-blockchain}

在銀行環境下, 允許所有人隨時加入是安全的
沒有任何安全性, Iroha 部署通常將同行拓展在
而不是依靠公開的發現.

### 註冊同行 {#registering-peers}

我們必須手動註冊.
為了完成這個過程, 該采取的步.

#### 1. 授予使用者權限 {#_1-grant-the-user-permissions}

該帳號必須有適當的 `Permission`.
這項計畫可通過 `Role` 或是直接授予許可.

如何決定是否需要授予角色?
該使用者是某種管理員,
該組織的各個團體都在努力,
授予許可是有用的,
網管理員是一般的登記同行,
沒有必要 (或想) 花時間建立新的同行.

::: info

預設執行器使用 `CanManagePeers` 授權令牌
註冊及不註冊的同行.

:::

We 討論許可和角色的詳細內容,
[獨立章節](/zh-hant/blockchain/permissions.md).

#### 2. 建立一個同行 {#_2-set-up-a-peer}

在獲得新同行許可後,

請在允許一個結之前要求當前的同行配置. Torii 顯示性
這項目的使用 Node 參數和功能終點.
沒有自動進行這些數值的談判:運營商必須確認此時間,
批量大小及其他符合共識的設定與網路相匹配.

您可以請網頁管理員提供
編輯版 `config.toml`, 沒有特權資訊,
這樣的密碼,

#### 3. 提交指示 {#_3-submit-the-instruction}

_在此後,_ 您的同行正在跑步, _註冊同行_
這樣的指令,
透過網路聊天.

::: tip

提交同行登記指令 **沒有** 沒有任何可能的情況
立即表示 _新的同行流程_.

:::

### 沒有註冊的同行 {#unregistering-peers}

這項程序是因為安全原因,
該組織同意要移除同行,
但同學並不清楚為什麼沒有人跟她說話.

如果您想取消同學登記,
因為這是比賽人的錯誤.
這位惡意演員在網路上更努力.
