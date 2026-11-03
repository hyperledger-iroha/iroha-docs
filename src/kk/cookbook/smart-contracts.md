---
translation_locale: kk
translation_source: /cookbook/smart-contracts.md
translation_source_hash: ca6fd12e33df43b73a72dd6327133115aa44256cf579387c11bf0693797bf96e
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Ақылды келісімді құру және орналастыру {#build-and-deploy-a-smart-contract}

## Нәтиже {#outcome}

Kotodama V1 келісімшартын тексеріп, компиляциялаңыз, оның жалпыға ашық view функциясын жергілікті түрде іске қосыңыз, тексерілген IVM артефактін айқын таңдалған, уәкілетті субъект төлейтін ақылармен орналастырыңыз және орналастырылған view функциясын Torii арқылы оқыңыз.

## Алдын ала шарттар {#prerequisites}

- Протоколды аяқтау кезінде Iroha бастапқы кодтың жұмыс көшірмесі `c8c872461e92f04325c350cdd952f4276e96f9dc`, Rust және Cargo.
- Ағымдағы `iroha` CLI және `musubi` (жұмыс көшірмесінде `cargo run -p musubi --` ретінде іске қосыңыз), сондай-ақ [Taira-ға қосылу](./connect-to-taira.md) нұсқаулығы бойынша қаржыландырылған Taira клиенті.
- `IROHA_CONFIG` ішіндегі абсолютті жол. Musubi желілік байланысы осы клиент файлына сілтемені сақтайды және орналастыруға оның есептік жазба кілтімен қол қояды.
- Алиас өкілеттігі. Орындаушы келісімшарттың нақты алиасы немесе оның ата ауқымы үшін `CanManageAccountAlias` талап етеді: `name::domain.dataspace` үшін иелік ететін домен, ал `name::dataspace` үшін деректер кеңістігі. Тіркелген есептік жазбаларға кодты тіркеудің бөлек рұқсаты қажет емес, ал қорғалған атаулар кеңістіктері желінің басқару жұмыс процесін де талап етеді. Мысалдар `cookbook_tuple::universal` пайдаланады; Taira-да оны өзіңізге тиесілі доменнің алиасымен ауыстырыңыз немесе генезисі алиас ауқымын беретін жасалған жергілікті желіде орналастырыңыз.

```bash
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
test -f "$IROHA_CONFIG"
```

## Қадамдар {#steps}

### 1. Белгілі бір дұрыс Kotodama V1 келісімді көшіру {#_1-copy-a-known-good-kotodama-v1-contract}

Тұрақты Iroha касса ішіндегі жұмысты орындап, компилятордың кортежді қайтару үлгісін көшіріңіз, осылайша бастапқы код пен құралдар жиынтығы бір протокол аяқталуында қалады.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

Толық бастапқы код шағын: бір жеке көмекші `fn` және кез келген шақырушыға айқын рұқсат беретін бір жалпыға ашық, тек оқуға арналған `view fn`:

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

Kotodama Iroha Виртуалды Машинасына және оның ағымдағы ABI бағыталған. Бұл WASM немесе EVM бастапқы тілі емес.

### 2. Артефактіні тексеру, құру және растау {#_2-check-build-and-verify-the-artifact}

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

Бірінші жинақ артефакт пен аутентификацияланған қосалқы контейнерлерді жариялайды. Екінші жинақ тек оқуға арналған `--verify` режимінде жұмыс істейді және кез келген бар шығару ағымдағы көзбен дәл сәйкес келмесе, сәтсіздікке ұшырайды. `.to` файлын және оның техникалық манифесін бір қаралған жинақ шығару ретінде қарастырыңыз.

### 3. Байткодты жергілікті орындау {#_3-run-the-bytecode-locally}

`compute` — жалпыға ашық, тек оқуға арналған `view fn`. Оны `debug-view` арқылы іске қосыңыз: ол компиляцияланған байткодты транзакция жібермей және оған ақы төлемей, міндетті емес сынақ деректерімен жергілікті түрде орындайды.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-view \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-view.json
```

Kotodama бүтін сандар JSON жолдар ретінде көрсетіледі, сондықтан декодталған кортеж `["3", "5"]` болып табылады.

### 4. Тексерілген артефактті Musubi арқылы орналастыру {#_4-deploy-the-verified-artifact-with-musubi}

`iroha contract` келісімшарттарды тексереді, олардың view функцияларын іске қосады және жөндейді, бірақ оларды орналастырмайды, сондықтан Taira-дағы орналастырулар Musubi арқылы орындалады. Оның орналастыру қызметі байткод бөліктерін жүктеп салады, тексерілген манифестті тіркейді және бір `CommitContractDeployment` операциясын жібереді. Ол әр транзакция үшін ақы бағасын алады, таңдалған төлеушіні, демеуші нұсқасын немесе газ шегін өзгертетін бағадан бас тартады және алдын ала құрастырылған артефактті құлыпталған пакет жинағы оның код және ABI хэштерін қайта шығарғаннан кейін ғана орналастырады. Kagami басқаратын жергілікті желіде оның орнына `kagami contract deploy` `./build/tuple_return_demo.to` файлын `--alias cookbook_tuple::universal --json` арқылы орналастырады; оның түбіртегі `.receipt` астында, ал `kagami context show` `IROHA_CONFIG` ретінде пайдаланылатын клиент конфигурациясын басып шығарады.

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

Байланыс `--fee-payer authority` пайдаланады; Musubi қол қоюдан бұрын Taira ақы активіндегі нақты ақы бағасын алады. Қайтарылған есептен шығарылатын активті faucet-тің ағымдағы саясаты жариялайтын активпен салыстырыңыз. Келісімшарт шақырулары ақы таңдауын тек типтелген ағымдағы баға арқылы қабылдайды; `gas_asset_id` транзакция метадеректері бірінші шығарылымның келісімшартына кірмейді.

### 5. Орналастырылған view функциясын оқу {#_5-read-the-deployed-view}

`contract view` тек оқуға арналған кіру нүктесін Torii-де транзакциясыз және ақысыз орындайды. View функциясының транзакциялық пішіні жоқ: Torii өзінің шақыру маршруттарында view селекторын қабылдамайды.

```bash
iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-view.json
```

## Растау {#verify}

Алиасты шешіңіз, Torii орналастырылған view үшін хабарлайтын код хэші бойынша тізбектегі манифестті алыңыз және сол view функциясын канондық мекенжай арқылы іске қосыңыз:

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

Орналастыру түбіртегі сақталған артефактті тексерілген деп көрсеткенде, алиас қайтарылған мекенжайға шешілгенде, манифест сол код хэші бойынша оқылғанда және жергілікті әрі Torii view функциялары `["3", "5"]` қайтарғанда ғана орналастыру аяқталған болып саналады.

## Ақауларды жою {#troubleshooting}

- `deployment authority lacks CanManageAccountAlias` немесе орындаушының `authority is not permitted to manage contract alias` қатесі есептік жазба бұл алиасты байланыстыра алмайтынын білдіреді. Өзіңізге тиесілі домендегі алиасты пайдаланыңыз немесе сол ауқымның иесінен нақты алиас рұқсатын не оның домені немесе деректер кеңістігі рұқсатын алыңыз; жергілікті желіде оны генезисте беріңіз.
- Қорғалған атаулар кеңістігіне байланысты бас тарту алиастың атаулар кеңістігі басқару арқылы реттелетінін білдіреді. Мақұлдаушы есептік жазбалардың ID-лерін тізу мақұлдаудың дәлелі емес; сол атаулар кеңістігі үшін желінің басқару жұмыс процесін (`iroha app gov deploy propose`) пайдаланыңыз немесе одан тыс алиасты таңдаңыз.
- Манифест немесе ABI сәйкессіздігі байткод, манифест және түйіннің орындау ортасы бір артефактті сипаттамайтынын білдіреді. Бекітілген бастапқы код нұсқасында қайта құрастырыңыз, содан кейін құрастыруды `--verify` арқылы қайта іске қосыңыз.
- `fee quote changed ... gas bound` дегеніміз сұралған жазбаша ниет пен нақты баға сәйкес келмейді дегенді білдіреді. Қол қойылған транзакцияны өзгертудің орнына қайта тексеруді орындаңыз.
- Үзілген орналастыру өзінің қол қойылған жоспарын журналда сақтайды. Жаңа жоспарға қол қоюдың орнына оны `musubi deploy --resume <JOURNAL>` арқылы қалпына келтіріңіз.
- `is read-only and cannot be invoked as a transaction` немесе `is not a kotoage or lifecycle entrypoint` `compute` шақыру командасына жіберілгенін білдіреді. Бұл үлгі `view fn` жариялайды, сондықтан жергілікті түрде `debug-view`, ал Torii-де `view` пайдаланыңыз.
- шарттама шақыруларына оң типтелген транзакцияны орындау шығыны шегі қажет. Бірінші шығарылымдағы техникалық шақыру шарты жоғарғы деңгейдегі транзакцияны орындау шығыны немесе төлем активінің метадеректерін қабылдамайды.

## Дереккөз және қатысты құжаттар {#source-and-related-docs}

- [Бекітілген бастапқы код нұсқасындағы Kotodama V1 командасының іске асырылуы](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_toolchain/src/bin/koto.rs)
- [Тұрақты бастапқы код нұсқасындағы кортежді қайтаратын бастапқы мысал](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- Бекітілген бастапқы код нұсқасындағы [Musubi орналастыру командасы](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/musubi/src/command_deploy.rs) және [келісімшарттарды орналастырудың төл қызметі](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_contract_deploy/src/lib.rs)
- [Тұрақты бағдарламалық код нұсқасындағы келісім-шарт интеграциялық тестілері](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/contracts.rs)
- [Ақылды келісімшарттар](/kk/blockchain/smart-contracts.md)
- [CLI сілтеме](/kk/get-started/operate-iroha-via-cli.md)
