---
translation_locale: ru
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 9391bab95aa0ee20c7f036cc175f3a6d3a8852e6ea90b09d9ebf1a838973c765
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Управление Iroha 3 через CLI {#operate-iroha-3-via-cli}

Бинарный `iroha` - клиент командной строки для Iroha 3. Используйте его для запроса состояния бухгалтерского учета, представления транзакций и проверки конечных точек оператора.

## 1. Предварительные условия {#_1-prerequisites}

Сначала запустите локальную сеть:

- [Запуск Iroha 3](./launch-iroha.md)

Ниже приведенные примеры предполагают создаваемую конфигурацию клиента из локальной сети, созданной в [Launch Iroha 3](./launch-iroha.md):

```bash
./localnet/client.toml
```

## Основная установка CLI {#_2-basic-cli-setup}

Покажите помощь высшего уровня:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI организуется в следующие командные группы высшего уровня:

- `account` для счетов-ориентированных коротких путей
- `tx` для помощников на уровне транзакций
- `ledger` для учетной записи читает и пишет
- `ops` для диагностики оператора
- `app` для помощников приложения API
- `contract` для использования контрактов и вызовов
- `tools` для диагностики и разработчиков коммунальных услуг
- `taira` для рабочих потоков, ориентированных на Taira и Nexus

Группа `ledger` также содержит помощников по транзакциям, специфическим для доменов, таких как `ledger transaction`.

Используйте `--output-format text` для выхода оператора, который читается человеком, и `--machine` для строгого режима автоматизации.

## Попробуйте публичную Taira тестовую сеть. {#_3-try-the-public-taira-testnet}

Вы можете попробовать проверку только для чтения Taira, прежде чем запустить локальный пир или создать подписитель. Эти команды используют общедоступные маршруты Torii JSON и не расходуют тестнет XOR.

Проверка состояния здоровья Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

Перечислить публичные домены в пространстве данных `universal`:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

Перечислить некоторые определения активов и их текущее предложение:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Если у вас есть текущий `iroha` бинарный, запустите помощник диагностики Taira:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Создать `taira.client.toml` только тогда, когда вы готовы протестировать подписанные команды. Смотрите [Соединитесь с SORA Nexus Dataspaces](/ru/get-started/sora-nexus-dataspaces.md) для конфигурации, крана и канарного потока. Не запускайте команды написания против Taira до тех пор, пока учетная запись не будет финансирована активами платы на кране.

Для любого примера с оплатой Taira CLI сохранить помощник крана из [Получайте Testnet XOR на Taira](/ru/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) как `taira_faucet_claim.py`, а затем сначала претендуйте на testnet XOR:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Если головоломка крана или маршрут претензии возвращается `502`, подождите и попробуйте снова. Это проблема общедоступности тестовой сети, а не сигнал для регенерации ключей от учетной записи.

После того, как баланс будет виден, прикрепите метаданные об активе сбора к записи:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. Основные команды Ledger {#_4-basic-ledger-commands}

Перечислить все домены:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Обычное создание доменов использует декларирующий псевдоним планировщик; команда `ledger domain` не имеет подкоманду `register`. Подготовить секретно-свободный `AliasSetupPlanRequestV1` намерение для `docs.universal` с помощью вашего SDK или сервиса набора, затем спланировать и применить его:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

Цель записывает пространство данных ID, канонический аккаунт владельца, срок аренды и текущий котирующий охранник. Планировщик проверяет состояние ожидания и возвращает точный атомный план `EnsureAlias` для представления. Не копируйте вручную значения охраны из другой сети.

Отправить простую транзакцию:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

Прочитайте недавний блок или подпишитесь на блокирующие события:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Команды оператора {#_5-operator-commands}

Статус консенсуса:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi status
```

Снимок задержки на каждой фазе:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

Доступность, коллектор, запас RBC и мгновенный снимок VRF:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

Параметры консенсуса в цепочке:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## 6. Куда идти дальше? {#_6-where-to-go-next}

- [SDK учебные пособия](/ru/guide/tutorials/)
- [конечные точки Torii](/ru/reference/torii-endpoints.md)
- [Работа с бинарными системами Iroha](/ru/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md)

Чтобы восстановить полный снимок помощи Markdown из исходной кассы, запустите:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
