---
translation_locale: kk
translation_source: /cookbook/smart-contracts.md
translation_source_hash: f1ea542f7a710830cd32465d141db8452e6418d426500995b9df7c9c4e1fd597
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Ақылды келісімді құру және орналастыру {#build-and-deploy-a-smart-contract}

## Нәтиже {#outcome}

Kotodama V1 келісімшартын тексеріп, жинақтаңыз, оның қоғамдық кіріс нүктесін жергілікті орындаңыз, расталған IVM артефактін орналастырыңыз, орналастырылған кіріс нүктесін симуляциялаңыз және транзакцияны қол қоятын есептік жазба арқылы төленетін нақты төлем бағасы шамасымен жіберіңіз.

## Алдын ала шарттар {#prerequisites}

- Протоколды аяқтау кезінде Iroha бастапқы кодтың жұмыс көшірмесі `0010c5a70039eac101a4846499ba9ceaf43eb65c`, Rust және Cargo.
- Қазіргі `iroha` CLI плюс қаржыландырылған Taira клиентінен [Taira құрылғысына қосылу](./connect-to-taira.md).
- `IROHA_CONFIG` және `IROHA_PRIVATE_KEY_FILE` ішіндегі абсолюттік жолдар. Кілт файлы иесі ұстаған, бір сілтемелі, қалыпты файл болуы керек, режимі `0600`; орналастыру көмекшісінде әдейі ішкі кілт аргументі жоқ.
- Taira оператордың мақұлдауы. Келісімшарт кодын тіркеу үшін `CanRegisterSmartContractCode` қажет, ал қорғалған орналастырулар басқару атрибуциясы мен іске асыруды талап етуі мүмкін. Егер Taira осы кіруге рұқсат бермеген болса, рұқсатты беретін блокчейн генезисі бар жасалған жергілікті желіде орналастыруды орындаңыз.

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

## Қадамдар {#steps}

### 1. Белгілі бір дұрыс Kotodama V1 келісімді көшіру {#_1-copy-a-known-good-kotodama-v1-contract}

Тұрақты Iroha касса ішіндегі жұмысты орындап, компилятордың кортежді қайтару үлгісін көшіріңіз, осылайша бастапқы код пен құралдар жиынтығы бір протокол аяқталуында қалады.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

Толық көз кіші және ағымдағы `seiyaku`/`kotoage` синтаксисін пайдаланады:

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

Kotodama Iroha Виртуалды Машинасына және оның ағымдағы ABI бағыталған. Бұл WASM немесе EVM бастапқы тілі емес.

### 2. Артефактіні тексеру, құру және растау {#_2-check-build-and-verify-the-artifact}

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

Бірінші жинақ артефакт пен аутентификацияланған қосалқы контейнерлерді жариялайды. Екінші жинақ тек оқуға арналған `--verify` режимінде жұмыс істейді және кез келген бар шығару ағымдағы көзбен дәл сәйкес келмесе, сәтсіздікке ұшырайды. `.to` файлын және оның техникалық манифесін бір қаралған жинақ шығару ретінде қарастырыңыз.

### 3. Байткодты жергілікті орындау {#_3-run-the-bytecode-locally}

`compute` — бұл қоғамдық `kotoage` кіріс нүктесі. Оны `debug-call` арқылы іске қосыңыз, ол транзакцияны жібермей немесе төлем жасамай жергілікті тестілік объектілерге қарсы орындалады.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama бүтін сандар JSON жолдар ретінде көрсетіледі, сондықтан декодталған кортеж `["3", "5"]` болып табылады.

### 4. Туған тілдес көмекші арқылы орналастыру {#_4-deploy-through-the-native-helper}

Көмекші байткод бөліктерін жүктейді, қолтаңбаланған техникалық манифесті тіркейді және бір `CommitContractDeployment` операциясын жібереді. Ол әр транзакцияға құндық баға береді және таңдалған төлеушіні немесе транзакцияны орындау құны шегін өзгертетін бағаны қабылдамайды.

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

Бос `charge_limits` сұрауы көшірілген актив идентификаторы емес: көмекші қол қою алдында нақты тірі баға ұсынысын қабылдайды. Қайтарылған төлем активін ағымдағы тесттік желі қаржыландыру қызметінің жауабымен салыстырыңыз. шартты шақырулар тек терілген нақты ұсыныс арқылы ақы таңдауын қабылдайды; `gas_asset_id` транзакция метадеректері бірінші-босату шартының құрамына кірмейді.

### 5. Орнатылған кіріс нүктесін модельдеу және шақыру {#_5-simulate-and-call-the-deployed-entrypoint}

Симуляция қоғамдық кіру нүктесін Torii бойынша жіберусіз іске қосады. Келесі техникалық шақыру транзакция болып табылады және сондықтан уәкілетті субъект төлеушісін нақты таңдайды. Екі команда да 1,500,000 транзакция орындау шығындарының шегін байланыстырды.

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

## Растау {#verify}

Алиасты шешіп, қайтарылған кодтың криптографиялық хэшін пайдаланып тізбектегі техникалық манифесті алып, бір протокол стандартты мекенжай арқылы сол қоғамдық кіріс нүктесін өзгертпей модельдеңіз:

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

Жабдықтау тек қана егер алиас қайтарылған мекен-жайға жетсе, техникалық манифест сол кодтың криптографиялық хэшінде оқылады, жергілікті және Torii симуляциялары `["3", "5"]` қайтарады, және жіберілген техникалық шақыру `Applied` жеткен кезде ғана толық болады.

## Ақауларды жою {#troubleshooting}

- `CanRegisterSmartContractCode` қатесі Taira оператор рұқсатын немесе localnet желісінде genesis/bootstrap өзгерісін қажет етеді. Қалыпты есептік жазба бұл рұқсатты кейіннен өз бетінше бере алмайды.
- Басқару немесе қорғалатын жол тыйым салуы дегеніміз - орналастыру сол желі талап ететін нақты бекіту беруші атрибутын қажет етеді. Бекіту берушілер тізімін үйлестіріңіз; есептік жазба идентификаторларын ойлап тауып жасамаңыз.
- Техникалық манифест немесе ABI сәйкессіздігі дегеніміз байткод, техникалық манифест және түйіндік бағдарламалық қамтамасыз ету орындалу ортасы бірдей артефактті сипаттамайды. `--verify` көрсетілген бастапқы код нұсқасында қайта құрыңыз.
- `fee quote changed ... gas bound` дегеніміз сұралған жазбаша ниет пен нақты баға сәйкес келмейді дегенді білдіреді. Қол қойылған транзакцияны өзгертудің орнына қайта тексеруді орындаңыз.
- Орнату көмекшісі желі арқылы жібермес бұрын кірістірілген кілттерді, рұқсат етілген кілт-файл режимдерін, символдық сілтемелерді және бірнеше рет байланған файлдарды қабылдамайды.
- Тек көру үшін енгіру нүктесінің қатесі `compute`-ның дұрыс емес команда отбасынан бағытталғанын білдіреді. Бұл үлгі `kotoage`-ді жариялайды, сол себепті техникалық шақыру симуляциясын немесе жіберуді пайдаланыңыз.
- шарттама шақыруларына оң типтелген транзакцияны орындау шығыны шегі қажет. Бірінші шығарылымдағы техникалық шақыру шарты жоғарғы деңгейдегі транзакцияны орындау шығыны немесе төлем активінің метадеректерін қабылдамайды.

## Дереккөз және қатысты құжаттар {#source-and-related-docs}

- [Kotodama V1 бұйрықты іске асыру бекітілген бастапқы код нұсқасында](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/src/bin/koto.rs)
- [Тұрақты бастапқы код нұсқасындағы кортежді қайтаратын бастапқы мысал](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [Тұрақты бастапқы код нұсқасында жергілікті орналастыру көмекшісі](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [Тұрақты бағдарламалық код нұсқасындағы келісім-шарт интеграциялық тестілері](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/contracts.rs)
- [Ақылды келісімшарттар](/kk/blockchain/smart-contracts.md)
- [CLI сілтеме](/kk/get-started/operate-iroha-via-cli.md)
