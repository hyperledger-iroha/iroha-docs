---
translation_locale: ru
translation_source: /get-started/launch-iroha.md
translation_source_hash: 9341b2404624dec2230bc294c3d60dc124ac9574a0a5803b9bba744f4c5e7f50
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Запуск Iroha 3 {#launch-iroha-3}

Эта страница проходит по текущему потоку локальной сети для Iroha 3 с использованием дефолтных активов рабочего пространства из верхнего хранилища.

## 1. Создать локальную многопартнеровскую сеть. {#_1-generate-a-local-multi-peer-network}

Создать локальную сеть в четырех парах с текущего кода Kagami:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

В выходном каталоге содержится соответствующая конфигурация сверстников, `genesis.json`, `genesis.signed.nrt`, `client.toml` и скрипты помощника.

Для тестирования местного дыма, начинайте генерируемые сверстники напрямую:

```bash
./localnet/start.sh
```

Для контейнерного запуска, генерируйте Compose из того же каталога локальных сетей:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./localnet/docker-compose.yml \
  --force

docker compose -f ./localnet/docker-compose.yml up
```

По умолчанию генерируемый стек раскрывает:

- порты P2P по `1337` к `1340`
- Порты Torii HTTP `8080` до `8083`
- готовый конфигуратор клиента по адресу `./localnet/client.toml`

## 2. Убедитесь, что сеть работает. {#_2-verify-that-the-network-is-up}

Проверьте конечный пункт состояния на первом уровне:

```bash
curl http://127.0.0.1:8080/status
```

В стандартных проверках здоровья также используются:

```bash
curl http://127.0.0.1:8080/status/blocks
```

Вы можете немедленно указать CLI на конфигурацию клиентской группы:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Профиль Nexus {#_3-nexus-profile}

Репозиторий также отправляет конфигурационный профиль, ориентированный на SORA Nexus под `defaults/nexus/`.

Для запуска родного сверстника с профилем Nexus:

```bash
./target/release/irohad --sora --config ./defaults/nexus/config.toml
```

Используйте `defaults/nexus/client.toml` для доступа к CLI данному профилю.

## 4. Остановить локальную сеть {#_4-stop-the-local-network}

Для локальной сети, генерируемой на местном уровне:

```bash
./localnet/stop.sh
```

Для генерируемого стека Compose:

```bash
docker compose -f ./localnet/docker-compose.yml down
```

После запуска сети продолжайте [Операцию Iroha 3 через CLI](/ru/get-started/operate-iroha-via-cli.md).
