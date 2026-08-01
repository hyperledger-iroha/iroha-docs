---
translation_locale: ba
translation_source: /cookbook/smart-contracts.md
translation_source_hash: 4fe9b19fc4d13cfc71d9b9558fe7cdb1d14bd88c2d20f4d23c66313ba3ddd4b6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Аҡыллы килешеү төҙөү һәм уны ҡулланыу {#build-and-deploy-a-smart-contract}

## Һөҙөмтә {#outcome}

Kotodama V1 килешеүен тикшереү һәм төҙөү, уның асыҡ инеү урынын урында үтәү, тикшерелгән IVM артефактын урынлаштырыу, урынлаштырылған инеү урынының симуляцияһын яһау һәм уны власть тарафынан асыҡтан-асыҡ күрһәтелгән түләү менән тапшырыу.

## Шарттар {#prerequisites}

- Iroha сығанағынан `bc7114ed1c7f265a156d2100ff09e851cc95702c`, Rust һәм Cargo адресы буйынса иҫәп-хисап.
- Хәҙерге `iroha` CLI плюс финансланған Taira клиенты [нан Taira](./connect-to-taira.md) менән бәйләнешкә инә.
- Абсолют юлдары `IROHA_CONFIG` һәм `IROHA_PRIVATE_KEY_FILE`. Ключлы файл хужаһы ҡарамағында булырға тейеш, бер ссылка менән даими файл режимы менән `0600`; урынлаштырыу ярҙамсыһы аңлы рәүештә шәхси-ключлы аргументҡа эйә түгел.
- Taira операторҙы раҫлау. Контракт кодын теркәү өсөн `CanRegisterSmartContractCode` кәрәк, һәм һаҡланған урынлаштырыуҙар идара итеүҙе бүлеү һәм ғәмәлгә ашырыу талап итә ала. Әгәр ҙә Taira был хоҡуҡты бирмәгән икән, уны генерияланған локаль селтәрҙә ҡулланыу рөхсәт ителә.

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

## Аҙымдар {#steps}

### 1. Билдәле яҡшы Kotodama V1 килешеүенең күсермәһе. {#_1-copy-a-known-good-kotodama-v1-contract}

Iroha ҡалыпта эш һәм компиляторҙың тупль кире ҡайтарыу өлгөһөн күсер, шуға күрә сығанаҡ һәм ҡорамалдар сылбырһы бер үк commit.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

Тулы сығанаҡ ҙур түгел һәм хәҙерге `seiyaku`/`kotoage` синтаксисын ҡуллана:

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

Kotodama маҡсатлы Iroha Виртуаль машина һәм уның хәҙергеһе ABI. Был түгел WASM йәки EVM сығанаҡ теле.

### 2. Артефактты тикшерегеҙ, төҙөгөҙ һәм тикшерегеҙ {#_2-check-build-and-verify-the-artifact}

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

Беренсе төҙөлөш артефактты һәм аутентификацияланған сираттағы машиналарҙы баҫтыра. Икенсеһе уҡырға ғына `--verify` режимында эшләй һәм әгәр ниндәй ҙә булһа ғәмәлдәге сығанаҡ ағымдағы сығанаҡҡа тап килмәһә, уңышһыҙлыҡҡа осрай. `.to` файлын һәм уның манифестын бер ҡаралған төҙөлөш сығанағы тип ҡарағыҙ.

### 3. Байткодты локаль рәүештә эшләтегеҙ. {#_3-run-the-bytecode-locally}

`compute` - асыҡ `kotoage` инеү пункты. уны ғәмәлгә ашырығыҙ `debug-call`, ул урындағы фиксаторҙарға ҡаршы үтә, бер транзакцияны тапшырмайынса йәки түләмәйенсә.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama тулы һандар JSON ҡылдары итеп күрһәтелә, шуға күрә декодланған тупл `["3", "5"]` була.

### 4. Туған ярҙамсыһы аша эш итергә кәрәк {#_4-deploy-through-the-native-helper}

Ярҙамсы байт-код өлөштәрен йөкмәтә, ҡул ҡуйылған манифестты теркәй һәм бер `CommitContractDeployment` операцияһын тапшыра. Ул һәр транзакцияны түләү менән билдәләй һәм һайланған түләүсене йәки газ бәйләнешен үҙгәрткән цитатаны кире ҡаға.

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

`charge_limits` буш үтенесе күсермәле актив идентификаторы түгел: ярҙамсы ҡул ҡуйғанға тиклем теүәл туранан-тура цитатаны ҡабул итә. Кире ҡайтарылған түләү активын ағымдағы кран яуап менән сағыштырығыҙ. Контрактҡа шылтыратыуҙарға мираҫлы `gas_asset_id` метаданмаларҙы ҡуймағыҙ.

### 5. Ҡулланылған инеү пунктына шылтыратыу һәм симуляциялау {#_5-simulate-and-call-the-deployed-entrypoint}

Симуляция асыҡ инеү пунктын Torii тапшырыуһыҙ эшләй. түбәндәге саҡырыу транзакция булып тора һәм, шуға күрә, власть түләүен түләүсене асыҡтан-асыҡ һайлай.

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

## Тикшереү {#verify}

Алмаш исемдәрҙе хәл итегеҙ, кире ҡайтарылған код хэшигы менән сылбырҙағы манифестты алығыҙ һәм шул уҡ асыҡ инеү нөктәһен каноник адрес буйынса симуляциялау:

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

Ҡулланыуҙы тик кире ҡайтарылған адресҡа ҡушамат тапҡанда ғына тамамлайҙар, манифест шул уҡ код хэшигы аҫтында уҡыла, локаль һәм Torii симуляциялар кире ҡайта `["3", "5"]`, ә ебәрелгән саҡырыу `Applied` тиклем етә.

## Проблемаларҙы хәл итеү {#troubleshooting}

- `CanRegisterSmartContractCode` уңышһыҙлыҡтары өсөн Taira операторы гранты йәки локаль селтәрҙә генез/бутстрап үҙгәреүе талап ителә. Ғәҙәттән тыш иҫәп-хисап фактынан һуң был рөхсәтте үҙе бирә алмай.
- Идара итеү йәки һаҡланған һуҡмаҡтан баш тартыу , йәғни урынлаштырыу өсөн тейешле раҫлау талап ителә был селтәр талап иткән билдәләү. раҫлаусылар исемлеген координациялау; иҫәп-хисап уйлап сығарыу IDs.
- Манифест йәки ABI тап килмәү байт-код, манифест һәм узел эшләү ваҡыты бер үк артефактты һүрәтләмәне аңлата. `--verify`.
- `fee quote changed ... gas bound` талап ителгән тип яҙған ниәт һәм туранан-тура цитатаһы килешмәй. Ҡул ҡуйылған транзакцияны үҙгәртмәйенсә, ҡабаттан юлға сығыу.
- Развертывать ярҙамсыһы кире ҡаға инеү клавишалары, рөхсәт итеүсе клавишалар файл режимы, симссылкалар һәм күп тапҡыр бәйләнгән файлдар селтәр тапшырыу алдынан.
- Тик ҡарау инеү нөктәһе хатаһы `compute` дөрөҫ булмаған команда ғаиләһе аша йүнәлтелгән тигәнде аңлата. Был өлгө `kotoage` тип белдерә, шуға күрә шылтыратыу симуляцияһы йәки тапшырыу ҡулланығыҙ.
- Контрактлы шылтыратыуҙар өсөн ыңғай типланған газ лимиты кәрәк. Иң юғары кимәлдәге боронғо газ йәки түләүле активтар метамәғлүмәттәре кире ҡағыла.

## Сығанаҡ һәм уның менән бәйле документтар {#source-and-related-docs}

- [Kotodama V1 командаһы үтәлеше ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/src/bin/koto.rs)
- [Тупль кире ҡайтарыу сығанағы өлгөһө ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [Тыуған урынлаштырыу ярҙамсыһы ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [Контрактлы интеграция һынауҙары ҡуйылған йөкләмә буйынса](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/contracts.rs)
- [Аҡыллы килешеүҙәр](/ba/blockchain/smart-contracts.md)
- [CLI ссылка](/ba/get-started/operate-iroha-via-cli.md)
