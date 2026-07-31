---
translation_locale: ba
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Башланмыш {#genesis}

Башланмыш башланғыс сылбыр дәүләте билдәләй. JSON асыҡтан-асыҡ һәм Iroha 3 узел ҡулланма ашай Norito транзакция файлы.

::: details Дефолт генезис манифесты

<<< @/snippets/genesis.json

:::

## Файлдар {#files}

`defaults/genesis.json`. Kagami барлыҡҡа килгән селтәрҙәр үҙ манифестаһын һәм ҡул ҡуйылған транзакцияһын сығанаҡ каталогына яҙҙыра:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Был каталогта барлыҡҡа килгән `README.md` һайлап алынған профиль өсөн теүәл файлдар һәм старт командалары теркәлә.

## Дуҫтар араһындағы айырма {#peer-configuration}

`[genesis]` бүлегендәге `config.toml` ҡул ҡуйылған генезис операцияһы тураһында фекерҙәр:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

Сетьтәге бөтә хеҙмәттәштәре лә ҡул ҡуйылған генезис транзакцияһы һәм генезис асыҡ асҡысы тураһында килешергә тейеш.

## Башланмыш китабының ҡултамғаһы {#signing-genesis}

Әгәр һеҙ манифестты ҡул менән төҙөйһөгөҙ, тиҫтерҙәрҙе башлар алдынан уны раҫлағыҙ һәм имза ҡуйығыҙ:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

NPOS өсөн йәки Nexus профилдәр, шул иҫәптән топология һәм BLS Булдырылған профиль буйынса кәрәкле эйәлек иҫбатламаһы. Kagami `localnet`, `wizard`, һәм профиль генерацияһы командалары был мәғлүмәттәрҙе автомат рәүештә эшкәртә.

## Башланмыш китабының ҡабаттан яҙылыуы {#recommitting-genesis}

Бер яҡташы тик уның һаҡлауы буш булған саҡта ғына генезис яһай. Бер тапҡыр ҡулланылған локаль селтәрҙә яңы генезисты һынау өсөн, бер яҡташтарҙы туҡтатайыҡ, уларҙың барлыҡҡа килгән дәүләт каталогын алып ташлайбыҙ һәм яңы ҡул ҡуйылған генезистан башланайыҡ.
