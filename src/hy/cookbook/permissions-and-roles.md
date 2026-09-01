---
translation_locale: hy
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 8d6fd7101094ba21cfc2c5fb9a89d2acd7e67f13ff47b9f8c8e01bbbd7bf2836
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# թույլտվությունները եւ դերը {#permissions-and-roles}

## Արդյունքը {#outcome}

Ստեղծեք դերակատարություն, որը թույլ է տալիս մեկ հաշիվին թարմացնել մի կոնկրետ հաշիվի մետադատները, այն նշանակել պատվիրատուին, ապացուցել պատվիրված գրումը եւ ցուցադրել համապատասխան տիպավորված Rust հրահանգները:

## Նախադրյալներ {#prerequisites}

- Taira ֆինանսավորվող հաճախորդի եւ վճարային մետադատա [ Կապակցեք Taira](./connect-to-taira.md):
- `TARGET_ACCOUNT` եւ `DELEGATE_ACCOUNT` սահմանված են քանոնիկ I105 հաշվին IDs:
- ստորագրող հաշիվը պետք է թույլատրվի կառավարել նպատակային թույլտվությունները եւ դերերը: Taira-ում դա թույլտվությունների սահմանված վարչական գործողություն է. ստանալ `CanManageRoles` եւ անհրաժեշտ լիազոր հաշիվը, որպեսզի տրամադրի շրջանակային թույլտվի կամ գործարկել բաղադրատոմսը ստեղծված տեղական ցանցում:

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
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

Վիճակ փոխող յուրաքանչյուր CLI հրաման բացահայտ նշում է fee payer-ին։ Metadata ֆայլը պարունակում է faucet-ի պատասխանից ստացված ընթացիկ Taira fee asset-ը։

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. Թիրախային հաշիվին ավելացրեք սահմանված թույլտվություն {#_2-add-a-permission-scoped-to-the-target-account}

Թույլտվության տոքերները մուտքագրվում են JSON օբյեկտներ: Պահեք հաշիվը `payload` ՝ որպես I105 ID; այս խիստ դաշտում անանունը չի գործում:

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Պատվիրեք դերը պատվիրակին {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
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
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

Նույն մոդելը հասանելի է Rust հաճախորդների համար: Այստեղ `client` նշում է որպես `registrar_account`, որը դառնում է դերի սկզբնական սեփականատերը, ինչպես եւ այն անում է CLI հոսքում: Բոլոր երեք հաշիվային փոփոխականները արդեն վերլուծված են `AccountId` արժեքները:

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

## Փորձարկել {#verify}

Հանձնարարության երկու կողմերն էլ ներկայացրեք, ապա կարդացեք պատվիրակվածի կողմից գրված ճշգրիտ արժեքը.

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

թույլտվությունների ցուցակը պետք է պարունակի `CanModifyAccountMetadata`, որը հասանելի է `TARGET_ACCOUNT`, պատվիրակվածի դերի ցանկը պետք է պարունակում է `ROLE_ID`, եւ ընթերցված մետադատաները պետք է վերադարձնեն `"delegated"`.

## Խնդիրների լուծում {#troubleshooting}

- `Not permitted` գրանցման, խմբագրման կամ դերի նշանակման ժամանակ նշանակում է, որ ստորագրողը չունի պահանջվող Taira լիազորությունը: Մի փոխարինեք նպատակային տոկենը գլոբալով. խնդրեք ճշգրիտ օժանդակություն կամ օգտագործեք localnet.
- Օգտակար բեռի վերլուծման սխալը սովորաբար նշանակում է `account` տեղադրվել է կողքին `payload`, alias-ը մատակարարվել է փոխարեն I105 ID, կամ JSON արժեքը երկու անգամ մեջբերվել է:
- Հարկի մերժումը պատկանում է այն ստորագրողին, ով ներկայացնում է այդ քայլը: Գումարը տրամադրվում է կառավարիչին եւ ինքնուրույն արտահանձնում եւ պահվում է գետնազարդից ստացված վճարային ակտիվների մետադատածները:
- Հաջողակ դերի շնորհումը չի գերազանցում իր տոքերներում կոդավորված տարածքը: Այս դերը կարող է փոփոխել միայն թույլտվության օգտակար բեռնվածքում նշված հաշիվը:
- Պարզելու համար գործարկեք `ledger account role revoke`, ապա `ledger role permission revoke`, եւ վերջապես `ledger role unregister`: Յուրաքանչյուրը առանձին գրառում է եւ պետք է ներառի `--fee-payer authority` եւ վճարային մետադատա:

## Աղբյուրը եւ դրա հետ կապված փաստաթղթերը {#source-and-related-docs}

- [Դասերի ինտեգրման փորձարկումներ փակված commit-ում ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [Թույլտվությունների ինտեգրման փորձարկումները փակված commit վրա ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)
- [Մուտքագրված թույլտվությունների տվյալների մոդելը փաթեթավորված կոմիտեում](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs)
- [թույլտվություններ եւ դերակատարություններ](/hy/blockchain/permissions.md)
- [թույլտվության նշանների հղում](/hy/reference/permissions.md)
- [Մետադատա](./metadata.md)
