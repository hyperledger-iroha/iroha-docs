---
translation_locale: zh-hans
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 配置 Iroha {#configuring-iroha}

当地同行配置设置在 TOML 文件中.这与通过[`SetParameter`](/zh-hans/blockchain/instructions.md#setparameter)指令改变的链上配置不同.生产行为必须在一个配置文件或链上参数中表示;环境变量不是特征门

使用[`--config`](../irohad-cli#arg-config) CLI 参数来指定配置文件的路径.

## 模板 {#template}

对于每个参数的详细描述,请参见 [参数](./params.md)参考文献.

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## 编写配置文件 {#composing-configuration-files}

TOML 配置文件具有一个额外的 `extends` 字段,指向其他 TOML 文件. 它可能是单个路径或多个路径:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha 将反复阅读`extends`中指定的所有文件,并将它们组建成层次,后者在参数级别上重写之前的文件.例如,如果阅读`config.toml`:

::: code-group

```toml [config.toml]
extends = ["a.toml", "b.toml"]

[torii]
address = "0.0.0.0:8080"
```

```toml [a.toml]
chain = "whatever"
```

```toml [b.toml]
[torii]
address = "localhost:4000"
max_content_len = 2048
```

:::

结果的配置将是 `chain` 来自 `a.toml`, `max_content_len` 来自 `b.toml`, 和 `torii.address` 来自 `config.toml` (重写) `b.toml`).

## 解决问题 {#troubleshooting}

通过[`--trace-config`](../irohad-cli#arg-trace-config) CLI 旗,查看配置如何阅读和解析的痕迹.
