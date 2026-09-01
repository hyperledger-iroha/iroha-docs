---
translation_locale: ja
translation_source: /reference/data-model-schema.md
translation_source_hash: cf27b1f313a695b648ae450564a51120af0e3e39641ed140a187d128b930da97
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# データモデルスキーマ {#data-model-schema}

統合が対象とする正確なノードからスキーマを照会します。Torii は、そのサーフェスが有効になっているときに `GET /v1/schema` でアクティブなデータモデルスキーマを提供します：

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

作成途中のドキュメントスニペットの由来ステータスが保留中の場合、そのスニペットからバインディングを生成しないでください。ライブノードの応答は、そのノードのコンパイル済みデータモデルに対して権威ある情報です；統合で使用するノードビルドと一緒に固定して保持してください。
