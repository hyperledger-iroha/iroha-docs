---
translation_locale: ba
translation_source: /blockchain/events.md
translation_source_hash: 2777cbe4e72a50c4790e50b59c3e695feb5814314cc9afccdfd994f6409c195e
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-supplemental-naming-link+reviewed-delta
---
# Ваҡиғалар {#events}

Ваҡиғалар блокчейн эсендә билдәле бер ваҡиғалар булғанда ебәрелә, мәҫәлән, яңы иҫәп яҙмаһы булдырыла йәки блоктар ҡуйыла.

- трубопровод ваҡиғалары
- мәғлүмәт ваҡиғалары
- ваҡыт ваҡиғалары
- башҡарған ваҡиғаларҙы ҡуҙғатыу

## Төҙөүсе pipelineлар {#pipeline-events}

Транзакциялар һәм блоктар эшкәртеү конвейеры буйлап хәрәкәт иткәндә конвейер ваҡиғалары сығарыла. Транзакция ваҡиғаһы транзакция хешын, блок бейеклеген, һыҙат һәм мәғлүмәт киңлеге идентификаторҙарын һәм статусты йөрөтә: `Queued`, `Expired`, `Approved` йәки кире ҡағыу сәбәбе менән `Rejected`. Блок ваҡиғаһы блок башлығын һәм статусты йөрөтә: `Created`, `Approved`, сәбәбе менән `Rejected`, `Committed` йәки `Applied`.

### Taira менән һынап ҡарағыҙ. {#try-it-on-taira}

Йәмәғәт pipeline ваҡиға ағымы ҡуйылғанлығын тикшерегеҙ:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

Stream-ды асыҡ тотмайынса тикшереп була торған snapshot өсөн recent explorer transactions-ты уҡығыҙ:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?limit=5' \
  | jq '{next_cursor, txs: [.items[] | {hash, block, status, executable}]}'
```

SSE маршрутын терминалда асығыҙ, әгәр һеҙгә тура ваҡиғалар кәрәк:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

Әгәр ағым асыҡ булған ваҡытта бер ниндәй ҙә транзакция тапшырылмай икән, маршрут сәләмәт булһа ла, команда шым ғына ҡала ала.

## Мәғлүмәт ваҡиғалары {#data-events}

Мәғлүмәт ваҡиғалары реестр мәғлүмәттәре үҙгәргәндә сығарыла: селтәр төйөндәре, домендар, иҫәптәр, активтар, актив билдәләмәләре, NFTs, триггерҙар, ролдәр, сылбырҙағы көйләүҙәр, башҡарыусы торошо, дәлилдәр, йәшерен активтар, күперҙәр йәки SORA Nexus өсөн махсус объекттар. Бындай ваҡиғалар [мәғлүмәт ваҡиғалары фильтрҙарында](./filters.md#data-event-filters) ҡулланыла.

## Ваҡытлы ваҡиғалар {#time-events}

Ваҡыт ваҡиғалары донъя хәле күренеше [ ваҡыт ҡуҙғытыусыларын](./triggers.md#time-triggers) эшкәртергә әҙер булғанда сығарыла.

## Үтә торған ваҡиғалар {#trigger-execution-events}

[`ExecuteTrigger`](./instructions.md#executetrigger) инструкцияһы үтәлгәс, ҡуҙғатыуҙы башҡарыу ваҡиғалары ебәрелә. Трижерҙы тамамлау ваҡиғалары ҡуҙғатҡыс хәрәкәте тамамланғандан һуң сығара.
