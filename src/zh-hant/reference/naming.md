---
translation_locale: zh-hant
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 命名會議 {#naming-conventions}

當您將帳戶,域名或資產命名時,
在此之前使用的下列公约 Iroha:

1. 還有許多保留的分隔器,
   建築物類型:

   - `@` 專用於帳戶名稱和專門帳戶/公钥表格
   - `#` 專用於資產定義稱和資產平衡字面
   - `::` 專用於合同名稱
   - `.` 專為域名和數據空間資格
   - `$` 專用於開啟式文字表格
   - `%` 專屬於驗證碼的文本表格

2. 最多的字符數量 (包括 UTF-8 字符) 一個名稱可以
   這兩項因素是限制性的: `[0, u32::MAX]` 目前的情況
   配置的堆積空間.

## 試著使用 Taira {#try-it-on-taira}

解決公共資產的代名稱在其法規資產定義中 ID:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

請與資產定義清單比較:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

其他國家 `#` 字符將一個資產名稱從域範圍中分離.
除非您故意寫出資產姓名或資產
這樣的平衡是字面上的.
