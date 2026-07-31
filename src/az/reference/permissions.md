---
translation_locale: az
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# İzin simvolları {#permission-tokens}

Bu səhifədə mövcud Iroha icraatçı məlumat modeli tərəfindən açıqlanan standart icazə-token növləri siyahıya alınıb. Rol və icazələrə dair konseptual təlimat üçün [Rəsmlər](/az/blockchain/permissions.md) baxın.

İzin yoxlamaları aktiv icra vaxtı təsdiqləyici tərəfindən həyata keçirilir. Aşağıda göstərilən token növlərinin adları standart siyasət səthini təsvir edir, lakin bir şəbəkə icra müddətinin təkmilləşdirilməsi ilə icra vaxtının təsdiqlənməsini özelleştire bilər.

## Default Tokens {#default-tokens}

|İzin əlaməti |Kategoriya |Əməliyyat |
| --- | --- | --- |
|`CanManagePeers` |Tərəfdaş |Tərəfdaşları qeydiyyatdan çıxarın, qeydiyyata alınmayın və ya başqa bir şəkildə idarə edin. |
|`CanManageLaneRelayEmergency` |Tərəfdaş |Fövqəladə yolun relay nəzarətlərini idarə edin.|
|`CanRegisterDomain` |Domain |Bir domen qeydiyyatına alın.|
|`CanUnregisterDomain` |Domain |Domenin qeydiyyatını ləğv edin. |
|`CanModifyDomainMetadata` |Domain |Domen metadatalarını dəyişdirin. |
|`CanRegisterAccount` |Hesab |Hesab yazın. |
|`CanUnregisterAccount` |Hesab |Hesabı ləğv edin. |
|`CanModifyAccountMetadata` |Hesab |Hesabın metadatalarını dəyişdirin. |
|`CanUnregisterAssetDefinition` |Mülkiyyətin təyinatı|Bir aktiv tərifini qeydiyyatdan çıxarın. |
|`CanModifyAssetDefinitionMetadata` |Mülkiyyətin təyinatı|Əmtəə tərifinin metadatalarını dəyişdirin. |
|`CanMintAssetWithDefinition` |Mülkiyyət|Müəyyən bir tərifləmə üçün mint aktivləri. |
|`CanBurnAssetWithDefinition` |Mülkiyyət|Müəyyən bir tərif üçün aktivləri yandırın. |
|`CanTransferAssetWithDefinition` |Mülkiyyət|Müəyyən bir tərif üçün aktivlərin köçürülməsi. |
|`CanMintAsset` |Mülkiyyət|Müəyyən bir aktiv balansı hazırlayın. |
|`CanBurnAsset` |Mülkiyyət|Müəyyən bir aktiv balansını yandırın.|
|`CanTransferAsset` |Mülkiyyət|Müəyyən bir aktiv balansını köçürmək. |
|`CanRegisterNft` |NFT |NFT qeydiyyatına alın. |
|`CanUnregisterNft` |NFT |NFT qeydiyyatdan çıxarın. |
|`CanTransferNft` |NFT |Bir NFT köçürün. |
|`CanModifyNftMetadata` |NFT |NFT metadataları dəyişdirin. |
|`CanSetParameters` |Parametrlər |Zəngindəki konfigurasiya parametrlərini təyin edin. |
|`CanManageRoles` |Rollar |Qeydiyyatdan keçmək, qeydiyyatdan çıxartmaq və ya rolları ləğv etmək. |
|`CanRegisterTrigger` |Trigger |Çıxışını qeyd edin.|
|`CanExecuteTrigger` |Trigger |Çıxışdırıcı vurun.|
|`CanUnregisterTrigger` |Trigger |Çıxışını ləğv edin.|
|`CanModifyTrigger` |Trigger |Trigger konfigurasiyasını dəyişdirin. |
|`CanModifyTriggerMetadata` |Trigger |Trigger metadatalarını dəyişdirin. |
|`CanUpgradeExecutor` |İcraçı |Runtime icraçısını yüksəldin. |
|`CanRegisterSmartContractCode` |Ağıllı müqavilə|Ağıllı müqavilə kodunu qeyd edin.|
|`CanUseFeeSponsor` |Nexus |Nexus ödənişləri müəyyən edilmiş sponsor hesabına yükləyin. |

## Mülkiyyət {#ownership}

Məlumat modellərində istifadə olunan kanonik obyektə IDs istinad etmək lazımdır. Məsələn, hesab icazələri kanonik domensiz hesabı IDs, domen icazələri `domain.dataspace` domenini IDs göstərir, və aktivlərə icazələr kanonik aktiv tərifinə və ya aktivə aiddir IDs.

Bir əməliyyat icazə səhvləri ilə uğursuz olduqda, hər iki tərəfi yoxlayın:

- əməliyyatın imzalanması hesabı gözlənilən kanonik hesabdır.
- Təlimatda istifadə olunan dəqiq obyekt ID üçün icazə nişanı və ya rolu verilmişdir
