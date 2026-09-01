---
translation_locale: ru
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 6da8a0abddc9723b16477a935a3953ebd497300f02eadd635e4e38027a11d095
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Конфигурация клиента {#client-configuration}

Iroha, CLI и SDK клиенты используют конфигурацию TOML. Репозиторий поставляет текущий стандарт по умолчанию в `defaults/client.toml`; сгенерированные локальные сети также записывают соответствующий `client.toml` в свой выходной каталог.

::: details Шаблон конфигурации клиента

<<< @/snippets/client.template.toml

:::

## Основные поля {#core-fields}

Как минимум, конфигурация клиента определяет цепочку, конечную точку Torii API и учетную запись для подписи:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` выбирает цепочку, к которой относятся отправленные транзакции.
- `torii_url` указывает на сетевого узла Torii HTTP API.
- `[account].domain` используется ярлыками и кодированием селектора адресов CLI; канонический `AccountId` сам по себе не имеет домена.
- `[account].public_key` и `[account].private_key` подписывают транзакции.

Учётная запись уже должна существовать в цепочке. Для сети по умолчанию это обеспечивается с помощью встроенного технического манифеста генезиса блокчейна.

::: info Чувствительность к регистру

Iroha имена чувствительны к регистру после канонического разбора. Например, `wonderland.universal`, `Wonderland.universal` и `looking_glass.universal` являются различными литералами домена.

:::

## Базовая аутентификация {#basic-authentication}

Необязательный раздел `[basic_auth]` добавляет заголовок HTTP `Authorization` к запросам клиента. Сетевые узлы Iroha напрямую не интерпретируют эти учетные данные; используйте их, когда Torii находится за обратным прокси, таким как Nginx.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## Настройки транзакции {#transaction-settings}

Поведение транзакции настраивается с помощью раздела `[transaction]`:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` — это время жизни транзакции в миллисекундах.
- `status_timeout_ms` контролирует, как долго клиент ожидает состояния транзакции.
- `nonce = true` просит клиента включить криптографическое значение случайного числа, чтобы повторяющиеся транзакции создавали разные криптографические хэши.

## Настройки очереди подключения {#connect-queue-settings}

Текущие клиенты Iroha также могут использовать дополнительный раздел `[connect]` для состояния локальной очереди:

```toml
[connect]
queue_root = "./queue"
```

Используйте это, когда рабочему процессу необходимо надежное клиентское хранилище очереди.

## Генерация конфигураций {#generating-configurations}

Для одноразовых локальных сетей предпочтительнее использовать Kagami, потому что он записывает соответствующие конфигурации Iroha 3, генезис блокчейна, скрипты и README:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Используйте сгенерированный `./localnet/client.toml` с CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
