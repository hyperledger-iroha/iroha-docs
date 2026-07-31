---
translation_locale: ba
translation_source: /get-started/install-iroha.md
translation_source_hash: 49e1a29243151fec1ada2729c315378455a8502811e1ae124e5917a88d59b55d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 3 ҡуйыу {#install-iroha-3}

Был биттәрҙә Iroha 3 инструменттар сылбыры һәм бинарҙар өсөн өҫкө ағымында `hyperledger-iroha/iroha` эш майҙанын ҡулланған ағымдағы монтаж эштәр ағымдары ҡаралған.

## 1. Кәрәкле шарттар {#_1-prerequisites}

Тәүҙә уларҙы урынлаштырығыҙ:

- [rustup](https://www.rust-lang.org/tools/install), шуға күрә ҡуйылған `rust-toolchain.toml` ҡорамалдар сылбыры (`1.93.1`) автомат рәүештә ҡуйыла
- `git`
- Docker һәм Docker Compose урындағы күп яҡлы тиҙ старт өсөн.

## 2. Эш урынын клонлаштырығыҙ {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. Эш урынын төҙөгөҙ {#_3-build-the-workspace}

Барыһын да төҙөй:

```bash
cargo build --workspace
```

Бәләкәй генә операторға йүнәлтелгән төҙөлөш өсөн, төп бинарҙарҙы ғына тупларға кәрәк:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Һөҙөмтәле бинарҙар `target/debug/` йәки `target/release/` адресы буйынса яҙыла.

## 4. Ҡулланған ҡоралдарҙы тикшерегеҙ. {#_4-verify-the-installed-tools}

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

Өс бинар һеҙ ғәҙәттә ҡулланырһығыҙ:

- `irohad` тиҫтер демон өсөн
- `iroha` өсөн CLI доступ к Torii һәм операторҙың һуңғы нөктәләре
- `kagami` өсөн асҡыстар, генез манифесттары һәм локаль селтәр профилдәре

## 5. Факультатив локаль селтәр һәм Docker юлдары {#_5-optional-localnet-and-docker-path}

Әлеге сығанаҡ менән тәьмин ителгән локаль селтәр ағымы Kagami тарафынан барлыҡҡа килә. Ул тиңдәш конфигурацияларын, генез артефакттарын, клиент конфигурацияһын, ярҙамсы сценарийҙарын һәм тикшерелгән кодҡа тап килгән вариантлы Композит файлын яҙа:

- `kagami localnet` урындағы туған тиҫтерҙәр өсөн сценарийҙар
- `kagami docker` өсөн Docker Compose локаль селтәр каталогынан барлыҡҡа килгән

[Отпуск менән дауам итегеҙ Iroha 3](/ba/get-started/launch-iroha.md).
