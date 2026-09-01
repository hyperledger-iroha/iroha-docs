---
translation_locale: ru
translation_source: /blockchain/instructions.md
translation_source_hash: ade5ba2b693de7e798490be0947099d0306d9565b88550e201dccd181810fb18
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha Инструкционные операции {#iroha-special-instructions}

Когда мы говорили о [как работает Iroha](/ru/blockchain/iroha-explained), мы сказали, что операции инструкции Iroha — это единственный способ изменить состояние мира. Итак, какой тип инструкции Какие операции у нас есть? Если вы читали руководства по конкретным языкам в этом учебнике, вы уже видели несколько инструкций: `Register<Account>` и `Mint<Numeric>`.

Вот полный список операций инструкции Iroha:

|Инструкция|Описания|
| --------------------------------------------------------- | ------------------------------------------------ |
| [Зарегистрироваться/Отменить регистрацию](#un-register)                       |Присвойте идентификатор новой сущности в блокчейне.|
|[Mint/Burn](#mint-burn)|Создавайте/сжигайте числовые активы или инициируйте повторения.|
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |Обновить метаданные объекта блокчейна.|
| [SetParameter](#setparameter)                             |Установите параметр для всей цепочки.|
| [Grant/Revoke](#grant-revoke)                             |Предоставляйте или удаляйте разрешения и роли.|
| [Перевод](#transfer)                                     |Передача права собственности или стоимости актива.|
| [Родной эскроу и блокировки активов](#native-escrow-and-asset-locks) |Заблокируйте числовые активы в хранении протокола.|
| [Атомарные конфиденциальные расчёты](#atomic-private-settlement) | Управление конфиденциальными пулами и атомарными пакетами. |
|[ExecuteTrigger](#executetrigger)|Выполнить триггеры.|
|[Log/Custom/Upgrade](#other-instructions)|Вести журнал, расширять или обновлять поведение выполнения программного обеспечения.|

Давайте начнем с обзора операций инструкций Iroha; для каких объектов может быть вызвана каждая инструкция и какие инструкции доступны для каждого объекта.

## Резюме {#summary}

Для каждой инструкции существует список объектов, на которых эта инструкция может быть выполнена. Например, варианты передачи охватывают собственные распределённые объекты реестра блокчейна и числовые активы, в то время как выпуск охватывает числовые активы и повторение триггеров.

Для некоторых инструкций требуется указать место назначения. Например, если вы переводите активы, вам всегда нужно указать, на какой счет вы их переводите. С другой стороны, когда вы регистрируете что-то, все, что вам нужно, это объект, который вы хотите зарегистрировать.

|Инструкция|Объекты|Пункт назначения|
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias)                               |настройка обычного домена, псевдонима пространства данных и псевдонима аккаунта|                      |
| [Зарегистрироваться/Отменить регистрацию](#un-register)                       |учетные записи, определения активов, NFTs, роли, триггеры, сетевые узлы; удаление домена|                      |
| [Mint/Burn](#mint-burn)                                   |числовые активы, вызывать повторения|счета или триггеры|
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |объекты, которые имеют [метаданные](./metadata.md): домены, учетные записи, определения активов, NFTs, RWAs, триггеры|                      |
| [SetParameter](#setparameter)                             |параметры цепи|                      |
| [Grant/Revoke](#grant-revoke)                             | [роли, токены разрешений](/ru/blockchain/permissions.md)                                                  |аккаунты или роли|
| [Перевод](#transfer)                                     |домены, определения активов, числовые активы, NFTs|счета|
| [Родной эскроу и блокировки активов](#native-escrow-and-asset-locks) |цифровые депозиты активов, блокировки активов, анонимные криптографические значения обязательств депозита|покупатели, направления или разделение споров|
| [Атомарное урегулирование частных финансовых транзакций](#atomic-private-settlement)   |группы конфиденциальных протокольных данных с областью маршрута, ротации политик, завершённые пакеты и маркеры прерывания|                      |
| [ExecuteTrigger](#executetrigger)                         |триггеры|                      |
| [Log/Custom/Upgrade](#other-instructions)                 |журналы, полезные нагрузки, специфичные для исполнителя, обновления исполнителя|                      |

Существует также другой способ взглянуть на ISI с точки зрения объекта распределенного реестра блокчейна, с которым они взаимодействуют:

|Цель|Инструкции|
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|Аккаунт|регистрировать/отменять регистрацию аккаунтов, получать активы, обновлять метаданные аккаунта, предоставлять/отзывать разрешения и роли|
|Домен|обеспечить настройку домена, отменить регистрацию доменов, передать право собственности на домен, обновить метаданные домена|
|Определение актива|регистрировать/удалять определения, передавать право собственности, обновлять метаданные|
|Актив|выпустить/сжечь числовое количество, передать числовое количество|
|Эскроу|открыть, принять, отметить как отправленный платеж, освободить, отменить, оспорить, разрешить, списать, или истечь сроки родных записей о хранении|
| NFT              |зарегистрировать/отменить регистрацию NFTs, передать право собственности, обновить метаданные|
| RWA              |регистрировать партии, передавать количество, удерживать/освобождать, замораживать/размораживать, выкупать, объединять, обновлять метаданные и элементы управления|
|Спусковой крючок|регистрировать/отменять регистрацию, повторять триггеры создания/уничтожения, выполнять триггер, обновлять метаданные триггера|
|Мир|регистрировать/удалять из регистрации сетевых участников и роли, устанавливать параметры, обновлять исполнителя|

## CLI Примеры {#cli-examples}

Примеры на этой странице предполагают, что вы выполняете команды из upstream Iroha рабочей области на стандартной локальной конфигурации клиента:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

Если вы установили бинарный файл `iroha`, используйте вместо него `iroha --config ./defaults/client.toml`. Замените заполнители ниже значениями из вашей сети:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

При нацеливании на публичную тестовую сеть Taira используйте конфигурацию клиента Taira. Перед запуском примеров с оплатой комиссий сохраните помощник службы финансирования тестовой сети с [Получить тестовую сеть XOR на Taira](/ru/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) как `taira_faucet_claim.py`, затем получите тестовую XOR из службы финансирования тестовой сети:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

После того как виден актив, финансируемый тестовой сетью, прикрепите метаданные актива для оплаты стоимости выполнения транзакции к записям транзакций:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` является обычным путем первого выпуска для создания доменов и их аренд SNS. Он декларативно связывает точное пространство данных, владельца, срок аренды, и проверку платы и цены, затем создает или восстанавливает все необходимые состояния атомарно. Используйте аутентифицированный `POST /v1/aliases/setup/plan` API эндпоинт или соответствующий поток работы CLI:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

Намерение и план не содержат секретов, но шаг подачи подписывает и отправляет обычную транзакцию с настроенным аккаунтом. План привязан к своей цепочке, главному лицу для авторизации, якорю живого состояния и сроку; никогда не используйте один и тот же план в другой сети.

## (От)Регистрация {#un-register}

Регистрация и отмена регистрации — это инструкции, используемые для присвоения идентификатора новой сущности в блокчейне.

Все, что можно зарегистрировать, является одновременно `Registrable` и `Identifiable`, но не всё, что является `Identifiable`, является `Registrable`. Большинство вещей регистрируются напрямую, но в некоторых случаях представление в блокчейне содержит значительно больше данных. По соображениям безопасности и производительности мы используем билдеры для таких структур данных (например, `NewAccount`), а регистрация сетевого пира имеет специальную инструкцию о доказательстве владения. Как правило, всё, что можно зарегистрировать, также можно и удалить из регистрации, но это не жёсткое и обязательное правило.

Вы можете регистрировать учетные записи, определения активов, NFTs, узлы сети, роли и триггеры. Настройка домена использует `EnsureAlias`; необработанная нагрузка `Register::Domain` зарезервирована для genesis/bootstrap. Регистрация сетевого узла использует `RegisterPeerWithPop`, который содержит доказательство владения ключом сетевого узла. Ознакомьтесь с нашим [правила именования](/ru/reference/naming.md), чтобы узнать о ограничениях, наложенных на имена сущностей.

RWA лоты создаются с помощью специальной инструкции `RegisterRwa`. Текущий код не предоставляет инструкцию `UnregisterRwa`; используйте `RedeemRwa` для выведения из эксплуатации представленного количества.

::: info

Обратите внимание, что в зависимости от того, как вы решите настроить ваш [генезис-блок блокчейна](/ru/guide/configure/genesis.md) в `genesis.json` (в частности, включаете ли вы регистрацию токенов разрешений или нет), процесс регистрации аккаунта может сильно различаться. В целом, мы можем суммировать это так:

- В публичном блокчейне любой человек должен иметь возможность зарегистрировать учетную запись.
- В частном блокчейне может быть уникальный процесс регистрации учетных записей. В типичном частном блокчейне, т.е. блокчейне без каких-либо уникальных процессов регистрации учетных записей, вам нужна учетная запись, чтобы зарегистрировать другую учетную запись.

Мы подробно обсуждаем эти различия, когда мы [сравнить частные и публичные блокчейны](/ru/guide/configure/modes.md).

:::

::: info

Регистрация сетевого узла в настоящее время является единственным способом добавления сетевых узлов, которые не входили в изначальный набор доверенных сетевых узлов, в сеть.

:::

Используйте руководство на конкретном языке для регистрации объектов блокчейна:

|Язык|Руководство|
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI|Используйте [Iroha CLI](/ru/get-started/operate-iroha-via-cli.md), чтобы настроить домены и регистрировать аккаунты и активы.|
|Rust                  |Используйте [Rust учебное пособие](/ru/guide/tutorials/rust.md).|
| Kotlin/Java           |Используйте [Kotlin/Java](/ru/guide/tutorials/kotlin-java.md).|
|Python                |Используйте [Python учебное пособие](/ru/guide/tutorials/python.md).|
| JavaScript/TypeScript |Используйте [JavaScript/TypeScript](/ru/guide/tutorials/javascript.md).|

Спланируйте и примените обычную настройку домена, затем отмените регистрацию домена, когда он больше не будет нужен:

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

Зарегистрировать и отменить регистрацию аккаунтов:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

Регистрировать и отменять регистрацию определений активов:

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

Зарегистрируйте и отмените регистрацию NFTs. Регистрация NFT читает свой контент JSON из стандартного ввода:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

Зарегистрировать и отменить регистрацию ролей:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

Регистрация и отмена регистрации триггеров. Для регистрации триггера требуется либо скомпилированный байт-код IVM, либо сериализованный список инструкций. В этом примере создается инструкция `Log` с CLI и передается в регистрацию триггера:

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

Регистрируйте и отменяйте регистрацию сетевых узлов. Сгенерируйте ключ BLS и PoP с `kagami`, если у вас их еще нет:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./peer-key
PEER_KEY=$(tr -d '\n' < ./peer-key/public.key)
PEER_POP=$(tr -d '\n' < ./peer-key/pop.hex)

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## Чеканка/Сжигание {#mint-burn}

Выпуск и уничтожение могут относиться к числовым активам и триггерам с ограниченным числом повторений. Некоторые активы могут быть объявлены как немонетизируемые, что означает, что они могут быть выпущены только один раз после регистрации.

Активы выдаются на конкретный счет, обычно на тот, который изначально зарегистрировал актив. Количества активов неотрицательны, поэтому у вас никогда не может быть `$-1.0` актива или уничтожить отрицательное количество и получить выпуск.

Используйте руководство на конкретном языке для выпуска блокчейн-активов:

- [CLI](/ru/get-started/operate-iroha-via-cli.md)
- [Rust](/ru/guide/tutorials/rust.md)
- [Kotlin/Java](/ru/guide/tutorials/kotlin-java.md)
- [Python](/ru/guide/tutorials/python.md)
- [JavaScript/TypeScript](/ru/guide/tutorials/javascript.md)

Вот примеры уничтожения активов:

- [CLI](/ru/get-started/operate-iroha-via-cli.md)
- [Rust](/ru/guide/tutorials/rust.md)

эмитировать и уничтожать числовые активы:

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

выдавать и уничтожать повторные срабатывания:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## Перевод {#transfer}

Переводы перемещают право собственности или стоимость между счетами. Общие варианты перевода охватывают домены, определения активов, числовые активы и NFTs. Перемещение количества RWA использует специальные инструкции `TransferRwa` и `ForceTransferRwa`, описанные в [Активы реального мира](/ru/blockchain/rwas.md).

Для этого аккаунту необходимо предоставить [разрешение на передачу активов](/ru/reference/permissions.md). Обратитесь к примеру о том, как передать активы с помощью [CLI](/ru/get-started/operate-iroha-via-cli.md) или [Rust](/ru/guide/tutorials/rust.md).

Перевести числовые активы:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

Передача прав на домен, определение актива и NFT:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Родной условный депозит и блокировки активов {#native-escrow-and-asset-locks}

Инструкции нативного эскроу блокируют цифровые активы, находящиеся под управлением протокола реестра распределенного блокчейна. Они используются для расчетов по финансовым транзакциям в стиле торговой площадки, универсальных блокировок активов и анонимных защищенных потоков эскроу.

Эскроу на рынке использует `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute` и `ResolveEscrowDispute`. Универсальные замки активов используют `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock` и `ExpireAssetLock`. Анонимный эскроу отражает жизненный цикл рынка с `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute` и `ResolveAnonymousEscrowDispute`.

Эти ISIs в настоящее время не имеют первоклассных команд CLI. Используйте типизированные конструкторы SDK или сериализованные полезные нагрузки инструкций и смотрите [Эскроу для родных активов](/ru/blockchain/escrow.md) для деталей жизненного цикла, разрешений, запросов, событий и примеров Rust.

## Атомарное урегулирование частных финансовых транзакций {#atomic-private-settlement}

Управляемое семейство инструкций атомарно-приватного расчета отделено от прозрачного Native AMX. `ActivatePrivateSettlementPoolV1` устанавливает одну групповую конфиденциальную протокольную информацию с областью действия маршрута из отредактированной проекции управления и канонических значений криптографической приверженности источника. `FinalizeAtomicPrivateSettlementV1` применяет один полный сертифицированный комитетом пакет атомарно, в то время как `AbortAtomicPrivateSettlementV1` публикует только разрешенный спонсором публичный терминальный маркер.

`RotatePrivateSettlementPoolPolicyV1` ограничен управлением конфиденциальностью. Он требует точного текущего значения криптографического дайджеста управления, сохраняет маршрут, группу протокольных данных, криптографическое обязательство, привязанное к активу, состояние границы, наборы повторов и завершённые записи результатов протокола, продвигает публичную ревизию на одну и использует более новую эпоху ключа аудитора. Ротация активируется на своей высоте включения и не может делить эту высоту с записью результата протокола для того же маршрута/пула. Публичная линия ревизии сохраняет записи результатов протокола, завершенные до перезапуска ротации, как действительные и идемпотентные при точном повторе; находящиеся в процессе старые пакеты политики завершаются с ошибкой. Операторам необходимо хранить старые ключи расшифровки для сохраненных капсул или управлять и тестировать перепаковку капсул перед их уничтожением.

Путь по умолчанию остается отключенным и не предназначен для использования в производстве. См. [Выполнить атомарное частное урегулирование финансовых транзакций между пространствами данных](/ru/get-started/atomic-private-settlement) для требований к настройке, субъекту авторизации, аудиту, восстановлению и выпуску.

## Предоставить/Отозвать {#grant-revoke}

Инструкции по предоставлению и отзыву используются для учетной записи [разрешения и роли](permissions.md).

`Grant` используется для постоянного предоставления пользователю либо одного разрешения, либо группы разрешений ("роли"). Предоставленные роли и разрешения можно удалить только с помощью инструкции `Revoke`. Следовательно, эти инструкции следует использовать с осторожностью.

Предоставление и отзыв роли на аккаунте:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

Предоставляйте и отзывайте токены разрешений. Команды разрешений считывают объект разрешения из стандартного ввода:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

Предоставление и отзыв разрешений для роли:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

Эти инструкции обновляют объект [метаданные](/ru/blockchain/metadata.md). Используйте `SetKeyValue`, чтобы вставить или заменить запись метаданных, и `RemoveKeyValue`, чтобы удалить запись.

Метаданные `set` команды считывают значение JSON из стандартного ввода:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

Та же схема доступна для счетов, определений активов, NFTs, RWAs и триггеров:

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

`SetParameter` изменяет общие для всей цепочки параметры, доступные через активную модель данных и исполнитель.

Установите параметр, передав один параметр JSON объект через стандартный ввод:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

Эта инструкция используется для выполнения [триггеры](./triggers.md).

CLI может регистрировать триггеры и подписываться на события выполнения триггера напрямую. Он не предоставляет типизированную команду `execute trigger`, поэтому для отправки руководство `ExecuteTrigger` инструкция, сгенерировать сериализованный `InstructionBox` с помощью SDK или инструмента исполнителя и пропустить полученный массив JSON через `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## Другие инструкции {#other-instructions}

Iroha также раскрывает низкоуровневые инструкции для выполнения программного обеспечения и интеграции исполнителя:

- `Log`: создать запись в журнале во время выполнения
- `CustomInstruction`: переносить специфические для исполнителя JSON полезные нагрузки
- `Upgrade`: активировать обновление исполнителя

Отправьте инструкцию `Log` с помощью помощника пинга:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

Отправьте пользовательскую инструкцию исполнителя в виде сериализованного `InstructionBox`. Форма полезной нагрузки зависит от конкретного исполнителя, поэтому создайте инструкцию с соответствующим SDK или инструментами исполнителя:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

Обновите исполнитель из скомпилированного файла байткода IVM:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
