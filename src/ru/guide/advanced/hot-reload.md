---
translation_locale: ru
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Горячая перегрузка Iroha в контейнере Docker {#hot-reload-iroha-in-a-docker-container}

Используйте горячую перезагрузку только для локальной дебгагировки. Для нормальной локальной разработки, предпочтительно восстановить изображение или запустить созданный набор Docker Compose из нового пакета Kagami.

## Заменить бинарный параметр {#replace-the-peer-binary}

Создать совместимый с Linux двойной демона из рабочего пространства вверх потока:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

Копируйте его в бегущий контейнер, а затем перезапустите этот контейнер:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

Используйте `docker ps` для подтверждения названия контейнера. В генерируемой пакете однородные контейнеры определяются `./docker-compose.yml`.

## Перезагрузить Genesis в одноразовой сети {#recommit-genesis-in-a-disposable-network}

Для одноразовой сети Docker остановить накопление, удалить генерируемое состояние, восстановить или заменить подписанный пакет генезиса и начать снова:

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

Не заменяйте генезис в сети, состояние которой должно быть сохранено.

## Используйте пользовательскую конфигурацию {#use-custom-configuration}

Нынешняя конфигурация пира - TOML. Присоедините или скопируйте генерированные файлы `config.toml`, `genesis.signed.nrt` и связанные с ними ключи в пути контейнеров, ожидаемые изображением, а затем перезагрузите пир. Сохраняйте генерируемые файлы вместе; смешивание файлов из различных Kagami путей может привести к дезерялизации или сбоям консенсуса.
