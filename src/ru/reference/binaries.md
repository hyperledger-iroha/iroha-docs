---
translation_locale: ru
translation_source: /reference/binaries.md
translation_source_hash: 5a36877954bec97691e45697680bfbd6e0a7c7695e48a796bc7c9a41d4756644
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Работа с бинарными инструментами Iroha {#working-with-iroha-binaries}

Рабочий поток оператора Iroha 3 вращается вокруг четырех основных бинарных элементов:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) для запуска пир-даймона
- `iroha3d_taira` для канонического пускового подтвердителя Taira
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) для команд CLI и операторов
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) для ключей, генезиса, локальных сетей и профилей

## Строить из источника {#build-from-source}

Из корня рабочего пространства вверх потоком:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Затем бинарные выпуска доступны по `target/release/`.

Для осмотра командной поверхности:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## Запустить прямо из хранилища {#run-directly-from-the-repository}

Если вы не хотите установить что-либо в глобальном масштабе, используйте `cargo run`:

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
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
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## Какой бинарный вариант я должен использовать? {#which-binary-should-i-use}

- Используйте `iroha3d` при запуске или эксплуатации сверстников за пределами публичного выпуска валидатора Taira.
- Используйте `iroha3d_taira --sora` только для канонического развертывания валидатора Taira; он обеспечивает профиль цепочки, хранения и подписи runtime-signer Taira.
- Используйте `iroha` при необходимости запроса в регистр, представления транзакций или проверки конечных пунктов оператора.
- Используйте `kagami`, когда вам нужны ключи, манифесты генезиса, сборки профилей или активы локальной сети.
