---
translation_locale: kk
translation_source: /help/integration-issues.md
translation_source_hash: f9f8a1e5f8c66714532523ef40467d3e79d4d023b3b353244f0317647e755b38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Интеграция мәселелерін шешу {#troubleshooting-integration-issues}

Бұл бөлімде Iroha 3 интеграциясы үшін қателерді шешу кеңестері ұсынылады. Егер сіз кездесіп жатқан мәселе осы жерде сипатталмаған болса, бізге [Telegram](https://t.me/hyperledgeriroha) арқылы хабарласыңыз.

## Клиент қосылу мүмкін емес {#client-cannot-connect}

Клиенттің конфигурациясы теңгерімнің Torii мекенжайына сілтейтінін тексеріңіз:

```toml
torii_url = "http://127.0.0.1:8080/"
```

CLI тексерулер үшін дәл осы файлды айқын түрде тапсырыңыз:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Егер теңгерімнің кіргені Docker немесе Kubernetes, клиент процесінен қол жеткізуге болатын хост немесе қызмет адресін қолданыңыз. `127.0.0.1` контейнердің ішіне қоныс аударған машина емес.

Қоғамдық Taira сынақтар үшін қолтаңбаланбаған аяқталу нүктесі зондпен бастаңыз:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

Егер осы командалар `502`, TLS, DNS немесе уақыт үзіліс қателерімен сәтсіздікке ұшыраса, желіге қол жетімділікті түзеңіз немесе тіркелгі кілттерін немесе транзакция жүктемелерін ақаусызданғаннан кейін қоғамдық тест-нет соңғы нүктесін күтіңіз.

## Транзакциялар қабылданбады {#transactions-are-rejected}

Транзакциялардың көпшілігі сәйкестік немесе рұқсаттың сәйкессіздікінен туындаған:

- клиенттің конфигурациясындағы шоттың мемлекеттік кілті қолтаңбалау үшін пайдаланылатын жеке кілтіне сәйкес келмейді
- шот генезисте немесе алдыңғы транзакция бойынша тіркелмеген
- тіркелгіде орындалу уақытын растаушы талап ететін рұқсат белгісі немесе рөлі жоқ
- ID доменде `domain.dataspace` сияқты деректер кеңістігінің біліктілігі жоқ

`--output-format text` командаларын ақауларды оқуға жеңілдету үшін CLI параметрлерін дебелдеу кезінде пайдаланыңыз:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## Сұрау салулар бос нәтижелерді береді {#queries-return-empty-results}

Сұрау салудың бос нәтижелері әрдайым сұрау салу сәтсіздікке ұшырамайды.

- нысанды құруға тиіс транзакция жасалған
- Сұрау салынған домен, активтің анықтамасы немесе шот ID каноникалық болып табылады
- бетбелгілеу немесе сүзгілер күтпеген жолды жоққа шығармайды
- клиент жоспарланған желіге қосылған, басқа жергілікті желі емес

Доменді тексеру үшін ең кең сұраныспен бастаңыз:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## Іс-шара немесе блок ағыны ерте тоқтатылады {#event-or-block-streams-stop-early}

Блок пен оқиға ағындарының мысалдары Torii ағызу аяқ нүктелеріне негізделеді. Пайдаланушының әлі де орындалғанын тексеріңіз, содан кейін уақыт үзілісімен сынаңыз:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

HTTP интеграциялары үшін аяқтық нүкте жолдарын ағымдағы [Torii аяқтық нүктенің сілтемесі](/kk/reference/torii-endpoints.md)мен салыстыру.
