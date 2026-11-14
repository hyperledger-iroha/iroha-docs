---
translation_locale: ru
translation_source: /blockchain/assets.md
translation_source_hash: f5f0eb99e76287db695cc21b8580fd2a9b4dc2a989237c1a1d3d7333c14561ce
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Активы {#assets}

Актив Iroha — это числовой баланс, хранящийся на счете. Каждый конкретный баланс указывает на `AssetDefinition`, а определение описывает, как этот актив может быть назван, выпущен, отображен и разделен.

## Определение актива {#asset-definition}

В `AssetDefinition` содержится:

- `id`: канонический адрес определения актива
- `name`: человеко-читаемое отображаемое имя
- `description`: необязательное человекочитаемое описание
- `alias`: необязательный псевдоним в форме `<name>#<domain>.<dataspace>` или `<name>#<dataspace>`
- `spec`: числовая точность и ограничения для балансов
- `mintable`: политика выпуска активов
- `logo`: необязательно `SoraFS` URI
- `metadata`: произвольные метаданные в формате ключ-значение
- `balance_scope_policy`: являются ли балансы глобальными или ограничены пространством данных
- `owning_domain`: домен-владелец определения, принадлежащего домену; отсутствует у определений, зарегистрированных непосредственно в пространстве данных
- `owned_by`: аккаунт, который зарегистрировал или владеет определением
- `total_quantity`: общий выданный объём
- `confidential_policy`: политика для операций с защищёнными активами

Идентификаторы определения активов являются каноническими непрозрачными адресами. Когда определение создается из домена и имени, Iroha может хранить эту проекцию домена/имени для UX и запросов, но каноническая текстовая форма — это сгенерированный адрес.

## Баланс активов {#asset-balance}

В `Asset` содержится:

- `id`: `AssetId`, который объединяет определение актива, счет держателя и необязательный диапазон баланса актива
- `value`: `Quantity` баланс

Учётная запись держателя канонична и не содержит домен. Определение актива может быть представлено в домене, имя которого дополнено пространством данных, например `payments.universal`.

## Политика выпуска активов {#mintability}

Определения активов поддерживают эти режимы политики выпуска активов:

|Режим|Значение|
| ------------ | ----------------------------------------------------------------- |
| `Infinitely` |Эластичное предложение. Актив может выпускаться и уничтожаться повторно.|
| `Once`       |Токен с фиксированным предложением. Его можно выпустить один раз и затем уничтожить.|
| `Not`        |Токен с фиксированным предложением, который можно уничтожить, но нельзя выпустить снова.|
| `Limited(n)` |Политика позволяет выпускать новые единицы активов в ограниченном числе дополнительных операций.|

Используйте `Infinitely` для обычных эластичных активов и `Once` или `Limited(n)` для активов с фиксированным или ограниченным предложением. Не используйте `Not` в качестве начальной политики, если предложение актива уже не установлено.

## Объем баланса активов {#balance-scope}

`balance_scope_policy` управляет тем, как распределяются балансы:

- `Global`: одна балансная партия на каждый счёт и определение актива
- `DataspaceRestricted`: балансы разделяются по контексту пространства данных

Балансы, ограниченные пространством данных, полезны, когда одно определение актива используется в нескольких пространствах данных SORA Nexus, но балансы должны оставаться изолированными.

## Запустите этот рабочий процесс на Taira {#try-it-on-taira}

Эти запросы только для чтения API показывают определения реальных активов в публичной тестовой сети Taira:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Найдите текущую дефиницию актива комиссии Taira XOR:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

Ищите определения, которые содержат метаданные:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

Все три примера выполняют чтение. Для выпуска, сжигания или перевода активов в Taira используйте учётную запись, пополненную через кран тестовой сети, и защищённую проверками процедуру из раздела [Разработка на SORA Nexus с использованием Taira и Minamoto](/ru/get-started/sora-nexus-dataspaces.md).

Для примера операции с активами Taira, требующей комиссии, сначала пополните учётную запись подписанта по процедуре с предварительной подготовкой запроса к крану из раздела [Получение тестовых XOR в Taira](/ru/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira). Затем укажите `--fee-payer authority` в командах `ledger asset mint`, `ledger asset burn` и `ledger asset transfer`. Перед подписанием CLI рассчитывает точную комиссию в активе, используемом для оплаты комиссий Taira.

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  ledger asset transfer \
  --definition "<ASSET_DEFINITION_BASE58>" \
  --account "<TAIRA_I105_ACCOUNT_ID>" \
  --to "<RECIPIENT_I105_ACCOUNT_ID>" \
  --quantity 1
```

## Инструкции {#instructions}

Активы могут быть зарегистрированы, выпущены, уничтожены и переданы с помощью операций инструкции Iroha:

- [`Register` и `Unregister`](/ru/blockchain/instructions.md#un-register)
- [`Mint` и `Burn`](/ru/blockchain/instructions.md#mint-burn)
- [`Transfer`](/ru/blockchain/instructions.md#transfer)
- [`SetKeyValue` и `RemoveKeyValue`](/ru/blockchain/instructions.md#setkeyvalue-removekeyvalue)

См. также:

- [CLI руководство](/ru/get-started/operate-iroha-via-cli.md)
- [Rust учебное пособие](/ru/guide/tutorials/rust.md)
- [Python учебное пособие](/ru/guide/tutorials/python.md)
- [JavaScript/TypeScript учебное пособие](/ru/guide/tutorials/javascript.md)
- [Модель данных](/ru/blockchain/data-model.md)
- [NFTs](/ru/blockchain/nfts.md)
