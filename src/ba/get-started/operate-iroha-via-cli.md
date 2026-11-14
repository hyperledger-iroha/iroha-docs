---
translation_locale: ba
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 40714a6cd124d4b0342b0f6ecf321f286e714c0e236afd6fd7834c0cf0ad1165
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Iroha 3 аша хәрәкәт итеү CLI {#operate-iroha-3-via-cli}

`iroha` бинар - Iroha 3 өсөн команда һыҙығы клиенты. Уны иҫәп-хисап ҡаҙнаһының торошон һорарға, транзакциялар тапшырырға һәм операторҙың һуңғы нөктәләрен тикшереүгә ҡулланығыҙ.

## 1. Кәрәкле шарттар {#_1-prerequisites}

Документта күрһәтелгән сығанаҡ ревизияһындағы Iroha сығанаҡ коды күсермәһенән дүрт тиңдәшле локаль селтәрҙе генерациялағыҙ һәм эшләтеп ебәрегеҙ:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
./localnet/start.sh
```

Түбәндәге миҫалдар уның генерацияланған клиент конфигурацияһын — `./localnet/client.toml` ҡуллана.

## 2. Башлыса CLI ҡоролмаһы {#_2-basic-cli-setup}

Иң юғары кимәлдәге ярҙам күрһәтегеҙ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI түбәндәге юғары кимәлдәге команда төркөмдәренә бүленгән:

- `account` — иҫәптәрҙе уҡыу һәм үҙгәртеү өсөн
- `explorer` — уртаҡ фильтрҙар һәм битләү менән күҙәтеүсе ағымдары өсөн
- `tx` — транзакция торошо һәм транзакция ярҙамсылары өсөн
- `ledger` иҫәп-хисап өсөн уҡый һәм яҙа
- `trigger` — триггерҙарҙы уҡыу, яҙыу һәм башҡарыу өсөн
- `ops` оператор диагностикаһы өсөн
- `app` ҡушымта ярҙамсылары өсөн API
- `contract` — контракт саҡырыуҙары, ҡарауҙар һәм урындағы хаталарҙы тикшереү өсөн; урынлаштырыуҙа `kagami contract deploy` йәки `musubi deploy` ҡулланығыҙ
- `tools` диагностика һәм үҫеш өсөн коммуналь хеҙмәттәр өсөн
- `dataspace` — мәғлүмәт киңлеге билдәләмәһен планлаштырыу, ҡулланыу һәм тикшереү өсөн
- `taira` — Taira диагностикаһы һәм иҫәптәрҙе ҡушыу өсөн
- `offline` — офлайн кодлаусылар, отчеттар һәм диагностика өсөн
- `soracloud` — Soracloud ҡушымта платформаһы ярҙамсылары өсөн
- `sccp` — SORA Cross-Chain Protocol уҡыуҙары, күсереүҙәре һәм иҫбаттары өсөн

Транзакция ебәргән һәр команда комиссия түләүсене, мәҫәлән, `--fee-payer authority` аша, аныҡ күрһәтеүҙе талап итә; CLI ҡул ҡуйыр алдынан теүәл комиссияны күрһәтә.

Кеше уҡый торған оператор сығыуы өсөн `--output-format text` һәм ҡәтғи автоматлаштырыу режимы өсөн `--machine` ҡулланыу.

## 3. асыҡтан-асыҡ Taira тест селтәрен һынағыҙ {#_3-try-the-public-taira-testnet}

Һеҙ уҡырға ғына тырыша ала Taira локаль пирҙы эшләткәнгә йәки ҡултамға яһағанға тиклем тикшерә. Был командалар асыҡ ҡулланыла Torii JSON маршруттар һәм ҡулланыу testnet түгел XOR.

Taira статусын тикшерегеҙ:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

Аутентификацияланмаған уҡыусыға күренгән домендарҙы күрһәтегеҙ:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

Бер нисә актив билдәләмәһен һәм уларҙың хәҙерге ҡиммәтлеген әйтеп бирегеҙ:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Әгәр һеҙҙә хәҙерге `iroha` бинарлы булһа, Taira диагностика ярҙамсыһын эшләтегеҙ:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Ҡул ҡуйылған командаларҙы һынап ҡарарға әҙер булғанда ғына `taira.client.toml` булдырығыҙ. Конфигурация, һынау аҡсаһы биреү хеҙмәте һәм тәүге тикшереү ағымы өсөн [SORA Nexus мәғлүмәт киңлектәренә тоташыу](/ba/get-started/sora-nexus-dataspaces.md) бүлеген ҡарағыҙ. Иҫәп шул хеҙмәттең комиссия активы менән аҡсаланғансы Taira-ға яҙыу командаларын ебәрмәгеҙ.

Комиссия түләнә торған һәр Taira CLI миҫалы өсөн [Taira-ла һынау селтәре өсөн XOR алыу](/ba/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) бүлегендәге әҙер һынау аҡсаһы биреү хеҙмәте ағымы аша ҡул ҡуйыусының иҫәбен аҡсаландырығыҙ, һуңынан балансын тикшерегеҙ:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Һынау аҡсаһы биреү хеҙмәте маршруты `502` ҡайтарһа, көтөгөҙ һәм ҡабатлап ҡарағыҙ. Был — асыҡ һынау селтәренең ҡулланылыу мәсьәләһе; ул иҫәп асҡыстарын яңынан булдырыу кәрәклеген аңлатмай.

Баланс күренгәс, `--fee-payer authority` менән яҙыу ғәмәлдәрен ебәрегеҙ. CLI ҡул ҡуйыр алдынан Taira комиссия активында теүәл комиссияны күрһәтә:

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "hello from faucet-funded taira"
```

## 4. Башланғыс иҫәп яҙма командалары {#_4-basic-ledger-commands}

Бөтә домендар исемлеге:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

ғәҙәти домен булдырыу декларатив псевдоним планер ҡуллана; `ledger domain` командование юҡ `register` Подкомандующий, йәшеренһеҙ әҙерләнегеҙ. `AliasSetupPlanRequestV1` маҡсаты өсөн `docs.universal` һеҙҙең менән SDK йәки инеү сервисы, һуңынан уны планлаштырып һәм ҡулланыу:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

Ниәт мәғлүмәт киңлеге идентификаторын, каноник хужа иҫәбен, ҡуртым ваҡытын һәм ағымдағы хаҡ тәҡдимен тикшереү шартын беркетә. Планлаштырыусы тере торошто тикшерә һәм ебәреү өсөн теүәл атомар `EnsureAlias` планын ҡайтара. Тикшереү шарттары ҡиммәттәрен башҡа селтәрҙән ҡулдан күсермәгеҙ.

Ябай Пинг транзакцияһын ебәр:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority tx ping --msg "hello from iroha"
```

Һуңғы блокты уҡығыҙ йәки блок ваҡиғаларына яҙылығыҙ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Операторҙар командаһы {#_5-operator-commands}

Консенсус операторы командалары рөхсәт исемлегендәге башҡарыу ваҡыты асҡысын талап итә. Уны `client.toml` эсенә ҡуймағыҙ һәм хужа ғына уҡый алған файлды абсолют юлы менән бирегеҙ:

```bash
# The generated localnet writes its allow-listed operator key here.
: "${OPERATOR_KEY_FILE:=$PWD/localnet/runtime/operator-signer.key}"

cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
```

Авторитетлы булмаған сират, үткәргес линияһы, һайлауҙар һәм юл диагностикаһы:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
```

Раҫланған консенсус һыҙаттары һәм ошо төйөн инстанцияларының торошо:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi lanes
```

Сылбырҙағы консенсус параметрҙары:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi params
```

## 6. Артабан ҡайҙа барырға? {#_6-where-to-go-next}

- [SDK дәреслектәр](/ba/guide/tutorials/)
- [Torii сикләү пункттары](/ba/reference/torii-endpoints.md)
- [Iroha бинарҙар](/ba/reference/binaries.md) менән эшләү
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)

Сығанаҡ кодтың эш күсермәһенән тулы Markdown ярҙам күренешен баҫтырыу өсөн эшләтегеҙ:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > iroha-cli-help.md
```
