---
translation_locale: ru
translation_source: /get-started/install-iroha.md
translation_source_hash: 613e81510c9de1bf341e545521fc27fa6a5e145ea3bbaab41664e95199ffbf35
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Установите Iroha 3 {#install-iroha-3}

На этой странице рассматривается текущий процесс установки инструментальной цепочки и бинарных файлов Iroha 3 с использованием исходного рабочего пространства `hyperledger-iroha/iroha`.

## 1. Требования {#_1-prerequisites}

Сначала установите это:

- [rustup](https://www.rust-lang.org/tools/install), поэтому закреплённая `rust-toolchain.toml` цепочка инструментов (`1.93.1`) устанавливается автоматически
- `git`
- при желании, Docker и Docker Compose для локального быстрого запуска с несколькими узлами

## 2. Клонировать рабочее пространство {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. Постройте рабочее пространство {#_3-build-the-workspace}

Постройте всё:

```bash
cargo build --workspace
```

Для менее крупной сборки, ориентированной на операторов, компилируйте только основные бинарные файлы:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Полученные бинарные файлы записываются в `target/debug/` или `target/release/`.

## 4. Проверить установленные инструменты {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

Четыре бинарных значения, которые вы обычно будете использовать, следующие:

- `iroha3d` для стандартного сетевого демон-пирa
- `iroha3d_taira` для канонического Taira процессора проверки
- `iroha` для CLI доступа к Torii и конечным точкам оператора API
- `kagami` для ключей, технических манифестов генезиса блокчейна и профилей локальной сети

## 5. Необязательная локальная сеть и путь Docker {#_5-optional-localnet-and-docker-path}

Текущий поток локальной сети с поддержкой исходного кода генерируется Kagami. Он записывает конфигурации сетевых узлов, артефакты генезиса блокчейна, конфигурацию клиента, вспомогательные скрипты и необязательный файл Compose, который соответствует проверенному коду:

- `kagami localnet` для скриптов локальных сетевых пиров
- `kagami docker` для Docker Compose, сгенерированный из каталога localnet

Продолжить с [Запуск Iroha 3](/ru/get-started/launch-iroha.md).
