---
translation_locale: ru
translation_source: /cookbook/smart-contracts.md
translation_source_hash: f1ea542f7a710830cd32465d141db8452e6418d426500995b9df7c9c4e1fd597
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Создать и развернуть смарт-контракт {#build-and-deploy-a-smart-contract}

## Результат {#outcome}

Проверьте и скомпилируйте контракт Kotodama V1, выполните его публичную точку входа локально, разверните проверенный артефакт IVM, смоделируйте развернутую точку входа и отправьте его с явной оценкой стоимости комиссии, оплачиваемой аккаунтом, подписывающим транзакцию.

## Предварительные требования {#prerequisites}

- Рабочая копия исходного кода Iroha при завершении протокола `0010c5a70039eac101a4846499ba9ceaf43eb65c`, Rust и Cargo.
- Текущий `iroha` CLI плюс финансируемый Taira клиент из [Подключиться к Taira](./connect-to-taira.md).
- Абсолютные пути в `IROHA_CONFIG` и `IROHA_PRIVATE_KEY_FILE`. Ключевой файл должен быть обычным файлом с одной ссылкой, находящимся во владении владельца, с режимом `0600`; помощник развертывания специально не имеет аргумента встроенного приватного ключа.
- Taira одобрение оператора. Регистрация кода контракта требует `CanRegisterSmartContractCode`, а защищённые развертывания могут требовать атрибуции управления и реализации. Если Taira не предоставил этот доступ, выполните развертывание в сгенерированной локальной сети, чей генезис блокчейна предоставляет это разрешение.

```bash
TORII_URL=https://taira.sora.org
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
IROHA_PRIVATE_KEY_FILE=/absolute/path/to/taira-private-key.txt
test -n "$TAIRA_ACCOUNT_ID"
test -f "$IROHA_PRIVATE_KEY_FILE"

CHAIN_ID="$({
  python3 - "$IROHA_CONFIG" <<'PY'
import sys
import tomllib

with open(sys.argv[1], "rb") as config_file:
    print(tomllib.load(config_file)["chain"])
PY
})"
```

## Шаги {#steps}

### 1. Скопируйте проверенный Kotodama V1 контракт {#_1-copy-a-known-good-kotodama-v1-contract}

Работайте внутри закрепленного Iroha чекаута и скопируйте пример возврата кортежа компилятора, чтобы исходный код и цепочка инструментов оставались на одном этапе финализации протокола.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

Полный исходный код небольшой и использует текущий синтаксис `seiyaku`/`kotoage`:

```kotodama
seiyaku TupleReturnDemo {
    fn pair(int a, int b) -> (int, int) {
        let t = (a, b);
        return t;
    }

    kotoage fn compute() -> (int, int) authorize("Entry") {
        let p = pair(a: 3, b: 5);
        return (p.0, p.1);
    }
}
```

Kotodama нацеливается на виртуальную машину Iroha и её текущий ABI. Это не WASM или EVM исходный язык.

### 2. Проверить, собрать и проверить артефакт {#_2-check-build-and-verify-the-artifact}

```bash
cargo run -p ivm --bin koto -- \
  check ./contracts/tuple_return_demo.ko

cargo run -p ivm --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  ./contracts/tuple_return_demo.ko

cargo run -p ivm --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  --verify \
  ./contracts/tuple_return_demo.ko
```

Первая сборка публикует артефакт и аутентифицированные сайдкары. Вторая выполняется в режиме только для чтения `--verify` и завершится с ошибкой, если любой существующий результат не совпадает точно с текущим исходным кодом. Рассматривайте файл `.to` и его технический манифест как один проверенный результат сборки.

### 3. Запустите байткод локально {#_3-run-the-bytecode-locally}

`compute` является публичной точкой входа `kotoage`. Запускайте её с помощью `debug-call`, которая выполняется с локальными тестовыми артефактами без отправки или оплаты транзакции.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama целые числа отображаются как JSON строки, поэтому декодированный кортеж выглядит как `["3", "5"]`.

### 4. Развернуть с помощью встроенного помощника {#_4-deploy-through-the-native-helper}

Помощник загружает фрагменты байткода, регистрирует подписанный технический манифест и отправляет одну операцию `CommitContractDeployment`. Он оценивает комиссию для каждой транзакции и отказывает в оценке, если меняется выбранный плательщик или предел стоимости выполнения транзакции.

```bash
printf '%s\n' \
  '{"payer":"authority","value":{"charge_limits":[],"gas_limit":1500000}}' \
  > ./build/fee-payment.json

cargo run -p iroha_cli --bin ivm_contract_deploy -- \
  --torii-url "$TORII_URL" \
  --chain-id "$CHAIN_ID" \
  --authority "$TAIRA_ACCOUNT_ID" \
  --private-key-file "$IROHA_PRIVATE_KEY_FILE" \
  --code-file ./build/tuple_return_demo.to \
  --contract-alias cookbook_tuple::universal \
  --fee-payment-json ./build/fee-payment.json \
  --out-dir ./build/deployment \
  > ./build/deployment.json

jq '{contract_address, code_hash_hex, final, fee_quotes}' \
  ./build/deployment.json
```

Пустой запрос `charge_limits` не является идентификатором скопированного актива: помощник принимает точную текущую котировку перед подписанием. Сравните возвращаемый актив оплаты с текущим ответом службы финансирования тестовой сети. Вызовы контрактов принимают выбор комиссии только через типизированное живое предложение; `gas_asset_id` метаданные транзакции не являются частью контракта первой версии.

### 5. Смоделируйте и вызовите развернутую точку входа {#_5-simulate-and-call-the-deployed-entrypoint}

Симуляция запускает общедоступную точку входа на Torii без отправки. Следующий технический вызов является транзакцией и поэтому явно выбирает плательщика комиссии основного принципала авторизации. Обе команды устанавливают лимит стоимости выполнения транзакции в 1 500 000.

```bash
iroha --config "$IROHA_CONFIG" --machine contract call \
  --simulate \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-simulation.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-simulation.json

iroha --config "$IROHA_CONFIG" \
  --machine \
  --fee-payer authority \
  contract call \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  --wait \
  --timeout-ms 60000 \
  > ./build/deployed-call.json

jq -e '.terminal_kind == "Applied"' ./build/deployed-call.json
```

## Проверить {#verify}

Разрешите псевдоним, получите технический манифест в блокчейне по возвращённому криптографическому хэшу кода и смоделируйте ту же публичную точку входа по каноническому адресу:

```bash
CODE_HASH="$({ jq -er '.code_hash_hex' ./build/deployment.json; })"
CONTRACT_ADDRESS="$({ jq -er '.contract_address' ./build/deployment.json; })"

RESOLVED_ADDRESS="$({
  iroha --config "$IROHA_CONFIG" --machine \
    contract alias resolve cookbook_tuple::universal |
    jq -er '.contract_address'
})"
test "$RESOLVED_ADDRESS" = "$CONTRACT_ADDRESS"

iroha --config "$IROHA_CONFIG" contract manifest get \
  --code-hash "$CODE_HASH" \
  --out ./build/on-chain-manifest.json

iroha --config "$IROHA_CONFIG" --machine contract call \
  --simulate \
  --contract-address "$CONTRACT_ADDRESS" \
  --entrypoint compute \
  > ./build/address-simulation.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/address-simulation.json
```

Развертывание считается завершённым только тогда, когда псевдоним разрешается в возвращённый адрес, технический манифест читаем при том же криптографическом хэше кода, локальные и Torii симуляции возвращают `["3", "5"]`, и переданный технический вызов достигает `Applied`.

## Устранение неполадок {#troubleshooting}

- `CanRegisterSmartContractCode` ошибки требуют предоставления прав оператором Taira или изменения генезиса/загрузки на localnet. Обычный аккаунт не может самостоятельно предоставить себе это разрешение после факта.
- Отказ из-за управления или защищённой полосы означает, что для развертывания требуется точное указание утверждающего, необходимое для этой сети. Координируйте список утверждающих; не придумывайте идентификаторы аккаунтов.
- Технический манифест или несоответствие ABI означает, что байткод, технический манифест и среда выполнения узла не описывают один и тот же артефакт. Пересоберите на закреплённой ревизии исходного кода с `--verify`.
- `fee quote changed ... gas bound` означает, что запрашиваемое типизированное намерение и текущая котировка не совпадают. Выполните повторную проверку, а не изменяйте подписанную транзакцию.
- Помощник развертывания отвергает встроенные ключи, разрешающие режимы файлов ключей, символьные ссылки и файлы с множественными ссылками перед отправкой по сети.
- Ошибка точки входа только для просмотра означает, что `compute` был направлен через неправильное семейство команд. В этом примере объявляется `kotoage`, поэтому используйте техническую симуляцию вызова или отправку.
- Вызовы контрактов требуют положительного предела стоимости выполнения транзакции с указанным типом. Контракт технического вызова первой версии отклоняет метаданные стоимости выполнения транзакции верхнего уровня или активов оплаты.

## Исходные и сопутствующие документы {#source-and-related-docs}

- [Kotodama V1 реализация команды на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/src/bin/koto.rs)
- [Пример исходного кода с возвратом кортежа на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [Встроенный помощник развертывания на закреплённой версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [Интеграционные тесты контрактов на закреплённой версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/contracts.rs)
- [Умные контракты](/ru/blockchain/smart-contracts.md)
- [CLI справка](/ru/get-started/operate-iroha-via-cli.md)
