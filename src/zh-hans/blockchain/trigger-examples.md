---
translation_locale: zh-hans
translation_source: /blockchain/trigger-examples.md
translation_source_hash: d40a0298466fdcbd30a9fdff979887b033e069646fcf3e437527d4d4ec2d0684
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 事件触发器示例 {#event-trigger-example}

这个例子使用了可信无域名帐户 IDs 预计的资产定义 Iroha 3 数据模型.

假设一个网络有:

- 一个由爱丽丝的钥匙控制的法典帐户
- 一个由疯狂帽子师的钥匙控制的法典帐户
- 预测为 `tea` 的资产定义在 `wonderland.universal`
- 每个账户所持有的该资产的余额

目标是注册一个触发器,观察爱丽丝的茶叶平衡,在发出相匹配数据事件时,从疯狂帽子帐户转移.

## 1. 准备账户和资产 {#_1-prepare-accounts-and-assets}

首先注册参与账户和资产定义.在当前 Iroha 中,帐户 IDs 来自账户控制者,而预测域名使用`domain.dataspace`表格:

```text
domain: wonderland.universal
asset definition projection: tea in wonderland.universal
holder accounts: AccountId(controller=alice_key), AccountId(controller=mad_hatter_key)
```

资产定义仍然具有不可的不透明地址.在注册后存储或查询该地址,并在触发动作中使用.

## 2. 选择触发器权限 {#_2-choose-the-trigger-authority}

如果可能的话,将触发器的技术帐户设置为专用账户. 专用帐户明确了执行触发器所需的权限,并避免将触发机连接到运营商个人签字密钥.

技术账户必须已经存在,并且必须有权在触发器执行中提交说明.

## 3. 定义可执行的 {#_3-define-the-executable}

当事件过器匹配时,触发器提交的命令序列是可执行的.在这个例子中,它包含一个传输:

```text
Transfer(
  source = AssetId(tea_definition, mad_hatter_account),
  value = Numeric(1),
  destination = AssetId(tea_definition, alice_account)
)
```

使用 SDK 避免硬编码的旧文本, IDs 在触发码中;解析或查询标准 IDs 在构建执行器之前.

## 4. 定义事件过器 {#_4-define-the-event-filter}

使用数据事件过器,将事件缩小到你关心的对象:

```text
EventFilterBox::Data(
  DataEventFilter for asset changes involving
  AssetId(tea_definition, alice_account)
)
```

一个 `AcceptAll` 过器是用于调试,但它使每一个匹配事件都支付了触发评估的成本.

## 5. 登记触发器 {#_5-register-the-trigger}

用以下方式注册触发器:

- 一个稳定的 `TriggerId`
- 可执行的指令序列
- `Repeats::Indefinitely`或`Repeats::Exactly(n)`
- 技术账户
- 事件过器
- 任意的元数据

触发器登记本身是一个正常的交易,因此注册帐户需要许可才能登记触发器.技术账户需要触发器执行所需的权限.

## 执行命令 {#execution-order}

当一个区块执行时:

1. 通常的交易指令首先运行.
2. 根据这些指令生成的数据事件被收集.
3. 发射器的过器和这些事件相匹配.
4. 在区块执行管道中处理触发器产生的效应,而不允许无限的递归触发器执行.

如果触发器使用 `Repeats::Exactly(n)`,当数量耗尽,并且需要再次执行相同的行为时,请注册新的触发器.
