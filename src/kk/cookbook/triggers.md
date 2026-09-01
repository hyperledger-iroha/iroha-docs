---
translation_locale: kk
translation_source: /cookbook/triggers.md
translation_source_hash: 5267fb9bb232d52d9df4bedee414d745ccc30dd52cbc30993df3c5b975a0bc38
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Триггерлер {#triggers}

## Нәтиже {#outcome}

Taira мекенжайында техникалық шақыру триггерін тіркеп, оны бір рет орындаңыз, Қолданылған аяқталуды күтіңіз және соңғы блок тарихынан оның сәтті аяқталғанын растаңыз.

## Алдын ала шарттар {#prerequisites}

- Қаржыландырылған криптографиялық қолтаңба жасаушы, `taira.client.toml`, `taira.tx-metadata.json`, және `TAIRA_ACCOUNT_ID` [Taira құрылғысына қосылу](./connect-to-taira.md) мекенжайынан.
- Taira `TAIRA_ACCOUNT_ID` үшін триггерді тіркеуге және туындайтын триггерді орындауға рұқсат. Қатысты токендер `CanRegisterTrigger` `authority` аясында және `CanExecuteTrigger` `trigger` аясында орналасқан.
- Егер сол гранттар қолжетімсіз болса, жасалған жергілікті желіні және оның әкімші клиентін пайдаланыңыз. Триггерді рұқсаттандыру негізгі субъектісі сондай-ақ триггер орындайтын нұсқауларға қажетті барлық рұқсаттарды алуы керек.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## Қадамдар {#steps}

### 1. Нұсқаулыққа негізделген триггерді тіркеу {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` нұсқаулар массивін JSON қабылдайды. `Log` нұсқауы осы мысалды екінші блокчейн тізілімінің объектісінің рұқсаттары емес, триггер авторизациясына бағытталған етеді.

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

Триггер ең көп дегенде үш рет іске қосыла алады. Оның жарияланған рұқсат беруші субъектісі, оны орындайтын клиент емес, әрекет ішіндегі нұсқауларды бекітеді.

### 2. Орындаудан бұрын декларацияны тексеріңіз {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Қосымша төлем жұмсамас бұрын I105 авторизация қағидатын, орындау сүзгісін, қалған қайталаулар санын және бір рет қолданылатын `Log` нұсқауды растаныз.

### 3. Екеу қабатты орындап, күтіңіз {#_3-execute-and-wait-for-both-layers}

Орындау транзакциясы мен триггер әрекетінің айқын дәлелдері бар. `--wait` Қолданылған транзакцияның аяқталуын күтеді; `--trace` сондай-ақ бағдарламалық жасақтама орындау ортасының аяқталу диагностикасын хабарлайды.

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

Rust клиенттер бірдей екі типтегі нұсқаулар жасайды. Мұнда `authority` — бұл `AccountId`, ал `client` сол есептік жазбаға кірген:

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

## Растау {#verify}

Аяқталған блок тарихын толықтығын тексеру үшін сканерлеп, азайтылған қайталану санын қараңыз:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Кемінде бір аяқталу сәтті болуын хабарлауы тиіс. Триггер екі орындау қалғанда да белсенді қалуы керек. Триггердің сәтті аяқталуы болмаса, сәтті жіберу жеткілікті тексеру болып саналмайды.

## Ақауларды жою {#troubleshooting}

- Тіркеу рұқсат етілмеген ретінде қабылданды дегеніміз - криптографиялық қол қоюшы жарияланған авторизация өкілдігі үшін `CanRegisterTrigger` жоқ деген сөз. Орындау үшін бөлек шектелген `CanExecuteTrigger` токен қажет.
- Транзакция Тиiндiлендi деп көрсетілуі мүмкін, ал триггер әрекеті сәтсіздік туралы хабарлайды. Аяқталу нәтижесін және қатені оқыңыз; содан кейін әрбір кірістірілген нұсқау үшін триггер рұқсат иесінің құқықтарын тексеріңіз.
- `trigger not found` тіркеу транзакциясының қабылданбағанын немесе орындау үшін басқа Torii/тізбек конфигурациясының қолданылғанын білдіруі мүмкін.
- Қайталаулар нөлге жеткенде, қосымша қайталаулар шығару тағы бір артықшылықты жазу болып табылады. Осы рецептіні үндемей шексіз триггерге өзгертпеңіз.
- Тазалау үшін, `ledger trigger unregister --id "$TRIGGER_ID"` осы триггер үшін `CanUnregisterTrigger` қажет етеді және айқын төлемді таңдау керек.

## Дереккөз және қатысты құжаттар {#source-and-related-docs}

- [Техникалық шақыру арқылы интеграциялық тесттер бекітілген бастапқы код ревизиясында іске қосылады](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/triggers/by_call_trigger.rs)
- [Оқиға және триггер интеграциялық тестілері бекітілген бастапқы код нұсқасында](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events_and_triggers.rs)
- [Тұрақты бағдарламалық код нұсқасында нұсқаулық орындауын іске қосу](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [Триггерлер](/kk/blockchain/triggers.md)
- [Триггер мысалдары](/kk/blockchain/trigger-examples.md)
- [Оқиғалар](./stream-events.md)
