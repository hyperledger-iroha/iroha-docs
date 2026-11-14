---
translation_locale: ru
translation_source: /guide/configure/client-configuration.md
translation_source_hash: b3cfc8d8bf51a43b88cefb5ac7fe641717b347f7c89d983bf4c2de80944f1bb8
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Конфигурация клиента {#client-configuration}

Iroha, CLI и SDK клиенты используют конфигурацию TOML. Репозиторий поставляет текущий стандарт по умолчанию в `defaults/client.toml`; сгенерированные локальные сети также записывают соответствующий `client.toml` в свой выходной каталог.

::: details Шаблон конфигурации клиента

<<< @/snippets/client.template.toml

:::

## Основные поля {#core-fields}

Конфигурация клиента должна как минимум задавать цепочку, её сетевой идентификатор, конечную точку Torii, сетевой контекст учётной записи и ключ подписи:

```toml
chain = "00000000-0000-0000-0000-000000000000"
network_id = "hash:32C903E5B3497E34C2B844EBFE8A39C19E6CF8F95D44C1FFB8BA9DCB42F91149#A2F0"
torii_url = "http://127.0.0.1:8080/"

[account]
chain_discriminant = 753
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` выбирает цепочку, к которой относятся отправленные транзакции.
- `network_id` — это полученный из генезиса идентификатор сети, к которому привязан каждый подписанный запрос. Настройте ровно одно из полей `network_id` или `network_id_file`. Узел публикует значение через `GET /v1/accounts/capabilities`.
- `torii_url` указывает на сетевого узла Torii HTTP API.
- `[account].chain_discriminant` выбирает сетевой префикс учётной записи I105. Для публичных сетей вместо него можно использовать `[account].profile = "taira"` или `"minamoto"`. Один из этих двух способов выбора обязателен; сам канонический `AccountId` не содержит домен.
- `[account].public_key` и `[account].private_key` задают пару ключей для подписи транзакций; вместо `private_key` можно указать `private_key_file`.

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

CLI `iroha` также читает необязательный раздел `[connect]` для локального состояния очереди. Общая конфигурация SDK этот раздел не принимает:

```toml
[connect]
queue_root = "./queue"
```

Используйте этот раздел, если процессу требуется долговременное хранение клиентской очереди. Значение `connect.queue_root` по умолчанию — `~/.iroha/connect`. Относительный путь отсчитывается от каталога, содержащего клиентский файл TOML.

## Генерация конфигураций {#generating-configurations}

Для одноразовых локальных сетей предпочтительнее использовать Kagami, потому что он записывает соответствующие конфигурации Iroha 3, генезис блокчейна, скрипты и README:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

Используйте сгенерированный `./localnet/client.toml` с CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```
