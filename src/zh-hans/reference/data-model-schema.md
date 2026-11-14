---
translation_locale: zh-hans
translation_source: /reference/data-model-schema.md
translation_source_hash: c4f0305c73f9470d1652b70e6787b59de2553a08b6c96603a9369512efbdb1af
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# 数据模型方案 {#data-model-schema}

查询您的集成目标确切节点的图案. Torii 在启用该表面时,将主动数据模型图案服务于 `GET /v1/schema`:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

请根据该响应生成绑定，不要使用为其他构建发布的副本。运行中节点的响应是其编译后数据模型的权威依据；应将该响应与集成所用的节点构建一起固定保存。
