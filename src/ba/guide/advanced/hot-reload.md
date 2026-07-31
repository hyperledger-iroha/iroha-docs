---
translation_locale: ba
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 2c71e6c135d862d626d3b184eef3cbed350f1353d7dee78cc129092e7b857924
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Эҫе йөкләнеү Iroha а Docker Контейнер {#hot-reload-iroha-in-a-docker-container}

Урындағы дебгаж өсөн генә ҡайнар ҡабаттан тултырыу ҡулланығыҙ. Нормаль урындағы үҫеш өсөн, һүрәтте яңынан төҙөүҙе йәки яңы Kagami пакетынан барлыҡҡа килгән Docker Compose басканы яңынан башлауҙы өҫтөнлөк итегеҙ.

## Тиҫтерҙәр бинарын алмаштырығыҙ {#replace-the-peer-binary}

Linux-ҡа яраҡлашыусы дамон бинарын өҫкө ағымлы эш майҙанынан төҙөй:

```bash
cargo build --release -p irohad --target x86_64-unknown-linux-musl
```

Уны эшләй торған контейнерға күсереп яҙығыҙ, һуңынан был контейнерҙы яңынан ҡуҙғатығыҙ:

```bash
docker cp target/x86_64-unknown-linux-musl/release/irohad <container>:/usr/local/bin/irohad
docker restart <container>
```

Контейнерҙың атамаһын раҫлау өсөн `docker ps` ҡулланығыҙ. Булдырылған башаҡта тиң контейнерҙар `./localnet/docker-compose.yml` менән билдәләнә.

## "Башланмыш"ты бер тапҡыр ҡулланыу мөмкин булған селтәрҙә кире ҡайтарығыҙ {#recommit-genesis-in-a-disposable-network}

Бер яҡташы генезисты тик уның һаҡлағысы буш булғанда ғына башҡара. Docker бер тапҡыр ҡулланыу өсөн селтәр өсөн, стейкты туҡтатайыҡ, барлыҡҡа килгән дәүләтте алып ташлайбыҙ, ҡул ҡуйылған генезистарҙы регенерациялайбыҙ йәки алмаштырабыҙ һәм яңынан башлайбыҙ:

```bash
docker compose -f ./localnet/docker-compose.yml down
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

Дөйөм торошон һаҡлап ҡалырға тейеш булған селтәрҙә генезисты алмаштырмағыҙ.

## Үҙенсәлекле конфигурацияны ҡулланығыҙ {#use-custom-configuration}

Хәҙерге тиңдәш конфигурацияһы: TOML. Мәғлүмәтте бәйләп ҡуйыу йәки күсереп алыу `config.toml`, `genesis.signed.nrt`, һәм бәйле төп файлдар һүрәт көтөлгән контейнер юлдары, ә һуңынан peer башланды. булдырылған файлдарҙы бергә тотонорға; төрлө файлдар ҡатнаштырыу Kagami йүгереүҙәр deserialization йәки консенсус уңышһыҙлыҡ килтерә ала.
