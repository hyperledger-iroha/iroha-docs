---
translation_locale: kk
translation_source: /blockchain/rwas.md
translation_source_hash: 8d64a9a17c93f60306c279e8656e6edde8ce5dd024e742218bfb9572b7438bb0
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Шынайы дүниедегі активтер {#real-world-assets}

Нақты әлемдік активтер (RWAs) меншік немесе бақылау деректері блокчейнде қадағаланатын оф-чейн активтерін модельдейді. Iroha ішінде, RWA тіркелген блокчейн тізілімдерінің блогы болып табылады, оған жасалған идентификатор, иелердің есепшоты, мөлшер, бизнес метадеректері, шығу тарихы және міндетті емес өмірлік кезеңді бақылау элементтері кіреді.

RWAs сандық актив балансынан ерекшеленеді:

- сандық актив - есепшотта сақталатын айырбасталатын қалдық
- «NFT» — бір ғана иесі бар бірегей тізбек жазбасы
- RWA — бұл бизнестік метадеректерді, мөлшерін, ұстауларды, тоқтатуларды, шығару күйін, өндірушілікті және бақылаушы саясатын тасымалдауға болатын лот

Блокчейн тізілімі тек баламалы баланс емес, нақты офф-чейн лотты көрсету қажет болса, RWAs қолданыңыз.

## RWA Лот {#rwa-lot}

Бір RWA партия құрамында бар:

- `id`: жасалған бірегей протокол-стандарт RWA идентификаторы, `<hash>$<domain>` ретінде көрсетіледі
- `owned_by`: осы учаскені қазіргі уақытта иемденіп отырған есептік жазба
- `quantity`: партиямен көрсетілген өтпей қалған мөлшер
- `spec`: мөлшер көрсеткіші, мысалы, ондық шкала
- `primary_reference`: негізгі офф-чейн протоколының нәтиже жазбасы, сертификат, шот-фактура немесе тіркеу сілтемесі
- `status`: міндетті емес бизнес жағдайы мәтіні
- `metadata`: бизнестік контекст және индекстеу үшін қолданылатын ықшам JSON өрістер
- `parents`: осы партияны алу үшін қолданылған бастапқы партиялар
- `controls`: контроллер есепшоттары, контроллер рөлдері және қосылған контроллер операциялары
- `is_frozen` және `held_quantity`: бағдарламалық қамтамасыздандыру орындау ортасы арқылы қолданылатын өмірлік цикл күйі

Тізбектегі деректер пакетін ықшам ұстаңыз. Үлкен құқықтық құжаттарды, тексеру есептерін және аудит жинақтарын WSV сыртында сақтаңыз, содан кейін криптографиялық дайджест мәнін, URI, SoraFS жолын немесе техникалық манифест сілтемесін RWA метадеректеріне орналастырыңыз.

## Көрсеткіштер {#identifiers}

`RegisterRwa` сұрау салатын клиент таңдаған `id` қабылдамайды, және ол `owner` өрісін қабылдамайды. Транзакцияны уәкілетті субъект бастапқы `owned_by` есепшотқа айналады, ал бағдарламалық қамтамасыз етуді орындау ортасы мақсатты доменде `RwaId` жасайды.

RWA идентификаторының мәтіндік түрі келесідей:

```text
<generated-hash>$<domain>
```

Мысалы:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

Қосымшалар өздерінің бизнес идентификаторын `primary_reference` немесе `metadata` ішінде сақтау керек, содан кейін `RwaEvent::Created`, `FindRwas`, `/v1/rwas` ішінен немесе транзакция аяқталғаннан кейін орнатылған шолу жолынан жасалған `RwaId`-ні анықтауы қажет.

## Өмірлік цикл {#lifecycle}

Жиі кездесетін RWA жұмыс процестері мыналарды қамтиды:

|Операция|Іске асырылған мінез-құлық|
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `RegisterRwa`                              |Доменде жасалған-ID партиясын жасаңыз; транзакцияны уәкілетті субъект `owned_by` болады.|
| `TransferRwa`                              |Соманы басқа есепшотқа аудару. Толық аударым `owned_by` мәнін өзгерте алады. Бөлшектеп аудару жеке ұрпақ лотын жасалған ID-мен жасайды.|
| `HoldRwa`                                  |Резервтік мөлшер. Конфигурацияланған контроллер мен `hold_enabled` қажет.|
| `ReleaseRwa`                               |Ұсталған мөлшерді жою. Конфигурацияланған контроллер және `hold_enabled` қажет.|
| `FreezeRwa`                                |Қарапайым иесінің операцияларын блоктау. Орнатылған контроллерді және `freeze_enabled` қажет етеді.|
| `UnfreezeRwa`                              |Қарапайым иесінің операцияларын қайта қосу. Конфигурацияланған контроллер және `freeze_enabled` қажет.|
| `RedeemRwa`                                |Санын айналымнан тұрақты түрде шығару. Иесі немесе бақылаушы оны `redeem_enabled` шын болған кезде бере алады.|
| `MergeRwas`                                |Домені мен спецификациясы бірдей ата-ана партиялардан алынған сандық көрсеткіштерді жасалған бала партиясына біріктіру.|
| `ForceTransferRwa`                         |Саны контроллер ағысы арқылы жылжытыңыз. Бұл бапталған контроллерді және `force_transfer_enabled` қажет етеді.|
| `SetRwaControls`                           |Желілік бақылау саясатын ауыстырыңыз. Иесі немесе бақылаушысын талап етеді.|
| `SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |Лоттың метадеректерін жаңарту. Бұл иесін немесе бақылаушыны қажет етеді; мұздақталған лоттарға бақылаушы қажет.|

Ағымдағы кодта `UnregisterRwa` нұсқаулығы жоқ. Өкілдік сан жеткізілгенде, пайдаланылғанда, есептелгенде немесе айналымнан өзгеше жолмен алынғанда `RedeemRwa` көмегімен off-chain лотты қызметтен шығарыңыз.

## Мета деректер және Бақылаулар {#metadata-and-controls}

Қолданбалардың партияны анықтауға және тексеруге көмектесетін қысқаша фактілер үшін метадеректерді пайдаланыңыз:

- активтер класы, шығарушы, сақтаушы немесе тіркеуші сілтемесі
- қойма, тіркелім, ISIN, шот-фактура немесе куәлік идентификаторлары
- құжаттар мен заңды құжаттар үшін контент криптографиялық хэштері
- SoraFS ірі дәлел жинақтары үшін жолдар немесе техникалық манифест сілтемелері
- чейннен тыс қызметтер қолданатын жетілу, юрисдикция немесе сәйкестік тегтері

Іске асырылған `RwaControlPolicy` мындағы өрістерге ие:

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

Басқарушы есептік жазбалар мен рөлдер тек сәйкес екілік белгілермен қосылған операцияларды орындай алады. Ағымдағы басқару деректер пакеті басқарушының жеке мәліметтері мен операция белгілерін қамтиды. Ауыстыруға рұқсат етілген тізімдер мен кірістірілген `transfers` ережелері бұл деректер пакетінің сыртында болады.

## Сұраулар, Оқиғалар және APIs {#queries-events-and-apis}

Пайдалану [`FindRwas`](/kk/reference/queries.md#assets-nfts-and-rwas) тіркелгенін тізімдеу RWA көп. Тірі жаңартуларды қажет ететін қолданбалар жазыла алады [`Rwa` деректер оқиғалары](/kk/blockchain/filters.md#data-event-filters) жасалған, иесі өзгерген, бөлінген, біріктірілген, айырбасталған, мұздатылған, мұздан босатылған, ұсталды, шығарылды, күшпен берілді, бақылаулар өзгерді және метадеректер оқиғалары.

Torii тізбек-мемлекет бағыттарын ашады, мысалы `/v1/rwas` және `/v1/rwas/query`, сонымен қатар шолушы маршруттары сияқты `/v1/explorer/rwas` және `/v1/explorer/rwas/{rwa_id}` сол маршрут отбасы қосылғанда. Жасалған клиенттер тікелей нұсқаны таңдауы керек [`/openapi.json`](/kk/reference/torii-endpoints.md#common-endpoints) торап көрсеткен нақты жауап пішімі үшін құжат.

### Осы жұмыс ағынын Taira бойынша іске қосыңыз {#try-it-on-taira}

Қоғамдық Taira қазір тіркелген RWA учаскелерге ие екенін тексеріңіз:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

Тірі Taira OpenAPI құжаты арқылы ашылған RWA бағыттарын тізіңіз:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

Қазіргі уақытта ешқандай ашық лот тіркелмеген кезде бос `items` шығыс күтіледі. Тіркеу, аудару, ұстау, тоқтату және өтеу - қол қойылған операциялар болып табылады.

## Оны байқап көр {#try-it}

Төмендегі мысалдар [Ортақ баптау](/kk/guide/tutorials/python.md#shared-setup) сайтынан алынған Python SDK беттерін қолданады. Транзакция жібермес бұрын өз желіңізден алынған есептік жазбаның идентификаторларын, жеке кілттерді және жасалған лот идентификаторларын ауыстырыңыз.

### RWA API маршруттарын зерттеңіз {#discover-rwa-api-routes}

Бұл тек оқу үшін мысалда жұмыс істеп тұрған Torii торапқа қай қолданбаға арналған RWA бағыттардың қосулы екенін сұрайды:

```python
from iroha_python import create_torii_client

client = create_torii_client("https://taira.sora.org")
openapi = client.request_json("GET", "/openapi.json", expected_status=(200,))

rwa_paths = sorted(
    path for path in openapi.get("paths", {}) if path.startswith("/v1/rwas")
)

for path in rwa_paths:
    print(path)
```

Егер тізім бос болса, түйін әлі де басқа Torii APIs арқылы RWA нұсқауларын және сұрауларын қолдауы мүмкін, бірақ ол қосымша JSON маршрут отбасын көрсетпейді.

### Қойма хаттамасының нәтижесін тіркеу {#register-a-warehouse-receipt}

Бір іскерлік әрекет бір қол қойылған транзакцияға айналуы тиіс болса, жоба-нұсқаны пайдаланыңыз. Іскерлік түбіртек нөмірі `primary_reference` өрісіне жазылады; тізілім идентификаторы транзакция бекітілгеннен кейін жасалады.

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

Транзакция аяқталғаннан кейін, жасалған RWA идентификаторларын тізімдеңіз. Тізбек күйінің маршруттары бір протокол стандартының идентификаторларын көрсетеді; егер сізге идентификаторды `primary_reference` немесе метадеректерге қайтару қажет болса, оқиғалар немесе шолушының деталь маршруттарын қолданыңыз:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Explorer қосылған түйіндер сондай-ақ байырақ проекцияларды қайтара алады:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### Уақытша Болжаммен Аудару {#transfer-with-a-temporary-hold}

Тізбектен қайтарылған RWA идентификаторын пайдаланыңыз. Бұл мысалда `alice` иесі болып табылады және `hold_enabled` арқылы бақылаушы ретінде де орнатылған деп есептеледі.

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

Өтпелі тізбек процесі сәтті аяқталғаннан кейін `ReleaseRwa` жіберіңіз:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Бақылау құралдарын және аудит метадеректерін қосу {#add-controls-and-audit-metadata}

Басқару элементтері мен метадеректер бөлек. Басқару элементтерін контроллер саясаты үшін, ал метадеректерді қосымшалар немесе аудит жүргізушілер көрсетуі қажет факттер үшін пайдаланыңыз:

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

### Санысын өтеу немесе қызметтен шығару {#redeem-or-retire-quantity}

`RedeemRwa` өндіруші көрсетілген офф-чейн активі жеткізілген, пайдаланылған, тоқтатылған немесе айналымнан басқа түрде шығарылғаннан кейін жіберілуі керек. Бұл ұсынылған санды белгілі бір лоттан тұрақты түрде азайтады. Лотта `redeem_enabled` болуы қажет. Криптографиялық қол қойушы иесі немесе бақылаушы болуы керек.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Сәйкестік тексеру кезінде тоқтату {#freeze-during-compliance-review}

Кәдімгі иесінің операцияларын блоктау қажет болғанда офф-чейн шолуын `FreezeRwa` жіберіңіз. Криптографиялық қолтаңба қоюшы контроллер болуы керек. Лотта `freeze_enabled` болуы қажет.

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

Шолу сәтті өткеннен кейін `UnfreezeRwa`-ты жіберіңіз:

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

### Шот-фактура бойынша қарыз {#invoice-receivable}

Шот-фактураны RWA лот ретінде көрсету үшін шот-фактура нөмірін `primary_reference` және метадеректерде сақтау қажет. Тіркелгеннен кейін, аудару және есептен шығару үшін жасалған идентификаторды пайдаланыңыз.

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

Дебиторлық берешек қаржыландырылғанда немесе төленгенде, жасалған шот-фактура лотының ID-сін пайдаланыңыз:

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

Арнайы шынайы емес қаржылық мәміле есеп айырысуынан кейін көрсетілген соманы өтеу:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Көміртек несиесін шығару {#carbon-credit-retirement}

Талап етілген көміртегі несиелерін айналымнан алу үшін `RedeemRwa`-ті жіберіңіз. Метадеректерде тізімнен тыс сертификатты немесе тіркеу дәлелін сақтаңыз:

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

### Екі партияны біріктіру {#merge-two-lots}

Екі офф-чейн позиция біріктірілгенде лоттарды біріктіріңіз. Ата-аналар бір доменде болуы керек және бірдей санының спецификациясын қолдануы қажет. Бағдарламалық қамтамасыз ету орындау ортасы баланы лот идентификаторын жасайды.

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

Толық Python транзакция мысалы үшін, [Шынайы дүниедегі активтер](/kk/guide/tutorials/python.md#real-world-assets) қараңыз.

## Қатысты құжаттар {#related-docs}

- [Активтер](/kk/blockchain/assets.md)
- [Метадеректер](/kk/blockchain/metadata.md)
- [Iroha Нұсқаулық операциялары](/kk/blockchain/instructions.md)
- [Сұраулар](/kk/reference/queries.md#assets-nfts-and-rwas)
- [Torii API ұш нүктелер](/kk/reference/torii-endpoints.md#app-and-sora-route-families)
