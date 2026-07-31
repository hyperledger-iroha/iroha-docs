---
translation_locale: kk
translation_source: /blockchain/instructions.md
translation_source_hash: 3251078b2b2268ff78563c02a0f935c63dc0569f0b6d38071150cbb4b89394d6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Арнайы нұсқаулар {#iroha-special-instructions}

Біз туралы сөйлескенде [қалай Iroha жұмыс істейді](/kk/blockchain/iroha-explained), Біз мұны айттык Iroha Бізде қандай арнайы нұсқаулар бар? Егер сіз осы оқу-әдістемедегі тілдік нұсқамаларды оқыған болсаңыз, онда бірнеше нұсқаулықты көрдіңіз. `Register<Account>` және `Mint<Numeric>`.

Iroha арнайы нұсқаулардың толық тізбесі:

|Нұсқаулық |Түсініктемелер |
| --------------------------------------------------------- | ------------------------------------------------ |
| [Тіркеу/Тіркеуден шығару](#un-register) |Блокчейндегі жаңа субъектіге ID беріңіз. |
| [Mint/Burn](#mint-burn) |Mint/burn сандық активтер немесе қайталауды іске қосу. |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |Блокчейн объектінің метамәдени деректерін жаңарту. |
| [SetParameter](#setparameter) |Желілік диапазонды орнату. |
| [Grant/Revoke](#grant-revoke) |Ролдар мен рұқсаттарды беру немесе алып тастау.|
| [Алу](#transfer) |Меншік иелігін немесе активтердің құнын ауыстыру. |
| [Жергiлiктi депозиттер мен активтер құптары](#native-escrow-and-asset-locks) |Цифрлық активтерді протоколдық күтімге алу. |
| [ExecuteTrigger](#executetrigger) |Қозғалтқыштарды орындаңыз. |
| [Журнал/Сарттылық/Жаңарту ](#other-instructions) |Оқу уақытын тіркеңіз, ұзартыңыз немесе жаңартыңыз. |

Iroha Арнайы нұсқаулықтардың жиынтығымен бастайық; әрбір нұсқаулық қандай нысандарға шақырылуы мүмкін және әр объект үшін қандай нұсқаулар қолжетімді.

## Жиналысы {#summary}

Әрбір нұсқаулық үшін осы нұсқаулықты орындауға болатын объектілердің тізімі бар. Мысалы, трансфер варианттары иеленуші бухгалтерлік кітапша нысандары мен сандық активтерді қамтиды, ал митинг сандық активті және қайталануларды бастайды.

Кейбір нұсқаулар мақсатты белгілеуді талап етеді. Мысалы, егер сіз активтерді аударатын болсаңыз, оны қай тіркелгіге аударып жатқаныңызды әрдайым анықтауыңыз керек.

|Нұсқаулық |Нысандар |Мақсаты |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias) |Әдеттегі домендер, деректер кеңістігінің атаулары және есептік жазбалардың атаулары |                      |
| [Тіркеу/Тіркеуден шығару](#un-register) |есеп айырысу, активтердің анықтамасы, NFTs, рөлдер, қозғалтқыштар, теңгерімдері; домендерді шығару |                      |
| [Mint/Burn](#mint-burn) |сандық активтер, қайталануларды іске қосу |есептер немесе триггерлер |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | объектілері [метадеректер](./metadata.md): домендер, шоттар, активтер анықтамасы, NFTs, RWAs, қозғалтқыштар |                      |
| [SetParameter](#setparameter) |тізбек параметрлері |                      |
| [Grant/Revoke](#grant-revoke) | [рөлдер, рұқсат белгілері](/kk/blockchain/permissions.md) |есептері немесе рөлдері |
| [Алу](#transfer) |Домендер, активтердің анықтамасы, сандық активтер, NFTs |есеп айырысу |
| [Жергiлiктi депозиттер мен активтер құптары](#native-escrow-and-asset-locks) |сандық активтер кепілдендірілуі, активтердің жабылуы, анонимдік кепілдендірілген міндеттемелері |сатып алушылар, мақсаттар немесе даулар бөлінісі |
| [ExecuteTrigger](#executetrigger) |триггерлер |                      |
| [Журнал/Сарттылық/Жаңарту ](#other-instructions) |журналдары, орындаушыға тән пайдалы жүктемелер, орындаушыларды жаңарту |                      |

ISI дегенді қарастырудың басқа тәсілі де бар, олар қол жеткізген кітапша объектісі бойынша:

|Мақсат |Нұсқаулар |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|Есептілік|тіркелу/тіркеуден шығару шоттары, активтерді қабылдау, есептің метамәліметтерін жаңарту, рұқсат беру/қайтарып алу және рөлдер |
|Домен|доменді орнатуды қамтамасыз ету, домендерді тіркеуден шығару, домен иелігін ауыстыру, домен метамәдениетін жаңарту |
|Активтер анықтамасы |тіркелу/тіркеуден босату анықтамалары, меншік иелігін беру, метамәліметтерді жаңарту |
|Активтер|минда/жабын сандық мөлшері, көшірме сандық саны |
|Қабылдау |жіберілген төлемді ашу, қабылдау, таңбалау, босату, күшін жою, дауды шешу, шығару немесе жергiлiктi қорғаншылық тiзiмдерiн тоқтату |
|NFT |тіркелу/тіркеуден босату NFTs, меншікті беру, метамәдени мәліметтерді жаңарту |
|RWA |партияларды тіркеу, көшіру мөлшері, ұстау/кішірту, тоңазыту/тоңазытпау, сатып алу, біріктіру, метамәдени деректерді жаңарту және бақылау |
|Қозғалтқыш |тіркелу/тіркеуден шығару, минда / күйдіру триггерін қайталау, орындау триггері, жаңарту триггерінің метамәдени деректері |
|Әлем |тіркелу/тіркеуден шығару теңгерімдері мен рөлдері, параметрлерді орнату, орындаушыны жаңарту |

## CLI мысалдар {#cli-examples}

Бұл беттегі мысалдар сіз Iroha жұмыс кеңістігінен әдеттегі жергілікті клиент конфигурациясына қарсы командаларды орындайсыз деп болжайды:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

Егер сіз `iroha` бинарды орнатсаңыз, оның орнына `iroha --config ./defaults/client.toml` қолданыңыз. Төмендегі орын иеленушілерді желіңізден алынған мәндермен ауыстырыңыз:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

Қоғамды нысанаға алғанда Taira сынақ желісі, пайдалану Taira Клиенттің конфигурациясы. Төлемақы төлеген мысалдарды орындаудан бұрын , кранның көмекшісін [Тестнет алу XOR туралы Taira](/kk/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ретінде `taira_faucet_claim.py`, содан кейін талап ету сынақ желісі XOR краннан:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Фаннетпен қаржыландырылған актив көрініс тапқаннан кейін, транзакцияларды жазу үшін қажетті газ активтерінің метамәдени деректерін қоса беріңіз:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` - домендерді құруға және олардың SNS Ол нақты деректер кеңістігін, меншік иесін, жалға беру мерзімі мен цитата қорғауды бекітеді, содан кейін барлық қажетті күйді атомдық түрде жасайды немесе жөндейді. `POST /v1/aliases/setup/plan` аяқталу нүктесі немесе сәйкестендіру CLI жұмыс барысы:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

Мақсат пен жоспар құпиясыз, бірақ қадам белгілерін қолдану және конфигурацияланған шотпен әдеттегі транзакцияны тапсыру.

## (Бас) Тіркеу {#un-register}

Тіркеу және тіркеуден шығару - бұл блокчейндегі жаңа субъектіге ID беру үшін қолданылатын нұсқаулар.

Тіркелуге болатын барлық нәрсе - `Registrable` және `Identifiable`, бірақ бәрі де емес `Identifiable` болып табылады `Registrable`. Көптеген нәрселер тікелей тіркеледі, бірақ кейбір жағдайларда блокчейндегі бейнелеуде айтарлықтай көп деректер бар. Қауіпсіздік және өнімділік себептері үшін біз мұндай дерек құрылымдары үшін құрылысшыларды қолданамыз (мысалы: `NewAccount`), ал теңгерімдік тіркеуде иелікті дәлелдеу туралы арнайы нұсқау бар.

Сіз шоттарды тіркей аласыз, активтердің анықтамасы, NFTs, доменді орнату үшін қолданылатын `EnsureAlias`; шикізат `Register::Domain` Пайдалы жүктеме генезис/bootstrap үшін арналған. `RegisterPeerWithPop`, Құрамында теңгерім кілті бар екенін дәлелдейтін. [конгрестердің атаулары](/kk/reference/naming.md) субъектілердің атауларына енгізілген шектеулер туралы білу.

RWA бағышталған партиялар арқылы құрылады `RegisterRwa` Қолданыстағы кодта `UnregisterRwa` нұсқаулық; пайдалану `RedeemRwa` пенсияға шығарылған мөлшерде.

::: ақпарат

Қалай орнатуды шешсеңіз, [генезистік блок](/kk/guide/configure/genesis.md) ішінде `genesis.json` (атап айтқанда, рұқсат белгілерін тіркеуді қосасыз ба, жоқ па), шотты тіркеу процесі өте әртүрлі болуы мүмкін. Жалпы алғанда, біз оны былай қорытындылай аламыз:

- Қоғамдық блокчейнде кез-келген адам есептік жазбасын тіркей алады.
- Жеке блокчейнде шоттарды тіркеу үшін бірегей процесс болуы мүмкін. Әдетте жеке блокчейнда, яғни тіркелгілерді тіркеудің бірегей процестері жоқ блокчейнда басқа тіркелгіді тіркеу үшін сізге есеп қажет болады.

Біз [ жеке және мемлекеттік блокчейндерді салыстырғанда бұл айырмашылықтарды егжей-тегжейлі талқылаймыз ](/kk/guide/configure/modes.md).

:::

::: ақпарат

Қазіргі уақытта теңгерімді тіркеу - бұл желіге бастапқы сенімді теңгерімнің құрамына кірмеген теңгерімдерді қосудың жалғыз жолы.

:::

Тілге қатысты нұсқаулықтардың біреуін қараңыз, ол сізді блокчейндегі объектілерді тіркеу процесінен бастап шығарады:

|Тіл |Кітапшы |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI |Домендерді орнату және шоттар мен активтерді тіркеу үшін [Iroha CLI](/kk/get-started/operate-iroha-via-cli.md) [PH00000002] пайдалану. |
|Rust |[Rust оқу құралын қолданыңыз](/kk/guide/tutorials/rust.md). |
|Kotlin/Java |[Kotlin/Java оқушысы](/kk/guide/tutorials/kotlin-java.md) қолданылсын. |
|Python |[Python оқу құралын қолданыңыз](/kk/guide/tutorials/python.md). |
|JavaScript/TypeScript |[JavaScript/TypeScript оқу құралын пайдалану ](/kk/guide/tutorials/javascript.md).|

Әдеттегі доменді орнатуды жоспарлау және қолдану, содан кейін ол енді қажет болмаған кезде доменді тіркеуден шығару:

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

Тіркеу және тіркеуден шығару шоттары:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

Тіркелу және тіркеуден шығару активтерінің анықтамасы:

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

Тіркеу және тіркеуден шығару NFTs. NFT тіркеу оның мазмұнын оқиды JSON стандартты кірістен:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

Тіркеу және тіркеуден шығару функциялары:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

Тіркелу және тіркеуден шығару триггерлері. IVM Байткод немесе сериялы нұсқаулар тізімі. Бұл мысал `Log` нұсқаулық CLI және оны триггерлік тіркеуге өткізеді:

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

Тіркеу және тіркеуден шығару әріптестер. BLS кілті және PoP қосылған `kagami` егер сізде олар жоқ болса:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## Миндал/Борн {#mint-burn}

Өрлеу және өртеу сандық активтерді білдіреді және бірнеше рет қайталануы мүмкін. Кейбір активтер қайтарылмайтын деп жариялануы мүмкін, яғни олар тіркеуден кейін бір рет ғана шығарылуы мүмкін.

Активтер, әдетте, бастапқыда активті тіркеген шотқа жазылады. Активтердің мөлшері теріс емес, сондықтан сіз ешқашан `$-1.0` активке ие бола алмайсыз немесе теріс соманы күйрете алмайсыз және теріс ақша таба аласыз.

Тілге қатысты нұсқаулықтардың біреуін қараңыз, ол сізді блокчейндегі активтерді өндіру процесіне бастап шығарады:

- [CLI](/kk/get-started/operate-iroha-via-cli.md)
- [Rust](/kk/guide/tutorials/rust.md)
- [Kotlin/Java](/kk/guide/tutorials/kotlin-java.md)
- [Python](/kk/guide/tutorials/python.md)
- [JavaScript/TypeScript](/kk/guide/tutorials/javascript.md)

Мұнда қордың күйіп кетуі туралы мысалдар келтірілген:

- [CLI](/kk/get-started/operate-iroha-via-cli.md)
- [Rust](/kk/guide/tutorials/rust.md)

Нысандық активтер:

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

Mint және күйдіру триггерлік қайталаулар:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## Трансфер {#transfer}

Трансферлер шоттар арасында иелікті немесе құнды жылжытады. Жалпы трансфер варианттары домендерді, активтердің анықтамаларын, сандық активтерді және NFTs. RWA көлемді қозғалысы арнаулы `TransferRwa` және `ForceTransferRwa` көрсетілген нұсқаулар [Реалдық дүниедегі активтер](/kk/blockchain/rwas.md).

Бұл үшін есеп беру қажет [активтерді ауыстыруға рұқсат](/kk/reference/permissions.md). Активтерді аудару туралы мысал келтіріңіз: [CLI](/kk/get-started/operate-iroha-via-cli.md) немесе [Rust](/kk/guide/tutorials/rust.md).

Сандық активтерді аудару:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

Трансфер домені, активтің анықтамасы және NFT иелігі:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Жергiлiктi банктер мен активтер қапшығы {#native-escrow-and-asset-locks}

Туғандық ескроу нұсқаулары сандық активтерді бухгалтерлік кітапшамен басқарылатын протоколды күзетуде қаптайды. Олар нарық стилі бойынша есеп айырысу, жалпы активтер қаптау және анонимді қорғалған эскроу ағыны үшін қолданылады.

Базардағы депозит пайдалану `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, және `ResolveEscrowDispute`. Жалпы активтердің құлыптарын пайдалану `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, және `ExpireAssetLock`. Анонимдік кепілгерлік нарықтың өмір циклін бейнелейді `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, және `ResolveAnonymousEscrowDispute`.

Бұлар ISIs қазіргі кезде бірінші сыныпты маман жоқ CLI командалар. пайдалану түрлендіру SDK конструкторлар немесе сериалдық нұсқаулық пайдалы жүктер, және қара: [Жергiлiктi активтердi басқару](/kk/blockchain/escrow.md) Өмір циклі мәліметтері, рұқсаттары, сұраныстары, оқиғалары және Rust мысалдар.

## Грант / Қайтарып алу {#grant-revoke}

Жәрдемақыны беру және қайтару нұсқаулары есепке алынады [рұқсаттар мен рөлдер](permissions.md).

`Grant` пайдаланушыға бір ғана рұқсат немесе рұқсаттар тобы ("роль") тұрақты түрде беру үшін пайдаланылады. Берілген рөлдер мен рұқсаттарды тек `Revoke` нұсқаулығы арқылы алып тастауға болады.

Тіркелгідегі рөлді беру және қайтару:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

Рұқсат белгілерін беру және қайтару . Рұқсат командалары рұқсат объектісін стандартты кірістен оқиды:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

Рөлге рұқсат беру және қайтарып алу:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

Бұл нұсқаулықтар жаңарту объектісі [метадеректер](/kk/blockchain/metadata.md). Пайдалану `SetKeyValue` метамәдени деректерді енгізу немесе ауыстыру; және `RemoveKeyValue` бірін өшіру үшін.

Metadata `set` командасы стандартты кірістен JSON мәнін оқиды:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

Есепшоттар, активтер анықтамасы NFTs, RWAs үшін бірдей үлгі бар және триггерлер:

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

`SetParameter` белсенді дерек үлгісі мен орындаушы арқылы анықталған бүкіл тізбектік параметрлерді өзгертеді.

Стандартты кіріске бір параметрлі JSON нысанды өткізіп, параметрді орнату:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

Бұл нұсқаулық [ триггерлерін ](./triggers.md) орындау үшін қолданылады.

Қауымдастық CLI түрлендіргіштерді тіркей алады және тікелей іске қосу іс-шараларына жазылуы мүмкін. Бұл `execute trigger` командасы, сондықтан қолжетімді тапсыру `ExecuteTrigger` нұсқаулық, сериалдалған `InstructionBox` қашықтығы SDK немесе орындаушы құралы және нәтижелі өткізу JSON массив арқылы `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## Басқа нұсқаулықтар {#other-instructions}

Iroha сондай-ақ орындалу уақыты мен орындаушы интеграциясы бойынша төменгі деңгейдегі нұсқауларды көрсетеді:

- `Log`: орындау кезінде журналды жазуды шығару
- `CustomInstruction`: орындаушыға тән JSON пайдалы жүктерді тасымалдау
- `Upgrade`: орындаушыны жаңартуды қосу

Пинг көмекшісімен `Log` нұсқау беріңіз:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

Әдеттегі орындаушы нұсқаулығын сериялы `InstructionBox` ретінде тапсырыңыз. Пайдалық жүктеменің пішіні орындаушыға тән, сондықтан нұсқаулықты сәйкестендіруші SDK немесе орындаушы құралмен жасаңыз:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

IVM байткод файлынан орындаушыны жаңарту:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
