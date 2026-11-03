---
translation_locale: hy
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 40fe8b19344d8eff66b178dc8576e2e049fef50bd3212fbddc5c0d5f7f37fa03
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# թույլտվությունները եւ դերը {#permissions-and-roles}

## Արդյունքը {#outcome}

Ստեղծեք դերակատարություն, որը թույլ է տալիս մեկ հաշիվին թարմացնել մի կոնկրետ հաշիվի մետադատները, այն նշանակել պատվիրատուին, ապացուցել պատվիրված գրումը եւ ցուցադրել համապատասխան տիպավորված Rust հրահանգները:

## Նախադրյալներ {#prerequisites}

- Ֆինանսավորված Taira հաճախորդ՝ [Միացում Taira-ին](./connect-to-taira.md) էջից։
- `TARGET_ACCOUNT` եւ `DELEGATE_ACCOUNT` սահմանված են քանոնիկ I105 հաշվին IDs:
- Ստորագրող հաշիվը պետք է ունենա `CanManageRoles` և պետք է կարողանա պատվիրակել շրջանակով սահմանափակված թույլտվությունը: այն կա՛մ ինքն է `TARGET_ACCOUNT`-ը, կա՛մ այդ հաշվի համար արդեն ունի `CanModifyAccountMetadata`։ Taira-ում սա թույլտվությամբ պաշտպանված վարչական գործողություն է։ Ստեղծված տեղական ցանցի հաճախորդը չունի `CanManageRoles`, ուստի բաղադրատոմսին անհրաժեշտ է ցանց, որի ծագման բլոկը շնորհում է այն։

```bash
CONFIG=./taira.client.toml
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

Օգտագործեք պատվիրվածի համար երկրորդ հաճախորդի կարգավորումը գրելու ապացուցման ժամանակ.

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## Քայլեր {#steps}

### 1. Գրանցեք դատարկ դեր: {#_1-register-an-empty-role}

Վիճակը փոփոխող յուրաքանչյուր CLI հրաման բացահայտորեն նշում է վճարողին։ CLI-ն ստորագրելուց առաջ ստանում է ճշգրիտ վճարային առաջարկ Taira-ի վճարային ակտիվով։

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  ledger role register --id "$ROLE_ID"
```

### 2. Թիրախային հաշիվին ավելացրեք սահմանված թույլտվություն {#_2-add-a-permission-scoped-to-the-target-account}

Թույլտվության տոքերները մուտքագրվում են JSON օբյեկտներ: Պահեք հաշիվը `payload` ՝ որպես I105 ID; այս խիստ դաշտում անանունը չի գործում:

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Պատվիրեք դերը պատվիրակին {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

Դերերը և դրանց նշանակումները ժամկետ չունեն։ Հստակորեն հետ կանչեք դրանք, երբ մուտքն այլևս անհրաժեշտ չէ։

### 4. Օգտագործիր պատվիրված թույլտվությունը {#_4-exercise-the-delegated-permission}

Գրելու համար օգտագործեք պատվիրակվածի ստորագրողը եւ վճարային մնացորդը: JSON արժեքները ընթերցվում են ստանդարտ մուտք գործելուց:

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

Նույն մոդելը հասանելի է Rust հաճախորդներին։ Այստեղ `client`-ը `iroha::blocking::Client` է, որը ստորագրում է որպես `registrar_account`, որն էլ դառնում է դերի սկզբնական սեփականատերը, ճիշտ ինչպես CLI-ի հոսքում։ Հաշվի բոլոր երեք փոփոխականներն արդեն վերլուծված `AccountId` արժեքներ են:

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

## Փորձարկել {#verify}

Կարդացեք պատվիրակի գործող թույլտվությունները, որոնք ներառում են նաև դերերի միջոցով շնորհվածները, ապա կարդացեք պատվիրակի գրած ճշգրիտ արժեքը:

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

Պատվիրակի գործող թույլտվությունները պետք է պարունակեն `TARGET_ACCOUNT`-ով սահմանափակված `CanModifyAccountMetadata`, իսկ մետատվյալների ընթերցումը պետք է վերադարձնի `"delegated"`։ Torii-ն մերժում է դերերի ցուցակները ստորագրված հարցումներով, ուստի նշանակման ստուգումը գործող թույլտվությունների ցուցակն է։

## Խնդիրների լուծում {#troubleshooting}

- Դերը գրանցելիս, խմբագրելիս կամ նշանակելիս `Not permitted` սխալը նշանակում է, որ ստորագրողը չունի Taira-ում պահանջվող լիազորությունը։ Մի՛ փոխարինեք շրջանակով սահմանափակված տոկենը գլոբալով; պահանջեք ճշգրիտ շնորհումը։
- Օգտակար բեռի վերլուծման սխալը սովորաբար նշանակում է `account` տեղադրվել է կողքին `payload`, alias-ը մատակարարվել է փոխարեն I105 ID, կամ JSON արժեքը երկու անգամ մեջբերվել է:
- Վճարի մերժումը վերաբերում է այն ստորագրողին, որը ներկայացնում է տվյալ քայլը։ Կառավարչին և պատվիրակին ֆինանսավորեք առանձին՝ այն վճարային ակտիվով, որը նշված է յուրաքանչյուր վճարային առաջարկում։
- Հաջողակ դերի շնորհումը չի գերազանցում իր տոքերներում կոդավորված տարածքը: Այս դերը կարող է փոփոխել միայն թույլտվության օգտակար բեռնվածքում նշված հաշիվը:
- Մաքրելու համար գործարկեք `account role revoke`, ապա `ledger role permission revoke` և վերջում `ledger role unregister`; յուրաքանչյուրը առանձին գրառում է և պետք է ներառի `--fee-payer authority`։

## Աղբյուրը եւ դրա հետ կապված փաստաթղթերը {#source-and-related-docs}

- [Դասերի ինտեգրման փորձարկումներ փակված commit-ում ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/roles.rs)
- [Թույլտվությունների ինտեգրման փորձարկումները փակված commit վրա ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/permissions.rs)
- [Մուտքագրված թույլտվությունների տվյալների մոդելը փաթեթավորված կոմիտեում](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/permission.rs)
- [թույլտվություններ եւ դերակատարություններ](/hy/blockchain/permissions.md)
- [թույլտվության նշանների հղում](/hy/reference/permissions.md)
- [Մետադատա](./metadata.md)
