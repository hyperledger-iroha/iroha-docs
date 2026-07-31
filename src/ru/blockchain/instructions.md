---
translation_locale: ru
translation_source: /blockchain/instructions.md
translation_source_hash: 3251078b2b2268ff78563c02a0f935c63dc0569f0b6d38071150cbb4b89394d6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Специальные инструкции {#iroha-special-instructions}

Когда мы говорили о [как Iroha действует](/ru/blockchain/iroha-explained), мы
сказал , что Iroha Специальные инструкции - единственный способ изменить мир
Итак, какие у нас есть специальные инструкции?
Вы уже видели несколько языковых руководств в этом учебном пособии.
инструкции: `Register<Account>` и `Mint<Numeric>`.

Вот полный список Iroha Специальные инструкции:

| Инструкция                                               | Описание                                     |
| --------------------------------------------------------- | ------------------------------------------------ |
| [Регистрация/нерегистрация](#un-register)                       | Ответьте ID к новому объекту на блокчейне.    |
| [Минда/Бурн](#mint-burn)                                   | Численные активы монет/сгорания или повторения запуска. |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | Обновление метаданных объектов блокчейна.               |
| [SetParameter](#setparameter)                             | Установите параметр цепочки.                      |
| [Грант/отмена](#grant-revoke)                             | Дать или удалять разрешения и роли.            |
| [Перевод](#transfer)                                     | Передача собственности или стоимости активов.               |
| [Начальные депозитные и активные блокировки](#native-escrow-and-asset-locks) | Закрыть числовые активы в протокольном хранении.     |
| [ExecuteTrigger](#executetrigger)                         | Используйте триггеры.                                |
| [Регистрация/настройка/обновление](#other-instructions)                 | Зарегистрируйте, продлите или улучшите поведение запуска.        |

Давайте начнем с краткого описания Iroha Специальные инструкции; какие предметы для каждого
может потребоваться инструкция и какие инструкции доступны для каждого
Объект.

## Подведение итогов {#summary}

Для каждой инструкции есть список объектов, на которых данная инструкция
Например, варианты передачи охватывают принадлежащие объекты реестра
и числовых активов, в то время как монета охватывает числовые активы и триггер
повторения.

Некоторые инструкции требуют указания места назначения.
Вы переводите активы, вам всегда нужно указать на какой счет вы находитесь
С другой стороны, когда вы регистрируете что-то,
Все, что вам нужно - это объект, который вы хотите зарегистрировать.

| Инструкция                                               | Объекты                                                                                                 | Направление          |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias)                               | обычное доменное место, прозвище пространства данных и прозвище учетной записи                                                 |                      |
| [Регистрация/нерегистрация](#un-register)                       | счета, определения активов; NFTs, роли, триггеры, однородники; удаление домена                                |                      |
| [Минда/Бурн](#mint-burn)                                   | числовые активы, повторяющие действия                                                                     | учетные записи или триггеры |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | объекты, которые имеют [метаданные](./metadata.md): домены, счета, определения активов; NFTs, RWAs, триггеры |                      |
| [SetParameter](#setparameter)                             | параметры цепочки                                                                                        |                      |
| [Грант/отмена](#grant-revoke)                             | [роли, знаки разрешения](/ru/blockchain/permissions.md)                                                  | счета или роли    |
| [Перевод](#transfer)                                     | домены, определения активов, числовые активы; NFTs                                                        | счета             |
| [Начальные депозитные и активные блокировки](#native-escrow-and-asset-locks) | Цифровые поручительства по активам, блокировки активов, анонимные обязательства по поручительству                                    | покупатели, направления или разделение споров |
| [ExecuteTrigger](#executetrigger)                         | триггеры                                                                                                |                      |
| [Регистрация/настройка/обновление](#other-instructions)                 | журналы, полезные нагрузки для конкретных исполнителей, обновления исполнителей                                                     |                      |

Есть и другой способ взглянуть на ISI, с точки зрения объекта книги
они касаются:

| Цель           | Инструкции                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| Счет          | регистрация/отчеты от учета, получение активов, обновление метаданных счета, предоставление/отмена разрешений и роли    |
| Домен           | обеспечить настройку доменов, отказаться от регистрации домен, передать владение доменом, обновлять метаданные домена                    |
| Определение активов | определения регистрации/отречения регистрации, передача собственности, обновление метаданных                                         |
| Активы            | количественное количество мяса/сожжения, количественный объем передачи                                                        |
| Сберегательная плата           | открывать, принимать, отмечать отправленный платеж, освобождать, отменить, урегулировать споры, снимать или исчерпать записи о родных уходах |
| NFT              | регистрация/отчет NFTs, передача собственности, обновление метаданных                                                |
| RWA              | регистрация партий, количество передач, хранение/выпуск, замораживание/размораживание, выкуп, слияние, обновление метаданных и контроль |
| Триггер          | регистрация/отрегистрация, повторения активатора "Минт/Бирн", активатор исполнения, метаданные активатора обновления                 |
| Мир            | регистрация/отключение регистрации сверстников и ролей, установка параметров, обновление исполнителя                                    |

## CLI Примеры {#cli-examples}

Примеры на этой странице предполагают , что вы выполняете команды из потока вверх
Iroha рабочее пространство против локальной конфигурации клиента по умолчанию

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

Если вы установили `iroha` бинарный, использование
`iroha --config ./defaults/client.toml` Вместо этого заменить заказчиков.
ниже с значениями из вашей сети:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

При целевом обращении к общественности Taira тестовая сеть, используйте Taira конфигурация клиента.
Перед тем как запустить платные примеры, сохранить помощник крана от
[Получить тестнет XOR на Taira](/ru/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
как `taira_faucet_claim.py`, Затем претензионная тест-нетка XOR из крана:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

После того, как актив, финансируемый краном, будет виден, прикрепите необходимый газовый актив.
метаданные для записи транзакций:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` является обычным пути первого выпуска для создания доменов и
их SNS Декларация обязывает конкретное пространство данных, владельца, аренду
Термин, и цитата охрана, затем создает или ремонтирует все необходимые состояния атомно.
Используйте аутентифицированный `POST /v1/aliases/setup/plan` конечная точка или совпадение
CLI рабочий процесс:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

Намерение и план не секрет, но применять шаг знаки и представляет
обычная транзакция с конфигурированным счетом.
цепочка, авторитет, якорь живого состояния и срок; никогда не используйте друг друга
Сеть.

## (Un) Регистрация {#un-register}

Регистрация и отказ от регистрации являются инструкциями, используемыми для предоставления ID к а
Новый объект на блокчейне.

Все, что можно зарегистрировать - это и то , и другое . `Registrable` и `Identifiable`,
но не все, что `Identifiable` является `Registrable`. Большинство вещей
зарегистрировано непосредственно, но в некоторых случаях представление в блокчейн
У нас есть значительно больше данных. Из соображений безопасности и производительности мы используем
конструкторы таких структур данных (например, `NewAccount`), и равные
Регистрация имеет специальное указание на удостоверение владения.
Все, что может быть зарегистрировано, также может быть незарегистрировано.
Это жесткое и быстрое правило.

Вы можете зарегистрировать счета, определения активов, NFTs, равных, ролей и
Использование настройки домена `EnsureAlias`; сырой `Register::Domain` полезная нагрузка
предназначен для генезиса/bootstrap. Применение регистрации сверстников
`RegisterPeerWithPop`, У нас есть доказательство, что ключик принадлежит.
[название конгрессов](/ru/reference/naming.md) узнать о ограничениях
наносить имена субъектов.

RWA лоты создаются через посвященные `RegisterRwa` Учитель.
текущий код не раскрывает `UnregisterRwa` инструкции; использование
`RedeemRwa` для выхода на пенсию представленное количество.

::: info

Обратите внимание, что в зависимости от того, как вы решите установить
[блок генезиса](/ru/guide/configure/genesis.md) в `genesis.json`
(в частности, включаете ли вы регистрацию разрешения или нет)
В некоторых странах, как и в других странах, процесс регистрации счета может быть очень разным.
Генерал, мы можем обобщить это так:

- В А _общественность_ блокчейн, каждый должен иметь возможность зарегистрировать счет.
- В А _частные_ блокчейн, может быть уникальный процесс для регистрации
  в счетах. _типичный_ частный блокчейн, т.е. блокчейн без
  любые уникальные процессы для регистрации счетов, вам нужен счет для
  зарегистрировать другой счет.

Мы обсуждаем эти различия очень подробно, когда мы
[сравнение частных и государственных блокчейн](/ru/guide/configure/modes.md).

:::

::: info

Регистрация однородника в настоящее время является единственным способом добавления однородников, которые не были
часть первоначального доверенного партнера, установленного в сети.

:::

Refer к одному из языковых специальных гидов, чтобы показать вам
процесс регистрации объектов в блокчейне:

| Язык              | Руководство                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| CLI                   | Используйте [Iroha CLI](/ru/get-started/operate-iroha-via-cli.md) создавать домены и регистрировать счета и активы. |
| Rust                  | Используйте [Rust Учебное пособие](/ru/guide/tutorials/rust.md).                                                      |
| Kotlin/Java           | Используйте [Kotlin/Java Tutorial](/ru/guide/tutorials/kotlin-java.md).                                        |
| Python                | Используйте [Python Учебное пособие](/ru/guide/tutorials/python.md).                                                  |
| JavaScript/TypeScript | Используйте [JavaScript/TypeScript Учебное пособие](/ru/guide/tutorials/javascript.md).                               |

Планируйте и применяйте обычную настройку домена, а затем отрегистрируйте домен, когда он отсутствует
более длительное время:

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

Регистрация и отказ от регистрации NFTs. NFT регистрация читает ее содержание JSON от
стандартный вход:

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

Регистрируйте и нерегистрируйте триггеры.
составленные IVM Байт-код или сериализированный список инструкций.
а) `Log` инструкции с CLI и вводит его в регистрацию запуска:

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

Регистрируйте и отрегистрируйте сверстников. BLS ключ и PoP с `kagami`
если у вас их нет:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## Минда/Бурн {#mint-burn}

Монетка и сжигание могут относиться к численным активам и триггерам с ограниченной
Количество повторений.Некоторые активы могут быть объявлены неотменимыми, т.е.
что они могут быть запечатаны только один раз после регистрации.

Активы запечатаны на конкретный счет, обычно тот, который зарегистрирован
Количество активов не отрицательное, так что вы можете
никогда не было `$-1.0` или сжечь отрицательную сумму и получить монетку.

Обратитесь к одному из языковых специальных гидов, чтобы пройти через
процесс заготовки активов в блокчейне:

- [CLI](/ru/get-started/operate-iroha-via-cli.md)
- [Rust](/ru/guide/tutorials/rust.md)
- [Kotlin/Java](/ru/guide/tutorials/kotlin-java.md)
- [Python](/ru/guide/tutorials/python.md)
- [JavaScript/TypeScript](/ru/guide/tutorials/javascript.md)

Вот примеры сжигания активов:

- [CLI](/ru/get-started/operate-iroha-via-cli.md)
- [Rust](/ru/guide/tutorials/rust.md)

Цифровые активы:

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

Повторения ментовых и ожоговых пушек:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## Перевод {#transfer}

Перечисления перемещают собственность или стоимость между счетами.
варианты охватывают домены, определения активов, числовые активы и NFTs. RWA
движение количества использует специальный `TransferRwa` и `ForceTransferRwa`
инструкции, описанные в [Активы в реальном мире](/ru/blockchain/rwas.md).

Для этого необходимо предоставить отчет
[разрешение на передачу активов](/ru/reference/permissions.md). Ссылка на
пример о том, как передавать активы с
[CLI](/ru/get-started/operate-iroha-via-cli.md) или
[Rust](/ru/guide/tutorials/rust.md).

Передача численных активов:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

Домен передачи, определение активов и NFT собственность:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Родины, в которых находятся кредиты и активы {#native-escrow-and-asset-locks}

Инструкции по локализации цифровых активов в протоколе, управляемом бухгалтерским учетом
Они используются для расчетов на рынке, общего актива
замки, а также анонимные защищенные депозитные потоки.

Использование депозитных средств на рынке `OpenAssetEscrow`, `AcceptAssetEscrow`,
`MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`,
`OpenEscrowDispute`, и `ResolveEscrowDispute`. Использование генеральных замков активов
`OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, и
`ExpireAssetLock`. Anonymous escrow отражает рыночный жизненный цикл с
`OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`,
`MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`,
`CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, и
`ResolveAnonymousEscrowDispute`.

Эти ISIs не имеют в настоящее время первого класса CLI Используйте напечатанные SDK
конструкторы или сериализированные инструкционные полезные нагрузки, и см.
[Осуществление сбережений на собственные активы](/ru/blockchain/escrow.md) для деталей жизненного цикла,
разрешения, запросы, события и Rust Примеры.

## Грант/отмена {#grant-revoke}

Указания по выдаче и отзыву используются для расчета
[разрешения и роли](permissions.md).

`Grant` используется для постоянного предоставления пользователю либо одного разрешения, либо
Группа разрешений ("роль").
быть удалено через `Revoke` В качестве таких, эти инструкции должны
использовать осторожно.

Предоставить и отменить роль на счете:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

Разрешительные команды читают разрешение
объект из стандартного ввода:

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

Эти инструкции обновляют объект [метаданные](/ru/blockchain/metadata.md). Использование
`SetKeyValue` вставлять или заменять запись метаданных; и `RemoveKeyValue` к
удалить одну.

Метаданные `set` Приказы читать JSON значение из стандартного ввода:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

Тот же шаблон доступен для счетов, определений активов, NFTs, RWAs,
и триггеры:

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

`SetParameter` изменение параметров по всей цепочке, выявленных активными данными
модель и исполнитель.

Установка параметра путем прохождения одного параметра JSON объект по стандарту
вход:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

Эта инструкция используется для выполнения [триггеры](./triggers.md).

Сборник CLI может зарегистрировать триггеры и подписываться на события выполнения
Он не обеспечивает типовой `execute trigger` командование, так что
представить руководство `ExecuteTrigger` инструкции, создать сериализированный
`InstructionBox` с SDK или инструмента исполнения и передать полученный JSON
массив через `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## Другие инструкции {#other-instructions}

Iroha также раскрывает инструкции более низкого уровня для времени выполнения и исполнителя
интеграция:

- `Log`: выдать запись в журнале во время выполнения
- `CustomInstruction`: носить специфические для исполнителя JSON полезные грузы
- `Upgrade`: активировать обновление исполнителя

Внести `Log` инструкция с помощником пинг-аптера:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

Поставьте настройку выполнителя как сериализированный `InstructionBox`. Сборник
Форма полезной нагрузки специфична для исполнителя, поэтому генерируйте инструкцию с помощью
совпадение SDK или инструментов исполнения:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

Усовершенствование исполнителя из компилированного IVM файл байткода:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
