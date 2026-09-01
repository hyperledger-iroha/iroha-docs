---
translation_locale: ru
translation_source: /help/integration-issues.md
translation_source_hash: c5f169e423806fa2a9e9d198971588d1aa0b199a28d64e8b089b9f81727550a5
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Устранение проблем с интеграцией {#troubleshooting-integration-issues}

Этот раздел предлагает советы по устранению неполадок интеграции Iroha 3. Если описанная здесь проблема не соответствует вашей, свяжитесь с нами через [Телеграм](https://t.me/hyperledgeriroha).

## Клиент не может подключиться {#client-cannot-connect}

Проверьте, что конфигурация клиента указывает на адрес сети узла Torii:

```toml
torii_url = "http://127.0.0.1:8080/"
```

Для проверок CLI передайте тот же файл явно:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Если сетевой узел работает в Docker или Kubernetes, используйте адрес хоста или службы, доступный из клиентского процесса. `127.0.0.1` внутри контейнера не является хост-машиной.

Для публичных Taira тестов начните с неподписанной API пробной точки:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

Если эти команды завершатся с ошибками `502`, TLS, DNS или тайм-аута, исправьте доступность сети или дождитесь конца работы публичного тестнета API, прежде чем отлаживать ключи аккаунта или данные транзакции.

## Транзакции отклонены {#transactions-are-rejected}

Большинство сбоев транзакций вызваны несоответствием идентификации или авторизации:

- публичный ключ аккаунта в конфигурации клиента не совпадает с приватным ключом, используемым для подписи
- учетная запись не зарегистрирована в генезисе блокчейна или в результате предыдущей транзакции
- учетной записи не хватает токена разрешения или роли, требуемой проверяющим среду выполнения программного обеспечения
- у идентификатора домена отсутствует квалификация пространства данных, например `domain.dataspace`

Используйте `--output-format text` при отладке команд CLI, чтобы ошибки было легче читать:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## Запросы возвращают пустые результаты {#queries-return-empty-results}

Пустые результаты запроса не всегда означают, что запрос не удался. Проверьте:

- транзакция, которая должна была создать объект, была завершена
- запрошенный домен, определение актива или идентификатор аккаунта является каноническим
- пагинация или фильтры не исключают ожидаемую строку
- клиент подключен к предназначенной сети, а не к другой локальной сети

Для проверки доменов начните с самого широкого запроса:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## Потоки событий или блоков останавливаются преждевременно {#event-or-block-streams-stop-early}

Примеры потоков блоков и событий зависят от конечных точек потоковой передачи Torii API. Убедитесь, что сетевой узел все еще работает, затем протестируйте с тайм-аутом:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

Для интеграций HTTP сравните пути ваших конечных точек API с текущим [Torii API ссылка на конечную точку](/ru/reference/torii-endpoints.md).
