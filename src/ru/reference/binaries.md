---
translation_locale: ru
translation_source: /reference/binaries.md
translation_source_hash: 887291d6ef0d9a919b076e4b632ee1cec7a2c289b284b40346ed4b2a0f4a41b3
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Работа с бинарными файлами Iroha {#working-with-iroha-binaries}

Рабочий процесс оператора Iroha 3 сосредоточен вокруг четырёх основных бинарных компонентов:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/irohad) для запуска демона узла сети
- `iroha3d_taira` для канонического Taira процессора проверки
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli) для CLI и команды оператора
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_kagami) для ключей, блокчейн-генезиса, локальных сетей и профилей

## Собрать из исходников {#build-from-source}

От корневой директории рабочего пространства источника:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Бинарные файлы релиза затем доступны в `target/release/`.

Чтобы проверить командную поверхность:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## Запуск напрямую из репозитория {#run-directly-from-the-repository}

Если вы не хотите устанавливать что-либо глобально, используйте `cargo run`:

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Изображение {#docker-image}

В руководстве [Запуск Iroha 3](/ru/get-started/launch-iroha.md) описано, как собрать и запустить четыре валидатора в Docker, используя двоичные файлы одной ревизии.

## Какой бинарный файл мне использовать? {#which-binary-should-i-use}

- Используйте `iroha3d`, когда вы запускаете или управляете сетевыми узлами вне публичного выпуска валидатора Taira.
- Используйте `iroha3d_taira --sora` только для канонического развёртывания валидатора Taira: команда обеспечивает соответствие цепочке, хранилищу и профилю криптографического подписанта среды выполнения Taira.
- Используйте `iroha`, когда вам необходимо запрашивать распределенный реестр блокчейнов, отправлять транзакции или проверять конечные точки оператора API.
- Используйте `kagami`, когда вам нужны ключи, технические манифесты генезиса блокчейна, пакеты профилей или локальные активы сети.
