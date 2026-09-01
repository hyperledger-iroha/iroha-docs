---
translation_locale: zh-hant
translation_source: /reference/data-model-schema.md
translation_source_hash: cf27b1f313a695b648ae450564a51120af0e3e39641ed140a187d128b930da97
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# 資料模型方案 {#data-model-schema}

查詢您的整合目標確切節點的圖案. Torii 在啟用該表面時,將主動資料模型圖案服務於 `GET /v1/schema`:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

在其來源狀態等待時,不要從註冊文件片段生成繫結.現場節點響應對該節點的編譯資料模型是權威的;保持它與您的整合所使用的節點構建一起固定.
