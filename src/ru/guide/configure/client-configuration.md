---
translation_locale: ru
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 0d897a79e6118de2e7e88a45f1daf1444b515fd35e7b2562f7c1cc18ed0a83b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Конфигурация клиента {#client-configuration}

Iroha CLI и SDK клиенты используют TOML Конфигурация.
текущий дефолт на `defaults/client.toml`; генерируемые локальные сети также пишут
совпадение `client.toml` в их исходный каталог.

::: details Шаблон конфигурации клиента

<<< @/snippets/client.template.toml

:::

## Основные поля {#core-fields}

По крайней мере, конфигурация клиента идентифицирует цепочку. Torii конечная точка и
подписывающий счет:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` выбирает цепочку, к которой относятся представленные сделки.
- `torii_url` точки на уровне равных Torii HTTP API.
- `[account].domain` используется CLI кратковременные маршруты и кодирование адреса-селектора;
  Канонический `AccountId` сам по себе бездоменный.
- `[account].public_key` и `[account].private_key` подписывать сделки.

Для дефолта локальной сети это
И все, что мы делаем, - это сделайте так, как вы можете.

::: info Чувствительность случая

Iroha Названия могут быть чувствительны к случаям после канонического анализа.
`wonderland.universal`, `Wonderland.universal`, и
`looking_glass.universal` Это отдельные доменные буквы.

:::

## Основная аутентификация {#basic-authentication}

Необходимо `[basic_auth]` в разделе добавляется HTTP `Authorization` заголовок к
запросы клиентов. Iroha не интерпретируют эти удостоверения непосредственно;
их, когда Torii стоит за обратным прокси, таким как Nginx.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## Настройки транзакций {#transaction-settings}

Действие транзакции конфигурировано с `[transaction]` раздел:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` является продолжительность жизни транзакции в миллисекундах.
- `status_timeout_ms` контролирует, как долго клиент ждет транзакции
  статус.
- `nonce = true` просит клиента включить нечетные так повторяющиеся операции
  производить различные гаши.

## Подключить настройки очереди {#connect-queue-settings}

Текущая Iroha клиенты могут также использовать опциональный `[connect]` раздел для местных
состояние очереди:

```toml
[connect]
queue_root = "./queue"
```

Используйте это, когда рабочий процесс требует длительного хранения очередей на стороне клиента.

## Создание конфигураций {#generating-configurations}

Для одноразовых локальных сетей предпочтительно Kagami потому что там написано "совпадение". Iroha
3 конфиг, генезис, сценарии и README:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Используйте генерируемые `./localnet/client.toml` с CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
