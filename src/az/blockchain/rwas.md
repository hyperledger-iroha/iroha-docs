---
translation_locale: az
translation_source: /blockchain/rwas.md
translation_source_hash: 8d64a9a17c93f60306c279e8656e6edde8ce5dd024e742218bfb9572b7438bb0
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Həqiqi Dünyada Aktivlər {#real-world-assets}

Həqiqi dünya aktivləri (RWAs) mülkiyyəti və ya nəzarəti zəncirdə izlənilən off-chain aktivləri modelləşdirir. Iroha-də, bir RWA yaradılmış identifikator, sahiblərin hesabı, miqdar, biznes metadatasi, mənşəyi və istəyə bağlı həyat dövrü nəzarətləri olan qeydiyyatdan keçmiş bir blokçeyn dəftər lotudur.

RWAs rəqəmsal aktiv balanslarından fərqlidir:

- rəqəmsal aktiv hesab tərəfindən saxlanılan dəyişdirilə bilən balansdır
- bir NFT tək sahibli unikal bir on-chain qeyddir
- bir RWA biznes metadatasını, miqdarı, həlləri, dondurmaları, geri alım vəziyyətini, mənşəyi və idarəçi siyasətini daşıya bilən bir lotdur

Blockchain qeydiyyatı yalnız dəyişən balansı deyil, müəyyən bir off-chain lotu göstərməli olduqda RWAs istifadə edin.

## RWA Lot {#rwa-lot}

Bir RWA lotu ehtiva edir:

- `id`: yaradılmış tək protokol-standart RWA identifikatoru, `<hash>$<domain>` kimi göstərilib
- `owned_by`: hazırda torpaq sahəsinə sahib olan hesab
- `quantity`: lot tərəfindən təmsil olunan qalan miqdar
- `spec`: miqdar spesifikasiyası, məsələn, onluq miqyas
- `primary_reference`: əsas off-chain protokol nəticə qeydi, sertifikat, faktura və ya reyestr istinadı
- `status`: isteğe bağlı biznes statusu mətni
- `metadata`: biznes konteksti və indekləmə üçün istifadə olunan kompakt JSON sahələr
- `parents`: bu lotu çıxarmaq üçün istifadə olunan mənbə lotları
- `controls`: idarəçi hesablar, idarəçi rolları və aktiv idarəçi əməliyyatları
- `is_frozen` və `held_quantity`: proqram icra mühiti tərəfindən tətbiq edilən həyat dövrü vəziyyəti

Zəncir üstü məlumat yükləməsini kompakt saxlayın. Böyük hüquqi sənədləri, yoxlama hesabatlarını və audit paketlərini WSV xaricində saxlayın, sonra RWA metadatasında kriptoqrafik həzm dəyəri, URI, SoraFS yolu və ya texniki manifesto istinadını yerləşdirin.

## Identifikatorlar {#identifiers}

`RegisterRwa` sorğu göndərən müştəri tərəfindən seçilmiş `id`-i qəbul etmir və `owner` sahəsini qəbul etmir. Əməliyyatın icazə prinsipi ilkin `owned_by` hesabına çevrilir və proqram təminatı icra mühiti hədəf sahədə `RwaId`-i yaradır.

RWA ID-nin mətn forması belədir:

```text
<generated-hash>$<domain>
```

Məsələn:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

Tətbiqlər öz iş identifikatorlarını `primary_reference` və ya `metadata`-də saxlamalı, sonra `RwaEvent::Created`, `FindRwas`, `/v1/rwas` və ya əməliyyat tamamlandıqdan sonra təyin edilmiş kəşfiyyat marşrutu vasitəsilə yaradılan `RwaId`-ni tapmalıdırlar.

## Həyat dövrü {#lifecycle}

Ümumi RWA iş axınlarına daxildir:

|Əməliyyat|Tətbiq edilmiş davranış|
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `RegisterRwa`                              |Bir domen daxilində yaradılmış-ID lotu yaradın; əməliyyatın icazə prinsipi `owned_by` olur.|
| `TransferRwa`                              |Miqdarı başqa hesabın üzərinə köçürün. Tam transfer `owned_by`-i dəyişə bilər. Qismən transfer yaradılmış ID ilə ayrıca uşaq lotu yaradır.|
| `HoldRwa`                                  |Ehtiyat miqdarı. Konfiqurasiya edilmiş idarəediciyə və `hold_enabled` tələb olunur.|
| `ReleaseRwa`                               |Saxlanılmış miqdarı silin. Konfiqurasiya edilmiş nəzarətçi və `hold_enabled` tələb olunur.|
| `FreezeRwa`                                |Adi sahib əməliyyatlarını bloklayın. Konfiqurasiya edilmiş idarəediciyə və `freeze_enabled` tələb olunur.|
| `UnfreezeRwa`                              |Adi sahib əməliyyatlarını yenidən aktiv edin. Konfiqurasiya edilmiş nəzarətçi və `freeze_enabled` tələb olunur.|
| `RedeemRwa`                                |Daimi olaraq miqdarı dövriyyədən çıxarın. Sahibi və ya idarəçi `redeem_enabled` doğru olduqda onu təqdim edə bilər.|
| `MergeRwas`                                |Eyni domen və spesifikasiyaya malik valideyn lotlarından miqdarları birləşdirərək yaradılmış uşaq lotuna daxil edin.|
| `ForceTransferRwa`                         |Miqdarı bir idarəetmə axını vasitəsilə hərəkət etdirin. Konfiqurasiya edilmiş idarəedicini və `force_transfer_enabled` tələb edir.|
| `SetRwaControls`                           |Lot nəzarət siyasətini dəyişdirin. Sahibdən və ya nəzarətçidən tələb olunur.|
| `SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |Lot metadatasını güncəlləyin. Sahib və ya idarəçi tələb olunur; dondurulmuş lotlar üçün idarəçi tələb olunur.|

Cari kodda `UnregisterRwa` təlimatı yoxdur. Təmsil olunan miqdar çatdırıldıqda, istifadə edildikdə, tənzimləndikdə və ya başqa şəkildə dövriyyədən çıxarıldıqda `RedeemRwa` ilə off-chain lotu ləğv edin.

## Metaməlumat və Nəzarətlər {#metadata-and-controls}

Lotu müəyyən etməyə və yoxlamağa kömək edən kompakt faktlar üçün metadatalardan istifadə edin:

- aktiv sinfi, buraxan, depozitçi və ya reyestr istinadı
- anbar, seyf, ISIN, faktura və ya sertifikat identifikatorları
- təsdiqlər və hüquqi sənədlər üçün məzmun kriptoqrafik xəşləri
- SoraFS daha böyük sübut paketləri üçün yollar və ya texniki manifesta istinadları
- zəka, yurisdiksiya və ya off-chain xidmətlər tərəfindən istifadə olunan uyğunluq etiketləri

Tətbiq edilmiş `RwaControlPolicy`-ın bu sahələri var:

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

Kontroller hesabları və rolları yalnız müvafiq boolean bayraqları ilə aktiv edilmiş əməliyyatları icra edə bilər. Cari nəzarət məlumat dəsti kontrollerlərin kimliklərini və əməliyyat bayraqlarını ehtiva edir. Transfer icazə siyahıları və iç-içə `transfers` qaydaları bu məlumat dəstinin xaricindədir.

## Sorğular, Hadisələr və APIs {#queries-events-and-apis}

İstifadə et [`FindRwas`](/az/reference/queries.md#assets-nfts-and-rwas) qeydiyyatdan keçmişləri siyahıya almaq RWA çox. Canlı yeniləmələrə ehtiyacı olan tətbiqlər abunə ola bilər [`Rwa` veri hadisələri](/az/blockchain/filters.md#data-event-filters) yaradılan, sahib dəyişdirilən, bölünmüş, birləşdirilmiş, geri alınmış, dondurulmuş, dondurulması açılmış, saxlanılmış, buraxılmış, qüvvə ilə köçürülmüş, nəzarəti dəyişdirilmiş və metadatalar hadisələri.

Torii zəncir-dövlət marşrutlarını belə aşkar edir `/v1/rwas` və `/v1/rwas/query`, eləcə də kəşfiyyat marşrutları kimi `/v1/explorer/rwas` və `/v1/explorer/rwas/{rwa_id}` o marşrut ailəsi aktiv olduqda. Yaradılan müştərilər canlıyı üstün tutmalıdır [`/openapi.json`](/az/reference/torii-endpoints.md#common-endpoints) bir node tərəfindən göstərilən dəqiq cavab formasını sənədləşdirmək.

### Bu iş axınını Taira üzərində işə sal {#try-it-on-taira}

Yoxlayın ki, ictimai Taira hazırda qeydiyyatdan keçmiş RWA lotlara sahibdir:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

Canlı Taira OpenAPI sənədində göstərilən RWA marşrutlarını siyahıya alın:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

Heç bir ictimai lot hələ qeydiyyatdan keçmədikdə boş `items` çıxışı gözlənilir. Qeydiyyat, köçürmə, saxlama, dondurma və geri alım imzalanmış əməliyyatlardır.

## Cəhd et {#try-it}

Aşağıdakı nümunələr [Paylaşılan Quraşdırma](/az/guide/tutorials/python.md#shared-setup) saytından Python SDK səthlərini istifadə edir. Əməliyyatı təqdim etmədən əvvəl hesab ID-lərini, şəxsi açarları və yaradılmış lot ID-lərini öz şəbəkənizdən olan dəyərlərlə əvəz edin.

### RWA API Marşrutlarını Kəşf Et {#discover-rwa-api-routes}

Bu yalnız oxumaq üçün nümunə, işləyən Torii node-dan hansı app-üzlü RWA marşrutların aktiv olduğunu soruşur:

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

Əgər siyahı boşdursa, node hələ də digər Torii APIs vasitəsilə RWA təlimatlarını və sorğuları dəstəkləyə bilər, lakin o, könüllü JSON marşrut ailəsini açmır.

### Anbar protokolunun nəticə qeydini qeydiyyatdan keçirin {#register-a-warehouse-receipt}

Bir biznes əməliyyatı bir imzalanmış əməliyyata çevrilməli olduqda layihədən istifadə edin. Biznes protokolu nəticə qeydiyyat nömrəsi `primary_reference` yerinə daxil edilir; blokçeyn ledger identifikatoru əməliyyat tamamlandıqdan sonra yaradılır.

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

Əməliyyat tamamlandıqdan sonra yaradılmış RWA ID-ləri siyahıya alın. Zəncir-vəziyyət marşrutları tək protokol-standart ID-ləri göstərir; bir ID-ni `primary_reference` və ya metadata ilə uyğunlaşdırmaq lazım olduqda hadisələrdən və ya tədqiqatçı detalları marşrutlarından istifadə edin:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Explorer-aktiv edilmiş düyünlər həmçinin daha zəngin proqnozlar verə bilər:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### Müvəqqəti Saxlama ilə Köçürmə {#transfer-with-a-temporary-hold}

Zəncir tərəfindən qaytarılan yaradılmış RWA ID-dən istifadə edin. Bu nümunə `alice`-ın sahibi olduğunu və həmçinin `hold_enabled` ilə nəzarətçi kimi konfiqurasiya olunduğunu nəzərdə tutur.

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

Off-chain prosesi uğurla başa çatdıqdan sonra `ReleaseRwa` təqdim edin:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Nəzarətləri və Audit Metadatasını Əlavə Et {#add-controls-and-audit-metadata}

Nəzarət və metadata ayrı-ayrıdır. Nəzarəti kontroller siyasəti üçün, metadatanı isə tətbiqlərin və ya auditorların göstərməsi lazım olan faktlar üçün istifadə edin:

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

### Miqdarı geri al və ya ləğv et {#redeem-or-retire-quantity}

Nümayiş olunan off-chain aktiv çatdırıldıqdan, istifadə edildikdən, ləğv edildikdən və ya başqa şəkildə dövriyyədən çıxarıldıqdan sonra `RedeemRwa`-ı təqdim edin. Bu, təqdim olunan miqdarı daimi olaraq lotdan çıxarır. Lotda `redeem_enabled` olmalıdır. Kriptoqrafik imzalayan sahibi və ya nəzarətçi olmalıdır.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Uyğunluq Yoxlaması Zamanı Dondurulma {#freeze-during-compliance-review}

Zəncir kənarı icmal adi sahib əməliyyatlarını bloklamalı olduqda `FreezeRwa` təqdim edin. Kriptoqrafik imzalayan bir nəzarətçi olmalıdır. Lotda `freeze_enabled` olmalıdır.

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

Yoxlamadan keçdikdən sonra `UnfreezeRwa` təqdim edin:

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

### Alınacaq Faktura {#invoice-receivable}

Fakturanı RWA lotu kimi təqdim edin, faktura nömrəsini `primary_reference` və metadatalarda saxlayaraq. Qeydiyyatdan sonra, köçürmə və geri ödəniş üçün yaradılmış ID-dən istifadə edin.

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

Alınacaq məbləğ maliyyələşdirildikdə və ya ödənildikdə, yaradılmış faktura lot ID-sindən istifadə edin:

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

Zəncirdən kənar maliyyə əməliyyatının həllindən sonra göstərilən məbləği geri alın:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Karbon kreditinin dövriyyədən çıxarılması {#carbon-credit-retirement}

Dələduz olaraq iddia olunan karbon kreditlərini dövriyyədən çıxarmaq üçün `RedeemRwa`-i təqdim edin. Off-chain sertifikatını və ya qeydiyyat sübutunu metadatalarda saxlayın:

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

### İki Lotu Birləşdir {#merge-two-lots}

İki off-chain mövqe birləşdirildikdə lotları birləşdirin. Valideynlər eyni domen olmalı və eyni miqdar spesifikasiyasından istifadə etməlidir. Proqram icra mühiti uşaq lot ID-sini yaradır.

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

Tam Python əməliyyat nümunəsi üçün [Həqiqi Dünyada Aktivlər](/az/guide/tutorials/python.md#real-world-assets)-a baxın.

## Əlaqəli sənədlər {#related-docs}

- [Aktivlər](/az/blockchain/assets.md)
- [Metaməlumat](/az/blockchain/metadata.md)
- [Iroha Təlimat əməliyyatları](/az/blockchain/instructions.md)
- [Sorğular](/az/reference/queries.md#assets-nfts-and-rwas)
- [Torii API son nöqtələr](/az/reference/torii-endpoints.md#app-and-sora-route-families)
