---
translation_locale: ba
translation_source: /guide/configure/genesis.md
translation_source_hash: a6b8b2b02e0074e6c90d9aa9337af3e2496a02beb2f57f575dc0780014df04b2
translation_status: machine-validated
translation_engine: google-translate
---

# Башланмыш {#genesis}

Genesis башланғыс сылбыр хәлен билдәләй.Мөхәррирләнгән сығанаҡ — . JSON беленергә, һәм Iroha 3 төйөн ҡуллана ҡул ҡуйылған Norito транзакция файлы.

::: details Ғәҙәттәге генезис манифесты

<<< @/snippets/genesis.json

:::

## Файлдар {#files}

Өҫкө ағымдағы һаҡлағыс манифестты ғәҙәттәгесә ебәрә. `defaults/genesis.json`. Kagami-генерацияланған селтәрҙәр үҙҙәренең манифестын һәм ҡул ҡуйылған транзакцияны яҙа сығыш каталогы:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Генерацияланған `README.md` был каталогта теүәл файлдарҙы яҙа һәм эшләтеп ебәрә һайланған профиль өсөн командалар.

## Пир конфигурацияһы {#peer-configuration}

Пирҙар ҡул ҡуйылған генезис транзакцияһына күрһәтә. `[genesis]` бүлеге. `config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

Селтәрҙәге бөтә пирҙар ҙә ҡул ҡуйылған генезис транзакцияһы һәм генезис асыҡ асҡысы буйынса килешергә тейеш.

## Ҡул ҡуйыу Genesis {#signing-genesis}

Әгәр ҙә һеҙ манифестты ҡул менән мөхәррирләйһегеҙ икән, пирҙарын башлағансы уны раҫлағыҙ һәм ҡул ҡуйығыҙ:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt
```

`GENESIS_PRIVATE_KEY_FILE` хужаһы үткәргән режимда булырға тейеш-`0600`, бер һылтанмалы ғәҙәти файл, составында бер канонлы шәхси асҡыслы мультихеш һәм һуңғы яңы юл. Kagami символик һылтанмаларҙы кире ҡаға һәм бер ҡасан да сеймал генезис шәхси ҡабул итмәй команда юлында асҡыс.

NPoS өсөн йәки Nexus профилдәре, топологияны үҙ эсенә ала һәм BLS Элеккә эйә булыуҙы иҫбатлаусы документтар генерацияланған профиль талап итә. Kagami `localnet`, `wizard`, һәм профиль быуын командалары автоматик рәүештә шул деталдәрҙе эшкәртә.

## Яңынан ғәмәлгә ашырыу Башланмыш {#recommitting-genesis}

Peer genesis-ты storage буш булғанда ғына commit итә. Яңы genesis-ты disposable localnet-та һынау өсөн peers-ты туҡтатығыҙ, уларҙың generated state directory-һын алып ташлағыҙ һәм яңы signed genesis-тан башлағыҙ. Һәр validator бер үк migration-ды координациялаған осраҡта ғына эшләп торған network-та genesis-ты алмаштырығыҙ.
