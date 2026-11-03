---
translation_locale: kk
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 31555f0c56bddb8892d09af250cef732a2dfdd39564c83de8b344200157751b9
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Taira құрылғысына қосылу {#connect-to-taira}

## Нәтиже {#outcome}

Taira мекенжайының қолжетімді екенін растаңыз, жергілікті клиент конфигурациясынан бір протоколға сай I105 есепшот идентификаторын шығарыңыз, криптографиялық қолтаңбаны тесттік желідегі XOR қаражатымен қамтамасыз етіңіз және бір төлем көрсетілген Canary транзакциясын жіберіңіз. Бұл рецепт ешқашан Minamoto-ге жазба жібермейді.

## Алдын ала шарттар {#prerequisites}

- `curl`, `jq`, Python 3.11 немесе одан кейінгі нұсқалары, сонымен қатар ағымдағы `iroha` және `kagami` бинарлық файлдар.
- Taira тізбегімен, нақты `network_id` мәнімен, соңғы нүктемен, есептік жазба профилімен және арнайы сынақ желісі кілтімен жасалған `taira.client.toml`. [Taira клиент конфигурациясын жасау](/kk/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) бөлімін орындаңыз және файлды нұсқаларды басқару жүйесінен тыс сақтаңыз.
- Faucet журналы үшін жазуға болатын жұмыс каталогы: `iroha taira account faucet prepare` `./taira-faucet` каталогын тек иесіне қолжетімді етіп жасайды және бар каталогты ауыстырудан бас тартады.

## Қадамдар {#steps}

### 1. Дайындықтан тіршілікті бөліп көрсетіңіз {#_1-separate-liveness-from-readiness}

`/livez`, `/health` және `/readyz` — қарапайым мәтіндік тексерулер; `/status` JSON қайтарады. Жұмыс істеп тұрған түйін консенсусқа қабылдау немесе басқа қажетті ішкі жүйе қолжетімсіз болғанда `/readyz` арқылы әбден орынды түрде `503` қайтаруы мүмкін.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: text/plain, application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

`/livez` тек процестің жауап беретін-бермейтінін анықтау үшін пайдаланыңыз. Трафикті қабылдау үшін `/readyz` пайдаланыңыз. Оның `503` жауабы — бұғаттау себептері көрсетілмеген `service_unavailable` қате конверті, сондықтан оны іркіліс деп санамас бұрын төмендегі диагностиканы орындаңыз.

### 2. Қоғамдық диагностика жүргізу {#_2-run-the-public-diagnostics}

Бұл тек оқу үшін арналған тексеру және криптографиялық қолтаңба баптауларын жүктемейді:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Доктор қатты DNS, TLS, тізбек немесе API соңғы нүкте сәтсіздігін хабарлаған кезде жазуды жалғастырмаңыз. Қаныққан қоғамдық кезек уақытша; күтіп, шектеулі саясатпен қайта әрекет жасаңыз.

### 3. Құпияны басып шығармай Taira есепшот идентификаторын шығарыңыз {#_3-derive-the-taira-account-id-without-printing-a-secret}

Конфигурациядан тек ашық кілтті оқыңыз, содан кейін оны Taira I105 профилімен кодтаңыз. Есептік жазба ID-інде домен болмайды; `[account].profile` тек оның желі префиксін таңдайды.

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

Шығыс нәтижесі доменсіз бір протокол-стандартты I105 мекенжай болып табылады. `wallet@payments.universal` сияқты атаулар ауыспалы атаулар болып табылады және оларды қатаң есептік жазба өрістерінде қолданбас бұрын шешу қажет.

### 4. Ағымдағы Taira ақы активін талап етіңіз {#_4-claim-the-current-taira-fee-asset}

Faucet саясаты ағымдағы ақы активінің анықтамасын атайды. Басқа желіден немесе ескі іске қосудан ID көшірудің орнына оның Base58 ID-ін сақтаңыз. Саясат — қол қойылмаған анықтау деректері, сондықтан автоматтандыру әр жауапқа сенудің орнына өзі күтетін эмитентті, актив анықтамасын және соманы бекітіп қоюы керек.

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

`prepare` жұмыс дәлелін шешеді және нақты қол қойылған транзакцияны сақтайды; `submit` оны бір рет жібереді және транзакция қолданылғаннан кейін қайтады. Егер `submit` `Pending` деп хабарласа немесе уақыты өтіп кетсе, басқа талап дайындаудың орнына сол конфигурация мен журналмен `taira account faucet resume` іске қосыңыз. Содан кейін балансты ең көбі бір минут бойы мезгіл-мезгіл тексеріңіз.

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

Әр Taira жазуы үшін `--fee-payer authority` пайдаланыңыз. Таңдау қолтаңбаға байланған, ал CLI қол қоюдан бұрын Taira ақы активіндегі нақты ақы бағасын алады.

## Растау {#verify}

Журнал нұсқауын жіберіңіз, JSON протоколының нәтижесі жазбасын сақтаңыз және Қолданылған аяқтылықты күтіңіз. `--no-wait` өткізіп жіберу бастапқы жіберуді растауды күтетіндей етеді; нақты статус оқу соңғы бағдарламалық өңдеу жұмыс ағымы күйін дәлелдейді.

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

Соңғы команда нақты жаһандық мәртебе тізілім күйімен расталған `Applied` түпкілікті күйін хабарлағаннан кейін ғана сәтті аяқталады. Хэшті сынақ дәлелдерінде сақтаңыз; онымен бірге жеке кілтті немесе клиенттің толық конфигурациясын ешқашан сақтамаңыз.

## Ақауларды жою {#troubleshooting}

- `/livez`, `/health` және `/readyz` тек JSON сұралғанда `406` қайтарады, себебі олар `text/plain` пішімінде жауап береді. Жоғарыда көрсетілген `Accept` тақырыптарын жіберіңіз.
- `/livez` және `/status` жұмыс істеп тұрса да, `/readyz` `service_unavailable` қате конвертімен `503` қайтаруы мүмкін. Дайындықты күтіңіз немесе `iroha taira doctor` іске қосыңыз; кілттерді қайта жасау түйіннің дайындығын өзгертпейді.
- `submit` кезіндегі faucet `502` жауабы немесе күту уақытының бітуі талаптың нәтижесін белгісіз қалдырады: басқа талап дайындаудың орнына сол конфигурация мен журналмен `taira account faucet resume` іске қосыңыз. Ескірген жұмыс дәлелі тірегі `prepare` кезеңін сәтсіз етеді; жаңа журнал каталогында қайта дайындаңыз.
- I105 префикс қатесі дегеніміз, ашық кілт қате профильмен кодталғанын білдіреді. `iroha tools address convert --profile taira` қайта іске қосыңыз.
- Ақы бағасының қабылданбауы әдетте уәкілетті субъект қаржыландырылмағанын немесе бапталған `network_id` Taira-ға тиесілі емес екенін білдіреді. Жоқ `--fee-payer` немесе `--metadata` ішіндегі `gas_asset_id` сияқты ақы кілті бағаға дейін жергілікті түрде қатеге әкеледі.
- Тіркеу, шығару немесе кеңістік атауларын басқару осы кэнари сәтті болғаннан кейін де қабылданбауы мүмкін. Сол операциялар үшін жеке бағдарламалық қамтамасыз ету орындау ортасының рұқсаттары қажет; оларды Taira рұқсаты берілмеген кезде жасалған жергілікті желіде жаттығыңыз.

## Дереккөз және қатысты құжаттар {#source-and-related-docs}

- Бекітілген нұсқадағы [Taira CLI диагностикасы мен canary коды](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira.rs) және [faucet командалары](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira_onboarding.rs)
- [Ашық төлем таңдау және CLI жіберу көзі бекітілген көз код ревизиясында](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Taira есептік жазба және testnet қаржыландыру қызметінің нұсқаулығы](/kk/get-started/sora-nexus-dataspaces.md)
- [Клиент конфигурациясы](/kk/guide/configure/client-configuration.md)
- [Келісім-шарттар](/kk/blockchain/transactions.md)
