---
translation_locale: ru
translation_source: /reference/binaries.md
translation_source_hash: fd9cefe7c0f5ee2f273a06b453d11d0e9bb896a35f872297276f5e052912a035
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Работа с Iroha Бинарные {#working-with-iroha-binaries}

Сборник Iroha 3 рабочий поток оператора вращается вокруг трех основных бинарных:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) за то, что я управляю демоном сверстников
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) для CLI и команды оператора
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) для ключей, генезиса, локальных сетей и профилей

## Создайте из источника {#build-from-source}

Из корня рабочего пространства вверх потоком:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Затем бинарные выпуска доступны в `target/release/`.

Для осмотра командной поверхности:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## Запускать прямо из хранилища {#run-directly-from-the-repository}

Если вы не хотите установить что-либо глобально, используйте `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Изображение {#docker-image}

Вверхпоток рабочего пространства использует `kagami localnet` и `kagami docker` создать
Docker Compose файлы, соответствующие проверенному коду. `hyperledger/iroha:dev`
изображение может быть использовано с этими файлами.

Поехать CLI в контейнере:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Беги . Kagami в контейнере:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Для стартапа сверстников, создать локальную сеть и сначала составить файл:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## Какой бинарный вариант я должен использовать? {#which-binary-should-i-use}

- Использование `irohad` когда вы начинаете или управляете партнерами.
- Использование `iroha` когда вам нужно запросить книгу, представить транзакции или осмотреть конечные точки оператора.
- Использование `kagami` когда вам нужны ключи, генезисные манифесты, сборки профилей или активы локальной сети.
