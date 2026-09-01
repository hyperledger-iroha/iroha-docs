---
translation_locale: az
translation_source: /reference/queries.md
translation_source_hash: 88dba1142d7b6a452a5f56d56640ceef47a52ca28e296d6d0ee5992b9005c3bb
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Sorğular {#queries}

Iroha sorğuları blokçeyn dəftərxana vəziyyətini dəyişdirmədən oxuyur. Mövcud məlumat modeli iki əsas sorğu formasını ortaya qoyur:

- tək sorğular, bir obyekt və ya bir dəyər qaytaran
- təkrarlana bilən sorğular, axın və ya kolleksiya qaytaran və sorğu növü dəstəklədikdə filtrasiya, sıralama, proyeksiya və səhifələmə ilə birləşdirilə bilən

Sorğu məlumat konteynerlərini əl ilə qurmaq əvəzinə SDK tipli yaradıcılarından və ya CLI istifadə edin. Aşağıdakı adlar `iroha_data_model::query` tərəfindən təqdim olunan mövcud sorğu növləridir.

## proqram təminatı icra mühiti və Konfiqurasiya {#runtime-and-configuration}

|Sorğu|Məqsəd|
| --- | --- |
| `FindAbiVersion` |İcraçının ABI versiyasını qaytarın.|
| `FindExecutorDataModel` |İcraçı məlumat modeli təsvirini qaytarın.|
| `FindParameters` |Zəncir üzərindəki icraçı konfiqurasiya parametrlərini qaytarın.|

## Hesablar və İcazələr {#accounts-and-permissions}

|Sorğu|Məqsəd|
| --- | --- |
| `FindAccountById` |Bir protokol-standart hesab ID-si ilə bir hesab tapın.|
| `FindAccountByAlias` |Bir hesab təxəllüsünü hesaba çevirin.|
| `FindAccounts` |Qeydiyyatdan keçmiş hesabları siyahıya al.|
| `FindAccountIds` |Qeydiyyatdan keçmiş hesab ID-lərini siyahıya alın.|
| `FindAccountsWithAsset` |Verilmiş aktiv tərifini saxlayan hesabları siyahıya alın.|
| `FindAliasesByAccountId` |Hesaba bağlı ləqəblərin siyahısını göstər.|
| `FindAccountRecoveryPolicyByAlias` |Bir ləqəb üçün bərpa siyasətini tapın.|
| `FindAccountRecoveryRequestByAlias` |Bir ləqəb üçün bərpa sorğusunu tapın.|
| `FindRoles` |Rolları siyahıya al.|
| `FindRoleIds` |Rol ID-lərini siyahıya alın.|
| `FindRolesByAccountId` |Hesaba verilmiş rolları siyahıya alın.|
| `FindPermissionsByAccountId` |Hesaba verilmiş icazələri siyahıya al.|

## Domenlər və şəbəkə həmkarları {#domains-and-peers}

|Sorğu|Məqsəd|
| --- | --- |
| `FindDomainById` |`DomainId` ilə bir domen tapın.|
| `FindDomains` |Qeydiyyatdan keçmiş domenləri siyahıya al.|
| `FindDomainsByAccountId` |Hesab tərəfindən sahib olunan domenləri siyahıya al.|
| `FindDomainEndorsements` |Domain təsdiq qeydlərini siyahıya al.|
| `FindDomainEndorsementPolicy` |Domen təsdiq siyasətini qaytarın.|
| `FindDomainCommittee` |Domen komitəsini geri qaytarın.|
| `FindPeers` |Blokçeyn dəftərində məlum olan etibarlı şəbəkə həmkarlarının siyahısını verin.|

## Aktivlər, NFTs, və RWAs {#assets-nfts-and-rwas}

|Sorğu|Məqsəd|
| --- | --- |
| `FindAssets` |Aktiv balanslarını siyahıya alın.|
| `FindAssetsDefinitions` |Aktivlərin təriflərini siyahıya alın.|
| `FindAssetsByAccountId` |Hesab tərəfindən saxlanılan aktivlərin siyahısını verin.|
| `FindAssetById` |`AssetId` ilə bir əmlak balansını tapın.|
| `FindAssetDefinitionById` |Bir aktivin tərifini ID üzrə tapın.|
| `FindNfts` | Siyahı NFTs. |
| `FindNftsByAccountId` |Hesaba aid NFTs siyahısı.|
| `FindRwas` |Qeydiyyatdan keçmiş real dünya əmlak lotlarını siyahıya alın.|

## Etibarnamə və Sübut Qeydləri {#escrow-and-proof-records}

Escrow sorğuları [yerli aktiv eskro ISIs](/az/blockchain/escrow.md) tərəfindən yaradılmış qeydləri, o cümlədən bazar yeri escrow-ları, ümumi aktiv blokları və anonim escrow qeydlərini yoxlayır.

|Sorğu|Məqsəd|
| --- | --- |
| `FindAssetEscrows` |Aktiv etibarnamə qeydlərini siyahıya alın.|
| `FindAssetEscrowById` |Bir aktiv əmanətini ID ilə tapın.|
| `FindAssetEscrowsBySeller` |Müəssisəci tərəfindən aktiv girovları siyahıya alın.|
| `FindAssetEscrowsByBuyer` |Alıcıya görə aktiv depozitləri siyahıya al.|
| `FindAssetEscrowsByStatus` |Aktiv əmanətləri statusa görə siyahıya alın.|
| `FindAnonymousAssetEscrows` |Anonim aktiv əmanət qeydlərini siyahıya alın.|
| `FindAnonymousAssetEscrowById` |ID ilə bir anonim əmanət hesabını tapın.|
| `FindAnonymousAssetEscrowsBySeller` |Satıcı tərəfindən anonim depozitləri siyahıya alın.|
| `FindAnonymousAssetEscrowsByBuyer` |Alıcıya görə anonim depozitləri siyahıya al.|
| `FindAnonymousAssetEscrowsByStatus` |Anonim əmanətləri statusa görə siyahıya alın.|
| `FindProofRecordById` |Bir sübut qeydini ID ilə tapın.|
| `FindProofRecords` |Sənəd qeydlərini siyahıya alın.|
| `FindProofRecordsByBackend` |Bir sübut backend-i üçün sübut qeydlərini siyahıya alın.|
| `FindProofRecordsByStatus` |Sənəd sübut qeydlərini statusa görə siyahıya alın.|

## Nexus, Məlumatın Mövcudluğu və Paketlər {#nexus-data-availability-and-packages}

|Sorğu|Məqsəd|
| --- | --- |
| `FindRepoAgreements` |Zəncirdə saxlanılan saxlama müqavilələrini siyahıya alın.|
| `FindTwitterBindingByHash` |Kriptoqrafik xəş vasitəsilə Twitter bağlamasını həll edin.|
| `FindDaPinIntentByTicket` |Bilet üzrə məlumat mövcudluğu pin niyyətini tapın.|
| `FindDaPinIntentByManifest` |Texniki manifest istinadına görə pin niyyətini tapın.|
| `FindDaPinIntentByAlias` |Bir pin niyyətini ləqəblə tapın.|
| `FindDaPinIntentByLaneEpochSequence` |İcra yoluna, epoxa və ardıcıllığa görə pin niyyətini tapın.|
| `FindLaneRelayEnvelopeByRef` |Təsdiqlənmiş yol-relə məlumat konteynerini tapın.|
| `FindSorafsProviderOwner` | SoraFS təminatçısının sahibini müəyyən edin.|
| `FindDataspaceNameOwnerById` |Bir məlumat sahəsi adı sahibini həll edin.|
| `FindMusubiExactPackageV1` |Bir dəqiq paket qeydini və onun cari dəyişikliklərini oxuyun.|
| `FindMusubiExactReleaseV1` |Bir dəqiq buraxılış anlıq görüntüsünü oxuyun.|
| `FindMusubiProviderBundleAttestationV1` |Bir təminatçının arxiv-bundl təsdiqini oxuyun.|
| `FindMusubiResolverIndexV1` |Yekunlaşdırılmış həlledici indeksinə keçin.|
| `FindMusubiVersionsV1` |Bir paket üçün səhifənin yekunlaşdırılmış versiyaları.|
| `FindMusubiMaintainersV1` |Səhifə qəbul edilmiş baxıcıları və gözləyən dəvətnamələri göstərir.|
| `FindMusubiArchiveLocationsV1` |Səhifə bir arxiv üçün SoraFS yerləri tamamlandı.|
| `FindMusubiArchiveRetentionV1` |Səhifə arxiv-saxlama qeydləri.|
| `FindMusubiAliasV1` |Qlobal əlaqənin cari hədəfini və təkrarını oxuyun.|
| `FindMusubiAliasHistoryV1` |Qlobal ləqəbin dəyişməz təkrar istiqamətləndirmə tarixçəsini səhifələyin.|
| `FindMusubiOrderedPrefixV1` |Səhifə paketləri bir sifarişli struktur prefiksi altında.|

## Tətikləyicilər, Müqavilələr, Əməliyyatlar və Bloklar {#triggers-contracts-transactions-and-blocks}

|Sorğu|Məqsəd|
| --- | --- |
| `FindActiveTriggerIds` |Aktiv tetikleyici ID-lərini siyahıya al.|
| `FindTriggers` |Siyahı tətikləyiciləri.|
| `FindTriggerById` |Bir tətikçini ID üzrə tapın.|
| `FindContractManifestByCodeHash` |Şifrləmə xətti kodu ilə ağıllı müqavilənin texniki manifestini tapın.|
| `FindTransactions` |Təsdiqlənmiş əməliyyatların siyahısı.|
| `FindBlocks` |Blokları siyahıya alın.|
| `FindBlockHeaders` |Blok başlıqlarını siyahıya al.|

## Filtrləmə və Səhifələmə {#filtering-and-pagination}

Təkrarlana bilən sorğular predicate və selector dəstəyini göstərə bilər. Filtr girişinin sorğu çıxış tipi ilə uyğun gəlməsi üçün SDK tərəfindən təmin edilmiş sorğuya xas tipli filtrləri istifadə edin. Böyük nəticə dəstləri üçün hər sətri bir-bir götürmək əvəzinə cursor və limit kimi sorğu parametrlərindən istifadə edin.
