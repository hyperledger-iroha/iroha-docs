---
translation_locale: zh-hans
translation_source: /guide/configure/modes.md
translation_source_hash: 3f6c2d84c7b6d325d76fb1b1a3ec0efb75381521f7fc69e7924a96532679bc61
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# 公有链与私有链 {#public-and-private-blockchains}

Iroha 可以采用多种配置运行。作为自有网络的管理员，您可以决定由哪个执行器和权限策略来判断是否接受交易。

常见配置包括私有许可网络和更开放的公有网络。两者都通过创世状态和执行器策略进行配置，而不是使用不同的节点二进制文件。

下面概述这两类用例的主要区别。

## 权限 {#permissions}

在公有链中，大多数账户拥有同一组权限。在私有链中，每个账户只获得明确授予给它的权限。

::: info

更多信息请参阅[权限专题章节](/zh-hans/blockchain/permissions.md)。

:::

## 节点 {#peers}

在公有链中，节点准入属于链上策略的一部分。对于私有链，部署通常会在配置和创世状态中固定可信节点集合。

::: info

更多信息请参阅[节点管理](peer-management.md)。

:::

## 注册账户 {#registering-accounts}

根据[创世块（`genesis.json`）](genesis.md)的设置方式，账户注册流程可能有两种不同形式。要理解其中原因，需要先说明权限。

所选执行器定义适用的权限检查。您可以在创世状态中授予默认[权限令牌](/zh-hans/blockchain/permissions.md)，从而形成由管理员管理的私有网络或更开放的网络。权限生效后，两类网络的账户注册流程也会不同。

公有注册策略和私有注册策略通常不同：

- 公有注册策略接受任何符合条件的用户提交的账户注册[^1]。用户需要合适的客户端、采用受支持算法的私钥，以及一份能被策略接受的注册请求。

- 私有注册策略可以只授权某个账户或某个智能合约提交注册。自定义策略可以把注册限制在特定时间窗口，也可以要求提交者花费一种令牌；由于没有任何权限主体拥有继续铸造该令牌的权限，其供应量是固定的。

- 在默认的私有网络模式下，每个新账户都由一个现有账户提交注册。

默认权限验证器涵盖典型的私有链用例。

::: info

公有与私有模式是执行器和创世策略的选择。两者使用同一个节点二进制文件。运行开放网络之前，请审查所选执行器和创世权限。

:::

有关 `Register<Account>` 指令的更多信息，请参阅[指令](/zh-hans/blockchain/instructions.md#un-register)章节。

[^1]: `Register<Account>` 为规范的无域 `AccountId` 创建账本状态；域路由与别名另行管理。
