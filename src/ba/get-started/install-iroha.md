---
translation_locale: ba
translation_source: /get-started/install-iroha.md
translation_source_hash: 613e81510c9de1bf341e545521fc27fa6a5e145ea3bbaab41664e95199ffbf35
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
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Һөҙөмтәле бинарҙар `target/debug/` йәки `target/release/` адресы буйынса яҙыла.

## 4. Ҡулланған ҡоралдарҙы тикшерегеҙ. {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

Дүрт бинар һеҙ ғәҙәттә ҡулланырға:

- `iroha3d` стандарт бер-береһенә тиң булған ендәр өсөн
- `iroha3d_taira` каноник Taira validator launcher өсөн
- `iroha` өсөн CLI доступ к Torii һәм операторҙың һуңғы нөктәләре
- `kagami` өсөн асҡыстар, генез манифесттары һәм локаль селтәр профилдәре

## 5. Факультатив локаль селтәр һәм Docker юлдары {#_5-optional-localnet-and-docker-path}

Әлеге сығанаҡ менән тәьмин ителгән локаль селтәр ағымы Kagami тарафынан барлыҡҡа килә. Ул пир конфигурацияларын, генез артефакттарын, клиент конфигурацияһын, ярҙамсы сценарийҙарын һәм тикшерелгән кодҡа тап килгән вариантлы Композит файлын яҙа:

- `kagami localnet` локаль native пирҙар өсөн сценарийҙар
- `kagami docker` өсөн Docker Compose локаль селтәр каталогынан барлыҡҡа килгән

[Отпуск менән дауам итегеҙ Iroha 3](/ba/get-started/launch-iroha.md).
