---
translation_locale: ka
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 7ee18275d25837da53f533f5e9205906ccaa71b48afd9b11ffad79b599da7f21
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ნებართვები და როლები {#permissions-and-roles}

## შედეგები {#outcome}

შექმენით როლი, რომელიც ერთ ანგარიშს აძლევს ნებართვას ერთი კონკრეტული ანგარიშის მეტა მონაცემების განახლებაზე, დაუთმეთ მას დელეგატს, დაამტკიცეთ დელეგირებული წერა და აჩვენეთ შესაბამისი Rust მითითება.

## წინაპირობები {#prerequisites}

- Taira დაფინანსებული კლიენტის და საფასურის მეტა მონაცემები [დაკავშირდით Taira](./connect-to-taira.md).
- `TARGET_ACCOUNT` და `DELEGATE_ACCOUNT` განისაზღვრება კანონიკური I105 ანგარიშზე IDs.
- ხელმოწერის ანგარიშს უნდა მიეცეს უფლება მართოს მიზნობრივი ნებართვა და როლები. Taira - ეს არის ნებართვის გათვალისწინებული ადმინისტრაციული ოპერაცია; მიიღეთ `CanManageRoles` და ავტორიტეტი, რომელიც საჭიროა განსაზღვრული ნებართვების გასაცემად ან აწარმოეთ რეცეპტი გენერირებულ ლოკალურ ქსელში.

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

ყველა სახელმწიფოს შეცვლის CLI ბრძანება გამოხატავს გადასახადის გადამხდელის სახელებს. მეტა მონაცემთა ფაილი შეიცავს მიმდინარე Taira საფასურის აქტივს, რომელიც მოდის ონკანის რეაგირებიდან.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. მიზნულ ანგარიშზე შემატეთ განსაზღვრული ნებართვა. {#_2-add-a-permission-scoped-to-the-target-account}

ნებართვის ქაღალდები არიან JSON ობიექტები. შეინახეთ ანგარიში `payload` როგორც I105 ID; ამ მკაცრ ველში საიდუმლო არ არის მოქმედი.

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

გამოიყენეთ დელეგატის ხელმოწერა და საფასურის ბალანსი წერისთვის. JSON ღირებულებები იკითხება სტანდარტული შეღებისგან.

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

ნებართვის ჩამონათვალში უნდა იყოს `CanModifyAccountMetadata` დასახელებული `TARGET_ACCOUNT`-ზე, დელეგატის როლების ჩამონათვალი უნდა შეიცავდეს `ROLE_ID` და გათვლილი მეტა მონაცემები უნდა დაუბრუნდეს `"delegated"`.

## პრობლემების აღმოფხვრა {#troubleshooting}

- `Not permitted` როლის რეგისტრაციის, რედაქტირების ან დანიშვნისას ნიშნავს, რომ ხელმომწერს არ გააჩნია საჭირო Taira უფლებამოსილება. არ შეცვალოთ განსაზღვრული ტოკენი გლობალური; მოითხოვეთ ზუსტი მინიჭება ან გამოიყენეთ localnet.
- სასარგებლო ტვირთის ანალიზების შეცდომა, როგორც წესი, ნიშნავს, რომ `account` განთავსდა `payload`-ს გვერდით, I105 ID-ის ნაცვლად წარადგინეს საიდუმლო დასახელება ან ორჯერ აღინიშნა JSON ღირებულება.
- საფასურის უარყოფა ეკუთვნის ხელმომწერს, რომელმაც ეს ნაბიჯი წარადგინა. ფინანსდება მენეჯერი და დამოუკიდებლად დელეგირებს და ინახავს საბანქოზე მოყვანილი საფასურის აქტივების მეტადატასები.
- წარმატებული როლების მინიჭება არ აძლიერებს მის ტოკენებში კოდირებულ მოცულობას. ამ როლს შეუძლია შეცვალოს მხოლოდ ნებართვის სასარგებლო ტვირთში მითითებული ანგარიში.
- დასუფთავებისათვის, განახორციელეთ `ledger account role revoke`, შემდეგ `ledger role permission revoke` და ბოლოს `ledger role unregister`; თითოეული ცალკე წერია და უნდა შეიცავდეს `--fee-payer authority` და საფასურის მეტადატასებს.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [როლების ინტეგრაციის ტესტები ჩაკეტილ კომიტეტზე](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [ნებართვის ინტეგრაციის ტესტები ჩაკეტილ კომიტეტზე](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)
- [შეყვანილი ნებართვის მონაცემთა მოდელი ჩაკეტილ კომიტეტზე](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs)
- [ნებართვები და როლები](/ka/blockchain/permissions.md)
- [ნებართვის ნიშნების მითითება](/ka/reference/permissions.md)
- [მეტა მონაცემები](./metadata.md)
