---
translation_locale: zh-hant
translation_source: /reference/naming.md
translation_source_hash: 15d095e674edf780c5859abe6f4615d53338e3304e8eedfa494017911204d4b6
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-supplemental-naming-link+reviewed-delta
---
# 命名會議 {#naming-conventions}

當您為帳戶,域名或資產命名時,請記住 Iroha 中使用的以下規範:

1. 對於特定型別的建築物使用的一些保留分離器:

   - `@` 專用於帳戶別名和目標帳戶/公鑰形式
   - `#` 專用於資產定義別名和資產餘額字面
   - `::` 專用於合同別名
   - `.` 專用於域名和資料空間的資格
   - `$` 保留用於 NFT 識別碼，例如 `name$domain.dataspace`

2. 名稱必須非空，採用 Unicode NFC 形式，長度不超過 255 個 UTF-8 位元組，且不得包含空白字元、控制字元與雙向控制字元。

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
