---
translation_locale: ru
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 270e6705186d74efad6a8d2e6eeb432ab1b12649b66d4b11309e7da1e07b384f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Стоимость спонсоров для частного пространства данных {#sponsor-fees-for-a-private-dataspace}

Спонсорство по счетам позволяет пользователям подавать транзакции в частном пространстве данных, не имея XOR. Пользователь все еще подписывает транзакцию. Метаданные транзакции указывают на счет спонсора, а время запуска дебитует баланс спонсора XOR для оплаты сетевой комиссии.

Интеграция состоит из трех движущихся частей:

1. узел позволяет оплачивать спонсорство
2. счет спонсора существует и имеет XOR
3. каждый пользователь имеет `CanUseFeeSponsor` для этого спонсора.

После этого каждая спонсируемая транзакция пользователя требует только этих метаданных:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

На этой странице показаны две общие модели:

- Свободный пользователь пишет: спонсор платит XOR и пользователь ничего не платит.
- Сборы за локальные токены: пользователь платит спонсору в токене приложения, а спонсор выплачивает сети в XOR.

Сначала используйте Taira или частную сеть испытаний. Новое частное пространство данных - это изменение оператора и управления; оно не создается конфигурацией клиента.

## Примерные значения {#example-values}

Нижеприведенные команды используют следующие закладки:

```bash
export DATASPACE="team"
export USER="<USER_ACCOUNT_I105>"
export SPONSOR="<SPONSOR_ACCOUNT_I105>"
export TREASURY="<TREASURY_ACCOUNT_I105>"
export XOR_ASSET="xor#universal"
export BILLING_DOMAIN="billing.team"
export LOCAL_FEE_ASSET="usage#billing.team"
export LOCAL_FEE_ASSET_ID="<LOCAL_FEE_ASSET_DEFINITION_BASE58>"
export USER_ALIAS="alice@team"
export PHONE_POLICY="phone#team"
export EMAIL_POLICY="email#team"
export POLICY_OWNER="<IDENTIFIER_POLICY_OWNER_ACCOUNT_I105>"
```

Используйте каноническую учетную запись I105 IDs, если в вашем развертывании не имеются активные прозвища учетной записи для тех же учетных записей

## 1. Подготовить пространство данных {#_1-prepare-the-dataspace}

Начните с каталога частного пространства данных и работы маршрутизации, описанной в [Связь к SORA Nexus Датапосесам](/ru/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace). Фрагмент, обращенный к оператору, выглядит так:

```toml
[[nexus.lane_catalog]]
index = 5
alias = "team-private"
description = "Private team lane"
dataspace = "team"
visibility = "private"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "team"
id = 42
description = "Private team dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "team"
[nexus.routing_policy.rules.matcher]
account_prefix = "team."
description = "Route team domains to the private dataspace"
```

Перед переходом на транзакции с пользователями проверьте, что:

- частная полоса отображается в ответном узле `/status`
- учетные записи пользователей принимаются через ваш частный поток включения
- существует счет спонсора
- актива по счетам XOR и учетная запись по счету на счёт являются действительными в сети;

## 2. Регистрировать активы в пространстве данных. {#_2-register-assets-in-the-dataspace}

Зарегистрируйте определения активов, которые пользователи будут держать в частном пространстве данных, прежде чем перевести их в логику приложения. Для шаблона оплаты локальных токенов учебник использует `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

Сначала устанавливайте домен и SNS аренду, которые владеют именным пространством активов. Создайте секретно-свободный `AliasSetupPlanRequestV1` намерение для `$BILLING_DOMAIN`, включая числовое `team` данные пространство ID, канонический собственник, срок аренды и текущий охранник цитаты:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

Затем запишите определение актива. Каноническая `--id` - это определение активов на уровне сети ID. Прозвище - это то, что разработчики и конечные пользователи должны использовать в коде пространства данных:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

Монетка или передача локального токена пользователю во время включения в систему:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

Проверяйте баланс пользователя:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

Используйте тот же шаблон для активов приложений в пространстве данных. Зарегистрируйте одно определение актива на токен, дайте каждому псевдоним пространства данных и обратитесь к псевдониму из кода SDK вместо строгокодирующего канонического определения активов IDs.

## 3. Зарегистрировать прозвища пользователей {#_3-register-user-aliases}

Счета по-прежнему являются каноническими I105 счетом IDs. Названия пользователей - это псевдонимы для учетных записей, а псевдоним должны быть нечувствительными руками, такими как `alice@team` или `alice@members.team`. Не используйте телефонные номера или адреса электронной почты в качестве псевдов.

Настройка Alias использует тот же декларирующий планировщик, что и настройка домена. Пусть служба SDK или консорциум создают секретное намерение `AliasSetupPlanRequestV1`, чьи цели учетной записи alias entry `$USER`, выбирает первичную роль, записывает числовое пространство данных ID и несет текущий охранник лизинговых предложений. Затем планируйте и примените его как одну атомную транзакцию:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

Если пользователь не должен платить XOR, используйте одобренный сервис бортового обслуживания, информированный о спонсоре, для создания и представления транзакции установки.

После того, как псевдоним связано, проверьте его с CLI:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

Для создания новой учетной записи предпочтительно использовать сервис набора, который создает `NewAccount` с помощью стабильной `uaid` и, при необходимости, первоначальной`label`. Простая команда `ledger account register --id` регистрирует только канонический счет ID.

## Регистрация телефона и электронной почты в частном порядке с FHE {#_4-register-phone-and-email-privately-with-fhe}

Используйте номера телефонов и адреса электронной почты в качестве частных идентификаторов, а не публичных псевдоним. FHE- backed flow сохраняет необработанные идентификаторы от псевдонимов учетных записей, метаданных транзакций и мирового состояния:

1. оператор регистрирует политику программы [RAM-LFE/FHE ](/ru/blockchain/ram-lfe.md) для телефона и электронной почты;
2. оператор регистрирует политику активного идентификатора, например `phone#team` и `email#team`;
3. кошелек нормализует телефон или электронную почту на местном уровне
4. кошелек отправляет зашифрованное значение к решителю.
5. разрешение возвращает `IdentifierResolutionReceipt`
6. пользователь представляет `ClaimIdentifier` вместе с квитанцией.
7. цепочка хранит непрозрачный идентификатор и хэш квитанции, а не значение сырого телефона или электронной почты.

Настройка политики со стороны оператора является задачей SDK или обслуживанием. Создать и представить эти пары инструкций для каждого типа идентификатора:

```text
RegisterRamLfeProgramPolicy(
  program_id = "phone_team",
  owner = "$POLICY_OWNER",
  backend = "bfv-programmed-sha3-256-v1",
  verification_mode = "signed",
  commitment = "<HIDDEN_PROGRAM_POLICY_COMMITMENT>",
  resolver_public_key = "<RESOLVER_PUBLIC_KEY>"
)
ActivateRamLfeProgramPolicy(program_id = "phone_team")

RegisterIdentifierPolicy(
  id = "$PHONE_POLICY",
  owner = "$POLICY_OWNER",
  normalization = "PhoneE164",
  program_id = "phone_team",
  note = "Private phone registration for team dataspace"
)
ActivateIdentifierPolicy(policy_id = "$PHONE_POLICY")
```

Повторить для электронной почты с:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

Во время включения, кошелек или задний план должен нормализоваться локально:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

После создания файла метаданных-спонсора на этапе 8, представьте инструкцию по заявлению, подписанную пользователем, включающую эти метаданные:

```text
ClaimIdentifier(
  account = "$USER",
  receipt = IdentifierResolutionReceipt {
    payload: {
      policy_id: "$PHONE_POLICY",
      opaque_id: "<OPAQUE_ACCOUNT_ID>",
      uaid: "<USER_UAID>",
      account_id: "$USER",
      ...
    },
    attestation: "<RESOLVER_SIGNATURE_OR_PROOF>"
  }
)
```

Текущий CLI не раскрывает напечатанные команды для этих инструкций идентификации. `InstructionBox` значения с SDK и подать их через `ledger transaction stdin`:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

Сохраняйте эти ограждения в службе посадки:

- Счетные прозвища - это только человекочитаемые ручки
- необработанные значения телефона и электронной почты никогда не появляются в псевдонимах, метаданных, журналах или полезных нагрузках транзакций
- на счете есть `uaid`, прежде чем он претендует на частные идентификаторы
- квитанции связывают `policy_id`, `opaque_id`, `uaid`, `account_id` и истекают срок действия
- Ключи решения и обязательства скрытой программы контролируются управлением .

## 5. Включить спонсорство в узле. {#_5-enable-sponsorship-on-the-node}

Спонсорство платы - это политика узлов/рабочего времени. Включить его в конфигурации Nexus платы:

```toml
[nexus.fees]
fee_asset_id = "xor#universal"
fee_sink_account_id = "<FEE_SINK_ACCOUNT_I105_OR_ALIAS>"
base_fee = "0"
per_byte_fee = "0"
per_instruction_fee = "0.001"
per_gas_unit_fee = "0.00005"
sponsorship_enabled = true
sponsor_max_fee = "0"
```

`fee_asset_id` является активом сетевых сборов. Для SORA Nexus это XOR. Используйте активный псевдоним XOR или каноническое определение актива XOR ID, выявленное вашей сетью.

`sponsor_max_fee = "0"` означает, что нет ограничения на спонсоров за транзакцию. Для производства устанавливайте не нулевую лимит после того, как вы знаете нормальный размер и газный профиль ваших транзакций в пространстве данных.

Перезагрузить или прокрутить эту конфигурацию через ваш обычный операторский процесс.

## 6. Создание и финансирование спонсора {#_6-create-and-fund-the-sponsor}

В случае необходимости создать парочку ключей спонсора:

```bash
kagami keys --algorithm ed25519 --json
```

Преобразовать общественный ключ в формат учетной записи для сети:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

Зарегистрируйте аккаунт спонсора через свой частный поток на борту:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

Финансирование спонсора с помощью XOR из казначейства, счета по кредитам или другого финансируемого счета:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

Для репетиций Taira, сохранить помощника крана из [Получайте Testnet XOR на Taira](/ru/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) как `taira_faucet_claim.py`, а затем финансируйте спонсора с помощью общественного крана вместо денежного перевода:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

Проверяйте баланс спонсора XOR:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. Предоставьте пользователю доступ к спонсору {#_7-grant-a-user-access-to-the-sponsor}

Спонсор должен предоставить каждому пользователю разрешение на взимание с него платы. Грант - это то, что мешает пользователям назвать произвольные спонсорские счета.

Используйте это в качестве аккаунта спонсора, или в качестве оперативного счета, разрешенного вашей политикой пропуска:

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission grant --id "$USER"
```

Для услуг на борту, сделать это обычным шагом предоставления учетной записи и запись:

- учетная запись пользователя
- счет спонсора
- пространство данных или приложение
- разрешение или решение о управлении

Для проверки дотаций пользователя:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. Присоединить метаданные спонсора {#_8-attach-sponsor-metadata}

Создать повторно используемый файл метаданных:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

Каждое письмо, представленное с этими метаданными, взимается с спонсора:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

Для SDKs прикрепить к подписанной сделке тот же объект метаданных сделок. Пользователь подписывает транзакцию с помощью ключа пользователя. Спонсор не подписывает каждую транзакцию с пользователем, поскольку предварительным `CanUseFeeSponsor` грантом является разрешение.

## Образец 1: Пользователи платят бесплатно {#pattern-1-users-pay-no-fees}

Используйте это, когда приложение или оператор поглощает все сетевые сборы.

Перечень разработчиков:

1. Сохраняйте нормальную полезную нагрузку транзакций пользователя неизменной.
2. Добавьте метаданные транзакции с помощью `fee_sponsor`.
3. Подпишитесь как пользователь.
4. Подайте через частный маршрут пространства данных.

Учетная запись пользователя не требует баланса XOR. Учетный запись спонсора должна хранить достаточное количество XOR для покрытия конфигурированных сборов Nexus.

## Пример 2: Пользователи платят местный токен {#pattern-2-users-pay-a-local-token}

Используйте это, когда пользователи не должны иметь XOR, но пространство данных все равно хочет внутреннюю плату за приложение, кредитные расходы или токены квот.

В данной схеме местный токен является платежным приложением, а не активом сетевых сборов. Спонсор все равно оплачивает сетевые сборы в XOR.

Например, используйте локальный токен в частном пространстве данных:

```text
usage#billing.team
```

Пользователи фонда с `usage#billing.team` во время ввода, продления подписки или выделения квоты. Затем сделайте пользовательскую транзакцию атомной:

1. передавать локальные токены от пользователя спонсору
2. выполнять запрошенную операцию приложения
3. включать метаданные `fee_sponsor`, чтобы спонсор платил XOR;

Минимальное испытание дыма CLI - это только передача локальных токенов, спонсируемая XOR:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

Для реального приложения не подавайте платеж с локальным токеном в качестве отдельной транзакции с наилучшими усилиями. Создайте подписанную транзакцию, содержащую как платеж, так и бизнес-инструкцию, или раскройте пункт ввода контракта, который собирает местный токен перед применением бизнес-операции.

Сохраняйте политику конверсии в своем приложении или контракте:

- какая операция стоит сколько местных токенных единиц
- как локальные карты притока токенов для спонсоров XOR пополнения
- что происходит, когда пользовательский баланс слишком низкий
- что происходит, когда баланс спонсора XOR слишком низкий

::: warning

Не используйте `gas_asset_id` если вы не хотите, чтобы спонсор был зачислен и в этом актива на газ. `fee_sponsor` также делает спонсора плательщиком за конфигурированные дебиты активов газопровода-газа. Для пользовательских сборов за локальные токены, собирайте токен явно с помощью правила передачи или контракта.

:::

## Отладка неудачных спонсируемых транзакций {#debug-failed-sponsored-transactions}

Обычные причины отказа обычно указывают на отсутствие одного этапа установки:

|Текст ошибки |Что проверить ?|
| --- | --- |
|`fee sponsorship is disabled` | `nexus.fees.sponsorship_enabled` все еще `false` на узле. |
|`fee sponsor is not authorized` |Пользователь не имеет `CanUseFeeSponsor` для этого спонсора. |
|`fee asset ... is missing` |Спонсор не владеет конфигурированным XOR активами сбора. |
|`fee balance ... is insufficient` | Заполните спонсора. XOR сбалансированность. |
|`fee exceeds sponsor_max_fee` |Увеличить `sponsor_max_fee` или уменьшить размер/газ транзакции. |
|`invalid nexus fee asset id` |Фиксация `nexus.fees.fee_asset_id` или псевдоним активов XOR. |

При сборе паттерна 2 проверьте оба баланса:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"

iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

## Используйте спонсора {#operate-the-sponsor}

Обращайтесь с спонсором как с казначейским счетом:

- держать отдельные ключи спонсора для тестовой сети, стажировки и основной сети;
- предупреждение до того, как баланс спонсора XOR достигнет уровня приема
- установить не нулевую линию `sponsor_max_fee` после характеристики движения;
- спонсируемые записи в вашем приложении или шлюзе
- отменить `CanUseFeeSponsor` при выходе пользователей из пространства данных
- согласование хэши пользовательских транзакций, платежей с локальными токенами и дебитов спонсоров XOR

Отменить спонсорство для пользователя:

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission revoke --id "$USER"
```

## Сюжетные страницы {#related-pages}

- [Подключение к SORA Nexus Датапосесам](/ru/get-started/sora-nexus-dataspaces.md)
- [Управление Iroha 3 через CLI](/ru/get-started/operate-iroha-via-cli.md)
- [Активы](/ru/blockchain/assets.md)
- [Разрешения](/ru/blockchain/permissions.md)
- [Токены разрешения](/ru/reference/permissions.md)
