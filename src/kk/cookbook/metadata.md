---
translation_locale: kk
translation_source: /cookbook/metadata.md
translation_source_hash: 07b065b28eca44939a92b40a81a47b57178de4539abb0daf51913969e34eced7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Метамәліметтер {#metadata}

## Нәтижесі {#outcome}

Taira бойынша метамәдени деректерді оқыңыз, транзакция үшін айрықша ақы төлеу арқылы бір шоттың метамәдени мәліметін орнатыңыз және тексеріңіз және қайтадан құнды алып тастаңыз.

## Алдын ала талаптар {#prerequisites}

- `curl`, `jq`, Python 3.11 немесе одан кейінгі, және `iroha` CLI.
- Қаржыландырылған `taira.client.toml` және `taira.tx-metadata.json` [ қосылымынан Taira](./connect-to-taira.md).
- Мақсатты есептің метамәліметтері бойынша билік. Мысал конфигурацияланған биліктің өзіне бағытталған; басқа есепке нақты рұқсат қажет.

## Қадамдар {#steps}

### 1. Қолтаңбалаушысыз метамәдени деректерді оқыңыз {#_1-read-metadata-without-a-signer}

Метадеректер - `Name` мен JSON карталарына тексерілген. Бос карталар және бос сүзгіленген шығыс жарамды нәтижелер болып табылады.

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

Кішкентай сипаттамалық немесе индекстеу өрістері үшін метамәліметтерді қолданыңыз. Үлкен пайдалы жүктемелерді кітапханадан алып тастаңыз және URI немесе SoraFS анықтамасын сақтаңыз.

### 2. Мақсатты есептен шығару {#_2-derive-the-target-account}

Taira конфигурациясынан тек мемлекеттік кілтті оқып, оны каноникалық доменсіз I105 нысанға айналдырыңыз.

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

### 3. Бір JSON мәнін келтіріңіз {#_3-set-one-json-value}

Стандартты кірістен оқылған JSON шоттың `cookbook_profile` құнына айналады. Керісінше, `--metadata ./taira.tx-metadata.json` транзакция конвертіне алым өрістерін қосады. Екі картаның мақсаттары мен мақсаты әртүрлі.

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

CLI ақыны келтіреді, қол қояды, ұсынады және әдетті түрде күтеді. келесі операция осы мәнге байланысты болған кезде `--no-wait` қосылмайды.

::: warning Рұқсат беру шегі

Белсенді растаушы әрбір объектіні кім өзгерте алатынын анықтайды. Басқа тіркелгілерді жаңарту үшін әдетте `CanModifyAccountMetadata`; домендер, активтер анықтамасы, NFTs және триггерлер өз мақсатына тән метамәдени рұқсаттарына ие болады. Егер Taira талап етілетін өкілеттік бермеген болса, `./localnet/client.toml` дегенмен бірдей тіркелгі командасын орындаңыз, шығарылған локальдік желілік органның каноникалық I105 ID дегенін ауыстырыңыз және Taira алымның метамәдени деректерін қалдырыңыз.

:::

### 4. Кілтті алып тастаңыз. {#_4-remove-the-key}

Алдымен міндеттемеленген құнын оқыңыз, содан кейін бөлек алып тастау транзакциясын тапсырыңыз.

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

Python өтінімдері үшін сәйкес келетін типті конструкторлар `Instruction.set_account_key_value` және `Instruction.remove_account_key_value`; оларды транзакция метамәліметрімен және [Python нұсқаулығынан күту көмекшісімен бірге тапсырыңыз ](/kk/guide/tutorials/python.md#shared-setup).

## Тексеру {#verify}

Белгіленген операциядан кейін `meta get` нысанды `version: 1` дегенмен қайтаруға тиіс. Алып тасталғаннан кейін, тікелей іздестірудің мәні қайтарылмайды:

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

Бөлек есептік жазбада жоғалған метамәліметтер кілтісін желі немесе есептік жазба қатесінен ажыратады. Өндірістік код оны орнатудан кейін JSON бүкіл мәнін тексеруі керек.

## Қиындықтарды шешу {#troubleshooting}

- Стандарттық кіріс құрамында бір жарамды JSON мән болуы тиіс. Сорларға JSON цитаталар қажет; объектілер мен массивтер жақсы қалыптасқан болуы керек.
- Метадеректер кілттері `Name` мәндері болып табылады және талдаудан кейін жағдайға сезімтал болады. Әр схема өзгерісі үшін нұсқалы кілттерді құрудың орнына тұрақты кілті сөздіктерін сақтаңыз.
- `--metadata` - транзакциялық метамәдени деректер; ол бухгалтерлік кітапша объектісі үшін метамәдени деректерді келтірмейді. Соңғысы үшін кәсіпорынның `meta set` қосалқы командасын қолданыңыз.
- Бұрынғы оқудан кейінгі табысты тапсыру таралу кешіктірілуі мүмкін. Қолданылған қорытындыға дейін күтіңіз және сұрау салуды қайта жіберу алдында қайталап көріңіз.
- Рұқсат беруден бас тарту мақсатты объектіні және билік шекарасын анықтайды. Жергілікті түрде қайталап көріңіз немесе нақты белгі сұраңыз; қол жеткізуді бақылаудан аулақ болу үшін жеке қолданба деректерін қоғамдық метамәліметтер саласына жылжытпаңыз.
- Жеке кілттерді, жеке идентификаторларды, қолжетімділік белгілерін немесе үлкен құжаттарды метадеректерге ешқашан сақтамаңыз.

## Бастапқы және осыған байланысты құжаттар {#source-and-related-docs}

- [Метадеректерді сұрау салуды біріктіру сынақтары pinned commit-те](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/queries/metadata.rs)
- [Python SDK транзакция жасаушылар бекітілген міндеттемеде ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/python/iroha_python/README.md)
- [Метамәліметтер](/kk/blockchain/metadata.md)
- [Метамәліметтер мен кітапша сақтау таңдаулары](/kk/guide/configure/metadata-and-store-assets.md)
- [Нұсқаулық анықтамасы](/kk/reference/instructions.md)
- [Рұқсат белгілері](/kk/reference/permissions.md)
