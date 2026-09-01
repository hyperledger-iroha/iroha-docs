---
translation_locale: uz
translation_source: /guide/configure/overview.md
translation_source_hash: 24eae3295459781d774369521241f1c2da5b24fe51eb8a2b086911b923395846
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Sozlash va Boshqarish {#configuration-and-management}

Iroha konfiguratsiyasida ikki vakolatli qatlam mavjud:

- mahalliy tarmoq hamkori va mijoz konfiguratsiyasi, TOML fayllarda saqlanadi va jarayon boshlanishida o‘qiladi
- zanjir ustidagi sozlamalar, tranzaksiyalar orqali o'zgartiriladi [`SetParameter`](/uz/blockchain/instructions.md#setparameter)

Node identifikatori, manzillar, loglash, saqlash va mijoz imzolash kalitlari uchun mahalliy konfiguratsiyadan foydalaning. Tarmoq tomonidan kelishilgan bo‘lishi va deterministik tarzda qayta ishlatilishi kerak bo‘lgan qiymatlar uchun zanjir usti konfiguratsiyasidan foydalaning.

Ishlab chiqarish xatti-harakatlari ushbu konfiguratsiya qatlamlaridan kelib chiqishi kerak. Muhit o‘zgaruvchilari mahalliy vositalarga test kirishlarini taqdim etishda qulay bo‘lishi mumkin, lekin ular ishlab chiqarish xususiyatlari uchun darvoza emas va yakuniy konfiguratsiyani almashtirmaydi.

Asosiy konfiguratsiya kirish nuqtalari quyidagilardir:

- [blokcheyn genesis](/uz/guide/configure/genesis.md)
- [Mijoz konfiguratsiyasi](/uz/guide/configure/client-configuration.md)
- [Tarmoqni joylashtirish uchun kalitlar](/uz/guide/configure/keys-for-network-deployment.md)
- [Yaltiroq temirda ishlash](/uz/guide/advanced/running-iroha-on-bare-metal.md)
- [tarmoq sherik konfiguratsiyasi havolasi](/uz/reference/peer-config/index.md)
