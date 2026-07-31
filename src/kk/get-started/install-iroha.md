---
translation_locale: kk
translation_source: /get-started/install-iroha.md
translation_source_hash: 49e1a29243151fec1ada2729c315378455a8502811e1ae124e5917a88d59b55d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 3 орнату {#install-iroha-3}

Бұл бетте Iroha 3 құралдар тізбегі мен бинарлар үшін ағымдағы монтаждау жұмыс барысы көрсетіледі, ол `hyperledger-iroha/iroha` жоғары ағыстағы жұмыс кеңістігін пайдаланады.

## 1. Алдын ала талаптар {#_1-prerequisites}

Алдымен мыналарды орнатыңыз:

- [rustup](https://www.rust-lang.org/tools/install), сондықтан тігілген `rust-toolchain.toml` құрал-жабдықтар (`1.93.1`) автоматты түрде орнатылады
- `git`
- Docker және Docker Compose жергiлiктi көп қатарлы тез бастау үшін

## 2. Жұмыс орнын клондау {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. Жұмыс орнын құру {#_3-build-the-workspace}

Барлығын құраңыз:

```bash
cargo build --workspace
```

Операторға бағытталған кіші build үшін тек негізгі бинарлықтарды жинақтаңыз:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Нәтижесіндегі бинарлар `target/debug/` немесе `target/release/` деген нөмірге жазылады.

## 4. Құралдарды тексеріңіз. {#_4-verify-the-installed-tools}

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

Әдетте пайдаланатын үш бинарлық жүйе:

- `irohad` жасөспірім дэймон үшін
- `iroha` үшін CLI Torii және оператордың соңғы нүктелері
- `kagami` кілттер, генез манифесттері және локальдік желі профилі үшін

## 5. Факультативті Localnet және Docker жолы {#_5-optional-localnet-and-docker-path}

Қазiргi ресурсқа қолдау көрсетiлетiн локалнет ағыны Kagami арқылы жасалады. Ол теңгершiлiк конфигурацияларды, генез артефакттарын, клиент конфигурацияларын, көмекшi скрипттердi және тексерген кодқа сәйкес келетiн таңдаулы Compose файлын жазады:

- `kagami localnet` жергiлiктi еркiлiктердiң жазбалары үшiн
- `kagami docker` үшін Docker Compose локальдік желілер каталогынан жасалған

[Бастауы Iroha 3](/kk/get-started/launch-iroha.md) жалғасын табады.
