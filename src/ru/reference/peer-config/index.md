---
translation_locale: ru
translation_source: /reference/peer-config/index.md
translation_source_hash: dd44f8f12cc456d6f37e1ceb3e82cf4a979e80115c75e28dcb1fe4f29469aaf4
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Настройка Iroha {#configuring-iroha}

Настройка узла локальной сети задана в TOML файлы. Это отличается от изменения конфигурации в цепочке через [`SetParameter`](/ru/blockchain/instructions.md#setparameter) инструкции. Поведение производства должно быть представлено в конфигурации файл или параметр в цепочке; переменные окружения не являются функциональными переключателями.

Использовать [`--config`](../iroha3d-cli#arg-config) CLI аргумент для указания пути к файлу конфигурации.

## Шаблон {#template}

Для подробного описания каждого параметра, пожалуйста, обратитесь к справочнику [Параметры](./params.md).

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## Создание конфигурационных файлов {#composing-configuration-files}

Файлы конфигурации TOML имеют дополнительное поле `extends`, указывающее на другие файлы TOML. Это может быть один путь или несколько путей:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha будет рекурсивно читать все файлы, указанные в `extends`, и составлять их в слои, где последующие перекрывают предыдущие на уровне параметров. Например, при чтении `config.toml`:

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

Полученная конфигурация будет `chain` из `a.toml`, `max_content_len` из `b.toml` и `torii.address` из `config.toml` (перезаписывает `b.toml`).

## Устранение неполадок {#troubleshooting}

Пропустить [`--trace-config`](../iroha3d-cli#arg-trace-config) CLI флаг для отслеживания того, как конфигурация читается и разбирается.
