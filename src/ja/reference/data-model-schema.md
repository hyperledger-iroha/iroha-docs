---
translation_locale: ja
translation_source: /reference/data-model-schema.md
translation_source_hash: c4f0305c73f9470d1652b70e6787b59de2553a08b6c96603a9369512efbdb1af
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# データモデルスキーマ {#data-model-schema}

統合が対象とする正確なノードからスキーマを照会します。Torii は、そのサーフェスが有効になっているときに `GET /v1/schema` でアクティブなデータモデルスキーマを提供します：

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

別のビルド向けに公開されたコピーではなく、この応答からバインディングを生成してください。稼働中のノードからの応答が、そのノードにコンパイルされたデータモデルの正本です。連携に使用するノードのビルドとともに、対応する応答を固定して保管してください。
