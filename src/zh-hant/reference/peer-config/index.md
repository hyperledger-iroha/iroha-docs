---
translation_locale: zh-hant
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 設定方式 Iroha {#configuring-iroha}

在本地同行配置設定中 TOML 這與連鎖檔案不同.
設定改變了 [`SetParameter`](/zh-hant/blockchain/instructions.md#setparameter)
必須在配置文件中表示產品行為
或是連鎖上參數;環境變量沒有功能門.

使用 [`--config`](../irohad-cli#arg-config) CLI 指定設定檔案的路徑.

## 模板 {#template}

各參數的詳細描述,請參考 [參數](./params.md) 參考資料

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## 編輯配置文件 {#composing-configuration-files}

TOML 設定檔案有附加版本 `extends` 指向其他地區 TOML 這可能是單一路線或
多個路徑:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha 能反復閱讀所有指定的文件 `extends` 然後將它們排列成一層,後者將其覆蓋.
數據顯示在參數水平上. `config.toml`:

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

The 這樣的配置將會 `chain` 來自 `a.toml`, `max_content_len` 來自 `b.toml`, 及其他 `torii.address` 來自
`config.toml` (重寫) `b.toml`).

## 解決問題 {#troubleshooting}

通過時間 [`--trace-config`](../irohad-cli#arg-trace-config) CLI 檢查配置如何閱讀和解析的標籤.
