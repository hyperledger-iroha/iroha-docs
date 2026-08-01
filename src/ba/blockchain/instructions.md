---
translation_locale: ba
translation_source: /blockchain/instructions.md
translation_source_hash: adc3eff9758dd73e9114e78eaa18ddf6271db3bc4042611e1ed6ed1aac226246
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Махсус күрһәтмәләр {#iroha-special-instructions}

Беҙ һөйләшкәндә [нисек Iroha хәрәкәт итә](/ba/blockchain/iroha-explained), Беҙ шулай тинек. Iroha Махсус күрһәтмәләр - донъя дәүләтен үҙгәртеүҙең берҙән-бер юлы. ниндәй махсус инструкциялар бар? Әгәр һеҙ был дәреслектең телгә ҡағылышлы күрһәтмәләрен уҡыһағыҙ, һеҙ инде бер нисә күрһәтмә күрҙегеҙ: `Register<Account>` һәм `Mint<Numeric>`.

Iroha Махсус күрһәтмәләрҙең тулы исемлеге:

|Уҡытыу |Тасуирламалар |
| --------------------------------------------------------- | ------------------------------------------------ |
| [Регистр/Осрегистрация](#un-register) |Блокчейн буйынса яңы берәмеккә ID бир. |
| [Mint/Burn](#mint-burn) |Mint/burn һанлы активтар йәки ҡабатлауҙар ҡуҙғатыу. |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |Блокчейн объекттар метамәғлүмәттәрен яңыртыу. |
| [SetParameter](#setparameter) |Сылбыр киңлеге параметрын билдәләгеҙ. |
| [Grant/Revoke](#grant-revoke) |Ролдар һәм рөхсәт биреү йәки алып ташлау. |
| [Трансфер](#transfer) |Милек хоҡуғын йәки актив хаҡын күсереү. |
| [Һаҡлыҡ менән тәьмин итеү һәм активтарҙы һаҡлау](#native-escrow-and-asset-locks) |Протокол һаҡ аҫтында һанлы активтарҙы бикләгеҙ. |
| [ExecuteTrigger](#executetrigger) |Тэггерҙарҙы үтәгеҙ. |
| [Журнал/Ҡалыптар/Үҙгәртеү](#other-instructions) |Эш ваҡыты тәртибен теркәү, киңәйтеү йәки яңыртыу. |

Әйҙәгеҙ, Iroha Махсус күрһәтмәләрҙе йомғаҡлау менән башлайыҡ; ниндәй объекттар өсөн һәр инструкция саҡырыла ала һәм ниндәй күрһәтмәләр һәр объектҡа бирелә.

## Һүҙҙәре {#summary}

Һәр инструкция өсөн был инструкцияны башҡарыу мөмкин булған объекттар исемлеге бар. Мәҫәлән, күсереү варианттары үҙләштерелгән бухгалтер объекттарын һәм һанлы активтарҙы ҡаплай, ә митинг һанлы активтар һәм ҡабатланыуҙы ҡуҙғаталар.

Ҡайһы бер күрһәтмәләргә ярашлы, тәғәйенләнеш билдәләнергә тейеш. Мәҫәлән, әгәр һеҙ активтарҙы күсерәһегеҙ икән, һәр ваҡыт уларҙы ниндәй иҫәпкә күсереүегеҙҙе билдәләргә кәрәк. Икенсе яҡтан, һеҙ нимәнелер теркәгәндә, һеҙгә тейешле объект ҡына кәрәк.

|Уҡытыу |Объекттар |Маҡсаты |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias) |ябай домен, мәғлүмәттәр киңлеге-алянсы һәм иҫәп-хисап исемдәре ҡушымтаһы |                      |
| [Регистр/Осрегистрация](#un-register) |иҫәптәр, активтар билдәләмәләре, NFTs, ролдәр, ҡуҙғатҡыстар, тиҫтерҙәр; доменды алып ташлау |                      |
| [Mint/Burn](#mint-burn) |цифрлы активтар, ҡабатлауҙар ҡуҙғатыу |иҫәптәр йәки ҡуҙғатыу |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |[метамәғлүмәттәре булған объекттар](./metadata.md): домендар, иҫәптәр, актив билдәләмәләре, NFTs, RWAs, ҡуҙғатыусы |                      |
| [SetParameter](#setparameter) |сылбыр параметрҙары |                      |
| [Grant/Revoke](#grant-revoke) | [ролдәр, рөхсәт билдәләре](/ba/blockchain/permissions.md) |иҫәптәр йәки ролдәр |
| [Трансфер](#transfer) |домендар, активтар билдәләмәләре, һанлы активтар, NFTs |иҫәптәр |
| [Һаҡлыҡ менән тәьмин итеү һәм активтарҙы һаҡлау](#native-escrow-and-asset-locks) |һанлы активтар депозиты, активтарҙы ябыу, аноним конфиденциаль бурыстар |һатып алыусылар, йүнәлештәр йәки бәхәстәр бүленә |
| [ExecuteTrigger](#executetrigger) |триггерҙар |                      |
| [Журнал/Ҡалыптар/Үҙгәртеү](#other-instructions) |журналдар, башҡарыусыға ҡағылышлы файҙалы йөкләмәләр, башҡарыусыларҙы яңыртыу |                      |

Шулай уҡ ISI ҡарауҙың башҡа ысулы ла бар, улар ҡағылған иҫәп-хисап объекты күҙлегенән:

|Маҡсат |Инструкциялар |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|Хисап |иҫәптәрҙе теркәү / теркәүҙән баш тартыу, активтар ҡабул итеү, иҫәбтәге метамәғлүмәттәрҙе яңыртыу, рөхсәт биреү/һуйыу һәм ролдәр |
|Домен |домендар булдырыуҙы тәьмин итеү, домендарҙы теркәүҙән тыйыу, домен хужалығын күсереү, домен метамәғлүмәттәре яңыртыу |
|Активтар билдәләмәһе |теркәү / теркәүҙе бөтөрөү билдәләмәләре, милек хоҡуғын күсереү, метамәғлүмәтте яңыртыу |
|Активтар |Минт / янған һанлы күләм, күсереү һанлы күмәклеге |
|Һаҡлыҡ ҡағыҙҙары |ебәрелгән түләүҙе асыҡлау, ҡабул итеү, билдәләү, сығарыу, юҡҡа сығарыу, бәхәстәрҙе хәл итеү, күсереп алыу йәки урындағы һаҡсылыҡ документтарын бөтөрөү |
|NFT |теркәлгән/регистрацияланмаған NFTs, милек хоҡуғын тапшырыу, метамәғлүмәттәрҙе яңыртыу |
|RWA |партияларын теркәү, күсермә күләме, тотоу/азат итеү, туңдырыу/түңдертеү, һатып алыу, берләштереү, метамәғлүмәттәрҙе яңыртыу һәм контроль |
|Триггер |register/unregister, mint/burn trigger repeats, execute trigger, update trigger metadata  теркәлергә / теркәлмәскә|
|Донъя |теркәлгән/регистрациялалмаған тиңдәштәре һәм ролдәр, параметрҙар билдәләү, башҡарманы яңыртыу. |

## CLI Миҫалдар {#cli-examples}

Был биттәге миҫалдар һеҙ өҫкө ағымында Iroha эш урынынан ҡушҡан командаларҙы урындағы клиенттың ҡалыплы конфигурацияһына ҡаршы эшләйһегеҙ тип фаразлай:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

Әгәр һеҙ `iroha` бинар ҡуйылған булһа, уның урынына `iroha --config ./defaults/client.toml` ҡулланығыҙ. Түбәндәге урындарҙы үҙ селтәрендәге ҡиммәттәр менән алмаштырығыҙ:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

Йәмәғәтселекте йәлеп иткәндә Taira тест селтәре, ҡулланыу a Taira клиенттың конфигурацияһы. түләүле миҫалдар эшләткәнсе, кран ярҙамсыһын һаҡларға [Testnet-ты алығыҙ XOR тураһында Taira](/ba/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) тип `taira_faucet_claim.py`, һуңынан тест селтәрен талап итә XOR краннан:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Газ фондындағы актив күренгәндән һуң, транзакцияларҙы яҙыу өсөн кәрәкле газ фондының метамәғлүмәттәре ҡушыла:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` - домендар һәм уларҙың SNS лизингтарын булдырыу өсөн ғәҙәти беренсе сығарыу юлы. Ул аныҡ мәғлүмәттәр киңлеген, хужаны, лизинг ваҡытын һәм цитата һаҡлауҙы декларатив рәүештә бәйләй, һуңынан бөтә кәрәкле дәүләтте атомлаштыра йәки ремонтлай. `POST /v1/aliases/setup/plan` һуңғы нөктәһен йәки CLI эш аҙымын ҡулланыу:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

Ниәт һәм план йәшерен түгел, әммә этап билдәләрен ҡуллана һәм конфигурацияланған иҫәб менән ябай транзакция тапшыра. План үҙенең селтәренә, авторитетына, йәшәү дәүләте якоряһына һәм ваҡытына бәйле; бер ҡасан да уны икенсе селтәрҙә ҡабаттан ҡулланырға ярамай.

## (Беҙҙең) Теркәлгән {#un-register}

Теркәлеү һәм теркәүҙән баш тартыу - блокчейнға яңы субъектҡа ID биреү өсөн ҡулланылған инструкциялар.

Барыһы ла теркәлергә мөмкин `Registrable` һәм `Identifiable`, әммә барыһы ла түгел `Identifiable` булып тора `Registrable`. Күпселек әйберҙәр туранан-тура теркәлгән, әммә ҡайһы бер осраҡтарҙа блокчейн вәкиллеге күпкә күберәк мәғлүмәт бар. Хәүефһеҙлек һәм һөҙөмтәлелек сәбәптәренән, беҙ бындай мәғлүмәттәр структуралары өсөн төҙөүселәрҙе ҡулланабыҙ (мәҫәлән `NewAccount`), ә тиҫтерҙәр менән теркәү эйә булыу иҫбатлау инструкцияһына эйә. ҡағиҙә булараҡ, теркәлергә мөмкин булған бөтә нәмә лә теркәлмәгән була ала, әммә был ҡаты һәм тиҙ ҡағиҙә түгел.

Иҫәптәрҙе, активтар билдәләмәләрен, NFTs, тиңдәштәре, ролдәрен һәм триггерҙарҙы теркәй алаһығыҙ. Домен булдырыуҙа `EnsureAlias` ҡулланыла; сеймал `Register::Domain` файҙалы йөкләнеш генез/бутстрап өсөн һаҡлана. Тиҫтерҙәрҙең теркәлеүе `RegisterPeerWithPop` ҡуллана, ул тиҫтерҙәр өсөн асҡысҡа эйә булыу раҫлауын алып бара. Беҙҙең [ исем биреү конвенцияларын](/ba/reference/naming.md) тикшереп, субъекттар исемдәренә ҡуйылған сикләүҙәр тураһында белеү.

RWA партиялары махсус `RegisterRwa` инструкцияһы ярҙамында барлыҡҡа килә. Хәҙерге кодта `UnregisterRwa` инструкцияһы юҡ; күрһәтелгән күләмде сығарыу өсөн `RedeemRwa` ҡулланығыҙ.

::: info

Иҫегеҙгә төшөрәбеҙ, һеҙ [ генез блогын](/ba/guide/configure/genesis.md) `genesis.json`ға нисек ҡуйырға ҡарар итеүегеҙгә ҡарап (атап әйткәндә, рөхсәт билдәләрен теркәүҙе индерәһегеҙме, юҡмы), иҫәп яҙмаһын теркәү процесы бик төрлө була ала. Дөйөм алғанда, беҙ уны былай итеп йомғаҡлай алабыҙ:

- Йәмәғәт блокчейн системаһында һәр кем иҫәп яҙҙыра аласаҡ.
- Шәхси блокчейнда иҫәп яҙмаларын теркәү өсөн үҙенсәлекле процесс булыуы мөмкин. Типтик шәхси блокчейн, йәғни бер ниндәй ҙә уникаль процесстар булмаған блокчейнға иҫәп яҙмаһын теркәү өсөн башҡа иҫәп яҙҙырыу өсөн иҫәп кәрәк.

Беҙ был айырмалыҡтар тураһында бик ентекле һөйләшәбеҙ, беҙ [ шәхси һәм дәүләт блокчейн](/ba/guide/configure/modes.md) менән сағыштырабыҙ.

:::

::: info

Хәҙерге ваҡытта тиҫтерҙе теркәү - селтәргә тәүге ышаныслы тиҫтерҙең өлөшө булмаған тиҫтерҙәрҙе өҫтәмә итеүҙең берҙән-бер юлы.

:::

Блокчейн объекттарын теркәү өсөн телгә ҡағылышлы ҡулланма ҡулланығыҙ:

|Тел |Юлбашсы |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI |Домендар булдырыу һәм иҫәптәр һәм активтар теркәү өсөн [Iroha CLI](/ba/get-started/operate-iroha-via-cli.md) ҡулланығыҙ. |
|Rust |[Rust инструкцияһын ҡулланыу](/ba/guide/tutorials/rust.md). |
|Kotlin/Java |[Kotlin/Java дәреслеге](/ba/guide/tutorials/kotlin-java.md) ҡулланығыҙ. |
|Python |[Python инструкцияһын ҡулланыу](/ba/guide/tutorials/python.md). |
|JavaScript/TypeScript |[JavaScript/TypeScript инструкцияһын ҡулланығыҙ ](/ba/guide/tutorials/javascript.md). |

Ғәҙәти домен булдырыуҙы планлаштырығыҙ һәм ҡулланығыҙ, һуңынан уны инде кәрәкмәгәндә теркәүҙе бөтөрөгөҙ:

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

Теркәлгән һәм теркәлмәгән иҫәптәр:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

Теркәлгән һәм теркәлмәгән активтарҙың билдәләмәләре:

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

Теркәлгән һәм теркәлмәгән NFTs. NFT теркәү уның йөкмәткеһен уҡый JSON стандарт инеү аша:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

Теркәлгән һәм теркәлмәгән вазифалар:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

Теркәлгән һәм теркәлмәгән ҡуҙғатҡыстар. Трижерҙы теркәү өсөн йә IVM байт-коды йәки сериялы инструкция исемлеге кәрәк. Был миҫал `Log` инструкцияһын CLI менән төҙөй һәм уны ҡуҙғатыусыны теркәүгә үткәрә.

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

BLS асҡысын һәм PoP асҡысын, әгәр һеҙҙә улар юҡ икән, `kagami` менән булдырығыҙ:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## Минт/Бурн {#mint-burn}

Митинг һәм яндырыу һанлы активтарға ҡағыла ала һәм сикләнгән ҡабатлауҙар һаны менән ҡуҙғатыла. Ҡайһы бер активтар митингһыҙ тип иғлан ителергә мөмкин, йәғни улар теркәлгәндән һуң бер тапҡыр ғына һуғылырға мөмкин.

Активтар билдәле бер иҫәп-хисапҡа теркәлә, ғәҙәттә был иҫәбен беренсе урынға теркәү. Актив күләмдәре кире түгел, шуға күрә һеҙ бер ҡасан да `$-1.0` йәки тиҫкәре сумманы яндырып, минет алыу өсөн.

Минт блокчейн активтары өсөн телдең үҙенсәлекле белешмәһен ҡулланығыҙ:

- [CLI](/ba/get-started/operate-iroha-via-cli.md)
- [Rust](/ba/guide/tutorials/rust.md)
- [Kotlin/Java](/ba/guide/tutorials/kotlin-java.md)
- [Python](/ba/guide/tutorials/python.md)
- [JavaScript/TypeScript](/ba/guide/tutorials/javascript.md)

Бында янған активтарҙың миҫалдары килтерелә:

- [CLI](/ba/get-started/operate-iroha-via-cli.md)
- [Rust](/ba/guide/tutorials/rust.md)

Минет һәм яндырыу һанлы активтар:

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

Минт һәм янғын һүндереүсе ҡабатлауҙар:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## Трансфер {#transfer}

Трансферҙар иҫәбтәр араһында милек йәки ҡиммәт күсерелә. Дөйөм трансфер варианттары домендарҙы, активтар билдәләмәләрен, һанлы активтарҙы һәм NFTs үҙ эсенә ала. RWA күләм хәрәкәте тәғәйенләнгән ҡулланыла `TransferRwa` һәм `ForceTransferRwa` күрһәтмәләре [Ысын донъя Активтар](/ba/blockchain/rwas.md).

Бының өсөн иҫәпте бирергә кәрәк. [активтарҙы күсереүгә рөхсәт](/ba/reference/permissions.md). Миҫалға ҡарағыҙ, нисек күсергә активтар менән [CLI](/ba/get-started/operate-iroha-via-cli.md) йәки [Rust](/ba/guide/tutorials/rust.md).

Санлы активтарҙы күсереү:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

Трансфер домены, активтар билдәләмәһе һәм NFT хужалыҡ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Хаҡтарҙы һаҡлап ҡалыу һәм мөлкәт менән тәьмин итеү {#native-escrow-and-asset-locks}

Туған эскроу күрһәтмәләре һанлы активтарҙы иҫәп-хисап ҡаҙнаһы менән идара ителгән протокол һаҡлағанда бикләй. Улар баҙар стилендәге иҫәп-хисаплашыу, дөйөм активтарҙы бикләү һәм аноним һаҡланған ескроу ағымдары өсөн ҡулланыла.

Баҙарҙа депозит ҡулланыу `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, һәм `ResolveEscrowDispute`. Ғәҙәттәгесә активты ябыу ҡулланыу `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, һәм `ExpireAssetLock`. Anonymous escrow баҙарҙа йәшәү циклын сағылдыра `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, һәм `ResolveAnonymousEscrowDispute`.

Был ISIs хәҙерге ваҡытта беренсе класлы юҡ CLI командалар. типте ҡулланыу SDK төҙөүселәр йәки сериаллаштырылған инструкция файҙалы йөкләмәләре, һәм ҡара: [Тыуған милке иҫәбенә депозит](/ba/blockchain/escrow.md) тормош циклы мәғлүмәттәре, рөхсәттәре, һорауҙары, ваҡиғалары өсөн һәм Rust миҫалдар.

## Грант/Ҡатҡарыу {#grant-revoke}

Аҡса биреү һәм кире ҡағыу буйынса күрһәтмәләр иҫәпкә [ рөхсәттәре һәм ролдәр өсөн ҡулланыла ](permissions.md).

`Grant` ҡулланыусыға даими рәүештә бер генә рөхсәт биреү өсөн ҡулланыла, йәки хоҡуҡтар төркөмө ("роль"). бирелгән ролдәр һәм хоҡуҡтарҙы бары тик `Revoke` инструкцияһы аша алып ташларға була.

Аҡса иҫәбенә роль биреү һәм уны кире ҡағыу:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

Рөхсәт билдәләрен биреү һәм кире ҡағыу. Рөхсәт командалары рөхсәт объектын стандарт инеүҙән уҡый:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

Рольгә рөхсәт биреү һәм уны кире ҡағыу:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

Был күрһәтмәләр объектты яңырта [ metadata](/ba/blockchain/metadata.md). Метамәғлүмәт индерешен ҡушыу йәки алмаштырыу өсөн `SetKeyValue` һәм уны юйыу өсөн `RemoveKeyValue` ҡулланығыҙ.

Metadata `set` командаһы стандарт инеүҙән JSON ҡиммәтен уҡый:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

Шул уҡ схема иҫәп-хисап, активтар билдәләмәләре, NFTs, RWAs һәм ҡуҙғатҡыстар өсөн дә бар:

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

`SetParameter` актив мәғлүмәттәр моделе һәм башҡарыусы тарафынан асыҡланған цеп буйынса параметрҙар үҙгәрә.

Стандарт инеү менән бер параметрлы JSON объектты үткәреп, параметрҙы билдәлә:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

Был инструкция менән [ триггерҙар](./triggers.md) үтәлә.

CLI триггерҙарҙы теркәй ала һәм туранан-тура trigger башҡарыу ваҡиғаларына яҙыла ала. Ул `execute trigger` командаһын тип итмәй, шуға күрә ҡулланма `ExecuteTrigger` инструкцияһын тапшырырға, SDK йәки башҡарыусы ҡоралы менән сериялы `InstructionBox` генерацияһын яһау һәм һөҙөмтәле JSON массивын `ledger transaction stdin` аша үткәреү:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## Башҡа күрһәтмәләр {#other-instructions}

Iroha шулай уҡ түбәнге кимәлдәге инструкцияларҙы үтәү ваҡыты һәм башҡарыусы интеграцияһы өсөн асыҡлай:

- `Log`: ғәмәлгә ашырыу осоронда журналға инеү сығара
- `CustomInstruction`: башҡарыусыға тәғәйенләнгән JSON файҙалы йөкләмәләрҙе йөрөтөү
- `Upgrade`: үтәүсе яңыртыуҙы ҡуҙғатыу

`Log` инструкцияһын пинг ярҙамсыһы менән тапшырыу:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

Үҙенсәлекле башҡарыусы инструкцияһын сериаллаштырылған `InstructionBox` рәүешендә тапшырыу. Файҙалы йөкләмә формаһы башҡарыусыға ҡарата үҙенсәлекле, шуға күрә инструкцияны тап килеүсе SDK йәки башҡарыусы инструменты менән булдырыу:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

IVM байткод файлынан башҡарғанды яңыртыу:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
