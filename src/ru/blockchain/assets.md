---
translation_locale: ru
translation_source: /blockchain/assets.md
translation_source_hash: 58c9f7657f5714dc4bbb884933a1c947687fcf6c83e471007e6c7885f1dab214
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Активы {#assets}

Сборник Iroha Актив - это числовой баланс, находящийся на счете.
баланс указывает на `AssetDefinition`, и определение описывает, как
что актив может быть назван, запечатан, отображен и разделен.

## Определение активов {#asset-definition}

Сборник `AssetDefinition` содержит:

- `id`: адрес канонического определения активов
- `name`: имя дисплея, которое может быть прочитано человеком
- `description`: необязательное описание, которое можно прочитать человеком
- `alias`: факультативные псевдонимы в `<name>#<domain>.<dataspace>` или
  `<name>#<dataspace>` формы
- `spec`: числовая точность и ограничения для балансов
- `mintable`: Политика по уменьшению
- `logo`: по выбору `SoraFS` URI
- `metadata`: произвольные метаданные ключевого значения
- `balance_scope_policy`: являются ли балансы глобальными или
  ограничение пространства данных
- `owned_by`: счет, который зарегистрировал или владеет определением
- `total_quantity`: общее количество выпущенных
- `confidential_policy`: политика по операциям с защищенными активами

Определение активов IDs - это канонические непрозрачные адреса.
построенная из домена и названия, Iroha может сохранить этот домен/имя
Проекция для UX и запросов, но канонический текст формы является генерируемой
Адрес.

## Баланс активов {#asset-balance}

Сборник `Asset` содержит:

- `id`: в) `AssetId`, объединяет определение активов, счет держателя,
  и необязательный баланс
- `value`: а) `Numeric` баланс

Счет владельца является каноническим и без доменов.
Проектировано в рамках домена, квалифицированного для пространства данных, например
`payments.universal`.

## Очистимость {#mintability}

Определения активов поддерживают эти режимы mintability:

| Режим         | Значение                                                           |
| ------------ | ----------------------------------------------------------------- |
| `Infinitely` | Эластичный запас. Актив можно запечатать и сжечь неоднократно.    |
| `Once`       | Токен с фиксированной поставкой, который можно запечатать один раз, а потом сожгать.        |
| `Not`        | Токен с фиксированной поставкой, который можно сжечь, но не запечатать снова.       |
| `Limited(n)` | Заготовка монет допускается для ограниченного количества дополнительных операций. |

Использование `Infinitely` для обычных эластических активов и `Once` или `Limited(n)` для
активы с фиксированным или ограниченным объемом поставок. `Not` в качестве первоначального
политика, если только предложение активов уже не установлено.

## Степень действия баланса {#balance-scope}

Сборник `balance_scope_policy` Контроль за тем, как балансы подвергаются воздействию:

- `Global`: один балансовый ветер на счет и определение активов
- `DataspaceRestricted`: балансы разделены по контексту пространства данных

Ограниченные пространством данных балансы полезны, когда одно и то же определение актива
используется в нескольких Nexus С точки зрения данных, балансы должны оставаться изолированными.

## Попробуй . Taira {#try-it-on-taira}

Эти звонки для чтения показывают реальные определения активов на общественности Taira тестовая сеть:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Найти ток Taira XOR определение активов по счетам:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

Поищите определения, содержащие метаданные:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

Все три примера являются чистыми. Taira, использовать
счета, финансируемого на кране, и охраняемый поток в
[Подключить к SORA Nexus Данные](/ru/get-started/sora-nexus-dataspaces.md).

За оплату платы Taira Пример актива, сохранить помощник крана от
[Получить тестнет XOR на Taira](/ru/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
как `taira_faucet_claim.py`, Затем сначала претендуйте на актив крана и используйте его в качестве
транзакционный газовый актив:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

Затем включите `--metadata ./taira.tx-metadata.json` на `ledger asset mint`,
`ledger asset burn`, и `ledger asset transfer` - Команды.

## Инструкции {#instructions}

Активы могут быть зарегистрированы, запечатаны, сожжены и переданы с помощью Iroha
Специальные инструкции:

- [`Register` и `Unregister`](/ru/blockchain/instructions.md#un-register)
- [`Mint` и `Burn`](/ru/blockchain/instructions.md#mint-burn)
- [`Transfer`](/ru/blockchain/instructions.md#transfer)
- [`SetKeyValue` и `RemoveKeyValue`](/ru/blockchain/instructions.md#setkeyvalue-removekeyvalue)

См. также:

- [CLI руководство](/ru/get-started/operate-iroha-via-cli.md)
- [Rust Учебное пособие](/ru/guide/tutorials/rust.md)
- [Python Учебное пособие](/ru/guide/tutorials/python.md)
- [JavaScript/TypeScript Учебное пособие](/ru/guide/tutorials/javascript.md)
- [Модель данных](/ru/blockchain/data-model.md)
- [NFTs](/ru/blockchain/nfts.md)
