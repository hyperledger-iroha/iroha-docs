---
translation_locale: zh-hant
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 編碼片段 {#code-snippets}

生成的截圖將示例連結到代碼,配置和方案
這項政策 Iroha 該組織的經驗.

## 這樣可以讓人感到清爽. Iroha 藝術品 {#refreshing-iroha-artifacts}

Iroha- 導致的截圖會被檢查,因此一般網站建立不需要
直接更新這些資料:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

已登記的人
[`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts)
工作流量檢查清潔源的清算 `provenance/iroha.json`,
還原 `/src/snippets` 這種情況 Torii OpenAPI 快速拍攝及更新 SHA-256
查看內容和原來變化.
裝置和使用 VitePress 建立的檔案使用了沒有登錄的檔案
帶來一個可變的枝子.

## 包含零部件 {#including-snippets}

請使用
[VitePress 代碼截圖構文](https://vitepress.dev/guide/markdown#import-code-snippets)
包含生成或本地源:

```md
<<< @/snippets/client.template.toml
```

該區域名稱可以透過添加其地區名稱加入:

```md
<<< @/example_code/lorem.rs#ipsum
```

保持手寫的例子小.
接口,配置模板,生成的方案和命令输出.
