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

Маршруттарды тексеру, сынақ сұрауларын жіберу, curl командаларды көшіру және клиент кодын құру үшін Torii аяқтық нүктеден тікелей OpenAPI құжатын қолданыңыз.

<ToriiApiConsole />

## Талаптар {#requirements}

- Torii аяқтық нүктесі `/openapi.json` белгісін көрсетуі тиіс.
- Браузерді сынау үшін CORS осы құжаттың шығу тегіне рұқсат беру қажет.
- Браузер тікелей соңғы нүктеге жетуге қабілетті болуы тиіс.
- Код генерациясы Node.js, pnpm және OpenAPI генераторы үшін Java орындау уақытын қажет етеді.

Консоль әдетті түрде `https://taira.sora.org`. Жергiлiктi даму, әдетте, сіздің машинаңызда Torii орындалған кезде `http://127.0.0.1:8080`мен жұмыс істейді.

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

Қол қойылған кітапшадағы мәмілелер, қол қойылған сұраулар және Norito-тамырланған пайдалы жүктемелер үшін ресми Iroha SDKs артықшылығын білдіреді. OpenAPI клиенттері қолтаңбаларды жинамайды, шот кілттерін басқармайды немесе сіз үшін Norito мәміле органдарын кодтай алмайды.

OpenAPI генераторымен қамтамасыз етілген әрбір генераторды тексеру үшін келесіден өту керек:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
