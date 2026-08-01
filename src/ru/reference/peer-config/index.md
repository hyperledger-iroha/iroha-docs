---
translation_locale: ru
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Конфигурация Iroha {#configuring-iroha}

Местная конфигурация сверстников устанавливается в файлах TOML. Это отличается от конфигурации на цепи, измененной посредством инструкций [`SetParameter`](/ru/blockchain/instructions.md#setparameter). Производственное поведение должно быть представлено в файле конфигураций или параметре на цепи; переменные окружающей среды не являются воротами функций.

Используйте аргумент [`--config`](../irohad-cli#arg-config) CLI для указания пути к файлу конфигурации.

## Шаблон {#template}

Для подробного описания каждого параметра обратитесь к ссылке [Параметры](./params.md).

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## Составление файлов конфигурации {#composing-configuration-files}

Конфигурационные файлы TOML имеют дополнительное поле `extends`, указывающее на другие файлы TOML (s). Это может быть один путь или несколько:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha будет рекурсивно читать все файлы, указанные в `extends`, и составлять их в слои, где последние переписывают предыдущие на уровне параметров. Например, если чтение `config.toml`:

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

Полученная конфигурация будет `chain` от `a.toml`, `max_content_len` от `b.toml`, и `torii.address` от `config.toml` (перепись) `b.toml`).

## Устранение неполадок {#troubleshooting}

Пройдите флаг [`--trace-config`](../irohad-cli#arg-trace-config) CLI, чтобы увидеть следы того, как конфигурация читается и анализируется.
