---
translation_locale: kk
translation_source: /cookbook/metadata.md
translation_source_hash: bb486994faabb29fb48609a886862e44e565148be4800ec1244218ef37e2e54b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Метадеректер {#metadata}

## Нәтиже {#outcome}

Taira туралы метадеректерді оқыңыз, бір есеп шот метадеректерінің мәнін ашық төлем жасалған транзакция арқылы орнатыңыз және тексеріңіз, содан кейін мәнді қайта жойыңыз. Блокчейн жазбасының нысан метадеректерін транзакция төлемі метадеректерінен бөлек сақтайсыз.

## Алдынғы шарттар {#prerequisites}

- `curl`, `jq`, Python 3.11 немесе одан кейінгі нұсқасы, және қазіргі `iroha` CLI.
- [Taira құрылғысына қосылу](./connect-to-taira.md) қаржыландырған `taira.client.toml` және `taira.tx-metadata.json`.
- мақсатты есептік жазбаның метадеректері бойынша авторизациялау бастығы. Мысалда конфигурацияланған авторизациялау бастығының өзі нысана ретінде алынады; басқа есептік жазба дәл рұқсатты қажет етеді.

## Қадамдар {#steps}

### 1. Криптографиялық қолтаңба қойылмаған метадеректерді оқу {#_1-read-metadata-without-a-signer}

Метадеректер тексерілген `Name` ден JSON ге дейінгі карта болып табылады. Бос карталар мен бос сүзілген шығару жарамды нәтижелер болып табылады.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[] \
    | select((.metadata // {} | length) > 0) \
    | {id, name, metadata}'

curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

Кіші сипаттамалық немесе индексациялық өрістер үшін метадеректерді пайдаланыңыз. Үлкен payload-тарды блокчейн тізілімінен тыс орналастырыңыз және оның орнына криптографиялық дайджест мәнін, URI немесе SoraFS сілтемесін сақтаңыз.

### 2. Мақсатты есепшотты шығару {#_2-derive-the-target-account}

Taira баптауынан тек ашық кілтті оқып, оны бір протокол-стандартты доменсіз I105 формасына түрлендіріңіз.

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
```

### 3. Бір JSON мәнін орнатыңыз {#_3-set-one-json-value}

JSON стандартты енгізуден оқылады және есеп шотының `cookbook_profile` мәні болады. Оған қарсы `--metadata ./taira.tx-metadata.json` транзакция деректері контейнеріне төлем өрістерін қосады. Екі картада әртүрлі мақсаттар мен міндеттер бар.

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      --metadata ./taira.tx-metadata.json \
      ledger account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

CLI әдепкі бойынша тарифті көрсетеді, қол қояды, тапсырады және күтеді. Егер келесі операция осы мәнге байланысты болса, `--no-wait` қоспаңыз.

::: warning Рұқсат шегі

Белсенді тексеруші әр нысанды кім өзгерте алатынын шешеді. Басқа есепшотты жаңарту әдетте `CanModifyAccountMetadata` талап етеді; домендер, актив сипаттамалары, NFTs, және триггерлердің өздерінің мақсатқа бағытталған метадеректер рұқсаттары бар. Егер Taira қажетті уәкілетті субъектіні бермеген болса, сол есептік жазба командаларын `./localnet/client.toml` арқылы орындаңыз, жасалған localnet уәкілетті субъектініің бір протокол-стандарт I105 идентификаторын ауыстырыңыз және Taira төлем метадеректер файлын жойыңыз. Анық жергілікті төлем жасаушыны таңдауды сақтаңыз.

:::

### 4. Кілтті шығарыңыз {#_4-remove-the-key}

Алдымен аяқталған мәнді оқып шығыңыз, содан кейін бөлек алып тастау транзакциясын жіберіңіз.

```bash
iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

Python өтініштері үшін сәйкес типтелген құрылысшылар `Instruction.set_account_key_value` және `Instruction.remove_account_key_value`; оларды [Python нұсқаулық](/kk/guide/tutorials/python.md#shared-setup) дан транзакция метадеректерімен және күту көмекшісімен бірге жіберіңіз.

## Растау {#verify}

Орнатылған транзакциядан кейін, `meta get` объектіні `version: 1`-пен қайтаруы керек. Жоюдан кейін тікелей іздеу мәнді қайтармауы керек:

```bash
iroha --config ./taira.client.toml --machine ledger account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile; then
  printf '%s\n' 'metadata key still exists' >&2
  exit 1
else
  printf '%s\n' 'metadata key removed'
fi
```

Бөлек есептік жазба оқуы жоғалған метадеректер кілтін желі немесе есептік жазба жоғалтуымен шатастырмайды. Өндірістік код оны орнатқаннан кейін барлық JSON мәнін тексеруі керек.

## Ақауларды жою {#troubleshooting}

- Стандартты енгізу бір дұрыс JSON мәнін қамтуы керек. Жолдарда JSON тырнақшалар болуы керек; объектілер мен массивтер дұрыс құрылымдалған болуы тиіс.
- Метадеректер кілттері `Name` мәндері болып табылады және оларды талдағаннан кейін регистрге сезімтал болады. Әр схема өзгерісіне арналған нұсқаланған кілттерді жасау орнына тұрақты кілт сөздігін сақтаңыз.
- `--metadata` – бұл транзакцияның метадеректері; ол блокчейн есеп кітабы объектісінің метадеректерін орнатпайды. Соңғылары үшін осы объектінің `meta set` қосалқы пәрменін пайдаланыңыз.
- Ескі оқу арқылы сәтті жіберу таралу кідірісі болуы мүмкін. Қолданылған түпкіліктілікті күтіп, сұрауды қайта жібермес бұрын қайтадан орындап көріңіз.
- Рұқсат беруден бас тарту мақсат объекті мен уәкілетті субъект шекарасын анықтайды. Жергілікті жердегі сынақтарды жүргізіңіз немесе дәл токенді сұраңыз; жеке қолданба деректерін ашық метадеректер өрісіне жылжытпаңыз, рұқсатты бақылауды болдырмау үшін.
- Жеке кілттерді, шикі жеке идентификаторларды, кіру токендерін немесе үлкен құжаттарды метадеректерде ешқашан сақтамаңыз.

## Дереккөз және қатысты құжаттар {#source-and-related-docs}

- [Тұрақты бастапқы код нұсқасындағы метадеректер сұрау интеграциялық тесттері](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/queries/metadata.rs)
- [Python SDK тіркелген бастапқы код нұсқасындағы транзакция құрастырушылары](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/README.md)
- [Метадеректер](/kk/blockchain/metadata.md)
- [Метадеректер және блокчейн тіркеу тізілімін сақтау таңдау](/kk/guide/configure/metadata-and-store-assets.md)
- [Нұсқаулыққа сілтеме](/kk/reference/instructions.md)
- [Рұқсат белгішелері](/kk/reference/permissions.md)
