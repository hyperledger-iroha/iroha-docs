---
translation_locale: ka
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 8d6fd7101094ba21cfc2c5fb9a89d2acd7e67f13ff47b9f8c8e01bbbd7bf2836
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ნებართვები და როლები {#permissions-and-roles}

## შედეგები {#outcome}

შექმენით როლი, რომელიც ერთ ანგარიშს აძლევს ნებართვას ერთი კონკრეტული ანგარიშის მეტამონაცემების განახლებაზე, დაუთმეთ მას დელეგატს, დაამტკიცეთ დელეგირებული წერა და აჩვენეთ შესაბამისი Rust მითითება.

## წინაპირობები {#prerequisites}

- Taira დაფინანსებული კლიენტი და საფასურის მეტამონაცემები [გაერთიანება Taira](./connect-to-taira.md).
- `TARGET_ACCOUNT` და `DELEGATE_ACCOUNT` განისაზღვრება ერთპიროვნული პროტოკოლური სტანდარტის I105 ანგარიშის ID-ებად.
- ხელმოწერის ანგარიშს უნდა ეძლევათ უფლება მართოს მიზნობრივი ნებართვა და როლები. Taira-ზე ეს არის ნებართვის გათვალისწინებული ადმინისტრაციული ოპერაცია; მიიღეთ `CanManageRoles` და ავტორიზაციის პრინციპალი, რომელიც საჭიროა განსაზღვრული ნებართვების გასაცემად ან აწარმოეთ რეცეპტი გენერირებულ ლოკალურ ქსელში.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
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

ყველა სახელმწიფოს შეცვლის CLI ბრძანება ცალსახად ასახელებს გადასახადის გადამხდელს. მეტამონაცემების ფაილი შეიცავს მიმდინარე Taira გადასახადის აქტივს, რომელიც გამომდინარეობს ტესტური მონეტების გამცემის პასუხიდან.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. მიზნულ ანგარიშზე შემატეთ განსაზღვრული ნებართვა. {#_2-add-a-permission-scoped-to-the-target-account}

ნებართვის ტოკენები იწერება JSON ობიექტები. შეინახეთ ანგარიში `payload` როგორც I105 ID; ალიასი არ არის მოქმედი ამ მკაცრ ველში.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. გადაურიცხეთ როლი დელეგატს. {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
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
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

იგივე მოდელი ხელმისაწვდომია Rust კლიენტებისთვის. აქ `client` ინიშნება როგორც `registrar_account`, რომელიც ხდება როლის თავდაპირველი მფლობელი ისევე, როგორც ეს ხდება CLI ნაკადში. სამივე ანგარიშის ცვლადი უკვე არის გაანალიზებული `AccountId` ღირებულებები:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};
use iroha_executor_data_model::permission::account::CanModifyAccountMetadata;

let role_id: RoleId = "cookbook_metadata_editors".parse()?;
let role = Role::new(role_id.clone(), registrar_account).add_permission(
    CanModifyAccountMetadata {
        account: target_account.clone(),
    },
);

client.submit_all_blocking::<InstructionBox>(
    [
        Register::role(role).into(),
        Grant::account_role(role_id, delegate_account).into(),
    ],
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## შემოწმება {#verify}

დავალების ორივე მხარის ჩამონათვალი, შემდეგ წაიკითხეთ ზუსტი ღირებულება, რომელიც დელეგატმა დაწერა:

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

ნებართვის ჩამონათვალში უნდა იყოს `CanModifyAccountMetadata` დასახელებული `TARGET_ACCOUNT`-ზე, დელეგატის როლების ჩამონათვალი უნდა შეიცავდეს `ROLE_ID` და გათვლილი მეტამონაცემები უნდა დაუბრუნდეს `"delegated"`.

## პრობლემების აღმოფხვრა {#troubleshooting}

- `Not permitted` რეგისტრაციის, რედაქტირების ან როლის დანიშვნისას ნიშნავს, რომ კრიპტოგრაფიულ ხელმომწერს არ გააჩნია საჭირო Taira ავტორიზაციის პრინციპი. არ შეცვალოთ განსაზღვრული ტოკენი გლობალური; ითხოვეთ ზუსტი გრანტი ან გამოიყენეთ localnet.
- დატვირთვის ალიასების შეცდომა, როგორც წესი, ნიშნავს, რომ `account` განთავსდა `payload`-ს გვერდით, I105 ID-ის ნაცვლად წარედგინა ალიასი სახელი ან JSON ღირებულება ორჯერ მითითებული იყო.
- საფასურის უარყოფა ეკუთვნის კრიპტოგრაფიული ხელმომწერს, რომელმაც ეს ნაბიჯი წარადგინა. ფინანსდება მენეჯერი და დამოუკიდებლად დელეგირებს და ინახავს საბანქოზე მოყვანილი საფასურის აქტივების მეტადატასები.
- წარმატებული როლების მინიჭება არ აძლიერებს მის ტოკენებში კოდირებულ მოცულობას. ამ როლს შეუძლია შეცვალოს მხოლოდ ნებართვის დატვირთვაში მითითებული ანგარიში.
- დასუფთავებისათვის, განახორციელეთ `ledger account role revoke`, შემდეგ `ledger role permission revoke` და ბოლოს `ledger role unregister`; თითოეული ცალკე წერია და უნდა შეიცავდეს `--fee-payer authority` და საფასურის მეტადატასებს.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [როლების ინტეგრაციის ტესტები დამაგრებული წყარო კოდის რევიზიის](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [ნებართვის ინტეგრაციის ტესტები ჩაკეტილი წყარო კოდის რევიზიისას](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)
- [შეყვანილი ნებართვის მონაცემთა მოდელი დამაგრებული წყარო კოდის გადახედვაზე](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs)
- [ნებართვები და როლები](/ka/blockchain/permissions.md)
- [ნებართვის ნიშნების მითითება](/ka/reference/permissions.md)
- [მეტამონაცემები](./metadata.md)
