---
translation_locale: ba
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 31555f0c56bddb8892d09af250cef732a2dfdd39564c83de8b344200157751b9
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Taira-ға тоташыу {#connect-to-taira}

## Һөҙөмтә {#outcome}

Taira-ның асыҡ булыуын раҫлағыҙ, урындағы client configuration-дан canonical I105 account ID-ны сығарығыҙ, signer-ҙы testnet XOR менән финансланығыҙ һәм fee-quoted canary transaction-ды тапшырығыҙ. Был recipe Minamoto-ға бер ҡасан да write ебәрмәй.

## Шарттар {#prerequisites}

- `curl`, `jq`, Python 3.11 йәки унан һуңғы, һәм хәҙерге `iroha` һәм `kagami` бинарҙар.
- Taira сылбыры, теүәл `network_id`, тоташыу нөктәһе, иҫәп профиле һәм махсус һынау селтәре асҡысы менән булдырылған `taira.client.toml`. [Taira клиент конфигурацияһын булдырыу](/ba/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) күрһәтмәһенә эйәрегеҙ һәм файлды сығанаҡ код контроленән ситтә тотоғоҙ.
- Faucet журналы өсөн яҙыу мөмкин булған эш каталогы: `iroha taira account faucet prepare` `./taira-faucet` каталогын шәхси инеү хоҡуҡтары менән булдыра һәм булған каталогты алмаштырыуҙан баш тарта.

## Аҙымдар {#steps}

### 1. Яҡшылыҡ менән әҙерлек араһындағы айырма {#_1-separate-liveness-from-readiness}

`/livez`, `/health` һәм `/readyz` — ябай текст ҡайтарған тикшереү нөктәләре; `/status` JSON ҡайтара. Консенсусҡа ҡабул итеү йәки башҡа кәрәкле подсистема мөмкин булмағанда, эшләп торған узелдың `/readyz`-тан `503` ҡайтарыуы тулыһынса дөрөҫ.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: text/plain, application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

`/livez`-ты процесс яуап бирәме-юҡмы икәнен хәл итеү өсөн генә ҡулланығыҙ. `/readyz`-ты трафикты ҡабул итеү өсөн ҡулланығыҙ. Уның `503` яуабы — блоклау сәбәбе күрһәтелмәгән `service_unavailable` хата конверты, шуға күрә уны хеҙмәт өҙөклөгө тип һанағансы түбәндәге диагностиканы үткәрегеҙ.

### 2. Халыҡ-ара диагностикаларҙы үткәреү {#_2-run-the-public-diagnostics}

Был тикшереү уҡырға ғына һәм ҡултамғалаусының конфигурацияһын йөкләмәмәй:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Табип ауыр DNS, TLS, сылбыр йәки йомғаҡлау пункты боҙолғанын хәбәр итһә, яҙыуҙы дауам итмәгеҙ. Халыҡтың тығыҙ сиратта тороуы - ваҡытлыса; көтөп, сикләнгән сәйәсәт менән тағы ла һынап ҡара.

### 3. сығарыу Taira иҫәбенә ID йәшерен нәмәне баҫмайынса {#_3-derive-the-taira-account-id-without-printing-a-secret}

Конфигурациянан асыҡ асҡысты ғына уҡығыҙ, һуңынан уны Taira I105 профиле менән кодлағыҙ. Иҫәп ID-һында домен юҡ; `[account].profile` уның селтәр префиксын ғына һайлай.

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

Faucet сәйәсәте ағымдағы түләү активы билдәләмәһен атай. Башҡа селтәрҙән йәки иҫке эшләтеүҙән ID күсереү урынына уның Base58 ID-һын һаҡлағыҙ. Сәйәсәт — ҡул ҡуйылмаған асыҡлау мәғлүмәттәре, шуға күрә автоматлаштырыу һәр яуапҡа ышаныу урынына үҙе көткән эмитентты, актив билдәләмәһен һәм сумманы беркетергә тейеш.

```bash
curl -fsS -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/faucet/policy \
  | tee taira-faucet-policy.json

export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` proof-of-work мәсьәләһен сисә һәм ҡул ҡуйылған теүәл транзакцияны һаҡлай; `submit` уны бер тапҡыр ебәрә һәм транзакция ҡулланылғандан һуң ғына эшен тамамлай. Әгәр `submit` `Pending` хәбәр итһә йәки уның ваҡыты сыҡһа, тағы бер һорау әҙерләү урынына шул уҡ конфигурация һәм журнал менән `taira account faucet resume` эшләтегеҙ. Һуңынан балансты иң күбе бер минут дауамында тикшереп тороғоҙ.

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

Taira-ға һәр яҙыу өсөн `--fee-payer authority` ҡулланығыҙ. Был һайлау ҡултамғаға бәйләнгән, һәм CLI ҡул ҡуйыр алдынан теүәл комиссияны Taira-ның түләү активында иҫәпләп күрһәтә.

## Тикшереү {#verify}

JSON квитанцияһын һаҡлап ҡалыу һәм ҡулланылған тамамланыуын көтөп тороу. `--no-wait` тапшырыу шулай уҡ тәүге тапшырыуҙы раҫлауын көткәнгә килтерә; асыҡтан-асыҡ статус уҡыу һуңғы үткәргестең хәлен иҫбатлай.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  tx ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  tx status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

Һуңғы команда теүәл глобаль статус реестр торошо буйынса раҫланған `Applied` һуңғы торошон хәбәр иткәндән һуң ғына уңышлы тамамлана. Хешты һынау дәлилдәрендә һаҡлағыҙ; уның менән бергә шәхси асҡысты йәки тулы клиент конфигурацияһын бер ҡасан да һаҡламағыҙ.

## Проблемаларҙы хәл итеү {#troubleshooting}

- `/livez`, `/health` һәм `/readyz` тик JSON һоралғанда `406` ҡайтара, сөнки улар `text/plain` форматында яуап бирә. Өҫтә күрһәтелгән `Accept` башлыҡтарын ебәрегеҙ.
- `/livez` һәм `/status` эшләгәндә лә `/readyz` `service_unavailable` хата конверты менән `503` ҡайтарырға мөмкин. Әҙерлекте көтөгөҙ йәки `iroha taira doctor` эшләтегеҙ; асҡыстарҙы яңынан булдырыу узелдың әҙерлеген үҙгәртмәй.
- `submit` ваҡытында faucet-тан килгән `502` йәки ваҡыт сығыуы һорауҙың һөҙөмтәһен билдәһеҙ ҡалдыра: тағы бер һорау әҙерләү урынына шул уҡ конфигурация һәм журнал менән `taira account faucet resume` эшләтегеҙ. Иҫкергән proof-of-work якоры `prepare`-ҙы уңышһыҙлыҡҡа килтерә; яңы журнал каталогында ҡабат әҙерләгеҙ.
- I105 префиксы хатаһы асыҡ асҡыс дөрөҫ булмаған профил менән кодланған тигәнде аңлата. `iroha tools address convert --profile taira` ҡабаттан эшләгеҙ.
- Комиссия иҫәбенең кире ҡағылыуы, ғәҙәттә, вәкәләтле иҫәптең финансланмағанын йәки көйләнгән `network_id` Taira-ныҡы түгеллеген аңлата. `--fee-payer` булмаһа йәки `--metadata` эсендә `gas_asset_id` кеүек комиссия асҡысы булһа, команда комиссия иҫәбенә тиклем үк локаль уңышһыҙлыҡҡа осрай.
- Был canary уңышҡа өлгәшкәндән һуң теркәлеү, минтлау йәки исемдәр арауығын идара итеү кире ҡағылырға мөмкин. Был операциялар өсөн айырым осош ваҡыты рөхсәттәре кәрәк . Уларҙы Taira инеү мөмкинлеге бирелмәгән осраҡта барлыҡҡа килгән локаль селтәр.

## Сығанаҡ һәм уның менән бәйле документтар {#source-and-related-docs}

- Ҡуйылған commit-тағы [Taira CLI диагностикаһы һәм контроль транзакция сығанаҡ коды](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira.rs) һәм [faucet командалары](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira_onboarding.rs)
- [Билдәле commit буйынса асыҡтан-асыҡ түләү һайлап алыу һәм тапшырыу сығанағы CLI](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Taira иҫәбенә һәм faucet күрһәтмәһе](/ba/get-started/sora-nexus-dataspaces.md)
- [Клиент конфигурацияһы](/ba/guide/configure/client-configuration.md)
- [Транзакциялар](/ba/blockchain/transactions.md)
