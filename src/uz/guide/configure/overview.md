---
translation_locale: uz
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Konfiguratsiya va boshqaruv {#configuration-and-management}

Iroha konfiguratsiya ikkita ishonchli qatlamga ega:

- **mahalliy tengdosh va mijoz konfiguratsiyasi**, saqlangan TOML fayllar va o ' qish
  jarayonni ishga tushirish
- **zanjirdagi konfiguratsiya**, o'zgartirilgan
  [`SetParameter`](/uz/blockchain/instructions.md#setparameter)

Nukl identifikatsiyasi, manzillari, logging, saqlash va
Mijoz imzolash kalitlari. Kelishib olinishi kerak bo'lgan qiymatlar uchun zanjirdagi konfiguratsiyadan foydalaning
tarmog'i orqali o'ynaydi va deterministik tarzda qayta ijro etiladi.

Ishlab chiqarish xatti-harakati ushbu konfiguratsiya qatlamlaridan kelib chiqishi kerak.
o'zgaruvchilar mahalliy asboblarga sinov ma'lumotlarini yetkazib berish uchun qulay bo'lishi mumkin, ammo
Ular ishlab chiqarish xususiyatlari darvozalari emas va majburiyatlarni o'zgartirmaydi
konfiguratsiya.

Asosiy konfiguratsiya kirish punktlari quyidagilardir:

- [Ibtido](/uz/guide/configure/genesis.md)
- [Mijozning konfiguratsiyasi](/uz/guide/configure/client-configuration.md)
- [Tarmoqni ishga tushirish uchun kalitlar](/uz/guide/configure/keys-for-network-deployment.md)
- [Yolg'iz metallda ishlaydi](/uz/guide/advanced/running-iroha-on-bare-metal.md)
- [Tengdoshlar konfiguratsiyasi ma'lumotnomasi](/uz/reference/peer-config/index.md)
