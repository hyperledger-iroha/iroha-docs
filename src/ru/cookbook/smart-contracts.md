---
translation_locale: ru
translation_source: /cookbook/smart-contracts.md
translation_source_hash: ca6fd12e33df43b73a72dd6327133115aa44256cf579387c11bf0693797bf96e
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Создать и развернуть смарт-контракт {#build-and-deploy-a-smart-contract}

## Результат {#outcome}

Проверьте и скомпилируйте контракт Kotodama V1, выполните локально его публичную view-функцию, разверните проверенный артефакт IVM с явно выбранной оплатой комиссий полномочным субъектом и прочитайте развернутую view-функцию через Torii.

## Предварительные требования {#prerequisites}

- Рабочая копия исходного кода Iroha при завершении протокола `c8c872461e92f04325c350cdd952f4276e96f9dc`, Rust и Cargo.
- Текущий `iroha` CLI и `musubi` (запускается как `cargo run -p musubi --` в рабочей копии) плюс финансируемый клиент Taira из [Подключиться к Taira](./connect-to-taira.md).
- Абсолютный путь в `IROHA_CONFIG`. Сетевая привязка Musubi хранит ссылку на этот файл клиента и подписывает развертывание ключом его аккаунта.
- Полномочия на псевдоним. Исполнитель требует `CanManageAccountAlias` для точного псевдонима контракта или его родительской области: домена-владельца для `name::domain.dataspace` или пространства данных для `name::dataspace`. Зарегистрированным аккаунтам не нужно отдельное разрешение на регистрацию кода, а защищённые пространства имён также требуют процесса управления сети. В примерах используется `cookbook_tuple::universal`; на Taira замените его псевдонимом в принадлежащем вам домене или выполните развертывание в сгенерированной локальной сети, генезис которой предоставляет область псевдонима.

```bash
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
test -f "$IROHA_CONFIG"
```

## Шаги {#steps}

### 1. Скопируйте проверенный Kotodama V1 контракт {#_1-copy-a-known-good-kotodama-v1-contract}

Работайте внутри закрепленного Iroha чекаута и скопируйте пример возврата кортежа компилятора, чтобы исходный код и цепочка инструментов оставались на одном этапе финализации протокола.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

Полный исходный код небольшой: приватная вспомогательная функция `fn` и одна публичная `view fn` только для чтения, которая явно допускает любого вызывающего:

```kotodama
seiyaku TupleReturnDemo {
    fn pair(int a, int b) -> (int, int) {
        let t = (a, b);
        return t;
    }

    view fn compute() authorize(anyone) -> (int, int) {
        let p = pair(a: 3, b: 5);
        return (p.0, p.1);
    }
}
```

Kotodama нацеливается на виртуальную машину Iroha и её текущий ABI. Это не WASM или EVM исходный язык.

### 2. Проверить, собрать и проверить артефакт {#_2-check-build-and-verify-the-artifact}

```bash
cargo run -p kotodama_toolchain --bin koto -- \
  check ./contracts/tuple_return_demo.ko

cargo run -p kotodama_toolchain --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  ./contracts/tuple_return_demo.ko

cargo run -p kotodama_toolchain --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  --verify \
  ./contracts/tuple_return_demo.ko
```

Первая сборка публикует артефакт и аутентифицированные сайдкары. Вторая выполняется в режиме только для чтения `--verify` и завершится с ошибкой, если любой существующий результат не совпадает точно с текущим исходным кодом. Рассматривайте файл `.to` и его технический манифест как один проверенный результат сборки.

### 3. Запустите байткод локально {#_3-run-the-bytecode-locally}

`compute` — это публичная `view fn` только для чтения. Запускайте её с помощью `debug-view`, которая локально выполняет скомпилированный байткод с необязательными тестовыми данными без отправки или оплаты транзакции.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-view \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-view.json
```

Kotodama целые числа отображаются как JSON строки, поэтому декодированный кортеж выглядит как `["3", "5"]`.

### 4. Разверните проверенный артефакт с помощью Musubi {#_4-deploy-the-verified-artifact-with-musubi}

`iroha contract` проверяет контракты, вызывает их view-функции и отлаживает их, но не развертывает, поэтому развертывания в Taira выполняются через Musubi. Его служба развертывания загружает фрагменты байткода, регистрирует проверенный технический манифест и отправляет одну операцию `CommitContractDeployment`. Она получает котировку для каждой транзакции, отклоняет котировку, если меняются выбранный плательщик, ревизия спонсора или предел газа, и развертывает заранее собранный артефакт только после того, как сборка пакета с зафиксированными зависимостями воспроизведёт его хэши кода и ABI. В локальной сети под управлением Kagami вместо этого `kagami contract deploy` развертывает `./build/tuple_return_demo.to` с `--alias cookbook_tuple::universal --json`; его квитанция находится в `.receipt`, а `kagami context show` выводит конфигурацию клиента, которую следует использовать как `IROHA_CONFIG`.

```bash
cat > ./contracts/Musubi.toml <<'TOML'
manifest-version = 1

[package]
namespace = "local"
name = "cookbook-tuple"
version = "0.1.0"
edition = "1"
abi-version = 1

[[contract]]
name = "tuple_return_demo"
path = "tuple_return_demo.ko"
TOML

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml check

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml \
  network configure taira \
  --config "$IROHA_CONFIG" \
  --fee-payer authority \
  --contract tuple_return_demo \
  --alias cookbook_tuple::universal

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml --format json \
  deploy --network taira \
  --contract tuple_return_demo \
  --artifact ./build/tuple_return_demo.to \
  --artifact-manifest ./build/tuple_return_demo.manifest.json \
  > ./build/deployment.json

jq '.data.receipt | {contract_address, code_hash, stored_artifact_matches}' \
  ./build/deployment.json
```

Привязка использует `--fee-payer authority`; Musubi получает точную котировку комиссии в активе комиссии Taira до подписания. Сравните возвращаемый актив оплаты с активом, который публикует текущая политика службы финансирования тестовой сети. Вызовы контрактов принимают выбор комиссии только через типизированную текущую котировку; метаданные транзакции `gas_asset_id` не являются частью контракта первой версии.

### 5. Прочитайте развернутую view-функцию {#_5-read-the-deployed-view}

`contract view` выполняет точку входа только для чтения на Torii без транзакции и комиссии. У view-функции нет транзакционной формы: Torii отклоняет селектор view-функции на своих маршрутах вызова.

```bash
iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-view.json
```

## Проверить {#verify}

Разрешите псевдоним, получите технический манифест в блокчейне по криптографическому хэшу кода, который Torii сообщает для развернутой view-функции, и выполните ту же view-функцию по каноническому адресу:

```bash
CONTRACT_ADDRESS="$({
  jq -er '.data.receipt.contract_address' ./build/deployment.json
})"
CODE_HASH="$({ jq -er '.code_hash_hex' ./build/local-view.json; })"
DEPLOYED_CODE_HASH="$({
  jq -er '.code_hash_hex' ./build/deployed-view.json
})"
test "$DEPLOYED_CODE_HASH" = "$CODE_HASH"

