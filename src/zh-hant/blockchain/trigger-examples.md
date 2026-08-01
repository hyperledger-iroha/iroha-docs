---
translation_locale: zh-hant
translation_source: /blockchain/trigger-examples.md
translation_source_hash: d40a0298466fdcbd30a9fdff979887b033e069646fcf3e437527d4d4ec2d0684
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 事件觸發器示例 {#event-trigger-example}

這個例子使用了可信無域名帳戶 IDs 預計的資產定義 Iroha 3 數據模型.

假設一個網絡有:

- 一個由愛麗絲的鑰匙控制的法典帳戶
- 一個由瘋狂帽子師的鑰匙控制的法典帳戶
- 預測爲 `tea` 的資產定義在 `wonderland.universal`
- 每個賬戶所持有的該資產的餘額

目標是註冊一個觸發器,觀察愛麗絲的茶葉平衡,在發出相匹配數據事件時,從瘋狂帽子帳戶轉移.

## 1. 準備賬戶和資產 {#_1-prepare-accounts-and-assets}

首先註冊參與賬戶和資產定義.在當前 Iroha 中,帳戶 IDs 來自賬戶控制者,而預測域名使用`domain.dataspace`表格:

```text
domain: wonderland.universal
asset definition projection: tea in wonderland.universal
holder accounts: AccountId(controller=alice_key), AccountId(controller=mad_hatter_key)
```

資產定義仍然具有不可的不透明地址.在註冊後存儲或查詢該地址,並在觸發動作中使用.

## 2. 選擇觸發器權限 {#_2-choose-the-trigger-authority}

如果可能的話,將觸發器的技術帳戶設置爲專用賬戶. 專用帳戶明確了執行觸發器所需的權限,並避免將觸發機連接到運營商個人簽字密鑰.

技術賬戶必須已經存在,並且必須有權在觸發器執行中提交說明.

## 3. 定義可執行的 {#_3-define-the-executable}

當事件過器匹配時,觸發器提交的命令序列是可執行的.在這個例子中,它包含一個傳輸:

```text
Transfer(
  source = AssetId(tea_definition, mad_hatter_account),
  value = Numeric(1),
  destination = AssetId(tea_definition, alice_account)
)
```

使用 SDK 避免硬編碼的舊文本, IDs 在觸發碼中;解析或查詢標準 IDs 在構建執行器之前.

## 4. 定義事件過器 {#_4-define-the-event-filter}

使用數據事件過器,將事件縮小到你關心的對象:

```text
EventFilterBox::Data(
  DataEventFilter for asset changes involving
  AssetId(tea_definition, alice_account)
)
```

一個 `AcceptAll` 過器是用於調試,但它使每一個匹配事件都支付了觸發評估的成本.

## 5. 登記觸發器 {#_5-register-the-trigger}

用以下方式註冊觸發器:

- 一個穩定的 `TriggerId`
- 可執行的指令序列
- `Repeats::Indefinitely`或`Repeats::Exactly(n)`
- 技術賬戶
- 事件過器
- 任意的元數據

觸發器登記本身是一個正常的交易,因此註冊帳戶需要許可才能登記觸發器.技術賬戶需要觸發器執行所需的權限.

## 執行命令 {#execution-order}

當一個區塊執行時:

1. 通常的交易指令首先運行.
2. 根據這些指令生成的數據事件被收集.
3. 發射器的過器和這些事件相匹配.
4. 在區塊執行管道中處理觸發器產生的效應,而不允許無限的遞歸觸發器執行.

如果觸發器使用 `Repeats::Exactly(n)`,當數量耗盡,並且需要再次執行相同的行爲時,請註冊新的觸發器.
