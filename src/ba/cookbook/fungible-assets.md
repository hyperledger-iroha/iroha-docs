---
translation_locale: ba
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 3287a6bbaf06ec92ebbe9ac33a8294d4e1d232bc01fd6a5da13ddd166c620965
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Ҡатмарлы активтар {#fungible-assets}

## Һөҙөмтә {#outcome}

Эшләп торған Taira актив билдәләмәләрен тикшерегеҙ һәм генерацияланған локаль селтәрҙә сығарыу, күсереү, яндырыу һәм баланс тикшереү ағымын үтәгеҙ. Рецепт префикһыҙ каноник Base58 актив билдәләмәһе ID-ларын, доменһыҙ I105 иҫәп ID-ларын һәм комиссияны асыҡтан-асыҡ түләүҙе ҡуллана.

## Шарттар {#prerequisites}

- `curl`, `jq`, Python 3.11 йәки унан һуңғы версия, Node.js 24 һәм хәҙерге `iroha` һәм `kagami` CLIs (командалар юлы ҡоралдары).
- Taira уҡырға ғына инеү мөмкинлеге.
- Яҙыу аҙымдары өсөн: [Iroha-ны эшләтеп ебәреү](/ba/get-started/launch-iroha.md) битендәгесә `kagami localnet generate --peers 4 --out-dir ./localnet` командаһы менән, уға `--asset-definition-id 66owaQmAQMuHxPzxUN3bqZ6FJfDa` өҫтәп, булдырылған локаль селтәр. Ул `./localnet/client.toml` файлын һәм `http://127.0.0.1:8080` адресындағы Torii-ны бирә.

## Аҙымдар {#steps}

### 1. Taira билдәләмәләрен ҡултамғасыһыҙ тикшерегеҙ. {#_1-inspect-taira-definitions-without-a-signer}

Актив билдәләмәләрендә үтә күренмәҫ Base58 ID, күрһәтелә торған исем, сығарыу мөмкинлеге сәйәсәте, һанлы масштаб, ирекле ҡушамат, хужа, ирекле хужа домен йәки мәғлүмәттәр киңлеге, баланс сәйәсәте һәм дөйөм күләм була. Конкрет баланс шулай уҡ уның тотоусы иҫәбен һәм ирекле мәғлүмәттәр киңлеге даирәһен үҙ эсенә ала.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[]
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity]
    | @tsv'
```

```js [Node.js]
const response = await fetch(
  'https://taira.sora.org/v1/assets/definitions?limit=10',
  { headers: { Accept: 'application/json' } },
)
if (!response.ok) throw new Error(`Taira returned HTTP ${response.status}`)

const { items } = await response.json()
for (const definition of items) {
  console.log({
    id: definition.id,
    name: definition.name,
    mintable: definition.mintable,
    total: definition.total_quantity,
  })
}
```

:::

JavaScript формаһын `node taira-assets.mjs` менән үтәгеҙ. Йәмәғәт активтары IDs буш Base58 ҡиммәттәре; уҡый торған ҡиммәт, мәҫәлән, `cookbook_credit#wonderland.universal` - ошоларҙың береһе IDs тип билдәләнгән исем.

### 2. Урындағы хакимиәтте һәм тәғәйенләнешен әҙерләгеҙ {#_2-prepare-the-local-authority-and-destination}

Генерацияланған конфигурациялағы асыҡ асҡыс нигеҙендә локаль вәкәләтле иҫәпте сығарып алығыҙ, һуңынан яңы алыусы иҫәп өсөн асҡыстар парын булдырығыҙ һәм был иҫәпте теркәгеҙ. Бер генә шәхси асҡыс та экранға сығарылмай.

```bash
LOCAL_CONFIG='./localnet/client.toml'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
SOURCE_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

kagami keys --out-dir ./cookbook-recipient
DESTINATION_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert \
    "$(cat ./cookbook-recipient/public.key)"
)"
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  account register --id "$DESTINATION_ACCOUNT"
```

### 3. Клиентҡа ҡараған һанлы билдәләмәне ҡулланығыҙ {#_3-use-a-client-owned-numeric-definition}

Генезистан тыш билдәләмә ҡул ҡуйыусыға ҡараған хужа `--domain` аҫтында теркәлә, ә генерацияланған локаль селтәрҙең клиенты бер доменға ла хужа түгел. `--asset-definition-id` менән генерацияланған локаль селтәрҙә был билдәләмә инде бар: генезис уны сикләнмәгән масштаб менән теркәгән, клиентты уның хужаһы иткән һәм клиентҡа 1 000 000 000 берәмек сығарған.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

Был ID-ны Taira-ла ҡабат ҡулланмағыҙ. Асыҡ селтәрҙә теркәү өсөн яңы каноник ID, һеҙҙең иҫәбегеҙгә ҡараған хужа домен (`ledger asset definition register` командаһына `--domain` итеп бирелә), һәр ҡушамат өсөн бирелгән `CanManageAssetDefinitionAlias` рөхсәте һәм комиссия өсөн финанслау кәрәк.

