---
translation_locale: kk
translation_source: /reference/binaries.md
translation_source_hash: 5a36877954bec97691e45697680bfbd6e0a7c7695e48a796bc7c9a41d4756644
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha бинарлармен жұмыс істеу {#working-with-iroha-binaries}

Iroha 3 операторының жұмыс барысы төрт негізгі бинарлық жүйеге айналады:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) теңгерімдік демонды орындау үшін.
- `iroha3d_taira` - каноникалық Taira растаушы іске қосушы
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) үшін CLI және операторлық командалар
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) кілттер, генез, локальдік желілер және профилдер үшін

## Бастапқыдан үй салыңыз {#build-from-source}

Жоғары ағымындағы жұмыс кеңістігінің түбірінен:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Содан кейін босату бинарлары `target/release/` түрінде қол жетімді.

Командалық беткейді тексеру үшін:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## Тікелей қоймадан орындалсын {#run-directly-from-the-repository}

Егер сіз бүкіл әлемде бірдеңені орнатуды қаламасаңыз, `cargo run` қолданыңыз:

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
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
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## Қандай бинарды пайдалану керек? {#which-binary-should-i-use}

- Қоғамдық Taira растаушы релизінен тыс әріптестеріңізді іске қосу немесе пайдалану кезінде `iroha3d` қолданыңыз.
- `iroha3d_taira --sora` тек каноникалық Taira растаушыны орналастыру үшін қолданылады; ол Taira тізбекті, сақтауды және жұмыс уақытын қолтаңбалаушының бейнесін орындайды.
- `iroha` дегенді пайдалану, егер сіз бухгалтерлік кітапшаны сұрау салуға, транзакцияларды беруге немесе оператордың соңғы нүктелерін тексеруге қажет болсаңыз.
- `kagami` кілттер, генез манифесттері, профильді топтамалар немесе жергілікті желі активтері қажет болған кезде қолданыңыз.
