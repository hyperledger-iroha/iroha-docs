---
translation_locale: ba
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Транзакциялар {#transactions}

Транзакция - блокчейн өҫтөндә эш башҡарыу өсөн ҡул ҡуйылған үтенесе. Башҡара торған файҙалы йөкләмә [ күрһәтмәләренең ](./instructions.md), килешеү саҡырыуы, IVM байткоды йәки иҫбатланған IVM үтәлеше булыуы мөмкин. Хәҙерге килешеү үтәлеше моделе өсөн [Аҡыллы килешеүҙәр](./smart-contracts.md) ҡара.

Транзакциялар торошто үҙгәртеүсе йәки башҡарыла торған эште үтәй. Уҡыу өсөн генә тикшереү ҡул ҡуйылған һорауҙарҙы йә асыҡ уҡыу ос нөктәләрен файҙалана һәм транзакция булдырмай.

Ҡатнашылған блокҡа ҡабул ителгән транзакция уның башҡарыу һөҙөмтәһе менән бергә һаҡлана, шул иҫәптән башҡарыуҙан баш тартҡан. Блокҡа инеү алдынан кире ҡағылған ғаризалар, мәҫәлән, ғәмәлһеҙ конверт йәки сираттан баш тартҡан транзакция блокта һаҡланмай.

Хосусилыҡты һаҡлаусы активтар хәрәкәте өсөн ҡарағыҙ [Аноним транзакциялар](./anonymous-transactions.md). Аноним операциялар асыҡ иҫәп-хисап балансында үҙгәрештәр урынына һаҡланған активтар, йөкләмәләр, ғәмәлдән сығарыусылар һәм нуль-белем иҫбатлауҙар ҡулланыла.

Үтәлештең асыҡ һөҙөмтәләренең ҡайһы берҙәре өсөн иҫбаттар тураһында [FastPQ](./fastpq.md) бүлеген ҡарағыҙ. Транзакция ғәҙәттәгесә үтәлгәс, FastPQ уның үтәлеш шаһиттарын ала һәм ул хуплаған хәл күсеүҙәре өсөн детерминистик иҫбат тупланмалары төҙөй.

## Taira менән һынап ҡарағыҙ. {#try-it-on-taira}

Тикшереүсе маршруттарын ҡулланып, һуңғы асыҡ Taira блоктарҙы һәм транзакциялар статусын имзалаусы иҫәп-хисапһыҙ тикшерергә кәрәк:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

Һеҙҙең ҡушымтағыҙ алдан тапшырылған транзакцияны күҙәтеү өсөн, исемлектән `hash` күсерә һәм эҙләүсе маршрутын ентекләп тикшерә:

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Был һаман да read-only. Transaction ебәреү өсөн ҡул ҡуйылған Norito envelope, дөрөҫ chain ID, fee metadata һәм faucet менән финансланған Taira account кәрәк.

Taira буйынса түләүле миҫалдар өсөн, [Taira-ла Testnet XOR алыу](/ba/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) бүлегендәге `taira_faucet_claim.py` faucet ярҙамсыһын ҡулланығыҙ, һуңынан ҡултамға ҡуйыусыны тәүҙә асыҡ faucet аша финанслағыҙ:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Әгәр ҙә faucet табышы йәки талап маршруты `502` кире ҡайтарһа, транзакцияның үҙен дебэглау алдынан көтөп һәм ҡабатлап ҡарағыҙ.

Һуңынан транзакцияны тапшырғанда Taira түләү активының метамәғлүмәттәре ҡушыла:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## Оффлайн транзакциялар {#offline-transactions}

Iroha ике офлайн-транзакция эш ағымдары бар:

- **Оффлайн ҡул ҡуйыу** signing device селтәрҙән өҙөлгән саҡта ғәҙәти ҡул ҡуйылған transaction булдыра. Online client ҡул ҡуйылған envelope-ты Torii-ға ебәрмәйенсә transaction эшкәртелмәй, шуға күрә уға дөрөҫ chain ID, authority, permission, fee һәм transaction lifetime һаман да кәрәк.
- Кагемуша офлайн аҡсаһы онлайн булған саҡта букмекерҙы өҫтөбөҙгә һала, ике портфель дә офлайнда булғанда ҡабул итеүсе ҡуҙғатып ебәргән букмеке-букмеке тапшырыуҙарын хуплай һәм алыусының интернетҡа ҡайтҡанда килеп сыҡҡан хаттың хәлен ҡайтарып ала.

Torii Кагемушаның бөтә йәшәү циклын `/v1/offline/*` аҫтында асыҡлай:

|Метод һәм маҡсат |Маҡсат |
| --- | --- |
|`GET /v1/offline/readiness` |`asset_definition_id` өсөн Kagemusha әҙерлеген баһалау |
|`POST /v1/offline/receiver-lineage` |Ҡул ҡуйылған ҡабул итеүсе ғаризаһы өсөн иҫбатлаулы актив теркәлеү ырыуыны хәл итергә |
|`POST /v1/offline/top-up` |Ҡул ҡуйылған онлайн-оффлайн өҫтәмә операцияһын тапшырығыҙ |
|`POST /v1/offline/redeem` |Ҡул ҡуйылған офлайн түләтеү операцияһын тапшырығыҙ |
|`GET /v1/offline/operations/{operation_id}` |Өҫтәмә йәки түләтеүҙең канон статусын уҡығыҙ |

Оффлайн операция төҙөгәнсе активтың әҙерлеген тикшерегеҙ:

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

Әҙерлекте тикшереү янсыҡты әүҙем күперҙең ABI 21 версияһына һәм раҫланған V4 материалдар йыйылмаһына бәйләй. Килеп сығыш сылбыры, иҫәпте тулыландырыу һәм кире ҡайтарыу һорауҙары типлаштырылған `application/x-norito` архивтарын ҡуллана. Тулыландырыу һәм кире ҡайтарыу `202 Accepted` менән бергә ғәмәл ресурсына һылтаныусы `Location` башлығын ҡайтара. Эстәге нулдән айырылған операция ID-һы шул уҡ запрос икенсе тапҡыр ебәрелгәндә уны ҡабат башҡармау өсөн асҡыс булып тора.

Типтик ағымы:

1. Әгәр `ready` ялған йәки ниндәй ҙә булһа блоктар ҡулланылған икән, әҙерлек һәм туҡтатыу тураһында һорағыҙ.
2. Тип менән яҙыу Swift йәки JVM аҡса янсығы каноник өҫтәмә архив төҙөү, уны тапшырыу һәм инеү нотаһы торошон һәм эш итеүҙе һаҡларға ID Операция һуңғы хәлгә килеп еткәнсе.
3. Әгәр кәрәк булһа, ҡабул итеүсе теркәлеү ырыуы хәл итегеҙ, һәр бер-береһе менән тапшырыуҙы локаль рәүештә төҙөгөҙ һәм тикшерегеҙ һәм күсереүҙе таныр алдынан шифрланған яҙма торошон дауам итегеҙ.
4. Ҡабул итеүсе интернетта булғанда, каноник азатлыҡ архивын төҙөгөҙ, уны тапшырығыҙ һәм уның операцион ресурсын йомғаҡлау өсөн һорау алығыҙ.

Офлайн тапшырылған ҡиммәт тураһындағы яҙманың хәле онлайн эш барышына әйләнеп ҡайтмайынса, реестр бер-береһенә ҡаршы булған тапшырыуҙарҙы күрә алмай. Шуға күрә янсыҡ һәм оператор ҡағиҙәләре ҡиммәт сиктәрен, ғәмәлдә булыу ваҡытын, рөхсәт ителгән эмитенттарҙы, урындағы ышаныслы һаҡлауҙы һәм яраштырыу өсөн ваҡыт аралыҡтарын контролдә тоторға тейеш.

Бында яңы транзакция булдырыу миҫалы `Grant` Инструкция. был транзакцияла Mouse Alice-ға билдәләнгән роль бирә (`role_id`Тейешле. [тулы миҫал](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
