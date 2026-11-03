---
translation_locale: kk
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 40fe8b19344d8eff66b178dc8576e2e049fef50bd3212fbddc5c0d5f7f37fa03
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Рұқсаттар мен рөлдер {#permissions-and-roles}

## Нәтиже {#outcome}

Бір есептік жазбаның бір нақты есептік жазбадағы метадеректерді жаңартуға рұқсат беретін рөл жасаңыз, оны делегатқа тағайындаңыз, делегирлеп жазуды дәлелдеңіз және сәйкес типтелген Rust нұсқауларын көрсетіңіз.

## Алдын ала шарттар {#prerequisites}

- [Taira-ға қосылу](./connect-to-taira.md) нұсқаулығы бойынша қаржыландырылған Taira клиенті.
- `TARGET_ACCOUNT` және `DELEGATE_ACCOUNT` бір протокол стандартты I105 есептік жазба идентификаторларына орнатылды.
- Қол қоюшы есептік жазбада `CanManageRoles` болуы және ол ауқыммен шектелген рұқсатты өкілге бере алуы тиіс: ол не `TARGET_ACCOUNT` есептік жазбасының өзі, не сол есептік жазба үшін `CanModifyAccountMetadata` рұқсатына бұрыннан ие. Taira-да бұл рұқсатпен қорғалған әкімшілік операция. Жасалған жергілікті желінің клиентінде `CanManageRoles` жоқ, сондықтан рецептке генезисі оны беретін желі қажет.

```bash
CONFIG=./taira.client.toml
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

Жазбаны дәлелдеу кезінде делегат үшін екінші клиент конфигурациясын пайдаланыңыз:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## Қадамдар {#steps}

### 1. Бос рөльді тіркеу {#_1-register-an-empty-role}

Күйді өзгертетін әр CLI командасы ақы төлеушіні айқын көрсетеді. CLI қол қоюдан бұрын Taira ақы активіндегі нақты ақы бағасын алады.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  ledger role register --id "$ROLE_ID"
```

### 2. Мақсатты есептік жазбаға арналған рұқсатты қосыңыз {#_2-add-a-permission-scoped-to-the-target-account}

Рұқсат қағаздары JSON типтес объектілер болып табылады. Есепшотты `payload` ішінде I105 ID ретінде сақтаңыз; ескілеш (alias) осы қатал өрісте жарамсыз.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Рөльді өкілге тағайындаңыз {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

Рөлдер мен олардың құқықтары мерзімсіз болады. Қол жеткізу қажет болмаған жағдайда оларды нақты түрде қайтарыңыз.

### 4. Бөліп берілген рұқсатты орындау {#_4-exercise-the-delegated-permission}

Жазу үшін делегаттың криптографиялық қолтаңбасын және комиссия балансын пайдаланыңыз. JSON мәндері стандартты енгізуден оқылады.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

Дәл осы модель Rust клиенттеріне де қолжетімді. Мұнда `client` — `registrar_account` ретінде қол қоятын `iroha::blocking::Client`; CLI ағынындағыдай, бұл есептік жазба рөлдің бастапқы иесі болады. Үш есептік жазба айнымалысының бәрі алдын ала талданған `AccountId` мәндері:

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

## Растау {#verify}

Өкілдің рөлдер арқылы берілген рұқсаттарды да қамтитын қолданыстағы рұқсаттарын оқыңыз, содан кейін өкіл жазған нақты мәнді оқыңыз:

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

Өкілдің қолданыстағы рұқсаттарында `TARGET_ACCOUNT` ауқымымен шектелген `CanModifyAccountMetadata` болуы керек, ал метадеректерді оқу `"delegated"` қайтаруы тиіс. Torii қол қойылған сұраулар арқылы рөлдер тізімін бермейді, сондықтан тағайындауды тексеру қолданыстағы рұқсаттар тізімі арқылы жүргізіледі.

## Ақауларды жою {#troubleshooting}

- Рөлді тіркеу, өңдеу немесе тағайындау кезіндегі `Not permitted` қол қоюшыда Taira-да қажетті өкілеттік жоқ екенін білдіреді. Ауқыммен шектелген токенді жаһандық токенмен алмастырмаңыз; нақты рұқсат беруді сұраңыз.
- Payload талдау қатесі әдетте `account` `payload` қасына қойылғанын, I105 идентификаторының орнына лақап ат берілгенін немесе JSON мәні екі рет тырнақшаға алынғанын білдіреді.
- Ақының қабылданбауы сол қадамды жіберетін қол қоюшыға қатысты. Басқарушы мен өкілді әр ақы бағасында көрсетілген ақы активімен бөлек қаржыландырыңыз.
- Сәтті рөлді беру оның токендерінде кодталған ауқымды тізімдемейді. Бұл рөл рұқсат жүктемесінде көрсетілген есептік жазбаны ғана өзгерте алады.
- Тазалау үшін `account role revoke`, содан кейін `ledger role permission revoke` және соңында `ledger role unregister` орындаңыз; әрқайсысы бөлек жазу операциясы және `--fee-payer authority` қамтуы керек.

## Дереккөз және қатысты құжаттар {#source-and-related-docs}

- [Тиылған бастапқы код нұсқасындағы рөл интеграция сынақтары](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/roles.rs)
- [Рұқсаттарды біріктіру тесттері бекітілген бастапқы код нұсқасында](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/permissions.rs)
- [Бекітілген көз-код нұсқасындағы кірістірілген рұқсат деректер моделі](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/permission.rs)
- [Рұқсаттар мен рөлдер](/kk/blockchain/permissions.md)
- [Рұқсат қағазының сілтемесі](/kk/reference/permissions.md)
- [Метадеректер](./metadata.md)
