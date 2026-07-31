---
translation_locale: ru
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 77780600fa59ba353e2aa79fb339adb6a02f7ac731e04cd0d5f51821ec54e794
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Бег Iroha на голубой металл {#running-iroha-on-bare-metal}

Используйте этот рабочий процесс , когда вы хотите запустить сверстников непосредственно на хостерах вместо
через Docker Compose. Текущее источниковое дерево обеспечивает Kagami генераторы, которые
записывать совпадающие генезис, конфигурации сверстников, конфиграцию клиента и скрипты начала/оставания.

## 1. Создать бинарные системы {#_1-build-the-binaries}

Из-за потока Iroha рабочее пространство:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Это дает результаты:

- `target/release/irohad` для демона сверстников
- `target/release/iroha` для CLI
- `target/release/kagami` для генерации ключей, генезиса и локальных сетей

## 2. Создать локальную сеть {#_2-generate-a-local-network}

Создать четверопарный Iroha 3 локальная сеть:

```bash
target/release/kagami localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Выходной каталог содержит генерируемые `genesis.json`,
`genesis.signed.nrt`, сверстник `config.toml` файлы, `client.toml`, Сценарии помощников,
и генерируемой `README.md` с точными командами для этого пакета.

## 3. Начните с однородников {#_3-start-peers}

Для генерируемой одноразовой локальной сети используйте генерированный сценарий:

```bash
./localnet/start.sh
```

Если вам нужно включить каждого партнёра в менеджера процессов, например systemd, использовать
команду запуска, записанную в `./localnet/README.md` Для каждого сверстника.
Сверстники `config.toml`, частный ключ, каталог хранения и порты отдельно.

## 4. Управление сетью {#_4-operate-the-network}

Используйте созданную конфигурацию клиента:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

Прекратите генерируемую локальную сеть:

```bash
./localnet/stop.sh
```

## 5. Записки о производстве {#_5-production-notes}

- Создать свежие частные ключи для производства и хранить их вне
  хранилище.
- Сделайте так, чтобы все сверстники согласились на одну и ту же подписанную генезисную транзакцию, топологию,
  доверенные сверстники и проверяющий PoPs.
- Привязать адресы слушателя к локальным интерфейсам хоста только тогда, когда должен
  не могут быть достигнуты с других машин.
- Используйте обратный прокси или брандмауэр для Torii экспозиция, базовый автор, TLS, и ставки
  Ограничение.
- Сравните изменения в генезис или топологии консенсуса с скоординированными миграциями, а не
  одиночные редактирование файлов.

Для локального развития контейнеров используйте [Запуск Iroha 3](../../get-started/launch-iroha.md)
Docker Compose рабочий процесс.
