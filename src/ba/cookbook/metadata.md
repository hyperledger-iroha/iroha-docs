---
translation_locale: ba
translation_source: /cookbook/metadata.md
translation_source_hash: 88298912f083d79a9fdfe5e8d0a89d49acb97d814d3871db0c874cb40db5342b
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Метамәғлүмәттәр {#metadata}

## Һөҙөмтә {#outcome}

Taira-лағы метамәғлүмәттәрҙе уҡығыҙ, комиссияһы асыҡтан-асыҡ түләнгән транзакция менән бер иҫәп метамәғлүмәте ҡиммәтен ҡуйығыҙ һәм тикшерегеҙ, һуңынан был ҡиммәтте ҡабат алып ташлағыҙ. Һеҙ реестр объекттарының метамәғлүмәттәрен транзакция метамәғлүмәттәренән айырым тотаһығыҙ.

## Шарттар {#prerequisites}

- `curl`, `jq`, Python 3.11 йәки унан һуңғы, һәм ток `iroha` CLI.
- [Taira-ға тоташыу](./connect-to-taira.md) битенән финансланған `taira.client.toml`.
- Маҡсат иҫәбенең метамәғлүмәттәре өҫтөндә вәкәләтле иҫәп. Миҫал көйләнгән вәкәләтле иҫәпте үҙ эсенә ала; икенсе иҫәпкә теүәл рөхсәт талап ителә.

## Аҙымдар {#steps}

### 1. Метамәғлүмәттәрҙе ҡултамғасыһыҙ уҡығыҙ. {#_1-read-metadata-without-a-signer}

Метамәғлүмәттәр — тикшерелгән `Name`-дән JSON-ға карта. Буш карталар һәм фильтрлау һөҙөмтәһендәге буш сығарылыш дөрөҫ һөҙөмтә булып тора.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[]
    | select((.metadata // {} | length) > 0)
    | {id, name, metadata}'

curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

Бәләкәй һүрәтләү йәки индексациялау майҙансыҡтары өсөн метамәғлүмәттәр ҡулланығыҙ. ҙур файҙалы йөкләмәләрҙе иҫәп-хисаптан алып, уның урынына URI йәки SoraFS шиғырын һаҡлағыҙ.

### 2. маҡсатлы иҫәпте сығарыу {#_2-derive-the-target-account}

Taira конфигурацияһынан асыҡ асҡысты ғына уҡығыҙ һәм уны I105 доменһыҙ формаһына үҙгәртегеҙ.

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"
```

### 3. Бер JSON ҡиммәтен ҡуйығыҙ {#_3-set-one-json-value}

Стандарт индереүҙән уҡылған JSON иҫәптең `cookbook_profile` ҡиммәтенә әйләнә. `--metadata <file>` менән беркетелгән транзакция метамәғлүмәттәре — транзакция конвертындағы айырым карта, һәм ул бер ҡасан да комиссияны һайламай: быны `--fee-payer` һәм CLI-ның теүәл комиссия иҫәбе башҡара, ә клиент `gas_asset_id`, `gas_limit` йәки `fee_sponsor` асҡыстары булған транзакция метамәғлүмәттәрен кире ҡаға.

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

CLI ҡул ҡуйыр алдынан теүәл комиссияны Taira-ның түләү активында иҫәпләп күрһәтә, һуңынан транзакцияны тапшыра һәм эшен тамамлағансы уның Applied һуңғы торошона етеүен көтә.

::: warning Рөхсәт сиктәре

Әүҙем башҡарыусы (executor) һәр объектты кем үҙгәртә алыуын хәл итә. Икенсе иҫәпте яңыртыу өсөн ғәҙәттә `CanModifyAccountMetadata` кәрәк; домендар, актив билдәләмәләре, NFTs һәм ҡуҙғатҡыстар өсөн маҡсатҡа хас айырым метамәғлүмәт рөхсәттәре бар. Әгәр Taira кәрәкле вәкәләтте бирмәгән булһа, шул уҡ иҫәп командаларын `./localnet/client.toml` менән эшләтегеҙ һәм генерацияланған локаль селтәрҙең вәкәләтле иҫәбенең каноник I105 ID-һын ҡуйығыҙ. Локаль комиссия түләүсене асыҡтан-асыҡ һайлауҙы һаҡлағыҙ.

:::

### 4. Ключты алып ташлау. {#_4-remove-the-key}

Тәүҙә бурысты үтәгән хаҡты уҡығыҙ, һуңынан айырым күсереү транзакцияһын тапшырығыҙ.

```bash
iroha --config ./taira.client.toml --machine account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

Python ҡушымталары өсөн оҡшаш типтағы төҙөүселәр - `Instruction.set_account_key_value` һәм `Instruction.remove_account_key_value`; уларҙы транзакция метамәғлүмәттәре менән бер рәттән тапшырығыҙ һәм [Python дәреслегенән ярҙамсыһын көтөгөҙ ](/ba/guide/tutorials/python.md#shared-setup).

## Тикшереү {#verify}

билдәләнгән транзакциянан һуң, `meta get` объектты кире ҡайтарырға тейеш `version: 1`. Асылғандан һуң, тура эҙләнеү инде бер ҡиммәтте кире ҡайтармай:

```bash
iroha --config ./taira.client.toml --machine account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile; then
  printf '%s\n' 'metadata key still exists' >&2
  exit 1
else
  printf '%s\n' 'metadata key removed'
fi
```

Айырым иҫәп-хисап яҙмаһында юғалған метамәғлүмәт асҡысы менән сеть йәки иҫәбенә ҡаҡшау. етештереү коды шулай уҡ бөтә JSON ҡиммәтен билдәләгәндән һуң.

## Проблемаларҙы хәл итеү {#troubleshooting}

- Стандарт инеүҙәрҙә бер ғәмәлле JSON ҡиммәте булырға тейеш. Һылбырҙарға JSON цитаталары кәрәк; объекттар һәм массивтар яҡшы формала булырға тейеш.
- Метамәғлүмәт асҡыстары `Name` ҡиммәттәр булып тора һәм анализланғандан һуң осраҡҡа һиҙгер була. Һәр схема үҙгәреше өсөн версиялы клавишалар булдырыу урынына тотороҡло төп һүҙлек запасын һаҡлағыҙ.
- `--metadata` транзакция метамәғлүмәттәре; ул иҫәп-хисап объекты метамағлүмәттәрен ҡуймай. `meta set` һуңғыһы өсөн подкомандующий.
- Уңышлы тапшырыуҙан һуң иҫке уҡыу таралыуҙы кисектерергә мөмкин. Ҡулланылған тамамланыу ваҡытын көтөп, һорауҙы яңынан ебәрер алдынан ҡабатлап ҡарағыҙ.
- Рөхсәт биреүҙән баш тартыу маҡсатлы объектты һәм вәкәләтле иҫәп сиктәрен билдәләй. Урындағы рәүештә ҡабатлап ҡарағыҙ йәки теүәл токенды һорағыҙ; асыҡ метамәғлүмәт өлкәһенә шәхси ҡушымта мәғлүмәттәрен күсереп ебәрмәгеҙ, шулай итеп ҡулланыуҙы контролдә тотоп булмай.
- Бер ҡасан да шәхси асҡыстарҙы, шәхси идентификаторҙарҙы, инеү билдәләрен йәки ҙур документтарҙы метамәғлүмәттәрҙә һаҡламағыҙ.

## Сығанаҡ һәм уның менән бәйле документтар {#source-and-related-docs}

- [](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/queries/metadata.rs) ҡуйылған commit-та метафайлдар һорауын интеграциялау һынауҙары.
- [Python SDK транзакция төҙөүселәре ҡуйылған commit буйынса](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/python/iroha_python/README.md)
- [Метамәғлүмәттәре](/ba/blockchain/metadata.md)
- [Метамәғлүмәттәрҙе һәм иҫәп-хисап яҙмаһын һаҡлау варианттары](/ba/guide/configure/metadata-and-store-assets.md)
- [Инструкцияға һылтанма](/ba/reference/instructions.md)
- [Разрешение токендары](/ba/reference/permissions.md)
