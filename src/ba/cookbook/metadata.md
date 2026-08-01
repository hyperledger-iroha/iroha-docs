---
translation_locale: ba
translation_source: /cookbook/metadata.md
translation_source_hash: 07b065b28eca44939a92b40a81a47b57178de4539abb0daf51913969e34eced7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Метамәғлүмәттәр {#metadata}

## Һөҙөмтә {#outcome}

Taira метамәғлүмәттәрен уҡығыҙ, транзакция өсөн түләүле транзакция менән бер иҫәп-хисап метамәғлифтәре ҡиммәтен билдәләгеҙ һәм тикшерегеҙ, ә ҡабаттан баһаны алып ташлағыҙ.

## Шарттар {#prerequisites}

- `curl`, `jq`, Python 3.11 йәки унан һуңғы, һәм ток `iroha` CLI.
- `taira.client.toml` һәм `taira.tx-metadata.json` финансланған [нан Taira](./connect-to-taira.md)ҡа тоташтырыу.
- Маҡсат иҫәбенең метамәғлүмәттәре өҫтөндә власть. Миҫал конфигурацияланған власты үҙ эсенә ала; икенсе иҫәпкә теүәл рөхсәт талап ителә.

## Аҙымдар {#steps}

### 1. Метамәғлүмәттәрҙе ҡултамғасыһыҙ уҡығыҙ. {#_1-read-metadata-without-a-signer}

Метамәғлүмәттәр - `Name` менән JSON картаһына тиклем тикшерелгән.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[] \
    | select((.metadata // {} | length) > 0) \
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

Ҡоролтай JSON стандарт кертеүҙән уҡыла иҫәп-хисапҡа инә `cookbook_profile` Киреһенсә, `--metadata ./taira.tx-metadata.json` Транзакция конвертына түләү майҙансыҡтарын ҡуша.

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      --metadata ./taira.tx-metadata.json \
      ledger account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

Ҡоролтай CLI түләүҙе цитаталар, ҡултамғалар, тапшыра һәм default көтөп. `--no-wait` әгәр киләһе операция был ҡиммәткә бәйле.

::: warning Рөхсәт сиктәре

Әүҙем раҫлаусы һәр объектты кем мутацияларға мөмкин икәнен хәл итә. Икенсе иҫәп яҙмаһын яңыртыу өсөн ғәҙәттә `CanModifyAccountMetadata` талап ителә; домендар, активтар билдәләмәләре, NFTs һәм ҡуҙғатҡыстарҙың үҙ маҡсатҡа ярашлы метамәғлүмәт рөхсәте бар. Әгәр Taira тейешле вәкәләт бирмәгән икән, шул уҡ иҫәб командаһын `./localnet/client.toml` менән башларға, барлыҡҡа килгән локаль селтәр власының каноник I105 ID урынына ҡуйырға һәм Taira түләү метамәғлүмәт файлын ҡалдырырға. Яҡынса урындағы түләүселәрҙе һайлап алыу.

:::

### 4. Ключты алып ташлау. {#_4-remove-the-key}

Тәүҙә бурысты үтәгән хаҡты уҡығыҙ, һуңынан айырым күсереү транзакцияһын тапшырығыҙ.

```bash
iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

Python ҡушымталары өсөн оҡшаш типтағы төҙөүселәр - `Instruction.set_account_key_value` һәм `Instruction.remove_account_key_value`; уларҙы транзакция метамәғлүмәттәре менән бер рәттән тапшырығыҙ һәм [Python дәреслегенән ярҙамсыһын көтөгөҙ ](/ba/guide/tutorials/python.md#shared-setup).

## Тикшереү {#verify}

билдәләнгән транзакциянан һуң, `meta get` объектты кире ҡайтарырға тейеш `version: 1`. Асылғандан һуң, тура эҙләнеү инде бер ҡиммәтте кире ҡайтармай:

```bash
iroha --config ./taira.client.toml --machine ledger account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine ledger account meta get \
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
- Рөхсәт биреүҙән баш тартыу маҡсатлы объектты һәм власть сиктәрен билдәләй. Урындағы рәүештә ҡабатлап ҡарағыҙ йәки теүәл токенды һорағыҙ; асыҡ метамәғлүмәт өлкәһенә шәхси ҡушымта мәғлүмәттәрен күсереп ебәрмәгеҙ, шулай итеп ҡулланыуҙы контролдә тотоп булмай.
- Бер ҡасан да шәхси асҡыстарҙы, шәхси идентификаторҙарҙы, инеү билдәләрен йәки ҙур документтарҙы метамәғлүмәттәрҙә һаҡламағыҙ.

## Сығанаҡ һәм уның менән бәйле документтар {#source-and-related-docs}

- [](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/queries/metadata.rs) ҡуйылған commit-та метафайлдар һорауын интеграциялау һынауҙары.
- [Python SDK транзакция төҙөүселәре ҡуйылған йөкләмә буйынса](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/python/iroha_python/README.md)
- [Метамәғлүмәттәре](/ba/blockchain/metadata.md)
- [Метамәғлүмәттәрҙе һәм иҫәп-хисап яҙмаһын һаҡлау варианттары](/ba/guide/configure/metadata-and-store-assets.md)
- [Инструкцияға һылтанма](/ba/reference/instructions.md)
- [Разрешение токендары](/ba/reference/permissions.md)
