---
translation_locale: zh-hans
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 代码片段 {#code-snippets}

生成的截图将示例与代码,配置和方案联系在一起
在 Iroha 它们的修改.

## 清爽的 Iroha 艺术品 {#refreshing-iroha-artifacts}

Iroha- 衍生的截图是检查的,所以普通的网站构建不需要
直接更新这些数据:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

登记者
[`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts)
工作流向验证清洁源支付与 `provenance/iroha.json`,
复原 `/src/snippets` 在 Torii OpenAPI 快照和更新 SHA-256
查看内容和来源变化.正常依赖性
装机和 VitePress 构建不需要查看的文件
取一种可变的树枝.

## 包括零碎片 {#including-snippets}

使用
[VitePress 代码截图语法](https://vitepress.dev/guide/markdown#import-code-snippets)
包含生成或本地源:

```md
<<< @/snippets/client.template.toml
```

一个命名代码区域可以通过添加该地区名称加入:

```md
<<< @/example_code/lorem.rs#ipsum
```

保持手写的例子小.更喜欢更新的源文物
接口,配置模板,生成的方案和命令输出.
