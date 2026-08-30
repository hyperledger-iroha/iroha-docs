---
translation_locale: kk
translation_source: /cookbook/smart-contracts.md
translation_source_hash: 67778f9fc4f2b6fa0288f5921402cf5509515aae678e98b8192e103dfe284db3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ақыл-ойлы келісімшарт жасаңыз {#build-and-deploy-a-smart-contract}

## Нәтижесі {#outcome}

Kotodama V1 шартын тексеру және құрастыру, оның мемлекеттік кіріс нүктесін жергілікті деңгейде орындау, тексерілген IVM артефактті орналастыру, іске қосылған кіріс нүктісін мойындау және оны органнан айрықша көрсетілген алыммен тапсыру.

## Алдын ала талаптар {#prerequisites}

- Iroha, `0010c5a70039eac101a4846499ba9ceaf43eb65c`, Rust және жүк мекенжайындағы көзді тексеру.
- Ағымдағы `iroha` CLI және қаржыландырылған Taira клиенті [ қосылымынан Taira ](./connect-to-taira.md).
- `IROHA_CONFIG` және `IROHA_PRIVATE_KEY_FILE` кодтарында абсолютті жолдар. Кілті файлы меншік иесі ұстап тұрған, бір сілтемелі қалыпты файл болуы тиіс, оның режимі `0600`; іске қосу көмекшісі қасақана жеке кілті аргументіне ие болмайды.
- Taira оператордың рұқсаты. Келісімшарт кодын тіркеу үшін `CanRegisterSmartContractCode` қажет, ал қорғалған орналасуларға басқарушылық беру және енгізу талап етілуі мүмкін. Егер Taira бұл қолжетімділікті бермесе, рұқсат берген жергiлiктi желiде орналастыруды жүргiзу.

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

### 1. Белгілі жақсы Kotodama V1 келісімшарттың көшірмесі. {#_1-copy-a-known-good-kotodama-v1-contract}

Тіркелген Iroha кассасында жұмыс істеңіз және компилятордың тупл-тарту өлшемін көшіріп алыңыз, сондықтан көз бен құралдар тізбектері бірдей жүктемеде болады.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

Толық көз кішкентай және ағымдағы `seiyaku`/`kotoage` синтаксисін пайдаланады:

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

Kotodama Iroha Виртуалды машинаны және оның ағымдағы ABI нысанасына алады. Бұл WASM немесе EVM бастапқы тіл емес.

### 2. Артефактты тексеру, жасау және тексеру. {#_2-check-build-and-verify-the-artifact}

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

Бірінші құрастыру артефакт пен аутентификацияланған қосалқы машиналарды жариялайды. Екіншісі тек оқуға арналған `--verify` режимімен жүреді және егер кез келген қолданыстағы шығыс ағымдағы көзбен дәл сәйкес келмесе, сәтсіздікке ұшырады. `.to` файлын және оның манифесін қайта қаралған құрастыруды шығару ретінде қараңыз.

### 3. Байткодты жергілікті түрде орындаңыз {#_3-run-the-bytecode-locally}

`compute` - қоғамдық `kotoage` кіріс нүктесі. Оны `debug-call` арқылы орындаңыз, ол транзакцияны тапсырмастан немесе төлеместен жергілікті құрылғыларға қарсы орындалады.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama бүтін сандар JSON жиындары ретінде көрсетіледі, сондықтан шифрланған тупл `["3", "5"]` болады.

### 4. Жергiлiктi көмекшi арқылы қызмет көрсету {#_4-deploy-through-the-native-helper}

Жардамшы байткод бөліктерін жүктейді, қол қойылған манифесті тіркейді және бір `CommitContractDeployment` операцияны ұсынады. Ол әрбір транзакцияны алыммен цитаталайды және таңдалған төлеуші немесе газ бойындарын өзгертетін цитатадан бас тартады.

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

Бос `charge_limits` сұранысы көшірілген активтің идентификаторы емес: көмекші қолтаңбалаудан бұрын нақты тірі цитатаны қабылдайды. Қайтарылған төлем активін Ағымдағы кранды жауап беру. Келісімшарт шақырулары төлемді тек түрленген тірі цитата арқылы қабылдайды; `gas_asset_id` мәміле метамәліметтері бірінші шығарылған келісімшарттың бөлігі болып табылмайды.

### 5. Жоспарланған кіру нүктесін бейнелеу және шақыру. {#_5-simulate-and-call-the-deployed-entrypoint}

Симуляция мемлекеттік кіріс нүктесін Torii тапсырыссыз орындайды. Келесі шақыру транзакция болып табылады және сондықтан билік ақысын төлеушіді айрықша таңдайды. Екі командада да 1500 000 газ лимиті бекітіледі.

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

## Тексеру {#verify}

Алмасаны шешу, қайтару коды хэш арқылы тізбектегі манифесті алу және бірдей қоғамдық кіреберіс нүктесін каноникалық мекенжаймен мойындау:

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

Орындалу тек қайтарып берiлген мекен-жайға ауысқан кезде ғана аяқталады, манифест дәл сол кодтың хеш, жергілікті және Torii шерттеулер қайтарымы `["3", "5"]` бойынша оқылады және тапсырылған шақыру `Applied` дейін жетеді.

## Қиындықтарды шешу {#troubleshooting}

- `CanRegisterSmartContractCode` сәтсіздіктер үшін Taira операторының грантын немесе localnet-те генез/боутстрап өзгертілуін қажет етеді.
- Басқару немесе қорғалған жолды бас тарту - бұл іске қосуға осы желі талап ететін дәл мақұлданушы белгісі қажет. Мақұлданушылар тізімін үйлестіріңіз; тіркелгі IDs ойлап таппаңыз.
- Манифест немесе ABI сәйкессіздік байткоды, манифесті және түйінді орындау уақыты бірдей артефактті сипаттамайды. `--verify`.
- `fee quote changed ... gas bound` дегенді білдіреді, сұрау салынған түрленген ниеті мен тірі цитата келіспеушілігі. Қол қойылған транзакцияны өзгертудің орнына қайта алдын ала қарау.
- Демонстрациялау көмекшісі желідегі кілттерді, рұқсат етілетін кілті файл режимін, симлингтерді және қосылған файлдарды көптеп тапсырудан бұрын бас тартады.
- Тек көрінетін кіру нүктесі қатесі `compute` дұрыс емес командалық отбасы арқылы бағытталды дегенді білдіреді. Бұл үлгіде `kotoage` деп мәлімдейді, сондықтан шақыру симуляциясын немесе тапсыруды пайдаланыңыз.
- Контракттық шақырулар жағымды типті газ лимитін талап етеді. Бірінші шығарылымдағы шақыру келісімшарты жоғары деңгейдегі газ немесе алым активтері метамәдени деректерін қабылдамайды.

## Бастапқы және осыған байланысты құжаттар {#source-and-related-docs}

- [Kotodama V1 команданы орнатылған commit-де іске асыру ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/src/bin/koto.rs)
- [Түптік қайтару көзінің үлгісі түйірілген commit-де](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [Тіркелген жүктемеде жергілікті орналасу көмекшісі](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [Контрактты интеграциялау сынақтары бекітілген міндеттемеде](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/contracts.rs)
- [Ақылды келісім-шарттар](/kk/blockchain/smart-contracts.md)
- [CLI сілтемесі](/kk/get-started/operate-iroha-via-cli.md)
