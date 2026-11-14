---
translation_locale: zh-hant
translation_source: /reference/data-model-schema.md
translation_source_hash: c4f0305c73f9470d1652b70e6787b59de2553a08b6c96603a9369512efbdb1af
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# 資料模型方案 {#data-model-schema}

查詢您的整合目標確切節點的圖案. Torii 在啟用該表面時,將主動資料模型圖案服務於 `GET /v1/schema`:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

請根據該回應產生繫結，而不是使用為其他編譯版本發布的副本。執行中節點的回應，才是該節點已編譯資料模型的權威依據；請將此回應與整合所用的節點編譯版本一併固定保存。
