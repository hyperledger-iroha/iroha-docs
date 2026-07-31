---
translation_locale: ru
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: nllb-200-ct2

aside: false
pageClass: torii-api-console-page
---

# Torii API Консоль {#torii-api-console}

Используйте живую OpenAPI документ из бегающего Torii конечный пункт для осмотра маршрутов,
отправлять запросы на испытания, копировать curl команды, и генерировать клиентский код.

<ToriiApiConsole />

## Требования {#requirements}

- Сборник Torii конечный пункт должен раскрыть `/openapi.json`.
- Проверка браузера требует CORS чтобы позволить этому документу происхождение.
- Браузер должен быть в состоянии достичь конечного пункта непосредственно.
- Создание кода требует Node.js, pnpm, и время запуска Java для OpenAPI
  Генератор.

Консоль по умолчанию `https://taira.sora.org`. Обычно местное развитие
работают с `http://127.0.0.1:8080` когда бегаешь Torii на машине.

## Попробуйте . Taira Сначала {#try-taira-first}

Прежде чем создать клиента, проверьте, что общественность OpenAPI Доступность документа
из вашей машины:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

Затем вставьте `https://taira.sora.org/openapi.json` в консоль и попробуйте
только для прочтения маршрут, например `GET /status`, `GET /v1/domains`, или
`GET /v1/assets/definitions`. Сохранить подписанные транзакции и потоки частного ключа
в) SDK или CLI Клиент, который загружает секреты из вашей среды.

## Создание клиентов {#generated-clients}

Командование генератора использует тот же живый OpenAPI Документ о том, что консоль
Это полезно для JSON оператор, исследователь, приложение и телеметрические маршруты.

Для подписанных сделок в регистре, подписанных запросов и Norito- местные полезные нагрузки,
предпочитаю официального Iroha SDKs. OpenAPI клиенты не собирают подписи,
управлять ключами учетной записи или кодировать Norito для вас транзакционные органы.

Для проверки каждого генератора, поддерживаемого OpenAPI Генератор, запускайте:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
