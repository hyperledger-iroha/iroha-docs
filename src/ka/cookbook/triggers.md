---
translation_locale: ka
translation_source: /cookbook/triggers.md
translation_source_hash: 93080591f5171c7ce25173eb1ef826d6f5ca661a17797be53e90aedab33ed0c3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# მატარებლები {#triggers}

## შედეგები {#outcome}

დარეგისტრირეთ შეზღუდული ბლოკის გამოწვევა Taira, განახორციელეთ იგი ერთხელ, ველოდოთ გამოყენებული საბოლოო დადასტურებას მისი წარმატებით დასრულების შესახებ ჩაბარებული ბლოკის ისტორიიდან.

## წინაპირობები {#prerequisites}

- დაფინანსებული ხელმოწერილი, `taira.client.toml`, `taira.tx-metadata.json` და `TAIRA_ACCOUNT_ID` [დაკავშირდით Taira](./connect-to-taira.md).
- Taira ნებართვა, რომ დარეგისტრირდეს გამშვები ღილაკი `TAIRA_ACCOUNT_ID` და განახორციელოს შედეგად მომავალი გამშვები. შესაბამისი ჯოკენები არის `CanRegisterTrigger` გათვალისწინებული `authority` და `CanExecuteTrigger` გათვალისწინებულია `trigger`.
- თუ ეს გრანტები არ არის ხელმისაწვდომი, გამოიყენეთ გენერირებული ადგილობრივი ქსელი და მისი ადმინისტრატორი კლიენტი. გამშვები ორგანოს ასევე სჭირდება ყველა ნებართვა, რომელიც მოითხოვს ინსტრუქციებს, რომელსაც გამშვები აწარმოებს

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## ნაბიჯები {#steps}

### 1. დარეგისტრირეთ ინსტრუქციით დამყარებული გამშვები ღილაკი {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` იღებს JSON ინსტრუქციების მასაჟს. `Log` ინსტრუქცია ამ მაგალითზე ორიენტირებულია ტრიგერის ავტორიზაციაზე და არა მეორე ლიდერის ობიექტის ნებართვებზე.

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

მისი დეკლარირებული ავტორიტეტი, და არა დამრეკელი რომელიც შემთხვევით განახორციელებს მას, ავტორიზაციას ინსტრუქციები შიგნით მოქმედება.

### 2. განცხადების შესრულებამდე შეამოწმეთ {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

დაადასტურეთ I105 უფლებამოსილება, შესრულების ფილტრი, დარჩენილი გამეორებები და ერთიანი `Log` ინსტრუქცია, სანამ სხვა გადასახადი დაიხარჯავთ.

### 3. შეასრულეთ და ელოდოთ ორივე ფენაზე {#_3-execute-and-wait-for-both-layers}

აღსრულების ტრანზაქცია და საგამოძრავებელი მოქმედება ცალკე მტკიცებულებებს შეიცავს. `--wait` ელოდება გამოყენებული ტრანზაკციის საბოლოო განხორციელებას; `--trace` აგრეთვე იუწყება მუშაობის დასრულების დიაგნოსტიკას.

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

Rust კლიენტები ქმნიან იმავე ორ ტიპირებულ ინსტრუქციას. აქ `authority` არის `AccountId` და `client` ნიშნები, როგორც ეს ანგარიში:

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

## შემოწმება {#verify}

შეამოწმეთ ჩაბარებული ბლოკების ისტორია და შეამოწმოთ განმეორების რაოდენობა:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

მინიმუმ ერთი დასრულება უნდა გამოხატოს წარმატების შესახებ. ტრიგერი უნდა დარჩეს აქტიური ორი შესრულების შემდეგ. წარმატებული წარდგენა წარმატებული ტრიგერის დასრულების გარეშე არ არის საკმარისი შემოწმება.

## პრობლემების აღმოფხვრა {#troubleshooting}

- რეგისტრაციის უარყოფა, რადგან არ არის დასაშვები ნიშნავს, რომ ხელმომწერს დეკლარირებული ორგანოსთვის `CanRegisterTrigger` აკლია. აღსრულებისთვის საჭიროა ცალკე განსაზღვრული `CanExecuteTrigger` ტოქონი.
- ტრანზაქცია შეიძლება მიაღწიოს Applied მაშინ, როდესაც trigger მოქმედება იუწყება წარუმატებლობა. წაიკითხეთ დასრულების შედეგი და შეცდომა; შემდეგ შეამოწმეთ trigger ავტორიტეტის ნებართვები თითოეული ჩასმული ინსტრუქციისათვის .
- `trigger not found` შეიძლება ნიშნავდეს რეგისტრაციის ტრანზაქციის უარყოფას ან განხორციელებისათვის გამოყენებულ იქნა განსხვავებული Torii/ბმულიანი კონფიგურაცია.
- თუ რეცეპტი ნულოვანს მიაღწევს, კიდევ ერთი პრივილეგიული წერილი არის უფრო მეტი განმეორება. ნუ შეცვლით ამ რეცეპტს უვადოდ.
- გაწმენდის მიზნით, `ledger trigger unregister --id "$TRIGGER_ID"` ითხოვს `CanUnregisterTrigger` აღნიშნული მატჩისთვის და კონკრეტული საფასურის შერჩევისთვის.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [ჩაკეტილი კომიტეტზე ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/triggers/by_call_trigger.rs) დაწვრილებით მოწოდების გამოწვეული ინტეგრაციის ტესტები
- [მოვლენებისა და გამომწვევი ინტეგრაციის ტესტები ჩაკეტილ კომიტეტზე](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/events_and_triggers.rs)
- [ტრიგერის ინსტრუქციის შესრულება ჩაკეტილი commit-ზე](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [ტრიგერები](/ka/blockchain/triggers.md)
- [ტრიგერების მაგალითები](/ka/blockchain/trigger-examples.md)
- [მოვლენები](./stream-events.md)
