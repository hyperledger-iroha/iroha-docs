---
translation_locale: ba
translation_source: /reference/binaries.md
translation_source_hash: 5a36877954bec97691e45697680bfbd6e0a7c7695e48a796bc7c9a41d4756644
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha бинарҙар менән эшләү {#working-with-iroha-binaries}

Iroha 3 операторҙың эш ағымдары дүрт төп бинар тирәләй әйләнә:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) бер-береһе менән бәйләнештә булыу өсөн
- `iroha3d_taira` ҡануниally Taira validator launcher өсөн
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) өсөн CLI һәм оператор командалары
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) өсөн асҡыстар, генездар, локаль селтәрҙәр һәм профилдәр

## Сығанаҡтан төҙөгөҙ {#build-from-source}

Эш киңлегенең өҫкө ағымында тамырҙан:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Һуңынан сығарыу бинарҙары `target/release/` тибында була.

Команда өҫкө йөҙөн тикшереү өсөн:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## Репозиториянан туранан-тура эшләгеҙ {#run-directly-from-the-repository}

Әгәр һеҙ бөтә донъяға бер нәмә лә урынлаштырырға теләмәйһегеҙ икән, `cargo run` ҡулланып:

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Һүрәт {#docker-image}

Өҫкө ағымындағы эш урындары ҡулланыла `kagami localnet` һәм `kagami docker` барлыҡҡа килтереү Docker Compose теркәлгән кодҡа тап килә. `hyperledger/iroha:dev` һүрәт ошо файлдар менән ҡулланырға мөмкин.

CLI һауытта тотонорға:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Kagami һауытта йөрөтөлә:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Бер-береһе менән стартлау өсөн, локаль селтәр булдырыу һәм иң тәүҙә файл туплау:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## Ниндәй бинар ҡулланырға кәрәк? {#which-binary-should-i-use}

- Йәмәғәт Taira валидатор сығарылышынан ситтә хеҙмәттәштәрегеҙҙе башлаған йәки эшләгәндә `iroha3d` ҡулланығыҙ.
- Taira validator deployment өсөн генә `iroha3d_taira --sora` ҡулланыу; ул Taira сылбыр, һаҡлау һәм йүгереү ваҡыты-тамғалаусы профилен үтәй.
- `iroha` ҡулланып, иҫәп-хисапҡа һорау бирергә, транзакцияларҙы тапшырырға йәки операторҙың һуңғы пункттарын тикшереүгә кәрәк.
- Ключтар, генез манифестары, профил тупланмалары йәки локаль селтәр активтары кәрәк булғанда `kagami` ҡулланығыҙ.
