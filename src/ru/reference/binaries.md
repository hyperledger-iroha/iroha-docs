---
translation_locale: ru
translation_source: /reference/binaries.md
translation_source_hash: 2a9274f1590c2816c72625e5ffd9b93ee4c0b6bc73faf60cdc3273c1314e0c3a
translation_status: machine-validated
translation_engine: google-translate
---

# Работа с Iroha Бинарные файлы {#working-with-iroha-binaries}

 Iroha 3 Рабочий процесс оператора вращается вокруг трех основных двоичных файлов:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) для запуска однорангового демона
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) для CLI и команды оператора
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) для ключей, генезиса, локальных сетей и профилей

## Сборка из исходного кода {#build-from-source}

Из корня вышестоящей рабочей области:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Двоичные файлы выпуска затем доступны в `target/release/`.

Чтобы проверить командную поверхность:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## Запуск прямо из репозитория {#run-directly-from-the-repository}

Если вы не хотите ничего устанавливать глобально, используйте `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Изображение {#docker-image}

В восходящем рабочем пространстве используется `kagami localnet` и `kagami docker` генерировать
Docker Compose файлы, соответствующие извлеченному коду. `hyperledger/iroha:dev`
image можно использовать с этими сгенерированными файлами.

Запустите CLI в контейнере:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Бегать Kagami в контейнере:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Для однорангового запуска сначала создайте локальную сеть и создайте файл:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## Какой двоичный файл мне следует использовать? {#which-binary-should-i-use}

- Использовать `irohad` когда вы запускаете или используете пиры.
- Использовать `iroha` когда вам нужно запросить реестр, отправить транзакции или проверить конечные точки оператора.
- Использовать `kagami` когда вам нужны ключи, манифесты Genesis, пакеты профилей или ресурсы локальной сети.

## Публикация и внедрение релиза Kagemusha {#kagemusha-release-publication-and-rollout}

Кагемуша V4 публикация и активация пересекают отдельные защищенные границы:

- `iroha_authenticated_tool_controller promote-kagemusha-release-v4` это
  Издатель только для macOS и только с правами root.Он подтверждает подлинность закрепленного Kagami двоичный и
  точный кандидат из шестнадцати файлов, публикует отсутствующие
  `promotion-record-v4.norito` без замены и сообщает только об успехе
  после подтверждения точного продвигаемого выпуска из семнадцати файлов.
- `iroha offline kagemusha rollout-v4 create-expectations` проверяет подписанное
  резервирование, четыре заказанные квалификационные печати валидатора, точные
  уже авторизованная транзакция и доверенный завершенный якорь перед
  публикация подписанных ожиданий без замены.
- `iroha offline kagemusha rollout-v4 submit` требует явного
  `--write-authorized` согласие.Он надежно записывает и повторно проверяет точные
  ожидания перед сетевой записью или повторной попыткой.Ан `Applied` статус не
  достаточно: команда также проверяет зафиксированный блок, преемник окончательности
  цепочку и полный провод транзакции, несущий авторизацию.
- `iroha offline kagemusha rollout-v4 finalize-receipt` собирает те же
  привязанные к доказательству свидетельства только после повторной проверки
  точного журнала отправки, подписывает их ключом независимого эмитента квитанции
  и публикует каноническую квитанцию без замены.

Зарегистрированный рабочий процесс готовности к производству Kagemusha предназначен только для проверки.
Он не вызывает аутентифицированного издателя, публикует квалификацию валидатора.
печати, отправьте активацию или создайте квитанцию ​​об окончательности.Успешный рабочий процесс
Таким образом, запуск не доказывает ни продвижения, ни активного внедрения.

Эти команды являются локальными примитивами, а не заменой живых данных.А
развертывание рабочей версии остается заблокированным без реального физического подтверждения приложения и
артефакты-кандидаты, все четыре защищенные печати хоста, управление средой выполнения и
входные данные для подписи, подача в реальном времени четырем валидаторам и доказательство окончательности, а также
каноническая проекция эффективной конфигурации.Храните приватные ключи,
аутентификационные материалы и идентификаторы рекламных акций в защищенных
хранение во время выполнения;не копируйте их в документацию с контролем исходного кода или
билеты оператора.
