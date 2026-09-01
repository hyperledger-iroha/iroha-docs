---
translation_locale: zh-hans
translation_source: /reference/data-model-schema.md
translation_source_hash: cf27b1f313a695b648ae450564a51120af0e3e39641ed140a187d128b930da97
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# 数据模型方案 {#data-model-schema}

查询您的集成目标确切节点的图案. Torii 在启用该表面时,将主动数据模型图案服务于 `GET /v1/schema`:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

在其来源状态等待时,不要从注册文档片段生成绑定.现场节点响应对该节点的编译数据模型是权威的;保持它与您的集成所使用的节点构建一起固定.
