---
translation_locale: ru
translation_source: /blockchain/domains.md
translation_source_hash: 26e8efe6c728d0f819b12e7d8257777d3d4ea272f42fabf8aec727467146500f
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Домены {#domains}

Домены — это именованные пространства имён, зарегистрированные в `World`. В текущей модели данных Iroha 3 имя домена дополняется родительским пространством данных, поэтому канонический идентификатор имеет вид:

```text
domain.dataspace
```

Например, `payments.universal` обозначает домен `payments` внутри пространства данных `universal`.

## Структура {#structure}

Зарегистрированный `Domain` содержит:

- `id`: идентификатор `DomainId`, дополненный пространством данных
- `logo`: необязательный `SoraFS` URI для логотипа домена
- `metadata`: произвольные метаданные в формате ключ-значение
- `owned_by`: аккаунт, который владеет доменом, обычно аккаунт, который его зарегистрировал

Загрузочный пакет, используемый для материализации домена, это `NewDomain`. Он содержит `id`, необязательный `logo` и начальный `metadata`. Программная среда выполнения заполняет `owned_by` из авторизационного субъекта. Обычные клиенты не отправляют этот пакет напрямую.

## Регистрация {#registration}

Обычное создание домена использует декларативный процесс настройки псевдонима. Это сохраняет аренду SNS, возможности владельца, проверку цены комиссии и строку домена в одной атомарной `EnsureAlias` транзакции. `Register::Domain` остается поверхностью генезиса/загрузки, и команда `ledger domain` не имеет подкоманды `register`.

Создайте намерение `AliasSetupPlanRequestV1` без секретов с SDK или сервисом онбординга, затем пусть CLI запланирует это относительно текущего состояния и отправит точный план:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list --all
```

Намерение задаёт `payments.universal`, числовой идентификатор его пространства данных, канонического владельца в формате I105, приобретаемый срок аренды и защитную проверку текущей политики и расчёта платежа. Конечная точка планировщика — `POST /v1/aliases/setup/plan`. Возвращённый план привязан к цепочке, субъекту полномочий, состоянию и сроку действия. Для удаления домена по-прежнему используется [`Unregister`](/ru/blockchain/instructions.md#un-register).

Создание или удаление домена требует соответствующих прав управления доменом разрешение в рамках активного проверяющего программного обеспечения. Метаданные домена могут быть обновлены с помощью [`SetKeyValue` и `RemoveKeyValue`](/ru/blockchain/instructions.md#setkeyvalue-removekeyvalue) когда у уполномоченного субъекта есть разрешение на изменение этого домена.

## Запустите этот рабочий процесс на Taira {#try-it-on-taira}

Перечислите домены, которые в настоящее время видны в публичной тестовой сети Taira:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Сопоставьте публичный каталог линий с псевдонимами пространств данных:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Используйте первую команду, когда приложению нужно проверить существование домена. Каталог линий позволяет просмотреть линии, связанные с пространством данных, включая публичную или ограниченную видимость каждой линии и её состояние синхронизации относительно основной линии.

Настройка домена — это операция записи с комиссией. Перед её выполнением в Taira пополните учётную запись подписанта по процедуре с предварительной подготовкой запроса к крану из раздела [Получение тестовых XOR в Taira](/ru/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira), затем примените план, явно указав плательщика комиссии. Перед подписанием CLI рассчитывает точную комиссию.

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

Создайте намерение для уникального доменного имени при повторных запусках тестнета и используйте текущую политику Taira и защиту проверки цены комиссии для активов с комиссией. Не используйте повторно план, созданный для локальной сети или Minamoto.

## Отношения с другими субъектами {#relationship-to-other-entities}

Домены группируют распределённые объекты реестра блокчейна и предоставляют пространство имён для данных, ограниченных доменом. Определения активов используют идентификаторы, квалифицированные доменом. и запросы могут перечислять домены или находить объекты, относящиеся к домену. Сами учетные записи в текущей модели данных являются бездоменными, но учетные записи могут владеть доменами и иметь активы, определения которых находятся под доменами.

См. также:

- [Мир](/ru/blockchain/world.md)
- [Активы](/ru/blockchain/assets.md)
- [Метаданные](/ru/blockchain/metadata.md)
- [Правила именования](/ru/reference/naming.md)
