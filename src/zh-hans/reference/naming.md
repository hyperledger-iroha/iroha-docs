---
translation_locale: zh-hans
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 命名会议 {#naming-conventions}

当您为账户,域名或资产命名时,请记住 Iroha 中使用的以下规范:

1. 对于特定类型的建筑物使用的一些保留分离器:

   - `@` 专用于账户姓氏和目标帐户/公钥表格
   - `#` 专用于资产定义别名和资产余额字面
   - `::` 专用于合同别名
   - `.` 专用于域名和数据空间的资格
   - `$` 专用于触发器扫描的文本形式
   - `%` 专用于验证器范围的文本表格

2. 一个名称的最大字符数量 (包括 UTF-8 字符) 由两个因素限制:`[0, u32::MAX]`和目前分配的堆空间.

## 在 Taira 试看. {#try-it-on-taira}

解决公共资产别名在其规范性资产定义中 ID:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

与资产定义列表进行比较:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

`#`字符将资产代号与域名文本分开. 除非你故意写一个资产代码或资产平衡字母,否则不要使用简单的名称.
