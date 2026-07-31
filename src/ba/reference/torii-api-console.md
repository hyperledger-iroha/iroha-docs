---
translation_locale: ba
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: nllb-200-ct2

aside: false
pageClass: torii-api-console-page
---

# Torii API Консоль {#torii-api-console}

Теүәл ҡулланыу OpenAPI эшләнгән документтан Torii маршруттарҙы тикшереү өсөн һуңғы пункт, һынау һорауҙарын ебәреү, күсермә curl командалар, һәм клиент кодын булдырыу.

<ToriiApiConsole />

## Талаптар {#requirements}

- Torii йомғаҡлау пунктында `/openapi.json` күрһәтергә тейеш.
- Был документтарҙың килеп сығыуын рөхсәт итеү өсөн браузер һынауы CORS талап итә.
- Браузерға туранан-тура һуңғы нөктәгә барып етергә кәрәк.
- Код генерацияһы талап итә Node.js, pnpm, һәм Java өсөн эш ваҡыты OpenAPI Генератор.

Консоль ҡалып буйынса `https://taira.sora.org`. Урындағы үҫеш, ғәҙәттә, `http://127.0.0.1:8080` йүгергәндә Torii һеҙҙең машинаһында.

## Тәүҙә Taira {#try-taira-first}

Клиентты барлыҡҡа килтерер алдынан асыҡ OpenAPI документына машинағыҙҙан барып етәме, юҡмы икәнен тикшерегеҙ:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

Һуңынан йәбештерегеҙ `https://taira.sora.org/openapi.json` консольға инеү һәм уҡырға ғына маршрутты һынап ҡара: `GET /status`, `GET /v1/domains`, йәки `GET /v1/assets/definitions`. Ҡул ҡуйылған транзакция һәм шәхси асҡыс ағымдарын һаҡларға SDK йәки CLI Ваҡыт эсендә булған мөхитегеҙҙең серҙәрен йөкләгән клиент.

## Ҡулланыусылар барлыҡҡа килә {#generated-clients}

Генератор командаһы консоль йөкләгән тере OpenAPI документын ҡуллана. был JSON операторы, Explorer, ҡушымта һәм телеметрия маршруттары өсөн файҙалы.

Ҡул ҡуйылған операциялар өсөн, ҡул ҡуйылған һорауҙар һәм Norito- урындағы файҙалы йөкләмәләр, рәсми хеҙмәткә өҫтөнлөк биреү Iroha SDKs. OpenAPI клиенттар ҡултамғалар йыя алмай, иҫәп-хисап асҡыстары менән идара итмәй һәм кодламай Norito һеҙҙең өсөн транзакция органдары.

OpenAPI генераторы менән тәьмин ителгән һәр генераторҙы тикшереү өсөн түбәндәгеләрҙе эшләй:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
