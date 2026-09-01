---
translation_locale: zh-hant
translation_source: /blockchain/trigger-examples.md
translation_source_hash: d40a0298466fdcbd30a9fdff979887b033e069646fcf3e437527d4d4ec2d0684
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 事件觸發器示例 {#event-trigger-example}

這個例子使用了可信無域名帳戶 IDs 預計的資產定義 Iroha 3 資料模型.

假設一個網路有:

- 一個由 Alice 的鑰匙控制的規範帳戶
- 一個由 Mad Hatter 的鑰匙控制的規範帳戶
- 預測為 `tea` 的資產定義在 `wonderland.universal`
- 每個帳戶所持有的該資產的餘額

目標是註冊一個觸發器,觀察Alice 的茶葉餘額,在發出相匹配資料事件時,從 Mad Hatter 帳戶轉移.

## 1. 準備帳戶和資產 {#_1-prepare-accounts-and-assets}

首先註冊參與帳戶和資產定義.在當前 Iroha 中,帳戶 IDs 來自帳戶控制者,而預測域名使用`domain.dataspace`形式:

```text
domain: wonderland.universal
asset definition projection: tea in wonderland.universal
holder accounts: AccountId(controller=alice_key), AccountId(controller=mad_hatter_key)
```

資產定義仍然具有不可的不透明地址.在註冊後儲存或查詢該地址,並在觸發動作中使用.

## 2. 選擇觸發器許可權 {#_2-choose-the-trigger-authority}

如果可能的話,將觸發器的技術帳戶設定為專用帳戶. 專用帳戶明確了執行觸發器所需的許可權,並避免將觸發機連線到運營商個人簽字金鑰.

技術帳戶必須已經存在,並且必須有權在觸發器執行中提交說明.

## 3. 定義可執行的 {#_3-define-the-executable}

當事件過濾器匹配時,觸發器提交的命令序列是可執行的.在這個例子中,它包含一個傳輸:

```text
Transfer(
  source = AssetId(tea_definition, mad_hatter_account),
  value = Numeric(1),
  destination = AssetId(tea_definition, alice_account)
)
```

使用 SDK 避免硬編碼的舊文字, IDs 在觸發碼中;解析或查詢標準 IDs 在構建執行器之前.

## 4. 定義事件過濾器 {#_4-define-the-event-filter}

使用資料事件過濾器,將事件縮小到你關心的物件:

```text
EventFilterBox::Data(
  DataEventFilter for asset changes involving
  AssetId(tea_definition, alice_account)
)
```

請讓 filter 盡可能具體。`AcceptAll` filter 適合除錯，但它會讓每個符合的 event 都承擔 trigger evaluation 的成本。

## 5. 登記觸發器 {#_5-register-the-trigger}

用以下方式註冊觸發器:

- 一個穩定的 `TriggerId`
- 可執行的指令序列
- `Repeats::Indefinitely`或`Repeats::Exactly(n)`
- 技術帳戶
- 事件過濾器
- 任意的後設資料

觸發器登記本身是一個正常的交易,因此註冊帳戶需要許可才能登記觸發器.技術帳戶需要觸發器執行所需的許可權.

## 執行命令 {#execution-order}

當一個區塊執行時:

1. 通常的交易指令首先執行.
2. 根據這些指令生成的資料事件被收集.
3. 觸發器的過濾器和這些事件相匹配.
4. 在區塊執行管道中處理觸發器產生的效應,而不允許無限的遞迴觸發器執行.

如果觸發器使用 `Repeats::Exactly(n)`,當數量耗盡,並且需要再次執行相同的行為時,請註冊新的觸發器.
