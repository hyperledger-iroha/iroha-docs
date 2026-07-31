---
translation_locale: ba
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Криптографик асҡыстар яһау {#generating-cryptographic-keys}

Iroha 3 өсөн клиент, тиҫтер һәм раҫлаусы асҡыс материалдары булдырыу өсөн `kagami keys` ҡулланығыҙ.

## Төп ҡулланыу {#basic-usage}

Iroha сығанағы иҫәбенә:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON сығанағын, ғәҙәттә, TOML йәки автоматикаға күсереп яҙыу еңелерәк:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

Команда асыҡ асҡыс һәм асыҡланған шәхси асҡыс баҫтыра.

## Алгоритмдар {#algorithms}

Ғәҙәттән тыш алгоритмдар:

- `ed25519` клиенттар иҫәбенә, трансляция идентификациялары һәм үҫеш селтәрҙәренең күпселеге өсөн.
- `secp256k1` әгәр һеҙгә secp256k1 иҫәбенә идентификация кәрәк.
- `bls_normal` өсөн раҫлаусы консенсус клавишалары, әгәр төҙөү ярҙамында BLS ярҙам итә.

Төҙөлөшөңдөң теүәл алгоритмдарын тикшерегеҙ:

```bash
cargo run --bin kagami -- keys --help
```

## Детерминистик үҫеш асҡыстары {#deterministic-development-keys}

Репродуктив ҡулайламалар өсөн орлоҡ тапшырығыҙ:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

Орлоҡтар - шәхси асҡыслы материал. Уларҙы урындағы үҫеш һәм һынауҙар өсөн генә ҡулланығыҙ.

## BLS Иреклелек иҫбатлау {#bls-proofs-of-possession}

NPoS һәм Nexus валидатор профилдәре өсөн BLS валидаторлар асҡыстары һәм PoPs кәрәк:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

JSON үҙ эсенә `pop_hex` индерә, әгәр `--pop` ҡулланылған. Был ҡиммәтте генерацияланған топология йәки `trusted_peers_pop` профиль буйынса талап ителгән яҙмалар менән ҡулланығыҙ.

## Сығарылыш форматтары {#output-formats}

Терминал инспекцияһы өсөн `--json` һәм автоматика өсөн `--compact` дефолт сығанағын ҡулланығыҙ, әгәр икенсе скриптҡа ябай һыҙыҡлы ҡиммәттәр кәрәк булһа:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

Тулы рәүештә барлыҡҡа килгән Kagami ярҙам өсөн:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
