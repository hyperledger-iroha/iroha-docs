---
translation_locale: ru
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 8cdae05a133736fe528bf9d7e709af5c704e85e5f7dee09e0aa762f3214efd2d
translation_status: machine-validated
translation_engine: bing-translator-llm
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

Текущая конфигурация сетевого узла: TOML. Выполните привязку монтирования или скопируйте сгенерированные файлы `config.toml`, `genesis.signed.nrt` и соответствующие ключевые файлы в пути контейнера, ожидаемые изображение, затем перезапустите сетевого узла. Держите сгенерированные файлы вместе; смешивание файлов из разных запусков Kagami может привести к сбоям десериализации или консенсуса.
