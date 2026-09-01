---
translation_locale: zh-hans
translation_source: /blockchain/queries.md
translation_source_hash: 234c831c97bb93996e6cf51505921ff509e233408cf2faf6a9b23641e5642040
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

<script setup>
import WarningFatQuery from './WarningFatQuery.vue'
</script>

# 查询 {#queries}

事件订阅者和过滤器可以跟踪区块链状态的变化如果您需要直接查看当前状态,请使用查询.

查询是像指令一样的小物体.发送一个给 Iroha 对等节点来了解他目前的世界状况.

网络可以公开其他信息。可查询的世界状态信息是唯一保证在每个 Iroha 网络上都可用的信息类型。

对于每次部署 Iroha,可能还有其他可用的信息.例如,远程测量数据的可用性取决于网络管理员.它们是否愿意分配处理能力来跟踪工作,而不是使用它来完成实际的工作. 相反,某些功能总是需要,例如访问账户余额.

查询结果可以同时进行 [排序](#sorting), [页面化](#pagination)和 [过滤](#filters).排序是用词汇图进行的.过滤可以根据各种原则进行,从特定域 (个别的 IP 地址过滤器面具) 到使用逻辑操作结合的`begins_with`等子字符串方法.

## 在 Taira 试看. {#try-it-on-taira}

Taira 将只读取查询辅助器暴露在 JSON 上,用于共同资源. 在连接 SDK 之前使用它们来练习页面化和响应处理:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/accounts?limit=3" \
  | jq '{total, ids: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/domains?limit=3" \
  | jq '{total, domains: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=3" \
  | jq '{total, assets: [.items[] | {id, name, total_quantity}]}'
```

对于应用程序诊断,请将这些烟雾检查与签署的交易测试分开.只阅读查询失败通常指向端点可用性,网络可访问性或路线兼容性,然后指向签约器设置.

## 创建查询 {#create-a-query}

使用从 SDK 或 CLI 的输入查询构建器. 例如,当前的数据模型对列表账户显示`FindAccounts`:

```rust
let query = FindAccounts;
```

这是一个查询发现Alice 的资产的一个例子:

```rust
let alice_id = load_canonical_account_id_from_client_config()?;
let query = FindAssetsByAccountId::new(alice_id);
```

## 浏览页面 {#pagination}

对于单独查询和小型可重复查询,您可以使用 `client.request` 来提交查询并获得一次性结果.

然而, `FindAccounts`, `FindAssets`或 `FindBlocks`等广泛可重复的查询可以返回大型结果集. 使用页面化来减少对等节点和客户端负载.

为了构建 `Pagination`,您需要拨打 `client.request_with_pagination(query, pagination)`,其中`pagination`的构建方式如下:

```rust
let starting_result: u32 = _;
let limit: u32 = _;
let pagination = Pagination::new(Some(starting_result), Some(limit));
```

## 过滤器 {#filters}

在创建查询时,您可以使用过滤器只返回符合指定过滤器的结果.

例如,账户查询可以通过帐户身份或元数据缩小,而资产查询则可根据资产缩小 在可能的情况下,使用 SDK 的输入查询构造器,以便过滤器类型匹配查询输出类型.

## 排序 {#sorting}

Iroha 可以用[元数据](/zh-hans/blockchain/metadata.md)语法来排序项目,如果您提供查询构建过程中进行排序的关键.一个典型的使用情况是帐户有`registered-on`元数据输入,当排序时,允许您查看账户注册历史.

排序仅适用于具有 [元数据](/zh-hans/blockchain/metadata.md)的实体,因为用于对查询结果进行分类的元数据键.

您可以将排序与页面化和过滤器结合起来. 请注意,排序是可选的功能,大多数页面化查询都不需要它.

## 参考 {#reference}

查看 [现有查询列表](/zh-hans/reference/queries.md),以获取有关查询的详细信息.
