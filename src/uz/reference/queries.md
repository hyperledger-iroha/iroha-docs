---
translation_locale: uz
translation_source: /reference/queries.md
translation_source_hash: 22e8a75acd72d066e3516ba46a0afe075d2d02790154458aec00a5d8bb861838
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Savollar {#queries}

Iroha so'rovlar kitob holatini mutatsiya qilmasdan o'qiydi.
ikkita keng so'rov shaklini aniqlaydi:

- **alohida savollar**, bir ob'ekt yoki bitta qiymatni qaytaradigan
- **qayta tiklanadigan soʻrovlar**, bir oqim yoki to'plamni qaytarib, birlashtirilishi mumkin bo'lgan
  so'rov turi mavjud bo'lgan filtrlash, sinflash, proyeksiya va sahifalashtirish bilan
  uni qo'llab-quvvatlaydi

Foydalanish SDK o'rnatilgan qurilguvchilar yoki CLI so'rovlar zarbalarini yaratish o ' rniga
Quyidagi nomlar hozirgi so'rov turlari
`iroha_data_model::query`.

## Ish vaqti va konfiguratsiya {#runtime-and-configuration}

| Savol | Maqsad |
| --- | --- |
| `FindAbiVersion` | Ijrochiga qaytish ABI versiyasi. |
| `FindExecutorDataModel` | Amalga oshiruvchi ma'lumot modelining tavsifini qaytaring. |
| `FindParameters` | Xatcho'pdagi ijrochi konfiguratsiya parametrlarini qaytarish. |

## Hisobvaraqlar va ruxsatnomalar {#accounts-and-permissions}

| Savol | Maqsad |
| --- | --- |
| `FindAccountById` | Kanonik hikoya boʻyicha bitta hisobni toping ID. |
| `FindAccountByAlias` | Hisobga alias bilan hisobni hal qiling. |
| `FindAccounts` | Ro'yxatdan o'tgan hisobvaraqlarni ro'yxatga oling. |
| `FindAccountIds` | Ro'yxatga olingan hisobvaraq IDs. |
| `FindAccountsWithAsset` | Ma'lum bir aktivni belgilaydigan hisobvaraqlarni ro'yxatga oling. |
| `FindAliasesByAccountId` | Hisobga bog'liq bo'lgan aliaslarni ro'yxatdan o'tkazing. |
| `FindAccountRecoveryPolicyByAlias` | Ilmiy nom uchun tiklash siyosatini toping. |
| `FindAccountRecoveryRequestByAlias` | O'zgacha nom uchun tiklash talabini toping. |
| `FindRoles` | Rolilarni ro'yxatga oling. |
| `FindRoleIds` | Rola roli IDs. |
| `FindRolesByAccountId` | Hisobga berilgan vazifalarni ro'yxatdan o'tkazish. |
| `FindPermissionsByAccountId` | Hisobga berilgan ruxsatnomalarni ro'yxatdan o'tkazing. |

## Domenlar va tengdoshlar {#domains-and-peers}

| Savol | Maqsad |
| --- | --- |
| `FindDomainById` | Bir domenni qidirish `DomainId`. |
| `FindDomains` | Ro'yxatdan o'tgan domenlarni ro'yxatga oling. |
| `FindDomainsByAccountId` | Hisobga ega bo'lgan domenlarni ro'yxatdan o'tkazing. |
| `FindDomainEndorsements` | Domenlarni tasdiqlash to'plamlarini ro'yxatga oling. |
| `FindDomainEndorsementPolicy` | Domenlarni tasdiqlash siyosatini qaytaring. |
| `FindDomainCommittee` | Domen qo'mitasini qaytaring. |
| `FindPeers` | Bu kitobda ma'lum bo'lgan ishonchli tengdoshlarni ro'yxatga oling. |

## Moddiy aktivlar NFTs, va RWAs {#assets-nfts-and-rwas}

| Savol | Maqsad |
| --- | --- |
| `FindAssets` | Aktivlarning balansini ro'yxatdan o'tkazish. |
| `FindAssetsDefinitions` | Aktivlarning tavsiflarini ro'yxatdan o'tkazish. |
| `FindAssetsByAccountId` | Hisobvaraq tomonidan saqlanadigan aktivlarni ro'yxatdan o'tkazish. |
| `FindAssetById` | Bir aktiv balansini topish `AssetId`. |
| `FindAssetDefinitionById` | Bir aktivni aniqlash ID. |
| `FindNfts` | Ro'yxat NFTs. |
| `FindNftsByAccountId` | Ro'yxat NFTs hisob raqamiga egalik qiladi. |
| `FindRwas` | Ro'yxatga olingan real-dunyo aktivlari. |

## Hisobvaraq va dalillar {#escrow-and-proof-records}

Escrow soʻrovlari tomonidan yaratilgan yozuvlarni tekshirish
[nativ aktivlar depozitasi ISIs](/uz/blockchain/escrow.md), bozor joylari ham
depozitlar, umumiy aktivlarni qulflash va anonim depozitlar.

| Savol | Maqsad |
| --- | --- |
| `FindAssetEscrows` | Asset escrow yozuvlarini ro'yxatga oling. |
| `FindAssetEscrowById` | Bir aktivni depozitda toping ID. |
| `FindAssetEscrowsBySeller` | Sotuvchi bo'yicha aktivlarni eskorda ko'rsatish. |
| `FindAssetEscrowsByBuyer` | Xaridor tomonidan saqlanadigan aktivlarni ro'yxatdan o'tkazish. |
| `FindAssetEscrowsByStatus` | Asyoviy aktivlarni holatga qarab ro'yxatdan o'tkazing. |
| `FindAnonymousAssetEscrows` | Nomukammal aktivlar depozitasi to'plamini ro'yxatdan o'tkazing. |
| `FindAnonymousAssetEscrowById` | Bir nomsiz aktivni depozitga olish ID. |
| `FindAnonymousAssetEscrowsBySeller` | Sotuvchi bo'yicha anonim depozitlarni ro'yxatga oling. |
| `FindAnonymousAssetEscrowsByBuyer` | Xaridorlar bo'yicha anonim depozitlarni ro'yxatga oling. |
| `FindAnonymousAssetEscrowsByStatus` | Anonim depozitlarni holatga qarab ro'yxatdan o'tkazing. |
| `FindProofRecordById` | 1 ta dalilni toping ID. |
| `FindProofRecords` | Iltimos, hujjatlarni ro'yxatga oling. |
| `FindProofRecordsByBackend` | Dasturadan keyingi qism uchun dalillarni ro'yxatga oling. |
| `FindProofRecordsByStatus` | Hujjatlarni status bo'yicha ro'yxatga oling. |

## Nexus, Ma'lumotlar mavjudligi va paketlar {#nexus-data-availability-and-packages}

| Savol | Maqsad |
| --- | --- |
| `FindRepoAgreements` | Zilzilab saqlangan depozit shartnomalari ro'yxatini ko'rsatish. |
| `FindTwitterBindingByHash` | Twitter bog'lamasini hash orqali hal qiling. |
| `FindDaPinIntentByTicket` | Ma'lumotlar mavjudligi uchun chipta orqali pin niyatini toping. |
| `FindDaPinIntentByManifest` | Nishoncha ko'rsatkich orqali pin niyatini toping. |
| `FindDaPinIntentByAlias` | O'z nomi bilan pin niyatini toping. |
| `FindDaPinIntentByLaneEpochSequence` | Yo'nalish, davr va ketma-ketligi bo'yicha pin niyatini toping. |
| `FindLaneRelayEnvelopeByRef` | Yo'nalish relayini tasdiqlovchi zarba toping. |
| `FindSorafsProviderOwner` | O ' zbekiston Respublikasining SoraFS provayder. |
| `FindDataspaceNameOwnerById` | Ma'lumotlar maydonining nom egasini hal qiling. |
| `FindMusubiReleaseByRef` | Birini toping Musubi ko'rsatma asosida ozod qilish. |
| `FindMusubiPackageVersions` | a uchun ro'yxat versiyasi Musubi paket. |
| `FindMusubiPackageReleases` | A uchun ro'yxatdan o'tish Musubi paket. |
| `FindMusubiShortAliasByName` | A-ni hal qilish Musubi Qisqa aliaslar. |

## Ishtirokchilar, shartnomalar, bitimlar va bloklar {#triggers-contracts-transactions-and-blocks}

| Savol | Maqsad |
| --- | --- |
| `FindActiveTriggerIds` | Aktiv qoʻzgʻatuvchini roʻyxatga oling IDs. |
| `FindTriggers` | Ishtirokchilarni ro'yxatga oling. |
| `FindTriggerById` | Bir qoʻzgʻatishni toping ID. |
| `FindContractManifestByCodeHash` | Smart-kontraktni kod hash orqali toping. |
| `FindTransactions` | O'zlashtirilgan bitimlar ro'yxati. |
| `FindBlocks` | Ro'yxat bloklari. |
| `FindBlockHeaders` | Blok boshliqlarini ro'yxatga oling. |

## Filtrlash va sahifalashtirish {#filtering-and-pagination}

Iterable so'rovlar predikat va selektorni qo'llab-quvvatlashni oshkor qilishi mumkin.
bosilgan filtrlar SDK sozlash vositasi so'rov chiqish turiga mos keladi.
Katta natijalar to'plamlari uchun kursor va cheklov kabi so'rov parametrlaridan foydalaning
har bir qatorni bir vaqtning o'zida olib kelish.
