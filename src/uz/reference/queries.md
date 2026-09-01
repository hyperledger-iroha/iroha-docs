---
translation_locale: uz
translation_source: /reference/queries.md
translation_source_hash: 88dba1142d7b6a452a5f56d56640ceef47a52ca28e296d6d0ee5992b9005c3bb
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# So'rovlar {#queries}

Iroha so‘rovlari reyestr holatini o‘zgartirmasdan o‘qiydi. Joriy ma’lumot modeli ikki keng so‘rov shaklini taqdim etadi:

- bir obyekt yoki bitta qiymatni qaytaradigan yagona so‘rovlar
- iterable so‘rovlar, ular oqim yoki to‘plamni qaytaradi va agar so‘rov turi qo‘llab-quvvatlasa filtratsiya, saralash, projektsiya va sahifalash bilan birlashtirilishi mumkin

SDK tipidagi quruvchilar yoki CLI dan foydalaning, so‘rov ma’lumotlari konteynerlarini qo‘lda qurish o‘rniga. Quyida keltirilgan nomlar `iroha_data_model::query` tomonidan taqdim etilgan joriy so‘rov turlari hisoblanadi.

## dasturiy ta'minotni bajarish muhiti va sozlamalar {#runtime-and-configuration}

|So'rov| Maqsad |
| --- | --- |
| `FindAbiVersion` |Ijrochi ABI versiyasini qaytaring.|
| `FindExecutorDataModel` |Ijrochi ma'lumot modeli tavsifini qaytaring.|
| `FindParameters` |Zanjir ustidagi ijrochi sozlamalari parametrlarini qaytaring.|

## Hisoblar va Ruxsatlar {#accounts-and-permissions}

|So'rov| Maqsad |
| --- | --- |
| `FindAccountById` |Bitta protokol-standart hisob identifikatori bilan bitta hisobni toping.|
| `FindAccountByAlias` |Hisob aliasini hisobga aniqlash.|
| `FindAccounts` |Ro‘yxatga olingan hisoblarni ko‘rsatish.|
| `FindAccountIds` |Ro‘yxatga olingan hisob raqamlarini ko‘rsating.|
| `FindAccountsWithAsset` |Berilgan aktiv ta'rifiga ega hisoblarni ro'yxatlang.|
| `FindAliasesByAccountId` |Hisobga bog‘langan laqamlarni ro‘yxatlang.|
| `FindAccountRecoveryPolicyByAlias` |Alias uchun tiklash siyosatini toping.|
| `FindAccountRecoveryRequestByAlias` |Alias uchun tiklash so‘rovini toping.|
| `FindRoles` |Rollarni ro'yxatlang.|
| `FindRoleIds` |Rol IDlarini ro'yxatlang.|
| `FindRolesByAccountId` |Hisobga berilgan rollarni ro'yxatlash.|
| `FindPermissionsByAccountId` |Hisobga berilgan ruxsatlarni ro'yxatlang.|

## Domenlar va tarmoq tengdoshlar {#domains-and-peers}

|So'rov| Maqsad |
| --- | --- |
| `FindDomainById` |`DomainId` orqali bitta domenni toping.|
| `FindDomains` |Ro‘yxatga olingan domenlarni ko‘rsatish.|
| `FindDomainsByAccountId` |Hisobga tegishli domenlarni ro'yxatlang.|
| `FindDomainEndorsements` | Domenni qo‘llab-quvvatlash yozuvlarini ro‘yxatlang. |
| `FindDomainEndorsementPolicy` |Domen qo‘llab-quvvatlash siyosatini qaytaring.|
| `FindDomainCommittee` | Domen qo'mitasini qaytaring. |
| `FindPeers` |Blockchain daftariga ma'lum bo'lgan ishonchli tarmoq hamkasblarini ro'yxatini tuzing.|

## Aktivlar, NFTs, va RWAs {#assets-nfts-and-rwas}

|So'rov| Maqsad |
| --- | --- |
| `FindAssets` |Aktiv balanslarini ro'yxatlang.|
| `FindAssetsDefinitions` |Aktiv ta'riflarini ro'yxatlang.|
| `FindAssetsByAccountId` |Hisobda saqlanayotgan aktivlarni ro'yxatlang.|
| `FindAssetById` |`AssetId` bo‘yicha bitta aktiv balansini toping.|
| `FindAssetDefinitionById` |ID bo‘yicha bitta aktiv ta’rifini toping.|
| `FindNfts` | Roʻyxat NFTs. |
| `FindNftsByAccountId` |Hisobga tegishli NFTs roʻyxati.|
| `FindRwas` |Ro‘yxatga olingan real dunyo aktivlari partiyalarini ko‘rsatish.|

## Depozit va Dalillar Qaydnomalari {#escrow-and-proof-records}

Escrow soʻrovlari [mahalliy aktiv depozit ISIs](/uz/blockchain/escrow.md) tomonidan yaratilgan yozuvlarni, jumladan, bozor escrowlarini, umumiy aktiv qulfini va anonim escrow yozuvlarini tekshiradi.

