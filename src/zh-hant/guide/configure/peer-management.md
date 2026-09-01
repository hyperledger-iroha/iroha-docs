---
translation_locale: zh-hant
translation_source: /guide/configure/peer-management.md
translation_source_hash: f085fa1587595414f95705bbe2cd285752b0fe12cffb9ef29a33399f9a1f3f86
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 對等節點管理 {#peer-management}

如果您遵循了任何特定語言指南,現在你有一個功能良好的網路,人們想加入.

## 公共區塊鏈 {#public-blockchain}

在開放網路中,對等節點錄取仍然是鏈政策決定.一個節點可以執行正確的軟體並連線到 Torii,但它只會參與共識之後,網路承認其對等節點身份.

## 私人區塊鏈 {#private-blockchain}

在銀行環境中,允許每個人都隨意加入是安全風險.為了安全,私人 Iroha 部署通常將對等節點拓在配置和生成中固定,而不是依賴於開放的發現.

### 登記對等節點 {#registering-peers}

為了將對等節點新增到網路中,必須手動登記.讓我們討論應該採取的步驟來完成這個過程.

#### 1. 授予使用者許可權 {#_1-grant-the-user-permissions}

登記對等節點的帳戶必須具有適當的 `Permission`.這可以透過 `Role`或直接授予許可證.

給一個角色當帳戶將管理對等節點隨著時間的推移.使用直接授權.單次註冊的帳戶,其它帳戶不管理對等節點.

::: info

預設執行者使用 `CanManagePeers`許可權令牌進行註冊和不註冊的對等節點.

:::

我們將在 [ 單獨的章節](/zh-hant/blockchain/permissions.md)中詳細討論許可權和角色.

#### 2. 建立一個對等節點 {#_2-set-up-a-peer}

在新對等節點獲得許可後,必須建立它.

在錄取節點之前,請請求當前的對等節點配置. Torii 為此暴露了節點引數和功能端點.不會自動談判這些值:運營商必須驗證時間,批次大小和其他符合共識的設定與網路相匹配.

為了簡化這個過程,您可以要求網路管理員編輯`config.toml`的版本,該版本不包括像對等節點私鑰這樣的特權資訊.

#### 3. 提交指示 {#_3-submit-the-instruction}

在你的對等節點執行後,你應該提交註冊對等節點指令. 對等節點將透過握手過程開始與網路聊天.

::: tip

提交對等節點註冊指令不會 (也不能) 立即啟動新的對等節點程式.

:::

### 沒有註冊的對等節點 {#unregistering-peers}

由於安全原因,這個過程是單方面的.網路達成共識,它想刪除一個對等節點,但對等節點本身不知道為什麼沒有人與它交談.

在大多數情況下,如果您想取消對等節點註冊,你想這樣做,因為這是一個拜占庭的錯誤.只是這個對等節點"幽靈"使得網路上的惡意演員的生活更加困難.
