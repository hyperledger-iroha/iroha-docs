---
translation_locale: kk
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 8d6fd7101094ba21cfc2c5fb9a89d2acd7e67f13ff47b9f8c8e01bbbd7bf2836
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Рұқсаттар мен рөлдер {#permissions-and-roles}

## Нәтиже {#outcome}

Бір есептік жазбаның бір нақты есептік жазбадағы метадеректерді жаңартуға рұқсат беретін рөл жасаңыз, оны делегатқа тағайындаңыз, делегирлеп жазуды дәлелдеңіз және сәйкес типтелген Rust нұсқауларын көрсетіңіз.

## Алдын ала шарттар {#prerequisites}

- [Taira құрылғысына қосылу](./connect-to-taira.md)-дан қаржыландырылған Taira клиент және төлем метадеректері.
- `TARGET_ACCOUNT` және `DELEGATE_ACCOUNT` бір протокол стандартты I105 есептік жазба идентификаторларына орнатылды.
- Қолы қойылатын есептік жазба мақсатты рұқсат пен рөлдерді басқаруға рұқсат етілуі тиіс. Taira жүйесінде бұл рұқсатпен шектелген әкімшілік операция; `CanManageRoles`-ді және шектелген рұқсатты беру үшін қажетті авторизацияны алу, немесе рецептіні жасалған локалды желіде іске қосу қажет.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
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

Әрбір күйді өзгертуге арналған CLI командасы төлем жасаушыны нақты атайды. Метадеректер файлы ағымдағы Taira төлем активін қамтиды, ол тесттік желіні қаржыландыру қызметінің жауабынан алынған.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. Мақсатты есептік жазбаға арналған рұқсатты қосыңыз {#_2-add-a-permission-scoped-to-the-target-account}

Рұқсат қағаздары JSON типтес объектілер болып табылады. Есепшотты `payload` ішінде I105 ID ретінде сақтаңыз; ескілеш (alias) осы қатал өрісте жарамсыз.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Рөльді өкілге тағайындаңыз {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
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
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

Аталған модель Rust клиенттеріне де қолжетімді. Мұнда `client` `registrar_account` ретінде қол қояды, бұл рөлдің бастапқы иесі болып табылады, дәл CLI ағынында болатын сияқты. Үш есептік айнымалының барлығы `AccountId` мәндері ретінде алдын ала талданған:

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

## Растау {#verify}

Тапсырманың екі жағын да тізіп шығыңыз, содан кейін делегат жазған нақты мәнді оқыңыз:

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

Рұқсат тізімінде `CanModifyAccountMetadata` `TARGET_ACCOUNT` ауқымында болуы тиіс, өкілдің рөл тізімінде `ROLE_ID` болуы керек, және метадеректерді оқу `"delegated"` қайтаруы керек.

## Ақауларды жою {#troubleshooting}

- `Not permitted` тіркелу, редакциялау немесе рөлді тағайындау кезінде криптографиялық қол қоюшыда қажетті Taira уәкілетті субъект жоқ дегенді білдіреді. Ауқымды токенді ғаламдық токенмен алмастырмаңыз; дәл берілген рұқсатты сұраңыз немесе localnet пайдаланыңыз.
- Payload талдау қатесі әдетте `account` `payload` қасына қойылғанын, I105 идентификаторының орнына лақап ат берілгенін немесе JSON мәні екі рет тырнақшаға алынғанын білдіреді.
- Ақыны қабылдамау сол қадамды ұсынатын криптографиялық қолтаңба иесіне жатады. Басқарушыны қаржыландырыңыз және делегаттаңыз және краннан алынған ақы активінің метадеректерін сақтаңыз.
- Сәтті рөлді беру оның токендерінде кодталған ауқымды тізімдемейді. Бұл рөл рұқсат жүктемесінде көрсетілген есептік жазбаны ғана өзгерте алады.
- Тазалау үшін алдымен `ledger account role revoke`, содан кейін `ledger role permission revoke`, және соңында `ledger role unregister` орындаңыз; әрқайсысы бөлек жазу болып табылады және `--fee-payer authority` пен төлем метадеректерін қамтуы керек.

## Дереккөз және қатысты құжаттар {#source-and-related-docs}

- [Тиылған бастапқы код нұсқасындағы рөл интеграция сынақтары](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [Рұқсаттарды біріктіру тесттері бекітілген бастапқы код нұсқасында](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)
- [Бекітілген көз-код нұсқасындағы кірістірілген рұқсат деректер моделі](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs)
- [Рұқсаттар мен рөлдер](/kk/blockchain/permissions.md)
- [Рұқсат қағазының сілтемесі](/kk/reference/permissions.md)
- [Метадеректер](./metadata.md)
