---
translation_locale: zh-hant
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 代碼片段 {#code-snippets}

生成的切片將從產生它們的 Iroha 修改中與代碼,配置和方案相關的示例保持.

## 清新 Iroha 藝術品 {#refreshing-iroha-artifacts}

Iroha 衍生的切片在普通網站構建中檢查,不需要網絡訪問或兄弟存儲庫. 明確更新:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

已註冊的 [`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts)工作流驗證了清潔源支付與 `provenance/iroha.json`相比,再生`/src/snippets`和 Torii OpenAPI 快照,和更新 SHA-256 哈希.一起查看內容和來源變化.正常的依賴安裝和 VitePress 構建使用已註冊的文件,而不會帶來可變的分支.

## 包含零碎片 {#including-snippets}

使用[VitePress 代碼片段語法](https://vitepress.dev/guide/markdown#import-code-snippets),以包含生成或本地源:

```md
<<< @/snippets/client.template.toml
```

一個命名代碼區域可以通過添加該地區名稱加入:

```md
<<< @/example_code/lorem.rs#ipsum
```

保持手寫的例子小.更喜歡爲公共界面,配置模板,生成的方案和命令輸出更新的源文物.