|So'rov| Maqsad |
| --- | --- |
| `FindAssetEscrows` |Aktivlarni ishonch hisobvarag‘i yozuvlarini ro‘yxatlang.|
| `FindAssetEscrowById` |ID bo‘yicha bitta aktiv eskrouni toping.|
| `FindAssetEscrowsBySeller` |Aktivlarni sotuvchi bo‘yicha ro‘yxatlang.|
| `FindAssetEscrowsByBuyer` |Mijoz bo‘yicha aktivlarni garovga ro‘yxatlang.|
| `FindAssetEscrowsByStatus` |Aktivlarni garov holatiga ko'ra ro‘yxatlang.|
| `FindAnonymousAssetEscrows` |Anonim aktivlar omonat yozuvlarini ro'yxatlang.|
| `FindAnonymousAssetEscrowById` |ID orqali bitta anonim aktiv eskrou toping.|
| `FindAnonymousAssetEscrowsBySeller` |Sotuvchi bo‘yicha anonim eskroularni ro‘yxatlang.|
| `FindAnonymousAssetEscrowsByBuyer` |Xaridor bo‘yicha anonim omonatlarni ro‘yxatlang.|
| `FindAnonymousAssetEscrowsByStatus` |Anonim eskrolarni holatiga ko‘ra ro‘yxatlang.|
| `FindProofRecordById` |ID bo‘yicha bitta tasdiqlash yozuvini toping.|
| `FindProofRecords` |Isbot yozuvlarini ro‘yxatlang.|
| `FindProofRecordsByBackend` |Isbot orqa tizimi uchun isbot yozuvlarini roʻyxatlash.|
| `FindProofRecordsByStatus` |Dalil yozuvlarini holatga ko‘ra ro‘yxatlang.|

## Nexus, Ma'lumotlarning mavjudligi va Paketlar {#nexus-data-availability-and-packages}

|So'rov| Maqsad |
| --- | --- |
| `FindRepoAgreements` |Zanjirda saqlangan ombor kelishuvlarini roʻyxatlang.|
| `FindTwitterBindingByHash` |Kriptografik xesh orqali Twitter bog‘lanishini hal qiling.|
| `FindDaPinIntentByTicket` |Chipta orqali ma'lumot mavjudligi pin ni toping.|
| `FindDaPinIntentByManifest` |Manifest havolasiga ko‘ra pin niyatini toping.|
| `FindDaPinIntentByAlias` |Alias orqali pin maqsadini toping.|
| `FindDaPinIntentByLaneEpochSequence` |Ishga tushirish yo‘lagi, davr va ketma-ketlik bo‘yicha pin ni toping.|
| `FindLaneRelayEnvelopeByRef` |Tekshirilgan yo‘l-relay ma’lumot konteynerini toping.|
| `FindSorafsProviderOwner` |SoraFS provayderining egasini aniqlang.|
| `FindDataspaceNameOwnerById` |Dataspace-nomi egasini aniqlash.|
| `FindMusubiExactPackageV1` |Bir aniq paket yozuvini va uning joriy tahririyatlarini o'qing.|
| `FindMusubiExactReleaseV1` |Bir aniq chiqarilgan snapshotni o'qing.|
| `FindMusubiProviderBundleAttestationV1` |Bir provayderning arxiv-paket tasdig'ini o'qing.|
| `FindMusubiResolverIndexV1` | Yakunlangan rezolyutor indeksini sahifalang.|
| `FindMusubiVersionsV1` |Bir paket uchun sahifa yakunlangan versiyalari.|
| `FindMusubiMaintainersV1` |Sahifa qabul qilingan saqlovchilar va kutayotgan takliflarni ko‘rsatadi.|
| `FindMusubiArchiveLocationsV1` |Bitta arxiv uchun SoraFS joylar sahifasi yakunlandi.|
| `FindMusubiArchiveRetentionV1` |Sahifa arxiv-saqlash yozuvlari.|
| `FindMusubiAliasV1` |Global aliasning joriy maqsadi va tahririni o‘qing.|
| `FindMusubiAliasHistoryV1` | Butun dunyo aliasining o'zgarmas qayta yo'naltirish tarixini sahifalang.|
| `FindMusubiOrderedPrefixV1` |Sahifa paketlari bitta tartiblangan struktural prefiks ostida.|

## Trig‘gerlar, Shartnomalar, Tranzaksiyalar va Bloklar {#triggers-contracts-transactions-and-blocks}

|So'rov| Maqsad |
| --- | --- |
| `FindActiveTriggerIds` |Faol trigger identifikatorlarini ro'yxatlang.|
| `FindTriggers` |Tetiklagichlarni ro'yxatlash.|
| `FindTriggerById` |Bitta triggerni ID bo‘yicha toping.|
| `FindContractManifestByCodeHash` |Kodning kriptografik xeshiga ko‘ra aqlli shartnoma manifestini toping.|
| `FindTransactions` |Yakunlangan tranzaksiyalar ro'yxatini tuzing.|
| `FindBlocks` |Bloklarni ro'yxatlash.|
| `FindBlockHeaders` |Blok sarlavhalarini ro'yxatlang.|

## Filtrlash va sahifalash {#filtering-and-pagination}

Takrorlanuvchi so‘rovlar predikat va selektor qo‘llab-quvvatlashini ko‘rsatishi mumkin. Filtrlash kirishi so‘rov natijasining turiga mos kelishi uchun SDK dan so‘rovga xos turdagi filtrlardan foydalaning. Katta natija to‘plamlari uchun har bir qatorni bir vaqtning o‘zida olish o‘rniga kursor va limit kabi so‘rov parametrlaridan foydalaning.
