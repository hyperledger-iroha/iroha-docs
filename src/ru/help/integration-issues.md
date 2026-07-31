---
translation_locale: ru
translation_source: /help/integration-issues.md
translation_source_hash: f9f8a1e5f8c66714532523ef40467d3e79d4d023b3b353244f0317647e755b38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Проблемы с интеграцией {#troubleshooting-integration-issues}

В данном разделе приведены советы по решению неполадок Iroha 3 Интеграция.
Вы переживаете не описывается здесь,
свяжитесь с нами через [Телеграмм](https://t.me/hyperledgeriroha).

## Клиент не может подключиться {#client-cannot-connect}

Проверьте, что конфигурация клиента указывает на однорангский Torii адрес:

```toml
torii_url = "http://127.0.0.1:8080/"
```

Для CLI проверки, пропускать один и тот же файл явно:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Если придет друг друга Docker или Kubernetes, используйте адрес хоста или сервиса, который
доступно из процесса клиента. `127.0.0.1` внутри контейнера не
принимающая машина.

Для общественности Taira испытания, начинаются с неподписанной конечной зоны:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

Если эти команды не выполняют `502`, TLS, DNS, или ошибки временного прерывания, исправление сети
Доступность или ожидание общедоступной конечной точки тестирования сети перед дебгурированием учетной записи
ключи или полезные нагрузки транзакций.

## Сделки отклоняются {#transactions-are-rejected}

Большинство неудач транзакций обусловлены несоответствием идентификации или разрешения:

- публичный ключ счета в конфигурации клиента не соответствует частному ключу
  используется для подписания
- счет не зарегистрирован в генезисе или по предварительной сделке
- на счете отсутствует токен разрешения или роль, требуемая для исполнения
  валидатор
- домен ID отсутствует квалификация пространства данных, например:
  `domain.dataspace`

Использование `--output-format text` во время дебюгирования CLI команды , чтобы ошибки были легче
читать:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## Запросы возвращают пустые результаты {#queries-return-empty-results}

Пустые результаты запроса не всегда означают, что запрос потерпел неудачу.

- была совершена сделка, которая должна создавать объект
- запрашиваемое доменное место, определение активов или учетная запись ID является каноническим
- страницы или фильтры не исключают ожидаемый ряд
- клиент подключен к намеченной сети, а не к другой локальной сети

Для проверки доменов начните с самого широкого запроса:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## Поток событий или блоков заканчивается раньше {#event-or-block-streams-stop-early}

Примеры потока блоков и событий опираются на Torii Проверьте
Peer все еще работает, затем проверьте с отсрочкой:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

Для HTTP Интеграции, сравнить свои конечные пути с текущим
[Torii ссылка на конечную точку](/ru/reference/torii-endpoints.md).
