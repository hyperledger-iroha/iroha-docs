---
translation_locale: kk
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: bing-translator-llm

aside: false
pageClass: torii-api-console-page
---

# Torii API Консоль {#torii-api-console}

Бағдарламаланған Torii API соң нүктесінен тірі OpenAPI құжатын пайдаланып маршруттарды тексеру, тестілік сұранымдарды жіберу, curl командаларын көшіру және клиенттік кодты жасау.

<ToriiApiConsole />

## Талаптар {#requirements}

- Torii API соңғы нүктесі `/openapi.json` көрсетуі керек.
- Шолғышты тестілеу үшін CORS осы құжаттардың түпнұсқасына рұқсат беруі қажет.
- Браузер API соңғы нүктесіне тікелей қол жеткізе алуы қажет.
- Код жасау үшін Node.js, pnpm және OpenAPI Генераторы үшін Java бағдарламалық орындау ортасы қажет.

Консоль әдетте `https://taira.sora.org` ретінде орнатылады. Жергілікті дамыту кезінде әдетте сіздің машинада Torii іске қосқанда `http://127.0.0.1:8080` пайдаланылады.

## Алдымен Taira сынап көріңіз {#try-taira-first}

Клиентті жасамас бұрын, қоғамдық OpenAPI құжатқа сіздің компьютерден қол жеткізуге болатынын тексеріңіз:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

Содан кейін `https://taira.sora.org/openapi.json` кодын консольға қойып, тек оқу режиміндегі маршрутты пайдаланып көріңіз, мысалы, `GET /status`, `GET /v1/domains` немесе `GET /v1/assets/definitions`. Қол қойылған транзакциялар мен жеке кілт ағымдарын SDK немесе CLI клиенті үшін сақтаңыз, ол сіздің бағдарламалық орындалу ортаңыздан құпияларды жүктейді.

## Жасалған клиенттер {#generated-clients}

Генератор командасы консоль жүктейтін сол тікелей OpenAPI құжатты пайдаланады. Бұл JSON операторына, шолушыге, қолданбаға және телеметрия бағыттарына пайдалы.

Қол қойылған блокчейн жазбаларының транзакциялары, қол қойылған сұраулар және Norito-төлше payload үшін ресми Iroha SDKs пайдаланған жөн. OpenAPI клиенттері сіз үшін қол қойылғандарды жинамайды, есептік жазба кілттерін басқарып қоймайды немесе Norito транзакция денелерін кодтамайды.

Барлық OpenAPI Генераторымен қолдау көрсетілетін генераторларды тексеру үшін, іске қосыңыз:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
