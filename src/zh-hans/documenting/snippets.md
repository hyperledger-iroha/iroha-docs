---
translation_locale: zh-hans
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 代码片段 {#code-snippets}

生成的切片将从产生它们的 Iroha 修改中与代码,配置和方案相关的示例保持.

## 清新 Iroha 艺术品 {#refreshing-iroha-artifacts}

Iroha 衍生的切片在普通网站构建中检查,不需要网络访问或兄弟存储库. 明确更新:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

已注册的 [`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts)工作流验证了清洁源支付与 `provenance/iroha.json`相比,再生`/src/snippets`和 Torii OpenAPI 快照,和更新 SHA-256 哈希.一起查看内容和来源变化.正常的依赖安装和 VitePress 构建使用已注册的文件,而不会带来可变的分支.

## 包含零碎片 {#including-snippets}

使用[VitePress 代码片段语法](https://vitepress.dev/guide/markdown#import-code-snippets),以包含生成或本地源:

```md
<<< @/snippets/client.template.toml
```

一个命名代码区域可以通过添加该地区名称加入:

```md
<<< @/example_code/lorem.rs#ipsum
```

保持手写的例子小.更喜欢为公共界面,配置模板,生成的方案和命令输出更新的源文物.
