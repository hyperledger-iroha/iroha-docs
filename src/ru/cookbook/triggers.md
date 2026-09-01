---
translation_locale: ru
translation_source: /cookbook/triggers.md
translation_source_hash: 5267fb9bb232d52d9df4bedee414d745ccc30dd52cbc30993df3c5b975a0bc38
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Триггеры {#triggers}

## Результат {#outcome}

Зарегистрируйте конечный вспомогательный триггер вызова на Taira, выполните его один раз, дождитесь применённой окончательности и подтвердите его успешное завершение из истории финализированных блоков.

## Предварительные требования {#prerequisites}

- Финансируемый криптографический подписант, `taira.client.toml`, `taira.tx-metadata.json` и `TAIRA_ACCOUNT_ID` из [Подключиться к Taira](./connect-to-taira.md).
- Taira разрешение на регистрацию триггера для `TAIRA_ACCOUNT_ID` и выполнение возникшего триггера. Соответствующие токены — `CanRegisterTrigger`, ограниченный `authority`, и `CanExecuteTrigger`, ограниченный `trigger`.
- Если эти гранты недоступны, используйте сгенерированную локальную сеть и её клиент-администратора. Главный субъект авторизации триггера также нуждается во всех разрешениях, требуемых инструкциями, которые будет выполнять триггер.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## Шаги {#steps}

### 1. Зарегистрируйте триггер с поддержкой инструкции {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` принимает массив инструкций JSON. Инструкция `Log` сохраняет фокус этого примера на авторизации триггера, а не на разрешениях второго объекта распределенного реестра блокчейна.

```bash
printf '%s\n' \
  '[{"Log":{"level":"INFO","message":"cookbook trigger executed"}}]' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger trigger register \
    --id "$TRIGGER_ID" \
    --instructions-stdin \
    --repeats 3 \
    --authority "$TAIRA_ACCOUNT_ID" \
    --filter execute
```

Триггер может выполняться не более трех раз. Авторизующий субъект, указанный при его объявлении, а не клиент, который случайно его запускает, выполняет авторизацию инструкций внутри действия.

### 2. Проверьте декларацию перед выполнением {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Подтвердите основной принцип авторизации I105, фильтр выполнения, оставшиеся повторения и единственную инструкцию `Log` перед тем, как потратить еще один сбор.

### 3. Выполните и дождитесь обеих слоев {#_3-execute-and-wait-for-both-layers}

Исполнительная транзакция и триггерное действие имеют различные доказательства. `--wait` ожидает окончательности применённой транзакции; `--trace` также сообщает диагностику завершения выполнения программного обеспечения.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger trigger execute \
  --wait \
  --trace \
  --timeout-ms 60000 \
  "$TRIGGER_ID"
```

Rust клиенты создают одни и те же два типа инструкций. Здесь `authority` является `AccountId`, а `client` подписывает как этот аккаунт:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};

let trigger_id: TriggerId = "cookbook_by_call_log".parse()?;
let action = Action::new(
    vec![Log::new(Level::INFO, "cookbook trigger executed".to_owned()).into()],
    Repeats::Exactly(3),
    authority.clone(),
    ExecuteTriggerEventFilter::new()
        .for_trigger(trigger_id.clone())
        .under_authority(authority),
);
let fee = FeePaymentIntent::authority(Vec::new(), None);

client.submit_blocking(Register::trigger(Trigger::new(trigger_id.clone(), action)), fee.clone())?;
client.submit_blocking(ExecuteTrigger::new(trigger_id), fee)?;
```

## Проверить {#verify}

Просканируйте историю завершенных блоков на предмет завершения и проверьте уменьшенное количество повторений:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

По крайней мере одно выполнение должно быть успешным. Триггер должен оставаться активным при двух оставшихся выполнениях. Успешная отправка без успешного выполнения триггера не является достаточной проверкой.

## Устранение неполадок {#troubleshooting}

- Регистрация отклонена, так как не разрешена, что означает, что криптографический подписант не имеет `CanRegisterTrigger` для заявленного полномочного субъекта. Выполнение требует отдельного токена `CanExecuteTrigger`.
- Транзакция может достичь состояния «Применено», в то время как действие триггера сообщает об ошибке. Прочитайте результат завершения и ошибку; затем проверьте разрешения субъекта авторизации триггера для каждой встроенной инструкции.
- `trigger not found` может означать, что транзакция регистрации была отклонена или для выполнения использовалась другая конфигурация Torii/цепочки.
- Когда количество повторений достигает нуля, выдача дополнительных повторений является другой привилегированной записью. Не изменяйте этот рецепт на бесконечный триггер без уведомления.
- Для очистки `ledger trigger unregister --id "$TRIGGER_ID"` требует `CanUnregisterTrigger` для этого триггера плюс явный выбор платы.

## Исходные и связанные документы {#source-and-related-docs}

- [Путём технического вызова триггерить интеграционные тесты на закреплённой версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/triggers/by_call_trigger.rs)
- [Тесты интеграции событий и триггеров на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events_and_triggers.rs)
- [Запустить выполнение инструкции на закрепленной ревизии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [Триггеры](/ru/blockchain/triggers.md)
- [Примеры триггеров](/ru/blockchain/trigger-examples.md)
- [События](./stream-events.md)
