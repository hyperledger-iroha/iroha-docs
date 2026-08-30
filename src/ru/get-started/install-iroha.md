---
translation_locale: ru
translation_source: /get-started/install-iroha.md
translation_source_hash: 613e81510c9de1bf341e545521fc27fa6a5e145ea3bbaab41664e95199ffbf35
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Установка Iroha 3 {#install-iroha-3}

Эта страница охватывает текущий рабочий процесс установки для цепочки инструментов Iroha 3 и бинарных систем, использующих рабочее пространство `hyperledger-iroha/iroha` вверх потока.

## 1. Предварительные условия {#_1-prerequisites}

Во-первых, установить:

- [rustup](https://www.rust-lang.org/tools/install), так что закрепленная `rust-toolchain.toml` цепочка инструментов (`1.93.1`) устанавливается автоматически
- `git`
- по возможности, Docker и Docker Compose для местного многопарного быстрого запуска

## 2. Клонировать рабочее пространство {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. Создать рабочее пространство {#_3-build-the-workspace}

Постройте все:

```bash
cargo build --workspace
```

Для более мелкой конструкции, ориентированной на оператора, составить только основные бинарные:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Полученные бинарные знаки составляются по адресу `target/debug/` или `target/release/`.

## 4. Проверьте установленные инструменты. {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

Четыре бинарные значения , которые вы обычно используете:

- `iroha3d` для стандартного одинакового демона
- `iroha3d_taira` для канонического пускового подтвердителя Taira
- `iroha` для CLI доступ к Torii и конечные точки оператора
- `kagami` для ключей, манифестаций генезиса и профилей локальной сети

## 5. Факультативная локальная сеть и маршрут Docker {#_5-optional-localnet-and-docker-path}

Текущий поток локальной сети, поддерживаемый исходным источником, генерируется Kagami. Он пишет конфигурации сверстников, артефакты генезиса, конфигурацию клиента, скрипты помощника и дополнительный файл Compose, который соответствует проверенному коду:

- `kagami localnet` для коренных местных сверстников
- `kagami docker` для Docker Compose, полученного из каталога локальной сети

Продолжать [Запуск Iroha 3](/ru/get-started/launch-iroha.md).
