---
translation_locale: zh-hans
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 配置 Iroha {#configuring-iroha}

设置本地同行配置 TOML 这与连锁文件不同.
通过 [`SetParameter`](/zh-hans/blockchain/instructions.md#setparameter)
输出行为必须在配置文件中表示
或是链上参数;环境变量不包含门.

使用 [`--config`](../irohad-cli#arg-config) CLI 为指定配置文件的路径.

## 模板 {#template}

详细描述每个参数,请参见 [参数](./params.md) 的参考.

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## 编写配置文件 {#composing-configuration-files}

TOML 配置文件有额外的 `extends` 指向其他领域 TOML 它可能是单一的路径或
多个路径:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha 将反复阅读在 `extends` 然后把它们分成一层,后者将在其中重写.
参数级别上的前列. 例如,如果读 `config.toml`:

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

The 结果的配置将是 `chain` 在 `a.toml`, `max_content_len` 在 `b.toml`, 并且 `torii.address` 在
`config.toml` (重写) `b.toml`).

## 解决问题 {#troubleshooting}

通过 [`--trace-config`](../irohad-cli#arg-trace-config) CLI 标志以查看配置如何读取和解析的痕迹.
