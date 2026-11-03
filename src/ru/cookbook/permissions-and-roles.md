---
translation_locale: ru
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 40fe8b19344d8eff66b178dc8576e2e049fef50bd3212fbddc5c0d5f7f37fa03
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Разрешения и роли {#permissions-and-roles}

## Результат {#outcome}

Создайте роль, которая предоставляет одной учетной записи разрешение на обновление метаданных на одной конкретной учетной записи, назначьте ее делегату, подтвердите делегированное право на запись и покажите соответствующие типизированные инструкции Rust.

## Предварительные требования {#prerequisites}

- Финансируемый клиент Taira из [Подключиться к Taira](./connect-to-taira.md).
- `TARGET_ACCOUNT` и `DELEGATE_ACCOUNT` установлены на канонические идентификаторы учетной записи I105.
- Подписывающий аккаунт должен иметь `CanManageRoles` и должен иметь возможность делегировать ограниченное разрешение: это сам `TARGET_ACCOUNT` или аккаунт, уже имеющий `CanModifyAccountMetadata` для этого аккаунта. На Taira это административная операция с ограничением по разрешениям. Клиент сгенерированной локальной сети не имеет `CanManageRoles`, поэтому для рецепта нужна сеть, генезис которой предоставляет это разрешение.

```bash
CONFIG=./taira.client.toml
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

Каждая команда CLI, изменяющая состояние, явно указывает плательщика комиссии. CLI получает точную котировку комиссии в активе комиссии Taira до подписания.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  ledger role register --id "$ROLE_ID"
```

### 2. Добавьте разрешение, ограниченное целевой учетной записью {#_2-add-a-permission-scoped-to-the-target-account}

Токены разрешений являются объектами типа JSON. Сохраняйте учетную запись внутри `payload` как идентификатор I105; псевдоним недопустим в этом строгом поле.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Назначьте эту роль делегату {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  account role grant \
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
    account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

Та же модель доступна клиентам Rust. Здесь `client` — это `iroha::blocking::Client`, который подписывает как `registrar_account`, становящийся первоначальным владельцем роли так же, как и в процессе CLI. Все три переменные учетной записи уже разобраны как значения `AccountId`:

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

## Проверить {#verify}

Прочитайте действующие разрешения делегата, включающие разрешения, полученные через роли, а затем прочитайте точное значение, записанное делегатом:

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

Действующие разрешения делегата должны содержать `CanModifyAccountMetadata` с областью `TARGET_ACCOUNT`, а чтение метаданных должно возвращать `"delegated"`. Torii отклоняет получение списков ролей через подписанные запросы, поэтому проверкой назначения служит список действующих разрешений.

## Устранение неполадок {#troubleshooting}

- `Not permitted` при регистрации, редактировании или назначении роли означает, что у криптографического подписанта нет необходимых полномочий Taira. Не заменяйте ограниченный токен на глобальный; запросите точное разрешение.
- Ошибка разбора полезной нагрузки обычно означает, что `account` был помещён рядом с `payload`, был предоставлен псевдоним вместо идентификатора I105, или значение JSON было заключено в кавычки дважды.
- Отклонение комиссии относится к криптографическому подписанту, подавшему этот шаг. Пополните баланс менеджера и делегата независимо друг от друга в активе комиссии, указанном в каждой котировке комиссии.
- Успешное предоставление роли не отменяет область, закодированную в его токенах. Эта роль может изменять только учетную запись, указанную в полезной нагрузке разрешений.
- Для очистки выполните `account role revoke`, затем `ledger role permission revoke` и наконец `ledger role unregister`; каждая команда — отдельная запись и должна включать `--fee-payer authority`.

## Исходные и связанные документы {#source-and-related-docs}

- [Интеграционные тесты роли на зафиксированной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/roles.rs)
- [Тесты интеграции разрешений на закрепленной ревизии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/permissions.rs)
- [Встроенная модель данных разрешений на закреплённой версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/permission.rs)
- [Разрешения и роли](/ru/blockchain/permissions.md)
- [Ссылка на токен разрешения](/ru/reference/permissions.md)
- [Метаданные](./metadata.md)
