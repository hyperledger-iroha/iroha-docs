---
translation_locale: ru
translation_source: /blockchain/domains.md
translation_source_hash: 5e52579436a181d76c83fa549991e56064ae57349b7109d5c41ec7953e5cbb2e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Домены {#domains}

Домены — это именованные пространства, зарегистрированные в `World`. В текущей модели данных Iroha 3 домен определяется его родительским пространством данных, поэтому канонический идентификатор выглядит следующим образом:

```text
domain.dataspace
```

Например, `payments.universal` называет домен `payments` внутри пространства данных `universal`.

## Структура {#structure}

Зарегистрированный `Domain` содержит:

- `id`: квалифицированный по пространству данных `DomainId`
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

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

Намерение идентифицирует `payments.universal`, его числовое пространство данных, каноническое I105 владелец, срок приобретения по лизингу и текущая политика/плата за оплату - проверка цены. Планировщик API конечная точка является `POST /v1/aliases/setup/plan`; его возвращенный план привязан к цепочке, идентификатору авторизации транзакции, распределённое состояние реестра блокчейна и крайний срок. Удаление домена всё ещё использует [`Unregister`](/ru/blockchain/instructions.md#un-register).

Создание или удаление домена требует соответствующих прав управления доменом разрешение в рамках активного проверяющего программного обеспечения. Метаданные домена могут быть обновлены с помощью [`SetKeyValue` и `RemoveKeyValue`](/ru/blockchain/instructions.md#setkeyvalue-removekeyvalue) когда у уполномоченного субъекта есть разрешение на изменение этого домена.

## Запустите этот рабочий процесс на Taira {#try-it-on-taira}

Перечислите домены, которые в настоящее время видны в публичной тестовой сети Taira:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Отобразите каталог публичной линии исполнения обратно на псевдонимы пространства данных:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Используйте первую команду, когда приложению нужно проверить, существует ли домен. Используйте каталог исполнительной линии, когда необходимо подтвердить, является ли дата-пространство публичным, ограниченным или отстающим от основной исполнительной линии.

Настройка домена является платной записью. Перед тем как попробовать это на Taira, сохраните помощника службы финансирования тестовой сети из [Получить тестовую сеть XOR на Taira](/ru/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) как `taira_faucet_claim.py`, профинансируйте криптографического подписанта через публичную службу финансирования тестовой сети и прикрепите метаданные сборов:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
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
