---
translation_locale: ka
translation_source: /cookbook/triggers.md
translation_source_hash: 5267fb9bb232d52d9df4bedee414d745ccc30dd52cbc30993df3c5b975a0bc38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# მატარებლები {#triggers}

## შედეგები {#outcome}

დარეგისტრირეთ შეზღუდული ტექნიკური ბლოკის გამოძახების ტრიგერი ღილაკი Taira, განახორციელეთ იგი ერთხელ, დაელოდეთ გამოყენებული საბოლოო დადასტურებას და დაამტკიცეთ მისი წარმატებით დასრულება საბოლოო ბლოკის ისტორიიდან.

## წინაპირობები {#prerequisites}

- დაფინანსებული კრიპტოგრაფიული ხელმოწერა, `taira.client.toml`, `taira.tx-metadata.json` და `TAIRA_ACCOUNT_ID` [გაერთიანება Taira](./connect-to-taira.md).
- Taira ნებართვა, რომ დარეგისტრირდეს გამშვები ღილაკი `TAIRA_ACCOUNT_ID` და განახორციელოს შედეგად მომავალი გამშვები. შესაბამისი ჯოკენები არის `CanRegisterTrigger` გათვალისწინებული `authority` და `CanExecuteTrigger` გათვალისწინებულია `trigger`.
- თუ ეს თანხები არ არის ხელმისაწვდომი, გამოიყენეთ გენერირებული ადგილობრივი ქსელი და მისი ადმინისტრატორი კლიენტი. ტრიგერის ავტორიზაციის პრინციპს ასევე სჭირდება ყველა ნებართვა, რომელიც საჭიროა ინსტრუქციების შესრულებით ტრიგერი.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## ნაბიჯები {#steps}

### 1. დარეგისტრირეთ ინსტრუქციით დამყარებული გამშვები ღილაკი {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` იღებს JSON ინსტრუქციების მასაჟს. `Log` ინსტრუქცია ამ მაგალითზე ორიენტირებულია ტრიგერის ავტორიზაციაზე და არა მეორე ბლოკჩეინის რეესტრის ობიექტის ნებართვებზე.

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

მისი დეკლარირებული ავტორიზაციის ხელმძღვანელი, და არა მოთხოვნის კლიენტი, რომელიც შემთხვევით განახორციელებს მას, ავტორიზაციას ინსტრუქციები შიგნით ქმედება.

### 2. განცხადების შესრულებამდე შეამოწმეთ {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

დაადასტურეთ I105 ავტორიზაციის პრინციპი, შესრულების ფილტრი, დარჩენილი გამეორებები და ერთიანი `Log` ინსტრუქცია, სანამ სხვა გადასახადი დაიხარჯავთ.

### 3. შეასრულეთ და ელოდოთ ორივე ფენაზე {#_3-execute-and-wait-for-both-layers}

აღსრულების ტრანზაქცია და საგამოძრავებელი მოქმედება აქვს განსხვავებული მტკიცებულებები. `--wait` ელოდება გამოყენებული ტრანზაკციის საბოლოო განხორციელებას; `--trace` ასევე ანგარიშობს შესრულების გარემოს დასრულების დიაგნოსტიკას.

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

დასრულების საპოვნელად საბოლოო ბლოკების ისტორია დაასკანერეთ და განმეორების შემცირებული რაოდენობა შეამოწმეთ:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

მინიმუმ ერთი დასრულება უნდა გამოხატოს წარმატების შესახებ. ტრიგერი უნდა დარჩეს აქტიური ორი შესრულების შემდეგ. წარმატებული წარდგენა წარმატებული ტრიგერის დასრულების გარეშე არ არის საკმარისი შემოწმება.

## პრობლემების აღმოფხვრა {#troubleshooting}

- რეგისტრაციის უარყოფა არ არის ნებადართული ნიშნავს, რომ კრიპტოგრაფიულ ხელმოწერას არ აქვს `CanRegisterTrigger` დეკლარირებული ავტორიზაციის პრინციპისათვის. შესრულებისთვის საჭიროა ცალკე განსაზღვრული `CanExecuteTrigger` ტოქენი.
- ტრანზაქცია შეიძლება მიაღწიოს Applied მაშინ, როდესაც ტრიგერი მოქმედება იუწყება წარუმატებლობა. წაიკითხეთ დასრულების შედეგი და შეცდომა; შემდეგ შეამოწმეთ ტრიგერი ავტორიზაციის ხელმძღვანელის ნებართვები თითოეული ჩასმული ინსტრუქციისათვის .
- `trigger not found` შეიძლება ნიშნავდეს რეგისტრაციის ტრანზაქციის უარყოფას ან განხორციელებისათვის გამოყენებულ იქნა განსხვავებული Torii/ბმულიანი კონფიგურაცია.
- როდესაც გამეორებების რაოდენობა ნულს მიაღწევს, დამატებითი გამეორებების მინიჭება კიდევ ერთი პრივილეგირებული ჩაწერის ოპერაციაა. ეს რეცეპტი შეუმჩნევლად არ გადააკეთოთ განუსაზღვრელი რაოდენობის გამეორების მქონე ტრიგერად.
- გაწმენდის მიზნით, `ledger trigger unregister --id "$TRIGGER_ID"` ითხოვს `CanUnregisterTrigger` აღნიშნული მატჩისთვის და კონკრეტული საფასურის შერჩევისთვის.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [ტექნიკური გამოძახების ტრიგერი ინტეგრაციის ტესტები ჩაკეტილი წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/triggers/by_call_trigger.rs)
- [ღონისძიების და განძრავების ინტეგრაციის ტესტები ჩაკეტილი წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events_and_triggers.rs)
- [გამოშვების ინსტრუქციის შესრულება ჩაკეტილი წყარო კოდის რევიზიის დროს](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [გამამოწვევები](/ka/blockchain/triggers.md)
- [ტრიგერების მაგალითები](/ka/blockchain/trigger-examples.md)
- [მოვლენები](./stream-events.md)
