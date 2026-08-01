---
translation_locale: ba
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 77780600fa59ba353e2aa79fb339adb6a02f7ac731e04cd0d5f51821ec54e794
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Яланғас металл менән эшләй {#running-iroha-on-bare-metal}

Был эш ағымды хосттар аша түгел , ә туранан-тура хеҙмәттәштәре менән идара итергә теләһәгеҙ ҡулланығыҙ Docker Compose. Хәҙерге сығанаҡ ағасы бирә Kagami генераторҙар тап килә торған генезистарҙы, тиңдәш конфигурацияларын, клиент конфигурацияһын һәм старт/стоп сценарийҙарын яҙа.

## 1. Бинарҙар төҙөү {#_1-build-the-binaries}

Iroha өҫкө ағымындағы эш урынынан:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Был түбәндәгеләрҙе килтерә:

- `target/release/irohad` тиҫтер демон өсөн
- `target/release/iroha` өсөн CLI
- `target/release/kagami` клавишалар, генез һәм локаль селтәр генерацияһы өсөн

## 2. Урындағы селтәр булдырыу {#_2-generate-a-local-network}

Дүрт парлы Iroha 3 локаль селтәр булдырыу:

```bash
target/release/kagami localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Сығарылыш каталогында `genesis.json`, `genesis.signed.nrt`, peer `config.toml` файлдары, `client.toml`, ярҙамсы скрипттар һәм был пакет өсөн теүәл командалар менән генерированный `README.md` тупланған.

## 3. Дуҫтар менән аралаша башлағыҙ {#_3-start-peers}

Булдырылған бер тапҡыр ҡулланыла торған локаль селтәр өсөн, булдырылған сценарийҙы файҙаланығыҙ:

```bash
./localnet/start.sh
```

Әгәр һеҙ һәр Peer-ты systemd кеүек процестар менеджерына тоташтырырға кәрәк икән, һәр Peer өсөн `./localnet/README.md` -та теркәлгән старт командаһын ҡулланығыҙ. Һәр Peer-тың `config.toml`, шәхси асҡысын, һаҡлау каталогын һәм порттарын айырым һаҡлағыҙ.

## 4. Сеть менән идара итеү {#_4-operate-the-network}

Булдырылған клиент конфигурацияһын ҡулланығыҙ:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

Булдырылған локаль селтәрҙе туҡтатайыҡ:

```bash
./localnet/stop.sh
```

## 5. Исемлек иҫкәрмәләре {#_5-production-notes}

- Яңы шәхси асҡыстар булдырыу һәм уларҙы һаҡлау өсөн запастан ситтә һаҡлау.
- Бер үк ҡул ҡуйылған генезис транзакцияһы, топологияһы, ышаныслы тиңдәштәре һәм валидатор PoPs тураһында һәр яҡлап килешеү төҙөгөҙ.
- Тыңлаусының адрестарын хост-локаль интерфейсҡа тик башҡа машиналарҙан хеҙмәттәшенә барып етеү мөмкин булмағанда ғына бәйләргә.
- Torii экспозиция, база авт, TLS һәм тиҙлеген сикләү өсөн кире прокси йәки янғын диуарын ҡулланығыҙ.
- Генезис йәки консенсус топологияһына үҙгәрештәрҙе координацияланған миграциялар тип ҡарағыҙ, бер-бер файл редакцияһын түгел.

Контейнерлаштырылған урындағы үҫеш өсөн [Launch Iroha 3](../../get-started/launch-iroha.md) Docker Compose эш аҙымын ҡулланығыҙ.
