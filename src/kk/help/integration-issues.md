---
translation_locale: kk
translation_source: /help/integration-issues.md
translation_source_hash: c5f169e423806fa2a9e9d198971588d1aa0b199a28d64e8b089b9f81727550a5
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Интеграция мәселелерін түзету {#troubleshooting-integration-issues}

Бұл бөлім Iroha 3 интеграциясы үшін ақауларды жою кеңестерін ұсынады. Егер сіз кездестіріп отырған мәселеңіз мұнда сипатталмаған болса, бізге [Телеграм](https://t.me/hyperledgeriroha) арқылы хабарласыңыз.

## Клиент қосыла алмайды {#client-cannot-connect}

Клиент конфигурациясының желі серіктесінің Torii мекенжайына бағытталғанын тексеріңіз:

```toml
torii_url = "http://127.0.0.1:8080/"
```

CLI тексерістері үшін бір файлды нақты көрсетіп өтіңіз:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Егер желідегі серіктес Docker немесе Kubernetes-та жұмыс істесе, клиент процесінен қолжетімді хост немесе қызмет мекенжайын пайдаланыңыз. Контейнер ішіндегі `127.0.0.1` хост машинасы емес.

Қоғамдық Taira тесттер үшін, қолтаңбасыз API ұштау нүкте зондынан бастаңыз:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

Егер осы командалар `502`, TLS, DNS немесе уақытша шығу қателерімен сәтсіз болса, желіге қосылуды түзетіңіз немесе аккаунт кілттері мен транзакция деректерін тексеруден бұрын қоғамдық тесттік желінің API нүктесін күтіңіз.

## Транзакциялар қабылданбады {#transactions-are-rejected}

Көбінесе транзакция сәтсіздіктерінің себебі жеке куәлік немесе авторизация сәйкес келмеуінен болады:

- клиент конфигурациясындағы есептік жазбаның ашық кілті қол қою үшін қолданылған жеке кілтпен сәйкес келмейді
- шот блокчейн генезисінде немесе бұрынғы транзакция арқылы тіркелмеген
- есептік жазбада бағдарламаны іске қосу ортасын тексеруші талап ететін рұқсат белгісі немесе рөл жоқ
- доменнің идентификаторы оның деректер кеңістігінің біліктілігінсіз, мысалы, `domain.dataspace` жоқ

CLI командаларын түзету кезінде қателерді оқуды жеңілдету үшін `--output-format text` пайдаланыңыз:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## Сұраулар бос нәтижелер қайтарады {#queries-return-empty-results}

Бос сұрау нәтижелері әрқашан сұраудың сәтсіз болғанын білдірмейді. Тексеріңіз:

- объектіні жасау керек болған транзакция аяқталды
- сұралған домен, активтің анықтамасы немесе есептік жазба идентификаторы бір протоколдық стандартта
- бағдарламалау немесе сүзгілер күтілген жолды шығарып тастаған жоқ
- клиент мақсатты желіге қосылған, басқа жергілікті желіге емес

Доменді тексеру үшін ең жалпы сұраудан бастаңыз:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## Оқиға немесе блок ағындары ерте тоқтайды {#event-or-block-streams-stop-early}

Блок және оқиға ағыны мысалдары Torii ағынындағы API соңғы нүктелерге сүйенеді. Желілік серіктестің әлі жұмыс істеп тұрғанын тексеріп, содан кейін таймаутпен тексеріңіз:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

HTTP интеграциялары үшін, өзіңіздің API соңғы нүктелер жолдарын қазіргі [Torii API нүкте сілтемесі](/kk/reference/torii-endpoints.md) жолдарымен салыстырыңыз.
