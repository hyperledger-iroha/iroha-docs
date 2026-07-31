---
translation_locale: zh-hans
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 命名会议 {#naming-conventions}

当你命名账户,域名或资产时,你必须记住
在 Iroha:

1. 有一些用于特定的分离器.
   建筑物类型:

   - `@` 专用于账户姓名和目标帐户/公钥表格
   - `#` 专用于资产定义别名和资产余额字面
   - `::` 专用于合同别名
   - `.` 专用于域名和数据空间资格
   - `$` 仅适用于触发式文本表格
   - `%` 专用于验证器范围的文本表格

2. 字符的最大数量 (包括 UTF-8 字符) 一个名称可以
   有两个因素限制: `[0, u32::MAX]` 目前的
   分配的堆积空间.

## 试着. Taira {#try-it-on-taira}

解决公共资产别名在其规范性资产定义中 ID:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

与资产定义清单相比:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

其他 `#` 字符将一个资产别名与域文本分开.
除非您故意写出资产别名或资产
实际上是平衡.
