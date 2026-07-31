---
translation_locale: zh-hant
translation_source: /blockchain/trigger-examples.md
translation_source_hash: d40a0298466fdcbd30a9fdff979887b033e069646fcf3e437527d4d4ec2d0684
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 事件引發器示例 {#event-trigger-example}

這個例子使用法規無域名帳戶 IDs 預期的資產
在本文中的定義 Iroha 3 數據模型.

假設一個網絡有:

- 這是一份經典的帳號,由Alice的鍵控制.
- 這是一份經典的帳號,由瘋帽子師的鍵控制.
- 預算為 `tea` 在下 `wonderland.universal`
- 每個帳戶所持有的該資產的餘額

目的是檢查阿里斯的茶葉平衡,
在相匹配數據事件發生時,
發射出來的.

## 1. 準備帳戶和資產 {#_1-prepare-accounts-and-assets}

首先要記錄參與帳戶和資產定義.
現在的 Iroha, 帳號 IDs 來自帳戶管理員,
域名使用 `domain.dataspace` 形式:

```text
domain: wonderland.universal
asset definition projection: tea in wonderland.universal
holder accounts: AccountId(controller=alice_key), AccountId(controller=mad_hatter_key)
```

存儲或查詢這些資料,
在註冊後使用地址,並在啟動行動中使用它.

## 2.選擇引發器權限 {#_2-choose-the-trigger-authority}

如果可能,將開啟器的技術帳號設定在專用帳戶上.
專用帳戶明顯需要哪些許可證來啟動
執行並避免將開關連接到運營商個人簽名
這就是我的關鍵.

必須已有技術帳號,
在開啟器中執行指示.

## 3. 定義可執行的方法 {#_3-define-the-executable}

執行式是開啟器在事件發生時提交的指示序列
這樣的例子,它包含一個轉移:

```text
Transfer(
  source = AssetId(tea_definition, mad_hatter_account),
  value = Numeric(1),
  destination = AssetId(tea_definition, alice_account)
)
```

請使用 SDK 預算是目前為期的交易用品.
硬編碼的舊文本 IDs 在開啟代碼中;解析或查詢法典 IDs
在建立執行機之前.

## 4. 定義事件過濾器 {#_4-define-the-event-filter}

使用資料事件過濾器,將事件縮小到您關心的對象:

```text
EventFilterBox::Data(
  DataEventFilter for asset changes involving
  AssetId(tea_definition, alice_account)
)
```

保持光器的精確性和實用性. `AcceptAll` 濾鏡是有用的
但它使每個相匹配的事件都付出了引擎成本.
評估.

## 5. 註冊開關器 {#_5-register-the-trigger}

註冊開關:

- 一个子 `TriggerId`
- 可執行的指示序列
- `Repeats::Indefinitely` 或是 `Repeats::Exactly(n)`
- 技术账户
- 事件過濾器
- 選擇性傳統數據

這項交易本身就是正常的交易,
該帳戶需要註冊引發器的許可.
引發器可執行所需的權限.

## 執行命令 {#execution-order}

當一個區塊執行時:

1. 經常交易指令首先執行.
2. 收集這些指示所產生的事件數據.
3. 這項活動的濾鏡與這些事件相匹配.
4. 在區塊執行管線中處理引發器產生的效應,
   允許無限的復習性引擎執行.

如果開關使用 `Repeats::Exactly(n)`, 在數量時, 註冊新的開關
這樣的行為也需要再次進行.
