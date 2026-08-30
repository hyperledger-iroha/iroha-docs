---
translation_locale: kk
translation_source: /cookbook/triggers.md
translation_source_hash: 6c8f436b5a41cf41c0ac37aeed6b6cd8c73009cfcca2fe7f5642cef1ad115e6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Қозғалтқыштар {#triggers}

## Нәтижесі {#outcome}

Taira -да шекті қоңырауды іске қосуды тіркеңіз, оны бір рет орындаңыз, Қолданылған аяқталуды күтіңіз және блок тарихынан оның сәтті аяқталғандығын растаңыз.

## Алдын ала талаптар {#prerequisites}

- Қаржылық қолтаңбалаушы, `taira.client.toml`, `taira.tx-metadata.json`, және `TAIRA_ACCOUNT_ID` бойынша [Қосылу Taira](./connect-to-taira.md).
- Taira рұқсаты `TAIRA_ACCOUNT_ID` үшін триггерді тіркеуге және нәтижелі триггердi орындауға. Тиісті токендер `CanRegisterTrigger` `authority` және `CanExecuteTrigger` `trigger` ауқымымен анықталады.
- Егер бұл гранттар қолжетімді болмаса, құрылған жергілікті желі мен оның әкімші клиентін пайдаланыңыз. Қозғалтқыш өкілі сондай-ақ қозғалтқыш орындайтын нұсқаулардың барлық рұқсатын қажет етеді.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## Қадамдар {#steps}

### 1. Нұсқаулықпен қамтамасыз етілген триггерді тіркеңіз {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` нұсқаулардың JSON массивін қабылдайды. `Log` нұсқауы бұл мысалды екінші кітапша объектісінің рұқсаттарынан гөрі қозғаушы рұқсатқа бағытталған.

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

Тэггер ең көп дегенде үш рет жұмыс істей алады. Оның мәлімделген билігі, оны орындайтын шақырушы емес, іс-әрекеттің ішіндегі нұсқауларды рұқсат етеді.

### 2. Орындалу алдында декларацияны тексеру {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

I105 өкілеттігін, орындау сүзгісін, қалған қайталауларды және басқа да ақы төлеуден бұрын жалғыз `Log` нұсқаулықты растаңыз.

### 3. Екі қабатты орындау және күту. {#_3-execute-and-wait-for-both-layers}

Орындалу операциясы мен іске қосу іс-әрекетінің айрықша дәлелдері бар. `--wait` қолданылған операцияның аяқталуын күтеді; `--trace` сондай-ақ орындалу уақытын аяқтау диагностикасын хабарлайды.

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

Rust клиенттері бірдей екі түрлендіру нұсқауларын жасайды. Бұл жерде `authority` бұл шот ретінде `AccountId` және `client` белгілері:

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

## Тексеру {#verify}

Аяқтау үшін басталған блоктар тарихын сканерлеу және азайтылған қайталану санын тексеру:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Жоқ дегенде бір орындалу сәттілік туралы хабар беруі тиіс. Қозғалтқыш екі орындалу қалғанда белсенді болып қалуы керек. Сәтті тапсыру сәтті аяқталмай қалса, жеткілікті тексеру болмайды.

## Қиындықтарды шешу {#troubleshooting}

- Тіркеуден бас тарту рұқсат етілмегендіктен, қолтаңбалаушыға мәлімделген орган үшін `CanRegisterTrigger` жетіспейді дегенді білдіреді. Орындау үшін бөлек мақсатты `CanExecuteTrigger` белгісі қажет.
- Тапсырыс Апталғанға жетуі мүмкін, ал триггер әрекеті сәтсіздік туралы хабарлайды. Аяқтау нәтижесі мен қатесін оқыңыз; содан кейін әрбір кіріктірілген нұсқау үшін триггердің рұқсаттарын тексеріңіз.
- `trigger not found` - тіркеу операциясы қабылданбады немесе орындау үшін басқа Torii / тізбек конфигурациясы пайдаланылды дегенді білдіреді.
- Қайталаулар нөлге жеткенде, одан да көп қайталауларды салу - тағы бір артықшылықты жазу. Бұл рецептіңізді белгісіз уақытқа өзгертпеңіз.
- Тазалау үшін `ledger trigger unregister --id "$TRIGGER_ID"` бұл триггерге қосымша айқын алымды таңдау үшін `CanUnregisterTrigger` талап етеді.

## Бастапқы және осыған байланысты құжаттар {#source-and-related-docs}

- [Тіркелген commit-де ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/triggers/by_call_trigger.rs) қоңырау шақыру арқылы іске қосылған интеграциялық сынақтар
- [Тіркелген commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events_and_triggers.rs) кезінде іс-шара мен триггерлік интеграция сынақтары
- [Тіркелген commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)-де триггер нұсқауларын орындау
- [Қозғалтқыштар](/kk/blockchain/triggers.md)
- [Қозғалтқыш үлгілері](/kk/blockchain/trigger-examples.md)
- [оқиғалар](./stream-events.md)
