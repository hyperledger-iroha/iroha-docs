---
translation_locale: ba
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 886da937d92563cea49355fdccd411fc74d397fea28b521711e9089c8b047280
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Iroha Яланғас металл менән эшләй {#running-iroha-on-bare-metal}

Был эш ағымды хосттар аша түгел , ә туранан-тура пирҙары менән идара итергә теләһәгеҙ ҡулланығыҙ Docker Compose. Хәҙерге сығанаҡ ағасы бирә Kagami генераторҙар тап килә торған генезистарҙы, пир конфигурацияларын, клиент конфигурацияһын һәм старт/стоп сценарийҙарын яҙа.

## 1. Бинарҙар төҙөү {#_1-build-the-binaries}

Iroha өҫкө ағымындағы эш урынынан:

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Был түбәндәгеләрҙе килтерә:

- `target/release/iroha3d` пир демон өсөн
- `target/release/iroha` өсөн CLI
- `target/release/kagami` клавишалар, генез һәм локаль селтәр генерацияһы өсөн

## 2. Урындағы селтәр булдырыу {#_2-generate-a-local-network}

Дүрт парлы Iroha 3 локаль селтәр булдырыу:

```bash
target/release/kagami localnet generate --peers 4 --out-dir ./localnet
```

Сығыш каталогында булдырылған `genesis.json`, `genesis.signed.nrt`, `genesis.expected_hash`, һәр валидатор өсөн бер `peerN.toml`, `client.toml`, `start.sh` һәм `stop.sh` скрипттары һәм ошо тупланма өсөн теүәл командалар яҙылған, булдырылған `README.md` бар.

## 3. Пирҙарҙы эшләтеп ебәрегеҙ {#_3-start-peers}

Булдырылған бер тапҡыр ҡулланыла торған локаль селтәр өсөн, булдырылған сценарийҙы файҙаланығыҙ:

```bash
./localnet/start.sh
```

Һәр тиңдәште systemd кеүек процестар идара итеүсеһенә тоташтырырға кәрәк булһа, `./localnet/start.sh` эсендәге һәр тиңдәш өсөн командаға эйәрегеҙ: `<bundle>/state/peerN` каталогынан `iroha3d --config <bundle>/peerN.toml` эшләтегеҙ һәм `--sumeragi-assert-fresh-key` параметрын шул тиңдәштең тәүге эшләтелешендә генә бирегеҙ. Һәр тиңдәштең `peerN.toml` файлын, шәхси асҡысын, һаҡлау каталогын һәм порттарын айырым тотоғоҙ.

## 4. Сеть менән идара итеү {#_4-operate-the-network}

Булдырылған клиент конфигурацияһын ҡулланығыҙ:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list --all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

Булдырылған локаль селтәрҙе туҡтатайыҡ:

```bash
./localnet/stop.sh
```

## 5. Исемлек иҫкәрмәләре {#_5-production-notes}

- Яңы шәхси асҡыстар булдырыу һәм уларҙы һаҡлау өсөн запастан ситтә һаҡлау.
- Бер үк ҡул ҡуйылған генезис транзакцияһы, топологияһы, ышаныслы пирҙары һәм валидатор PoPs тураһында һәр яҡлап килешеү төҙөгөҙ.
- Тыңлаусының адрестарын хост-локаль интерфейсҡа тик башҡа машиналарҙан пирына барып етеү мөмкин булмағанда ғына бәйләргә.
- Torii экспозиция, база авт, TLS һәм тиҙлеген сикләү өсөн кире прокси йәки янғын диуарын ҡулланығыҙ.
- Генезис йәки консенсус топологияһына үҙгәрештәрҙе координацияланған миграциялар тип ҡарағыҙ, бер-бер файл редакцияһын түгел.

Контейнерлаштырылған урындағы үҫеш өсөн [Iroha 3-те эшләтеп ебәреү](../../get-started/launch-iroha.md) Docker Compose эш аҙымын ҡулланығыҙ.
