---
translation_locale: kk
translation_source: /blockchain/instructions.md
translation_source_hash: ade5ba2b693de7e798490be0947099d0306d9565b88550e201dccd181810fb18
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha Нұсқаулық операциялары {#iroha-special-instructions}

Біз [Iroha қалай жұмыс істейді](/kk/blockchain/iroha-explained) туралы сөйлескенде, Iroha Нұсқаулық операциялары әлем күйін өзгертуге мүмкіндік беретін жалғыз әдіс екенін айттық. Сонымен, қандай нұсқаулық бізде қандай операциялар бар? Егер сіз осы оқулықтағы тілге арналған нұсқаулықтарды оқыған болсаңыз, сіз бірнеше нұсқауларды уже көріп қойдыңыз: `Register<Account>` және `Mint<Numeric>`.

Мынау Iroha нұсқаулық операцияларының толық тізімі:

|Нұсқаулық|Сипаттамалар|
| --------------------------------------------------------- | ------------------------------------------------ |
| [Тіркелу/Тіркелуден шығу](#un-register)                       |Блокчейндегі жаңа тіршілікке идентификатор беріңіз.|
| [Mint/Burn](#mint-burn)                                   |Сандық активтерді шығару/жою немесе қайталануларды іске қосу.|
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |Блокчейн объектісінің метадеректерін жаңарту.|
| [SetParameter](#setparameter)                             |Тізбек бойынша параметрді орнатыңыз.|
| [Grant/Revoke](#grant-revoke)                             |Рұқсаттар мен рөлдерді беріңіз немесе алыңыз.|
| [Көшіру](#transfer)                                     |Меншік құқығын немесе актив құнын аудару.|
| [Туған жердегі эскроу және активтерді бұғаттау](#native-escrow-and-asset-locks) |Сандық активтерді протокол қорғауында құлыптаңыз.|
| [Атомдық жеке қаржылық транзакцияны есептеу](#atomic-private-settlement)   |Құпия хаттама деректер топтары мен атомдық пакеттерді басқару.|
| [ExecuteTrigger](#executetrigger)                         |Триггерлерді орындау.|
| [Log/Custom/Upgrade](#other-instructions)                 |Бағдарламалық қамтамасыз етуді орындау ортасының мінез-құлқын журналдау, кеңейту немесе жаңарту.|

Келіңіздер, Iroha Нұсқаулық операцияларының қысқаша мазмұнынан бастайық; әр нұсқаулықтың қандай объектілерге шақырылуы мүмкін екенін және әр объект үшін қандай нұсқаулар бар екенін қарайық.

## Қысқаша мазмұны {#summary}

Әр нұсқаудың өзінде бұл нұсқауды қолдануға болатын объектілердің тізімі бар. Мысалы, тасымалдау нұсқалары иеленуге болатын блокчейн тізілім объектілерін және сандық активтерді қамтиды, ал шығару сандық активтерді және триггерлік қайталануларды қамтиды.

Кейбір нұсқауларда тағайындалатын жер көрсетілуі қажет. Мысалы, егер сіз активтерді аударсаңыз, сіз әрқашан оларды қай есептік жазбаға аударып жатқаныңызды көрсетуіңіз керек. Екінші жағынан, бірдеңені тіркегенде, сізге тек тіркегіңіз келетін объект қажет.

|Нұсқаулық|Заттар|Мақсат|
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias)                               |қалыпты домен, деректер кеңістігі алауы және есептік жазба алауы баптауы|                      |
| [Тіркелу/Тіркелуден шығу](#un-register)                       |шоттар, активтердің анықтамалары, NFTs, рөлдер, триггерлер, желідегі әріптестер; доменді жою|                      |
| [Mint/Burn](#mint-burn)                                   |сандық активтер, қайталануларды тудыру|шоттар немесе триггерлер|
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | [метадеректер](./metadata.md) бар объектілер: домендер, аккаунттар, актив анықтамалары, NFTs, RWAs, триггерлер |                      |
| [SetParameter](#setparameter)                             |тізбек параметрлері|                      |
| [Grant/Revoke](#grant-revoke)                             | [рөлдер, рұқсат белгілері](/kk/blockchain/permissions.md)                                                  |есепшоттар немесе рөлдер|
| [Көшіру](#transfer)                                     |домендер, активтердің анықтамалары, сандық активтер, NFTs|есептік жазбалар|
| [Туған жердегі эскроу және активтерді бұғаттау](#native-escrow-and-asset-locks) |сандық актив тіркеулері, актив құлыптары, анонимді тіркеу криптографиялық міндеттемелерінің мәндері|сатып алушылар, бағыттар немесе дауды бөлу|
| [Атомдық жеке қаржылық транзакцияны есептеу](#atomic-private-settlement)   |жолға арналған құпия протокол деректер топтары, саясатты ауыстырулар, аяқталған бандлдар және тоқтату маркерлері|                      |
| [ExecuteTrigger](#executetrigger)                         |триггерлер|                      |
| [Log/Custom/Upgrade](#other-instructions)                 |журналдар, орындаушыға тән жүктемелер, орындаушыны жаңарту|                      |

ISI мәселесіне қараудың тағы бір жолы бар, олар әсер ететін блокчейн тізім нысаны тұрғысынан:

|Мақсат|Нұсқаулар|
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|Аккаунт|тіркелгілерді тіркеу/тіркеуден шығару, активтерді қабылдау, тіркелгі метадеректерін жаңарту, рұқсаттар мен рөлдерді беру/қайтару|
|Домен|доменді орнатуды қамтамасыз ету, домендерді тіркеуден шығару, доменнің меншік құқығын беру, домен метадеректерін жаңарту|
|Активтің анықтамасы|анықтамаларды тіркеу/тіркеуден шығару, меншік құқығын беру, метадеректерді жаңарту|
|Актив|сандық мөлшерді шығару/жою, сандық мөлшерді жіберу|
|Эскроу|ашу, қабылдау, төлем жіберілді деп белгілеу, шығару, болдырмау, дау тудыру, шешу, қаражат шығару немесе жергілікті қорғау жазбаларының мерзімі өту|
| NFT              |тіркеу/тіркеуден шығару NFTs, меншік құқықтарын беру, метадеректерді жаңарту|
| RWA              |көптеген тіркеу, санын аудару, ұстау/жарыту, тоңдыру/тонтамау, қайта алу, біріктіру, метадеректер мен бақылауларды жаңарту|
|Триггер|тіркелу/тіркелуден шығу, шығару/жойу триггерінің қайталануы, триггерді орындау, триггердің метадеректерін жаңарту|
|Әлем|желілік әріптестер мен рөлдерді тіркеу/тіркеуден шығару, параметрлерді орнату, орындаушыны жаңарту|

## CLI Мысалдар {#cli-examples}

Бұл беттегі мысалдар сіздің жоғарыдан Iroha жұмыс кеңістігінен командаларды әдепкі жергілікті клиент конфигурациясына қарсы іске қосатыныңызды болжайды:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

Егер сіз `iroha` бинарлы файлын орнатқан болсаңыз, оның орнына `iroha --config ./defaults/client.toml` пайдаланыңыз. Төмендегі орынбасарларды желі мәндерімен ауыстырыңыз:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

Қоғамдық Taira тест желісін нысанаға алғанда, Taira клиент конфигурациясын қолданыңыз. Төлемді мысалдарды іске қоспас бұрын, [Taira сайтынан XOR тест желісін алыңыз](/kk/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)-ден тест желісін қаржыландыру қызметінің көмекшісін `taira_faucet_claim.py` ретінде сақтап, содан кейін тест желісінің қаржыландыру қызметінен тест желісінің XOR-ін талап етіңіз:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Тестнет қаражатымен қаржыландырылған актив көрінгеннен кейін, жазу транзакцияларына қажетті транзакцияны орындау құны активінің метадеректерін қосыңыз:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` домендер мен олардың SNS жалға алу мерзімдерін жасау үшін қолданылатын кәдімгі алғашқы шығару жолы болып табылады. Бұл дәл деректер кеңістігін, меншік иесін, жалға алу мерзімін декларативті түрде байланыстырады, және ақы-бақылау құралы, содан кейін барлық қажетті күйді атомдық түрде жасайды немесе жөндейді. Расталған `POST /v1/aliases/setup/plan` API соңғы нүктені немесе сәйкес CLI жұмыс ағынын пайдаланыңыз:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

Мақсат пен жоспар құпиясыз, бірақ қолдану кезеңі орнатылған есептік жазбамен кәдімгі транзакцияны белгілеп, жібереді. Жоспар өз тізбегіне, рұқсат ету негізіне, тірі күйдегі тірекке және мерзімге байланысты; бір жоспарды басқа желіде қайта пайдаланбаңыз.

## (Тіркеу / Тіркелмеу) {#un-register}

Тіркеу және тіркелуден шығару — блокчейнде жаңа нысанға идентификатор беруге арналған нұсқаулар.

Тіркелуі мүмкін барлық нәрсе бір уақытта `Registrable` және `Identifiable`, бірақ `Identifiable` болған барлық нәрсе `Registrable` емес. Көптеген нәрселер тікелей тіркеледі, бірақ кейбір жағдайларда блокчейндегі көрсетілімде айтарлықтай көп мәлімет болады. Қауіпсіздік пен өнімділік себептеріне байланысты, біз мұндай деректер құрылымдары үшін құрастырушыларды қолданамыз (мысалы, `NewAccount`), ал желі серіктестерін тіркеу үшін арнайы иеленуді дәлелдеудің нұсқаулығы бар. Ереже бойынша, тіркелуі мүмкін нәрсенің бәрін де тіркеуден шығаруға болады, бірақ бұл қатал ереже емес.

Сіз тіркелгілерді, активтердің анықтамаларын, NFTs, желі қатысушыларын, рөлдерді және триггерлерді тіркей аласыз. Доменді баптау `EnsureAlias` пайдаланады; шикі `Register::Domain` жүктемесі үшін бөлінген genesis/bootstrap. желілік түйіннің тіркелуі желілік түйін кілтіне иелік ету дәлелі бар `RegisterPeerWithPop` қолданады. Субъектінің аттарына қойылған шектеулер туралы білу үшін біздің [атау дәстүрлері](/kk/reference/naming.md) тексеріңіз.

RWA партиялар арнайы `RegisterRwa` нұсқаулығы арқылы жасалады. Қазіргі код `UnregisterRwa` нұсқаулығын көрсетпейді; көрсетілген мөлшерді тоқтату үшін `RedeemRwa` пайдаланыңыз.

::: info

Ескеріңіз, сіз `genesis.json`-да өз [блокчейннің алғашқы блогы](/kk/guide/configure/genesis.md)-іңізді қалай орнататыныңызға байланысты (әсіресе рұқсат белгілерін тіркеуді қосатыныңыз немесе қоспайтыныңызды ескерсек), есептік жазбаны тіркеу процесі өте өзгеше болуы мүмкін. Жалпы, біз оны былай қысқаша айта аламыз:

- Қоғамдық блокчейнде кез келген адам есептік жазба ашуы керек.
- Жеке блокчейнде есептік жазбаларды тіркеудің бірегей процесі болуы мүмкін. Кәдімгі жеке блокчейнде, яғни есептік жазбаларды тіркеудің ешбір бірегей процесі жоқ блокчейнде, басқа есептік жазбаны тіркеу үшін есептік жазба қажет.

Біз осы айырмашылықтарды өте егжей-тегжейлі талқылаймыз, когда біз [жеке және қоғамдық блокчейндерді салыстыру](/kk/guide/configure/modes.md).

:::

::: info

Желі туысын тіркеу қазіргі уақытта бастапқыда сенім тігілген желі туыс жиынына кірмеген желі туыстарын желіге қосудың жалғыз жолы болып табылады.

:::

Блокчейн объектілерін тіркеу үшін тілге сәйкес нұсқаулықты пайдаланыңыз:

|Тіл|Нұсқаулық|
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| CLI                   |Домендерді орнату және аккаунттар мен активтерді тіркеу үшін [Iroha CLI](/kk/get-started/operate-iroha-via-cli.md) пайдаланыңыз.|
| Rust                  | [Rust оқулық](/kk/guide/tutorials/rust.md) пайдаланыңыз.|
| Kotlin/Java           | [Kotlin/Java](/kk/guide/tutorials/kotlin-java.md) пайдаланыңыз. |
| Python                | [Python оқулық](/kk/guide/tutorials/python.md) пайдаланыңыз.|
| JavaScript/TypeScript | [JavaScript/TypeScript](/kk/guide/tutorials/javascript.md) пайдаланыңыз. |

Қалыпты доменді орнатуды жоспарлап, қолданғаннан кейін доменді қажет болмай қалған жағдайда тіркелімнен шығарыңыз:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain unregister --id docs.universal
```

Есептік жазбаларды тіркеу және тіркеуден шығару:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

Актив анықтамаларын тіркеу және тіркеуден шығару:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition register \
  --id "$ASSET_DEF" \
  --name docs_token \
  --alias docs_token#docs.universal \
  --scale 0

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition unregister --id "$ASSET_DEF"
```

NFTs тіркеу және тіркеуден шығару. NFT тіркеу оның мазмұнын JSON стандартты енгізуден оқиды:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

Рөлдерді тіркеу және тіркеуден шығару:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

Триггерлерді тіркеу және тіркеуден шығару. Триггерді тіркеу үшін компиляцияланған IVM байт-коды немесе сериализацияланған нұсқаулар тізімі қажет. Бұл мысалда CLI көмегімен `Log` нұсқасы жасалып, оны триггерді тіркеуге бағыттайды:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml -o \
  ledger transaction ping --log-level INFO --msg "hourly cleanup" |
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger register --id hourly_cleanup \
  --instructions-stdin \
  --filter time \
  --time-start 5m \
  --time-period-ms 3600000

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger unregister --id hourly_cleanup
```

Желілік әріптестерді тіркеу және тіркеуден шығару. Егер сізде олар болмаса, BLS кілтін және PoP `kagami` арқылы жасап шығыңыз:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./peer-key
PEER_KEY=$(tr -d '\n' < ./peer-key/public.key)
PEER_POP=$(tr -d '\n' < ./peer-key/pop.hex)

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## Созу/Жою {#mint-burn}

шығару және жою дегеніміз цифрлық активтерге және шектеулі қайталауларымен триггерлерге қатысты болуы мүмкін. Кейбір активтер қайта шығарылмайтын деп жариялануы мүмкін, бұл олардың тіркелгеннен кейін тек бір рет шығарыла алатынын білдіреді.

Активтер арнайы есепшотқа шығарылады, әдетте активті алғаш рет тіркеген есепшотқа. Активтердің мөлшері теріс болмайды, сондықтан сіз ешқашан активтің `$-1.0` мөлшерін ала алмайсыз немесе теріс мөлшерін жойып, шығару жасай алмайсыз.

Блокчейн активтерін шығару үшін тілге арнайы нұсқаулықты пайдаланыңыз:

- [CLI](/kk/get-started/operate-iroha-via-cli.md)
- [Rust](/kk/guide/tutorials/rust.md)
- [Kotlin/Java](/kk/guide/tutorials/kotlin-java.md)
- [Python](/kk/guide/tutorials/python.md)
- [JavaScript/TypeScript](/kk/guide/tutorials/javascript.md)

Міне, мүлікті жою мысалдары:

- [CLI](/kk/get-started/operate-iroha-via-cli.md)
- [Rust](/kk/guide/tutorials/rust.md)

сандық активтерді шығару және жою:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset mint \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 100

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset burn \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 10
```

мәселені шығару және триггер қайталануларын жою:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## Көшіру {#transfer}

Аударымдар меншікті немесе құндылықты есепшоттар арасында ауыстырады. Жалпы аударым нұсқалары домендерді, активтердің анықтамаларын, сандық активтерді және NFTs қамтиды. RWA мөлшерін қозғалтуды [Шынайы дүниедегі активтер](/kk/blockchain/rwas.md)-де сипатталған арнайы `TransferRwa` және `ForceTransferRwa` нұсқауларын қолдану арқылы жүзеге асыруға болады.

Оны істеу үшін есептік жазбаға [активтерді аударуға рұқсат](/kk/reference/permissions.md) рұқсат берілуі қажет. Активтерді [CLI](/kk/get-started/operate-iroha-via-cli.md) немесе [Rust](/kk/guide/tutorials/rust.md) арқылы қалай аударуға болатыны туралы мысалға қараңыз.

Сандық активтерді аудару:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

Доменді, мүліктің анықтамасын және NFT меншік құқықтарын беру:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Туынды эскроу және активтерді бұғаттау {#native-escrow-and-asset-locks}

Туған жердегі эскроу нұсқаулары сандық активтерді блокчейн тізілім протоколы арқылы басқарылатын қорғауда құлыптайды. Оларды нарықтағы қаржылық транзакцияларды есеп айырысу, жалпы активтерді құлыптау және анонимді қорғалған эскроу ағындары үшін қолданады.

Нарықтағы эскроу `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute` және `ResolveEscrowDispute` пайдаланады. Жалпы мүлік құлыптары `OpenAssetLock`, `DrawdownAssetLock` пайдаланады. `CancelAssetLock` және `ExpireAssetLock`. Анонимді эскроу нарықтық өмірлік циклді `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute` және `ResolveAnonymousEscrowDispute` арқылы бейнелейді.

Осы ISIs қазіргі уақытта бірінші дәрежелі CLI командалары жоқ. Типтелген SDK құрылысушыларды немесе сериализацияланған нұсқау жүктемелерін пайдаланыңыз және өмірлік циклінің егжей-тегжейі, рұқсаттар, сұраулар, оқиғалар және Rust мысалдары үшін [Туынды активтерді сенімхатта сақтау](/kk/blockchain/escrow.md)-ге қараңыз.

## Атомдық жеке қаржылық транзакцияны есептеу {#atomic-private-settlement}

Басқарылатын атомдық-жеке-шаруашылық нұсқаулық отбасы мөлдір Native AMX-тен бөлек. `ActivatePrivateSettlementPoolV1` жасырылған басқару проекциясынан және бір протокол-стандартты түпнұсқа криптографиялық міндеттемелер мәндерінен маршрутқа арналған құпия протокол деректер тобының біреуін орнатады. `FinalizeAtomicPrivateSettlementV1` бір толық комитет бекіткен пакетті атомдық түрде қолданады, ал `AbortAtomicPrivateSettlementV1` тек демеуші рұқсат еткен жария терминал маркерін жариялайды.

`RotatePrivateSettlementPoolPolicyV1` құпиялылық басқаруына шектелген. Ол дәл қазіргі басқару криптографиялық дайджест мәнін талап етеді, маршрутты, протокол деректер тобы, активке байланған криптографиялық міндеттеме мәнін, күй шекарасын, қайта ойнау жиындарын және аяқталған протокол нәтижесі жазбаларын сақтайды, қоғамдық түзетуді бірке арттыра отырып, жаңа аудитор кілтінің кезеңін пайдаланады. Айналдыру оның қосылу биіктігінде іске қосылады және сол маршру/пул үшін протокол нәтижесі жазбасымен сол биіктікті бөлісе алмайды. Қоғамдық түзету тегі протокол нәтижелерін қайта бастау ротациясына дейінгі жазбаларды бекітілген және дәл-қайталау идемпотент түрде сақтайды; ағымдағы ескі саясат жинақтары жабық күйде сәтсіз болады. Операторлар сақталған капсулалар үшін ескі шифрлау кілттерін сақтау немесе оларды жоймас бұрын капсула қайта орауды басқару және тексеруі керек.

Жол әдепкі бойынша өшірілген күйде қалады және өндірісте қолдануға жарамды емес. Конфигурация, уәкілетті субъект, аудит, қалпына келтіру және шығарылым талаптары үшін [Атомдық жеке кросс-деректер кеңістігінде қаржылық транзакцияларды есептеу жүргізу](/kk/get-started/atomic-private-settlement) қараңыз.

## Берү/Алу {#grant-revoke}

Өтініштерді беру және қайтару [рұқсаттар мен рөлдер](permissions.md) есепшотына арналған.

`Grant` пайдаланушыға бір рұқсатты немесе рұқсаттар тобын («рөл») тұрақты түрде беруге қолданылады. Берілген рөлдер мен рұқсаттарды тек `Revoke` нұсқаулығы арқылы ғана алып тастауға болады. Сондықтан бұл нұсқауларды мұқият қолдану қажет.

Есептік жазбада рөлді беру және қайтару:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

Рұқсат токендерін беру және алып тастау. Рұқсат командалары стандартты енгізуден рұқсат объектісін оқиды:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

Рөлге рұқсаттарды беру және болдырмау:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

Бұл нұсқаулар объектіні [метадеректер](/kk/blockchain/metadata.md) жаңартады. Метадеректер жазбасын енгізу немесе ауыстыру үшін `SetKeyValue` пайдаланыңыз және біреуін жою үшін `RemoveKeyValue` пайдаланыңыз.

Метадеректер `set` командалары стандартты енгізуден JSON мәнін оқиды:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

Сол үлгі есеп-шоттар, актив анықтамалары, NFTs, RWAs және триггерлер үшін қол жетімді:

```bash
printf '{"display_name":"Alice"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account meta set --id "$ALICE" --key profile

printf '{"issuer":"docs"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition meta set --id "$ASSET_DEF" --key issuer

printf '{"color":"blue"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft meta set --id 'badge$docs.universal' --key traits

printf '{"owner":"ops"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger meta set --id hourly_cleanup --key owner
```

## `SetParameter` {#setparameter}

`SetParameter` белсенді деректер моделі мен орындаушысы арқылы көрсетілетін барлық тізбек деңгейіндегі параметрлерді өзгертеді.

Параметрді стандартты енгізуде бір параметр JSON объектісін жіберу арқылы орнатыңыз:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

Бұл нұсқау [қоздырғыштар](./triggers.md) орындау үшін қолданылады.

CLI триггерлерді тіркей алады және триггер орындалу оқиғаларына тікелей жазыла алады. Ол типтелген `execute trigger` команданы бермейді, сол себепті жіберу үшін қолмен `ExecuteTrigger` нұсқаулық, сериялық `InstructionBox` өндіру SDK немесе орындаушы құралымен және алынған JSON массивін `ledger transaction stdin` арқылы өткізу:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## Басқа нұсқаулар {#other-instructions}

Iroha сонымен қатар бағдарламалық қамтамасыз ету орындау ортасы мен орындаушыны біріктіру үшін төмен деңгейдегі нұсқауларды ашады:

- `Log`: орындау кезінде журнал жазбасын жіберу
- `CustomInstruction`: орындаушыға тән JSON жүктемелерді тасымалдау
- `Upgrade`: атқарушы жаңартуын қосу

Пинг көмекшісімен `Log` нұсқауын жіберіңіз:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

Сериализацияланған `InstructionBox` ретінде тапсырыс беруші орындаушы нұсқауын жіберіңіз. Payload формасы орындаушыға тән, сондықтан нұсқауды сәйкес SDK немесе орындаушы құралдарымен жасаңыз:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

Атқарушыны жинақталған IVM байткод файлынан жаңартыңыз:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
