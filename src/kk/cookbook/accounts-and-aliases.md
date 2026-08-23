---
translation_locale: kk
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 23b3ddbdadb0d177b2b12de60e0947a94ecdb20fa6ee1b3a2c6b83e5c91ba2f3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Тіркелгілер мен аты-жөндер {#accounts-and-aliases}

## Нәтижесі {#outcome}

Доменсіз каноникалықпен қауіпсіз жұмыс істеңіз I105 есеп IDs және жеке байланысқан адам оқитын атаулар, мысалы `treasury@payments.universal`. Сіз тексеруге болады Taira есептер, өз каноникалық ID, және маршрут контекстін жекеменшікпен шатастырмау арқылы аты-жөндерді шешуге болады.

## Алдын ала талаптар {#prerequisites}

- `curl`, `jq`, Python 3.11 немесе одан кейінгі, және `iroha` CLI.
- А `taira.client.toml` бойынша [Қосылу Taira](./connect-to-taira.md) Өзіңнің шотыныңды тексергенде.
- Есепшоттың Taira кран арқылы немесе желідегі реттеліп қосылу жолы арқылы есептік шотқа арналған оқудың табысқа жетуін күтпегеннен бұрын қамтамасыз етілген.

## Қадамдар {#steps}

### 1. Taira бойынша каноникалық есептерді тексеру. {#_1-inspect-canonical-accounts-on-taira}

Мемлекеттiк шоттар тiзбесiнде әрдайым I105 IDs канониклiгi қайтарылады. Негізгі псевдоним ерікті және бөлек жазылады.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

ID `.id` тiгiлiстiк шоттар өрістерi үшiн жарамды. оған домен қоса бермейдi. `.primary_alias` деген атаушыл пайдаланушыға қарасты іздеу кілті болып табылады, басқа да каноникалық сәйкестендiк емес.

### 2. Taira I105 ID дегенді анықтап, қалыпқа келтіру {#_2-derive-and-normalize-your-taira-i105-id}

Жергілікті конфигурациядан тек мемлекеттік кілті ғана оқыңыз. Бір үкiстi мемлекеттiк кілт әртүрлi қоғамдық желi профильдерi үшiн әртүрлі кодталады, сондықтан `taira` дегенді айрықша таңдаңыз.

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

Нормалданған мән `TAIRA_ACCOUNT_ID` дегенге бірдей болуы керек. TOML файлындағы `[account].domain` параметрі `wonderland.universal` болуы мүмкін, бірақ бұл мән маршруттандыру мен атаулы мағынаға ғана әсер етеді.

### 3. Есепті және оның активтерін оқыңыз. {#_3-read-the-account-and-its-assets}

Есепті қамтамасыз еткеннен кейін, оны тікелей сұраңыз және шектелген активтің беттерін келтіріңіз. URL -жолда пайдалану алдында I105 мәнін кодтау.

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

### 4. Тіркелгіңізге байланысты қолданбалы атауларды іздеңіз. {#_4-look-up-aliases-bound-to-the-account}

Кері шешуші бір нақты каноникалық тіркелгі ID қабылдайды. Қоғамдық деректер кеңістігінің жолдарын сұраудың қолтаңбалау бағандарысыз оқи аласыз; шектеулі деректер кеңістіктерінде рұқсат берілген қол қойылған сұрау қажет.

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

`total: 0` жарамды: шотқа псевдоним қажет емес. Егер міндеттеме бар болса, оның нақты толық білікті псевдонимын анықтаңыз және қайтарылған шотты ID салыстырып көріңіз:

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

::: warning Рұқсат беру шегі

Taira кран өзінің талапкерлік есебін қамтамасыз етуі мүмкін, бірақ бұл жалпы есептік жазба немесе атаулы басқару өкілеттігін бермеу. Басқа шотты тіркеу үшін активті растаушының астында `CanRegisterAccount` қажет. Тіркелгі аты-жөні әдетте SNS активті жалға беруді және тиісті аты-жөн рұқсаттарын талап етеді. Басқарушы қосылу/алтын атау планерін пайдаланыңыз немесе құрылған жергілікті желіге қарсы тіркеуді жаттығуыңыз керек.

:::

Жергiлiктi желiде, қауiпсiз қолтаңбалауды қамтамасыз ету сатысы жаңа каноникалық `NEW_ACCOUNT_ID` экспорттағаннан кейiн тiркеу беті:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

Құжаттар мен қолданбалар қоймасының сыртында сәйкес келетін жеке кілтті құру және сақтау. Басқарушы кілті жоққа шығарылған ID тіркелуді пайдаланбайтын есеп жасайды.

## Тексеру {#verify}

Қоғамдық кілтті конфигурациялауды дәлелдеңіз, I105 кодтау және барлық конвергентті біріктіретін атаулар бір каноникалық есепте ID:

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

Қаноникалық тіркелгі IDs. Қолтаңбалар, рұқсаттар және транзакция нұсқаулары үшін IDs кананикалық тіркелгіні пайдаланыңыз. Қолданба шекарасында псевдонимді шешіңіз. Операция үшін пайдаланылған қаноникалық есеп ID сақтаңыз.

## Қиындықтарды шешу {#troubleshooting}

- Параллель немесе префикс қатесі әдетте басқа желі профилі үшін адрес кодталған дегенді білдіреді. `--profile taira` арқылы қалыпқа келтіріңіз және сәйкессіздіктерді бас тарту.
- `202` краннан кейінгі шот `404` таралу кешіктірілуі мүмкін. Жазуды жібергенге дейін шот немесе қаржыландырылған активті тексеріңіз.
- `total: 0` реверс-резолютордан көрінетін аты-жөн жоқ дегенді білдіреді; бұл есептік жазба іздестіру қатесі емес.
- `401` немесе `403` псевдонимдік бағыттан шектеулі деректер кеңістігі немесе жеткіліксіз нақты шешу рұқсаты көрсетіледі.
- Оқиғалы `name@domain.dataspace` мәні барлық жерде қабылданбайды. Қаноникалық I105 ID қажет. Оны алдымен шешу.
- Егер жергілікті шотты тіркеу сәтті болса, бірақ Taira оны бас тартса, айырмашылық рұқсат болып табылады. `CanRegisterAccount` алыңыз; растауды болдырмау үшін ID тіркелгісін өзгертпеңіз.

## Бастапқы және осыған байланысты құжаттар {#source-and-related-docs}

- [Тіркелген міндеттемедегі Canonical тіркелгі адресін іске асыру](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/account/address.rs)
- [Тіркелген commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/tests/accounts_endpoints.rs)-де есептік жазба және псевдоним Torii сынақтары
- [Есепшоттар](/kk/blockchain/accounts.md)
- [Деректер үлгісінің аты-жөні](/kk/blockchain/data-model.md#aliases)
- [Атау конвенциялары](/kk/reference/naming.md)
- [Рұқсат белгілері](/kk/reference/permissions.md)
