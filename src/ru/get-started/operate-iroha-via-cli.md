---
translation_locale: ru
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 40714a6cd124d4b0342b0f6ecf321f286e714c0e236afd6fd7834c0cf0ad1165
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Управлять Iroha 3 через CLI {#operate-iroha-3-via-cli}

Бинарный файл `iroha` — клиент командной строки для Iroha 3. Он позволяет запрашивать состояние реестра, отправлять транзакции и проверять конечные точки для операторов.

## 1. Требования {#_1-prerequisites}

Из рабочей копии Iroha на задокументированной ревизии исходного кода сгенерируйте и запустите локальную сеть из четырёх узлов:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
./localnet/start.sh
```

В примерах ниже используется сгенерированная для неё конфигурация клиента `./localnet/client.toml`.

## 2. Базовая настройка CLI {#_2-basic-cli-setup}

Показать справку верхнего уровня:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI организован в следующие команды верхнего уровня:

- `account` — чтение и изменение учётных записей
- `explorer` — ленты обозревателя с общими фильтрами и постраничной выдачей
- `tx` — статус транзакций и вспомогательные операции с ними
- `ledger` для чтения и записи в распределённом блокчейн-реестре
- `trigger` — чтение, запись и исполнение триггеров
- `ops` для диагностики оператора
- `app` для помощников приложения API
- `contract` — вызовы контрактов, представления и локальная отладка; для развёртывания используйте `kagami contract deploy` или `musubi deploy`
- `tools` для диагностики и инструментов разработчика
- `dataspace` — планирование, применение и проверка определения пространства данных
- `taira` — диагностика Taira и подключение учётных записей
- `offline` — автономные кодировщики, отчёты и диагностика
- `soracloud` — вспомогательные средства платформы приложений Soracloud
- `sccp` — чтение, переводы и доказательства SORA Cross-Chain Protocol

Каждая команда, отправляющая транзакцию, требует явно указанного плательщика комиссии, например `--fee-payer authority`; перед подписанием CLI запрашивает точную комиссию.

Используйте `--output-format text` для вывода оператора в формате, удобном для чтения человеком, и `--machine` для строгого режима автоматизации.

## 3. Попробуйте публичную тестовую сеть Taira {#_3-try-the-public-taira-testnet}

Вы можете попробовать проверять только для чтения Taira перед запуском локального сетевого узла или созданием криптографического подписанта. Эти команды используют публичные маршруты Torii JSON и не тратят тестовые сети XOR.

Проверить статус Taira:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

Выведите домены, видимые неаутентифицированному читателю:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

Перечислите несколько определений активов и их текущее предложение:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Если у вас есть текущий бинарный файл `iroha`, запустите помощник диагностики Taira:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Создавайте `taira.client.toml` только тогда, когда будете готовы проверять подписанные команды. Конфигурация, пополнение через кран и последовательность проверок описаны в разделе [Подключение к пространствам данных SORA Nexus](/ru/get-started/sora-nexus-dataspaces.md). Не выполняйте команды записи в Taira, пока учётная запись не получит от крана актив для оплаты комиссии.

Для любого примера Taira CLI с оплатой комиссии пополните счёт подписанта через процесс с предварительной подготовкой запроса к крану из раздела [Получение тестовых XOR в Taira](/ru/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira), затем проверьте баланс:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Если маршрут крана возвращает `502`, подождите и повторите запрос. Это проблема доступности публичной тестовой сети, а не повод заново создавать ключи учётной записи.

Когда баланс станет виден, отправляйте операции записи с `--fee-payer authority`. Перед подписанием CLI запрашивает точную комиссию в комиссионном активе Taira:

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "hello from faucet-funded taira"
```

## 4. Основные команды распределенного блокчейн-реестра {#_4-basic-ledger-commands}

Перечислите все домены:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

Создание обычного домена использует декларативный планировщик алиасов; команда `ledger domain` не имеет подкоманды `register`. Подготовьте намерение `AliasSetupPlanRequestV1` без секретов для `docs.universal` с вашим SDK или сервисом онбординга, затем спланируйте и примените его:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

Намерение закрепляет идентификатор пространства данных, каноническую учётную запись владельца, срок аренды и текущий защитный параметр расчёта стоимости. Планировщик проверяет актуальное состояние и возвращает точный атомарный план `EnsureAlias` для отправки. Не копируйте защитные значения вручную из другой сети.

Отправьте простую ping-транзакцию:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority tx ping --msg "hello from iroha"
```

Прочитайте недавний блок или подпишитесь на события блока:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Команды оператора {#_5-operator-commands}

Команды оператора консенсуса требуют ключ среды исполнения из списка разрешённых. Храните его вне `client.toml` и передавайте абсолютный путь к файлу, доступному только владельцу:

```bash
# The generated localnet writes its allow-listed operator key here.
: "${OPERATOR_KEY_FILE:=$PWD/localnet/runtime/operator-signer.key}"

cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
```

Неавторитетная очередь, поток обработки программного обеспечения, выборы и диагностика полос выполнения:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
```

Зафиксированные линии консенсуса и статус экземпляров на этом узле:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi lanes
```

Параметры консенсуса в блокчейне:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi params
```

## 6. Куда идти дальше {#_6-where-to-go-next}

- [SDK учебные пособия](/ru/guide/tutorials/)
- [Конечные точки Torii](/ru/reference/torii-endpoints.md)
- [Работа с бинарными файлами Iroha](/ru/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)

Чтобы вывести полный снимок справки в Markdown из рабочей копии исходного кода, выполните:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > iroha-cli-help.md
```
