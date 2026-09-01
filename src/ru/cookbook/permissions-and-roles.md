---
translation_locale: ru
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 8d6fd7101094ba21cfc2c5fb9a89d2acd7e67f13ff47b9f8c8e01bbbd7bf2836
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Разрешения и роли {#permissions-and-roles}

## Результат {#outcome}

Создайте роль, которая предоставляет одной учетной записи разрешение на обновление метаданных на одной конкретной учетной записи, назначьте ее делегату, подтвердите делегированное право на запись и покажите соответствующие типизированные инструкции Rust.

## Предварительные требования {#prerequisites}

- Финансируемый клиент Taira и метаданные по сбору с [Подключиться к Taira](./connect-to-taira.md).
- `TARGET_ACCOUNT` и `DELEGATE_ACCOUNT` установлены на канонические идентификаторы учетной записи I105.
- Аккаунт, выполняющий подпись, должен иметь разрешение на управление целевыми правами и ролями. На Taira это административная операция с ограничением по разрешениям; получите `CanManageRoles` и главный элемент авторизации, необходимый для предоставления разрешения в пределах области действия, или выполните рецепт в созданной локальной сети.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

Используйте вторую конфигурацию клиента для делегата при подтверждении записи:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## Шаги {#steps}

### 1. Зарегистрировать пустую роль {#_1-register-an-empty-role}

Каждая команда, изменяющая состояние CLI, явно указывает плательщика комиссии. Файл метаданных содержит текущий Taira комиссионный актив, полученный из ответа сервиса финансирования тестовой сети.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. Добавьте разрешение, ограниченное целевой учетной записью {#_2-add-a-permission-scoped-to-the-target-account}

Токены разрешений являются объектами типа JSON. Сохраняйте учетную запись внутри `payload` как идентификатор I105; псевдоним недопустим в этом строгом поле.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Назначьте эту роль делегату {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

Роли и их права не истекают. Отзывайте их явно, когда доступ больше не нужен.

### 4. Выполните делегированное разрешение {#_4-exercise-the-delegated-permission}

Используйте криптографическую подпись делегата и баланс комиссии для записи. Значения JSON считываются с стандартного ввода.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

Та же модель доступна клиентам Rust. Здесь `client` подписывает как `registrar_account`, который становится первоначальным владельцем роли так же, как и в процессе CLI. Все три переменные учетной записи уже разобраны как значения `AccountId`:

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

## Проверить {#verify}

Перечислите обе стороны задания, а затем прочитайте точное значение, указанное делегатом:

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

Список разрешений должен содержать `CanModifyAccountMetadata` с областью `TARGET_ACCOUNT`, список ролей делегата должен содержать `ROLE_ID`, а чтение метаданных должно возвращать `"delegated"`.

## Устранение неполадок {#troubleshooting}

- `Not permitted` при регистрации, редактировании или назначении роли означает, что криптографический подписант не имеет необходимого Taira полномочного лица. Не заменяйте ограниченный токен на глобальный; запросите точное разрешение или используйте localnet.
- Ошибка разбора полезной нагрузки обычно означает, что `account` был помещён рядом с `payload`, был предоставлен псевдоним вместо идентификатора I105, или значение JSON было заключено в кавычки дважды.
- Отклонение комиссии принадлежит криптографическому подписанту, подавшему этот шаг. Финансируйте менеджера и делегируйте независимо и сохраняйте метаданные активов комиссии, полученной из крана.
- Успешное предоставление роли не отменяет область, закодированную в его токенах. Эта роль может изменять только учетную запись, указанную в полезной нагрузке разрешений.
- Чтобы очистить, выполните `ledger account role revoke`, затем `ledger role permission revoke`, и наконец `ledger role unregister`; каждая выполняется отдельно и должна включать `--fee-payer authority` и метаданные комиссии.

## Исходные и связанные документы {#source-and-related-docs}

- [Интеграционные тесты роли на зафиксированной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [Тесты интеграции разрешений на закрепленной ревизии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)
- [Встроенная модель данных разрешений на закреплённой версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs)
- [Разрешения и роли](/ru/blockchain/permissions.md)
- [Ссылка на токен разрешения](/ru/reference/permissions.md)
- [Метаданные](./metadata.md)
