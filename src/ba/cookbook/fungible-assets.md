---
translation_locale: ba
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 6b50c995afaf9f46df6fdaab31add40b106cfa12fdaa31dabbb74448486f87f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ҡатмарлы активтар {#fungible-assets}

## Һөҙөмтә {#outcome}

Тере Taira активтар билдәләмәләрен тикшерегеҙ һәм туплаған урындағы селтәрҙә реестр, банкнота, күсереү, яндырыу һәм баланс тикшереү ағымын тулыландырығыҙ. рецепт ҡулланыла каноник prefixed Base58 актив билдәләмәһе IDs, домен-ҡвалификациялы ҡушаматтар, доменһыҙ I105 иҫәбенә IDs һәм асыҡ түләү өсөн.

## Шарттар {#prerequisites}

- `curl`, `jq`, Python 3.11 йәки унан һуңғы, Node.js 24, һәм ток `iroha` CLI.
- Taira уҡырға ғына инеү мөмкинлеге.
- Яҙыу үтәү өсөн, [ла стартҡа сығыуҙан локаль селтәр барлыҡҡа килә Iroha](/ba/get-started/launch-iroha.md), `./localnet/client.toml` һәм Torii менән `http://127.0.0.1:8080`.

## Аҙымдар {#steps}

### 1. Taira билдәләмәләрен ҡултамғасыһыҙ тикшерегеҙ. {#_1-inspect-taira-definitions-without-a-signer}

Аҡса билдәләмәләре үтә күренмәле Base58 ID, дисплей исеме, mintability сәйәсәте, һанлы масштабы, факультатив алфавиты, хужаһы һәм дөйөм күләмгә эйә. Конкрет баланс шулай уҡ уның тотоусы иҫәбенә һәм ирекле мәғлүмәттәр киңлеге инә.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] \
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity] \
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

Урындағы хакимиәтте генерацияланған конфигурациялағы асыҡ асҡыстан сығарыу һәм башҡа теркәлгән иҫәпте алыусы итеп һайлау.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
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

DESTINATION_ACCOUNT="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg source "$SOURCE_ACCOUNT" \
      '[.items[].id | select(. != $source)][0]'
)"
```

### 3. Цифрлы билдәләмәне теркәгеҙ {#_3-register-a-numeric-definition}

Был урындағы ғына ID - Base58 активтар билдәләмәһе адресы. Алфавит кеше уҡый торған `domain.dataspace` проекцияһын тәьмин итә. масштабы `2` ике киҫәк цифрға рөхсәт итә; `--mint-once` ҡалдырып ҡалдырыу `Infinitely` ҡағиҙәһен һаҡлай.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'
ASSET_ALIAS='cookbook_credit#wonderland.universal'

iroha --config "$LOCAL_CONFIG" \
  --machine \
  --fee-payer authority \
  ledger asset definition register \
  --id "$ASSET_DEFINITION_ID" \
  --name cookbook_credit \
  --description 'Local cookbook credit' \
  --alias "$ASSET_ALIAS" \
  --scale 2
```

ID-ны ҡабаттан ҡулланырға ярамай Taira. Йәмәғәт селтәрендә теркәлеү яңы каноник ID талап итә, һеҙҙең ғаризаға бүленә торған домен/алмаш исем, түләүҙәр финанслау һәм ғәмәлгә ашырыу ваҡыты активтар теркәү рөхсәте.

### 4. Минт, күсермә һәм яндырыу {#_4-mint-transfer-and-burn}

Барлыҡ яҙыу командалары, түләү түләүсе булараҡ, власты асыҡтан-асыҡ һайлай. CLI килешеүгә ҡул ҡуйылғанға тиклем теүәл транзакцияны иҫкә ала һәм ҡағиҙә буйынса көтөп ҡала.

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

Янғандан һуң сығанаҡ балансын `64.50`, тәғәйенләнешендәге балансты `25.50` һәм дөйөм күләмде `90.00` көтөгөҙ.

::: warning Рөхсәт сиктәре

Taira буйынса, краннан сығарылған `taira.tx-metadata.json` ҡушып, һәр яҙыу өсөн `--fee-payer authority` ҡулланығыҙ. Теркәү һәм майлау актив раҫлаусының рөхсәтен талап итә; күсереү һәм янтыу сығанаҡ балансы өҫтөндә вәкәләт талап итә.

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

- Һөҙөмтәлә ID составында `#` букмекер йәки конкрет баланс һүҙмә-һүҙ түгел, ҡануниаль актив билдәләмәһе ID. Base58 мәғәнәһен ҡулланығыҙ: `--definition`, йәки бәйләнгән прозвище менән `--definition-alias`.
- `Scale` хатаһы: ниндәйҙер күләмдә билдәләмә рөхсәт иткәндән күберәк өлөшлө һандар бар.
- `Mintability` кире ҡағыу: `Once`, `Not` йәки `Limited(n)` сәйәсәте мылтыҡ һалыуҙы бөтөргән йәки рөхсәт итмәгән. Тарихты яңынан яҙырға ярамай; билдәләмә һорауы буйынса ҡайтарылған сәйәсәт ҡулланығыҙ.
- 2-се аҙым иҫәбенә теркәлгән маҡсатлы иҫәп-хисап һайлай. әгәр активтар ҡабул итеү `ExplicitOnly`, тәғәйенләнгән баланс менән тәьмин итергә рөхсәт ителгән аша CLI шулай уҡ исемләнгән һаҡсы иҫәптә йәки баланста теркәлмәй; ул икенсе инструкция ҡушыу урынына аборттарҙы яһай.
- Хаҡтарҙы кире ҡағыу ғәҙәттәгесә инструкция уңышҡа ирешер алдынан була. Түләүсене һайлағыҙ, селтәрҙең хаҡтар активтары метамәғлүмәттәрен файҙаланығыҙ һәм уның балансын тикшерегеҙ.
- Әгәр ҙә урындағы билдәләмә элек тә булған булһа, яңы барлыҡҡа килгән локаль селтәрҙе ҡуҙғатыу йәки ғәмәлдәгеһе менән дауам итеү Бер ҡасан да яңылыш формалаштырылған осраҡлы ҡылды Base58 урынына алмаштырмағыҙ. ID.

## Сығанаҡ һәм уның менән бәйле документтар {#source-and-related-docs}

- [Аҡсаның ғүмере циклын интеграциялау һынауҙары ҡуйылған commit-та](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/asset.rs)
- [Rust активтар төҙөлөшө миҫалдары ҡуйылған йөкләмә буйынса](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha/examples/tutorial.rs)
- [Активтар](/ba/blockchain/assets.md)
- [Инструкциялар](/ba/blockchain/instructions.md)
- [Разрешение токендары](/ba/reference/permissions.md)
- [JavaScript һәм TypeScript](/ba/guide/tutorials/javascript.md)
