---
translation_locale: ru
translation_source: /cookbook/smart-contracts.md
translation_source_hash: 4fe9b19fc4d13cfc71d9b9558fe7cdb1d14bd88c2d20f4d23c66313ba3ddd4b6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Создайте и используйте умный контракт {#build-and-deploy-a-smart-contract}

## Результат {#outcome}

Проверяйте и составляйте контракт Kotodama V1, выполняйте его публичный пункт въезда на местном уровне, размещайте проверенный артефакт IVM, имитируйте развернутый пункт въездов и представьте его с процитированной комиссией, уплаченной органом.

## Предварительные условия {#prerequisites}

- Проверка источника Iroha по адресу: commit `bc7114ed1c7f265a156d2100ff09e851cc95702c`, Rust и Cargo.
- Текущий `iroha` CLI плюс финансируемый Taira клиент от [Свяжитесь с Taira](./connect-to-taira.md).
- Абсолютные пути в `IROHA_CONFIG` и `IROHA_PRIVATE_KEY_FILE`. Файл-ключ должен быть владельцем, односвязкой регулярный файл с режимом `0600`; помощник развертывания намеренно не имеет аргумента личного ключа.
- Одобрение оператора Taira. Регистрация контрактного кода требует `CanRegisterSmartContractCode`, а защищенные развертывания могут потребовать присвоения управления и принятия закона. Если Taira не предоставил такой доступ, выполните развертывание на генерируемой локальной сети, генезис которой предоставляет разрешение.

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

### 1. Копия известного договора Kotodama V1 {#_1-copy-a-known-good-kotodama-v1-contract}

Работайте внутри закрепленной кассы Iroha и скопируйте образец типового возвращения компилятора, чтобы источник и цепь инструментов оставались на одном и том же commit.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

Полный источник небольшой и использует текущий `seiyaku`/`kotoage` синтаксис:

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

Kotodama Целью Iroha Виртуальная машина и ее ток ABI. Это не WASM или EVM язык источника.

### 2. Проверка, строительство и проверка артефакта. {#_2-check-build-and-verify-the-artifact}

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

Первая версия публикует артефакт и аутентифицированные боковые машины, вторая работает только для чтения `--verify` В случае, если существующий выход не соответствует текущему источнику, он будет работать с `.to` Файл и его манифест как один пересмотренный вывод.

### 3. Запустить байт-код локально. {#_3-run-the-bytecode-locally}

`compute` является публичным входным пунктом `kotoage`. Используйте его с помощью `debug-call`, который выполняется против местных устройств без подачи или оплаты транзакции.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Целые числа Kotodama переводятся в строки JSON, поэтому расшифрованная тупль составляет `["3", "5"]`.

### 4. Развертывание через местного помощника {#_4-deploy-through-the-native-helper}

Помощник загружает куски байт-кода, регистрирует подписанный манифест и отправляет одну операцию `CommitContractDeployment`. Он ссылается на каждую транзакцию и отказывается от цитаты, которая изменяет выбранного плательщика или газовую линию.

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

Пустой запрос `charge_limits` не является копированным идентификатором актива: помощник принимает точную прямую цитату до подписания. Сопоставьте возвращенный платежный актив с текущим ответом на трубку. Не присоединяйте прежние метаданные `gas_asset_id` к контрактным звонкам.

### 5. Симулировать и позвонить в развернутый пункт въезда {#_5-simulate-and-call-the-deployed-entrypoint}

Симуляция выполняет публичный пункт входа на Torii без предъявления. Следующий звонок является транзакцией и, следовательно, выбирает плательщика административного сбора.

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

## Проверка {#verify}

Решение псевдоним, получение на цепочке манифеста с возвращенным хэшем кода и симуляция того же публичного пункта входа по каноническому адресу:

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

Развертывание завершено только тогда, когда псевдоним решается на возвращенный адрес, манифест читается под одним и тем же хэшем кода, локальным и Torii симуляционным возвратом `["3", "5"]`, а подаваемый звонок достигает `Applied`.

## Устранение неполадок {#troubleshooting}

- Неудачи `CanRegisterSmartContractCode` требуют предоставления оператора Taira или изменения генезиса/bootstrap на локальной сети. Обычный счет не может самостоятельно предоставить это разрешение после того, как факт произошел.
- Управление или отказ от защищенной полосы означает , что развертывание требует точного одобрения . Присвоение, требуемое этой сетью. Координация списка одобренных; не изобретать учет IDs.
- Проявление или ABI несоответствие означает, что байт-код, манифест и время запуска узла не описывают один и тот же артефакт. `--verify`.
- `fee quote changed ... gas bound` означает, что запрошенный тип намерения и прямой цитаты не согласны. Возобновить переход, а не изменить подписанную транзакцию.
- Помощник развертывания отклоняет встроенные ключи, разрешительные режимы файла-ключа, симссылки и умножают связанные файлы перед отправкой в сеть.
- Ошибка входного пункта только для просмотра `compute` Этот образец указывает, что `kotoage`, Так что используйте симуляцию вызова или подачу.
- Контрактные звонки требуют положительного ограничения на газ. Отклоняются метаданные о старых газовых или сборных активах высшего уровня.

## Источник и связанные с ним документы {#source-and-related-docs}

- [Kotodama V1 выполнение команд на финированном commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/src/bin/koto.rs)
- [Образец источника с повторяющимся возвратами в закрепленном commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [Местный помощник для развертывания на финированном commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [Тесты интеграции контракта на закрепленном обязательстве](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/contracts.rs)
- [Умные контракты](/ru/blockchain/smart-contracts.md)
- [ссылка CLI](/ru/get-started/operate-iroha-via-cli.md)
