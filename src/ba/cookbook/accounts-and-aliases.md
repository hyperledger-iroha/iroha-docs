---
translation_locale: ba
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 429535e5bb4ad1d3110f29a5b3896c0d3ce39264dbd357fa932fcc2a5f48d0f1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Иҫәптәр һәм исемдәр {#accounts-and-aliases}

## Һөҙөмтә {#outcome}

Доменһыҙ Canonical менән хәүефһеҙ эшләй I105 иҫәбенә IDs һәм айырым бәйләнгән кеше уҡый алғы исемдәр, мәҫәлән: `treasury@payments.universal`. Һеҙ тикшерәсәкһегеҙ Taira иҫәбенә, үҙ каноник сығарыу ID, һәм маршрут контексты менән шәхесте бутамайынса ялған исемдәрҙе хәл итеү.

## Шарттар {#prerequisites}

- `curl`, `jq`, Python 3.11 йәки унан һуңғы, һәм ток `iroha` CLI.
- [тан `taira.client.toml` үҙ иҫәбенә инспектирование ваҡытында Taira](./connect-to-taira.md) менән бәйләнеше.
- Taira кран аша йәки селтәрҙең идара ителгән инеү юлы аша иҫәп яҙмаһын тәьмин итеү алдан иҫәп-хисапҡа ярашлы уҡыу уңышлы булыр тип көтөлә.

## Аҙымдар {#steps}

### 1. Taira буйынса каноник иҫәптәрҙе тикшереү {#_1-inspect-canonical-accounts-on-taira}

Йәмәғәт иҫәп-хисап исемлегендә һәр саҡ I105 IDs канонкаһы бирелә. Беренсе алфавит фальсификация һәм айырым хәбәр ителә.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

ID исемлеге `.id` ҡағиҙәле иҫәп-хисап майҙансыҡтары өсөн файҙаланыла. уға домен ҡушмағыҙ. `.primary_alias` атамаһы ҡулланыусыға ҡараған эҙләү асҡысы, башҡа каноник билдә түгел.

### 2. Taira I105 ID {#_2-derive-and-normalize-your-taira-i105-id}

Тик урындағы конфигурациянан асыҡ асҡысты уҡығыҙ. Бер үк асыҡ асҡыс төрлө-төрлө йәмәғәт селтәре профилдәре өсөн башҡаса кодлана, шуға күрә `taira` һайлағыҙ.

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

printf '%s\n' "$TAIRA_ACCOUNT_ID" \
  | iroha tools address normalize --profile taira
```

Нормальләштерелгән ҡиммәт `TAIRA_ACCOUNT_ID` менән бер тигеҙ булырға тейеш. TOML файлындағы `[account].domain` билдәләмәһе `wonderland.universal` була ала, әммә был ҡиммәт маршрутлау һәм ҡушамат контексына ғына ҡағыла.

### 3. Бухгалтер иҫәбен һәм уның активтарын уҡығыҙ. {#_3-read-the-account-and-its-assets}

Иҫәпкә резерв индерелгәндән һуң, уны туранан-тура һорағыҙ һәм сикләнгән активтар битен исемлеккә килтерегеҙ. URL - уны һуҡмаҡҡа ҡулланыр алдынан I105 ҡиммәтен кодлау.

```bash
iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

ENCODED_ACCOUNT_ID="$(
  python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1], safe=""))' \
    "$TAIRA_ACCOUNT_ID"
)"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/accounts/$ENCODED_ACCOUNT_ID/assets?limit=10" \
  | jq '{total, items}'
```

### 4. Иҫәпкә бәйләнгән ҡушаматтарҙы эҙләгеҙ. {#_4-look-up-aliases-bound-to-the-account}

Кире рельсер бер үк каноник иҫәпте ҡабул итә ID. асыҡ мәғлүмәти майҙансыҡ һыҙыҡтарын үтенес ҡултамғаһы башлыҡтарыһыҙ уҡырға мөмкин; сикләнгән мәғлүмәт майҙансыҡтары рөхсәт ителгән имзалы һорау талап итә.

```bash
jq -nc --arg account_id "$TAIRA_ACCOUNT_ID" \
  '{account_id: $account_id}' > alias-by-account.json

curl -fsS -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  --data-binary @alias-by-account.json \
  https://taira.sora.org/v1/aliases/by-account \
  | tee alias-bindings.json \
  | jq '{account_id, total, items}'
```

`total: 0` ғәмәлдә: иҫәпкә ялған исем кәрәкмәй. Ҡатнашыусы булған осраҡта, уның тулыһынса тулы хоҡуҡлы ялған исемен асыҡлағыҙ һәм кире ҡайтарылған иҫәбкә ID ҡарағыҙ:

```bash
ALIAS_WAS_RESOLVED=false
if TAIRA_ALIAS="$(jq -er '.items[0].alias' alias-bindings.json)"; then
  jq -nc --arg alias "$TAIRA_ALIAS" \
    '{alias: $alias}' > alias-resolve.json

  curl -fsS -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    --data-binary @alias-resolve.json \
    https://taira.sora.org/v1/aliases/resolve \
    | tee alias-resolution.json \
    | jq '{alias, account_id, source}'
  ALIAS_WAS_RESOLVED=true
