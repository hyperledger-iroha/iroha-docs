---
translation_locale: ru
translation_source: /get-started/launch-iroha.md
translation_source_hash: 63eed8f987d33a487bb6329266eacbc09d10bb429027413997957579e31e80b4
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Запуск Iroha 3 {#launch-iroha-3}

На этой странице описан текущий поток локальной сети для Iroha 3 с использованием стандартных ресурсов рабочей области из репозитория вверх по потоку.

## 1. Создать локальную сеть с несколькими узлами {#_1-generate-a-local-multi-peer-network}

Создайте локальную сеть из четырёх узлов на основе текущего кода Kagami:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Выходной каталог содержит соответствующие конфигурации сетевых пиров, `genesis.json`, `genesis.signed.nrt`, `client.toml`, и вспомогательные скрипты.

Для локального теста на курение нативного уровня запустите сгенерированные сетевые узлы напрямую:

```bash
./localnet/start.sh
```

Для запуска в контейнере сгенерируйте Compose из того же каталога localnet:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./docker-compose.yml \
  --force

docker compose -f ./docker-compose.yml up
```

Стандартный созданный стек предоставляет:

- сетевой узел P2P порты `1337` к `1340`
- Torii HTTP порты `8080` в `8083`
- готовая клиентская конфигурация на `./localnet/client.toml`

## 2. Убедитесь, что сеть работает {#_2-verify-that-the-network-is-up}

Проверьте статус конечной точки API на первом сетевом узле:

```bash
curl http://127.0.0.1:8080/status
```

По умолчанию проверки состояния также используют:

```bash
curl http://127.0.0.1:8080/status/blocks
```

Вы можете сразу направить CLI на комплектную конфигурацию клиента:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus Профиль {#_3-nexus-profile}

Репозиторий также поставляется с конфигурационным профилем, ориентированным на SORA Nexus, под `defaults/nexus/`.

Чтобы запустить локального сетевого узла с профилем Nexus:

```bash
./target/release/iroha3d --sora --config ./defaults/nexus/config.toml
```

Используйте `defaults/nexus/client.toml` для CLI доступа к этому профилю.

## 4. Остановить локальную сеть {#_4-stop-the-local-network}

Для локальной сети, сгенерированной нативно:

```bash
./localnet/stop.sh
```

Для сгенерированного стека Compose:

```bash
docker compose -f ./docker-compose.yml down
```

После запуска сети продолжайте с [Управлять Iroha 3 через CLI](/ru/get-started/operate-iroha-via-cli.md).
