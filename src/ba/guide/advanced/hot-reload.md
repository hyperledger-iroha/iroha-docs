---
translation_locale: ba
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Эҫе йөкләнеү Iroha а Docker Контейнер {#hot-reload-iroha-in-a-docker-container}

Урындағы дебгаж өсөн генә ҡайнар ҡабаттан тултырыу ҡулланығыҙ. Нормаль урындағы үҫеш өсөн, һүрәтте яңынан төҙөүҙе йәки яңы Kagami пакетынан барлыҡҡа килгән Docker Compose басканы яңынан башлауҙы өҫтөнлөк итегеҙ.

## Пирҙар бинарын алмаштырығыҙ {#replace-the-peer-binary}

Linux-ҡа яраҡлашыусы дамон бинарын өҫкө ағымлы эш майҙанынан төҙөй:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

Уны эшләй торған контейнерға күсереп яҙығыҙ, һуңынан был контейнерҙы яңынан ҡуҙғатығыҙ:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

Контейнерҙың атамаһын раҫлау өсөн `docker ps` ҡулланығыҙ. Булдырылған башаҡта тиң контейнерҙар `./docker-compose.yml` менән билдәләнә.

## "Башланмыш"ты бер тапҡыр ҡулланыу мөмкин булған селтәрҙә кире ҡайтарығыҙ {#recommit-genesis-in-a-disposable-network}

Пир генезисты тик уның һаҡлағысы буш булғанда ғына башҡара. Docker бер тапҡыр ҡулланыу өсөн селтәр өсөн, стекты туҡтатайыҡ, барлыҡҡа килгән дәүләтте алып ташлайбыҙ, ҡул ҡуйылған генезистарҙы регенерациялайбыҙ йәки алмаштырабыҙ һәм яңынан башлайбыҙ:

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

Дөйөм торошон һаҡлап ҡалырға тейеш булған селтәрҙә генезисты алмаштырмағыҙ.

## Үҙенсәлекле конфигурацияны ҡулланығыҙ {#use-custom-configuration}

Хәҙерге peer конфигурацияһы TOML. Яратылған `config.toml`, `genesis.signed.nrt` һәм уларға бәйле төп файлдарҙы һүрәт көтөп алған контейнер юлдары менән бәйләп ҡуйығыҙ йәки күсереп яҙығыҙ, һуңынан peer-ты ҡабаттан башландырығыҙ. Яратылған файлдарҙы бергә һаҡлағыҙ; төрлө Kagami йүгереүҙәренән файлдар ҡатнаштырыу дезерализация йәки консенсус уңышһыҙлыҡтары тыуҙыра ала.
