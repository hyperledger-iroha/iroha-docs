---
translation_locale: ru
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 7ee18275d25837da53f533f5e9205906ccaa71b48afd9b11ffad79b599da7f21
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Разрешения и роли {#permissions-and-roles}

## Результат {#outcome}

Создать роль, которая дает разрешение одной учетной записи на обновление метаданных в одной конкретной учетной записи, присвоить ее делегующему, доказать делегированную запись и показать соответствующие инструкции Rust, напечатанные.

## Предварительные условия {#prerequisites}

- Метаданные финансируемого Taira клиента и сборов от [Свяжитесь к Taira](./connect-to-taira.md).
- `TARGET_ACCOUNT` и `DELEGATE_ACCOUNT` установлен в каноническом I105 счета IDs.
- Счет подписи должен иметь возможность управлять целевыми разрешениями и функциями. На Taira это административная операция с разрешением; получать `CanManageRoles` и орган, необходимый для выдачи разрешения по назначению, или запускать рецепт в генерируемой локальной сети.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

Используйте вторую конфигурацию клиента для делегированного при проверке записи:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## Шаги {#steps}

### 1. Зарегистрировать пустую роль {#_1-register-an-empty-role}

Каждое изменение состояния команды CLI называет плательщика платы явно. Файл метаданных содержит текущий актив Taira платы, полученный из ответа на кранок.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. Добавьте в целевой учетную запись разрешение с определенным объемом {#_2-add-a-permission-scoped-to-the-target-account}

Токены разрешения печатаются объектами JSON. Сохраняйте учетную запись внутри `payload` как I105 ID; псевдоним не действительен в этом строгом поле.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Предоставить роль делегату {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

Роли и их гранты не истекают, они отзываются прямо, когда доступ больше не нужен.

### 4. Использовать предоставленное разрешение {#_4-exercise-the-delegated-permission}

Используйте подпись делегата и баланс сборов для написания. JSON значения прочитываются из стандартного ввода.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

Та же модель доступна для: Rust Клиенты. `client` знаки как `registrar_account`, который становится первоначальным владельцем роли так же, как и в CLI Все три переменные счета уже проанализированы `AccountId` ценности:

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

## Проверка {#verify}

Перечисли обоих сторон задания, а затем читай точное значение, написанное делегатом:

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

Список разрешений должен содержать `CanModifyAccountMetadata` с охватом на `TARGET_ACCOUNT`, список ролей делегата должен содержать`ROLE_ID`, а метаданные, прочитанные, должны возвращаться в `"delegated"`.

## Устранение неполадок {#troubleshooting}

- `Not permitted` при регистрации, редактировании или присвоении роли означает, что подписавшему отсутствует требуемый Taira авторитет. Не заменяйте токен с охватом глобальным; запросите точное предоставление или используйте localnet.
- Обычно ошибка в анализе полезной нагрузки означает, что `account` был помещен рядом с `payload`, вместо I105 ID был поставлен псевдоним или значение JSON было указано дважды.
- Отказ в оплате принадлежит подписавшемуся, подавшему этот шаг. Финансировать управляющего и делегировать самостоятельно, а также хранить метаданные актива по сборам, полученным из трубки.
- Успешное предоставление ролей не превышает рамки, зашифрованные в своих токенах. Эта роль может изменять только учетную запись, названную в полезной нагрузке разрешений.
- Для очистки запустить `ledger account role revoke`, затем `ledger role permission revoke` и, наконец, `ledger role unregister`; каждый из них является отдельной записью и должен включать в себя metadata о `--fee-payer authority` и сборах.

## Источник и связанные с ним документы {#source-and-related-docs}

- [Тесты интеграции ролей на финированном комитете](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [Тесты интеграции разрешений на финированном обязательстве](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)
- [Встроенная модель данных разрешений на закрепленном commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs)
- [Разрешения и роли](/ru/blockchain/permissions.md)
- [Ссылка на разрешительные токены](/ru/reference/permissions.md)
- [Метаданные](./metadata.md)
