---
translation_locale: ru
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 6da8a0abddc9723b16477a935a3953ebd497300f02eadd635e4e38027a11d095
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Конфигурация клиента {#client-configuration}

Iroha CLI и SDK клиенты используют TOML Репозиторий отправляет текущий по умолчанию на `defaults/client.toml`; генерируемые локальные сети также пишут совпадение `client.toml` в их исходный каталог.

::: details Шаблон конфигурации клиента

<<< @/snippets/client.template.toml

:::

## Основные поля {#core-fields}

По крайней мере, конфигурация клиента определяет цепочку, конечную точку Torii и подписывающийся счет:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` выбирает цепочку, к которой относятся представленные сделки.
- `torii_url` пункты на уровне Torii HTTP API.
- `[account].domain` используется сокращениями CLI и кодированием адреса-селектора; сам канонический `AccountId` не имеет доменов.
- `[account].public_key` и `[account].private_key` подписывают сделки.

Счет должен уже существовать в цепочке. Для дефолта локальной сети это обрабатывается с помощью объединенного генезисного манифеста.

::: info Чувствительность случая

Названия Iroha чувствительны к случаям после канонического анализа. Например, `wonderland.universal`, `Wonderland.universal` и `looking_glass.universal` являются отдельными доменными буквалями.

:::

## Основная аутентификация {#basic-authentication}

Необходимо `[basic_auth]` в разделе добавляется HTTP `Authorization` Заголовок к запросам клиентов. Iroha не интерпретируют эти учетные данные напрямую; используйте их, когда Torii стоит за таким реверсным прокси, как Nginx.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## Настройки транзакций {#transaction-settings}

Действие транзакции конфигурировано в разделе `[transaction]`:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` - срок действия транзакции в миллисекундах.
- `status_timeout_ms` контролирует, как долго клиент ожидает состояния сделки.
- `nonce = true` просит клиента включить нечто, так что повторяющиеся транзакции производят разные хэши.

## Подключить настройки очереди {#connect-queue-settings}

Текущие клиенты Iroha также могут использовать дополнительный раздел `[connect]` для состояния местной очереди:

```toml
[connect]
queue_root = "./queue"
```

Используйте это, когда рабочий процесс требует длительного хранения в очереди с стороны клиента.

## Создание конфигураций {#generating-configurations}

Для одноразовых локальных сетей предпочтительнее Kagami потому что там написано совпадение. Iroha 3 Конфигурации, генезис, сценарии, и README:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Используйте генерируемый `./localnet/client.toml` с CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
