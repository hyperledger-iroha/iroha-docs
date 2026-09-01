---
translation_locale: ba
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: 98e5c7e9db1ba8468cfd5409409b0e8d02251311dc85492f7b71675e983dc4fd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Транзакцияларҙы тапшырыу һәм тикшереү {#submit-and-verify-transactions}

## Һөҙөмтә {#outcome}

Taira транзакцияһын алдан үтәгеҙ, аныҡ түләү курсын ҡабул итегеҙ, уны ҡул ҡуйығыҙ һәм тапшырығыҙ, Ҡулланылған тамамланыу ваҡытын көтөгөҙ һәм commit ителгән транзакцияны хэш менән тикшерегеҙ.

## Шарттар {#prerequisites}

- [ тарафынан сығарылған финансланған `taira.client.toml`, `taira.tx-metadata.json` һәм `TAIRA_ACCOUNT_ID` Taira](./connect-to-taira.md) менән бәйләнгән.
- `iroha` CLI һәм `jq` ток.
- Taira ҡултамғаһын бер тапҡыр ҡулланыу. уның асҡысын йәки был бойороҡтарҙы Minamoto ҡа яҙырға ярамай.

## Аҙымдар {#steps}

### 1. Аҡсаны, хоҡуҡты һәм түләүҙәрҙе алдан билдәләгеҙ {#_1-preflight-the-endpoint-authority-and-fee-balance}

Тәүҙә сираттың ағымдағы снимогын уҡығыҙ, шунан вәкәләтле иҫәптең комиссия балансы күренгәнен раҫлағыҙ. Бәйләнеш рецепты булдырған метамәғлүмәттәрҙән Base58 форматындағы актив билдәләмәһе ID-һын уҡығыҙ.

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.gas_asset_id' taira.tx-metadata.json)"

iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Хисап йәки түләү балансы юҡ икән, туҡтағыҙ. Яҡшы инструкция, уның органы түләй алмаған осраҡта, түләүҙе үтә алмай.

### 2. Бер тапҡыр телгә алыу, ҡул ҡуйыу һәм тапшырыу {#_2-quote-sign-and-submit-once}

CLI түләү ставкаһы өсөн теүәл ҡултамғаланмаған файҙалы йөкләмә ебәрә, ҡабул ителгән түләү ниәтен транзакцияға бәйләй, ҡул ҡуя һәм тапшыра. JSON режимында транзакция хэшигы, ҡул ҡуйылған транзакция һәм ҡабул ителгән комиссия иҫәбе бергә ҡайтарыла .

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

Был рецептта `--no-wait` ҡулланмағыҙ. команда уңышлы квитанция яҙыр алдынан раҫлауҙы көтә.

### 3. Терминал pipeline торошон көтөп {#_3-wait-for-terminal-pipeline-state}

HTTP ҡабул итеүҙән йәки сиратҡа инеүҙән уңыш алыу урынына типләнгән статус ярҙамсыһын ҡулланығыҙ. `--wait` ярҙамында хәүефһеҙ маршрутлау диапазоны автоматты рәүештә һайлана һәм алдан билдәләнгән маҡсат - Ҡулланылған һуңғыһы.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000 \
  > taira-final-status.json

jq . taira-final-status.json
```

`Rejected` һәм `Expired` - терминаль уңышһыҙлыҡтар, кире ҡайтарылырға мөмкин түгел. Транзакцияны үҙгәртеү йәки яңынан төҙөүгә тиклем уларҙың сәбәбен яҙығыҙ.

### 4. Һаҡланған транзакцияны уҡығыҙ {#_4-read-the-stored-transaction}

Төҙөү тамамланғанмы-юҡмы тип яуап бирә. Транзакция һорауы ҡабул ителгән транзакцияның шул уҡ хэш аҫтында һаҡлана икәнен раҫлай.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

Тикшереүсе - икенсе, уҡырға ғына мөмкин булған күҙәтеү өҫтө. Ул pipeline үткәргесенең тамамланыуынан бер аҙ һуң ҡала ала.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Дәүләт үҙгәреү инструкцияһы өсөн, мутация яһалған объектты һорау менән тамамлағыҙ. [Metadata](./metadata.md), [Ҡатмарлы активтар](./fungible-assets.md) һәм [NFTs](./nfts.md) рецепттарҙа был дәүләттән һуң уҡыуҙар бар.

## Тикшереү {#verify}

Өс record-тың да бер үк hash буйынса килешеүен һәм explorer-ҙың pending state тураһында бүтән хәбәр итмәүен тикшерегеҙ:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

Һынау раҫлау сифатында тапшырыу квитанцияһын һәм һуңғы статусын һаҡлағыҙ. Уларҙа ҡултамғалау асҡысы түгел, ә асыҡ транзакция материалдары бар.

## Проблемаларҙы хәл итеү {#troubleshooting}

- HTTP `202` йәки сираттағы статус ҡабул итеүҙе генә иҫбатлай. Ҡулланылған, кире ҡағылған, тамамланған йәки сикләнгән ваҡытҡа тиклем тип ҡуйылған статус буйынса һорау алыуҙы дауам итегеҙ.
- Әгәр тапшырыу ваҡыты бер хэш ҡайтарғандан һуң, был хэште башҡа транзакция төҙөү алдынан һорағыҙ. Һуҡыр ҡабаттан ебәреү яңы комиссия иҫәбе һәм ҡул ҡуйылған файҙалы йөкләмә булдыра.
- Ҡул ҡуйылғанға тиклем түләүҙе кире ҡағыу мөмкин. `--fee-payer authority`, `gas_asset_id`, вәкәләтле иҫәптең балансы һәм селтәр сылбыры ID тикшерелеү.
- `Rejected` ғәҙәттә инструкцияларҙы раҫлау, рөхсәттәр, түләүҙәр йәки иҫкергән хәлдә күрһәтелә. Ул уңышһыҙ үтәлеүҙең ышаныслы дәлилдәре булып тора һәм транспортты ҡабаттан һынау тип үҙгәртергә тейеш түгел.
- Тикшереүсе `404` шунда уҡ ҡулланылғандан һуң индексация лаг. ҡабаттан уҡырға тырышығыҙ; транзакцияны яңынан тапшырмағыҙ.
- Әгәр privileged instruction generated localnet-та эшләй, әммә Taira уны кире ҡаға икән, тап Taira permission-ын йәки governed namespace assignment-ты алығыҙ. Урындағы һөҙөмтә public-network authority бирмәй.

## Сығанаҡ һәм уның менән бәйле документтар {#source-and-related-docs}

- [Транзакция тапшырыу һәм түләү квотаһын ғәмәлгә ашырыу билдәләнгән commit буйынса](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Транзакцияларҙы раҫлау һынауҙары ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/src/client.rs)
- [Транзакциялар](/ba/blockchain/transactions.md)
- [CLI күрһәтмәһе](/ba/get-started/operate-iroha-via-cli.md)
- [Torii сикләү пункттары](/ba/reference/torii-endpoints.md)
