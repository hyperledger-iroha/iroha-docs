---
translation_locale: ru
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Домены {#domains}

Домены - это названия именных пространств, зарегистрированных в `World`. В настоящее время Iroha
3 модели данных домен квалифицируется по его материнской пространству данных, так что канонический
идентификатор:

```text
domain.dataspace
```

Например, `payments.universal` названия `payments` Домен внутри
`universal` пространство данных.

## Структура {#structure}

Зарегистрированная `Domain` содержит:

- `id`: Квалифицированные для пространства данных `DomainId`
- `logo`: выборочный `SoraFS` URI для логотипа домена
- `metadata`: произвольные метаданные ключевого значения
- `owned_by`: счет, который владеет доменом, обычно счет, который
  зарегистрировано

Полезная нагрузка bootstrap используется для материализации домена `NewDomain`. Он несет
в) `id`, по выбору `logo`, и первоначальный `metadata`. Время исполнения
`owned_by` Обычные клиенты не предоставляют эту полезную нагрузку.
прямо.

## Регистрация {#registration}

Обычное создание домена использует декларативный псевдоним потока настройки.
SNS аренда, возможности владельца, охрана цитаты и ряд доменов в одной атомной
`EnsureAlias` транзакции. `Register::Domain` остается генезисом/bootstrap
поверхности, а также `ledger domain` команды нет `register` Подкомандующий.

Создайте без секретов `AliasSetupPlanRequestV1` намерение с SDK или на борту
Служба, то имейте CLI Планируйте его против живого состояния и представьте точную
План:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

Цель определяет `payments.universal`, его числовой пространство данных, канонический
I105 владельца, срок приобретения аренды и текущая политика/оценка платежей.
Конечная точка планировщика `POST /v1/aliases/setup/plan`; его возвращенный план
Доменное удаление до сих пор используется для
[`Unregister`](/ru/blockchain/instructions.md#un-register).

Создание или удаление домена требует соответствующего управления доменом
Доменные метаданные могут быть обновлены с помощью
[`SetKeyValue` и `RemoveKeyValue`](/ru/blockchain/instructions.md#setkeyvalue-removekeyvalue)
если у власти есть разрешение на изменение данного домена.

## Попробуй . Taira {#try-it-on-taira}

Перечислить домены , которые в настоящее время видны на публике Taira тестовая сеть:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Карта каталога публичных полос обратно на псевдонимы пространства данных:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Используйте первую команду, когда приложение должно проверить наличие домена.
каталог полос, когда вам нужно подтвердить, является ли пространство данных публичным;
ограничены или отстают за основной полосой.

Доменная установка - это платное письмо. Taira, сохранить
помощник крана из
[Получить тестнет XOR на Taira](/ru/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
как `taira_faucet_claim.py`, финансировать подписавшегося через общественный кранок, и
присоединение метаданных по сборам:

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

Создать намерение для уникального доменного имени на повторных тестов сети, и использовать
Taira План не используется повторно .
для локальной сети или Minamoto.

## Отношения с другими организациями {#relationship-to-other-entities}

Домены группируют объекты реестра и предоставляют пространство имен для данных по домену.
Определения активов используют идентификаторы, соответствующие домену, и запросы могут включать в себя список
Домены или найти объекты, охваченные доменом.
домен без в текущей модели данных, но учетные записи могут владеть доменами и держать
активы, чьи определения живут под доменами.

См. также:

- [Мир](/ru/blockchain/world.md)
- [Активы](/ru/blockchain/assets.md)
- [Метаданные](/ru/blockchain/metadata.md)
- [Правила присвоения наименований](/ru/reference/naming.md)
