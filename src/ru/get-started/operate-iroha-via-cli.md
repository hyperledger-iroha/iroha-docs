---
translation_locale: ru
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: c070c86b715b36079a7b6a47de2e31144187d7ebc6309f294a346be61a372660
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Управлять Iroha 3 через CLI {#operate-iroha-3-via-cli}

Двоичный файл `iroha` является клиентом командной строки для Iroha 3. Используйте его для запроса состояния распределённого реестра блокчейнов, отправки транзакций и проверки конечных точек операторов API.

## 1. Требования {#_1-prerequisites}

Сначала запустите локальную сеть:

- [Запуск Iroha 3](./launch-iroha.md)

Примеры ниже предполагают сгенерированную конфигурацию клиента из локальной сети, созданной в [Запуск Iroha 3](./launch-iroha.md):

```bash
./localnet/client.toml
```

## 2. Базовая настройка CLI {#_2-basic-cli-setup}

Показать справку верхнего уровня:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI организован в следующие команды верхнего уровня:

- `account` для ярлыков, ориентированных на учетную запись
- `tx` для помощников на уровне транзакций
- `ledger` для чтения и записи в распределённом блокчейн-реестре
- `ops` для диагностики оператора
- `app` для помощников приложения API
- `contract` для развертывания контракта и технических вызовов
- `tools` для диагностики и инструментов разработчика
- `taira` для рабочих процессов, ориентированных на Taira и Nexus

Группа `ledger` также содержит специализированные помощники по транзакциям, такие как `ledger transaction`.

Используйте `--output-format text` для вывода оператора в формате, удобном для чтения человеком, и `--machine` для строгого режима автоматизации.

## 3. Попробуйте публичную тестовую сеть Taira {#_3-try-the-public-taira-testnet}

Вы можете попробовать проверять только для чтения Taira перед запуском локального сетевого узла или созданием криптографического подписанта. Эти команды используют публичные маршруты Torii JSON и не тратят тестовые сети XOR.

Проверить статус Taira:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

Список общедоступных областей в пространстве данных `universal`:

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

Создавайте `taira.client.toml` только тогда, когда вы готовы тестировать подписанные команды. Смотрите [Подключиться к SORA Nexus Dataspaces](/ru/get-started/sora-nexus-dataspaces.md) для конфигурации, сервиса финансирования тестовой сети и канарейного потока. Не выполняйте команды записи в Taira, пока аккаунт не будет профинансирован с помощью тестового сетевого сервисного актива.

Для любого примера Taira CLI с оплатой, сохраните помощника службы финансирования тестовой сети от [Получить тестовую сеть XOR на Taira](/ru/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) как `taira_faucet_claim.py`, затем сначала запросите тестовую сеть XOR:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Если служба финансирования тестовой сети или маршрут запроса возвращает `502`, подождите и попробуйте снова. Это проблема доступности публичной тестовой сети, а не сигнал к регенерации ключей аккаунта.

После того как баланс станет видимым, прикрепите метаданные активов комиссии к записям:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. Основные команды распределенного блокчейн-реестра {#_4-basic-ledger-commands}

Перечислите все домены:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Создание обычного домена использует декларативный планировщик алиасов; команда `ledger domain` не имеет подкоманды `register`. Подготовьте намерение `AliasSetupPlanRequestV1` без секретов для `docs.universal` с вашим SDK или сервисом онбординга, затем спланируйте и примените его:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

Intent фиксирует идентификатор пространства данных, канонический аккаунт владельца, срок аренды и текущий контроль проверки стоимости платы. Планировщик проверяет текущее состояние и возвращает точный атомарный план `EnsureAlias` для отправки. Не копируйте значения контроля с другой сети.

Отправьте простую ping-транзакцию:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

Прочитайте недавний блок или подпишитесь на события блока:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Команды оператора {#_5-operator-commands}

Команды оператора консенсуса требуют ключа программного обеспечения из разрешённого списка. Держите его вне `client.toml` и явно передавайте файл, доступный только владельцу:

```bash
: "${OPERATOR_KEY_FILE:=./secrets/operator.key}"

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

Наивысшие и заблокированные сертификаты кворума консенсуса:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi qc
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
- [Torii API конечные точки](/ru/reference/torii-endpoints.md)
- [Работа с бинарными файлами Iroha](/ru/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/README.md)

Чтобы заново создать полный снимок справочных данных Markdown из рабочей копии исходного кода, выполните:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
