---
translation_locale: uz
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ruxsat belgisi {#permission-tokens}

Ushbu sahifada joriy Iroha ijrochi ma'lumotlar modeli tomonidan ko'rsatilgan andoza ruxsatnoma belgisi turlari roli va huquqlarga oid konseptual qo'llanma uchun [Ruxsatlar](/uz/blockchain/permissions.md)-ni ko'ring.

Ruxsatlarni tekshirish faol ishga tushirish vaqtini tasdiqlovchi tomonidan amalga oshiriladi. Quyida keltirilgan token turi nomlari standart siyosat yuzasini tasvirlaydi, ammo tarmoq ijrochini yangilab ishga tushirish orqali ishga tushirish vaqti tasdiqlashni moslashishi mumkin.

## Oldindan koʻrsatilgan tokenlar {#default-tokens}

|Ruxsat belgisi |Kategoriya |Operatsiya |
| --- | --- | --- |
|`CanManagePeers` |Tengdoshlar |Ro'yxatdan o'tish, ro'yxatdan chiqarish yoki tengdoshlarni boshqacha tarzda boshqarish. |
|`CanManageLaneRelayEmergency` |Tengdoshlar |Shoshilinch yo'nalishlarni boshqarish. |
|`CanRegisterDomain` |Domen |Domenni ro'yxatdan o'tkazing. |
|`CanUnregisterDomain` |Domen |Domenni ro'yxatdan chiqarish. |
|`CanModifyDomainMetadata` |Domen |Domen metadatalarini oʻzgartirish. |
|`CanRegisterAccount` |Hisobvaraq|Hisob qayd qiling. |
|`CanUnregisterAccount` |Hisobvaraq|Hisobxonani ro'yxatdan chiqarish. |
|`CanModifyAccountMetadata` |Hisobvaraq|Hisobvaraq metadatalarini oʻzgartirish. |
|`CanUnregisterAssetDefinition` |Assetning aniqlanishi |Asset ta'rifini ro'yxatdan o'tkazing. |
|`CanModifyAssetDefinitionMetadata` |Assetning aniqlanishi |Asset ta'rifining metadatalarini o'zgartirish. |
|`CanMintAssetWithDefinition` |Asset |Ma'lum bir ta'rifga ko'ra mint aktivlari. |
|`CanBurnAssetWithDefinition` |Asset |O'ziga xos ta'rif uchun aktivlarni yoqish. |
|`CanTransferAssetWithDefinition` |Asset |Ma'lum bir ta'rif uchun aktivlarni o'tkazish. |
|`CanMintAsset` |Asset |Muayyan aktivlar balansini ishlab chiqing. |
|`CanBurnAsset` |Asset |Muayyan aktivlar balansini yoqing. |
|`CanTransferAsset` |Asset |Belgilangan aktivlar balansini o'tkazish. |
|`CanRegisterNft` |NFT |NFT nomini ro'yxatdan o'tkazish. |
|`CanUnregisterNft` |NFT |NFT ro'yxatdan o'tish. |
|`CanTransferNft` |NFT |NFT ni o'tkazish. |
|`CanModifyNftMetadata` |NFT |NFT metadatalarini o'zgartirish. |
|`CanSetParameters` |Parametrlar |Zilziladagi konfiguratsiya parametrlarini o'rnating. |
|`CanManageRoles` |Oʻrinlar |Rolilarni ro'yxatdan o'tkazish, ro'yxatga olishni bekor qilish, berish yoki bekor qilish. |
|`CanRegisterTrigger` |Ishtirokchi |O'chirishni qayd qiling. |
|`CanExecuteTrigger` |Ishtirokchi |O'chirishni bajaring. |
|`CanUnregisterTrigger` |Ishtirokchi |O'chirgichni yozib tashlang.|
|`CanModifyTrigger` |Ishtirokchi |Ishtirokchining konfiguratsiyasini oʻzgartirish. |
|`CanModifyTriggerMetadata` |Ishtirokchi |O'chirish metadatalarini o'zgartirish. |
|`CanUpgradeExecutor` |Ijrochi |Ish vaqti ijrochisini yangilash. |
|`CanRegisterSmartContractCode` |Aqlli shartnoma |Aqlli shartnoma kodini ro'yxatga oling. |
|`CanUseFeeSponsor` |Nexus |Nexus to'lovlarini ma'lum sponsor hisob raqamiga to'lash. |

## Mulkdorlik {#ownership}

O ' z egasiga taalluqli ruxsatnoma tokenlari kanonik ob'ektga murojaat qilishi kerak IDs joriy ma'lumotlar modeli tomonidan ishlatiladi. Misol uchun, hisob ruxsatnomalari kanonik domensiz hisobni anglatadi IDs, domen ruxsatnomalari `domain.dataspace` domen IDs, va aktivlarga ruxsatnomalar kanonik aktivni aniqlash yoki aktivga taalluqli IDs.

Agar bitim ruxsat etish xatosi bilan muvaffaqiyatsiz tugsa, ikkala tomonni ham tekshirish:

- Transaksiyani imzolaydigan hisob raqamlari kutilayotgan kanonik hisob raqamlar hisoblanadi
- ko'rsatmada ishlatilgan aniq ob'ekt ID uchun ruxsatnoma belgisi yoki roli berilgan
