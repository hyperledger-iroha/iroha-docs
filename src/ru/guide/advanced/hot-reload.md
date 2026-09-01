---
translation_locale: ru
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Горячая перезагрузка Iroha в контейнере Docker {#hot-reload-iroha-in-a-docker-container}

Используйте горячую перезагрузку только для локальной отладки. Для обычной локальной разработки предпочтительнее пересобирать образ или перезапускать сгенерированный стек Docker Compose из свежего набора Kagami.

## Заменить сетевого узла Binary {#replace-the-peer-binary}

Создайте бинарный файл демона, совместимый с Linux, из рабочего пространства исходного проекта:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

Скопируйте это в работающий контейнер сетевого узла, затем перезапустите этот контейнер:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

Используйте `docker ps`, чтобы подтвердить имя контейнера. В сгенерированном стеке контейнеры сетевых пиров определяются с помощью `./docker-compose.yml`.

## Повторно зафиксировать генезис блокчейна в одноразовой сети {#recommit-genesis-in-a-disposable-network}

Сетевой узел завершает генезис блокчейна только тогда, когда его хранилище пусто. Для одноразовой сети Docker остановите стек, удалите сгенерированное состояние, регенерируйте или замените подписанный пакет генезиса блокчейна и запустите снова:

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

Не заменяйте генезис блокчейна в сети, состояние которой должно быть сохранено.

## Использовать пользовательскую конфигурацию {#use-custom-configuration}

Текущая конфигурация сетевого узла: TOML. Выполните привязку монтирования или скопируйте сгенерированные файлы `config.toml`, `genesis.signed.nrt` и соответствующие ключевые файлы в пути контейнера, ожидаемые изображение, затем перезапустите сетевого узла. Держите сгенерированные файлы вместе; смешивание файлов из разных запусков Kagami может привести к сбоям десериализации или консенсуса.
