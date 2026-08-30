---
translation_locale: uz
translation_source: /reference/queries.md
translation_source_hash: 88dba1142d7b6a452a5f56d56640ceef47a52ca28e296d6d0ee5992b9005c3bb
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Savollar {#queries}

Iroha so'rovlar kitob holatini mutatsiya qilmasdan o'qiydi. Hozirgi ma'lumotlar modeli ikkita keng so'rov shakllarini aniqlaydi:

- bir ob'ekt yoki bitta qiymatni qaytaradigan singular so'rovlar
- qayta tiklanishi mumkin bo'lgan so'rovlar, ular oqim yoki to'plamni qaytaradi va so'rov turi uni qo'llab-quvvatlagan holda filtrlash, sinflash, proyeksiya qilish va sahifalashtirish bilan birlashtirilishi mumkin.

Foydalanish SDK o'rnatilgan qurilmalar yoki CLI so'rovlarni qo'lda qurishdan ko'ra. Quyidagi nomlar `iroha_data_model::query`.

## Ish vaqti va sozlash {#runtime-and-configuration}

|Savollar |Maqsad|
| --- | --- |
|`FindAbiVersion` |ABI ijrochi versiyasini qaytaring. |
|`FindExecutorDataModel` |Amalga oshiruvchi ma'lumotlar modelining tavsifini qaytarish. |
|`FindParameters` |Zilziladagi ijrochi konfiguratsiya parametrlarini qaytarish. |

## Hisobvaraqlar va ruxsatnomalar {#accounts-and-permissions}

|Savollar |Maqsad|
| --- | --- |
|`FindAccountById` |Kanonik hisobdan ID bitta hisobni toping. |
|`FindAccountByAlias` |Hisobga alias sifatida hisobni hal qiling. |
|`FindAccounts` |Ro'yxatga olingan hisobvaraqlarni ro'yxatdan o'tkazing. |
|`FindAccountIds` |Ro'yxatga olingan hisob raqamlari IDs. |
|`FindAccountsWithAsset` |Ma'lum bir aktiv tavsifini o'z ichiga olgan hisobvaraqlarni ro'yxatga oling. |
|`FindAliasesByAccountId` |Hisobga bog'liq bo'lgan aliaslarni ro'yxatdan o'tkazing. |
|`FindAccountRecoveryPolicyByAlias` |O'z aliasi uchun tiklash siyosatini toping.|
|`FindAccountRecoveryRequestByAlias` |Ilmiy nom uchun tiklash talabini toping. |
|`FindRoles` |Rolilarni ro'yxatga oling. |
|`FindRoleIds` |roli IDs. |
|`FindRolesByAccountId` |Hisobvaraqqa berilgan vazifalarni ro'yxatdan o'tkazish. |
|`FindPermissionsByAccountId` |Hisobga berilgan ruxsatnomalarni ro'yxatdan o'tkazing. |

## Domenlar va tengdoshlar {#domains-and-peers}

|Savollar |Maqsad|
| --- | --- |
|`FindDomainById` |`DomainId` bilan bitta domenni toping. |
|`FindDomains` |Ro'yxatdan o'tgan domenlar ro'yxati. |
|`FindDomainsByAccountId` |Hisobga ega bo'lgan domenlarni ro'yxatdan o'tkazish. |
|`FindDomainEndorsements` |Domenlarni tasdiqlash yozuvlarini ro'yxatga oling. |
|`FindDomainEndorsementPolicy` |Domenlarni tasdiqlash siyosatini qaytaring. |
|`FindDomainCommittee` |Domen qo'mitasini qaytaring. |
|`FindPeers` |Kitobda ma'lum bo'lgan ishonchli tengdoshlarni ro'yxatga oling. |

## NFTs va RWAs {#assets-nfts-and-rwas}

|Savollar |Maqsad|
| --- | --- |
|`FindAssets` |Aktivlar saldolarini ro'yxatga oling. |
|`FindAssetsDefinitions` |Assetning ta'riflarini ro'yxatdan o'tkazish. |
|`FindAssetsByAccountId` |Hisobotda saqlangan aktivlarni ro'yxatdan o'tkazish. |
|`FindAssetById` |`AssetId` bilan bir aktiv balansini toping. |
|`FindAssetDefinitionById` |ID bilan bitta aktivni aniqlash. |
|`FindNfts` |Ro'yxat NFTs. |
|`FindNftsByAccountId` |NFTs hisob raqamiga egalik qiladigan ro'yxat. |
|`FindRwas` |Ro'yxatga olingan real-dunyo aktivlari. |

## Hisobvaraq va tasdiqlovchi hujjatlar {#escrow-and-proof-records}

Eskrov so'rovlari [native asset escrow ISIs](/uz/blockchain/escrow.md) tomonidan yaratilgan yozuvlarni, shu jumladan bozordagi eskrovlar, umumiy aktiv qulflarini va anonim eskrov yozuvlarini tekshiradi.

|Savollar |Maqsad|
| --- | --- |
|`FindAssetEscrows` |Asset escrow rekordlarini ro'yxatdan o'tkazing. |
|`FindAssetEscrowById` |ID gacha bitta aktivni depozitda toping. |
|`FindAssetEscrowsBySeller` |Sotuvchi tomonidan saqlanadigan aktivlarni ro'yxatdan o'tkazish. |
|`FindAssetEscrowsByBuyer` |Xaridor tomonidan saqlanadigan aktivlarni ro'yxatdan o'tkazish. |
|`FindAssetEscrowsByStatus` |Moddiy aktivlarni status bo'yicha ro'yxatdan o'tkazing. |
|`FindAnonymousAssetEscrows` |Nomukammal aktivlar hisobini ro'yxatdan o'tkazing. |
|`FindAnonymousAssetEscrowById` |ID orqali bitta nomsiz aktivni depozitga olish. |
|`FindAnonymousAssetEscrowsBySeller` |Sotuvchi bo'yicha anonim depozitlarni ro'yxatdan o'tkazing. |
|`FindAnonymousAssetEscrowsByBuyer` |Sotuvchi bo'yicha anonim depozitlarni ro'yxatdan o'tkazing. |
|`FindAnonymousAssetEscrowsByStatus` |Anonim eskorlarni maqomiga koʻra roʻyxatdan oʻtkazing. |
|`FindProofRecordById` |ID orqali bitta dalilni toping. |
|`FindProofRecords` |Ishonchli hujjatlarni ro'yxatga oling. |
|`FindProofRecordsByBackend` |Proof backend uchun dalillarni ro'yxatga oling. |
|`FindProofRecordsByStatus` |Sertifikatlarni status boʻyicha roʻyxatga oling. |

## Nexus, Ma'lumotlar mavjudligi va paketlar {#nexus-data-availability-and-packages}

|Savollar |Maqsad|
| --- | --- |
|`FindRepoAgreements` |Zilzilab saqlangan depozit shartnomalari ro'yxatini ko'rsatish. |
|`FindTwitterBindingByHash` |Twitter bilan bog'lanishni hash orqali hal qiling. |
|`FindDaPinIntentByTicket` |Chipta orqali ma'lumotlar uchun pin niyatini toping. |
|`FindDaPinIntentByManifest` |Nishoncha ko'rsatgich orqali pin niyatini toping. |
|`FindDaPinIntentByAlias` |O'z nomi bilan pin niyatini toping.|
|`FindDaPinIntentByLaneEpochSequence` |Yo'nalish, davr va ketma-ketligi bo'yicha pin niyatini toping. |
|`FindLaneRelayEnvelopeByRef` |Verifikatsiya qilingan yo'nalish relayini toping. |
|`FindSorafsProviderOwner` |SoraFS provayderining egasini hal qilish. |
|`FindDataspaceNameOwnerById` |Ma'lumotlar maydonining nomi egasini hal qiling. |
|`FindMusubiExactPackageV1` |To'g'ri to'plamni va uning hozirgi qayta ko'rib chiqilishini o'qing. |
|`FindMusubiExactReleaseV1` |To'g'ri bo'lgan bir fotosuratni o'qing. |
|`FindMusubiProviderBundleAttestationV1` |Bir provayderning arxivlar to'plamini o'qing. |
|`FindMusubiResolverIndexV1` |Yakuniy hal qiluvchining indeksini koʻrsating. |
|`FindMusubiVersionsV1` |Bir paket uchun so'nggi versiyalar sahifasi. |
|`FindMusubiMaintainersV1` |Sahifa xodimlari va kutib turgan takliflarni qabul qildi. |
|`FindMusubiArchiveLocationsV1` |Bir arxiv uchun SoraFS joylarni yakunlagan sahifa. |
|`FindMusubiArchiveRetentionV1` |Sahifalar arxivni saqlash yozuvlari. |
|`FindMusubiAliasV1` |Global aliasning hozirgi maqsadini va qayta ko'rib chiqishni o'qing. |
|`FindMusubiAliasHistoryV1` |Global aliasning o'zgarmaydigan retarget tarixini ko'rsating. |
|`FindMusubiOrderedPrefixV1` |Sahifa paketlari bitta tartibdagi tarkibiy prefiks ostida. |

## Ishtirokchilar, shartnomalar, bitimlar va bloklar {#triggers-contracts-transactions-and-blocks}

|Savollar |Maqsad|
| --- | --- |
|`FindActiveTriggerIds` |Aktiv triggerni IDs ro'yxatga oling. |
|`FindTriggers` |Ishtirokchilarni ro'yxatga oling. |
|`FindTriggerById` |ID bilan bitta qo'zg'atuvchini toping. |
|`FindContractManifestByCodeHash` |Smart-kontraktni kod hash bilan toping. |
|`FindTransactions` |Bajarilgan operatsiyalar ro'yxati. |
|`FindBlocks` |Ro'yxat bloklari. |
|`FindBlockHeaders` |Blokning boshliqlarini ro'yxatga oling. |

## Filtrlash va sahifalashtirish {#filtering-and-pagination}

Iterable so'rovlar predikat va selektorni qo'llab-quvvatlashi mumkin. SDK dan so'rovga moslashtirilgan filtrlardan foydalaning, shunda filter kirish so'rov chiqish turi bilan mos keladi. Katta natija to'plamlari uchun har bir satrni bir vaqtning o'zida olishning o'rniga kursor va limit kabi so'rov parametrlaridan foydalaning.
