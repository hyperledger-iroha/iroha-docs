---
translation_locale: ba
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 40fe8b19344d8eff66b178dc8576e2e049fef50bd3212fbddc5c0d5f7f37fa03
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Иреклелек һәм ролдәр {#permissions-and-roles}

## Һөҙөмтә {#outcome}

Бер иҫәп яҙмаһында метамәғлүмәттәрҙе яңыртыу өсөн рөхсәт биреүсе ролде булдырығыҙ, уны делегатҡа бүлегеҙ, делегацияланған яҙыуҙы иҫбатлағыҙ һәм тейешле Rust тип яҙылған күрһәтмәләр күрһәтегеҙ.

## Шарттар {#prerequisites}

- [Taira-ға тоташыу](./connect-to-taira.md) битенән финансланған Taira клиенты.
- `TARGET_ACCOUNT` һәм `DELEGATE_ACCOUNT` каноникаға ҡуйылған I105 иҫәбенә IDs.
- Ҡул ҡуйыусы иҫәптә `CanManageRoles` булырға тейеш һәм ул даирәһе сикләнгән рөхсәтте тапшыра алырға тейеш: йә ул `TARGET_ACCOUNT`-тың үҙе, йә уның был иҫәп өсөн `CanModifyAccountMetadata` рөхсәте инде бар. Taira-ла был — рөхсәт менән сикләнгән административ операция. Генерацияланған локаль селтәрҙең клиентында `CanManageRoles` юҡ, шуға күрә рецептҡа генезисы был рөхсәтте биргән селтәр кәрәк.

```bash
CONFIG=./taira.client.toml
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

Яҙыуҙы иҫбатлағанда делегат өсөн икенсе клиент конфигурацияһын ҡулланыу:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## Аҙымдар {#steps}

### 1. Буш роль яҙыу {#_1-register-an-empty-role}

Торошто үҙгәрткән һәр CLI командаһы комиссия түләүсене асыҡтан-асыҡ атай. CLI ҡул ҡуйыр алдынан теүәл комиссияны Taira-ның түләү активында иҫәпләп күрһәтә.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  ledger role register --id "$ROLE_ID"
```

### 2. маҡсатлы иҫәбкә сикләнгән рөхсәт өҫтәгеҙ {#_2-add-a-permission-scoped-to-the-target-account}

Рөхсәт билдәләре JSON объекттары тип яҙылған. иҫәпте `payload` эсендә I105 ID булараҡ һаҡлағыҙ; был тығыҙ өлкәлә псевдоним ғәмәлдә булмай.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Делегатҡа бурыс йөкмәтергә {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

Ролдәр һәм уларҙың бирелгән рөхсәттәре тамамланмай, уларға инеү кәрәк булмағас, уларҙы асыҡтан-асыҡ алып ташларға.

### 4. Делегацияланған рөхсәт менән файҙаланығыҙ {#_4-exercise-the-delegated-permission}

Яҙыу өсөн делегаттың ҡултамғаһын һәм түләүҙәр балансын ҡулланығыҙ. JSON ҡиммәттәр стандарт инеүҙән уҡыла.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

Ошо уҡ модель Rust клиенттары өсөн дә бар. Бында `client` — `registrar_account` исеменән ҡул ҡуйған `iroha::blocking::Client`; CLI ағымындағы кеүек үк, был иҫәп ролдең башланғыс хужаһы була. Өс иҫәп үҙгәреүсәне лә инде анализланған `AccountId` ҡиммәттәре:

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

## Тикшереү {#verify}

Делегаттың ғәмәлдәге рөхсәттәрен (ролдәр аша бирелгәндәрен дә) уҡығыҙ, һуңынан делегат яҙған теүәл ҡиммәтте уҡығыҙ:

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

Делегаттың ғәмәлдәге рөхсәттәрендә `TARGET_ACCOUNT` менән сикләнгән `CanModifyAccountMetadata` булырға тейеш, ә метамәғлүмәтте уҡыу `"delegated"` ҡайтарырға тейеш. Torii ҡул ҡуйылған һорауҙар аша ролдәр исемлеген биреүҙән баш тарта, шуға күрә тәғәйенләүҙе ғәмәлдәге рөхсәттәр исемлеге аша тикшерәләр.

## Проблемаларҙы хәл итеү {#troubleshooting}

- Ролде теркәгәндә, мөхәррирләгәндә йәки тәғәйенләгәндә килеп сыҡҡан `Not permitted` хатаһы ҡул ҡуйыусыла кәрәкле Taira вәкәләте булмауын аңлата. Даирәһе сикләнгән токенды глобаль токенға алмаштырмағыҙ; теүәл рөхсәтте һорағыҙ.
- `payload` янында `account` урынлаштырылған, I105 урынына ID исеме бирелгән, йәки JSON хаҡы ике тапҡыр күрһәтелгән.
- Комиссия буйынса кире ҡағыу шул аҙымды тапшырған ҡул ҡуйыусыға ҡарай. Менеджерҙы һәм делегатты һәр комиссия иҫәбендә күрһәтелгән түләү активында айырым-айырым финансланығыҙ.
- Уңышлы роль биреү уның токендарында кодланған киңлек өҫтөнлөк итмәй. Был роль рөхсәт йөкләмәһендә исемләнгән иҫәпте генә үҙгәртә ала.
- Таҙартыу өсөн `account role revoke`, һуңынан `ledger role permission revoke`, ә аҙаҡтан `ledger role unregister` командаларын эшләтегеҙ; һәр береһе айырым яҙыу булып тора һәм `--fee-payer authority` үҙ эсенә алырға тейеш.

## Сығанаҡ һәм уның менән бәйле документтар {#source-and-related-docs}

- [Роль интеграцияһына һынауҙар ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/roles.rs)
- [Ирекле интеграция һынауҙары ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/permissions.rs)
- [Пинк commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/permission.rs) ҡуйылған рөхсәт мәғлүмәттәр моделендә төҙөлгән
- [Рөхсәт һәм ролдәр](/ba/blockchain/permissions.md)
- [Рөхсәт биреү билдәһе шиғыры](/ba/reference/permissions.md)
- [Метамәғлүмәттәре](./metadata.md)
