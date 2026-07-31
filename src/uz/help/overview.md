---
translation_locale: uz
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Muammolarni hal qilish {#troubleshooting}

Ushbu bo'lim Iroha bilan ishlayotganingizda muammolarga duch kelsangiz yordam berish uchun mo'ljallangan. Agar biror narsa noto'g'ri kechsa, iltimos, avval [ kalitlarini](#check-the-keys) tekshiring. Agar bu yordam bermasa, har bir bosqichning muammoni hal qilish ko'rsatmalariga qarang:

- [O'rnatish muammolari](./installation-issues.md)
- [Konfiguratsiya muammolari](./configuration-issues.md)
- [Ishlab chiqarish masalalari](./deployment-issues.md)
- [Integratsiya masalalari](./integration-issues.md)

Agar siz boshdan kechirayotgan muammo bu erda tasvirlanmagan bo'lsa, [Telegram ](https://t.me/hyperledgeriroha) orqali biz bilan bog'laning.

## Kalitalarni tekshiring . {#check-the-keys}

Aksariyat muammolar tengsiz kalitlar natijasida yuzaga keladi. Shuning uchun biz ushbu qoidaga rioya qilishni tavsiya etamiz: agar biron narsa noto'g'ri bo'lsa, avval kalitlarni tekshiring.

Bu erda tez tushuntirish: tengdoshlarning kalitlari ishonchli tengdoshlar qatoridagi kalitlarga mos kelganda paydo bo'ladigan xato xabarlarini farqlash mumkin emas, chunki bu tengdoshlarining ommaviy kalitini oshkor etadi. Shunday qilib, agar sizda muhit o'zgaruvchilari orqali aniqlangan kalitlarga ega bo'lgan Helm grafiklari yoki Kubernetes dasturlari mavjud bo'lsa, yuqori darajadagi xatolarni tekshirishdan oldin konfiguratsiya qilingan [`public_key`](/uz/reference/peer-config/params.md#param-public-key), [`private_key`](/uz/reference/peer-config/params.md#param-private-key) va [`trusted_peers`](/uz/reference/peer-config/params.md#param-trusted-peers) qiymatlarini taqqoslang.

Agar shubha bo'lsa, [ yangi kalitlar juftligini ](/uz/guide/security/generating-cryptographic-keys.md) ishlab chiqaradi.
