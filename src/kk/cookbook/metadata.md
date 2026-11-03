---
translation_locale: kk
translation_source: /cookbook/metadata.md
translation_source_hash: 88298912f083d79a9fdfe5e8d0a89d49acb97d814d3871db0c874cb40db5342b
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Метадеректер {#metadata}

## Нәтиже {#outcome}

Taira-дағы метадеректерді оқыңыз, ақыны айқын төлейтін транзакция арқылы бір есептік жазба метадеректерінің мәнін орнатып, тексеріңіз, содан кейін бұл мәнді қайта жойыңыз. Сіз тізілім нысандарының метадеректерін транзакция метадеректерінен бөлек ұстайсыз.

## Алдынғы шарттар {#prerequisites}

- `curl`, `jq`, Python 3.11 немесе одан кейінгі нұсқасы, және қазіргі `iroha` CLI.
- [Taira-ға қосылу](./connect-to-taira.md) нұсқаулығы бойынша қаржыландырылған `taira.client.toml`.
- мақсатты есептік жазбаның метадеректері бойынша авторизациялау бастығы. Мысалда конфигурацияланған авторизациялау бастығының өзі нысана ретінде алынады; басқа есептік жазба дәл рұқсатты қажет етеді.

## Қадамдар {#steps}

### 1. Криптографиялық қолтаңба қойылмаған метадеректерді оқу {#_1-read-metadata-without-a-signer}

Метадеректер тексерілген `Name` ден JSON ге дейінгі карта болып табылады. Бос карталар мен бос сүзілген шығару жарамды нәтижелер болып табылады.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[]
    | select((.metadata // {} | length) > 0)
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

Стандартты кірістен оқылған JSON есептік жазбаның `cookbook_profile` мәніне айналады. `--metadata <file>` арқылы тіркелетін транзакция метадеректері транзакция конвертіндегі бөлек карта болып табылады және ешқашан ақыны таңдамайды: мұны `--fee-payer` пен CLI-дің нақты ақы бағасы жасайды, ал клиент `gas_asset_id`, `gas_limit` немесе `fee_sponsor` кілттері бар транзакция метадеректерін қабылдамайды.

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

CLI қол қоюдан бұрын Taira ақы активіндегі нақты ақы бағасын алады, содан кейін транзакцияны жіберіп, жұмысын аяқтамас бұрын Applied түпкілікті күйін күтеді.

::: warning Рұқсат шегі

Белсенді орындаушы әр нысанды кім өзгерте алатынын шешеді. Басқа есептік жазбаны жаңарту үшін әдетте `CanModifyAccountMetadata` қажет; домендердің, актив анықтамаларының, NFTs және триггерлердің нысанаға тән өз метадеректер рұқсаттары бар. Егер Taira қажетті өкілеттікті бермесе, сол есептік жазба командаларын `./localnet/client.toml` арқылы орындаңыз және жасалған жергілікті желінің уәкілетті субъектісінің канондық I105 ID-ін қойыңыз. Ақы төлеушіні айқын жергілікті таңдауды сақтаңыз.

:::

### 4. Кілтті шығарыңыз {#_4-remove-the-key}

Алдымен аяқталған мәнді оқып шығыңыз, содан кейін бөлек алып тастау транзакциясын жіберіңіз.

```bash
iroha --config ./taira.client.toml --machine account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

Python өтініштері үшін сәйкес типтелген құрылысшылар `Instruction.set_account_key_value` және `Instruction.remove_account_key_value`; оларды [Python нұсқаулық](/kk/guide/tutorials/python.md#shared-setup) дан транзакция метадеректерімен және күту көмекшісімен бірге жіберіңіз.

## Растау {#verify}

Орнатылған транзакциядан кейін, `meta get` объектіні `version: 1`-пен қайтаруы керек. Жоюдан кейін тікелей іздеу мәнді қайтармауы керек:

```bash
iroha --config ./taira.client.toml --machine account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine account meta get \
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

- [Тұрақты бастапқы код нұсқасындағы метадеректер сұрау интеграциялық тесттері](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/queries/metadata.rs)
- [Python SDK тіркелген бастапқы код нұсқасындағы транзакция құрастырушылары](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/python/iroha_python/README.md)
- [Метадеректер](/kk/blockchain/metadata.md)
- [Метадеректер және блокчейн тіркеу тізілімін сақтау таңдау](/kk/guide/configure/metadata-and-store-assets.md)
- [Нұсқаулыққа сілтеме](/kk/reference/instructions.md)
- [Рұқсат белгішелері](/kk/reference/permissions.md)
