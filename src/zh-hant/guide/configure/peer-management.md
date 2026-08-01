---
translation_locale: zh-hant
translation_source: /guide/configure/peer-management.md
translation_source_hash: f085fa1587595414f95705bbe2cd285752b0fe12cffb9ef29a33399f9a1f3f86
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 同行管理 {#peer-management}

如果您遵循了任何特定語言指南,現在你有一個功能良好的網絡,人們想加入.

## 公共區塊鏈 {#public-blockchain}

在開放網絡中,同行錄取仍然是鏈政策決定.一個節點可以運行正確的軟件並連接到 Torii,但它只會參與共識之後,網絡承認其同行身份.

## 私人區塊鏈 {#private-blockchain}

在銀行環境中,允許每個人都隨意加入是安全風險.爲了安全,私人 Iroha 部署通常將同行拓在配置和生成中固定,而不是依賴於開放的發現.

### 登記同齡人 {#registering-peers}

爲了將同行添加到網絡中,必須手動登記.讓我們討論應該採取的步驟來完成這個過程.

#### 1. 授予用戶權限 {#_1-grant-the-user-permissions}

登記同行的賬戶必須具有適當的 `Permission`.這可以通過 `Role`或直接授予許可證.

給一個角色當賬戶將管理同齡人隨着時間的推移.使用直接授權.單次註冊的賬戶,其它帳戶不管理同行.

::: info

默認執行者使用 `CanManagePeers`權限令牌進行註冊和不註冊的同行.

:::

我們將在 [ 單獨的章節](/zh-hant/blockchain/permissions.md)中詳細討論權限和角色.

#### 2. 建立一個同齡人 {#_2-set-up-a-peer}

在新同齡人獲得許可後,必須建立它.

在錄取節點之前,請請求當前的同行配置. Torii 爲此暴露了節點參數和功能終端點.不會自動談判這些值:運營商必須驗證時間,批量大小和其他符合共識的設置與網絡相匹配.

爲了簡化這個過程,您可以要求網絡管理員編輯`config.toml`的版本,該版本不包括像同行私鑰這樣的特權信息.

#### 3. 提交指示 {#_3-submit-the-instruction}

在你的同行運行後,你應該提交註冊同行指令. 同行將通過握手過程開始與網絡聊天.

::: tip

提交同行註冊指令不會 (也不能) 立即啓動新的同行程序.

:::

### 沒有註冊的同行 {#unregistering-peers}

由於安全原因,這個過程是單方面的.網絡達成共識,它想刪除一個同行,但同行本身不知道爲什麼沒有人與它交談.

在大多數情況下,如果您想取消同齡人註冊,你想這樣做,因爲這是一個拜占庭的錯誤.只是這個同齡人"幽靈"使得網絡上的惡意演員的生活更加困難.
