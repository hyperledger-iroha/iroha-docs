---
translation_locale: kk
translation_source: /get-started/install-iroha.md
translation_source_hash: 613e81510c9de1bf341e545521fc27fa6a5e145ea3bbaab41664e95199ffbf35
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha 3 орнатыңыз {#install-iroha-3}

Бұл бетте Iroha 3 құралдар жинағы мен бинарлық файлдарды жоғары деңгейлі `hyperledger-iroha/iroha` жұмыс кеңістігін пайдалана отырып қазіргі орнату жұмыс ағымы көрсетілген.

## 1. Алдын ала талаптар {#_1-prerequisites}

Бұларды бірінші орнатыңыз:

- [rustup](https://www.rust-lang.org/tools/install), сондықтан бекітілген `rust-toolchain.toml` құралдар жиынтығы (`1.93.1`) автоматты түрде орнатылды
- `git`
- қалауы бойынша, жергілікті көпсерверлі жылдам бастау үшін Docker және Docker Compose

## 2. Жұмыс алаңын көшіру {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. Жұмыс алаңын құру {#_3-build-the-workspace}

Барлығын салу:

```bash
cargo build --workspace
```

Кіші операторға бағытталған жинақ үшін тек негізгі бинарларды біріктіріңіз:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Соңында алынған бинарлық файлдар `target/debug/` немесе `target/release/` мекенжайына жазылады.

## 4. Орнатылған құралдарды тексеру {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

Сіз әдетте пайдаланатын төрт екілік файл мыналар:

- `iroha3d` стандартты желілік тіркелім демоны үшін
- `iroha3d_taira` бір протокол-стандарт Taira валидаторын іске қосу үшін
- `iroha` Torii және оператор API ендіру нүктелеріне CLI кіру үшін
- `kagami` кілттерге, блокчейн бастауының техникалық манифесттеріне және localnet профильдеріне

## 5. Таңдамалы Localnet және Docker жолы {#_5-optional-localnet-and-docker-path}

Ағымдағы бастапқы кодқа негізделген жергілікті желі ағынын Kagami жасайды. Ол желі түйіндерінің конфигурацияларын, genesis артефактілерін, клиент конфигурациясын, көмекші сценарийлерді және жұмыс көшірмесіндегі кодқа сәйкес келетін міндетті емес Compose файлын жазады:

- `kagami localnet` жергілікті желідегі түпнұсқа процесс әріптестерінің скрипттері үшін
- `kagami docker` үшін Docker Compose локальді желі каталогынан жасалған

[Жіберу Iroha 3](/kk/get-started/launch-iroha.md) арқылы жалғастырыңыз.
