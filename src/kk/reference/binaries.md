---
translation_locale: kk
translation_source: /reference/binaries.md
translation_source_hash: fd9cefe7c0f5ee2f273a06b453d11d0e9bb896a35f872297276f5e052912a035
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha бинарлармен жұмыс істеу {#working-with-iroha-binaries}

Iroha 3 оператордың жұмыс барысы үш негізгі бинарды айналдырады:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) теңгерімдік демонды орындау үшін.
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) үшін CLI және операторлық командалар
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) кілттер, генез, локальдік желілер және профилдер үшін

## Бастапқыдан үй салыңыз {#build-from-source}

Жоғары ағымындағы жұмыс кеңістігінің түбірінен:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Содан кейін босату бинарлары `target/release/` түрінде қол жетімді.

Командалық беткейді тексеру үшін:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## Тікелей қоймадан орындалсын {#run-directly-from-the-repository}

Егер сіз бүкіл әлемде бірдеңені орнатуды қаламасаңыз, `cargo run` қолданыңыз:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Сурет {#docker-image}

Жоғары ағыстағы жұмыс кеңістігі пайдаланады `kagami localnet` және `kagami docker` тудыру үшін Docker Compose Тексерілген кодқа сәйкес келетін файлдар. `hyperledger/iroha:dev` бейнелер пайдаланған файлдармен бірге пайдаланылуы мүмкін.

CLI ыдысын контейнерде орындаңыз:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Kagami контейнерде орындалсын:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Бір-бірімен жұмыс істеуді бастау үшін жергілікті желіні құру және алдымен файлды құрастыру:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## Қандай бинарды пайдалану керек? {#which-binary-should-i-use}

- Жастармен жұмыс істеуді бастаған кезде `irohad` қолданыңыз.
- `iroha` дегенді пайдалану, егер сіз бухгалтерлік кітапшаны сұрау салуға, транзакцияларды беруге немесе оператордың соңғы нүктелерін тексеруге қажет болсаңыз.
- `kagami` кілттер, генез манифесттері, профильді топтамалар немесе жергілікті желі активтері қажет болған кезде қолданыңыз.
