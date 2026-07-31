---
translation_locale: ru
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Конфигурация Iroha {#configuring-iroha}

Установлена локальная конфигурация TOML Это отличается от цепочки.
конфигурация изменилась через [`SetParameter`](/ru/blockchain/instructions.md#setparameter)
инструкции. Производственное поведение должно быть представлено в файле конфигурации
или параметр на цепочке; переменные окружающей среды не являются воротами.

Использование [`--config`](../irohad-cli#arg-config) CLI аргумент для указания пути к файлу конфигурации.

## Шаблон {#template}

Подробное описание каждого параметра см. [Параметры](./params.md) ссылка.

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## Составление конфигурационных файлов {#composing-configuration-files}

TOML файлы конфигурации имеют дополнительную `extends` поле, указывающее на другие TOML Это может быть один путь или
несколько путей:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha будет периодически читать все файлы, указанные в `extends` и распределили их в слои, где они будут переписываться.
на уровне параметров. `config.toml`:

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

The полученная конфигурация будет `chain` от `a.toml`, `max_content_len` от `b.toml`, и `torii.address` от
`config.toml` (перепись) `b.toml`).

## Устранение проблем {#troubleshooting}

Пропуск [`--trace-config`](../irohad-cli#arg-trace-config) CLI флаг, чтобы увидеть следы того, как конфигурация читается и анализируется.
