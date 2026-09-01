---
translation_locale: kk
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: e14be7d9314f26f40f6aa30678fddcfcfea39eda9b98016f1b2f84838203c548
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Taira құрылғысына қосылу {#connect-to-taira}

## Нәтиже {#outcome}

Taira мекенжайының қолжетімді екенін растаңыз, жергілікті клиент конфигурациясынан бір протоколға сай I105 есепшот идентификаторын шығарыңыз, криптографиялық қолтаңбаны тесттік желідегі XOR қаражатымен қамтамасыз етіңіз және бір төлем көрсетілген Canary транзакциясын жіберіңіз. Бұл рецепт ешқашан Minamoto-ге жазба жібермейді.

## Алдын ала шарттар {#prerequisites}

- `curl`, `jq`, Python 3.11 немесе одан кейінгі нұсқалары, сонымен қатар ағымдағы `iroha` және `kagami` бинарлық файлдар.
- Taira тізбегімен, API соңғы нүктесімен, есептік жазба профилімен және арнайы тестнет кілтімен жасалған `taira.client.toml`. [Taira Клиент Конфигін жасау](/kk/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config)-ге сәйкес орындаңыз және файлды көз бақылауынан тыс ұстаңыз.
- Клиент конфигурациясының жанында сақталған [Taira сайтынан XOR тест желісін алыңыз](/kk/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) компаниясынан дайын іске қосылатын `taira_faucet_claim.py`.

## Қадамдар {#steps}

### 1. Дайындықтан тіршілікті бөліп көрсетіңіз {#_1-separate-liveness-from-readiness}

`/livez` – қарапайым мәтінді процессінің тіршілік тексерісі. `/status`, `/health` және `/readyz` JSON қайтарады. Жұмыс жасап тұрған түйін қажетті подсистема бөгетке ұшыраған кезде дайындығын тексерулерден заңды түрде `503` қайтара алады.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

`/livez`-ды тек қана процестің жауап береді ме жоғын шешу үшін қолданыңыз. `/readyz`-ді трафик қабылдау үшін қолданыңыз және `503`-ды істен шығу деп қарастырмас бұрын оның JSON блокерінің мәліметтерін тексеріңіз.

### 2. Қоғамдық диагностика жүргізу {#_2-run-the-public-diagnostics}

Бұл тек оқу үшін арналған тексеру және криптографиялық қолтаңба баптауларын жүктемейді:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Доктор қатты DNS, TLS, тізбек немесе API соңғы нүкте сәтсіздігін хабарлаған кезде жазуды жалғастырмаңыз. Қаныққан қоғамдық кезек уақытша; күтіп, шектеулі саясатпен қайта әрекет жасаңыз.

### 3. Құпияны басып шығармай Taira есепшот идентификаторын шығарыңыз {#_3-derive-the-taira-account-id-without-printing-a-secret}

Тек конфигурациядан ашық кілтті оқып, содан кейін оны Taira I105 профилімен кодтаңыз. `[account].domain` мәні маршрутизация контекстін қамтамасыз етеді; ол есепшот идентификаторының бөлігі емес.

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

Тестнет қаржыландыру қызметінің жауабы төлем активінің анықтамасы үшін шынайы дереккөз болып табылады. Басқа желіден немесе ескі іске қосылымнан алынған ID орнына қайтарылған Base58 ID-ді сақтаңыз.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

Балансқа ең көп бір минутқа сұрау салу жасаңыз. Тестнет қаржыландыру қызметі қаржыландыру транзакциясы көрінбестен бұрын `202 Accepted` қайтара алады.

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

`gas_asset_id` - бұл транзакция метадеректері. Ашық `--fee-payer authority` таңдауы қолтаңбаға байланған, ал CLI қолтаңба қою алдында дәл төлем бағасын алады.

## Растау {#verify}

Журнал нұсқауын жіберіңіз, JSON протоколының нәтижесі жазбасын сақтаңыз және Қолданылған аяқтылықты күтіңіз. `--no-wait` өткізіп жіберу бастапқы жіберуді растауды күтетіндей етеді; нақты статус оқу соңғы бағдарламалық өңдеу жұмыс ағымы күйін дәлелдейді.

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

Соңғы команда транзакция әдепкі `Applied` терминалдық күйге жеткеннен кейін ғана сәтті болады. Криптографиялық хэшті тестілеу дәлелдерінде сақтаңыз; жеке кілтті немесе толық клиент конфигурациясын ешқашан бірге сақтамаңыз.

## Ақауларды жою {#troubleshooting}

- `/livez` JSON сұралған кезде `406` қайтарады, себебі бұл API соңғы нүктесі `text/plain`. Жоғарыда көрсетілгендей `Accept: text/plain` жіберіңіз.
- `/health` немесе `/readyz` `/livez` және `/status` жұмыс істеп тұрған кезде де машина оқуға арналған блокермен `503` қайтаруы мүмкін. Сол блокерді түзетіңіз немесе күтіңіз; кілттерді қайта жасау түйіннің дайын болуын өзгертпейді.
- Тесттік желі қаржыландыру қызметі `502`, уақыттың өтуі немесе ескірген жұмыс дәлелі тірегі қоғамдық қызметтің сәтсіздігі болып табылады. Жаңа жұмбақ алыңыз да кейін қайта көріңіз.
- I105 префикс қатесі дегеніміз, ашық кілт қате профильмен кодталғанын білдіреді. `iroha tools address convert --profile taira` қайта іске қосыңыз.
- Төлем ақысын қабылдамау әдетте рұқсат берушінің қаражаты бөлінбегенін, төлем активінің метадеректері ескіргенін немесе нақты төлем жасаушы таңдалмағанын білдіреді.
- Тіркеу, шығару немесе кеңістік атауларын басқару осы кэнари сәтті болғаннан кейін де қабылданбауы мүмкін. Сол операциялар үшін жеке бағдарламалық қамтамасыз ету орындау ортасының рұқсаттары қажет; оларды Taira рұқсаты берілмеген кезде жасалған жергілікті желіде жаттығыңыз.

## Дереккөз және қатысты құжаттар {#source-and-related-docs}

- [Taira CLI диагностика және канариялық көзі бекітілген исход код ревизиясында](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/taira.rs)
- [Ашық төлем таңдау және CLI жіберу көзі бекітілген көз код ревизиясында](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Taira есептік жазба және testnet қаржыландыру қызметінің нұсқаулығы](/kk/get-started/sora-nexus-dataspaces.md)
- [Клиент конфигурациясы](/kk/guide/configure/client-configuration.md)
- [Келісім-шарттар](/kk/blockchain/transactions.md)
