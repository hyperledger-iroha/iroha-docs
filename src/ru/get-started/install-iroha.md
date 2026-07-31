---
translation_locale: ru
translation_source: /get-started/install-iroha.md
translation_source_hash: 49e1a29243151fec1ada2729c315378455a8502811e1ae124e5917a88d59b55d
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
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Полученные бинарные знаки составляются по адресу `target/debug/` или `target/release/`.

## 4. Проверьте установленные инструменты. {#_4-verify-the-installed-tools}

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

Три бинарные системы , которые вы обычно используете:

- `irohad` для пчелового демона
- `iroha` для CLI доступ к Torii и конечные точки оператора
- `kagami` для ключей, манифестаций генезиса и профилей локальной сети

## 5. Факультативная локальная сеть и маршрут Docker {#_5-optional-localnet-and-docker-path}

Текущий поток локальной сети, поддерживаемый исходным источником, генерируется Kagami. Он пишет конфигурации сверстников, артефакты генезиса, конфигурацию клиента, скрипты помощника и дополнительный файл Compose, который соответствует проверенному коду:

- `kagami localnet` для коренных местных сверстников
- `kagami docker` для Docker Compose, полученного из каталога локальной сети

Продолжать [Запуск Iroha 3](/ru/get-started/launch-iroha.md).
