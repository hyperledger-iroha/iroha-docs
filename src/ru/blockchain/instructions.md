---
translation_locale: ru
translation_source: /blockchain/instructions.md
translation_source_hash: adc3eff9758dd73e9114e78eaa18ddf6271db3bc4042611e1ed6ed1aac226246
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Специальные инструкции {#iroha-special-instructions}

Когда мы говорили о [как Iroha действует](/ru/blockchain/iroha-explained), Мы сказали , что Iroha Специальные инструкции - это единственный способ изменить мировое состояние. Какие специальные инструкции у нас есть? Если вы прочитали конкретные языковые руководства в этом уроке, Вы уже видели пару инструкций: `Register<Account>` и `Mint<Numeric>`.

Вот полный перечень специальных инструкций Iroha:

|Инструкция |Описание |
| --------------------------------------------------------- | ------------------------------------------------ |
| [Регистрация/отпись ](#un-register) |Дайте ID новой организации на блокчейн. |
| [Монетка/Бурн](#mint-burn) |Цифровые активы Mint/burn или повторения запуска. |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |Обновление метаданных объектов блокчейна. |
| [SetParameter](#setparameter) |Установить параметр для цепочки. |
| [Грант/отмена](#grant-revoke) |Дать или удалять разрешения и роли. |
| [Передача ](#transfer) |Передача собственности или стоимости активов. |
| [Начальные депозитные и активные блокировки](#native-escrow-and-asset-locks) |Закрыть числовые активы в протокольном хранении. |
| [ExecuteTrigger](#executetrigger) |Используйте триггеры. |
| [Регистрация/настройка/совершенствование ](#other-instructions) |Зарегистрировать, продлить или улучшить поведение запуска. |

Давайте начнём с резюме Iroha Специальных инструкций; какие объекты каждой инструкции можно вызвать и какие инструкции доступны для каждого объекта.

## Сокращение {#summary}

Для каждой инструкции существует перечень объектов, на которых эта инструкция может быть выполнена. Например, варианты передачи охватывают объекты собственного реестра и числовые активы, в то время как митинг охватывает числа активов и запускает повторения.

Некоторые инструкции требуют указания места назначения. Например, если вы перечисляете активы, вам всегда нужно указать, на какой счет вы передаете их. С другой стороны, когда вы регистрируете что-то, все, что вам нужно - это объект, который вы хотите зарегистрировать.

|Инструкция |Объекты |Направление |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias) |Обычное доменное пространство, прозвища пространства данных и прозвища учетной записи |                      |
| [Регистрация/отпись ](#un-register) |учетные записи, определения активов, NFTs, роли, триггеры, сверстники; удаление домена |                      |
| [Монетка/Бурн](#mint-burn) |Цифровые активы, повторяющиеся действия |учетные записи или триггеры |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |объекты, имеющие [метаданные](./metadata.md): домены, счета, определения активов, NFTs, RWAs, триггеры |                      |
| [SetParameter](#setparameter) |параметры цепочки |                      |
| [Грант/отмена](#grant-revoke) | [роли, токены разрешений](/ru/blockchain/permissions.md) |счета или роли |
| [Передача ](#transfer) |домены, определения активов, числовые активы, NFTs |счета |
| [Начальные депозитные и активные блокировки](#native-escrow-and-asset-locks) |Цифровые гарантии активов, блокировки активов, анонимные гарантийные обязательства |покупатели, направления или разделение спора |
| [ExecuteTrigger](#executetrigger) |триггеры |                      |
| [Регистрация/настройка/совершенствование ](#other-instructions) |журналы, конкретные нагрузки для исполнителей, обновления исполнителей |                      |

Существует также другой способ рассмотрения ISI, с точки зрения объекта учетной записи, к которому они прикасаются:

|Цель |Инструкция |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|Счет |регистрация/отключение учетных записей, получение активов, обновление метаданных учетной записи, выдача/отмена разрешений и роли |
|Домен |обеспечить настройку доменов, отказаться от регистрации доменов , передать владение доменом, обновлять метаданные домена |
|Определение активов |регистрационные/нерегистрационные определения, передача собственности, обновление метаданных |
|Активы |количественное количество мяса/сгорания, численное количество перечисления |
|Сбережения .|Открыть, принять, отметить отправленный платеж, освободить, отменить, урегулировать споры, отобрать или погасить записи о собственном хранении. |
|NFT |регистрация/отрекание регистрации NFTs, передача собственности, обновление метаданных |
|RWA |регистрация партий, передача количества, хранение/выпуск, замораживание/размораживание, выкуп, слияние, обновление метаданных и контроль |
|Триггер |регистрация/отрегистрация, повторения аккумулятора менты/сгорания, выполнение аккумулатора, обновление метаданных аккумулирующего устройства |
|Всемирный |зарегистрировать/отрешить регистрацию сверстников и ролей, устанавливать параметры, обновлять исполнителя. |

## CLI Примеры {#cli-examples}

Примеры на этой странице предполагают, что вы выполняете команды из рабочего пространства Iroha вверх по умолчанию на локальной конфигурации клиента:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

Если вы установили бинарный код `iroha`, используйте вместо него `iroha --config ./defaults/client.toml`. Замените местоположение ниже значениями из вашей сети:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

При ориентировании на публичную тестовую сеть Taira используйте конфигурацию клиента Taira. Прежде чем запустить примера с оплатой платы, сохраните помощник крана из [Получайте тестнет XOR на Taira](/ru/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) как `taira_faucet_claim.py`, а затем претендуйте на тестнет XOR из крана:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

После того, как актив, финансируемый краном, будет виден, присоедините необходимые метаданные к газовому активу для записи транзакций:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` - это обычный путь первого выпуска для создания доменов и их SNS аренды. Он декларативно связывает точный пространство данных, владельца, срок аренды и охрана цитаты, затем создает или ремонтирует все требуемое состояние атомно. Используйте аутентифицированный конечный пункт `POST /v1/aliases/setup/plan` или соответствующий рабочий поток CLI:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

Замысел и план не скрываются, но применяются шаг-знаки и представляется обычная транзакция с конфигурированным счетом. План связан с его цепочкой, авторитетом, якорным режимом и сроком; никогда не используйте его в другой сети.

## (Un) Регистрация {#un-register}

Регистрация и отказ от регистрации являются инструкциями, используемыми для выдачи ID новой организации на блокчейн.

Все, что может быть зарегистрировано как `Registrable` так и `Identifiable`, но не все, что является `Identifiable` - это `Registrable`. Большинство вещей регистрируются напрямую, но в некоторых случаях представление в блокчейне имеет значительно больше данных. По соображениям безопасности и производительности мы используем конструкторы для таких структур данных (например, `NewAccount`), а регистрация сверстников имеет специальную инструкцию по подтверждению владения.

Вы можете зарегистрировать учетные записи, определения активов, NFTs, сверстники, роли и триггеры. Настройка домена использует `EnsureAlias`; сырая полезная нагрузка `Register::Domain` предназначена для генезиса/bootstrap. Регистрация сверстников использует `RegisterPeerWithPop`, которая содержит доказательство владения сверстником ключа. Проверьте наши [ названия конвенции](/ru/reference/naming.md), чтобы узнать о ограничениях на наименования субъектов.

RWA партии создаются с помощью специальной инструкции `RegisterRwa`. Настоящий код не раскрывает инструкцию `UnregisterRwa`; используйте `RedeemRwa` для отчисления представленного количества.

::: info

Обратите внимание, что в зависимости от того, как вы решите настроить свой генезисный блок [](/ru/guide/configure/genesis.md) в `genesis.json` (особенно, включаете ли вы регистрацию токенов разрешения или нет), процесс регистрации учетной записи может быть очень разным.

- В общественном блокчейн любой человек должен иметь возможность зарегистрировать счет.
- В частной блокчейне может быть уникальный процесс регистрации учетных записей. В типичной частной блокчейн, т. е. в блокчейне без каких-либо уникальных процессов регистрации учетной записи, вам нужен счет для регистрации другой учетной записи.

Мы подробно обсуждаем эти различия, сравнивая [ частные и публичные блокчейн](/ru/guide/configure/modes.md).

:::

::: info

Регистрация сверстника в настоящее время является единственным способом добавления сверстников, которые не были частью первоначального доверительного сверстніка, установленного в сети.

:::

Используйте языковой специальный справочник для регистрации объектов блокчейна:

|Язык |Руководство |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI |Использовать [Iroha CLI](/ru/get-started/operate-iroha-via-cli.md) для создания доменов и регистрации счетов и активов. |
|Rust |Используйте инструкцию [Rust](/ru/guide/tutorials/rust.md). |
|Kotlin/Java |Используйте учебник [Kotlin/Java](/ru/guide/tutorials/kotlin-java.md). |
|Python |Используйте инструкцию [Python](/ru/guide/tutorials/python.md). |
|JavaScript/TypeScript |Используйте инструкцию [JavaScript/TypeScript ](/ru/guide/tutorials/javascript.md). |

Планируйте и применяйте обычную настройку домена, а затем откажитесь от регистрации домена, когда она больше не нужна:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain unregister --id docs.universal
```

Регистрируемые и нерегистрированные счета:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

Определения активов, зарегистрированные и нерегистрированные:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition register \
  --id "$ASSET_DEF" \
  --name docs_token \
  --alias docs_token#docs.universal \
  --scale 0

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition unregister --id "$ASSET_DEF"
```

Регистрация и отказ от регистрации NFTs. Регистрация NFT читает ее содержание JSON из стандартного ввода:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

Регистрационные и нерегистрационные роли:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

Регистрационные и нерегистрируемые триггеры. IVM Байткод или сериализированный список инструкций. `Log` инструкции с CLI и вводит его в регистрацию задействования:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml -o \
  ledger transaction ping --log-level INFO --msg "hourly cleanup" |
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger register --id hourly_cleanup \
  --instructions-stdin \
  --filter time \
  --time-start 5m \
  --time-period-ms 3600000

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger unregister --id hourly_cleanup
```

Регистрируйте и не регистрируйте сверстников. Составьте ключ BLS и PoP с `kagami`, если у вас их еще нет:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## Минда/Бурн {#mint-burn}

Монетка и сжигание могут относиться к численным активам и включают в себя ограниченное количество повторений. Некоторые активы могут быть объявлены немощными, а это означает, что они могут быть запечатаны только один раз после регистрации.

Активы записываются на конкретный счет, обычно тот, который зарегистрировал актив в первую очередь. Количество активов не является отрицательным, поэтому вы никогда не можете иметь `$-1.0` актива или сжечь отрицательную сумму и получить метку.

Используйте языковой специальный справочник для использования активов блокчейна:

- [CLI](/ru/get-started/operate-iroha-via-cli.md)
- [Rust](/ru/guide/tutorials/rust.md)
- [Kotlin/Java](/ru/guide/tutorials/kotlin-java.md)
- [Python](/ru/guide/tutorials/python.md)
- [JavaScript/TypeScript](/ru/guide/tutorials/javascript.md)

Вот примеры сжигания активов:

- [CLI](/ru/get-started/operate-iroha-via-cli.md)
- [Rust](/ru/guide/tutorials/rust.md)

Цифровые активы Mint и Burn:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset mint \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 100

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset burn \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 10
```

Повторение ментовых и ожоговых пушек:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## Перевод {#transfer}

Трансферы перемещают собственность или стоимость между счетами. и NFTs. RWA Количественное движение использует специальный `TransferRwa` и `ForceTransferRwa` инструкции, описанные в [Активы в реальном мире](/ru/blockchain/rwas.md).

Для этого необходимо предоставить отчет [разрешение на передачу активов](/ru/reference/permissions.md). Обратитесь к примеру, как передавать активы с [CLI](/ru/get-started/operate-iroha-via-cli.md) или [Rust](/ru/guide/tutorials/rust.md).

Передача численных активов:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

Домен передачи, определение активов и собственность NFT:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Нативные сберегательные и активные замки {#native-escrow-and-asset-locks}

Нативные инструкции по депозитарию блокируют числовые активы в протокольном хранилище, управляемом бухгалтерским учетом. Они используются для расчетов на рынке, генеральных блокировки активов и анонимных защищенных потоков депозита.

Использование банковских депозитов на рынке `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, и `ResolveEscrowDispute`. Использование генеральных замков активов `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, и `ExpireAssetLock`. Anonymous escrow отражает рыночный жизненный цикл с `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, и `ResolveAnonymousEscrowDispute`.

Эти ISIs в настоящее время не имеют команд первого класса CLI. Используйте типовые конструкторы SDK или сериализированные полезные нагрузки инструкций, и см. [Native Asset Escrow](/ru/blockchain/escrow.md) для деталей жизненного цикла, разрешений, запросов, событий и примеров Rust.

## Предоставление гранта/отмена {#grant-revoke}

Инструкции по выдаче и отзыву используются для учетных записей [ разрешений и ролей ](permissions.md).

`Grant` используется для постоянного предоставления пользователю либо одного разрешения, либо группы разрешений ( "роль"). Предоставленные роли и разрешения могут быть удалены только через `Revoke` Как таковые, эти инструкции должны быть тщательно использованы.

Предоставление и отмена роли на счете:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

Предоставить и отменить разрешение. Команды разрешения читают объект разрешений из стандартного ввода:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

Предоставление и отмена разрешений на роль:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

Эти инструкции обновляют метаданные объекта [](/ru/blockchain/metadata.md). Используйте `SetKeyValue` для вставки или замены записи метаданных и `RemoveKeyValue` для удаления одной.

Метаданные `set` команды читают значение JSON из стандартного ввода:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

Такой же шаблон доступен для счетов, определений активов NFTs, RWAs и триггеров:

```bash
printf '{"display_name":"Alice"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account meta set --id "$ALICE" --key profile

printf '{"issuer":"docs"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition meta set --id "$ASSET_DEF" --key issuer

printf '{"color":"blue"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft meta set --id 'badge$docs.universal' --key traits

printf '{"owner":"ops"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger meta set --id hourly_cleanup --key owner
```

## `SetParameter` {#setparameter}

`SetParameter` изменяет параметры по всей цепочке, выявленные активной моделью данных и исполнителем.

Установка параметра путем прохождения единого параметра JSON объекта на стандартном вводе:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

Эта инструкция используется для выполнения триггеров [](./triggers.md).

В настоящее время CLI может зарегистрировать триггеры и подписываться на действия запуска напрямую. `execute trigger` Командование, так что подать руководство `ExecuteTrigger` инструкции, создать сериализированный `InstructionBox` с SDK или инструмента исполнения и передать полученный JSON массив через `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## Другие инструкции {#other-instructions}

Iroha также раскрывает инструкции на более низком уровне по интеграции времени выполнения и исполнителя:

- `Log`: выпустить запись в журнале во время выполнения
- `CustomInstruction`: перевозка полезных грузов JSON, специфических для исполнителя
- `Upgrade`: активировать обновление исполнителя

Поставьте инструкцию `Log` с помощником пинга:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

Представьте настраиваемую инструкцию исполнителя в виде сериализированного `InstructionBox`. Форма полезной загрузки является специфической для исполнителя, поэтому генерируйте инструкцию с помощью соответствующего инструмента SDK или инструмента исполнения:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

Обновление исполнителя из составленного файла IVM байткода:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
