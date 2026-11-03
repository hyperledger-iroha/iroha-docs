---
translation_locale: ba
translation_source: /cookbook/triggers.md
translation_source_hash: 946309958fe4e23a7454206b1eb4557f8e853171ce4e04d5373cb36f46b13970
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Ҡатҡандар {#triggers}

## Һөҙөмтә {#outcome}

Taira менән сикләнгән саҡырыу ҡуҙғатҡысын теркәгеҙ, уны бер тапҡыр башҡарғыҙ, Ҡулланылған тамамланыуын көтөгөҙ һәм блок тарихынан уның уңышлы үтәлеүен раҫлағыҙ.

## Шарттар {#prerequisites}

- [Taira-ға тоташыу](./connect-to-taira.md) битенән финансланған ҡул ҡуйыусы, `taira.client.toml` һәм `TAIRA_ACCOUNT_ID`. Яҙыуҙар `--fee-payer authority` ҡуллана; CLI ҡул ҡуйыр алдынан теүәл комиссияны Taira-ның түләү активында иҫәпләп күрһәтә.
- Taira өсөн ҡуҙғытыусы теркәлергә рөхсәт `TAIRA_ACCOUNT_ID` һәм һөҙөмтәле аккумулятор үтәй. `CanRegisterTrigger` күләмдә `authority` һәм `CanExecuteTrigger` күләмдә `trigger`.
- Әгәр был бирелгән рөхсәттәр юҡ икән, локаль селтәр һәм уның администратор клиентын файҙаланығыҙ. Шулай уҡ ҡуҙғытыусы хакимиәтенә ҡуҙғатыусының үтәйәсәк күрһәтмәләре буйынса бөтә рөхсәт кәрәк.

```bash
CONFIG=./taira.client.toml
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## Аҙымдар {#steps}

### 1. Инструкция ярҙамында ҡуҙғатҡысты теркәгеҙ. {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` `--emit-instructions` баҫтырған JSON инструкциялар массивын ҡабул итә. `tx ping` бер `Log` инструкцияһын сығара, һәм ул был миҫалды икенсе реестр объектының рөхсәттәренә түгел, ә ҡуҙғатҡыс авторизацияһына йүнәлтә.

```bash
iroha --config "$CONFIG" --emit-instructions \
  tx ping --log-level INFO --msg 'cookbook trigger executed' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    trigger register \
    --id "$TRIGGER_ID" \
    --instructions-stdin \
    --repeats 3 \
    --authority "$TAIRA_ACCOUNT_ID" \
    --filter execute
```

Ҡурсаусы иң күп өс тапҡыр эшләй ала. Уның раҫланған власы, уны үтәгән саҡырыусы түгел, ә хәрәкәттәге күрһәтмәләргә рөхсәт бирә.

### 2. Ҡотҡарылыу алдынан декларацияны тикшерегеҙ {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" trigger inspect "$TRIGGER_ID"
```

Тағы бер комиссия түләгәнсе I105 вәкәләтле иҫәбен, башҡарыу фильтрын, ҡалған ҡабатлауҙарҙы һәм `executable` эсендәге берҙән-бер кодланған инструкцияны раҫлағыҙ.

### 3. Ике ҡатламды ла үтәгеҙ һәм көтөгөҙ {#_3-execute-and-wait-for-both-layers}

Ғәмәлгә ашырыу транзакцияһы һәм ҡуҙғатыу хәрәкәте айырым иҫбатлауҙар бар. `--wait` ҡулланылған транзакция тамамланыуын көтә; `--trace` шулай уҡ үтәү ваҡыты диагностикаһы тураһында хәбәр итә.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  trigger execute \
  --wait \
  --trace \
  --timeout-ms 60000 \
  "$TRIGGER_ID"
```

Rust клиенттары шул уҡ ике типлы инструкцияны төҙөй. Бында `authority` — `AccountId`, ә `client` — шул иҫәп исеменән ҡул ҡуйған `iroha::blocking::Client`; `submit` Applied һуңғы торошона етеүен көтә:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};

let trigger_id: TriggerId = "cookbook_by_call_log".parse()?;
let action = Action::new(
    vec![Log::new(Level::INFO, "cookbook trigger executed".to_owned())],
    Repeats::Exactly(3),
    authority.clone(),
    ExecuteTriggerEventFilter::new()
        .for_trigger(trigger_id.clone())
        .under_authority(authority),
)?;
let fee = FeePaymentIntent::authority(Vec::new(), None);

client.submit(Register::trigger(Trigger::new(trigger_id.clone(), action)), fee.clone())?;
client.submit(ExecuteTrigger::new(trigger_id), fee)?;
```

## Тикшереү {#verify}

Блоктарҙы тулыландырыу өсөн тапшырылған блоктар тарихын сканерлағыҙ һәм декрементталған ҡабатлау һанын тикшерегеҙ:

```bash
iroha --config "$CONFIG" trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" trigger inspect "$TRIGGER_ID"
```

Кәм тигәндә бер тамамланыу уңыш тураһында хәбәр итергә тейеш. Trigger ике үтәлеше ҡалған килеш әүҙем булып ҡалырға тейеш. Trigger-ҙың уңышлы тамамланыуы булмаған уңышлы submission етерлек тикшереү түгел.

## Проблемаларҙы хәл итеү {#troubleshooting}

- Теркәү рөхсәт ителмәгән тип кире ҡаҡҡан, тимәк, ҡул ҡуйған кеше өсөн `CanRegisterTrigger` юҡ. Ҡулланыуға айырым тәғәйенләнгән `CanExecuteTrigger` токен талап ителә.
- Транзакция Ҡулланылғанға барып етергә мөмкин, ә ҡуҙғытыу акцияһы уңышһыҙлыҡ тураһында хәбәр итә. тамамлау һөҙөмтәһен һәм хатаны уҡығыҙ; һуңынан һәр ҡушылған инструкция өсөн ҡуҙғытыусы хакимиәтенең рөхсәттәре тикшерегеҙ.
- `Trigger with id … not found` теркәү транзакцияһы кире ҡағылған йәки башҡа Torii / сылбыр конфигурацияһын тормошҡа ашырыу өсөн ҡулланылған була.
- Ҡабатлауҙар нульгә еткәндә, тағы ла күберәк ҡабатлауҙар яһау - тағы бер өҫтөнлөклө яҙыу. Был рецептты бер туҡтауһыҙ ҡуҙғатырға ярамай.
- Тазалыҡ өсөн `trigger unregister --id "$TRIGGER_ID"` был аккумулятор өсөн `CanUnregisterTrigger` талап итә, өҫтәүенә түләүҙе һайлай.

## Сығанаҡ һәм уның менән бәйле документтар {#source-and-related-docs}

- [](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/triggers/by_call_trigger.rs) ҡуйылған commit-та ҡушымта ярҙамында интеграция һынауҙары
- [Кисә һәм ҡуҙғатыу интеграцияһы һынауҙар ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/events_and_triggers.rs)
- [Триггер инструкцияһын ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs) буйынса үтәү
- [Триггерҙар](/ba/blockchain/triggers.md)
- [Триггерҙар миҫалдары](/ba/blockchain/trigger-examples.md)
- [ваҡиғалар](./stream-events.md)
