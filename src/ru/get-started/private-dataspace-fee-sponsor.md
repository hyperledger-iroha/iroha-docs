---
translation_locale: ru
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 37a2c29dccf3d2abacbbba16869d65b70b93545875a122470601194231c2263b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Плата спонсора за частное пространство данных {#sponsor-fees-for-a-private-dataspace}

Спонсорство сборов позволяет пользователям отправлять транзакции в приватном пространстве данных без владения XOR. Пользователь по-прежнему подписывает транзакцию. Метаданные транзакции указывают на счет спонсора, а программное обеспечение списывает с баланса спонсора XOR сетевой сбор.

Интеграция имеет три движущихся части:

1. узел позволяет спонсорство комиссий
2. учетная запись спонсора существует и имеет XOR
3. у каждого пользователя есть `CanUseFeeSponsor` для этого спонсора

После этого каждая транзакция спонсируемого пользователя требует только этих метаданных:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

На этой странице показаны два распространённых шаблона:

- Бесплатный пользователь пишет: спонсор платит XOR, а пользователь ничего не платит.
- Комиссии в местных токенах: пользователь оплачивает спонсору токен приложения, а спонсор оплачивает сети в XOR.

Сначала используйте Taira или частную тестовую сеть. Новое частное пространство данных подразумевает изменение оператора и управления; оно не создается конфигурацией клиента.

## Пример значений {#example-values}

Ниже приведенные команды используют эти заполнители:

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

Используйте канонические идентификаторы аккаунтов I105, если только в вашей среде не активны псевдонимы аккаунтов для тех же учетных записей.

## 1. Подготовьте пространство данных {#_1-prepare-the-dataspace}

Начните с каталога приватного пространства данных и маршрутизации, описанных в [Подключиться к SORA Nexus Dataspaces](/ru/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace). Фрагмент, ориентированный на оператора, выглядит так:

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

Перед переходом к операциям пользователя убедитесь, что:

- частная очередь выполнения появляется в ответе узла `/status`
- учётные записи пользователей принимаются вашим частным процессом регистрации
- спонсорский аккаунт существует
- актив комиссии XOR и счет поглощения комиссии действительны в сети

## 2. Зарегистрировать активы в пространстве данных {#_2-register-assets-in-the-dataspace}

Зарегистрируйте определения активов, которые пользователи будут хранить внутри приватного пространства данных, перед тем как подключать их к логике приложения. Для схемы комиссии с локальным токеном в учебнике используется `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

Сначала настройте домен и аренду SNS, которые владеют пространством имен активов. Создайте намерение `AliasSetupPlanRequestV1` без секретов для `$BILLING_DOMAIN`, включая числовой идентификатор пространства данных `team`, канонического владельца, срок аренды и текущую защиту котировки:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

Затем зарегистрируйте определение актива. Канонический `--id` — это идентификатор определения актива на уровне сети. Псевдоним — это то, что разработчики и конечные пользователи должны использовать в коде пространства данных:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

выдать или передать локальный токен пользователю во время регистрации:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

Проверьте баланс пользователя:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

Используйте тот же шаблон для активов приложения в пространстве данных. Зарегистрируйте одно определение активов на каждый токен, присвойте каждому алиас пространства данных и обращайтесь к алиасу из кода SDK, вместо того чтобы жестко кодировать идентификаторы канонических определений активов.

## 3. Регистрация псевдонимов пользователей {#_3-register-user-aliases}

Учётные записи по-прежнему являются каноническими I105 идентификаторами аккаунтов. Отображаемые пользователю имена — это псевдонимы аккаунтов, и псевдонимы должны быть не конфиденциальными обозначениями, такими как `alice@team` или `alice@members.team`. Не используйте номера телефонов или адреса электронной почты в качестве псевдонимов. Они относятся к потоку приватных идентификаторов в следующем разделе.

Настройка псевдонима использует тот же декларативный планировщик, что и настройка домена. Попросите службу SDK или службу подключения создать `AliasSetupPlanRequestV1` намерение без секретов, запись аккаунта-псевдонима которого нацелена на `$USER` выбирает основную роль, закрепляет числовой идентификатор пространства данных и несет текущий защитник проверки цены арендной платы. Затем спланируйте и примените это как одну атомарную транзакцию:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

Если пользователь не должен платить XOR, используйте одобренную службу онбординга с учетом спонсора для создания и отправки транзакции установки. Не разделяйте приобретение аренды и привязку псевдонима на независимые транзакции приложения.

После привязки псевдонима проверьте его через CLI:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

Для создания новой учетной записи предпочтите сервис адаптации, который создает `NewAccount` со стабильным `uaid` и, при необходимости, начальным `label`. Простая команда `ledger account register --id` только регистрирует канонический идентификатор учетной записи.

## 4. Зарегистрируйте телефон и электронную почту анонимно с FHE {#_4-register-phone-and-email-privately-with-fhe}

Используйте номера телефонов и адреса электронной почты в качестве приватных идентификаторов, а не публичных псевдонимов. Поток, поддерживаемый FHE, исключает использование сырьевых идентификаторов в псевдонимах аккаунтов, метаданных транзакций и состоянии мира:

1. оператор регистрирует [RAM-LFE/FHE политика программы](/ru/blockchain/ram-lfe.md) для телефона и электронной почты
2. оператор регистрирует активные политики идентификаторов, такие как `phone#team` и `email#team`
3. кошелек нормализует телефон или электронную почту локально
4. кошелек отправляет зашифрованное значение решателю
5. резолвер возвращает `IdentifierResolutionReceipt`
6. пользователь отправляет `ClaimIdentifier` с записью результата протокола
7. цепочка хранит непрозрачный идентификатор и криптографический хеш записи результата протокола, а не исходное значение телефона или электронной почты

Настройка политики на стороне оператора — это SDK или служебная задача. Создайте и отправьте эти пары инструкций для каждого типа идентификатора:

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

Повторите это для электронной почты с:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

В процессе адаптации кошелек или серверная часть должны локально нормализовать:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

После создания файла метаданных спонсора на шаге 8, отправьте инструкцию по требованию с подписью пользователя вместе с этими метаданными:

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

Текущий CLI не предоставляет типизированные команды для этих инструкций идентификации. Сгенерируйте сериализованные значения `InstructionBox` с помощью SDK и отправьте их через `ledger transaction stdin`:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

Соблюдайте эти правила в сервисе адаптации:

- Псевдонимы аккаунтов служат только для удобства чтения человеком
- Исходные значения телефона и электронной почты никогда не появляются в псевдонимах, метаданных, журналах или полезных данных транзакций
- учетная запись имеет `uaid` перед тем, как она запрашивает личные идентификаторы
- протокол результаты записи привязать `policy_id`, `opaque_id`, `uaid`, `account_id` и срок годности
- ключи резольвера и значения криптографических обязательств скрытых программ контролируются управлением

## 5. Включите спонсорство на узле {#_5-enable-sponsorship-on-the-node}

Спонсорство сборов является политикой узла/исполнения. Включите его в конфигурации сборов Nexus:

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

`fee_asset_id` является активом комиссии за сеть. Для SORA Nexus это XOR. Используйте активный псевдоним XOR или канонический идентификатор определения актива XOR, предоставляемый вашей сетью.

`sponsor_max_fee = "0"` означает, что нет максимума спонсорства на одну транзакцию. Для производства установите ненулевой максимум после того, как вы узнаете нормальный размер и профиль затрат на выполнение транзакций в вашем пространстве данных.

Перезапустите или примените эту настройку через обычный процесс оператора.

## 6. Создайте и финансируйте спонсора {#_6-create-and-fund-the-sponsor}

Создайте пару ключей спонсора при необходимости:

```bash
kagami keys --algorithm ed25519 --out-dir ./fee-sponsor-key
```

Преобразуйте публичный ключ в формат аккаунта для вашей сети:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

Зарегистрируйте спонсорский аккаунт через ваш приватный процесс регистрации:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

Финансируйте спонсора суммой XOR из казначейства, учетной записи претензий или другой финансируемой учетной записи:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

Для репетиций Taira сохраните помощника службы финансирования тестовой сети от [Получить тестовую сеть XOR на Taira](/ru/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) как `taira_faucet_claim.py`, затем профинансируйте спонсора с помощью публичной службы финансирования тестовой сети вместо перевода из казны:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

Проверьте баланс спонсора XOR:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. Предоставить пользователю доступ к спонсору {#_7-grant-a-user-access-to-the-sponsor}

Спонсор должен предоставить каждому пользователю разрешение взимать с него сборы. Именно это разрешение предотвращает возможность пользователей назначать произвольные учетные записи спонсора.

Запустите это от имени спонсорского аккаунта или от имени операционного аккаунта, разрешённого вашей политикой выполнения программного обеспечения:

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

Для услуг по подключению сделайте это обычным шагом предоставления аккаунта и зафиксируйте:

- учётная запись пользователя
- спонсорский аккаунт
- пространство данных или приложение
- билет на одобрение или решение по управлению

Чтобы проверить права пользователя:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. Прикрепить метаданные спонсора {#_8-attach-sponsor-metadata}

Создайте многократно используемый файл метаданных:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

Любое сочинение, представленное с этой метаданной, оплачивается спонсором:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

Для SDKs прикрепите тот же объект метаданных транзакции к подписанной транзакции. Пользователь подписывает транзакцию своим ключом. Спонсор не подписывает каждую транзакцию пользователя, потому что предыдущий грант `CanUseFeeSponsor` является авторизацией.

## Шаблон 1: Пользователи не платят комиссию {#pattern-1-users-pay-no-fees}

Используйте это, когда приложение или оператор поглощает все сетевые комиссии.

Контрольный список разработчика:

1. Оставьте обычный пакет транзакций пользователя без изменений.
2. Добавьте метаданные транзакции с `fee_sponsor`.
3. Войдите как пользователь.
4. Отправьте через маршрут частного пространства данных.

Учетной записи пользователя не требуется баланс XOR. Учетная запись спонсора должна поддерживать достаточный баланс XOR, чтобы покрыть настроенные комиссии Nexus.

## Шаблон 2: Пользователи платят местным токеном {#pattern-2-users-pay-a-local-token}

Используйте это, когда пользователи не должны владеть XOR, но пространство данных всё же требует внутреннюю плату за приложение, расход кредита или токен квоты.

В этой схеме локальный токен является платежом приложения. Он не является активом для оплаты сетевой комиссии. Спонсор по-прежнему оплачивает сетевую комиссию в XOR.

Например, используйте локальный токен в приватном пространстве данных:

```text
usage#billing.team
```

Финансируйте пользователей на `usage#billing.team` во время регистрации, продления подписки или распределения квоты. Затем сделайте транзакцию пользователя атомарной:

1. перевести местные токены от пользователя спонсору
2. выполнить запрошенную операцию приложения
3. включить метаданные `fee_sponsor`, чтобы спонсор оплатил XOR

Минимальный CLI тест на дым — это просто локальная передача токена, спонсируемая XOR:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

Для реального приложения не отправляйте локальную оплату токенами как отдельную транзакцию с наилучшими попытками. Создайте одну подписанную транзакцию, содержащую как оплату, так и бизнес-инструкцию, либо предоставьте точку входа контракта, которая собирает локальный токен перед выполнением бизнес-операции.

Соблюдайте политику конверсии в вашем приложении или контракте:

- какая операция стоит сколько местных токенов
- как приток локальных токенов соотносится с пополнениями спонсора XOR
- что происходит, когда баланс пользователя слишком низкий
- что происходит, когда баланс спонсора XOR слишком низкий

::: warning

Не используйте `gas_asset_id` для шаблона «local-token fee», если вы не хотите, чтобы спонсор также был начислен за этот актив затрат на выполнение транзакции. В текущем программном окружении, `fee_sponsor` также делает спонсора плательщиком за дебеты по настроенным активам газопровода. Для сборов с пользователей локального токена собирайте токен явно через перевод или правило контракта.

:::

## Ошибка отладки спонсируемых транзакций {#debug-failed-sponsored-transactions}

Обычные причины отказа обычно указывают на один пропущенный шаг настройки:

|Текст ошибки|Что проверить|
| --- | --- |
| `fee sponsorship is disabled` | `nexus.fees.sponsorship_enabled` все еще находится `false` на узле. |
| `fee sponsor is not authorized` |Пользователь не имеет `CanUseFeeSponsor` для этого спонсора.|
| `fee asset ... is missing` |Спонсор не обладает сконфигурированным активом комиссии XOR.|
| `fee balance ... is insufficient` |Пополните баланс спонсора XOR.|
| `fee exceeds sponsor_max_fee` |Увеличьте `sponsor_max_fee` или уменьшите размер транзакции/газ.|
| `invalid nexus fee asset id` |Исправьте `nexus.fees.fee_asset_id` или псевдоним актива XOR.|

При отладке шаблона 2 проверьте оба баланса:

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

## Управлять спонсором {#operate-the-sponsor}

Обращайтесь со спонсором как с казначейским счетом:

- держите отдельные ключи спонсора для тестовой сети, промежуточной и основной сети
- предупредить до того, как баланс спонсора XOR достигнет минимального уровня допуска
- установить ненулевой предел `sponsor_max_fee` после характеристики трафика
- ограничивать скорость спонсируемых записей в вашем приложении или шлюзе
- отозвать `CanUseFeeSponsor`, когда пользователи покидают пространство данных
- сверять криптографические хэши транзакций пользователя, локальные токен-платежи и списания спонсора XOR

Отозвать спонсорство у пользователя:

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

## Связанные страницы {#related-pages}

- [Подключиться к SORA Nexus Dataspaces](/ru/get-started/sora-nexus-dataspaces.md)
- [Управлять Iroha 3 через CLI](/ru/get-started/operate-iroha-via-cli.md)
- [Активы](/ru/blockchain/assets.md)
- [Разрешения](/ru/blockchain/permissions.md)
- [Токены разрешений](/ru/reference/permissions.md)
