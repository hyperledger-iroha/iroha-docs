---
translation_locale: az
translation_source: /blockchain/rwas.md
translation_source_hash: 80593515d6919a6b6cb282ddcd4903ce000b56b264f350a42a6ed792f9cbef73
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Əsl dünya aktivləri {#real-world-assets}

Əsl dünya aktivləri (RWAs) zəncirdən kənar aktivlər modelidir ki, onların mülkiyyəti və ya nəzarəti zəncirdə izlənilir. Iroha da RWA yaradılmış bir identifikator, sahib hesabı, miqdar, iş metadataları, mənşəyi və seçim yolu ilə həyat dövrü nəzarətləri olan qeydiyyata alınmış kitabxana lotudur.

RWAs sayısal aktiv qalıqlarından fərqlənir:

- rəqəmsal aktiv hesabda saxlanılan fungib balansdır.
- NFT bir sahibi olan unikal bir zəncirlə bağlı qeyddir.
- RWA - biznes metadataları, miqdarı, saxlamaları, dondurmalarını, geri qaytarılma vəziyyətini, mənşəyini və nəzarətçi siyasətini daşıya bilən bir lotdur.

RWAs istifadə edərək, nəşrin əsas hissəsinin yalnız funksiyalı balans əvəzinə müəyyən bir zəncirdən kənar partiyanı təmsil etməsi lazım olduqda.

## RWA Lot {#rwa-lot}

RWA partiyası aşağıdakıları ehtiva edir:

- `id`: `<hash>$<domain>` kimi göstərilən yaradılmış kanonik RWA identifikatoru
- `owned_by`: partiyanın hal-hazırda sahibi olan hesab
- `quantity`: partiya ilə təmsil olunan pulsuz miqdar
- `spec`: miqdar təyinatı, məsələn, desimal miqyası
- `primary_reference`: əsas silsilədən kənar rəsm, sertifikat, faktura və ya qeydiyyat istinadı
- `status`: istənilən müəssisə statusuna uyğun bir mətn
- `metadata`: iş kontekstində və indeksləşdirilmədə istifadə olunan kompakt JSON sahələri
- `parents`: bu partiyanı əldə etmək üçün istifadə olunan mənbə lotları
- `controls`: nəzarətçi hesabları, nəzarətçinin vəzifələri və icazə verilən nəzarətçilərin əməliyyatları
- `is_frozen` və `held_quantity`: iş vaxtı ilə tətbiq olunan həyat dövrü vəziyyəti

Zəngindəki payload kompakt saxlayın. böyük hüquqi sənədlər, yoxlama hesabatları və audit paketləri WSV, Sonra bir həzm edin. URI, SoraFS yol, və ya açıq istinad RWA Metadata.

## Kimliklər {#identifiers}

`RegisterRwa` çağırıcının seçdiyi `id` hesabını qəbul etmir və `owner` sahəsini də qəbul etmir. Əməliyyat orqanı ilkin `owned_by` hesabına çevrilir və iş vaxtı hədəf domenində `RwaId` əmələ gətirir.

RWA ID mətni forması aşağıdakılardır:

```text
<generated-hash>$<domain>
```

Məsələn:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

Tələblər öz iş identifikatorunu `primary_reference` və ya `metadata` ədədlərində saxlayıb, sonra `RwaEvent::Created`, `FindRwas` və `/v1/rwas` vasitəsilə əməliyyatdan sonra müəyyən edilmiş kəşfiyyatçı marşrutundan əldə edilən `RwaId` tapmalıdırlar.

## Həyat dövrü {#lifecycle}

Ümumi RWA iş axınları aşağıdakılardır:

|Əməliyyat |tətbiq edilmiş davranış |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
|`RegisterRwa` |Bir domenində ID topluğunu yaratmaq; əməliyyat orqanı `owned_by` olur. |
|`TransferRwa` | Qeydiyyatı başqa hesabına köçürün. Tam transfer dəyişə bilər. `owned_by`; qismən köçürülməsi yaranmış uşaq topluğunu yaradır. |
|`HoldRwa` |Qeydiyyat miqdarı. Konfiqurasiyalı bir idarəetmə və `hold_enabled` tələb edir. |
|`ReleaseRwa` |Qalan miqdarı çıxarın. Konfiqurasiyalı bir idarəetmə və `hold_enabled` tələb edir. |
|`FreezeRwa` |Normal sahibinin əməliyyatlarını bloklayın. Konfiqurasiya edilmiş bir idarəetmə və `freeze_enabled` tələb edir. |
|`UnfreezeRwa` |Adətən sahibinin əməliyyatlarını yenidən aktivləşdirmək. Konfiqurasiya edilmiş bir idarəetmə və `freeze_enabled` tələb edir.|
|`RedeemRwa` | İndirim miqdarı. sahibini və ya nəzarətçisini tələb edir `redeem_enabled`.                                                  |
|`MergeRwas` |Eyni domenə malik valideyn lotlarından olan miqdarları birləşdirin və xüsusiyyətləri yaranmış uşaq lotuna çevirin. |
|`ForceTransferRwa` |Nəzarətçi axını vasitəsilə miqdarı köçürmək. Konfiqurasiya edilmiş nəzarətçi və `force_transfer_enabled` tələb edir. |
|`SetRwaControls` |Satış nəzarəti siyasətini əvəz edin. sahibinin və ya nəzarətçinin tələb olunur.|
|`SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |Parça metadataları yeniləmək. sahibini və ya nəzarətçini tələb edir; dondurulmuş parçalara nəzarətçi lazımdır. |

Mövcud kodda `UnregisterRwa` göstərici yoxdur. Təmsil olunan miqdar çatdırıldıqda, istehlak edildikdə, ödəndikdə və ya başqa bir şəkildə dövriyyədən çıxarıldıqda `RedeemRwa` ilə zəncirdən kənar bir partiyanı geri çəkin.

## Metadatalar və nəzarətlər {#metadata-and-controls}

Tətbiqlərin partiyanı müəyyənləşdirməsinə və təsdiqləməsinə kömək edən kompakt faktlar üçün meta məlumatlardan istifadə edin:

- aktivlər sinifi, emitent, depozit və ya qeydiyyat istinadları
- anbar, sığınacaq, ISIN, faktura və ya sertifikat identifikatorları
- Səsvermələr və hüquqi sənədlər üçün məzmun hashları
- SoraFS daha böyük sübut dəstləri üçün yollar və ya açıq istinadlar
- zəncirdən kənar xidmətlər tərəfindən istifadə olunan meyarlıq, yurisdiksiya və ya uyğunluq etiketləri

Əməliyyat olunmuş `RwaControlPolicy` aşağıdakı sahələrə malikdir:

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

Nəzarətçi hesabları və rolları yalnız müvafiq boolean bayrağı ilə təmin edilmiş nəzarətçi əməliyyatlarını yerinə yetirməyə icazə verilir. Hal-hazırda nəzarət pay yükü icazə siyahısı ötürmə siyasəti deyil və yerləşdirilmiş daxildir `transfers` Qaydalar.

## Soruşmalar, hadisələr və APIs {#queries-events-and-apis}

İstifadə [`FindRwas`](/az/reference/queries.md#assets-nfts-and-rwas) qeydiyyatdan keçmiş siyahıya RWA canlı yeniləmələrə ehtiyacı olan tətbiqlər paylaşa bilər [`Rwa` məlumat hadisələri](/az/blockchain/filters.md#data-event-filters) yaradılmış, sahibini dəyişdirilmiş, bölünmüş, birləşmiş, satın alınmış, dondurulmuş, dondurunmamış, saxlanılan, azad edilmiş, zorla köçürülmüş, nəzarətlərin dəyişdirilməsi üçün; və metadata hadisələri.

Torii `/v1/rwas` və `/v1/rwas/query` kimi zəncir-dövlət yollarını, habelə bu marşrut ailəsinin aktivləşdirildiyi zaman `/v1/explorer/rwas` və `/v1/explorer/rwas/{rwa_id}` kimi kəşfçi yollarını aşkar edir. Yaradılan müştərilər bir düyün tərəfindən aşkar edilmiş dəqiq cavab forması üçün canlı [`/openapi`](/az/reference/torii-endpoints.md#common-endpoints) sənədinə üstünlük verməlidirlər.

### Taira üzərində sınayın. {#try-it-on-taira}

Hal-hazırda Taira ictimaiyyətinin RWA partiyaları qeydiyyata alıb-almadığını yoxlayın:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

Yaşayış Taira OpenAPI sənədində aşkar edilmiş RWA marşrutlarını göstərin:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

Hələ ictimai partiyalar qeydiyyatdan keçirilmədikdə boş `items` çıxışı gözlənilir. Qeydiyyat, köçürmə, saxlama, dondurma və ödəniş imzalanmış əməliyyatlardır.

## Bunu sınayın. {#try-it}

Aşağıdakı nümunələrdə Python SDK səthlərindən istifadə olunur [ Paylaşılan Quruluş](/az/guide/tutorials/python.md#shared-setup). Bir əməliyyat göndərməzdən əvvəl hesabı IDs, özəl açarları və istehsal olunan partiyanı IDs öz şəbəkənizdən dəyərlərlə əvəz edin.

### RWA API Yolları kəşf edin {#discover-rwa-api-routes}

Bu yalnız oxunma nümunəsi işləyən Torii qovuşdan tələb edir ki, hansı tətbiqə yönəlmiş RWA marşrutları aktivləşdirilmişdir:

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

Əgər siyahı boşdursa, qovşaq hələ də RWA təlimatlarını və digər Torii APIs vasitəsilə sorğuları dəstəkləyə bilər, lakin seçim yolu ailəsi JSON açıqlanmır.

### Qazanlıq rəsmiləşdirməsini qeyd edin {#register-a-warehouse-receipt}

Bir iş aksiyası bir imzalanmış əməliyyat olmaq üçün bir layihə istifadə edin. Ticarət rüsum nömrəsi `primary_reference` daxil olur; kitabxana ID əməliyyatın öhdəliklərindən sonra yaradılır.

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

Transaksiya öhdəliklərini yerinə yetirdikdən sonra, yaradılan siyahı RWA IDs. Zəngin-dövlət yolları kanonik IDs; Tədbirlər və ya kəşfiyyatçı detal yolları istifadə etmək üçün bir ID geri dönmək `primary_reference` və ya metadata:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Eksplorator imkanı olan qovşaqlar daha zəngin proqnozları da qaytarır:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### Müvəqqəti saxlama ilə köçürülmək {#transfer-with-a-temporary-hold}

Zəncir tərəfindən geri qaytarılan RWA ID istifadə edin. Bu nümunə `alice` sahibini ehtimal edir və həmçinin nəzarətçi olaraq `hold_enabled` ilə konfiqurasiya olunur.

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

Zəncirdən kənar proses tamamlandıqdan sonra saxlama buraxılır:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Nəzarət və Audit Metadataları əlavə edin {#add-controls-and-audit-metadata}

Nəzarətlər və metadatalar ayrıdır. Nəzarətçilərin siyasəti üçün nəzarətlərdən istifadə edin, tətbiqlərin və ya auditorların göstərmələri lazım olan faktlar üçün isə metadatalardan:

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

### Qazan və ya təqaüdə alınma miqdarı {#redeem-or-retire-quantity}

Təmsil olunan zəncirdən kənar aktivin çatdırıldığı, istehlak edildiyi, təxirə salındığı zaman ödəniş miqdarı; Birləşmiş Ştatlar tərəfindən verilən və ya digər şəkildə dövriyyədən çıxarılmış `redeem_enabled`, İmzaçı sahibinin və ya nəzarətçinin olması lazımdır.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Müvafiqliyi araşdırarkən dondurma {#freeze-during-compliance-review}

Bir zəncirdən kənar bir araşdırmanın sıradan sahibkar əməliyyatlarını bloklaması lazım olduqda çox dondurmaq. İmzaçı nəzarətçi olmalıdır və partiyanın `freeze_enabled` olması lazımdır.

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

Qeydiyyatdan keçdikdən sonra onu dondurun:

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

### Hesablama vəsaitləri {#invoice-receivable}

Bir fakturanı bir RWA partiya faktura nömrəsini saxlayaraq `primary_reference` qeydiyyatdan sonra istehsal olunmuş ID köçürülməsi və geri qaytarılması üçün.

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

Tələb olunmuş pul vəsaitinin maliyyələşdirildiyi və ya ödənildiyi təqdirdə, istehsal edilmiş faktura partiyasından istifadə edin ID:

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

Təmsil olunan məbləği zəncirdən kənar hesablamalardan sonra geri qaytarmaq:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Karbon kredit pensiya {#carbon-credit-retirement}

İddia ediləndən sonra kreditləri geri çəkmək üçün ödənişdən istifadə edin. Metadatalar silsilədən kənarda olan sertifikat və ya qeydiyyat sübutuna işarədir:

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

### İki qrup birləşsin {#merge-two-lots}

İki zəncirdən kənar mövqelərin birləşdirildiyi zaman toplanın. Valideynlər eyni sahədə olmalıdırlar və eyni miqdar xüsusiyyətindən istifadə etməlidirlər. İndirmə vaxtı uşağın toplanmasını ID yaradır.

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

Python əməliyyatının tam nümunəsi üçün [Real-World Assets](/az/guide/tutorials/python.md#real-world-assets) -ə baxın.

## Əlaqəli sənədlər {#related-docs}

- [Əmlaklar](/az/blockchain/assets.md)
- [Metadata](/az/blockchain/metadata.md)
- [Iroha Xüsusi təlimatlar](/az/blockchain/instructions.md)
- [Suallar](/az/reference/queries.md#assets-nfts-and-rwas)
- [Torii bitki nöqtələri](/az/reference/torii-endpoints.md#app-and-sora-route-families)
