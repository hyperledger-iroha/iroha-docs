---
translation_locale: az
translation_source: /reference/queries.md
translation_source_hash: 22e8a75acd72d066e3516ba46a0afe075d2d02790154458aec00a5d8bb861838
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Suallar {#queries}

Iroha sorğuları kitabın vəziyyətini mutasiya etmədən oxumuşdur.

- bir obyekt və ya bir dəyər qaytaran tək suallar
- İterativ suallar, bir axını və ya kolleksiyanı geri qaytarır və sorğu növünün dəstəklədiyi filtrləmə, sıralama, proyeksiya və səhifələşdirmə ilə birləşə bilər.

SDK tipli quruculardan və ya CLI tiplərindən istifadə edərək, sorğu örtüklərini əl ilə qurmaq əvəzinə istifadə edin. Aşağıda göstərilən adlar `iroha_data_model::query` tərəfindən açıqlanan cari sorğu növləridir.

## Uçuş vaxtı və quruluşu {#runtime-and-configuration}

|Sual |Məqsəd|
| --- | --- |
|`FindAbiVersion` |İcraçı ABI versiyasını qaytar. |
|`FindExecutorDataModel` |İcraçı məlumat modelinin təsviri qaytarın. |
|`FindParameters` |Zəngin icraçısının konfigurasiya parametrlərini qaytarın. |

## Hesablar və icazələr {#accounts-and-permissions}

|Sual |Məqsəd|
| --- | --- |
|`FindAccountById` |Kanon hesabına görə bir hesab tapın ID. |
|`FindAccountByAlias` |Hesabın bir adı hesabı ilə həll edin.|
|`FindAccounts` |Siyahıya alınmış hesabların siyahısı. |
|`FindAccountIds` |Siyahıda qeydə alınmış hesab IDs. |
|`FindAccountsWithAsset` |Müəyyən bir aktiv təyinatı olan hesabları siyahıya alın. |
|`FindAliasesByAccountId` |Hesabı bağlayan aliaslar siyahısı. |
|`FindAccountRecoveryPolicyByAlias` |Bir alias üçün bərpa siyasətini tapın. |
|`FindAccountRecoveryRequestByAlias` |Bir alimi üçün bərpa tələbini tapın. |
|`FindRoles` |Xidmətlər siyahısı.|
|`FindRoleIds` |Siyahı rolu IDs. |
|`FindRolesByAccountId` |Hesablara verilən rolların siyahısı. |
|`FindPermissionsByAccountId` |Hesab üçün verilən icazələrin siyahısı. |

## Domenlər və yaşıtlar {#domains-and-peers}

|Sual |Məqsəd|
| --- | --- |
|`FindDomainById` |`DomainId` ilə bir domen tapın. |
|`FindDomains` |qeydiyyatdan keçmiş domenlərin siyahısı. |
|`FindDomainsByAccountId` |Hesabın mülkiyyətində olan domenləri siyahıya alın. |
|`FindDomainEndorsements` |Domen təsdiqləmələri qeydlərini siyahıya alın. |
|`FindDomainEndorsementPolicy` |Domain təsdiq siyasətini qaytarın. |
|`FindDomainCommittee` |Dövlət komitəsini qaytarın.|
|`FindPeers` |Kitabda məlum olan etibarlı həmyaşıdların siyahısını yazın. |

## Əmlaklar NFTs və RWAs {#assets-nfts-and-rwas}

|Sual |Məqsəd|
| --- | --- |
|`FindAssets` |Aktivlərin balanslarını siyahıyaalın. |
|`FindAssetsDefinitions` |Aktivlərin təriflərini siyahıya alın. |
|`FindAssetsByAccountId` |Hesabda saxlanan aktivləri siyahıya alın. |
|`FindAssetById` |`AssetId` ilə bir aktiv balansını tapın. |
|`FindAssetDefinitionById` |ID ilə bir aktiv tərifini tapın. |
|`FindNfts` |Siyahı NFTs. |
|`FindNftsByAccountId` |Hesabın sahibi olan NFTs siyahısı. |
|`FindRwas` |Siyahıda real dünya aktivləri qeydə alınmışdır.|

## Əmanət və sübut sənədləri {#escrow-and-proof-records}

Hesablama sorğuları [dövlət əmlakının vəsiqəsi ISIs](/az/blockchain/escrow.md) tərəfindən yaradılan qeydləri yoxlayır, o cümlədən bazar əmanətlərinin vəsiqələri, ümumi varlıqların qapanmaları və anonim vəsiqələr haqqında qeydlər.

|Sual |Məqsəd|
| --- | --- |
|`FindAssetEscrows` |Əmtəələrin depozit qeydlərini siyahıya alın.|
|`FindAssetEscrowById` |ID ilə bir aktivin depozitini tapın. |
|`FindAssetEscrowsBySeller` |Satıcıya görə aktivlərin əmanətləri siyahıya alın. |
|`FindAssetEscrowsByBuyer` |Alıcı tərəfindən əmtəənin vəsiqələrini siyahıya alın. |
|`FindAssetEscrowsByStatus` |Vəziyyətinə görə aktivlərin əmanətləri siyahısı. |
|`FindAnonymousAssetEscrows` |Anonymous asset escrow qeydləri siyahısı. |
|`FindAnonymousAssetEscrowById` |ID ilə bir anonim aktiv vəsiqəsi tapın. |
|`FindAnonymousAssetEscrowsBySeller` |Satıcıya görə naməlum depozitlərin siyahısı. |
|`FindAnonymousAssetEscrowsByBuyer` |Alıcıya görə anonim depozitlər siyahısı. |
|`FindAnonymousAssetEscrowsByStatus` |Anonymous escrowları statuslarına görə siyahıyaalın. |
|`FindProofRecordById` |ID ilə bir sübut qeydini tapın. |
|`FindProofRecords` |Əldə etdiyiniz sənədləri qeyd edin.|
|`FindProofRecordsByBackend` |Proof backend üçün sübut qeydlərini siyahıya alın. |
|`FindProofRecordsByStatus` |Məlumatların statuslarına görə siyahıya alın. |

## Nexus, Məlumatların mövcudluğu və paketlər {#nexus-data-availability-and-packages}

|Sual |Məqsəd|
| --- | --- |
|`FindRepoAgreements` |Zəncirdə saxlanılan anbar müqavilələrini siyahıya alın. |
|`FindTwitterBindingByHash` |Twitter bağlamasını hash ilə həll edin. |
|`FindDaPinIntentByTicket` |Biletə görə məlumatların mövcudluğu üçün bir pin niyyətini tapın. |
|`FindDaPinIntentByManifest` |Açıq istinad vasitəsilə pin niyyətini tapın. |
|`FindDaPinIntentByAlias` |Əksi adı ilə bir pin niyyətini tap.|
|`FindDaPinIntentByLaneEpochSequence` |Lənə, dövr və ardıcıllıq üzrə bir pin niyyətini tapın.|
|`FindLaneRelayEnvelopeByRef` |Verifikasiya edilmiş bir yol-relay zarfını tapın.|
|`FindSorafsProviderOwner` |SoraFS təchizatçısının sahibini həll etmək. |
|`FindDataspaceNameOwnerById` |Məlumat sahəsi ad sahibini həll edin. |
|`FindMusubiReleaseByRef` |Musubi buraxılışını istinad yolu ilə tapın. |
|`FindMusubiPackageVersions` |Musubi paketinin versiyalarını siyahıya alın. |
|`FindMusubiPackageReleases` |Musubi paketinin siyahı buraxılışları. |
|`FindMusubiShortAliasByName` |Qısa bir Musubi alias həll edin. |

## Triggerlər, müqavilələr, əməliyyatlar və bloklar. {#triggers-contracts-transactions-and-blocks}

|Sual |Məqsəd|
| --- | --- |
|`FindActiveTriggerIds` |Aktiv tetikləyici IDs siyahısı. |
|`FindTriggers` |Çıxışçıları siyahıya al.|
|`FindTriggerById` |ID ilə bir tetikçi tapın. |
|`FindContractManifestByCodeHash` |Ağıllı müqavilə manifestini kod hash ilə tapın. |
|`FindTransactions` |Ödənişli əməliyyatların siyahısı. |
|`FindBlocks` |Siyahı blokları. |
|`FindBlockHeaders` |Blok başlıqlarını siyahıya al. |

## Filtrləşdirmə və səhifə açılması {#filtering-and-pagination}

İterable sorğuları predikat və seçicilər dəstəyini ortaya qoya bilər. SDK sorğusu xüsusi tiplənmiş filtrlərdən istifadə edin, belə ki filter giriş sorğu çıxış növü ilə uyğunlaşır. Böyük nəticə dəstləri üçün hər bir satırı eyni anda almaq əvəzinə kursor və limit kimi sorğu parametrlərindən istifadə edin.
