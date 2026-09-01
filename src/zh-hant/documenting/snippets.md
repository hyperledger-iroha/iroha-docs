---
translation_locale: zh-hant
translation_source: /documenting/snippets.md
translation_source_hash: 48d6670f100c7c6368fa03f163c9ff9e0322d36e51c22f89562b23b0e2ee2a2f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 程式碼片段 {#code-snippets}

生成的切片將從產生它們的 Iroha 修改中與程式碼,配置和方案相關的示例保持.

## 清新 Iroha 藝術品 {#refreshing-iroha-artifacts}

Iroha 衍生的切片在普通網站構建中檢查,不需要網路訪問或兄弟儲存庫. 明確更新:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

已註冊的 `etc/refresh-iroha.ts`工作流驗證了清潔源支付與 `provenance/iroha.json`相比,再生`/src/snippets`和 Torii OpenAPI 快照,和更新 SHA-256 雜湊.一起檢視內容和來源變化.正常的依賴安裝和 VitePress 構建使用已註冊的檔案,而不會帶來可變的分支.

## 包含零片段 {#including-snippets}

使用[VitePress 程式碼片段語法](https://vitepress.dev/guide/markdown#import-code-snippets),以包含生成或本地源:

```md
<<< @/snippets/client.template.toml
```

一個命名程式碼區域可以透過新增該地區名稱加入:

```md
<<< @/example_code/lorem.rs#ipsum
```

保持手寫的例子小.更喜歡為公共介面,配置模板,生成的方案和命令輸出更新的源構件.
