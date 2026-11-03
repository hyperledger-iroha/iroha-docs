---
translation_locale: hy
translation_source: /cookbook/triggers.md
translation_source_hash: 946309958fe4e23a7454206b1eb4557f8e853171ce4e04d5373cb36f46b13970
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Գործադրիչներ {#triggers}

## Արդյունքը {#outcome}

Taira -ում գրանցեք վերջնական զանգի գործարկիչը, մեկ անգամ կատարեք այն, սպասեք կիրառված ավարտին եւ հաստատեք դրա հաջող ավարտը հաստատված բլոկի պատմությունից:

## Նախադրյալներ {#prerequisites}

- Ֆինանսավորված ստորագրող, `taira.client.toml` և `TAIRA_ACCOUNT_ID`՝ [Միացում Taira-ին](./connect-to-taira.md) էջից։ Գրառումներն օգտագործում են `--fee-payer authority`; CLI-ն ստորագրելուց առաջ ստանում է ճշգրիտ վճարային առաջարկ Taira-ի վճարային ակտիվով։
- Taira թույլտվությունը գրանցել `TAIRA_ACCOUNT_ID` գործարկիչը եւ իրականացնել արդյունքում առաջացած գործարկիչ: համապատասխան տոքերները `CanRegisterTrigger` են, որոնք ընդգրկված են `authority` եւ `CanExecuteTrigger`՝ `trigger`:
- Եթե այդ թույլտվությունները հասանելի չեն, օգտագործեք ստեղծված տեղական ցանցը և դրա ադմինիստրատոր հաճախորդը։ Trigger-ի իրավասությունը պետք է ներառի նաև իր կատարած հրահանգների պահանջած բոլոր թույլտվությունները։

```bash
CONFIG=./taira.client.toml
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## Քայլեր {#steps}

### 1. Գրանցեք հրահանգներով ապահովված սթրիկատոր {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin`-ն ընդունում է JSON հրահանգների զանգվածը, որը տպում է `--emit-instructions`-ը։ `tx ping`-ը ստեղծում է մեկ `Log` հրահանգ, ինչը այս օրինակը կենտրոնացնում է գործարկիչի լիազորման վրա, այլ ոչ թե ռեեստրի երկրորդ օբյեկտի թույլտվությունների։

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

Գործարկիչը կարող է գործել առավելագույնս երեք անգամ: Նրա հայտարարված լիազորությունը, եւ ոչ թե զանգահարողը, որը պատահաբար կատարում է այն, թույլատրում է գործողության մեջ գտնվող հրահանգները:

### 2. Գործադրելուց առաջ ստուգեք հայտարարությունը {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" trigger inspect "$TRIGGER_ID"
```

Մեկ այլ վճար ծախսելուց առաջ հաստատեք I105 լիազոր հաշիվը, կատարման ֆիլտրը, մնացած կրկնությունները և `executable`-ում կոդավորված միակ հրահանգը։

### 3. Կատարեք եւ սպասեք երկու շերտերի: {#_3-execute-and-wait-for-both-layers}

Գործադրման գործարքը եւ գործարկման գործողությունը ունեն տարբեր ապացույցներ: `--wait` սպասում է կիրառվող գործարքի վերջնականությանը; `--trace`-ը նաեւ հայտնում է վազման ավարտի ախտորոշման մասին:

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  trigger execute \
  --wait \
  --trace \
  --timeout-ms 60000 \
  "$TRIGGER_ID"
```

Rust հաճախորդները կառուցում են նույն երկու տիպավորված հրահանգները։ Այստեղ `authority`-ն `AccountId` է, իսկ `client`-ը `iroha::blocking::Client` է, որը ստորագրում է որպես այդ հաշիվը; `submit`-ը սպասում է Applied վերջնականությանը:

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

## Փորձարկել {#verify}

Ստուգեք կատարված բլոկի պատմությունը ավարտելու համար եւ ստուգեք կրկնօրինակների նվազեցված թիվը.

```bash
iroha --config "$CONFIG" trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" trigger inspect "$TRIGGER_ID"
```

Առնվազն մեկ ավարտը պետք է հաղորդի հաջողության մասին: Գործադրիչը պետք է ակտիվ մնա երկու կատարման հետ: Հաջողակ ներկայացումը առանց հաջողված գործադրիչի ավարտի բավարար չէ ստուգում.

## Խնդիրների լուծում {#troubleshooting}

- Անթույլատրված գրանցումը նշանակում է, որ ստորագրողին բացակայում է `CanRegisterTrigger` հայտարարված լիազոր հաշվի համար: Գործարկման համար անհրաժեշտ է առանձին շրջանակով սահմանված `CanExecuteTrigger` տոքերը.
- Գործարքը կարող է հասնել Applied- ին, մինչ գործարկող գործողությունը հաղորդում է ձախողման մասին: Կարդացեք ավարտի արդյունքը եւ սխալը. ապա ստուգեք գործարկողի լիազոր հաշվի թույլտվությունները յուրաքանչյուր ներկառուցված հրահանգի համար:
- `Trigger with id … not found`-ը կարող է նշանակել, որ գրանցման գործարքը մերժվել է կամ իրականացման համար օգտագործվել է այլ Torii/շղթանային կարգավորում:
- Երբ կրկնությունը հասնում է զրոյին, ավելի շատ կրկնություններ պատրաստելը եւս մեկ առանձնահատկություն է գրելու համար: Մի արմատապես փոխեք այս բաղադրատոմսը անսահմանափակ դահլիճով:
- Մաքրման համար `trigger unregister --id "$TRIGGER_ID"` պահանջում է `CanUnregisterTrigger` այդ գործարկիչի եւ բացարձակ վճարային ընտրության համար:

## Աղբյուրը եւ դրա հետ կապված փաստաթղթերը {#source-and-related-docs}

- [Բաժանորդագրված զանգի հետ կապված ներգրավման փորձարկումները փակված commit-ում ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/triggers/by_call_trigger.rs)
- [Հանդիպման եւ գործարկման ինտեգրման փորձարկումները փակված commit-ում](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/events_and_triggers.rs)
- [Trigger- ի հրահանգների կատարումը փակված commit- ում ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [Գործարկիչներ](/hy/blockchain/triggers.md)
- [Աջնորդների օրինակներ](/hy/blockchain/trigger-examples.md)
- [Տեղեկատվություն](./stream-events.md)
