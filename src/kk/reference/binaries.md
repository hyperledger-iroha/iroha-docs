---
translation_locale: kk
translation_source: /reference/binaries.md
translation_source_hash: 1bf3f4697e44b3c8ef571eb9e5c0e301a1acbf76aa1c0666b3cd86e108bba6bf
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha Бинарларымен жұмыс істеу {#working-with-iroha-binaries}

Iroha 3 оператордың жұмыс үрдісі төрт негізгі екілік файлдарға негізделген:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) желі серіктес демонды іске қосу үшін
- `iroha3d_taira` бір протокол-стандарт Taira валидаторын іске қосу үшін
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) үшін CLI және оператор командалары
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) кілттер үшін, блокчейн генезисі, локальді желілер және профильдер

## Дереккөзден құру {#build-from-source}

Жоғарғы деңгейдегі жұмыс кеңістігінің түбірінен:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Релиздік бинари файлдар кейіннен `target/release/` мекенжайында қолжетімді болады.

Бұйрық бетін тексеру үшін:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## Репозиторийден тікелей іске қосу {#run-directly-from-the-repository}

Егер сіз ештеңені жаһандық деңгейде орнатқыңыз келмесе, `cargo run` қолданыңыз:

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Сурет {#docker-image}

Docker ішінде бір нұсқадан жиналған екілік файлдармен төрт валидаторды құрып, іске қосу үшін [Iroha 3 іске қосу](/kk/get-started/launch-iroha.md) нұсқаулығын қараңыз.

## Қай Бинарлық Файлды Қолдануым Керек? {#which-binary-should-i-use}

- Қоғамдық Taira тексеруші нұсқасынан тыс желі серіктестерін бастағанда немесе жұмыс істегенде `iroha3d` пайдаланыңыз.
- `iroha3d_taira --sora` тек бір протокол стандартындағы Taira валидатор орналастыру үшін қолданыңыз; бұл Taira тізбегінің, сақтау орнын және орындау-қолтаңба профилін жүзеге асырады.
- `iroha` блокчейн есептік тізілімін сұрау, транзакцияларды жіберу немесе оператор API нүктелерін тексеру қажет болғанда қолданыңыз.
- `kagami` қажет болғанда кілттерді, блокчейннің генезис техникалық манифесттерін, профиль бандлдарын немесе localnet активтерін пайдаланыңыз.
