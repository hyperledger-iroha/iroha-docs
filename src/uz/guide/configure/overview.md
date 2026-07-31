---
translation_locale: uz
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Konfiguratsiya va boshqaruv {#configuration-and-management}

Iroha konfiguratsiyasi ikkita ishonchli qatlamga ega:

- TOML fayllarida saqlangan va jarayonni ishga tushirish paytida o'qiladigan mahalliy tengdoshlar va mijoz konfiguratsiyasi
- [`SetParameter`](/uz/blockchain/instructions.md#setparameter) orqali amalga oshirilgan operatsiyalar bilan o'zgartirilgan zanjirdagi konfiguratsiya.

Nukl identifikatsiyasi, manzillar, yozuv, saqlash va mijoz imzolash kalitlari uchun mahalliy konfiguratsiyadan foydalaning. Tarmoq tomonidan kelishilgan va deterministik tarzda qayta o'ynash kerak bo'lgan qiymatlar uchun zanjirda konfiguratsiyadan foydalanish.

Ishlab chiqarish xatti-harakati ushbu konfiguratsiya qatlamlaridan kelib chiqishi kerak. Mahalliy asboblarga sinov ma'lumotlarini yetkazib berish uchun muhit o'zgaruvchilari qulay bo'lishi mumkin, ammo ular ishlab chiqarish xususiyatlari darvozalari emas va belgilangan konfiguratsiyani almashtirmaydilar.

Asosiy konfiguratsiya kirish punktlari quyidagilardir:

- [Ibtido](/uz/guide/configure/genesis.md)
- [Mijozning konfiguratsiyasi](/uz/guide/configure/client-configuration.md)
- [Tarmoqni ishga tushirish uchun kalitlar ](/uz/guide/configure/keys-for-network-deployment.md)
- [Yolg'iz metalda ishlaydi](/uz/guide/advanced/running-iroha-on-bare-metal.md)
- [Tengdoshlar konfiguratsiyasi ma'lumotnomasi](/uz/reference/peer-config/index.md)
