---
translation_locale: hy
translation_source: /cookbook/triggers.md
translation_source_hash: 6c8f436b5a41cf41c0ac37aeed6b6cd8c73009cfcca2fe7f5642cef1ad115e6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Գործադրիչներ {#triggers}

## Արդյունքը {#outcome}

Taira -ում գրանցեք վերջնական զանգի գործարկիչը, մեկ անգամ կատարեք այն, սպասեք կիրառված ավարտին եւ հաստատեք դրա հաջող ավարտը պարտավոր բլոկի պատմությունից:

## Նախադրյալներ {#prerequisites}

- ֆինանսավորված ստորագրող, `taira.client.toml`, `taira.tx-metadata.json`, եւ `TAIRA_ACCOUNT_ID` _ ից [Կապակցեք Taira](./connect-to-taira.md).
- Taira թույլտվությունը գրանցել `TAIRA_ACCOUNT_ID` գործարկիչը եւ իրականացնել արդյունքում առաջացած գործարկիչ: համապատասխան տոքերները `CanRegisterTrigger` են, որոնք ընդգրկված են `authority` եւ `CanExecuteTrigger`՝ `trigger`:
- Եթե այդ դրամաշնորհները հասանելի չեն, օգտագործեք ստեղծված տեղական ցանց եւ դրա կառավարիչ հաճախորդը: Աջնորդի իշխանությունը նաեւ պետք է ունենա բոլոր թույլտվությունները, որոնք պահանջվում են հրահանգների կողմից, որոնք գործարկում է աջնորդը:

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## Քայլեր {#steps}

### 1. Գրանցեք հրահանգներով ապահովված սթրիկատոր {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` ընդունում է հանձնարարականների JSON շարքը: A `Log` հրահանգը այս օրինակին կենտրոնացնում է մեկնարկային թույլտվության վրա, այլ ոչ թե երկրորդ գլխավոր գրքի օբյեկտի թույլտվությունների վրա:

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

Գործարկիչը կարող է գործել առավելագույնս երեք անգամ: Նրա հայտարարված լիազորությունը, եւ ոչ թե զանգահարողը, որը պատահաբար կատարում է այն, թույլատրում է գործողության մեջ գտնվող հրահանգները:

### 2. Գործադրելուց առաջ ստուգեք հայտարարությունը {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Հաստատեք I105 իշխանությունը, իրականացրեք ֆիլտրը, մնացած կրկնությունները եւ մեկ `Log` հրահանգը, նախքան լրացուցիչ վճար ծախսելը:

### 3. Կատարեք եւ սպասեք երկու շերտերի: {#_3-execute-and-wait-for-both-layers}

Գործադրման գործարքը եւ գործարկման գործողությունը ունեն տարբեր ապացույցներ: `--wait` սպասում է կիրառվող գործարքի վերջնականությանը; `--trace`-ը նաեւ հայտնում է վազման ավարտի ախտորոշման մասին:

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

Rust հաճախորդները կառուցում են նույն երկու տիպված հրահանգներ: Այստեղ `authority` է `AccountId` եւ `client` նշանների որպես այդ հաշիվը:

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

## Փորձարկել {#verify}

Ստուգեք կատարված բլոկի պատմությունը ավարտելու համար եւ ստուգեք կրկնօրինակների նվազեցված թիվը.

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Առնվազն մեկ ավարտը պետք է հաղորդի հաջողության մասին: Գործադրիչը պետք է ակտիվ մնա երկու կատարման հետ: Հաջողակ ներկայացումը առանց հաջողված գործադրիչի ավարտի բավարար չէ ստուգում.

## Խնդիրների լուծում {#troubleshooting}

- Անթույլատրված գրանցումը նշանակում է, որ ստորագրողին բացակայում է `CanRegisterTrigger` հայտարարված իշխանության համար: Գործարկման համար անհրաժեշտ է առանձին շրջանակով սահմանված `CanExecuteTrigger` տոքերը.
- Գործարքը կարող է հասնել Applied- ին, մինչ գործարկող գործողությունը հաղորդում է ձախողման մասին: Կարդացեք ավարտի արդյունքը եւ սխալը. ապա ստուգեք գործարկողի իշխանության թույլտվությունները յուրաքանչյուր ներկառուցված հրահանգի համար:
- `trigger not found`-ը կարող է նշանակել, որ գրանցման գործարքը մերժվել է կամ իրականացման համար օգտագործվել է այլ Torii/շղթանային կարգավորում:
- Երբ կրկնությունը հասնում է զրոյին, ավելի շատ կրկնություններ պատրաստելը եւս մեկ առանձնահատկություն է գրելու համար: Մի արմատապես փոխեք այս բաղադրատոմսը անսահմանափակ դահլիճով:
- Մաքրման համար `ledger trigger unregister --id "$TRIGGER_ID"` պահանջում է `CanUnregisterTrigger` այդ գործարկիչի եւ բացարձակ վճարային ընտրության համար:

## Աղբյուրը եւ դրա հետ կապված փաստաթղթերը {#source-and-related-docs}

- [Բաժանորդագրված զանգի հետ կապված ներգրավման փորձարկումները փակված հանձնաժողովում ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/triggers/by_call_trigger.rs)
- [Հանդիպման եւ գործարկման ինտեգրման փորձարկումները փակված հանձնաժողովում](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events_and_triggers.rs)
- [Trigger- ի հրահանգների կատարումը փակված commit- ում ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [Գործարկիչներ](/hy/blockchain/triggers.md)
- [Աջնորդների օրինակներ](/hy/blockchain/trigger-examples.md)
- [Տեղեկատվություն](./stream-events.md)
