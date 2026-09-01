---
translation_locale: uz
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Ruxsat tokenlari {#permission-tokens}

Ushbu sahifa joriy Iroha ijrochi ma'lumotlar modeli tomonidan ochilgan standart ruxsatnoma-token turlarini ro'yxatlaydi. Rollar va ruxsatnomalarga oid tushuntirish qo'llanmasi uchun [Ruxsatlar](/uz/blockchain/permissions.md) ga qarang.

Ruxsat tekshiruvlari faol dasturiy ta'minotni bajarish muhitini tasdiqlovchi tomonidan amalga oshiriladi. Quyidagi token turi nomlari standart siyosat yuzasini tasvirlaydi, ammo tarmoq bajaruvchini yangilash orqali dasturiy ta'minotni bajarish muhitini tasdiqlashni moslashtirishi mumkin.

## Standart tokenlar {#default-tokens}

|Ruxsatnoma tokeni|Kategoriya|Operatsiya|
| --- | --- | --- |
| `CanManagePeers` |tarmoq tengdosh|Tarmoq tengdoshlarini ro‘yxatdan o‘tkazish, ro‘yxatdan chiqarish yoki boshqa tarzda boshqarish.|
| `CanManageLaneRelayEmergency` |tarmoq tengdosh|Favqulodda ehtimoliy yo‘l signalini boshqarishni boshqarish.|
| `CanRegisterDomain` |Domen|Domenni ro'yxatdan o'tkazing.|
| `CanUnregisterDomain` |Domen|Domenni ro‘yxatdan o‘chirish.|
| `CanModifyDomainMetadata` |Domen|Domen metama'lumotlarini o'zgartirish.|
| `CanRegisterAccount` |Hisob|Hisob qaydnomasi oching.|
| `CanUnregisterAccount` |Hisob|Hisobni ro‘yxatdan o‘chirish.|
| `CanModifyAccountMetadata` |Hisob|Hisob ma'lumotlarini o'zgartirish.|
| `CanUnregisterAssetDefinition` |Aktiv ta'rifi|Mol-mulk ta'rifini ro'yxatdan chiqarish.|
| `CanModifyAssetDefinitionMetadata` |Aktiv ta'rifi|Aktiv-definitsiya metama'lumotlarini o'zgartiring.|
| `CanMintAssetWithDefinition` |Aktiv|ma'lum bir ta'rif uchun aktivlarni chiqarish.|
| `CanBurnAssetWithDefinition` |Aktiv|ma'lum bir ta'rif uchun aktivlarni yo'q qilish.|
| `CanTransferAssetWithDefinition` |Aktiv|Muayyan ta'rif uchun aktivlarni o'tkazish.|
| `CanMintAsset` |Aktiv|aniq bir aktiv balansini chiqarish.|
| `CanBurnAsset` |Aktiv|aniq bir aktiv balansini yo'q qilish.|
| `CanTransferAsset` |Aktiv|Ma'lum bir aktiv balansini o'tkazing.|
| `CanRegisterNft` | NFT |NFT uchun ro'yxatdan o'ting.|
| `CanUnregisterNft` | NFT |NFT ni ro‘yxatdan o‘tkazishni bekor qilish.|
| `CanTransferNft` | NFT |NFT ni o'tkazing.|
| `CanModifyNftMetadata` | NFT |NFT metama'lumotlarini o'zgartiring.|
| `CanSetParameters` |Parametrlar|Zanjir ustidagi konfiguratsiya parametrlarini sozlash.|
| `CanManageRoles` |Rollar|Rolni ro‘yxatdan o‘tkazish, ro‘yxatdan chiqarish, berish yoki bekor qilish.|
| `CanRegisterTrigger` |Tutrqich|Triggerni ro'yxatdan o'tkazing.|
| `CanExecuteTrigger` |Tutrqich|Trigerni ishga tushiring.|
| `CanUnregisterTrigger` |Tutrqich|Triggerni ro‘yxatdan o‘chirish.|
| `CanModifyTrigger` |Tutrqich|Trigger konfiguratsiyasini o'zgartiring.|
| `CanModifyTriggerMetadata` |Tutrqich|Trigger metama'lumotlarini o'zgartiring.|
| `CanUpgradeExecutor` |Ijrochi|Dasturiy ta'minot bajarish muhiti ijrochisini yangilang.|
| `CanRegisterSmartContractCode` |Aqlli shartnoma|Aqlli shartnoma kodini ro‘yxatdan o‘tkazing.|
| `CanUseFeeSponsor` | Nexus |Belgilangan homiy hisobiga Nexus to‘lovlarni qo‘llash.|

## Egalik {#ownership}

Egasiga sezgir ruxsat tokenlari amaldagi maʼlumot modeli tomonidan ishlatiladigan kanonik ob’ekt identifikatorlariga murojaat qilishi kerak. Masalan, hisob ruxsatlari yagona identifikatorga murojaat qiladi protokol-standart domeni bo‘lmagan hisob IDlari, domen ruxsatnomalari `domain.dataspace` domen IDlariga tegishli, va aktiv ruxsatnomalari kanonik aktiv ta’rifiga yoki aktiv IDlariga tegishli.

Agar tranzaksiya ruxsat berish xatosi bilan muvaffaqiyatsiz bo'lsa, ikkala tomonini tekshiring:

- transaktsiyani tasdiqlayotgan hisob kutilgan kanonik hisob hisoblanadi
- ruxsat tokeni yoki rol ko'rsatmada ishlatilgan aniq obyekt ID si uchun berilgan edi
