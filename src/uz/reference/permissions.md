---
translation_locale: uz
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ruxsat toʻgʻriligi {#permission-tokens}

Ushbu sahifadagi andoza ruxsatnoma belgisi turlarini koʻrsatish
Iroha ijrochi ma'lumotlar modeli. O'rinlar va ruxsatlarga doir konseptual qo'llanma uchun,
koʻrish [Ruxsatnomalar](/uz/blockchain/permissions.md).

Ruxsatlarni tekshirish faol ishga tushirish vaqtini tasdiqlovchi tomonidan amalga oshiriladi.
Quyidagi nomlar standart siyosat yuzasini tasvirlaydi, lekin tarmoq o'ziga xos
ijrochini yangilash orqali ish vaqti tasdiqlanishi.

## Dastlabki belgiler {#default-tokens}

| Ruxsat belgisi | Kategoriya | Operatsiya |
| --- | --- | --- |
| `CanManagePeers` | Tengdoshlar | Ro'yxatdan o'tish, ro'yxatdan chiqarish yoki tengdoshlarni boshqacha tarzda boshqarish. |
| `CanManageLaneRelayEmergency` | Tengdoshlar | Shoshilinch yo'nalishdagi relay nazoratlarini boshqaring. |
| `CanRegisterDomain` | Domen | Domenni ro'yxatdan o'tkazing. |
| `CanUnregisterDomain` | Domen | Domenni ro'yxatdan chiqarish. |
| `CanModifyDomainMetadata` | Domen | Domen metadatalarini o'zgartirish. |
| `CanRegisterAccount` | Hisobvaraq | Hisob qayd qiling. |
| `CanUnregisterAccount` | Hisobvaraq | Hisobotni yozib tashlang. |
| `CanModifyAccountMetadata` | Hisobvaraq | Hisobot metadatalarini o'zgartirish. |
| `CanUnregisterAssetDefinition` | Assetning tavsiflanishi | Asyoviy aktivni ro'yxatdan chiqarish. |
| `CanModifyAssetDefinitionMetadata` | Assetning tavsiflanishi | Aktivlar ta'rifining metadatalarini o'zgartirish. |
| `CanMintAssetWithDefinition` | Assetlar | Ma'lum bir ta'rif uchun mint aktivlari. |
| `CanBurnAssetWithDefinition` | Assetlar | O'ziga xos ta'rif uchun aktivlarni yoqish. |
| `CanTransferAssetWithDefinition` | Assetlar | O'ziga xos ta'rif uchun aktivlarni o'tkazish. |
| `CanMintAsset` | Assetlar | Xususan bir aktiv balansini ishlab chiqing. |
| `CanBurnAsset` | Assetlar | Muayyan aktivlar balansini yoqing. |
| `CanTransferAsset` | Assetlar | Ma'lum bir aktiv balansini o'tkazing. |
| `CanRegisterNft` | NFT | Ro ' yxatga olish NFT. |
| `CanUnregisterNft` | NFT | Ro'yxatdan o ' tkazish NFT. |
| `CanTransferNft` | NFT | O ' tkazish NFT. |
| `CanModifyNftMetadata` | NFT | Oʻzgartirish NFT Metadatalar. |
| `CanSetParameters` | Parametrlar | Zilziladagi konfiguratsiya parametrlarini o'rnating. |
| `CanManageRoles` | Oʻrinlar | Rolilarni ro'yxatga olish, ro'yxatdan chiqarish, berish yoki bekor qilish. |
| `CanRegisterTrigger` | Trigger | O'chirishni qayd qiling. |
| `CanExecuteTrigger` | Trigger | O'chirishni o'tkazing. |
| `CanUnregisterTrigger` | Trigger | O'chirib qo'yishni bekor qiling. |
| `CanModifyTrigger` | Trigger | O'chirgich konfiguratsiyasini o'zgartirish. |
| `CanModifyTriggerMetadata` | Trigger | O'chirgich metadatalarini o'zgartirish. |
| `CanUpgradeExecutor` | Ijrochi | Ish vaqti ijrochisini yangilash. |
| `CanRegisterSmartContractCode` | Aqlli shartnoma | Aqlli shartnoma kodini ro'yxatga oling. |
| `CanUseFeeSponsor` | Nexus | Tagilar Nexus belgilangan sponsor hisob raqamiga to'lovlar. |

## Mulkdorlik {#ownership}

Mulkchiga mos ruxsatnoma belgisi kanonik ob'ektga murojaat qilishi kerak IDs ishlatiladigan
joriy ma'lumotlar modeli. Masalan, hisob ruxsatlari kanonik
domensiz hisob IDs, domen ruxsatnomalari `domain.dataspace` domen
IDs, va aktivlarga ruxsatnomalar kanonik aktivlarni aniqlash yoki aktivni anglatadi IDs.

Agar bitim ruxsat etish xatosi bilan muvaffaqiyatsiz tugasa, ikkala tomonni ham tekshirish:

- Transaksiya imzolanadigan hisob raqamlari kutilayotgan kanonik hisob hisoblanadi
- to'g'ri ob'ekt uchun ruxsatnoma belgisi yoki roli berilgan ID "Mashnat"da ishlatilgan
  ko'rsatma
