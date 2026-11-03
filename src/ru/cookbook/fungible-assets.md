---
translation_locale: ru
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 3287a6bbaf06ec92ebbe9ac33a8294d4e1d232bc01fd6a5da13ddd166c620965
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Взаимозаменяемые активы {#fungible-assets}

## Результат {#outcome}

Проверяйте определения активов Taira в реальном времени и выполняйте процесс выпуска, передачи, уничтожения и проверки баланса в сгенерированной локальной сети. Рецепт использует канонические идентификаторы определений активов Base58 без префикса, идентификаторы аккаунтов I105 без домена и явную оплату комиссии.

## Предварительные требования {#prerequisites}

- `curl`, `jq`, Python 3.11 или более поздняя версия, Node.js 24 и текущие CLIs `iroha` и `kagami`.
- Доступ только для чтения Taira.
- Для пошагового примера записи — локальная сеть, созданная командой `kagami localnet generate --peers 4 --out-dir ./localnet`, как в [Запуск Iroha](/ru/get-started/launch-iroha.md), с добавленным `--asset-definition-id 66owaQmAQMuHxPzxUN3bqZ6FJfDa`. Она предоставляет `./localnet/client.toml` и Torii на `http://127.0.0.1:8080`.

## Шаги {#steps}

### 1. Проверить определения Taira без криптографической подписи {#_1-inspect-taira-definitions-without-a-signer}

Определения активов имеют непрозрачный идентификатор Base58, отображаемое имя, политику выпуска активов, числовую шкалу, необязательный псевдоним, владельца, необязательный домен или пространство данных, которому принадлежит определение, политику баланса и общую сумму. Конкретный баланс также включает учетную запись держателя и необязательную область пространства данных.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[]
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity]
    | @tsv'
```

```js [Node.js]
const response = await fetch(
  'https://taira.sora.org/v1/assets/definitions?limit=10',
  { headers: { Accept: 'application/json' } },
)
if (!response.ok) throw new Error(`Taira returned HTTP ${response.status}`)

const { items } = await response.json()
for (const definition of items) {
  console.log({
    id: definition.id,
    name: definition.name,
    mintable: definition.mintable,
    total: definition.total_quantity,
  })
}
```

:::

Запустите форму JavaScript с `node taira-assets.mjs`. Публичные идентификаторы активов — это простые значения Base58; читаемое значение, такое как `cookbook_credit#wonderland.universal`, является псевдонимом, который разрешается в один из этих идентификаторов.

### 2. Подготовьте основной принцип местной авторизации и пункт назначения {#_2-prepare-the-local-authority-and-destination}

Выведите локальный полномочный субъект из открытого ключа в сгенерированной конфигурации, затем создайте пару ключей для нового аккаунта получателя и зарегистрируйте его. Приватный ключ не отображается.

```bash
LOCAL_CONFIG='./localnet/client.toml'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
SOURCE_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

kagami keys --out-dir ./cookbook-recipient
DESTINATION_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert \
    "$(cat ./cookbook-recipient/public.key)"
)"
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  account register --id "$DESTINATION_ACCOUNT"
```

### 3. Используйте числовое определение, принадлежащее клиенту {#_3-use-a-client-owned-numeric-definition}

Вне генезиса определение регистрируется в принадлежащем подписанту домене `--domain`, а клиент сгенерированной локальной сети не владеет ни одним доменом. Локальная сеть, сгенерированная с `--asset-definition-id`, уже содержит это определение: генезис зарегистрировал его с неограниченным масштабом, сделал клиента его владельцем и выпустил клиенту 1 000 000 000 единиц.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

Не используйте этот идентификатор повторно на Taira. Регистрация в публичной блокчейн-сети требует нового канонического идентификатора, домена-владельца, которым владеет ваш аккаунт (передаётся в `ledger asset definition register` как `--domain`), предоставленного разрешения `CanManageAssetDefinitionAlias` для любого псевдонима и финансирования комиссии.

### 4. выпускать, передавать и уничтожать {#_4-mint-transfer-and-burn}

Все команды записи явно выбирают авторизованное лицо в качестве плательщика комиссии. CLI цитирует точную транзакцию перед подписью и по умолчанию ожидает.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset mint \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 100.00

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset transfer \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --to "$DESTINATION_ACCOUNT" \
  --quantity 25.50

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset burn \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 10.00
```

После уничтожения ожидайте баланс источника `1000000064.50`, баланс назначения `25.50` и общее количество `1000000090.00`.

::: warning Граница разрешений

На Taira используйте `--fee-payer authority` для каждой записи; CLI получает точную котировку комиссии в активе комиссии Taira до подписания. Для регистрации нужно владеть доменом `--domain` определения, а для псевдонима также нужно `CanManageAssetDefinitionAlias`. Для выпуска нужно владеть определением или иметь `CanMintAssetWithDefinition` или `CanMintAssetToAccount`; перевод и уничтожение требуют полномочий над исходным балансом. Аккаунт, пополненный через службу финансирования тестовой сети, не становится автоматически эмитентом.

:::

## Проверить {#verify}

Прочитайте оба конкретных баланса, а затем определение. Эти запросы после состояния являются критерием успешности; запись результата протокола отправки сама по себе таковой не является.

```bash
iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$DESTINATION_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

Утверждения приложения должны сравнивать числовые значения как десятичные значения с фиксированной точкой, а не бинарные значения с плавающей точкой, и должны проверять как идентификатор определения, так и учетную запись.

## Устранение неполадок {#troubleshooting}

- Идентификатор, содержащий `#`, является псевдонимом или конкретной литеральной балансовой величиной, а не каноническим идентификатором определения актива. Используйте чистое значение Base58 с `--definition` или передайте связанный псевдоним с `--definition-alias`.
- Ошибки `Scale` означают, что количество имеет больше знаков после запятой, чем разрешено определением.
- `Mintability` отказ означает, что политика `Once`, `Not` или `Limited(n)` исчерпана или запрещена к выпуску. Не переписывайте историю; используйте политику, возвращённую запросом определения.
- Шаг 2 явно регистрирует аккаунт назначения, поэтому перевод работает и тогда, когда допуск аккаунтов равен `ExplicitOnly`. Аналогично названная защита CLI не регистрирует аккаунт или баланс; она прерывает выполнение вместо добавления другой инструкции.
- Отклонение комиссии происходит до успешного выполнения обычной инструкции. Выберите плательщика, сверьте актив комиссии и максимум в котировке комиссии CLI и проверьте этот баланс.
- Повторный запуск в той же локальной сети начинается с прежних балансов, а `kagami keys` отказывается использовать существующий `./cookbook-recipient`. Запустите новую сгенерированную локальную сеть и удалите этот каталог либо сравнивайте изменения балансов вместо абсолютных значений. Никогда не подставляйте неправильно сформированную случайную строку вместо идентификатора Base58.

## Исходные и связанные документы {#source-and-related-docs}

- [Интеграционные тесты жизненного цикла активов на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/asset.rs)
- [Rust примеры построения ресурсов на закреплённой версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/examples/tutorial.rs)
- [Активы](/ru/blockchain/assets.md)
- [Инструкции](/ru/blockchain/instructions.md)
- [Токены разрешений](/ru/reference/permissions.md)
- [JavaScript и TypeScript](/ru/guide/tutorials/javascript.md)
