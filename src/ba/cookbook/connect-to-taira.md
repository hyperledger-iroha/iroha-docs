---
translation_locale: ba
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: e14be7d9314f26f40f6aa30678fddcfcfea39eda9b98016f1b2f84838203c548
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Taira-ға тоташыу {#connect-to-taira}

## Һөҙөмтә {#outcome}

Taira-ның асыҡ булыуын раҫлағыҙ, урындағы client configuration-дан canonical I105 account ID-ны сығарығыҙ, signer-ҙы testnet XOR менән финансланығыҙ һәм fee-quoted canary transaction-ды тапшырығыҙ. Был recipe Minamoto-ға бер ҡасан да write ебәрмәй.

## Шарттар {#prerequisites}

- `curl`, `jq`, Python 3.11 йәки унан һуңғы, һәм хәҙерге `iroha` һәм `kagami` бинарҙар.
- А `taira.client.toml` барлыҡҡа килтерелгән Taira сылбыр, һуңғы нөктә, иҫәб профиле һәм махсус тест селтәре асҡысы. [Төҙөү Taira Клиент конфигурацияһы](/ba/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) һәм файлды сығанаҡ контроленән ситтә ҡалдырығыҙ.
- [Get Testnet XOR на Taira](/ba/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira), клиент конфигурацияһы эргәһендә һаҡланған эшләй торған `taira_faucet_claim.py`

## Аҙымдар {#steps}

### 1. Яҡшылыҡ менән әҙерлек араһындағы айырма {#_1-separate-liveness-from-readiness}

`/livez` - ябай текстлы процесс йәшәүсәнлеге сондаһы. `/status`, `/health` һәм `/readyz` кире ҡайтарыу JSON. Эшләүсе узел кәрәкле подсистема блокировкаланған ваҡытта әҙерлек сондаларынан законлы рәүештә `503` кире ҡайтара ала.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

`/livez` процестың яуап бирәме-юҡмы икәнен хәл итеү өсөн генә ҡулланығыҙ. `/readyz`-ны трафикҡа инеү өсөн файҙаланығыҙ һәм JSON блокаторының деталдәрен тикшерегеҙ, ә `503`-ны өҙөклөктө тип иҫәпләмәйенсә.

### 2. Халыҡ-ара диагностикаларҙы үткәреү {#_2-run-the-public-diagnostics}

Был тикшереү уҡырға ғына һәм ҡултамғалаусының конфигурацияһын йөкләмәмәй:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Табип ауыр DNS, TLS, сылбыр йәки йомғаҡлау пункты боҙолғанын хәбәр итһә, яҙыуҙы дауам итмәгеҙ. Халыҡтың тығыҙ сиратта тороуы - ваҡытлыса; көтөп, сикләнгән сәйәсәт менән тағы ла һынап ҡара.

### 3. сығарыу Taira иҫәбенә ID йәшерен нәмәне баҫмайынса {#_3-derive-the-taira-account-id-without-printing-a-secret}

Конфигурациянан асыҡ асҡысты ғына уҡығыҙ, һуңынан уны Taira I105 профиле менән кодлағыҙ. `[account].domain` ҡиммәте маршрутлау контексын бирә; ул ID иҫәбенең бер өлөшө түгел.

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
printf '%s\n' "$TAIRA_ACCOUNT_ID"
```

Сығарылыш доменһыҙ каноник I105 адресы булып тора. `wallet@payments.universal` кеүек исемдәр - ҡушаматтар һәм уларҙы ҡаты иҫәп-хисап өлкәләрендә ҡулланыр алдынан хәл итергә кәрәк.

### 4. ғәмәлдәге Taira түләү активын талап итеү {#_4-claim-the-current-taira-fee-asset}

faucet яуабы — fee asset билдәләмәһе өсөн дөрөҫлөктөң сығанағы. Башҡа селтәрҙән йәки иҫке эшләтеп ебәреүҙән ID күсермәгеҙ; яуапта ҡайтарылған Base58 ID-ны һаҡлағыҙ.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

Балансты иң күбе бер минут дауамында тикшерегеҙ. Faucet финанслау транзакцияһы күренгәнсе үк `202 Accepted` ҡайтара ала.

```bash
funded=false
for attempt in 1 2 3 4 5 6 7 8 9 10 11 12; do
  if iroha --config ./taira.client.toml ledger asset get \
    --definition "$TAIRA_FEE_ASSET" \
    --account "$TAIRA_ACCOUNT_ID"; then
    funded=true
    break
  fi
  sleep 5
done
test "$funded" = true
```

`gas_asset_id` - транзакция метамәғлүмәттәре. асыҡтан-асыҡ `--fee-payer authority` һайлап алыу ҡултамға менән бәйләнгән, һәм CLI ҡултамғаһын яҙғансы туранан-тура түләү комиссия иҫәбе ала.

## Тикшереү {#verify}

JSON квитанцияһын һаҡлап ҡалыу һәм ҡулланылған тамамланыуын көтөп тороу. `--no-wait` тапшырыу шулай уҡ тәүге тапшырыуҙы раҫлауын көткәнгә килтерә; асыҡтан-асыҡ статус уҡыу һуңғы үткәргестең хәлен иҫбатлай.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

Һуңғы бойороҡ транзакция default `Applied` терминал дәүләткә еткәндән һуң ғына уңышлы була. Һынау иҫбатлауҙа хешты һаҡлағыҙ; бер ҡасан да шәхси асҡысты йәки уның менән тулы клиент конфигурацияһын һаҡлау.

## Проблемаларҙы хәл итеү {#troubleshooting}

- `/livez` кире ҡайтарыу `406` һорағанда JSON сөнки был ахыр сиктә `text/plain`. Ебәрегеҙ `Accept: text/plain` юғарыла күрһәтелгәнсә.
- `/health` йәки `/readyz` `503` машина уҡый торған блокер менән кире ҡайтарырға мөмкин, хатта `/livez` һәм `/status` эшләгәндә лә. Был блокерҙы төҙөп ҡуйығыҙ йәки көтөгөҙ; регенерациялау клавишалары узел әҙерлеген үҙгәртмәйәсәк.
- faucet-тан килгән `502`, көтөү ваҡыты үтеүе йәки иҫкергән proof-of-work якоры — асыҡ хеҙмәттең ваҡытлыса өҙөклөгө. Яңы мәсьәлә алығыҙ һәм бер аҙҙан ҡабатлап ҡарағыҙ.
- I105 префиксы хатаһы асыҡ асҡыс дөрөҫ булмаған профил менән кодланған тигәнде аңлата. `iroha tools address convert --profile taira` ҡабаттан эшләгеҙ.
- Түләү квотаһын кире ҡағыу, ғәҙәттә, вәкәләтле иҫәптең финансланмауын, түләү активтарының метамәғлүмәттәре иҫкергән булыуын йәки асыҡтан-асыҡ түләүсе һайланмағанын аңлата.
- Был canary уңышҡа өлгәшкәндән һуң теркәлеү, минтлау йәки исемдәр арауығын идара итеү кире ҡағылырға мөмкин. Был операциялар өсөн айырым осош ваҡыты рөхсәттәре кәрәк . Уларҙы Taira инеү мөмкинлеге бирелмәгән осраҡта барлыҡҡа килгән локаль селтәр.

## Сығанаҡ һәм уның менән бәйле документтар {#source-and-related-docs}

- [Taira CLI диагностика һәм ҡанатлы сығанаҡ ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/taira.rs)
- [Билдәле commit буйынса асыҡтан-асыҡ түләү һайлап алыу һәм тапшырыу сығанағы CLI](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Taira иҫәбенә һәм faucet күрһәтмәһе](/ba/get-started/sora-nexus-dataspaces.md)
- [Клиент конфигурацияһы](/ba/guide/configure/client-configuration.md)
- [Транзакциялар](/ba/blockchain/transactions.md)
