---
translation_locale: zh-hant
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 命名會議 {#naming-conventions}

當您為帳戶,域名或資產命名時,請記住 Iroha 中使用的以下規範:

1. 對於特定型別的建築物使用的一些保留分離器:

   - `@` 專用於帳戶別名和目標帳戶/公鑰形式
   - `#` 專用於資產定義別名和資產餘額字面
   - `::` 專用於合同別名
   - `.` 專用於域名和資料空間的資格
   - `$` 專用於觸發器掃描的文字形式
   - `%` 專用於驗證器範圍的文字形式

2. 一個名稱的最大字元數量 (包括 UTF-8 字元) 由兩個因素限制:`[0, u32::MAX]`和目前分配的堆空間.

## 在 Taira 試看. {#try-it-on-taira}

解決公共資產別名在其規範性資產定義中 ID:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

與資產定義列表進行比較:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

`#`字元將資產代號與域名文字分開. 除非你故意寫一個資產程式碼或資產餘額字母,否則不要使用簡單的名稱.
