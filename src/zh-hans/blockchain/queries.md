---
translation_locale: zh-hans
translation_source: /blockchain/queries.md
translation_source_hash: 0a32b75b78d5bcde0d2b84b58d440b18e545559dfd9772dd6508ad41e972bf6e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

<script setup>
import WarningFatQuery from './WarningFatQuery.vue'
</script>

# 问题 {#queries}

虽然大部分关于区块链状态的信息
通过使用事件订阅器和过器来
缩小事件的范围到那些有兴趣的人,有时你需要
走进一个更直接的方法. _查询_.

查询是类似指示的小物体, Iroha
朋友们,请用当前世界状况的细节来回答.

这并不一定是唯一可用的信息.
网络,但它是唯一的信息 _保证_ 在
在所有网络上都可访问.

每次部署 Iroha, 可能还有其他可用的信息.
例如,遥测数据的可用性取决于网络
管理者完全要决定他们是否愿意
分配处理功率来追踪工作,而不是使用它来完成
实际工作. 相反,某些功能总是需要,例如
获得您的账户余额.

查询结果可能是 [排序](#sorting), [页面化](#pagination)
并且 [过](#filters) 一次的同行.排序完成
选可以在各种类型的
从领域特定 (个性化) IP 面膜选地址)
字符串子方法,如 `begins_with` 通过逻辑操作结合.

## 试着. Taira {#try-it-on-taira}

Taira 仅阅读的查询辅助器 JSON 为了共同的资源.
在电缆配线之前练习页面化和响应处理 SDK:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/accounts?limit=3" \
  | jq '{total, ids: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/domains?limit=3" \
  | jq '{total, domains: [.items[].id]}'

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=3" \
  | jq '{total, assets: [.items[] | {id, name, total_quantity}]}'
```

对于应用程序诊断,请将这些烟雾检查与签署的交易分开.
检测.只读取查询失败通常指向终端点的可用性,
在指向签名器设置之前,网络可访问性或路线兼容性.

## 创建查询 {#create-a-query}

使用从中输入查询构建器 SDK 或 CLI. 例如,目前的数据
模型曝光 `FindAccounts` 对上市账户:

```rust
let query = FindAccounts;
```

这是一个查询发现爱丽丝的资产的一个例子:

```rust
let alice_id = load_canonical_account_id_from_client_config()?;
let query = FindAssetsByAccountId::new(alice_id);
```

## 页面化 {#pagination}

对于单独查询和小可重复查询,你可以使用 `client.request`
在一个时间内,我们可以提交查询并获得结果.

然而,广泛的可重复查询如 `FindAccounts`, `FindAssets`, 或
`FindBlocks` 使用页面化来减少负载
对于同行和客户.

建立一个 `Pagination`, 你需要打电话
`client.request_with_pagination(query, pagination)`, 在哪里 `pagination`
结构如下:

```rust
let starting_result: u32 = _;
let limit: u32 = _;
let pagination = Pagination::new(Some(starting_result), Some(limit));
```

## 过器 {#filters}

当你创建查询时,你可以使用过器只返回结果
与指定过器相匹配.

过器是查询特定的.例如,帐户查询可以通过
账户身份或元数据,而资产查询可以通过资产缩小
定义,持有者账户或域名投影. SDK 输入了查询
在可能的情况下,构建器,以便过器类型匹配查询输出类型.

## 排序 {#sorting}

Iroha 可以分类物品 [大数据](/zh-hans/blockchain/metadata.md)
在建筑过程中提供一个分类的关键时,
一个典型的使用情况是, `registered-on`
输入元数据,当进行分类时,允许您查看帐户
登记历史.

排序仅适用于有
[大数据](/zh-hans/blockchain/metadata.md), 随着 metadata密钥的使用
排序查询结果.

您可以将排序与页面化和过器结合起来.
这种功能是可选的,大多数页面化查询都不需要它.

## 参考 {#reference}

检查 [现有查询列表](/zh-hans/reference/queries.md) 为了详细了解它们.
