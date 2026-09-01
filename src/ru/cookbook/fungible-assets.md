---
translation_locale: ru
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 29f2bdb390fc93b97f8ed9108634f70e21ba747c8606fb84093d37e9586516c1
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Взаимозаменяемые активы {#fungible-assets}

## Результат {#outcome}

Проверяйте определения активов в реальном времени Taira и выполняйте процессы регистрации, выпуска, передачи, уничтожения и проверки баланса в сгенерированной локальной сети. Рецепт использует канонические неприставочные идентификаторы активов Base58, псевдонимы с квалификацией домена, аккаунт-идентификаторы без домена I105 и явную оплату комиссии.

## Предварительные требования {#prerequisites}

- `curl`, `jq`, Python 3.11 или более поздняя версия, Node.js 24 и текущий `iroha` CLI.
- Доступ только для чтения Taira.
- Для пошагового написания сгенерирована локальная сеть из [Запуск Iroha](/ru/get-started/launch-iroha.md) с `./localnet/client.toml` и Torii на `http://127.0.0.1:8080`.

## Шаги {#steps}

### 1. Проверить определения Taira без криптографической подписи {#_1-inspect-taira-definitions-without-a-signer}

Определения активов имеют непрозрачный идентификатор Base58, отображаемое имя, политику выпуска активов, числовую шкалу, необязательный псевдоним, владельца и общую сумму. Конкретный баланс также включает учетную запись держателя и необязательную область данных.

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

Запустите форму JavaScript с `node taira-assets.mjs`. Публичные идентификаторы активов — это простые значения Base58; читаемое значение, такое как `cookbook_credit#wonderland.universal`, является псевдонимом, который разрешается в один из этих идентификаторов.

### 2. Подготовьте основной принцип местной авторизации и пункт назначения {#_2-prepare-the-local-authority-and-destination}

Выведите локальный принцип авторизации из открытого ключа в сгенерированной конфигурации и выберите другой зарегистрированный аккаунт в качестве получателя. Приватный ключ не отображается.

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

### 3. Зарегистрируйте числовое определение {#_3-register-a-numeric-definition}

Этот локальный идентификатор является действительным неприставочным адресом активов в формате Base58. Псевдоним предоставляет удобочитаемую проекцию `domain.dataspace`. Масштаб `2` допускает две дробные цифры; опущение `--mint-once` сохраняет политику по умолчанию `Infinitely`.

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

Не используйте этот идентификатор повторно на Taira. Регистрация в публичной блокчейн-сети требует нового канонического идентификатора, домена/псевдонима, выделенного для вашего приложения, финансирования комиссии и разрешения программного обеспечения на регистрацию активов.

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

После уничтожения ожидайте баланс источника `64.50`, баланс назначения `25.50` и общее количество `90.00`.

::: warning Граница разрешений

На Taira прикрепите полученный из крана `taira.tx-metadata.json` и используйте `--fee-payer authority` для каждой записи. Регистрация и выпуск требуют разрешений активного валидатора; перевод и уничтожение требуют полномочий владельца источника баланса. Аккаунт с финансированием с тестовой сети не является автоматически эмитентом.

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
- Шаг 2 намеренно выбирает зарегистрированный целевой счет. Если допуск актива равен `ExplicitOnly`, обеспечьте баланс назначения через уполномоченный поток перед передачей. Аналогично названный охранник CLI не регистрирует аккаунт или баланс; он прерывается вместо добавления другой инструкции.
- Отклонение комиссии происходит до успешного выполнения обычной инструкции. Выберите плательщика, используйте метаданные актива комиссии сети и проверьте его баланс.
- Если фиксированное локальное определение уже существует с предыдущего запуска, запустите новую сгенерированную локальную сеть или продолжайте с её существующим состоянием. Никогда не заменяйте неправильную случайную строку идентификатора Base58.

## Исходные и связанные документы {#source-and-related-docs}

- [Интеграционные тесты жизненного цикла активов на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Rust примеры построения ресурсов на закреплённой версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [Активы](/ru/blockchain/assets.md)
- [Инструкции](/ru/blockchain/instructions.md)
- [Токены разрешений](/ru/reference/permissions.md)
- [JavaScript и TypeScript](/ru/guide/tutorials/javascript.md)
