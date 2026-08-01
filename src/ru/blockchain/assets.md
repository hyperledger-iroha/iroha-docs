---
translation_locale: ru
translation_source: /blockchain/assets.md
translation_source_hash: c80e6025007653b355d373394465d04adefc1221c8f34d9008f1c9cbabd3dc40
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Активы {#assets}

Сборник Iroha Каждый конкретный баланс указывает на числовой баланс счета. `AssetDefinition`, и определение описывает, как этот актив может быть назван, изготовлен, отображен и разделен.

## Определение активов {#asset-definition}

`AssetDefinition` содержит:

- `id`: адрес канонического определения активов
- `name`: имя дисплея, которое может быть прочитано человеком
- `description`: необязательное описание, которое можно прочитать человеком
- `alias`: факультативные псевдонимы в форме `<name>#<domain>.<dataspace>` или `<name>#<dataspace>`
- `spec`: числовая точность и ограничения для балансов
- `mintable`: политика прозрачности
- `logo`: необязательное `SoraFS` URI
- `metadata`: произвольные метаданные ключевой стоимости
- `balance_scope_policy`: является ли баланс глобальным или ограниченным пространством данных;
- `owned_by`: учетная запись, которая зарегистрировала или владеет определением
- `total_quantity`: общее количество выпущенных товаров
- `confidential_policy`: политика по операциям с защищенными активами

Определение активов IDs - это канонические непрозрачные адреса. Когда определение создается из домена и имени, Iroha может сохранить этот проект домена / имени для UX и запросов, но каноническая форма текста является генерируемым адресом.

## Баланс активов {#asset-balance}

`Asset` содержит:

- `id`: сумма `AssetId`, которая сочетает в себе определение активов, счет держателя и объем необязательного баланса.
- `value`: баланс `Numeric`

Счет владельца является каноническим и без доменов. Определение активов может быть спроектировано в рамках домена, квалифицированного для пространства данных, например `payments.universal`.

## Сохранность {#mintability}

Определения активов поддерживают следующие режимы mintability:

|Режим .|Значение .|
| ------------ | ----------------------------------------------------------------- |
|`Infinitely` |Эластичный запас. Актив может быть заготовлен и сжжен неоднократно. |
|`Once` |Токен с фиксированной поставкой, который можно запечатать один раз, а затем сожгать.|
|`Not` |Токен с фиксированной поставкой, который можно сжечь, но не запечатать снова.|
|`Limited(n)` |Политика позволяет выпускать новые части активов в рамках ограниченного количества дополнительных операций. |

Используйте `Infinitely` для обычных упругих активов и `Once` или `Limited(n)` для активов с фиксированным или ограниченным спросом. Не используйте `Not` в качестве начальной политики, если предложение активов уже установлено.

## Объем баланса {#balance-scope}

`balance_scope_policy` управляет тем, как балансы загружаются в ведро:

- `Global`: один балансовый ветер на счет и определение активов
- `DataspaceRestricted`: балансы делятся по контексту пространства данных

Солдаты с ограничением пространства данных полезны, когда одно и то же определение активов используется в нескольких Nexus базах данных, но балансы должны оставаться изолированными.

## Попробуй на Taira {#try-it-on-taira}

Эти звонки для чтения только показывают реальные определения активов на публичной тестовой сети Taira:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Найти текущее определение актива сбора Taira XOR:

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

Чтобы запечатать, сжечь или перенести активы на Taira, используйте счет, финансируемый краном, и охраняемый поток в [Свяжитесь к SORA Nexus Датасесам](/ru/get-started/sora-nexus-dataspaces.md).

Для примера оплачиваемого актива Taira, запишите помощник крана из [Получайте Testnet XOR на Taira](/ru/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) как `taira_faucet_claim.py`, а затем сначала претендуйте на актив крана и используйте его в качестве газового актива транзакции:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

Затем включить `--metadata ./taira.tx-metadata.json` в команды `ledger asset mint`, `ledger asset burn` и `ledger asset transfer`.

## Инструкции {#instructions}

Активы могут быть зарегистрированы, запечатаны, сожжены и переданы с помощью Iroha Специальных инструкций:

- [`Register` и `Unregister`](/ru/blockchain/instructions.md#un-register)
- [`Mint` и `Burn`](/ru/blockchain/instructions.md#mint-burn)
- [`Transfer`](/ru/blockchain/instructions.md#transfer)
- [`SetKeyValue` и `RemoveKeyValue`](/ru/blockchain/instructions.md#setkeyvalue-removekeyvalue)

См. также:

- [руководство CLI](/ru/get-started/operate-iroha-via-cli.md)
- [Rust инструкция](/ru/guide/tutorials/rust.md)
- [Python инструкция](/ru/guide/tutorials/python.md)
- [JavaScript/TypeScript учебное пособие](/ru/guide/tutorials/javascript.md)
- [Модель данных](/ru/blockchain/data-model.md)
- [NFTs](/ru/blockchain/nfts.md)
