---
translation_locale: ba
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 8cdae05a133736fe528bf9d7e709af5c704e85e5f7dee09e0aa762f3214efd2d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Эҫе йөкләнеү Iroha а Docker Контейнер {#hot-reload-iroha-in-a-docker-container}

Ҡайнар ҡабат йөкләүҙе урындағы көйләү өсөн генә ҡулланығыҙ. Docker мөхитендә бер үк версиянан йыйылған башҡарылма файлдар менән дүрт валидатор төҙөү һәм эшләтеп ебәреү өсөн [Башлау Iroha 3](/ba/get-started/launch-iroha.md) ҡулланмаһын ҡарағыҙ.

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

Контейнерҙы табыу өсөн `docker ps` командаһын ҡулланығыҙ. Демонды алмаштырыр алдынан уның образдағы юлын тикшерегеҙ.

## "Башланмыш"ты бер тапҡыр ҡулланыу мөмкин булған селтәрҙә кире ҡайтарығыҙ {#recommit-genesis-in-a-disposable-network}

Яңы генезис блогы өсөн төйөндөң һаҡлағысы буш булырға тейеш. Шул уҡ селтәрҙе ҡабат эшләтеп ебәреү өсөн тәүҙә `python3 poc.py down`, унан `python3 poc.py up` командаларын башҡарығыҙ. `state/` каталогын селтәрҙең дүрт Docker томы менән бергә һаҡлағыҙ.

## Үҙенсәлекле конфигурацияны ҡулланығыҙ {#use-custom-configuration}

Хәҙерге peer конфигурацияһы TOML. Яратылған `config.toml`, `genesis.signed.nrt` һәм уларға бәйле төп файлдарҙы һүрәт көтөп алған контейнер юлдары менән бәйләп ҡуйығыҙ йәки күсереп яҙығыҙ, һуңынан peer-ты ҡабаттан башландырығыҙ. Яратылған файлдарҙы бергә һаҡлағыҙ; төрлө Kagami йүгереүҙәренән файлдар ҡатнаштырыу дезерализация йәки консенсус уңышһыҙлыҡтары тыуҙыра ала.
