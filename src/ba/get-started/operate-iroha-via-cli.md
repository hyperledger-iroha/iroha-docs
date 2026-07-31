---
translation_locale: ba
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 9391bab95aa0ee20c7f036cc175f3a6d3a8852e6ea90b09d9ebf1a838973c765
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 3 аша хәрәкәт итеү CLI {#operate-iroha-3-via-cli}

`iroha` бинар - Iroha 3 өсөн команда һыҙығы клиенты. Уны иҫәп-хисап ҡаҙнаһының торошон һорарға, транзакциялар тапшырырға һәм операторҙың һуңғы нөктәләрен тикшереүгә ҡулланығыҙ.

## 1. Кәрәкле шарттар {#_1-prerequisites}

Иң тәүҙә урындағы селтәрҙе ҡуҙғатыу:

- [Пуск Iroha 3](./launch-iroha.md)

[Launch Iroha 3](./launch-iroha.md) локаль селтәрҙән барлыҡҡа килгән клиент конфигурацияһын түбәндәге миҫалдар ҡабул итә:

```bash
./localnet/client.toml
```

## 2. Башлыса CLI ҡоролмаһы {#_2-basic-cli-setup}

Иң юғары кимәлдәге ярҙам күрһәтегеҙ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI түбәндәге юғары кимәлдәге команда төркөмдәренә бүленгән:

- `account` иҫәпкә йүнәлтелгән ҡыҫҡа юлдар өсөн
- `tx` транзакция кимәлендәге ярҙамсылар өсөн
- `ledger` иҫәп-хисап өсөн уҡый һәм яҙа
- `ops` оператор диагностикаһы өсөн
- `app` ҡушымта ярҙамсылары өсөн API
- `contract` контрактты файҙаланыу һәм саҡырыуҙар өсөн
- `tools` диагностика һәм үҫеш өсөн коммуналь хеҙмәттәр өсөн
- `taira` өсөн Taira һәм Nexus- йүнәлешле эш ағымдары

`ledger` төркөмөндә шулай уҡ `ledger transaction` кеүек доменға ҡағылышлы операцияларҙа ярҙамсылары бар.

Кеше уҡый торған оператор сығыуы өсөн `--output-format text` һәм ҡәтғи автоматлаштырыу режимы өсөн `--machine` ҡулланыу.

## 3. асыҡтан-асыҡ Taira тест селтәрен һынағыҙ {#_3-try-the-public-taira-testnet}

Һеҙ уҡырға ғына тырыша ала Taira локаль тиҫтерҙе эшләткәнгә йәки ҡултамға яһағанға тиклем тикшерә. Был командалар асыҡ ҡулланыла Torii JSON маршруттар һәм ҡулланыу testnet түгел XOR.

Taira һаулығын тикшерегеҙ:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

`universal` мәғлүмәт киңлегендә асыҡ домендар исемлеген яҙығыҙ:

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

Төҙөү `taira.client.toml` тик ҡул ҡуйылған бойороҡтарҙы һынарға әҙер булғанда ғына. [Ҡатнашыу SORA Nexus Мәғлүмәт базалары](/ba/get-started/sora-nexus-dataspaces.md) конфигурация, кран һәм канарий ағымы өсөн. Taira Аҡсаны банкоматҡа түләү иҫәбенә түләгәнгә тиклем.

Һәр түләүле Taira CLI миҫал өсөн, кран ярҙамсыһын һаҡлағыҙ [Testnet XOR алыу Taira](/ba/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) буйынса `taira_faucet_claim.py`, һуңынан тәүҙә testnet XOR талап итегеҙ:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Әгәр кран табышы йәки талап маршруты `502` кире ҡайтарһа, көт һәм тағы ла тырышығыҙ. Был асыҡ тест селтәрҙәре менән тәьмин итеү мәсьәләһе, иҫәбенә асҡыстарҙы тергеҙеү өсөн сигнал түгел.

Баланс күренеп бөткәндән һуң, түләү активтары метамәғлүмәтенә ҡушымта яҙыу:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. Башланғыс иҫәп яҙма командалары {#_4-basic-ledger-commands}

Бөтә домендар исемлеге:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

ғәҙәти домен булдырыу декларатив псевдоним планер ҡуллана; `ledger domain` командование юҡ `register` Подкомандующий, йәшеренһеҙ әҙерләнегеҙ. `AliasSetupPlanRequestV1` маҡсаты өсөн `docs.universal` һеҙҙең менән SDK йәки инеү сервисы, һуңынан уны планлаштырып һәм ҡулланыу:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

Маҡсат пинг мәғлүмәт киңлеге ID, каноник хужаһы иҫәбенә, ҡуртым срогы һәм ағымдағы цитата һаҡлау. планер тере торошон раҫлай һәм тапшырыу өсөн теүәл атом `EnsureAlias` планын ҡайтара. башҡа селтәрҙән һаҡланыу ҡиммәттәрен ҡулдан күсермәгеҙ.

Ябай Пинг транзакцияһын ебәр:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

Һуңғы блокты уҡығыҙ йәки блок ваҡиғаларына яҙылығыҙ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Операторҙар командаһы {#_5-operator-commands}

Консенсус торошо:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi status
```

Ваҡыт-ваҡыт задержкаһы:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

Ҡулланыу мөмкинлеге, коллектор, RBC запас һәм VRF миҫалдары:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

Сылбырҙағы консенсус параметрҙары:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## 6. Артабан ҡайҙа барырға? {#_6-where-to-go-next}

- [SDK дәреслектәр](/ba/guide/tutorials/)
- [Torii сикләү пункттары](/ba/reference/torii-endpoints.md)
- [Iroha бинарҙар](/ba/reference/binaries.md) менән эшләү
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md)

Барлыҡ Markeddown ярҙам фотоһүрәттәрен ҡайтарыу өсөн сығанаҡ иҫәбенә инеү, эшләй:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
