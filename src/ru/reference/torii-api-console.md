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

Используйте живый OpenAPI документ из запускающегося конечного пункта Torii для проверки маршрутов, отправки тестовых запросов, копирования команд curl и генерации клиента.

<ToriiApiConsole />

## Требования {#requirements}

- Конечный пункт Torii должен раскрывать `/openapi.json`.
- Проверка браузера требует CORS для того, чтобы разрешить происхождение этого документа.
- Браузер должен быть в состоянии непосредственно достичь конечного пункта.
- Создание кода требует Node.js, pnpm, и Java runtime для генератора OpenAPI.

Консоль по умолчанию `https://taira.sora.org`. Локальная разработка обычно работает с `http://127.0.0.1:8080`, когда вы запускаете Torii на вашем компьютере.

## Сначала попробуй Taira {#try-taira-first}

Прежде чем создавать клиент, проверьте, доступен ли публичный документ OpenAPI с вашего компьютера:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

Затем вставьте. `https://taira.sora.org/openapi.json` в консоль и попробуйте маршрут для чтения только, например: `GET /status`, `GET /v1/domains`, или `GET /v1/assets/definitions`. Сохранить подписанные транзакции и потоки частного ключа на SDK или CLI Клиент, который загружает секреты из вашей среды.

## Создание клиентов {#generated-clients}

В команде генератора используется тот же живый OpenAPI документ, который загружает консоль. Это полезно для оператора, исследователя, приложения и путей телеметрии JSON.

Для подписанных сделок в регистре, подписанных запросов и Norito- местные полезные нагрузки, предпочитают официальные Iroha SDKs. OpenAPI клиенты не собирают подписи, не управляют ключами от аккаунтов или не кодируют Norito Транзакционные органы для вас.

Для проверки каждого генератора, поддерживаемого генератором OpenAPI, запустить:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
