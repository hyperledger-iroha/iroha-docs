---
translation_locale: zh-hans
translation_source: /blockchain/trigger-examples.md
translation_source_hash: d40a0298466fdcbd30a9fdff979887b033e069646fcf3e437527d4d4ec2d0684
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 事件触发器示例 {#event-trigger-example}

这个例子使用了可信无域名帐户 IDs 和预期资产
在本文中的定义 Iroha 3 数据模型.

假设一个网络有:

- 一个由爱丽丝的钥匙控制的法典帐户
- 一个由疯狂帽子师的钥匙控制的法典帐户.
- 预测为 `tea` 下面 `wonderland.universal`
- 每个账户所持有的该资产的余额

目标是记录一个触发器,
在匹配数据事件发生时,将从Mad Hatter帐户提交转账
发射.

## 1. 准备账户和资产 {#_1-prepare-accounts-and-assets}

首先注册参与账户和资产定义.
电流 Iroha, 账户 IDs 来自账户控制者,而预计
域名使用 `domain.dataspace` 形式:

```text
domain: wonderland.universal
asset definition projection: tea in wonderland.universal
holder accounts: AccountId(controller=alice_key), AccountId(controller=mad_hatter_key)
```

存储或查询该类型的数据.
登记后的地址,并在触发行动中使用.

## 2. 选择触发器权限 {#_2-choose-the-trigger-authority}

如果可能,将触发器的技术账户设置为专用帐户.
专用帐户明确了哪些许可证是需要的触发器
执行并避免将触发器连接到运营商的个人签名
关键.

技术账户必须已经存在,并且必须有提交许可证.
在触发器中执行的指示.

## 3. 定义可执行的 {#_3-define-the-executable}

执行式是触发器在事件发生时提交的指示序列
在此例子中,它包含一个转移:

```text
Transfer(
  source = AssetId(tea_definition, mad_hatter_account),
  value = Numeric(1),
  destination = AssetId(tea_definition, alice_account)
)
```

使用 SDK 现在为最终的交易有效载荷打字构建者.
硬编码的旧文本 IDs 在触发码中;解析或查询标准 IDs
在构建执行器之前.

## 4. 定义事件过器 {#_4-define-the-event-filter}

使用数据事件过器将事件缩小到您关心的对象:

```text
EventFilterBox::Data(
  DataEventFilter for asset changes involving
  AssetId(tea_definition, alice_account)
)
```

保持过器的具体性和实用性 `AcceptAll` 过器对于
调试,但它使每个匹配事件支付了触发成本
评估.

## 5. 注册触发器 {#_5-register-the-trigger}

按以下方式注册触发器:

- 一个子 `TriggerId`
- 可执行的指令序列
- `Repeats::Indefinitely` 或 `Repeats::Exactly(n)`
- 技术账户
- 事件过器
- 任意的元数据

引发器登记本身是一个正常的交易,所以登记
技术帐户需要许可,以注册触发器.
触发器可执行所需的权限

## 执行命令 {#execution-order}

当一个区块执行时:

1. 通常的交易指令首先运行.
2. 根据这些指令所产生的数据事件收集.
3. 发射器的过器与这些事件相匹配.
4. 在区块执行管道中处理触发器产生的效应,
   允许无限的递归触发执行.

如果触发器使用 `Repeats::Exactly(n)`, 在计数时,注册一个新的触发器
现在,我们需要再做同样的行为.
