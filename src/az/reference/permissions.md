---
translation_locale: az
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# İcazə Jetonları {#permission-tokens}

Bu səhifə hazırkı Iroha icraçı məlumat modelində açıqlanan standart icazə-jeton növlərini sadalayır. Rollar və icazələr üzrə konseptual bələdçi üçün [İcazələr](/az/blockchain/permissions.md)-a baxın.

İcazə yoxlamaları aktiv proqram təminatı icra mühiti yoxlayıcısı tərəfindən tətbiq olunur. Aşağıdakı token növü adları standart siyasət səthini təsvir edir, lakin bir şəbəkə icraçını yeniləyərək proqram təminatı icra mühitinin yoxlanmasını özəlləşdirə bilər.

## Standart simvollar {#default-tokens}

|İcazə tokeni|Kateqoriya|Əməliyyat|
| --- | --- | --- |
| `CanManagePeers` |şəbəkə əlaqəsi|Şəbəkə iştirakçılarını qeydiyyatdan keçirin, qeydiyyatdan çıxarın və ya başqa şəkildə idarə edin.|
| `CanManageLaneRelayEmergency` |şəbəkə əlaqəsi|Təcili ehtiyat yol əlaqə nəzarətlərini idarə edin.|
| `CanRegisterDomain` |Domen|Bir domain qeydiyyatdan keçirin.|
| `CanUnregisterDomain` |Domen|Bir domeni qeydiyyatdan silmək.|
| `CanModifyDomainMetadata` |Domen|Domen metadatasını dəyişdirin.|
| `CanRegisterAccount` |Hesab|Hesab qeydiyyatdan keçirin.|
| `CanUnregisterAccount` |Hesab|Hesabı qeydiyyatdan silmək.|
| `CanModifyAccountMetadata` |Hesab|Hesabın metadata-sını dəyişdirin.|
| `CanUnregisterAssetDefinition` |Əmlakın tərifi|Aktiv təyinatını qeydiyyatdan silin.|
| `CanModifyAssetDefinitionMetadata` |Aktivin tərifi|Aktiv-təyinat metadatasını dəyişdirin.|
| `CanMintAssetWithDefinition` |Əmlak|müəyyən bir tərif üçün aktivlər buraxmaq.|
| `CanBurnAssetWithDefinition` |Əmlak|müəyyən bir tərif üçün aktivləri məhv etmək.|
| `CanTransferAssetWithDefinition` |Əmlak|Müəyyən bir tərif üçün aktivləri köçürün.|
| `CanMintAsset` |Əmlak|müəyyən bir aktiv balansını vermək.|
| `CanBurnAsset` |Əmlak|müəyyən bir aktiv balansını məhv etmək.|
| `CanTransferAsset` |Əmlak|Müəyyən bir aktiv balansını köçürün.|
| `CanRegisterNft` | NFT |NFT qeydiyyatdan keçin.|
| `CanUnregisterNft` | NFT |NFT qeydiyyatdan sil.|
| `CanTransferNft` | NFT |Bir NFT köçürün.|
| `CanModifyNftMetadata` | NFT |NFT metadata-sını dəyişdirin.|
| `CanSetParameters` |Parametrlər|Zəncir üzərində konfiqurasiya parametrlərini təyin edin.|
| `CanManageRoles` |Rollar|Rolları qeydiyyatdan keçirin, qeydiyyatdan silin, verin və ya ləğv edin.|
| `CanRegisterTrigger` |Tətik|Bir tetikleyici qeydiyyatdan keçirin.|
| `CanExecuteTrigger` |Tətik|Bir tetikleyici işlədir.|
| `CanUnregisterTrigger` |Tətik|Trigleri qeydiyyatdan çıxarın.|
| `CanModifyTrigger` |Tətik|Tətik ayarını dəyişdirin.|
| `CanModifyTriggerMetadata` |Tətik|Tətik metadatasını dəyişdirin.|
| `CanUpgradeExecutor` |İcraçı|Proqram təminatının icra mühiti yerinə yetiricisini yeniləyin.|
| `CanRegisterSmartContractCode` |Ağıllı müqavilə|Ağıllı müqavilə kodunu qeydiyyatdan keçirin.|
| `CanUseFeeSponsor` | Nexus |Müəyyən edilmiş sponsor hesabına Nexus ödənişləri yükləyin.|

## Sahiblik {#ownership}

Sahib-həssas icazə tokenləri cari məlumat modeli tərəfindən istifadə olunan tək protokol-standart obyekt ID-lərinə istinad etməlidir. Məsələn, hesab icazələri tək obyektlərə istinad edir protokol-standartlı domen olmayan hesab ID-ləri, domen icazələri `domain.dataspace` domen ID-lərinə aid edilir və aktiv icazələri tək protokol-standartlı aktiv tərifi və ya aktiv ID-lərinə aiddir.

Transaksiya icazə xətası ilə uğursuz olduqda, hər iki tərəfi yoxlayın:

- əməliyyatı imzalayan hesab gözlənilən tək protokol-standart hesabıdır
- icazə tokeni və ya rolu təlimatda istifadə olunan dəqiq obyekt identifikatoru üçün verildi
