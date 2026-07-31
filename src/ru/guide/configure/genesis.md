---
translation_locale: ru
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Бытие {#genesis}

Генезис определяет начальное состояние цепочки. Редактируемый источник - манифест JSON, а узел Iroha 3 потребляет подписанный файл транзакции Norito.

::: details Проявление генезиса по умолчанию

<<< @/snippets/genesis.json

:::

## Файлы {#files}

Вверхпоток хранилище отправляет по умолчанию манифест на `defaults/genesis.json`. Сети, созданные Kagami, записывают свой собственный манифест и подписанную транзакцию в исходящий каталог:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Создаваемый `README.md` в этом каталоге записывает точные файлы и команды запуска для выбранного профиля.

## Конфигурация сверстников {#peer-configuration}

Сравнители указывают на подписанную транзакцию генезиса в разделе `[genesis]` `config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

Все коллеги в сети должны договориться о подписанной сделке генезиса и общественном ключе генезиса.

## Подписание книги Бытие {#signing-genesis}

Если вы редактируете манифест вручную, проверьте и подпишите его перед началом работы с коллегами:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

Для NPoS или Nexus Профили, включая топологию и BLS Доказательства владения, требуемые генерируемым профилем. Kagami `localnet`, `wizard`, и команды по созданию профиля обрабатывают эти детали автоматически.

## Возобновление книги Бытие {#recommitting-genesis}

Для тестирования нового генеза в одноразовой локальной сети, остановить сверстников, удалить их генерируемый каталог состояния и начать с нового подписанного генеза. Не заменяйте генезу на запущенной сети, если каждый validator не координирует ту же миграцию.
