---
translation_locale: ba
translation_source: /cookbook/smart-contracts.md
translation_source_hash: ca6fd12e33df43b73a72dd6327133115aa44256cf579387c11bf0693797bf96e
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Аҡыллы килешеү төҙөү һәм уны ҡулланыу {#build-and-deploy-a-smart-contract}

## Һөҙөмтә {#outcome}

Kotodama V1 килешеүен тикшерегеҙ һәм компиляциялағыҙ, уның асыҡ ҡарау функцияһын локаль эшләтегеҙ, тикшерелгән IVM артефактын асыҡтан-асыҡ һайланған, вәкәләтле иҫәп түләгән комиссиялар менән урынлаштырығыҙ һәм урынлаштырылған ҡарау функцияһын Torii аша уҡығыҙ.

## Шарттар {#prerequisites}

- Iroha сығанағынан `c8c872461e92f04325c350cdd952f4276e96f9dc`, Rust һәм Cargo адресы буйынса иҫәп-хисап.
- Хәҙерге `iroha` CLI һәм `musubi` (сығанаҡ код күсермәһендә `cargo run -p musubi --` итеп эшләтелә), шулай уҡ [Taira-ға тоташыу](./connect-to-taira.md) битенән финансланған Taira клиенты.
- `IROHA_CONFIG`-та абсолют юл. Musubi-ҙың селтәр бәйләүе был клиент файлына һылтанманы һаҡлай һәм урынлаштырыуға шул файлдағы иҫәп асҡысы менән ҡул ҡуя.
- Ҡушамат вәкәләте. Башҡарыусы (executor) теүәл килешеү ҡушаматы йәки уның өҫтәге даирәһе өсөн `CanManageAccountAlias` талап итә: `name::domain.dataspace` өсөн — хужа домен, `name::dataspace` өсөн — мәғлүмәттәр киңлеге. Теркәлгән иҫәптәргә код теркәү өсөн айырым рөхсәт кәрәкмәй, ә һаҡланған исемдәр арауыҡтары өсөн шулай уҡ селтәрҙең идара итеү процесы кәрәк. Миҫалдар `cookbook_tuple::universal` ҡуллана; Taira-ла уны үҙегеҙгә ҡараған домендағы ҡушамат менән алмаштырығыҙ йәки генезисы ҡушамат даирәһен биргән генерацияланған локаль селтәрҙә урынлаштырығыҙ.

```bash
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
test -f "$IROHA_CONFIG"
```

## Аҙымдар {#steps}

### 1. Билдәле яҡшы Kotodama V1 килешеүенең күсермәһе. {#_1-copy-a-known-good-kotodama-v1-contract}

Iroha ҡалыпта эш һәм компиляторҙың тупль кире ҡайтарыу өлгөһөн күсер, шуға күрә сығанаҡ һәм ҡорамалдар сылбырһы бер үк commit.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

Тулы сығанаҡ код бәләкәй: бер шәхси ярҙамсы `fn` һәм һәр саҡырыусыға асыҡтан-асыҡ рөхсәт иткән бер асыҡ, уҡыу өсөн генә булған `view fn`:

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

Kotodama маҡсатлы Iroha Виртуаль машина һәм уның хәҙергеһе ABI. Был түгел WASM йәки EVM сығанаҡ теле.

### 2. Артефактты тикшерегеҙ, төҙөгөҙ һәм тикшерегеҙ {#_2-check-build-and-verify-the-artifact}

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

Беренсе төҙөлөш артефактты һәм аутентификацияланған ярҙәмсе яҙмаларҙы баҫтыра. Икенсеһе уҡырға ғына `--verify` режимында эшләй һәм әгәр ниндәй ҙә булһа ғәмәлдәге сығанаҡ ағымдағы сығанаҡҡа тап килмәһә, уңышһыҙлыҡҡа осрай. `.to` файлын һәм уның манифестын бер ҡаралған төҙөлөш сығанағы тип ҡарағыҙ.

### 3. Байткодты локаль рәүештә эшләтегеҙ. {#_3-run-the-bytecode-locally}

`compute` — асыҡ, уҡыу өсөн генә булған `view fn`. Уны `debug-view` менән эшләтегеҙ: ул компиляцияланған байт-кодты ирекле һынау мәғлүмәттәре менән локаль башҡара, транзакцияны тапшырмай һәм уның өсөн түләмәй.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-view \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-view.json
```

Kotodama тулы һандар JSON ҡылдары итеп күрһәтелә, шуға күрә декодланған тупл `["3", "5"]` була.

### 4. Тикшерелгән артефактты Musubi менән урынлаштырығыҙ {#_4-deploy-the-verified-artifact-with-musubi}

`iroha contract` килешеүҙәрҙе тикшерә, уларҙың ҡарау функцияларын эшләтә һәм отладка яһай, ләкин уларҙы урынлаштырмай, шуға күрә Taira-ла урынлаштырыу Musubi аша бара. Уның урынлаштырыу хеҙмәте байт-код өлөштәрен тейәй, тикшерелгән манифестты теркәй һәм бер `CommitContractDeployment` операцияһын тапшыра. Ул һәр транзакция өсөн комиссия иҫәбен ала, һайланған түләүсене, спонсор ревизияһын йәки газ сиген үҙгәрткән комиссия иҫәбен кире ҡаға һәм алдан йыйылған артефактты бикләнгән бәйлелектәр менән пакет йыйылышы уның код һәм ABI хештарын ҡабатлағандан һуң ғына урынлаштыра. Kagami идара иткән локаль селтәрҙә уның урынына `kagami contract deploy` `./build/tuple_return_demo.to`-ны `--alias cookbook_tuple::universal --json` менән урынлаштыра; уның квитанцияһы `.receipt` аҫтында, ә `kagami context show` `IROHA_CONFIG` итеп ҡулланыла торған клиент конфигурацияһын баҫтыра.

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

Селтәр бәйләүе `--fee-payer authority` ҡуллана; Musubi ҡул ҡуйыр алдынан теүәл комиссияны Taira-ның түләү активында иҫәпләп күрһәтә. Ҡайтарылған комиссия активын хәҙерге faucet сәйәсәте баҫтырған актив менән сағыштырығыҙ. Килешеү саҡырыуҙары комиссияны һайлауҙы тик типлы ағымдағы комиссия иҫәбе аша ҡабул итә; `gas_asset_id` транзакция метамәғлүмәттәре беренсе релиз килешеүенә инмәй.

### 5. Урынлаштырылған ҡарау функцияһын уҡығыҙ {#_5-read-the-deployed-view}

`contract view` уҡыу өсөн генә булған инеү нөктәһен Torii-ҙа транзакцияһыҙ һәм комиссияһыҙ башҡара. Ҡарау функцияһының транзакция формаһы юҡ: Torii үҙенең саҡырыу маршруттарында ҡарау селекторын кире ҡаға.

```bash
iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-view.json
```

## Тикшереү {#verify}

Ҡушаматтың адресын билдәләгеҙ, Torii урынлаштырылған ҡарау функцияһы өсөн хәбәр иткән код хеше буйынса сылбырҙағы манифестты алығыҙ һәм шул уҡ ҡарау функцияһын каноник адрес буйынса эшләтегеҙ:

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

Урынлаштырыу түбәндәге шарттарҙа ғына тамамланған һанала: урынлаштырыу квитанцияһы һаҡланған артефактты тикшерелгән тип күрһәтә, ҡушамат ҡайтарылған адресҡа килтерә, манифест шул уҡ код хеше буйынса уҡыла, ә локаль һәм Torii ҡарау функциялары `["3", "5"]` ҡайтара.

## Проблемаларҙы хәл итеү {#troubleshooting}

- `deployment authority lacks CanManageAccountAlias` йәки башҡарыусының `authority is not permitted to manage contract alias` хатаһы иҫәптең был ҡушаматты бәйләй алмауын аңлата. Үҙегеҙгә ҡараған домендағы ҡушаматты ҡулланығыҙ йәки теүәл ҡушамат рөхсәтен, йә уның домены йәки мәғлүмәттәр киңлеге рөхсәтен шул даирәнең хужаһынан алығыҙ; локаль селтәрҙә уны генезиста бирегеҙ.
- Һаҡланған исемдәр арауығы буйынса кире ҡағыу ҡушаматтың исемдәр арауығы идара итеү аҫтында булыуын аңлата. Раҫлаусы иҫәптәрҙең ID-ларын һанап сығыу раҫлау дәлиле булып тормай; был исемдәр арауығы өсөн селтәрҙең идара итеү процесын (`iroha app gov deploy propose`) ҡулланығыҙ йәки унан ситтәге ҡушаматты һайлағыҙ.
- Манифест йәки ABI тап килмәүе байт-кодтың, манифесттың һәм узелдың башҡарыу мөхитенең бер үк артефактты һүрәтләмәүен аңлата. Ҡуйылған commit-та ҡабат йыйығыҙ, һуңынан йыйылышты `--verify` менән ҡабат эшләтегеҙ.
- `fee quote changed ... gas bound` талап ителгән тип яҙған ниәт һәм туранан-тура комиссия иҫәбе килешмәй. Ҡул ҡуйылған транзакцияны үҙгәртмәйенсә, ҡабаттан юлға сығыу.
- Өҙөлгән урынлаштырыу үҙенең ҡул ҡуйылған планын журналда һаҡлай. Яңы планға ҡул ҡуйыу урынына уны `musubi deploy --resume <JOURNAL>` менән тергеҙегеҙ.
- `is read-only and cannot be invoked as a transaction` йәки `is not a kotoage or lifecycle entrypoint` хатаһы `compute` саҡырыу командаһына ебәрелгәнен аңлата. Был миҫал `view fn` иғлан итә, шуға күрә локаль `debug-view`, ә Torii-ҙа `view` ҡулланығыҙ.
- Контрактҡа саҡырыуҙар ыңғай типланған газ лимитын талап итә. Тәүге сығарылышҡа саҡырыу контракты юғары кимәлдәге газ йәки түләү активтары метамәғлүмәтенә ҡаршы килә.

## Сығанаҡ һәм уның менән бәйле документтар {#source-and-related-docs}

- [Kotodama V1 командаһының ҡуйылған commit-тағы тормошҡа ашырылышы](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_toolchain/src/bin/koto.rs)
- [Тупль кире ҡайтарыу сығанағы өлгөһө ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- Ҡуйылған commit-тағы [Musubi урынлаштырыу командаһы](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/musubi/src/command_deploy.rs) һәм [Iroha-ның үҙ килешеү урынлаштырыу хеҙмәте](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_contract_deploy/src/lib.rs)
- [Контрактлы интеграция һынауҙары ҡуйылған commit буйынса](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/contracts.rs)
- [Аҡыллы килешеүҙәр](/ba/blockchain/smart-contracts.md)
- [CLI ссылка](/ba/get-started/operate-iroha-via-cli.md)
