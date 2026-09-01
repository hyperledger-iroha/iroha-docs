---
translation_locale: ru
translation_source: /blockchain/assets.md
translation_source_hash: c80e6025007653b355d373394465d04adefc1221c8f34d9008f1c9cbabd3dc40
translation_status: machine-validated
translation_engine: bing-translator-llm
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
- `balance_scope_policy`: являются ли балансы глобальными или ограниченными пространством данных
- `owned_by`: аккаунт, который зарегистрировал или владеет определением
- `total_quantity`: общий выданный объём
- `confidential_policy`: политика для операций с защищёнными активами

Идентификаторы определения активов являются каноническими непрозрачными адресами. Когда определение создается из домена и имени, Iroha может хранить эту проекцию домена/имени для UX и запросов, но каноническая текстовая форма — это сгенерированный адрес.

## Баланс активов {#asset-balance}

В `Asset` содержится:

- `id`: `AssetId`, который объединяет определение актива, счет держателя и необязательный диапазон баланса актива
- `value`: `Numeric` баланс

Аккаунт держателя является каноническим и бездоменным. Определение актива может быть проецировано в домен с квалификацией пространства данных, например `payments.universal`.

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
- `DataspaceRestricted`: балансы разделены по контексту пространства данных

Баланс, ограниченный области данных, полезен, когда одно и то же определение актива используется в нескольких областях данных Nexus, но балансы должны оставаться изолированными.

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

Все три примера являются операциями чтения. Чтобы выпустить, уничтожить или передать активы на Taira, используйте аккаунт с тестовой сетью и защищённый поток в [Подключиться к SORA Nexus Dataspaces](/ru/get-started/sora-nexus-dataspaces.md).

Для примера платного актива Taira сохраните помощника сервиса финансирования тестовой сети из [Получить тестовую сеть XOR на Taira](/ru/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) как `taira_faucet_claim.py`, затем сначала получите актив сервиса финансирования тестовой сети и используйте его в качестве актива для оплаты выполнения транзакции:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

Затем включите `--metadata ./taira.tx-metadata.json` в команды `ledger asset mint`, `ledger asset burn` и `ledger asset transfer`.

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
