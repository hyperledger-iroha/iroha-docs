---
translation_locale: ru
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 9391bab95aa0ee20c7f036cc175f3a6d3a8852e6ea90b09d9ebf1a838973c765
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Работать Iroha 3 через CLI {#operate-iroha-3-via-cli}

Сборник `iroha` бинарный - клиент командной строки для Iroha 3. Используйте его для запроса
отчетность, представление транзакций и проверка конечных точек оператора.

## 1. Предварительные условия {#_1-prerequisites}

Сначала запустите локальную сеть:

- [Запуск Iroha 3](./launch-iroha.md)

Ниже приведенные примеры предполагают создаваемую конфигурацию клиента из локальной сети
создано в [Запуск Iroha 3](./launch-iroha.md):

```bash
./localnet/client.toml
```

## 2. Основные CLI Настройка {#_2-basic-cli-setup}

Покажите помощь высшего уровня:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

Сборник CLI организуется в следующие командные группы высшего уровня:

- `account` для счетноориентированных скортиков
- `tx` для помощников на уровне транзакций
- `ledger` для читающих и пишущих
- `ops` для диагностики оператора
- `app` для приложения API помощники
- `contract` для использования контрактов и вызовов
- `tools` для диагностики и разработчиков
- `taira` для Taira и Nexus- ориентированные рабочие процессы

Сборник `ledger` Группа также содержит помощников для конкретных доменов транзакций, таких как
`ledger transaction`.

Использование `--output-format text` для человекочитаемой мощности оператора и `--machine`
для строгого режима автоматизации.

## 3. Попробуйте рассказать о людях Taira Тестная сеть {#_3-try-the-public-taira-testnet}

Ты можешь попробовать только читать. Taira проверки перед запуском локального сверстника или созданием
Эти команды используют общественное Torii JSON маршруты и не тратить тестнет
XOR.

Проверка Taira здоровье:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

Перечень общедоступных доменов в `universal` пространство данных:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

Перечислить несколько определений активов и их текущее предложение:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Если у вас есть тока `iroha` бинарный, запустить Taira помощник диагностики:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Создать `taira.client.toml` только когда вы готовы испытать подписанные команды.
Посмотрите. [Подключить к SORA Nexus Данные](/ru/get-started/sora-nexus-dataspaces.md)
для конфигурации, крана и канарийского потока.
Taira до тех пор, пока счет не будет финансироваться с помощью актива по оплате крана.

За любые платежи Taira CLI Например, сохранить помощник крана от
[Получить тестнет XOR на Taira](/ru/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
как `taira_faucet_claim.py`, Затем претензионная тест-нетка XOR Во-первых:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Если трубка или маршрут претензии возвращается `502`, Подождите и попробуйте еще раз.
проблема общей доступности тестовой сети, а не сигнал для регенерации ключей от учетной записи.

После того, как баланс будет виден, прикрепите метаданные об активе сбора к записи:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. Основные команды Ledger {#_4-basic-ledger-commands}

Список всех доменов:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Обычное создание домена использует декларативный псевдоним планировщик; `ledger
domain` команды нет `register` Подготовить секретно-свободный
`AliasSetupPlanRequestV1` намерение `docs.universal` с вашим SDK или
сервис бортового обслуживания, затем планировать и применять его:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

Цель зашиты пространство данных ID, канонический счет владельца, срок аренды и
Планер проверяет состояние и возвращает точный
атомная `EnsureAlias` Не копируйте вручную защитные значения от другого
Сеть.

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

Доступность, коллектор, RBC задержка, и VRF мгновенный снимок:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

Параметры консенсуса на цепочке:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## 6. Куда идти дальше? {#_6-where-to-go-next}

- [SDK учебные пособия](/ru/guide/tutorials/)
- [Torii конечные точки](/ru/reference/torii-endpoints.md)
- [Работа с Iroha двойные](/ru/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md)

Чтобы восстановить полный снимок помощи Markdown из источника, запустите:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
