---
translation_locale: ba
translation_source: /guide/configure/genesis.md
translation_source_hash: 91be089c82a76991e35a43e1541f9e069fdf70d3fb5de2492b985c06c78a2372
translation_status: machine-validated
translation_engine: google-translate+reviewed-delta+reviewed-first-release-source-amendment
---
# Башланмыш {#genesis}

Genesis башланғыс сылбыр хәлен билдәләй.Мөхәррирләнгән сығанаҡ — . JSON беленергә, һәм Iroha 3 төйөн ҡуллана ҡул ҡуйылған Norito транзакция файлы.

::: details Ғәҙәттәге генезис манифесты

<<< @/snippets/genesis.json

:::

## Файлдар {#files}

Төп репозиторий `defaults/genesis.template.json` юлында ғәҙәттәге сығанаҡ шаблонын бирә. Шаблон тулы түгел: `kagami genesis materialize` уны манифестҡа әйләндергәнсе уны тикшерергә, ҡул ҡуйырға йәки төйөндә ҡулланырға ярамай. Kagami булдырған селтәрҙәр үҙ манифестын һәм ҡул ҡуйылған транзакцияһын сығыш каталогына яҙа:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

Генерацияланған `README.md` был каталогта теүәл файлдарҙы яҙа һәм эшләтеп ебәрә һайланған профиль өсөн командалар.

## Пир конфигурацияһы {#peer-configuration}

Тиңдәштәр `config.toml`-дың `[genesis]` бүлегендә ҡул ҡуйылған genesis транзакцияһына һылтана һәм уның көтөлгән хэшын айырым файлда беркетә:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
expected_hash_file = "./genesis.expected_hash"
```

Селтәрҙәге бөтә тиңдәштәр ҡул ҡуйылған genesis транзакцияһы һәм genesis асыҡ асҡысы буйынса килешергә тейеш. Көтөлгән хэш файлы тәүге эшләтеүҙә лә, яңынан эшләтеүҙә лә кәрәк; уны `kagami genesis sign --expected-hash-out` яҙа.

## Ҡул ҡуйыу Genesis {#signing-genesis}

Әгәр ҙә һеҙ манифестты ҡул менән мөхәррирләйһегеҙ икән, пирҙарын башлағансы уны раҫлағыҙ һәм ҡул ҡуйығыҙ:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt \
  --expected-hash-out ./genesis.expected_hash
```

`GENESIS_PRIVATE_KEY_FILE` хужаһы үткәргән режимда булырға тейеш-`0600`, бер һылтанмалы ғәҙәти файл, составында бер канонлы шәхси асҡыслы мультихеш һәм һуңғы яңы юл. Kagami символик һылтанмаларҙы кире ҡаға һәм бер ҡасан да сеймал генезис шәхси ҡабул итмәй команда юлында асҡыс.

NPoS йәки SORA Nexus профилдәре өсөн булдырылған профиль талап иткән топологияны һәм BLS асҡыстарына эйә булыу иҫбаттарын индерегеҙ. Kagami-ның `localnet generate`, `wizard` һәм `sora-network generate` командалары был нескәлектәрҙе автоматик эшкәртә.

## Яңынан ғәмәлгә ашырыу Башланмыш {#recommitting-genesis}

Яңы селтәр үҙенең ҡултамғалы башланғыс блогынан эш башлай. Ваҡытлыса урындағы селтәрҙә башҡа башланғыс блокты һынау өсөн тиңдәш төйөндәрҙе туҡтатығыҙ, уларҙың булдырылған хәл каталогын юйығыҙ һәм яңы ҡултамғалы башланғыс блок менән эш башлағыҙ. Эшләп торған селтәр башланғыс блокты алмаштырыуҙы яңыртыу механизмы итеп бер ҡасан да ҡулланырға тейеш түгел. Протокол билдәләмәләрен үҙгәртеү идара итеү аша раҫланған һайлау күсеүҙәрен һәм һайланған билдәләмәләр менән йөкләмәләр өсөн яраҡлылыҡ тикшереүҙәрен талап итә.