RESOLVED_ADDRESS="$({
  iroha --config "$IROHA_CONFIG" --machine \
    contract alias resolve cookbook_tuple::universal |
    jq -er '.contract_address'
})"
test "$RESOLVED_ADDRESS" = "$CONTRACT_ADDRESS"

iroha --config "$IROHA_CONFIG" contract manifest get \
  --dataspace-id 0 \
  --code-hash "$CODE_HASH" \
  --out ./build/on-chain-manifest.json

iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-address "$CONTRACT_ADDRESS" \
  --entrypoint compute \
  > ./build/address-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/address-view.json
```

Развертывание считается завершённым только тогда, когда квитанция развертывания сообщает, что сохранённый артефакт проверен, псевдоним разрешается в возвращённый адрес, технический манифест читается при том же криптографическом хэше кода, а локальная view-функция и view-функция Torii возвращают `["3", "5"]`.

## Устранение неполадок {#troubleshooting}

- `deployment authority lacks CanManageAccountAlias` или сообщение исполнителя `authority is not permitted to manage contract alias` означает, что аккаунт не может привязать этот псевдоним. Используйте псевдоним в принадлежащем вам домене или получите у владельца этой области точное разрешение на псевдоним либо разрешение на его домен или пространство данных; в локальной сети предоставьте его в генезисе.
- Отказ из-за защищённого пространства имён означает, что пространство имён псевдонима подчиняется управлению. Перечисление идентификаторов утверждающих аккаунтов не является доказательством утверждения; используйте процесс управления сети (`iroha app gov deploy propose`) для этого пространства имён или выберите псевдоним вне его.
- Несоответствие технического манифеста или ABI означает, что байткод, технический манифест и среда выполнения узла не описывают один и тот же артефакт. Пересоберите на закреплённой ревизии исходного кода, затем повторно запустите сборку с `--verify`.
- `fee quote changed ... gas bound` означает, что запрашиваемое типизированное намерение и текущая котировка не совпадают. Выполните повторную проверку, а не изменяйте подписанную транзакцию.
- Прерванное развертывание сохраняет свой подписанный план в журнале. Восстановите его с помощью `musubi deploy --resume <JOURNAL>` вместо того, чтобы подписывать новый план.
- `is read-only and cannot be invoked as a transaction` или `is not a kotoage or lifecycle entrypoint` означает, что `compute` был отправлен команде вызова. В этом примере объявлена `view fn`, поэтому используйте `debug-view` локально и `view` на Torii.
- Вызовы контрактов требуют положительного предела стоимости выполнения транзакции с указанным типом. Контракт технического вызова первой версии отклоняет метаданные стоимости выполнения транзакции верхнего уровня или активов оплаты.

## Исходные и сопутствующие документы {#source-and-related-docs}

- [Реализация команды Kotodama V1 на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_toolchain/src/bin/koto.rs)
- [Пример исходного кода с возвратом кортежа на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [Команда развертывания Musubi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/musubi/src/command_deploy.rs) и [нативная служба развертывания контрактов](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_contract_deploy/src/lib.rs) на закрепленной версии исходного кода
- [Интеграционные тесты контрактов на закреплённой версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/contracts.rs)
- [Умные контракты](/ru/blockchain/smart-contracts.md)
- [CLI справка](/ru/get-started/operate-iroha-via-cli.md)
