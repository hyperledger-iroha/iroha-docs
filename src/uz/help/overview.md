---
translation_locale: uz
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Muammolarni bartaraf etish {#troubleshooting}

Ushbu bo‘lim Iroha bilan ishlashda muammolarga duch kelsangiz yordam berish maqsadida mo‘ljallangan. Agar biror narsa noto‘g‘ri bo‘lsa, iltimos, avvalo [tugmalarni tekshiring](#check-the-keys) qilishingiz kerak. Agar bu yordam bermasa, har bir bosqich uchun nosozliklarni tuzatish ko‘rsatmalarini tekshiring:

- [O‘rnatish muammolari](./installation-issues.md)
- [Sozlama muammolari](./configuration-issues.md)
- [Joylashtirish muammolari](./deployment-issues.md)
- [Integratsiya muammolari](./integration-issues.md)

Agar siz duch kelayotgan muammo bu yerda tavsiflanmagan bo'lsa, biz bilan [Telegram](https://t.me/hyperledgeriroha) orqali bog'laning.

## Kalitlarni tekshiring {#check-the-keys}

Ko'pgina muammolar mos kelmaydigan kalitlar natijasida yuzaga keladi. Shu sababli biz quyidagi qoidalarga amal qilishni tavsiya qilamiz: Agar biror narsa noto'g'ri ketsa, avvalo kalitlarni tekshiring.

Mana tezkor tushuntirish: Tarmoq tengdoshlari kalitlari mos kelmaganda yuzaga keladigan xato xabarlarini ajratib ko‘rsatish mumkin emas ishonchli tarmoq hamkorlari massividagi kalitlarni mos keltiring, chunki bu tarmoq hamkorlarining ochiq kalitini oshkor qilardi. Shunday qilib, agar sizda atrof muhit o'zgaruvchilari orqali belgilangan kalitlarga ega Helm chartlari yoki Kubernetes joylashtirishlari bo'lsa, sozlanganini solishtiring [`public_key`](/uz/reference/peer-config/params.md#param-public-key), [`private_key`](/uz/reference/peer-config/params.md#param-private-key), va [`trusted_peers`](/uz/reference/peer-config/params.md#param-trusted-peers) yuqori darajadagi nosozliklarni tekshirishdan oldin qiymatlarni.

Agar shubha bo‘lsa, [yangi kalit juftligini yarating](/uz/guide/security/generating-cryptographic-keys.md).
