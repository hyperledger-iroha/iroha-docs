---
translation_locale: ru
translation_source: /get-started/launch-iroha.md
translation_source_hash: 9341b2404624dec2230bc294c3d60dc124ac9574a0a5803b9bba744f4c5e7f50
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Запуск Iroha 3 {#launch-iroha-3}

Эта страница проходит по текущему потоку локальной сети для Iroha 3 используя
активы рабочего пространства по умолчанию из запасного хранилища.

## 1. Создать локальную многопартную сеть {#_1-generate-a-local-multi-peer-network}

Создать локальную сеть из четырех пар с текущего Kagami код:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Выходной каталог содержит соответствующие конфигурации сверстников, `genesis.json`,
`genesis.signed.nrt`, `client.toml`, и сценариев для помощников.

Для местного теста дыма, запустите генерируемые сверстники напрямую:

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

По умолчанию генерируемый стек показывает:

- сверстник P2P порты `1337` к `1340`
- Torii HTTP порты `8080` к `8083`
- готовый конфигурация клиента на `./localnet/client.toml`

## 2. Убедитесь, что сеть работает {#_2-verify-that-the-network-is-up}

Проверьте конечный пункт состояния на первом уровне:

```bash
curl http://127.0.0.1:8080/status
```

По умолчанию проверки состояния здоровья также используются:

```bash
curl http://127.0.0.1:8080/status/blocks
```

Вы можете сразу же указать на CLI в конфигурации клиентов:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus Профиль {#_3-nexus-profile}

Репозиторий также отправляет SORA Nexus- ориентированный профиль конфигурации
`defaults/nexus/`.

Чтобы управлять родным сверстником с Nexus Профиль:

```bash
./target/release/irohad --sora --config ./defaults/nexus/config.toml
```

Использование `defaults/nexus/client.toml` для CLI доступ к этому профилю.

## 4. Прекратите локальную сеть {#_4-stop-the-local-network}

Для локальной сети, генерируемой на родине:

```bash
./localnet/stop.sh
```

Для генерируемого стека Compose:

```bash
docker compose -f ./localnet/docker-compose.yml down
```

После того, как сеть будет работать, продолжите с
[Работать Iroha 3 через CLI](/ru/get-started/operate-iroha-via-cli.md).