else
  printf '%s\n' 'No visible alias is bound to this account.'
fi
```

::: warning Рөхсәт сиктәре

Ҡоролтай Taira faucet үҙенең дәғүәсе иҫәбенә тәьмин итә ала, әммә был дөйөм иҫәбенә теркәлеү йәки исем-шәриф менән идара итеү органы. `CanRegisterAccount` Актив раҫлаусы аҫтында. иҫәп-хисап исемдәре ғәҙәттә шулай уҡ кәрәк актив SNS лизинг һәм тейешле ҡушамат таныҡлыҡтары. көйләнгән инеү / ҡушамат планер ҡулланыу, йәки генерируемая локаль селтәр менән теркәүҙе һынап ҡарарға.

:::

Урындағы селтәрҙә, хәүефһеҙ ҡултамғалар менән тәьмин итеү этабы яңы каноник `NEW_ACCOUNT_ID` экспорты үткәндән һуң, теркәү йөҙө түбәндәгесә:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

Документация йәки ҡушымталар репозиторийынан ситтә тейешле шәхси асҡысты булдырыу һәм һаҡлау. ID контролер асҡысын ташлау файҙаланыуға яраҡһыҙ иҫәпте барлыҡҡа килтерә.

## Тикшереү {#verify}

асыҡ асҡыстың конфигурацияһын иҫбатларға, I105 кодлаштырыу, һәм ҡушамат тоташтырыусы бөтә converge бер канон иҫәбенә ID:

```bash
NORMALIZED_ACCOUNT_ID="$(
  printf '%s\n' "$TAIRA_ACCOUNT_ID" \
    | iroha tools address normalize --profile taira
)"
test "$NORMALIZED_ACCOUNT_ID" = "$TAIRA_ACCOUNT_ID"

if test "${ALIAS_WAS_RESOLVED:-false}" = true; then
  test "$(jq -r '.account_id' alias-resolution.json)" = "$TAIRA_ACCOUNT_ID"
fi
```

Канон иҫәбен һаҡлау IDs. Ҡулланығыҙ каноник IDs ҡултамғалар, рөхсәттәре һәм транзакция күрһәтмәләре өсөн. ғариза сигендә ҡушамат. Канон иҫәбен һаҡлағыҙ ID операция өсөн ҡулланыла.

## Проблемаларҙы хәл итеү {#troubleshooting}

- Анализлау йәки префикс хатаһы, ғәҙәттә, адрес башҡа селтәр профиле өсөн кодланған тигәнде аңлата. `--profile taira` менән нормализациялау һәм тап килмәгән осраҡтарҙы кире ҡағыу.
- `202` краннан һуң `404` иҫәбенә таралыу ваҡыты кисектерелергә мөмкин. Яҙыу ебәрер алдынан иҫәбенә йәки финансланған активҡа тикшереү үткәрегеҙ.
- `total: 0` реверс-резолюторҙан күренеп торған ҡушамат бәйләнмәгән тигәнде аңлата; ул иҫәб буйынса эҙләүҙә уңышһыҙлыҡ булмаясаҡ.
- `401` йәки `403` ҡушамат маршруты сикләнгән мәғлүмәт киңлеге йәки дөрөҫ хәл итеү рөхсәте етерлек булмаған күрһәткән. Яуызлыҡ өсөн киң префикс эҙләмәгеҙ.
- Уҡырға яраҡлы `name@domain.dataspace` ҡиммәттәре һәр ерҙә ҡабул ителмәй каноник I105 ID Тәүҙә уны хәл итергә кәрәк.
- Әгәр урындағы иҫәбенә теркәү уңышҡа өлгәшә, әммә Taira уны кире ҡаҡһа, айырма - рөхсәт. `CanRegisterAccount`; иҫәпте алмаштырмағыҙ ID раҫлауҙы ситләтеү өсөн.

## Сығанаҡ һәм уның менән бәйле документтар {#source-and-related-docs}

- [Ҡатнашылған commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/account/address.rs)-ла Canonical account адресын тормошҡа ашырыу
- [Хисап һәм псевдонимы һынауҙары Torii ҡуйылған commit-та](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [Иҫәпкә алыуҙар](/ba/blockchain/accounts.md)
- [Мәғлүмәт моделе исемдәре](/ba/blockchain/data-model.md#aliases)
- [Исемдәр биреү конвенциялары](/ba/reference/naming.md)
- [Разрешение токендары](/ba/reference/permissions.md)
