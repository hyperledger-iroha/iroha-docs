---
translation_locale: ru
translation_source: /help/integration-issues.md
translation_source_hash: c5f169e423806fa2a9e9d198971588d1aa0b199a28d64e8b089b9f81727550a5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Проблемы с интеграцией {#troubleshooting-integration-issues}

В этом разделе предлагаются советы по устранению неполадок для интеграции Iroha 3. Если проблема, с которой вы столкнулись, не описана здесь, свяжитесь с нами по телефону [Telegram](https://t.me/hyperledgeriroha).

## Клиент не может подключиться {#client-cannot-connect}

Проверьте, указывает ли конфигурация клиента на адрес Torii:

```toml
torii_url = "http://127.0.0.1:8080/"
```

В случае проверки CLI продайте один и тот же файл явно:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Если сосед вбежит Docker или Kubernetes, используйте адрес хоста или сервиса, до которого можно добраться из процесса клиента. `127.0.0.1` внутри контейнера не является машиной-хозяином.

Для публичных испытаний Taira начните с неподписанной конечной зоны:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

Если эти команды не выполняют задачу `502`, TLS, DNS или ошибки в рассрочке времени, исправьте доступность сети или подождите общедоступную конечную точку тестирования сети перед отладкой ключей учетной записи или полезных нагрузок транзакций.

## Сделки отклоняются {#transactions-are-rejected}

Большинство сбоев в транзакциях вызваны несоответствием идентификации или разрешения:

- публичный ключ счета в конфигурации клиента не соответствует частному ключу, используемому для подписания
- счет не зарегистрирован в генезисе или по предшествующей сделке
- учетная запись не имеет токен разрешения или роли, требуемой проверщиком времени выполнения .
- Домен ID не обладает квалификацией пространства данных, например `domain.dataspace`

Используйте `--output-format text` во время дебигации команд CLI, чтобы ошибки были легче читать:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## Запросы возвращают пустые результаты {#queries-return-empty-results}

Пустые результаты запроса не всегда означают, что запрос потерпел неудачу.

- была совершена сделка, которая должна создавать объект
- запрошенный домен, определение активов или счет ID является каноническим.
- страницы или фильтры не исключают ожидаемый ряд
- клиент подключен к предполагаемой сети, а не к другой локальной сети;

Для проверки доменов, начинайте с самого широкого запроса:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## События или блокирующие потоки останавливаются раньше {#event-or-block-streams-stop-early}

Примеры потоков блоков и событий опираются на конечные точки потока Torii. Убедитесь, что пир все еще работает, а затем проверьте с отсрочкой:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

Для интеграций HTTP сопоставьте пути конечных точек с текущим [Torii референтом конечных пунктов ](/ru/reference/torii-endpoints.md).
