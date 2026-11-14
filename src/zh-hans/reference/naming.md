---
translation_locale: zh-hans
translation_source: /reference/naming.md
translation_source_hash: 15d095e674edf780c5859abe6f4615d53338e3304e8eedfa494017911204d4b6
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-supplemental-naming-link+reviewed-delta
---
# 命名会议 {#naming-conventions}

当您为账户,域名或资产命名时,请记住 Iroha 中使用的以下规范:

1. 对于特定类型的建筑物使用的一些保留分离器:

   - `@` 专用于账户别名和目标帐户/公钥形式
   - `#` 专用于资产定义别名和资产余额字面
   - `::` 专用于合同别名
   - `.` 专用于域名和数据空间的资格
   - `$` 保留用于 NFT 标识符，例如 `name$domain.dataspace`

2. 名称必须非空，采用 Unicode NFC 形式，长度不超过 255 个 UTF-8 字节，并且不得包含空白字符、控制字符和双向控制字符。

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

`#`字符将资产代号与域名文本分开. 除非你故意写一个资产代码或资产余额字母,否则不要使用简单的名称.
