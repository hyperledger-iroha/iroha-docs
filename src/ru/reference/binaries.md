---
translation_locale: ru
translation_source: /reference/binaries.md
translation_source_hash: fd9cefe7c0f5ee2f273a06b453d11d0e9bb896a35f872297276f5e052912a035
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Работа с бинарными инструментами Iroha {#working-with-iroha-binaries}

Рабочий поток оператора Iroha 3 вращается вокруг трех основных бинарных элементов:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) для запуска пир-даймона
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) для команд CLI и операторов
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) для ключей, генезиса, локальных сетей и профилей

## Строить из источника {#build-from-source}

Из корня рабочего пространства вверх потоком:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Затем бинарные выпуска доступны по `target/release/`.

Для осмотра командной поверхности:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## Запустить прямо из хранилища {#run-directly-from-the-repository}

Если вы не хотите установить что-либо в глобальном масштабе, используйте `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Изображение {#docker-image}

В верхнем рабочем пространстве используется `kagami localnet` и `kagami docker` для создания файлов Docker Compose, которые соответствуют проверенному коду. Изображение `hyperledger/iroha:dev` может быть использовано с генерируемыми файлами.

Запустить CLI в контейнере:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Запустить Kagami в контейнере:

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

- Используйте `irohad` при запуске или эксплуатации сверстников.
- Используйте `iroha` при необходимости запроса в регистр, представления транзакций или проверки конечных пунктов оператора.
- Используйте `kagami`, когда вам нужны ключи, манифесты генезиса, сборки профилей или активы локальной сети.
