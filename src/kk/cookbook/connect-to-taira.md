---
translation_locale: kk
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: a7347a7e8ea055fd5bab9a34b6124ea19ef6f355f9beef9e9488794d9c6e3202
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Taira телефонына қосылсын {#connect-to-taira}

## Нәтижесі {#outcome}

Бұл туралы растаңыз Taira қол жетімді болып табылады, діни I105 есеп ID жергiлiктi клиент конфигурациясынан тест-нетпен қолтаңбалаушыны қаржыландыру XOR, Бұл рецепт ешқашан хат жібермейді Minamoto.

## Алдын ала талаптар {#prerequisites}

- `curl`, `jq`, Python 3.11 немесе одан кейінгі және ағымдағы `iroha` және `kagami` бинарлықтар.
- А `taira.client.toml` құрылған Taira тізбек, соңғы нүкте, шот профилі және арнаулы тест-нет кілті. [Құрылыңыз Taira Клиентті баптау](/kk/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) және файлды көздің бақылауынан тыс қалдырыңыз.
- Қолданысқа дайын `taira_faucet_claim.py` [Get Testnet XOR Taira](/kk/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)-де, клиент конфигурациясының жанында сақталған.

## Қадамдар {#steps}

### 1. Жүректілік пен дайындықтың ерекшелігі {#_1-separate-liveness-from-readiness}

`/livez` - жай мәтінді процестер ұзақтығына арналған зонд. `/status`, `/health` және `/readyz` қайтару JSON. Ағымдағы түйінді қажетті қосалқы жүйе бұғатталған кезде дайындық зондтарынан заңды түрде `503` қайтаруға болады.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

`503` процесінің жауап бере ме, жоқ па екенін шешу үшін ғана `/livez` қолданыңыз. `/readyz`-ді трафикті кіргізу үшін және JSON блоктарының деректерін тексеріңіз.

### 2. Қоғамдық диагностикаларды жүргізу {#_2-run-the-public-diagnostics}

Бұл тексеру тек оқуға арналған және қолтаңбалаушы параметрін жүктемейді:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Дәрігер қатты DNS, TLS, шынжыр немесе аяқталу нүктесі сәтсіздікке ұшыраған кезде жазуды жалғастырыңыз. Халықтың толы кезегі өткінші; күтіңіз және шектелген саясатпен қайталап көріңіз.

### 3. Taira тіркелгіні ID құпиясын басып шығармай шығару. {#_3-derive-the-taira-account-id-without-printing-a-secret}

Тек конфигурациядан ашық кілтті оқып, кейін оны Taira I105 профилімен кодтау. `[account].domain` мәні маршруттау контекстін береді; ол ID шотының бөлігі емес.

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

Шығу доменсіз каноникалық I105 мекенжайы болып табылады. `wallet@payments.universal` сияқты атаулар псевдонимдер болып табылады және олар қатаң шоттар өрістерінде пайдаланылмастан бұрын шешілуі керек.

### 4. ағымдағы Taira алым активін талап ету {#_4-claim-the-current-taira-fee-asset}

Файл активтерінің анықтамасы үшін faucet жауап шындық көзі болып табылады. Қайта келтірілген Base58 ID басқа желіден немесе ескі Run-дан ID көшірмелеудің орнына сақталсын.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

Блансты ең көп дегенде бір минутқа тексеріңіз. Фаннанс транзакциясы көрінуі алдында кран `202 Accepted` қайтарылуы мүмкін.

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

`gas_asset_id` - транзакция метамәдени деректері. `--fee-payer authority` айқын таңдау қолтаңбаға байланысты, ал CLI қолтаңбалауға дейін нақты алымды алады.

## Тексеру {#verify}

JSON квитанциясын сақтаңыз және қолданылған қорытындыны күтіңіз. `--no-wait` шығару бастапқы тапсырысты растауға дейін күтеді; айқын мәртебе оқу түпкілікті құбыр желісінің жай-күйін дәлелдеді.

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

Соңғы команда транзакция әдеттегі `Applied` терминалдық күйге жеткеннен кейін ғана сәтті болады. Тест дәлелдемелерінде хешты сақтаңыз; ешқашан жеке кілті немесе клиенттің толық конфигурациясын онымен сақтауға болмайды.

## Қиындықтарды шешу {#troubleshooting}

- `/livez` қайтару `406` сұралған кезде JSON себебі бұл соңғы нүкте `text/plain`. Жіберу `Accept: text/plain` жоғарыда көрсетілгендей.
- `/health` немесе `/readyz` `503` машинамен оқылатын блокермен қайтарылуы мүмкін, тіпті `/livez` және `/status` жұмыс істеп тұрған кезде де. Бұл блокерді орнату немесе күту; регенерациялық кілттер түйіннің дайындығын өзгертпейді.
- `502`, уақыт үзілісі, немесе ескірген жұмыс дәлелді бекіткіш - мемлекеттік қызмет сәтсіздік. Жаңа жұмбақ алып, кейін қайталап көріңіз.
- Қалған I105 префикс қатесі қоғамдық кілттің дұрыс емес профильмен кодталғандығын білдіреді. Қайта орындау `iroha tools address convert --profile taira`.
- Төлемақы квотасының қабылданбауы, әдетте, уәкілетті орган қаржыландырылмағандығына, төлемақы активінің метамәдени деректері ескіргендігіне немесе нақты төлем төлеуші табылмағандығын білдіреді.
- Бұл канарлық табысқа жеткеннен кейін тіркелу, майдалау немесе атау кеңістігін басқару әлі де бас тартылуы мүмкін. Бұл операциялар жеке орындалу уақытын рұқсат етуді қажет етеді . Taira қосылымына рұқсат етілмеген кезде құрылған жергілікті желі.

## Бастапқы және осыған байланысты құжаттар {#source-and-related-docs}

- [Taira CLI диагностикасы және канарлық шығу тегі түймеленген commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/taira.rs)
- [Шекті төлемді таңдау және CLI тапсыру көзін бекітілген міндеттемеде](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs).
- [Taira шот және кран нұсқаулығы](/kk/get-started/sora-nexus-dataspaces.md)
- [Клиенттің конфигурациясы](/kk/guide/configure/client-configuration.md)
- [Транзакциялар](/kk/blockchain/transactions.md)
