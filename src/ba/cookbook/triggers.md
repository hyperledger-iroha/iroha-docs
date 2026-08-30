---
translation_locale: ba
translation_source: /cookbook/triggers.md
translation_source_hash: 6c8f436b5a41cf41c0ac37aeed6b6cd8c73009cfcca2fe7f5642cef1ad115e6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ҡатҡандар {#triggers}

## Һөҙөмтә {#outcome}

Taira менән сикләнгән саҡырыу ҡуҙғатҡысын теркәгеҙ, уны бер тапҡыр башҡарғыҙ, Ҡулланылған тамамланыуын көтөгөҙ һәм блок тарихынан уның уңышлы үтәлеүен раҫлағыҙ.

## Шарттар {#prerequisites}

- Яҡшылыҡ күрһәтеүсе, `taira.client.toml`, `taira.tx-metadata.json`, һәм `TAIRA_ACCOUNT_ID` от [Ҡатнашыу Taira](./connect-to-taira.md).
- Taira өсөн ҡуҙғытыусы теркәлергә рөхсәт `TAIRA_ACCOUNT_ID` һәм һөҙөмтәле аккумулятор үтәй. `CanRegisterTrigger` күләмдә `authority` һәм `CanExecuteTrigger` күләмдә `trigger`.
- Әгәр был гранттар юҡ икән, локаль селтәр һәм уның администратор клиентын файҙаланығыҙ. Шулай уҡ ҡуҙғытыусы хакимиәтенә ҡуҙғатыусының үтәйәсәк күрһәтмәләре буйынса бөтә рөхсәт кәрәк.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## Аҙымдар {#steps}

### 1. Инструкция ярҙамында ҡуҙғатҡысты теркәгеҙ. {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` JSON инструкциялар массивын ҡабул итә. `Log` инструкцияһы был миҫалды икенсе бухгалтер объектының рөхсәттәренә түгел, ә ҡуҙғатҡыс рөхсәтенә йүнәлтә.

```bash
printf '%s\n' \
  '[{"Log":{"level":"INFO","message":"cookbook trigger executed"}}]' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger trigger register \
    --id "$TRIGGER_ID" \
    --instructions-stdin \
    --repeats 3 \
    --authority "$TAIRA_ACCOUNT_ID" \
    --filter execute
```

Ҡурсаусы иң күп өс тапҡыр эшләй ала. Уның раҫланған власы, уны үтәгән шылтыратыусы түгел, ә хәрәкәттәге күрһәтмәләргә рөхсәт бирә.

### 2. Ҡотҡарылыу алдынан декларацияны тикшерегеҙ {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

I105 хоҡуғын, башҡарыу фильтрын, ҡалған ҡабатлауҙарҙы һәм `Log` бер генә күрһәтмәһен раҫлағыҙ, икенсе түләүҙе түләмәйенсә.

### 3. Ике ҡатламды ла үтәгеҙ һәм көтөгөҙ {#_3-execute-and-wait-for-both-layers}

Ғәмәлгә ашырыу транзакцияһы һәм ҡуҙғатыу хәрәкәте айырым иҫбатлауҙар бар. `--wait` ҡулланылған транзакция тамамланыуын көтә; `--trace` шулай уҡ үтәү ваҡыты диагностикаһы тураһында хәбәр итә.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger trigger execute \
  --wait \
  --trace \
  --timeout-ms 60000 \
  "$TRIGGER_ID"
```

Rust клиенттары шул уҡ ике типтағы инструкциялар төҙөй. Бында `authority` был иҫәбенә `AccountId` һәм `client` билдәләре:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};

let trigger_id: TriggerId = "cookbook_by_call_log".parse()?;
let action = Action::new(
    vec![Log::new(Level::INFO, "cookbook trigger executed".to_owned()).into()],
    Repeats::Exactly(3),
    authority.clone(),
    ExecuteTriggerEventFilter::new()
        .for_trigger(trigger_id.clone())
        .under_authority(authority),
);
let fee = FeePaymentIntent::authority(Vec::new(), None);

client.submit_blocking(Register::trigger(Trigger::new(trigger_id.clone(), action)), fee.clone())?;
client.submit_blocking(ExecuteTrigger::new(trigger_id), fee)?;
```

## Тикшереү {#verify}

Блоктарҙы тулыландырыу өсөн тапшырылған блоктар тарихын сканерлағыҙ һәм декрементталған ҡабатлау һанын тикшерегеҙ:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Һәр хәлдә, бер тамамланыу уңышлы булырға тейеш. Ҡойоштороусы ике тапҡыр язалап үлтерелгәндән һуң да әүҙем булырға тейеш. Уңышлы тапшырыу, уңышлы ҡуҙғатыу тамамланмайынса, етерлек тикшереү түгел.

## Проблемаларҙы хәл итеү {#troubleshooting}

- Теркәү рөхсәт ителмәгән тип кире ҡаҡҡан, тимәк, ҡул ҡуйған кеше өсөн `CanRegisterTrigger` юҡ. Ҡулланыуға айырым тәғәйенләнгән `CanExecuteTrigger` токен талап ителә.
- Транзакция Ҡулланылғанға барып етергә мөмкин, ә ҡуҙғытыу акцияһы уңышһыҙлыҡ тураһында хәбәр итә. тамамлау һөҙөмтәһен һәм хатаны уҡығыҙ; һуңынан һәр ҡушылған инструкция өсөн ҡуҙғытыусы хакимиәтенең рөхсәттәре тикшерегеҙ.
- `trigger not found` теркәү транзакцияһы кире ҡағылған йәки башҡа Torii / сылбыр конфигурацияһын тормошҡа ашырыу өсөн ҡулланылған була.
- Ҡабатлауҙар нульгә еткәндә, тағы ла күберәк ҡабатлауҙар яһау - тағы бер өҫтөнлөклө яҙыу. Был рецептты бер туҡтауһыҙ ҡуҙғатырға ярамай.
- Тазалыҡ өсөн `ledger trigger unregister --id "$TRIGGER_ID"` был аккумулятор өсөн `CanUnregisterTrigger` талап итә, өҫтәүенә түләүҙе һайлай.

## Сығанаҡ һәм уның менән бәйле документтар {#source-and-related-docs}

- [](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/triggers/by_call_trigger.rs) ҡуйылған commit-та ҡушымта ярҙамында интеграция һынауҙары
- [Кисә һәм ҡуҙғатыу интеграцияһы һынауҙар ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events_and_triggers.rs)
- [Триггер инструкцияһын ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs) буйынса үтәү
- [Триггерҙар](/ba/blockchain/triggers.md)
- [Триггерҙар миҫалдары](/ba/blockchain/trigger-examples.md)
- [ваҡиғалар](./stream-events.md)
