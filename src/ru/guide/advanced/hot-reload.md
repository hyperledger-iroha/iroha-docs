---
translation_locale: ru
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 2c71e6c135d862d626d3b184eef3cbed350f1353d7dee78cc129092e7b857924
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Горячая перегрузка Iroha в а Docker Контейнер {#hot-reload-iroha-in-a-docker-container}

Используйте горячую перезагрузку только для локального дебгагирования.
восстановление изображения или перезагрузка генерируемого Docker Compose станок из
свежие Kagami Сборник.

## Заменить бинарный параметр {#replace-the-peer-binary}

Создать совместимый с Linux двойной демона из рабочего пространства:

```bash
cargo build --release -p irohad --target x86_64-unknown-linux-musl
```

Копируйте его в бегущий контейнер, а затем перезагрузите этот контейнер:

```bash
docker cp target/x86_64-unknown-linux-musl/release/irohad <container>:/usr/local/bin/irohad
docker restart <container>
```

Использование `docker ps` В генерируемой пакете однородный
контейнеры определяются: `./localnet/docker-compose.yml`.

## Перезагрузить Книгу Бытие в одноразовой сети {#recommit-genesis-in-a-disposable-network}

Совершает генезис только тогда, когда его хранилище пусто. Docker
сеть, остановить станок, удалить генерируемое состояние, восстановить или заменить
подписанный пакет генезиса, и начать сначала:

```bash
docker compose -f ./localnet/docker-compose.yml down
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

Не заменяйте генезис в сети, состояние которой должно быть сохранено.

## Используйте пользовательскую конфигурацию {#use-custom-configuration}

Текущая конфигурация сверстников TOML. Привязать или скопировать генерируемое
`config.toml`, `genesis.signed.nrt`, и связанные с этим ключевые файлы в контейнер
Пути ожидаются изображением, затем перезагрузить Peer.
совместно; смешивание файлов из различных Kagami прохождения могут привести к дезерялизации или
Неудачи консенсуса.
