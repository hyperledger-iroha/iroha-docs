---
translation_locale: kk
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 7ee18275d25837da53f533f5e9205906ccaa71b48afd9b11ffad79b599da7f21
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Рұқсаттар мен рөлдер {#permissions-and-roles}

## Нәтижесі {#outcome}

Бір тіркелгіге бір нақты тіркелгідегі метамәліметтерді жаңартуға рұқсат беретін рөлді құру, оны делегатқа тағайындау, берілген жазуды дәлелдеу және тиісті Rust түрленген нұсқауларды көрсету.

## Алдын ала талаптар {#prerequisites}

- Taira қаржыландырылған клиенті мен ақының метамәдени деректері [Осы Taira-ге қосылады](./connect-to-taira.md).
- `TARGET_ACCOUNT` және `DELEGATE_ACCOUNT` каноникалық болып белгіленеді I105 есеп IDs.
- Қолтаңбалау тіркелгісіне мақсатты рұқсаттар мен рөлдерді басқаруға рұқсат етілуі тиіс. Taira - бұл рұқсатпен бекітілген әкімшілік операция; `CanManageRoles` және ауқымдалған рұқсаттарды беру үшін қажетті органды алу немесе рецептті генерируші жергілікті желіде орындау.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

Жазуды дәлелдеген кезде делегаттың екінші клиент конфигурациясын қолданыңыз:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## Қадамдар {#steps}

### 1. Бос рөлді тіркеңіз {#_1-register-an-empty-role}

Әрбір CLI мемлекеттік өзгеру командасы алым төлеушінің аты-жөнін айқын атайды. Метадеректер файлында қазіргі Taira төлем активтері бар, олар кранның жауаптан алынған.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. Мақсатты тіркелгіге ауқымдағы рұқсатты қосу {#_2-add-a-permission-scoped-to-the-target-account}

Рұқсат белгілері JSON нысандары түрлендіріледі. Есепті `payload` ішінде I105 ID ретінде сақтаңыз; бұл қатаң өрісінде аты-жөн жарамды емес.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Тапсырыс берушіге тапсырма беру {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

Рөлдер мен олардың гранттары аяқталмайды, оларға қол жеткізудің қажеті болмаған кезде оларды айрықша қайтарып алу керек.

### 4. Делегацияланған рұқсатты қолдану {#_4-exercise-the-delegated-permission}

JSON мәндері стандартты кіруден оқылады.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

Rust клиенттеріне бірдей модель қол жетімді. Мұнда `client` `registrar_account` ретінде белгіленеді, ол CLI ағында сияқты рөлдің бастапқы иесі болады. Үш шоттың айнымалысының бәрі `AccountId` мәндерін қазірдің өзінде зерттейді:

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

## Тексеру {#verify}

Тапсырманың екі жағын келтіріңіз, содан кейін делегаттың жазған нақты мәнін оқыңыз:

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

Рұқсаттар тізімінде `CanModifyAccountMetadata` `TARGET_ACCOUNT`-ға арналған, делегаттың рөлдер тізімінда `ROLE_ID` болуы тиіс және оқылған метамәлі деректерде `"delegated"` қайтарылуы керек.

## Қиындықтарды шешу {#troubleshooting}

- `Not permitted` рөлді тіркеу, өңдеу немесе тағайындау кезінде қол қоюшының қажетті Taira өкілеттігі жоқ екенін білдіреді. Токенді жалпыға ортақ белгімен алмастырыңыз; нақты грантты сұраңыз немесе localnet-ті қолданыңыз.
- Пайдалы жүктемелерді талдау қатесі әдетте `account` жанына орналастырылды `payload`, есімді аты-жөн берілді I105 ID, немесе JSON бағасы екі рет келтірілген.
- Төлемнің қабылданбауы осы қадамды ұсынған қол қоюшыға тиесілі. Басқарушыны қаржыландырып, тәуелсіз өкілеттік береді және краннан алынған алым активінің метамәдени деректерін сақтайды.
- Жетісті рөлді беру оның токендерінде кодталған ауқымынан асып түспейді. Бұл рөл рұқсат жүктемесінде аталған шотты ғана өзгерте алады.
- Тазалау үшін `ledger account role revoke`, содан кейін `ledger role permission revoke` және ақырында `ledger role unregister` орындаңыз; әрқайсысы бөлек жазу болып табылады және `--fee-payer authority` мен алым метамәліметтерін қамтуы керек.

## Бастапқы және осыған байланысты құжаттар {#source-and-related-docs}

- [Тіркелген жүктемеде рөлді интеграциялау сынақтары](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [Тіркелген жүктемеде рұқсат беру интеграциясының сынақтары](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)
- [Тіркелген commit-де ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs) енгізілген рұқсаттар дерек үлгісі
- [Рұқсаттар және рөлдер](/kk/blockchain/permissions.md)
- [Рұқсат белгісінің сілтемесі](/kk/reference/permissions.md)
- [Метамәліметтер](./metadata.md)
