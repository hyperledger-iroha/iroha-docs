---
translation_locale: ru
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 648e69f2a572a0bb3e88919831774d21c1a17438b8bde742224a1457880539c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Работает Iroha на Bare Metal {#running-iroha-on-bare-metal}

Используйте этот рабочий поток , когда вы хотите запускать сверстников непосредственно на хостерах вместо через Docker Compose. Нынешнее источниковое дерево обеспечивает Kagami генераторы, которые пишут совпадающий генезис, конфигурации сверстников, конфигацию клиента и скрипты запуска/остановки.

## 1. Создайте бинарные системы {#_1-build-the-binaries}

Из рабочего пространства Iroha вверх потоком:

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Это приводит к:

- `target/release/iroha3d` для пчелового демона
- `target/release/iroha` для CLI
- `target/release/kagami` для генерации ключей, генезиса и локальной сети

## 2. Создание локальной сети {#_2-generate-a-local-network}

Создать локальную сеть в четырех парах Iroha 3:

```bash
target/release/kagami localnet --peers 4 --out-dir ./localnet
```

В выходном каталоге содержится генерируемые файлы `genesis.json`, `genesis.signed.nrt`, peer `config.toml`, `client.toml`, помощник скриптов и генерированный `README.md` с точными командами для данного пакета.

## 3. Начать сверстников {#_3-start-peers}

Для создаваемой одноразовой локальной сети используйте генерируемый сценарий:

```bash
./localnet/start.sh
```

Если вам нужно подключить каждого партнёра к менеджеру процессов, например: systemd, использовать команду запуска, записанную в `./localnet/README.md` Сохраняйте для каждого. `config.toml`, частный ключ, каталог хранения и порты отдельно.

## 4. Управление сетью {#_4-operate-the-network}

Используйте создаваемую конфигурацию клиента:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

Прекратите создаваемую локальную сеть с помощью:

```bash
./localnet/stop.sh
```

## 5. Примечания о производстве {#_5-production-notes}

- Создать свежие частные ключи для производства и хранить их за пределами хранилища.
- Сделайте так, чтобы все сверстники согласились на одну и ту же подписанную генезисную транзакцию, топологию, доверенных сверстников и валидатора PoPs.
- Привязать слушателя к локальным интерфейсам хоста только тогда, когда до него нельзя добраться из других машин.
- Используйте реверсный прокси или брандмауэр для воздействия Torii, базовой аутх, TLS и ограничения скорости.
- Обращайтесь с изменениями в генезис или топологии консенсуса как скоординированные миграции, а не одиночные редактирования файлов.

Для локального развития контейнеров используйте: [Запуск Iroha 3](../../get-started/launch-iroha.md) Docker Compose рабочий процесс.
