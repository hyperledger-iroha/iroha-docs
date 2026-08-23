---
translation_locale: ru
translation_source: /cookbook/triggers.md
translation_source_hash: 93080591f5171c7ce25173eb1ef826d6f5ca661a17797be53e90aedab33ed0c3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Взрывки {#triggers}

## Результат {#outcome}

Зарегистрируйте конечный аккумулятор призывов на Taira, выполните его один раз, подождите окончательность приложений и подтвердите его успешное завершение из истории обязательных блоков.

## Предварительные условия {#prerequisites}

- Финансируемый подписант, `taira.client.toml`, `taira.tx-metadata.json`, и `TAIRA_ACCOUNT_ID` от [Подключить к Taira](./connect-to-taira.md).
- Taira разрешение на регистрацию запуска для `TAIRA_ACCOUNT_ID` и выполнение полученного запуска. Соответствующие токены имеют значение `CanRegisterTrigger` по `authority` и `CanExecuteTrigger` по `trigger`.
- Если эти гранты недоступны, используйте создаваемую локальную сеть и ее администраторский клиент. Учредитель также нуждается в каждом разрешении, требуемом инструкциями, которые будет выполняться.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## Шаги {#steps}

### 1. Зарегистрируйте зажигатель с указанием {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` принимает массив инструкций JSON. Инструкция `Log` сохраняет этот пример ориентированным на разрешение запуска, а не на разрешения второго объекта реестра.

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

Запускчик может запускаться максимум три раза. Его объявленный авторитет, а не вызвающий, который случайно его выполняет, разрешает инструкции внутри действия.

### 2. Перед исполнением проверяйте декларацию {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Подтвердите полномочия I105, фильтр выполнения, оставшиеся повторения и однократное указание `Log`, прежде чем заплатить еще одну плату.

### 3. Исполнить и ждать обоих слоев {#_3-execute-and-wait-for-both-layers}

Транзакция выполнения и действие запуска имеют разные доказательства. `--wait` ожидает окончательности применяемой транзакции; `--trace` также сообщает о диагностике завершения работы в runtime.

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

Клиенты Rust создают одни и те же два типовых инструкции. Здесь `authority` - знак `AccountId` и `client` как этот счет:

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

## Проверка {#verify}

Сканируйте историю заданных блоков для завершения и проверьте количество уменьшенного повторения:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

По крайней мере, одно завершение должно сообщить о успехе. Запуск должен оставаться активным с двумя выполнениями. Успешное представление без успешного завершения запуска не является достаточным подтверждением.

## Устранение неполадок {#troubleshooting}

- Отказ в регистрации как не допустимый означает, что подписавшего отсутствует `CanRegisterTrigger` для декларируемого органа. `CanExecuteTrigger` Токен.
- Транзакция может достичь Applied, пока действие запуска сообщает об отказе. Прочитайте результат завершения и ошибку; затем проверьте разрешения органа запуска для каждого встроенного указания.
- `trigger not found` может означать, что регистрационная сделка была отклонена или для выполнения использовалась другая конфигурация Torii/цепочка.
- Когда повторения достигают нуля, создавать больше повторений - это еще одно привилегированное письмо. Не меняйте этот рецепт на неопределенное время.
- Для очистки `ledger trigger unregister --id "$TRIGGER_ID"` требует `CanUnregisterTrigger` для этого триггера плюс явный выбор платы.

## Источник и связанные с ним документы {#source-and-related-docs}

- [Тесты интеграции при вызове запуска на финированном комитете](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/triggers/by_call_trigger.rs)
- [Тесты интеграции событий и запуска на финированном commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/events_and_triggers.rs)
- [Исполнение инструкции триггера на закрепленном commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [Триггеры](/ru/blockchain/triggers.md)
- [Примеры триггеров](/ru/blockchain/trigger-examples.md)
- [События](./stream-events.md)
