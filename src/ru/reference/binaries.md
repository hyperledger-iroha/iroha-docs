---
translation_locale: ru
translation_source: /reference/binaries.md
translation_source_hash: 3d1cddb466092770376bcb150963d5df29a6ebc5cf6e670baa3a5c277082fdab
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Работа с бинарными файлами Iroha {#working-with-iroha-binaries}

Рабочий процесс оператора Iroha 3 сосредоточен вокруг четырёх основных бинарных компонентов:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) для запуска демона узла сети
- `iroha3d_taira` для канонического Taira процессора проверки
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) для CLI и команды оператора
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) для ключей, блокчейн-генезиса, локальных сетей и профилей

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

Верхнеуровневое рабочее пространство использует `kagami localnet` и `kagami docker` для генерации файлов Docker Compose, соответствующих проверенному коду. Изображение `hyperledger/iroha:dev` можно использовать с этими сгенерированными файлами.

Запустите CLI в контейнере:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Запустите Kagami в контейнере:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Для запуска сетевого узла сначала сгенерируйте локальную сеть и файл Compose:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## Какой бинарный файл мне использовать? {#which-binary-should-i-use}

- Используйте `iroha3d`, когда вы запускаете или управляете сетевыми узлами вне публичного выпуска валидатора Taira.
- Используйте `iroha3d_taira --sora` только для канонического развёртывания валидатора Taira: команда обеспечивает соответствие цепочке, хранилищу и профилю криптографического подписанта среды выполнения Taira.
- Используйте `iroha`, когда вам необходимо запрашивать распределенный реестр блокчейнов, отправлять транзакции или проверять конечные точки оператора API.
- Используйте `kagami`, когда вам нужны ключи, технические манифесты генезиса блокчейна, пакеты профилей или локальные активы сети.
