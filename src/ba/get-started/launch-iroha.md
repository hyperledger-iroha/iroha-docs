---
translation_locale: ba
translation_source: /get-started/launch-iroha.md
translation_source_hash: 9341b2404624dec2230bc294c3d60dc124ac9574a0a5803b9bba744f4c5e7f50
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Пуск Iroha 3 {#launch-iroha-3}

Был бит Iroha 3 өсөн урындағы селтәрҙең ағымдағы ағымын күҙәтә, өҫкө ағымдағы репозиториянан эш урыны активтарын ҡуллана.

## 1. Күп яҡлы урындағы селтәр булдырыу {#_1-generate-a-local-multi-peer-network}

Хәҙерге Kagami кодынан дүрт парлы локаль селтәр булдырыу:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Сығарыу каталогында тиңдәш конфигурациялары бар, `genesis.json`, `genesis.signed.nrt`, `client.toml`, Яҡшы китаптар менән.

Тыуған урындағы төтөн һынауы өсөн, туранан-тура барлыҡҡа килгән тиҫтерҙәрҙе башларға кәрәк:

```bash
./localnet/start.sh
```

Контейнерлаштырылған йүгереү өсөн шул уҡ локаль селтәр каталогынан Композиция яһау:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./localnet/docker-compose.yml \
  --force

docker compose -f ./localnet/docker-compose.yml up
```

Дефолт рәүештә барлыҡҡа килгән стек:

- тиңдәштәре P2P порттар `1337` өсөн `1340`
- Torii HTTP порттар `8080` өсөн `8083`
- `./localnet/client.toml` адресы буйынса клиенттың әҙер конфигурацияһы

## 2. Интернет селтәренең эшләнеүен тикшерегеҙ {#_2-verify-that-the-network-is-up}

Беренсе тиҫтерҙәге статус тамамлау нөктәһен тикшерегеҙ:

```bash
curl http://127.0.0.1:8080/status
```

Һаулыҡ һаҡлау тикшереүҙәрендә шулай уҡ түбәндәгеләр ҡулланыла:

```bash
curl http://127.0.0.1:8080/status/blocks
```

Һеҙ шунда уҡ CLI тупланған клиент конфигурацияһына йүнәлтергә мөмкин:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus Профиль {#_3-nexus-profile}

Шулай уҡ SORA Nexus йүнәлешендәге конфигурация профилен `defaults/nexus/` исемлегенә ебәреү.

Nexus профиле менән туған тиҫтерҙе файҙаланыу өсөн:

```bash
./target/release/irohad --sora --config ./defaults/nexus/config.toml
```

Был профилгә CLI инеү өсөн `defaults/nexus/client.toml` ҡулланығыҙ.

## 4. Урындағы селтәрҙе туҡтатайыҡ {#_4-stop-the-local-network}

Тыумыштан барлыҡҡа килгән локаль селтәр өсөн:

```bash
./localnet/stop.sh
```

Булдырылған Композит стек өсөн:

```bash
docker compose -f ./localnet/docker-compose.yml down
```

Сеть эшләгәндән һуң, дауам [Эшләгеҙ Iroha 3 аша CLI](/ba/get-started/operate-iroha-via-cli.md).
