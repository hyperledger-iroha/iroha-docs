---
translation_locale: ru
translation_source: /cookbook/multisig.md
translation_source_hash: 9654923faf6c84dfd21a428ebe3c53dbd074b8e3274c12c8aa41bf31884686f7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Весенный мультисиг {#weighted-multisig}

## Результат {#outcome}

Зарегистрируйте трехчленный взвешенный многозначный счет на Taira, предложите инструкцию по метаданным, утвердите его с достаточным весом для соответствия кворуму и проверьте исполнение с состояния многозначного счета.

## Предварительные условия {#prerequisites}

- Три канонических I105 подписчик IDs в `SIGNER_A`, `SIGNER_B`, и `SIGNER_C`.
- Финансируемые конфигурации Taira для подписчиков А и C. Предлагающий и каждый одобряющий платят за свою собственную транзакцию.
- `taira.tx-metadata.json` построенный из текущего ответа на трубку, никогда не из копированного актива сбора ID.
- А . Rust клиентский проект привязан к тому же Iroha пересмотр источника как Taira В последующих этапах предложения и одобрения используется CLI.
- Регистрация доступна для обычных счетов в течение default Iroha 3 runtime, хотя политика Taira и прием платы по-прежнему применяются; используйте localnet, если общественное развертывание отказывает.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Шаги {#steps}

### 1. Регистрировать взвешенную политику {#_1-register-a-weighted-policy}

Подпись C имеет вес 2; A и B имеют вес 1 каждый. Таким образом, кворум из 3 требует C плюс либо A или B. Выводите канонический счет из этой точной политики до регистрации, а затем передайте то же самое значение на `MultisigRegister::with_account`:

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

Сохранить напечатанное значение для шагов CLI:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

При закрепленном обязательстве регистрационная команда CLI печатает своё временное семя до того, как время выполнения перезагружает его. Не используйте это семя в качестве контролера. Не существует частного ключа контроллера: полномочия multisig исходят только из утвержденных предложений.

### 2. Составить одну инструкцию, не подавая ее {#_2-build-one-instruction-without-submitting-it}

Глобальный переключатель `-o` сериализирует массив инструкций на стандартный выход. Он не отправляет транзакцию и, следовательно, не расходует плату.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. Предложите подписать А. {#_3-propose-as-signer-a}

Предлагающий автоматически вносит свой собственный вес. Запишите точный хэш инструкции, напечатанный CLI; одобрения связываются с этим хэшем.

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

Перечислить предложение, которое еще не принято, с помощью четкого конечного выбора:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. Одобрить как подписитель С. {#_4-approve-as-signer-c}

Вес A 1 плюс вес C 2 достигает кворума 3 и выполняет предложенную инструкцию в качестве многозначного счета.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Клиент Rust может продолжать использовать один и тот же учетный счет, вытекающий из политики, а также две инструкции по жизненному цикле, используемые выше:

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

## Проверка {#verify}

Прочитайте последующее сообщение и подтвердите, что предложение больше не подлежит рассмотрению:

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

Стоимость метаданных должна быть `"approved"`, запечатленный хэш инструкции больше не должен отображаться как ожидающий, а проверенный контроллер должен показывать весы `1, 1, 2` с кворумом `3`.

## Устранение неполадок {#troubleshooting}

- `signatory is not part of multisig` означает, что предлагающий или одобряющий клиент не соответствует одному из зарегистрированных в полисе I105 IDs.
- Окончательное одобрение может быть отклонено, если многозначный счет не имеет разрешения на выполнение предложенных инструкций. Предоставьте полномочия многозначному счету, а не только его индивидуальным подписчикам, а затем пусть оставшийся подписитель попытается снова.
- Отсутствие предложения в ожидании может означать, что кворум уже достигнут, срок TTL истек или ошибочный инструкционный хэш/выборчик счета использовался.
- При повторном одобрении не добавляется веса.Каждый зарегистрированный подписитель вносит свой конфигурированный вес не более одного раза.
- Непосредственное подписание обычной транзакции, так как контроллер запрещен. `MultisigPropose` и `MultisigApprove`.
- Если последующие команды не могут найти запись, напечатанную во время регистрации CLI, вы захватили временное семя. Вывести канонический отчет из упорядоченной политики и зарегистрировать с этой стоимостью, как показано выше.

## Источник и связанные с ним документы {#source-and-related-docs}

- [Тесты интеграции Multisig на финированном commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/multisig.rs)
- [Мультисигная модель данных на финированном commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/isi.rs)
- [CLI многозначное выполнение на финированном комитете](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Сделки](/ru/blockchain/transactions.md)
- [Разрешения и роли](./permissions-and-roles.md)
