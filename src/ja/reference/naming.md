---
translation_locale: ja
translation_source: /reference/naming.md
translation_source_hash: 15d095e674edf780c5859abe6f4615d53338e3304e8eedfa494017911204d4b6
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-supplemental-naming-link+reviewed-delta
---
# 命名規則 {#naming-conventions}

アカウント、ドメイン、または資産に名前を付ける際には、Iroha で使用されている以下の規則を念頭に置く必要があります。

1. 特定の種類の構造に使用される予約済みの区切り文字がいくつかあります：

   - `@` アカウントのエイリアスおよびスコープ付きアカウント/公開鍵形式のために予約されています
   - `#` 資産定義のエイリアスおよび資産残高リテラルに予約されています
   - `::` 契約エイリアス専用です
   - `.` ドメインおよびデータスペースの資格付けのために予約されています
   - `$` は `name$domain.dataspace` のような NFT 識別子のために予約されています

2. 名前は空でなく、Unicode NFC 形式で、UTF-8 で最大 255 バイトであり、空白文字、制御文字、双方向制御文字を含まない必要があります。

## Taira でこのワークフローを実行してください {#try-it-on-taira}

パブリック資産のエイリアスをその標準資産定義IDに解決する:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

それを資産定義リストと比較してください。

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

`#` 文字は、アセットのエイリアスをドメインコンテキストから分離します。アセットエイリアスやアセット残高リテラルを書く場合を除き、通常の名前には使用しないでください。
