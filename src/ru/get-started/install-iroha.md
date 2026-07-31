---
translation_locale: ru
translation_source: /get-started/install-iroha.md
translation_source_hash: 49e1a29243151fec1ada2729c315378455a8502811e1ae124e5917a88d59b55d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Установка Iroha 3 {#install-iroha-3}

Эта страница охватывает текущий рабочий процесс установки для Iroha 3 цепь инструментов
и двойные, использующие вверхток `hyperledger-iroha/iroha` рабочее пространство.

## 1. Предварительные условия {#_1-prerequisites}

Сначала устанавливайте:

- [rustup](https://www.rust-lang.org/tools/install), так что застрял
  `rust-toolchain.toml` цепь инструментов (`1.93.1`) устанавливается автоматически
- `git`
- по возможности, Docker и Docker Compose для местного многопарного быстрого старта

## 2. Клонировать рабочее пространство {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. Создать рабочее пространство {#_3-build-the-workspace}

Создайте все:

```bash
cargo build --workspace
```

Для небольшой конструкции, ориентированной на оператора, составить только основные бинарные:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Полученные бинарные знаки записываются на `target/debug/` или `target/release/`.

## 4. Проверьте установленные инструменты {#_4-verify-the-installed-tools}

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

Три бинарные, которые вы обычно используете:

- `irohad` для демона сверстников
- `iroha` для CLI доступ к Torii и конечные точки оператора
- `kagami` для ключей, манифестаций генезиса и профилей локальных сетей

## 5. Факультативная локальная сеть и Docker Путь {#_5-optional-localnet-and-docker-path}

Текущий поток локальной сети, поддерживаемый источником, генерируется Kagami. Это пишет "Прерога"
конфигурации, генезисные артефакты, клиентская конфигурация, помощник скриптов и опциональный
Составьте файл , который соответствует проверенному коду:

- `kagami localnet` для местных языковых сценариев
- `kagami docker` для Docker Compose генерируется из каталога локальных сетей

Продолжайте [Запуск Iroha 3](/ru/get-started/launch-iroha.md).
