---
translation_locale: ru
translation_source: /cookbook/multisig.md
translation_source_hash: e1b57e1c4310dd0db8be8d9f5a15e1d4f693abb90b634772857eb4b1e86e4baf
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Взвешенный мультиподписной {#weighted-multisig}

## Результат {#outcome}

Зарегистрируйте многоподписной аккаунт с тремя участниками и взвешенными подписями на Taira, предложите инструкцию метаданных, одобрите её с достаточным весом для достижения кворума и проверьте выполнение из состояния многоподписного аккаунта.

## Предварительные требования {#prerequisites}

- Три канонических идентификатора подписантов I105 в `SIGNER_A`, `SIGNER_B` и `SIGNER_C`.
- Профинансированы Taira конфигурации для криптографических подписантов A и C. Предложитель и каждый утверждающий платят за свою собственную транзакцию.
- `taira.tx-metadata.json` создан на основе текущего ответа службы финансирования тестовой сети, никогда не из скопированного ID платёжного актива.
- Проект клиента Rust закреплен за той же исходной ревизией Iroha, что и Taira, для шага регистрации. Последующие шаги предложения и утверждения используют CLI.
- Функция мультиподписей текущего исполнителя включена. Регистрация доступна обычным аккаунтам в стандартной среде выполнения программного обеспечения Iroha 3, хотя политика Taira и взимание платы за допуск по-прежнему применяются; используйте localnet, если публичный развертывание отказывает в этом.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Шаги {#steps}

### 1. Зарегистрируйте взвешенную политику {#_1-register-a-weighted-policy}

криптографический подписант C имеет вес 2; A и B имеют вес 1 каждый. Кворум из 3, следовательно, требует C плюс либо A, либо B. Получите канонический аккаунт из этой точной политики до регистрации, затем передайте то же значение в `MultisigRegister::with_account`:

```rust
use std::{collections::BTreeMap, num::{NonZeroU16, NonZeroU64}};
use iroha::{
    data_model::{
        account::{MultisigMember, MultisigPolicy},
        prelude::*,
        transaction::FeePaymentIntent,
    },
    executor_data_model::isi::multisig::{
        MultisigApprove, MultisigPropose, MultisigRegister, MultisigSpec,
    },
};

let spec = MultisigSpec::new(
    BTreeMap::from([
        (signer_a.clone(), 1),
        (signer_b.clone(), 1),
        (signer_c.clone(), 2),
    ]),
    NonZeroU16::new(3).unwrap(),
    NonZeroU64::new(3_600_000).unwrap(),
);
let members = spec
    .signatories
    .iter()
    .map(|(account, weight)| {
        let key = account
            .controller()
            .single_signatory()
            .expect("multisig members must be single-key accounts");
        MultisigMember::new(key.clone(), u16::from(*weight))
            .expect("weights are nonzero")
    })
    .collect();
let policy = MultisigPolicy::new(spec.quorum.get(), members)?;
let multisig_account = AccountId::new_multisig(policy);
let register = MultisigRegister::with_account(
    multisig_account.clone(),
    None::<DomainId>,
    spec,
);

registrar.submit_blocking::<InstructionBox>(
    register.into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
println!("{}", multisig_account.canonical_i105()?);
```

Сохраните распечатанное значение для шагов CLI:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

На закрепленной версии исходного кода команда регистрации CLI выводит свой временный seed до того, как время выполнения программного обеспечения изменит его ключ. Не используйте этот seed повторно в качестве контроллера. Приватного ключа контроллера нет: принцип авторизации multisig исходит только из одобренных предложений.

### 2. Создайте одну инструкцию, не отправляя её {#_2-build-one-instruction-without-submitting-it}

Глобальный переключатель `-o` сериализует массив инструкций в стандартный вывод. Он не отправляет транзакцию и, следовательно, не тратит комиссию.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. Предложить в качестве криптографического подписанта A {#_3-propose-as-signer-a}

Предлагающий автоматически вносит свой собственный вес. Зафиксируйте точный криптографический хэш инструкции, напечатанный на CLI; одобрения привязываются к этому криптографическому хэшу.

```bash
PROPOSE_OUTPUT="$({
  iroha --config "$SIGNER_A_CONFIG" \
    --output-format text \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger multisig propose \
    --account "$MULTISIG_ACCOUNT" \
    < multisig-instructions.json
})"
printf '%s\n' "$PROPOSE_OUTPUT"

INSTRUCTIONS_HASH="$({
  printf '%s\n' "$PROPOSE_OUTPUT" |
    sed -n 's/^instructions_hash: //p' |
    head -n 1
})"
test -n "$INSTRUCTIONS_HASH"
```

Перечислите все еще ожидающие предложения с явным конечным селектором:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. Утвердить в качестве криптографического подписанта C {#_4-approve-as-signer-c}

Вес A равен 1, вес C равен 2, что достигает кворума 3, и выполняет предложенную инструкцию от имени мультиподписного аккаунта.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Клиент Rust может продолжить с тем же аккаунтом, полученным из политики, и двумя приведёнными выше инструкциями жизненного цикла:

```rust
let instructions = vec![SetKeyValue::account(
    multisig_account.clone(),
    "cookbook_quorum".parse()?,
    Json::from("approved"),
).into()];
let instructions_hash = HashOf::new(&instructions);
signer_a_client.submit_blocking::<InstructionBox>(
    MultisigPropose::new(multisig_account.clone(), instructions, None).into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
signer_c_client.submit_blocking::<InstructionBox>(
    MultisigApprove::new(multisig_account, instructions_hash).into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## Проверить {#verify}

Прочитайте состояние после и подтвердите, что предложение больше не находится в ожидании:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger account meta get \
  --id "$MULTISIG_ACCOUNT" \
  --key cookbook_quorum

iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"

iroha --config "$SIGNER_A_CONFIG" ledger multisig inspect \
  --account "$MULTISIG_ACCOUNT" \
  --json |
  jq .
```

Значение метаданных должно быть `"approved"`, криптографический хэш полученной инструкции больше не должен отображаться как ожидающий, а проверенный контроллер должен показывать веса `1, 1, 2` с кворумом `3`.

## Устранение неполадок {#troubleshooting}

- `signatory is not part of multisig` означает, что предлагающий или утверждающий клиент не соответствует ни одному из зарегистрированных в полисе идентификаторов I105.
- Окончательное одобрение может быть отклонено, если мультиподписной аккаунт не имеет разрешения на выполнение предложенных инструкций. Предоставьте полномочия для выполнения действий мультиподписному аккаунту, а не только его отдельным криптографическим подписантам, затем дайте оставшемуся криптографическому подписанту повторить попытку.
- Отсутствующий ожидающий предложения может означать, что кворум уже достигнут, TTL истёк или использовался неверный хэш инструкции/селектор аккаунта. Запросите пост-состояние перед повторным предложением.
- Дублирующие подтверждения не добавляют веса. Каждый зарегистрированный подписант вносит свой настроенный вес не более одного раза.
- Прямое подписание обычной транзакции в качестве контролёра запрещено. Всегда используйте `MultisigPropose` и `MultisigApprove`.
- Если последующие команды не могут найти аккаунт, напечатанный во время регистрации CLI, вы захватили временный ключ. Получите канонический аккаунт из упорядоченной политики и зарегистрируйте его с этим значением, как показано выше.

## Источник и связанные документы {#source-and-related-docs}

- [Тесты интеграции мультиподписи на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/multisig.rs)
- [Модель данных Multisig на закрепленной ревизии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/isi.rs)
- [CLI реализация мультиподписей на закреплённой версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Транзакции](/ru/blockchain/transactions.md)
- [Разрешения и роли](./permissions-and-roles.md)