### 4. Минт, күсермә һәм яндырыу {#_4-mint-transfer-and-burn}

Барлыҡ яҙыу командалары, түләүсе итеп вәкәләтле иҫәпте асыҡтан-асыҡ һайлай. CLI килешеүгә ҡул ҡуйылғанға тиклем теүәл транзакцияны иҫкә ала һәм ҡағиҙә буйынса көтөп ҡала.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset mint \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 100.00

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset transfer \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --to "$DESTINATION_ACCOUNT" \
  --quantity 25.50

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset burn \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 10.00
```

Янғандан һуң сығанаҡ балансын `1000000064.50`, тәғәйенләнешендәге балансты `25.50` һәм дөйөм күләмде `1000000090.00` көтөгөҙ.

::: warning Рөхсәт сиктәре

Taira-ла һәр яҙыу өсөн `--fee-payer authority` ҡулланығыҙ; CLI ҡул ҡуйыр алдынан теүәл комиссияны Taira-ның түләү активында иҫәпләп күрһәтә. Теркәү өсөн билдәләмәнең `--domain` доменына хужа булыу кәрәк, ә ҡушамат өсөн шулай уҡ `CanManageAssetDefinitionAlias` кәрәк. Сығарыу өсөн билдәләмәгә хужа булыу йәки `CanMintAssetWithDefinition` йә `CanMintAssetToAccount` рөхсәтенә эйә булыу кәрәк; күсереү һәм яндырыу өсөн сығанаҡ баланс өҫтөндә вәкәләт кәрәк. Faucet аша финансланған иҫәп автоматик рәүештә эмитент булып китмәй.

:::

## Тикшереү {#verify}

Конкрет баланстарҙы ла, һуңынан билдәләмәне лә уҡығыҙ. Был дәүләттан һуңғы һорауҙар уңыш критерийы булып тора; тапшырыу квитанцияһы үҙе түгел.

```bash
iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$DESTINATION_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

Ҡушымта раҫлауҙарында һанлы ҡиммәттәрҙе фиксирланған нөктәле декамалдар менән сағыштырырға кәрәк, ә бинар йөҙөп торған нөктәләрҙең ҡиммәттәре түгел, һәм ID билдәләмәһен дә, иҫәпте лә тикшерергә кәрәк.

## Проблемаларҙы хәл итеү {#troubleshooting}

- Һөҙөмтәлә ID составында `#` букмекер йәки конкрет баланс һүҙмә-һүҙ түгел, каноник актив билдәләмәһе ID. Base58 мәғәнәһен ҡулланығыҙ: `--definition`, йәки бәйләнгән прозвище менән `--definition-alias`.
- `Scale` хатаһы: ниндәйҙер күләмдә билдәләмә рөхсәт иткәндән күберәк өлөшлө һандар бар.
- `Mintability` кире ҡағыуы: `Once`, `Not` йәки `Limited(n)` сәйәсәте актив сығарыу мөмкинлеген бөтөргән йәки уны тыйған. Тарихты яңынан яҙырға ярамай; билдәләмә һорауы буйынса ҡайтарылған сәйәсәт ҡулланығыҙ.
- 2-се аҙым тәғәйенләнеш иҫәбен асыҡтан-асыҡ теркәй, шуға күрә иҫәп ҡабул итеү `ExplicitOnly` булғанда ла күсереү эшләй. Оҡшаш исемле CLI һаҡлағысы иҫәпте лә, балансты ла теркәмәй; ул тағы бер инструкция өҫтәү урынына эште өҙә.
- Комиссия буйынса кире ҡағыу инструкция ғәҙәттәгесә уңышлы үтәлгәнсе үк була. Түләүсене һайлағыҙ, CLI-ның комиссия иҫәбендәге түләү активын һәм максимум сумманы ҡарағыҙ һәм шул балансты тикшерегеҙ.
- Шул уҡ локаль селтәрҙә ҡабат эшләтеү алдағы баланстарҙан башлана, ә `kagami keys` инде булған `./cookbook-recipient` менән эшләүҙән баш тарта. Яңы генерацияланған локаль селтәрҙе ебәрегеҙ һәм был каталогты юйығыҙ, йәки абсолют ҡиммәттәр урынына баланс үҙгәрештәрен сағыштырығыҙ. Base58 ID урынына бер ҡасан да дөрөҫ булмаған осраҡлы тамғалар теҙмәһен ҡуймағыҙ.

## Сығанаҡ һәм уның менән бәйле документтар {#source-and-related-docs}

- [Аҡсаның ғүмере циклын интеграциялау һынауҙары ҡуйылған commit-та](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/asset.rs)
- [Rust активтар төҙөлөшө миҫалдары ҡуйылған commit буйынса](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/examples/tutorial.rs)
- [Активтар](/ba/blockchain/assets.md)
- [Инструкциялар](/ba/blockchain/instructions.md)
- [Разрешение токендары](/ba/reference/permissions.md)
- [JavaScript һәм TypeScript](/ba/guide/tutorials/javascript.md)
