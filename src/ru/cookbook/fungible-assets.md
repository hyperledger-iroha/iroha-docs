---
translation_locale: ru
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 669b5a1c12e9ab6ffb64e149148993e7b924feb29c6fa4db883a2065f58ecd7e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Фунгирующие активы {#fungible-assets}

## Результат {#outcome}

Проверяйте определения активов в прямом эфире Taira и заполняйте реестр, банкноту, передачу, сжигание и потоки проверки баланса на генерируемой локальной сети. рецепт использует каноническое непредставленное определение активов Base58 IDs, квалифицированные псевдонимы по домену, бездоменную учетную запись I105 IDs и явный платеж за сбор.

## Предварительные условия {#prerequisites}

- `curl`, `jq`, Python 3.11 или позже, Node.js 24, и текущий `iroha` CLI.
- Доступ только для чтения Taira.
- Для прохождения записи генерируется локальная сеть из [Запуск Iroha](/ru/get-started/launch-iroha.md), с `./localnet/client.toml` и Torii на `http://127.0.0.1:8080`.

## Шаги {#steps}

### 1. Проверяйте определения Taira без подписания {#_1-inspect-taira-definitions-without-a-signer}

Определения активов содержат непрозрачный Base58 ID, название дисплея, Политика пропускаемости, числовая шкала, факультативные псевдонимы, владелец и общее количество. Конкретный баланс также включает в себя учетную запись владельца и необязательный объем пространства данных.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] \
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity] \
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

Используйте форму JavaScript с помощью `node taira-assets.mjs`. Общественный актив IDs представляет собой пустые значения Base58; читаемая стоимость, такая как `cookbook_credit#wonderland.universal`, является псевдонимом, которое решается на одну из них IDs.

### 2. Подготовка местного органа власти и места назначения {#_2-prepare-the-local-authority-and-destination}

Вывести местный орган из общественного ключа в генерируемой конфигурации и выбрать другой зарегистрированный счет, как получатель.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
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

DESTINATION_ACCOUNT="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg source "$SOURCE_ACCOUNT" \
      '[.items[].id | select(. != $source)][0]'
)"
```

### 3. Зарегистрировать числовое определение {#_3-register-a-numeric-definition}

Этот локальный ID является действительным беспрефиксированным адресом определения активов Base58. Аллиз обеспечивает прочитываемую человеком проекцию `domain.dataspace`. Масштаб `2` позволяет использовать две частичные цифры; исключение `--mint-once` сохраняет дефолтную политику `Infinitely`.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'
ASSET_ALIAS='cookbook_credit#wonderland.universal'

iroha --config "$LOCAL_CONFIG" \
  --machine \
  --fee-payer authority \
  ledger asset definition register \
  --id "$ASSET_DEFINITION_ID" \
  --name cookbook_credit \
  --description 'Local cookbook credit' \
  --alias "$ASSET_ALIAS" \
  --scale 2
```

Не используйте этот ID на Taira. Регистрация в общественной сети требует новой канонической ID, домена/псевдоним, присвоенный вашему заявлению, финансирования сборов и разрешения на регистрацию активов за время действия.

### 4. Минетка, перевозка и сжигание {#_4-mint-transfer-and-burn}

Все команды письма выбирают в качестве плательщика комиссионных орган. CLI цитирует точную транзакцию перед подписанием и ожидает по умолчанию.

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

После сгорания ожидается баланс источника `64.50`, баланс назначения `25.50` и общее количество `90.00`.

::: warning Ограничение разрешения

На Taira присоединяйте выведенный из крана `taira.tx-metadata.json` и используйте `--fee-payer authority` для каждой записи. Регистрация и накладка требуют разрешений активного валидатора; передача и сжигание требуют полномочий над источником баланса.

:::

## Проверка {#verify}

Прочитайте как конкретные балансы, так и определение. Эти послегосударственные запросы являются критерием успеха, а квитанция по представлению сама по себе не является.

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

Заявления по применению должны сравнивать числовые значения как десятичные числа фиксированных точек, а не бинарные значения плавающих точек, и должны подтверждать определение ID и учет.

## Устранение неполадок {#troubleshooting}

- ID, содержащий `#`, является псевдоним или буквальным конкретным балансом, а не каноническим определением активов ID. Используйте пустое значение Base58 с `--definition`, или передайте привязанное псевдонимо с `--definition-alias`.
- ошибки `Scale` означают, что количество имеет больше фракционных цифр, чем позволяет определение.
- `Mintability` отказ означает, что политика `Once`, `Not` или `Limited(n)` исчерпала или не разрешает моление. Не переписывайте историю; используйте политику, возвращенную в запросе определения.
- Шаг 2 намеренно выбирает зарегистрированный учетный счет назначения. `ExplicitOnly`, Определение баланса назначения через разрешенный поток до перечисления. CLI охранник не регистрирует счет или баланс; он абортирует вместо того, чтобы добавить другое указание.
- Отказ в оплате происходит до успеха обычной инструкции. Выберите плательщика, используйте метаданные об активах сборов сети и проверьте его баланс.
- Если фиксированное локальное определение уже существует с более раннего запуска, запустите вновь созданную локальную сеть или продолжайте ее существующее состояние. Никогда не заменяйте неправильно сформированную случайную строку Base58 ID.

## Источник и связанные с ним документы {#source-and-related-docs}

- [Тесты интеграции жизненного цикла активов на финированном обязательстве](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Rust Примеры строительства активов на закрепленном обязательстве](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [Активы](/ru/blockchain/assets.md)
- [Инструкция](/ru/blockchain/instructions.md)
- [Токены разрешения](/ru/reference/permissions.md)
- [JavaScript и TypeScript](/ru/guide/tutorials/javascript.md)
