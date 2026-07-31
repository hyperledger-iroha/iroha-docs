---
translation_locale: ja
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 代表大会 の 名付け {#naming-conventions}

アカウント,ドメイン,または資産の名前を指定する際には Iroha で使用される以下のコンベンションを覚えておく必要があります:

1. 特定のタイプの構造物に使用されるいくつかの分離器があります:

   - `@` アカウント・アライスとスクープアカウント/パブリックキーフォームに限定されています.
   - `#` 資産定義の偽名と資産バランス文字に限定されています.
   - `::` 契約の偽名に限定されています.
   - `.` ドメインとデータスペースの資格に限定されています
   - `$` トイガースケープのテキストフォームに限定されています.
   - `%` 認証対象のテキストフォームに限定されている.

2. 名前には UTF-8 文字を含む最大数の文字は, `[0, u32::MAX]`と現在割り当てられているスタックスペースで2つの要因によって制限されます.

## Taira で試してみてください {#try-it-on-taira}

公的資産の別名 ID を公的な資産の定義に解消する

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

資産定義リストと比較してみてください

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

`#` 文字は,資産・アライアスをドメイン文脈から切り離します.あなたが意図的に資産・アリアスや資産バランスの字面を書き込まない限り,単純な名前から遠ざけてください.
