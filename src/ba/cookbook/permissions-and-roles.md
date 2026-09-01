---
translation_locale: ba
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 8d6fd7101094ba21cfc2c5fb9a89d2acd7e67f13ff47b9f8c8e01bbbd7bf2836
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Иреклелек һәм ролдәр {#permissions-and-roles}

## Һөҙөмтә {#outcome}

Бер иҫәп яҙмаһында метамәғлүмәттәрҙе яңыртыу өсөн рөхсәт биреүсе ролде булдырығыҙ, уны делегатҡа бүлегеҙ, делегацияланған яҙыуҙы иҫбатлағыҙ һәм тейешле Rust тип яҙылған күрһәтмәләр күрһәтегеҙ.

## Шарттар {#prerequisites}

- Taira финансланған клиент һәм түләү метамәғлүмәттәре [нан Taira](./connect-to-taira.md) менән бәйләнешкә инеү.
- `TARGET_ACCOUNT` һәм `DELEGATE_ACCOUNT` каноникаға ҡуйылған I105 иҫәбенә IDs.
- Ҡул ҡуйыу иҫәбенә маҡсатлы рөхсәт һәм ролдәр менән идара итеүгә мөмкинлек бирергә кәрәк. Taira буйынса был рөхсәт менән сикләнгән административ операция; `CanManageRoles` һәм тәғәйенләнгән рөхсәт биреү өсөн кәрәкле вәкәләтле иҫәп алыу, йәки рецептты генерацияланған урындағы селтәрҙә файҙаланыу.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
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

Һәр торошто үҙгәртеүсе CLI командаһы түләүсене асыҡтан-асыҡ атай. Метамәғлүмәттәр файлында faucet яуабынан алынған ағымдағы Taira түләү активы бар.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. маҡсатлы иҫәбкә сикләнгән рөхсәт өҫтәгеҙ {#_2-add-a-permission-scoped-to-the-target-account}

Рөхсәт билдәләре JSON объекттары тип яҙылған. иҫәпте `payload` эсендә I105 ID булараҡ һаҡлағыҙ; был тығыҙ өлкәлә псевдоним ғәмәлдә булмай.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Делегатҡа бурыс йөкмәтергә {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
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
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

Ошо уҡ модель Rust клиенттары өсөн дә бар. Бында `client` `registrar_account` тип билдәләнә, ул CLI ағымда эшләгән кеүек үк ролдең башланғыс хужаһы булып китә. Өс иҫәп-хисап үҙгәреүсәндәре лә инде `AccountId` ҡиммәттәрен анализлай:

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

## Тикшереү {#verify}

Тапшырыуҙың ике яғын да исемлеккә килтерегеҙ, шунан делегаттың яҙған хаҡын уҡығыҙ:

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

Рөхсәт исемлегендә булырға тейеш `CanModifyAccountMetadata` күләмдә `TARGET_ACCOUNT`, Делегаттың роле исемлегендә булырға тейеш `ROLE_ID`, һәм уҡылған метамәғлүмәт кире ҡайтарылырға тейеш `"delegated"`.

## Проблемаларҙы хәл итеү {#troubleshooting}

- `Not permitted` теркәгәндә, редакциялағанда йәки ролде бүлгәндә ҡул ҡуйған кешегә тейешле Taira вәкәләт етмәй. Объектлы токенды глобаль токен менән алмаштырмағыҙ; аныҡ рөхсәтте һорағыҙ йәки localnet-ты ҡулланығыҙ.
- `payload` янында `account` урынлаштырылған, I105 урынына ID исеме бирелгән, йәки JSON хаҡы ике тапҡыр күрһәтелгән.
- Бурыстан баш тартыу шул аҙымды тапшырған ҡул ҡуйған кешегә ҡарай. Менеджерҙы финанслау һәм үҙаллы рәүештә йөкмәтеү, шулай уҡ faucetнан алынған түләү активтары метамәғлүмәттәре һаҡлана.
- Уңышлы роль биреү уның токендарында кодланған киңлек өҫтөнлөк итмәй. Был роль рөхсәт йөкләмәһендә исемләнгән иҫәпте генә үҙгәртә ала.
- Таҙартыу өсөн `ledger account role revoke`, һуңынан `ledger role permission revoke` һәм, ниһайәт, `ledger role unregister` эшләй; һәр береһе айырым яҙыу булып тора һәм `--fee-payer authority` һәм түләү метамәғлүмәттәре булырға тейеш.

## Сығанаҡ һәм уның менән бәйле документтар {#source-and-related-docs}

- [Роль интеграцияһына һынауҙар ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [Ирекле интеграция һынауҙары ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)
- [Пинк commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs) ҡуйылған рөхсәт мәғлүмәттәр моделендә төҙөлгән
- [Рөхсәт һәм ролдәр](/ba/blockchain/permissions.md)
- [Рөхсәт биреү билдәһе шиғыры](/ba/reference/permissions.md)
- [Метамәғлүмәттәре](./metadata.md)
