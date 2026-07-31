---
translation_locale: ba
translation_source: /blockchain/rwas.md
translation_source_hash: 80593515d6919a6b6cb282ddcd4903ce000b56b264f350a42a6ed792f9cbef73
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Реаль донъя активтары {#real-world-assets}

Реаль донъя активтары (RWAs) - селтәрҙән тыш активтар моделе, уларҙың хужалығы йәки контроле сылбырҙа күҙәтелә. Iroha - RWA - теркәлгән бухгалтер партияһы, генерированный идентификаторы, хужа иҫәбенә, күләм, бизнес метаданмалар, килеп сығышы һәм факультатив йәшәү циклы контролдәре менән.

RWAs һанлы активтар баланстарынан айырыла:

- цифрлы актив - иҫәптә тотолған күләмле баланс
- NFT - бер хужаһы булған уникаль сылбырҙағы яҙма.
- RWA - бизнес-метадаттарын, күләмде, һаҡлана, туңдырыла, ҡайтарыу торошон, килеп сығышын һәм контроллер сәйәсәтен йөрөтә алған партия.

RWAs ҡулланғанда, иҫәп-хисап ҡаҙнаһы тик күләмле баланс урынына конкрет сылбырҙан тыш партияны сағылдырырға тейеш.

## RWA партияһы {#rwa-lot}

RWA партияһында түбәндәгеләр бар:

- `id`: генерированный канонический идентификатор RWA, отображается как `<hash>$<domain>`
- `owned_by`: партияның хәҙерге хужаһы булған иҫәп
- `quantity`: партияла күрһәтелгән ҡалыпта торған күләм
- `spec`: миҡдар күрһәткесе, мәҫәлән, унынсы үлсәм.
- `primary_reference`: сираттан тыш төп квитанция, сертификат, иҫәп-хисап йәки реестр шиғыры
- `status`: бизнес-статусы буйынса вариант
- `metadata`: бизнес контексты һәм индексация өсөн ҡулланылған компактлы JSON баҫыуҙар
- `parents`: был партияны сығарыу өсөн файҙаланылған сығанаҡ партиялары
- `controls`: контроллер иҫәбе, контроллер роле һәм контроллер операциялары
- `is_frozen` һәм `held_quantity`: йәшәү циклы дәүләте, хәрәкәт итеү ваҡыты менән үтәлгән

WSV тышҡа ҙур юридик документтар, инспекция отчеттары һәм аудит пакеттарын һаҡлап ҡалығыҙ, һуңынан URI, SoraFS юлына йәки RWA метамәғлүмәтенә асыҡ һылтанма ҡуйығыҙ.

## Идентификаторҙар {#identifiers}

`RegisterRwa` саҡырыусы тарафынан һайланған `id` билдәһен ҡабул итмәй, һәм ул `owner` полеһын ҡабул итмәй. Транзакция власы башланғыс `owned_by` иҫәбенә әүерелә, һәм үтәү ваҡыты маҡсатлы доменда `RwaId` сығара.

RWA ID текстовый формаһында:

```text
<generated-hash>$<domain>
```

Мәҫәлән:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

Ҡулланыусылар үҙҙәренең бизнес идентификаторҙарын `primary_reference` йәки `metadata` исемдәрендә һаҡларға тейеш, һуңынан `RwaEvent::Created`, `FindRwas`, `/v1/rwas`, йәки транзакция йөкләмәләрен үтәгәндән һуң билдәләнгән эҙләүсе маршрутынан барлыҡҡа килгән `RwaId` табырға кәрәк.

## Ғүмер циклы {#lifecycle}

RWA дөйөм эш ағымдары:

|Операция |Ҡулланылған тәртип |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
|`RegisterRwa` |Доменда генерированный-ID партияһын булдырыу; транзакция власы `owned_by` булып китә. |
|`TransferRwa` |Күләмде икенсе иҫәпкә күсереү. тулы күсермә `owned_by` үҙгәртә ала; өлөшләтә күсермә балалар партияһын булдыра. |
|`HoldRwa` |Резерв күләме. Конфигурацияланған контроллер һәм `hold_enabled` кәрәк.|
|`ReleaseRwa` |Ҡулланған күләмде алып ташлау. конфигурацияланған контроллер һәм `hold_enabled` кәрәк.|
|`FreezeRwa` |Ғәҙәттән тыш хужалыҡ операцияларын туҡтата. Конфигурацияланған контроллер һәм `freeze_enabled` кәрәк.|
|`UnfreezeRwa` |Ғәҙәттәгесә хужа операцияларын ҡабаттан булдырыу. Конфигурацияланған контроллер һәм `freeze_enabled`. |
|`RedeemRwa` |Пенсияға сығыу күләме. Хужа йәки контролер һәм `redeem_enabled`. |
|`MergeRwas` |Бер үк доменға эйә булған ата-әсәләр партияһынан алынған күләмдәрҙе берләштереп, балалар партияһына әйләндереү. |
|`ForceTransferRwa` |Күләмде контроллер ағымы аша күсер. Конфигурацияланған контроллер һәм `force_transfer_enabled` кәрәк. |
|`SetRwaControls` |Партия контроле сәйәсәтен алмаштырыу. Хужа йәки контроллер талап итә. |
|`SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |Загрузканың метамәғлүмәттәрен яңыртыу. Хужа йәки контроллер талап итә; туңдырылған загрузкаларға контроллер кәрәк. |

Хәҙерге кодта `UnregisterRwa` күрһәтмәһе юҡ. күрһәтелгән күләм тапшырылған, ҡулланылған, иҫәпләнгән йәки әйләнештән башҡа сығарылған ваҡытта `RedeemRwa` менән сылбырҙан тыш партияны алып ташларға.

## Метамәғлүмәт һәм контроль {#metadata-and-controls}

Метамәғлүмәттәрҙе ҡулланып, программалар партияны асыҡларға һәм тикшерергә ярҙам итә:

- Активтар класы, эмитент, һаҡсы йәки реестр шиғыры
- Склад, сейф, ISIN, счёт йәки сертификат идентификаторы
- Аттестаттар һәм хоҡуҡи документтар өсөн йөкмәтке хашсылары
- SoraFS ҙурыраҡ иҫбатлау тупланмалары өсөн юлдары йәки күрһәткескә һылтанмалар
- Сираттан тыш хеҙмәтләндереүҙәрҙә ҡулланылған сроклылыҡ, юрисдикция йәки үтәлеш билдәләре

Ҡулланылған `RwaControlPolicy` түбәндәге өлкәләргә эйә:

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

Контроллер иҫәптәре һәм ролдәренә тейешле буль флагы менән тәьмин ителгән контроллер операцияларын ғына башҡарырға рөхсәт ителә.Хәҙерге контроль йөкләмәһе рөхсәт исемлеген күсереү сәйәсәте булып тормай һәм `transfers` ҡағиҙәләрен үҙ эсенә алмай.

## Һорауҙар, ваҡиғалар һәм APIs {#queries-events-and-apis}

Ҡулланыу [`FindRwas`](/ba/reference/queries.md#assets-nfts-and-rwas) теркәлгән исемлеккә RWA бик күп. туранан-тура яңыртыуҙарға мохтаж булған ҡушымталар [`Rwa` мәғлүмәт ваҡиғалары](/ba/blockchain/filters.md#data-event-filters) булдырылған, хужаһы үҙгәртелгән, бүленгән, берләштерелгән, һатып алынған, туңдырылған, туңдырылмаған, тотолған, иреккә сығарылған, көс менән күсерелгән, контролдәрҙе үҙгәрткән өсөн, һәм метамәғлүмәт ваҡиғалары.

Torii Сылбырлы дәүләт маршруттарын асыҡлай: `/v1/rwas` һәм `/v1/rwas/query`, шулай уҡ экспедиторҙар маршруттары, мәҫәлән: `/v1/explorer/rwas` һәм `/v1/explorer/rwas/{rwa_id}` генерацияланған клиенттар өҫтөнлөк бирергә тейеш тере [`/openapi`](/ba/reference/torii-endpoints.md#common-endpoints) Көйөргәҙе тарафынан асыҡланған яуап формаһы өсөн документ.

### Taira менән һынап ҡарағыҙ. {#try-it-on-taira}

Хәҙерге ваҡытта Taira йәмәғәтселеге RWA партияларын теркәгәнме, юҡмы икәнен тикшерегеҙ:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

RWA маршруттарын исемлек итеп яҙығыҙ, улар тере Taira OpenAPI документында асыҡланған:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

`items` буш сығанаҡ әлегә асыҡ партиялар теркәлмәгән осраҡта көтөлә.

## Һынап ҡарағыҙ {#try-it}

Түбәндәге миҫалдар ҡулланыу Python SDK өҫкө йөҙҙәр [Бергә урынлаштырыу](/ba/guide/tutorials/python.md#shared-setup). Хисапты алмаштырыу IDs, шәхси асҡыстар, һәм барлыҡҡа килгән партия IDs транзакцияны ебәрер алдынан үҙ селтәрегеҙҙәге ҡиммәттәр менән.

### RWA API маршруттарын табығыҙ. {#discover-rwa-api-routes}

Был уҡырға ғына булған миҫал Torii хәрәкәт итеүсе узелдан ҡушымтаға ҡараған RWA маршруттарҙың ҡайһыларын булдырыуҙы һорай:

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

Әгәр исемлек буш булһа, узел RWA күрһәтмәләрен һәм башҡа Torii APIs аша һорауҙарҙы һаман да хуплай ала, әммә ул факультатив JSON маршрут ғаиләһен асмай.

### Һаҡлыҡхананан квитанция яҙығыҙ {#register-a-warehouse-receipt}

Бер эште бер ҡул ҡуйылған транзакцияға әйләндерергә тейеш саҡта проект ҡулланыу. `primary_reference`; ҙур китап ID операциянан һуң барлыҡҡа килә.

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

Транзакция йөкләмәләрен үтәгәндән һуң, исемлек барлыҡҡа килә RWA IDs. Сылбыр-хәллә маршруттары каноник IDs асыла; ваҡиғалар йәки Explorer деталдәр маршруттарын ҡулланығыҙ, әгәр һеҙгә кәрәк булһа, ID кире `primary_reference` йәки метамәғлүмәттәр менән тап килеү:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Эксплорер менән тәьмин ителгән узелдар шулай уҡ бай проекцияларҙы кире ҡайтара ала:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### Ваҡытлы рәүештә күсереү {#transfer-with-a-temporary-hold}

Сылбыр тарафынан кире ҡайтарылған генерацияланған RWA ID ҡулланығыҙ. Был миҫалда `alice` хужа тип фаразлана һәм шулай уҡ контроллер итеп `hold_enabled` менән конфигурациялана.

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

Сылбырҙан тыш процесс тамамланғас, тотҡаны иреккә сығарыу:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Контроль һәм аудит метамәғлүмәттәрен өҫтәү {#add-controls-and-audit-metadata}

Контролдар һәм метамәғлүмәттәр айырым. контроллер сәйәсәте өсөн контролдәрҙе, ә заявкалар йәки аудиторҙар күрһәтергә тейеш булған факттар өсөн метамәғлимәттәрҙе ҡулланығыҙ:

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

### Аҡсаны түләп алыу йәки пенсияға сығарыу {#redeem-or-retire-quantity}

Аҡсаны ҡайтарыу күләме, әгәр күрһәтелгән сылбырҙан ситтә булған актив тапшырылған, ҡулланылған, пенсияға сығарылған булһа; йәки башҡаса әйләнештән сығарылған. `redeem_enabled`, һәм ҡул ҡуйған хужа йәки контроллер булырға тейеш.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Тейешлелек буйынса тикшеренеүҙәр ваҡытында туҡтатыу {#freeze-during-compliance-review}

Сылбырҙан тыш тикшереү ғәҙәти хужалыҡ эшмәкәрлеген ҡамасауларға тейеш булған осраҡта күпләп туңдырығыҙ. Ҡул ҡуйыусы контроллер булырға тейеш һәм партияла `freeze_enabled` булырға тейеш.

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

Тикшереү үткәндән һуң уны туҙҙырмағыҙ:

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

### Бушлай торған фактуралар {#invoice-receivable}

Бухгалтерлыҡ иҫәбенә RWA партияла иҫәп-хисап номерын һаҡлап `primary_reference` һәм метамәғлүмәттәр. теркәлгәндән һуң, булдырылған ID күсереү һәм ҡайтарыу өсөн.

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

Кредитҡа аҡса түләнгәндә йәки финансланғанда, яһалған фактуралар партияһын ҡулланығыҙ ID:

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

Сираттан тыш түләүҙән һуң күрһәтелгән сумманы кире ҡайтарыу:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Углерод кредиты пенсияһы {#carbon-credit-retirement}

Кредиттарҙы талап ителгәндән һуң түләтеүҙе ҡулланығыҙ. Метамәғлүмәттәр ситтәге сертификатҡа йәки реестр иҫбатлауға йүнәлтә:

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

### Ике партияны берләштерегеҙ {#merge-two-lots}

Ике ситтәге позициялар тупланғанда лоттар ҡушыла. ата-әсәләр бер үк биләмәлә булырға тейеш һәм бер үк күләмле спецификация ҡулланырға тейеш. Йүгереү ваҡыты балаларҙы барлыҡҡа килтерә ID.

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

Python операцияһының тулы миҫалы өсөн [Реаль донъя активтары](/ba/guide/tutorials/python.md#real-world-assets) ҡарағыҙ.

## Төрлө документтар {#related-docs}

- [Активтар](/ba/blockchain/assets.md)
- [Метамәғлүмәттәре](/ba/blockchain/metadata.md)
- [Iroha Махсус күрһәтмәләр](/ba/blockchain/instructions.md)
- [Һорауҙар](/ba/reference/queries.md#assets-nfts-and-rwas)
- [Torii сикләү пункттары](/ba/reference/torii-endpoints.md#app-and-sora-route-families)
