---
translation_locale: zh-hant
translation_source: /reference/peer-config/index.md
translation_source_hash: dd44f8f12cc456d6f37e1ceb3e82cf4a979e80115c75e28dcb1fe4f29469aaf4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 配置 Iroha {#configuring-iroha}

當地同行配置設置在 TOML 文件中.這與通過[`SetParameter`](/zh-hant/blockchain/instructions.md#setparameter)指令改變的鏈上配置不同.生產行爲必須在一個配置文件或鏈上參數中表示;環境變量不是特徵門

使用[`--config`](../iroha3d-cli#arg-config) CLI 參數來指定配置文件的路徑.

## 模板 {#template}

對於每個參數的詳細描述,請參見 [參數](./params.md)參考文獻.

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## 編寫配置文件 {#composing-configuration-files}

TOML 配置文件具有一個額外的 `extends` 字段,指向其他 TOML 文件. 它可能是單個路徑或多個路徑:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha 將反覆閱讀`extends`中指定的所有文件,並將它們組建成層次,後者在參數級別上重寫之前的文件.例如,如果閱讀`config.toml`:

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

結果的配置將是 `chain` 來自 `a.toml`, `max_content_len` 來自 `b.toml`, 和 `torii.address` 來自 `config.toml` (重寫) `b.toml`).

## 解決問題 {#troubleshooting}

通過[`--trace-config`](../iroha3d-cli#arg-trace-config) CLI 旗,查看配置如何閱讀和解析的痕跡.
