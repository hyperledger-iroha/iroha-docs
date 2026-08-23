---
translation_locale: ba
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: e07cc42a3fd5579db312bfbfbb8010f473062edebe0141eb9bb8c2a0e7faa4da
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Транзакцияларҙы тапшырыу һәм тикшереү {#submit-and-verify-transactions}

## Һөҙөмтә {#outcome}

Taira транзакцияһын алдан үтәгеҙ, аныҡ түләү курсын ҡабул итегеҙ, уны ҡул ҡуйығыҙ һәм тапшырығыҙ, Ҡулланылған тамамланыу ваҡытын көтөгөҙ һәм йөкмәтелгән транзакцияны хэш менән тикшерегеҙ.

## Шарттар {#prerequisites}

- [ тарафынан сығарылған финансланған `taira.client.toml`, `taira.tx-metadata.json` һәм `TAIRA_ACCOUNT_ID` Taira](./connect-to-taira.md) менән бәйләнгән.
- `iroha` CLI һәм `jq` ток.
- Taira ҡултамғаһын бер тапҡыр ҡулланыу. уның асҡысын йәки был бойороҡтарҙы Minamoto ҡа яҙырға ярамай.

## Аҙымдар {#steps}

### 1. Аҡсаны, хоҡуҡты һәм түләүҙәрҙе алдан билдәләгеҙ {#_1-preflight-the-endpoint-authority-and-fee-balance}

Тәүҙә сираттағы фотоһүрәттәрҙе уҡығыҙ, шунан хакимиәттең түләүҙәр балансы күренә икәнен иҫбатлағыҙ. ID бәйләнеш рецепты менән барлыҡҡа килгән метамәғлүмәттәрҙән.

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

CLI түләү ставкаһы өсөн теүәл ҡултамғаланмаған файҙалы йөкләмә ебәрә, ҡабул ителгән түләү ниәтен транзакцияға бәйләй, ҡул ҡуя һәм тапшыра. JSON режимында транзакция хэшигы, ҡул ҡуйылған транзакция һәм ҡабул ителгән цитата бергә ҡайтарыла .

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

### 3. Терминал үткәргес торбаһы торошон көтөп {#_3-wait-for-terminal-pipeline-state}

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

Тикшереүсе - икенсе, уҡырға ғына мөмкин булған күҙәтеү өҫтө. Ул торба үткәргесенең тамамланыуынан бер аҙ һуң ҡала ала.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Дәүләт үҙгәреү инструкцияһы өсөн, мутация яһалған объектты һорау менән тамамлағыҙ. [Metadata](./metadata.md), [Fungible assets](./fungible-assets.md) һәм [NFTs](./nfts.md) рецепттарҙа был дәүләттән һуң уҡыуҙар бар.

## Тикшереү {#verify}

Өс яҙманың да бер үк хэш буйынса килешеүен һәм экспедиторҙың күрешмәгән хәлдә булыуын хәбәр итеүен тикшерегеҙ:

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
- Әгәр тапшырыу ваҡыты бер хэш ҡайтарғандан һуң, был хэште башҡа транзакция төҙөү алдынан һорағыҙ. Һуҡыр ҡабаттан ебәреү яңы цитаталар һәм ҡул ҡуйылған файҙалы йөкләмә булдыра.
- Ҡул ҡуйылғанға тиклем түләүҙе кире ҡағыу мөмкин. `--fee-payer authority`, `gas_asset_id`, властың балансы һәм селтәр сылбыры ID тикшерелеү.
- `Rejected` ғәҙәттә инструкцияларҙы раҫлау, рөхсәттәр, түләүҙәр йәки иҫкергән хәлдә күрһәтелә. Ул уңышһыҙ үтәлеүҙең ышаныслы дәлилдәре булып тора һәм транспортты ҡабаттан һынау тип үҙгәртергә тейеш түгел.
- Тикшереүсе `404` шунда уҡ ҡулланылғандан һуң индексация лаг. ҡабаттан уҡырға тырышығыҙ; транзакцияны яңынан тапшырмағыҙ.
- Әгәр өҫтөнлөклө инструкция генерацияланған локаль селтәрҙә эшләй, әммә Taira уны кире ҡаға икән, аныҡ Taira рөхсәтен йәки идара ителгән исемдәр арауығын бүлеү мөмкинлеген алырға.

## Сығанаҡ һәм уның менән бәйле документтар {#source-and-related-docs}

- [Транзакция тапшырыу һәм түләү квотаһын ғәмәлгә ашырыу билдәләнгән йөкләмә буйынса](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [Транзакцияларҙы раҫлау һынауҙары ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha/tests/tx_confirmation.rs)
- [Транзакциялар](/ba/blockchain/transactions.md)
- [CLI күрһәтмәһе](/ba/get-started/operate-iroha-via-cli.md)
- [Torii сикләү пункттары](/ba/reference/torii-endpoints.md)
