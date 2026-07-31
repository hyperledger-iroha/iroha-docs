---
translation_locale: ru
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 270e6705186d74efad6a8d2e6eeb432ab1b12649b66d4b11309e7da1e07b384f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Стоимость спонсоров для частного пространства данных {#sponsor-fees-for-a-private-dataspace}

Спонсорство по плате позволяет пользователям подавать транзакции в частном пространстве данных без
хозяйство XOR. Пользователь все еще подписывает транзакцию.
очка на счете спонсора, а время исполнения дебитов спонсора XOR баланс
за сетевую плату.

Интеграция состоит из трех движущихся частей:

1. узел позволяет оплачивать спонсорство
2. счет спонсора существует и имеет XOR
3. каждый пользователь имеет `CanUseFeeSponsor` для этого спонсора

После этого каждой транзакции спонсируемого пользователя нужны только эти метаданные:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

На этой странице показаны две общие модели:

- **Свободный пользователь пишет**: спонсор платит XOR и пользователь ничего не платит.
- **Сборы за местные токены**: пользователь платит спонсору в токене приложения, и
  спонсор оплачивает сеть в XOR.

Использование Taira Новое частное пространство данных - это
изменение оператора и управления; оно не создается по конфигурации клиента.

## Примерные значения {#example-values}

Нижеприведенные команды используют такие задержанные места:

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

Используйте канонический I105 счета IDs Если только у вас нет активной учетной записи
прозвища для тех же счетов.

## 1. Подготовить пространство данных {#_1-prepare-the-dataspace}

Начните с каталога частного пространства данных и работы маршрутизации, описанных в
[Подключить к SORA Nexus Данные](/ru/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace).
Фрагмент, обращенный к оператору, выглядит так:

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

Прежде чем перейти на транзакции с пользователями, проверьте:

- частная полоса появляется в узле `/status` Ответ
- учетные записи пользователей принимаются в вашем частном потоке включения
- существует счет спонсора
- в соответствии с XOR актива сбора и учетная запись сбора являются действительными в сети

## 2. Регистрировать активы в пространстве данных {#_2-register-assets-in-the-dataspace}

Зарегистрировать определения активов, которые пользователи будут держать внутри частного
За плату за локальные токены
Модель, используется в обучении `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

Сначала установить домен и SNS аренды, которые владеют именным пространством активов.
без секретов `AliasSetupPlanRequestV1` намерение `$BILLING_DOMAIN`, в том числе
цифровая `team` пространство данных ID, канонический владелец, срок аренды и текущая цена
охранник:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

Затем зарегистрируйте определение актива. `--id` является уровнем сети
определение активов ID. Прозвище - это то, что разработчики и конечные пользователи должны использовать в
код пространства данных:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

Монетка или передача локального токена пользователю во время набора:

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

Используйте тот же шаблон для активов приложений в пространстве данных.
определение активов на токен, дать каждому псевдоним пространства данных и ссылаться на
псевдоним от SDK код вместо строго кодирующего канонического определения активов IDs.

## 3. Зарегистрировать прозвища пользователей {#_3-register-user-aliases}

Расчеты по-прежнему каноничны . I105 счета IDs. Названия пользователей - учетные записи
прозвища, и прозвища должны быть нечувствительными ручками, такими как `alice@team` или
`alice@members.team`. Не используйте номера телефонов или адреса электронной почты как псевдоним.
Они принадлежат к частному идентификатору в следующем разделе.

Настройка Alias использует тот же декларативный планировщик, что и настройка домена. SDK или
сервис бортового обслуживания создать без секретов `AliasSetupPlanRequestV1` чьи цели
целевые показатели по вводу счетов `$USER`, выбирает первичную роль, забивает числовую
пространство данных ID, и несет текущий охранник лизингового котировок.
как одна атомная сделка:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

Если пользователь не должен платить XOR, использовать одобренный спонсор-сознательное на борту
услуги по созданию и представлению сделки настройки. Не делите аренду
Приобретение и прозвище обязательные для независимых заявок.

После того, как псевдоним будет связан, проверьте его с CLI:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

Для создания нового аккаунта предпочтительно использовать сервис, который
`NewAccount` со стойкой `uaid` и, при необходимости, первоначальный `label`. Сборник
простые `ledger account register --id` Командование регистрирует только канонические
счета ID.

## 4. Регистрируйте телефон и электронную почту в частном порядке FHE {#_4-register-phone-and-email-privately-with-fhe}

Используйте номера телефонов и адреса электронной почты в качестве частных идентификаторов, а не публичных
Прозвища. FHE-поддерживаемый поток сохраняет необработанные идентификаторы от фамилий счетов,
метаданные транзакции и мировое состояние:

1. оператор регистрирует
   [RAM-LFE/FHE политика программы](/ru/blockchain/ram-lfe.md) для телефона и электронной почты
2. оператор регистрирует активные политики идентификатора, такие как: `phone#team` и
   `email#team`
3. кошелек нормализует телефон или электронную почту локально
4. кошелек отправляет зашифрованное значение на решителя
5. Решатель возвращает `IdentifierResolutionReceipt`
6. пользователь представляет `ClaimIdentifier` с квитанцией
7. сеть хранит непрозрачный идентификатор и хэш расписки, а не сырой телефон или
   значение электронной почты

Политическая установка оператора является SDK Создать и подавать
эти пары инструкций для каждого типа идентификатора:

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

Повторяйте для электронной почты с:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

Во время включения кошелек или бэкэнд должны нормализоваться локально:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

После создания файла метаданных спонсора на шаге 8, представьте подписанный пользователем
инструкция по заявлению с этими метаданными:

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

Текущий CLI не раскрывает введенные команды для этих идентификаций
Указы. `InstructionBox` значения с SDK и
подать их через `ledger transaction stdin`:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

Держите эти ограждения в службе бортового обслуживания:

- Идентификаторы учетных записей - это только человекочитаемые ручки
- необработанные значения телефона и электронной почты никогда не появляются в псевдонимах, метаданных, журналах или
  полезные нагрузки транзакций
- в счете есть `uaid` до того, как он претендует на частные идентификаторы
- квитанции связаны `policy_id`, `opaque_id`, `uaid`, `account_id`, и истечение срока действия
- Ключи для решения задач и обязательства скрытых программ контролируются управлением .

## 5. Включить спонсорство в узле {#_5-enable-sponsorship-on-the-node}

Спонсорство по плате является политикой узлов/регулирования. Nexus конфигурация сбора:

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

`fee_asset_id` является активом сетевых сборов. SORA Nexus Это... XOR. Используйте
активный XOR псевдонимы или канонические XOR определение активов ID выставленной вашей сетью.

`sponsor_max_fee = "0"` означает, что не существует лимита спонсора за транзакцию.
выпуск, установить не нулевую лимит после того, как вы знаете нормальный размер и профиль газа
Ваших транзакций в пространстве данных.

Возобновить или перевернуть эту конфигурацию в обычном процессе оператора.

## 6. Создать и финансировать спонсора {#_6-create-and-fund-the-sponsor}

Если необходимо, создать парочку ключей спонсора:

```bash
kagami keys --algorithm ed25519 --json
```

Преобразовать общественный ключ в формат учетной записи для сети:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

Зарегистрируйте счет спонсора через свой частный поток входа:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

Финансировать спонсора с XOR из казначейства, счета по задолженности или другого финансируемого
счет:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

Для Taira репетиции, кроме помощника крана от
[Получить тестнет XOR на Taira](/ru/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
как `taira_faucet_claim.py`, Затем финансируйте спонсора с помощью общественного крана
вместо казначейской передачи:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

Проверь спонсора. XOR баланс:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. Предоставьте пользователю доступ к спонсору {#_7-grant-a-user-access-to-the-sponsor}

Спонсор должен предоставить каждому пользователю разрешение на взимание с него платы.
что мешает пользователям называть произвольные аккаунты спонсоров.

Используйте это как счет спонсора, или в качестве оперативного счета, разрешенного вашим
Политика времени выполнения:

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

Для услуг на борту, сделать это обычным шагом предоставления счета и запись:

- учетная запись пользователя
- счет спонсора
- пространство данных или приложение
- разрешение или решение о управлении

Для проверки субсидий пользователя:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. Присоедините метаданные спонсора {#_8-attach-sponsor-metadata}

Создать повторно используемый файл метаданных:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

Любая запись, представленная с этими метаданными, взимается с спонсора:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

Для SDKs, прикрепить один и тот же объект метаданных сделки к подписанному
транзакция. Пользователь подписывает транзакцию с ключем пользователя. Спонсор
не подписывает каждую транзакцию пользователя , потому что предыдущая `CanUseFeeSponsor`
Грант - это разрешение.

## Пример 1: Пользователи платят бесплатно {#pattern-1-users-pay-no-fees}

Используйте это, когда приложение или оператор поглощает все сетевые сборы.

Перечень разработчиков:

1. Сохраняйте нормальную полезную нагрузку транзакций пользователя неизменной.
2. Добавьте метаданные транзакции с `fee_sponsor`.
3. Подпишитесь как пользователь.
4. Подайте через частный маршрут пространства данных.

Учет пользователя не требует XOR Банковский баланс.
достаточно XOR для охвата конфигурированных Nexus сборы.

## Пример 2: Пользователи платят местный токен {#pattern-2-users-pay-a-local-token}

Используйте это, когда пользователи не должны держать XOR, но пространство данных все еще хочет
внутренние сборы за приложение, кредитные расходы или квоты.

В данной модели локальный токен является платежным приложением.
В настоящее время, по мере того как это происходит, спонсор все равно оплачивает сетевые сборы. XOR.

Например, используйте локальный токен в частном пространстве данных:

```text
usage#billing.team
```

Пользователи фондов с `usage#billing.team` во время ввода, продления подписки;
Затем сделать пользовательскую транзакцию атомной:

1. передавать локальные токены от пользователя спонсору
2. выполнять запрошенную операцию приложения
3. включает в себя `fee_sponsor` метаданные, так что спонсор платит XOR

Минимальный CLI Дымный тест - это просто местная передача токенов, спонсируемая XOR:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

Для реального приложения не подавайте платеж с локальным токеном в виде отдельного
Создать одну подписанную транзакцию, содержащую обе
оплаты и бизнес-инструкции, или раскрыть пункт ввода контракта, который
собирает локальный токен перед применением бизнес-операции.

Сохраняйте политику конверсии в своем приложении или контракте:

- какая операция стоит сколько локальных токенных единиц
- как местные токены вторгаются карты для спонсоров XOR пополнение
- что происходит, когда баланс пользователя слишком низкий
- что происходит, когда спонсор XOR баланс слишком низкий.

::: warning

Не используйте `gas_asset_id` для шаблона "оплата местных токенов", если вы не хотите
В настоящее время, в течение всего срока действия
`fee_sponsor` также делает спонсора плательщиком за конфигурированный газопровод
для местных токенов пользовательские сборы, собирать токены явно с помощью
правило о передаче или заключении договора.

:::

## Дебаг неудачных спонсируемых транзакций {#debug-failed-sponsored-transactions}

Обычные причины отказа обычно указывают на отсутствие одного этапа установки:

| Текст ошибки | Что проверить |
| --- | --- |
| `fee sponsorship is disabled` | `nexus.fees.sponsorship_enabled` Все еще `false` на узле. |
| `fee sponsor is not authorized` | Пользователь не имеет `CanUseFeeSponsor` для этого спонсора. |
| `fee asset ... is missing` | Спонсор не владеет конфигурированным XOR Плата. |
| `fee balance ... is insufficient` | Заполните спонсора. XOR сбалансировать. |
| `fee exceeds sponsor_max_fee` | Повышение `sponsor_max_fee` или уменьшить размер/газ транзакции. |
| `invalid nexus fee asset id` | Ремонт `nexus.fees.fee_asset_id` или XOR Прозвища активов. |

При отладке паттерна 2 проверьте оба баланса:

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

- держать отдельные ключи спонсора для тестовой сети, стажировки и основной сети
- предупреждение перед спонсором XOR баланс достигает уровня приема
- установить не нулевую `sponsor_max_fee` ограничение после характеристики движения
- спонсируемые записи в вашем заявке или шлюзе
- отзыв `CanUseFeeSponsor` когда пользователи покидают пространство данных
- согласовать хэши транзакций пользователей, платежи с локальными токенами и спонсоров XOR
  дебиты

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

## Схожие страницы {#related-pages}

- [Подключить к SORA Nexus Данные](/ru/get-started/sora-nexus-dataspaces.md)
- [Работать Iroha 3 через CLI](/ru/get-started/operate-iroha-via-cli.md)
- [Активы](/ru/blockchain/assets.md)
- [Разрешения](/ru/blockchain/permissions.md)
- [Токены разрешения](/ru/reference/permissions.md)
