---
translation_locale: kk
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: nllb-200-ct2

aside: false
pageClass: torii-api-console-page
---

# Torii API Консоль {#torii-api-console}

Тікелей қолдану OpenAPI жұмыс істеп тұрған құжат Torii маршруттарды тексеру, сынақ сұрауларын жіберу, көшірмелеу curl командалар, және клиент кодын шығарады.

<ToriiApiConsole />

## Талаптар {#requirements}

- Torii аяқтық нүктесі `/openapi.json` белгісін көрсетуі тиіс.
- Браузерді сынау үшін CORS осы құжаттың шығу тегіне рұқсат беру қажет.
- Браузер тікелей соңғы нүктеге жетуге қабілетті болуы тиіс.
- Код құруды талап етеді Node.js, pnpm, және Java Runtime үшін OpenAPI Генератор.

Консольде әдетті түрде `https://taira.sora.org`. Жергілікті даму, әдетте, `http://127.0.0.1:8080` жүгірген кезде Torii машинаңызда.

## Алдымен Taira сынаңыз. {#try-taira-first}

Клиентті құрудан бұрын, мемлекеттік OpenAPI құжатына машинаңыздан қол жетімді екендігін тексеріңіз:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

Содан кейін жапсырыңыз `https://taira.sora.org/openapi.json` консольге кіріп , тек оқуға арналған маршрутты сынаңыз: `GET /status`, `GET /v1/domains`, немесе `GET /v1/assets/definitions`. Қолтаңбаланған транзакциялар мен жеке кілті ағындарын SDK немесе CLI Клиент сіздің жұмыс уақытының сырларын жүктейді.

## Жаратылған клиенттер {#generated-clients}

Генератор командасы консоль жүктейтін тірі OpenAPI құжатты пайдаланады. Бұл JSON операторы, эксплуатант, қосымша және телеметрия бағыты үшін пайдалы.

Қол қойылған бухгалтерлік есептік жазба операциялары, қол қойылған сұрау салулар үшін және Norito- жергiлiктi пайдалы жүктер, ресми артықшылығы Iroha SDKs. OpenAPI клиенттер қолтаңбаларды жинамайды, тіркелгі кілттерін басқаруды немесе кодтауды жүзеге асырмайды Norito Сіз үшін транзакциялық органдар.

OpenAPI генераторымен қамтамасыз етілген әрбір генераторды тексеру үшін келесіден өту керек:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
