---
translation_locale: ru
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: bing-translator-llm

aside: false
pageClass: torii-api-console-page
---

# Torii API Консоль {#torii-api-console}

Используйте живой документ OpenAPI с работающей конечной точки Torii API, чтобы проверять маршруты, отправлять тестовые запросы, копировать команды curl и генерировать код клиента.

<ToriiApiConsole />

## Требования {#requirements}

- Конечная точка Torii API должна предоставлять `/openapi.json`.
- Тестирование браузера требует CORS, чтобы разрешить этот источник документов.
- Браузер должен иметь возможность напрямую обращаться к конечной точке API.
- Генерация кода требует Node.js, pnpm и среды выполнения Java для OpenAPI генератора.

Консоль по умолчанию использует `https://taira.sora.org`. Локальная разработка обычно работает с `http://127.0.0.1:8080`, когда вы запускаете Torii на вашей машине.

## Попробуйте Taira сначала {#try-taira-first}

Перед созданием клиента убедитесь, что общедоступный документ OpenAPI доступен с вашего компьютера:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

Затем вставьте `https://taira.sora.org/openapi.json` в консоль и попробуйте маршрут только для чтения, такой как `GET /status`, `GET /v1/domains` или `GET /v1/assets/definitions`. Сохраняйте подписанные транзакции и потоки приватных ключей для клиента SDK или CLI, который загружает секреты из вашей среды выполнения программного обеспечения.

## Созданные клиенты {#generated-clients}

Команда генератора использует тот же живой документ OpenAPI, который загружает консоль. Это полезно для маршрутов оператора JSON, обозревателя, приложения и телеметрии.

Для подписанных транзакций реестра распределенного блокчейна, подписанных запросов и нативных полезных нагрузок Norito используйте официальный Iroha SDKs. Клиенты OpenAPI не собирают подписи, не управляют ключами учетных записей и не кодируют тела транзакций Norito за вас.

Чтобы проверить каждый генератор, поддерживаемый OpenAPI Generator, выполните:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
