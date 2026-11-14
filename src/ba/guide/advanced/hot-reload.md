---
translation_locale: ba
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: d4fd88de377b9c88e0293ed07f307ad38c3f8b05ed898fd051c5bfb738d66681
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
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

Төйөн генезисты үҙенең һаҡлағысы буш булғанда ғына раҫлай. Бер тапҡыр ҡулланыла торған Docker селтәре өсөн хеҙмәттәрҙе туҡтатығыҙ, булдырылған торошто юйығыҙ, ҡул ҡуйылған генезис тупланмаһын яңынан булдырығыҙ йәки алмаштырығыҙ һәм яңынан эшләтегеҙ:

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

Дөйөм торошон һаҡлап ҡалырға тейеш булған селтәрҙә генезисты алмаштырмағыҙ.

## Үҙенсәлекле конфигурацияны ҡулланығыҙ {#use-custom-configuration}

Ағымдағы тиңдәш конфигурацияһы TOML форматында. Булдырылған `config.toml`, `genesis.signed.nrt` һәм уларға бәйле асҡыс файлдарын образ көткән контейнер юлдарына бәйләп тоташтырығыҙ йәки күсерегеҙ, һуңынан тиңдәште яңынан эшләтегеҙ. Булдырылған файлдарҙы бергә һаҡлағыҙ; төрлө Kagami эшләтеүҙәренән алынған файлдарҙы ҡатнаштырыу десериализация йәки консенсус хаталарына килтерергә мөмкин.
