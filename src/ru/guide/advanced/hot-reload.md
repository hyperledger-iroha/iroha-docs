---
translation_locale: ru
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 6edc0185196ab8e77ef8552723e05bf37cca1a088da86e2a43d441d58e779c11
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Горячая перезагрузка Iroha в контейнере Docker {#hot-reload-iroha-in-a-docker-container}

Используйте горячую перезагрузку только для локальной отладки. В руководстве [Запуск Iroha 3](/ru/get-started/launch-iroha.md) описано, как собрать и запустить четыре валидатора в Docker, используя двоичные файлы одной ревизии.

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

Найдите контейнер с помощью `docker ps`. Перед заменой демона проверьте путь к нему в вашем образе.

## Повторно зафиксировать генезис блокчейна в одноразовой сети {#recommit-genesis-in-a-disposable-network}

Для нового генезис-блока требуется пустое хранилище узла. Чтобы перезапустить ту же сеть, выполните `python3 poc.py down` и `python3 poc.py up`. Храните `state/` вместе с четырьмя томами Docker этой сети.

## Использовать пользовательскую конфигурацию {#use-custom-configuration}

Текущая конфигурация сетевого узла: TOML. Kagami записывает по одному `peerN.toml` на каждый валидатор вместе с `genesis.signed.nrt`, `genesis.public_key` и `genesis.expected_hash`; файл Compose, созданный `kagami docker`, монтирует их в контейнер. Сгенерируйте его заново вместо ручного копирования файлов, затем перезапустите сетевой узел. Держите сгенерированные файлы вместе; смешивание файлов из разных запусков Kagami может привести к сбоям десериализации или консенсуса.
