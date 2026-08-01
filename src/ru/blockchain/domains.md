---
translation_locale: ru
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Домены {#domains}

Домены называются пространствами имен, зарегистрированными в `World`. В текущей модели данных Iroha 3 домен квалифицируется своим материнским пространством данных, поэтому каноническим идентификатором является:

```text
domain.dataspace
```

Например, `payments.universal` называет домен `payments` в пространстве данных `universal`.

## Структура {#structure}

Регистрированный `Domain` содержит:

- `id`: квалифицированный для пространства данных `DomainId`
- `logo`: факультативная `SoraFS` URI для логотипа домена
- `metadata`: произвольные метаданные ключевой стоимости
- `owned_by`: счет, который является владельцем домена, обычно учетная запись, зарегистрировавшая его

Нагрузка загрузки, используемая для материализации домена, является `NewDomain`. Она несет `id`, факультативный `logo` и начальный `metadata`. Время выполнения заполняется `owned_by` от органа.

## Регистрация {#registration}

Обычное создание домена использует протокол установки декларирующего псевдонима. Это поддерживает договор аренды SNS, возможности владельца, стражу цитаты и ряд доменов в одной атомной транзакции `EnsureAlias`. `Register::Domain` остается поверхностью генезис/bootstrap, а команда `ledger domain` не имеет подпоказания `register`.

Создать секретное намерение `AliasSetupPlanRequestV1` с помощью службы SDK или сервиса включения, затем попросить CLI спланировать его против режима действия и представить точный план:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

Цель определяет `payments.universal`, его числовое пространство данных, канонический I105 владелец, срок приобретения аренды и охранник текущей политики/платежей. Конечный пункт планировщика - `POST /v1/aliases/setup/plan`; его возвращенный план ограничен цепочкой, полномочиями, государством и сроками. Удаление домена по-прежнему использует [`Unregister`](/ru/blockchain/instructions.md#un-register).

Создание или удаление домена требует соответствующего разрешения на управление доменом в соответствии с активным валидатором времени запуска. Метаданные домена могут быть обновлены с помощью [`SetKeyValue` и `RemoveKeyValue`](/ru/blockchain/instructions.md#setkeyvalue-removekeyvalue), когда у органа есть разрешение на изменение этого домена.

## Попробуй на Taira {#try-it-on-taira}

Перечислить домены, которые в настоящее время видны на общедоступной тестовой сети Taira:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Карта каталога публичной полосы обратно на псевдонимы пространства данных:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Используйте первую команду, когда приложение должно проверить наличие домена. Используй каталог полос, когда нужно подтвердить, является ли пространство данных публичным, ограниченным или отстает от основной полосы.

Доменная настройка - это платное письмо. Прежде чем попробовать его на Taira, сохранить помощник крана из [Получайте Testnet XOR на Taira](/ru/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) как `taira_faucet_claim.py`, финансируйте подписавшего через общественный кран и прикрепите метаданные с оплатой:

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

Создать намерение для уникального доменного имени на повторяющихся запусках тестовых сетей и использовать текущую политику Taira и защиту от котировок по сборам активов. Не используйте повторно план, созданный для localnet или Minamoto.

## Отношения с другими организациями {#relationship-to-other-entities}

Домены группируют объекты реестра и предоставляют пространство имен для данных по домену. Определения активов используют идентификаторы, квалифицированные для домена, и запросы могут перечислять домены или находить объекты, охваченные доменой. Счета сами по себе не имеют доменов в текущей модели данных, но счета могут владеть доменами и держать активы, чьи определения живут под доменами.

См. также:

- [Всемирный](/ru/blockchain/world.md)
- [Активы](/ru/blockchain/assets.md)
- [Метаданные](/ru/blockchain/metadata.md)
- [Правила присвоения наименований](/ru/reference/naming.md)
