---
translation_locale: ru
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Бытие {#genesis}

Книга Бытия определяет начальное состояние цепочки. JSON проявления,
и Iroha 3 узел потребляет подписанный Norito файл транзакции.

::: details Дефолтный генезисный манифест

<<< @/snippets/genesis.json

:::

## Файлы {#files}

Вверхпоток хранилище отправляет дефолтный манифест на `defaults/genesis.json`.
Kagami- генерируемые сети записывают свои собственные манифесты и подписанные транзакции
выходной каталог:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Вырабатываемые `README.md` В этом каталоге записываются точные файлы и запуск
команды для выбранного профиля.

## Конфигурация сверстников {#peer-configuration}

Совершенствованные эксперты указывают на подписанную генезисную транзакцию в `[genesis]` раздел
`config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

Все партнеры в сети должны договориться о подписанной сделке генезиса и
Открытый ключ.

## Подписание книги Бытие {#signing-genesis}

Если вы редактируете манифест вручную, подтвердите и подпишите его перед началом работы:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

Для NPoS или Nexus Профили, включая топологию и BLS Доказательства владения
требуется генерируемым профилем. Kagami `localnet`, `wizard`, и профиль
команды генерации обрабатывают эти детали автоматически.

## Возобновление книги Бытие {#recommitting-genesis}

Для того, чтобы проверить новый генез в условиях, когда его хранилище пусто.
единовременная локальная сеть, остановить сверстников, удалить их генерируемый государственный каталог,
Не заменяйте генезис на бегущем
сеть, если только каждый валидатор не координирует одну и ту же миграцию.
