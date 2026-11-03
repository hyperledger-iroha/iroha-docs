---
translation_locale: ka
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 40fe8b19344d8eff66b178dc8576e2e049fef50bd3212fbddc5c0d5f7f37fa03
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# ნებართვები და როლები {#permissions-and-roles}

## შედეგები {#outcome}

შექმენით როლი, რომელიც ერთ ანგარიშს აძლევს ნებართვას ერთი კონკრეტული ანგარიშის მეტამონაცემების განახლებაზე, დაუთმეთ მას დელეგატს, დაამტკიცეთ დელეგირებული წერა და აჩვენეთ შესაბამისი Rust მითითება.

## წინაპირობები {#prerequisites}

- დაფინანსებული Taira კლიენტი გვერდიდან [Taira-სთან დაკავშირება](./connect-to-taira.md).
- `TARGET_ACCOUNT` და `DELEGATE_ACCOUNT` განისაზღვრება ერთპიროვნული პროტოკოლური სტანდარტის I105 ანგარიშის ID-ებად.
- ხელმომწერ ანგარიშს უნდა ჰქონდეს `CanManageRoles` და უნდა შეეძლოს არეალით შეზღუდული ნებართვის დელეგირება: ის თავად არის `TARGET_ACCOUNT` ან ამ ანგარიშისთვის უკვე აქვს `CanModifyAccountMetadata`. Taira-ზე ეს ნებართვით დაცული ადმინისტრაციული ოპერაციაა. გენერირებული ლოკალური ქსელის კლიენტს `CanManageRoles` არ აქვს, ამიტომ რეცეპტს სჭირდება ქსელი, რომლის გენეზისიც ამ ნებართვას ანიჭებს.

```bash
CONFIG=./taira.client.toml
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

გამოიყენეთ მეორე კლიენტის კონფიგურაცია დელეგატისთვის წერის დამტკიცებისას:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## ნაბიჯები {#steps}

### 1. დაარეგისტრირეთ ცარიელი როლი {#_1-register-an-empty-role}

მდგომარეობის შემცვლელი ყოველი CLI ბრძანება საფასურის გადამხდელს ცხადად ასახელებს. CLI ხელმოწერამდე იღებს ზუსტი საფასურის შეფასებას Taira-ს საფასურის აქტივში.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  ledger role register --id "$ROLE_ID"
```

### 2. მიზნულ ანგარიშზე შემატეთ განსაზღვრული ნებართვა. {#_2-add-a-permission-scoped-to-the-target-account}

ნებართვის ტოკენები იწერება JSON ობიექტები. შეინახეთ ანგარიში `payload` როგორც I105 ID; ალიასი არ არის მოქმედი ამ მკაცრ ველში.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. გადაურიცხეთ როლი დელეგატს. {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

როლები და მათი გრანტები არ ამოიწურებათ. გამოცხადებით გააუქმეთ ისინი, როდესაც წვდომა აღარ არის საჭირო.

### 4. გამოიყენეთ დელეგირებული ნებართვა {#_4-exercise-the-delegated-permission}

გამოიყენეთ დელეგატის კრიპტოგრაფიული ხელმოწერა და საფასურის ბალანსი ჩაწერისთვის. JSON ღირებულებები იკითხება სტანდარტული შეღებისგან.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

იგივე მოდელი ხელმისაწვდომია Rust კლიენტებისთვის. აქ `client` არის `iroha::blocking::Client`, რომელიც ხელს აწერს როგორც `registrar_account`; ეს ანგარიში, ისევე როგორც CLI-ის ნაკადში, როლის საწყისი მფლობელი ხდება. სამივე ანგარიშის ცვლადი უკვე გარჩეული `AccountId` მნიშვნელობებია:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};
use iroha_executor_data_model::permission::account::CanModifyAccountMetadata;

let role_id: RoleId = "cookbook_metadata_editors".parse()?;
let role = Role::new(role_id.clone(), registrar_account).add_permission(
    CanModifyAccountMetadata {
        account: target_account.clone(),
    },
);

client.submit_all::<InstructionBox>(
    [
        Register::role(role).into(),
        Grant::account_role(role_id, delegate_account).into(),
    ],
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## შემოწმება {#verify}

წაიკითხეთ დელეგატის მოქმედი ნებართვები, რომლებიც როლებით მინიჭებულ ნებართვებსაც მოიცავს, შემდეგ კი წაიკითხეთ დელეგატის მიერ ჩაწერილი ზუსტი მნიშვნელობა:

```bash
iroha --config "$CONFIG" --machine account permission list \
  --id "$DELEGATE_ACCOUNT" --all \
  | jq -e --arg account "$TARGET_ACCOUNT" \
    '.items | any(.name == "CanModifyAccountMetadata"
      and .payload.account == $account)'

iroha --config "$CONFIG" account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

დელეგატის მოქმედი ნებართვები უნდა შეიცავდეს `TARGET_ACCOUNT`-ით შეზღუდულ `CanModifyAccountMetadata`-ს, ხოლო მეტამონაცემების წაკითხვამ უნდა დააბრუნოს `"delegated"`. Torii ხელმოწერილი მოთხოვნებით როლების ჩამონათვალს არ გასცემს, ამიტომ როლის მინიჭების შემოწმებად მოქმედი ნებართვების ჩამონათვალი გამოიყენება.

## პრობლემების აღმოფხვრა {#troubleshooting}

- `Not permitted` როლის რეგისტრაციის, რედაქტირების ან მინიჭებისას ნიშნავს, რომ ხელმომწერს Taira-ზე საჭირო უფლებამოსილება არ აქვს. შეზღუდული ტოკენი გლობალურით არ შეცვალოთ; მოითხოვეთ ზუსტი ნებართვის მინიჭება.
- დატვირთვის ალიასების შეცდომა, როგორც წესი, ნიშნავს, რომ `account` განთავსდა `payload`-ს გვერდით, I105 ID-ის ნაცვლად წარედგინა ალიასი სახელი ან JSON ღირებულება ორჯერ მითითებული იყო.
- საფასურის უარყოფა იმ ხელმომწერს ეკუთვნის, რომელიც ამ ნაბიჯს აგზავნის. მენეჯერი და დელეგატი დამოუკიდებლად დააფინანსეთ იმ საფასურის აქტივში, რომელსაც თითოეული საფასურის შეფასება ასახელებს.
- წარმატებული როლების მინიჭება არ აძლიერებს მის ტოკენებში კოდირებულ მოცულობას. ამ როლს შეუძლია შეცვალოს მხოლოდ ნებართვის დატვირთვაში მითითებული ანგარიში.
- გასასუფთავებლად გაუშვით `account role revoke`, შემდეგ `ledger role permission revoke` და ბოლოს `ledger role unregister`; თითოეული ცალკე ჩაწერაა და უნდა შეიცავდეს `--fee-payer authority`-ს.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [როლების ინტეგრაციის ტესტები დამაგრებული წყარო კოდის რევიზიის](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/roles.rs)
- [ნებართვის ინტეგრაციის ტესტები ჩაკეტილი წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/permissions.rs)
- [შეყვანილი ნებართვის მონაცემთა მოდელი დამაგრებული წყარო კოდის გადახედვაზე](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/permission.rs)
- [ნებართვები და როლები](/ka/blockchain/permissions.md)
- [ნებართვის ნიშნების მითითება](/ka/reference/permissions.md)
- [მეტამონაცემები](./metadata.md)
