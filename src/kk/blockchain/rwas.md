---
translation_locale: kk
translation_source: /blockchain/rwas.md
translation_source_hash: 80593515d6919a6b6cb282ddcd4903ce000b56b264f350a42a6ed792f9cbef73
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Реалдық дүниедегі активтер {#real-world-assets}

Реалдық әлемдегі активтер (RWAs) - шынжырдан тыс активтердің үлгісі, олардың иесі немесе бақылауы шынжырда бақыланады. Iroha - RWA - генериленген сәйкестендіруші, меншік иесінің есебі, мөлшері, бизнес метамәліметтері, шығу тегі және өмірлік циклді басқаратын ерікті тіркелді кітапша лот.

RWAs сандық активтердің баланстарынан өзгеше:

- сандық актив - шотта ұсталған күшеюлейтін баланс
- NFT - бір меншік иесі бар бірегей тізбектегі жазба
- RWA - бизнес метадеректерін, мөлшерін, ұстауды, тоңазытуды, төлемді өтеу жағдайын, шығу тегін және бақылаушы саясатын қамтитын партия

RWAs дегенді пайдалану, егер бухгалтерлік кітапшада тек қосалқы баланстың орнына белгілі бір тізбектен тыс партияны білдіру қажет болса.

## RWA партиясы {#rwa-lot}

RWA партиясында мыналар бар:

- `id`: пайдаланған каноникалық RWA сәйкестендіруші, `<hash>$<domain>` ретінде көрсетіледі
- `owned_by`: партияның қазіргі иелігінде тұрған шот
- `quantity`: партиямен білдірілген қалдық мөлшері
- `spec`: сандық сипаттама, мысалы оншалық масштаб
- `primary_reference`: тізбектен тыс негізгі квитанция, сертификат, шот немесе тіркелімнің анықтамасы
- `status`: бизнес-статустың нұсқауы
- `metadata`: бизнес контекстінде және индекстеу үшін пайдаланылатын компактты JSON өрістері
- `parents`: осы партияны алу үшін пайдаланылған бастапқы партиялары
- `controls`: бақылаушының шоттары, бақылаушының рөлдері және рұқсат етілген бақылаушы операциялары
- `is_frozen` және `held_quantity`: өмірлік циклдегі жұмыс уақытына байланысты орындалатын жағдай

Желідегі пайдалы жүктемені компакт сақтаңыз. Үлкен заң құжаттарын, инспекциялық есептерді және аудит топтамаларын WSV сыртына сақтау, содан кейін URI, SoraFS жолы немесе RWA метамәдени деректеріне анықтамасы қойыңыз.

## Идентификаторлар {#identifiers}

`RegisterRwa` шақырушы таңдаған `id` тіркелгісін қабылдамайды және `owner` өрісін қабылдамайды. Транзакция өкіметі бастапқы `owned_by` тіркелгісіне айналады, ал орындау уақыты мақсатты домендегі `RwaId` тіркелгісі пайда болады.

RWA ID дегеннің мәтіндік нысаны:

```text
<generated-hash>$<domain>
```

Мысалы:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

Өтініштер өздерінің бизнес сәйкестендіруін `primary_reference` немесе `metadata` деп сақтау керек, содан кейін транзакция міндеттемелерін орындағаннан кейін құрылған `RwaId` `RwaEvent::Created`, `FindRwas`, `/v1/rwas` немесе іздеуші бағытын анықтау керек.

## Өмір циклі {#lifecycle}

Әдеттегі RWA жұмыс жүрістері:

|Операция |Қолданылған мінез-құлық |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
|`RegisterRwa` |Доменде ID пайдаланған лотты құру; транзакция өкілі `owned_by` болады. |
|`TransferRwa` |Кілікті басқа тіркелгіге көшіру. Толық аударым `owned_by` өзгерте алады; ішінара аударым балалар партиясын құрады. |
|`HoldRwa` |Резервтік мөлшері. Конфигурацияланған басқарушы және `hold_enabled` қажет. |
|`ReleaseRwa` |Қалған мөлшерді алып тастаңыз. Конфигурацияланған басқарушы және `hold_enabled` қажет. |
|`FreezeRwa` |Әдеттегі меншік иесінің операцияларын бөлеңіз. Конфигурацияланған басқарушы және `freeze_enabled` қажет. |
|`UnfreezeRwa` |Әдеттегі меншік иесінің жұмысын қайта қосу. Конфигурацияланған басқарушы және `freeze_enabled` қажет. |
|`RedeemRwa` | Қорытындылай келе, "Қаршы айлық" АҚ-ның `redeem_enabled`.                                                  |
|`MergeRwas` |Ата-аналар партиясынан бір доменді және ерекшелікті біріктіріп, балалар партиясына айналдыру. |
|`ForceTransferRwa` |Кілікті басқарушы ағыны арқылы жылжыту. Конфигурацияланған басқарушы және `force_transfer_enabled` қажет. |
|`SetRwaControls` |Партияны бақылау саясатын ауыстыру.|
|`SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |Партияның метамәдени деректерін жаңарту. Иесін немесе бақылаушыны қажет етеді; тоңазытылған партияларға контроллер қажет. |

Ағымдағы кодта `UnregisterRwa` нұсқау жоқ. Көрсетiлген сандар жеткiзiлгенде, жетілгенде, есептелгенде немесе айналыстан шығарылғанда `RedeemRwa` деген сызықтан тыс партияны алып тастау керек.

## Метамәліметтер және бақылау {#metadata-and-controls}

Қолданбаларға партияны анықтауға және тексеруге көмектесетін жинақталған фактілер үшін метамәдени деректерді қолдану:

- активтер класына, эмитентке, депозитарийге немесе тізілімге сілтеме жасау
- қойма, қоршау, ISIN, шот немесе сертификаттың сәйкестендіру белгілері
- куәліктер мен құқықтық құжаттарға арналған мазмұндағы хештар
- SoraFS үлкен дәлелдеме топтамалары үшін жолдар немесе манифесттік сілтемелер
- тізбектен тыс қызметтерде пайдаланылатын мерзімінен кейінгі кезеңділік, құзыреттілік немесе сәйкестік белгілері

Қолданылған `RwaControlPolicy` мынадай өрістерді қамтиды:

```json
{
  "controller_accounts": [],
  "controller_roles": [],
  "freeze_enabled": true,
  "hold_enabled": true,
  "force_transfer_enabled": false,
  "redeem_enabled": true
}
```

Бақылаушы тіркелгілері мен рөлдері тек тиісті бульдік белгімен рұқсат етілген бақылаушы операцияларын ғана орындауға рұқсат етіледі.Қазіргі басқару жүктемесі рұқсат етілген тізімдерді беру саясаты болып табылмайды және ошақталған `transfers` ережелерді қамтылмайды.

## Сұрақтар, оқиғалар және APIs {#queries-events-and-apis}

Пайдалану [`FindRwas`](/kk/reference/queries.md#assets-nfts-and-rwas) тіркелген тізімге RWA Тікелей жаңартуды қажет ететін қолданбалар [`Rwa` деректер оқиғалары](/kk/blockchain/filters.md#data-event-filters) құрылған, иесін өзгерткен, бөлінген, біріктірілген, сатып алынған, мұздатылған, мұздалмаған, ұсталған, босатылған, күшпен көшірілген, басқаруды өзгерткен, және метамәдени оқиғалар.

Torii `/v1/rwas` және `/v1/rwas/query` сияқты тізбектік-мемлекеттік бағыттарды, сондай-ақ осы маршрут отбасы рұқсат етілген кезде `/v1/explorer/rwas` және `/v1/explorer/rwas/{rwa_id}` сияқты зерттеуші бағыттарын ашады. Жаратылған клиенттер түйіннің нақты жауап пішіні үшін тірі [`/openapi`](/kk/reference/torii-endpoints.md#common-endpoints) құжатын артық көруі керек.

### Taira арқылы сынап көріңіз. {#try-it-on-taira}

Қоғамдық Taira қазір RWA партияларын тіркегенін тексеріңіз:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

Тірі Taira OpenAPI құжатында көрсетілген RWA жолдарын келтіріңіз:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

Ашық `items` шығарылымы әлі тіркелмеген кезде күтіледі. Тіркеу, көшіру, ұстау, тоңазыту және өтеу қол қойылған операциялар болып табылады.

## Сынап көр . {#try-it}

Төмендегі мысалдар Python SDK беттерінен [Ортақ орнату](/kk/guide/tutorials/python.md#shared-setup). Есепті ауыстыру IDs, жеке кілттер және пайдаланған партия IDs транзакцияны тапсырудан бұрын өз желіңізден алынған мәндермен.

### RWA API жолдарын ашу {#discover-rwa-api-routes}

Бұл тек оқуға арналған мысал жүретін Torii түйіннен қолданбаға қарасты RWA бағыттары рұқсат етілетінін сұрайды:

```python
from iroha_python import create_torii_client

client = create_torii_client("https://taira.sora.org")
openapi = client.request_json("GET", "/openapi", expected_status=(200,))

rwa_paths = sorted(
    path for path in openapi.get("paths", {}) if path.startswith("/v1/rwas")
)

for path in rwa_paths:
    print(path)
```

Егер тізім бос болса, түйін RWA нұсқауларын және басқа Torii APIs арқылы сұратуларды қолдауы мүмкін, бірақ ол JSON бағыт отбасын жоққа шығармайды.

### Қойманың квитанциясын тіркеңіз {#register-a-warehouse-receipt}

Бір бизнес-әрекет бір қол қойылған транзакцияға айналған кезде жобаны пайдаланыңыз. Бизнес квитанциясының нөмірі `primary_reference`; негізгі кітапша ID транзакцияның міндеттемелерін қабылдағаннан кейін құрылады.

```python
from iroha_python import TransactionConfig, TransactionDraft

config = TransactionConfig(
    chain_id=CHAIN_ID,
    authority=alice,
    metadata={**TX_METADATA, "source": "rwa-docs"},
)

draft = TransactionDraft(config)
draft.register_rwa(
    {
        "domain": "commodities.universal",
        "quantity": "100",
        "spec": {"scale": 0},
        "primary_reference": "warehouse-receipt-001",
        "status": "active",
        "metadata": {
            "asset_class": "commodity",
            "commodity": "copper",
            "warehouse": "DXB-01",
            "inspection_report": "sorafs://reports/copper-001.json",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": True,
            "force_transfer_enabled": False,
            "redeem_enabled": True,
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Транзакция орындалғаннан кейін тізім құрылады RWA IDs. Әрекелік-мемлекеттік бағыттар каноникалық IDs -ді көрсетеді; оқиғаларды немесе эксплуатордың егжей-тегжейлі бағыттарын пайдаланыңыз, егер сіз ID қайтадан `primary_reference` немесе метамәдени деректерге сәйкестендіруге мұқтаж болғанда:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Эксплорерге мүмкіндік беретін түйіндер сондай-ақ бай жобалауларды қайтара алады:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### Уақытша ұстап тұрумен ауысу {#transfer-with-a-temporary-hold}

Сылбырдан қайтарылған пайдаланған RWA ID қолданылсын. Бұл мысалда `alice` иесі болып табылады деп болжанады және `hold_enabled` арқылы басқарушы ретінде де құрылады.

```python
warehouse_lot_id = (
    "0123456789abcdef0123456789abcdef"
    "0123456789abcdef0123456789abcdef$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)

draft.transfer_rwa(warehouse_lot_id, quantity="10", destination=bob)
draft.hold_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Сабақтан тыс процесс аяқталған кезде ұсталғанды босату:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Бақылау және аудит метамәдени деректерін қосу {#add-controls-and-audit-metadata}

Бақылаулар мен метамәлі деректер бөлек. Бақылаушылар саясаты үшін бақылауларды және өтінімдер немесе аудиторлар көрсетуге тиіс фактілер үшін метамәлі мәліметтерді қолданыңыз:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)

draft.set_rwa_controls(
    warehouse_lot_id,
    {
        "controller_accounts": [alice],
        "controller_roles": [],
        "freeze_enabled": True,
        "hold_enabled": True,
        "force_transfer_enabled": True,
        "redeem_enabled": True,
    },
)
draft.set_rwa_key_value(warehouse_lot_id, "auditor", "alice")
draft.set_rwa_key_value(
    warehouse_lot_id,
    "proof_hash",
    "sha256:2b1c7a4e...",
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Төлем немесе зейнеткерлік төлем мөлшері {#redeem-or-retire-quantity}

Репрезентацияланған тізбектен тыс активтер жеткізілгенде, жетілгенде, зейнеткерлікке шыққанда немесе айналыстан басқаша алынып тасталған кезде төлем мөлшері. Партияның `redeem_enabled` болуы тиіс және қол қоюшы меншік иесі немесе бақылаушы болуы керек.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Жауаптылықты тексеру кезінде тоңазыту {#freeze-during-compliance-review}

Әдеттегі меншік иесінің операцияларын бұғаттау керек болған жағдайда, партияны тоңазыту. Қолтаңбалаушы бақылаушы болуы және партия `freeze_enabled` болуы тиіс.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.freeze_rwa(warehouse_lot_id)
draft.set_rwa_key_value(
    warehouse_lot_id,
    "review",
    {
        "status": "frozen",
        "reason": "custodian inventory check",
        "case_id": "OPS-2026-0042",
    },
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Тексеру өткен соң оны тоңазытпаңыз:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.unfreeze_rwa(warehouse_lot_id)
draft.set_rwa_key_value(
    warehouse_lot_id,
    "review",
    {"status": "cleared", "case_id": "OPS-2026-0042"},
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Түсілетін шоттар {#invoice-receivable}

RWA партиясы ретінде фактураны `primary_reference` және метамәліметтерді сақтау арқылы білдіріңіз. Тіркеуден өткеннен кейін, көшіру және өтеу үшін пайдаланған ID фактурасын қолданыңыз.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.register_rwa(
    {
        "domain": "receivables.universal",
        "quantity": "50000",
        "spec": {"scale": 2},
        "primary_reference": "INV-2026-0007",
        "status": "issued",
        "metadata": {
            "asset_class": "invoice",
            "currency": "USD",
            "debtor": "example-buyer",
            "due_date": "2026-06-30",
            "document_hash": "sha256:4df4c8...",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": False,
            "force_transfer_enabled": False,
            "redeem_enabled": True,
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Қабылдауды қаржыландыру немесе төлеу кезінде пайдаланған шоттар партиясын ID қолданыңыз:

```python
invoice_lot_id = (
    "fedcba9876543210fedcba9876543210"
    "fedcba9876543210fedcba9876543210$receivables.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.transfer_rwa(invoice_lot_id, quantity="50000", destination=bob)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Ұсынылған сомаларды тізбектен тыс есеп айырысудан кейін қайтару:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Көміртек кредиті зейнеткерлік {#carbon-credit-retirement}

Кредиттерді талап еткеннен кейін оларды өтеу үшін төлемді пайдалану. Метамәліметтер тізбектен тыс сертификатқа немесе тіркелімге дәлелдейді:

```python
carbon_lot_id = (
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa$carbon.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(carbon_lot_id, quantity="250")
draft.set_rwa_key_value(
    carbon_lot_id,
    "retirement_certificate",
    "sorafs://certificates/carbon-credit-2026-001-retired.json",
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Екі топты біріктіру {#merge-two-lots}

Екі тізбектен тыс позициялар біріктірілген кезде лотты біріктіру. Ата-аналар бір доменде болуы керек және бірдей сандық ерекшелікті қолдануы тиіс. Оқу уақыты бала лотын ID туғызады.

```python
warehouse_lot_id_2 = (
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.merge_rwas(
    {
        "parents": [
            {"rwa": warehouse_lot_id, "quantity": "40"},
            {"rwa": warehouse_lot_id_2, "quantity": "60"},
        ],
        "primary_reference": "warehouse-receipt-003",
        "status": "merged",
        "metadata": {
            "asset_class": "commodity",
            "commodity": "copper",
            "warehouse": "DXB-01",
            "merge_reason": "same custodian and quality grade",
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Python транзакциясының толық мысалы үшін [Реалдық әлемдегі активтер](/kk/guide/tutorials/python.md#real-world-assets) қараңыз.

## Қауіпкерлік құжаттар {#related-docs}

- [Активтер](/kk/blockchain/assets.md)
- [Метамәліметтер](/kk/blockchain/metadata.md)
- [Iroha Арнайы нұсқаулықтар](/kk/blockchain/instructions.md)
- [Сұрақтар](/kk/reference/queries.md#assets-nfts-and-rwas)
- [Torii аяқтық нүктелері](/kk/reference/torii-endpoints.md#app-and-sora-route-families)
